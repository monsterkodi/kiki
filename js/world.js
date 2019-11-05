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

    World.prototype.step = function(step) {
        var camera, center, len, m, o, quat, ref2, ref3;
        if (this.levelSelection) {
            this.levelSelection.step(step);
            return;
        }
        camera = (ref2 = this.player) != null ? ref2.camera.cam : void 0;
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
        ref3 = this.objects;
        for (m = 0, len = ref3.length; m < len; m++) {
            o = ref3[m];
            if (typeof o.step === "function") {
                o.step(step);
            }
        }
        if (this.player) {
            this.stepPlayer(step);
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

    World.prototype.stepPlayer = function(step) {
        var d, len, len1, m, n, o, order, ref2, stone, stones;
        if (this.preview) {
            this.player.camera.cam.aspect = this.screenSize.w / (this.screenSize.h * 0.66);
        }
        this.player.camera.step(step);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLDZWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLGNBQUEsR0FBaUIsT0FB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VSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7ZUFFaEMsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJO0lBM0NMOztvQkE2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QSxLQUFELEdBQU8sQ0FBcEI7QUFGM0IsaUJBR1MsR0FIVDt1QkFHa0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBYSxJQUFDLENBQUEsS0FBRCxHQUFPLENBQXBCO0FBSDNCLGlCQUlTLEdBSlQ7dUJBSWtCLElBQUMsQ0FBQSxPQUFELENBQUE7QUFKbEIsaUJBS1MsR0FMVDt1QkFLa0IsSUFBQyxDQUFBLFNBQUQsQ0FBQTtBQUxsQixpQkFNUyxHQU5UO3VCQU1rQixJQUFDLENBQUEsU0FBRCxDQUFXLENBQVg7QUFObEI7SUFaa0I7O29CQW9CdEIsa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFaEIsWUFBQTtRQUFBLElBQVUsSUFBQyxDQUFBLGNBQVg7QUFBQSxtQkFBQTs7UUFDQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBSGdCOzs7O0dBdDRCSjs7QUEyNEJwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHBvc3QsIHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBwcmVmcywgY2xhbXAsIGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblNpemUgICAgICAgID0gcmVxdWlyZSAnLi9saWIvc2l6ZSdcbkNlbGwgICAgICAgID0gcmVxdWlyZSAnLi9jZWxsJ1xuR2F0ZSAgICAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5DYW1lcmEgICAgICA9IHJlcXVpcmUgJy4vY2FtZXJhJ1xuTGlnaHQgICAgICAgPSByZXF1aXJlICcuL2xpZ2h0J1xuTGV2ZWxzICAgICAgPSByZXF1aXJlICcuL2xldmVscydcblBsYXllciAgICAgID0gcmVxdWlyZSAnLi9wbGF5ZXInXG5Tb3VuZCAgICAgICA9IHJlcXVpcmUgJy4vc291bmQnXG5DYWdlICAgICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcblRpbWVyICAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdG9yICAgICAgID0gcmVxdWlyZSAnLi9hY3Rvcidcbkl0ZW0gICAgICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQWN0aW9uICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1lbnUgICAgICAgID0gcmVxdWlyZSAnLi9tZW51J1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcbkxldmVsU2VsZWN0aW9uID0gcmVxdWlyZSAnLi9sZXZlbHNlbGVjdGlvbidcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZS5ub3dcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBAOiAoQHZpZXcsIEBwcmV2aWV3KSAtPlxuICAgICAgICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAXG4gICAgICAgIFxuICAgICAgICBAc3BlZWQgICAgICA9IDZcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgICMga2xvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgIEByZW5kZXJlci5zZXRTaXplIEB2aWV3Lm9mZnNldFdpZHRoLCBAdmlldy5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4gICAgICAgICMgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgICAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAgICAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG5cbiAgICAgICAgQHN1biA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpIGlmIEBwbGF5ZXI/XG4gICAgICAgIEBzY2VuZS5hZGQgQHN1blxuICAgICAgICBcbiAgICAgICAgQGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4MTExMTExXG4gICAgICAgIEBzY2VuZS5hZGQgQGFtYmllbnRcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3RzID0gW11cbiAgICAgICAgQGxpZ2h0cyAgPSBbXVxuICAgICAgICBAY2VsbHMgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICA9IG5ldyBQb3MoKVxuICAgICAgICBAZGVwdGggICA9IC1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAgICBcbiAgICAgICAgQHRpbWVyID0gbmV3IFRpbWVyIEBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHZpZXcuYXBwZW5kQ2hpbGQgQHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgaW5kZXggPSBwcmVmcy5nZXQgJ2xldmVsJyAwXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBAbGV2ZWxzLmxpc3RbaW5kZXhdXG4gICAgICAgIHdvcmxkXG4gICAgICAgIFxuICAgIEBpbml0R2xvYmFsOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbHM/XG4gICAgICAgICAgXG4gICAgICAgIFNjcmVlblRleHQuaW5pdCgpXG4gICAgICAgIFNvdW5kLmluaXQoKVxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLnJvdDAgICAgPSBRdWF0ZXJuaW9uLnJvdF8wXG4gICAgICAgIGdsb2JhbC5yb3R4OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWFxuICAgICAgICBnbG9iYWwucm90eTkwICA9IFF1YXRlcm5pb24ucm90XzkwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHo5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWVxuICAgICAgICBnbG9iYWwucm90ejE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWVxuICAgICAgICBnbG9iYWwucm90ejI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9aXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwuWHVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFlcbiAgICAgICAgZ2xvYmFsLlh1cFogICAgICAgID0gUXVhdGVybmlvbi5YdXBaXG4gICAgICAgIGdsb2JhbC5YZG93blkgICAgICA9IFF1YXRlcm5pb24uWGRvd25ZXG4gICAgICAgIGdsb2JhbC5YZG93blogICAgICA9IFF1YXRlcm5pb24uWGRvd25aXG4gICAgICAgIGdsb2JhbC5ZdXBYICAgICAgICA9IFF1YXRlcm5pb24uWXVwWFxuICAgICAgICBnbG9iYWwuWXVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFpcbiAgICAgICAgZ2xvYmFsLllkb3duWCAgICAgID0gUXVhdGVybmlvbi5ZZG93blhcbiAgICAgICAgZ2xvYmFsLllkb3duWiAgICAgID0gUXVhdGVybmlvbi5ZZG93blpcbiAgICAgICAgZ2xvYmFsLlp1cFggICAgICAgID0gUXVhdGVybmlvbi5adXBYXG4gICAgICAgIGdsb2JhbC5adXBZICAgICAgICA9IFF1YXRlcm5pb24uWnVwWVxuICAgICAgICBnbG9iYWwuWmRvd25YICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWFxuICAgICAgICBnbG9iYWwuWmRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYdXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWVxuICAgICAgICBnbG9iYWwubWludXNYdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWlxuICAgICAgICBnbG9iYWwubWludXNYZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWiA9IFF1YXRlcm5pb24ubWludXNYZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWCAgID0gUXVhdGVybmlvbi5taW51c1l1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWiAgID0gUXVhdGVybmlvbi5taW51c1l1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25YID0gUXVhdGVybmlvbi5taW51c1lkb3duWFxuICAgICAgICBnbG9iYWwubWludXNZZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFggICA9IFF1YXRlcm5pb24ubWludXNadXBYXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFkgICA9IFF1YXRlcm5pb24ubWludXNadXBZXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWCA9IFF1YXRlcm5pb24ubWludXNaZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25ZID0gUXVhdGVybmlvbi5taW51c1pkb3duWVxuXG4gICAgICAgIEBsZXZlbHMgPSBuZXcgTGV2ZWxzXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5kb21FbGVtZW50LnJlbW92ZSgpXG4gICAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBjcmVhdGU6ICh3b3JsZERpY3Q9e30sIHNob3dOYW1lPXRydWUpIC0+ICMgY3JlYXRlcyB0aGUgd29ybGQgZnJvbSBhIGxldmVsIG5hbWUgb3IgYSBkaWN0aW9uYXJ5XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5jcmVhdGVcIiB3b3JsZERpY3RcbiAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkRGljdFxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBkaWN0ID0gV29ybGQubGV2ZWxzLmRpY3Rbd29ybGREaWN0XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0Lm5hbWVcbiAgICAgICAgICAgICAgICBAZGljdCA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGV2ZWxfaW5kZXggPSBXb3JsZC5sZXZlbHMubGlzdC5pbmRleE9mIEBsZXZlbF9uYW1lXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXdcbiAgICAgICAgICAgIHByZWZzLnNldCAnbGV2ZWwnIEBsZXZlbF9pbmRleFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwiV29ybGQuY3JlYXRlICN7QGxldmVsX2luZGV4fSBzaXplOiAje25ldyBQb3MoQGRpY3RbXCJzaXplXCJdKS5zdHIoKX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAnI3tAbGV2ZWxfbmFtZX0nIHNjaGVtZTogJyN7QGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnfSdcIlxuXG4gICAgICAgIEBjcmVhdGluZyA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBAc2V0U2l6ZSBAZGljdC5zaXplICMgdGhpcyByZW1vdmVzIGFsbCBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAYXBwbHlTY2hlbWUgQGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3IGFuZCBzaG93TmFtZVxuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgIyBAcGxheWVyLmNhbWVyYS5zdGVwKClcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldFBvc2l0aW9uIEBwbGF5ZXIuY3VycmVudFBvcygpLm1pbnVzIEBwbGF5ZXIuZGlyZWN0aW9uXG4gICAgICAgICAgICBAc2V0Q2FtZXJhTW9kZSBDYW1lcmEuRk9MTE9XXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldFBvc2l0aW9uIEBwbGF5ZXIuY3VycmVudFBvcygpXG4gICAgICAgICAgICBAc2V0Q2FtZXJhTW9kZSBDYW1lcmEuSU5TSURFIGlmIEBkaWN0LmNhbWVyYSA9PSAnaW5zaWRlJ1xuICAgICAgICBcbiAgICAgICAgQGNyZWF0aW5nID0gZmFsc2VcbiAgICAgICAgIyBrbG9nICdkb25lIGNyZWF0aW5nJ1xuICAgIFxuICAgIHJlc3RhcnQ6ID0+IEBjcmVhdGUgQGRpY3RcblxuICAgIGZpbmlzaDogKCkgLT4gIyBUT0RPOiBzYXZlIHByb2dyZXNzXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgYXBwbHlTY2hlbWU6IChzY2hlbWUpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLmFwcGx5U2NoZW1lICN7c2NoZW1lfVwiXG4gICAgICAgIFxuICAgICAgICBjb2xvcnMgPSBfLmNsb25lIFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBvcGFjaXR5ID1cbiAgICAgICAgICAgIHN0b25lOiAwLjdcbiAgICAgICAgICAgIGJvbWI6ICAwLjlcbiAgICAgICAgICAgIHRleHQ6ICAwXG4gICAgICAgICAgICBcbiAgICAgICAgc2hpbmluZXNzID0gXG4gICAgICAgICAgICB0aXJlOiAgIDRcbiAgICAgICAgICAgIHBsYXRlOiAgMTBcbiAgICAgICAgICAgIHJhc3RlcjogMjBcbiAgICAgICAgICAgIHdhbGw6ICAgMjBcbiAgICAgICAgICAgIHN0b25lOiAgMjBcbiAgICAgICAgICAgIGdlYXI6ICAgMjBcbiAgICAgICAgICAgIHRleHQ6ICAgMjAwXG4gICAgICAgICAgICBcbiAgICAgICAgY29sb3JzLnBsYXRlLmVtaXNzaXZlID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgPz0gY29sb3JzLmJ1bGIuY29sb3JcbiAgICAgICAgY29sb3JzLm1lbnUgPz0ge30gICBcbiAgICAgICAgY29sb3JzLm1lbnUuY29sb3IgPz0gY29sb3JzLmdlYXIuY29sb3JcbiAgICAgICAgY29sb3JzLnJhc3RlciA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLndhbGwgPz0ge31cbiAgICAgICAgY29sb3JzLndhbGwuY29sb3IgPz0gbmV3IFRIUkVFLkNvbG9yKGNvbG9ycy5wbGF0ZS5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC42XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUgPz0ge31cbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZS5jb2xvciA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBmb3Igayx2IG9mIGNvbG9yc1xuICAgICAgICAgICAgIyBrbG9nIFwiI3trfSAje3YuY29sb3I/LnJ9ICN7di5jb2xvcj8uZ30gI3t2LmNvbG9yPy5ifVwiLCB2XG4gICAgICAgICAgICAjIGNvbnRpbnVlIGlmIGsgPT0gJ3RleHQnXG4gICAgICAgICAgICBtYXQgPSBNYXRlcmlhbFtrXVxuICAgICAgICAgICAgbWF0LmNvbG9yICAgID0gdi5jb2xvclxuICAgICAgICAgICAgbWF0Lm9wYWNpdHkgID0gdi5vcGFjaXR5ID8gb3BhY2l0eVtrXSA/IDFcbiAgICAgICAgICAgIG1hdC5zcGVjdWxhciA9IHYuc3BlY3VsYXIgPyBuZXcgVEhSRUUuQ29sb3Iodi5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC4yXG4gICAgICAgICAgICBtYXQuZW1pc3NpdmUgPSB2LmVtaXNzaXZlID8gbmV3IFRIUkVFLkNvbG9yIDAsMCwwXG4gICAgICAgICAgICBpZiBzaGluaW5lc3Nba10/XG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IHYuc2hpbmluZXNzID8gc2hpbmluZXNzW2tdXG5cbiAgICAjICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgQGVuYWJsZVNoYWRvd3MgdHJ1ZSBpZiBsaWdodC5zaGFkb3dcbiAgICAgICAgXG4gICAgcmVtb3ZlTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIGxpZ2h0XG4gICAgICAgIGZvciBsIGluIEBsaWdodHNcbiAgICAgICAgICAgIHNoYWRvdyA9IHRydWUgaWYgbC5zaGFkb3dcbiAgICAgICAgQGVuYWJsZVNoYWRvd3Mgc2hhZG93XG5cbiAgICBlbmFibGVTaGFkb3dzOiAoZW5hYmxlKSAtPlxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBlbmFibGVcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICAgICAgIFxuICAgIGV4aXRMZXZlbDogKGFjdGlvbikgPT5cbiAgICAgICAgXG4gICAgICAgIEBmaW5pc2goKVxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5sZXZlbF9pbmRleCAje3dvcmxkLmxldmVsX2luZGV4fSBuZXh0TGV2ZWwgI3tXb3JsZC5sZXZlbHMubGlzdFt3b3JsZC5sZXZlbF9pbmRleCsxXX1cIlxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgQGRlbGV0ZUFsbE9iamVjdHMoKVxuICAgICAgICBAY2VsbHMgPSBbXVxuICAgICAgICBAc2l6ZSA9IG5ldyBQb3Mgc2l6ZVxuICAgICAgICAjIGNhbGN1YXRlIG1heCBkaXN0YW5jZSAoZm9yIHBvc2l0aW9uIHJlbGF0aXZlIHNvdW5kKVxuICAgICAgICBAbWF4X2Rpc3RhbmNlID0gTWF0aC5tYXgoQHNpemUueCwgTWF0aC5tYXgoQHNpemUueSwgQHNpemUueikpICAjIGhldXJpc3RpYyBvZiBhIGhldXJpc3RpYyA6LSlcbiAgICAgICAgQGNhZ2U/LmRlbCgpXG4gICAgICAgIEBjYWdlID0gbmV3IENhZ2UgQHNpemUsIEByYXN0ZXJTaXplXG5cbiAgICBnZXRDZWxsQXRQb3M6IChwb3MpIC0+IHJldHVybiBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gaWYgQGlzVmFsaWRQb3MgcG9zXG4gICAgZ2V0Qm90QXRQb3M6ICAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgQm90LCBuZXcgUG9zIHBvc1xuXG4gICAgcG9zVG9JbmRleDogICAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCAqIEBzaXplLnogKiBAc2l6ZS55ICsgcC55ICogQHNpemUueiArIHAuelxuICAgICAgICBcbiAgICBpbmRleFRvUG9zOiAgIChpbmRleCkgLT4gXG4gICAgICAgIGxzaXplID0gQHNpemUueiAqIEBzaXplLnlcbiAgICAgICAgbHJlc3QgPSBpbmRleCAlIGxzaXplXG4gICAgICAgIG5ldyBQb3MgaW5kZXgvbHNpemUsIGxyZXN0L0BzaXplLnosIGxyZXN0JUBzaXplLnpcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkT2JqZWN0QXRQb3M6IChvYmplY3QsIHgsIHksIHopIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgeCwgeSwgelxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0QXRQb3MgI3tvYmplY3QubmFtZX1cIiwgcG9zXG4gICAgICAgIEBhZGRPYmplY3Qgb2JqZWN0XG5cbiAgICBhZGRPYmplY3RMaW5lOiAob2JqZWN0LCBzeCxzeSxzeiwgZXgsZXksZXopIC0+XG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBpZiBzeCBpbnN0YW5jZW9mIFBvcyBvciBBcnJheS5pc0FycmF5IHN4XG4gICAgICAgICAgICBzdGFydCA9IHN4XG4gICAgICAgICAgICBlbmQgICA9IHN5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IFBvcyBzeCxzeSxzelxuICAgICAgICAgICAgZW5kICAgPSBuZXcgUG9zIGV4LGV5LGV6XG4gICAgICAgICMgYWRkcyBhIGxpbmUgb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gc3RhcnQgYW5kIGVuZCBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgZW5kIGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBlbmQgPSBbZW5kLngsIGVuZC55LCBlbmQuel1cbiAgICAgICAgW2V4LCBleSwgZXpdID0gZW5kXG5cbiAgICAgICAgaWYgc3RhcnQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIHN0YXJ0ID0gW3N0YXJ0LngsIHN0YXJ0LnksIHN0YXJ0LnpdXG4gICAgICAgIFtzeCwgc3ksIHN6XSA9IHN0YXJ0XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgXG4gICAgICAgIGRpZmYgPSBbZXgtc3gsIGV5LXN5LCBlei1zel1cbiAgICAgICAgbWF4ZGlmZiA9IF8ubWF4IGRpZmYubWFwIE1hdGguYWJzXG4gICAgICAgIGRlbHRhcyA9IGRpZmYubWFwIChhKSAtPiBhL21heGRpZmZcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5tYXhkaWZmXVxuICAgICAgICAgICAgIyBwb3MgPSBhcHBseShQb3MsIChtYXAgKGxhbWJkYSBhLCBiOiBpbnQoYStpKmIpLCBzdGFydCwgZGVsdGFzKSkpXG4gICAgICAgICAgICBwb3MgPSBuZXcgUG9zIChzdGFydFtqXStpKmRlbHRhc1tqXSBmb3IgaiBpbiBbMC4uMl0pXG4gICAgICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RMaW5lICN7aX06XCIsIHBvc1xuICAgICAgICAgICAgaWYgQGlzVW5vY2N1cGllZFBvcyBwb3NcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICBcbiAgICBhZGRPYmplY3RQb2x5OiAob2JqZWN0LCBwb2ludHMsIGNsb3NlPXRydWUpIC0+XG4gICAgICAgICMgYWRkcyBhIHBvbHlnb24gb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gcG9pbnRzIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBjbG9zZVxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggcG9pbnRzWzBdXG4gICAgICAgIGZvciBpbmRleCBpbiBbMS4uLnBvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBAYWRkT2JqZWN0TGluZSBvYmplY3QsIHBvaW50c1tpbmRleC0xXSwgcG9pbnRzW2luZGV4XVxuICAgICAgIFxuICAgIGFkZE9iamVjdFJhbmRvbTogKG9iamVjdCwgbnVtYmVyKSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBmb3IgaSBpbiBbMC4uLm51bWJlcl1cbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIG9iamVjdCgpXG4gICAgICAgIFxuICAgIHNldE9iamVjdFJhbmRvbTogKG9iamVjdCkgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgb2JqZWN0U2V0ID0gZmFsc2VcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgd2hpbGUgbm90IG9iamVjdFNldCAjIGhhY2sgYWxlcnQhXG4gICAgICAgICAgICByYW5kb21Qb3MgPSBuZXcgUG9zIHJhbmRJbnQoQHNpemUueCksIHJhbmRJbnQoQHNpemUueSksIHJhbmRJbnQoQHNpemUueilcbiAgICAgICAgICAgIGlmIG5vdCBvYmplY3QuaXNTcGFjZUVnb2lzdGljKCkgb3IgQGlzVW5vY2N1cGllZFBvcyByYW5kb21Qb3MgXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcmFuZG9tUG9zXG4gICAgICAgICAgICAgICAgb2JqZWN0U2V0ID0gdHJ1ZVxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAgICAgIChjbHNzKSAgICAgIC0+IEBvYmplY3RzLmZpbHRlciAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPYmplY3RzT2ZUeXBlQXRQb3M6IChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2JqZWN0c09mVHlwZShjbHNzKSA/IFtdXG4gICAgZ2V0T2JqZWN0T2ZUeXBlQXRQb3M6ICAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldFJlYWxPYmplY3RPZlR5cGUoY2xzcylcbiAgICBnZXRPY2N1cGFudEF0UG9zOiAgICAgICAgICAgIChwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2NjdXBhbnQoKVxuICAgIGdldFJlYWxPY2N1cGFudEF0UG9zOiAocG9zKSAtPlxuICAgICAgICBvY2N1cGFudCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICBpZiBvY2N1cGFudCBhbmQgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgIG9jY3VwYW50Lm9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvY2N1cGFudFxuICAgIHN3aXRjaEF0UG9zOiAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgU3dpdGNoLCBwb3NcbiAgICBzZXRPYmplY3RBdFBvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGludmFsaWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBvYmplY3QuaXNTcGFjZUVnb2lzdGljKClcbiAgICAgICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50ID0gY2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudC50aW1lID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgdGltZTpcIiwgb2NjdXBhbnQudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQuZGVsKCkgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYW55d2F5IC4gZGVsZXRlIGl0XG4gICAgICAgIFxuICAgICAgICBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgbm90IGNlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleChwb3MpXG4gICAgICAgICAgICBjZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSBjZWxsXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgICMgZWxzZSBcbiAgICAgICAgICAgICMga2xvZyAnd29ybGQudW5zZXRPYmplY3QgW1dBUk5JTkddIG5vIGNlbGwgYXQgcG9zOicsIHBvc1xuXG4gICAgbmV3T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgaWYgb2JqZWN0LnN0YXJ0c1dpdGggJ25ldydcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICByZXR1cm4gbmV3IChyZXF1aXJlIFwiLi8je29iamVjdC50b0xvd2VyQ2FzZSgpfVwiKSgpXG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIEl0ZW1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCgpXG4gICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgTGlnaHRcbiAgICAgICAgICAgIEBsaWdodHMucHVzaCBvYmplY3QgIyBpZiBsaWdodHMuaW5kZXhPZihvYmplY3QpIDwgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdCAjIGlmIG9iamVjdHMuaW5kZXhPZihvYmplY3QpIDwgMCBcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgbW92ZU9iamVjdFRvUG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zKHBvcykgb3IgQGlzT2NjdXBpZWRQb3MocG9zKVxuICAgICAgICBAdW5zZXRPYmplY3QgICAgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICB0cnVlXG4gICAgICAgIFxuICAgIHRvZ2dsZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIG9iamVjdCA9IEBnZXRPYmplY3RXaXRoTmFtZSBvYmplY3ROYW1lIFxuICAgICAgICBvYmplY3QuZ2V0QWN0aW9uV2l0aE5hbWUoXCJ0b2dnbGVcIikucGVyZm9ybSgpXG4gICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGRlbGV0ZUFsbE9iamVjdHM6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFsbEFjdGlvbnMoKVxuICAgIFxuICAgICAgICBpZiBAcGxheWVyP1xuICAgICAgICAgICAgQHBsYXllci5kZWwoKVxuICAgIFxuICAgICAgICB3aGlsZSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBsaWdodHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBsaWdodCBubyBhdXRvIHJlbW92ZVwiXG4gICAgICAgICAgICAgICAgQGxpZ2h0cy5wb3AoKVxuICAgIFxuICAgICAgICB3aGlsZSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQG9iamVjdHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgb2JqZWN0IG5vIGF1dG8gcmVtb3ZlICN7bGFzdChAb2JqZWN0cykubmFtZX1cIlxuICAgICAgICAgICAgICAgIEBvYmplY3RzLnBvcCgpXG4gICAgXG4gICAgZGVsZXRlT2JqZWN0c1dpdGhDbGFzc05hbWU6IChjbGFzc05hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIF8uY2xvbmUgQG9iamVjdHNcbiAgICAgICAgICAgIGlmIGNsYXNzTmFtZSA9PSBvLmdldENsYXNzTmFtZSgpXG4gICAgICAgICAgICAgICAgby5kZWwoKVxuICAgIFxuICAgIGdldE9iamVjdFdpdGhOYW1lOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdE5hbWUgPT0gby5uYW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAga2Vycm9yIFwiV29ybGQuZ2V0T2JqZWN0V2l0aE5hbWUgW1dBUk5JTkddIG5vIG9iamVjdCB3aXRoIG5hbWUgI3tvYmplY3ROYW1lfVwiXG4gICAgICAgIG51bGxcbiAgICBcbiAgICBzZXRDYW1lcmFNb2RlOiAobW9kZSkgLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IGNsYW1wIENhbWVyYS5JTlNJREUsIENhbWVyYS5GT0xMT1csIG1vZGVcbiAgICBcbiAgICBjaGFuZ2VDYW1lcmFNb2RlOiAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gKEBwbGF5ZXIuY2FtZXJhLm1vZGUrMSkgJSAoQ2FtZXJhLkZPTExPVysxKVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgIDAgICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBvYmplY3RXaWxsTW92ZVRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zICN7b2JqZWN0Lm5hbWV9ICN7ZHVyYXRpb259XCIsIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgc291cmNlUG9zLmVxbCB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGVxdWFsIHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiB0YXJnZXRDZWxsXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyA9IHRhcmdldENlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zLnRpbWUgPCAwIGFuZCAtb2JqZWN0QXROZXdQb3MudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXROZXdQb3MuZGVsKClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gdGltaW5nIGNvbmZsaWN0IGF0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBhbHJlYWR5IG9jY3VwaWVkOlwiLCB0YXJnZXRQb3MgXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5uYW1lICE9ICdwbGF5ZXInXG4gICAgICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0ICMgcmVtb3ZlIG9iamVjdCBmcm9tIGNlbGwgZ3JpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG9sZCBwb3MnLCBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG9sZCBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gLWR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCBzb3VyY2VQb3MgXG5cbiAgICAgICAgICAgICMga2xvZyAnd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyB0bXBPYmplY3QgYXQgbmV3IHBvcycsIHRhcmdldFBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBzb3VyY2VQb3MgPSBuZXcgUG9zIGZyb21cbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyB0b1xuXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQub2JqZWN0TW92ZWQgI3ttb3ZlZE9iamVjdC5uYW1lfVwiLCBzb3VyY2VQb3NcbiAgICAgICAgXG4gICAgICAgIHNvdXJjZUNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHNvdXJjZVBvc1xuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHNvdXJjZUNlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHRhcmdldENlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc09jY3VwaWVkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gb2NjdXBpZWQgdGFyZ2V0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc291cmNlQ2VsbD9cbiAgICAgICAgICAgIHNvdXJjZUNlbGwucmVtb3ZlT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBpZiBzb3VyY2VDZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChzb3VyY2VQb3MpXSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvcyAgICBcbiAgICAgICAgaWYgbm90IHRhcmdldENlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0YXJnZXRDZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSB0YXJnZXRDZWxsXG5cbiAgICAgICAgaWYgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIHRhcmdldENlbGwuYWRkT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG5vIHRhcmdldCBjZWxsP1wiXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgICAgIFxuICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24uc3RlcCBzdGVwIFxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICBcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgICAgICBcbiAgICAgICAgaWYgZmFsc2VcbiAgICAgICAgICAgIHF1YXQgPSBjYW1lcmEucXVhdGVybmlvbi5jbG9uZSgpXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygxLDAsMCksIHN0ZXAuZHNlY3MqMC4yXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIHN0ZXAuZHNlY3MqMC4xXG4gICAgICAgICAgICBjZW50ZXIgPSBAc2l6ZS5kaXYgMlxuICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnNldChjZW50ZXIueCxjZW50ZXIueSxjZW50ZXIueitAZGlzdCkuYXBwbHlRdWF0ZXJuaW9uIHF1YXRcbiAgICAgICAgICAgIGNhbWVyYS5xdWF0ZXJuaW9uLmNvcHkgcXVhdFxuXG4gICAgICAgIFRpbWVyLnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgVGltZXIuZmluaXNoQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICBvLnN0ZXA/KHN0ZXApIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBpZiBAcGxheWVyIHRoZW4gQHN0ZXBQbGF5ZXIgc3RlcFxuICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEByZW5kZXJlci5zZXRWaWV3cG9ydCAwLCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC43MiksIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IoQHNjcmVlblNpemUuaCowLjMpXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEB0ZXh0LnNjZW5lLCBAdGV4dC5jYW1lcmEgaWYgQHRleHRcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuXG4gICAgc3RlcFBsYXllcjogKHN0ZXApIC0+XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLmNhbS5hc3BlY3QgPSBAc2NyZWVuU2l6ZS53IC8gKEBzY3JlZW5TaXplLmgqMC42NilcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc3RlcCBzdGVwXG5cbiAgICAgICAgU291bmQuc2V0TWF0cml4IEBwbGF5ZXIuY2FtZXJhXG4gICAgICAgICAgICBcbiAgICAgICAgQHBsYXllci5zZXRPcGFjaXR5IGNsYW1wIDAsIDEsIEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkubWludXMoQHBsYXllci5jdXJyZW50X3Bvc2l0aW9uKS5sZW5ndGgoKS0wLjRcbiAgICAgICAgXG4gICAgICAgIHN0b25lcyA9IFtdXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvIGluc3RhbmNlb2YgU3RvbmVcbiAgICAgICAgICAgICAgICBzdG9uZXMucHVzaCBvXG4gICAgICAgIHN0b25lcy5zb3J0IChhLGIpID0+IGIucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKCkgLSBhLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgIFxuICAgICAgICBvcmRlciA9IDEwMFxuICAgICAgICBmb3Igc3RvbmUgaW4gc3RvbmVzXG4gICAgICAgICAgICBzdG9uZS5tZXNoLnJlbmRlck9yZGVyID0gb3JkZXJcbiAgICAgICAgICAgIG9yZGVyICs9IDFcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZCA9IHN0b25lLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgICAgICBpZiBkIDwgMS4wXG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgaWYgbm90IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IDAuMiArIGQgKiAwLjVcbiAgICAgICAgICAgIGVsc2UgaWYgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5jYW0ucG9zaXRpb25cbiAgICAgICAgQHJlbmRlcmVyLmF1dG9DbGVhckNvbG9yID0gZmFsc2VcblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHJlbmRlcmVyLnNldFZpZXdwb3J0IDAsIDAsIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IgQHNjcmVlblNpemUuaCowLjY2XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBzY2VuZSwgQHBsYXllci5jYW1lcmEuY2FtICAgICAgICBcbiAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBnZXRUaW1lOiAtPiBub3coKS50b0ZpeGVkIDBcbiAgICBzZXRTcGVlZDogKHMpIC0+IEBzcGVlZCA9IHNcbiAgICBnZXRTcGVlZDogLT4gQHNwZWVkXG4gICAgbWFwTXNUaW1lOiAgKHVubWFwcGVkKSAtPiBwYXJzZUludCAxMC4wICogdW5tYXBwZWQvQHNwZWVkXG4gICAgdW5tYXBNc1RpbWU6IChtYXBwZWQpIC0+IHBhcnNlSW50IG1hcHBlZCAqIEBzcGVlZC8xMC4wXG4gICAgICAgIFxuICAgIGNvbnRpbnVvdXM6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcImNvbnRpbnVvdXNcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLkNPTlRJTlVPVVNcblxuICAgIG9uY2U6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcIm9uY2VcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIHJlc2l6ZWQ6ICh3LGgpID0+XG4gICAgICAgIFxuICAgICAgICBAYXNwZWN0ID0gdy9oXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgdyxoXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICAgICAgY2FtZXJhPy5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIGNhbWVyYT8udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIEByZW5kZXJlcj8uc2V0U2l6ZSB3LGhcbiAgICAgICAgQHRleHQ/LnJlc2l6ZWQgdyxoXG4gICAgICAgIEBtZW51Py5yZXNpemVkIHcsaFxuICAgICAgICBcbiAgICAgICAgQGxldmVsU2VsZWN0aW9uPy5yZXNpemVkIHcsaFxuXG4gICAgZ2V0TmVhcmVzdFZhbGlkUG9zOiAocG9zKSAtPlxuICAgICAgICBuZXcgUG9zIE1hdGgubWluKEBzaXplLngtMSwgTWF0aC5tYXgocG9zLngsIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUueS0xLCBNYXRoLm1heChwb3MueSwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS56LTEsIE1hdGgubWF4KHBvcy56LCAwKSlcbiAgICBcbiAgICBpc1Vub2NjdXBpZWRQb3M6IChwb3MpIC0+IG5vdCBAaXNPY2N1cGllZFBvcyBwb3NcbiAgICBpc09jY3VwaWVkUG9zOiAgIChwb3MpIC0+ICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGlmIEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAgICAgIyBrbG9nIFwiaXNPY2N1cGllZFBvcyBvY2N1cGFudDogI3tAZ2V0T2NjdXBhbnRBdFBvcyhwb3MpLm5hbWV9IGF0IHBvczpcIiwgbmV3IFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgbWF5T2JqZWN0UHVzaFRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3Mgb2JqZWN0OiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCIsIHBvc1xuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgIyBrbG9nIFwicHVzaGFibGVPYmplY3QgI3twdXNoYWJsZU9iamVjdD8ubmFtZX1cIlxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGUgI2FuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgTW90b3JHZWFyICMgYmFkXG4gICAgICAgICAgICBwdXNoYWJsZU9iamVjdC5wdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uIG9iamVjdCwgZGlyZWN0aW9uLCBkdXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICAgICAgZmFsc2VcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIHNob3dIZWxwOiA9PlxuXG4gICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuXG4gICAgb3V0cm86IChpbmRleD0wKSAtPlxuICAgICAgICAjIHdlbGwgaGlkZGVuIG91dHJvIDotKVxuICAgICAgICBvdXRyb190ZXh0ID0gXCJcIlwiXG4gICAgICAgICAgICAgICAgICAgICRzY2FsZSgxLjUpY29uZ3JhdHVsYXRpb25zIVxcblxcbiRzY2FsZSgxKXlvdSByZXNjdWVkXFxudGhlIG5hbm8gd29ybGQhXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGUgbGFzdCBkdW1iIG11dGFudCBib3RcXG5oYXMgYmVlbiBkZXN0cm95ZWQuXFxuXFxudGhlIG1ha2VyIGlzIGZ1bmN0aW9uaW5nIGFnYWluLlxuICAgICAgICAgICAgICAgICAgICBraWtpIHdpbGwgZ28gbm93XFxuYW5kIHNlZSBhbGwgaGlzIG5ldyBmcmllbmRzLlxcblxcbnlvdSBzaG91bGQgbWF5YmVcXG5kbyB0aGUgc2FtZT9cbiAgICAgICAgICAgICAgICAgICAgdGhlIG1ha2VyIHdhbnRzIHRvIHRoYW5rIHlvdSFcXG5cXG4oYnR3LjogeW91IHRob3VnaHRcXG55b3UgZGlkbid0IHNlZVxcbmtpa2kncyBtYWtlciBpbiB0aGUgZ2FtZT9cbiAgICAgICAgICAgICAgICAgICAgeW91IGFyZSB3cm9uZyFcXG55b3Ugc2F3IGhpbVxcbmFsbCB0aGUgdGltZSxcXG5iZWNhdXNlIGtpa2lcXG5saXZlcyBpbnNpZGUgaGltISlcXG5cXG4kc2NhbGUoMS41KXRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgcC5zLjogdGhlIG1ha2VyIG9mIHRoZSBnYW1lXFxud2FudHMgdG8gdGhhbmsgeW91IGFzIHdlbGwhXFxuXFxuaSBkZWZpbml0ZWx5IHdhbnQgeW91ciBmZWVkYmFjazpcbiAgICAgICAgICAgICAgICAgICAgcGxlYXNlIHNlbmQgbWUgYSBtYWlsIChtb25zdGVya29kaUBnbXgubmV0KVxcbndpdGggeW91ciBleHBlcmllbmNlcyxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggbGV2ZWxzIHlvdSBsaWtlZCwgZXRjLlxcblxcbnRoYW5rcyBpbiBhZHZhbmNlIGFuZCBoYXZlIGEgbmljZSBkYXksXFxuXFxueW91cnMga29kaVxuICAgICAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgXG4gICAgICAgIG1vcmVfdGV4dCA9IGluZGV4IDwgb3V0cm9fdGV4dC5sZW5ndGgtMVxuICAgICAgICBsZXNzX3RleHQgPSBpbmRleCA+IDBcbiAgICAgICAgXG4gICAgICAgIHBhZ2VfdGV4dCA9IG91dHJvX3RleHRbaW5kZXhdXG4gICAgICAgIHBhZ2VfdGV4dCArPSBcIlxcblxcbiRzY2FsZSgwLjUpKCN7aW5kZXgrMX0vI3tvdXRyb190ZXh0Lmxlbmd0aH0pXCJcbiAgICBcbiAgICAgICAgcGFnZSA9IEtpa2lQYWdlVGV4dChwYWdlX3RleHQsIG1vcmVfdGV4dCwgbGVzc190ZXh0KVxuICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJoaWRlXCIpLmFkZEFjdGlvbihvbmNlKGRpc3BsYXlfbWFpbl9tZW51KSlcbiAgICAgICAgXG4gICAgICAgIGlmIG1vcmVfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwibmV4dFwiKS5hZGRBY3Rpb24gKGk9aW5kZXgrMSkgPT4gQG91dHJvIGlcbiAgICAgICAgaWYgbGVzc190ZXh0XG4gICAgICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJwcmV2aW91c1wiKS5hZGRBY3Rpb24gKGk9aW5kZXgtMSkgPT4gQG91dHJvIGlcbiAgICAgICAgXG4gICAgIyAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcbiAgICBcbiAgICBzaG93TWVudTogKHNlbGYpIC0+ICMgaGFuZGxlcyBhbiBFU0Mga2V5IGV2ZW50XG5cbiAgICAgICAgQG1lbnUgPSBuZXcgTWVudSgpXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ2hlbHAnICAgICAgIEBzaG93SGVscFxuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXN0YXJ0JyAgICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnbG9hZCBsZXZlbCcgQHNob3dMZXZlbHNcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnc2V0dXAnICAgICAgQHNob3dTZXR1cCAgICAgICBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnYWJvdXQnICAgICAgQHNob3dBYm91dFxuICAgICAgICBAbWVudS5hZGRJdGVtICdxdWl0JyAgICAgICBAcXVpdFxuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICBxdWl0OiAtPiBwb3N0LnRvTWFpbiAncXVpdEFwcCdcbiAgICBzaG93QWJvdXQ6IC0+IHBvc3QudG9NYWluICdzaG93QWJvdXQnXG4gICAgc2hvd1NldHVwOiAtPiBrbG9nICdzaG93U2V0dXAnXG4gICAgc2hvd0xldmVsczogPT4gQGxldmVsU2VsZWN0aW9uID0gbmV3IExldmVsU2VsZWN0aW9uIEBcbiAgICAgICAgICAgICAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgaW5zaWRlUG9zID0gbmV3IFZlY3RvciBwb3NcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIGlmIGYgPCBkZWx0YVxuICAgICAgICAgICAgICAgIGluc2lkZVBvcy5hZGQgV29ybGQubm9ybWFsc1t3XS5tdWwgZGVsdGEtZlxuICAgICAgICBpbnNpZGVQb3NcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JQb3M6IChwb3MpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCAocG9zaXRpdmUgb3IgbmVnYXRpdmUpXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdIFxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGFic01pbiBtaW5fZiwgZiBcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JSYXk6IChyYXlQb3MsIHJheURpcikgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIGluIHJheURpciBcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcmF5UG9zLCByYXlEaXIsIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGYgaWYgZiA+PSAwLjAgYW5kIGYgPCBtaW5fZlxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGRpc3BsYXlMaWdodHM6ICgpIC0+XG4gICAgICAgIGZvciBsaWdodCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBsaWdudC5kaXNwbGF5KClcbiAgICAgICAgICAgICAgIFxuICAgIHBsYXlTb3VuZDogKHNvdW5kLCBwb3MsIHRpbWUpIC0+IFNvdW5kLnBsYXkgc291bmQsIHBvcywgdGltZSBpZiBub3QgQGNyZWF0aW5nXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAwMCBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAwMDAwMCAgXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50RG93bjogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgICAgIEBsZXZlbFNlbGVjdGlvbi5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIEBtZW51PyAgICAgICAgICAgIFxuICAgICAgICAgICAgQG1lbnUubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIEB0ZXh0Py5mYWRlT3V0KClcbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnREb3duIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICAgICAgc3dpdGNoIGNvbWJvXG4gICAgICAgICAgICB3aGVuICdlc2MnIHRoZW4gQHNob3dNZW51KClcbiAgICAgICAgICAgIHdoZW4gJz0nIHRoZW4gQHNwZWVkID0gTWF0aC5taW4gMTAsIEBzcGVlZCsxXG4gICAgICAgICAgICB3aGVuICctJyB0aGVuIEBzcGVlZCA9IE1hdGgubWF4IDEsICBAc3BlZWQtMVxuICAgICAgICAgICAgd2hlbiAncicgdGhlbiBAcmVzdGFydCgpXG4gICAgICAgICAgICB3aGVuICduJyB0aGVuIEBleGl0TGV2ZWwoKVxuICAgICAgICAgICAgd2hlbiAnbScgdGhlbiBAZXhpdExldmVsIDVcblxuICAgIG1vZEtleUNvbWJvRXZlbnRVcDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50VXAgbW9kLCBrZXksIGNvbWJvLCBldmVudCAgICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGRcblxuIl19
//# sourceURL=../coffee/world.coffee