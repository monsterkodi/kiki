// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, LevelSelection, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, kerror, klog, last, now, post, prefs, randInt, ref, ref1, world,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), post = ref.post, randInt = ref.randInt, colors = ref.colors, absMin = ref.absMin, prefs = ref.prefs, clamp = ref.clamp, last = ref.last, kerror = ref.kerror, klog = ref.klog, _ = ref._;

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
        this.resized = bind(this.resized, this);
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
        var index;
        if (world != null) {
            return;
        }
        this.initGlobal();
        world = new World(view);
        world.name = 'world';
        index = prefs.get('level', 0);
        world.create(this.levels.list[index]);
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

    World.prototype.create = function(worldDict, showName) {
        var entry, exitAction, exit_gate, exit_id, len, m, pos, ref2, ref3, ref4, ref5;
        if (worldDict == null) {
            worldDict = {};
        }
        if (showName == null) {
            showName = true;
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
        if (!this.preview) {
            prefs.set('level', this.level_index);
        }
        this.creating = true;
        this.setSize(this.dict.size);
        this.applyScheme((ref2 = this.dict.scheme) != null ? ref2 : 'default');
        if (!this.preview && showName) {
            this.text = new ScreenText(this.dict.name);
        }
        if (this.dict.exits != null) {
            exit_id = 0;
            ref3 = this.dict.exits;
            for (m = 0, len = ref3.length; m < len; m++) {
                entry = ref3[m];
                exit_gate = new Gate(entry["active"]);
                exit_gate.name = (ref4 = entry["name"]) != null ? ref4 : "exit " + exit_id;
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
        this.player.setOrientation((ref5 = this.dict.player.orientation) != null ? ref5 : rotx90);
        this.player.camera.setOrientation(this.player.orientation);
        if (this.dict.player.position != null) {
            this.addObjectAtPos(this.player, this.decenter(this.dict.player.position));
        } else if (this.dict.player.coordinates != null) {
            this.addObjectAtPos(this.player, new Pos(this.dict.player.coordinates));
        }
        if (this.preview) {
            this.player.camera.setPosition(this.player.currentPos().minus(this.player.direction));
            this.setCameraMode(Camera.FOLLOW);
        } else {
            this.player.camera.setPosition(this.player.currentPos());
            if (this.dict.camera === 'inside') {
                this.setCameraMode(Camera.INSIDE);
            }
        }
        return this.creating = false;
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

    World.prototype.step = function() {
        var camera, len, m, o, ref2, ref3;
        if (this.levelSelection) {
            this.levelSelection.step();
            return;
        }
        camera = (ref2 = this.player) != null ? ref2.camera.cam : void 0;
        Timer.triggerActions();
        Timer.finishActions();
        ref3 = this.objects;
        for (m = 0, len = ref3.length; m < len; m++) {
            o = ref3[m];
            if (typeof o.step === "function") {
                o.step();
            }
        }
        if (this.player) {
            this.stepPlayer();
        }
        if (this.preview) {
            this.renderer.setViewport(0, Math.floor(this.screenSize.h * 0.72), this.screenSize.w, Math.floor(this.screenSize.h * 0.3));
        }
        if (this.text) {
            this.renderer.render(this.text.scene, this.text.camera);
        }
        if (this.menu) {
            return this.renderer.render(this.menu.scene, this.menu.camera);
        }
    };

    World.prototype.stepPlayer = function() {
        var d, len, len1, m, n, o, order, ref2, stone, stones;
        if (this.preview) {
            this.player.camera.cam.aspect = this.screenSize.w / (this.screenSize.h * 0.66);
        }
        this.player.camera.step();
        Sound.setMatrix(this.player.camera);
        this.player.setOpacity(clamp(0, 1, this.player.camera.getPosition().minus(this.player.current_position).length() - 0.4));
        stones = [];
        ref2 = this.objects;
        for (m = 0, len = ref2.length; m < len; m++) {
            o = ref2[m];
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
        for (n = 0, len1 = stones.length; n < len1; n++) {
            stone = stones[n];
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
        this.sun.position.copy(this.player.camera.cam.position);
        this.renderer.autoClearColor = false;
        if (this.preview) {
            this.renderer.setViewport(0, 0, this.screenSize.w, Math.floor(this.screenSize.h * 0.66));
        }
        return this.renderer.render(this.scene, this.player.camera.cam);
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
        var camera, ref2, ref3, ref4, ref5, ref6;
        this.aspect = w / h;
        this.screenSize = new Size(w, h);
        camera = (ref2 = this.player) != null ? ref2.camera.cam : void 0;
        if (camera != null) {
            camera.aspect = this.aspect;
        }
        if (camera != null) {
            camera.updateProjectionMatrix();
        }
        if ((ref3 = this.renderer) != null) {
            ref3.setSize(w, h);
        }
        if ((ref4 = this.text) != null) {
            ref4.resized(w, h);
        }
        if ((ref5 = this.menu) != null) {
            ref5.resized(w, h);
        }
        return (ref6 = this.levelSelection) != null ? ref6.resized(w, h) : void 0;
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
        outro_text = "congratulations!\n\nyou rescued\nthe nano world!\n\nthe last dumb mutant bot\nhas been destroyed.\n\nthe maker is functioning again.\nkiki will go now\nand see all his new friends.\n\nyou should maybe\ndo the same?\nthe maker wants to thank you!\n\n(btw.: you thought\nyou didn't see\nkiki's maker in the game?\nyou are wrong!\nyou saw him\nall the time,\nbecause kiki\nlives inside him!)\n\nthe end\np.s.: the maker of the game\nwants to thank you as well!\n\ni definitely want your feedback:\nplease send me a mail (monsterkodi@gmx.net)\nwith your experiences,\nwhich levels you liked, etc.\n\nthanks in advance and have a nice day,\n\nyours kodi";
        more_text = index < outro_text.length - 1;
        less_text = index > 0;
        page_text = outro_text[index];
        page_text += "\n\n" + (index + 1) + "/" + outro_text.length;
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

    World.prototype.showMenu = function(self) {
        this.menu = new Menu();
        this.menu.addItem('load', this.showLevels);
        this.menu.addItem('reset', this.restart);
        this.menu.addItem('help', this.showHelp);
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
            results.push(light.display());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLDZWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLGNBQUEsR0FBaUIsT0FB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VSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7ZUFFaEMsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJO0lBM0NMOztvQkE2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RVMsR0FGVDt1QkFFa0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxJQUFDLENBQUEsS0FBRCxHQUFPLENBQXBCO0FBRjNCLGlCQUdTLEdBSFQ7dUJBR2tCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQWEsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFwQjtBQUgzQixpQkFJUyxHQUpUO3VCQUlrQixJQUFDLENBQUEsT0FBRCxDQUFBO0FBSmxCLGlCQUtTLEdBTFQ7dUJBS2tCLElBQUMsQ0FBQSxTQUFELENBQUE7QUFMbEIsaUJBTVMsR0FOVDt1QkFNa0IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYO0FBTmxCO0lBWmtCOztvQkFvQnRCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBRWhCLFlBQUE7UUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsbUJBQUE7O1FBQ0EsdUNBQWlCLENBQUUsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsS0FBdEMsRUFBNkMsS0FBN0MsVUFBVjtBQUFBOztJQUhnQjs7OztHQXIzQko7O0FBMDNCcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICBcbiMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwICBcblxueyBwb3N0LCByYW5kSW50LCBjb2xvcnMsIGFic01pbiwgcHJlZnMsIGNsYW1wLCBsYXN0LCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5TaXplICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3NpemUnXG5DZWxsICAgICAgICA9IHJlcXVpcmUgJy4vY2VsbCdcbkdhdGUgICAgICAgID0gcmVxdWlyZSAnLi9nYXRlJ1xuQ2FtZXJhICAgICAgPSByZXF1aXJlICcuL2NhbWVyYSdcbkxpZ2h0ICAgICAgID0gcmVxdWlyZSAnLi9saWdodCdcbkxldmVscyAgICAgID0gcmVxdWlyZSAnLi9sZXZlbHMnXG5QbGF5ZXIgICAgICA9IHJlcXVpcmUgJy4vcGxheWVyJ1xuU291bmQgICAgICAgPSByZXF1aXJlICcuL3NvdW5kJ1xuQ2FnZSAgICAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5UaW1lciAgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5BY3RvciAgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5JdGVtICAgICAgICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiAgICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NZW51ICAgICAgICA9IHJlcXVpcmUgJy4vbWVudSdcblNjcmVlblRleHQgID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcblB1c2hhYmxlICAgID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbk1hdGVyaWFsICAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblNjaGVtZSAgICAgID0gcmVxdWlyZSAnLi9zY2hlbWUnXG5MZXZlbFNlbGVjdGlvbiA9IHJlcXVpcmUgJy4vbGV2ZWxzZWxlY3Rpb24nXG5RdWF0ZXJuaW9uICA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5WZWN0b3IgICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xubm93ICAgICAgICAgPSByZXF1aXJlKCdwZXJmX2hvb2tzJykucGVyZm9ybWFuY2Uubm93XG57XG5XYWxsLFxuV2lyZSxcbkdlYXIsXG5TdG9uZSxcblN3aXRjaCxcbk1vdG9yR2Vhcixcbk1vdG9yQ3lsaW5kZXIsXG5GYWNlfSAgICAgICA9IHJlcXVpcmUgJy4vaXRlbXMnXG5cbndvcmxkICAgICAgID0gbnVsbFxuXG5jbGFzcyBXb3JsZCBleHRlbmRzIEFjdG9yXG4gICAgXG4gICAgQGxldmVscyA9IG51bGxcbiAgICBcbiAgICBAbm9ybWFscyA9IFtcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMSwgMCwgMFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAxLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLCAxXG4gICAgICAgICAgICBuZXcgVmVjdG9yIC0xLDAsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsLTEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsLTFcbiAgICBdXG4gICAgXG4gICAgQDogKEB2aWV3LCBAcHJldmlldykgLT5cbiAgICAgICAgICAgICBcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gQFxuICAgICAgICBcbiAgICAgICAgQHNwZWVkICAgICAgPSA2XG4gICAgICAgIFxuICAgICAgICBAcmFzdGVyU2l6ZSA9IDAuMDVcblxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQG5vUm90YXRpb25zID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuICAgICAgICAjIGtsb2cgXCJ2aWV3IEBzY3JlZW5TaXplOlwiLCBAc2NyZWVuU2l6ZVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgXG4gICAgICAgICAgICBhbnRpYWxpYXM6ICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyOiBmYWxzZVxuICAgICAgICAgICAgYXV0b0NsZWFyOiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIHNvcnRPYmplY3RzOiAgICAgICAgICAgIHRydWVcblxuICAgICAgICBAcmVuZGVyZXIuc2V0U2l6ZSBAdmlldy5vZmZzZXRXaWR0aCwgQHZpZXcub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgICAgICAjICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICBcbiAgICAgICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICAgICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG4gICAgICAgIEBzdW4gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZlxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSBpZiBAcGxheWVyP1xuICAgICAgICBAc2NlbmUuYWRkIEBzdW5cbiAgICAgICAgXG4gICAgICAgIEBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCAweDExMTExMVxuICAgICAgICBAc2NlbmUuYWRkIEBhbWJpZW50XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICBAb2JqZWN0cyA9IFtdXG4gICAgICAgIEBsaWdodHMgID0gW11cbiAgICAgICAgQGNlbGxzICAgPSBbXSBcbiAgICAgICAgQHNpemUgICAgPSBuZXcgUG9zKClcbiAgICAgICAgQGRlcHRoICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgICAgXG4gICAgICAgIEB0aW1lciA9IG5ldyBUaW1lciBAXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXJlci5kb21FbGVtZW50XG4gICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiB3b3JsZD9cbiAgICAgICAgXG4gICAgICAgIEBpbml0R2xvYmFsKClcbiAgICAgICAgICAgIFxuICAgICAgICB3b3JsZCA9IG5ldyBXb3JsZCB2aWV3XG4gICAgICAgIHdvcmxkLm5hbWUgPSAnd29ybGQnXG4gICAgICAgIGluZGV4ID0gcHJlZnMuZ2V0ICdsZXZlbCcgMFxuICAgICAgICB3b3JsZC5jcmVhdGUgQGxldmVscy5saXN0W2luZGV4XVxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9LCBzaG93TmFtZT10cnVlKSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuY3JlYXRlXCIgd29ybGREaWN0XG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBwcmVmcy5zZXQgJ2xldmVsJyBAbGV2ZWxfaW5kZXhcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIldvcmxkLmNyZWF0ZSAje0BsZXZlbF9pbmRleH0gc2l6ZTogI3tuZXcgUG9zKEBkaWN0W1wic2l6ZVwiXSkuc3RyKCl9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gJyN7QGxldmVsX25hbWV9JyBzY2hlbWU6ICcje0BkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J30nXCJcblxuICAgICAgICBAY3JlYXRpbmcgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFNpemUgQGRpY3Quc2l6ZSAjIHRoaXMgcmVtb3ZlcyBhbGwgb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQGFwcGx5U2NoZW1lIEBkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGludHJvIHRleHQgICBcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlldyBhbmQgc2hvd05hbWVcbiAgICAgICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3QubmFtZVxuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXhpdHNcblxuICAgICAgICBpZiBAZGljdC5leGl0cz9cbiAgICAgICAgICAgIGV4aXRfaWQgPSAwXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gQGRpY3QuZXhpdHNcbiAgICAgICAgICAgICAgICBleGl0X2dhdGUgPSBuZXcgR2F0ZSBlbnRyeVtcImFjdGl2ZVwiXVxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5uYW1lID0gZW50cnlbXCJuYW1lXCJdID8gXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgIEFjdGlvbi5pZCA/PSAwXG4gICAgICAgICAgICAgICAgZXhpdEFjdGlvbiA9IG5ldyBBY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgIEFjdGlvbi5pZFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBAZXhpdExldmVsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5nZXRFdmVudFdpdGhOYW1lKFwiZW50ZXJcIikuYWRkQWN0aW9uIGV4aXRBY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBlbnRyeS5wb3NpdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gQGRlY2VudGVyIGVudHJ5LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlbnRyeS5jb29yZGluYXRlcz9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV3IFBvcyBlbnRyeS5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBleGl0X2dhdGUsIHBvc1xuICAgICAgICAgICAgICAgIGV4aXRfaWQgKz0gMVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNyZWF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QuY3JlYXRlP1xuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIEBkaWN0LmNyZWF0ZVxuICAgICAgICAgICAgICAgIEBkaWN0LmNyZWF0ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAga2xvZyBcIldvcmxkLmNyZWF0ZSBbV0FSTklOR10gQGRpY3QuY3JlYXRlIG5vdCBhIGZ1bmN0aW9uIVwiXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gcGxheWVyXG5cbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXJcblxuICAgICAgICBAcGxheWVyLnNldE9yaWVudGF0aW9uIEBkaWN0LnBsYXllci5vcmllbnRhdGlvbiA/IHJvdHg5MFxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRPcmllbnRhdGlvbiBAcGxheWVyLm9yaWVudGF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QucGxheWVyLnBvc2l0aW9uP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIEBkZWNlbnRlciBAZGljdC5wbGF5ZXIucG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgbmV3IFBvcyBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXNcblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKCkubWludXMgQHBsYXllci5kaXJlY3Rpb25cbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5GT0xMT1dcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5JTlNJREUgaWYgQGRpY3QuY2FtZXJhID09ICdpbnNpZGUnXG4gICAgICAgIFxuICAgICAgICBAY3JlYXRpbmcgPSBmYWxzZVxuICAgIFxuICAgIHJlc3RhcnQ6ID0+IEBjcmVhdGUgQGRpY3RcblxuICAgIGZpbmlzaDogKCkgLT4gIyBUT0RPOiBzYXZlIHByb2dyZXNzXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgYXBwbHlTY2hlbWU6IChzY2hlbWUpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIGNvbG9ycyA9IF8uY2xvbmUgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIG9wYWNpdHkgPVxuICAgICAgICAgICAgc3RvbmU6IDAuN1xuICAgICAgICAgICAgYm9tYjogIDAuOVxuICAgICAgICAgICAgdGV4dDogIDBcbiAgICAgICAgICAgIFxuICAgICAgICBzaGluaW5lc3MgPSBcbiAgICAgICAgICAgIHRpcmU6ICAgNFxuICAgICAgICAgICAgcGxhdGU6ICAxMFxuICAgICAgICAgICAgcmFzdGVyOiAyMFxuICAgICAgICAgICAgd2FsbDogICAyMFxuICAgICAgICAgICAgc3RvbmU6ICAyMFxuICAgICAgICAgICAgZ2VhcjogICAyMFxuICAgICAgICAgICAgdGV4dDogICAyMDBcbiAgICAgICAgICAgIFxuICAgICAgICBjb2xvcnMucGxhdGUuZW1pc3NpdmUgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMud2FsbCA/PSB7fVxuICAgICAgICBjb2xvcnMud2FsbC5jb2xvciA/PSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzLnBsYXRlLmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjZcbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZSA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGZvciBrLHYgb2YgY29sb3JzXG4gICAgICAgICAgICBtYXQgPSBNYXRlcmlhbFtrXVxuICAgICAgICAgICAgbWF0LmNvbG9yICAgID0gdi5jb2xvclxuICAgICAgICAgICAgbWF0Lm9wYWNpdHkgID0gdi5vcGFjaXR5ID8gb3BhY2l0eVtrXSA/IDFcbiAgICAgICAgICAgIG1hdC5zcGVjdWxhciA9IHYuc3BlY3VsYXIgPyBuZXcgVEhSRUUuQ29sb3Iodi5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC4yXG4gICAgICAgICAgICBtYXQuZW1pc3NpdmUgPSB2LmVtaXNzaXZlID8gbmV3IFRIUkVFLkNvbG9yIDAsMCwwXG4gICAgICAgICAgICBpZiBzaGluaW5lc3Nba10/XG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IHYuc2hpbmluZXNzID8gc2hpbmluZXNzW2tdXG5cbiAgICAjICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgQGVuYWJsZVNoYWRvd3MgdHJ1ZSBpZiBsaWdodC5zaGFkb3dcbiAgICAgICAgXG4gICAgcmVtb3ZlTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIGxpZ2h0XG4gICAgICAgIGZvciBsIGluIEBsaWdodHNcbiAgICAgICAgICAgIHNoYWRvdyA9IHRydWUgaWYgbC5zaGFkb3dcbiAgICAgICAgQGVuYWJsZVNoYWRvd3Mgc2hhZG93XG5cbiAgICBlbmFibGVTaGFkb3dzOiAoZW5hYmxlKSAtPlxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBlbmFibGVcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICAgICAgIFxuICAgIGV4aXRMZXZlbDogKGFjdGlvbikgPT5cbiAgICAgICAgXG4gICAgICAgIEBmaW5pc2goKVxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgQGRlbGV0ZUFsbE9iamVjdHMoKVxuICAgICAgICBAY2VsbHMgPSBbXVxuICAgICAgICBAc2l6ZSA9IG5ldyBQb3Mgc2l6ZVxuICAgICAgICAjIGNhbGN1YXRlIG1heCBkaXN0YW5jZSAoZm9yIHBvc2l0aW9uIHJlbGF0aXZlIHNvdW5kKVxuICAgICAgICBAbWF4X2Rpc3RhbmNlID0gTWF0aC5tYXgoQHNpemUueCwgTWF0aC5tYXgoQHNpemUueSwgQHNpemUueikpICAjIGhldXJpc3RpYyBvZiBhIGhldXJpc3RpYyA6LSlcbiAgICAgICAgQGNhZ2U/LmRlbCgpXG4gICAgICAgIEBjYWdlID0gbmV3IENhZ2UgQHNpemUsIEByYXN0ZXJTaXplXG5cbiAgICBnZXRDZWxsQXRQb3M6IChwb3MpIC0+IHJldHVybiBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gaWYgQGlzVmFsaWRQb3MgcG9zXG4gICAgZ2V0Qm90QXRQb3M6ICAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgQm90LCBuZXcgUG9zIHBvc1xuXG4gICAgcG9zVG9JbmRleDogICAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCAqIEBzaXplLnogKiBAc2l6ZS55ICsgcC55ICogQHNpemUueiArIHAuelxuICAgICAgICBcbiAgICBpbmRleFRvUG9zOiAgIChpbmRleCkgLT4gXG4gICAgICAgIGxzaXplID0gQHNpemUueiAqIEBzaXplLnlcbiAgICAgICAgbHJlc3QgPSBpbmRleCAlIGxzaXplXG4gICAgICAgIG5ldyBQb3MgaW5kZXgvbHNpemUsIGxyZXN0L0BzaXplLnosIGxyZXN0JUBzaXplLnpcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkT2JqZWN0QXRQb3M6IChvYmplY3QsIHgsIHksIHopIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgeCwgeSwgelxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0QXRQb3MgI3tvYmplY3QubmFtZX1cIiwgcG9zXG4gICAgICAgIEBhZGRPYmplY3Qgb2JqZWN0XG5cbiAgICBhZGRPYmplY3RMaW5lOiAob2JqZWN0LCBzeCxzeSxzeiwgZXgsZXksZXopIC0+XG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBpZiBzeCBpbnN0YW5jZW9mIFBvcyBvciBBcnJheS5pc0FycmF5IHN4XG4gICAgICAgICAgICBzdGFydCA9IHN4XG4gICAgICAgICAgICBlbmQgICA9IHN5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IFBvcyBzeCxzeSxzelxuICAgICAgICAgICAgZW5kICAgPSBuZXcgUG9zIGV4LGV5LGV6XG4gICAgICAgICMgYWRkcyBhIGxpbmUgb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gc3RhcnQgYW5kIGVuZCBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgZW5kIGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBlbmQgPSBbZW5kLngsIGVuZC55LCBlbmQuel1cbiAgICAgICAgW2V4LCBleSwgZXpdID0gZW5kXG5cbiAgICAgICAgaWYgc3RhcnQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIHN0YXJ0ID0gW3N0YXJ0LngsIHN0YXJ0LnksIHN0YXJ0LnpdXG4gICAgICAgIFtzeCwgc3ksIHN6XSA9IHN0YXJ0XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgXG4gICAgICAgIGRpZmYgPSBbZXgtc3gsIGV5LXN5LCBlei1zel1cbiAgICAgICAgbWF4ZGlmZiA9IF8ubWF4IGRpZmYubWFwIE1hdGguYWJzXG4gICAgICAgIGRlbHRhcyA9IGRpZmYubWFwIChhKSAtPiBhL21heGRpZmZcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5tYXhkaWZmXVxuICAgICAgICAgICAgIyBwb3MgPSBhcHBseShQb3MsIChtYXAgKGxhbWJkYSBhLCBiOiBpbnQoYStpKmIpLCBzdGFydCwgZGVsdGFzKSkpXG4gICAgICAgICAgICBwb3MgPSBuZXcgUG9zIChzdGFydFtqXStpKmRlbHRhc1tqXSBmb3IgaiBpbiBbMC4uMl0pXG4gICAgICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RMaW5lICN7aX06XCIsIHBvc1xuICAgICAgICAgICAgaWYgQGlzVW5vY2N1cGllZFBvcyBwb3NcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICBcbiAgICBhZGRPYmplY3RQb2x5OiAob2JqZWN0LCBwb2ludHMsIGNsb3NlPXRydWUpIC0+XG4gICAgICAgICMgYWRkcyBhIHBvbHlnb24gb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gcG9pbnRzIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBjbG9zZVxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggcG9pbnRzWzBdXG4gICAgICAgIGZvciBpbmRleCBpbiBbMS4uLnBvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBAYWRkT2JqZWN0TGluZSBvYmplY3QsIHBvaW50c1tpbmRleC0xXSwgcG9pbnRzW2luZGV4XVxuICAgICAgIFxuICAgIGFkZE9iamVjdFJhbmRvbTogKG9iamVjdCwgbnVtYmVyKSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBmb3IgaSBpbiBbMC4uLm51bWJlcl1cbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIG9iamVjdCgpXG4gICAgICAgIFxuICAgIHNldE9iamVjdFJhbmRvbTogKG9iamVjdCkgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgb2JqZWN0U2V0ID0gZmFsc2VcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgd2hpbGUgbm90IG9iamVjdFNldCAjIGhhY2sgYWxlcnQhXG4gICAgICAgICAgICByYW5kb21Qb3MgPSBuZXcgUG9zIHJhbmRJbnQoQHNpemUueCksIHJhbmRJbnQoQHNpemUueSksIHJhbmRJbnQoQHNpemUueilcbiAgICAgICAgICAgIGlmIG5vdCBvYmplY3QuaXNTcGFjZUVnb2lzdGljKCkgb3IgQGlzVW5vY2N1cGllZFBvcyByYW5kb21Qb3MgXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcmFuZG9tUG9zXG4gICAgICAgICAgICAgICAgb2JqZWN0U2V0ID0gdHJ1ZVxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAgICAgIChjbHNzKSAgICAgIC0+IEBvYmplY3RzLmZpbHRlciAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPYmplY3RzT2ZUeXBlQXRQb3M6IChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2JqZWN0c09mVHlwZShjbHNzKSA/IFtdXG4gICAgZ2V0T2JqZWN0T2ZUeXBlQXRQb3M6ICAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldFJlYWxPYmplY3RPZlR5cGUoY2xzcylcbiAgICBnZXRPY2N1cGFudEF0UG9zOiAgICAgICAgICAgIChwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2NjdXBhbnQoKVxuICAgIGdldFJlYWxPY2N1cGFudEF0UG9zOiAocG9zKSAtPlxuICAgICAgICBvY2N1cGFudCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICBpZiBvY2N1cGFudCBhbmQgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgIG9jY3VwYW50Lm9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvY2N1cGFudFxuICAgIHN3aXRjaEF0UG9zOiAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgU3dpdGNoLCBwb3NcbiAgICBzZXRPYmplY3RBdFBvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGludmFsaWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBvYmplY3QuaXNTcGFjZUVnb2lzdGljKClcbiAgICAgICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50ID0gY2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudC50aW1lID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgdGltZTpcIiwgb2NjdXBhbnQudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQuZGVsKCkgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYW55d2F5IC4gZGVsZXRlIGl0XG4gICAgICAgIFxuICAgICAgICBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgbm90IGNlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleChwb3MpXG4gICAgICAgICAgICBjZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSBjZWxsXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgICMgZWxzZSBcbiAgICAgICAgICAgICMga2xvZyAnd29ybGQudW5zZXRPYmplY3QgW1dBUk5JTkddIG5vIGNlbGwgYXQgcG9zOicsIHBvc1xuXG4gICAgbmV3T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgaWYgb2JqZWN0LnN0YXJ0c1dpdGggJ25ldydcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICByZXR1cm4gbmV3IChyZXF1aXJlIFwiLi8je29iamVjdC50b0xvd2VyQ2FzZSgpfVwiKSgpXG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIEl0ZW1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCgpXG4gICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgTGlnaHRcbiAgICAgICAgICAgIEBsaWdodHMucHVzaCBvYmplY3QgIyBpZiBsaWdodHMuaW5kZXhPZihvYmplY3QpIDwgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdCAjIGlmIG9iamVjdHMuaW5kZXhPZihvYmplY3QpIDwgMCBcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgbW92ZU9iamVjdFRvUG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zKHBvcykgb3IgQGlzT2NjdXBpZWRQb3MocG9zKVxuICAgICAgICBAdW5zZXRPYmplY3QgICAgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICB0cnVlXG4gICAgICAgIFxuICAgIHRvZ2dsZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIG9iamVjdCA9IEBnZXRPYmplY3RXaXRoTmFtZSBvYmplY3ROYW1lIFxuICAgICAgICBvYmplY3QuZ2V0QWN0aW9uV2l0aE5hbWUoXCJ0b2dnbGVcIikucGVyZm9ybSgpXG4gICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGRlbGV0ZUFsbE9iamVjdHM6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFsbEFjdGlvbnMoKVxuICAgIFxuICAgICAgICBpZiBAcGxheWVyP1xuICAgICAgICAgICAgQHBsYXllci5kZWwoKVxuICAgIFxuICAgICAgICB3aGlsZSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBsaWdodHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBsaWdodCBubyBhdXRvIHJlbW92ZVwiXG4gICAgICAgICAgICAgICAgQGxpZ2h0cy5wb3AoKVxuICAgIFxuICAgICAgICB3aGlsZSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQG9iamVjdHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgb2JqZWN0IG5vIGF1dG8gcmVtb3ZlICN7bGFzdChAb2JqZWN0cykubmFtZX1cIlxuICAgICAgICAgICAgICAgIEBvYmplY3RzLnBvcCgpXG4gICAgXG4gICAgZGVsZXRlT2JqZWN0c1dpdGhDbGFzc05hbWU6IChjbGFzc05hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIF8uY2xvbmUgQG9iamVjdHNcbiAgICAgICAgICAgIGlmIGNsYXNzTmFtZSA9PSBvLmdldENsYXNzTmFtZSgpXG4gICAgICAgICAgICAgICAgby5kZWwoKVxuICAgIFxuICAgIGdldE9iamVjdFdpdGhOYW1lOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdE5hbWUgPT0gby5uYW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAga2Vycm9yIFwiV29ybGQuZ2V0T2JqZWN0V2l0aE5hbWUgW1dBUk5JTkddIG5vIG9iamVjdCB3aXRoIG5hbWUgI3tvYmplY3ROYW1lfVwiXG4gICAgICAgIG51bGxcbiAgICBcbiAgICBzZXRDYW1lcmFNb2RlOiAobW9kZSkgLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IGNsYW1wIENhbWVyYS5JTlNJREUsIENhbWVyYS5GT0xMT1csIG1vZGVcbiAgICBcbiAgICBjaGFuZ2VDYW1lcmFNb2RlOiAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gKEBwbGF5ZXIuY2FtZXJhLm1vZGUrMSkgJSAoQ2FtZXJhLkZPTExPVysxKVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgIDAgICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBvYmplY3RXaWxsTW92ZVRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zICN7b2JqZWN0Lm5hbWV9ICN7ZHVyYXRpb259XCIsIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgc291cmNlUG9zLmVxbCB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGVxdWFsIHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiB0YXJnZXRDZWxsXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyA9IHRhcmdldENlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zLnRpbWUgPCAwIGFuZCAtb2JqZWN0QXROZXdQb3MudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXROZXdQb3MuZGVsKClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gdGltaW5nIGNvbmZsaWN0IGF0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBhbHJlYWR5IG9jY3VwaWVkOlwiLCB0YXJnZXRQb3MgXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5uYW1lICE9ICdwbGF5ZXInXG4gICAgICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0ICMgcmVtb3ZlIG9iamVjdCBmcm9tIGNlbGwgZ3JpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG9sZCBwb3MnLCBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG9sZCBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gLWR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCBzb3VyY2VQb3MgXG5cbiAgICAgICAgICAgICMga2xvZyAnd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyB0bXBPYmplY3QgYXQgbmV3IHBvcycsIHRhcmdldFBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBzb3VyY2VQb3MgPSBuZXcgUG9zIGZyb21cbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyB0b1xuXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQub2JqZWN0TW92ZWQgI3ttb3ZlZE9iamVjdC5uYW1lfVwiLCBzb3VyY2VQb3NcbiAgICAgICAgXG4gICAgICAgIHNvdXJjZUNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHNvdXJjZVBvc1xuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHNvdXJjZUNlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHRhcmdldENlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc09jY3VwaWVkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gb2NjdXBpZWQgdGFyZ2V0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc291cmNlQ2VsbD9cbiAgICAgICAgICAgIHNvdXJjZUNlbGwucmVtb3ZlT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBpZiBzb3VyY2VDZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChzb3VyY2VQb3MpXSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvcyAgICBcbiAgICAgICAgaWYgbm90IHRhcmdldENlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0YXJnZXRDZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSB0YXJnZXRDZWxsXG5cbiAgICAgICAgaWYgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIHRhcmdldENlbGwuYWRkT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG5vIHRhcmdldCBjZWxsP1wiXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgICAgIFxuICAgIFxuICAgIHN0ZXA6IC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgICAgIEBsZXZlbFNlbGVjdGlvbi5zdGVwKClcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICBcbiAgICAgICAgVGltZXIudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllciB0aGVuIEBzdGVwUGxheWVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuNzIpLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4zKVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBtZW51LnNjZW5lLCBAbWVudS5jYW1lcmEgaWYgQG1lbnVcblxuICAgIHN0ZXBQbGF5ZXI6IC0+XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLmNhbS5hc3BlY3QgPSBAc2NyZWVuU2l6ZS53IC8gKEBzY3JlZW5TaXplLmgqMC42NilcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc3RlcCgpXG5cbiAgICAgICAgU291bmQuc2V0TWF0cml4IEBwbGF5ZXIuY2FtZXJhXG4gICAgICAgICAgICBcbiAgICAgICAgQHBsYXllci5zZXRPcGFjaXR5IGNsYW1wIDAsIDEsIEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkubWludXMoQHBsYXllci5jdXJyZW50X3Bvc2l0aW9uKS5sZW5ndGgoKS0wLjRcbiAgICAgICAgXG4gICAgICAgIHN0b25lcyA9IFtdXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvIGluc3RhbmNlb2YgU3RvbmVcbiAgICAgICAgICAgICAgICBzdG9uZXMucHVzaCBvXG4gICAgICAgIHN0b25lcy5zb3J0IChhLGIpID0+IGIucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKCkgLSBhLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgIFxuICAgICAgICBvcmRlciA9IDEwMFxuICAgICAgICBmb3Igc3RvbmUgaW4gc3RvbmVzXG4gICAgICAgICAgICBzdG9uZS5tZXNoLnJlbmRlck9yZGVyID0gb3JkZXJcbiAgICAgICAgICAgIG9yZGVyICs9IDFcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZCA9IHN0b25lLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgICAgICBpZiBkIDwgMS4wXG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgaWYgbm90IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IDAuMiArIGQgKiAwLjVcbiAgICAgICAgICAgIGVsc2UgaWYgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5jYW0ucG9zaXRpb25cbiAgICAgICAgQHJlbmRlcmVyLmF1dG9DbGVhckNvbG9yID0gZmFsc2VcblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHJlbmRlcmVyLnNldFZpZXdwb3J0IDAsIDAsIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IgQHNjcmVlblNpemUuaCowLjY2XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBzY2VuZSwgQHBsYXllci5jYW1lcmEuY2FtICAgICAgICBcbiAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBnZXRUaW1lOiAtPiBub3coKS50b0ZpeGVkIDBcbiAgICBzZXRTcGVlZDogKHMpIC0+IEBzcGVlZCA9IHNcbiAgICBnZXRTcGVlZDogLT4gQHNwZWVkXG4gICAgbWFwTXNUaW1lOiAgKHVubWFwcGVkKSAtPiBwYXJzZUludCAxMC4wICogdW5tYXBwZWQvQHNwZWVkXG4gICAgdW5tYXBNc1RpbWU6IChtYXBwZWQpIC0+IHBhcnNlSW50IG1hcHBlZCAqIEBzcGVlZC8xMC4wXG4gICAgICAgIFxuICAgIGNvbnRpbnVvdXM6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcImNvbnRpbnVvdXNcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLkNPTlRJTlVPVVNcblxuICAgIG9uY2U6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcIm9uY2VcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIHJlc2l6ZWQ6ICh3LGgpID0+XG4gICAgICAgIFxuICAgICAgICBAYXNwZWN0ID0gdy9oXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgdyxoXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICAgICAgY2FtZXJhPy5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIGNhbWVyYT8udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIEByZW5kZXJlcj8uc2V0U2l6ZSB3LGhcbiAgICAgICAgQHRleHQ/LnJlc2l6ZWQgdyxoXG4gICAgICAgIEBtZW51Py5yZXNpemVkIHcsaFxuICAgICAgICBcbiAgICAgICAgQGxldmVsU2VsZWN0aW9uPy5yZXNpemVkIHcsaFxuXG4gICAgZ2V0TmVhcmVzdFZhbGlkUG9zOiAocG9zKSAtPlxuICAgICAgICBuZXcgUG9zIE1hdGgubWluKEBzaXplLngtMSwgTWF0aC5tYXgocG9zLngsIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUueS0xLCBNYXRoLm1heChwb3MueSwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS56LTEsIE1hdGgubWF4KHBvcy56LCAwKSlcbiAgICBcbiAgICBpc1Vub2NjdXBpZWRQb3M6IChwb3MpIC0+IG5vdCBAaXNPY2N1cGllZFBvcyBwb3NcbiAgICBpc09jY3VwaWVkUG9zOiAgIChwb3MpIC0+ICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGlmIEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAgICAgIyBrbG9nIFwiaXNPY2N1cGllZFBvcyBvY2N1cGFudDogI3tAZ2V0T2NjdXBhbnRBdFBvcyhwb3MpLm5hbWV9IGF0IHBvczpcIiwgbmV3IFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgbWF5T2JqZWN0UHVzaFRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3Mgb2JqZWN0OiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCIsIHBvc1xuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgIyBrbG9nIFwicHVzaGFibGVPYmplY3QgI3twdXNoYWJsZU9iamVjdD8ubmFtZX1cIlxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGUgI2FuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgTW90b3JHZWFyICMgYmFkXG4gICAgICAgICAgICBwdXNoYWJsZU9iamVjdC5wdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uIG9iamVjdCwgZGlyZWN0aW9uLCBkdXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICAgICAgZmFsc2VcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIHNob3dIZWxwOiA9PlxuXG4gICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuXG4gICAgb3V0cm86IChpbmRleD0wKSAtPlxuICAgICAgICAjIHdlbGwgaGlkZGVuIG91dHJvIDotKVxuICAgICAgICBvdXRyb190ZXh0ID0gXCJcIlwiXG4gICAgICAgICAgICAgICAgICAgIGNvbmdyYXR1bGF0aW9ucyFcXG5cXG55b3UgcmVzY3VlZFxcbnRoZSBuYW5vIHdvcmxkIVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhlIGxhc3QgZHVtYiBtdXRhbnQgYm90XFxuaGFzIGJlZW4gZGVzdHJveWVkLlxcblxcbnRoZSBtYWtlciBpcyBmdW5jdGlvbmluZyBhZ2Fpbi5cbiAgICAgICAgICAgICAgICAgICAga2lraSB3aWxsIGdvIG5vd1xcbmFuZCBzZWUgYWxsIGhpcyBuZXcgZnJpZW5kcy5cXG5cXG55b3Ugc2hvdWxkIG1heWJlXFxuZG8gdGhlIHNhbWU/XG4gICAgICAgICAgICAgICAgICAgIHRoZSBtYWtlciB3YW50cyB0byB0aGFuayB5b3UhXFxuXFxuKGJ0dy46IHlvdSB0aG91Z2h0XFxueW91IGRpZG4ndCBzZWVcXG5raWtpJ3MgbWFrZXIgaW4gdGhlIGdhbWU/XG4gICAgICAgICAgICAgICAgICAgIHlvdSBhcmUgd3JvbmchXFxueW91IHNhdyBoaW1cXG5hbGwgdGhlIHRpbWUsXFxuYmVjYXVzZSBraWtpXFxubGl2ZXMgaW5zaWRlIGhpbSEpXFxuXFxudGhlIGVuZFxuICAgICAgICAgICAgICAgICAgICBwLnMuOiB0aGUgbWFrZXIgb2YgdGhlIGdhbWVcXG53YW50cyB0byB0aGFuayB5b3UgYXMgd2VsbCFcXG5cXG5pIGRlZmluaXRlbHkgd2FudCB5b3VyIGZlZWRiYWNrOlxuICAgICAgICAgICAgICAgICAgICBwbGVhc2Ugc2VuZCBtZSBhIG1haWwgKG1vbnN0ZXJrb2RpQGdteC5uZXQpXFxud2l0aCB5b3VyIGV4cGVyaWVuY2VzLFxuICAgICAgICAgICAgICAgICAgICB3aGljaCBsZXZlbHMgeW91IGxpa2VkLCBldGMuXFxuXFxudGhhbmtzIGluIGFkdmFuY2UgYW5kIGhhdmUgYSBuaWNlIGRheSxcXG5cXG55b3VycyBrb2RpXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICBcbiAgICAgICAgbW9yZV90ZXh0ID0gaW5kZXggPCBvdXRyb190ZXh0Lmxlbmd0aC0xXG4gICAgICAgIGxlc3NfdGV4dCA9IGluZGV4ID4gMFxuICAgICAgICBcbiAgICAgICAgcGFnZV90ZXh0ID0gb3V0cm9fdGV4dFtpbmRleF1cbiAgICAgICAgcGFnZV90ZXh0ICs9IFwiXFxuXFxuI3tpbmRleCsxfS8je291dHJvX3RleHQubGVuZ3RofVwiXG4gICAgXG4gICAgICAgIHBhZ2UgPSBLaWtpUGFnZVRleHQocGFnZV90ZXh0LCBtb3JlX3RleHQsIGxlc3NfdGV4dClcbiAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwiaGlkZVwiKS5hZGRBY3Rpb24ob25jZShkaXNwbGF5X21haW5fbWVudSkpXG4gICAgICAgIFxuICAgICAgICBpZiBtb3JlX3RleHRcbiAgICAgICAgICAgIHBhZ2UuZ2V0RXZlbnRXaXRoTmFtZShcIm5leHRcIikuYWRkQWN0aW9uIChpPWluZGV4KzEpID0+IEBvdXRybyBpXG4gICAgICAgIGlmIGxlc3NfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwicHJldmlvdXNcIikuYWRkQWN0aW9uIChpPWluZGV4LTEpID0+IEBvdXRybyBpXG4gICAgICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2hvd01lbnU6IChzZWxmKSAtPiAjIGhhbmRsZXMgYW4gRVNDIGtleSBldmVudFxuXG4gICAgICAgIEBtZW51ID0gbmV3IE1lbnUoKVxuICAgICAgICBAbWVudS5hZGRJdGVtICdsb2FkJyAgICAgICBAc2hvd0xldmVsc1xuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXNldCcgICAgICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnaGVscCcgICAgICAgQHNob3dIZWxwXG4gICAgICAgICMgQG1lbnUuYWRkSXRlbSAnc2V0dXAnICAgICAgQHNob3dTZXR1cCAgICAgICBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAncXVpdCcgICAgICAgQHF1aXRcbiAgICAgICAgQG1lbnUuc2hvdygpXG4gICAgXG4gICAgcXVpdDogLT4gcG9zdC50b01haW4gJ3F1aXRBcHAnXG4gICAgc2hvd0Fib3V0OiAtPiBwb3N0LnRvTWFpbiAnc2hvd0Fib3V0J1xuICAgIHNob3dTZXR1cDogLT4ga2xvZyAnc2hvd1NldHVwJ1xuICAgIHNob3dMZXZlbHM6ID0+IEBsZXZlbFNlbGVjdGlvbiA9IG5ldyBMZXZlbFNlbGVjdGlvbiBAXG4gICAgICAgICAgICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG4gICAgXG4gICAgZ2V0SW5zaWRlV2FsbFBvc1dpdGhEZWx0YTogKHBvcywgZGVsdGEpIC0+XG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnaHQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24ubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDEwLCBAc3BlZWQrMVxuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCAxLCAgQHNwZWVkLTFcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAZXhpdExldmVsKClcbiAgICAgICAgICAgIHdoZW4gJ20nIHRoZW4gQGV4aXRMZXZlbCA1XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee