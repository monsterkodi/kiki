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
        } else {
            return klog('world.unsetObject [WARNING] no cell at pos:', pos);
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
        } else {
            klog('targetCell?');
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

    World.prototype.showMenu = function(self) {
        var ref2;
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
        this.menu.addItem('help', (function(_this) {
            return function() {
                return _this.text = new ScreenText(_this.dict['help']);
            };
        })(this));
        this.menu.addItem('quit', function() {
            return post.toMain('quitApp');
        });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsQ0FBQztRQUM1QixNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLENBQUM7UUFFNUIsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQ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QUFqQyxFQUF3QyxLQUF4QztBQUNBLG1CQUZKOzs7Z0JBSUssQ0FBRSxPQUFQLENBQUE7O1FBQ0EsdUNBQWlCLENBQUUsb0JBQVQsQ0FBOEIsR0FBOUIsRUFBbUMsR0FBbkMsRUFBd0MsS0FBeEMsRUFBK0MsS0FBL0MsVUFBVjtBQUFBLG1CQUFBOztBQUNBLGdCQUFPLEtBQVA7QUFBQSxpQkFDUyxLQURUO3VCQUNvQixJQUFDLENBQUEsUUFBRCxDQUFBO0FBRHBCLGlCQUVTLEdBRlQ7Z0JBRWtCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFuQjt1QkFBc0IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQWtCLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBekI7QUFGakQsaUJBR1MsR0FIVDtnQkFHa0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFDLENBQUEsS0FBRCxHQUFPLENBQW5CO3VCQUFzQixLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUF6QjtBQUhqRCxpQkFJUyxHQUpUO3VCQUlrQixJQUFDLENBQUEsT0FBRCxDQUFBO0FBSmxCO0lBWmtCOztvQkFrQnRCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBRWhCLFlBQUE7UUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFYO0FBQUEsbUJBQUE7O1FBQ0EsdUNBQWlCLENBQUUsa0JBQVQsQ0FBNEIsR0FBNUIsRUFBaUMsR0FBakMsRUFBc0MsS0FBdEMsRUFBNkMsS0FBN0MsVUFBVjtBQUFBOztJQUhnQjs7OztHQWgwQko7O0FBcTBCcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICBcbiMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwICBcblxueyBwb3N0LCByYW5kSW50LCBjb2xvcnMsIGFic01pbiwgcHJlZnMsIGNsYW1wLCBsYXN0LCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5TaXplICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3NpemUnXG5DZWxsICAgICAgICA9IHJlcXVpcmUgJy4vY2VsbCdcbkdhdGUgICAgICAgID0gcmVxdWlyZSAnLi9nYXRlJ1xuQ2FtZXJhICAgICAgPSByZXF1aXJlICcuL2NhbWVyYSdcbkxpZ2h0ICAgICAgID0gcmVxdWlyZSAnLi9saWdodCdcbkxldmVscyAgICAgID0gcmVxdWlyZSAnLi9sZXZlbHMnXG5QbGF5ZXIgICAgICA9IHJlcXVpcmUgJy4vcGxheWVyJ1xuU291bmQgICAgICAgPSByZXF1aXJlICcuL3NvdW5kJ1xuQ2FnZSAgICAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5UaW1lciAgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5BY3RvciAgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5JdGVtICAgICAgICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiAgICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NZW51ICAgICAgICA9IHJlcXVpcmUgJy4vbWVudSdcbkNvbmZpZyAgICAgID0gcmVxdWlyZSAnLi9jb25maWcnXG5TY3JlZW5UZXh0ICA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcblRtcE9iamVjdCAgID0gcmVxdWlyZSAnLi90bXBvYmplY3QnXG5QdXNoYWJsZSAgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5NYXRlcmlhbCAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5TY2hlbWUgICAgICA9IHJlcXVpcmUgJy4vc2NoZW1lJ1xuUXVhdGVybmlvbiAgPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbm5vdyAgICAgICAgID0gcmVxdWlyZSgncGVyZl9ob29rcycpLnBlcmZvcm1hbmNlLm5vd1xuTGV2ZWxTZWwgICAgPSByZXF1aXJlICcuL2xldmVsc2VsZWN0aW9uJ1xue1xuV2FsbCxcbldpcmUsXG5HZWFyLFxuU3RvbmUsXG5Td2l0Y2gsXG5Nb3RvckdlYXIsXG5Nb3RvckN5bGluZGVyLFxuRmFjZX0gICAgICAgPSByZXF1aXJlICcuL2l0ZW1zJ1xuXG53b3JsZCAgICAgICA9IG51bGxcblxuY2xhc3MgV29ybGQgZXh0ZW5kcyBBY3RvclxuICAgIFxuICAgIEBsZXZlbHMgPSBudWxsXG4gICAgXG4gICAgQG5vcm1hbHMgPSBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDEsIDAsIDBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwgMVxuICAgICAgICAgICAgbmV3IFZlY3RvciAtMSwwLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLC0xLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLC0xXG4gICAgXVxuICAgIFxuICAgIEA6IChAdmlldywgQHByZXZpZXcpIC0+XG4gICAgICAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBcbiAgICAgICAgXG4gICAgICAgIEBzcGVlZCAgICAgID0gNiArIChwcmVmcy5nZXQgJ3NwZWVkJyAzKSAtIDNcbiAgICAgICAgXG4gICAgICAgIEByYXN0ZXJTaXplID0gMC4wNVxuXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAbm9Sb3RhdGlvbnMgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG4gICAgICAgICMga2xvZyBcInZpZXcgQHNjcmVlblNpemU6XCIsIEBzY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciBcbiAgICAgICAgICAgIGFudGlhbGlhczogICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGxvZ2FyaXRobWljRGVwdGhCdWZmZXI6IGZhbHNlXG4gICAgICAgICAgICBhdXRvQ2xlYXI6ICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgc29ydE9iamVjdHM6ICAgICAgICAgICAgdHJ1ZVxuXG4gICAgICAgIEByZW5kZXJlci5zZXRTaXplIEB2aWV3Lm9mZnNldFdpZHRoLCBAdmlldy5vZmZzZXRIZWlnaHRcbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC50eXBlID0gVEhSRUUuUENGU29mdFNoYWRvd01hcFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICMgICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4gICAgICAgICMgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgXG4gICAgICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgICAgICBAc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAgICAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG5cbiAgICAgICAgQHN1biA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmXG4gICAgICAgIEBzdW4ucG9zaXRpb24uY29weSBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpIGlmIEBwbGF5ZXI/XG4gICAgICAgIEBzY2VuZS5hZGQgQHN1blxuICAgICAgICBcbiAgICAgICAgQGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4MTExMTExXG4gICAgICAgIEBzY2VuZS5hZGQgQGFtYmllbnRcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3RzID0gW11cbiAgICAgICAgQGxpZ2h0cyAgPSBbXVxuICAgICAgICBAY2VsbHMgICA9IFtdIFxuICAgICAgICBAc2l6ZSAgICA9IG5ldyBQb3MoKVxuICAgICAgICBAZGVwdGggICA9IC1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAgICBcbiAgICAgICAgQHRpbWVyID0gbmV3IFRpbWVyIEBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHZpZXcuYXBwZW5kQ2hpbGQgQHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICAgXG4gICAgQGluaXQ6ICh2aWV3KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIHdvcmxkP1xuICAgICAgICBcbiAgICAgICAgQGluaXRHbG9iYWwoKVxuICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkID0gbmV3IFdvcmxkIHZpZXdcbiAgICAgICAgd29ybGQubmFtZSA9ICd3b3JsZCdcbiAgICAgICAgaW5kZXggPSBwcmVmcy5nZXQgJ2xldmVsJyAwXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBAbGV2ZWxzLmxpc3RbaW5kZXhdXG4gICAgICAgIHdvcmxkXG4gICAgICAgIFxuICAgIEBpbml0R2xvYmFsOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbHM/XG4gICAgICAgICAgXG4gICAgICAgIFNjcmVlblRleHQuaW5pdCgpXG4gICAgICAgIFNvdW5kLmluaXQoKVxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLnJvdDAgICAgPSBRdWF0ZXJuaW9uLnJvdF8wXG4gICAgICAgIGdsb2JhbC5yb3R4OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWFxuICAgICAgICBnbG9iYWwucm90eTkwICA9IFF1YXRlcm5pb24ucm90XzkwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHo5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWVxuICAgICAgICBnbG9iYWwucm90ejE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9aXG4gICAgICAgIGdsb2JhbC5yb3R4MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHkyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWVxuICAgICAgICBnbG9iYWwucm90ejI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9aXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwuWHVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFlcbiAgICAgICAgZ2xvYmFsLlh1cFogICAgICAgID0gUXVhdGVybmlvbi5YdXBaXG4gICAgICAgIGdsb2JhbC5YZG93blkgICAgICA9IFF1YXRlcm5pb24uWGRvd25ZXG4gICAgICAgIGdsb2JhbC5YZG93blogICAgICA9IFF1YXRlcm5pb24uWGRvd25aXG4gICAgICAgIGdsb2JhbC5ZdXBYICAgICAgICA9IFF1YXRlcm5pb24uWXVwWFxuICAgICAgICBnbG9iYWwuWXVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFpcbiAgICAgICAgZ2xvYmFsLllkb3duWCAgICAgID0gUXVhdGVybmlvbi5ZZG93blhcbiAgICAgICAgZ2xvYmFsLllkb3duWiAgICAgID0gUXVhdGVybmlvbi5ZZG93blpcbiAgICAgICAgZ2xvYmFsLlp1cFggICAgICAgID0gUXVhdGVybmlvbi5adXBYXG4gICAgICAgIGdsb2JhbC5adXBZICAgICAgICA9IFF1YXRlcm5pb24uWnVwWVxuICAgICAgICBnbG9iYWwuWmRvd25YICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWFxuICAgICAgICBnbG9iYWwuWmRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlpkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYdXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWVxuICAgICAgICBnbG9iYWwubWludXNYdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWHVwWlxuICAgICAgICBnbG9iYWwubWludXNYZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWiA9IFF1YXRlcm5pb24ubWludXNYZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWCAgID0gUXVhdGVybmlvbi5taW51c1l1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWXVwWiAgID0gUXVhdGVybmlvbi5taW51c1l1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25YID0gUXVhdGVybmlvbi5taW51c1lkb3duWFxuICAgICAgICBnbG9iYWwubWludXNZZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFggICA9IFF1YXRlcm5pb24ubWludXNadXBYXG4gICAgICAgIGdsb2JhbC5taW51c1p1cFkgICA9IFF1YXRlcm5pb24ubWludXNadXBZXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWCA9IFF1YXRlcm5pb24ubWludXNaZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25ZID0gUXVhdGVybmlvbi5taW51c1pkb3duWVxuXG4gICAgICAgIEBsZXZlbHMgPSBuZXcgTGV2ZWxzXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5kb21FbGVtZW50LnJlbW92ZSgpXG4gICAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBjcmVhdGU6ICh3b3JsZERpY3Q9e30sIHNob3dOYW1lPXRydWUpIC0+ICMgY3JlYXRlcyB0aGUgd29ybGQgZnJvbSBhIGxldmVsIG5hbWUgb3IgYSBkaWN0aW9uYXJ5XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5jcmVhdGVcIiB3b3JsZERpY3RcbiAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkRGljdFxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBkaWN0ID0gV29ybGQubGV2ZWxzLmRpY3Rbd29ybGREaWN0XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0Lm5hbWVcbiAgICAgICAgICAgICAgICBAZGljdCA9IHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGV2ZWxfaW5kZXggPSBXb3JsZC5sZXZlbHMubGlzdC5pbmRleE9mIEBsZXZlbF9uYW1lXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXdcbiAgICAgICAgICAgIHByZWZzLnNldCAnbGV2ZWwnIEBsZXZlbF9pbmRleFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwiV29ybGQuY3JlYXRlICN7QGxldmVsX2luZGV4fSBzaXplOiAje25ldyBQb3MoQGRpY3RbXCJzaXplXCJdKS5zdHIoKX0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAnI3tAbGV2ZWxfbmFtZX0nIHNjaGVtZTogJyN7QGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnfSdcIlxuXG4gICAgICAgIEBjcmVhdGluZyA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBAc2V0U2l6ZSBAZGljdC5zaXplICMgdGhpcyByZW1vdmVzIGFsbCBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBAYXBwbHlTY2hlbWUgQGRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gaW50cm8gdGV4dCAgIFxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3IGFuZCBzaG93TmFtZVxuICAgICAgICAgICAgQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdC5uYW1lXG4gICAgICAgIFxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBleGl0c1xuXG4gICAgICAgIGlmIEBkaWN0LmV4aXRzP1xuICAgICAgICAgICAgZXhpdF9pZCA9IDBcbiAgICAgICAgICAgIGZvciBlbnRyeSBpbiBAZGljdC5leGl0c1xuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZSA9IG5ldyBHYXRlIGVudHJ5W1wiYWN0aXZlXCJdXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLm5hbWUgPSBlbnRyeVtcIm5hbWVcIl0gPyBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgQWN0aW9uLmlkID89IDBcbiAgICAgICAgICAgICAgICBleGl0QWN0aW9uID0gbmV3IEFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICAgQWN0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIGZ1bmM6IEBleGl0TGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlLmdldEV2ZW50V2l0aE5hbWUoXCJlbnRlclwiKS5hZGRBY3Rpb24gZXhpdEFjdGlvblxuICAgICAgICAgICAgICAgIGlmIGVudHJ5LnBvc2l0aW9uP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBAZGVjZW50ZXIgZW50cnkucG9zaXRpb25cbiAgICAgICAgICAgICAgICBlbHNlIGlmIGVudHJ5LmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBuZXcgUG9zIGVudHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIGV4aXRfZ2F0ZSwgcG9zXG4gICAgICAgICAgICAgICAgZXhpdF9pZCArPSAxXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY3JlYXRpb25cblxuICAgICAgICBpZiBAZGljdC5jcmVhdGU/XG4gICAgICAgICAgICBpZiBfLmlzRnVuY3Rpb24gQGRpY3QuY3JlYXRlXG4gICAgICAgICAgICAgICAgQGRpY3QuY3JlYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBrbG9nIFwiV29ybGQuY3JlYXRlIFtXQVJOSU5HXSBAZGljdC5jcmVhdGUgbm90IGEgZnVuY3Rpb24hXCJcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBwbGF5ZXJcblxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIuc2V0T3JpZW50YXRpb24gQGRpY3QucGxheWVyLm9yaWVudGF0aW9uID8gcm90eDkwXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldE9yaWVudGF0aW9uIEBwbGF5ZXIub3JpZW50YXRpb25cblxuICAgICAgICBpZiBAZGljdC5wbGF5ZXIucG9zaXRpb24/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgQGRlY2VudGVyIEBkaWN0LnBsYXllci5wb3NpdGlvblxuICAgICAgICBlbHNlIGlmIEBkaWN0LnBsYXllci5jb29yZGluYXRlcz9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBuZXcgUG9zIEBkaWN0LnBsYXllci5jb29yZGluYXRlc1xuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKS5taW51cyBAcGxheWVyLmRpcmVjdGlvblxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLkZPTExPV1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRQb3NpdGlvbiBAcGxheWVyLmN1cnJlbnRQb3MoKVxuICAgICAgICAgICAgQHNldENhbWVyYU1vZGUgQ2FtZXJhLklOU0lERSBpZiBAZGljdC5jYW1lcmEgPT0gJ2luc2lkZSdcbiAgICAgICAgXG4gICAgICAgIEBjcmVhdGluZyA9IGZhbHNlXG4gICAgXG4gICAgcmVzdGFydDogPT4gQGNyZWF0ZSBAZGljdFxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGFwcGx5U2NoZW1lOiAoc2NoZW1lKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBjb2xvcnMgPSBfLmNsb25lIFNjaGVtZVtzY2hlbWVdXG4gICAgICAgIFxuICAgICAgICBvcGFjaXR5ID1cbiAgICAgICAgICAgIHN0b25lOiAwLjdcbiAgICAgICAgICAgIGJvbWI6ICAwLjlcbiAgICAgICAgICAgIHRleHQ6ICAwXG4gICAgICAgICAgICBcbiAgICAgICAgc2hpbmluZXNzID0gXG4gICAgICAgICAgICB0aXJlOiAgIDRcbiAgICAgICAgICAgIHBsYXRlOiAgMTBcbiAgICAgICAgICAgIHJhc3RlcjogMjBcbiAgICAgICAgICAgIHdhbGw6ICAgMjBcbiAgICAgICAgICAgIHN0b25lOiAgMjBcbiAgICAgICAgICAgIGdlYXI6ICAgMjBcbiAgICAgICAgICAgIHRleHQ6ICAgMjAwXG4gICAgICAgICAgICBcbiAgICAgICAgY29sb3JzLnBsYXRlLmVtaXNzaXZlID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMuYnVsYi5lbWlzc2l2ZSAgPz0gY29sb3JzLmJ1bGIuY29sb3JcbiAgICAgICAgY29sb3JzLm1lbnUgPz0ge30gICBcbiAgICAgICAgY29sb3JzLm1lbnUuY29sb3IgPz0gY29sb3JzLmdlYXIuY29sb3JcbiAgICAgICAgY29sb3JzLnJhc3RlciA/PSB7fSAgICBcbiAgICAgICAgY29sb3JzLnJhc3Rlci5jb2xvciA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLndhbGwgPz0ge31cbiAgICAgICAgY29sb3JzLndhbGwuY29sb3IgPz0gbmV3IFRIUkVFLkNvbG9yKGNvbG9ycy5wbGF0ZS5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC42XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUgPz0ge31cbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZS5jb2xvciA/PSBjb2xvcnMud2lyZS5jb2xvclxuICAgICAgICBmb3Igayx2IG9mIGNvbG9yc1xuICAgICAgICAgICAgbWF0ID0gTWF0ZXJpYWxba11cbiAgICAgICAgICAgIG1hdC5jb2xvciAgICA9IHYuY29sb3JcbiAgICAgICAgICAgIG1hdC5vcGFjaXR5ICA9IHYub3BhY2l0eSA/IG9wYWNpdHlba10gPyAxXG4gICAgICAgICAgICBtYXQuc3BlY3VsYXIgPSB2LnNwZWN1bGFyID8gbmV3IFRIUkVFLkNvbG9yKHYuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuMlxuICAgICAgICAgICAgbWF0LmVtaXNzaXZlID0gdi5lbWlzc2l2ZSA/IG5ldyBUSFJFRS5Db2xvciAwLDAsMFxuICAgICAgICAgICAgaWYgc2hpbmluZXNzW2tdP1xuICAgICAgICAgICAgICAgIG1hdC5zaGluaW5lc3MgPSB2LnNoaW5pbmVzcyA/IHNoaW5pbmVzc1trXVxuXG4gICAgIyAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgQGxpZ2h0cy5wdXNoIGxpZ2h0XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHRydWUgaWYgbGlnaHQuc2hhZG93XG4gICAgICAgIFxuICAgIHJlbW92ZUxpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBsaWdodFxuICAgICAgICBmb3IgbCBpbiBAbGlnaHRzXG4gICAgICAgICAgICBzaGFkb3cgPSB0cnVlIGlmIGwuc2hhZG93XG4gICAgICAgIEBlbmFibGVTaGFkb3dzIHNoYWRvd1xuXG4gICAgZW5hYmxlU2hhZG93czogKGVuYWJsZSkgLT5cbiAgICAgICAgQHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gZW5hYmxlXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAgICAgICBcbiAgICBleGl0TGV2ZWw6IChhY3Rpb24pID0+XG4gICAgICAgIFxuICAgICAgICBwcmVmcy5zZXQgXCJzb2x2ZWTilrgje1dvcmxkLmxldmVscy5saXN0W3dvcmxkLmxldmVsX2luZGV4XX1cIiB0cnVlXG4gICAgICAgIG5leHRMZXZlbCA9ICh3b3JsZC5sZXZlbF9pbmRleCsoXy5pc051bWJlcihhY3Rpb24pIGFuZCBhY3Rpb24gb3IgMSkpICUgV29ybGQubGV2ZWxzLmxpc3QubGVuZ3RoXG4gICAgICAgIHdvcmxkLmNyZWF0ZSBXb3JsZC5sZXZlbHMubGlzdFtuZXh0TGV2ZWxdXG5cbiAgICBhY3RpdmF0ZTogKG9iamVjdE5hbWUpIC0+IEBnZXRPYmplY3RXaXRoTmFtZShvYmplY3ROYW1lKT8uc2V0QWN0aXZlPyB0cnVlXG4gICAgXG4gICAgZGVjZW50ZXI6ICh4LHkseikgLT4gbmV3IFBvcyh4LHkseikucGx1cyBAc2l6ZS5kaXYgMlxuXG4gICAgaXNWYWxpZFBvczogKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggPj0gMCBhbmQgcC54IDwgQHNpemUueCBhbmQgcC55ID49IDAgYW5kIHAueSA8IEBzaXplLnkgYW5kIHAueiA+PSAwIGFuZCBwLnogPCBAc2l6ZS56XG4gICAgICAgIFxuICAgIGlzSW52YWxpZFBvczogKHBvcykgLT4gbm90IEBpc1ZhbGlkUG9zIHBvc1xuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgICAgIDAwMDAwMDBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgICAwMDBcbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwIFxuICAgIFxuICAgIHNldFNpemU6IChzaXplKSAtPlxuICAgICAgICBAZGVsZXRlQWxsT2JqZWN0cygpXG4gICAgICAgIEBjZWxscyA9IFtdXG4gICAgICAgIEBzaXplID0gbmV3IFBvcyBzaXplXG4gICAgICAgICMgY2FsY3VhdGUgbWF4IGRpc3RhbmNlIChmb3IgcG9zaXRpb24gcmVsYXRpdmUgc291bmQpXG4gICAgICAgIEBtYXhfZGlzdGFuY2UgPSBNYXRoLm1heChAc2l6ZS54LCBNYXRoLm1heChAc2l6ZS55LCBAc2l6ZS56KSkgICMgaGV1cmlzdGljIG9mIGEgaGV1cmlzdGljIDotKVxuICAgICAgICBAY2FnZT8uZGVsKClcbiAgICAgICAgQGNhZ2UgPSBuZXcgQ2FnZSBAc2l6ZSwgQHJhc3RlclNpemVcblxuICAgIGdldENlbGxBdFBvczogKHBvcykgLT4gcmV0dXJuIEBjZWxsc1tAcG9zVG9JbmRleChwb3MpXSBpZiBAaXNWYWxpZFBvcyBwb3NcbiAgICBnZXRCb3RBdFBvczogIChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBCb3QsIG5ldyBQb3MgcG9zXG5cbiAgICBwb3NUb0luZGV4OiAgIChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ICogQHNpemUueiAqIEBzaXplLnkgKyBwLnkgKiBAc2l6ZS56ICsgcC56XG4gICAgICAgIFxuICAgIGluZGV4VG9Qb3M6ICAgKGluZGV4KSAtPiBcbiAgICAgICAgbHNpemUgPSBAc2l6ZS56ICogQHNpemUueVxuICAgICAgICBscmVzdCA9IGluZGV4ICUgbHNpemVcbiAgICAgICAgbmV3IFBvcyBpbmRleC9sc2l6ZSwgbHJlc3QvQHNpemUueiwgbHJlc3QlQHNpemUuelxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRPYmplY3RBdFBvczogKG9iamVjdCwgeCwgeSwgeikgLT5cbiAgICAgICAgcG9zID0gbmV3IFBvcyB4LCB5LCB6XG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIEBzZXRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RBdFBvcyAje29iamVjdC5uYW1lfVwiLCBwb3NcbiAgICAgICAgQGFkZE9iamVjdCBvYmplY3RcblxuICAgIGFkZE9iamVjdExpbmU6IChvYmplY3QsIHN4LHN5LHN6LCBleCxleSxleikgLT5cbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIGlmIHN4IGluc3RhbmNlb2YgUG9zIG9yIEFycmF5LmlzQXJyYXkgc3hcbiAgICAgICAgICAgIHN0YXJ0ID0gc3hcbiAgICAgICAgICAgIGVuZCAgID0gc3lcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhcnQgPSBuZXcgUG9zIHN4LHN5LHN6XG4gICAgICAgICAgICBlbmQgICA9IG5ldyBQb3MgZXgsZXksZXpcbiAgICAgICAgIyBhZGRzIGEgbGluZSBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBzdGFydCBhbmQgZW5kIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBlbmQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIGVuZCA9IFtlbmQueCwgZW5kLnksIGVuZC56XVxuICAgICAgICBbZXgsIGV5LCBlel0gPSBlbmRcblxuICAgICAgICBpZiBzdGFydCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgc3RhcnQgPSBbc3RhcnQueCwgc3RhcnQueSwgc3RhcnQuel1cbiAgICAgICAgW3N4LCBzeSwgc3pdID0gc3RhcnRcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBcbiAgICAgICAgZGlmZiA9IFtleC1zeCwgZXktc3ksIGV6LXN6XVxuICAgICAgICBtYXhkaWZmID0gXy5tYXggZGlmZi5tYXAgTWF0aC5hYnNcbiAgICAgICAgZGVsdGFzID0gZGlmZi5tYXAgKGEpIC0+IGEvbWF4ZGlmZlxuICAgICAgICBmb3IgaSBpbiBbMC4uLm1heGRpZmZdXG4gICAgICAgICAgICAjIHBvcyA9IGFwcGx5KFBvcywgKG1hcCAobGFtYmRhIGEsIGI6IGludChhK2kqYiksIHN0YXJ0LCBkZWx0YXMpKSlcbiAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgKHN0YXJ0W2pdK2kqZGVsdGFzW2pdIGZvciBqIGluIFswLi4yXSlcbiAgICAgICAgICAgICMga2xvZyBcImFkZE9iamVjdExpbmUgI3tpfTpcIiwgcG9zXG4gICAgICAgICAgICBpZiBAaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHBvc1xuICAgICAgIFxuICAgIGFkZE9iamVjdFBvbHk6IChvYmplY3QsIHBvaW50cywgY2xvc2U9dHJ1ZSkgLT5cbiAgICAgICAgIyBhZGRzIGEgcG9seWdvbiBvZiBvYmplY3RzIG9mIHR5cGUgdG8gdGhlIHdvcmxkLiBwb2ludHMgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGNsb3NlXG4gICAgICAgICAgICBwb2ludHMucHVzaCBwb2ludHNbMF1cbiAgICAgICAgZm9yIGluZGV4IGluIFsxLi4ucG9pbnRzLmxlbmd0aF1cbiAgICAgICAgICAgIEBhZGRPYmplY3RMaW5lIG9iamVjdCwgcG9pbnRzW2luZGV4LTFdLCBwb2ludHNbaW5kZXhdXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UmFuZG9tOiAob2JqZWN0LCBudW1iZXIpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIGZvciBpIGluIFswLi4ubnVtYmVyXVxuICAgICAgICAgICAgaWYgXy5pc1N0cmluZyBvYmplY3RcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIGV2YWwgb2JqZWN0IFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gb2JqZWN0KClcbiAgICAgICAgXG4gICAgc2V0T2JqZWN0UmFuZG9tOiAob2JqZWN0KSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBvYmplY3RTZXQgPSBmYWxzZVxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICB3aGlsZSBub3Qgb2JqZWN0U2V0ICMgaGFjayBhbGVydCFcbiAgICAgICAgICAgIHJhbmRvbVBvcyA9IG5ldyBQb3MgcmFuZEludChAc2l6ZS54KSwgcmFuZEludChAc2l6ZS55KSwgcmFuZEludChAc2l6ZS56KVxuICAgICAgICAgICAgaWYgbm90IG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKSBvciBAaXNVbm9jY3VwaWVkUG9zIHJhbmRvbVBvcyBcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCByYW5kb21Qb3NcbiAgICAgICAgICAgICAgICBvYmplY3RTZXQgPSB0cnVlXG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAgICAgIDAwMFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgICAgIFxuICAgIGdldE9iamVjdHNPZlR5cGU6ICAgICAgKGNsc3MpICAgICAgLT4gQG9iamVjdHMuZmlsdGVyIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9iamVjdHNPZlR5cGVBdFBvczogKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPYmplY3RzT2ZUeXBlKGNsc3MpID8gW11cbiAgICBnZXRPYmplY3RPZlR5cGVBdFBvczogIChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0UmVhbE9iamVjdE9mVHlwZShjbHNzKVxuICAgIGdldE9jY3VwYW50QXRQb3M6ICAgICAgICAgICAgKHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRPY2N1cGFudCgpXG4gICAgZ2V0UmVhbE9jY3VwYW50QXRQb3M6IChwb3MpIC0+XG4gICAgICAgIG9jY3VwYW50ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgIGlmIG9jY3VwYW50IGFuZCBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgb2NjdXBhbnQub2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9jY3VwYW50XG4gICAgXG4gICAgc3dpdGNoQXRQb3M6IChwb3MpIC0+IEBnZXRPYmplY3RPZlR5cGVBdFBvcyBTd2l0Y2gsIHBvc1xuICAgIFxuICAgIHNldE9iamVjdEF0UG9zOiAob2JqZWN0LCBwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICBwb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGludmFsaWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBvYmplY3QuaXNTcGFjZUVnb2lzdGljKClcbiAgICAgICAgICAgIGlmIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50ID0gY2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudC50aW1lID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgdGltZTpcIiwgb2NjdXBhbnQudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQuZGVsKCkgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYW55d2F5IC4gZGVsZXRlIGl0XG4gICAgICAgIFxuICAgICAgICBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgbm90IGNlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleChwb3MpXG4gICAgICAgICAgICBjZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSBjZWxsXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgICBrbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBvYmplY3RzLCBvYmplY3RcbiAgICBcbiAgICB0b2dnbGU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBvYmplY3QgPSBAZ2V0T2JqZWN0V2l0aE5hbWUgb2JqZWN0TmFtZSBcbiAgICAgICAgb2JqZWN0LmdldEFjdGlvbldpdGhOYW1lKFwidG9nZ2xlXCIpLnBlcmZvcm0oKVxuICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgICBcbiAgICBkZWxldGVBbGxPYmplY3RzOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBbGxBY3Rpb25zKClcbiAgICBcbiAgICAgICAgaWYgQHBsYXllcj9cbiAgICAgICAgICAgIEBwbGF5ZXIuZGVsKClcbiAgICBcbiAgICAgICAgd2hpbGUgQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIG9sZFNpemUgPSBAbGlnaHRzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAbGlnaHRzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBrZXJyb3IgXCJXQVJOSU5HIFdvcmxkLmRlbGV0ZUFsbE9iamVjdHMgbGlnaHQgbm8gYXV0byByZW1vdmVcIlxuICAgICAgICAgICAgICAgIEBsaWdodHMucG9wKClcbiAgICBcbiAgICAgICAgd2hpbGUgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICBsYXN0KEBvYmplY3RzKS5kZWwoKSAjIGRlc3RydWN0b3Igd2lsbCBjYWxsIHJlbW92ZSBvYmplY3RcbiAgICAgICAgICAgIGlmIG9sZFNpemUgPT0gQG9iamVjdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIG9iamVjdCBubyBhdXRvIHJlbW92ZSAje2xhc3QoQG9iamVjdHMpLm5hbWV9XCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0cy5wb3AoKVxuICAgIFxuICAgIGRlbGV0ZU9iamVjdHNXaXRoQ2xhc3NOYW1lOiAoY2xhc3NOYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBfLmNsb25lIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBjbGFzc05hbWUgPT0gby5nZXRDbGFzc05hbWUoKVxuICAgICAgICAgICAgICAgIG8uZGVsKClcbiAgICBcbiAgICBnZXRPYmplY3RXaXRoTmFtZTogKG9iamVjdE5hbWUpIC0+XG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3ROYW1lID09IG8ubmFtZVxuICAgICAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgIGtlcnJvciBcIldvcmxkLmdldE9iamVjdFdpdGhOYW1lIFtXQVJOSU5HXSBubyBvYmplY3Qgd2l0aCBuYW1lICN7b2JqZWN0TmFtZX1cIlxuICAgICAgICBudWxsXG4gICAgXG4gICAgc2V0Q2FtZXJhTW9kZTogKG1vZGUpIC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSBjbGFtcCBDYW1lcmEuSU5TSURFLCBDYW1lcmEuRk9MTE9XLCBtb2RlXG4gICAgXG4gICAgY2hhbmdlQ2FtZXJhTW9kZTogLT4gQHBsYXllci5jYW1lcmEubW9kZSA9IChAcGxheWVyLmNhbWVyYS5tb2RlKzEpICUgKENhbWVyYS5GT0xMT1crMSlcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgICAgICAgMDAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgb2JqZWN0V2lsbE1vdmVUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgaWYgc291cmNlUG9zLmVxbCB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGVxdWFsIHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiB0YXJnZXRDZWxsXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyA9IHRhcmdldENlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zLnRpbWUgPCAwIGFuZCAtb2JqZWN0QXROZXdQb3MudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXROZXdQb3MuZGVsKClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gdGltaW5nIGNvbmZsaWN0IGF0IHBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBhbHJlYWR5IG9jY3VwaWVkOlwiLCB0YXJnZXRQb3MgXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5uYW1lICE9ICdwbGF5ZXInXG4gICAgICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0ICMgcmVtb3ZlIG9iamVjdCBmcm9tIGNlbGwgZ3JpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBvbGQgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gc291cmNlUG9zXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IC1kdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgc291cmNlUG9zIFxuXG4gICAgICAgICAgICB0bXBPYmplY3QgPSBuZXcgVG1wT2JqZWN0IG9iamVjdCAgIyBpbnNlcnQgdG1wIG9iamVjdCBhdCBuZXcgcG9zXG4gICAgICAgICAgICB0bXBPYmplY3Quc2V0UG9zaXRpb24gdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSBkdXJhdGlvblxuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIHRtcE9iamVjdCwgdGFyZ2V0UG9zIFxuXG4gICAgb2JqZWN0TW92ZWQ6IChtb3ZlZE9iamVjdCwgZnJvbSwgdG8pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBuZXcgUG9zIGZyb21cbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyB0b1xuXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIgdGFyZ2V0UG9zXG4gICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBzb3VyY2VDZWxsID0gQGdldENlbGxBdFBvcyBzb3VyY2VQb3NcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiB0bXBPYmplY3QgPSBzb3VyY2VDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcblxuICAgICAgICBpZiB0bXBPYmplY3QgPSB0YXJnZXRDZWxsPy5nZXRPYmplY3RPZlR5cGUgVG1wT2JqZWN0IFxuICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpIGlmIHRtcE9iamVjdC5vYmplY3QgPT0gbW92ZWRPYmplY3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAaXNPY2N1cGllZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IG9jY3VwaWVkIHRhcmdldCBwb3M6XCIgdGFyZ2V0UG9zXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc291cmNlQ2VsbD9cbiAgICAgICAgICAgIHNvdXJjZUNlbGwucmVtb3ZlT2JqZWN0IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBpZiBzb3VyY2VDZWxsLmlzRW1wdHkoKVxuICAgICAgICAgICAgICAgIEBjZWxsc1tAcG9zVG9JbmRleChzb3VyY2VQb3MpXSA9IG51bGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2xvZyAnbm8gc291cmNlQ2VsbD8nXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3MgICAgXG4gICAgICAgIGlmIG5vdCB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXggdGFyZ2V0UG9zIFxuICAgICAgICAgICAgdGFyZ2V0Q2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gdGFyZ2V0Q2VsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrbG9nICd0YXJnZXRDZWxsPydcblxuICAgICAgICBpZiB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgdGFyZ2V0Q2VsbC5hZGRPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gbm8gdGFyZ2V0IGNlbGw/XCJcbiAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICAgICAgXG4gICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLnN0ZXAoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICBcbiAgICAgICAgVGltZXIudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllciB0aGVuIEBzdGVwUGxheWVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuNzIpLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4zKVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuXG4gICAgc3RlcFBsYXllcjogLT5cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuY2FtLmFzcGVjdCA9IEBzY3JlZW5TaXplLncgLyAoQHNjcmVlblNpemUuaCowLjY2KVxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwKClcblxuICAgICAgICBTb3VuZC5zZXRNYXRyaXggQHBsYXllci5jYW1lcmFcbiAgICAgICAgICAgIFxuICAgICAgICBAcGxheWVyLnNldE9wYWNpdHkgY2xhbXAgMCwgMSwgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKS5taW51cyhAcGxheWVyLmN1cnJlbnRfcG9zaXRpb24pLmxlbmd0aCgpLTAuNFxuICAgICAgICBcbiAgICAgICAgc3RvbmVzID0gW11cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG8gaW5zdGFuY2VvZiBTdG9uZVxuICAgICAgICAgICAgICAgIHN0b25lcy5wdXNoIG9cbiAgICAgICAgc3RvbmVzLnNvcnQgKGEsYikgPT4gYi5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKSAtIGEucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgXG4gICAgICAgIG9yZGVyID0gMTAwXG4gICAgICAgIGZvciBzdG9uZSBpbiBzdG9uZXNcbiAgICAgICAgICAgIHN0b25lLm1lc2gucmVuZGVyT3JkZXIgPSBvcmRlclxuICAgICAgICAgICAgb3JkZXIgKz0gMVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkID0gc3RvbmUucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgICAgIGlmIGQgPCAxLjBcbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSBpZiBub3Qgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gMC4yICsgZCAqIDAuNVxuICAgICAgICAgICAgZWxzZSBpZiBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICBcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmNhbS5wb3NpdGlvblxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgMCwgQHNjcmVlblNpemUudywgTWF0aC5mbG9vciBAc2NyZWVuU2l6ZS5oKjAuNjZcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBAcGxheWVyLmNhbWVyYS5jYW0gICAgICAgIFxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgPT5cbiAgICAgICAgXG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgICAgICBjYW1lcmE/LmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgY2FtZXJhPy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgQHJlbmRlcmVyPy5zZXRTaXplIHcsaFxuICAgICAgICBAdGV4dD8ucmVzaXplZCB3LGhcbiAgICAgICAgQG1lbnU/LnJlc2l6ZWQgdyxoXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxTZWxlY3Rpb24/LnJlc2l6ZWQgdyxoXG5cbiAgICBnZXROZWFyZXN0VmFsaWRQb3M6IChwb3MpIC0+XG4gICAgICAgIG5ldyBQb3MgTWF0aC5taW4oQHNpemUueC0xLCBNYXRoLm1heChwb3MueCwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS55LTEsIE1hdGgubWF4KHBvcy55LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnotMSwgTWF0aC5tYXgocG9zLnosIDApKVxuICAgIFxuICAgIGlzVW5vY2N1cGllZFBvczogKHBvcykgLT4gbm90IEBpc09jY3VwaWVkUG9zIHBvc1xuICAgIGlzT2NjdXBpZWRQb3M6ICAgKHBvcykgLT4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cblxuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcblxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGVcbiAgICAgICAgICAgIHB1c2hhYmxlT2JqZWN0LnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gb2JqZWN0LCBkaXJlY3Rpb24sIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgICAgICBmYWxzZVxuICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2hvd01lbnU6IChzZWxmKSAtPlxuXG4gICAgICAgIEB0ZXh0Py5kZWwoKVxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnbG9hZCcgICA9PiBAbGV2ZWxTZWxlY3Rpb24gPSBuZXcgTGV2ZWxTZWwgQFxuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXNldCcgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtICdjb25maWcnID0+IEBtZW51ID0gbmV3IENvbmZpZ1xuICAgICAgICBAbWVudS5hZGRJdGVtICdoZWxwJyAgID0+IEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuICAgICAgICBAbWVudS5hZGRJdGVtICdxdWl0JyAgIC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgXG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnaHQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24ubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDgsIEBzcGVlZCsxOyBwcmVmcy5zZXQgJ3NwZWVkJyBAc3BlZWQtM1xuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCA0LCBAc3BlZWQtMTsgcHJlZnMuc2V0ICdzcGVlZCcgQHNwZWVkLTNcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnRVcCBtb2QsIGtleSwgY29tYm8sIGV2ZW50ICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZFxuXG4iXX0=
//# sourceURL=../coffee/world.coffee