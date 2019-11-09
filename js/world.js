// koffee 1.4.0
var Action, Actor, Cage, Camera, Cell, Face, Gate, Gear, Item, LevelSel, Levels, Light, Material, Menu, MotorCylinder, MotorGear, Player, Pos, Pushable, Quaternion, Scheme, ScreenText, Size, Sound, Stone, Switch, Timer, TmpObject, Vector, Wall, Wire, World, _, absMin, clamp, colors, kerror, klog, last, now, post, prefs, randInt, ref, ref1, world,
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
        } else {
            klog('cell?');
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
        if (this.levelSelection) {
            return;
        }
        if ((ref2 = this.player) != null ? ref2.modKeyComboEventUp(mod, key, combo, event) : void 0) {

        }
    };

    return World;

})(Actor);

module.exports = World;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLHVWQUFBO0lBQUE7Ozs7QUFBQSxNQUF5RSxPQUFBLENBQVEsS0FBUixDQUF6RSxFQUFFLGVBQUYsRUFBUSxxQkFBUixFQUFpQixtQkFBakIsRUFBeUIsbUJBQXpCLEVBQWlDLGlCQUFqQyxFQUF3QyxpQkFBeEMsRUFBK0MsZUFBL0MsRUFBcUQsbUJBQXJELEVBQTZELGVBQTdELEVBQW1FOztBQUVuRSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxZQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLFVBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsS0FBQSxHQUFjLE9BQUEsQ0FBUSxTQUFSOztBQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsU0FBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsWUFBUjs7QUFDZCxRQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVI7O0FBQ2QsTUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLFVBQUEsR0FBYyxPQUFB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LGlCQUVTLEdBRlQ7dUJBRWtCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFwQjtBQUYzQixpQkFHUyxHQUhUO3VCQUdrQixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFhLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBcEI7QUFIM0IsaUJBSVMsR0FKVDt1QkFJa0IsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUpsQixpQkFLUyxHQUxUO3VCQUtrQixJQUFDLENBQUEsU0FBRCxDQUFBO0FBTGxCLGlCQU1TLEdBTlQ7dUJBTWtCLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtBQU5sQjtJQVprQjs7b0JBb0J0QixrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtBQUVoQixZQUFBO1FBQUEsSUFBVSxJQUFDLENBQUEsY0FBWDtBQUFBLG1CQUFBOztRQUNBLHVDQUFpQixDQUFFLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLFVBQVY7QUFBQTs7SUFIZ0I7Ozs7R0E5MEJKOztBQW0xQnBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgXG4jICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgXG5cbnsgcG9zdCwgcmFuZEludCwgY29sb3JzLCBhYnNNaW4sIHByZWZzLCBjbGFtcCwgbGFzdCwga2Vycm9yLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5cblBvcyAgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuU2l6ZSAgICAgICAgPSByZXF1aXJlICcuL2xpYi9zaXplJ1xuQ2VsbCAgICAgICAgPSByZXF1aXJlICcuL2NlbGwnXG5HYXRlICAgICAgICA9IHJlcXVpcmUgJy4vZ2F0ZSdcbkNhbWVyYSAgICAgID0gcmVxdWlyZSAnLi9jYW1lcmEnXG5MaWdodCAgICAgICA9IHJlcXVpcmUgJy4vbGlnaHQnXG5MZXZlbHMgICAgICA9IHJlcXVpcmUgJy4vbGV2ZWxzJ1xuUGxheWVyICAgICAgPSByZXF1aXJlICcuL3BsYXllcidcblNvdW5kICAgICAgID0gcmVxdWlyZSAnLi9zb3VuZCdcbkNhZ2UgICAgICAgID0gcmVxdWlyZSAnLi9jYWdlJ1xuVGltZXIgICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQWN0b3IgICAgICAgPSByZXF1aXJlICcuL2FjdG9yJ1xuSXRlbSAgICAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5BY3Rpb24gICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWVudSAgICAgICAgPSByZXF1aXJlICcuL21lbnUnXG5TY3JlZW5UZXh0ICA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcblRtcE9iamVjdCAgID0gcmVxdWlyZSAnLi90bXBvYmplY3QnXG5QdXNoYWJsZSAgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5NYXRlcmlhbCAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5TY2hlbWUgICAgICA9IHJlcXVpcmUgJy4vc2NoZW1lJ1xuUXVhdGVybmlvbiAgPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5Qb3MgICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbm5vdyAgICAgICAgID0gcmVxdWlyZSgncGVyZl9ob29rcycpLnBlcmZvcm1hbmNlLm5vd1xuTGV2ZWxTZWwgICAgPSByZXF1aXJlICcuL2xldmVsc2VsZWN0aW9uJ1xue1xuV2FsbCxcbldpcmUsXG5HZWFyLFxuU3RvbmUsXG5Td2l0Y2gsXG5Nb3RvckdlYXIsXG5Nb3RvckN5bGluZGVyLFxuRmFjZX0gICAgICAgPSByZXF1aXJlICcuL2l0ZW1zJ1xuXG53b3JsZCAgICAgICA9IG51bGxcblxuY2xhc3MgV29ybGQgZXh0ZW5kcyBBY3RvclxuICAgIFxuICAgIEBsZXZlbHMgPSBudWxsXG4gICAgXG4gICAgQG5vcm1hbHMgPSBbXG4gICAgICAgICAgICBuZXcgVmVjdG9yIDEsIDAsIDBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMSwgMCBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IgMCwgMCwgMVxuICAgICAgICAgICAgbmV3IFZlY3RvciAtMSwwLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLC0xLCAwIFxuICAgICAgICAgICAgbmV3IFZlY3RvciAwLCAwLC0xXG4gICAgXVxuICAgIFxuICAgIEA6IChAdmlldywgQHByZXZpZXcpIC0+XG4gICAgICAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBcbiAgICAgICAgXG4gICAgICAgIEBzcGVlZCAgICAgID0gNlxuICAgICAgICBcbiAgICAgICAgQHJhc3RlclNpemUgPSAwLjA1XG5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBub1JvdGF0aW9ucyA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcbiAgICAgICAgIyBrbG9nIFwidmlldyBAc2NyZWVuU2l6ZTpcIiwgQHNjcmVlblNpemVcbiAgICAgICAgXG4gICAgICAgIEByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyIFxuICAgICAgICAgICAgYW50aWFsaWFzOiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgbG9nYXJpdGhtaWNEZXB0aEJ1ZmZlcjogZmFsc2VcbiAgICAgICAgICAgIGF1dG9DbGVhcjogICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICBzb3J0T2JqZWN0czogICAgICAgICAgICB0cnVlXG5cbiAgICAgICAgQHJlbmRlcmVyLnNldFNpemUgQHZpZXcub2Zmc2V0V2lkdGgsIEB2aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLnR5cGUgPSBUSFJFRS5QQ0ZTb2Z0U2hhZG93TWFwXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgIyAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiAgICAgICAgIyAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiAgICAgICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgICAgICMgICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAgICAgIyAgIDAwMCAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgICAgICAjICAgMDAwICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICMgICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuICAgICAgICBAc3VuID0gbmV3IFRIUkVFLlBvaW50TGlnaHQgMHhmZmZmZmZcbiAgICAgICAgQHN1bi5wb3NpdGlvbi5jb3B5IEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkgaWYgQHBsYXllcj9cbiAgICAgICAgQHNjZW5lLmFkZCBAc3VuXG4gICAgICAgIFxuICAgICAgICBAYW1iaWVudCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQgMHgxMTExMTFcbiAgICAgICAgQHNjZW5lLmFkZCBAYW1iaWVudFxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgQG9iamVjdHMgPSBbXVxuICAgICAgICBAbGlnaHRzICA9IFtdXG4gICAgICAgIEBjZWxscyAgID0gW10gXG4gICAgICAgIEBzaXplICAgID0gbmV3IFBvcygpXG4gICAgICAgIEBkZXB0aCAgID0gLU51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICAgIFxuICAgICAgICBAdGltZXIgPSBuZXcgVGltZXIgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAdmlldy5hcHBlbmRDaGlsZCBAcmVuZGVyZXIuZG9tRWxlbWVudFxuICAgICBcbiAgICBAaW5pdDogKHZpZXcpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgd29ybGQ/XG4gICAgICAgIFxuICAgICAgICBAaW5pdEdsb2JhbCgpXG4gICAgICAgICAgICBcbiAgICAgICAgd29ybGQgPSBuZXcgV29ybGQgdmlld1xuICAgICAgICB3b3JsZC5uYW1lID0gJ3dvcmxkJ1xuICAgICAgICBpbmRleCA9IHByZWZzLmdldCAnbGV2ZWwnIDBcbiAgICAgICAgd29ybGQuY3JlYXRlIEBsZXZlbHMubGlzdFtpbmRleF1cbiAgICAgICAgd29ybGRcbiAgICAgICAgXG4gICAgQGluaXRHbG9iYWw6ICgpIC0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxldmVscz9cbiAgICAgICAgICBcbiAgICAgICAgU2NyZWVuVGV4dC5pbml0KClcbiAgICAgICAgU291bmQuaW5pdCgpXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwucm90MCAgICA9IFF1YXRlcm5pb24ucm90XzBcbiAgICAgICAgZ2xvYmFsLnJvdHg5MCAgPSBRdWF0ZXJuaW9uLnJvdF85MF9YXG4gICAgICAgIGdsb2JhbC5yb3R5OTAgID0gUXVhdGVybmlvbi5yb3RfOTBfWVxuICAgICAgICBnbG9iYWwucm90ejkwICA9IFF1YXRlcm5pb24ucm90XzkwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgxODAgPSBRdWF0ZXJuaW9uLnJvdF8xODBfWFxuICAgICAgICBnbG9iYWwucm90eTE4MCA9IFF1YXRlcm5pb24ucm90XzE4MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MTgwID0gUXVhdGVybmlvbi5yb3RfMTgwX1pcbiAgICAgICAgZ2xvYmFsLnJvdHgyNzAgPSBRdWF0ZXJuaW9uLnJvdF8yNzBfWFxuICAgICAgICBnbG9iYWwucm90eTI3MCA9IFF1YXRlcm5pb24ucm90XzI3MF9ZXG4gICAgICAgIGdsb2JhbC5yb3R6MjcwID0gUXVhdGVybmlvbi5yb3RfMjcwX1pcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC5YdXBZICAgICAgICA9IFF1YXRlcm5pb24uWHVwWVxuICAgICAgICBnbG9iYWwuWHVwWiAgICAgICAgPSBRdWF0ZXJuaW9uLlh1cFpcbiAgICAgICAgZ2xvYmFsLlhkb3duWSAgICAgID0gUXVhdGVybmlvbi5YZG93bllcbiAgICAgICAgZ2xvYmFsLlhkb3duWiAgICAgID0gUXVhdGVybmlvbi5YZG93blpcbiAgICAgICAgZ2xvYmFsLll1cFggICAgICAgID0gUXVhdGVybmlvbi5ZdXBYXG4gICAgICAgIGdsb2JhbC5ZdXBaICAgICAgICA9IFF1YXRlcm5pb24uWXVwWlxuICAgICAgICBnbG9iYWwuWWRvd25YICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWFxuICAgICAgICBnbG9iYWwuWWRvd25aICAgICAgPSBRdWF0ZXJuaW9uLllkb3duWlxuICAgICAgICBnbG9iYWwuWnVwWCAgICAgICAgPSBRdWF0ZXJuaW9uLlp1cFhcbiAgICAgICAgZ2xvYmFsLlp1cFkgICAgICAgID0gUXVhdGVybmlvbi5adXBZXG4gICAgICAgIGdsb2JhbC5aZG93blggICAgICA9IFF1YXRlcm5pb24uWmRvd25YXG4gICAgICAgIGdsb2JhbC5aZG93blkgICAgICA9IFF1YXRlcm5pb24uWmRvd25ZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFkgICA9IFF1YXRlcm5pb24ubWludXNYdXBZXG4gICAgICAgIGdsb2JhbC5taW51c1h1cFogICA9IFF1YXRlcm5pb24ubWludXNYdXBaXG4gICAgICAgIGdsb2JhbC5taW51c1hkb3duWSA9IFF1YXRlcm5pb24ubWludXNYZG93bllcbiAgICAgICAgZ2xvYmFsLm1pbnVzWGRvd25aID0gUXVhdGVybmlvbi5taW51c1hkb3duWlxuICAgICAgICBnbG9iYWwubWludXNZdXBYICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWFxuICAgICAgICBnbG9iYWwubWludXNZdXBaICAgPSBRdWF0ZXJuaW9uLm1pbnVzWXVwWlxuICAgICAgICBnbG9iYWwubWludXNZZG93blggPSBRdWF0ZXJuaW9uLm1pbnVzWWRvd25YXG4gICAgICAgIGdsb2JhbC5taW51c1lkb3duWiA9IFF1YXRlcm5pb24ubWludXNZZG93blpcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWCAgID0gUXVhdGVybmlvbi5taW51c1p1cFhcbiAgICAgICAgZ2xvYmFsLm1pbnVzWnVwWSAgID0gUXVhdGVybmlvbi5taW51c1p1cFlcbiAgICAgICAgZ2xvYmFsLm1pbnVzWmRvd25YID0gUXVhdGVybmlvbi5taW51c1pkb3duWFxuICAgICAgICBnbG9iYWwubWludXNaZG93blkgPSBRdWF0ZXJuaW9uLm1pbnVzWmRvd25ZXG5cbiAgICAgICAgQGxldmVscyA9IG5ldyBMZXZlbHNcbiAgICAgICAgXG4gICAgZGVsOiAtPlxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLmRvbUVsZW1lbnQucmVtb3ZlKClcbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIGNyZWF0ZTogKHdvcmxkRGljdD17fSwgc2hvd05hbWU9dHJ1ZSkgLT4gIyBjcmVhdGVzIHRoZSB3b3JsZCBmcm9tIGEgbGV2ZWwgbmFtZSBvciBhIGRpY3Rpb25hcnlcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLmNyZWF0ZVwiIHdvcmxkRGljdFxuICAgICAgICBcbiAgICAgICAgaWYgd29ybGREaWN0XG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIHdvcmxkRGljdFxuICAgICAgICAgICAgICAgIEBsZXZlbF9uYW1lID0gd29ybGREaWN0XG4gICAgICAgICAgICAgICAgQGRpY3QgPSBXb3JsZC5sZXZlbHMuZGljdFt3b3JsZERpY3RdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGxldmVsX25hbWUgPSB3b3JsZERpY3QubmFtZVxuICAgICAgICAgICAgICAgIEBkaWN0ID0gd29ybGREaWN0XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBsZXZlbF9pbmRleCA9IFdvcmxkLmxldmVscy5saXN0LmluZGV4T2YgQGxldmVsX25hbWVcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAcHJldmlld1xuICAgICAgICAgICAgcHJlZnMuc2V0ICdsZXZlbCcgQGxldmVsX2luZGV4XG4gICAgICAgIFxuICAgICAgICAjIGtsb2cgXCJXb3JsZC5jcmVhdGUgI3tAbGV2ZWxfaW5kZXh9IHNpemU6ICN7bmV3IFBvcyhAZGljdFtcInNpemVcIl0pLnN0cigpfSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICcje0BsZXZlbF9uYW1lfScgc2NoZW1lOiAnI3tAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCd9J1wiXG5cbiAgICAgICAgQGNyZWF0aW5nID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBzZXRTaXplIEBkaWN0LnNpemUgIyB0aGlzIHJlbW92ZXMgYWxsIG9iamVjdHNcbiAgICAgICAgXG4gICAgICAgIEBhcHBseVNjaGVtZSBAZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBpbnRybyB0ZXh0ICAgXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHByZXZpZXcgYW5kIHNob3dOYW1lXG4gICAgICAgICAgICBAdGV4dCA9IG5ldyBTY3JlZW5UZXh0IEBkaWN0Lm5hbWVcbiAgICAgICAgXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGV4aXRzXG5cbiAgICAgICAgaWYgQGRpY3QuZXhpdHM/XG4gICAgICAgICAgICBleGl0X2lkID0gMFxuICAgICAgICAgICAgZm9yIGVudHJ5IGluIEBkaWN0LmV4aXRzXG4gICAgICAgICAgICAgICAgZXhpdF9nYXRlID0gbmV3IEdhdGUgZW50cnlbXCJhY3RpdmVcIl1cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUubmFtZSA9IGVudHJ5W1wibmFtZVwiXSA/IFwiZXhpdCAje2V4aXRfaWR9XCJcbiAgICAgICAgICAgICAgICBBY3Rpb24uaWQgPz0gMFxuICAgICAgICAgICAgICAgIGV4aXRBY3Rpb24gPSBuZXcgQWN0aW9uIFxuICAgICAgICAgICAgICAgICAgICBpZDogICBBY3Rpb24uaWRcbiAgICAgICAgICAgICAgICAgICAgZnVuYzogQGV4aXRMZXZlbFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImV4aXQgI3tleGl0X2lkfVwiXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAgICAgICAgICAgICBleGl0X2dhdGUuZ2V0RXZlbnRXaXRoTmFtZShcImVudGVyXCIpLmFkZEFjdGlvbiBleGl0QWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgZW50cnkucG9zaXRpb24/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IEBkZWNlbnRlciBlbnRyeS5wb3NpdGlvblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgZW50cnkuY29vcmRpbmF0ZXM/XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IG5ldyBQb3MgZW50cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgZXhpdF9nYXRlLCBwb3NcbiAgICAgICAgICAgICAgICBleGl0X2lkICs9IDFcblxuICAgICAgICAjIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiBjcmVhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LmNyZWF0ZT9cbiAgICAgICAgICAgIGlmIF8uaXNGdW5jdGlvbiBAZGljdC5jcmVhdGVcbiAgICAgICAgICAgICAgICBAZGljdC5jcmVhdGUoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGtsb2cgXCJXb3JsZC5jcmVhdGUgW1dBUk5JTkddIEBkaWN0LmNyZWF0ZSBub3QgYSBmdW5jdGlvbiFcIlxuXG4gICAgICAgICMgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIHBsYXllclxuXG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyXG5cbiAgICAgICAgQHBsYXllci5zZXRPcmllbnRhdGlvbiBAZGljdC5wbGF5ZXIub3JpZW50YXRpb24gPyByb3R4OTBcbiAgICAgICAgQHBsYXllci5jYW1lcmEuc2V0T3JpZW50YXRpb24gQHBsYXllci5vcmllbnRhdGlvblxuXG4gICAgICAgIGlmIEBkaWN0LnBsYXllci5wb3NpdGlvbj9cbiAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBAcGxheWVyLCBAZGVjZW50ZXIgQGRpY3QucGxheWVyLnBvc2l0aW9uXG4gICAgICAgIGVsc2UgaWYgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzP1xuICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIEBwbGF5ZXIsIG5ldyBQb3MgQGRpY3QucGxheWVyLmNvb3JkaW5hdGVzXG5cbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldFBvc2l0aW9uIEBwbGF5ZXIuY3VycmVudFBvcygpLm1pbnVzIEBwbGF5ZXIuZGlyZWN0aW9uXG4gICAgICAgICAgICBAc2V0Q2FtZXJhTW9kZSBDYW1lcmEuRk9MTE9XXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBwbGF5ZXIuY2FtZXJhLnNldFBvc2l0aW9uIEBwbGF5ZXIuY3VycmVudFBvcygpXG4gICAgICAgICAgICBAc2V0Q2FtZXJhTW9kZSBDYW1lcmEuSU5TSURFIGlmIEBkaWN0LmNhbWVyYSA9PSAnaW5zaWRlJ1xuICAgICAgICBcbiAgICAgICAgQGNyZWF0aW5nID0gZmFsc2VcbiAgICBcbiAgICByZXN0YXJ0OiA9PiBAY3JlYXRlIEBkaWN0XG5cbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgYXBwbHlTY2hlbWU6IChzY2hlbWUpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIGNvbG9ycyA9IF8uY2xvbmUgU2NoZW1lW3NjaGVtZV1cbiAgICAgICAgXG4gICAgICAgIG9wYWNpdHkgPVxuICAgICAgICAgICAgc3RvbmU6IDAuN1xuICAgICAgICAgICAgYm9tYjogIDAuOVxuICAgICAgICAgICAgdGV4dDogIDBcbiAgICAgICAgICAgIFxuICAgICAgICBzaGluaW5lc3MgPSBcbiAgICAgICAgICAgIHRpcmU6ICAgNFxuICAgICAgICAgICAgcGxhdGU6ICAxMFxuICAgICAgICAgICAgcmFzdGVyOiAyMFxuICAgICAgICAgICAgd2FsbDogICAyMFxuICAgICAgICAgICAgc3RvbmU6ICAyMFxuICAgICAgICAgICAgZ2VhcjogICAyMFxuICAgICAgICAgICAgdGV4dDogICAyMDBcbiAgICAgICAgICAgIFxuICAgICAgICBjb2xvcnMucGxhdGUuZW1pc3NpdmUgPz0gY29sb3JzLnBsYXRlLmNvbG9yXG4gICAgICAgIGNvbG9ycy5idWxiLmVtaXNzaXZlICA/PSBjb2xvcnMuYnVsYi5jb2xvclxuICAgICAgICBjb2xvcnMubWVudSA/PSB7fSAgIFxuICAgICAgICBjb2xvcnMubWVudS5jb2xvciA/PSBjb2xvcnMuZ2Vhci5jb2xvclxuICAgICAgICBjb2xvcnMucmFzdGVyID89IHt9ICAgIFxuICAgICAgICBjb2xvcnMucmFzdGVyLmNvbG9yID89IGNvbG9ycy5wbGF0ZS5jb2xvclxuICAgICAgICBjb2xvcnMud2FsbCA/PSB7fVxuICAgICAgICBjb2xvcnMud2FsbC5jb2xvciA/PSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzLnBsYXRlLmNvbG9yKS5tdWx0aXBseVNjYWxhciAwLjZcbiAgICAgICAgY29sb3JzLndpcmVQbGF0ZSA/PSB7fVxuICAgICAgICBjb2xvcnMud2lyZVBsYXRlLmNvbG9yID89IGNvbG9ycy53aXJlLmNvbG9yXG4gICAgICAgIGZvciBrLHYgb2YgY29sb3JzXG4gICAgICAgICAgICBtYXQgPSBNYXRlcmlhbFtrXVxuICAgICAgICAgICAgbWF0LmNvbG9yICAgID0gdi5jb2xvclxuICAgICAgICAgICAgbWF0Lm9wYWNpdHkgID0gdi5vcGFjaXR5ID8gb3BhY2l0eVtrXSA/IDFcbiAgICAgICAgICAgIG1hdC5zcGVjdWxhciA9IHYuc3BlY3VsYXIgPyBuZXcgVEhSRUUuQ29sb3Iodi5jb2xvcikubXVsdGlwbHlTY2FsYXIgMC4yXG4gICAgICAgICAgICBtYXQuZW1pc3NpdmUgPSB2LmVtaXNzaXZlID8gbmV3IFRIUkVFLkNvbG9yIDAsMCwwXG4gICAgICAgICAgICBpZiBzaGluaW5lc3Nba10/XG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IHYuc2hpbmluZXNzID8gc2hpbmluZXNzW2tdXG5cbiAgICAjICAwMDAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjICAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBhZGRMaWdodDogKGxpZ2h0KSAtPlxuICAgICAgICBAbGlnaHRzLnB1c2ggbGlnaHRcbiAgICAgICAgQGVuYWJsZVNoYWRvd3MgdHJ1ZSBpZiBsaWdodC5zaGFkb3dcbiAgICAgICAgXG4gICAgcmVtb3ZlTGlnaHQ6IChsaWdodCkgLT5cbiAgICAgICAgXy5wdWxsIEBsaWdodHMsIGxpZ2h0XG4gICAgICAgIGZvciBsIGluIEBsaWdodHNcbiAgICAgICAgICAgIHNoYWRvdyA9IHRydWUgaWYgbC5zaGFkb3dcbiAgICAgICAgQGVuYWJsZVNoYWRvd3Mgc2hhZG93XG5cbiAgICBlbmFibGVTaGFkb3dzOiAoZW5hYmxlKSAtPlxuICAgICAgICBAcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBlbmFibGVcbiAgICBcbiAgICAjICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICAgICAgIFxuICAgIGV4aXRMZXZlbDogKGFjdGlvbikgPT5cbiAgICAgICAgXG4gICAgICAgIHByZWZzLnNldCBcInNvbHZlZOKWuCN7V29ybGQubGV2ZWxzLmxpc3Rbd29ybGQubGV2ZWxfaW5kZXhdfVwiIHRydWVcbiAgICAgICAgbmV4dExldmVsID0gKHdvcmxkLmxldmVsX2luZGV4KyhfLmlzTnVtYmVyKGFjdGlvbikgYW5kIGFjdGlvbiBvciAxKSkgJSBXb3JsZC5sZXZlbHMubGlzdC5sZW5ndGhcbiAgICAgICAgd29ybGQuY3JlYXRlIFdvcmxkLmxldmVscy5saXN0W25leHRMZXZlbF1cblxuICAgIGFjdGl2YXRlOiAob2JqZWN0TmFtZSkgLT4gQGdldE9iamVjdFdpdGhOYW1lKG9iamVjdE5hbWUpPy5zZXRBY3RpdmU/IHRydWVcbiAgICBcbiAgICBkZWNlbnRlcjogKHgseSx6KSAtPiBuZXcgUG9zKHgseSx6KS5wbHVzIEBzaXplLmRpdiAyXG5cbiAgICBpc1ZhbGlkUG9zOiAocG9zKSAtPiBcbiAgICAgICAgcCA9IG5ldyBQb3MgcG9zXG4gICAgICAgIHAueCA+PSAwIGFuZCBwLnggPCBAc2l6ZS54IGFuZCBwLnkgPj0gMCBhbmQgcC55IDwgQHNpemUueSBhbmQgcC56ID49IDAgYW5kIHAueiA8IEBzaXplLnpcbiAgICAgICAgXG4gICAgaXNJbnZhbGlkUG9zOiAocG9zKSAtPiBub3QgQGlzVmFsaWRQb3MgcG9zXG5cbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgIDAwMFxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgXG4gICAgc2V0U2l6ZTogKHNpemUpIC0+XG4gICAgICAgIEBkZWxldGVBbGxPYmplY3RzKClcbiAgICAgICAgQGNlbGxzID0gW11cbiAgICAgICAgQHNpemUgPSBuZXcgUG9zIHNpemVcbiAgICAgICAgIyBjYWxjdWF0ZSBtYXggZGlzdGFuY2UgKGZvciBwb3NpdGlvbiByZWxhdGl2ZSBzb3VuZClcbiAgICAgICAgQG1heF9kaXN0YW5jZSA9IE1hdGgubWF4KEBzaXplLngsIE1hdGgubWF4KEBzaXplLnksIEBzaXplLnopKSAgIyBoZXVyaXN0aWMgb2YgYSBoZXVyaXN0aWMgOi0pXG4gICAgICAgIEBjYWdlPy5kZWwoKVxuICAgICAgICBAY2FnZSA9IG5ldyBDYWdlIEBzaXplLCBAcmFzdGVyU2l6ZVxuXG4gICAgZ2V0Q2VsbEF0UG9zOiAocG9zKSAtPiByZXR1cm4gQGNlbGxzW0Bwb3NUb0luZGV4KHBvcyldIGlmIEBpc1ZhbGlkUG9zIHBvc1xuICAgIGdldEJvdEF0UG9zOiAgKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIEJvdCwgbmV3IFBvcyBwb3NcblxuICAgIHBvc1RvSW5kZXg6ICAgKHBvcykgLT4gXG4gICAgICAgIHAgPSBuZXcgUG9zIHBvc1xuICAgICAgICBwLnggKiBAc2l6ZS56ICogQHNpemUueSArIHAueSAqIEBzaXplLnogKyBwLnpcbiAgICAgICAgXG4gICAgaW5kZXhUb1BvczogICAoaW5kZXgpIC0+IFxuICAgICAgICBsc2l6ZSA9IEBzaXplLnogKiBAc2l6ZS55XG4gICAgICAgIGxyZXN0ID0gaW5kZXggJSBsc2l6ZVxuICAgICAgICBuZXcgUG9zIGluZGV4L2xzaXplLCBscmVzdC9Ac2l6ZS56LCBscmVzdCVAc2l6ZS56XG4gICAgXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZE9iamVjdEF0UG9zOiAob2JqZWN0LCB4LCB5LCB6KSAtPlxuICAgICAgICBwb3MgPSBuZXcgUG9zIHgsIHksIHpcbiAgICAgICAgb2JqZWN0ID0gQG5ld09iamVjdCBvYmplY3RcbiAgICAgICAgQHNldE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgICMga2xvZyBcImFkZE9iamVjdEF0UG9zICN7b2JqZWN0Lm5hbWV9XCIsIHBvc1xuICAgICAgICBAYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgYWRkT2JqZWN0TGluZTogKG9iamVjdCwgc3gsc3ksc3osIGV4LGV5LGV6KSAtPlxuICAgICAgICAjIGtsb2cgXCJ3b3JsZC5hZGRPYmplY3RMaW5lIHN4OiN7c3h9IHN5OiN7c3l9IHN6OiN7c3p9IGV4OiN7ZXh9IGV5OiN7ZXl9IGV6OiN7ZXp9XCJcbiAgICAgICAgaWYgc3ggaW5zdGFuY2VvZiBQb3Mgb3IgQXJyYXkuaXNBcnJheSBzeFxuICAgICAgICAgICAgc3RhcnQgPSBzeFxuICAgICAgICAgICAgZW5kICAgPSBzeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydCA9IG5ldyBQb3Mgc3gsc3ksc3pcbiAgICAgICAgICAgIGVuZCAgID0gbmV3IFBvcyBleCxleSxlelxuICAgICAgICAjIGFkZHMgYSBsaW5lIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHN0YXJ0IGFuZCBlbmQgc2hvdWxkIGJlIDMtdHVwbGVzIG9yIFBvcyBvYmplY3RzXG4gICAgICAgIGlmIGVuZCBpbnN0YW5jZW9mIFBvc1xuICAgICAgICAgICAgZW5kID0gW2VuZC54LCBlbmQueSwgZW5kLnpdXG4gICAgICAgIFtleCwgZXksIGV6XSA9IGVuZFxuXG4gICAgICAgIGlmIHN0YXJ0IGluc3RhbmNlb2YgUG9zXG4gICAgICAgICAgICBzdGFydCA9IFtzdGFydC54LCBzdGFydC55LCBzdGFydC56XVxuICAgICAgICBbc3gsIHN5LCBzel0gPSBzdGFydFxuICAgICAgICBcbiAgICAgICAgIyBrbG9nIFwid29ybGQuYWRkT2JqZWN0TGluZSBzeDoje3N4fSBzeToje3N5fSBzejoje3N6fSBleDoje2V4fSBleToje2V5fSBlejoje2V6fVwiXG4gICAgICAgIFxuICAgICAgICBkaWZmID0gW2V4LXN4LCBleS1zeSwgZXotc3pdXG4gICAgICAgIG1heGRpZmYgPSBfLm1heCBkaWZmLm1hcCBNYXRoLmFic1xuICAgICAgICBkZWx0YXMgPSBkaWZmLm1hcCAoYSkgLT4gYS9tYXhkaWZmXG4gICAgICAgIGZvciBpIGluIFswLi4ubWF4ZGlmZl1cbiAgICAgICAgICAgICMgcG9zID0gYXBwbHkoUG9zLCAobWFwIChsYW1iZGEgYSwgYjogaW50KGEraSpiKSwgc3RhcnQsIGRlbHRhcykpKVxuICAgICAgICAgICAgcG9zID0gbmV3IFBvcyAoc3RhcnRbal0raSpkZWx0YXNbal0gZm9yIGogaW4gWzAuLjJdKVxuICAgICAgICAgICAgIyBrbG9nIFwiYWRkT2JqZWN0TGluZSAje2l9OlwiLCBwb3NcbiAgICAgICAgICAgIGlmIEBpc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICAgICAgQGFkZE9iamVjdEF0UG9zIG9iamVjdCwgcG9zXG4gICAgICAgXG4gICAgYWRkT2JqZWN0UG9seTogKG9iamVjdCwgcG9pbnRzLCBjbG9zZT10cnVlKSAtPlxuICAgICAgICAjIGFkZHMgYSBwb2x5Z29uIG9mIG9iamVjdHMgb2YgdHlwZSB0byB0aGUgd29ybGQuIHBvaW50cyBzaG91bGQgYmUgMy10dXBsZXMgb3IgUG9zIG9iamVjdHNcbiAgICAgICAgaWYgY2xvc2VcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIHBvaW50c1swXVxuICAgICAgICBmb3IgaW5kZXggaW4gWzEuLi5wb2ludHMubGVuZ3RoXVxuICAgICAgICAgICAgQGFkZE9iamVjdExpbmUgb2JqZWN0LCBwb2ludHNbaW5kZXgtMV0sIHBvaW50c1tpbmRleF1cbiAgICAgICBcbiAgICBhZGRPYmplY3RSYW5kb206IChvYmplY3QsIG51bWJlcikgLT5cbiAgICAgICAgIyBhZGRzIG51bWJlciBvYmplY3RzIG9mIHR5cGUgYXQgcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgd29ybGRcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5udW1iZXJdXG4gICAgICAgICAgICBpZiBfLmlzU3RyaW5nIG9iamVjdFxuICAgICAgICAgICAgICAgIEBzZXRPYmplY3RSYW5kb20gZXZhbCBvYmplY3QgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNldE9iamVjdFJhbmRvbSBvYmplY3QoKVxuICAgICAgICBcbiAgICBzZXRPYmplY3RSYW5kb206IChvYmplY3QpIC0+XG4gICAgICAgICMgYWRkcyBudW1iZXIgb2JqZWN0cyBvZiB0eXBlIGF0IHJhbmRvbSBwb3NpdGlvbnMgdG8gdGhlIHdvcmxkXG4gICAgICAgIG9iamVjdFNldCA9IGZhbHNlXG4gICAgICAgIG9iamVjdCA9IEBuZXdPYmplY3Qgb2JqZWN0XG4gICAgICAgIHdoaWxlIG5vdCBvYmplY3RTZXQgIyBoYWNrIGFsZXJ0IVxuICAgICAgICAgICAgcmFuZG9tUG9zID0gbmV3IFBvcyByYW5kSW50KEBzaXplLngpLCByYW5kSW50KEBzaXplLnkpLCByYW5kSW50KEBzaXplLnopXG4gICAgICAgICAgICBpZiBub3Qgb2JqZWN0LmlzU3BhY2VFZ29pc3RpYygpIG9yIEBpc1Vub2NjdXBpZWRQb3MgcmFuZG9tUG9zIFxuICAgICAgICAgICAgICAgIEBhZGRPYmplY3RBdFBvcyBvYmplY3QsIHJhbmRvbVBvc1xuICAgICAgICAgICAgICAgIG9iamVjdFNldCA9IHRydWVcblxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgICAgICAgMDAwXG4gICAgIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogICAgICAoY2xzcykgICAgICAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0c09mVHlwZUF0UG9zOiAoY2xzcywgcG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9iamVjdHNPZlR5cGUoY2xzcykgPyBbXVxuICAgIGdldE9iamVjdE9mVHlwZUF0UG9zOiAgKGNsc3MsIHBvcykgLT4gQGdldENlbGxBdFBvcyhwb3MpPy5nZXRSZWFsT2JqZWN0T2ZUeXBlKGNsc3MpXG4gICAgZ2V0T2NjdXBhbnRBdFBvczogICAgICAgICAgICAocG9zKSAtPiBAZ2V0Q2VsbEF0UG9zKHBvcyk/LmdldE9jY3VwYW50KClcbiAgICBnZXRSZWFsT2NjdXBhbnRBdFBvczogKHBvcykgLT5cbiAgICAgICAgb2NjdXBhbnQgPSBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgaWYgb2NjdXBhbnQgYW5kIG9jY3VwYW50IGluc3RhbmNlb2YgVG1wT2JqZWN0XG4gICAgICAgICAgICBvY2N1cGFudC5vYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnRcbiAgICBcbiAgICBzd2l0Y2hBdFBvczogKHBvcykgLT4gQGdldE9iamVjdE9mVHlwZUF0UG9zIFN3aXRjaCwgcG9zXG4gICAgXG4gICAgc2V0T2JqZWN0QXRQb3M6IChvYmplY3QsIHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHBvcyA9IG5ldyBQb3MgcG9zXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gaW52YWxpZCBwb3M6XCIsIHBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pc1NwYWNlRWdvaXN0aWMoKVxuICAgICAgICAgICAgaWYgY2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgPSBjZWxsLmdldE9jY3VwYW50KClcbiAgICAgICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50LnRpbWUgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nIFwiV29ybGQuc2V0T2JqZWN0QXRQb3MgW1dBUk5JTkddIGFscmVhZHkgb2NjdXBpZWQgcG9zOlwiLCBwb3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2cgXCJXb3JsZC5zZXRPYmplY3RBdFBvcyBbV0FSTklOR10gYWxyZWFkeSBvY2N1cGllZCB0aW1lOlwiLCBvY2N1cGFudC50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5kZWwoKSAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBhbnl3YXkgLiBkZWxldGUgaXRcbiAgICAgICAgXG4gICAgICAgIGNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHBvc1xuICAgICAgICBpZiBub3QgY2VsbD9cbiAgICAgICAgICAgIGNlbGxJbmRleCA9IEBwb3NUb0luZGV4KHBvcylcbiAgICAgICAgICAgIGNlbGwgPSBuZXcgQ2VsbCgpXG4gICAgICAgICAgICBAY2VsbHNbY2VsbEluZGV4XSA9IGNlbGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAga2xvZyAnY2VsbD8nXG4gICAgICAgIFxuICAgICAgICBvYmplY3Quc2V0UG9zaXRpb24gcG9zXG4gICAgICAgIGNlbGwuYWRkT2JqZWN0IG9iamVjdFxuXG4gICAgdW5zZXRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIHBvcyA9IG9iamVjdC5nZXRQb3MoKVxuICAgICAgICBpZiBjZWxsID0gQGdldENlbGxBdFBvcyBwb3NcbiAgICAgICAgICAgIGNlbGwucmVtb3ZlT2JqZWN0IG9iamVjdFxuICAgICAgICAgICAgaWYgY2VsbC5pc0VtcHR5KClcbiAgICAgICAgICAgICAgICBAY2VsbHNbQHBvc1RvSW5kZXgocG9zKV0gPSBudWxsXG4gICAgICAgIGVsc2UgXG4gICAgICAgICAgICBrbG9nICd3b3JsZC51bnNldE9iamVjdCBbV0FSTklOR10gbm8gY2VsbCBhdCBwb3M6JywgcG9zXG5cbiAgICBuZXdPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIF8uaXNTdHJpbmcgb2JqZWN0XG4gICAgICAgICAgICBpZiBvYmplY3Quc3RhcnRzV2l0aCAnbmV3J1xuICAgICAgICAgICAgICAgIHJldHVybiBldmFsIG9iamVjdCBcbiAgICAgICAgICAgIHJldHVybiBuZXcgKHJlcXVpcmUgXCIuLyN7b2JqZWN0LnRvTG93ZXJDYXNlKCl9XCIpKClcbiAgICAgICAgaWYgb2JqZWN0IGluc3RhbmNlb2YgSXRlbVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0KClcbiAgICAgICAgXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBvYmplY3QgPSBAbmV3T2JqZWN0IG9iamVjdFxuICAgICAgICBpZiBvYmplY3QgaW5zdGFuY2VvZiBMaWdodFxuICAgICAgICAgICAgQGxpZ2h0cy5wdXNoIG9iamVjdCAjIGlmIGxpZ2h0cy5pbmRleE9mKG9iamVjdCkgPCAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3RzLnB1c2ggb2JqZWN0ICMgaWYgb2JqZWN0cy5pbmRleE9mKG9iamVjdCkgPCAwIFxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBAdW5zZXRPYmplY3Qgb2JqZWN0XG4gICAgICAgIF8ucHVsbCBAbGlnaHRzLCBvYmplY3RcbiAgICAgICAgXy5wdWxsIEBvYmplY3RzLCBvYmplY3RcbiAgICBcbiAgICAjIG1vdmVPYmplY3RUb1BvczogKG9iamVjdCwgcG9zKSAtPlxuICAgICAgICAjIHJldHVybiBmYWxzZSBpZiBAaXNJbnZhbGlkUG9zKHBvcykgb3IgQGlzT2NjdXBpZWRQb3MocG9zKVxuICAgICAgICAjIEB1bnNldE9iamVjdCAgICBvYmplY3RcbiAgICAgICAgIyBAc2V0T2JqZWN0QXRQb3Mgb2JqZWN0LCBwb3NcbiAgICAgICAgIyB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAjIHRydWVcbiAgICAgICAgXG4gICAgdG9nZ2xlOiAob2JqZWN0TmFtZSkgLT5cbiAgICAgICAgb2JqZWN0ID0gQGdldE9iamVjdFdpdGhOYW1lIG9iamVjdE5hbWUgXG4gICAgICAgIG9iamVjdC5nZXRBY3Rpb25XaXRoTmFtZShcInRvZ2dsZVwiKS5wZXJmb3JtKClcbiAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgZGVsZXRlQWxsT2JqZWN0czogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWxsQWN0aW9ucygpXG4gICAgXG4gICAgICAgIGlmIEBwbGF5ZXI/XG4gICAgICAgICAgICBAcGxheWVyLmRlbCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICBvbGRTaXplID0gQGxpZ2h0cy5sZW5ndGhcbiAgICAgICAgICAgIGxhc3QoQGxpZ2h0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBsaWdodHMubGVuZ3RoXG4gICAgICAgICAgICAgICAga2Vycm9yIFwiV0FSTklORyBXb3JsZC5kZWxldGVBbGxPYmplY3RzIGxpZ2h0IG5vIGF1dG8gcmVtb3ZlXCJcbiAgICAgICAgICAgICAgICBAbGlnaHRzLnBvcCgpXG4gICAgXG4gICAgICAgIHdoaWxlIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2xkU2l6ZSA9IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgbGFzdChAb2JqZWN0cykuZGVsKCkgIyBkZXN0cnVjdG9yIHdpbGwgY2FsbCByZW1vdmUgb2JqZWN0XG4gICAgICAgICAgICBpZiBvbGRTaXplID09IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGtlcnJvciBcIldBUk5JTkcgV29ybGQuZGVsZXRlQWxsT2JqZWN0cyBvYmplY3Qgbm8gYXV0byByZW1vdmUgI3tsYXN0KEBvYmplY3RzKS5uYW1lfVwiXG4gICAgICAgICAgICAgICAgQG9iamVjdHMucG9wKClcbiAgICBcbiAgICBkZWxldGVPYmplY3RzV2l0aENsYXNzTmFtZTogKGNsYXNzTmFtZSkgLT5cbiAgICAgICAgZm9yIG8gaW4gXy5jbG9uZSBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgY2xhc3NOYW1lID09IG8uZ2V0Q2xhc3NOYW1lKClcbiAgICAgICAgICAgICAgICBvLmRlbCgpXG4gICAgXG4gICAgZ2V0T2JqZWN0V2l0aE5hbWU6IChvYmplY3ROYW1lKSAtPlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0TmFtZSA9PSBvLm5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb1xuICAgICAgICBrZXJyb3IgXCJXb3JsZC5nZXRPYmplY3RXaXRoTmFtZSBbV0FSTklOR10gbm8gb2JqZWN0IHdpdGggbmFtZSAje29iamVjdE5hbWV9XCJcbiAgICAgICAgbnVsbFxuICAgIFxuICAgIHNldENhbWVyYU1vZGU6IChtb2RlKSAtPiBAcGxheWVyLmNhbWVyYS5tb2RlID0gY2xhbXAgQ2FtZXJhLklOU0lERSwgQ2FtZXJhLkZPTExPVywgbW9kZVxuICAgIFxuICAgIGNoYW5nZUNhbWVyYU1vZGU6IC0+IEBwbGF5ZXIuY2FtZXJhLm1vZGUgPSAoQHBsYXllci5jYW1lcmEubW9kZSsxKSAlIChDYW1lcmEuRk9MTE9XKzEpXG4gICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgICAgICAwMDAgICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG9iamVjdFdpbGxNb3ZlVG9Qb3M6IChvYmplY3QsIHBvcywgZHVyYXRpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VQb3MgPSBvYmplY3QuZ2V0UG9zKClcbiAgICAgICAgdGFyZ2V0UG9zID0gbmV3IFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgICMga2xvZyBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgI3tvYmplY3QubmFtZX0gI3tkdXJhdGlvbn1cIiwgdGFyZ2V0UG9zXG4gICAgICAgIFxuICAgICAgICBpZiBAaXNJbnZhbGlkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gaW52YWxpZCB0YXJnZXRQb3M6XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VQb3MuZXFsIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwid29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBbV0FSTklOR10gI3tvYmplY3QubmFtZX0gZXF1YWwgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0Q2VsbCA9IEBnZXRDZWxsQXRQb3MgcG9zXG4gICAgICAgIGlmIHRhcmdldENlbGxcbiAgICAgICAgICAgIGlmIG9iamVjdEF0TmV3UG9zID0gdGFyZ2V0Q2VsbC5nZXRPY2N1cGFudCgpXG4gICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MgaW5zdGFuY2VvZiBUbXBPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0QXROZXdQb3MudGltZSA8IDAgYW5kIC1vYmplY3RBdE5ld1Bvcy50aW1lIDw9IGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAjIHRlbXBvcmFyeSBvYmplY3QgYXQgbmV3IHBvcyB3aWxsIHZhbmlzaCBiZWZvcmUgb2JqZWN0IHdpbGwgYXJyaXZlIC4gZGVsZXRlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBdE5ld1Bvcy5kZWwoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIFtXQVJOSU5HXSAje29iamVjdC5uYW1lfSB0aW1pbmcgY29uZmxpY3QgYXQgcG9zOlwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIndvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgW1dBUk5JTkddICN7b2JqZWN0Lm5hbWV9IGFscmVhZHkgb2NjdXBpZWQ6XCIsIHRhcmdldFBvcyBcbiAgICBcbiAgICAgICAgaWYgb2JqZWN0Lm5hbWUgIT0gJ3BsYXllcidcbiAgICAgICAgICAgIEB1bnNldE9iamVjdCBvYmplY3QgIyByZW1vdmUgb2JqZWN0IGZyb20gY2VsbCBncmlkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG9sZCBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiBzb3VyY2VQb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC50aW1lID0gLWR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCBzb3VyY2VQb3MgXG5cbiAgICAgICAgICAgIHRtcE9iamVjdCA9IG5ldyBUbXBPYmplY3Qgb2JqZWN0ICAjIGluc2VydCB0bXAgb2JqZWN0IGF0IG5ldyBwb3NcbiAgICAgICAgICAgIHRtcE9iamVjdC5zZXRQb3NpdGlvbiB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0bXBPYmplY3QudGltZSA9IGR1cmF0aW9uXG4gICAgICAgICAgICBAYWRkT2JqZWN0QXRQb3MgdG1wT2JqZWN0LCB0YXJnZXRQb3MgXG5cbiAgICBvYmplY3RNb3ZlZDogKG1vdmVkT2JqZWN0LCBmcm9tLCB0bykgLT5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZVBvcyA9IG5ldyBQb3MgZnJvbVxuICAgICAgICB0YXJnZXRQb3MgPSBuZXcgUG9zIHRvXG5cbiAgICAgICAgaWYgQGlzSW52YWxpZFBvcyB0YXJnZXRQb3NcbiAgICAgICAgICAgICBrZXJyb3IgXCJXb3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBpbnZhbGlkIHRhcmdldFBvczpcIiB0YXJnZXRQb3NcbiAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZUNlbGwgPSBAZ2V0Q2VsbEF0UG9zIHNvdXJjZVBvc1xuICAgICAgICB0YXJnZXRDZWxsID0gQGdldENlbGxBdFBvcyB0YXJnZXRQb3NcbiAgICAgICAgXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHNvdXJjZUNlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuXG4gICAgICAgIGlmIHRtcE9iamVjdCA9IHRhcmdldENlbGw/LmdldE9iamVjdE9mVHlwZSBUbXBPYmplY3QgXG4gICAgICAgICAgICB0bXBPYmplY3QuZGVsKCkgaWYgdG1wT2JqZWN0Lm9iamVjdCA9PSBtb3ZlZE9iamVjdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc09jY3VwaWVkUG9zIHRhcmdldFBvc1xuICAgICAgICAgICAga2Vycm9yIFwiV29ybGQub2JqZWN0TW92ZWQgW1dBUk5JTkddICN7bW92ZWRPYmplY3QubmFtZX0gb2NjdXBpZWQgdGFyZ2V0IHBvczpcIiB0YXJnZXRQb3NcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBzb3VyY2VDZWxsP1xuICAgICAgICAgICAgc291cmNlQ2VsbC5yZW1vdmVPYmplY3QgbW92ZWRPYmplY3RcbiAgICAgICAgICAgIGlmIHNvdXJjZUNlbGwuaXNFbXB0eSgpXG4gICAgICAgICAgICAgICAgQGNlbGxzW0Bwb3NUb0luZGV4KHNvdXJjZVBvcyldID0gbnVsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrbG9nICdubyBzb3VyY2VDZWxsPydcbiAgICAgICAgXG4gICAgICAgIHRhcmdldENlbGwgPSBAZ2V0Q2VsbEF0UG9zIHRhcmdldFBvcyAgICBcbiAgICAgICAgaWYgbm90IHRhcmdldENlbGw/XG4gICAgICAgICAgICBjZWxsSW5kZXggPSBAcG9zVG9JbmRleCB0YXJnZXRQb3MgXG4gICAgICAgICAgICB0YXJnZXRDZWxsID0gbmV3IENlbGwoKVxuICAgICAgICAgICAgQGNlbGxzW2NlbGxJbmRleF0gPSB0YXJnZXRDZWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgJ3RhcmdldENlbGw/J1xuXG4gICAgICAgIGlmIHRhcmdldENlbGw/XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmFkZE9iamVjdCBtb3ZlZE9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrZXJyb3IgXCJ3b3JsZC5vYmplY3RNb3ZlZCBbV0FSTklOR10gI3ttb3ZlZE9iamVjdC5uYW1lfSBubyB0YXJnZXQgY2VsbD9cIlxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgICAgICBcbiAgICBcbiAgICBzdGVwOiAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24uc3RlcCgpXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgICAgICBcbiAgICAgICAgY2FtZXJhID0gQHBsYXllcj8uY2FtZXJhLmNhbVxuICAgIFxuICAgICAgICBUaW1lci50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIFRpbWVyLmZpbmlzaEFjdGlvbnMoKVxuICAgICAgICBcbiAgICAgICAgby5zdGVwPygpIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgIFxuICAgICAgICBpZiBAcGxheWVyIHRoZW4gQHN0ZXBQbGF5ZXIoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEByZW5kZXJlci5zZXRWaWV3cG9ydCAwLCBNYXRoLmZsb29yKEBzY3JlZW5TaXplLmgqMC43MiksIEBzY3JlZW5TaXplLncsIE1hdGguZmxvb3IoQHNjcmVlblNpemUuaCowLjMpXG4gICAgICAgIFxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyIEB0ZXh0LnNjZW5lLCBAdGV4dC5jYW1lcmEgaWYgQHRleHRcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAbWVudS5zY2VuZSwgQG1lbnUuY2FtZXJhIGlmIEBtZW51XG5cbiAgICBzdGVwUGxheWVyOiAtPlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBwcmV2aWV3XG4gICAgICAgICAgICBAcGxheWVyLmNhbWVyYS5jYW0uYXNwZWN0ID0gQHNjcmVlblNpemUudyAvIChAc2NyZWVuU2l6ZS5oKjAuNjYpXG4gICAgICAgIEBwbGF5ZXIuY2FtZXJhLnN0ZXAoKVxuXG4gICAgICAgIFNvdW5kLnNldE1hdHJpeCBAcGxheWVyLmNhbWVyYVxuICAgICAgICAgICAgXG4gICAgICAgIEBwbGF5ZXIuc2V0T3BhY2l0eSBjbGFtcCAwLCAxLCBAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpLm1pbnVzKEBwbGF5ZXIuY3VycmVudF9wb3NpdGlvbikubGVuZ3RoKCktMC40XG4gICAgICAgIFxuICAgICAgICBzdG9uZXMgPSBbXVxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbyBpbnN0YW5jZW9mIFN0b25lXG4gICAgICAgICAgICAgICAgc3RvbmVzLnB1c2ggb1xuICAgICAgICBzdG9uZXMuc29ydCAoYSxiKSA9PiBiLnBvc2l0aW9uLm1pbnVzKEBwbGF5ZXIuY2FtZXJhLmdldFBvc2l0aW9uKCkpLmxlbmd0aCgpIC0gYS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICBcbiAgICAgICAgb3JkZXIgPSAxMDBcbiAgICAgICAgZm9yIHN0b25lIGluIHN0b25lc1xuICAgICAgICAgICAgc3RvbmUubWVzaC5yZW5kZXJPcmRlciA9IG9yZGVyXG4gICAgICAgICAgICBvcmRlciArPSAxXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGQgPSBzdG9uZS5wb3NpdGlvbi5taW51cyhAcGxheWVyLmNhbWVyYS5nZXRQb3NpdGlvbigpKS5sZW5ndGgoKVxuICAgICAgICAgICAgaWYgZCA8IDEuMFxuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5ID0gc3RvbmUubWVzaC5tYXRlcmlhbC5vcGFjaXR5IGlmIG5vdCBzdG9uZS5tZXNoLm1hdGVyaWFsLm9yaWdfb3BhY2l0eT9cbiAgICAgICAgICAgICAgICBzdG9uZS5tZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjIgKyBkICogMC41XG4gICAgICAgICAgICBlbHNlIGlmIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5P1xuICAgICAgICAgICAgICAgIHN0b25lLm1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b25lLm1lc2gubWF0ZXJpYWwub3JpZ19vcGFjaXR5XG4gICAgICAgIFxuICAgICAgICBAc3VuLnBvc2l0aW9uLmNvcHkgQHBsYXllci5jYW1lcmEuY2FtLnBvc2l0aW9uXG4gICAgICAgIEByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciA9IGZhbHNlXG5cbiAgICAgICAgaWYgQHByZXZpZXdcbiAgICAgICAgICAgIEByZW5kZXJlci5zZXRWaWV3cG9ydCAwLCAwLCBAc2NyZWVuU2l6ZS53LCBNYXRoLmZsb29yIEBzY3JlZW5TaXplLmgqMC42NlxuICAgICAgICBcbiAgICAgICAgQHJlbmRlcmVyLnJlbmRlciBAc2NlbmUsIEBwbGF5ZXIuY2FtZXJhLmNhbSAgICAgICAgXG4gICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgZ2V0VGltZTogLT4gbm93KCkudG9GaXhlZCAwXG4gICAgc2V0U3BlZWQ6IChzKSAtPiBAc3BlZWQgPSBzXG4gICAgZ2V0U3BlZWQ6IC0+IEBzcGVlZFxuICAgIG1hcE1zVGltZTogICh1bm1hcHBlZCkgLT4gcGFyc2VJbnQgMTAuMCAqIHVubWFwcGVkL0BzcGVlZFxuICAgIHVubWFwTXNUaW1lOiAobWFwcGVkKSAtPiBwYXJzZUludCBtYXBwZWQgKiBAc3BlZWQvMTAuMFxuICAgICAgICBcbiAgICBjb250aW51b3VzOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJjb250aW51b3VzXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5DT05USU5VT1VTXG5cbiAgICBvbmNlOiAoY2IpIC0+XG4gICAgICAgIG5ldyBBY3Rpb24gXG4gICAgICAgICAgICBmdW5jOiBjYlxuICAgICAgICAgICAgbmFtZTogXCJvbmNlXCJcbiAgICAgICAgICAgIG1vZGU6IEFjdGlvbi5PTkNFXG5cbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICBcbiAgICByZXNpemVkOiAodyxoKSA9PlxuICAgICAgICBcbiAgICAgICAgQGFzcGVjdCA9IHcvaFxuICAgICAgICBAc2NyZWVuU2l6ZSA9IG5ldyBTaXplIHcsaFxuICAgICAgICBjYW1lcmEgPSBAcGxheWVyPy5jYW1lcmEuY2FtXG4gICAgICAgIGNhbWVyYT8uYXNwZWN0ID0gQGFzcGVjdFxuICAgICAgICBjYW1lcmE/LnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuICAgICAgICBAcmVuZGVyZXI/LnNldFNpemUgdyxoXG4gICAgICAgIEB0ZXh0Py5yZXNpemVkIHcsaFxuICAgICAgICBAbWVudT8ucmVzaXplZCB3LGhcbiAgICAgICAgXG4gICAgICAgIEBsZXZlbFNlbGVjdGlvbj8ucmVzaXplZCB3LGhcblxuICAgIGdldE5lYXJlc3RWYWxpZFBvczogKHBvcykgLT5cbiAgICAgICAgbmV3IFBvcyBNYXRoLm1pbihAc2l6ZS54LTEsIE1hdGgubWF4KHBvcy54LCAwKSksIFxuICAgICAgICAgICAgICAgIE1hdGgubWluKEBzaXplLnktMSwgTWF0aC5tYXgocG9zLnksIDApKSwgXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oQHNpemUuei0xLCBNYXRoLm1heChwb3MueiwgMCkpXG4gICAgXG4gICAgaXNVbm9jY3VwaWVkUG9zOiAocG9zKSAtPiBub3QgQGlzT2NjdXBpZWRQb3MgcG9zXG4gICAgaXNPY2N1cGllZFBvczogICAocG9zKSAtPiAgICAgICAgXG4gICAgICAgIGlmIEBpc0ludmFsaWRQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBpZiBAZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgICMga2xvZyBcImlzT2NjdXBpZWRQb3Mgb2NjdXBhbnQ6ICN7QGdldE9jY3VwYW50QXRQb3MocG9zKS5uYW1lfSBhdCBwb3M6XCIsIG5ldyBQb3MgcG9zXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIFxuICAgIG1heU9iamVjdFB1c2hUb1BvczogKG9iamVjdCwgcG9zLCBkdXJhdGlvbikgLT5cbiAgICAgICAgIyBrbG9nIFwid29ybGQubWF5T2JqZWN0UHVzaFRvUG9zIG9iamVjdDoje29iamVjdC5uYW1lfSBkdXJhdGlvbjoje2R1cmF0aW9ufVwiLCBwb3NcbiAgICAgICAgIyByZXR1cm5zIHRydWUsIGlmIGEgcHVzaGFibGUgb2JqZWN0IGlzIGF0IHBvcyBhbmQgbWF5IGJlIHB1c2hlZFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3NcbiAgICAgICAgXG4gICAgICAgIGRpcmVjdGlvbiA9IHBvcy5taW51cyBvYmplY3QuZ2V0UG9zKCkgIyBkaXJlY3Rpb24gZnJvbSBvYmplY3QgdG8gcHVzaGFibGUgb2JqZWN0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2UgaWYgQGlzSW52YWxpZFBvcyBwb3MucGx1cyBkaXJlY3Rpb25cbiAgICAgICAgXG4gICAgICAgIG9iamVjdEF0TmV3UG9zID0gQGdldE9jY3VwYW50QXRQb3MgcG9zLnBsdXMgZGlyZWN0aW9uXG4gICAgICAgIGlmIG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICBpZiBvYmplY3RBdE5ld1BvcyBpbnN0YW5jZW9mIFRtcE9iamVjdFxuICAgICAgICAgICAgICAgIHRtcE9iamVjdCA9IG9iamVjdEF0TmV3UG9zXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgdG1wT2JqZWN0LnRpbWUgPCAwIGFuZCAtdG1wT2JqZWN0LnRpbWUgPD0gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB0ZW1wb3Jhcnkgb2JqZWN0IGF0IG5ldyBwb3Mgd2lsbCB2YW5pc2ggYmVmb3JlIG9iamVjdCB3aWxsIGFycml2ZSAtPiBkZWxldGUgaXRcbiAgICAgICAgICAgICAgICAgICAgdG1wT2JqZWN0LmRlbCgpXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAgXG4gICAgICAgIHB1c2hhYmxlT2JqZWN0ID0gQGdldE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICMga2xvZyBcInB1c2hhYmxlT2JqZWN0ICN7cHVzaGFibGVPYmplY3Q/Lm5hbWV9XCJcbiAgICAgICAgaWYgcHVzaGFibGVPYmplY3Q/IGFuZCBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIFB1c2hhYmxlICNhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBwdXNoYWJsZU9iamVjdCBpbnN0YW5jZW9mIE1vdG9yR2VhciAjIGJhZFxuICAgICAgICAgICAgcHVzaGFibGVPYmplY3QucHVzaGVkQnlPYmplY3RJbkRpcmVjdGlvbiBvYmplY3QsIGRpcmVjdGlvbiwgZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgXG4gICAgICAgIGZhbHNlXG4gICAgXG4gICAgIyAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcbiAgICBcbiAgICBzaG93TWVudTogKHNlbGYpIC0+XG5cbiAgICAgICAgQHRleHQ/LmRlbCgpXG4gICAgICAgIEBtZW51ID0gbmV3IE1lbnUoKVxuICAgICAgICBAbWVudS5hZGRJdGVtICdsb2FkJyAgICAgICA9PiBAbGV2ZWxTZWxlY3Rpb24gPSBuZXcgTGV2ZWxTZWwgQFxuICAgICAgICBAbWVudS5hZGRJdGVtICdyZXNldCcgICAgICBAcmVzdGFydCBcbiAgICAgICAgQG1lbnUuYWRkSXRlbSAnaGVscCcgICAgICAgPT4gQHRleHQgPSBuZXcgU2NyZWVuVGV4dCBAZGljdFsnaGVscCddXG4gICAgICAgIEBtZW51LmFkZEl0ZW0gJ3F1aXQnICAgICAgIC0+IHBvc3QudG9NYWluICdxdWl0QXBwJ1xuICAgICAgICBAbWVudS5zaG93KClcbiAgICBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiAgICAjICAgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcbiAgICBcbiAgICBnZXRJbnNpZGVXYWxsUG9zV2l0aERlbHRhOiAocG9zLCBkZWx0YSkgLT5cbiAgICAgICAgXG4gICAgICAgIGluc2lkZVBvcyA9IG5ldyBWZWN0b3IgcG9zXG4gICAgICAgIGZvciB3IGluIFswLi41XVxuICAgICAgICAgICAgcGxhbmVQb3MgPSBuZXcgVmVjdG9yIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgICAgIGlmIHcgPj0gMyB0aGVuIHBsYW5lUG9zLmFkZCBAc2l6ZVxuICAgICAgICAgICAgZiA9IFZlY3Rvci5yYXlQbGFuZUludGVyc2VjdGlvbkZhY3RvciBwb3MsIFdvcmxkLm5vcm1hbHNbd10ubmVnKCksIHBsYW5lUG9zLCBXb3JsZC5ub3JtYWxzW3ddXG4gICAgICAgICAgICBpZiBmIDwgZGVsdGFcbiAgICAgICAgICAgICAgICBpbnNpZGVQb3MuYWRkIFdvcmxkLm5vcm1hbHNbd10ubXVsIGRlbHRhLWZcbiAgICAgICAgaW5zaWRlUG9zXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUG9zOiAocG9zKSAtPiAjIGRpc3RhbmNlIHRvIHRoZSBuZXh0IHdhbGwgKHBvc2l0aXZlIG9yIG5lZ2F0aXZlKVxuICAgICAgICBtaW5fZiA9IDEwMDAwXG4gICAgICAgIGZvciB3IGluIFswLi41XSBcbiAgICAgICAgICAgIHBsYW5lUG9zID0gbmV3IFZlY3RvciAtMC41LCAtMC41LCAtMC41XG4gICAgICAgICAgICBpZiB3ID49IDMgdGhlbiBwbGFuZVBvcy5hZGQgQHNpemVcbiAgICAgICAgICAgIGYgPSBWZWN0b3IucmF5UGxhbmVJbnRlcnNlY3Rpb25GYWN0b3IgcG9zLCBXb3JsZC5ub3JtYWxzW3ddLm5lZygpLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBhYnNNaW4gbWluX2YsIGYgXG4gICAgICAgIG1pbl9mXG4gICAgXG4gICAgZ2V0V2FsbERpc3RhbmNlRm9yUmF5OiAocmF5UG9zLCByYXlEaXIpIC0+ICMgZGlzdGFuY2UgdG8gdGhlIG5leHQgd2FsbCBpbiByYXlEaXIgXG4gICAgICAgIG1pbl9mID0gMTAwMDBcbiAgICAgICAgZm9yIHcgaW4gWzAuLjVdXG4gICAgICAgICAgICBwbGFuZVBvcyA9IG5ldyBWZWN0b3IgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICAgICAgaWYgdyA+PSAzIHRoZW4gcGxhbmVQb3MuYWRkIEBzaXplXG4gICAgICAgICAgICBmID0gVmVjdG9yLnJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yIHJheVBvcywgcmF5RGlyLCBwbGFuZVBvcywgV29ybGQubm9ybWFsc1t3XVxuICAgICAgICAgICAgbWluX2YgPSBmIGlmIGYgPj0gMC4wIGFuZCBmIDwgbWluX2ZcbiAgICAgICAgbWluX2ZcbiAgICBcbiAgICBkaXNwbGF5TGlnaHRzOiAoKSAtPlxuICAgICAgICBmb3IgbGlnaHQgaW4gQGxpZ2h0c1xuICAgICAgICAgICAgbGlnaHQuZGlzcGxheSgpXG4gICAgICAgICAgICAgICBcbiAgICBwbGF5U291bmQ6IChzb3VuZCwgcG9zLCB0aW1lKSAtPiBTb3VuZC5wbGF5IHNvdW5kLCBwb3MsIHRpbWUgaWYgbm90IEBjcmVhdGluZ1xuICAgIFxuICAgICMgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAwMDAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgIFxuICAgICMgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGxldmVsU2VsZWN0aW9uXG4gICAgICAgICAgICBAbGV2ZWxTZWxlY3Rpb24ubW9kS2V5Q29tYm9FdmVudCBtb2QsIGtleSwgY29tYm8sIGV2ZW50IFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVudT8gICAgICAgICAgICBcbiAgICAgICAgICAgIEBtZW51Lm1vZEtleUNvbWJvRXZlbnQgbW9kLCBrZXksIGNvbWJvLCBldmVudCBcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIFxuICAgICAgICBAdGV4dD8uZmFkZU91dCgpXG4gICAgICAgIHJldHVybiBpZiBAcGxheWVyPy5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyB0aGVuIEBzaG93TWVudSgpXG4gICAgICAgICAgICB3aGVuICc9JyB0aGVuIEBzcGVlZCA9IE1hdGgubWluIDEwLCBAc3BlZWQrMVxuICAgICAgICAgICAgd2hlbiAnLScgdGhlbiBAc3BlZWQgPSBNYXRoLm1heCAxLCAgQHNwZWVkLTFcbiAgICAgICAgICAgIHdoZW4gJ3InIHRoZW4gQHJlc3RhcnQoKVxuICAgICAgICAgICAgd2hlbiAnbicgdGhlbiBAZXhpdExldmVsKClcbiAgICAgICAgICAgIHdoZW4gJ20nIHRoZW4gQGV4aXRMZXZlbCA1XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEBsZXZlbFNlbGVjdGlvblxuICAgICAgICByZXR1cm4gaWYgQHBsYXllcj8ubW9kS2V5Q29tYm9FdmVudFVwIG1vZCwga2V5LCBjb21ibywgZXZlbnQgICAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkXG5cbiJdfQ==
//# sourceURL=../coffee/world.coffee