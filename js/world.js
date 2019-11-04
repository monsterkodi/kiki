// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, first, last, now, randInt, ref, ref1, world,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), randInt = ref.randInt, colors = ref.colors, absMin = ref.absMin, first = ref.first, clamp = ref.clamp, last = ref.last, _ = ref._;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLHlUQUFBO0lBQUE7Ozs7QUFBQSxNQUFxRCxPQUFBLENBQVEsS0FBUixDQUFyRCxFQUFFLHFCQUFGLEVBQVcsbUJBQVgsRUFBbUIsbUJBQW5CLEVBQTJCLGlCQUEzQixFQUFrQyxpQkFBbEMsRUFBeUMsZUFBekMsRUFBK0M7O0FBRS9DLEdBQUEsR0FBYyxPQUFBLENBQVEsV0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxRQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFBLENBQVEsVUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxLQUFBLEdBQWMsT0FBQSxDQUFRLFNBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxRQUFSOztBQUNkLFVBQUEsR0FBYyxPQUFBLENBQVEsY0FBUjs7QUFDZCxTQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxrQkFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFR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RCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtBQU5sQjtJQU5rQjs7b0JBY3RCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBQ2hCLFlBQUE7UUFBQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBRGdCOzs7O0dBMzFCSjs7QUE4MUJwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBmaXJzdCwgY2xhbXAsIGxhc3QsIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5TaXplICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3NpemUnXG5DZWxsICAgICAgICA9IHJlcXVpcmUgJy4vY2VsbCdcbkdhdGUgICAgICAgID0gcmVxdWlyZSAnLi9nYXRlJ1xuQ2FtZXJhICAgICAgPSByZXF1aXJlICcuL2NhbWVyYSdcbkxpZ2h0ICAgICAgID0gcmVxdWlyZSAnLi9saWdodCdcbkxldmVscyAgICAgID0gcmVxdWlyZSAnLi9sZXZlbHMnXG5QbGF5ZXIgICAgICA9IHJlcXVpcmUgJy4vcGxheWVyJ1xuU291bmQgICAgICAgPSByZXF1aXJlICcuL3NvdW5kJ1xuQ2FnZSAgICAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5UaW1lciAgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5BY3RvciAgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5JdGVtICAgICAgICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiAgICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NZW51ICAgICAgICA9IHJlcXVpcmUgJy4vbWVudSdcblNjcmVlblRleHQgID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcblB1c2hhYmxlICAgID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbk1hdGVyaWFsICAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblNjaGVtZSAgICAgID0gcmVxdWlyZSAnLi9zY2hlbWUnXG5RdWF0ZXJuaW9uICA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5WZWN0b3IgICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xubm93ICAgICAgICAgPSByZXF1aXJlICdwZXJmb3JtYW5jZS1ub3cnXG57XG5XYWxsLFxuV2lyZSxcbkdlYXIsXG5TdG9uZSxcblN3aXRjaCxcbk1vdG9yR2Vhcixcbk1vdG9yQ3lsaW5kZXIsXG5GYWNlfSAgICAgICA9IHJlcXVpcmUgJy4vaXRlbXMnXG5cbndvcmxkICAgICAgID0gbnVsbFxuXG5jbGFzcyBXb3JsZCBleHRlbmRzIEFjdG9yXG4gICAgXG4gICAgQGxldmVscyA9IG51bGxcbiAgICBcbiAgICBAbm9ybWFscyA9IFtcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMSwgMCwgMFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAxLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLCAxXG4gICAgICAgICAgICBuZXcgVmVjdG9yIC0xLDAsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsLTEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsLTFcbiAgICBdXG4gICAgXG4gICAgY29uc3RydWN0b3I6IChAdmlldykgLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHNwZWVkICAgICAgID0gNlxuICAgICAgICBcbiAgICAgICAgQHJhc3RlclNpemUgPSAwLjA1XG5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBub1JvdGF0aW9ucyA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcbiAgICAgICAgIyBsb2cgXCJ2aWV3IEBzY3JlZW5TaXplOlwiLCBAc2NyZWVuU2l6ZVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgXG4gICAgICAgICAgICBhbnRpYWxpYXM6ICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyOiBmYWxzZVxuICAgICAgICAgICAgYXV0b0NsZWFyOiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIHNvcnRPYmplY3RzOiAgICAgICAgICAgIHRydWVcblxuICAgICAgICAjIEByZW5kZXJlci5zZXRDbGVhckNvbG9yIDB4MDAwMDAwICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnNldFNpemUgQHZpZXcub2Zmc2V0V2lkdGgsIEB2aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiAgICAgICAgIyAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuICAgICAgICBAc3VuID0gbmV3IFRIUkVFLlBvaW50TGlnaHQgMHhmZmZmZmZcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkgaWYgQHBsYXllcj9cbiAgICAgICAgQHNjZW5lLmFkZCBAc3VuXG4gICAgICAgIFxuICAgICAgICBAYW1iaWVudCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQgMHgxMTExMTFcbiAgICAgICAgQHNjZW5lLmFkZCBAYW1iaWVudFxuICAgICAgICAgXG4gICAgICAgIEBwcmV2aWV3ICAgICAgICAgPSBmYWxzZVxuICAgICAgICBAb2JqZWN0cyAgICAgICAgID0gW11cbiAgICAgICAgQGxpZ2h0cyAgICAgICAgICA9IFtdXG4gICAgICAgIEBjZWxscyAgICAgICAgICAgPSBbXSBcbiAgICAgICAgQHNpemUgICAgICAgICAgICA9IG5ldyBQb3MoKVxuICAgICAgICBAZGVwdGggICAgICAgICAgID0gLU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgIFxuICAgIEBkZWluaXQ6ICgpIC0+XG4gICAgICAgIHdvcmxkID0gbnVsbFxuICAgICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gd29ybGRcbiAgICAgICAgVGltZXIuaW5pdCgpXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBmaXJzdCBAbGV2ZWxzLmxpc3RcbiAgICAgICAgd29ybGRcbiAgICAgICAgXG4gICAgQGluaXRHbG9iYWw6ICgpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVscz9cbiAgICAgICAgICBcbiAgICAgICAgU2NyZWVuVGV4dC5pbml0KClcbiAgICAgICAgU291bmQuaW5pdCgpXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwucm90MCAgICA9IFF1YXRlcm5pb24ucm90XzBcbiAgICAgICAgZ2xvYmFsLnJvdHg5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWVxuICAgICAgICBnbG9iYWwucm90ejkwICA9IFF1YXRlcm5pb24ucm90XzkwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWFxuICAgICAgICBnbG9iYWwucm90eTE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWFxuICAgICAgICBnbG9iYWwucm90eTI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1pcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5YdXBZICAgICAgICA9IFF1YXRlcm5pb24uWHVwWVxuICAgICAgICBnbG9iYWwuWHVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFpcbiAgICAgICAgZ2xvYmFsLlhkb3duWSAgICAgID0gUXVhdGVybmlvbi5YZG93bllcbiAgICAgICAgZ2xvYmFsLlhkb3duWiAgICAgID0gUXVhdGVybmlvbi5YZG93blpcbiAgICAgICAgZ2xvYmFsLll1cFggICAgICAgID0gUXVhdGVybmlvbi5ZdXBYXG4gICAgICAgIGdsb2JhbC5ZdXBaICAgICAgICA9IFF1YXRlcm5pb24uWXVwWlxuICAgICAgICBnbG9iYWwuWWRvd25YICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWFxuICAgICAgICBnbG9iYWwuWWRvd25aICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWlxuICAgICAgICBnbG9iYWwuWnVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFhcbiAgICAgICAgZ2xvYmFsLlp1cFkgICAgICAgID0gUXVhdGVybmlvbi5adXBZXG4gICAgICAgIGdsb2JhbC5aZG93blggICAgICA9IFF1YXRlcm5pb24uWmRvd25YXG4gICAgICAgIGdsb2JhbC5aZG93blkgICAgICA9IFF1YXRlcm5pb24uWmRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFkgICA9IFF1YXRlcm5pb24ubWludXNYdXBZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFogICA9IFF1YXRlcm5pb24ubWludXNYdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWSA9IFF1YXRlcm5pb24ubWludXNYZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25aID0gUXVhdGVybmlvbi5taW51c1hkb3duWlxuICAgICAgICBnbG9iYWwubWludXNZdXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWFxuICAgICAgICBnbG9iYWwubWludXNZdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWlxuICAgICAgICBnbG9iYWwubWludXNZZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWiA9IFF1YXRlcm5pb24ubWludXNZZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWCAgID0gUXVhdGVybmlvbi5taW51c1p1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWSAgID0gUXVhdGVybmlvbi5taW51c1p1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25YID0gUXVhdGVybmlvbi5taW51c1pkb3duWFxuICAgICAgICBnbG9iYWwubWludXNaZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25ZXG5cbiAgICAgICAgQGxldmVscyA9IG5ldyBMZXZlbHNcbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGNyZWF0ZTogKHdvcmxkRGljdD17fSkgLT4gIyBjcmVhdGVzIHRoZSB3b3JsZCBmcm9tIGEgbGV2ZWwgbmFtZSBvciBhIGRpY3Rpb25hcnlcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5jcmVhdGVcIiwgd29ybGREaWN0XG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBsb2cgXCJXb3JsZC5jcmVhdGUgI3tAbGV2ZWxfaW5kZXh9IHNpemU6ICN7bmV3IFBvcyhAZGljdFtcInNpemVcIl0pLnN0cigpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICcje0BsZXZlbF9uYW1lfScgc2NoZW1lOiAnI3tAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCd9J1wiXG5cbiAgICAgICAgQGNyZWF0aW5nID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBzZXRTaXplIEBkaWN0LnNpemUgIyB0aGlzIHJlbW92ZXMgYWxsIG9iamVjdHNcbiAgICAgICAgXG4gICAgICAgIEBhcHBseVNjaGVtZSBAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBpbnRybyB0ZXh0ICAgXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXdcbiAgICAgICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3QubmFtZVxuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXNjYXBlXG4gICAgICAgICMgZXNjYXBlX2V2ZW50ID0gQ29udHJvbGxlci5nZXRFdmVudFdpdGhOYW1lIChcImVzY2FwZVwiKVxuICAgICAgICAjIGVzY2FwZV9ldmVudC5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICAgICAgIyBlc2NhcGVfZXZlbnQuYWRkQWN0aW9uKGNvbnRpbnVvdXMoQGVzY2FwZSwgXCJlc2NhcGVcIikpXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXhpdHNcblxuICAgICAgICBpZiBAZGljdC5leGl0cz9cbiAgICAgICAgICAgIGV4aXRfaWQgPSAwXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gQGRpY3QuZXhpdHNcbiAgICAgICAgICAgICAgICBleGl0X2dhdGUgPSBuZXcgR2F0ZSBlbnRyeVtcImFjdGl2ZVwiXVxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5uYW1lID0gZW50cnlbXCJuYW1lXCJdID8gXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgIEFjdGlvbi5pZCA/PSAwXG4gICAgICAgICAgICAgICAgZXhpdEFjdGlvbiA9IG5ldyBBY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgIEFjdGlvbi5pZFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBAZXhpdExldmVsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5nZXRFdmVudFdpdGhOYW1lKFwiZW50ZXJcIikuYWRkQWN0aW9uIGV4aXRBY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBlbnRyeS5wb3NpdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gQGRlY2VudGVyIGVudHJ5LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlbnRyeS5jb29yZGluYXRlcz9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV3IFBvcyBlbnRyeS5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBleGl0X2dhdGUsIHBvc1xuICAgICAgICAgICAgICAgIGV4aXRfaWQgKz0gMVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNyZWF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QuY3JlYXRlP1xuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIEBkaWN0LmNyZWF0ZVxuICAgICAgICAgICAgICAgIEBkaWN0LmNyZWF0ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcbiAgICAgICAgICAgICAgICAjIGV4ZWMgQGRpY3RbXCJjcmVhdGVcIl0gaW4gZ2xvYmFscygpXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gcGxheWVyXG5cbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXJcbiAgICAgICAgIyBsb2cgXCJwbGF5ZXJfZGljdFwiLCBwbGF5ZXJfZGljdFxuICAgICAgICBAcGxheWVyLnNldE9yaWVudGF0aW9uIEBkaWN0LnBsYXllci5vcmllbnRhdGlvbiA/IHJvdHg5MFxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRPcmllbnRhdGlvbiBAcGxheWVyLm9yaWVudGF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QucGxheWVyLnBvc2l0aW9uP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIEBkZWNlbnRlciBAZGljdC5wbGF5ZXIucG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgbmV3IFBvcyBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXNcblxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICBcbiAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgZmluaXNoOiAoKSAtPiAjIFRPRE86IHNhdmUgcHJvZ3Jlc3NcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBhcHBseVNjaGVtZTogKHNjaGVtZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5hcHBseVNjaGVtZSAje3NjaGVtZX1cIlxuICAgICAgICBcbiAgICAgICAgY29sb3JzID0gXy5jbG9uZSBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgb3BhY2l0eSA9XG4gICAgICAgICAgICBzdG9uZTogMC43XG4gICAgICAgICAgICBib21iOiAgMC45XG4gICAgICAgICAgICB0ZXh0OiAgMFxuICAgICAgICAgICAgXG4gICAgICAgIHNoaW5pbmVzcyA9IFxuICAgICAgICAgICAgdGlyZTogICA0XG4gICAgICAgICAgICBwbGF0ZTogIDEwXG4gICAgICAgICAgICByYXN0ZXI6IDIwXG4gICAgICAgICAgICB3YWxsOiAgIDIwXG4gICAgICAgICAgICBzdG9uZTogIDIwXG4gICAgICAgICAgICBnZWFyOiAgIDIwXG4gICAgICAgICAgICB0ZXh0OiAgIDIwMFxuICAgICAgICAgICAgXG4gICAgICAgIGNvbG9ycy5wbGF0ZS5lbWlzc2l2ZSA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLmJ1bGIuZW1pc3NpdmUgID89IGNvbG9ycy5idWxiLmNvbG9yXG4gICAgICAgIGNvbG9ycy5tZW51ID89IHt9ICAgXG4gICAgICAgIGNvbG9ycy5tZW51LmNvbG9yID89IGNvbG9ycy5nZWFyLmNvbG9yXG4gICAgICAgIGNvbG9ycy5yYXN0ZXIgPz0ge30gICAgXG4gICAgICAgIGNvbG9ycy5yYXN0ZXIuY29sb3IgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy53YWxsID89IHt9XG4gICAgICAgIGNvbG9ycy53YWxsLmNvbG9yID89IG5ldyBUSFJFRS5Db2xvcihjb2xvcnMucGxhdGUuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuNlxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlID89IHt9XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUuY29sb3IgPz0gY29sb3JzLndpcmUuY29sb3JcbiAgICAgICAgZm9yIGssdiBvZiBjb2xvcnNcbiAgICAgICAgICAgICMgbG9nIFwiI3trfSAje3YuY29sb3I/LnJ9ICN7di5jb2xvcj8uZ30gI3t2LmNvbG9yPy5ifVwiLCB2XG4gICAgICAgICAgICAjIGNvbnRpbnVlIGlmIGsgPT0gJ3RleHQnXG4gICAgICAgICAgICBtYXQgPSBNYXRlcmlhbFtrXVxuICAgICAgICAgICAgbWF0LmNvbG9yICAgID0gdi5jb2xvclxuICAgICAgICAgICAgbWF0Lm9wYWNpdHkgID0gdi5vcGFjaXR5ID8gb3BhY2l0eVtrXSA/IDFcbiAgICAgICAgICAgIG1hdC5zcGVjdWxhciA9IHYuc3BlY3VsYXIgPyBuZXcgVEhSRUUuQ29sb3Iodi5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC4yXG4gICAgICAgICAgICBtYXQuZW1pc3NpdmUgPSB2LmVtaXNzaXZlID8gbmV3IFRIUkVFLkNvbG9yIDAsMCwwXG4gICAgICAgICAgICBpZiBzaGluaW5lc3Nba10/XG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IHYuc2hpbmluZXNzID8gc2hpbmluZXNzW2tdXG5cbiAgICAjICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgQGVuYWJsZVNoYWRvd3MgdHJ1ZSBpZiBsaWdodC5zaGFkb3dcbiAgICAgICAgXG4gICAgcmVtb3ZlTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIGxpZ2h0XG4gICAgICAgIGZvciBsIGluIEBsaWdodHNcbiAgICAgICAgICAgIHNoYWRvdyA9IHRydWUgaWYgbC5zaGFkb3dcbiAgICAgICAgQGVuYWJsZVNoYWRvd3Mgc2hhZG93XG5cbiAgICBlbmFibGVTaGFkb3dzOiAoZW5hYmxlKSAtPlxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBlbmFibGVcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICAgICAgIFxuICAgIGV4aXRMZXZlbDogKGFjdGlvbikgPT5cbiAgICAgICAgQGZpbmlzaCgpXG4gICAgICAgICMgbG9nIFwid29ybGQubGV2ZWxfaW5kZXggI3t3b3JsZC5sZXZlbF9pbmRleH0gbmV4dExldmVsICN7V29ybGQubGV2ZWxzLmxpc3Rbd29ybGQubGV2ZWxfaW5kZXgrMV19XCJcbiAgICAgICAgbmV4dExldmVsID0gKHdvcmxkLmxldmVsX2luZGV4KyhfLmlzTnVtYmVyKGFjdGlvbikgYW5kIGFjdGlvbiBvciAxKSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhcbiAgICAgICAgd29ybGQuY3JlYXRlIFdvcmxkLmxldmVscy5saXN0W25leHRMZXZlbF1cblxuICAgIGFjdGl2YXRlOiAob2JqZWN0TmFtZSkgLT4gQGdldE9iamVjdFdpdGhOYW1lKG9iamVjdE5hbWUpPy5zZXRBY3RpdmU/IHRydWVcbiAgICBcbiAgICBkZWNlbnRlcjogKHgseSx6KSAtPiBuZXcgUG9zKHgseSx6KS5wbHVzIEBzaXplLmRpdiAyXG5cbiAgICBpc1ZhbGlkUG9zOiAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCA+PSAwIGFuZCBwLnggPCBAc2l6ZS54IGFuZCBwLnkgPj0gMCBhbmQgcC55IDwgQHNpemUueSBhbmQgcC56ID49IDAgYW5kIHAueiA8IEBzaXplLnpcbiAgICAgICAgXG4gICAgaXNJbnZhbGlkUG9zOiAocG9zKSAtPiBub3QgQGlzVmFsaWRQb3MgcG9zXG5cbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgIDAwMFxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2V0U2l6ZTogKHNpemUpIC0+XG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMgbG9nIFwiYWRkT2JqZWN0QXRQb3MgI3tvYmplY3QubmFtZX1cIiwgcG9zXG4gICAgICAgIEBhZGRPYmplY3Qgb2JqZWN0XG5cbiAgICBhZGRPYmplY3RMaW5lOiAob2JqZWN0LCBzeCxzeSxzeiwgZXgsZXksZXopIC0+XG4gICAgICAgICMgbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIGlmIHN4IGluc3RhbmNlb2YgUG9zIG9yIEFycmF5LmlzQXJyYXkgc3hcbiAgICAgICAgICAgIHN0YXJ0ID0gc3hcbiAgICAgICAgICAgIGVuZCAgID0gc3lcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhcnQgPSBuZXcgUG9zIHN4LHN5LHN6XG4gICAgICAgICAgICBlbmQgICA9IG5ldyBQb3MgZXgsZXksZXpcbiAgICAgICAgIyBhZGRzIGEgbGluZSBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBzdGFydCBhbmQgZW5kIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBlbmQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIGVuZCA9IFtlbmQueCwgZW5kLnksIGVuZC56XVxuICAgICAgICBbZXgsIGV5LCBlel0gPSBlbmRcblxuICAgICAgICBpZiBzdGFydCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgc3RhcnQgPSBbc3RhcnQueCwgc3RhcnQueSwgc3RhcnQuel1cbiAgICAgICAgW3N4LCBzeSwgc3pdID0gc3RhcnRcbiAgICAgICAgXG4gICAgICAgICMgbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBsb2cgXCJhZGRPYmplY3RMaW5lICN7aX06XCIsIHBvc1xuICAgICAgICAgICAgaWYgQGlzVW5vY2N1cGllZFBvcyBwb3NcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICBcbiAgICBhZGRPYmplY3RQb2x5OiAob2JqZWN0LCBwb2ludHMsIGNsb3NlPXRydWUpIC0+XG4gICAgICAgICMgYWRkcyBhIHBvbHlnb24gb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gcG9pbnRzIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBjbG9zZVxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggcG9pbnRzWzBdXG4gICAgICAgIGZvciBpbmRleCBpbiBbMS4uLnBvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBAYWRkT2JqZWN0TGluZSBvYmplY3QsIHBvaW50c1tpbmRleC0xXSwgcG9pbnRzW2luZGV4XVxuICAgICAgIFxuICAgIGFkZE9iamVjdFJhbmRvbTogKG9iamVjdCwgbnVtYmVyKSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBmb3IgaSBpbiBbMC4uLm51bWJlcl1cbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIG9iamVjdCgpXG4gICAgICAgIFxuICAgIHNldE9iamVjdFJhbmRvbTogKG9iamVjdCkgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgb2JqZWN0U2V0ID0gZmFsc2VcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgd2hpbGUgbm90IG9iamVjdFNldCAjIGhhY2sgYWxlcnQhXG4gICAgICAgICAgICByYW5kb21Qb3MgPSBuZXcgUG9zIHJhbmRJbnQoQHNpemUueCksIHJhbmRJbnQoQHNpemUueSksIHJhbmRJbnQoQHNpemUueilcbiAgICAgICAgICAgIGlmIG5vdCBvYmplY3QuaXNTcGFjZUVnb2lzdGljKCkgb3IgQGlzVW5vY2N1cGllZFBvcyByYW5kb21Qb3MgXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcmFuZG9tUG9zXG4gICAgICAgICAgICAgICAgb2JqZWN0U2V0ID0gdHJ1ZVxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAgICAgIChjbHNzKSAgICAgIC0+IEBvYmplY3RzLmZpbHRlciAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPYmplY3RzT2ZUeXBlQXRQb3M6IChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2JqZWN0c09mVHlwZShjbHNzKSA/IFtdXG4gICAgZ2V0T2JqZWN0T2ZUeXBlQXRQb3M6ICAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldFJlYWxPYmplY3RPZlR5cGUoY2xzcylcbiAgICBnZXRPY2N1cGFudEF0UG9zOiAgICAgICAgICAgIChwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2NjdXBhbnQoKVxuICAgIGdldFJlYWxPY2N1cGFudEF0UG9zOiAocG9zKSAtPlxuICAgICAgICBvY2N1cGFudCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICBpZiBvY2N1cGFudCBhbmQgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgIG9jY3VwYW50Lm9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvY2N1cGFudFxuICAgIHN3aXRjaEF0UG9zOiAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgU3dpdGNoLCBwb3NcbiAgICBzZXRPYmplY3RBdFBvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGludmFsaWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBvYmplY3QuaXNTcGFjZUVnb2lzdGljKClcbiAgICAgICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50ID0gY2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudC50aW1lID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgdGltZTpcIiwgb2NjdXBhbnQudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQuZGVsKCkgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYW55d2F5IC4gZGVsZXRlIGl0XG4gICAgICAgIFxuICAgICAgICBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgbm90IGNlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleChwb3MpXG4gICAgICAgICAgICBjZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSBjZWxsXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgICMgZWxzZSBcbiAgICAgICAgICAgICMgbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdCAjIGlmIGxpZ2h0cy5pbmRleE9mKG9iamVjdCkgPCAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3RzLnB1c2ggb2JqZWN0ICMgaWYgb2JqZWN0cy5pbmRleE9mKG9iamVjdCkgPCAwIFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBvYmplY3RzLCBvYmplY3RcbiAgICBcbiAgICBtb3ZlT2JqZWN0VG9Qb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIEBpc0ludmFsaWRQb3MocG9zKSBvciBAaXNPY2N1cGllZFBvcyhwb3MpXG4gICAgICAgIEB1bnNldE9iamVjdCAgICBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnXG4gICAgICAgIHRydWVcbiAgICAgICAgXG4gICAgdG9nZ2xlOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgb2JqZWN0ID0gQGdldE9iamVjdFdpdGhOYW1lIG9iamVjdE5hbWUgXG4gICAgICAgIG9iamVjdC5nZXRBY3Rpb25XaXRoTmFtZShcInRvZ2dsZVwiKS5wZXJmb3JtKClcbiAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgZGVsZXRlQWxsT2JqZWN0czogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWxsQWN0aW9ucygpXG4gICAgXG4gICAgICAgIGlmIEBwbGF5ZXI/XG4gICAgICAgICAgICBAcGxheWVyLmRlbCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQGxpZ2h0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgbG9nIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIGxpZ2h0IG5vIGF1dG8gcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBAbGlnaHRzLnBvcCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAb2JqZWN0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGxvZyBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBvYmplY3Qgbm8gYXV0byByZW1vdmUgI3tsYXN0KEBvYmplY3RzKS5uYW1lfVwiXG4gICAgICAgICAgICAgICAgQG9iamVjdHMucG9wKClcbiAgICBcbiAgICBkZWxldGVPYmplY3RzV2l0aENsYXNzTmFtZTogKGNsYXNzTmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gXy5jbG9uZSBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgY2xhc3NOYW1lID09IG8uZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICBvLmRlbCgpXG4gICAgXG4gICAgZ2V0T2JqZWN0V2l0aE5hbWU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0TmFtZSA9PSBvLm5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICBsb2cgXCJXb3JsZC5nZXRPYmplY3RXaXRoTmFtZSBbV0FSTklOR10gbm8gb2JqZWN0IHdpdGggbmFtZSAje29iamVjdE5hbWV9XCJcbiAgICAgICAgbnVsbFxuICAgIFxuICAgIHNldENhbWVyYU1vZGU6IChtb2RlKSAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gY2xhbXAgQ2FtZXJhLklOU0lERSwgQ2FtZXJhLkZPTExPVywgbW9kZVxuICAgIFxuICAgIGNoYW5nZUNhbWVyYU1vZGU6IC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSAoQHBsYXllci5jYW1lcmEubW9kZSsxKSAlIChDYW1lcmEuRk9MTE9XKzEpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG9iamVjdFdpbGxNb3ZlVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgICMgbG9nIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyAje29iamVjdC5uYW1lfSAje2R1cmF0aW9ufVwiLCB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBsb2cgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbG9nIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyBsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG9sZCBwb3MnLCBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG9sZCBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gLWR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCBzb3VyY2VQb3MgXG5cbiAgICAgICAgICAgICMgbG9nICd3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIHRtcE9iamVjdCBhdCBuZXcgcG9zJywgdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBzb3VyY2VQb3MgPSBuZXcgUG9zIGZyb21cbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyB0b1xuXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgbG9nIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5vYmplY3RNb3ZlZCAje21vdmVkT2JqZWN0Lm5hbWV9XCIsIHNvdXJjZVBvc1xuICAgICAgICBcbiAgICAgICAgc291cmNlQ2VsbCA9IEBnZXRDZWxsQXRQb3Mgc291cmNlUG9zXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gc291cmNlQ2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG5cbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gdGFyZ2V0Q2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQGlzT2NjdXBpZWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBsb2cgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBvY2N1cGllZCB0YXJnZXQgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VDZWxsP1xuICAgICAgICAgICAgc291cmNlQ2VsbC5yZW1vdmVPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgICAgIGlmIHNvdXJjZUNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHNvdXJjZVBvcyldID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zICAgIFxuICAgICAgICBpZiBub3QgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4IHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRhcmdldENlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IHRhcmdldENlbGxcblxuICAgICAgICBpZiB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgdGFyZ2V0Q2VsbC5hZGRPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9nIFwid29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gbm8gdGFyZ2V0IGNlbGw/XCJcbiAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICAgICAgXG4gICAgXG4gICAgc3RlcDogKHN0ZXApIC0+XG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXIuY2FtZXJhLmNhbVxuICAgICAgICBpZiBmYWxzZVxuICAgICAgICAgICAgcXVhdCA9IGNhbWVyYS5xdWF0ZXJuaW9uLmNsb25lKClcbiAgICAgICAgICAgIHF1YXQubXVsdGlwbHkgbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlIG5ldyBUSFJFRS5WZWN0b3IzKDEsMCwwKSwgc3RlcC5kc2VjcyowLjJcbiAgICAgICAgICAgIHF1YXQubXVsdGlwbHkgbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tQXhpc0FuZ2xlIG5ldyBUSFJFRS5WZWN0b3IzKDAsMSwwKSwgc3RlcC5kc2VjcyowLjFcbiAgICAgICAgICAgIGNlbnRlciA9IEBzaXplLmRpdiAyXG4gICAgICAgICAgICBjYW1lcmEucG9zaXRpb24uc2V0KGNlbnRlci54LGNlbnRlci55LGNlbnRlci56K0BkaXN0KS5hcHBseVF1YXRlcm5pb24gcXVhdFxuICAgICAgICAgICAgY2FtZXJhLnF1YXRlcm5pb24uY29weSBxdWF0XG5cbiAgICAgICAgVGltZXIuZXZlbnQudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5ldmVudC5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oc3RlcCkgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc3RlcCBzdGVwXG5cbiAgICAgICAgU291bmQuc2V0TWF0cml4IEBwbGF5ZXIuY2FtZXJhXG4gICAgICAgICAgICBcbiAgICAgICAgQHBsYXllci5zZXRPcGFjaXR5IGNsYW1wIDAsIDEsIEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkubWludXMoQHBsYXllci5jdXJyZW50X3Bvc2l0aW9uKS5sZW5ndGgoKS0wLjRcbiAgICAgICAgXG4gICAgICAgIHN0b25lcyA9IFtdXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvIGluc3RhbmNlb2YgU3RvbmVcbiAgICAgICAgICAgICAgICBzdG9uZXMucHVzaCBvXG4gICAgICAgIHN0b25lcy5zb3J0IChhLGIpID0+IGIucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKCkgLSBhLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgIFxuICAgICAgICBvcmRlciA9IDEwMFxuICAgICAgICBmb3Igc3RvbmUgaW4gc3RvbmVzXG4gICAgICAgICAgICBzdG9uZS5tZXNoLnJlbmRlck9yZGVyID0gb3JkZXJcbiAgICAgICAgICAgIG9yZGVyICs9IDFcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZCA9IHN0b25lLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgICAgICBpZiBkIDwgMS4wXG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgaWYgbm90IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IDAuMiArIGQgKiAwLjVcbiAgICAgICAgICAgIGVsc2UgaWYgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBjYW1lcmEucG9zaXRpb25cbiAgICAgICAgQHJlbmRlcmVyLmF1dG9DbGVhckNvbG9yID0gZmFsc2VcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAc2NlbmUsIGNhbWVyYVxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEB0ZXh0LnNjZW5lLCBAdGV4dC5jYW1lcmEgaWYgQHRleHRcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAbWVudS5zY2VuZSwgQG1lbnUuY2FtZXJhIGlmIEBtZW51XG4gICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgZ2V0VGltZTogLT4gbm93KCkudG9GaXhlZCAwXG4gICAgc2V0U3BlZWQ6IChzKSAtPiBAc3BlZWQgPSBzXG4gICAgZ2V0U3BlZWQ6IC0+IEBzcGVlZFxuICAgIG1hcE1zVGltZTogICh1bm1hcHBlZCkgLT4gcGFyc2VJbnQgMTAuMCAqIHVubWFwcGVkL0BzcGVlZFxuICAgIHVubWFwTXNUaW1lOiAobWFwcGVkKSAtPiBwYXJzZUludCBtYXBwZWQgKiBAc3BlZWQvMTAuMFxuICAgICAgICBcbiAgICBjb250aW51b3VzOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJjb250aW51b3VzXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5DT05USU5VT1VTXG5cbiAgICBvbmNlOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJvbmNlXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICBcbiAgICByZXNpemVkOiAodyxoKSAtPlxuICAgICAgICBAYXNwZWN0ID0gdy9oXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXIuY2FtZXJhLmNhbVxuICAgICAgICBjYW1lcmE/LmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgY2FtZXJhPy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgQHJlbmRlcmVyPy5zZXRTaXplIHcsaFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIHcsaFxuICAgICAgICBAdGV4dD8ucmVzaXplZCB3LGhcbiAgICAgICAgQG1lbnU/LnJlc2l6ZWQgdyxoXG5cbiAgICBnZXROZWFyZXN0VmFsaWRQb3M6IChwb3MpIC0+XG4gICAgICAgIG5ldyBQb3MgTWF0aC5taW4oQHNpemUueC0xLCBNYXRoLm1heChwb3MueCwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS55LTEsIE1hdGgubWF4KHBvcy55LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnotMSwgTWF0aC5tYXgocG9zLnosIDApKVxuICAgIFxuICAgIGlzVW5vY2N1cGllZFBvczogKHBvcykgLT4gbm90IEBpc09jY3VwaWVkUG9zIHBvc1xuICAgIGlzT2NjdXBpZWRQb3M6ICAgKHBvcykgLT4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICAjIGxvZyBcImlzT2NjdXBpZWRQb3Mgb2NjdXBhbnQ6ICN7QGdldE9jY3VwYW50QXRQb3MocG9zKS5uYW1lfSBhdCBwb3M6XCIsIG5ldyBQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgIyBsb2cgXCJ3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3Mgb2JqZWN0OiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCIsIHBvc1xuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgIyBsb2cgXCJwdXNoYWJsZU9iamVjdCAje3B1c2hhYmxlT2JqZWN0Py5uYW1lfVwiXG4gICAgICAgIGlmIHB1c2hhYmxlT2JqZWN0PyBhbmQgcHVzaGFibGVPYmplY3QgaW5zdGFuY2VvZiBQdXNoYWJsZSAjYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgcHVzaGFibGVPYmplY3QgaW5zdGFuY2VvZiBNb3RvckdlYXIgIyBiYWRcbiAgICAgICAgICAgIHB1c2hhYmxlT2JqZWN0LnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gb2JqZWN0LCBkaXJlY3Rpb24sIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgICAgICBmYWxzZVxuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwICAgICAgXG4gICAgXG4gICAgc2hvd0hlbHA6ID0+XG4gICAgICAgICMgQG1lbnUuZGVsKClcbiAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdFsnaGVscCddXG5cbiAgICBvdXRybzogKGluZGV4PTApIC0+XG4gICAgICAgICMgd2VsbCBoaWRkZW4gb3V0cm8gOi0pXG4gICAgICAgIG91dHJvX3RleHQgPSBcIlwiXCJcbiAgICAgICAgICAgICAgICAgICAgJHNjYWxlKDEuNSljb25ncmF0dWxhdGlvbnMhXFxuXFxuJHNjYWxlKDEpeW91IHJlc2N1ZWRcXG50aGUgbmFubyB3b3JsZCFcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoZSBsYXN0IGR1bWIgbXV0YW50IGJvdFxcbmhhcyBiZWVuIGRlc3Ryb3llZC5cXG5cXG50aGUgbWFrZXIgaXMgZnVuY3Rpb25pbmcgYWdhaW4uXG4gICAgICAgICAgICAgICAgICAgIGtpa2kgd2lsbCBnbyBub3dcXG5hbmQgc2VlIGFsbCBoaXMgbmV3IGZyaWVuZHMuXFxuXFxueW91IHNob3VsZCBtYXliZVxcbmRvIHRoZSBzYW1lP1xuICAgICAgICAgICAgICAgICAgICB0aGUgbWFrZXIgd2FudHMgdG8gdGhhbmsgeW91IVxcblxcbihidHcuOiB5b3UgdGhvdWdodFxcbnlvdSBkaWRuJ3Qgc2VlXFxua2lraSdzIG1ha2VyIGluIHRoZSBnYW1lP1xuICAgICAgICAgICAgICAgICAgICB5b3UgYXJlIHdyb25nIVxcbnlvdSBzYXcgaGltXFxuYWxsIHRoZSB0aW1lLFxcbmJlY2F1c2Uga2lraVxcbmxpdmVzIGluc2lkZSBoaW0hKVxcblxcbiRzY2FsZSgxLjUpdGhlIGVuZFxuICAgICAgICAgICAgICAgICAgICBwLnMuOiB0aGUgbWFrZXIgb2YgdGhlIGdhbWVcXG53YW50cyB0byB0aGFuayB5b3UgYXMgd2VsbCFcXG5cXG5pIGRlZmluaXRlbHkgd2FudCB5b3VyIGZlZWRiYWNrOlxuICAgICAgICAgICAgICAgICAgICBwbGVhc2Ugc2VuZCBtZSBhIG1haWwgKG1vbnN0ZXJrb2RpQHVzZXJzLnNmLm5ldClcXG53aXRoIHlvdXIgZXhwZXJpZW5jZXMsXG4gICAgICAgICAgICAgICAgICAgIHdoaWNoIGxldmVscyB5b3UgbGlrZWQsIGV0Yy5cXG5cXG50aGFua3MgaW4gYWR2YW5jZSBhbmQgaGF2ZSBhIG5pY2UgZGF5LFxcblxcbnlvdXJzIGtvZGlcbiAgICAgICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgICAgIFxuICAgICAgICBtb3JlX3RleHQgPSBpbmRleCA8IG91dHJvX3RleHQubGVuZ3RoLTFcbiAgICAgICAgbGVzc190ZXh0ID0gaW5kZXggPiAwXG4gICAgICAgIFxuICAgICAgICBwYWdlX3RleHQgPSBvdXRyb190ZXh0W2luZGV4XVxuICAgICAgICBwYWdlX3RleHQgKz0gXCJcXG5cXG4kc2NhbGUoMC41KSgje2luZGV4KzF9LyN7b3V0cm9fdGV4dC5sZW5ndGh9KVwiXG4gICAgXG4gICAgICAgIHBhZ2UgPSBLaWtpUGFnZVRleHQocGFnZV90ZXh0LCBtb3JlX3RleHQsIGxlc3NfdGV4dClcbiAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwiaGlkZVwiKS5hZGRBY3Rpb24ob25jZShkaXNwbGF5X21haW5fbWVudSkpXG4gICAgICAgIFxuICAgICAgICBpZiBtb3JlX3RleHRcbiAgICAgICAgICAgIHBhZ2UuZ2V0RXZlbnRXaXRoTmFtZShcIm5leHRcIikuYWRkQWN0aW9uIChpPWluZGV4KzEpID0+IEBvdXRybyBpXG4gICAgICAgIGlmIGxlc3NfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwicHJldmlvdXNcIikuYWRkQWN0aW9uIChpPWluZGV4LTEpID0+IEBvdXRybyBpXG4gICAgICAgIFxuICAgIHJlc2V0UHJvamVjdGlvbjogLT4gQHBsYXllci5jYW1lcmEuc2V0Vmlld3BvcnQgMC4wLCAwLjAsIDEuMCwgMS4wXG4gICAgXG4gICAgIyAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcbiAgICBcbiAgICBsb2NhbGl6ZWRTdHJpbmc6IChzdHIpIC0+IHN0clxuICAgIFxuICAgIHNob3dNZW51OiAoc2VsZikgLT4gIyBoYW5kbGVzIGFuIEVTQyBrZXkgZXZlbnRcbiAgICAgICAgIyBAdGV4dD8uZGVsKClcbiAgICAgICAgQG1lbnUgPSBuZXcgTWVudSgpXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcImhlbHBcIiksICAgICAgIEBzaG93SGVscFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJyZXN0YXJ0XCIpLCAgICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwibG9hZCBsZXZlbFwiKSwgQHNob3dMZXZlbHNcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwic2V0dXBcIiksICAgICAgQHNob3dTZXR1cCAgICAgICBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwiYWJvdXRcIiksICAgICAgQHNob3dBYm91dFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJxdWl0XCIpLCAgICAgICBAcXVpdFxuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgaW5zaWRlUG9zID0gbmV3IFZlY3RvciBwb3NcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIGlmIGYgPCBkZWx0YVxuICAgICAgICAgICAgICAgIGluc2lkZVBvcy5hZGQgV29ybGQubm9ybWFsc1t3XS5tdWwgZGVsdGEtZlxuICAgICAgICBpbnNpZGVQb3NcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JQb3M6IChwb3MpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCAocG9zaXRpdmUgb3IgbmVnYXRpdmUpXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdIFxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGFic01pbiBtaW5fZiwgZiBcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JSYXk6IChyYXlQb3MsIHJheURpcikgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIGluIHJheURpciBcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcmF5UG9zLCByYXlEaXIsIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGYgaWYgZiA+PSAwLjAgYW5kIGYgPCBtaW5fZlxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGRpc3BsYXlMaWdodHM6ICgpIC0+XG4gICAgICAgIGZvciBsaWdodCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBsaWdudC5kaXNwbGF5KClcbiAgICAgICAgICAgICAgIFxuICAgIHBsYXlTb3VuZDogKHNvdW5kLCBwb3MsIHRpbWUpIC0+IFNvdW5kLnBsYXkgc291bmQsIHBvcywgdGltZSBpZiBub3QgQGNyZWF0aW5nXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAwMCBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAwMDAwMCAgXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50RG93bjogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIGlmIEBtZW51PyAgICAgICAgICAgIFxuICAgICAgICAgICAgQG1lbnUubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDEwLCBAc3BlZWQrMVxuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCAxLCAgQHNwZWVkLTFcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAZXhpdExldmVsKClcbiAgICAgICAgICAgIHdoZW4gJ20nIHRoZW4gQGV4aXRMZXZlbCA1XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee