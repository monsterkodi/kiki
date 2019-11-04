// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, first, kerror, klog, last, now, post, randInt, ref, ref1, world,
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

    World.prototype.quit = function() {
        return post.emit('menuEvent', 'Quit');
    };

    World.prototype.quit = function() {
        return post.emit('menuEvent', 'About kiki');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLDZVQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLFVBQUEsR0FBYyxPQUFB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QTtBQUpsQixpQkFLUyxHQUxUO3VCQUtrQixJQUFDLENBQUEsU0FBRCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtBQU5sQjtJQU5rQjs7b0JBY3RCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBQ2hCLFlBQUE7UUFBQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBRGdCOzs7O0dBOTFCSjs7QUFpMkJwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHBvc3QsIHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBmaXJzdCwgY2xhbXAsIGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblNpemUgICAgICAgID0gcmVxdWlyZSAnLi9saWIvc2l6ZSdcbkNlbGwgICAgICAgID0gcmVxdWlyZSAnLi9jZWxsJ1xuR2F0ZSAgICAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5DYW1lcmEgICAgICA9IHJlcXVpcmUgJy4vY2FtZXJhJ1xuTGlnaHQgICAgICAgPSByZXF1aXJlICcuL2xpZ2h0J1xuTGV2ZWxzICAgICAgPSByZXF1aXJlICcuL2xldmVscydcblBsYXllciAgICAgID0gcmVxdWlyZSAnLi9wbGF5ZXInXG5Tb3VuZCAgICAgICA9IHJlcXVpcmUgJy4vc291bmQnXG5DYWdlICAgICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcblRpbWVyICAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdG9yICAgICAgID0gcmVxdWlyZSAnLi9hY3Rvcidcbkl0ZW0gICAgICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQWN0aW9uICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1lbnUgICAgICAgID0gcmVxdWlyZSAnLi9tZW51J1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUgJ3BlcmZvcm1hbmNlLW5vdydcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKEB2aWV3KSAtPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAc3BlZWQgICAgICAgPSA2XG4gICAgICAgIFxuICAgICAgICBAcmFzdGVyU2l6ZSA9IDAuMDVcblxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQG5vUm90YXRpb25zID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuICAgICAgICAjIGxvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IgMHgwMDAwMDAgICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuc2V0U2l6ZSBAdmlldy5vZmZzZXRXaWR0aCwgQHZpZXcub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgICAgICAjICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICBcbiAgICAgICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICAgICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG4gICAgICAgIEBzdW4gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZlxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSBpZiBAcGxheWVyP1xuICAgICAgICBAc2NlbmUuYWRkIEBzdW5cbiAgICAgICAgXG4gICAgICAgIEBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCAweDExMTExMVxuICAgICAgICBAc2NlbmUuYWRkIEBhbWJpZW50XG4gICAgICAgICBcbiAgICAgICAgQHByZXZpZXcgICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBvYmplY3RzICAgICAgICAgPSBbXVxuICAgICAgICBAbGlnaHRzICAgICAgICAgID0gW11cbiAgICAgICAgQGNlbGxzICAgICAgICAgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICAgICAgICAgID0gbmV3IFBvcygpXG4gICAgICAgIEBkZXB0aCAgICAgICAgICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgXG4gICAgQGRlaW5pdDogKCkgLT5cbiAgICAgICAgd29ybGQgPSBudWxsXG4gICAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICByZXR1cm4gaWYgd29ybGQ/XG4gICAgICAgIFxuICAgICAgICBAaW5pdEdsb2JhbCgpXG4gICAgICAgICAgICBcbiAgICAgICAgd29ybGQgPSBuZXcgV29ybGQgdmlld1xuICAgICAgICB3b3JsZC5uYW1lID0gJ3dvcmxkJ1xuICAgICAgICBnbG9iYWwud29ybGQgPSB3b3JsZFxuICAgICAgICBUaW1lci5pbml0KClcbiAgICAgICAgd29ybGQuY3JlYXRlIGZpcnN0IEBsZXZlbHMubGlzdFxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9KSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICAjIGxvZyBcIndvcmxkLmNyZWF0ZVwiLCB3b3JsZERpY3RcbiAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkRGljdFxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBkaWN0ID0gV29ybGQubGV2ZWxzLmRpY3Rbd29ybGREaWN0XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0Lm5hbWVcbiAgICAgICAgICAgICAgICBAZGljdCA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGV2ZWxfaW5kZXggPSBXb3JsZC5sZXZlbHMubGlzdC5pbmRleE9mIEBsZXZlbF9uYW1lXG4gICAgICAgIGtsb2cgXCJXb3JsZC5jcmVhdGUgI3tAbGV2ZWxfaW5kZXh9IHNpemU6ICN7bmV3IFBvcyhAZGljdFtcInNpemVcIl0pLnN0cigpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICcje0BsZXZlbF9uYW1lfScgc2NoZW1lOiAnI3tAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCd9J1wiXG5cbiAgICAgICAgQGNyZWF0aW5nID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBzZXRTaXplIEBkaWN0LnNpemUgIyB0aGlzIHJlbW92ZXMgYWxsIG9iamVjdHNcbiAgICAgICAgXG4gICAgICAgIEBhcHBseVNjaGVtZSBAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBpbnRybyB0ZXh0ICAgXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXdcbiAgICAgICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3QubmFtZVxuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXNjYXBlXG4gICAgICAgICMgZXNjYXBlX2V2ZW50ID0gQ29udHJvbGxlci5nZXRFdmVudFdpdGhOYW1lIChcImVzY2FwZVwiKVxuICAgICAgICAjIGVzY2FwZV9ldmVudC5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICAgICAgIyBlc2NhcGVfZXZlbnQuYWRkQWN0aW9uKGNvbnRpbnVvdXMoQGVzY2FwZSwgXCJlc2NhcGVcIikpXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXhpdHNcblxuICAgICAgICBpZiBAZGljdC5leGl0cz9cbiAgICAgICAgICAgIGV4aXRfaWQgPSAwXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gQGRpY3QuZXhpdHNcbiAgICAgICAgICAgICAgICBleGl0X2dhdGUgPSBuZXcgR2F0ZSBlbnRyeVtcImFjdGl2ZVwiXVxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5uYW1lID0gZW50cnlbXCJuYW1lXCJdID8gXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgIEFjdGlvbi5pZCA/PSAwXG4gICAgICAgICAgICAgICAgZXhpdEFjdGlvbiA9IG5ldyBBY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgIEFjdGlvbi5pZFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBAZXhpdExldmVsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5nZXRFdmVudFdpdGhOYW1lKFwiZW50ZXJcIikuYWRkQWN0aW9uIGV4aXRBY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBlbnRyeS5wb3NpdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gQGRlY2VudGVyIGVudHJ5LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlbnRyeS5jb29yZGluYXRlcz9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV3IFBvcyBlbnRyeS5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBleGl0X2dhdGUsIHBvc1xuICAgICAgICAgICAgICAgIGV4aXRfaWQgKz0gMVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNyZWF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QuY3JlYXRlP1xuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIEBkaWN0LmNyZWF0ZVxuICAgICAgICAgICAgICAgIEBkaWN0LmNyZWF0ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAga2xvZyBcIldvcmxkLmNyZWF0ZSBbV0FSTklOR10gQGRpY3QuY3JlYXRlIG5vdCBhIGZ1bmN0aW9uIVwiXG4gICAgICAgICAgICAgICAgIyBleGVjIEBkaWN0W1wiY3JlYXRlXCJdIGluIGdsb2JhbHMoKVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIHBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyXG4gICAgICAgICMgbG9nIFwicGxheWVyX2RpY3RcIiwgcGxheWVyX2RpY3RcbiAgICAgICAgQHBsYXllci5zZXRPcmllbnRhdGlvbiBAZGljdC5wbGF5ZXIub3JpZW50YXRpb24gPyByb3R4OTBcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0T3JpZW50YXRpb24gQHBsYXllci5vcmllbnRhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LnBsYXllci5wb3NpdGlvbj9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBAZGVjZW50ZXIgQGRpY3QucGxheWVyLnBvc2l0aW9uXG4gICAgICAgIGVsc2UgaWYgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIG5ldyBQb3MgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzXG5cbiAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgXG4gICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5JTlNJREUgaWYgQGRpY3QuY2FtZXJhID09ICdpbnNpZGUnXG4gICAgICAgIFxuICAgICAgICBAY3JlYXRpbmcgPSBmYWxzZVxuICAgIFxuICAgIHJlc3RhcnQ6ID0+IEBjcmVhdGUgQGRpY3RcblxuICAgIGZpbmlzaDogKCkgLT4gIyBUT0RPOiBzYXZlIHByb2dyZXNzXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgYXBwbHlTY2hlbWU6IChzY2hlbWUpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgICMgbG9nIFwid29ybGQuYXBwbHlTY2hlbWUgI3tzY2hlbWV9XCJcbiAgICAgICAgXG4gICAgICAgIGNvbG9ycyA9IF8uY2xvbmUgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIG9wYWNpdHkgPVxuICAgICAgICAgICAgc3RvbmU6IDAuN1xuICAgICAgICAgICAgYm9tYjogIDAuOVxuICAgICAgICAgICAgdGV4dDogIDBcbiAgICAgICAgICAgIFxuICAgICAgICBzaGluaW5lc3MgPSBcbiAgICAgICAgICAgIHRpcmU6ICAgNFxuICAgICAgICAgICAgcGxhdGU6ICAxMFxuICAgICAgICAgICAgcmFzdGVyOiAyMFxuICAgICAgICAgICAgd2FsbDogICAyMFxuICAgICAgICAgICAgc3RvbmU6ICAyMFxuICAgICAgICAgICAgZ2VhcjogICAyMFxuICAgICAgICAgICAgdGV4dDogICAyMDBcbiAgICAgICAgICAgIFxuICAgICAgICBjb2xvcnMucGxhdGUuZW1pc3NpdmUgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMud2FsbCA/PSB7fVxuICAgICAgICBjb2xvcnMud2FsbC5jb2xvciA/PSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzLnBsYXRlLmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjZcbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZSA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGZvciBrLHYgb2YgY29sb3JzXG4gICAgICAgICAgICAjIGxvZyBcIiN7a30gI3t2LmNvbG9yPy5yfSAje3YuY29sb3I/Lmd9ICN7di5jb2xvcj8uYn1cIiwgdlxuICAgICAgICAgICAgIyBjb250aW51ZSBpZiBrID09ICd0ZXh0J1xuICAgICAgICAgICAgbWF0ID0gTWF0ZXJpYWxba11cbiAgICAgICAgICAgIG1hdC5jb2xvciAgICA9IHYuY29sb3JcbiAgICAgICAgICAgIG1hdC5vcGFjaXR5ICA9IHYub3BhY2l0eSA/IG9wYWNpdHlba10gPyAxXG4gICAgICAgICAgICBtYXQuc3BlY3VsYXIgPSB2LnNwZWN1bGFyID8gbmV3IFRIUkVFLkNvbG9yKHYuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuMlxuICAgICAgICAgICAgbWF0LmVtaXNzaXZlID0gdi5lbWlzc2l2ZSA/IG5ldyBUSFJFRS5Db2xvciAwLDAsMFxuICAgICAgICAgICAgaWYgc2hpbmluZXNzW2tdP1xuICAgICAgICAgICAgICAgIG1hdC5zaGluaW5lc3MgPSB2LnNoaW5pbmVzcyA/IHNoaW5pbmVzc1trXVxuXG4gICAgIyAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgQGxpZ2h0cy5wdXNoIGxpZ2h0XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHRydWUgaWYgbGlnaHQuc2hhZG93XG4gICAgICAgIFxuICAgIHJlbW92ZUxpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBsaWdodFxuICAgICAgICBmb3IgbCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBzaGFkb3cgPSB0cnVlIGlmIGwuc2hhZG93XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHNoYWRvd1xuXG4gICAgZW5hYmxlU2hhZG93czogKGVuYWJsZSkgLT5cbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gZW5hYmxlXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAgICAgICBcbiAgICBleGl0TGV2ZWw6IChhY3Rpb24pID0+XG4gICAgICAgIEBmaW5pc2goKVxuICAgICAgICAjIGxvZyBcIndvcmxkLmxldmVsX2luZGV4ICN7d29ybGQubGV2ZWxfaW5kZXh9IG5leHRMZXZlbCAje1dvcmxkLmxldmVscy5saXN0W3dvcmxkLmxldmVsX2luZGV4KzFdfVwiXG4gICAgICAgIG5leHRMZXZlbCA9ICh3b3JsZC5sZXZlbF9pbmRleCsoXy5pc051bWJlcihhY3Rpb24pIGFuZCBhY3Rpb24gb3IgMSkpICUgV29ybGQubGV2ZWxzLmxpc3QubGVuZ3RoXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBXb3JsZC5sZXZlbHMubGlzdFtuZXh0TGV2ZWxdXG5cbiAgICBhY3RpdmF0ZTogKG9iamVjdE5hbWUpIC0+IEBnZXRPYmplY3RXaXRoTmFtZShvYmplY3ROYW1lKT8uc2V0QWN0aXZlPyB0cnVlXG4gICAgXG4gICAgZGVjZW50ZXI6ICh4LHkseikgLT4gbmV3IFBvcyh4LHkseikucGx1cyBAc2l6ZS5kaXYgMlxuXG4gICAgaXNWYWxpZFBvczogKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggPj0gMCBhbmQgcC54IDwgQHNpemUueCBhbmQgcC55ID49IDAgYW5kIHAueSA8IEBzaXplLnkgYW5kIHAueiA+PSAwIGFuZCBwLnogPCBAc2l6ZS56XG4gICAgICAgIFxuICAgIGlzSW52YWxpZFBvczogKHBvcykgLT4gbm90IEBpc1ZhbGlkUG9zIHBvc1xuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgICAgIDAwMDAwMDBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgICAwMDBcbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwIFxuICAgIFxuICAgIHNldFNpemU6IChzaXplKSAtPlxuICAgICAgICBAZGVsZXRlQWxsT2JqZWN0cygpXG4gICAgICAgIEBjZWxscyA9IFtdXG4gICAgICAgIEBzaXplID0gbmV3IFBvcyBzaXplXG4gICAgICAgICMgY2FsY3VhdGUgbWF4IGRpc3RhbmNlIChmb3IgcG9zaXRpb24gcmVsYXRpdmUgc291bmQpXG4gICAgICAgIEBtYXhfZGlzdGFuY2UgPSBNYXRoLm1heChAc2l6ZS54LCBNYXRoLm1heChAc2l6ZS55LCBAc2l6ZS56KSkgICMgaGV1cmlzdGljIG9mIGEgaGV1cmlzdGljIDotKVxuICAgICAgICBAY2FnZT8uZGVsKClcbiAgICAgICAgQGNhZ2UgPSBuZXcgQ2FnZSBAc2l6ZSwgQHJhc3RlclNpemVcblxuICAgIGdldENlbGxBdFBvczogKHBvcykgLT4gcmV0dXJuIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSBpZiBAaXNWYWxpZFBvcyBwb3NcbiAgICBnZXRCb3RBdFBvczogIChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBCb3QsIG5ldyBQb3MgcG9zXG5cbiAgICBwb3NUb0luZGV4OiAgIChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ICogQHNpemUueiAqIEBzaXplLnkgKyBwLnkgKiBAc2l6ZS56ICsgcC56XG4gICAgICAgIFxuICAgIGluZGV4VG9Qb3M6ICAgKGluZGV4KSAtPiBcbiAgICAgICAgbHNpemUgPSBAc2l6ZS56ICogQHNpemUueVxuICAgICAgICBscmVzdCA9IGluZGV4ICUgbHNpemVcbiAgICAgICAgbmV3IFBvcyBpbmRleC9sc2l6ZSwgbHJlc3QvQHNpemUueiwgbHJlc3QlQHNpemUuelxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRPYmplY3RBdFBvczogKG9iamVjdCwgeCwgeSwgeikgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyB4LCB5LCB6XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICAjIGxvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGxvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBpZiBzeCBpbnN0YW5jZW9mIFBvcyBvciBBcnJheS5pc0FycmF5IHN4XG4gICAgICAgICAgICBzdGFydCA9IHN4XG4gICAgICAgICAgICBlbmQgICA9IHN5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IFBvcyBzeCxzeSxzelxuICAgICAgICAgICAgZW5kICAgPSBuZXcgUG9zIGV4LGV5LGV6XG4gICAgICAgICMgYWRkcyBhIGxpbmUgb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gc3RhcnQgYW5kIGVuZCBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgZW5kIGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBlbmQgPSBbZW5kLngsIGVuZC55LCBlbmQuel1cbiAgICAgICAgW2V4LCBleSwgZXpdID0gZW5kXG5cbiAgICAgICAgaWYgc3RhcnQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIHN0YXJ0ID0gW3N0YXJ0LngsIHN0YXJ0LnksIHN0YXJ0LnpdXG4gICAgICAgIFtzeCwgc3ksIHN6XSA9IHN0YXJ0XG4gICAgICAgIFxuICAgICAgICAjIGxvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBcbiAgICAgICAgZGlmZiA9IFtleC1zeCwgZXktc3ksIGV6LXN6XVxuICAgICAgICBtYXhkaWZmID0gXy5tYXggZGlmZi5tYXAgTWF0aC5hYnNcbiAgICAgICAgZGVsdGFzID0gZGlmZi5tYXAgKGEpIC0+IGEvbWF4ZGlmZlxuICAgICAgICBmb3IgaSBpbiBbMC4uLm1heGRpZmZdXG4gICAgICAgICAgICAjIHBvcyA9IGFwcGx5KFBvcywgKG1hcCAobGFtYmRhIGEsIGI6IGludChhK2kqYiksIHN0YXJ0LCBkZWx0YXMpKSlcbiAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgKHN0YXJ0W2pdK2kqZGVsdGFzW2pdIGZvciBqIGluIFswLi4yXSlcbiAgICAgICAgICAgICMgbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBpbnZhbGlkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpXG4gICAgICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCA9IGNlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQudGltZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHRpbWU6XCIsIG9jY3VwYW50LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50LmRlbCgpICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGFueXdheSAuIGRlbGV0ZSBpdFxuICAgICAgICBcbiAgICAgICAgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIG5vdCBjZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXgocG9zKVxuICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gY2VsbFxuICAgICAgICBcbiAgICAgICAgb2JqZWN0LnNldFBvc2l0aW9uIHBvc1xuICAgICAgICBjZWxsLmFkZE9iamVjdCBvYmplY3RcblxuICAgIHVuc2V0T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBwb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICBjZWxsLnJlbW92ZU9iamVjdCBvYmplY3RcbiAgICAgICAgICAgIGlmIGNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldID0gbnVsbFxuICAgICAgICAjIGVsc2UgXG4gICAgICAgICAgICAjIGxvZyAnd29ybGQudW5zZXRPYmplY3QgW1dBUk5JTkddIG5vIGNlbGwgYXQgcG9zOicsIHBvc1xuXG4gICAgbmV3T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgaWYgb2JqZWN0LnN0YXJ0c1dpdGggJ25ldydcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICByZXR1cm4gbmV3IChyZXF1aXJlIFwiLi8je29iamVjdC50b0xvd2VyQ2FzZSgpfVwiKSgpXG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIEl0ZW1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCgpXG4gICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgTGlnaHRcbiAgICAgICAgICAgIEBsaWdodHMucHVzaCBvYmplY3QgIyBpZiBsaWdodHMuaW5kZXhPZihvYmplY3QpIDwgMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdCAjIGlmIG9iamVjdHMuaW5kZXhPZihvYmplY3QpIDwgMCBcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgbW92ZU9iamVjdFRvUG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zKHBvcykgb3IgQGlzT2NjdXBpZWRQb3MocG9zKVxuICAgICAgICBAdW5zZXRPYmplY3QgICAgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICB0cnVlXG4gICAgICAgIFxuICAgIHRvZ2dsZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIG9iamVjdCA9IEBnZXRPYmplY3RXaXRoTmFtZSBvYmplY3ROYW1lIFxuICAgICAgICBvYmplY3QuZ2V0QWN0aW9uV2l0aE5hbWUoXCJ0b2dnbGVcIikucGVyZm9ybSgpXG4gICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGRlbGV0ZUFsbE9iamVjdHM6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFsbEFjdGlvbnMoKVxuICAgIFxuICAgICAgICBpZiBAcGxheWVyP1xuICAgICAgICAgICAgQHBsYXllci5kZWwoKVxuICAgIFxuICAgICAgICB3aGlsZSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBsaWdodHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBsaWdodCBubyBhdXRvIHJlbW92ZVwiXG4gICAgICAgICAgICAgICAgQGxpZ2h0cy5wb3AoKVxuICAgIFxuICAgICAgICB3aGlsZSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQG9iamVjdHMpLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgb2JqZWN0IG5vIGF1dG8gcmVtb3ZlICN7bGFzdChAb2JqZWN0cykubmFtZX1cIlxuICAgICAgICAgICAgICAgIEBvYmplY3RzLnBvcCgpXG4gICAgXG4gICAgZGVsZXRlT2JqZWN0c1dpdGhDbGFzc05hbWU6IChjbGFzc05hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIF8uY2xvbmUgQG9iamVjdHNcbiAgICAgICAgICAgIGlmIGNsYXNzTmFtZSA9PSBvLmdldENsYXNzTmFtZSgpXG4gICAgICAgICAgICAgICAgby5kZWwoKVxuICAgIFxuICAgIGdldE9iamVjdFdpdGhOYW1lOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdE5hbWUgPT0gby5uYW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAga2Vycm9yIFwiV29ybGQuZ2V0T2JqZWN0V2l0aE5hbWUgW1dBUk5JTkddIG5vIG9iamVjdCB3aXRoIG5hbWUgI3tvYmplY3ROYW1lfVwiXG4gICAgICAgIG51bGxcbiAgICBcbiAgICBzZXRDYW1lcmFNb2RlOiAobW9kZSkgLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IGNsYW1wIENhbWVyYS5JTlNJREUsIENhbWVyYS5GT0xMT1csIG1vZGVcbiAgICBcbiAgICBjaGFuZ2VDYW1lcmFNb2RlOiAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gKEBwbGF5ZXIuY2FtZXJhLm1vZGUrMSkgJSAoQ2FtZXJhLkZPTExPVysxKVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgIDAgICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBvYmplY3RXaWxsTW92ZVRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICAjIGxvZyBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgI3tvYmplY3QubmFtZX0gI3tkdXJhdGlvbn1cIiwgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VQb3MuZXFsIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gZXF1YWwgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIHRhcmdldENlbGxcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zID0gdGFyZ2V0Q2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MudGltZSA8IDAgYW5kIC1vYmplY3RBdE5ld1Bvcy50aW1lIDw9IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC4gZGVsZXRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBdE5ld1Bvcy5kZWwoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSB0aW1pbmcgY29uZmxpY3QgYXQgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGFscmVhZHkgb2NjdXBpZWQ6XCIsIHRhcmdldFBvcyBcbiAgICBcbiAgICAgICAgaWYgb2JqZWN0Lm5hbWUgIT0gJ3BsYXllcidcbiAgICAgICAgICAgIEB1bnNldE9iamVjdCBvYmplY3QgIyByZW1vdmUgb2JqZWN0IGZyb20gY2VsbCBncmlkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMgbG9nICd3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIHRtcE9iamVjdCBhdCBvbGQgcG9zJywgc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBvbGQgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IC1kdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgc291cmNlUG9zIFxuXG4gICAgICAgICAgICAjIGxvZyAnd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyB0bXBPYmplY3QgYXQgbmV3IHBvcycsIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG5ldyBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IGR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCB0YXJnZXRQb3MgXG5cbiAgICBvYmplY3RNb3ZlZDogKG1vdmVkT2JqZWN0LCBmcm9tLCB0bykgLT5cbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICMgbG9nIFwid29ybGQub2JqZWN0TW92ZWQgI3ttb3ZlZE9iamVjdC5uYW1lfVwiLCBzb3VyY2VQb3NcbiAgICAgICAgXG4gICAgICAgIHNvdXJjZUNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHNvdXJjZVBvc1xuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHNvdXJjZUNlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHRhcmdldENlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc09jY3VwaWVkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gb2NjdXBpZWQgdGFyZ2V0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc291cmNlQ2VsbD9cbiAgICAgICAgICAgIHNvdXJjZUNlbGwucmVtb3ZlT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBpZiBzb3VyY2VDZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChzb3VyY2VQb3MpXSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvcyAgICBcbiAgICAgICAgaWYgbm90IHRhcmdldENlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0YXJnZXRDZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSB0YXJnZXRDZWxsXG5cbiAgICAgICAgaWYgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIHRhcmdldENlbGwuYWRkT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG5vIHRhcmdldCBjZWxsP1wiXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgICAgIFxuICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPlxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyLmNhbWVyYS5jYW1cbiAgICAgICAgaWYgZmFsc2VcbiAgICAgICAgICAgIHF1YXQgPSBjYW1lcmEucXVhdGVybmlvbi5jbG9uZSgpXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygxLDAsMCksIHN0ZXAuZHNlY3MqMC4yXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIHN0ZXAuZHNlY3MqMC4xXG4gICAgICAgICAgICBjZW50ZXIgPSBAc2l6ZS5kaXYgMlxuICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnNldChjZW50ZXIueCxjZW50ZXIueSxjZW50ZXIueitAZGlzdCkuYXBwbHlRdWF0ZXJuaW9uIHF1YXRcbiAgICAgICAgICAgIGNhbWVyYS5xdWF0ZXJuaW9uLmNvcHkgcXVhdFxuXG4gICAgICAgIFRpbWVyLmV2ZW50LnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgVGltZXIuZXZlbnQuZmluaXNoQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICBvLnN0ZXA/KHN0ZXApIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnN0ZXAgc3RlcFxuXG4gICAgICAgIFNvdW5kLnNldE1hdHJpeCBAcGxheWVyLmNhbWVyYVxuICAgICAgICAgICAgXG4gICAgICAgIEBwbGF5ZXIuc2V0T3BhY2l0eSBjbGFtcCAwLCAxLCBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpLm1pbnVzKEBwbGF5ZXIuY3VycmVudF9wb3NpdGlvbikubGVuZ3RoKCktMC40XG4gICAgICAgIFxuICAgICAgICBzdG9uZXMgPSBbXVxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbyBpbnN0YW5jZW9mIFN0b25lXG4gICAgICAgICAgICAgICAgc3RvbmVzLnB1c2ggb1xuICAgICAgICBzdG9uZXMuc29ydCAoYSxiKSA9PiBiLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpIC0gYS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICBcbiAgICAgICAgb3JkZXIgPSAxMDBcbiAgICAgICAgZm9yIHN0b25lIGluIHN0b25lc1xuICAgICAgICAgICAgc3RvbmUubWVzaC5yZW5kZXJPcmRlciA9IG9yZGVyXG4gICAgICAgICAgICBvcmRlciArPSAxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQgPSBzdG9uZS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICAgICAgaWYgZCA8IDEuMFxuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5IGlmIG5vdCBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjIgKyBkICogMC41XG4gICAgICAgICAgICBlbHNlIGlmIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgIFxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgY2FtZXJhLnBvc2l0aW9uXG4gICAgICAgIEByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciA9IGZhbHNlXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBjYW1lcmFcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgLT5cbiAgICAgICAgQGFzcGVjdCA9IHcvaFxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyLmNhbWVyYS5jYW1cbiAgICAgICAgY2FtZXJhPy5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIGNhbWVyYT8udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIEByZW5kZXJlcj8uc2V0U2l6ZSB3LGhcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgQHRleHQ/LnJlc2l6ZWQgdyxoXG4gICAgICAgIEBtZW51Py5yZXNpemVkIHcsaFxuXG4gICAgZ2V0TmVhcmVzdFZhbGlkUG9zOiAocG9zKSAtPlxuICAgICAgICBuZXcgUG9zIE1hdGgubWluKEBzaXplLngtMSwgTWF0aC5tYXgocG9zLngsIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUueS0xLCBNYXRoLm1heChwb3MueSwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS56LTEsIE1hdGgubWF4KHBvcy56LCAwKSlcbiAgICBcbiAgICBpc1Vub2NjdXBpZWRQb3M6IChwb3MpIC0+IG5vdCBAaXNPY2N1cGllZFBvcyBwb3NcbiAgICBpc09jY3VwaWVkUG9zOiAgIChwb3MpIC0+ICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGlmIEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAgICAgIyBsb2cgXCJpc09jY3VwaWVkUG9zIG9jY3VwYW50OiAje0BnZXRPY2N1cGFudEF0UG9zKHBvcykubmFtZX0gYXQgcG9zOlwiLCBuZXcgUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICBtYXlPYmplY3RQdXNoVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgICMgbG9nIFwid29ybGQubWF5T2JqZWN0UHVzaFRvUG9zIG9iamVjdDoje29iamVjdC5uYW1lfSBkdXJhdGlvbjoje2R1cmF0aW9ufVwiLCBwb3NcbiAgICAgICAgIyByZXR1cm5zIHRydWUsIGlmIGEgcHVzaGFibGUgb2JqZWN0IGlzIGF0IHBvcyBhbmQgbWF5IGJlIHB1c2hlZFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGRpcmVjdGlvbiA9IHBvcy5taW51cyBvYmplY3QuZ2V0UG9zKCkgIyBkaXJlY3Rpb24gZnJvbSBvYmplY3QgdG8gcHVzaGFibGUgb2JqZWN0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgXG4gICAgICAgIG9iamVjdEF0TmV3UG9zID0gQGdldE9jY3VwYW50QXRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIGlmIG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgIHRtcE9iamVjdCA9IG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgdG1wT2JqZWN0LnRpbWUgPCAwIGFuZCAtdG1wT2JqZWN0LnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAtPiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgXG4gICAgICAgIHB1c2hhYmxlT2JqZWN0ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICMgbG9nIFwicHVzaGFibGVPYmplY3QgI3twdXNoYWJsZU9iamVjdD8ubmFtZX1cIlxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGUgI2FuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgTW90b3JHZWFyICMgYmFkXG4gICAgICAgICAgICBwdXNoYWJsZU9iamVjdC5wdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uIG9iamVjdCwgZGlyZWN0aW9uLCBkdXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICAgICAgZmFsc2VcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIHNob3dIZWxwOiA9PlxuICAgICAgICAjIEBtZW51LmRlbCgpXG4gICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuXG4gICAgb3V0cm86IChpbmRleD0wKSAtPlxuICAgICAgICAjIHdlbGwgaGlkZGVuIG91dHJvIDotKVxuICAgICAgICBvdXRyb190ZXh0ID0gXCJcIlwiXG4gICAgICAgICAgICAgICAgICAgICRzY2FsZSgxLjUpY29uZ3JhdHVsYXRpb25zIVxcblxcbiRzY2FsZSgxKXlvdSByZXNjdWVkXFxudGhlIG5hbm8gd29ybGQhXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGUgbGFzdCBkdW1iIG11dGFudCBib3RcXG5oYXMgYmVlbiBkZXN0cm95ZWQuXFxuXFxudGhlIG1ha2VyIGlzIGZ1bmN0aW9uaW5nIGFnYWluLlxuICAgICAgICAgICAgICAgICAgICBraWtpIHdpbGwgZ28gbm93XFxuYW5kIHNlZSBhbGwgaGlzIG5ldyBmcmllbmRzLlxcblxcbnlvdSBzaG91bGQgbWF5YmVcXG5kbyB0aGUgc2FtZT9cbiAgICAgICAgICAgICAgICAgICAgdGhlIG1ha2VyIHdhbnRzIHRvIHRoYW5rIHlvdSFcXG5cXG4oYnR3LjogeW91IHRob3VnaHRcXG55b3UgZGlkbid0IHNlZVxcbmtpa2kncyBtYWtlciBpbiB0aGUgZ2FtZT9cbiAgICAgICAgICAgICAgICAgICAgeW91IGFyZSB3cm9uZyFcXG55b3Ugc2F3IGhpbVxcbmFsbCB0aGUgdGltZSxcXG5iZWNhdXNlIGtpa2lcXG5saXZlcyBpbnNpZGUgaGltISlcXG5cXG4kc2NhbGUoMS41KXRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgcC5zLjogdGhlIG1ha2VyIG9mIHRoZSBnYW1lXFxud2FudHMgdG8gdGhhbmsgeW91IGFzIHdlbGwhXFxuXFxuaSBkZWZpbml0ZWx5IHdhbnQgeW91ciBmZWVkYmFjazpcbiAgICAgICAgICAgICAgICAgICAgcGxlYXNlIHNlbmQgbWUgYSBtYWlsIChtb25zdGVya29kaUB1c2Vycy5zZi5uZXQpXFxud2l0aCB5b3VyIGV4cGVyaWVuY2VzLFxuICAgICAgICAgICAgICAgICAgICB3aGljaCBsZXZlbHMgeW91IGxpa2VkLCBldGMuXFxuXFxudGhhbmtzIGluIGFkdmFuY2UgYW5kIGhhdmUgYSBuaWNlIGRheSxcXG5cXG55b3VycyBrb2RpXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICBcbiAgICAgICAgbW9yZV90ZXh0ID0gaW5kZXggPCBvdXRyb190ZXh0Lmxlbmd0aC0xXG4gICAgICAgIGxlc3NfdGV4dCA9IGluZGV4ID4gMFxuICAgICAgICBcbiAgICAgICAgcGFnZV90ZXh0ID0gb3V0cm9fdGV4dFtpbmRleF1cbiAgICAgICAgcGFnZV90ZXh0ICs9IFwiXFxuXFxuJHNjYWxlKDAuNSkoI3tpbmRleCsxfS8je291dHJvX3RleHQubGVuZ3RofSlcIlxuICAgIFxuICAgICAgICBwYWdlID0gS2lraVBhZ2VUZXh0KHBhZ2VfdGV4dCwgbW9yZV90ZXh0LCBsZXNzX3RleHQpXG4gICAgICAgIHBhZ2UuZ2V0RXZlbnRXaXRoTmFtZShcImhpZGVcIikuYWRkQWN0aW9uKG9uY2UoZGlzcGxheV9tYWluX21lbnUpKVxuICAgICAgICBcbiAgICAgICAgaWYgbW9yZV90ZXh0XG4gICAgICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJuZXh0XCIpLmFkZEFjdGlvbiAoaT1pbmRleCsxKSA9PiBAb3V0cm8gaVxuICAgICAgICBpZiBsZXNzX3RleHRcbiAgICAgICAgICAgIHBhZ2UuZ2V0RXZlbnRXaXRoTmFtZShcInByZXZpb3VzXCIpLmFkZEFjdGlvbiAoaT1pbmRleC0xKSA9PiBAb3V0cm8gaVxuICAgICAgICBcbiAgICByZXNldFByb2plY3Rpb246IC0+IEBwbGF5ZXIuY2FtZXJhLnNldFZpZXdwb3J0IDAuMCwgMC4wLCAxLjAsIDEuMFxuICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgbG9jYWxpemVkU3RyaW5nOiAoc3RyKSAtPiBzdHJcbiAgICBcbiAgICBzaG93TWVudTogKHNlbGYpIC0+ICMgaGFuZGxlcyBhbiBFU0Mga2V5IGV2ZW50XG4gICAgICAgICMgQHRleHQ/LmRlbCgpXG4gICAgICAgIEBtZW51ID0gbmV3IE1lbnUoKVxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJoZWxwXCIpLCAgICAgICBAc2hvd0hlbHBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwicmVzdGFydFwiKSwgICAgQHJlc3RhcnQgXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcImxvYWQgbGV2ZWxcIiksIEBzaG93TGV2ZWxzXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcInNldHVwXCIpLCAgICAgIEBzaG93U2V0dXAgICAgICAgXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcImFib3V0XCIpLCAgICAgIEBzaG93QWJvdXRcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwicXVpdFwiKSwgICAgICAgQHF1aXRcbiAgICAgICAgQG1lbnUuc2hvdygpXG4gICAgXG4gICAgcXVpdDogLT4gcG9zdC5lbWl0ICdtZW51RXZlbnQnICdRdWl0J1xuICAgIHF1aXQ6IC0+IHBvc3QuZW1pdCAnbWVudUV2ZW50JyAnQWJvdXQga2lraSdcbiAgICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG4gICAgXG4gICAgZ2V0SW5zaWRlV2FsbFBvc1dpdGhEZWx0YTogKHBvcywgZGVsdGEpIC0+XG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnbnQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgQHRleHQ/LmZhZGVPdXQoKVxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBzd2l0Y2ggY29tYm9cbiAgICAgICAgICAgIHdoZW4gJ2VzYycgdGhlbiBAc2hvd01lbnUoKVxuICAgICAgICAgICAgd2hlbiAnPScgdGhlbiBAc3BlZWQgPSBNYXRoLm1pbiAxMCwgQHNwZWVkKzFcbiAgICAgICAgICAgIHdoZW4gJy0nIHRoZW4gQHNwZWVkID0gTWF0aC5tYXggMSwgIEBzcGVlZC0xXG4gICAgICAgICAgICB3aGVuICdyJyB0aGVuIEByZXN0YXJ0KClcbiAgICAgICAgICAgIHdoZW4gJ24nIHRoZW4gQGV4aXRMZXZlbCgpXG4gICAgICAgICAgICB3aGVuICdtJyB0aGVuIEBleGl0TGV2ZWwgNVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnRVcCBtb2QsIGtleSwgY29tYm8sIGV2ZW50ICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZFxuXG4iXX0=
//# sourceURL=../coffee/world.coffee