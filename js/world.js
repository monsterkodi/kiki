// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, first, last, log, now, randInt, ref, ref1, world,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require("./tools/tools"), absMin = ref.absMin, randInt = ref.randInt, clamp = ref.clamp, first = ref.first, last = ref.last;

log = require("./tools/log");

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

Quaternion = require('./lib/quaternion');

Vector = require('./lib/vector');

Pos = require('./lib/pos');

_ = require('lodash');

now = require('performance-now');

ref1 = require('./items'), Wall = ref1.Wall, Wire = ref1.Wire, Gear = ref1.Gear, Stone = ref1.Stone, Switch = ref1.Switch, MotorGear = ref1.MotorGear, MotorCylinder = ref1.MotorCylinder, Face = ref1.Face;

world = null;

World = (function(superClass) {
    extend(World, superClass);

    World.levels = null;

    World.normals = [new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(-1, 0, 0), new Vector(0, -1, 0), new Vector(0, 0, -1)];

    function World(view1) {
        this.view = view1;
        this.showHelp = bind(this.showHelp, this);
        this.exitLevel = bind(this.exitLevel, this);
        this.restart = bind(this.restart, this);
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
        this.preview = false;
        this.objects = [];
        this.lights = [];
        this.cells = [];
        this.size = new Pos();
        this.depth = -Number.MAX_SAFE_INTEGER;
    }

    World.deinit = function() {
        return world = null;
    };

    World.init = function(view) {
        if (world != null) {
            return;
        }
        this.initGlobal();
        world = new World(view);
        world.name = 'world';
        global.world = world;
        Timer.init();
        world.create(first(this.levels.list));
        return world;
    };

    World.initGlobal = function() {
        if (this.levels != null) {
            return;
        }
        global.log = log;
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
        console.log("World.create " + this.level_index + " size: " + (new Pos(this.dict["size"]).str()) + " ---------------------- '" + this.level_name + "' scheme: '" + ((ref2 = this.dict.scheme) != null ? ref2 : 'default') + "'");
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
                console.log("World.create [WARNING] @dict.create not a function!");
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
        if (this.dict.camera === 'inside') {
            this.setCameraMode(Camera.INSIDE);
        }
        return this.creating = false;
    };

    World.prototype.restart = function() {
        return this.create(this.dict);
    };

    World.prototype.finish = function() {};

    World.prototype.applyScheme = function(scheme) {
        var base, base1, base2, base3, base4, base5, colors, k, mat, opacity, ref2, ref3, ref4, ref5, ref6, results, shininess, v;
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
            console.log("World.setObjectAtPos [WARNING] invalid pos:", pos);
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
                console.log("WARNING World.deleteAllObjects light no auto remove");
                this.lights.pop();
            }
        }
        results = [];
        while (this.objects.length) {
            oldSize = this.objects.length;
            last(this.objects).del();
            if (oldSize === this.objects.length) {
                console.log("WARNING World.deleteAllObjects object no auto remove " + (last(this.objects).name));
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
        console.log("World.getObjectWithName [WARNING] no object with name " + objectName);
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
            console.log("world.objectWillMoveToPos [WARNING] " + object.name + " invalid targetPos:", targetPos);
            return;
        }
        if (sourcePos.eql(targetPos)) {
            console.log("world.objectWillMoveToPos [WARNING] " + object.name + " equal pos:", targetPos);
            return;
        }
        targetCell = this.getCellAtPos(pos);
        if (targetCell) {
            if (objectAtNewPos = targetCell.getOccupant()) {
                if (objectAtNewPos instanceof TmpObject) {
                    if (objectAtNewPos.time < 0 && -objectAtNewPos.time <= duration) {
                        objectAtNewPos.del();
                    } else {
                        console.log("world.objectWillMoveToPos [WARNING] " + object.name + " timing conflict at pos:", targetPos);
                    }
                } else {
                    console.log("world.objectWillMoveToPos [WARNING] " + object.name + " already occupied:", targetPos);
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
            console.log("World.objectMoved [WARNING] " + movedObject.name + " invalid targetPos:", targetPos);
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
            console.log("World.objectMoved [WARNING] " + movedObject.name + " occupied target pos:", targetPos);
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
            return console.log("world.objectMoved [WARNING] " + movedObject.name + " no target cell?");
        }
    };

    World.prototype.step = function(step) {
        var camera, center, d, len, len1, len2, m, n, o, order, q, quat, ref2, ref3, stone, stones;
        camera = this.player.camera.cam;
        if (false) {
            quat = camera.quaternion.clone();
            quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), step.dsecs * 0.2));
            quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), step.dsecs * 0.1));
            center = this.size.div(2);
            camera.position.set(center.x, center.y, center.z + this.dist).applyQuaternion(quat);
            camera.quaternion.copy(quat);
        }
        Timer.event.triggerActions();
        Timer.event.finishActions();
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
        var camera, ref2, ref3, ref4;
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
        return (ref4 = this.menu) != null ? ref4.resized(w, h) : void 0;
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
        outro_text = "$scale(1.5)congratulations!\n\n$scale(1)you rescued\nthe nano world!\n\nthe last dumb mutant bot\nhas been destroyed.\n\nthe maker is functioning again.\nkiki will go now\nand see all his new friends.\n\nyou should maybe\ndo the same?\nthe maker wants to thank you!\n\n(btw.: you thought\nyou didn't see\nkiki's maker in the game?\nyou are wrong!\nyou saw him\nall the time,\nbecause kiki\nlives inside him!)\n\n$scale(1.5)the end\np.s.: the maker of the game\nwants to thank you as well!\n\ni definitely want your feedback:\nplease send me a mail (monsterkodi@users.sf.net)\nwith your experiences,\nwhich levels you liked, etc.\n\nthanks in advance and have a nice day,\n\nyours kodi";
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

    World.prototype.localizedString = function(str) {
        return str;
    };

    World.prototype.showMenu = function(self) {
        this.menu = new Menu();
        this.menu.addItem(this.localizedString("help"), this.showHelp);
        this.menu.addItem(this.localizedString("restart"), this.restart);
        this.menu.addItem(this.localizedString("load level"), this.showLevels);
        this.menu.addItem(this.localizedString("setup"), this.showSetup);
        this.menu.addItem(this.localizedString("about"), this.showAbout);
        this.menu.addItem(this.localizedString("quit"), this.quit);
        return this.menu.show();
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
        if ((ref2 = this.player) != null ? ref2.modKeyComboEventUp(mod, key, combo, event) : void 0) {

        }
    };

    return World;

})(Actor);

