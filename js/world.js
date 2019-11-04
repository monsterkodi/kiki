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

now = require('perf_hooks').performance.now;

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
        return post.toMain('quitApp');
    };

    World.prototype.showAbout = function() {
        return post.toMain('showAbout');
    };

    World.prototype.showLevels = function() {
        return klog('showLevels');
    };

    World.prototype.showSetup = function() {
        return klog('showSetup');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLDZVQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLFVBQUEsR0FBYyxPQUFB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QUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFhLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBcEI7QUFIM0IsaUJBSVMsR0FKVDt1QkFJa0IsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUpsQixpQkFLUyxHQUxUO3VCQUtrQixJQUFDLENBQUEsU0FBRCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtBQU5sQjtJQU5rQjs7b0JBY3RCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBQ2hCLFlBQUE7UUFBQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBRGdCOzs7O0dBOTJCSjs7QUFpM0JwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHBvc3QsIHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBmaXJzdCwgY2xhbXAsIGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblNpemUgICAgICAgID0gcmVxdWlyZSAnLi9saWIvc2l6ZSdcbkNlbGwgICAgICAgID0gcmVxdWlyZSAnLi9jZWxsJ1xuR2F0ZSAgICAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5DYW1lcmEgICAgICA9IHJlcXVpcmUgJy4vY2FtZXJhJ1xuTGlnaHQgICAgICAgPSByZXF1aXJlICcuL2xpZ2h0J1xuTGV2ZWxzICAgICAgPSByZXF1aXJlICcuL2xldmVscydcblBsYXllciAgICAgID0gcmVxdWlyZSAnLi9wbGF5ZXInXG5Tb3VuZCAgICAgICA9IHJlcXVpcmUgJy4vc291bmQnXG5DYWdlICAgICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcblRpbWVyICAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdG9yICAgICAgID0gcmVxdWlyZSAnLi9hY3Rvcidcbkl0ZW0gICAgICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQWN0aW9uICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1lbnUgICAgICAgID0gcmVxdWlyZSAnLi9tZW51J1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZS5ub3dcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBAOiAoQHZpZXcpIC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBzcGVlZCAgICAgICA9IDZcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgICMga2xvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgICMgQHJlbmRlcmVyLnNldENsZWFyQ29sb3IgMHgwMDAwMDAgICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuc2V0U2l6ZSBAdmlldy5vZmZzZXRXaWR0aCwgQHZpZXcub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgICAgICAjICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICBcbiAgICAgICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICAgICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG4gICAgICAgIEBzdW4gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZlxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSBpZiBAcGxheWVyP1xuICAgICAgICBAc2NlbmUuYWRkIEBzdW5cbiAgICAgICAgXG4gICAgICAgIEBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCAweDExMTExMVxuICAgICAgICBAc2NlbmUuYWRkIEBhbWJpZW50XG4gICAgICAgICBcbiAgICAgICAgQHByZXZpZXcgICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBvYmplY3RzICAgICAgICAgPSBbXVxuICAgICAgICBAbGlnaHRzICAgICAgICAgID0gW11cbiAgICAgICAgQGNlbGxzICAgICAgICAgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICAgICAgICAgID0gbmV3IFBvcygpXG4gICAgICAgIEBkZXB0aCAgICAgICAgICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgXG4gICAgQGRlaW5pdDogKCkgLT5cbiAgICAgICAgd29ybGQgPSBudWxsXG4gICAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICByZXR1cm4gaWYgd29ybGQ/XG4gICAgICAgIFxuICAgICAgICBAaW5pdEdsb2JhbCgpXG4gICAgICAgICAgICBcbiAgICAgICAgd29ybGQgPSBuZXcgV29ybGQgdmlld1xuICAgICAgICB3b3JsZC5uYW1lID0gJ3dvcmxkJ1xuICAgICAgICBnbG9iYWwud29ybGQgPSB3b3JsZFxuICAgICAgICBUaW1lci5pbml0KClcbiAgICAgICAgd29ybGQuY3JlYXRlIGZpcnN0IEBsZXZlbHMubGlzdFxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9KSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuY3JlYXRlXCIgd29ybGREaWN0XG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlICN7QGxldmVsX2luZGV4fSBzaXplOiAje25ldyBQb3MoQGRpY3RbXCJzaXplXCJdKS5zdHIoKX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAnI3tAbGV2ZWxfbmFtZX0nIHNjaGVtZTogJyN7QGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnfSdcIlxuXG4gICAgICAgIEBjcmVhdGluZyA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBAc2V0U2l6ZSBAZGljdC5zaXplICMgdGhpcyByZW1vdmVzIGFsbCBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAYXBwbHlTY2hlbWUgQGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0Lm5hbWVcbiAgICAgICAgXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGVzY2FwZVxuICAgICAgICAjIGVzY2FwZV9ldmVudCA9IENvbnRyb2xsZXIuZ2V0RXZlbnRXaXRoTmFtZSAoXCJlc2NhcGVcIilcbiAgICAgICAgIyBlc2NhcGVfZXZlbnQucmVtb3ZlQWxsQWN0aW9ucygpXG4gICAgICAgICMgZXNjYXBlX2V2ZW50LmFkZEFjdGlvbihjb250aW51b3VzKEBlc2NhcGUsIFwiZXNjYXBlXCIpKVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGV4aXRzXG5cbiAgICAgICAgaWYgQGRpY3QuZXhpdHM/XG4gICAgICAgICAgICBleGl0X2lkID0gMFxuICAgICAgICAgICAgZm9yIGVudHJ5IGluIEBkaWN0LmV4aXRzXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlID0gbmV3IEdhdGUgZW50cnlbXCJhY3RpdmVcIl1cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUubmFtZSA9IGVudHJ5W1wibmFtZVwiXSA/IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICBBY3Rpb24uaWQgPz0gMFxuICAgICAgICAgICAgICAgIGV4aXRBY3Rpb24gPSBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgICAgICAgICBpZDogICBBY3Rpb24uaWRcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogQGV4aXRMZXZlbFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUuZ2V0RXZlbnRXaXRoTmFtZShcImVudGVyXCIpLmFkZEFjdGlvbiBleGl0QWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgZW50cnkucG9zaXRpb24/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IEBkZWNlbnRlciBlbnRyeS5wb3NpdGlvblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZW50cnkuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgZW50cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgZXhpdF9nYXRlLCBwb3NcbiAgICAgICAgICAgICAgICBleGl0X2lkICs9IDFcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBjcmVhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LmNyZWF0ZT9cbiAgICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbiBAZGljdC5jcmVhdGVcbiAgICAgICAgICAgICAgICBAZGljdC5jcmVhdGUoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGtsb2cgXCJXb3JsZC5jcmVhdGUgW1dBUk5JTkddIEBkaWN0LmNyZWF0ZSBub3QgYSBmdW5jdGlvbiFcIlxuICAgICAgICAgICAgICAgICMgZXhlYyBAZGljdFtcImNyZWF0ZVwiXSBpbiBnbG9iYWxzKClcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuICAgICAgICAjIGtsb2cgXCJwbGF5ZXJfZGljdFwiLCBwbGF5ZXJfZGljdFxuICAgICAgICBAcGxheWVyLnNldE9yaWVudGF0aW9uIEBkaWN0LnBsYXllci5vcmllbnRhdGlvbiA/IHJvdHg5MFxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRPcmllbnRhdGlvbiBAcGxheWVyLm9yaWVudGF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QucGxheWVyLnBvc2l0aW9uP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIEBkZWNlbnRlciBAZGljdC5wbGF5ZXIucG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgbmV3IFBvcyBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXNcblxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICBcbiAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgICAgIGtsb2cgJ2RvbmUgY3JlYXRpbmcnXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgZmluaXNoOiAoKSAtPiAjIFRPRE86IHNhdmUgcHJvZ3Jlc3NcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBhcHBseVNjaGVtZTogKHNjaGVtZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYXBwbHlTY2hlbWUgI3tzY2hlbWV9XCJcbiAgICAgICAgXG4gICAgICAgIGNvbG9ycyA9IF8uY2xvbmUgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIG9wYWNpdHkgPVxuICAgICAgICAgICAgc3RvbmU6IDAuN1xuICAgICAgICAgICAgYm9tYjogIDAuOVxuICAgICAgICAgICAgdGV4dDogIDBcbiAgICAgICAgICAgIFxuICAgICAgICBzaGluaW5lc3MgPSBcbiAgICAgICAgICAgIHRpcmU6ICAgNFxuICAgICAgICAgICAgcGxhdGU6ICAxMFxuICAgICAgICAgICAgcmFzdGVyOiAyMFxuICAgICAgICAgICAgd2FsbDogICAyMFxuICAgICAgICAgICAgc3RvbmU6ICAyMFxuICAgICAgICAgICAgZ2VhcjogICAyMFxuICAgICAgICAgICAgdGV4dDogICAyMDBcbiAgICAgICAgICAgIFxuICAgICAgICBjb2xvcnMucGxhdGUuZW1pc3NpdmUgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMud2FsbCA/PSB7fVxuICAgICAgICBjb2xvcnMud2FsbC5jb2xvciA/PSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzLnBsYXRlLmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjZcbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZSA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGZvciBrLHYgb2YgY29sb3JzXG4gICAgICAgICAgICAjIGtsb2cgXCIje2t9ICN7di5jb2xvcj8ucn0gI3t2LmNvbG9yPy5nfSAje3YuY29sb3I/LmJ9XCIsIHZcbiAgICAgICAgICAgICMgY29udGludWUgaWYgayA9PSAndGV4dCdcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIEBsaWdodHMucHVzaCBsaWdodFxuICAgICAgICBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgbGlnaHRcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICBAZW5hYmxlU2hhZG93cyBzaGFkb3dcblxuICAgIGVuYWJsZVNoYWRvd3M6IChlbmFibGUpIC0+XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBAZmluaXNoKClcbiAgICAgICAgIyBrbG9nIFwid29ybGQubGV2ZWxfaW5kZXggI3t3b3JsZC5sZXZlbF9pbmRleH0gbmV4dExldmVsICN7V29ybGQubGV2ZWxzLmxpc3Rbd29ybGQubGV2ZWxfaW5kZXgrMV19XCJcbiAgICAgICAgbmV4dExldmVsID0gKHdvcmxkLmxldmVsX2luZGV4KyhfLmlzTnVtYmVyKGFjdGlvbikgYW5kIGFjdGlvbiBvciAxKSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhcbiAgICAgICAgd29ybGQuY3JlYXRlIFdvcmxkLmxldmVscy5saXN0W25leHRMZXZlbF1cblxuICAgIGFjdGl2YXRlOiAob2JqZWN0TmFtZSkgLT4gQGdldE9iamVjdFdpdGhOYW1lKG9iamVjdE5hbWUpPy5zZXRBY3RpdmU/IHRydWVcbiAgICBcbiAgICBkZWNlbnRlcjogKHgseSx6KSAtPiBuZXcgUG9zKHgseSx6KS5wbHVzIEBzaXplLmRpdiAyXG5cbiAgICBpc1ZhbGlkUG9zOiAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCA+PSAwIGFuZCBwLnggPCBAc2l6ZS54IGFuZCBwLnkgPj0gMCBhbmQgcC55IDwgQHNpemUueSBhbmQgcC56ID49IDAgYW5kIHAueiA8IEBzaXplLnpcbiAgICAgICAgXG4gICAgaXNJbnZhbGlkUG9zOiAocG9zKSAtPiBub3QgQGlzVmFsaWRQb3MgcG9zXG5cbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgIDAwMFxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2V0U2l6ZTogKHNpemUpIC0+XG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMga2xvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBpbnZhbGlkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpXG4gICAgICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCA9IGNlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQudGltZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHRpbWU6XCIsIG9jY3VwYW50LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50LmRlbCgpICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGFueXdheSAuIGRlbGV0ZSBpdFxuICAgICAgICBcbiAgICAgICAgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIG5vdCBjZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXgocG9zKVxuICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gY2VsbFxuICAgICAgICBcbiAgICAgICAgb2JqZWN0LnNldFBvc2l0aW9uIHBvc1xuICAgICAgICBjZWxsLmFkZE9iamVjdCBvYmplY3RcblxuICAgIHVuc2V0T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBwb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICBjZWxsLnJlbW92ZU9iamVjdCBvYmplY3RcbiAgICAgICAgICAgIGlmIGNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldID0gbnVsbFxuICAgICAgICAjIGVsc2UgXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLnVuc2V0T2JqZWN0IFtXQVJOSU5HXSBubyBjZWxsIGF0IHBvczonLCBwb3NcblxuICAgIG5ld09iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgIGlmIG9iamVjdC5zdGFydHNXaXRoICduZXcnXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgcmV0dXJuIG5ldyAocmVxdWlyZSBcIi4vI3tvYmplY3QudG9Mb3dlckNhc2UoKX1cIikoKVxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBJdGVtXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBvYmplY3QoKVxuICAgICAgICBcbiAgICBhZGRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIExpZ2h0XG4gICAgICAgICAgICBAbGlnaHRzLnB1c2ggb2JqZWN0ICMgaWYgbGlnaHRzLmluZGV4T2Yob2JqZWN0KSA8IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3QgIyBpZiBvYmplY3RzLmluZGV4T2Yob2JqZWN0KSA8IDAgXG5cbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIEB1bnNldE9iamVjdCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIG9iamVjdFxuICAgICAgICBfLnB1bGwgQG9iamVjdHMsIG9iamVjdFxuICAgIFxuICAgIG1vdmVPYmplY3RUb1BvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyhwb3MpIG9yIEBpc09jY3VwaWVkUG9zKHBvcylcbiAgICAgICAgQHVuc2V0T2JqZWN0ICAgIG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgdHJ1ZVxuICAgICAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAbGlnaHRzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgbGlnaHQgbm8gYXV0byByZW1vdmVcIlxuICAgICAgICAgICAgICAgIEBsaWdodHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBvYmplY3RzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIG9iamVjdCBubyBhdXRvIHJlbW92ZSAje2xhc3QoQG9iamVjdHMpLm5hbWV9XCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0cy5wb3AoKVxuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3ROYW1lID09IG8ubmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgIGtlcnJvciBcIldvcmxkLmdldE9iamVjdFdpdGhOYW1lIFtXQVJOSU5HXSBubyBvYmplY3Qgd2l0aCBuYW1lICN7b2JqZWN0TmFtZX1cIlxuICAgICAgICBudWxsXG4gICAgXG4gICAgc2V0Q2FtZXJhTW9kZTogKG1vZGUpIC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSBjbGFtcCBDYW1lcmEuSU5TSURFLCBDYW1lcmEuRk9MTE9XLCBtb2RlXG4gICAgXG4gICAgY2hhbmdlQ2FtZXJhTW9kZTogLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IChAcGxheWVyLmNhbWVyYS5tb2RlKzEpICUgKENhbWVyYS5GT0xMT1crMSlcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgb2JqZWN0V2lsbE1vdmVUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyAje29iamVjdC5uYW1lfSAje2R1cmF0aW9ufVwiLCB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyBrbG9nICd3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIHRtcE9iamVjdCBhdCBvbGQgcG9zJywgc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBvbGQgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IC1kdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgc291cmNlUG9zIFxuXG4gICAgICAgICAgICAjIGtsb2cgJ3dvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgdG1wT2JqZWN0IGF0IG5ldyBwb3MnLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG5ldyBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IGR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCB0YXJnZXRQb3MgXG5cbiAgICBvYmplY3RNb3ZlZDogKG1vdmVkT2JqZWN0LCBmcm9tLCB0bykgLT5cbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLm9iamVjdE1vdmVkICN7bW92ZWRPYmplY3QubmFtZX1cIiwgc291cmNlUG9zXG4gICAgICAgIFxuICAgICAgICBzb3VyY2VDZWxsID0gQGdldENlbGxBdFBvcyBzb3VyY2VQb3NcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiB0bXBPYmplY3QgPSBzb3VyY2VDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcblxuICAgICAgICBpZiB0bXBPYmplY3QgPSB0YXJnZXRDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAaXNPY2N1cGllZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG9jY3VwaWVkIHRhcmdldCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3MgICAgXG4gICAgICAgIGlmIG5vdCB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXggdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gdGFyZ2V0Q2VsbFxuXG4gICAgICAgIGlmIHRhcmdldENlbGw/XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmFkZE9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBubyB0YXJnZXQgY2VsbD9cIlxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAgICBcbiAgICBcbiAgICBzdGVwOiAoc3RlcCkgLT5cbiAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXIuY2FtZXJhLmNhbVxuICAgICAgICBcbiAgICAgICAgaWYgZmFsc2VcbiAgICAgICAgICAgIHF1YXQgPSBjYW1lcmEucXVhdGVybmlvbi5jbG9uZSgpXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygxLDAsMCksIHN0ZXAuZHNlY3MqMC4yXG4gICAgICAgICAgICBxdWF0Lm11bHRpcGx5IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUF4aXNBbmdsZSBuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIHN0ZXAuZHNlY3MqMC4xXG4gICAgICAgICAgICBjZW50ZXIgPSBAc2l6ZS5kaXYgMlxuICAgICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnNldChjZW50ZXIueCxjZW50ZXIueSxjZW50ZXIueitAZGlzdCkuYXBwbHlRdWF0ZXJuaW9uIHF1YXRcbiAgICAgICAgICAgIGNhbWVyYS5xdWF0ZXJuaW9uLmNvcHkgcXVhdFxuXG4gICAgICAgIFRpbWVyLmV2ZW50LnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgVGltZXIuZXZlbnQuZmluaXNoQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICBvLnN0ZXA/KHN0ZXApIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnN0ZXAgc3RlcFxuXG4gICAgICAgIFNvdW5kLnNldE1hdHJpeCBAcGxheWVyLmNhbWVyYVxuICAgICAgICAgICAgXG4gICAgICAgIEBwbGF5ZXIuc2V0T3BhY2l0eSBjbGFtcCAwLCAxLCBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpLm1pbnVzKEBwbGF5ZXIuY3VycmVudF9wb3NpdGlvbikubGVuZ3RoKCktMC40XG4gICAgICAgIFxuICAgICAgICBzdG9uZXMgPSBbXVxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbyBpbnN0YW5jZW9mIFN0b25lXG4gICAgICAgICAgICAgICAgc3RvbmVzLnB1c2ggb1xuICAgICAgICBzdG9uZXMuc29ydCAoYSxiKSA9PiBiLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpIC0gYS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICBcbiAgICAgICAgb3JkZXIgPSAxMDBcbiAgICAgICAgZm9yIHN0b25lIGluIHN0b25lc1xuICAgICAgICAgICAgc3RvbmUubWVzaC5yZW5kZXJPcmRlciA9IG9yZGVyXG4gICAgICAgICAgICBvcmRlciArPSAxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQgPSBzdG9uZS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICAgICAgaWYgZCA8IDEuMFxuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5IGlmIG5vdCBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjIgKyBkICogMC41XG4gICAgICAgICAgICBlbHNlIGlmIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgIFxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgY2FtZXJhLnBvc2l0aW9uXG4gICAgICAgIEByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciA9IGZhbHNlXG5cbiAgICAgICAgIyBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgICMgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwXG4gICAgICAgICMgY2FtZXJhLnBvc2l0aW9uLnogPSAyXG4gICAgICAgICMgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkgMSwgMSwgMVxuICAgICAgICAjIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIHsgY29sb3I6IDB4MDBmZjAwIH1cbiAgICAgICAgIyBjdWJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbWV0cnksIG1hdGVyaWFsXG4gICAgICAgICMgc2NlbmUuYWRkIGN1YmVcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBjYW1lcmFcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHRleHQuc2NlbmUsIEB0ZXh0LmNhbWVyYSBpZiBAdGV4dFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBtZW51LnNjZW5lLCBAbWVudS5jYW1lcmEgaWYgQG1lbnVcbiAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBnZXRUaW1lOiAtPiBub3coKS50b0ZpeGVkIDBcbiAgICBzZXRTcGVlZDogKHMpIC0+IEBzcGVlZCA9IHNcbiAgICBnZXRTcGVlZDogLT4gQHNwZWVkXG4gICAgbWFwTXNUaW1lOiAgKHVubWFwcGVkKSAtPiBwYXJzZUludCAxMC4wICogdW5tYXBwZWQvQHNwZWVkXG4gICAgdW5tYXBNc1RpbWU6IChtYXBwZWQpIC0+IHBhcnNlSW50IG1hcHBlZCAqIEBzcGVlZC8xMC4wXG4gICAgICAgIFxuICAgIGNvbnRpbnVvdXM6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcImNvbnRpbnVvdXNcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLkNPTlRJTlVPVVNcblxuICAgIG9uY2U6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcIm9uY2VcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIHJlc2l6ZWQ6ICh3LGgpIC0+XG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgY2FtZXJhID0gQHBsYXllci5jYW1lcmEuY2FtXG4gICAgICAgIGNhbWVyYT8uYXNwZWN0ID0gQGFzcGVjdFxuICAgICAgICBjYW1lcmE/LnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgICAgICBAcmVuZGVyZXI/LnNldFNpemUgdyxoXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgdyxoXG4gICAgICAgIEB0ZXh0Py5yZXNpemVkIHcsaFxuICAgICAgICBAbWVudT8ucmVzaXplZCB3LGhcblxuICAgIGdldE5lYXJlc3RWYWxpZFBvczogKHBvcykgLT5cbiAgICAgICAgbmV3IFBvcyBNYXRoLm1pbihAc2l6ZS54LTEsIE1hdGgubWF4KHBvcy54LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnktMSwgTWF0aC5tYXgocG9zLnksIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUuei0xLCBNYXRoLm1heChwb3MueiwgMCkpXG4gICAgXG4gICAgaXNVbm9jY3VwaWVkUG9zOiAocG9zKSAtPiBub3QgQGlzT2NjdXBpZWRQb3MgcG9zXG4gICAgaXNPY2N1cGllZFBvczogICAocG9zKSAtPiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgICMga2xvZyBcImlzT2NjdXBpZWRQb3Mgb2NjdXBhbnQ6ICN7QGdldE9jY3VwYW50QXRQb3MocG9zKS5uYW1lfSBhdCBwb3M6XCIsIG5ldyBQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgIyBrbG9nIFwid29ybGQubWF5T2JqZWN0UHVzaFRvUG9zIG9iamVjdDoje29iamVjdC5uYW1lfSBkdXJhdGlvbjoje2R1cmF0aW9ufVwiLCBwb3NcbiAgICAgICAgIyByZXR1cm5zIHRydWUsIGlmIGEgcHVzaGFibGUgb2JqZWN0IGlzIGF0IHBvcyBhbmQgbWF5IGJlIHB1c2hlZFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGRpcmVjdGlvbiA9IHBvcy5taW51cyBvYmplY3QuZ2V0UG9zKCkgIyBkaXJlY3Rpb24gZnJvbSBvYmplY3QgdG8gcHVzaGFibGUgb2JqZWN0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgXG4gICAgICAgIG9iamVjdEF0TmV3UG9zID0gQGdldE9jY3VwYW50QXRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIGlmIG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgIHRtcE9iamVjdCA9IG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgdG1wT2JqZWN0LnRpbWUgPCAwIGFuZCAtdG1wT2JqZWN0LnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAtPiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgXG4gICAgICAgIHB1c2hhYmxlT2JqZWN0ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICMga2xvZyBcInB1c2hhYmxlT2JqZWN0ICN7cHVzaGFibGVPYmplY3Q/Lm5hbWV9XCJcbiAgICAgICAgaWYgcHVzaGFibGVPYmplY3Q/IGFuZCBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIFB1c2hhYmxlICNhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIE1vdG9yR2VhciAjIGJhZFxuICAgICAgICAgICAgcHVzaGFibGVPYmplY3QucHVzaGVkQnlPYmplY3RJbkRpcmVjdGlvbiBvYmplY3QsIGRpcmVjdGlvbiwgZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgICAgIGZhbHNlXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAgICAgICBcbiAgICBcbiAgICBzaG93SGVscDogPT5cbiAgICAgICAgIyBAbWVudS5kZWwoKVxuICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0WydoZWxwJ11cblxuICAgIG91dHJvOiAoaW5kZXg9MCkgLT5cbiAgICAgICAgIyB3ZWxsIGhpZGRlbiBvdXRybyA6LSlcbiAgICAgICAgb3V0cm9fdGV4dCA9IFwiXCJcIlxuICAgICAgICAgICAgICAgICAgICAkc2NhbGUoMS41KWNvbmdyYXR1bGF0aW9ucyFcXG5cXG4kc2NhbGUoMSl5b3UgcmVzY3VlZFxcbnRoZSBuYW5vIHdvcmxkIVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhlIGxhc3QgZHVtYiBtdXRhbnQgYm90XFxuaGFzIGJlZW4gZGVzdHJveWVkLlxcblxcbnRoZSBtYWtlciBpcyBmdW5jdGlvbmluZyBhZ2Fpbi5cbiAgICAgICAgICAgICAgICAgICAga2lraSB3aWxsIGdvIG5vd1xcbmFuZCBzZWUgYWxsIGhpcyBuZXcgZnJpZW5kcy5cXG5cXG55b3Ugc2hvdWxkIG1heWJlXFxuZG8gdGhlIHNhbWU/XG4gICAgICAgICAgICAgICAgICAgIHRoZSBtYWtlciB3YW50cyB0byB0aGFuayB5b3UhXFxuXFxuKGJ0dy46IHlvdSB0aG91Z2h0XFxueW91IGRpZG4ndCBzZWVcXG5raWtpJ3MgbWFrZXIgaW4gdGhlIGdhbWU/XG4gICAgICAgICAgICAgICAgICAgIHlvdSBhcmUgd3JvbmchXFxueW91IHNhdyBoaW1cXG5hbGwgdGhlIHRpbWUsXFxuYmVjYXVzZSBraWtpXFxubGl2ZXMgaW5zaWRlIGhpbSEpXFxuXFxuJHNjYWxlKDEuNSl0aGUgZW5kXG4gICAgICAgICAgICAgICAgICAgIHAucy46IHRoZSBtYWtlciBvZiB0aGUgZ2FtZVxcbndhbnRzIHRvIHRoYW5rIHlvdSBhcyB3ZWxsIVxcblxcbmkgZGVmaW5pdGVseSB3YW50IHlvdXIgZmVlZGJhY2s6XG4gICAgICAgICAgICAgICAgICAgIHBsZWFzZSBzZW5kIG1lIGEgbWFpbCAobW9uc3RlcmtvZGlAdXNlcnMuc2YubmV0KVxcbndpdGggeW91ciBleHBlcmllbmNlcyxcbiAgICAgICAgICAgICAgICAgICAgd2hpY2ggbGV2ZWxzIHlvdSBsaWtlZCwgZXRjLlxcblxcbnRoYW5rcyBpbiBhZHZhbmNlIGFuZCBoYXZlIGEgbmljZSBkYXksXFxuXFxueW91cnMga29kaVxuICAgICAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgXG4gICAgICAgIG1vcmVfdGV4dCA9IGluZGV4IDwgb3V0cm9fdGV4dC5sZW5ndGgtMVxuICAgICAgICBsZXNzX3RleHQgPSBpbmRleCA+IDBcbiAgICAgICAgXG4gICAgICAgIHBhZ2VfdGV4dCA9IG91dHJvX3RleHRbaW5kZXhdXG4gICAgICAgIHBhZ2VfdGV4dCArPSBcIlxcblxcbiRzY2FsZSgwLjUpKCN7aW5kZXgrMX0vI3tvdXRyb190ZXh0Lmxlbmd0aH0pXCJcbiAgICBcbiAgICAgICAgcGFnZSA9IEtpa2lQYWdlVGV4dChwYWdlX3RleHQsIG1vcmVfdGV4dCwgbGVzc190ZXh0KVxuICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJoaWRlXCIpLmFkZEFjdGlvbihvbmNlKGRpc3BsYXlfbWFpbl9tZW51KSlcbiAgICAgICAgXG4gICAgICAgIGlmIG1vcmVfdGV4dFxuICAgICAgICAgICAgcGFnZS5nZXRFdmVudFdpdGhOYW1lKFwibmV4dFwiKS5hZGRBY3Rpb24gKGk9aW5kZXgrMSkgPT4gQG91dHJvIGlcbiAgICAgICAgaWYgbGVzc190ZXh0XG4gICAgICAgICAgICBwYWdlLmdldEV2ZW50V2l0aE5hbWUoXCJwcmV2aW91c1wiKS5hZGRBY3Rpb24gKGk9aW5kZXgtMSkgPT4gQG91dHJvIGlcbiAgICAgICAgXG4gICAgcmVzZXRQcm9qZWN0aW9uOiAtPiBAcGxheWVyLmNhbWVyYS5zZXRWaWV3cG9ydCAwLjAsIDAuMCwgMS4wLCAxLjBcbiAgICBcbiAgICAjIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwIFxuICAgIFxuICAgIGxvY2FsaXplZFN0cmluZzogKHN0cikgLT4gc3RyXG4gICAgXG4gICAgc2hvd01lbnU6IChzZWxmKSAtPiAjIGhhbmRsZXMgYW4gRVNDIGtleSBldmVudFxuICAgICAgICAjIEB0ZXh0Py5kZWwoKVxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSBAbG9jYWxpemVkU3RyaW5nKFwiaGVscFwiKSwgICAgICAgQHNob3dIZWxwXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcInJlc3RhcnRcIiksICAgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJsb2FkIGxldmVsXCIpLCBAc2hvd0xldmVsc1xuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJzZXR1cFwiKSwgICAgICBAc2hvd1NldHVwICAgICAgIFxuICAgICAgICBAbWVudS5hZGRJdGVtIEBsb2NhbGl6ZWRTdHJpbmcoXCJhYm91dFwiKSwgICAgICBAc2hvd0Fib3V0XG4gICAgICAgIEBtZW51LmFkZEl0ZW0gQGxvY2FsaXplZFN0cmluZyhcInF1aXRcIiksICAgICAgIEBxdWl0XG4gICAgICAgIEBtZW51LnNob3coKVxuICAgIFxuICAgIHF1aXQ6IC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgIHNob3dBYm91dDogLT4gcG9zdC50b01haW4gJ3Nob3dBYm91dCdcbiAgICBzaG93TGV2ZWxzOiAtPiBrbG9nICdzaG93TGV2ZWxzJ1xuICAgIHNob3dTZXR1cDogLT4ga2xvZyAnc2hvd1NldHVwJ1xuICAgICAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgaW5zaWRlUG9zID0gbmV3IFZlY3RvciBwb3NcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIGlmIGYgPCBkZWx0YVxuICAgICAgICAgICAgICAgIGluc2lkZVBvcy5hZGQgV29ybGQubm9ybWFsc1t3XS5tdWwgZGVsdGEtZlxuICAgICAgICBpbnNpZGVQb3NcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JQb3M6IChwb3MpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCAocG9zaXRpdmUgb3IgbmVnYXRpdmUpXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdIFxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGFic01pbiBtaW5fZiwgZiBcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JSYXk6IChyYXlQb3MsIHJheURpcikgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIGluIHJheURpciBcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcmF5UG9zLCByYXlEaXIsIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGYgaWYgZiA+PSAwLjAgYW5kIGYgPCBtaW5fZlxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGRpc3BsYXlMaWdodHM6ICgpIC0+XG4gICAgICAgIGZvciBsaWdodCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBsaWdudC5kaXNwbGF5KClcbiAgICAgICAgICAgICAgIFxuICAgIHBsYXlTb3VuZDogKHNvdW5kLCBwb3MsIHRpbWUpIC0+IFNvdW5kLnBsYXkgc291bmQsIHBvcywgdGltZSBpZiBub3QgQGNyZWF0aW5nXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAwMCBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAwMDAwMCAgXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50RG93bjogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIGlmIEBtZW51PyAgICAgICAgICAgIFxuICAgICAgICAgICAgQG1lbnUubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDEwLCBAc3BlZWQrMVxuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCAxLCAgQHNwZWVkLTFcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAZXhpdExldmVsKClcbiAgICAgICAgICAgIHdoZW4gJ20nIHRoZW4gQGV4aXRMZXZlbCA1XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee