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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLCtWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSOztBQUNkLFNBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLE1BQUEsR0FBYyxPQUFB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QU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsQ0FBQztRQUM1QixNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLENBQUM7UUFFNUIsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxNQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFdBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsU0FBUCxHQUFxQixVQUFVLENBQUM7UUFDaEMsTUFBTSxDQUFDLFNBQVAsR0FBcUIsVUFBVSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFQ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LENBQUUsT0FBUCxDQUFBOztRQUNBLHVDQUFpQixDQUFFLG9CQUFULENBQThCLEdBQTlCLEVBQW1DLEdBQW5DLEVBQXdDLEtBQXhDLEVBQStDLEtBQS9DLFVBQVY7QUFBQSxtQkFBQTs7QUFDQSxnQkFBTyxLQUFQO0FBQUEsaUJBQ1MsS0FEVDt1QkFDb0IsSUFBQyxDQUFBLFFBQUQsQ0FBQTtBQURwQixpQkFFUyxHQUZUO2dCQUVrQixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBbkI7dUJBQXNCLEtBQUssQ0FBQyxHQUFOLENBQVUsT0FBVixFQUFrQixJQUFDLENBQUEsS0FBRCxHQUFPLENBQXpCO0FBRmpELGlCQUdTLEdBSFQ7Z0JBR2tCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFuQjt1QkFBc0IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQWtCLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBekI7QUFIakQsaUJBSVMsR0FKVDt1QkFJa0IsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUpsQjtJQVprQjs7b0JBa0J0QixrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtBQUVoQixZQUFBO1FBQUEsSUFBVSxJQUFDLENBQUEsY0FBWDtBQUFBLG1CQUFBOztRQUNBLHVDQUFpQixDQUFFLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLFVBQVY7QUFBQTs7SUFIZ0I7Ozs7R0E5ekJKOztBQW0wQnBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgXG4jICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgXG5cbnsgcG9zdCwgcmFuZEludCwgY29sb3JzLCBhYnNNaW4sIHByZWZzLCBjbGFtcCwgbGFzdCwga2Vycm9yLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuU2l6ZSAgICAgICAgPSByZXF1aXJlICcuL2xpYi9zaXplJ1xuQ2VsbCAgICAgICAgPSByZXF1aXJlICcuL2NlbGwnXG5HYXRlICAgICAgICA9IHJlcXVpcmUgJy4vZ2F0ZSdcbkNhbWVyYSAgICAgID0gcmVxdWlyZSAnLi9jYW1lcmEnXG5MaWdodCAgICAgICA9IHJlcXVpcmUgJy4vbGlnaHQnXG5MZXZlbHMgICAgICA9IHJlcXVpcmUgJy4vbGV2ZWxzJ1xuUGxheWVyICAgICAgPSByZXF1aXJlICcuL3BsYXllcidcblNvdW5kICAgICAgID0gcmVxdWlyZSAnLi9zb3VuZCdcbkNhZ2UgICAgICAgID0gcmVxdWlyZSAnLi9jYWdlJ1xuVGltZXIgICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQWN0b3IgICAgICAgPSByZXF1aXJlICcuL2FjdG9yJ1xuSXRlbSAgICAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5BY3Rpb24gICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5Db25maWcgICAgICA9IHJlcXVpcmUgJy4vY29uZmlnJ1xuU2NyZWVuVGV4dCAgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuUHVzaGFibGUgICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuU2NoZW1lICAgICAgPSByZXF1aXJlICcuL3NjaGVtZSdcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblZlY3RvciAgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUG9zICAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5ub3cgICAgICAgICA9IHJlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZS5ub3dcbkxldmVsU2VsICAgID0gcmVxdWlyZSAnLi9sZXZlbHNlbGVjdGlvbidcbntcbldhbGwsXG5XaXJlLFxuR2VhcixcblN0b25lLFxuU3dpdGNoLFxuTW90b3JHZWFyLFxuTW90b3JDeWxpbmRlcixcbkZhY2V9ICAgICAgID0gcmVxdWlyZSAnLi9pdGVtcydcblxud29ybGQgICAgICAgPSBudWxsXG5cbmNsYXNzIFdvcmxkIGV4dGVuZHMgQWN0b3JcbiAgICBcbiAgICBAbGV2ZWxzID0gbnVsbFxuICAgIFxuICAgIEBub3JtYWxzID0gW1xuICAgICAgICAgICAgbmV3IFZlY3RvciAxLCAwLCAwXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDEsIDAgXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDAsIDAsIDFcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgLTEsMCwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwtMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwtMVxuICAgIF1cbiAgICBcbiAgICBAOiAoQHZpZXcsIEBwcmV2aWV3KSAtPlxuICAgICAgICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAXG4gICAgICAgIFxuICAgICAgICBAc3BlZWQgICAgICA9IDYgKyAocHJlZnMuZ2V0ICdzcGVlZCcgMykgLSAzXG4gICAgICAgIFxuICAgICAgICBAcmFzdGVyU2l6ZSA9IDAuMDVcblxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQG5vUm90YXRpb25zID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBzY3JlZW5TaXplID0gbmV3IFNpemUgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuICAgICAgICAjIGtsb2cgXCJ2aWV3IEBzY3JlZW5TaXplOlwiLCBAc2NyZWVuU2l6ZVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIgXG4gICAgICAgICAgICBhbnRpYWxpYXM6ICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBsb2dhcml0aG1pY0RlcHRoQnVmZmVyOiBmYWxzZVxuICAgICAgICAgICAgYXV0b0NsZWFyOiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIHNvcnRPYmplY3RzOiAgICAgICAgICAgIHRydWVcblxuICAgICAgICBAcmVuZGVyZXIuc2V0U2l6ZSBAdmlldy5vZmZzZXRXaWR0aCwgQHZpZXcub2Zmc2V0SGVpZ2h0XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAudHlwZSA9IFRIUkVFLlBDRlNvZnRTaGFkb3dNYXBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwIFxuICAgICAgICAjICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgIFxuICAgICAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICAgICBcbiAgICAgICAgQHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcbiAgICAgICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG4gICAgICAgIEBzdW4gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZlxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSBpZiBAcGxheWVyP1xuICAgICAgICBAc2NlbmUuYWRkIEBzdW5cbiAgICAgICAgXG4gICAgICAgIEBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCAweDExMTExMVxuICAgICAgICBAc2NlbmUuYWRkIEBhbWJpZW50XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICBAb2JqZWN0cyA9IFtdXG4gICAgICAgIEBsaWdodHMgID0gW11cbiAgICAgICAgQGNlbGxzICAgPSBbXSBcbiAgICAgICAgQHNpemUgICAgPSBuZXcgUG9zKClcbiAgICAgICAgQGRlcHRoICAgPSAtTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgICAgICAgXG4gICAgICAgIEB0aW1lciA9IG5ldyBUaW1lciBAXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEByZW5kZXJlci5kb21FbGVtZW50XG4gICAgIFxuICAgIEBpbml0OiAodmlldykgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiB3b3JsZD9cbiAgICAgICAgXG4gICAgICAgIEBpbml0R2xvYmFsKClcbiAgICAgICAgICAgIFxuICAgICAgICB3b3JsZCA9IG5ldyBXb3JsZCB2aWV3XG4gICAgICAgIHdvcmxkLm5hbWUgPSAnd29ybGQnXG4gICAgICAgIGluZGV4ID0gcHJlZnMuZ2V0ICdsZXZlbCcgMFxuICAgICAgICB3b3JsZC5jcmVhdGUgQGxldmVscy5saXN0W2luZGV4XVxuICAgICAgICB3b3JsZFxuICAgICAgICBcbiAgICBAaW5pdEdsb2JhbDogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxzP1xuICAgICAgICAgIFxuICAgICAgICBTY3JlZW5UZXh0LmluaXQoKVxuICAgICAgICBTb3VuZC5pbml0KClcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5yb3QwICAgID0gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICBnbG9iYWwucm90eDkwICA9IFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgZ2xvYmFsLnJvdHk5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWlxuICAgICAgICBnbG9iYWwucm90eDE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWlxuICAgICAgICBnbG9iYWwucm90eDI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgZ2xvYmFsLnJvdHoyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWlxuICAgICAgICBcbiAgICAgICAgZ2xvYmFsLlh1cFkgICAgICAgID0gUXVhdGVybmlvbi5YdXBZXG4gICAgICAgIGdsb2JhbC5YdXBaICAgICAgICA9IFF1YXRlcm5pb24uWHVwWlxuICAgICAgICBnbG9iYWwuWGRvd25ZICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWVxuICAgICAgICBnbG9iYWwuWGRvd25aICAgICAgPSBRdWF0ZXJuaW9uLlhkb3duWlxuICAgICAgICBnbG9iYWwuWXVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLll1cFhcbiAgICAgICAgZ2xvYmFsLll1cFogICAgICAgID0gUXVhdGVybmlvbi5ZdXBaXG4gICAgICAgIGdsb2JhbC5ZZG93blggICAgICA9IFF1YXRlcm5pb24uWWRvd25YXG4gICAgICAgIGdsb2JhbC5ZZG93blogICAgICA9IFF1YXRlcm5pb24uWWRvd25aXG4gICAgICAgIGdsb2JhbC5adXBYICAgICAgICA9IFF1YXRlcm5pb24uWnVwWFxuICAgICAgICBnbG9iYWwuWnVwWSAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFlcbiAgICAgICAgZ2xvYmFsLlpkb3duWCAgICAgID0gUXVhdGVybmlvbi5aZG93blhcbiAgICAgICAgZ2xvYmFsLlpkb3duWSAgICAgID0gUXVhdGVybmlvbi5aZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWSAgID0gUXVhdGVybmlvbi5taW51c1h1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWHVwWiAgID0gUXVhdGVybmlvbi5taW51c1h1cFpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25ZID0gUXVhdGVybmlvbi5taW51c1hkb3duWVxuICAgICAgICBnbG9iYWwubWludXNYZG93blogPSBRdWF0ZXJuaW9uLm1pbnVzWGRvd25aXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFggICA9IFF1YXRlcm5pb24ubWludXNZdXBYXG4gICAgICAgIGdsb2JhbC5taW51c1l1cFogICA9IFF1YXRlcm5pb24ubWludXNZdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWCA9IFF1YXRlcm5pb24ubWludXNZZG93blhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWWRvd25aID0gUXVhdGVybmlvbi5taW51c1lkb3duWlxuICAgICAgICBnbG9iYWwubWludXNadXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWFxuICAgICAgICBnbG9iYWwubWludXNadXBZICAgPSBRdWF0ZXJuaW9uLm1pbnVzWnVwWVxuICAgICAgICBnbG9iYWwubWludXNaZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1pkb3duWSA9IFF1YXRlcm5pb24ubWludXNaZG93bllcblxuICAgICAgICBAbGV2ZWxzID0gbmV3IExldmVsc1xuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIuZG9tRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgY3JlYXRlOiAod29ybGREaWN0PXt9LCBzaG93TmFtZT10cnVlKSAtPiAjIGNyZWF0ZXMgdGhlIHdvcmxkIGZyb20gYSBsZXZlbCBuYW1lIG9yIGEgZGljdGlvbmFyeVxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuY3JlYXRlXCIgd29ybGREaWN0XG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZERpY3RcbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBAZGljdCA9IFdvcmxkLmxldmVscy5kaWN0W3dvcmxkRGljdF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbGV2ZWxfbmFtZSA9IHdvcmxkRGljdC5uYW1lXG4gICAgICAgICAgICAgICAgQGRpY3QgPSB3b3JsZERpY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGxldmVsX2luZGV4ID0gV29ybGQubGV2ZWxzLmxpc3QuaW5kZXhPZiBAbGV2ZWxfbmFtZVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBwcmV2aWV3XG4gICAgICAgICAgICBwcmVmcy5zZXQgJ2xldmVsJyBAbGV2ZWxfaW5kZXhcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIldvcmxkLmNyZWF0ZSAje0BsZXZlbF9pbmRleH0gc2l6ZTogI3tuZXcgUG9zKEBkaWN0W1wic2l6ZVwiXSkuc3RyKCl9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gJyN7QGxldmVsX25hbWV9JyBzY2hlbWU6ICcje0BkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J30nXCJcblxuICAgICAgICBAY3JlYXRpbmcgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFNpemUgQGRpY3Quc2l6ZSAjIHRoaXMgcmVtb3ZlcyBhbGwgb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgQGFwcGx5U2NoZW1lIEBkaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGludHJvIHRleHQgICBcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlldyBhbmQgc2hvd05hbWVcbiAgICAgICAgICAgIEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3QubmFtZVxuICAgICAgICBcbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gZXhpdHNcblxuICAgICAgICBpZiBAZGljdC5leGl0cz9cbiAgICAgICAgICAgIGV4aXRfaWQgPSAwXG4gICAgICAgICAgICBmb3IgZW50cnkgaW4gQGRpY3QuZXhpdHNcbiAgICAgICAgICAgICAgICBleGl0X2dhdGUgPSBuZXcgR2F0ZSBlbnRyeVtcImFjdGl2ZVwiXVxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5uYW1lID0gZW50cnlbXCJuYW1lXCJdID8gXCJleGl0ICN7ZXhpdF9pZH1cIlxuICAgICAgICAgICAgICAgIEFjdGlvbi5pZCA/PSAwXG4gICAgICAgICAgICAgICAgZXhpdEFjdGlvbiA9IG5ldyBBY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgIEFjdGlvbi5pZFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiBAZXhpdExldmVsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogQWN0aW9uLk9OQ0VcblxuICAgICAgICAgICAgICAgIGV4aXRfZ2F0ZS5nZXRFdmVudFdpdGhOYW1lKFwiZW50ZXJcIikuYWRkQWN0aW9uIGV4aXRBY3Rpb25cbiAgICAgICAgICAgICAgICBpZiBlbnRyeS5wb3NpdGlvbj9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gQGRlY2VudGVyIGVudHJ5LnBvc2l0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBlbnRyeS5jb29yZGluYXRlcz9cbiAgICAgICAgICAgICAgICAgICAgcG9zID0gbmV3IFBvcyBlbnRyeS5jb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBleGl0X2dhdGUsIHBvc1xuICAgICAgICAgICAgICAgIGV4aXRfaWQgKz0gMVxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNyZWF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QuY3JlYXRlP1xuICAgICAgICAgICAgaWYgXy5pc0Z1bmN0aW9uIEBkaWN0LmNyZWF0ZVxuICAgICAgICAgICAgICAgIEBkaWN0LmNyZWF0ZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAga2xvZyBcIldvcmxkLmNyZWF0ZSBbV0FSTklOR10gQGRpY3QuY3JlYXRlIG5vdCBhIGZ1bmN0aW9uIVwiXG5cbiAgICAgICAgIyAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gcGxheWVyXG5cbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXJcblxuICAgICAgICBAcGxheWVyLnNldE9yaWVudGF0aW9uIEBkaWN0LnBsYXllci5vcmllbnRhdGlvbiA/IHJvdHg5MFxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zZXRPcmllbnRhdGlvbiBAcGxheWVyLm9yaWVudGF0aW9uXG5cbiAgICAgICAgaWYgQGRpY3QucGxheWVyLnBvc2l0aW9uP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIEBkZWNlbnRlciBAZGljdC5wbGF5ZXIucG9zaXRpb25cbiAgICAgICAgZWxzZSBpZiBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgQHBsYXllciwgbmV3IFBvcyBAZGljdC5wbGF5ZXIuY29vcmRpbmF0ZXNcblxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKCkubWludXMgQHBsYXllci5kaXJlY3Rpb25cbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5GT0xMT1dcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0UG9zaXRpb24gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgICAgIEBzZXRDYW1lcmFNb2RlIENhbWVyYS5JTlNJREUgaWYgQGRpY3QuY2FtZXJhID09ICdpbnNpZGUnXG4gICAgICAgIFxuICAgICAgICBAY3JlYXRpbmcgPSBmYWxzZVxuICAgIFxuICAgIHJlc3RhcnQ6ID0+IEBjcmVhdGUgQGRpY3RcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBhcHBseVNjaGVtZTogKHNjaGVtZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgY29sb3JzID0gXy5jbG9uZSBTY2hlbWVbc2NoZW1lXVxuICAgICAgICBcbiAgICAgICAgb3BhY2l0eSA9XG4gICAgICAgICAgICBzdG9uZTogMC43XG4gICAgICAgICAgICBib21iOiAgMC45XG4gICAgICAgICAgICB0ZXh0OiAgMFxuICAgICAgICAgICAgXG4gICAgICAgIHNoaW5pbmVzcyA9IFxuICAgICAgICAgICAgdGlyZTogICA0XG4gICAgICAgICAgICBwbGF0ZTogIDEwXG4gICAgICAgICAgICByYXN0ZXI6IDIwXG4gICAgICAgICAgICB3YWxsOiAgIDIwXG4gICAgICAgICAgICBzdG9uZTogIDIwXG4gICAgICAgICAgICBnZWFyOiAgIDIwXG4gICAgICAgICAgICB0ZXh0OiAgIDIwMFxuICAgICAgICAgICAgXG4gICAgICAgIGNvbG9ycy5wbGF0ZS5lbWlzc2l2ZSA/PSBjb2xvcnMucGxhdGUuY29sb3JcbiAgICAgICAgY29sb3JzLmJ1bGIuZW1pc3NpdmUgID89IGNvbG9ycy5idWxiLmNvbG9yXG4gICAgICAgIGNvbG9ycy5tZW51ID89IHt9ICAgXG4gICAgICAgIGNvbG9ycy5tZW51LmNvbG9yID89IGNvbG9ycy5nZWFyLmNvbG9yXG4gICAgICAgIGNvbG9ycy5yYXN0ZXIgPz0ge30gICAgXG4gICAgICAgIGNvbG9ycy5yYXN0ZXIuY29sb3IgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy53YWxsID89IHt9XG4gICAgICAgIGNvbG9ycy53YWxsLmNvbG9yID89IG5ldyBUSFJFRS5Db2xvcihjb2xvcnMucGxhdGUuY29sb3IpLm11bHRpcGx5U2NhbGFyIDAuNlxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlID89IHt9XG4gICAgICAgIGNvbG9ycy53aXJlUGxhdGUuY29sb3IgPz0gY29sb3JzLndpcmUuY29sb3JcbiAgICAgICAgZm9yIGssdiBvZiBjb2xvcnNcbiAgICAgICAgICAgIG1hdCA9IE1hdGVyaWFsW2tdXG4gICAgICAgICAgICBtYXQuY29sb3IgICAgPSB2LmNvbG9yXG4gICAgICAgICAgICBtYXQub3BhY2l0eSAgPSB2Lm9wYWNpdHkgPyBvcGFjaXR5W2tdID8gMVxuICAgICAgICAgICAgbWF0LnNwZWN1bGFyID0gdi5zcGVjdWxhciA/IG5ldyBUSFJFRS5Db2xvcih2LmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjJcbiAgICAgICAgICAgIG1hdC5lbWlzc2l2ZSA9IHYuZW1pc3NpdmUgPyBuZXcgVEhSRUUuQ29sb3IgMCwwLDBcbiAgICAgICAgICAgIGlmIHNoaW5pbmVzc1trXT9cbiAgICAgICAgICAgICAgICBtYXQuc2hpbmluZXNzID0gdi5zaGluaW5lc3MgPyBzaGluaW5lc3Nba11cblxuICAgICMgIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZExpZ2h0OiAobGlnaHQpIC0+XG4gICAgICAgIEBsaWdodHMucHVzaCBsaWdodFxuICAgICAgICBAZW5hYmxlU2hhZG93cyB0cnVlIGlmIGxpZ2h0LnNoYWRvd1xuICAgICAgICBcbiAgICByZW1vdmVMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgbGlnaHRcbiAgICAgICAgZm9yIGwgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgc2hhZG93ID0gdHJ1ZSBpZiBsLnNoYWRvd1xuICAgICAgICBAZW5hYmxlU2hhZG93cyBzaGFkb3dcblxuICAgIGVuYWJsZVNoYWRvd3M6IChlbmFibGUpIC0+XG4gICAgICAgIEByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGVuYWJsZVxuICAgIFxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgICAgICAgXG4gICAgZXhpdExldmVsOiAoYWN0aW9uKSA9PlxuICAgICAgICBcbiAgICAgICAgcHJlZnMuc2V0IFwic29sdmVk4pa4I3tXb3JsZC5sZXZlbHMubGlzdFt3b3JsZC5sZXZlbF9pbmRleF19XCIgdHJ1ZVxuICAgICAgICBuZXh0TGV2ZWwgPSAod29ybGQubGV2ZWxfaW5kZXgrKF8uaXNOdW1iZXIoYWN0aW9uKSBhbmQgYWN0aW9uIG9yIDEpKSAlIFdvcmxkLmxldmVscy5saXN0Lmxlbmd0aFxuICAgICAgICB3b3JsZC5jcmVhdGUgV29ybGQubGV2ZWxzLmxpc3RbbmV4dExldmVsXVxuXG4gICAgYWN0aXZhdGU6IChvYmplY3ROYW1lKSAtPiBAZ2V0T2JqZWN0V2l0aE5hbWUob2JqZWN0TmFtZSk/LnNldEFjdGl2ZT8gdHJ1ZVxuICAgIFxuICAgIGRlY2VudGVyOiAoeCx5LHopIC0+IG5ldyBQb3MoeCx5LHopLnBsdXMgQHNpemUuZGl2IDJcblxuICAgIGlzVmFsaWRQb3M6IChwb3MpIC0+IFxuICAgICAgICBwID0gbmV3IFBvcyBwb3NcbiAgICAgICAgcC54ID49IDAgYW5kIHAueCA8IEBzaXplLnggYW5kIHAueSA+PSAwIGFuZCBwLnkgPCBAc2l6ZS55IGFuZCBwLnogPj0gMCBhbmQgcC56IDwgQHNpemUuelxuICAgICAgICBcbiAgICBpc0ludmFsaWRQb3M6IChwb3MpIC0+IG5vdCBAaXNWYWxpZFBvcyBwb3NcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAgICAgMDAwXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcbiAgICBcbiAgICBzZXRTaXplOiAoc2l6ZSkgLT5cbiAgICAgICAgQGRlbGV0ZUFsbE9iamVjdHMoKVxuICAgICAgICBAY2VsbHMgPSBbXVxuICAgICAgICBAc2l6ZSA9IG5ldyBQb3Mgc2l6ZVxuICAgICAgICAjIGNhbGN1YXRlIG1heCBkaXN0YW5jZSAoZm9yIHBvc2l0aW9uIHJlbGF0aXZlIHNvdW5kKVxuICAgICAgICBAbWF4X2Rpc3RhbmNlID0gTWF0aC5tYXgoQHNpemUueCwgTWF0aC5tYXgoQHNpemUueSwgQHNpemUueikpICAjIGhldXJpc3RpYyBvZiBhIGhldXJpc3RpYyA6LSlcbiAgICAgICAgQGNhZ2U/LmRlbCgpXG4gICAgICAgIEBjYWdlID0gbmV3IENhZ2UgQHNpemUsIEByYXN0ZXJTaXplXG5cbiAgICBnZXRDZWxsQXRQb3M6IChwb3MpIC0+IHJldHVybiBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gaWYgQGlzVmFsaWRQb3MgcG9zXG4gICAgZ2V0Qm90QXRQb3M6ICAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgQm90LCBuZXcgUG9zIHBvc1xuXG4gICAgcG9zVG9JbmRleDogICAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCAqIEBzaXplLnogKiBAc2l6ZS55ICsgcC55ICogQHNpemUueiArIHAuelxuICAgICAgICBcbiAgICBpbmRleFRvUG9zOiAgIChpbmRleCkgLT4gXG4gICAgICAgIGxzaXplID0gQHNpemUueiAqIEBzaXplLnlcbiAgICAgICAgbHJlc3QgPSBpbmRleCAlIGxzaXplXG4gICAgICAgIG5ldyBQb3MgaW5kZXgvbHNpemUsIGxyZXN0L0BzaXplLnosIGxyZXN0JUBzaXplLnpcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkT2JqZWN0QXRQb3M6IChvYmplY3QsIHgsIHksIHopIC0+XG4gICAgICAgIHBvcyA9IG5ldyBQb3MgeCwgeSwgelxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0QXRQb3MgI3tvYmplY3QubmFtZX1cIiwgcG9zXG4gICAgICAgIEBhZGRPYmplY3Qgb2JqZWN0XG5cbiAgICBhZGRPYmplY3RMaW5lOiAob2JqZWN0LCBzeCxzeSxzeiwgZXgsZXksZXopIC0+XG4gICAgICAgICMga2xvZyBcIndvcmxkLmFkZE9iamVjdExpbmUgc3g6I3tzeH0gc3k6I3tzeX0gc3o6I3tzen0gZXg6I3tleH0gZXk6I3tleX0gZXo6I3tlen1cIlxuICAgICAgICBpZiBzeCBpbnN0YW5jZW9mIFBvcyBvciBBcnJheS5pc0FycmF5IHN4XG4gICAgICAgICAgICBzdGFydCA9IHN4XG4gICAgICAgICAgICBlbmQgICA9IHN5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IFBvcyBzeCxzeSxzelxuICAgICAgICAgICAgZW5kICAgPSBuZXcgUG9zIGV4LGV5LGV6XG4gICAgICAgICMgYWRkcyBhIGxpbmUgb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gc3RhcnQgYW5kIGVuZCBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgZW5kIGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBlbmQgPSBbZW5kLngsIGVuZC55LCBlbmQuel1cbiAgICAgICAgW2V4LCBleSwgZXpdID0gZW5kXG5cbiAgICAgICAgaWYgc3RhcnQgaW5zdGFuY2VvZiBQb3NcbiAgICAgICAgICAgIHN0YXJ0ID0gW3N0YXJ0LngsIHN0YXJ0LnksIHN0YXJ0LnpdXG4gICAgICAgIFtzeCwgc3ksIHN6XSA9IHN0YXJ0XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgXG4gICAgICAgIGRpZmYgPSBbZXgtc3gsIGV5LXN5LCBlei1zel1cbiAgICAgICAgbWF4ZGlmZiA9IF8ubWF4IGRpZmYubWFwIE1hdGguYWJzXG4gICAgICAgIGRlbHRhcyA9IGRpZmYubWFwIChhKSAtPiBhL21heGRpZmZcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5tYXhkaWZmXVxuICAgICAgICAgICAgIyBwb3MgPSBhcHBseShQb3MsIChtYXAgKGxhbWJkYSBhLCBiOiBpbnQoYStpKmIpLCBzdGFydCwgZGVsdGFzKSkpXG4gICAgICAgICAgICBwb3MgPSBuZXcgUG9zIChzdGFydFtqXStpKmRlbHRhc1tqXSBmb3IgaiBpbiBbMC4uMl0pXG4gICAgICAgICAgICAjIGtsb2cgXCJhZGRPYmplY3RMaW5lICN7aX06XCIsIHBvc1xuICAgICAgICAgICAgaWYgQGlzVW5vY2N1cGllZFBvcyBwb3NcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICBcbiAgICBhZGRPYmplY3RQb2x5OiAob2JqZWN0LCBwb2ludHMsIGNsb3NlPXRydWUpIC0+XG4gICAgICAgICMgYWRkcyBhIHBvbHlnb24gb2Ygb2JqZWN0cyBvZiB0eXBlIHRvIHRoZSB3b3JsZC4gcG9pbnRzIHNob3VsZCBiZSAzLXR1cGxlcyBvciBQb3Mgb2JqZWN0c1xuICAgICAgICBpZiBjbG9zZVxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggcG9pbnRzWzBdXG4gICAgICAgIGZvciBpbmRleCBpbiBbMS4uLnBvaW50cy5sZW5ndGhdXG4gICAgICAgICAgICBAYWRkT2JqZWN0TGluZSBvYmplY3QsIHBvaW50c1tpbmRleC0xXSwgcG9pbnRzW2luZGV4XVxuICAgICAgIFxuICAgIGFkZE9iamVjdFJhbmRvbTogKG9iamVjdCwgbnVtYmVyKSAtPlxuICAgICAgICAjIGFkZHMgbnVtYmVyIG9iamVjdHMgb2YgdHlwZSBhdCByYW5kb20gcG9zaXRpb25zIHRvIHRoZSB3b3JsZFxuICAgICAgICBmb3IgaSBpbiBbMC4uLm51bWJlcl1cbiAgICAgICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2V0T2JqZWN0UmFuZG9tIG9iamVjdCgpXG4gICAgICAgIFxuICAgIHNldE9iamVjdFJhbmRvbTogKG9iamVjdCkgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgb2JqZWN0U2V0ID0gZmFsc2VcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgd2hpbGUgbm90IG9iamVjdFNldCAjIGhhY2sgYWxlcnQhXG4gICAgICAgICAgICByYW5kb21Qb3MgPSBuZXcgUG9zIHJhbmRJbnQoQHNpemUueCksIHJhbmRJbnQoQHNpemUueSksIHJhbmRJbnQoQHNpemUueilcbiAgICAgICAgICAgIGlmIG5vdCBvYmplY3QuaXNTcGFjZUVnb2lzdGljKCkgb3IgQGlzVW5vY2N1cGllZFBvcyByYW5kb21Qb3MgXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcmFuZG9tUG9zXG4gICAgICAgICAgICAgICAgb2JqZWN0U2V0ID0gdHJ1ZVxuXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgICAgICAwMDBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAgICAgIChjbHNzKSAgICAgIC0+IEBvYmplY3RzLmZpbHRlciAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPYmplY3RzT2ZUeXBlQXRQb3M6IChjbHNzLCBwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2JqZWN0c09mVHlwZShjbHNzKSA/IFtdXG4gICAgZ2V0T2JqZWN0T2ZUeXBlQXRQb3M6ICAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldFJlYWxPYmplY3RPZlR5cGUoY2xzcylcbiAgICBnZXRPY2N1cGFudEF0UG9zOiAgICAgICAgICAgIChwb3MpIC0+IEBnZXRDZWxsQXRQb3MocG9zKT8uZ2V0T2NjdXBhbnQoKVxuICAgIGdldFJlYWxPY2N1cGFudEF0UG9zOiAocG9zKSAtPlxuICAgICAgICBvY2N1cGFudCA9IEBnZXRPY2N1cGFudEF0UG9zIHBvc1xuICAgICAgICBpZiBvY2N1cGFudCBhbmQgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgIG9jY3VwYW50Lm9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvY2N1cGFudFxuICAgIFxuICAgIHN3aXRjaEF0UG9zOiAocG9zKSAtPiBAZ2V0T2JqZWN0T2ZUeXBlQXRQb3MgU3dpdGNoLCBwb3NcbiAgICBcbiAgICBzZXRPYmplY3RBdFBvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICBcbiAgICAgICAgcG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBpbnZhbGlkIHBvczpcIiwgcG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpXG4gICAgICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCA9IGNlbGwuZ2V0T2NjdXBhbnQoKVxuICAgICAgICAgICAgICAgICAgICBpZiBvY2N1cGFudCBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQudGltZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZyBcIldvcmxkLnNldE9iamVjdEF0UG9zIFtXQVJOSU5HXSBhbHJlYWR5IG9jY3VwaWVkIHRpbWU6XCIsIG9jY3VwYW50LnRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50LmRlbCgpICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGFueXdheSAuIGRlbGV0ZSBpdFxuICAgICAgICBcbiAgICAgICAgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIG5vdCBjZWxsP1xuICAgICAgICAgICAgY2VsbEluZGV4ID0gQHBvc1RvSW5kZXgocG9zKVxuICAgICAgICAgICAgY2VsbCA9IG5ldyBDZWxsKClcbiAgICAgICAgICAgIEBjZWxsc1tjZWxsSW5kZXhdID0gY2VsbFxuICAgICAgICBcbiAgICAgICAgb2JqZWN0LnNldFBvc2l0aW9uIHBvc1xuICAgICAgICBjZWxsLmFkZE9iamVjdCBvYmplY3RcblxuICAgIHVuc2V0T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBwb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICBjZWxsLnJlbW92ZU9iamVjdCBvYmplY3RcbiAgICAgICAgICAgIGlmIGNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldID0gbnVsbFxuICAgICAgICBlbHNlIFxuICAgICAgICAgICAga2xvZyAnd29ybGQudW5zZXRPYmplY3QgW1dBUk5JTkddIG5vIGNlbGwgYXQgcG9zOicsIHBvc1xuXG4gICAgbmV3T2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgaWYgb2JqZWN0LnN0YXJ0c1dpdGggJ25ldydcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICByZXR1cm4gbmV3IChyZXF1aXJlIFwiLi8je29iamVjdC50b0xvd2VyQ2FzZSgpfVwiKSgpXG4gICAgICAgIGlmIG9iamVjdCBpbnN0YW5jZW9mIEl0ZW1cbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdCgpXG4gICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgTGlnaHRcbiAgICAgICAgICAgIEBsaWdodHMucHVzaCBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3RcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdFxuICAgICAgICBfLnB1bGwgQGxpZ2h0cywgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAb2JqZWN0cywgb2JqZWN0XG4gICAgXG4gICAgdG9nZ2xlOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgb2JqZWN0ID0gQGdldE9iamVjdFdpdGhOYW1lIG9iamVjdE5hbWUgXG4gICAgICAgIG9iamVjdC5nZXRBY3Rpb25XaXRoTmFtZShcInRvZ2dsZVwiKS5wZXJmb3JtKClcbiAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgZGVsZXRlQWxsT2JqZWN0czogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWxsQWN0aW9ucygpXG4gICAgXG4gICAgICAgIGlmIEBwbGF5ZXI/XG4gICAgICAgICAgICBAcGxheWVyLmRlbCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQGxpZ2h0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIGxpZ2h0IG5vIGF1dG8gcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBAbGlnaHRzLnBvcCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAb2JqZWN0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBvYmplY3Qgbm8gYXV0byByZW1vdmUgI3tsYXN0KEBvYmplY3RzKS5uYW1lfVwiXG4gICAgICAgICAgICAgICAgQG9iamVjdHMucG9wKClcbiAgICBcbiAgICBkZWxldGVPYmplY3RzV2l0aENsYXNzTmFtZTogKGNsYXNzTmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gXy5jbG9uZSBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgY2xhc3NOYW1lID09IG8uZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICBvLmRlbCgpXG4gICAgXG4gICAgZ2V0T2JqZWN0V2l0aE5hbWU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0TmFtZSA9PSBvLm5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICBrZXJyb3IgXCJXb3JsZC5nZXRPYmplY3RXaXRoTmFtZSBbV0FSTklOR10gbm8gb2JqZWN0IHdpdGggbmFtZSAje29iamVjdE5hbWV9XCJcbiAgICAgICAgbnVsbFxuICAgIFxuICAgIHNldENhbWVyYU1vZGU6IChtb2RlKSAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gY2xhbXAgQ2FtZXJhLklOU0lERSwgQ2FtZXJhLkZPTExPVywgbW9kZVxuICAgIFxuICAgIGNoYW5nZUNhbWVyYU1vZGU6IC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSAoQHBsYXllci5jYW1lcmEubW9kZSsxKSAlIChDYW1lcmEuRk9MTE9XKzEpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG9iamVjdFdpbGxNb3ZlVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZVBvcy5lcWwgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSBlcXVhbCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgaWYgdGFyZ2V0Q2VsbFxuICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgPSB0YXJnZXRDZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3RBdE5ld1Bvcy50aW1lIDwgMCBhbmQgLW9iamVjdEF0TmV3UG9zLnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICMgdGVtcG9yYXJ5IG9iamVjdCBhdCBuZXcgcG9zIHdpbGwgdmFuaXNoIGJlZm9yZSBvYmplY3Qgd2lsbCBhcnJpdmUgLiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEF0TmV3UG9zLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IHRpbWluZyBjb25mbGljdCBhdCBwb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gYWxyZWFkeSBvY2N1cGllZDpcIiwgdGFyZ2V0UG9zIFxuICAgIFxuICAgICAgICBpZiBvYmplY3QubmFtZSAhPSAncGxheWVyJ1xuICAgICAgICAgICAgQHVuc2V0T2JqZWN0IG9iamVjdCAjIHJlbW92ZSBvYmplY3QgZnJvbSBjZWxsIGdyaWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgb2xkIHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHNvdXJjZVBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnRpbWUgPSAtZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHNvdXJjZVBvcyBcblxuICAgICAgICAgICAgdG1wT2JqZWN0ID0gbmV3IFRtcE9iamVjdCBvYmplY3QgICMgaW5zZXJ0IHRtcCBvYmplY3QgYXQgbmV3IHBvc1xuICAgICAgICAgICAgdG1wT2JqZWN0LnNldFBvc2l0aW9uIHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gZHVyYXRpb25cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyB0bXBPYmplY3QsIHRhcmdldFBvcyBcblxuICAgIG9iamVjdE1vdmVkOiAobW92ZWRPYmplY3QsIGZyb20sIHRvKSAtPlxuICAgICAgICBcbiAgICAgICAgc291cmNlUG9zID0gbmV3IFBvcyBmcm9tXG4gICAgICAgIHRhcmdldFBvcyA9IG5ldyBQb3MgdG9cblxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAgIGtlcnJvciBcIldvcmxkLm9iamVjdE1vdmVkIFtXQVJOSU5HXSAje21vdmVkT2JqZWN0Lm5hbWV9IGludmFsaWQgdGFyZ2V0UG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgc291cmNlQ2VsbCA9IEBnZXRDZWxsQXRQb3Mgc291cmNlUG9zXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvc1xuICAgICAgICBcbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gc291cmNlQ2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG5cbiAgICAgICAgaWYgdG1wT2JqZWN0ID0gdGFyZ2V0Q2VsbD8uZ2V0T2JqZWN0T2ZUeXBlIFRtcE9iamVjdCBcbiAgICAgICAgICAgIHRtcE9iamVjdC5kZWwoKSBpZiB0bXBPYmplY3Qub2JqZWN0ID09IG1vdmVkT2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQGlzT2NjdXBpZWRQb3MgdGFyZ2V0UG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBvY2N1cGllZCB0YXJnZXQgcG9zOlwiIHRhcmdldFBvc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNvdXJjZUNlbGw/XG4gICAgICAgICAgICBzb3VyY2VDZWxsLnJlbW92ZU9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgaWYgc291cmNlQ2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgoc291cmNlUG9zKV0gPSBudWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgJ25vIHNvdXJjZUNlbGw/J1xuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgdGFyZ2V0UG9zICAgIFxuICAgICAgICBpZiBub3QgdGFyZ2V0Q2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4IHRhcmdldFBvcyBcbiAgICAgICAgICAgIHRhcmdldENlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IHRhcmdldENlbGxcblxuICAgICAgICBpZiB0YXJnZXRDZWxsP1xuICAgICAgICAgICAgdGFyZ2V0Q2VsbC5hZGRPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gbm8gdGFyZ2V0IGNlbGw/XCJcbiAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAgICBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICAgICAgXG4gICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgXG4gICAgICAgIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICAgICAgQGxldmVsU2VsZWN0aW9uLnN0ZXAoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgXG4gICAgICAgIGNhbWVyYSA9IEBwbGF5ZXI/LmNhbWVyYS5jYW1cbiAgICBcbiAgICAgICAgVGltZXIudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBUaW1lci5maW5pc2hBY3Rpb25zKClcbiAgICAgICAgXG4gICAgICAgIG8uc3RlcD8oKSBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICBcbiAgICAgICAgaWYgQHBsYXllciB0aGVuIEBzdGVwUGxheWVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgTWF0aC5mbG9vcihAc2NyZWVuU2l6ZS5oKjAuNzIpLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC4zKVxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAdGV4dC5zY2VuZSwgQHRleHQuY2FtZXJhIGlmIEB0ZXh0XG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQG1lbnUuc2NlbmUsIEBtZW51LmNhbWVyYSBpZiBAbWVudVxuXG4gICAgc3RlcFBsYXllcjogLT5cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAcHJldmlld1xuICAgICAgICAgICAgQHBsYXllci5jYW1lcmEuY2FtLmFzcGVjdCA9IEBzY3JlZW5TaXplLncgLyAoQHNjcmVlblNpemUuaCowLjY2KVxuICAgICAgICBAcGxheWVyLmNhbWVyYS5zdGVwKClcblxuICAgICAgICBTb3VuZC5zZXRNYXRyaXggQHBsYXllci5jYW1lcmFcbiAgICAgICAgICAgIFxuICAgICAgICBAcGxheWVyLnNldE9wYWNpdHkgY2xhbXAgMCwgMSwgQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKS5taW51cyhAcGxheWVyLmN1cnJlbnRfcG9zaXRpb24pLmxlbmd0aCgpLTAuNFxuICAgICAgICBcbiAgICAgICAgc3RvbmVzID0gW11cbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIGlmIG8gaW5zdGFuY2VvZiBTdG9uZVxuICAgICAgICAgICAgICAgIHN0b25lcy5wdXNoIG9cbiAgICAgICAgc3RvbmVzLnNvcnQgKGEsYikgPT4gYi5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKSAtIGEucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgXG4gICAgICAgIG9yZGVyID0gMTAwXG4gICAgICAgIGZvciBzdG9uZSBpbiBzdG9uZXNcbiAgICAgICAgICAgIHN0b25lLm1lc2gucmVuZGVyT3JkZXIgPSBvcmRlclxuICAgICAgICAgICAgb3JkZXIgKz0gMVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkID0gc3RvbmUucG9zaXRpb24ubWludXMoQHBsYXllci5jYW1lcmEuZ2V0UG9zaXRpb24oKSkubGVuZ3RoKClcbiAgICAgICAgICAgIGlmIGQgPCAxLjBcbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSBpZiBub3Qgc3RvbmUubWVzaC5tYXRlcmlhbC5vcmlnX29wYWNpdHk/XG4gICAgICAgICAgICAgICAgc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gMC4yICsgZCAqIDAuNVxuICAgICAgICAgICAgZWxzZSBpZiBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eVxuICAgICAgICBcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmNhbS5wb3NpdGlvblxuICAgICAgICBAcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcmVuZGVyZXIuc2V0Vmlld3BvcnQgMCwgMCwgQHNjcmVlblNpemUudywgTWF0aC5mbG9vciBAc2NyZWVuU2l6ZS5oKjAuNjZcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlci5yZW5kZXIgQHNjZW5lLCBAcGxheWVyLmNhbWVyYS5jYW0gICAgICAgIFxuICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGdldFRpbWU6IC0+IG5vdygpLnRvRml4ZWQgMFxuICAgIHNldFNwZWVkOiAocykgLT4gQHNwZWVkID0gc1xuICAgIGdldFNwZWVkOiAtPiBAc3BlZWRcbiAgICBtYXBNc1RpbWU6ICAodW5tYXBwZWQpIC0+IHBhcnNlSW50IDEwLjAgKiB1bm1hcHBlZC9Ac3BlZWRcbiAgICB1bm1hcE1zVGltZTogKG1hcHBlZCkgLT4gcGFyc2VJbnQgbWFwcGVkICogQHNwZWVkLzEwLjBcbiAgICAgICAgXG4gICAgY29udGludW91czogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uQ09OVElOVU9VU1xuXG4gICAgb25jZTogKGNiKSAtPlxuICAgICAgICBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgZnVuYzogY2JcbiAgICAgICAgICAgIG5hbWU6IFwib25jZVwiXG4gICAgICAgICAgICBtb2RlOiBBY3Rpb24uT05DRVxuXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgcmVzaXplZDogKHcsaCkgPT5cbiAgICAgICAgXG4gICAgICAgIEBhc3BlY3QgPSB3L2hcbiAgICAgICAgQHNjcmVlblNpemUgPSBuZXcgU2l6ZSB3LGhcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgICAgICBjYW1lcmE/LmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgY2FtZXJhPy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgQHJlbmRlcmVyPy5zZXRTaXplIHcsaFxuICAgICAgICBAdGV4dD8ucmVzaXplZCB3LGhcbiAgICAgICAgQG1lbnU/LnJlc2l6ZWQgdyxoXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxTZWxlY3Rpb24/LnJlc2l6ZWQgdyxoXG5cbiAgICBnZXROZWFyZXN0VmFsaWRQb3M6IChwb3MpIC0+XG4gICAgICAgIG5ldyBQb3MgTWF0aC5taW4oQHNpemUueC0xLCBNYXRoLm1heChwb3MueCwgMCkpLCBcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihAc2l6ZS55LTEsIE1hdGgubWF4KHBvcy55LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnotMSwgTWF0aC5tYXgocG9zLnosIDApKVxuICAgIFxuICAgIGlzVW5vY2N1cGllZFBvczogKHBvcykgLT4gbm90IEBpc09jY3VwaWVkUG9zIHBvc1xuICAgIGlzT2NjdXBpZWRQb3M6ICAgKHBvcykgLT4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cblxuICAgICAgICAjIHJldHVybnMgdHJ1ZSwgaWYgYSBwdXNoYWJsZSBvYmplY3QgaXMgYXQgcG9zIGFuZCBtYXkgYmUgcHVzaGVkXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvc1xuICAgICAgICBcbiAgICAgICAgZGlyZWN0aW9uID0gcG9zLm1pbnVzIG9iamVjdC5nZXRQb3MoKSAjIGRpcmVjdGlvbiBmcm9tIG9iamVjdCB0byBwdXNoYWJsZSBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zIHBvcy5wbHVzIGRpcmVjdGlvblxuICAgICAgICBcbiAgICAgICAgb2JqZWN0QXROZXdQb3MgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgaWYgb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zIGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICAgICAgdG1wT2JqZWN0ID0gb2JqZWN0QXROZXdQb3NcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0bXBPYmplY3QudGltZSA8IDAgYW5kIC10bXBPYmplY3QudGltZSA8PSBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC0+IGRlbGV0ZSBpdFxuICAgICAgICAgICAgICAgICAgICB0bXBPYmplY3QuZGVsKClcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICBcbiAgICAgICAgcHVzaGFibGVPYmplY3QgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcblxuICAgICAgICBpZiBwdXNoYWJsZU9iamVjdD8gYW5kIHB1c2hhYmxlT2JqZWN0IGluc3RhbmNlb2YgUHVzaGFibGVcbiAgICAgICAgICAgIHB1c2hhYmxlT2JqZWN0LnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gb2JqZWN0LCBkaXJlY3Rpb24sIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgICAgICBmYWxzZVxuICAgIFxuICAgICMgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2hvd01lbnU6IChzZWxmKSAtPlxuXG4gICAgICAgIEB0ZXh0Py5kZWwoKVxuICAgICAgICBAbWVudSA9IG5ldyBNZW51KClcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnbG9hZCcgICA9PiBAbGV2ZWxTZWxlY3Rpb24gPSBuZXcgTGV2ZWxTZWwgQFxuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXNldCcgIEByZXN0YXJ0IFxuICAgICAgICBAbWVudS5hZGRJdGVtICdjb25maWcnID0+IEBtZW51ID0gbmV3IENvbmZpZ1xuICAgICAgICBAbWVudS5hZGRJdGVtICdoZWxwJyAgID0+IEB0ZXh0ID0gbmV3IFNjcmVlblRleHQgQGRpY3RbJ2hlbHAnXVxuICAgICAgICBAbWVudS5hZGRJdGVtICdxdWl0JyAgIC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgXG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnaHQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24ubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDgsIEBzcGVlZCsxOyBwcmVmcy5zZXQgJ3NwZWVkJyBAc3BlZWQtM1xuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCA0LCBAc3BlZWQtMTsgcHJlZnMuc2V0ICdzcGVlZCcgQHNwZWVkLTNcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAbGV2ZWxTZWxlY3Rpb25cbiAgICAgICAgcmV0dXJuIGlmIEBwbGF5ZXI/Lm1vZEtleUNvbWJvRXZlbnRVcCBtb2QsIGtleSwgY29tYm8sIGV2ZW50ICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZFxuXG4iXX0=
//# sourceURL=../coffee/world.coffee