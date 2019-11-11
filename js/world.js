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
        this.view.appendChild(this.renderer.domElement);
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

    World.prototype.toggle = function(objectName) {
        var object;
        object = this.getObjectWithName(objectName);
        return object.getActionWithName("toggle").perform();
    };

    World.prototype.deleteAllObjects = function() {
        var oldSize, results;
        Timer.removeAllActions();
        this.enableShadows(false);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QUQsR0FBTyxDQUF6QjtBQUhqRCxpQkFJUyxHQUpUO3VCQUlrQixJQUFDLENBQUEsT0FBRCxDQUFBO0FBSmxCLGlCQUtTLEdBTFQ7dUJBS2tCLElBQUMsQ0FBQSxVQUFELENBQUE7QUFMbEIsaUJBTVMsR0FOVDt1QkFNa0IsSUFBQyxDQUFBLGtCQUFELENBQUE7QUFObEIsaUJBT1MsR0FQVDt1QkFPa0IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUssQ0FBQSxDQUFDLElBQUMsQ0FBQSxXQUFELEdBQWEsQ0FBZCxDQUFBLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQXJDLENBQTFCO0FBUGxCO0lBWmtCOztvQkFxQnRCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBRWhCLFlBQUE7UUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsbUJBQUE7O1FBQ0EsdUNBQWlCLENBQUUsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsS0FBdEMsRUFBNkMsS0FBN0MsVUFBVjtBQUFBOztJQUhnQjs7OztHQXYyQko7O0FBNDJCcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICBcbiMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwICBcblxueyBwb3N0LCByYW5kSW50LCBjb2xvcnMsIGFic01pbiwgcHJlZnMsIGNsYW1wLCBsYXN0LCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5TaXplICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3NpemUnXG5DZWxsICAgICAgICA9IHJlcXVpcmUgJy4vY2VsbCdcbkdhdGUgICAgICAgID0gcmVxdWlyZSAnLi9nYXRlJ1xuQ2FtZXJhICAgICAgPSByZXF1aXJlICcuL2NhbWVyYSdcbkxpZ2h0ICAgICAgID0gcmVxdWlyZSAnLi9saWdodCdcbkxldmVscyAgICAgID0gcmVxdWlyZSAnLi9sZXZlbHMnXG5QbGF5ZXIgICAgICA9IHJlcXVpcmUgJy4vcGxheWVyJ1xuU291bmQgICAgICAgPSByZXF1aXJlICcuL3NvdW5kJ1xuQ2FnZSAgICAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5UaW1lciAgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5BY3RvciAgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5JdGVtICAgICAgICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiAgICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NZW51ICAgICAgICA9IHJlcXVpcmUgJy4vbWVudSdcbkNvbmZpZyAgICAgID0gcmVxdWlyZSAnLi9jb25maWcnXG5TY3JlZW5UZXh0ICA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcblRtcE9iamVjdCAgID0gcmVxdWlyZSAnLi90bXBvYmplY3QnXG5QdXNoYWJsZSAgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5NYXRlcmlhbCAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5TY2hlbWUgICAgICA9IHJlcXVpcmUgJy4vc2NoZW1lJ1xuUXVhdGVybmlvbiAgPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbm5vdyAgICAgICAgID0gcmVxdWlyZSgncGVyZl9ob29rcycpLnBlcmZvcm1hbmNlLm5vd1xuTGV2ZWxTZWwgICAgPSByZXF1aXJlICcuL2xldmVsc2VsZWN0aW9uJ1xue1xuV2FsbCxcbldpcmUsXG5HZWFyLFxuU3RvbmUsXG5Td2l0Y2gsXG5Nb3RvckdlYXIsXG5Nb3RvckN5bGluZGVyLFxuRmFjZX0gICAgICAgPSByZXF1aXJlICcuL2l0ZW1zJ1xuXG53b3JsZCAgICAgICA9IG51bGxcblxuY2xhc3MgV29ybGQgZXh0ZW5kcyBBY3RvclxuICAgIFxuICAgIEBsZXZlbHMgPSBudWxsXG4gICAgXG4gICAgQG5vcm1hbHMgPSBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDEsIDAsIDBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwgMVxuICAgICAgICAgICAgbmV3IFZlY3RvciAtMSwwLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLC0xLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLC0xXG4gICAgXVxuICAgIFxuICAgIEA6IChAdmlldywgQHByZXZpZXcpIC0+XG4gICAgICAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBcbiAgICAgICAgXG4gICAgICAgIEBzcGVlZCAgICAgID0gNiArIChwcmVmcy5nZXQgJ3NwZWVkJyAzKSAtIDNcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBhbnRpYWxpYXM6dHJ1ZSwgcHJlY2lzaW9uOidoaWdocCdcblxuICAgICAgICBAcmVuZGVyZXIuc2V0U2l6ZSBAdmlldy5vZmZzZXRXaWR0aCwgQHZpZXcub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZVxuICAgICAgICBAcmVuZGVyZXIuc29ydE9iamVjdHMgPSB0cnVlXG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXBcbiAgICAgICAgQHZpZXcuYXBwZW5kQ2hpbGQgQHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgICAgICAjICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICBcbiAgICAgICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICAgICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG4gICAgICAgIEBzdW4gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZlxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSBpZiBAcGxheWVyP1xuICAgICAgICBAc2NlbmUuYWRkIEBzdW5cbiAgICAgICAgXG4gICAgICAgIEBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCAweDExMTExMVxuICAgICAgICBAc2NlbmUuYWRkIEBhbWJpZW50XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICBAb2JqZWN0cyA9IFtdXG4gICAgICAgIEBsaWdodHMgID0gW11cbiAgICAgICAgQGNlbGxzICAgPSBbXSBcbiAgICAgICAgQHNpemUgICAgPSBuZXcgUG9zKClcbiAgICAgICAgQGRlcHRoICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgICAgXG4gICAgICAgIEB0aW1lciA9IG5ldyBUaW1lciBAICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiB3b3JsZD9cbiAgICAgICAgXG4gICAgICAgIEBpbml0R2xvYmFsKClcbiAgICAgICAgICAgIFxuICAgICAgICB3b3JsZCA9IG5ldyBXb3JsZCB2aWV3XG4gICAgICAgIHdvcmxkLm5hbWUgPSAnd29ybGQnXG4gICAgICAgIGluZGV4ID0gcHJlZnMuZ2V0ICdsZXZlbCcgMFxuICAgICAgICB3b3JsZC5jcmVhdGUgQGxldmVscy5saXN0W2luZGV4XVxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9LCBzaG93TmFtZT10cnVlKSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIEBsZXZlbF9uYW1lXG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBwcmVmcy5zZXQgJ2xldmVsJyBAbGV2ZWxfaW5kZXhcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIldvcmxkLmNyZWF0ZSAje0BsZXZlbF9pbmRleH0gc2l6ZTogI3tuZXcgUG9zKEBkaWN0W1wic2l6ZVwiXSkuc3RyKCl9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gJyN7QGxldmVsX25hbWV9JyBzY2hlbWU6ICcje0BkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J30nXCJcblxuICAgICAgICBAY3JlYXRpbmcgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFNpemUgQGRpY3Quc2l6ZSAjIHRoaXMgcmVtb3ZlcyBhbGwgb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQGFwcGx5U2NoZW1lIEBkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3IGFuZCBzaG93TmFtZVxuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKS5taW51cyBAcGxheWVyLmRpcmVjdGlvblxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLkZPTExPV1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGFwcGx5U2NoZW1lOiAoc2NoZW1lKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgY29sb3JzID0gXy5jbG9uZSBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgb3BhY2l0eSA9XG4gICAgICAgICAgICBzdG9uZTogMC43XG4gICAgICAgICAgICBib21iOiAgMC45XG4gICAgICAgICAgICB0ZXh0OiAgMFxuICAgICAgICAgICAgXG4gICAgICAgIHNoaW5pbmVzcyA9IFxuICAgICAgICAgICAgdGlyZTogICA0XG4gICAgICAgICAgICBwbGF0ZTogIDEwXG4gICAgICAgICAgICByYXN0ZXI6IDIwXG4gICAgICAgICAgICB3YWxsOiAgIDIwXG4gICAgICAgICAgICBzdG9uZTogIDIwXG4gICAgICAgICAgICBnZWFyOiAgIDIwXG4gICAgICAgICAgICB0ZXh0OiAgIDIwMFxuICAgICAgICAgICAgXG4gICAgICAgIGNvbG9ycy5wbGF0ZS5lbWlzc2l2ZSAgID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSAgICAgICAgICAgICA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciAgICAgICA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyICAgICAgICAgICA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciAgICAgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy53YWxsICAgICAgICAgICAgID89IHt9XG4gICAgICAgIGNvbG9ycy53YWxsLmNvbG9yICAgICAgID89IG5ldyBUSFJFRS5Db2xvcihjb2xvcnMucGxhdGUuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuNlxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yICA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBjb2xvcnMuaGVscCAgICAgICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMuaGVscC5jb2xvciAgICAgICA/PSBjb2xvcnMudGV4dC5jb2xvclxuICAgICAgICBcbiAgICAgICAgZm9yIGssdiBvZiBjb2xvcnNcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIFxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgQGVuYWJsZVNoYWRvd3MgdHJ1ZSBpZiBsaWdodC5zaGFkb3dcbiAgICAgICAgXG4gICAgcmVtb3ZlTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgXG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBsaWdodFxuICAgICAgICBcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICAgICAgXG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHNoYWRvd1xuXG4gICAgZW5hYmxlU2hhZG93czogKGVuYWJsZSkgLT5cbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBcbiAgICAgICAgcHJlZnMuc2V0IFwic29sdmVk4pa4I3tXb3JsZC5sZXZlbHMubGlzdFt3b3JsZC5sZXZlbF9pbmRleF19XCIgdHJ1ZVxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgXG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMga2xvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gaW52YWxpZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKVxuICAgICAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgPSBjZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50LnRpbWUgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCB0aW1lOlwiLCBvY2N1cGFudC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5kZWwoKSAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBhbnl3YXkgLiBkZWxldGUgaXRcbiAgICAgICAgXG4gICAgICAgIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiBub3QgY2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4KHBvcylcbiAgICAgICAgICAgIGNlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IGNlbGxcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5zZXRQb3NpdGlvbiBwb3NcbiAgICAgICAgY2VsbC5hZGRPYmplY3Qgb2JqZWN0XG5cbiAgICB1bnNldE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgcG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgY2VsbC5yZW1vdmVPYmplY3Qgb2JqZWN0XG4gICAgICAgICAgICBpZiBjZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSA9IG51bGxcbiAgICAgICAgIyBlbHNlIFxuICAgICAgICAgICAgIyBrbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBvYmplY3RzLCBvYmplY3RcbiAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAtPlxuICAgICAgICBcbiAgICAgICAgVGltZXIucmVtb3ZlQWxsQWN0aW9ucygpXG5cbiAgICAgICAgIyBrbG9nICcrJyBAcmVuZGVyZXIuaW5mby5tZW1vcnkuZ2VvbWV0cmllcywgQHJlbmRlcmVyLmluZm8ubWVtb3J5LnRleHR1cmVzLCAnb2JqZWN0cycgQG9iamVjdHMubGVuZ3RoLCBAbGlnaHRzLmxlbmd0aFxuXG4gICAgICAgIEBlbmFibGVTaGFkb3dzIGZhbHNlXG4gICAgICAgIFxuICAgICAgICBpZiBAcGxheWVyP1xuICAgICAgICAgICAgQHBsYXllci5kZWwoKVxuICAgICAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBAb2JqZWN0c1stMV0uZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBvYmplY3Qgbm8gYXV0byByZW1vdmUgI3tsYXN0KEBvYmplY3RzKS5uYW1lfVwiXG4gICAgICAgICAgICAgICAgQG9iamVjdHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgQGxpZ2h0c1stMV0uZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIGxpZ2h0IG5vIGF1dG8gcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBAbGlnaHRzLnBvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyBrbG9nICctJyBAcmVuZGVyZXIuaW5mby5tZW1vcnkuZ2VvbWV0cmllcywgQHJlbmRlcmVyLmluZm8ubWVtb3J5LnRleHR1cmVzXG4gICAgXG4gICAgZGVsZXRlT2JqZWN0c1dpdGhDbGFzc05hbWU6IChjbGFzc05hbWUpIC0+XG4gICAgICAgIFxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIFxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0TmFtZSA9PSBvLm5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICBrZXJyb3IgXCJXb3JsZC5nZXRPYmplY3RXaXRoTmFtZSBbV0FSTklOR10gbm8gb2JqZWN0IHdpdGggbmFtZSAje29iamVjdE5hbWV9XCJcbiAgICAgICAgbnVsbFxuICAgIFxuICAgIHNldENhbWVyYU1vZGU6IChtb2RlKSAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gY2xhbXAgQ2FtZXJhLklOU0lERSwgQ2FtZXJhLkZPTExPVywgbW9kZVxuICAgIFxuICAgIGNoYW5nZUNhbWVyYU1vZGU6IC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSAoQHBsYXllci5jYW1lcmEubW9kZSsxKSAlIChDYW1lcmEuRk9MTE9XKzEpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG9iamVjdFdpbGxNb3ZlVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgb2xkIHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHNvdXJjZVBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSAtZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHNvdXJjZVBvcyBcblxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgc291cmNlQ2VsbCA9IEBnZXRDZWxsQXRQb3Mgc291cmNlUG9zXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gc291cmNlQ2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG5cbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gdGFyZ2V0Q2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQGlzT2NjdXBpZWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBvY2N1cGllZCB0YXJnZXQgcG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgJ25vIHNvdXJjZUNlbGw/J1xuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zICAgIFxuICAgICAgICBpZiBub3QgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4IHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRhcmdldENlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IHRhcmdldENlbGxcblxuICAgICAgICBpZiB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgdGFyZ2V0Q2VsbC5hZGRPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gbm8gdGFyZ2V0IGNlbGw/XCJcbiAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICAgICAgXG4gICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLnN0ZXAoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICBcbiAgICAgICAgVGltZXIudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLmNsZWFyIHRydWUgdHJ1ZSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllciBcbiAgICAgICAgICAgIEBzdGVwUGxheWVyKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEByZW5kZXJlci5zZXRWaWV3cG9ydCAwLCAwLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4yNSlcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5jbGVhckRlcHRoKClcbiAgICAgICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEB0ZXh0LnNjZW5lLCBAdGV4dC5jYW1lcmEgaWYgQHRleHRcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAbWVudS5zY2VuZSwgQG1lbnUuY2FtZXJhIGlmIEBtZW51XG5cbiAgICBzdGVwUGxheWVyOiAtPlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5jYW0uYXNwZWN0ID0gQHNjcmVlblNpemUudyAvIChAc2NyZWVuU2l6ZS5oKjAuNjYpXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnN0ZXAoKVxuXG4gICAgICAgIFNvdW5kLnNldE1hdHJpeCBAcGxheWVyLmNhbWVyYVxuICAgICAgICAgICAgXG4gICAgICAgIEBwbGF5ZXIuc2V0T3BhY2l0eSBjbGFtcCAwLCAxLCBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpLm1pbnVzKEBwbGF5ZXIuY3VycmVudF9wb3NpdGlvbikubGVuZ3RoKCktMC40XG4gICAgICAgIFxuICAgICAgICBzdG9uZXMgPSBbXVxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbyBpbnN0YW5jZW9mIFN0b25lXG4gICAgICAgICAgICAgICAgc3RvbmVzLnB1c2ggb1xuICAgICAgICBzdG9uZXMuc29ydCAoYSxiKSA9PiBiLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpIC0gYS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICBcbiAgICAgICAgb3JkZXIgPSAxMDBcbiAgICAgICAgZm9yIHN0b25lIGluIHN0b25lc1xuICAgICAgICAgICAgc3RvbmUubWVzaC5yZW5kZXJPcmRlciA9IG9yZGVyXG4gICAgICAgICAgICBvcmRlciArPSAxXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICBkID0gc3RvbmUucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgICAgIGlmIGQgPCAxLjBcbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSBpZiBub3Qgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gMC4yICsgZCAqIDAuNVxuICAgICAgICAgICAgZWxzZSBpZiBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICBcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmNhbS5wb3NpdGlvblxuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuMzQpLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC42NilcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBAcGxheWVyLmNhbWVyYS5jYW1cbiAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBnZXRUaW1lOiAtPiBub3coKS50b0ZpeGVkIDBcbiAgICBzZXRTcGVlZDogKHMpIC0+IEBzcGVlZCA9IHNcbiAgICBnZXRTcGVlZDogLT4gQHNwZWVkXG4gICAgbWFwTXNUaW1lOiAgKHVubWFwcGVkKSAtPiBwYXJzZUludCAxMC4wICogdW5tYXBwZWQvQHNwZWVkXG4gICAgdW5tYXBNc1RpbWU6IChtYXBwZWQpIC0+IHBhcnNlSW50IG1hcHBlZCAqIEBzcGVlZC8xMC4wXG4gICAgICAgIFxuICAgIGNvbnRpbnVvdXM6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcImNvbnRpbnVvdXNcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLkNPTlRJTlVPVVNcblxuICAgIG9uY2U6IChjYikgLT5cbiAgICAgICAgbmV3IEFjdGlvbiBcbiAgICAgICAgICAgIGZ1bmM6IGNiXG4gICAgICAgICAgICBuYW1lOiBcIm9uY2VcIlxuICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIHJlc2l6ZWQ6ICh3LGgpID0+XG4gICAgICAgIFxuICAgICAgICBAYXNwZWN0ID0gdy9oXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgdyxoXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICAgICAgY2FtZXJhPy5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIGNhbWVyYT8udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIEByZW5kZXJlcj8uc2V0U2l6ZSB3LGhcbiAgICAgICAgQHRleHQ/LnJlc2l6ZWQgdyxoXG4gICAgICAgIEBtZW51Py5yZXNpemVkIHcsaFxuICAgICAgICBcbiAgICAgICAgQGxldmVsU2VsZWN0aW9uPy5yZXNpemVkIHcsaFxuXG4gICAgZ2V0TmVhcmVzdFZhbGlkUG9zOiAocG9zKSAtPlxuICAgICAgICBuZXcgUG9zIE1hdGgubWluKEBzaXplLngtMSwgTWF0aC5tYXgocG9zLngsIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUueS0xLCBNYXRoLm1heChwb3MueSwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS56LTEsIE1hdGgubWF4KHBvcy56LCAwKSlcbiAgICBcbiAgICBpc1Vub2NjdXBpZWRQb3M6IChwb3MpIC0+IG5vdCBAaXNPY2N1cGllZFBvcyBwb3NcbiAgICBpc09jY3VwaWVkUG9zOiAgIChwb3MpIC0+ICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGlmIEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICBtYXlPYmplY3RQdXNoVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG5cbiAgICAgICAgIyByZXR1cm5zIHRydWUsIGlmIGEgcHVzaGFibGUgb2JqZWN0IGlzIGF0IHBvcyBhbmQgbWF5IGJlIHB1c2hlZFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGRpcmVjdGlvbiA9IHBvcy5taW51cyBvYmplY3QuZ2V0UG9zKCkgIyBkaXJlY3Rpb24gZnJvbSBvYmplY3QgdG8gcHVzaGFibGUgb2JqZWN0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgXG4gICAgICAgIG9iamVjdEF0TmV3UG9zID0gQGdldE9jY3VwYW50QXRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIGlmIG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgIHRtcE9iamVjdCA9IG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgdG1wT2JqZWN0LnRpbWUgPCAwIGFuZCAtdG1wT2JqZWN0LnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAtPiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgXG4gICAgICAgIHB1c2hhYmxlT2JqZWN0ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG5cbiAgICAgICAgaWYgcHVzaGFibGVPYmplY3Q/IGFuZCBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIFB1c2hhYmxlXG4gICAgICAgICAgICBwdXNoYWJsZU9iamVjdC5wdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uIG9iamVjdCwgZGlyZWN0aW9uLCBkdXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICBcbiAgICAgICAgZmFsc2VcbiAgICBcbiAgICAjIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwIFxuICAgIFxuICAgIHNob3dNZW51OiAtPlxuXG4gICAgICAgIGlmIEBoZWxwU2hvd24gdGhlbiByZXR1cm4gQHRvZ2dsZUhlbHAoKVxuICAgICAgICBcbiAgICAgICAgQHRleHQ/LmRlbCgpXG4gICAgICAgIEBtZW51ID0gbmV3IE1lbnUoKVxuICAgICAgICBAbWVudS5hZGRJdGVtICdsb2FkJyAgIEBzaG93TGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgQG1lbnUuYWRkSXRlbSAncmVzZXQnICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnY29uZmlnJyA9PiBAbWVudSA9IG5ldyBDb25maWdcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnaGVscCcgICBAc2hvd0hlbHBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAncXVpdCcgICAtPiBwb3N0LnRvTWFpbiAncXVpdEFwcCdcbiAgICAgICAgQG1lbnUuc2hvdygpXG4gICAgXG4gICAgc2hvd0xldmVsU2VsZWN0aW9uOiA9PiBcbiAgICBcbiAgICAgICAgQGxldmVsU2VsZWN0aW9uID0gbmV3IExldmVsU2VsIEBcbiAgICBcbiAgICBzaG93SGVscDogPT5cbiAgICAgICAgXG4gICAgICAgIEBoZWxwU2hvd24gPSB0cnVlXG4gICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXSwgTWF0ZXJpYWwuaGVscFxuICAgICAgICBcbiAgICB0b2dnbGVIZWxwOiAtPlxuICAgICAgICBcbiAgICAgICAgQGhlbHBTaG93biA9IG5vdCBAaGVscFNob3duXG4gICAgICAgIGlmIEBoZWxwU2hvd25cbiAgICAgICAgICAgIEBzaG93SGVscCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB0ZXh0Py5kZWwoKVxuICAgICAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgXG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnaHQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24ubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDgsIEBzcGVlZCsxOyBwcmVmcy5zZXQgJ3NwZWVkJyBAc3BlZWQtM1xuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCA0LCBAc3BlZWQtMTsgcHJlZnMuc2V0ICdzcGVlZCcgQHNwZWVkLTNcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuICAgICAgICAgICAgd2hlbiAnaCcgdGhlbiBAdG9nZ2xlSGVscCgpXG4gICAgICAgICAgICB3aGVuICdsJyB0aGVuIEBzaG93TGV2ZWxTZWxlY3Rpb24oKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAY3JlYXRlIFdvcmxkLmxldmVscy5saXN0WyhAbGV2ZWxfaW5kZXgrMSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhdXG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee