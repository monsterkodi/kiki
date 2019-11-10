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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QyxDQUFBLE9BQUQsQ0FBQTtBQUpsQixpQkFLUyxHQUxUO3VCQUtrQixJQUFDLENBQUEsVUFBRCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxrQkFBRCxDQUFBO0FBTmxCLGlCQU9TLEdBUFQ7dUJBT2tCLElBQUMsQ0FBQSxNQUFELENBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFLLENBQUEsQ0FBQyxJQUFDLENBQUEsV0FBRCxHQUFhLENBQWQsQ0FBQSxHQUFtQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFyQyxDQUExQjtBQVBsQjtJQVprQjs7b0JBcUJ0QixrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtBQUVoQixZQUFBO1FBQUEsSUFBVSxJQUFDLENBQUEsY0FBWDtBQUFBLG1CQUFBOztRQUNBLHVDQUFpQixDQUFFLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLFVBQVY7QUFBQTs7SUFIZ0I7Ozs7R0F4MUJKOztBQTYxQnBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgXG4jICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgXG5cbnsgcG9zdCwgcmFuZEludCwgY29sb3JzLCBhYnNNaW4sIHByZWZzLCBjbGFtcCwgbGFzdCwga2Vycm9yLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuU2l6ZSAgICAgICAgPSByZXF1aXJlICcuL2xpYi9zaXplJ1xuQ2VsbCAgICAgICAgPSByZXF1aXJlICcuL2NlbGwnXG5HYXRlICAgICAgICA9IHJlcXVpcmUgJy4vZ2F0ZSdcbkNhbWVyYSAgICAgID0gcmVxdWlyZSAnLi9jYW1lcmEnXG5MaWdodCAgICAgICA9IHJlcXVpcmUgJy4vbGlnaHQnXG5MZXZlbHMgICAgICA9IHJlcXVpcmUgJy4vbGV2ZWxzJ1xuUGxheWVyICAgICAgPSByZXF1aXJlICcuL3BsYXllcidcblNvdW5kICAgICAgID0gcmVxdWlyZSAnLi9zb3VuZCdcbkNhZ2UgICAgICAgID0gcmVxdWlyZSAnLi9jYWdlJ1xuVGltZXIgICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQWN0b3IgICAgICAgPSByZXF1aXJlICcuL2FjdG9yJ1xuSXRlbSAgICAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5BY3Rpb24gICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5Db25maWcgICAgICA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZS5ub3dcbkxldmVsU2VsICAgID0gcmVxdWlyZSAnLi9sZXZlbHNlbGVjdGlvbidcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBAOiAoQHZpZXcsIEBwcmV2aWV3KSAtPlxuICAgICAgICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAXG4gICAgICAgIFxuICAgICAgICBAc3BlZWQgICAgICA9IDYgKyAocHJlZnMuZ2V0ICdzcGVlZCcgMykgLSAzXG4gICAgICAgIFxuICAgICAgICBAcmFzdGVyU2l6ZSA9IDAuMDVcblxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQG5vUm90YXRpb25zID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgYW50aWFsaWFzOnRydWUsIHByZWNpc2lvbjonaGlnaHAnXG5cbiAgICAgICAgQHJlbmRlcmVyLnNldFNpemUgQHZpZXcub2Zmc2V0V2lkdGgsIEB2aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyID0gZmFsc2VcbiAgICAgICAgQHJlbmRlcmVyLnNvcnRPYmplY3RzID0gdHJ1ZVxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXJlci5kb21FbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiAgICAgICAgIyAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuICAgICAgICBAc3VuID0gbmV3IFRIUkVFLlBvaW50TGlnaHQgMHhmZmZmZmZcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkgaWYgQHBsYXllcj9cbiAgICAgICAgQHNjZW5lLmFkZCBAc3VuXG4gICAgICAgIFxuICAgICAgICBAYW1iaWVudCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQgMHgxMTExMTFcbiAgICAgICAgQHNjZW5lLmFkZCBAYW1iaWVudFxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgQG9iamVjdHMgPSBbXVxuICAgICAgICBAbGlnaHRzICA9IFtdXG4gICAgICAgIEBjZWxscyAgID0gW10gXG4gICAgICAgIEBzaXplICAgID0gbmV3IFBvcygpXG4gICAgICAgIEBkZXB0aCAgID0gLU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICAgIFxuICAgICAgICBAdGltZXIgPSBuZXcgVGltZXIgQCAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICBcbiAgICBAaW5pdDogKHZpZXcpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgd29ybGQ/XG4gICAgICAgIFxuICAgICAgICBAaW5pdEdsb2JhbCgpXG4gICAgICAgICAgICBcbiAgICAgICAgd29ybGQgPSBuZXcgV29ybGQgdmlld1xuICAgICAgICB3b3JsZC5uYW1lID0gJ3dvcmxkJ1xuICAgICAgICBpbmRleCA9IHByZWZzLmdldCAnbGV2ZWwnIDBcbiAgICAgICAgd29ybGQuY3JlYXRlIEBsZXZlbHMubGlzdFtpbmRleF1cbiAgICAgICAgd29ybGRcbiAgICAgICAgXG4gICAgQGluaXRHbG9iYWw6ICgpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVscz9cbiAgICAgICAgICBcbiAgICAgICAgU2NyZWVuVGV4dC5pbml0KClcbiAgICAgICAgU291bmQuaW5pdCgpXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwucm90MCAgICA9IFF1YXRlcm5pb24ucm90XzBcbiAgICAgICAgZ2xvYmFsLnJvdHg5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWVxuICAgICAgICBnbG9iYWwucm90ejkwICA9IFF1YXRlcm5pb24ucm90XzkwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWFxuICAgICAgICBnbG9iYWwucm90eTE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWFxuICAgICAgICBnbG9iYWwucm90eTI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1pcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5YdXBZICAgICAgICA9IFF1YXRlcm5pb24uWHVwWVxuICAgICAgICBnbG9iYWwuWHVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFpcbiAgICAgICAgZ2xvYmFsLlhkb3duWSAgICAgID0gUXVhdGVybmlvbi5YZG93bllcbiAgICAgICAgZ2xvYmFsLlhkb3duWiAgICAgID0gUXVhdGVybmlvbi5YZG93blpcbiAgICAgICAgZ2xvYmFsLll1cFggICAgICAgID0gUXVhdGVybmlvbi5ZdXBYXG4gICAgICAgIGdsb2JhbC5ZdXBaICAgICAgICA9IFF1YXRlcm5pb24uWXVwWlxuICAgICAgICBnbG9iYWwuWWRvd25YICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWFxuICAgICAgICBnbG9iYWwuWWRvd25aICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWlxuICAgICAgICBnbG9iYWwuWnVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFhcbiAgICAgICAgZ2xvYmFsLlp1cFkgICAgICAgID0gUXVhdGVybmlvbi5adXBZXG4gICAgICAgIGdsb2JhbC5aZG93blggICAgICA9IFF1YXRlcm5pb24uWmRvd25YXG4gICAgICAgIGdsb2JhbC5aZG93blkgICAgICA9IFF1YXRlcm5pb24uWmRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFkgICA9IFF1YXRlcm5pb24ubWludXNYdXBZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFogICA9IFF1YXRlcm5pb24ubWludXNYdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWSA9IFF1YXRlcm5pb24ubWludXNYZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25aID0gUXVhdGVybmlvbi5taW51c1hkb3duWlxuICAgICAgICBnbG9iYWwubWludXNZdXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWFxuICAgICAgICBnbG9iYWwubWludXNZdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWlxuICAgICAgICBnbG9iYWwubWludXNZZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWiA9IFF1YXRlcm5pb24ubWludXNZZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWCAgID0gUXVhdGVybmlvbi5taW51c1p1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWSAgID0gUXVhdGVybmlvbi5taW51c1p1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25YID0gUXVhdGVybmlvbi5taW51c1pkb3duWFxuICAgICAgICBnbG9iYWwubWludXNaZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25ZXG5cbiAgICAgICAgQGxldmVscyA9IG5ldyBMZXZlbHNcbiAgICAgICAgXG4gICAgZGVsOiAtPlxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLmRvbUVsZW1lbnQucmVtb3ZlKClcbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGNyZWF0ZTogKHdvcmxkRGljdD17fSwgc2hvd05hbWU9dHJ1ZSkgLT4gIyBjcmVhdGVzIHRoZSB3b3JsZCBmcm9tIGEgbGV2ZWwgbmFtZSBvciBhIGRpY3Rpb25hcnlcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLmNyZWF0ZVwiIHdvcmxkRGljdFxuICAgICAgICBcbiAgICAgICAgaWYgd29ybGREaWN0XG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGRpY3QgPSBXb3JsZC5sZXZlbHMuZGljdFt3b3JsZERpY3RdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3QubmFtZVxuICAgICAgICAgICAgICAgIEBkaWN0ID0gd29ybGREaWN0XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBsZXZlbF9pbmRleCA9IFdvcmxkLmxldmVscy5saXN0LmluZGV4T2YgQGxldmVsX25hbWVcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlld1xuICAgICAgICAgICAgcHJlZnMuc2V0ICdsZXZlbCcgQGxldmVsX2luZGV4XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJXb3JsZC5jcmVhdGUgI3tAbGV2ZWxfaW5kZXh9IHNpemU6ICN7bmV3IFBvcyhAZGljdFtcInNpemVcIl0pLnN0cigpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICcje0BsZXZlbF9uYW1lfScgc2NoZW1lOiAnI3tAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCd9J1wiXG5cbiAgICAgICAgQGNyZWF0aW5nID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBzZXRTaXplIEBkaWN0LnNpemUgIyB0aGlzIHJlbW92ZXMgYWxsIG9iamVjdHNcbiAgICAgICAgXG4gICAgICAgIEBhcHBseVNjaGVtZSBAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcbiAgICAgICAgXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGludHJvIHRleHQgICBcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlldyBhbmQgc2hvd05hbWVcbiAgICAgICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3QubmFtZVxuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXhpdHNcblxuICAgICAgICBpZiBAZGljdC5leGl0cz9cbiAgICAgICAgICAgIGV4aXRfaWQgPSAwXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gQGRpY3QuZXhpdHNcbiAgICAgICAgICAgICAgICBleGl0X2dhdGUgPSBuZXcgR2F0ZSBlbnRyeVtcImFjdGl2ZVwiXVxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5uYW1lID0gZW50cnlbXCJuYW1lXCJdID8gXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgIEFjdGlvbi5pZCA/PSAwXG4gICAgICAgICAgICAgICAgZXhpdEFjdGlvbiA9IG5ldyBBY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgIEFjdGlvbi5pZFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBAZXhpdExldmVsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5nZXRFdmVudFdpdGhOYW1lKFwiZW50ZXJcIikuYWRkQWN0aW9uIGV4aXRBY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBlbnRyeS5wb3NpdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gQGRlY2VudGVyIGVudHJ5LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlbnRyeS5jb29yZGluYXRlcz9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV3IFBvcyBlbnRyeS5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBleGl0X2dhdGUsIHBvc1xuICAgICAgICAgICAgICAgIGV4aXRfaWQgKz0gMVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNyZWF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QuY3JlYXRlP1xuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIEBkaWN0LmNyZWF0ZVxuICAgICAgICAgICAgICAgIEBkaWN0LmNyZWF0ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAga2xvZyBcIldvcmxkLmNyZWF0ZSBbV0FSTklOR10gQGRpY3QuY3JlYXRlIG5vdCBhIGZ1bmN0aW9uIVwiXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gcGxheWVyXG5cbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXJcblxuICAgICAgICBAcGxheWVyLnNldE9yaWVudGF0aW9uIEBkaWN0LnBsYXllci5vcmllbnRhdGlvbiA/IHJvdHg5MFxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRPcmllbnRhdGlvbiBAcGxheWVyLm9yaWVudGF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QucGxheWVyLnBvc2l0aW9uP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIEBkZWNlbnRlciBAZGljdC5wbGF5ZXIucG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgbmV3IFBvcyBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXNcblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKCkubWludXMgQHBsYXllci5kaXJlY3Rpb25cbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5GT0xMT1dcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5JTlNJREUgaWYgQGRpY3QuY2FtZXJhID09ICdpbnNpZGUnXG4gICAgICAgIFxuICAgICAgICBAY3JlYXRpbmcgPSBmYWxzZVxuICAgIFxuICAgIHJlc3RhcnQ6ID0+IEBjcmVhdGUgQGRpY3RcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBhcHBseVNjaGVtZTogKHNjaGVtZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgY29sb3JzID0gXy5jbG9uZSBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgb3BhY2l0eSA9XG4gICAgICAgICAgICBzdG9uZTogMC43XG4gICAgICAgICAgICBib21iOiAgMC45XG4gICAgICAgICAgICB0ZXh0OiAgMFxuICAgICAgICAgICAgXG4gICAgICAgIHNoaW5pbmVzcyA9IFxuICAgICAgICAgICAgdGlyZTogICA0XG4gICAgICAgICAgICBwbGF0ZTogIDEwXG4gICAgICAgICAgICByYXN0ZXI6IDIwXG4gICAgICAgICAgICB3YWxsOiAgIDIwXG4gICAgICAgICAgICBzdG9uZTogIDIwXG4gICAgICAgICAgICBnZWFyOiAgIDIwXG4gICAgICAgICAgICB0ZXh0OiAgIDIwMFxuICAgICAgICAgICAgXG4gICAgICAgIGNvbG9ycy5wbGF0ZS5lbWlzc2l2ZSAgID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSAgICAgICAgICAgICA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciAgICAgICA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyICAgICAgICAgICA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciAgICAgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy53YWxsICAgICAgICAgICAgID89IHt9XG4gICAgICAgIGNvbG9ycy53YWxsLmNvbG9yICAgICAgID89IG5ldyBUSFJFRS5Db2xvcihjb2xvcnMucGxhdGUuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuNlxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yICA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBjb2xvcnMuaGVscCAgICAgICAgICAgICA/PSB7fVxuICAgICAgICBjb2xvcnMuaGVscC5jb2xvciAgICAgICA/PSBjb2xvcnMudGV4dC5jb2xvclxuICAgICAgICBcbiAgICAgICAgZm9yIGssdiBvZiBjb2xvcnNcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIEBsaWdodHMucHVzaCBsaWdodFxuICAgICAgICBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgbGlnaHRcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICBAZW5hYmxlU2hhZG93cyBzaGFkb3dcblxuICAgIGVuYWJsZVNoYWRvd3M6IChlbmFibGUpIC0+XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBcbiAgICAgICAgcHJlZnMuc2V0IFwic29sdmVk4pa4I3tXb3JsZC5sZXZlbHMubGlzdFt3b3JsZC5sZXZlbF9pbmRleF19XCIgdHJ1ZVxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgXG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMga2xvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gaW52YWxpZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKVxuICAgICAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgPSBjZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50LnRpbWUgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCB0aW1lOlwiLCBvY2N1cGFudC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5kZWwoKSAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBhbnl3YXkgLiBkZWxldGUgaXRcbiAgICAgICAgXG4gICAgICAgIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiBub3QgY2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4KHBvcylcbiAgICAgICAgICAgIGNlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IGNlbGxcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5zZXRQb3NpdGlvbiBwb3NcbiAgICAgICAgY2VsbC5hZGRPYmplY3Qgb2JqZWN0XG5cbiAgICB1bnNldE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgcG9zID0gb2JqZWN0LmdldFBvcygpXG4gICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgY2VsbC5yZW1vdmVPYmplY3Qgb2JqZWN0XG4gICAgICAgICAgICBpZiBjZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSA9IG51bGxcbiAgICAgICAgIyBlbHNlIFxuICAgICAgICAgICAgIyBrbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBvYmplY3RzLCBvYmplY3RcbiAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAbGlnaHRzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgbGlnaHQgbm8gYXV0byByZW1vdmVcIlxuICAgICAgICAgICAgICAgIEBsaWdodHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBvYmplY3RzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIG9iamVjdCBubyBhdXRvIHJlbW92ZSAje2xhc3QoQG9iamVjdHMpLm5hbWV9XCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0cy5wb3AoKVxuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3ROYW1lID09IG8ubmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgIGtlcnJvciBcIldvcmxkLmdldE9iamVjdFdpdGhOYW1lIFtXQVJOSU5HXSBubyBvYmplY3Qgd2l0aCBuYW1lICN7b2JqZWN0TmFtZX1cIlxuICAgICAgICBudWxsXG4gICAgXG4gICAgc2V0Q2FtZXJhTW9kZTogKG1vZGUpIC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSBjbGFtcCBDYW1lcmEuSU5TSURFLCBDYW1lcmEuRk9MTE9XLCBtb2RlXG4gICAgXG4gICAgY2hhbmdlQ2FtZXJhTW9kZTogLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IChAcGxheWVyLmNhbWVyYS5tb2RlKzEpICUgKENhbWVyYS5GT0xMT1crMSlcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgb2JqZWN0V2lsbE1vdmVUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgc291cmNlUG9zLmVxbCB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGVxdWFsIHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiB0YXJnZXRDZWxsXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyA9IHRhcmdldENlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zLnRpbWUgPCAwIGFuZCAtb2JqZWN0QXROZXdQb3MudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXROZXdQb3MuZGVsKClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gdGltaW5nIGNvbmZsaWN0IGF0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBhbHJlYWR5IG9jY3VwaWVkOlwiLCB0YXJnZXRQb3MgXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5uYW1lICE9ICdwbGF5ZXInXG4gICAgICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0ICMgcmVtb3ZlIG9iamVjdCBmcm9tIGNlbGwgZ3JpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBvbGQgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IC1kdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgc291cmNlUG9zIFxuXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBuZXcgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSBkdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgdGFyZ2V0UG9zIFxuXG4gICAgb2JqZWN0TW92ZWQ6IChtb3ZlZE9iamVjdCwgZnJvbSwgdG8pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBuZXcgUG9zIGZyb21cbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyB0b1xuXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBzb3VyY2VDZWxsID0gQGdldENlbGxBdFBvcyBzb3VyY2VQb3NcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiB0bXBPYmplY3QgPSBzb3VyY2VDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcblxuICAgICAgICBpZiB0bXBPYmplY3QgPSB0YXJnZXRDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAaXNPY2N1cGllZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG9jY3VwaWVkIHRhcmdldCBwb3M6XCIgdGFyZ2V0UG9zXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc291cmNlQ2VsbD9cbiAgICAgICAgICAgIHNvdXJjZUNlbGwucmVtb3ZlT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBpZiBzb3VyY2VDZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChzb3VyY2VQb3MpXSA9IG51bGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2xvZyAnbm8gc291cmNlQ2VsbD8nXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3MgICAgXG4gICAgICAgIGlmIG5vdCB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXggdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gdGFyZ2V0Q2VsbFxuXG4gICAgICAgIGlmIHRhcmdldENlbGw/XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmFkZE9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBubyB0YXJnZXQgY2VsbD9cIlxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAgICBcbiAgICBcbiAgICBzdGVwOiAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24uc3RlcCgpXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICBcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgIFxuICAgICAgICBUaW1lci50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIFRpbWVyLmZpbmlzaEFjdGlvbnMoKVxuICAgICAgICBcbiAgICAgICAgby5zdGVwPygpIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuY2xlYXIgdHJ1ZSB0cnVlIHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAcGxheWVyIFxuICAgICAgICAgICAgQHN0ZXBQbGF5ZXIoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHJlbmRlcmVyLnNldFZpZXdwb3J0IDAsIDAsIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IoQHNjcmVlblNpemUuaCowLjI1KVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLmNsZWFyRGVwdGgoKVxuICAgICAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHRleHQuc2NlbmUsIEB0ZXh0LmNhbWVyYSBpZiBAdGV4dFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEBtZW51LnNjZW5lLCBAbWVudS5jYW1lcmEgaWYgQG1lbnVcblxuICAgIHN0ZXBQbGF5ZXI6IC0+XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLmNhbS5hc3BlY3QgPSBAc2NyZWVuU2l6ZS53IC8gKEBzY3JlZW5TaXplLmgqMC42NilcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc3RlcCgpXG5cbiAgICAgICAgU291bmQuc2V0TWF0cml4IEBwbGF5ZXIuY2FtZXJhXG4gICAgICAgICAgICBcbiAgICAgICAgQHBsYXllci5zZXRPcGFjaXR5IGNsYW1wIDAsIDEsIEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkubWludXMoQHBsYXllci5jdXJyZW50X3Bvc2l0aW9uKS5sZW5ndGgoKS0wLjRcbiAgICAgICAgXG4gICAgICAgIHN0b25lcyA9IFtdXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvIGluc3RhbmNlb2YgU3RvbmVcbiAgICAgICAgICAgICAgICBzdG9uZXMucHVzaCBvXG4gICAgICAgIHN0b25lcy5zb3J0IChhLGIpID0+IGIucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKCkgLSBhLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpXG4gICAgICAgIFxuICAgICAgICBvcmRlciA9IDEwMFxuICAgICAgICBmb3Igc3RvbmUgaW4gc3RvbmVzXG4gICAgICAgICAgICBzdG9uZS5tZXNoLnJlbmRlck9yZGVyID0gb3JkZXJcbiAgICAgICAgICAgIG9yZGVyICs9IDFcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGQgPSBzdG9uZS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICAgICAgaWYgZCA8IDEuMFxuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5IGlmIG5vdCBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjIgKyBkICogMC41XG4gICAgICAgICAgICBlbHNlIGlmIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgIFxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuY2FtLnBvc2l0aW9uXG5cbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEByZW5kZXJlci5zZXRWaWV3cG9ydCAwLCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4zNCksIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IoQHNjcmVlblNpemUuaCowLjY2KVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAc2NlbmUsIEBwbGF5ZXIuY2FtZXJhLmNhbVxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgPT5cbiAgICAgICAgXG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgICAgICBjYW1lcmE/LmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgY2FtZXJhPy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgQHJlbmRlcmVyPy5zZXRTaXplIHcsaFxuICAgICAgICBAdGV4dD8ucmVzaXplZCB3LGhcbiAgICAgICAgQG1lbnU/LnJlc2l6ZWQgdyxoXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxTZWxlY3Rpb24/LnJlc2l6ZWQgdyxoXG5cbiAgICBnZXROZWFyZXN0VmFsaWRQb3M6IChwb3MpIC0+XG4gICAgICAgIG5ldyBQb3MgTWF0aC5taW4oQHNpemUueC0xLCBNYXRoLm1heChwb3MueCwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS55LTEsIE1hdGgubWF4KHBvcy55LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnotMSwgTWF0aC5tYXgocG9zLnosIDApKVxuICAgIFxuICAgIGlzVW5vY2N1cGllZFBvczogKHBvcykgLT4gbm90IEBpc09jY3VwaWVkUG9zIHBvc1xuICAgIGlzT2NjdXBpZWRQb3M6ICAgKHBvcykgLT4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cblxuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcblxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGVcbiAgICAgICAgICAgIHB1c2hhYmxlT2JqZWN0LnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gb2JqZWN0LCBkaXJlY3Rpb24sIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgICAgICBmYWxzZVxuICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2hvd01lbnU6IC0+XG5cbiAgICAgICAgaWYgQGhlbHBTaG93biB0aGVuIHJldHVybiBAdG9nZ2xlSGVscCgpXG4gICAgICAgIFxuICAgICAgICBAdGV4dD8uZGVsKClcbiAgICAgICAgQG1lbnUgPSBuZXcgTWVudSgpXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ2xvYWQnICAgQHNob3dMZXZlbFNlbGVjdGlvblxuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXNldCcgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtICdjb25maWcnID0+IEBtZW51ID0gbmV3IENvbmZpZ1xuICAgICAgICBAbWVudS5hZGRJdGVtICdoZWxwJyAgIEBzaG93SGVscFxuICAgICAgICBAbWVudS5hZGRJdGVtICdxdWl0JyAgIC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICBzaG93TGV2ZWxTZWxlY3Rpb246ID0+IFxuICAgIFxuICAgICAgICBAbGV2ZWxTZWxlY3Rpb24gPSBuZXcgTGV2ZWxTZWwgQFxuICAgIFxuICAgIHNob3dIZWxwOiA9PlxuICAgICAgICBcbiAgICAgICAgQGhlbHBTaG93biA9IHRydWVcbiAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdFsnaGVscCddLCBNYXRlcmlhbC5oZWxwXG4gICAgICAgIFxuICAgIHRvZ2dsZUhlbHA6IC0+XG4gICAgICAgIFxuICAgICAgICBAaGVscFNob3duID0gbm90IEBoZWxwU2hvd25cbiAgICAgICAgaWYgQGhlbHBTaG93blxuICAgICAgICAgICAgQHNob3dIZWxwKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHRleHQ/LmRlbCgpXG4gICAgICAgIFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuICAgICMgICAwMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMFxuICAgIFxuICAgIGdldEluc2lkZVdhbGxQb3NXaXRoRGVsdGE6IChwb3MsIGRlbHRhKSAtPlxuICAgICAgICBcbiAgICAgICAgaW5zaWRlUG9zID0gbmV3IFZlY3RvciBwb3NcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIGlmIGYgPCBkZWx0YVxuICAgICAgICAgICAgICAgIGluc2lkZVBvcy5hZGQgV29ybGQubm9ybWFsc1t3XS5tdWwgZGVsdGEtZlxuICAgICAgICBpbnNpZGVQb3NcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JQb3M6IChwb3MpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCAocG9zaXRpdmUgb3IgbmVnYXRpdmUpXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdIFxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGFic01pbiBtaW5fZiwgZiBcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBnZXRXYWxsRGlzdGFuY2VGb3JSYXk6IChyYXlQb3MsIHJheURpcikgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIGluIHJheURpciBcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcmF5UG9zLCByYXlEaXIsIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBtaW5fZiA9IGYgaWYgZiA+PSAwLjAgYW5kIGYgPCBtaW5fZlxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGRpc3BsYXlMaWdodHM6ICgpIC0+XG4gICAgICAgIGZvciBsaWdodCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBsaWdodC5kaXNwbGF5KClcbiAgICAgICAgICAgICAgIFxuICAgIHBsYXlTb3VuZDogKHNvdW5kLCBwb3MsIHRpbWUpIC0+IFNvdW5kLnBsYXkgc291bmQsIHBvcywgdGltZSBpZiBub3QgQGNyZWF0aW5nXG4gICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAwMCBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAwMDAwMCAgXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50RG93bjogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgICAgIEBsZXZlbFNlbGVjdGlvbi5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIEBtZW51PyAgICAgICAgICAgIFxuICAgICAgICAgICAgQG1lbnUubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIEB0ZXh0Py5mYWRlT3V0KClcbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnREb3duIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICAgICAgc3dpdGNoIGNvbWJvXG4gICAgICAgICAgICB3aGVuICdlc2MnIHRoZW4gQHNob3dNZW51KClcbiAgICAgICAgICAgIHdoZW4gJz0nIHRoZW4gQHNwZWVkID0gTWF0aC5taW4gOCwgQHNwZWVkKzE7IHByZWZzLnNldCAnc3BlZWQnIEBzcGVlZC0zXG4gICAgICAgICAgICB3aGVuICctJyB0aGVuIEBzcGVlZCA9IE1hdGgubWF4IDQsIEBzcGVlZC0xOyBwcmVmcy5zZXQgJ3NwZWVkJyBAc3BlZWQtM1xuICAgICAgICAgICAgd2hlbiAncicgdGhlbiBAcmVzdGFydCgpXG4gICAgICAgICAgICB3aGVuICdoJyB0aGVuIEB0b2dnbGVIZWxwKClcbiAgICAgICAgICAgIHdoZW4gJ2wnIHRoZW4gQHNob3dMZXZlbFNlbGVjdGlvbigpXG4gICAgICAgICAgICB3aGVuICduJyB0aGVuIEBjcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbKEBsZXZlbF9pbmRleCsxKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aF1cblxuICAgIG1vZEtleUNvbWJvRXZlbnRVcDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50VXAgbW9kLCBrZXksIGNvbWJvLCBldmVudCAgICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGRcblxuIl19
//# sourceURL=../coffee/world.coffee