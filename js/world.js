// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, LevelSelection, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, first, kerror, klog, last, now, post, randInt, ref, ref1, world,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), post = ref.post, randInt = ref.randInt, colors = ref.colors, absMin = ref.absMin, first = ref.first, clamp = ref.clamp, last = ref.last, kerror = ref.kerror, klog = ref.klog, _ = ref._;

Pos = require('./lib/pos');

Size = require('./lib/size');

Cell = require('./cell');

Gate = require('./gate');

Camera = require('./camera');

Light = require('./light');

Levels = require('./levels');

Player = require('./player');

Sound = require('./sound');

Cage = require('./cage');

Timer = require('./timer');

Actor = require('./actor');

Item = require('./item');

Action = require('./action');

Menu = require('./menu');

ScreenText = require('./screentext');

TmpObject = require('./tmpobject');

Pushable = require('./pushable');

Material = require('./material');

Scheme = require('./scheme');

LevelSelection = require('./levelselection');

Quaternion = require('./lib/quaternion');

Vector = require('./lib/vector');

Pos = require('./lib/pos');

now = require('perf_hooks').performance.now;

ref1 = require('./items'), Wall = ref1.Wall, Wire = ref1.Wire, Gear = ref1.Gear, Stone = ref1.Stone, Switch = ref1.Switch, MotorGear = ref1.MotorGear, MotorCylinder = ref1.MotorCylinder, Face = ref1.Face;

world = null;

World = (function(superClass) {
    extend(World, superClass);

    World.levels = null;

    World.normals = [new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(-1, 0, 0), new Vector(0, -1, 0), new Vector(0, 0, -1)];

    function World(view1, preview) {
        this.view = view1;
        this.preview = preview;
        this.showLevels = bind(this.showLevels, this);
        this.showHelp = bind(this.showHelp, this);
        this.exitLevel = bind(this.exitLevel, this);
        this.restart = bind(this.restart, this);
        global.world = this;
        this.speed = 6;
        this.rasterSize = 0.05;
        World.__super__.constructor.apply(this, arguments);
        this.noRotations = false;
        this.screenSize = new Size(this.view.clientWidth, this.view.clientHeight);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: false,
            autoClear: false,
            sortObjects: true
        });
        this.renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.scene = new THREE.Scene();
        this.sun = new THREE.PointLight(0xffffff);
        if (this.player != null) {
            this.sun.position.copy(this.player.camera.getPosition());
        }
        this.scene.add(this.sun);
        this.ambient = new THREE.AmbientLight(0x111111);
        this.scene.add(this.ambient);
        this.objects = [];
        this.lights = [];
        this.cells = [];
        this.size = new Pos();
        this.depth = -Number.MAX_SAFE_INTEGER;
        this.timer = new Timer(this);
        this.view.appendChild(this.renderer.domElement);
    }

    World.init = function(view) {
        if (world != null) {
            return;
        }
        this.initGlobal();
        world = new World(view);
        world.name = 'world';
        world.create(first(this.levels.list));
        return world;
    };

    World.initGlobal = function() {
        if (this.levels != null) {
            return;
        }
        ScreenText.init();
        Sound.init();
        global.rot0 = Quaternion.rot_0;
        global.rotx90 = Quaternion.rot_90_X;
        global.roty90 = Quaternion.rot_90_Y;
        global.rotz90 = Quaternion.rot_90_Z;
        global.rotx180 = Quaternion.rot_180_X;
        global.roty180 = Quaternion.rot_180_Y;
        global.rotz180 = Quaternion.rot_180_Z;
        global.rotx270 = Quaternion.rot_270_X;
        global.roty270 = Quaternion.rot_270_Y;
        global.rotz270 = Quaternion.rot_270_Z;
        global.XupY = Quaternion.XupY;
        global.XupZ = Quaternion.XupZ;
        global.XdownY = Quaternion.XdownY;
        global.XdownZ = Quaternion.XdownZ;
        global.YupX = Quaternion.YupX;
        global.YupZ = Quaternion.YupZ;
        global.YdownX = Quaternion.YdownX;
        global.YdownZ = Quaternion.YdownZ;
        global.ZupX = Quaternion.ZupX;
        global.ZupY = Quaternion.ZupY;
        global.ZdownX = Quaternion.ZdownX;
        global.ZdownY = Quaternion.ZdownY;
        global.minusXupY = Quaternion.minusXupY;
        global.minusXupZ = Quaternion.minusXupZ;
        global.minusXdownY = Quaternion.minusXdownY;
        global.minusXdownZ = Quaternion.minusXdownZ;
        global.minusYupX = Quaternion.minusYupX;
        global.minusYupZ = Quaternion.minusYupZ;
        global.minusYdownX = Quaternion.minusYdownX;
        global.minusYdownZ = Quaternion.minusYdownZ;
        global.minusZupX = Quaternion.minusZupX;
        global.minusZupY = Quaternion.minusZupY;
        global.minusZdownX = Quaternion.minusZdownX;
        global.minusZdownY = Quaternion.minusZdownY;
        return this.levels = new Levels;
    };

    World.prototype.del = function() {
        return this.renderer.domElement.remove();
    };

    World.prototype.create = function(worldDict) {
        var entry, exitAction, exit_gate, exit_id, len, m, pos, ref2, ref3, ref4, ref5, ref6;
        if (worldDict == null) {
            worldDict = {};
        }
        if (worldDict) {
            if (_.isString(worldDict)) {
                this.level_name = worldDict;
                this.dict = World.levels.dict[worldDict];
            } else {
                this.level_name = worldDict.name;
                this.dict = worldDict;
            }
        }
        this.level_index = World.levels.list.indexOf(this.level_name);
        klog("World.create " + this.level_index + " size: " + (new Pos(this.dict["size"]).str()) + " ---------------------- '" + this.level_name + "' scheme: '" + ((ref2 = this.dict.scheme) != null ? ref2 : 'default') + "'");
        this.creating = true;
        this.setSize(this.dict.size);
        this.applyScheme((ref3 = this.dict.scheme) != null ? ref3 : 'default');
        if (!this.preview) {
            this.text = new ScreenText(this.dict.name);
        }
        if (this.dict.exits != null) {
            exit_id = 0;
            ref4 = this.dict.exits;
            for (m = 0, len = ref4.length; m < len; m++) {
                entry = ref4[m];
                exit_gate = new Gate(entry["active"]);
                exit_gate.name = (ref5 = entry["name"]) != null ? ref5 : "exit " + exit_id;
                if (Action.id != null) {
                    Action.id;
                } else {
                    Action.id = 0;
                }
                exitAction = new Action({
                    id: Action.id,
                    func: this.exitLevel,
                    name: "exit " + exit_id,
                    mode: Action.ONCE
                });
                exit_gate.getEventWithName("enter").addAction(exitAction);
                if (entry.position != null) {
                    pos = this.decenter(entry.position);
                } else if (entry.coordinates != null) {
                    pos = new Pos(entry.coordinates);
                }
                this.addObjectAtPos(exit_gate, pos);
                exit_id += 1;
            }
        }
        if (this.dict.create != null) {
            if (_.isFunction(this.dict.create)) {
                this.dict.create();
            } else {
                klog("World.create [WARNING] @dict.create not a function!");
            }
        }
        this.player = new Player;
        this.player.setOrientation((ref6 = this.dict.player.orientation) != null ? ref6 : rotx90);
        this.player.camera.setOrientation(this.player.orientation);
        if (this.dict.player.position != null) {
            this.addObjectAtPos(this.player, this.decenter(this.dict.player.position));
        } else if (this.dict.player.coordinates != null) {
            this.addObjectAtPos(this.player, new Pos(this.dict.player.coordinates));
        }
        this.player.camera.setPosition(this.player.currentPos());
        if (this.preview) {
            this.player.camera.step();
            this.setCameraMode(Camera.FOLLOW);
        } else {
            if (this.dict.camera === 'inside') {
                this.setCameraMode(Camera.INSIDE);
            }
        }
        this.creating = false;
        return klog('done creating');
    };

    World.prototype.restart = function() {
        return this.create(this.dict);
    };

    World.prototype.finish = function() {};

    World.prototype.applyScheme = function(scheme) {
        var base, base1, base2, base3, base4, base5, k, mat, opacity, ref2, ref3, ref4, ref5, ref6, results, shininess, v;
        if (!Scheme[scheme]) {
            return;
        }
        colors = _.clone(Scheme[scheme]);
        opacity = {
            stone: 0.7,
            bomb: 0.9,
            text: 0
        };
        shininess = {
            tire: 4,
            plate: 10,
            raster: 20,
            wall: 20,
            stone: 20,
            gear: 20,
            text: 200
        };
        if ((base = colors.plate).emissive != null) {
            base.emissive;
        } else {
            base.emissive = colors.plate.color;
        }
        if ((base1 = colors.bulb).emissive != null) {
            base1.emissive;
        } else {
            base1.emissive = colors.bulb.color;
        }
        if (colors.menu != null) {
            colors.menu;
        } else {
            colors.menu = {};
        }
        if ((base2 = colors.menu).color != null) {
            base2.color;
        } else {
            base2.color = colors.gear.color;
        }
        if (colors.raster != null) {
            colors.raster;
        } else {
            colors.raster = {};
        }
        if ((base3 = colors.raster).color != null) {
            base3.color;
        } else {
            base3.color = colors.plate.color;
        }
        if (colors.wall != null) {
            colors.wall;
        } else {
            colors.wall = {};
        }
        if ((base4 = colors.wall).color != null) {
            base4.color;
        } else {
            base4.color = new THREE.Color(colors.plate.color).multiplyScalar(0.6);
        }
        if (colors.wirePlate != null) {
            colors.wirePlate;
        } else {
            colors.wirePlate = {};
        }
        if ((base5 = colors.wirePlate).color != null) {
            base5.color;
        } else {
            base5.color = colors.wire.color;
        }
        results = [];
        for (k in colors) {
            v = colors[k];
            mat = Material[k];
            mat.color = v.color;
            mat.opacity = (ref2 = (ref3 = v.opacity) != null ? ref3 : opacity[k]) != null ? ref2 : 1;
            mat.specular = (ref4 = v.specular) != null ? ref4 : new THREE.Color(v.color).multiplyScalar(0.2);
            mat.emissive = (ref5 = v.emissive) != null ? ref5 : new THREE.Color(0, 0, 0);
            if (shininess[k] != null) {
                results.push(mat.shininess = (ref6 = v.shininess) != null ? ref6 : shininess[k]);
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.addLight = function(light) {
        this.lights.push(light);
        if (light.shadow) {
            return this.enableShadows(true);
        }
    };

    World.prototype.removeLight = function(light) {
        var l, len, m, ref2, shadow;
        _.pull(this.lights, light);
        ref2 = this.lights;
        for (m = 0, len = ref2.length; m < len; m++) {
            l = ref2[m];
            if (l.shadow) {
                shadow = true;
            }
        }
        return this.enableShadows(shadow);
    };

    World.prototype.enableShadows = function(enable) {
        return this.renderer.shadowMap.enabled = enable;
    };

    World.prototype.exitLevel = function(action) {
        var nextLevel;
        this.finish();
        nextLevel = (world.level_index + (_.isNumber(action) && action || 1)) % World.levels.list.length;
        return world.create(World.levels.list[nextLevel]);
    };

    World.prototype.activate = function(objectName) {
        var ref2;
        return (ref2 = this.getObjectWithName(objectName)) != null ? typeof ref2.setActive === "function" ? ref2.setActive(true) : void 0 : void 0;
    };

    World.prototype.decenter = function(x, y, z) {
        return new Pos(x, y, z).plus(this.size.div(2));
    };

    World.prototype.isValidPos = function(pos) {
        var p;
        p = new Pos(pos);
        return p.x >= 0 && p.x < this.size.x && p.y >= 0 && p.y < this.size.y && p.z >= 0 && p.z < this.size.z;
    };

    World.prototype.isInvalidPos = function(pos) {
        return !this.isValidPos(pos);
    };

    World.prototype.setSize = function(size) {
        var ref2;
        this.deleteAllObjects();
        this.cells = [];
        this.size = new Pos(size);
        this.max_distance = Math.max(this.size.x, Math.max(this.size.y, this.size.z));
        if ((ref2 = this.cage) != null) {
            ref2.del();
        }
        return this.cage = new Cage(this.size, this.rasterSize);
    };

    World.prototype.getCellAtPos = function(pos) {
        if (this.isValidPos(pos)) {
            return this.cells[this.posToIndex(pos)];
        }
    };

    World.prototype.getBotAtPos = function(pos) {
        return this.getObjectOfTypeAtPos(Bot, new Pos(pos));
    };

    World.prototype.posToIndex = function(pos) {
        var p;
        p = new Pos(pos);
        return p.x * this.size.z * this.size.y + p.y * this.size.z + p.z;
    };

    World.prototype.indexToPos = function(index) {
        var lrest, lsize;
        lsize = this.size.z * this.size.y;
        lrest = index % lsize;
        return new Pos(index / lsize, lrest / this.size.z, lrest % this.size.z);
    };

    World.prototype.addObjectAtPos = function(object, x, y, z) {
        var pos;
        pos = new Pos(x, y, z);
        object = this.newObject(object);
        this.setObjectAtPos(object, pos);
        return this.addObject(object);
    };

    World.prototype.addObjectLine = function(object, sx, sy, sz, ex, ey, ez) {
        var deltas, diff, end, i, j, m, maxdiff, pos, ref2, results, start;
        if (sx instanceof Pos || Array.isArray(sx)) {
            start = sx;
            end = sy;
        } else {
            start = new Pos(sx, sy, sz);
            end = new Pos(ex, ey, ez);
        }
        if (end instanceof Pos) {
            end = [end.x, end.y, end.z];
        }
        ex = end[0], ey = end[1], ez = end[2];
        if (start instanceof Pos) {
            start = [start.x, start.y, start.z];
        }
        sx = start[0], sy = start[1], sz = start[2];
        diff = [ex - sx, ey - sy, ez - sz];
        maxdiff = _.max(diff.map(Math.abs));
        deltas = diff.map(function(a) {
            return a / maxdiff;
        });
        results = [];
        for (i = m = 0, ref2 = maxdiff; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
            pos = new Pos((function() {
                var n, results1;
                results1 = [];
                for (j = n = 0; n <= 2; j = ++n) {
                    results1.push(start[j] + i * deltas[j]);
                }
                return results1;
            })());
            if (this.isUnoccupiedPos(pos)) {
                results.push(this.addObjectAtPos(object, pos));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.addObjectPoly = function(object, points, close) {
        var index, m, ref2, results;
        if (close == null) {
            close = true;
        }
        if (close) {
            points.push(points[0]);
        }
        results = [];
        for (index = m = 1, ref2 = points.length; 1 <= ref2 ? m < ref2 : m > ref2; index = 1 <= ref2 ? ++m : --m) {
            results.push(this.addObjectLine(object, points[index - 1], points[index]));
        }
        return results;
    };

    World.prototype.addObjectRandom = function(object, number) {
        var i, m, ref2, results;
        results = [];
        for (i = m = 0, ref2 = number; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
            if (_.isString(object)) {
                results.push(this.setObjectRandom(eval(object)));
            } else {
                results.push(this.setObjectRandom(object()));
            }
        }
        return results;
    };

    World.prototype.setObjectRandom = function(object) {
        var objectSet, randomPos, results;
        objectSet = false;
        object = this.newObject(object);
        results = [];
        while (!objectSet) {
            randomPos = new Pos(randInt(this.size.x), randInt(this.size.y), randInt(this.size.z));
            if (!object.isSpaceEgoistic() || this.isUnoccupiedPos(randomPos)) {
                this.addObjectAtPos(object, randomPos);
                results.push(objectSet = true);
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.getObjectsOfType = function(clss) {
        return this.objects.filter(function(o) {
            return o instanceof clss;
        });
    };

    World.prototype.getObjectsOfTypeAtPos = function(clss, pos) {
        var ref2, ref3;
        return (ref2 = (ref3 = this.getCellAtPos(pos)) != null ? ref3.getObjectsOfType(clss) : void 0) != null ? ref2 : [];
    };

    World.prototype.getObjectOfTypeAtPos = function(clss, pos) {
        var ref2;
        return (ref2 = this.getCellAtPos(pos)) != null ? ref2.getRealObjectOfType(clss) : void 0;
    };

    World.prototype.getOccupantAtPos = function(pos) {
        var ref2;
        return (ref2 = this.getCellAtPos(pos)) != null ? ref2.getOccupant() : void 0;
    };

    World.prototype.getRealOccupantAtPos = function(pos) {
        var occupant;
        occupant = this.getOccupantAtPos(pos);
        if (occupant && occupant instanceof TmpObject) {
            return occupant.object;
        } else {
            return occupant;
        }
    };

    World.prototype.switchAtPos = function(pos) {
        return this.getObjectOfTypeAtPos(Switch, pos);
    };

    World.prototype.setObjectAtPos = function(object, pos) {
        var cell, cellIndex, occupant;
        pos = new Pos(pos);
        if (this.isInvalidPos(pos)) {
            kerror("World.setObjectAtPos [WARNING] invalid pos:", pos);
            return;
        }
        if (object.isSpaceEgoistic()) {
            if (cell = this.getCellAtPos(pos)) {
                if (occupant = cell.getOccupant()) {
                    if (occupant instanceof TmpObject) {
                        if (occupant.time > 0) {
                            console.log("World.setObjectAtPos [WARNING] already occupied pos:", pos);
                            console.log("World.setObjectAtPos [WARNING] already occupied time:", occupant.time);
                        }
                        occupant.del();
                    }
                }
            }
        }
        cell = this.getCellAtPos(pos);
        if (cell == null) {
            cellIndex = this.posToIndex(pos);
            cell = new Cell();
            this.cells[cellIndex] = cell;
        }
        object.setPosition(pos);
        return cell.addObject(object);
    };

    World.prototype.unsetObject = function(object) {
        var cell, pos;
        pos = object.getPos();
        if (cell = this.getCellAtPos(pos)) {
            cell.removeObject(object);
            if (cell.isEmpty()) {
                return this.cells[this.posToIndex(pos)] = null;
            }
        }
    };

    World.prototype.newObject = function(object) {
        if (_.isString(object)) {
            if (object.startsWith('new')) {
                return eval(object);
            }
            return new (require("./" + (object.toLowerCase())))();
        }
        if (object instanceof Item) {
            return object;
        } else {
            return object();
        }
    };

    World.prototype.addObject = function(object) {
        object = this.newObject(object);
        if (object instanceof Light) {
            return this.lights.push(object);
        } else {
            return this.objects.push(object);
        }
    };

    World.prototype.removeObject = function(object) {
        this.unsetObject(object);
        _.pull(this.lights, object);
        return _.pull(this.objects, object);
    };

    World.prototype.moveObjectToPos = function(object, pos) {
        if (this.isInvalidPos(pos) || this.isOccupiedPos(pos)) {
            return false;
        }
        this.unsetObject(object);
        this.setObjectAtPos(object, pos);
        world.playSound('BOT_LAND');
        return true;
    };

    World.prototype.toggle = function(objectName) {
        var object;
        object = this.getObjectWithName(objectName);
        return object.getActionWithName("toggle").perform();
    };

    World.prototype.deleteAllObjects = function() {
        var oldSize, results;
        Timer.removeAllActions();
        if (this.player != null) {
            this.player.del();
        }
        while (this.lights.length) {
            oldSize = this.lights.length;
            last(this.lights).del();
            if (oldSize === this.lights.length) {
                kerror("WARNING World.deleteAllObjects light no auto remove");
                this.lights.pop();
            }
        }
        results = [];
        while (this.objects.length) {
            oldSize = this.objects.length;
            last(this.objects).del();
            if (oldSize === this.objects.length) {
                kerror("WARNING World.deleteAllObjects object no auto remove " + (last(this.objects).name));
                results.push(this.objects.pop());
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.deleteObjectsWithClassName = function(className) {
        var len, m, o, ref2, results;
        ref2 = _.clone(this.objects);
        results = [];
        for (m = 0, len = ref2.length; m < len; m++) {
            o = ref2[m];
            if (className === o.getClassName()) {
                results.push(o.del());
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.getObjectWithName = function(objectName) {
        var len, m, o, ref2;
        ref2 = this.objects;
        for (m = 0, len = ref2.length; m < len; m++) {
            o = ref2[m];
            if (objectName === o.name) {
                return o;
            }
        }
        kerror("World.getObjectWithName [WARNING] no object with name " + objectName);
        return null;
    };

    World.prototype.setCameraMode = function(mode) {
        return this.player.camera.mode = clamp(Camera.INSIDE, Camera.FOLLOW, mode);
    };

    World.prototype.changeCameraMode = function() {
        return this.player.camera.mode = (this.player.camera.mode + 1) % (Camera.FOLLOW + 1);
    };

    World.prototype.objectWillMoveToPos = function(object, pos, duration) {
        var objectAtNewPos, sourcePos, targetCell, targetPos, tmpObject;
        sourcePos = object.getPos();
        targetPos = new Pos(pos);
        if (this.isInvalidPos(targetPos)) {
            kerror("world.objectWillMoveToPos [WARNING] " + object.name + " invalid targetPos:", targetPos);
            return;
        }
        if (sourcePos.eql(targetPos)) {
            kerror("world.objectWillMoveToPos [WARNING] " + object.name + " equal pos:", targetPos);
            return;
        }
        targetCell = this.getCellAtPos(pos);
        if (targetCell) {
            if (objectAtNewPos = targetCell.getOccupant()) {
                if (objectAtNewPos instanceof TmpObject) {
                    if (objectAtNewPos.time < 0 && -objectAtNewPos.time <= duration) {
                        objectAtNewPos.del();
                    } else {
                        kerror("world.objectWillMoveToPos [WARNING] " + object.name + " timing conflict at pos:", targetPos);
                    }
                } else {
                    kerror("world.objectWillMoveToPos [WARNING] " + object.name + " already occupied:", targetPos);
                }
            }
        }
        if (object.name !== 'player') {
            this.unsetObject(object);
            tmpObject = new TmpObject(object);
            tmpObject.setPosition(sourcePos);
            tmpObject.time = -duration;
            this.addObjectAtPos(tmpObject, sourcePos);
            tmpObject = new TmpObject(object);
            tmpObject.setPosition(targetPos);
            tmpObject.time = duration;
            return this.addObjectAtPos(tmpObject, targetPos);
        }
    };

    World.prototype.objectMoved = function(movedObject, from, to) {
        var cellIndex, sourceCell, sourcePos, targetCell, targetPos, tmpObject;
        sourcePos = new Pos(from);
        targetPos = new Pos(to);
        if (this.isInvalidPos(targetPos)) {
            kerror("World.objectMoved [WARNING] " + movedObject.name + " invalid targetPos:", targetPos);
            return;
        }
        sourceCell = this.getCellAtPos(sourcePos);
        targetCell = this.getCellAtPos(targetPos);
        if (tmpObject = sourceCell != null ? sourceCell.getObjectOfType(TmpObject) : void 0) {
            if (tmpObject.object === movedObject) {
                tmpObject.del();
            }
        }
        if (tmpObject = targetCell != null ? targetCell.getObjectOfType(TmpObject) : void 0) {
            if (tmpObject.object === movedObject) {
                tmpObject.del();
            }
        }
        if (this.isOccupiedPos(targetPos)) {
            kerror("World.objectMoved [WARNING] " + movedObject.name + " occupied target pos:", targetPos);
        }
        if (sourceCell != null) {
            sourceCell.removeObject(movedObject);
            if (sourceCell.isEmpty()) {
                this.cells[this.posToIndex(sourcePos)] = null;
            }
        }
        targetCell = this.getCellAtPos(targetPos);
        if (targetCell == null) {
            cellIndex = this.posToIndex(targetPos);
            targetCell = new Cell();
            this.cells[cellIndex] = targetCell;
        }
        if (targetCell != null) {
            return targetCell.addObject(movedObject);
        } else {
            return kerror("world.objectMoved [WARNING] " + movedObject.name + " no target cell?");
        }
    };

    World.prototype.step = function(step) {
        var camera, center, d, len, len1, len2, m, n, o, order, q, quat, ref2, ref3, stone, stones;
        if (this.levelSelection) {
            this.levelSelection.step(step);
            return;
        }
        camera = this.player.camera.cam;
        if (false) {
            quat = camera.quaternion.clone();
            quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), step.dsecs * 0.2));
            quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), step.dsecs * 0.1));
            center = this.size.div(2);
            camera.position.set(center.x, center.y, center.z + this.dist).applyQuaternion(quat);
            camera.quaternion.copy(quat);
        }
        Timer.triggerActions();
        Timer.finishActions();
        ref2 = this.objects;
        for (m = 0, len = ref2.length; m < len; m++) {
            o = ref2[m];
            if (typeof o.step === "function") {
                o.step(step);
            }
        }
        this.player.camera.step(step);
        Sound.setMatrix(this.player.camera);
        this.player.setOpacity(clamp(0, 1, this.player.camera.getPosition().minus(this.player.current_position).length() - 0.4));
        stones = [];
        ref3 = this.objects;
        for (n = 0, len1 = ref3.length; n < len1; n++) {
            o = ref3[n];
            if (o instanceof Stone) {
                stones.push(o);
            }
        }
        stones.sort((function(_this) {
            return function(a, b) {
                return b.position.minus(_this.player.camera.getPosition()).length() - a.position.minus(_this.player.camera.getPosition()).length();
            };
        })(this));
        order = 100;
        for (q = 0, len2 = stones.length; q < len2; q++) {
            stone = stones[q];
            stone.mesh.renderOrder = order;
            order += 1;
            d = stone.position.minus(this.player.camera.getPosition()).length();
            if (d < 1.0) {
                if (stone.mesh.material.orig_opacity == null) {
                    stone.mesh.material.orig_opacity = stone.mesh.material.opacity;
                }
                stone.mesh.material.opacity = 0.2 + d * 0.5;
            } else if (stone.mesh.material.orig_opacity != null) {
                stone.mesh.material.opacity = stone.mesh.material.orig_opacity;
                delete stone.mesh.material.orig_opacity;
            }
        }
        this.sun.position.copy(camera.position);
        this.renderer.autoClearColor = false;
        this.renderer.render(this.scene, camera);
        if (this.text) {
            this.renderer.render(this.text.scene, this.text.camera);
        }
        if (this.menu) {
            return this.renderer.render(this.menu.scene, this.menu.camera);
        }
    };

    World.prototype.getTime = function() {
        return now().toFixed(0);
    };

    World.prototype.setSpeed = function(s) {
        return this.speed = s;
    };

    World.prototype.getSpeed = function() {
        return this.speed;
    };

    World.prototype.mapMsTime = function(unmapped) {
        return parseInt(10.0 * unmapped / this.speed);
    };

    World.prototype.unmapMsTime = function(mapped) {
        return parseInt(mapped * this.speed / 10.0);
    };

    World.prototype.continuous = function(cb) {
        return new Action({
            func: cb,
            name: "continuous",
            mode: Action.CONTINUOUS
        });
    };

    World.prototype.once = function(cb) {
        return new Action({
            func: cb,
            name: "once",
            mode: Action.ONCE
        });
    };

    World.prototype.resized = function(w, h) {
        var camera, ref2, ref3, ref4, ref5;
        this.aspect = w / h;
        camera = this.player.camera.cam;
        if (camera != null) {
            camera.aspect = this.aspect;
        }
        if (camera != null) {
            camera.updateProjectionMatrix();
        }
        if ((ref2 = this.renderer) != null) {
            ref2.setSize(w, h);
        }
        this.screenSize = new Size(w, h);
        if ((ref3 = this.text) != null) {
            ref3.resized(w, h);
        }
        if ((ref4 = this.menu) != null) {
            ref4.resized(w, h);
        }
        return (ref5 = this.levelSelection) != null ? ref5.resized(w, h) : void 0;
    };

    World.prototype.getNearestValidPos = function(pos) {
        return new Pos(Math.min(this.size.x - 1, Math.max(pos.x, 0)), Math.min(this.size.y - 1, Math.max(pos.y, 0)), Math.min(this.size.z - 1, Math.max(pos.z, 0)));
    };

    World.prototype.isUnoccupiedPos = function(pos) {
        return !this.isOccupiedPos(pos);
    };

    World.prototype.isOccupiedPos = function(pos) {
        if (this.isInvalidPos(pos)) {
            return true;
        }
        if (this.getOccupantAtPos(pos)) {
            return true;
        }
    };

    World.prototype.mayObjectPushToPos = function(object, pos, duration) {
        var direction, objectAtNewPos, pushableObject, tmpObject;
        if (this.isInvalidPos(pos)) {
            return false;
        }
        direction = pos.minus(object.getPos());
        if (this.isInvalidPos(pos.plus(direction))) {
            return false;
        }
        objectAtNewPos = this.getOccupantAtPos(pos.plus(direction));
        if (objectAtNewPos) {
            if (objectAtNewPos instanceof TmpObject) {
                tmpObject = objectAtNewPos;
                if (tmpObject.time < 0 && -tmpObject.time <= duration) {
                    tmpObject.del();
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        pushableObject = this.getOccupantAtPos(pos);
        if ((pushableObject != null) && pushableObject instanceof Pushable) {
            pushableObject.pushedByObjectInDirection(object, direction, duration);
            return true;
        }
        return false;
    };

    World.prototype.showHelp = function() {
        return this.text = new ScreenText(this.dict['help']);
    };

    World.prototype.outro = function(index) {
        var less_text, more_text, outro_text, page, page_text;
        if (index == null) {
            index = 0;
        }
        outro_text = "$scale(1.5)congratulations!\n\n$scale(1)you rescued\nthe nano world!\n\nthe last dumb mutant bot\nhas been destroyed.\n\nthe maker is functioning again.\nkiki will go now\nand see all his new friends.\n\nyou should maybe\ndo the same?\nthe maker wants to thank you!\n\n(btw.: you thought\nyou didn't see\nkiki's maker in the game?\nyou are wrong!\nyou saw him\nall the time,\nbecause kiki\nlives inside him!)\n\n$scale(1.5)the end\np.s.: the maker of the game\nwants to thank you as well!\n\ni definitely want your feedback:\nplease send me a mail (monsterkodi@gmx.net)\nwith your experiences,\nwhich levels you liked, etc.\n\nthanks in advance and have a nice day,\n\nyours kodi";
        more_text = index < outro_text.length - 1;
        less_text = index > 0;
        page_text = outro_text[index];
        page_text += "\n\n$scale(0.5)(" + (index + 1) + "/" + outro_text.length + ")";
        page = KikiPageText(page_text, more_text, less_text);
        page.getEventWithName("hide").addAction(once(display_main_menu));
        if (more_text) {
            page.getEventWithName("next").addAction((function(_this) {
                return function(i) {
                    if (i == null) {
                        i = index + 1;
                    }
                    return _this.outro(i);
                };
            })(this));
        }
        if (less_text) {
            return page.getEventWithName("previous").addAction((function(_this) {
                return function(i) {
                    if (i == null) {
                        i = index - 1;
                    }
                    return _this.outro(i);
                };
            })(this));
        }
    };

    World.prototype.resetProjection = function() {
        return this.player.camera.setViewport(0.0, 0.0, 1.0, 1.0);
    };

    World.prototype.showMenu = function(self) {
        this.menu = new Menu();
        this.menu.addItem('help', this.showHelp);
        this.menu.addItem('restart', this.restart);
        this.menu.addItem('load level', this.showLevels);
        this.menu.addItem('setup', this.showSetup);
        this.menu.addItem('about', this.showAbout);
        this.menu.addItem('quit', this.quit);
        return this.menu.show();
    };

    World.prototype.quit = function() {
        return post.toMain('quitApp');
    };

    World.prototype.showAbout = function() {
        return post.toMain('showAbout');
    };

    World.prototype.showSetup = function() {
        return klog('showSetup');
    };

    World.prototype.showLevels = function() {
        return this.levelSelection = new LevelSelection(this);
    };

    World.prototype.getInsideWallPosWithDelta = function(pos, delta) {
        var f, insidePos, m, planePos, w;
        insidePos = new Vector(pos);
        for (w = m = 0; m <= 5; w = ++m) {
            planePos = new Vector(-0.5, -0.5, -0.5);
            if (w >= 3) {
                planePos.add(this.size);
            }
            f = Vector.rayPlaneIntersectionFactor(pos, World.normals[w].neg(), planePos, World.normals[w]);
            if (f < delta) {
                insidePos.add(World.normals[w].mul(delta - f));
            }
        }
        return insidePos;
    };

    World.prototype.getWallDistanceForPos = function(pos) {
        var f, m, min_f, planePos, w;
        min_f = 10000;
        for (w = m = 0; m <= 5; w = ++m) {
            planePos = new Vector(-0.5, -0.5, -0.5);
            if (w >= 3) {
                planePos.add(this.size);
            }
            f = Vector.rayPlaneIntersectionFactor(pos, World.normals[w].neg(), planePos, World.normals[w]);
            min_f = absMin(min_f, f);
        }
        return min_f;
    };

    World.prototype.getWallDistanceForRay = function(rayPos, rayDir) {
        var f, m, min_f, planePos, w;
        min_f = 10000;
        for (w = m = 0; m <= 5; w = ++m) {
            planePos = new Vector(-0.5, -0.5, -0.5);
            if (w >= 3) {
                planePos.add(this.size);
            }
            f = Vector.rayPlaneIntersectionFactor(rayPos, rayDir, planePos, World.normals[w]);
            if (f >= 0.0 && f < min_f) {
                min_f = f;
            }
        }
        return min_f;
    };

    World.prototype.displayLights = function() {
        var len, light, m, ref2, results;
        ref2 = this.lights;
        results = [];
        for (m = 0, len = ref2.length; m < len; m++) {
            light = ref2[m];
            results.push(lignt.display());
        }
        return results;
    };

    World.prototype.playSound = function(sound, pos, time) {
        if (!this.creating) {
            return Sound.play(sound, pos, time);
        }
    };

    World.prototype.modKeyComboEventDown = function(mod, key, combo, event) {
        var ref2, ref3;
        if (this.levelSelection) {
            this.levelSelection.modKeyComboEvent(mod, key, combo, event);
            return;
        }
        if (this.menu != null) {
            this.menu.modKeyComboEvent(mod, key, combo, event);
            return;
        }
        if ((ref2 = this.text) != null) {
            ref2.fadeOut();
        }
        if ((ref3 = this.player) != null ? ref3.modKeyComboEventDown(mod, key, combo, event) : void 0) {
            return;
        }
        switch (combo) {
            case 'esc':
                return this.showMenu();
            case '=':
                return this.speed = Math.min(10, this.speed + 1);
            case '-':
                return this.speed = Math.max(1, this.speed - 1);
            case 'r':
                return this.restart();
            case 'n':
                return this.exitLevel();
            case 'm':
                return this.exitLevel(5);
        }
    };

    World.prototype.modKeyComboEventUp = function(mod, key, combo, event) {
        var ref2;
        if (this.levelSelection) {
            return;
        }
        if ((ref2 = this.player) != null ? ref2.modKeyComboEventUp(mod, key, combo, event) : void 0) {

        }
    };

    return World;

})(Actor);

module.exports = World;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLDZWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLGNBQUEsR0FBaUIsT0FB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d0MsS0FBeEM7QUFDQSxtQkFGSjs7O2dCQUlLLENBQUUsT0FBUCxDQUFBOztRQUNBLHVDQUFpQixDQUFFLG9CQUFULENBQThCLEdBQTlCLEVBQW1DLEdBQW5DLEVBQXdDLEtBQXhDLEVBQStDLEtBQS9DLFVBQVY7QUFBQSxtQkFBQTs7QUFDQSxnQkFBTyxLQUFQO0FBQUEsaUJBQ1MsS0FEVDt1QkFDb0IsSUFBQyxDQUFBLFFBQUQsQ0FBQTtBQURwQixpQkFFUyxHQUZUO3VCQUVrQixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxFQUFhLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBcEI7QUFGM0IsaUJBR1MsR0FIVDt1QkFHa0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBYSxJQUFDLENBQUEsS0FBRCxHQUFPLENBQXBCO0FBSDNCLGlCQUlTLEdBSlQ7dUJBSWtCLElBQUMsQ0FBQSxPQUFELENBQUE7QUFKbEIsaUJBS1MsR0FMVDt1QkFLa0IsSUFBQyxDQUFBLFNBQUQsQ0FBQTtBQUxsQixpQkFNUyxHQU5UO3VCQU1rQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVg7QUFObEI7SUFaa0I7O29CQW9CdEIsa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFaEIsWUFBQTtRQUFBLElBQVUsSUFBQyxDQUFBLGNBQVg7QUFBQSxtQkFBQTs7UUFDQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBSGdCOzs7O0dBajNCSjs7QUFzM0JwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHBvc3QsIHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBmaXJzdCwgY2xhbXAsIGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblNpemUgICAgICAgID0gcmVxdWlyZSAnLi9saWIvc2l6ZSdcbkNlbGwgICAgICAgID0gcmVxdWlyZSAnLi9jZWxsJ1xuR2F0ZSAgICAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5DYW1lcmEgICAgICA9IHJlcXVpcmUgJy4vY2FtZXJhJ1xuTGlnaHQgICAgICAgPSByZXF1aXJlICcuL2xpZ2h0J1xuTGV2ZWxzICAgICAgPSByZXF1aXJlICcuL2xldmVscydcblBsYXllciAgICAgID0gcmVxdWlyZSAnLi9wbGF5ZXInXG5Tb3VuZCAgICAgICA9IHJlcXVpcmUgJy4vc291bmQnXG5DYWdlICAgICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcblRpbWVyICAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdG9yICAgICAgID0gcmVxdWlyZSAnLi9hY3Rvcidcbkl0ZW0gICAgICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQWN0aW9uICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1lbnUgICAgICAgID0gcmVxdWlyZSAnLi9tZW51J1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcbkxldmVsU2VsZWN0aW9uID0gcmVxdWlyZSAnLi9sZXZlbHNlbGVjdGlvbidcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZS5ub3dcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBAOiAoQHZpZXcsIEBwcmV2aWV3KSAtPlxuICAgICAgICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAXG4gICAgICAgIFxuICAgICAgICBAc3BlZWQgICAgICA9IDZcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgICMga2xvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgIEByZW5kZXJlci5zZXRTaXplIEB2aWV3Lm9mZnNldFdpZHRoLCBAdmlldy5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4gICAgICAgICMgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgICAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAgICAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG5cbiAgICAgICAgQHN1biA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpIGlmIEBwbGF5ZXI/XG4gICAgICAgIEBzY2VuZS5hZGQgQHN1blxuICAgICAgICBcbiAgICAgICAgQGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4MTExMTExXG4gICAgICAgIEBzY2VuZS5hZGQgQGFtYmllbnRcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3RzICAgICAgICAgPSBbXVxuICAgICAgICBAbGlnaHRzICAgICAgICAgID0gW11cbiAgICAgICAgQGNlbGxzICAgICAgICAgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICAgICAgICAgID0gbmV3IFBvcygpXG4gICAgICAgIEBkZXB0aCAgICAgICAgICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgICAgXG4gICAgICAgIEB0aW1lciA9IG5ldyBUaW1lciBAXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXJlci5kb21FbGVtZW50XG4gICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgd29ybGQuY3JlYXRlIGZpcnN0IEBsZXZlbHMubGlzdFxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9KSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuY3JlYXRlXCIgd29ybGREaWN0XG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlICN7QGxldmVsX2luZGV4fSBzaXplOiAje25ldyBQb3MoQGRpY3RbXCJzaXplXCJdKS5zdHIoKX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAnI3tAbGV2ZWxfbmFtZX0nIHNjaGVtZTogJyN7QGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnfSdcIlxuXG4gICAgICAgIEBjcmVhdGluZyA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBAc2V0U2l6ZSBAZGljdC5zaXplICMgdGhpcyByZW1vdmVzIGFsbCBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAYXBwbHlTY2hlbWUgQGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0Lm5hbWVcbiAgICAgICAgXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGV4aXRzXG5cbiAgICAgICAgaWYgQGRpY3QuZXhpdHM/XG4gICAgICAgICAgICBleGl0X2lkID0gMFxuICAgICAgICAgICAgZm9yIGVudHJ5IGluIEBkaWN0LmV4aXRzXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlID0gbmV3IEdhdGUgZW50cnlbXCJhY3RpdmVcIl1cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUubmFtZSA9IGVudHJ5W1wibmFtZVwiXSA/IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICBBY3Rpb24uaWQgPz0gMFxuICAgICAgICAgICAgICAgIGV4aXRBY3Rpb24gPSBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgICAgICAgICBpZDogICBBY3Rpb24uaWRcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogQGV4aXRMZXZlbFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUuZ2V0RXZlbnRXaXRoTmFtZShcImVudGVyXCIpLmFkZEFjdGlvbiBleGl0QWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgZW50cnkucG9zaXRpb24/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IEBkZWNlbnRlciBlbnRyeS5wb3NpdGlvblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZW50cnkuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgZW50cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgZXhpdF9nYXRlLCBwb3NcbiAgICAgICAgICAgICAgICBleGl0X2lkICs9IDFcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBjcmVhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LmNyZWF0ZT9cbiAgICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbiBAZGljdC5jcmVhdGVcbiAgICAgICAgICAgICAgICBAZGljdC5jcmVhdGUoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGtsb2cgXCJXb3JsZC5jcmVhdGUgW1dBUk5JTkddIEBkaWN0LmNyZWF0ZSBub3QgYSBmdW5jdGlvbiFcIlxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIHBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyXG5cbiAgICAgICAgQHBsYXllci5zZXRPcmllbnRhdGlvbiBAZGljdC5wbGF5ZXIub3JpZW50YXRpb24gPyByb3R4OTBcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0T3JpZW50YXRpb24gQHBsYXllci5vcmllbnRhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LnBsYXllci5wb3NpdGlvbj9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBAZGVjZW50ZXIgQGRpY3QucGxheWVyLnBvc2l0aW9uXG4gICAgICAgIGVsc2UgaWYgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIG5ldyBQb3MgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzXG5cbiAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwKClcbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5GT0xMT1dcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgICAgIGtsb2cgJ2RvbmUgY3JlYXRpbmcnXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgZmluaXNoOiAoKSAtPiAjIFRPRE86IHNhdmUgcHJvZ3Jlc3NcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBhcHBseVNjaGVtZTogKHNjaGVtZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYXBwbHlTY2hlbWUgI3tzY2hlbWV9XCJcbiAgICAgICAgXG4gICAgICAgIGNvbG9ycyA9IF8uY2xvbmUgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIG9wYWNpdHkgPVxuICAgICAgICAgICAgc3RvbmU6IDAuN1xuICAgICAgICAgICAgYm9tYjogIDAuOVxuICAgICAgICAgICAgdGV4dDogIDBcbiAgICAgICAgICAgIFxuICAgICAgICBzaGluaW5lc3MgPSBcbiAgICAgICAgICAgIHRpcmU6ICAgNFxuICAgICAgICAgICAgcGxhdGU6ICAxMFxuICAgICAgICAgICAgcmFzdGVyOiAyMFxuICAgICAgICAgICAgd2FsbDogICAyMFxuICAgICAgICAgICAgc3RvbmU6ICAyMFxuICAgICAgICAgICAgZ2VhcjogICAyMFxuICAgICAgICAgICAgdGV4dDogICAyMDBcbiAgICAgICAgICAgIFxuICAgICAgICBjb2xvcnMucGxhdGUuZW1pc3NpdmUgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMud2FsbCA/PSB7fVxuICAgICAgICBjb2xvcnMud2FsbC5jb2xvciA/PSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzLnBsYXRlLmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjZcbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZSA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGZvciBrLHYgb2YgY29sb3JzXG4gICAgICAgICAgICAjIGtsb2cgXCIje2t9ICN7di5jb2xvcj8ucn0gI3t2LmNvbG9yPy5nfSAje3YuY29sb3I/LmJ9XCIsIHZcbiAgICAgICAgICAgICMgY29udGludWUgaWYgayA9PSAndGV4dCdcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIEBsaWdodHMucHVzaCBsaWdodFxuICAgICAgICBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgbGlnaHRcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICBAZW5hYmxlU2hhZG93cyBzaGFkb3dcblxuICAgIGVuYWJsZVNoYWRvd3M6IChlbmFibGUpIC0+XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBAZmluaXNoKClcbiAgICAgICAgIyBrbG9nIFwid29ybGQubGV2ZWxfaW5kZXggI3t3b3JsZC5sZXZlbF9pbmRleH0gbmV4dExldmVsICN7V29ybGQubGV2ZWxzLmxpc3Rbd29ybGQubGV2ZWxfaW5kZXgrMV19XCJcbiAgICAgICAgbmV4dExldmVsID0gKHdvcmxkLmxldmVsX2luZGV4KyhfLmlzTnVtYmVyKGFjdGlvbikgYW5kIGFjdGlvbiBvciAxKSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhcbiAgICAgICAgd29ybGQuY3JlYXRlIFdvcmxkLmxldmVscy5saXN0W25leHRMZXZlbF1cblxuICAgIGFjdGl2YXRlOiAob2JqZWN0TmFtZSkgLT4gQGdldE9iamVjdFdpdGhOYW1lKG9iamVjdE5hbWUpPy5zZXRBY3RpdmU/IHRydWVcbiAgICBcbiAgICBkZWNlbnRlcjogKHgseSx6KSAtPiBuZXcgUG9zKHgseSx6KS5wbHVzIEBzaXplLmRpdiAyXG5cbiAgICBpc1ZhbGlkUG9zOiAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCA+PSAwIGFuZCBwLnggPCBAc2l6ZS54IGFuZCBwLnkgPj0gMCBhbmQgcC55IDwgQHNpemUueSBhbmQgcC56ID49IDAgYW5kIHAueiA8IEBzaXplLnpcbiAgICAgICAgXG4gICAgaXNJbnZhbGlkUG9zOiAocG9zKSAtPiBub3QgQGlzVmFsaWRQb3MgcG9zXG5cbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgIDAwMFxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2V0U2l6ZTogKHNpemUpIC0+XG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMga2xvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBpbnZhbGlkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpXG4gICAgICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCA9IGNlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQudGltZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHRpbWU6XCIsIG9jY3VwYW50LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50LmRlbCgpICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGFueXdheSAuIGRlbGV0ZSBpdFxuICAgICAgICBcbiAgICAgICAgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIG5vdCBjZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXgocG9zKVxuICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gY2VsbFxuICAgICAgICBcbiAgICAgICAgb2JqZWN0LnNldFBvc2l0aW9uIHBvc1xuICAgICAgICBjZWxsLmFkZE9iamVjdCBvYmplY3RcblxuICAgIHVuc2V0T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBwb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICBjZWxsLnJlbW92ZU9iamVjdCBvYmplY3RcbiAgICAgICAgICAgIGlmIGNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldID0gbnVsbFxuICAgICAgICAjIGVsc2UgXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLnVuc2V0T2JqZWN0IFtXQVJOSU5HXSBubyBjZWxsIGF0IHBvczonLCBwb3NcblxuICAgIG5ld09iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgIGlmIG9iamVjdC5zdGFydHNXaXRoICduZXcnXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgcmV0dXJuIG5ldyAocmVxdWlyZSBcIi4vI3tvYmplY3QudG9Mb3dlckNhc2UoKX1cIikoKVxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBJdGVtXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QoKVxuICAgICAgICBcbiAgICBhZGRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIExpZ2h0XG4gICAgICAgICAgICBAbGlnaHRzLnB1c2ggb2JqZWN0ICMgaWYgbGlnaHRzLmluZGV4T2Yob2JqZWN0KSA8IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3QgIyBpZiBvYmplY3RzLmluZGV4T2Yob2JqZWN0KSA8IDAgXG5cbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIEB1bnNldE9iamVjdCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIG9iamVjdFxuICAgICAgICBfLnB1bGwgQG9iamVjdHMsIG9iamVjdFxuICAgIFxuICAgIG1vdmVPYmplY3RUb1BvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyhwb3MpIG9yIEBpc09jY3VwaWVkUG9zKHBvcylcbiAgICAgICAgQHVuc2V0T2JqZWN0ICAgIG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgdHJ1ZVxuICAgICAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAbGlnaHRzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgbGlnaHQgbm8gYXV0byByZW1vdmVcIlxuICAgICAgICAgICAgICAgIEBsaWdodHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBvYmplY3RzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIG9iamVjdCBubyBhdXRvIHJlbW92ZSAje2xhc3QoQG9iamVjdHMpLm5hbWV9XCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0cy5wb3AoKVxuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3ROYW1lID09IG8ubmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgIGtlcnJvciBcIldvcmxkLmdldE9iamVjdFdpdGhOYW1lIFtXQVJOSU5HXSBubyBvYmplY3Qgd2l0aCBuYW1lICN7b2JqZWN0TmFtZX1cIlxuICAgICAgICBudWxsXG4gICAgXG4gICAgc2V0Q2FtZXJhTW9kZTogKG1vZGUpIC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSBjbGFtcCBDYW1lcmEuSU5TSURFLCBDYW1lcmEuRk9MTE9XLCBtb2RlXG4gICAgXG4gICAgY2hhbmdlQ2FtZXJhTW9kZTogLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IChAcGxheWVyLmNhbWVyYS5tb2RlKzEpICUgKENhbWVyYS5GT0xMT1crMSlcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgb2JqZWN0V2lsbE1vdmVUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyAje29iamVjdC5uYW1lfSAje2R1cmF0aW9ufVwiLCB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyBrbG9nICd3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIHRtcE9iamVjdCBhdCBvbGQgcG9zJywgc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBvbGQgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IC1kdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgc291cmNlUG9zIFxuXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG5ldyBwb3MnLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG5ldyBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IGR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCB0YXJnZXRQb3MgXG5cbiAgICBvYmplY3RNb3ZlZDogKG1vdmVkT2JqZWN0LCBmcm9tLCB0bykgLT5cbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLm9iamVjdE1vdmVkICN7bW92ZWRPYmplY3QubmFtZX1cIiwgc291cmNlUG9zXG4gICAgICAgIFxuICAgICAgICBzb3VyY2VDZWxsID0gQGdldENlbGxBdFBvcyBzb3VyY2VQb3NcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiB0bXBPYmplY3QgPSBzb3VyY2VDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcblxuICAgICAgICBpZiB0bXBPYmplY3QgPSB0YXJnZXRDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAaXNPY2N1cGllZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG9jY3VwaWVkIHRhcmdldCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3MgICAgXG4gICAgICAgIGlmIG5vdCB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXggdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gdGFyZ2V0Q2VsbFxuXG4gICAgICAgIGlmIHRhcmdldENlbGw/XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmFkZE9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBubyB0YXJnZXQgY2VsbD9cIlxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAgICBcbiAgICBcbiAgICBzdGVwOiAoc3RlcCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLnN0ZXAgc3RlcCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXIuY2FtZXJhLmNhbVxuICAgICAgICBcbiAgICAgICAgaWYgZmFsc2VcbiAgICAgICAgICAgIHF1YXQgPSBjYW1lcmEucXVhdGVybmlvbi5jbG9uZSgpXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygxLDAsMCksIHN0ZXAuZHNlY3MqMC4yXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIHN0ZXAuZHNlY3MqMC4xXG4gICAgICAgICAgICBjZW50ZXIgPSBAc2l6ZS5kaXYgMlxuICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnNldChjZW50ZXIueCxjZW50ZXIueSxjZW50ZXIueitAZGlzdCkuYXBwbHlRdWF0ZXJuaW9uIHF1YXRcbiAgICAgICAgICAgIGNhbWVyYS5xdWF0ZXJuaW9uLmNvcHkgcXVhdFxuXG4gICAgICAgIFRpbWVyLnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgVGltZXIuZmluaXNoQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICBvLnN0ZXA/KHN0ZXApIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnN0ZXAgc3RlcFxuXG4gICAgICAgIFNvdW5kLnNldE1hdHJpeCBAcGxheWVyLmNhbWVyYVxuICAgICAgICAgICAgXG4gICAgICAgIEBwbGF5ZXIuc2V0T3BhY2l0eSBjbGFtcCAwLCAxLCBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpLm1pbnVzKEBwbGF5ZXIuY3VycmVudF9wb3NpdGlvbikubGVuZ3RoKCktMC40XG4gICAgICAgIFxuICAgICAgICBzdG9uZXMgPSBbXVxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbyBpbnN0YW5jZW9mIFN0b25lXG4gICAgICAgICAgICAgICAgc3RvbmVzLnB1c2ggb1xuICAgICAgICBzdG9uZXMuc29ydCAoYSxiKSA9PiBiLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpIC0gYS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICBcbiAgICAgICAgb3JkZXIgPSAxMDBcbiAgICAgICAgZm9yIHN0b25lIGluIHN0b25lc1xuICAgICAgICAgICAgc3RvbmUubWVzaC5yZW5kZXJPcmRlciA9IG9yZGVyXG4gICAgICAgICAgICBvcmRlciArPSAxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQgPSBzdG9uZS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICAgICAgaWYgZCA8IDEuMFxuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5IGlmIG5vdCBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjIgKyBkICogMC41XG4gICAgICAgICAgICBlbHNlIGlmIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgIFxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgY2FtZXJhLnBvc2l0aW9uXG4gICAgICAgIEByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciA9IGZhbHNlXG5cbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAc2NlbmUsIGNhbWVyYVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgLT5cbiAgICAgICAgQGFzcGVjdCA9IHcvaFxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyLmNhbWVyYS5jYW1cbiAgICAgICAgY2FtZXJhPy5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIGNhbWVyYT8udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIEByZW5kZXJlcj8uc2V0U2l6ZSB3LGhcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgQHRleHQ/LnJlc2l6ZWQgdyxoXG4gICAgICAgIEBtZW51Py5yZXNpemVkIHcsaFxuICAgICAgICBcbiAgICAgICAgQGxldmVsU2VsZWN0aW9uPy5yZXNpemVkIHcsaFxuXG4gICAgZ2V0TmVhcmVzdFZhbGlkUG9zOiAocG9zKSAtPlxuICAgICAgICBuZXcgUG9zIE1hdGgubWluKEBzaXplLngtMSwgTWF0aC5tYXgocG9zLngsIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUueS0xLCBNYXRoLm1heChwb3MueSwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS56LTEsIE1hdGgubWF4KHBvcy56LCAwKSlcbiAgICBcbiAgICBpc1Vub2NjdXBpZWRQb3M6IChwb3MpIC0+IG5vdCBAaXNPY2N1cGllZFBvcyBwb3NcbiAgICBpc09jY3VwaWVkUG9zOiAgIChwb3MpIC0+ICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGlmIEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAgICAgIyBrbG9nIFwiaXNPY2N1cGllZFBvcyBvY2N1cGFudDogI3tAZ2V0T2NjdXBhbnRBdFBvcyhwb3MpLm5hbWV9IGF0IHBvczpcIiwgbmV3IFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgbWF5T2JqZWN0UHVzaFRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3Mgb2JqZWN0OiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCIsIHBvc1xuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgIyBrbG9nIFwicHVzaGFibGVPYmplY3QgI3twdXNoYWJsZU9iamVjdD8ubmFtZX1cIlxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGUgI2FuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgTW90b3JHZWFyICMgYmFkXG4gICAgICAgICAgICBwdXNoYWJsZU9iamVjdC5wdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uIG9iamVjdCwgZGlyZWN0aW9uLCBkdXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICAgICAgZmFsc2VcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIHNob3dIZWxwOiA9PlxuXG4gICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuXG4gICAgb3V0cm86IChpbmRleD0wKSAtPlxuICAgICAgICAjIHdlbGwgaGlkZGVuIG91dHJvIDotKVxuICAgICAgICBvdXRyb190ZXh0ID0gXCJcIlwiXG4gICAgICAgICAgICAgICAgICAgICRzY2FsZSgxLjUpY29uZ3JhdHVsYXRpb25zIVxcblxcbiRzY2FsZSgxKXlvdSByZXNjdWVkXFxudGhlIG5hbm8gd29ybGQhXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGUgbGFzdCBkdW1iIG11dGFudCBib3RcXG5oYXMgYmVlbiBkZXN0cm95ZWQuXFxuXFxudGhlIG1ha2VyIGlzIGZ1bmN0aW9uaW5nIGFnYWluLlxuICAgICAgICAgICAgICAgICAgICBraWtpIHdpbGwgZ28gbm93XFxuYW5kIHNlZSBhbGwgaGlzIG5ldyBmcmllbmRzLlxcblxcbnlvdSBzaG91bGQgbWF5YmVcXG5kbyB0aGUgc2FtZT9cbiAgICAgICAgICAgICAgICAgICAgdGhlIG1ha2VyIHdhbnRzIHRvIHRoYW5rIHlvdSFcXG5cXG4oYnR3LjogeW91IHRob3VnaHRcXG55b3UgZGlkbid0IHNlZVxcbmtpa2kncyBtYWtlciBpbiB0aGUgZ2FtZT9cbiAgICAgICAgICAgICAgICAgICAgeW91IGFyZSB3cm9uZyFcXG55b3Ugc2F3IGhpbVxcbmFsbCB0aGUgdGltZSxcXG5iZWNhdXNlIGtpa2lcXG5saXZlcyBpbnNpZGUgaGltISlcXG5cXG4kc2NhbGUoMS41KXRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgcC5zLjogdGhlIG1ha2VyIG9mIHRoZSBnYW1lXFxud2FudHMgdG8gdGhhbmsgeW91IGFzIHdlbGwhXFxuXFxuaSBkZWZpbml0ZWx5IHdhbnQgeW91ciBmZWVkYmFjazpcbiAgICAgICAgICAgICAgICAgICAgcGxlYXNlIHNlbmQgbWUgYSBtYWlsIChtb25zdGVya29kaUBnbXgubmV0KVxcbndpdGggeW91ciBleHBlcmllbmNlcyxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggbGV2ZWxzIHlvdSBsaWtlZCwgZXRjLlxcblxcbnRoYW5rcyBpbiBhZHZhbmNlIGFuZCBoYXZlIGEgbmljZSBkYXksXFxuXFxueW91cnMga29kaVxuICAgICAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgXG4gICAgICAgIG1vcmVfdGV4dCA9IGluZGV4IDwgb3V0cm9fdGV4dC5sZW5ndGgtMVxuICAgICAgICBsZXNzX3RleHQgPSBpbmRleCA+IDBcbiAgICAgICAgXG4gICAgICAgIHBhZ2VfdGV4dCA9IG91dHJvX3RleHRbaW5kZXhdXG4gICAgICAgIHBhZ2VfdGV4dCArPSBcIlxcblxcbiRzY2FsZSgwLjUpKCN7aW5kZXgrMX0vI3tvdXRyb190ZXh0Lmxlbmd0aH0pXCJcbiAgICBcbiAgICAgICAgcGFnZSA9IEtpa2lQYWdlVGV4dChwYWdlX3RleHQsIG1vcmVfdGV4dCwgbGVzc190ZXh0KVxuICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJoaWRlXCIpLmFkZEFjdGlvbihvbmNlKGRpc3BsYXlfbWFpbl9tZW51KSlcbiAgICAgICAgXG4gICAgICAgIGlmIG1vcmVfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwibmV4dFwiKS5hZGRBY3Rpb24gKGk9aW5kZXgrMSkgPT4gQG91dHJvIGlcbiAgICAgICAgaWYgbGVzc190ZXh0XG4gICAgICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJwcmV2aW91c1wiKS5hZGRBY3Rpb24gKGk9aW5kZXgtMSkgPT4gQG91dHJvIGlcbiAgICAgICAgXG4gICAgcmVzZXRQcm9qZWN0aW9uOiAtPiBAcGxheWVyLmNhbWVyYS5zZXRWaWV3cG9ydCAwLjAsIDAuMCwgMS4wLCAxLjBcbiAgICBcbiAgICAjIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwIFxuICAgIFxuICAgIHNob3dNZW51OiAoc2VsZikgLT4gIyBoYW5kbGVzIGFuIEVTQyBrZXkgZXZlbnRcblxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnaGVscCcgICAgICAgQHNob3dIZWxwXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ3Jlc3RhcnQnICAgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtICdsb2FkIGxldmVsJyBAc2hvd0xldmVsc1xuICAgICAgICBAbWVudS5hZGRJdGVtICdzZXR1cCcgICAgICBAc2hvd1NldHVwICAgICAgIFxuICAgICAgICBAbWVudS5hZGRJdGVtICdhYm91dCcgICAgICBAc2hvd0Fib3V0XG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ3F1aXQnICAgICAgIEBxdWl0XG4gICAgICAgIEBtZW51LnNob3coKVxuICAgIFxuICAgIHF1aXQ6IC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgIHNob3dBYm91dDogLT4gcG9zdC50b01haW4gJ3Nob3dBYm91dCdcbiAgICBzaG93U2V0dXA6IC0+IGtsb2cgJ3Nob3dTZXR1cCdcbiAgICBzaG93TGV2ZWxzOiA9PiBAbGV2ZWxTZWxlY3Rpb24gPSBuZXcgTGV2ZWxTZWxlY3Rpb24gQFxuICAgICAgICAgICAgICAgIFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMFxuICAgIFxuICAgIGdldEluc2lkZVdhbGxQb3NXaXRoRGVsdGE6IChwb3MsIGRlbHRhKSAtPlxuICAgICAgICBpbnNpZGVQb3MgPSBuZXcgVmVjdG9yIHBvc1xuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgaWYgZiA8IGRlbHRhXG4gICAgICAgICAgICAgICAgaW5zaWRlUG9zLmFkZCBXb3JsZC5ub3JtYWxzW3ddLm11bCBkZWx0YS1mXG4gICAgICAgIGluc2lkZVBvc1xuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclBvczogKHBvcykgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIChwb3NpdGl2ZSBvciBuZWdhdGl2ZSlcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV0gXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gYWJzTWluIG1pbl9mLCBmIFxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclJheTogKHJheVBvcywgcmF5RGlyKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgaW4gcmF5RGlyIFxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciByYXlQb3MsIHJheURpciwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gZiBpZiBmID49IDAuMCBhbmQgZiA8IG1pbl9mXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZGlzcGxheUxpZ2h0czogKCkgLT5cbiAgICAgICAgZm9yIGxpZ2h0IGluIEBsaWdodHNcbiAgICAgICAgICAgIGxpZ250LmRpc3BsYXkoKVxuICAgICAgICAgICAgICAgXG4gICAgcGxheVNvdW5kOiAoc291bmQsIHBvcywgdGltZSkgLT4gU291bmQucGxheSBzb3VuZCwgcG9zLCB0aW1lIGlmIG5vdCBAY3JlYXRpbmdcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMDAwIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgIDAwMDAwICBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgQG1lbnU/ICAgICAgICAgICAgXG4gICAgICAgICAgICBAbWVudS5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICBcbiAgICAgICAgQHRleHQ/LmZhZGVPdXQoKVxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBzd2l0Y2ggY29tYm9cbiAgICAgICAgICAgIHdoZW4gJ2VzYycgdGhlbiBAc2hvd01lbnUoKVxuICAgICAgICAgICAgd2hlbiAnPScgdGhlbiBAc3BlZWQgPSBNYXRoLm1pbiAxMCwgQHNwZWVkKzFcbiAgICAgICAgICAgIHdoZW4gJy0nIHRoZW4gQHNwZWVkID0gTWF0aC5tYXggMSwgIEBzcGVlZC0xXG4gICAgICAgICAgICB3aGVuICdyJyB0aGVuIEByZXN0YXJ0KClcbiAgICAgICAgICAgIHdoZW4gJ24nIHRoZW4gQGV4aXRMZXZlbCgpXG4gICAgICAgICAgICB3aGVuICdtJyB0aGVuIEBleGl0TGV2ZWwgNVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnRVcCBtb2QsIGtleSwgY29tYm8sIGV2ZW50ICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZFxuXG4iXX0=
//# sourceURL=../coffee/world.coffee