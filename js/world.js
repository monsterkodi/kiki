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

    World.prototype.showMenu = function() {
        var ref2;
        if (this.helpShown) {
            return this.toggleHelp();
        }
        if ((ref2 = this.text) != null) {
            ref2.del();
        }
        this.menu = new Menu();
        this.menu.addItem('load', (function(_this) {
            return function() {
                return _this.levelSelection = new LevelSel(_this);
            };
        })(this));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLENBQUM7UUFDNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FB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VDt1QkFNa0IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUssQ0FBQSxDQUFDLElBQUMsQ0FBQSxXQUFELEdBQWEsQ0FBZCxDQUFBLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQXJDLENBQTFCO0FBTmxCO0lBWmtCOztvQkFvQnRCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBRWhCLFlBQUE7UUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsbUJBQUE7O1FBQ0EsdUNBQWlCLENBQUUsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsS0FBdEMsRUFBNkMsS0FBN0MsVUFBVjtBQUFBOztJQUhnQjs7OztHQWwxQko7O0FBdTFCcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICBcbiMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwICBcblxueyBwb3N0LCByYW5kSW50LCBjb2xvcnMsIGFic01pbiwgcHJlZnMsIGNsYW1wLCBsYXN0LCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5TaXplICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3NpemUnXG5DZWxsICAgICAgICA9IHJlcXVpcmUgJy4vY2VsbCdcbkdhdGUgICAgICAgID0gcmVxdWlyZSAnLi9nYXRlJ1xuQ2FtZXJhICAgICAgPSByZXF1aXJlICcuL2NhbWVyYSdcbkxpZ2h0ICAgICAgID0gcmVxdWlyZSAnLi9saWdodCdcbkxldmVscyAgICAgID0gcmVxdWlyZSAnLi9sZXZlbHMnXG5QbGF5ZXIgICAgICA9IHJlcXVpcmUgJy4vcGxheWVyJ1xuU291bmQgICAgICAgPSByZXF1aXJlICcuL3NvdW5kJ1xuQ2FnZSAgICAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5UaW1lciAgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5BY3RvciAgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5JdGVtICAgICAgICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiAgICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NZW51ICAgICAgICA9IHJlcXVpcmUgJy4vbWVudSdcbkNvbmZpZyAgICAgID0gcmVxdWlyZSAnLi9jb25maWcnXG5TY3JlZW5UZXh0ICA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcblRtcE9iamVjdCAgID0gcmVxdWlyZSAnLi90bXBvYmplY3QnXG5QdXNoYWJsZSAgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5NYXRlcmlhbCAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5TY2hlbWUgICAgICA9IHJlcXVpcmUgJy4vc2NoZW1lJ1xuUXVhdGVybmlvbiAgPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbm5vdyAgICAgICAgID0gcmVxdWlyZSgncGVyZl9ob29rcycpLnBlcmZvcm1hbmNlLm5vd1xuTGV2ZWxTZWwgICAgPSByZXF1aXJlICcuL2xldmVsc2VsZWN0aW9uJ1xue1xuV2FsbCxcbldpcmUsXG5HZWFyLFxuU3RvbmUsXG5Td2l0Y2gsXG5Nb3RvckdlYXIsXG5Nb3RvckN5bGluZGVyLFxuRmFjZX0gICAgICAgPSByZXF1aXJlICcuL2l0ZW1zJ1xuXG53b3JsZCAgICAgICA9IG51bGxcblxuY2xhc3MgV29ybGQgZXh0ZW5kcyBBY3RvclxuICAgIFxuICAgIEBsZXZlbHMgPSBudWxsXG4gICAgXG4gICAgQG5vcm1hbHMgPSBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDEsIDAsIDBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwgMVxuICAgICAgICAgICAgbmV3IFZlY3RvciAtMSwwLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLC0xLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLC0xXG4gICAgXVxuICAgIFxuICAgIEA6IChAdmlldywgQHByZXZpZXcpIC0+XG4gICAgICAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBcbiAgICAgICAgXG4gICAgICAgIEBzcGVlZCAgICAgID0gNiArIChwcmVmcy5nZXQgJ3NwZWVkJyAzKSAtIDNcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgICMga2xvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgIEByZW5kZXJlci5zZXRTaXplIEB2aWV3Lm9mZnNldFdpZHRoLCBAdmlldy5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4gICAgICAgICMgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgICAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAgICAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG5cbiAgICAgICAgQHN1biA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpIGlmIEBwbGF5ZXI/XG4gICAgICAgIEBzY2VuZS5hZGQgQHN1blxuICAgICAgICBcbiAgICAgICAgQGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4MTExMTExXG4gICAgICAgIEBzY2VuZS5hZGQgQGFtYmllbnRcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3RzID0gW11cbiAgICAgICAgQGxpZ2h0cyAgPSBbXVxuICAgICAgICBAY2VsbHMgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICA9IG5ldyBQb3MoKVxuICAgICAgICBAZGVwdGggICA9IC1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAgICBcbiAgICAgICAgQHRpbWVyID0gbmV3IFRpbWVyIEBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHZpZXcuYXBwZW5kQ2hpbGQgQHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgaW5kZXggPSBwcmVmcy5nZXQgJ2xldmVsJyAwXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBAbGV2ZWxzLmxpc3RbaW5kZXhdXG4gICAgICAgIHdvcmxkXG4gICAgICAgIFxuICAgIEBpbml0R2xvYmFsOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbHM/XG4gICAgICAgICAgXG4gICAgICAgIFNjcmVlblRleHQuaW5pdCgpXG4gICAgICAgIFNvdW5kLmluaXQoKVxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLnJvdDAgICAgPSBRdWF0ZXJuaW9uLnJvdF8wXG4gICAgICAgIGdsb2JhbC5yb3R4OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWFxuICAgICAgICBnbG9iYWwucm90eTkwICA9IFF1YXRlcm5pb24ucm90XzkwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHo5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWVxuICAgICAgICBnbG9iYWwucm90ejE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWVxuICAgICAgICBnbG9iYWwucm90ejI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9aXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwuWHVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFlcbiAgICAgICAgZ2xvYmFsLlh1cFogICAgICAgID0gUXVhdGVybmlvbi5YdXBaXG4gICAgICAgIGdsb2JhbC5YZG93blkgICAgICA9IFF1YXRlcm5pb24uWGRvd25ZXG4gICAgICAgIGdsb2JhbC5YZG93blogICAgICA9IFF1YXRlcm5pb24uWGRvd25aXG4gICAgICAgIGdsb2JhbC5ZdXBYICAgICAgICA9IFF1YXRlcm5pb24uWXVwWFxuICAgICAgICBnbG9iYWwuWXVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFpcbiAgICAgICAgZ2xvYmFsLllkb3duWCAgICAgID0gUXVhdGVybmlvbi5ZZG93blhcbiAgICAgICAgZ2xvYmFsLllkb3duWiAgICAgID0gUXVhdGVybmlvbi5ZZG93blpcbiAgICAgICAgZ2xvYmFsLlp1cFggICAgICAgID0gUXVhdGVybmlvbi5adXBYXG4gICAgICAgIGdsb2JhbC5adXBZICAgICAgICA9IFF1YXRlcm5pb24uWnVwWVxuICAgICAgICBnbG9iYWwuWmRvd25YICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWFxuICAgICAgICBnbG9iYWwuWmRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYdXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWVxuICAgICAgICBnbG9iYWwubWludXNYdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWlxuICAgICAgICBnbG9iYWwubWludXNYZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWiA9IFF1YXRlcm5pb24ubWludXNYZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWCAgID0gUXVhdGVybmlvbi5taW51c1l1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWiAgID0gUXVhdGVybmlvbi5taW51c1l1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25YID0gUXVhdGVybmlvbi5taW51c1lkb3duWFxuICAgICAgICBnbG9iYWwubWludXNZZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFggICA9IFF1YXRlcm5pb24ubWludXNadXBYXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFkgICA9IFF1YXRlcm5pb24ubWludXNadXBZXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWCA9IFF1YXRlcm5pb24ubWludXNaZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25ZID0gUXVhdGVybmlvbi5taW51c1pkb3duWVxuXG4gICAgICAgIEBsZXZlbHMgPSBuZXcgTGV2ZWxzXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5kb21FbGVtZW50LnJlbW92ZSgpXG4gICAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBjcmVhdGU6ICh3b3JsZERpY3Q9e30sIHNob3dOYW1lPXRydWUpIC0+ICMgY3JlYXRlcyB0aGUgd29ybGQgZnJvbSBhIGxldmVsIG5hbWUgb3IgYSBkaWN0aW9uYXJ5XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5jcmVhdGVcIiB3b3JsZERpY3RcbiAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkRGljdFxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBkaWN0ID0gV29ybGQubGV2ZWxzLmRpY3Rbd29ybGREaWN0XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0Lm5hbWVcbiAgICAgICAgICAgICAgICBAZGljdCA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGV2ZWxfaW5kZXggPSBXb3JsZC5sZXZlbHMubGlzdC5pbmRleE9mIEBsZXZlbF9uYW1lXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXdcbiAgICAgICAgICAgIHByZWZzLnNldCAnbGV2ZWwnIEBsZXZlbF9pbmRleFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwiV29ybGQuY3JlYXRlICN7QGxldmVsX2luZGV4fSBzaXplOiAje25ldyBQb3MoQGRpY3RbXCJzaXplXCJdKS5zdHIoKX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAnI3tAbGV2ZWxfbmFtZX0nIHNjaGVtZTogJyN7QGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnfSdcIlxuXG4gICAgICAgIEBjcmVhdGluZyA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBAc2V0U2l6ZSBAZGljdC5zaXplICMgdGhpcyByZW1vdmVzIGFsbCBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAYXBwbHlTY2hlbWUgQGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3IGFuZCBzaG93TmFtZVxuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKS5taW51cyBAcGxheWVyLmRpcmVjdGlvblxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLkZPTExPV1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGFwcGx5U2NoZW1lOiAoc2NoZW1lKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBjb2xvcnMgPSBfLmNsb25lIFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBvcGFjaXR5ID1cbiAgICAgICAgICAgIHN0b25lOiAwLjdcbiAgICAgICAgICAgIGJvbWI6ICAwLjlcbiAgICAgICAgICAgIHRleHQ6ICAwXG4gICAgICAgICAgICBcbiAgICAgICAgc2hpbmluZXNzID0gXG4gICAgICAgICAgICB0aXJlOiAgIDRcbiAgICAgICAgICAgIHBsYXRlOiAgMTBcbiAgICAgICAgICAgIHJhc3RlcjogMjBcbiAgICAgICAgICAgIHdhbGw6ICAgMjBcbiAgICAgICAgICAgIHN0b25lOiAgMjBcbiAgICAgICAgICAgIGdlYXI6ICAgMjBcbiAgICAgICAgICAgIHRleHQ6ICAgMjAwXG4gICAgICAgICAgICBcbiAgICAgICAgY29sb3JzLnBsYXRlLmVtaXNzaXZlICAgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICAgID89IGNvbG9ycy5idWxiLmNvbG9yXG4gICAgICAgIGNvbG9ycy5tZW51ICAgICAgICAgICAgID89IHt9ICAgXG4gICAgICAgIGNvbG9ycy5tZW51LmNvbG9yICAgICAgID89IGNvbG9ycy5nZWFyLmNvbG9yXG4gICAgICAgIGNvbG9ycy5yYXN0ZXIgICAgICAgICAgID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yICAgICA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLndhbGwgICAgICAgICAgICAgPz0ge31cbiAgICAgICAgY29sb3JzLndhbGwuY29sb3IgICAgICAgPz0gbmV3IFRIUkVFLkNvbG9yKGNvbG9ycy5wbGF0ZS5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC42XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUgICAgICAgID89IHt9XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUuY29sb3IgID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5oZWxwICAgICAgICAgICAgID89IHt9XG4gICAgICAgIGNvbG9ycy5oZWxwLmNvbG9yICAgICAgID89IGNvbG9ycy50ZXh0LmNvbG9yXG4gICAgICAgIFxuICAgICAgICBmb3Igayx2IG9mIGNvbG9yc1xuICAgICAgICAgICAgbWF0ID0gTWF0ZXJpYWxba11cbiAgICAgICAgICAgIG1hdC5jb2xvciAgICA9IHYuY29sb3JcbiAgICAgICAgICAgIG1hdC5vcGFjaXR5ICA9IHYub3BhY2l0eSA/IG9wYWNpdHlba10gPyAxXG4gICAgICAgICAgICBtYXQuc3BlY3VsYXIgPSB2LnNwZWN1bGFyID8gbmV3IFRIUkVFLkNvbG9yKHYuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuMlxuICAgICAgICAgICAgbWF0LmVtaXNzaXZlID0gdi5lbWlzc2l2ZSA/IG5ldyBUSFJFRS5Db2xvciAwLDAsMFxuICAgICAgICAgICAgaWYgc2hpbmluZXNzW2tdP1xuICAgICAgICAgICAgICAgIG1hdC5zaGluaW5lc3MgPSB2LnNoaW5pbmVzcyA/IHNoaW5pbmVzc1trXVxuXG4gICAgIyAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgQGxpZ2h0cy5wdXNoIGxpZ2h0XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHRydWUgaWYgbGlnaHQuc2hhZG93XG4gICAgICAgIFxuICAgIHJlbW92ZUxpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBsaWdodFxuICAgICAgICBmb3IgbCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBzaGFkb3cgPSB0cnVlIGlmIGwuc2hhZG93XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHNoYWRvd1xuXG4gICAgZW5hYmxlU2hhZG93czogKGVuYWJsZSkgLT5cbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gZW5hYmxlXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAgICAgICBcbiAgICBleGl0TGV2ZWw6IChhY3Rpb24pID0+XG4gICAgICAgIFxuICAgICAgICBwcmVmcy5zZXQgXCJzb2x2ZWTilrgje1dvcmxkLmxldmVscy5saXN0W3dvcmxkLmxldmVsX2luZGV4XX1cIiB0cnVlXG4gICAgICAgIG5leHRMZXZlbCA9ICh3b3JsZC5sZXZlbF9pbmRleCsoXy5pc051bWJlcihhY3Rpb24pIGFuZCBhY3Rpb24gb3IgMSkpICUgV29ybGQubGV2ZWxzLmxpc3QubGVuZ3RoXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBXb3JsZC5sZXZlbHMubGlzdFtuZXh0TGV2ZWxdXG5cbiAgICBhY3RpdmF0ZTogKG9iamVjdE5hbWUpIC0+IEBnZXRPYmplY3RXaXRoTmFtZShvYmplY3ROYW1lKT8uc2V0QWN0aXZlPyB0cnVlXG4gICAgXG4gICAgZGVjZW50ZXI6ICh4LHkseikgLT4gbmV3IFBvcyh4LHkseikucGx1cyBAc2l6ZS5kaXYgMlxuXG4gICAgaXNWYWxpZFBvczogKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggPj0gMCBhbmQgcC54IDwgQHNpemUueCBhbmQgcC55ID49IDAgYW5kIHAueSA8IEBzaXplLnkgYW5kIHAueiA+PSAwIGFuZCBwLnogPCBAc2l6ZS56XG4gICAgICAgIFxuICAgIGlzSW52YWxpZFBvczogKHBvcykgLT4gbm90IEBpc1ZhbGlkUG9zIHBvc1xuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgICAgIDAwMDAwMDBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgICAwMDBcbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwIFxuICAgIFxuICAgIHNldFNpemU6IChzaXplKSAtPlxuICAgICAgICBAZGVsZXRlQWxsT2JqZWN0cygpXG4gICAgICAgIEBjZWxscyA9IFtdXG4gICAgICAgIEBzaXplID0gbmV3IFBvcyBzaXplXG4gICAgICAgICMgY2FsY3VhdGUgbWF4IGRpc3RhbmNlIChmb3IgcG9zaXRpb24gcmVsYXRpdmUgc291bmQpXG4gICAgICAgIEBtYXhfZGlzdGFuY2UgPSBNYXRoLm1heChAc2l6ZS54LCBNYXRoLm1heChAc2l6ZS55LCBAc2l6ZS56KSkgICMgaGV1cmlzdGljIG9mIGEgaGV1cmlzdGljIDotKVxuICAgICAgICBAY2FnZT8uZGVsKClcbiAgICAgICAgQGNhZ2UgPSBuZXcgQ2FnZSBAc2l6ZSwgQHJhc3RlclNpemVcblxuICAgIGdldENlbGxBdFBvczogKHBvcykgLT4gcmV0dXJuIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSBpZiBAaXNWYWxpZFBvcyBwb3NcbiAgICBnZXRCb3RBdFBvczogIChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBCb3QsIG5ldyBQb3MgcG9zXG5cbiAgICBwb3NUb0luZGV4OiAgIChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ICogQHNpemUueiAqIEBzaXplLnkgKyBwLnkgKiBAc2l6ZS56ICsgcC56XG4gICAgICAgIFxuICAgIGluZGV4VG9Qb3M6ICAgKGluZGV4KSAtPiBcbiAgICAgICAgbHNpemUgPSBAc2l6ZS56ICogQHNpemUueVxuICAgICAgICBscmVzdCA9IGluZGV4ICUgbHNpemVcbiAgICAgICAgbmV3IFBvcyBpbmRleC9sc2l6ZSwgbHJlc3QvQHNpemUueiwgbHJlc3QlQHNpemUuelxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRPYmplY3RBdFBvczogKG9iamVjdCwgeCwgeSwgeikgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyB4LCB5LCB6XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RBdFBvcyAje29iamVjdC5uYW1lfVwiLCBwb3NcbiAgICAgICAgQGFkZE9iamVjdCBvYmplY3RcblxuICAgIGFkZE9iamVjdExpbmU6IChvYmplY3QsIHN4LHN5LHN6LCBleCxleSxleikgLT5cbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIGlmIHN4IGluc3RhbmNlb2YgUG9zIG9yIEFycmF5LmlzQXJyYXkgc3hcbiAgICAgICAgICAgIHN0YXJ0ID0gc3hcbiAgICAgICAgICAgIGVuZCAgID0gc3lcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhcnQgPSBuZXcgUG9zIHN4LHN5LHN6XG4gICAgICAgICAgICBlbmQgICA9IG5ldyBQb3MgZXgsZXksZXpcbiAgICAgICAgIyBhZGRzIGEgbGluZSBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBzdGFydCBhbmQgZW5kIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBlbmQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIGVuZCA9IFtlbmQueCwgZW5kLnksIGVuZC56XVxuICAgICAgICBbZXgsIGV5LCBlel0gPSBlbmRcblxuICAgICAgICBpZiBzdGFydCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgc3RhcnQgPSBbc3RhcnQueCwgc3RhcnQueSwgc3RhcnQuel1cbiAgICAgICAgW3N4LCBzeSwgc3pdID0gc3RhcnRcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBcbiAgICAgICAgZGlmZiA9IFtleC1zeCwgZXktc3ksIGV6LXN6XVxuICAgICAgICBtYXhkaWZmID0gXy5tYXggZGlmZi5tYXAgTWF0aC5hYnNcbiAgICAgICAgZGVsdGFzID0gZGlmZi5tYXAgKGEpIC0+IGEvbWF4ZGlmZlxuICAgICAgICBmb3IgaSBpbiBbMC4uLm1heGRpZmZdXG4gICAgICAgICAgICAjIHBvcyA9IGFwcGx5KFBvcywgKG1hcCAobGFtYmRhIGEsIGI6IGludChhK2kqYiksIHN0YXJ0LCBkZWx0YXMpKSlcbiAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgKHN0YXJ0W2pdK2kqZGVsdGFzW2pdIGZvciBqIGluIFswLi4yXSlcbiAgICAgICAgICAgICMga2xvZyBcImFkZE9iamVjdExpbmUgI3tpfTpcIiwgcG9zXG4gICAgICAgICAgICBpZiBAaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgIFxuICAgIGFkZE9iamVjdFBvbHk6IChvYmplY3QsIHBvaW50cywgY2xvc2U9dHJ1ZSkgLT5cbiAgICAgICAgIyBhZGRzIGEgcG9seWdvbiBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBwb2ludHMgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGNsb3NlXG4gICAgICAgICAgICBwb2ludHMucHVzaCBwb2ludHNbMF1cbiAgICAgICAgZm9yIGluZGV4IGluIFsxLi4ucG9pbnRzLmxlbmd0aF1cbiAgICAgICAgICAgIEBhZGRPYmplY3RMaW5lIG9iamVjdCwgcG9pbnRzW2luZGV4LTFdLCBwb2ludHNbaW5kZXhdXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UmFuZG9tOiAob2JqZWN0LCBudW1iZXIpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIGZvciBpIGluIFswLi4ubnVtYmVyXVxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gb2JqZWN0KClcbiAgICAgICAgXG4gICAgc2V0T2JqZWN0UmFuZG9tOiAob2JqZWN0KSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBvYmplY3RTZXQgPSBmYWxzZVxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICB3aGlsZSBub3Qgb2JqZWN0U2V0ICMgaGFjayBhbGVydCFcbiAgICAgICAgICAgIHJhbmRvbVBvcyA9IG5ldyBQb3MgcmFuZEludChAc2l6ZS54KSwgcmFuZEludChAc2l6ZS55KSwgcmFuZEludChAc2l6ZS56KVxuICAgICAgICAgICAgaWYgbm90IG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKSBvciBAaXNVbm9jY3VwaWVkUG9zIHJhbmRvbVBvcyBcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCByYW5kb21Qb3NcbiAgICAgICAgICAgICAgICBvYmplY3RTZXQgPSB0cnVlXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAgICAgIDAwMFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgICAgIFxuICAgIGdldE9iamVjdHNPZlR5cGU6ICAgICAgKGNsc3MpICAgICAgLT4gQG9iamVjdHMuZmlsdGVyIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9iamVjdHNPZlR5cGVBdFBvczogKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPYmplY3RzT2ZUeXBlKGNsc3MpID8gW11cbiAgICBnZXRPYmplY3RPZlR5cGVBdFBvczogIChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0UmVhbE9iamVjdE9mVHlwZShjbHNzKVxuICAgIGdldE9jY3VwYW50QXRQb3M6ICAgICAgICAgICAgKHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPY2N1cGFudCgpXG4gICAgZ2V0UmVhbE9jY3VwYW50QXRQb3M6IChwb3MpIC0+XG4gICAgICAgIG9jY3VwYW50ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgIGlmIG9jY3VwYW50IGFuZCBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgb2NjdXBhbnQub2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9jY3VwYW50XG4gICAgXG4gICAgc3dpdGNoQXRQb3M6IChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBTd2l0Y2gsIHBvc1xuICAgIFxuICAgIHNldE9iamVjdEF0UG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICBwb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGludmFsaWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBvYmplY3QuaXNTcGFjZUVnb2lzdGljKClcbiAgICAgICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50ID0gY2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudC50aW1lID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgdGltZTpcIiwgb2NjdXBhbnQudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQuZGVsKCkgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYW55d2F5IC4gZGVsZXRlIGl0XG4gICAgICAgIFxuICAgICAgICBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgbm90IGNlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleChwb3MpXG4gICAgICAgICAgICBjZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSBjZWxsXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgICMgZWxzZSBcbiAgICAgICAgICAgICMga2xvZyAnd29ybGQudW5zZXRPYmplY3QgW1dBUk5JTkddIG5vIGNlbGwgYXQgcG9zOicsIHBvc1xuXG4gICAgbmV3T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgaWYgb2JqZWN0LnN0YXJ0c1dpdGggJ25ldydcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICByZXR1cm4gbmV3IChyZXF1aXJlIFwiLi8je29iamVjdC50b0xvd2VyQ2FzZSgpfVwiKSgpXG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIEl0ZW1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCgpXG4gICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgTGlnaHRcbiAgICAgICAgICAgIEBsaWdodHMucHVzaCBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3RcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgdG9nZ2xlOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgb2JqZWN0ID0gQGdldE9iamVjdFdpdGhOYW1lIG9iamVjdE5hbWUgXG4gICAgICAgIG9iamVjdC5nZXRBY3Rpb25XaXRoTmFtZShcInRvZ2dsZVwiKS5wZXJmb3JtKClcbiAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgZGVsZXRlQWxsT2JqZWN0czogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWxsQWN0aW9ucygpXG4gICAgXG4gICAgICAgIGlmIEBwbGF5ZXI/XG4gICAgICAgICAgICBAcGxheWVyLmRlbCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQGxpZ2h0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIGxpZ2h0IG5vIGF1dG8gcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBAbGlnaHRzLnBvcCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAb2JqZWN0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBvYmplY3Qgbm8gYXV0byByZW1vdmUgI3tsYXN0KEBvYmplY3RzKS5uYW1lfVwiXG4gICAgICAgICAgICAgICAgQG9iamVjdHMucG9wKClcbiAgICBcbiAgICBkZWxldGVPYmplY3RzV2l0aENsYXNzTmFtZTogKGNsYXNzTmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gXy5jbG9uZSBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgY2xhc3NOYW1lID09IG8uZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICBvLmRlbCgpXG4gICAgXG4gICAgZ2V0T2JqZWN0V2l0aE5hbWU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0TmFtZSA9PSBvLm5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICBrZXJyb3IgXCJXb3JsZC5nZXRPYmplY3RXaXRoTmFtZSBbV0FSTklOR10gbm8gb2JqZWN0IHdpdGggbmFtZSAje29iamVjdE5hbWV9XCJcbiAgICAgICAgbnVsbFxuICAgIFxuICAgIHNldENhbWVyYU1vZGU6IChtb2RlKSAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gY2xhbXAgQ2FtZXJhLklOU0lERSwgQ2FtZXJhLkZPTExPVywgbW9kZVxuICAgIFxuICAgIGNoYW5nZUNhbWVyYU1vZGU6IC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSAoQHBsYXllci5jYW1lcmEubW9kZSsxKSAlIChDYW1lcmEuRk9MTE9XKzEpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG9iamVjdFdpbGxNb3ZlVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgb2xkIHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHNvdXJjZVBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSAtZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHNvdXJjZVBvcyBcblxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgc291cmNlQ2VsbCA9IEBnZXRDZWxsQXRQb3Mgc291cmNlUG9zXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gc291cmNlQ2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG5cbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gdGFyZ2V0Q2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQGlzT2NjdXBpZWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBvY2N1cGllZCB0YXJnZXQgcG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgJ25vIHNvdXJjZUNlbGw/J1xuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zICAgIFxuICAgICAgICBpZiBub3QgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4IHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRhcmdldENlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IHRhcmdldENlbGxcblxuICAgICAgICBpZiB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgdGFyZ2V0Q2VsbC5hZGRPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gbm8gdGFyZ2V0IGNlbGw/XCJcbiAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICAgICAgXG4gICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLnN0ZXAoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICBcbiAgICAgICAgVGltZXIudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllciB0aGVuIEBzdGVwUGxheWVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuNzIpLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4zKVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuXG4gICAgc3RlcFBsYXllcjogLT5cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuY2FtLmFzcGVjdCA9IEBzY3JlZW5TaXplLncgLyAoQHNjcmVlblNpemUuaCowLjY2KVxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwKClcblxuICAgICAgICBTb3VuZC5zZXRNYXRyaXggQHBsYXllci5jYW1lcmFcbiAgICAgICAgICAgIFxuICAgICAgICBAcGxheWVyLnNldE9wYWNpdHkgY2xhbXAgMCwgMSwgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKS5taW51cyhAcGxheWVyLmN1cnJlbnRfcG9zaXRpb24pLmxlbmd0aCgpLTAuNFxuICAgICAgICBcbiAgICAgICAgc3RvbmVzID0gW11cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG8gaW5zdGFuY2VvZiBTdG9uZVxuICAgICAgICAgICAgICAgIHN0b25lcy5wdXNoIG9cbiAgICAgICAgc3RvbmVzLnNvcnQgKGEsYikgPT4gYi5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKSAtIGEucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgXG4gICAgICAgIG9yZGVyID0gMTAwXG4gICAgICAgIGZvciBzdG9uZSBpbiBzdG9uZXNcbiAgICAgICAgICAgIHN0b25lLm1lc2gucmVuZGVyT3JkZXIgPSBvcmRlclxuICAgICAgICAgICAgb3JkZXIgKz0gMVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkID0gc3RvbmUucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgICAgIGlmIGQgPCAxLjBcbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSBpZiBub3Qgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gMC4yICsgZCAqIDAuNVxuICAgICAgICAgICAgZWxzZSBpZiBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICBcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmNhbS5wb3NpdGlvblxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgMCwgQHNjcmVlblNpemUudywgTWF0aC5mbG9vciBAc2NyZWVuU2l6ZS5oKjAuNjZcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBAcGxheWVyLmNhbWVyYS5jYW0gICAgICAgIFxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgPT5cbiAgICAgICAgXG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgICAgICBjYW1lcmE/LmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgY2FtZXJhPy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgQHJlbmRlcmVyPy5zZXRTaXplIHcsaFxuICAgICAgICBAdGV4dD8ucmVzaXplZCB3LGhcbiAgICAgICAgQG1lbnU/LnJlc2l6ZWQgdyxoXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxTZWxlY3Rpb24/LnJlc2l6ZWQgdyxoXG5cbiAgICBnZXROZWFyZXN0VmFsaWRQb3M6IChwb3MpIC0+XG4gICAgICAgIG5ldyBQb3MgTWF0aC5taW4oQHNpemUueC0xLCBNYXRoLm1heChwb3MueCwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS55LTEsIE1hdGgubWF4KHBvcy55LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnotMSwgTWF0aC5tYXgocG9zLnosIDApKVxuICAgIFxuICAgIGlzVW5vY2N1cGllZFBvczogKHBvcykgLT4gbm90IEBpc09jY3VwaWVkUG9zIHBvc1xuICAgIGlzT2NjdXBpZWRQb3M6ICAgKHBvcykgLT4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cblxuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcblxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGVcbiAgICAgICAgICAgIHB1c2hhYmxlT2JqZWN0LnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gb2JqZWN0LCBkaXJlY3Rpb24sIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgICAgICBmYWxzZVxuICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2hvd01lbnU6IC0+XG5cbiAgICAgICAgaWYgQGhlbHBTaG93biB0aGVuIHJldHVybiBAdG9nZ2xlSGVscCgpXG4gICAgICAgIFxuICAgICAgICBAdGV4dD8uZGVsKClcbiAgICAgICAgQG1lbnUgPSBuZXcgTWVudSgpXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ2xvYWQnICAgPT4gQGxldmVsU2VsZWN0aW9uID0gbmV3IExldmVsU2VsIEBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAncmVzZXQnICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnY29uZmlnJyA9PiBAbWVudSA9IG5ldyBDb25maWdcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnaGVscCcgICBAc2hvd0hlbHBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAncXVpdCcgICAtPiBwb3N0LnRvTWFpbiAncXVpdEFwcCdcbiAgICAgICAgQG1lbnUuc2hvdygpXG4gICAgXG4gICAgc2hvd0hlbHA6ID0+XG4gICAgICAgIFxuICAgICAgICBAaGVscFNob3duID0gdHJ1ZVxuICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0WydoZWxwJ10sIE1hdGVyaWFsLmhlbHBcbiAgICAgICAgXG4gICAgdG9nZ2xlSGVscDogLT5cbiAgICAgICAgXG4gICAgICAgIEBoZWxwU2hvd24gPSBub3QgQGhlbHBTaG93blxuICAgICAgICBpZiBAaGVscFNob3duXG4gICAgICAgICAgICBAc2hvd0hlbHAoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGV4dD8uZGVsKClcbiAgICAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4gICAgIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG4gICAgXG4gICAgZ2V0SW5zaWRlV2FsbFBvc1dpdGhEZWx0YTogKHBvcywgZGVsdGEpIC0+XG4gICAgICAgIFxuICAgICAgICBpbnNpZGVQb3MgPSBuZXcgVmVjdG9yIHBvc1xuICAgICAgICBmb3IgdyBpbiBbMC4uNV1cbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgaWYgZiA8IGRlbHRhXG4gICAgICAgICAgICAgICAgaW5zaWRlUG9zLmFkZCBXb3JsZC5ub3JtYWxzW3ddLm11bCBkZWx0YS1mXG4gICAgICAgIGluc2lkZVBvc1xuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclBvczogKHBvcykgLT4gIyBkaXN0YW5jZSB0byB0aGUgbmV4dCB3YWxsIChwb3NpdGl2ZSBvciBuZWdhdGl2ZSlcbiAgICAgICAgbWluX2YgPSAxMDAwMFxuICAgICAgICBmb3IgdyBpbiBbMC4uNV0gXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHBvcywgV29ybGQubm9ybWFsc1t3XS5uZWcoKSwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gYWJzTWluIG1pbl9mLCBmIFxuICAgICAgICBtaW5fZlxuICAgIFxuICAgIGdldFdhbGxEaXN0YW5jZUZvclJheTogKHJheVBvcywgcmF5RGlyKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgaW4gcmF5RGlyIFxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciByYXlQb3MsIHJheURpciwgcGxhbmVQb3MsIFdvcmxkLm5vcm1hbHNbd11cbiAgICAgICAgICAgIG1pbl9mID0gZiBpZiBmID49IDAuMCBhbmQgZiA8IG1pbl9mXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZGlzcGxheUxpZ2h0czogKCkgLT5cbiAgICAgICAgZm9yIGxpZ2h0IGluIEBsaWdodHNcbiAgICAgICAgICAgIGxpZ2h0LmRpc3BsYXkoKVxuICAgICAgICAgICAgICAgXG4gICAgcGxheVNvdW5kOiAoc291bmQsIHBvcywgdGltZSkgLT4gU291bmQucGxheSBzb3VuZCwgcG9zLCB0aW1lIGlmIG5vdCBAY3JlYXRpbmdcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgMDAwIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgIDAwMDAwICBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgQG1lbnU/ICAgICAgICAgICAgXG4gICAgICAgICAgICBAbWVudS5tb2RLZXlDb21ib0V2ZW50IG1vZCwga2V5LCBjb21ibywgZXZlbnQgXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICBcbiAgICAgICAgQHRleHQ/LmZhZGVPdXQoKVxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBzd2l0Y2ggY29tYm9cbiAgICAgICAgICAgIHdoZW4gJ2VzYycgdGhlbiBAc2hvd01lbnUoKVxuICAgICAgICAgICAgd2hlbiAnPScgdGhlbiBAc3BlZWQgPSBNYXRoLm1pbiA4LCBAc3BlZWQrMTsgcHJlZnMuc2V0ICdzcGVlZCcgQHNwZWVkLTNcbiAgICAgICAgICAgIHdoZW4gJy0nIHRoZW4gQHNwZWVkID0gTWF0aC5tYXggNCwgQHNwZWVkLTE7IHByZWZzLnNldCAnc3BlZWQnIEBzcGVlZC0zXG4gICAgICAgICAgICB3aGVuICdyJyB0aGVuIEByZXN0YXJ0KClcbiAgICAgICAgICAgIHdoZW4gJ2gnIHRoZW4gQHRvZ2dsZUhlbHAoKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAY3JlYXRlIFdvcmxkLmxldmVscy5saXN0WyhAbGV2ZWxfaW5kZXgrMSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhdXG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee