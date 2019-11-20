// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Config, Face, Gate, Gear, Item, LevelSel, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, kerror, klog, last, now, post, prefs, randInt, ref, ref1, world,
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

Config = require('./config');

ScreenText = require('./screentext');

TmpObject = require('./tmpobject');

Pushable = require('./pushable');

Material = require('./material');

Scheme = require('./scheme');

Quaternion = require('./lib/quaternion');

Vector = require('./lib/vector');

Pos = require('./lib/pos');

now = require('perf_hooks').performance.now;

LevelSel = require('./levelselection');

ref1 = require('./items'), Wall = ref1.Wall, Wire = ref1.Wire, Gear = ref1.Gear, Stone = ref1.Stone, Switch = ref1.Switch, MotorGear = ref1.MotorGear, MotorCylinder = ref1.MotorCylinder, Face = ref1.Face;

world = null;

World = (function(superClass) {
    extend(World, superClass);

    World.levels = null;

    World.normals = [new Vector(1, 0, 0), new Vector(0, 1, 0), new Vector(0, 0, 1), new Vector(-1, 0, 0), new Vector(0, -1, 0), new Vector(0, 0, -1)];

    function World(view1, preview) {
        this.view = view1;
        this.preview = preview;
        this.showHelp = bind(this.showHelp, this);
        this.showLevelSelection = bind(this.showLevelSelection, this);
        this.resized = bind(this.resized, this);
        this.exitLevel = bind(this.exitLevel, this);
        this.restart = bind(this.restart, this);
        global.world = this;
        this.speed = 6 + (prefs.get('speed', 3)) - 3;
        this.rasterSize = 0.05;
        World.__super__.constructor.apply(this, arguments);
        this.objects = [];
        this.lights = [];
        this.cells = [];
        this.size = new Pos();
        this.noRotations = false;
        this.screenSize = new Size(this.view.clientWidth, this.view.clientHeight);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            precision: 'highp'
        });
        this.renderer.setSize(this.view.offsetWidth, this.view.offsetHeight);
        this.renderer.autoClear = false;
        this.renderer.sortObjects = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        this.view.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.sun = new THREE.PointLight(0xffffff);
        if (this.player != null) {
            this.sun.position.copy(this.player.camera.getPosition());
        }
        this.scene.add(this.sun);
        this.ambient = new THREE.AmbientLight(0x111111);
        this.scene.add(this.ambient);
        this.depth = -Number.MAX_SAFE_INTEGER;
        this.timer = new Timer(this);
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
        var entry, exitAction, exit_gate, exit_id, l, len, pos, ref2, ref3, ref4, ref5;
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
            for (l = 0, len = ref3.length; l < len; l++) {
                entry = ref3[l];
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
        this.enableShadows(prefs.get('shadows', true));
        return this.creating = false;
    };

    World.prototype.restart = function() {
        return this.create(this.dict);
    };

    World.prototype.applyScheme = function(scheme) {
        var base, base1, base2, base3, base4, base5, base6, k, mat, opacity, ref2, ref3, ref4, ref5, ref6, results, shininess, v;
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
        if (colors.help != null) {
            colors.help;
        } else {
            colors.help = {};
        }
        if ((base6 = colors.help).color != null) {
            base6.color;
        } else {
            base6.color = colors.text.color;
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
        return this.lights.push(light);
    };

    World.prototype.removeLight = function(light) {
        return _.pull(this.lights, light);
    };

    World.prototype.enableShadows = function(enable) {
        var item, l, len, ref2, results;
        this.renderer.shadowMap.enabled = enable;
        ref2 = this.getObjectsOfType(Gate);
        results = [];
        for (l = 0, len = ref2.length; l < len; l++) {
            item = ref2[l];
            item.toggle();
            results.push(item.toggle());
        }
        return results;
    };

    World.prototype.exitLevel = function(action) {
        var nextLevel;
        prefs.set("solved▸" + World.levels.list[world.level_index], true);
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
        var deltas, diff, end, i, j, l, maxdiff, pos, ref2, results, start;
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
        for (i = l = 0, ref2 = maxdiff; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
            pos = new Pos((function() {
                var m, results1;
                results1 = [];
                for (j = m = 0; m <= 2; j = ++m) {
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
        var index, l, ref2, results;
        if (close == null) {
            close = true;
        }
        if (close) {
            points.push(points[0]);
        }
        results = [];
        for (index = l = 1, ref2 = points.length; 1 <= ref2 ? l < ref2 : l > ref2; index = 1 <= ref2 ? ++l : --l) {
            results.push(this.addObjectLine(object, points[index - 1], points[index]));
        }
        return results;
    };

    World.prototype.addObjectRandom = function(object, number) {
        var i, l, ref2, results;
        results = [];
        for (i = l = 0, ref2 = number; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
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
        var ref2;
        return (ref2 = this.objects) != null ? ref2.filter(function(o) {
            return o instanceof clss;
        }) : void 0;
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
        while (this.objects.length) {
            oldSize = this.objects.length;
            this.objects.slice(-1)[0].del();
            if (oldSize === this.objects.length) {
                kerror("WARNING World.deleteAllObjects object no auto remove " + (last(this.objects).name));
                this.objects.pop();
            }
        }
        results = [];
        while (this.lights.length) {
            oldSize = this.lights.length;
            this.lights.slice(-1)[0].del();
            if (oldSize === this.lights.length) {
                kerror("WARNING World.deleteAllObjects light no auto remove");
                results.push(this.lights.pop());
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.deleteObjectsWithClassName = function(className) {
        var l, len, o, ref2, results;
        ref2 = _.clone(this.objects);
        results = [];
        for (l = 0, len = ref2.length; l < len; l++) {
            o = ref2[l];
            if (className === o.getClassName()) {
                results.push(o.del());
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    World.prototype.getObjectWithName = function(objectName) {
        var l, len, o, ref2;
        ref2 = this.objects;
        for (l = 0, len = ref2.length; l < len; l++) {
            o = ref2[l];
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
        } else {
            klog('no sourceCell?');
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
        var camera, l, len, o, ref2, ref3;
        if (this.levelSelection) {
            this.levelSelection.step();
            return;
        }
        camera = (ref2 = this.player) != null ? ref2.camera.cam : void 0;
        Timer.triggerActions();
        Timer.finishActions();
        ref3 = this.objects;
        for (l = 0, len = ref3.length; l < len; l++) {
            o = ref3[l];
            if (typeof o.step === "function") {
                o.step();
            }
        }
        this.renderer.clear(true, true, true);
        if (this.player) {
            this.stepPlayer();
        }
        if (this.preview) {
            this.renderer.setViewport(0, 0, this.screenSize.w, Math.floor(this.screenSize.h * 0.25));
        }
        this.renderer.clearDepth();
        if (this.text) {
            this.renderer.render(this.text.scene, this.text.camera);
        }
        if (this.menu) {
            return this.renderer.render(this.menu.scene, this.menu.camera);
        }
    };

    World.prototype.stepPlayer = function() {
        var d, l, len, len1, m, o, order, ref2, stone, stones;
        if (this.preview) {
            this.player.camera.cam.aspect = this.screenSize.w / (this.screenSize.h * 0.66);
        }
        this.player.camera.step();
        Sound.setMatrix(this.player.camera);
        this.player.setOpacity(clamp(0, 1, this.player.camera.getPosition().minus(this.player.current_position).length() - 0.4));
        stones = [];
        ref2 = this.objects;
        for (l = 0, len = ref2.length; l < len; l++) {
            o = ref2[l];
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
        for (m = 0, len1 = stones.length; m < len1; m++) {
            stone = stones[m];
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
        if (this.preview) {
            this.renderer.setViewport(0, Math.floor(this.screenSize.h * 0.34), this.screenSize.w, Math.floor(this.screenSize.h * 0.66));
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

    World.prototype.showMenu = function() {
        var ref2;
        if (this.helpShown) {
            return this.toggleHelp();
        }
        if ((ref2 = this.text) != null) {
            ref2.del();
        }
        this.menu = new Menu();
        this.menu.addItem('load', this.showLevelSelection);
        this.menu.addItem('reset', this.restart);
        this.menu.addItem('config', (function(_this) {
            return function() {
                return _this.menu = new Config;
            };
        })(this));
        this.menu.addItem('help', this.showHelp);
        this.menu.addItem('quit', function() {
            return post.toMain('quitApp');
        });
        return this.menu.show();
    };

    World.prototype.showLevelSelection = function() {
        return this.levelSelection = new LevelSel(this);
    };

    World.prototype.showHelp = function() {
        this.helpShown = true;
        return this.text = new ScreenText(this.dict['help'], Material.help);
    };

    World.prototype.toggleHelp = function() {
        var ref2;
        this.helpShown = !this.helpShown;
        if (this.helpShown) {
            return this.showHelp();
        } else {
            return (ref2 = this.text) != null ? ref2.del() : void 0;
        }
    };

    World.prototype.getInsideWallPosWithDelta = function(pos, delta) {
        var f, insidePos, l, planePos, w;
        insidePos = new Vector(pos);
        for (w = l = 0; l <= 5; w = ++l) {
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
        var f, l, min_f, planePos, w;
        min_f = 10000;
        for (w = l = 0; l <= 5; w = ++l) {
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
        var f, l, min_f, planePos, w;
        min_f = 10000;
        for (w = l = 0; l <= 5; w = ++l) {
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
        var l, len, light, ref2, results;
        ref2 = this.lights;
        results = [];
        for (l = 0, len = ref2.length; l < len; l++) {
            light = ref2[l];
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
                this.speed = Math.min(8, this.speed + 1);
                return prefs.set('speed', this.speed - 3);
            case '-':
                this.speed = Math.max(4, this.speed - 1);
                return prefs.set('speed', this.speed - 3);
            case 'r':
                return this.restart();
            case 'h':
                return this.toggleHelp();
            case 'l':
                return this.showLevelSelection();
            case 'n':
                return this.create(World.levels.list[(this.level_index + 1) % World.levels.list.length]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QXpCO0FBSGpELGlCQUlTLEdBSlQ7dUJBSWtCLElBQUMsQ0FBQSxPQUFELENBQUE7QUFKbEIsaUJBS1MsR0FMVDt1QkFLa0IsSUFBQyxDQUFBLFVBQUQsQ0FBQTtBQUxsQixpQkFNUyxHQU5UO3VCQU1rQixJQUFDLENBQUEsa0JBQUQsQ0FBQTtBQU5sQixpQkFPUyxHQVBUO3VCQU9rQixJQUFDLENBQUEsTUFBRCxDQUFRLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSyxDQUFBLENBQUMsSUFBQyxDQUFBLFdBQUQsR0FBYSxDQUFkLENBQUEsR0FBbUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBckMsQ0FBMUI7QUFQbEI7SUFaa0I7O29CQXFCdEIsa0JBQUEsR0FBb0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFaEIsWUFBQTtRQUFBLElBQVUsSUFBQyxDQUFBLGNBQVg7QUFBQSxtQkFBQTs7UUFDQSx1Q0FBaUIsQ0FBRSxrQkFBVCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxVQUFWO0FBQUE7O0lBSGdCOzs7O0dBbDNCSjs7QUF1M0JwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG57IHBvc3QsIHJhbmRJbnQsIGNvbG9ycywgYWJzTWluLCBwcmVmcywgY2xhbXAsIGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblNpemUgICAgICAgID0gcmVxdWlyZSAnLi9saWIvc2l6ZSdcbkNlbGwgICAgICAgID0gcmVxdWlyZSAnLi9jZWxsJ1xuR2F0ZSAgICAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5DYW1lcmEgICAgICA9IHJlcXVpcmUgJy4vY2FtZXJhJ1xuTGlnaHQgICAgICAgPSByZXF1aXJlICcuL2xpZ2h0J1xuTGV2ZWxzICAgICAgPSByZXF1aXJlICcuL2xldmVscydcblBsYXllciAgICAgID0gcmVxdWlyZSAnLi9wbGF5ZXInXG5Tb3VuZCAgICAgICA9IHJlcXVpcmUgJy4vc291bmQnXG5DYWdlICAgICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcblRpbWVyICAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdG9yICAgICAgID0gcmVxdWlyZSAnLi9hY3Rvcidcbkl0ZW0gICAgICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQWN0aW9uICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1lbnUgICAgICAgID0gcmVxdWlyZSAnLi9tZW51J1xuQ29uZmlnICAgICAgPSByZXF1aXJlICcuL2NvbmZpZydcblNjcmVlblRleHQgID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcblB1c2hhYmxlICAgID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbk1hdGVyaWFsICAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblNjaGVtZSAgICAgID0gcmVxdWlyZSAnLi9zY2hlbWUnXG5RdWF0ZXJuaW9uICA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5WZWN0b3IgICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xubm93ICAgICAgICAgPSByZXF1aXJlKCdwZXJmX2hvb2tzJykucGVyZm9ybWFuY2Uubm93XG5MZXZlbFNlbCAgICA9IHJlcXVpcmUgJy4vbGV2ZWxzZWxlY3Rpb24nXG57XG5XYWxsLFxuV2lyZSxcbkdlYXIsXG5TdG9uZSxcblN3aXRjaCxcbk1vdG9yR2Vhcixcbk1vdG9yQ3lsaW5kZXIsXG5GYWNlfSAgICAgICA9IHJlcXVpcmUgJy4vaXRlbXMnXG5cbndvcmxkICAgICAgID0gbnVsbFxuXG5jbGFzcyBXb3JsZCBleHRlbmRzIEFjdG9yXG4gICAgXG4gICAgQGxldmVscyA9IG51bGxcbiAgICBcbiAgICBAbm9ybWFscyA9IFtcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMSwgMCwgMFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAxLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLCAxXG4gICAgICAgICAgICBuZXcgVmVjdG9yIC0xLDAsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsLTEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsLTFcbiAgICBdXG4gICAgXG4gICAgQDogKEB2aWV3LCBAcHJldmlldykgLT5cbiAgICAgICAgICAgICBcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gQFxuICAgICAgICBcbiAgICAgICAgQHNwZWVkICAgICAgPSA2ICsgKHByZWZzLmdldCAnc3BlZWQnIDMpIC0gM1xuICAgICAgICBcbiAgICAgICAgQHJhc3RlclNpemUgPSAwLjA1XG5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3RzID0gW11cbiAgICAgICAgQGxpZ2h0cyAgPSBbXVxuICAgICAgICBAY2VsbHMgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICA9IG5ldyBQb3MoKVxuICAgICAgICBcbiAgICAgICAgQG5vUm90YXRpb25zID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgYW50aWFsaWFzOnRydWUsIHByZWNpc2lvbjonaGlnaHAnXG5cbiAgICAgICAgQHJlbmRlcmVyLnNldFNpemUgQHZpZXcub2Zmc2V0V2lkdGgsIEB2aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2VcbiAgICAgICAgQHJlbmRlcmVyLnNvcnRPYmplY3RzID0gdHJ1ZVxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXJlci5kb21FbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiAgICAgICAgIyAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuICAgICAgICBAc3VuID0gbmV3IFRIUkVFLlBvaW50TGlnaHQgMHhmZmZmZmZcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkgaWYgQHBsYXllcj9cbiAgICAgICAgQHNjZW5lLmFkZCBAc3VuXG4gICAgICAgIFxuICAgICAgICBAYW1iaWVudCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQgMHgxMTExMTFcbiAgICAgICAgQHNjZW5lLmFkZCBAYW1iaWVudFxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgQGRlcHRoID0gLU51bWJlci5NQVhfU0FGRV9JTlRFR0VSICAgICAgICBcbiAgICAgICAgQHRpbWVyID0gbmV3IFRpbWVyIEAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgaW5kZXggPSBwcmVmcy5nZXQgJ2xldmVsJyAwXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBAbGV2ZWxzLmxpc3RbaW5kZXhdXG4gICAgICAgIHdvcmxkXG4gICAgICAgIFxuICAgIEBpbml0R2xvYmFsOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbHM/XG4gICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9LCBzaG93TmFtZT10cnVlKSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIEBsZXZlbF9uYW1lXG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBwcmVmcy5zZXQgJ2xldmVsJyBAbGV2ZWxfaW5kZXhcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIldvcmxkLmNyZWF0ZSAje0BsZXZlbF9pbmRleH0gc2l6ZTogI3tuZXcgUG9zKEBkaWN0W1wic2l6ZVwiXSkuc3RyKCl9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gJyN7QGxldmVsX25hbWV9JyBzY2hlbWU6ICcje0BkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J30nXCJcblxuICAgICAgICBAY3JlYXRpbmcgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFNpemUgQGRpY3Quc2l6ZSAjIHRoaXMgcmVtb3ZlcyBhbGwgb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQGFwcGx5U2NoZW1lIEBkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3IGFuZCBzaG93TmFtZVxuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKS5taW51cyBAcGxheWVyLmRpcmVjdGlvblxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLkZPTExPV1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHByZWZzLmdldCAnc2hhZG93cycgdHJ1ZSAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGFwcGx5U2NoZW1lOiAoc2NoZW1lKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgY29sb3JzID0gXy5jbG9uZSBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgb3BhY2l0eSA9XG4gICAgICAgICAgICBzdG9uZTogMC43XG4gICAgICAgICAgICBib21iOiAgMC45XG4gICAgICAgICAgICB0ZXh0OiAgMFxuICAgICAgICAgICAgXG4gICAgICAgIHNoaW5pbmVzcyA9IFxuICAgICAgICAgICAgdGlyZTogICA0XG4gICAgICAgICAgICBwbGF0ZTogIDEwXG4gICAgICAgICAgICByYXN0ZXI6IDIwXG4gICAgICAgICAgICB3YWxsOiAgIDIwXG4gICAgICAgICAgICBzdG9uZTogIDIwXG4gICAgICAgICAgICBnZWFyOiAgIDIwXG4gICAgICAgICAgICB0ZXh0OiAgIDIwMFxuICAgICAgICAgICAgXG4gICAgICAgIGNvbG9ycy5wbGF0ZS5lbWlzc2l2ZSAgID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSAgICAgICAgICAgICA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciAgICAgICA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyICAgICAgICAgICA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciAgICAgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy53YWxsICAgICAgICAgICAgID89IHt9XG4gICAgICAgIGNvbG9ycy53YWxsLmNvbG9yICAgICAgID89IG5ldyBUSFJFRS5Db2xvcihjb2xvcnMucGxhdGUuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuNlxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yICA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBjb2xvcnMuaGVscCAgICAgICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMuaGVscC5jb2xvciAgICAgICA/PSBjb2xvcnMudGV4dC5jb2xvclxuICAgICAgICBcbiAgICAgICAgZm9yIGssdiBvZiBjb2xvcnNcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIFxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgIyBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBcbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIGxpZ2h0XG4gICAgICAgIFxuICAgICAgICAjIGZvciBsIGluIEBsaWdodHNcbiAgICAgICAgICAgICMgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICAgICAgXG4gICAgICAgICMgQGVuYWJsZVNoYWRvd3Mgc2hhZG93XG5cbiAgICBlbmFibGVTaGFkb3dzOiAoZW5hYmxlKSAtPlxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gZW5hYmxlXG4gICAgICAgIFxuICAgICAgICBmb3IgaXRlbSBpbiBAZ2V0T2JqZWN0c09mVHlwZSBHYXRlXG4gICAgICAgICAgICBpdGVtLnRvZ2dsZSgpXG4gICAgICAgICAgICBpdGVtLnRvZ2dsZSgpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAgICAgICBcbiAgICBleGl0TGV2ZWw6IChhY3Rpb24pID0+XG4gICAgICAgIFxuICAgICAgICBwcmVmcy5zZXQgXCJzb2x2ZWTilrgje1dvcmxkLmxldmVscy5saXN0W3dvcmxkLmxldmVsX2luZGV4XX1cIiB0cnVlXG4gICAgICAgIG5leHRMZXZlbCA9ICh3b3JsZC5sZXZlbF9pbmRleCsoXy5pc051bWJlcihhY3Rpb24pIGFuZCBhY3Rpb24gb3IgMSkpICUgV29ybGQubGV2ZWxzLmxpc3QubGVuZ3RoXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBXb3JsZC5sZXZlbHMubGlzdFtuZXh0TGV2ZWxdXG5cbiAgICBhY3RpdmF0ZTogKG9iamVjdE5hbWUpIC0+IEBnZXRPYmplY3RXaXRoTmFtZShvYmplY3ROYW1lKT8uc2V0QWN0aXZlPyB0cnVlXG4gICAgXG4gICAgZGVjZW50ZXI6ICh4LHkseikgLT4gbmV3IFBvcyh4LHkseikucGx1cyBAc2l6ZS5kaXYgMlxuXG4gICAgaXNWYWxpZFBvczogKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggPj0gMCBhbmQgcC54IDwgQHNpemUueCBhbmQgcC55ID49IDAgYW5kIHAueSA8IEBzaXplLnkgYW5kIHAueiA+PSAwIGFuZCBwLnogPCBAc2l6ZS56XG4gICAgICAgIFxuICAgIGlzSW52YWxpZFBvczogKHBvcykgLT4gbm90IEBpc1ZhbGlkUG9zIHBvc1xuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgICAgIDAwMDAwMDBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgICAwMDBcbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwIFxuICAgIFxuICAgIHNldFNpemU6IChzaXplKSAtPlxuICAgICAgICBcbiAgICAgICAgQGRlbGV0ZUFsbE9iamVjdHMoKVxuICAgICAgICBAY2VsbHMgPSBbXVxuICAgICAgICBAc2l6ZSA9IG5ldyBQb3Mgc2l6ZVxuICAgICAgICAjIGNhbGN1YXRlIG1heCBkaXN0YW5jZSAoZm9yIHBvc2l0aW9uIHJlbGF0aXZlIHNvdW5kKVxuICAgICAgICBAbWF4X2Rpc3RhbmNlID0gTWF0aC5tYXgoQHNpemUueCwgTWF0aC5tYXgoQHNpemUueSwgQHNpemUueikpICAjIGhldXJpc3RpYyBvZiBhIGhldXJpc3RpYyA6LSlcbiAgICAgICAgQGNhZ2U/LmRlbCgpXG4gICAgICAgIEBjYWdlID0gbmV3IENhZ2UgQHNpemUsIEByYXN0ZXJTaXplXG5cbiAgICBnZXRDZWxsQXRQb3M6IChwb3MpIC0+IHJldHVybiBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gaWYgQGlzVmFsaWRQb3MgcG9zXG4gICAgZ2V0Qm90QXRQb3M6ICAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgQm90LCBuZXcgUG9zIHBvc1xuXG4gICAgcG9zVG9JbmRleDogICAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCAqIEBzaXplLnogKiBAc2l6ZS55ICsgcC55ICogQHNpemUueiArIHAuelxuICAgICAgICBcbiAgICBpbmRleFRvUG9zOiAgIChpbmRleCkgLT4gXG4gICAgICAgIGxzaXplID0gQHNpemUueiAqIEBzaXplLnlcbiAgICAgICAgbHJlc3QgPSBpbmRleCAlIGxzaXplXG4gICAgICAgIG5ldyBQb3MgaW5kZXgvbHNpemUsIGxyZXN0L0BzaXplLnosIGxyZXN0JUBzaXplLnpcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkT2JqZWN0QXRQb3M6IChvYmplY3QsIHgsIHksIHopIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgeCwgeSwgelxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0QXRQb3MgI3tvYmplY3QubmFtZX1cIiwgcG9zXG4gICAgICAgIEBhZGRPYmplY3Qgb2JqZWN0XG5cbiAgICBhZGRPYmplY3RMaW5lOiAob2JqZWN0LCBzeCxzeSxzeiwgZXgsZXksZXopIC0+XG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBpZiBzeCBpbnN0YW5jZW9mIFBvcyBvciBBcnJheS5pc0FycmF5IHN4XG4gICAgICAgICAgICBzdGFydCA9IHN4XG4gICAgICAgICAgICBlbmQgICA9IHN5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IFBvcyBzeCxzeSxzelxuICAgICAgICAgICAgZW5kICAgPSBuZXcgUG9zIGV4LGV5LGV6XG4gICAgICAgICMgYWRkcyBhIGxpbmUgb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gc3RhcnQgYW5kIGVuZCBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgZW5kIGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBlbmQgPSBbZW5kLngsIGVuZC55LCBlbmQuel1cbiAgICAgICAgW2V4LCBleSwgZXpdID0gZW5kXG5cbiAgICAgICAgaWYgc3RhcnQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIHN0YXJ0ID0gW3N0YXJ0LngsIHN0YXJ0LnksIHN0YXJ0LnpdXG4gICAgICAgIFtzeCwgc3ksIHN6XSA9IHN0YXJ0XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgXG4gICAgICAgIGRpZmYgPSBbZXgtc3gsIGV5LXN5LCBlei1zel1cbiAgICAgICAgbWF4ZGlmZiA9IF8ubWF4IGRpZmYubWFwIE1hdGguYWJzXG4gICAgICAgIGRlbHRhcyA9IGRpZmYubWFwIChhKSAtPiBhL21heGRpZmZcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5tYXhkaWZmXVxuICAgICAgICAgICAgIyBwb3MgPSBhcHBseShQb3MsIChtYXAgKGxhbWJkYSBhLCBiOiBpbnQoYStpKmIpLCBzdGFydCwgZGVsdGFzKSkpXG4gICAgICAgICAgICBwb3MgPSBuZXcgUG9zIChzdGFydFtqXStpKmRlbHRhc1tqXSBmb3IgaiBpbiBbMC4uMl0pXG4gICAgICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RMaW5lICN7aX06XCIsIHBvc1xuICAgICAgICAgICAgaWYgQGlzVW5vY2N1cGllZFBvcyBwb3NcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICBcbiAgICBhZGRPYmplY3RQb2x5OiAob2JqZWN0LCBwb2ludHMsIGNsb3NlPXRydWUpIC0+XG4gICAgICAgICMgYWRkcyBhIHBvbHlnb24gb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gcG9pbnRzIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBjbG9zZVxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggcG9pbnRzWzBdXG4gICAgICAgIGZvciBpbmRleCBpbiBbMS4uLnBvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBAYWRkT2JqZWN0TGluZSBvYmplY3QsIHBvaW50c1tpbmRleC0xXSwgcG9pbnRzW2luZGV4XVxuICAgICAgIFxuICAgIGFkZE9iamVjdFJhbmRvbTogKG9iamVjdCwgbnVtYmVyKSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBmb3IgaSBpbiBbMC4uLm51bWJlcl1cbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIG9iamVjdCgpXG4gICAgICAgIFxuICAgIHNldE9iamVjdFJhbmRvbTogKG9iamVjdCkgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgb2JqZWN0U2V0ID0gZmFsc2VcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgd2hpbGUgbm90IG9iamVjdFNldCAjIGhhY2sgYWxlcnQhXG4gICAgICAgICAgICByYW5kb21Qb3MgPSBuZXcgUG9zIHJhbmRJbnQoQHNpemUueCksIHJhbmRJbnQoQHNpemUueSksIHJhbmRJbnQoQHNpemUueilcbiAgICAgICAgICAgIGlmIG5vdCBvYmplY3QuaXNTcGFjZUVnb2lzdGljKCkgb3IgQGlzVW5vY2N1cGllZFBvcyByYW5kb21Qb3MgXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcmFuZG9tUG9zXG4gICAgICAgICAgICAgICAgb2JqZWN0U2V0ID0gdHJ1ZVxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAgICAgIChjbHNzKSAgICAgIC0+IEBvYmplY3RzPy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gaW52YWxpZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKVxuICAgICAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgPSBjZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50LnRpbWUgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCB0aW1lOlwiLCBvY2N1cGFudC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5kZWwoKSAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBhbnl3YXkgLiBkZWxldGUgaXRcbiAgICAgICAgXG4gICAgICAgIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiBub3QgY2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4KHBvcylcbiAgICAgICAgICAgIGNlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IGNlbGxcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5zZXRQb3NpdGlvbiBwb3NcbiAgICAgICAgY2VsbC5hZGRPYmplY3Qgb2JqZWN0XG5cbiAgICB1bnNldE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgcG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgY2VsbC5yZW1vdmVPYmplY3Qgb2JqZWN0XG4gICAgICAgICAgICBpZiBjZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSA9IG51bGxcbiAgICAgICAgIyBlbHNlIFxuICAgICAgICAgICAgIyBrbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBcbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgdG9nZ2xlOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgXG4gICAgICAgIG9iamVjdCA9IEBnZXRPYmplY3RXaXRoTmFtZSBvYmplY3ROYW1lIFxuICAgICAgICBvYmplY3QuZ2V0QWN0aW9uV2l0aE5hbWUoXCJ0b2dnbGVcIikucGVyZm9ybSgpXG4gICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGRlbGV0ZUFsbE9iamVjdHM6IC0+XG4gICAgICAgIFxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcblxuICAgICAgICAjIGtsb2cgJysnIEByZW5kZXJlci5pbmZvLm1lbW9yeS5nZW9tZXRyaWVzLCBAcmVuZGVyZXIuaW5mby5tZW1vcnkudGV4dHVyZXMsICdvYmplY3RzJyBAb2JqZWN0cy5sZW5ndGgsIEBsaWdodHMubGVuZ3RoXG5cbiAgICAgICAgIyBAZW5hYmxlU2hhZG93cyBmYWxzZVxuICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICAgICAgXG4gICAgICAgIHdoaWxlIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgQG9iamVjdHNbLTFdLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAb2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgb2JqZWN0IG5vIGF1dG8gcmVtb3ZlICN7bGFzdChAb2JqZWN0cykubmFtZX1cIlxuICAgICAgICAgICAgICAgIEBvYmplY3RzLnBvcCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIEBsaWdodHNbLTFdLmRlbCgpICMgZGVzdHJ1Y3RvciB3aWxsIGNhbGwgcmVtb3ZlIG9iamVjdFxuICAgICAgICAgICAgaWYgb2xkU2l6ZSA9PSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBsaWdodCBubyBhdXRvIHJlbW92ZVwiXG4gICAgICAgICAgICAgICAgQGxpZ2h0cy5wb3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICMga2xvZyAnLScgQHJlbmRlcmVyLmluZm8ubWVtb3J5Lmdlb21ldHJpZXMsIEByZW5kZXJlci5pbmZvLm1lbW9yeS50ZXh0dXJlc1xuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBcbiAgICAgICAgZm9yIG8gaW4gXy5jbG9uZSBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgY2xhc3NOYW1lID09IG8uZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICBvLmRlbCgpXG4gICAgXG4gICAgZ2V0T2JqZWN0V2l0aE5hbWU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBcbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdE5hbWUgPT0gby5uYW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9cbiAgICAgICAga2Vycm9yIFwiV29ybGQuZ2V0T2JqZWN0V2l0aE5hbWUgW1dBUk5JTkddIG5vIG9iamVjdCB3aXRoIG5hbWUgI3tvYmplY3ROYW1lfVwiXG4gICAgICAgIG51bGxcbiAgICBcbiAgICBzZXRDYW1lcmFNb2RlOiAobW9kZSkgLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IGNsYW1wIENhbWVyYS5JTlNJREUsIENhbWVyYS5GT0xMT1csIG1vZGVcbiAgICBcbiAgICBjaGFuZ2VDYW1lcmFNb2RlOiAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gKEBwbGF5ZXIuY2FtZXJhLm1vZGUrMSkgJSAoQ2FtZXJhLkZPTExPVysxKVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAgICAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgIDAgICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBvYmplY3RXaWxsTW92ZVRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VQb3MuZXFsIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gZXF1YWwgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIHRhcmdldENlbGxcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zID0gdGFyZ2V0Q2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MudGltZSA8IDAgYW5kIC1vYmplY3RBdE5ld1Bvcy50aW1lIDw9IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC4gZGVsZXRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBdE5ld1Bvcy5kZWwoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSB0aW1pbmcgY29uZmxpY3QgYXQgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGFscmVhZHkgb2NjdXBpZWQ6XCIsIHRhcmdldFBvcyBcbiAgICBcbiAgICAgICAgaWYgb2JqZWN0Lm5hbWUgIT0gJ3BsYXllcidcbiAgICAgICAgICAgIEB1bnNldE9iamVjdCBvYmplY3QgIyByZW1vdmUgb2JqZWN0IGZyb20gY2VsbCBncmlkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG9sZCBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gLWR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCBzb3VyY2VQb3MgXG5cbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG5ldyBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IGR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCB0YXJnZXRQb3MgXG5cbiAgICBvYmplY3RNb3ZlZDogKG1vdmVkT2JqZWN0LCBmcm9tLCB0bykgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG5ldyBQb3MgZnJvbVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHRvXG5cbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiB0YXJnZXRQb3NcbiAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZUNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHNvdXJjZVBvc1xuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHNvdXJjZUNlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHRhcmdldENlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc09jY3VwaWVkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gb2NjdXBpZWQgdGFyZ2V0IHBvczpcIiB0YXJnZXRQb3NcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VDZWxsP1xuICAgICAgICAgICAgc291cmNlQ2VsbC5yZW1vdmVPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgICAgIGlmIHNvdXJjZUNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHNvdXJjZVBvcyldID0gbnVsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrbG9nICdubyBzb3VyY2VDZWxsPydcbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvcyAgICBcbiAgICAgICAgaWYgbm90IHRhcmdldENlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0YXJnZXRDZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSB0YXJnZXRDZWxsXG5cbiAgICAgICAgaWYgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIHRhcmdldENlbGwuYWRkT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG5vIHRhcmdldCBjZWxsP1wiXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgICAgIFxuICAgIFxuICAgIHN0ZXA6IC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgICAgIEBsZXZlbFNlbGVjdGlvbi5zdGVwKClcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyPy5jYW1lcmEuY2FtXG4gICAgXG4gICAgICAgIFRpbWVyLnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgVGltZXIuZmluaXNoQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICBvLnN0ZXA/KCkgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5jbGVhciB0cnVlIHRydWUgdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBwbGF5ZXIgXG4gICAgICAgICAgICBAc3RlcFBsYXllcigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgMCwgQHNjcmVlblNpemUudywgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuMjUpXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuY2xlYXJEZXB0aCgpXG4gICAgICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuXG4gICAgc3RlcFBsYXllcjogLT5cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuY2FtLmFzcGVjdCA9IEBzY3JlZW5TaXplLncgLyAoQHNjcmVlblNpemUuaCowLjY2KVxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwKClcblxuICAgICAgICBTb3VuZC5zZXRNYXRyaXggQHBsYXllci5jYW1lcmFcbiAgICAgICAgICAgIFxuICAgICAgICBAcGxheWVyLnNldE9wYWNpdHkgY2xhbXAgMCwgMSwgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKS5taW51cyhAcGxheWVyLmN1cnJlbnRfcG9zaXRpb24pLmxlbmd0aCgpLTAuNFxuICAgICAgICBcbiAgICAgICAgc3RvbmVzID0gW11cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG8gaW5zdGFuY2VvZiBTdG9uZVxuICAgICAgICAgICAgICAgIHN0b25lcy5wdXNoIG9cbiAgICAgICAgc3RvbmVzLnNvcnQgKGEsYikgPT4gYi5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKSAtIGEucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgXG4gICAgICAgIG9yZGVyID0gMTAwXG4gICAgICAgIGZvciBzdG9uZSBpbiBzdG9uZXNcbiAgICAgICAgICAgIHN0b25lLm1lc2gucmVuZGVyT3JkZXIgPSBvcmRlclxuICAgICAgICAgICAgb3JkZXIgKz0gMVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgZCA9IHN0b25lLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgICAgICBpZiBkIDwgMS4wXG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgaWYgbm90IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IDAuMiArIGQgKiAwLjVcbiAgICAgICAgICAgIGVsc2UgaWYgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHlcbiAgICAgICAgXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5jYW0ucG9zaXRpb25cblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHJlbmRlcmVyLnNldFZpZXdwb3J0IDAsIE1hdGguZmxvb3IoQHNjcmVlblNpemUuaCowLjM0KSwgQHNjcmVlblNpemUudywgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuNjYpXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBzY2VuZSwgQHBsYXllci5jYW1lcmEuY2FtXG4gICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgZ2V0VGltZTogLT4gbm93KCkudG9GaXhlZCAwXG4gICAgc2V0U3BlZWQ6IChzKSAtPiBAc3BlZWQgPSBzXG4gICAgZ2V0U3BlZWQ6IC0+IEBzcGVlZFxuICAgIG1hcE1zVGltZTogICh1bm1hcHBlZCkgLT4gcGFyc2VJbnQgMTAuMCAqIHVubWFwcGVkL0BzcGVlZFxuICAgIHVubWFwTXNUaW1lOiAobWFwcGVkKSAtPiBwYXJzZUludCBtYXBwZWQgKiBAc3BlZWQvMTAuMFxuICAgICAgICBcbiAgICBjb250aW51b3VzOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJjb250aW51b3VzXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5DT05USU5VT1VTXG5cbiAgICBvbmNlOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJvbmNlXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICBcbiAgICByZXNpemVkOiAodyxoKSA9PlxuICAgICAgICBcbiAgICAgICAgQGFzcGVjdCA9IHcvaFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIHcsaFxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyPy5jYW1lcmEuY2FtXG4gICAgICAgIGNhbWVyYT8uYXNwZWN0ID0gQGFzcGVjdFxuICAgICAgICBjYW1lcmE/LnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgICAgICBAcmVuZGVyZXI/LnNldFNpemUgdyxoXG4gICAgICAgIEB0ZXh0Py5yZXNpemVkIHcsaFxuICAgICAgICBAbWVudT8ucmVzaXplZCB3LGhcbiAgICAgICAgXG4gICAgICAgIEBsZXZlbFNlbGVjdGlvbj8ucmVzaXplZCB3LGhcblxuICAgIGdldE5lYXJlc3RWYWxpZFBvczogKHBvcykgLT5cbiAgICAgICAgbmV3IFBvcyBNYXRoLm1pbihAc2l6ZS54LTEsIE1hdGgubWF4KHBvcy54LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnktMSwgTWF0aC5tYXgocG9zLnksIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUuei0xLCBNYXRoLm1heChwb3MueiwgMCkpXG4gICAgXG4gICAgaXNVbm9jY3VwaWVkUG9zOiAocG9zKSAtPiBub3QgQGlzT2NjdXBpZWRQb3MgcG9zXG4gICAgaXNPY2N1cGllZFBvczogICAocG9zKSAtPiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgbWF5T2JqZWN0UHVzaFRvUG9zOiAob2JqZWN0LCBwb3MsIGR1cmF0aW9uKSAtPlxuXG4gICAgICAgICMgcmV0dXJucyB0cnVlLCBpZiBhIHB1c2hhYmxlIG9iamVjdCBpcyBhdCBwb3MgYW5kIG1heSBiZSBwdXNoZWRcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgIFxuICAgICAgICBkaXJlY3Rpb24gPSBwb3MubWludXMgb2JqZWN0LmdldFBvcygpICMgZGlyZWN0aW9uIGZyb20gb2JqZWN0IHRvIHB1c2hhYmxlIG9iamVjdFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIEBpc0ludmFsaWRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIFxuICAgICAgICBvYmplY3RBdE5ld1BvcyA9IEBnZXRPY2N1cGFudEF0UG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBpZiBvYmplY3RBdE5ld1Bvc1xuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICB0bXBPYmplY3QgPSBvYmplY3RBdE5ld1Bvc1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIHRtcE9iamVjdC50aW1lIDwgMCBhbmQgLXRtcE9iamVjdC50aW1lIDw9IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLT4gZGVsZXRlIGl0XG4gICAgICAgICAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKVxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgIFxuICAgICAgICBwdXNoYWJsZU9iamVjdCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuXG4gICAgICAgIGlmIHB1c2hhYmxlT2JqZWN0PyBhbmQgcHVzaGFibGVPYmplY3QgaW5zdGFuY2VvZiBQdXNoYWJsZVxuICAgICAgICAgICAgcHVzaGFibGVPYmplY3QucHVzaGVkQnlPYmplY3RJbkRpcmVjdGlvbiBvYmplY3QsIGRpcmVjdGlvbiwgZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgICAgIGZhbHNlXG4gICAgXG4gICAgIyAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcbiAgICBcbiAgICBzaG93TWVudTogLT5cblxuICAgICAgICBpZiBAaGVscFNob3duIHRoZW4gcmV0dXJuIEB0b2dnbGVIZWxwKClcbiAgICAgICAgXG4gICAgICAgIEB0ZXh0Py5kZWwoKVxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnbG9hZCcgICBAc2hvd0xldmVsU2VsZWN0aW9uXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ3Jlc2V0JyAgQHJlc3RhcnQgXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ2NvbmZpZycgPT4gQG1lbnUgPSBuZXcgQ29uZmlnXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ2hlbHAnICAgQHNob3dIZWxwXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ3F1aXQnICAgLT4gcG9zdC50b01haW4gJ3F1aXRBcHAnXG4gICAgICAgIEBtZW51LnNob3coKVxuICAgIFxuICAgIHNob3dMZXZlbFNlbGVjdGlvbjogPT4gXG4gICAgXG4gICAgICAgIEBsZXZlbFNlbGVjdGlvbiA9IG5ldyBMZXZlbFNlbCBAXG4gICAgXG4gICAgc2hvd0hlbHA6ID0+XG4gICAgICAgIFxuICAgICAgICBAaGVscFNob3duID0gdHJ1ZVxuICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0WydoZWxwJ10sIE1hdGVyaWFsLmhlbHBcbiAgICAgICAgXG4gICAgdG9nZ2xlSGVscDogLT5cbiAgICAgICAgXG4gICAgICAgIEBoZWxwU2hvd24gPSBub3QgQGhlbHBTaG93blxuICAgICAgICBpZiBAaGVscFNob3duXG4gICAgICAgICAgICBAc2hvd0hlbHAoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGV4dD8uZGVsKClcbiAgICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG4gICAgXG4gICAgZ2V0SW5zaWRlV2FsbFBvc1dpdGhEZWx0YTogKHBvcywgZGVsdGEpIC0+XG4gICAgICAgIFxuICAgICAgICBpbnNpZGVQb3MgPSBuZXcgVmVjdG9yIHBvc1xuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgaWYgZiA8IGRlbHRhXG4gICAgICAgICAgICAgICAgaW5zaWRlUG9zLmFkZCBXb3JsZC5ub3JtYWxzW3ddLm11bCBkZWx0YS1mXG4gICAgICAgIGluc2lkZVBvc1xuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclBvczogKHBvcykgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIChwb3NpdGl2ZSBvciBuZWdhdGl2ZSlcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV0gXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gYWJzTWluIG1pbl9mLCBmIFxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclJheTogKHJheVBvcywgcmF5RGlyKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgaW4gcmF5RGlyIFxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciByYXlQb3MsIHJheURpciwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gZiBpZiBmID49IDAuMCBhbmQgZiA8IG1pbl9mXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZGlzcGxheUxpZ2h0czogKCkgLT5cbiAgICAgICAgZm9yIGxpZ2h0IGluIEBsaWdodHNcbiAgICAgICAgICAgIGxpZ2h0LmRpc3BsYXkoKVxuICAgICAgICAgICAgICAgXG4gICAgcGxheVNvdW5kOiAoc291bmQsIHBvcywgdGltZSkgLT4gU291bmQucGxheSBzb3VuZCwgcG9zLCB0aW1lIGlmIG5vdCBAY3JlYXRpbmdcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMDAwIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgIDAwMDAwICBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgQG1lbnU/ICAgICAgICAgICAgXG4gICAgICAgICAgICBAbWVudS5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICBcbiAgICAgICAgQHRleHQ/LmZhZGVPdXQoKVxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBzd2l0Y2ggY29tYm9cbiAgICAgICAgICAgIHdoZW4gJ2VzYycgdGhlbiBAc2hvd01lbnUoKVxuICAgICAgICAgICAgd2hlbiAnPScgdGhlbiBAc3BlZWQgPSBNYXRoLm1pbiA4LCBAc3BlZWQrMTsgcHJlZnMuc2V0ICdzcGVlZCcgQHNwZWVkLTNcbiAgICAgICAgICAgIHdoZW4gJy0nIHRoZW4gQHNwZWVkID0gTWF0aC5tYXggNCwgQHNwZWVkLTE7IHByZWZzLnNldCAnc3BlZWQnIEBzcGVlZC0zXG4gICAgICAgICAgICB3aGVuICdyJyB0aGVuIEByZXN0YXJ0KClcbiAgICAgICAgICAgIHdoZW4gJ2gnIHRoZW4gQHRvZ2dsZUhlbHAoKVxuICAgICAgICAgICAgd2hlbiAnbCcgdGhlbiBAc2hvd0xldmVsU2VsZWN0aW9uKClcbiAgICAgICAgICAgIHdoZW4gJ24nIHRoZW4gQGNyZWF0ZSBXb3JsZC5sZXZlbHMubGlzdFsoQGxldmVsX2luZGV4KzEpICUgV29ybGQubGV2ZWxzLmxpc3QubGVuZ3RoXVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnRVcCBtb2QsIGtleSwgY29tYm8sIGV2ZW50ICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZFxuXG4iXX0=
//# sourceURL=../coffee/world.coffee