module.exports = World;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHNUQUFBO0lBQUE7Ozs7QUFBQSxNQUtjLE9BQUEsQ0FBUSxlQUFSLENBTGQsRUFDQSxtQkFEQSxFQUVBLHFCQUZBLEVBR0EsaUJBSEEsRUFJQSxpQkFKQSxFQUtBOztBQUNBLEdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLFVBQUEsR0FBYyxPQUFBLENBQVEsa0JBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxj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QyxDQUFBLE9BQUQsQ0FBQTtBQUpsQixpQkFLUyxHQUxUO3VCQUtrQixJQUFDLENBQUEsU0FBRCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtBQU5sQjtJQU5rQjs7b0JBY3RCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBQ2hCLFlBQUE7UUFBQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBRGdCOzs7O0dBNTFCSjs7QUErMUJwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxue1xuYWJzTWluLFxucmFuZEludCxcbmNsYW1wLFxuZmlyc3QsXG5sYXN0fSAgICAgICA9IHJlcXVpcmUgXCIuL3Rvb2xzL3Rvb2xzXCJcbmxvZyAgICAgICAgID0gcmVxdWlyZSBcIi4vdG9vbHMvbG9nXCJcblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuU2l6ZSAgICAgICAgPSByZXF1aXJlICcuL2xpYi9zaXplJ1xuQ2VsbCAgICAgICAgPSByZXF1aXJlICcuL2NlbGwnXG5HYXRlICAgICAgICA9IHJlcXVpcmUgJy4vZ2F0ZSdcbkNhbWVyYSAgICAgID0gcmVxdWlyZSAnLi9jYW1lcmEnXG5MaWdodCAgICAgICA9IHJlcXVpcmUgJy4vbGlnaHQnXG5MZXZlbHMgICAgICA9IHJlcXVpcmUgJy4vbGV2ZWxzJ1xuUGxheWVyICAgICAgPSByZXF1aXJlICcuL3BsYXllcidcblNvdW5kICAgICAgID0gcmVxdWlyZSAnLi9zb3VuZCdcbkNhZ2UgICAgICAgID0gcmVxdWlyZSAnLi9jYWdlJ1xuVGltZXIgICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQWN0b3IgICAgICAgPSByZXF1aXJlICcuL2FjdG9yJ1xuSXRlbSAgICAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5BY3Rpb24gICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5TY3JlZW5UZXh0ICA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcblRtcE9iamVjdCAgID0gcmVxdWlyZSAnLi90bXBvYmplY3QnXG5QdXNoYWJsZSAgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5NYXRlcmlhbCAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5TY2hlbWUgICAgICA9IHJlcXVpcmUgJy4vc2NoZW1lJ1xuUXVhdGVybmlvbiAgPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbl8gICAgICAgICAgID0gcmVxdWlyZSAnbG9kYXNoJ1xubm93ICAgICAgICAgPSByZXF1aXJlICdwZXJmb3JtYW5jZS1ub3cnXG57XG5XYWxsLFxuV2lyZSxcbkdlYXIsXG5TdG9uZSxcblN3aXRjaCxcbk1vdG9yR2Vhcixcbk1vdG9yQ3lsaW5kZXIsXG5GYWNlfSAgICAgICA9IHJlcXVpcmUgJy4vaXRlbXMnXG5cbndvcmxkICAgICAgID0gbnVsbFxuXG5jbGFzcyBXb3JsZCBleHRlbmRzIEFjdG9yXG4gICAgXG4gICAgQGxldmVscyA9IG51bGxcbiAgICBcbiAgICBAbm9ybWFscyA9IFtcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMSwgMCwgMFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAxLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLCAxXG4gICAgICAgICAgICBuZXcgVmVjdG9yIC0xLDAsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsLTEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsLTFcbiAgICBdXG4gICAgXG4gICAgY29uc3RydWN0b3I6IChAdmlldykgLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHNwZWVkICAgICAgID0gNlxuICAgICAgICBcbiAgICAgICAgQHJhc3RlclNpemUgPSAwLjA1XG5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBub1JvdGF0aW9ucyA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcbiAgICAgICAgIyBsb2cgXCJ2aWV3IEBzY3JlZW5TaXplOlwiLCBAc2NyZWVuU2l6ZVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgXG4gICAgICAgICAgICBhbnRpYWxpYXM6ICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyOiBmYWxzZVxuICAgICAgICAgICAgYXV0b0NsZWFyOiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIHNvcnRPYmplY3RzOiAgICAgICAgICAgIHRydWVcblxuICAgICAgICAjIEByZW5kZXJlci5zZXRDbGVhckNvbG9yIDB4MDAwMDAwICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnNldFNpemUgQHZpZXcub2Zmc2V0V2lkdGgsIEB2aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiAgICAgICAgIyAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuICAgICAgICBAc3VuID0gbmV3IFRIUkVFLlBvaW50TGlnaHQgMHhmZmZmZmZcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkgaWYgQHBsYXllcj9cbiAgICAgICAgQHNjZW5lLmFkZCBAc3VuXG4gICAgICAgIFxuICAgICAgICBAYW1iaWVudCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQgMHgxMTExMTFcbiAgICAgICAgQHNjZW5lLmFkZCBAYW1iaWVudFxuICAgICAgICAgXG4gICAgICAgIEBwcmV2aWV3ICAgICAgICAgPSBmYWxzZVxuICAgICAgICBAb2JqZWN0cyAgICAgICAgID0gW11cbiAgICAgICAgQGxpZ2h0cyAgICAgICAgICA9IFtdXG4gICAgICAgIEBjZWxscyAgICAgICAgICAgPSBbXSBcbiAgICAgICAgQHNpemUgICAgICAgICAgICA9IG5ldyBQb3MoKVxuICAgICAgICBAZGVwdGggICAgICAgICAgID0gLU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgIFxuICAgIEBkZWluaXQ6ICgpIC0+XG4gICAgICAgIHdvcmxkID0gbnVsbFxuICAgICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gd29ybGRcbiAgICAgICAgVGltZXIuaW5pdCgpXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBmaXJzdCBAbGV2ZWxzLmxpc3RcbiAgICAgICAgd29ybGRcbiAgICAgICAgXG4gICAgQGluaXRHbG9iYWw6ICgpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVscz9cbiAgICAgICAgZ2xvYmFsLmxvZyA9IGxvZ1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9KSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICAjIGxvZyBcIndvcmxkLmNyZWF0ZVwiLCB3b3JsZERpY3RcbiAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkRGljdFxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBkaWN0ID0gV29ybGQubGV2ZWxzLmRpY3Rbd29ybGREaWN0XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0Lm5hbWVcbiAgICAgICAgICAgICAgICBAZGljdCA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGV2ZWxfaW5kZXggPSBXb3JsZC5sZXZlbHMubGlzdC5pbmRleE9mIEBsZXZlbF9uYW1lXG4gICAgICAgIGxvZyBcIldvcmxkLmNyZWF0ZSAje0BsZXZlbF9pbmRleH0gc2l6ZTogI3tuZXcgUG9zKEBkaWN0W1wic2l6ZVwiXSkuc3RyKCl9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gJyN7QGxldmVsX25hbWV9JyBzY2hlbWU6ICcje0BkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J30nXCJcblxuICAgICAgICBAY3JlYXRpbmcgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFNpemUgQGRpY3Quc2l6ZSAjIHRoaXMgcmVtb3ZlcyBhbGwgb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQGFwcGx5U2NoZW1lIEBkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGludHJvIHRleHQgICBcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlld1xuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBlc2NhcGVcbiAgICAgICAgIyBlc2NhcGVfZXZlbnQgPSBDb250cm9sbGVyLmdldEV2ZW50V2l0aE5hbWUgKFwiZXNjYXBlXCIpXG4gICAgICAgICMgZXNjYXBlX2V2ZW50LnJlbW92ZUFsbEFjdGlvbnMoKVxuICAgICAgICAjIGVzY2FwZV9ldmVudC5hZGRBY3Rpb24oY29udGludW91cyhAZXNjYXBlLCBcImVzY2FwZVwiKSlcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5jcmVhdGUgW1dBUk5JTkddIEBkaWN0LmNyZWF0ZSBub3QgYSBmdW5jdGlvbiFcIlxuICAgICAgICAgICAgICAgICMgZXhlYyBAZGljdFtcImNyZWF0ZVwiXSBpbiBnbG9iYWxzKClcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuICAgICAgICAjIGxvZyBcInBsYXllcl9kaWN0XCIsIHBsYXllcl9kaWN0XG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldFBvc2l0aW9uIEBwbGF5ZXIuY3VycmVudFBvcygpXG4gICAgICAgIFxuICAgICAgICBAc2V0Q2FtZXJhTW9kZSBDYW1lcmEuSU5TSURFIGlmIEBkaWN0LmNhbWVyYSA9PSAnaW5zaWRlJ1xuICAgICAgICBcbiAgICAgICAgQGNyZWF0aW5nID0gZmFsc2VcbiAgICBcbiAgICByZXN0YXJ0OiA9PiBAY3JlYXRlIEBkaWN0XG5cbiAgICBmaW5pc2g6ICgpIC0+ICMgVE9ETzogc2F2ZSBwcm9ncmVzc1xuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGFwcGx5U2NoZW1lOiAoc2NoZW1lKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICAjIGxvZyBcIndvcmxkLmFwcGx5U2NoZW1lICN7c2NoZW1lfVwiXG4gICAgICAgIFxuICAgICAgICBjb2xvcnMgPSBfLmNsb25lIFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBvcGFjaXR5ID1cbiAgICAgICAgICAgIHN0b25lOiAwLjdcbiAgICAgICAgICAgIGJvbWI6ICAwLjlcbiAgICAgICAgICAgIHRleHQ6ICAwXG4gICAgICAgICAgICBcbiAgICAgICAgc2hpbmluZXNzID0gXG4gICAgICAgICAgICB0aXJlOiAgIDRcbiAgICAgICAgICAgIHBsYXRlOiAgMTBcbiAgICAgICAgICAgIHJhc3RlcjogMjBcbiAgICAgICAgICAgIHdhbGw6ICAgMjBcbiAgICAgICAgICAgIHN0b25lOiAgMjBcbiAgICAgICAgICAgIGdlYXI6ICAgMjBcbiAgICAgICAgICAgIHRleHQ6ICAgMjAwXG4gICAgICAgICAgICBcbiAgICAgICAgY29sb3JzLnBsYXRlLmVtaXNzaXZlID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgPz0gY29sb3JzLmJ1bGIuY29sb3JcbiAgICAgICAgY29sb3JzLm1lbnUgPz0ge30gICBcbiAgICAgICAgY29sb3JzLm1lbnUuY29sb3IgPz0gY29sb3JzLmdlYXIuY29sb3JcbiAgICAgICAgY29sb3JzLnJhc3RlciA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLndhbGwgPz0ge31cbiAgICAgICAgY29sb3JzLndhbGwuY29sb3IgPz0gbmV3IFRIUkVFLkNvbG9yKGNvbG9ycy5wbGF0ZS5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC42XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUgPz0ge31cbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZS5jb2xvciA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBmb3Igayx2IG9mIGNvbG9yc1xuICAgICAgICAgICAgIyBsb2cgXCIje2t9ICN7di5jb2xvcj8ucn0gI3t2LmNvbG9yPy5nfSAje3YuY29sb3I/LmJ9XCIsIHZcbiAgICAgICAgICAgICMgY29udGludWUgaWYgayA9PSAndGV4dCdcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIEBsaWdodHMucHVzaCBsaWdodFxuICAgICAgICBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgbGlnaHRcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICBAZW5hYmxlU2hhZG93cyBzaGFkb3dcblxuICAgIGVuYWJsZVNoYWRvd3M6IChlbmFibGUpIC0+XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBAZmluaXNoKClcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5sZXZlbF9pbmRleCAje3dvcmxkLmxldmVsX2luZGV4fSBuZXh0TGV2ZWwgI3tXb3JsZC5sZXZlbHMubGlzdFt3b3JsZC5sZXZlbF9pbmRleCsxXX1cIlxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgQGRlbGV0ZUFsbE9iamVjdHMoKVxuICAgICAgICBAY2VsbHMgPSBbXVxuICAgICAgICBAc2l6ZSA9IG5ldyBQb3Mgc2l6ZVxuICAgICAgICAjIGNhbGN1YXRlIG1heCBkaXN0YW5jZSAoZm9yIHBvc2l0aW9uIHJlbGF0aXZlIHNvdW5kKVxuICAgICAgICBAbWF4X2Rpc3RhbmNlID0gTWF0aC5tYXgoQHNpemUueCwgTWF0aC5tYXgoQHNpemUueSwgQHNpemUueikpICAjIGhldXJpc3RpYyBvZiBhIGhldXJpc3RpYyA6LSlcbiAgICAgICAgQGNhZ2U/LmRlbCgpXG4gICAgICAgIEBjYWdlID0gbmV3IENhZ2UgQHNpemUsIEByYXN0ZXJTaXplXG5cbiAgICBnZXRDZWxsQXRQb3M6IChwb3MpIC0+IHJldHVybiBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gaWYgQGlzVmFsaWRQb3MgcG9zXG4gICAgZ2V0Qm90QXRQb3M6ICAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgQm90LCBuZXcgUG9zIHBvc1xuXG4gICAgcG9zVG9JbmRleDogICAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCAqIEBzaXplLnogKiBAc2l6ZS55ICsgcC55ICogQHNpemUueiArIHAuelxuICAgICAgICBcbiAgICBpbmRleFRvUG9zOiAgIChpbmRleCkgLT4gXG4gICAgICAgIGxzaXplID0gQHNpemUueiAqIEBzaXplLnlcbiAgICAgICAgbHJlc3QgPSBpbmRleCAlIGxzaXplXG4gICAgICAgIG5ldyBQb3MgaW5kZXgvbHNpemUsIGxyZXN0L0BzaXplLnosIGxyZXN0JUBzaXplLnpcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkT2JqZWN0QXRQb3M6IChvYmplY3QsIHgsIHksIHopIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgeCwgeSwgelxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyBsb2cgXCJhZGRPYmplY3RBdFBvcyAje29iamVjdC5uYW1lfVwiLCBwb3NcbiAgICAgICAgQGFkZE9iamVjdCBvYmplY3RcblxuICAgIGFkZE9iamVjdExpbmU6IChvYmplY3QsIHN4LHN5LHN6LCBleCxleSxleikgLT5cbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgXG4gICAgICAgIGRpZmYgPSBbZXgtc3gsIGV5LXN5LCBlei1zel1cbiAgICAgICAgbWF4ZGlmZiA9IF8ubWF4IGRpZmYubWFwIE1hdGguYWJzXG4gICAgICAgIGRlbHRhcyA9IGRpZmYubWFwIChhKSAtPiBhL21heGRpZmZcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5tYXhkaWZmXVxuICAgICAgICAgICAgIyBwb3MgPSBhcHBseShQb3MsIChtYXAgKGxhbWJkYSBhLCBiOiBpbnQoYStpKmIpLCBzdGFydCwgZGVsdGFzKSkpXG4gICAgICAgICAgICBwb3MgPSBuZXcgUG9zIChzdGFydFtqXStpKmRlbHRhc1tqXSBmb3IgaiBpbiBbMC4uMl0pXG4gICAgICAgICAgICAjIGxvZyBcImFkZE9iamVjdExpbmUgI3tpfTpcIiwgcG9zXG4gICAgICAgICAgICBpZiBAaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgIFxuICAgIGFkZE9iamVjdFBvbHk6IChvYmplY3QsIHBvaW50cywgY2xvc2U9dHJ1ZSkgLT5cbiAgICAgICAgIyBhZGRzIGEgcG9seWdvbiBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBwb2ludHMgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGNsb3NlXG4gICAgICAgICAgICBwb2ludHMucHVzaCBwb2ludHNbMF1cbiAgICAgICAgZm9yIGluZGV4IGluIFsxLi4ucG9pbnRzLmxlbmd0aF1cbiAgICAgICAgICAgIEBhZGRPYmplY3RMaW5lIG9iamVjdCwgcG9pbnRzW2luZGV4LTFdLCBwb2ludHNbaW5kZXhdXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UmFuZG9tOiAob2JqZWN0LCBudW1iZXIpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIGZvciBpIGluIFswLi4ubnVtYmVyXVxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gb2JqZWN0KClcbiAgICAgICAgXG4gICAgc2V0T2JqZWN0UmFuZG9tOiAob2JqZWN0KSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBvYmplY3RTZXQgPSBmYWxzZVxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICB3aGlsZSBub3Qgb2JqZWN0U2V0ICMgaGFjayBhbGVydCFcbiAgICAgICAgICAgIHJhbmRvbVBvcyA9IG5ldyBQb3MgcmFuZEludChAc2l6ZS54KSwgcmFuZEludChAc2l6ZS55KSwgcmFuZEludChAc2l6ZS56KVxuICAgICAgICAgICAgaWYgbm90IG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKSBvciBAaXNVbm9jY3VwaWVkUG9zIHJhbmRvbVBvcyBcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCByYW5kb21Qb3NcbiAgICAgICAgICAgICAgICBvYmplY3RTZXQgPSB0cnVlXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAgICAgIDAwMFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgICAgIFxuICAgIGdldE9iamVjdHNPZlR5cGU6ICAgICAgKGNsc3MpICAgICAgLT4gQG9iamVjdHMuZmlsdGVyIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9iamVjdHNPZlR5cGVBdFBvczogKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPYmplY3RzT2ZUeXBlKGNsc3MpID8gW11cbiAgICBnZXRPYmplY3RPZlR5cGVBdFBvczogIChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0UmVhbE9iamVjdE9mVHlwZShjbHNzKVxuICAgIGdldE9jY3VwYW50QXRQb3M6ICAgICAgICAgICAgKHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPY2N1cGFudCgpXG4gICAgZ2V0UmVhbE9jY3VwYW50QXRQb3M6IChwb3MpIC0+XG4gICAgICAgIG9jY3VwYW50ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgIGlmIG9jY3VwYW50IGFuZCBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgb2NjdXBhbnQub2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9jY3VwYW50XG4gICAgc3dpdGNoQXRQb3M6IChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBTd2l0Y2gsIHBvc1xuICAgIHNldE9iamVjdEF0UG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gaW52YWxpZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKVxuICAgICAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgPSBjZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50LnRpbWUgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCB0aW1lOlwiLCBvY2N1cGFudC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5kZWwoKSAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBhbnl3YXkgLiBkZWxldGUgaXRcbiAgICAgICAgXG4gICAgICAgIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiBub3QgY2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4KHBvcylcbiAgICAgICAgICAgIGNlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IGNlbGxcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5zZXRQb3NpdGlvbiBwb3NcbiAgICAgICAgY2VsbC5hZGRPYmplY3Qgb2JqZWN0XG5cbiAgICB1bnNldE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgcG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgY2VsbC5yZW1vdmVPYmplY3Qgb2JqZWN0XG4gICAgICAgICAgICBpZiBjZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSA9IG51bGxcbiAgICAgICAgIyBlbHNlIFxuICAgICAgICAgICAgIyBsb2cgJ3dvcmxkLnVuc2V0T2JqZWN0IFtXQVJOSU5HXSBubyBjZWxsIGF0IHBvczonLCBwb3NcblxuICAgIG5ld09iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgIGlmIG9iamVjdC5zdGFydHNXaXRoICduZXcnXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgcmV0dXJuIG5ldyAocmVxdWlyZSBcIi4vI3tvYmplY3QudG9Mb3dlckNhc2UoKX1cIikoKVxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBJdGVtXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QoKVxuICAgICAgICBcbiAgICBhZGRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIExpZ2h0XG4gICAgICAgICAgICBAbGlnaHRzLnB1c2ggb2JqZWN0ICMgaWYgbGlnaHRzLmluZGV4T2Yob2JqZWN0KSA8IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3QgIyBpZiBvYmplY3RzLmluZGV4T2Yob2JqZWN0KSA8IDAgXG5cbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIEB1bnNldE9iamVjdCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIG9iamVjdFxuICAgICAgICBfLnB1bGwgQG9iamVjdHMsIG9iamVjdFxuICAgIFxuICAgIG1vdmVPYmplY3RUb1BvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyhwb3MpIG9yIEBpc09jY3VwaWVkUG9zKHBvcylcbiAgICAgICAgQHVuc2V0T2JqZWN0ICAgIG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgdHJ1ZVxuICAgICAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAbGlnaHRzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBsb2cgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgbGlnaHQgbm8gYXV0byByZW1vdmVcIlxuICAgICAgICAgICAgICAgIEBsaWdodHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBvYmplY3RzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgbG9nIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIG9iamVjdCBubyBhdXRvIHJlbW92ZSAje2xhc3QoQG9iamVjdHMpLm5hbWV9XCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0cy5wb3AoKVxuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3ROYW1lID09IG8ubmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgIGxvZyBcIldvcmxkLmdldE9iamVjdFdpdGhOYW1lIFtXQVJOSU5HXSBubyBvYmplY3Qgd2l0aCBuYW1lICN7b2JqZWN0TmFtZX1cIlxuICAgICAgICBudWxsXG4gICAgXG4gICAgc2V0Q2FtZXJhTW9kZTogKG1vZGUpIC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSBjbGFtcCBDYW1lcmEuSU5TSURFLCBDYW1lcmEuRk9MTE9XLCBtb2RlXG4gICAgXG4gICAgY2hhbmdlQ2FtZXJhTW9kZTogLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IChAcGxheWVyLmNhbWVyYS5tb2RlKzEpICUgKENhbWVyYS5GT0xMT1crMSlcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgb2JqZWN0V2lsbE1vdmVUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zICN7b2JqZWN0Lm5hbWV9ICN7ZHVyYXRpb259XCIsIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGxvZyBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgc291cmNlUG9zLmVxbCB0YXJnZXRQb3NcbiAgICAgICAgICAgIGxvZyBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGVxdWFsIHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiB0YXJnZXRDZWxsXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyA9IHRhcmdldENlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zLnRpbWUgPCAwIGFuZCAtb2JqZWN0QXROZXdQb3MudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXROZXdQb3MuZGVsKClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gdGltaW5nIGNvbmZsaWN0IGF0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBhbHJlYWR5IG9jY3VwaWVkOlwiLCB0YXJnZXRQb3MgXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5uYW1lICE9ICdwbGF5ZXInXG4gICAgICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0ICMgcmVtb3ZlIG9iamVjdCBmcm9tIGNlbGwgZ3JpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIGxvZyAnd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyB0bXBPYmplY3QgYXQgb2xkIHBvcycsIHNvdXJjZVBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgb2xkIHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHNvdXJjZVBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSAtZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHNvdXJjZVBvcyBcblxuICAgICAgICAgICAgIyBsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG5ldyBwb3MnLCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBuZXcgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSBkdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgdGFyZ2V0UG9zIFxuXG4gICAgb2JqZWN0TW92ZWQ6IChtb3ZlZE9iamVjdCwgZnJvbSwgdG8pIC0+XG4gICAgICAgIHNvdXJjZVBvcyA9IG5ldyBQb3MgZnJvbVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHRvXG5cbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgICBsb2cgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICAjIGxvZyBcIndvcmxkLm9iamVjdE1vdmVkICN7bW92ZWRPYmplY3QubmFtZX1cIiwgc291cmNlUG9zXG4gICAgICAgIFxuICAgICAgICBzb3VyY2VDZWxsID0gQGdldENlbGxBdFBvcyBzb3VyY2VQb3NcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiB0bXBPYmplY3QgPSBzb3VyY2VDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcblxuICAgICAgICBpZiB0bXBPYmplY3QgPSB0YXJnZXRDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAaXNPY2N1cGllZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGxvZyBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG9jY3VwaWVkIHRhcmdldCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3MgICAgXG4gICAgICAgIGlmIG5vdCB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXggdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gdGFyZ2V0Q2VsbFxuXG4gICAgICAgIGlmIHRhcmdldENlbGw/XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmFkZE9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2cgXCJ3b3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBubyB0YXJnZXQgY2VsbD9cIlxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAgICBcbiAgICBcbiAgICBzdGVwOiAoc3RlcCkgLT5cbiAgICAgICAgY2FtZXJhID0gQHBsYXllci5jYW1lcmEuY2FtXG4gICAgICAgIGlmIGZhbHNlXG4gICAgICAgICAgICBxdWF0ID0gY2FtZXJhLnF1YXRlcm5pb24uY2xvbmUoKVxuICAgICAgICAgICAgcXVhdC5tdWx0aXBseSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUgbmV3IFRIUkVFLlZlY3RvcjMoMSwwLDApLCBzdGVwLmRzZWNzKjAuMlxuICAgICAgICAgICAgcXVhdC5tdWx0aXBseSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21BeGlzQW5nbGUgbmV3IFRIUkVFLlZlY3RvcjMoMCwxLDApLCBzdGVwLmRzZWNzKjAuMVxuICAgICAgICAgICAgY2VudGVyID0gQHNpemUuZGl2IDJcbiAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5zZXQoY2VudGVyLngsY2VudGVyLnksY2VudGVyLnorQGRpc3QpLmFwcGx5UXVhdGVybmlvbiBxdWF0XG4gICAgICAgICAgICBjYW1lcmEucXVhdGVybmlvbi5jb3B5IHF1YXRcblxuICAgICAgICBUaW1lci5ldmVudC50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIFRpbWVyLmV2ZW50LmZpbmlzaEFjdGlvbnMoKVxuICAgICAgICBcbiAgICAgICAgby5zdGVwPyhzdGVwKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwIHN0ZXBcblxuICAgICAgICBTb3VuZC5zZXRNYXRyaXggQHBsYXllci5jYW1lcmFcbiAgICAgICAgICAgIFxuICAgICAgICBAcGxheWVyLnNldE9wYWNpdHkgY2xhbXAgMCwgMSwgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKS5taW51cyhAcGxheWVyLmN1cnJlbnRfcG9zaXRpb24pLmxlbmd0aCgpLTAuNFxuICAgICAgICBcbiAgICAgICAgc3RvbmVzID0gW11cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG8gaW5zdGFuY2VvZiBTdG9uZVxuICAgICAgICAgICAgICAgIHN0b25lcy5wdXNoIG9cbiAgICAgICAgc3RvbmVzLnNvcnQgKGEsYikgPT4gYi5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKSAtIGEucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgXG4gICAgICAgIG9yZGVyID0gMTAwXG4gICAgICAgIGZvciBzdG9uZSBpbiBzdG9uZXNcbiAgICAgICAgICAgIHN0b25lLm1lc2gucmVuZGVyT3JkZXIgPSBvcmRlclxuICAgICAgICAgICAgb3JkZXIgKz0gMVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkID0gc3RvbmUucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgICAgIGlmIGQgPCAxLjBcbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSBpZiBub3Qgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gMC4yICsgZCAqIDAuNVxuICAgICAgICAgICAgZWxzZSBpZiBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICBcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IGNhbWVyYS5wb3NpdGlvblxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IgPSBmYWxzZVxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBzY2VuZSwgY2FtZXJhXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHRleHQuc2NlbmUsIEB0ZXh0LmNhbWVyYSBpZiBAdGV4dFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBtZW51LnNjZW5lLCBAbWVudS5jYW1lcmEgaWYgQG1lbnVcbiAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBnZXRUaW1lOiAtPiBub3coKS50b0ZpeGVkIDBcbiAgICBzZXRTcGVlZDogKHMpIC0+IEBzcGVlZCA9IHNcbiAgICBnZXRTcGVlZDogLT4gQHNwZWVkXG4gICAgbWFwTXNUaW1lOiAgKHVubWFwcGVkKSAtPiBwYXJzZUludCAxMC4wICogdW5tYXBwZWQvQHNwZWVkXG4gICAgdW5tYXBNc1RpbWU6IChtYXBwZWQpIC0+IHBhcnNlSW50IG1hcHBlZCAqIEBzcGVlZC8xMC4wXG4gICAgICAgIFxuICAgIGNvbnRpbnVvdXM6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcImNvbnRpbnVvdXNcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLkNPTlRJTlVPVVNcblxuICAgIG9uY2U6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcIm9uY2VcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIHJlc2l6ZWQ6ICh3LGgpIC0+XG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgY2FtZXJhID0gQHBsYXllci5jYW1lcmEuY2FtXG4gICAgICAgIGNhbWVyYT8uYXNwZWN0ID0gQGFzcGVjdFxuICAgICAgICBjYW1lcmE/LnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgICAgICBAcmVuZGVyZXI/LnNldFNpemUgdyxoXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgdyxoXG4gICAgICAgIEB0ZXh0Py5yZXNpemVkIHcsaFxuICAgICAgICBAbWVudT8ucmVzaXplZCB3LGhcblxuICAgIGdldE5lYXJlc3RWYWxpZFBvczogKHBvcykgLT5cbiAgICAgICAgbmV3IFBvcyBNYXRoLm1pbihAc2l6ZS54LTEsIE1hdGgubWF4KHBvcy54LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnktMSwgTWF0aC5tYXgocG9zLnksIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUuei0xLCBNYXRoLm1heChwb3MueiwgMCkpXG4gICAgXG4gICAgaXNVbm9jY3VwaWVkUG9zOiAocG9zKSAtPiBub3QgQGlzT2NjdXBpZWRQb3MgcG9zXG4gICAgaXNPY2N1cGllZFBvczogICAocG9zKSAtPiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgICMgbG9nIFwiaXNPY2N1cGllZFBvcyBvY2N1cGFudDogI3tAZ2V0T2NjdXBhbnRBdFBvcyhwb3MpLm5hbWV9IGF0IHBvczpcIiwgbmV3IFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgbWF5T2JqZWN0UHVzaFRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICAjIGxvZyBcIndvcmxkLm1heU9iamVjdFB1c2hUb1BvcyBvYmplY3Q6I3tvYmplY3QubmFtZX0gZHVyYXRpb246I3tkdXJhdGlvbn1cIiwgcG9zXG4gICAgICAgICMgcmV0dXJucyB0cnVlLCBpZiBhIHB1c2hhYmxlIG9iamVjdCBpcyBhdCBwb3MgYW5kIG1heSBiZSBwdXNoZWRcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICBkaXJlY3Rpb24gPSBwb3MubWludXMgb2JqZWN0LmdldFBvcygpICMgZGlyZWN0aW9uIGZyb20gb2JqZWN0IHRvIHB1c2hhYmxlIG9iamVjdFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIEBpc0ludmFsaWRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIFxuICAgICAgICBvYmplY3RBdE5ld1BvcyA9IEBnZXRPY2N1cGFudEF0UG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBpZiBvYmplY3RBdE5ld1Bvc1xuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICB0bXBPYmplY3QgPSBvYmplY3RBdE5ld1Bvc1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIHRtcE9iamVjdC50aW1lIDwgMCBhbmQgLXRtcE9iamVjdC50aW1lIDw9IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLT4gZGVsZXRlIGl0XG4gICAgICAgICAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKVxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgIFxuICAgICAgICBwdXNoYWJsZU9iamVjdCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAjIGxvZyBcInB1c2hhYmxlT2JqZWN0ICN7cHVzaGFibGVPYmplY3Q/Lm5hbWV9XCJcbiAgICAgICAgaWYgcHVzaGFibGVPYmplY3Q/IGFuZCBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIFB1c2hhYmxlICNhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIE1vdG9yR2VhciAjIGJhZFxuICAgICAgICAgICAgcHVzaGFibGVPYmplY3QucHVzaGVkQnlPYmplY3RJbkRpcmVjdGlvbiBvYmplY3QsIGRpcmVjdGlvbiwgZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgICAgIGZhbHNlXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAgICAgICBcbiAgICBcbiAgICBzaG93SGVscDogPT5cbiAgICAgICAgIyBAbWVudS5kZWwoKVxuICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0WydoZWxwJ11cblxuICAgIG91dHJvOiAoaW5kZXg9MCkgLT5cbiAgICAgICAgIyB3ZWxsIGhpZGRlbiBvdXRybyA6LSlcbiAgICAgICAgb3V0cm9fdGV4dCA9IFwiXCJcIlxuICAgICAgICAgICAgICAgICAgICAkc2NhbGUoMS41KWNvbmdyYXR1bGF0aW9ucyFcXG5cXG4kc2NhbGUoMSl5b3UgcmVzY3VlZFxcbnRoZSBuYW5vIHdvcmxkIVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhlIGxhc3QgZHVtYiBtdXRhbnQgYm90XFxuaGFzIGJlZW4gZGVzdHJveWVkLlxcblxcbnRoZSBtYWtlciBpcyBmdW5jdGlvbmluZyBhZ2Fpbi5cbiAgICAgICAgICAgICAgICAgICAga2lraSB3aWxsIGdvIG5vd1xcbmFuZCBzZWUgYWxsIGhpcyBuZXcgZnJpZW5kcy5cXG5cXG55b3Ugc2hvdWxkIG1heWJlXFxuZG8gdGhlIHNhbWU/XG4gICAgICAgICAgICAgICAgICAgIHRoZSBtYWtlciB3YW50cyB0byB0aGFuayB5b3UhXFxuXFxuKGJ0dy46IHlvdSB0aG91Z2h0XFxueW91IGRpZG4ndCBzZWVcXG5raWtpJ3MgbWFrZXIgaW4gdGhlIGdhbWU/XG4gICAgICAgICAgICAgICAgICAgIHlvdSBhcmUgd3JvbmchXFxueW91IHNhdyBoaW1cXG5hbGwgdGhlIHRpbWUsXFxuYmVjYXVzZSBraWtpXFxubGl2ZXMgaW5zaWRlIGhpbSEpXFxuXFxuJHNjYWxlKDEuNSl0aGUgZW5kXG4gICAgICAgICAgICAgICAgICAgIHAucy46IHRoZSBtYWtlciBvZiB0aGUgZ2FtZVxcbndhbnRzIHRvIHRoYW5rIHlvdSBhcyB3ZWxsIVxcblxcbmkgZGVmaW5pdGVseSB3YW50IHlvdXIgZmVlZGJhY2s6XG4gICAgICAgICAgICAgICAgICAgIHBsZWFzZSBzZW5kIG1lIGEgbWFpbCAobW9uc3RlcmtvZGlAdXNlcnMuc2YubmV0KVxcbndpdGggeW91ciBleHBlcmllbmNlcyxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggbGV2ZWxzIHlvdSBsaWtlZCwgZXRjLlxcblxcbnRoYW5rcyBpbiBhZHZhbmNlIGFuZCBoYXZlIGEgbmljZSBkYXksXFxuXFxueW91cnMga29kaVxuICAgICAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgXG4gICAgICAgIG1vcmVfdGV4dCA9IGluZGV4IDwgb3V0cm9fdGV4dC5sZW5ndGgtMVxuICAgICAgICBsZXNzX3RleHQgPSBpbmRleCA+IDBcbiAgICAgICAgXG4gICAgICAgIHBhZ2VfdGV4dCA9IG91dHJvX3RleHRbaW5kZXhdXG4gICAgICAgIHBhZ2VfdGV4dCArPSBcIlxcblxcbiRzY2FsZSgwLjUpKCN7aW5kZXgrMX0vI3tvdXRyb190ZXh0Lmxlbmd0aH0pXCJcbiAgICBcbiAgICAgICAgcGFnZSA9IEtpa2lQYWdlVGV4dChwYWdlX3RleHQsIG1vcmVfdGV4dCwgbGVzc190ZXh0KVxuICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJoaWRlXCIpLmFkZEFjdGlvbihvbmNlKGRpc3BsYXlfbWFpbl9tZW51KSlcbiAgICAgICAgXG4gICAgICAgIGlmIG1vcmVfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwibmV4dFwiKS5hZGRBY3Rpb24gKGk9aW5kZXgrMSkgPT4gQG91dHJvIGlcbiAgICAgICAgaWYgbGVzc190ZXh0XG4gICAgICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJwcmV2aW91c1wiKS5hZGRBY3Rpb24gKGk9aW5kZXgtMSkgPT4gQG91dHJvIGlcbiAgICAgICAgXG4gICAgcmVzZXRQcm9qZWN0aW9uOiAtPiBAcGxheWVyLmNhbWVyYS5zZXRWaWV3cG9ydCAwLjAsIDAuMCwgMS4wLCAxLjBcbiAgICBcbiAgICAjIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwIFxuICAgIFxuICAgIGxvY2FsaXplZFN0cmluZzogKHN0cikgLT4gc3RyXG4gICAgXG4gICAgc2hvd01lbnU6IChzZWxmKSAtPiAjIGhhbmRsZXMgYW4gRVNDIGtleSBldmVudFxuICAgICAgICAjIEB0ZXh0Py5kZWwoKVxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwiaGVscFwiKSwgICAgICAgQHNob3dIZWxwXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcInJlc3RhcnRcIiksICAgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJsb2FkIGxldmVsXCIpLCBAc2hvd0xldmVsc1xuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJzZXR1cFwiKSwgICAgICBAc2hvd1NldHVwICAgICAgIFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJhYm91dFwiKSwgICAgICBAc2hvd0Fib3V0XG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcInF1aXRcIiksICAgICAgIEBxdWl0XG4gICAgICAgIEBtZW51LnNob3coKVxuICAgIFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMFxuICAgIFxuICAgIGdldEluc2lkZVdhbGxQb3NXaXRoRGVsdGE6IChwb3MsIGRlbHRhKSAtPlxuICAgICAgICBpbnNpZGVQb3MgPSBuZXcgVmVjdG9yIHBvc1xuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgaWYgZiA8IGRlbHRhXG4gICAgICAgICAgICAgICAgaW5zaWRlUG9zLmFkZCBXb3JsZC5ub3JtYWxzW3ddLm11bCBkZWx0YS1mXG4gICAgICAgIGluc2lkZVBvc1xuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclBvczogKHBvcykgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIChwb3NpdGl2ZSBvciBuZWdhdGl2ZSlcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV0gXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gYWJzTWluIG1pbl9mLCBmIFxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclJheTogKHJheVBvcywgcmF5RGlyKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgaW4gcmF5RGlyIFxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciByYXlQb3MsIHJheURpciwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gZiBpZiBmID49IDAuMCBhbmQgZiA8IG1pbl9mXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZGlzcGxheUxpZ2h0czogKCkgLT5cbiAgICAgICAgZm9yIGxpZ2h0IGluIEBsaWdodHNcbiAgICAgICAgICAgIGxpZ250LmRpc3BsYXkoKVxuICAgICAgICAgICAgICAgXG4gICAgcGxheVNvdW5kOiAoc291bmQsIHBvcywgdGltZSkgLT4gU291bmQucGxheSBzb3VuZCwgcG9zLCB0aW1lIGlmIG5vdCBAY3JlYXRpbmdcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMDAwIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgIDAwMDAwICBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgaWYgQG1lbnU/ICAgICAgICAgICAgXG4gICAgICAgICAgICBAbWVudS5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIEB0ZXh0Py5mYWRlT3V0KClcbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnREb3duIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICAgICAgc3dpdGNoIGNvbWJvXG4gICAgICAgICAgICB3aGVuICdlc2MnIHRoZW4gQHNob3dNZW51KClcbiAgICAgICAgICAgIHdoZW4gJz0nIHRoZW4gQHNwZWVkID0gTWF0aC5taW4gMTAsIEBzcGVlZCsxXG4gICAgICAgICAgICB3aGVuICctJyB0aGVuIEBzcGVlZCA9IE1hdGgubWF4IDEsICBAc3BlZWQtMVxuICAgICAgICAgICAgd2hlbiAncicgdGhlbiBAcmVzdGFydCgpXG4gICAgICAgICAgICB3aGVuICduJyB0aGVuIEBleGl0TGV2ZWwoKVxuICAgICAgICAgICAgd2hlbiAnbScgdGhlbiBAZXhpdExldmVsIDVcblxuICAgIG1vZEtleUNvbWJvRXZlbnRVcDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50VXAgbW9kLCBrZXksIGNvbWJvLCBldmVudCAgICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGRcblxuIl19
//# sourceURL=../coffee/world.coffee