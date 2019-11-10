// koffee 1.4.0
var Action, Bot, Bullet, Material, Pos, Pushable, Quaternion, Timer, Vector, klog,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

klog = require('kxk').klog;

Pushable = require('./pushable');

Action = require('./action');

Timer = require('./timer');

Bullet = require('./bullet');

Pos = require('./lib/pos');

Vector = require('./lib/vector');

Quaternion = require('./lib/quaternion');

Material = require('./material');

Bot = (function(superClass) {
    extend(Bot, superClass);

    function Bot() {
        this.direction = new Vector;
        this.orientation = new Quaternion;
        this.current_orientation = new Quaternion;
        this.rotate_orientation = new Quaternion;
        this.climb_orientation = new Quaternion;
        this.rest_orientation = new Quaternion;
        this.left_tire_rot = 0.0;
        this.right_tire_rot = 0.0;
        this.minMoves = 100;
        this.move = false;
        this.push = false;
        this.jump = false;
        this.shoot = false;
        this.jump_once = false;
        this.died = false;
        this.move_action = null;
        this.rotate_action = null;
        this.dir_sgn = 1.0;
        Bot.__super__.constructor.apply(this, arguments);
        this.addAction(new Action(this, Action.FORWARD, "move forward", 200));
        this.addAction(new Action(this, Action.CLIMB_UP, "climb up", 200));
        this.addAction(new Action(this, Action.CLIMB_DOWN, "climb down", 500));
        this.addAction(new Action(this, Action.TURN_LEFT, "turn left", 200));
        this.addAction(new Action(this, Action.TURN_RIGHT, "turn right", 200));
        this.addAction(new Action(this, Action.JUMP, "jump", 120));
        this.addAction(new Action(this, Action.JUMP_FORWARD, "jump forward", 200));
        this.addAction(new Action(this, Action.FALL_FORWARD, "fall forward", 200));
        this.addAction(new Action(this, Action.SHOOT, "shoot", 200, Action.REPEAT));
        this.getActionWithId(Action.FALL).duration = 120;
        this.addEventWithName("died");
        this.startTimedAction(this.getActionWithId(Action.NOOP), 500);
    }

    Bot.prototype.createMesh = function() {
        var Mutant, geom, mutant, nmatr, nose, rot, tireMat, tireRadius, trans;
        tireRadius = 0.05;
        nose = new THREE.ConeGeometry(0.404, 0.5, 32, 16, true);
        geom = new THREE.SphereGeometry(0.5, 32, 32, 16, Math.PI);
        geom = new THREE.SphereGeometry(0.5, 32, 32, 0, 2 * Math.PI, 0, 2.2);
        nmatr = new THREE.Matrix4();
        trans = new THREE.Vector3(0, -0.543, 0);
        rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Vector.DEG2RAD(180), 0, 0));
        nmatr.compose(trans, rot, new THREE.Vector3(1, 1, 1));
        geom.merge(nose, nmatr);
        geom.rotateX(Vector.DEG2RAD(-90));
        geom.scale(0.7, 0.7, 0.7);
        Mutant = require('./mutant');
        mutant = this instanceof Mutant;
        this.mesh = new THREE.Mesh(geom, mutant && Material.mutant.clone() || Material.player);
        geom = new THREE.TorusGeometry(0.5 - tireRadius, tireRadius, 16, 32);
        geom.scale(1, 1, 2.5);
        tireMat = mutant && Material.mutantTire.clone() || Material.tire;
        this.leftTire = new THREE.Mesh(geom, tireMat);
        this.leftTire.position.set(0.35, 0, 0);
        this.leftTire.rotation.set(0, Vector.DEG2RAD(90), 0);
        this.mesh.add(this.leftTire);
        this.rightTire = new THREE.Mesh(geom, tireMat);
        this.rightTire.position.set(-0.35, 0, 0);
        this.rightTire.rotation.set(0, Vector.DEG2RAD(-90), 0);
        this.mesh.add(this.rightTire);
        this.mesh.castShadow = this.rightTire.castShadow = this.leftTire.castShadow = true;
        return this.mesh.receiveShadow = this.leftTire.receiveShadow = this.rightTire.receiveShadow = true;
    };

    Bot.prototype.setOpacity = function(opacity) {
        var botMat, tireMat;
        tireMat = this.leftTire.material;
        botMat = this.mesh.material;
        tireMat.visible = opacity > 0;
        tireMat.depthWrite = opacity > 0.5;
        botMat.depthWrite = opacity > 0.5;
        botMat.opacity = opacity;
        return tireMat.opacity = opacity;
    };

    Bot.prototype.getDown = function() {
        return this.orientation.rotate(Vector.minusY);
    };

    Bot.prototype.getUp = function() {
        return this.orientation.rotate(Vector.unitY);
    };

    Bot.prototype.getDir = function(dir) {
        if (dir == null) {
            dir = this.dir_sgn;
        }
        return this.orientation.rotate(new Vector(0, 0, dir));
    };

    Bot.prototype.currentPos = function() {
        return this.current_position.clone();
    };

    Bot.prototype.currentDir = function() {
        return this.current_orientation.rotate(Vector.unitZ).normal();
    };

    Bot.prototype.currentUp = function() {
        return this.current_orientation.rotate(Vector.unitY).normal();
    };

    Bot.prototype.currentLeft = function() {
        return this.current_orientation.rotate(Vector.unitX).normal();
    };

    Bot.prototype.die = function() {
        Timer.removeActionsOfObject(this);
        this.move = false;
        this.jump = false;
        this.shoot = false;
        this.push = false;
        this.getEventWithName("died").triggerActions();
        return this.died = true;
    };

    Bot.prototype.reset = function() {
        this.left_tire_rot = 0.0;
        this.right_tire_rot = 0.0;
        this.direction.reset();
        this.orientation.reset();
        this.current_orientation.reset();
        this.rotate_orientation.reset();
        this.climb_orientation.reset();
        this.rest_orientation.reset();
        this.move_action = null;
        this.move = false;
        this.push = false;
        this.jump = false;
        this.shoot = false;
        this.jump_once = false;
        return this.died = false;
    };

    Bot.prototype.isFalling = function() {
        return this.move_action && this.move_action.id === Action.FALL;
    };

    Bot.prototype.initAction = function(action) {
        var newPos;
        newPos = new Pos(this.position);
        switch (action.id) {
            case Action.NOOP:
                return;
            case Action.FORWARD:
                newPos.add(this.getDir());
                break;
            case Action.CLIMB_DOWN:
                newPos.add(this.getDir().plus(this.getDown()));
                break;
            case Action.JUMP:
                newPos.add(this.getUp());
                break;
            case Action.JUMP_FORWARD:
                newPos.add(this.getUp().plus(this.getDir()));
                break;
            case Action.FALL_FORWARD:
                newPos.add(this.getDown().plus(this.getDir()));
                break;
            case Action.FALL:
                if (!this.direction.isZero()) {
                    Bot.__super__.initAction.call(this, action);
                    return;
                }
                newPos.add(this.getDown());
                break;
            default:
                Bot.__super__.initAction.call(this, action);
                return;
        }
        if (!newPos.eql(new Pos(this.position))) {
            return world.objectWillMoveToPos(this, newPos, action.getDuration());
        }
    };

    Bot.prototype.performAction = function(action) {
        var relTime, rotTime, rotVec, sinFac;
        relTime = action.getRelativeTime();
        rotTime = (action.current - action.last) / parseInt(10 * action.duration / 6);
        switch (action.id) {
            case Action.SHOOT:
                if (action.atStart()) {
                    Bullet.shootFromBot(this);
                }
                break;
            case Action.NOOP:
                return;
            case Action.FORWARD:
                this.left_tire_rot += this.dir_sgn * rotTime;
                this.right_tire_rot += this.dir_sgn * rotTime;
                this.current_position = this.position.plus(this.getDir().mul(relTime));
                return;
            case Action.JUMP:
                sinFac = Math.sin(Math.PI / 2 * relTime);
                this.current_position = this.position.plus(this.getUp().mul(sinFac));
                return;
            case Action.JUMP_FORWARD:
                sinFac = Math.sin(Math.PI / 2 * relTime);
                this.left_tire_rot += 1 - Math.cos(Math.PI / 2 * rotTime);
                this.right_tire_rot += 1 - Math.cos(Math.PI / 2 * rotTime);
                this.current_position = this.position.plus(this.getDir().mul(relTime).plus(this.getUp().mul(sinFac)));
                return;
            case Action.FALL_FORWARD:
                this.current_position = this.position.plus(this.getDir().mul(relTime).plus(this.getDown().mul(relTime)));
                return;
            case Action.FALL:
                if (!this.direction.isZero()) {
                    Bot.__super__.performAction.call(this, action);
                    return;
                }
                klog('still needed?');
                this.current_position = this.position.plus(this.getDown().mul(relTime));
                return;
            case Action.CLIMB_UP:
                this.left_tire_rot += this.dir_sgn * rotTime / 2;
                this.right_tire_rot += this.dir_sgn * rotTime / 2;
                this.climb_orientation = Quaternion.rotationAroundVector(this.dir_sgn * relTime * -90.0, Vector.unitX);
                break;
            case Action.CLIMB_DOWN:
                this.left_tire_rot += this.dir_sgn * rotTime;
                this.right_tire_rot += this.dir_sgn * rotTime;
                if (relTime <= 0.2) {
                    this.current_position = this.position.plus(this.getDir().mul((relTime / 0.2) / 2));
                } else if (relTime >= 0.8) {
                    this.climb_orientation = Quaternion.rotationAroundVector(this.dir_sgn * 90.0, Vector.unitX);
                    this.current_position = this.position.plus(this.getDir().plus(this.getDown().mul(0.5 + (relTime - 0.8) / 0.2 / 2)));
                } else {
                    this.climb_orientation = Quaternion.rotationAroundVector(this.dir_sgn * (relTime - 0.2) / 0.6 * 90.0, Vector.unitX);
                    rotVec = (this.orientation.mul(this.climb_orientation)).rotate(Vector.unitY);
                    this.current_position = this.position.plus(this.getDir().plus(this.getDown()).plus(rotVec).mul(0.5));
                }
                break;
            case Action.TURN_RIGHT:
            case Action.TURN_LEFT:
                if (this.move_action === null && action.atStart()) {
                    if (action.id === Action.TURN_LEFT) {
                        this.orientation = this.orientation.mul(Quaternion.rotationAroundVector(90.0, Vector.unitY));
                        this.rest_orientation = Quaternion.rotationAroundVector(-90.0, Vector.unitY);
                    } else {
                        this.orientation = this.orientation.mul(Quaternion.rotationAroundVector(-90.0, Vector.unitY));
                        this.rest_orientation = Quaternion.rotationAroundVector(90.0, Vector.unitY);
                    }
                }
                if (action.id === Action.TURN_LEFT) {
                    this.left_tire_rot += -rotTime;
                    this.right_tire_rot += rotTime;
                    this.rotate_orientation = Quaternion.rotationAroundVector(relTime * 90.0, Vector.unitY);
                } else {
                    this.left_tire_rot += rotTime;
                    this.right_tire_rot += -rotTime;
                    this.rotate_orientation = Quaternion.rotationAroundVector(relTime * -90.0, Vector.unitY);
                }
                break;
            default:
                Bot.__super__.performAction.call(this, action);
                return;
        }
        return this.current_orientation = this.orientation.mul(this.climb_orientation.mul(this.rotate_orientation.mul(this.rest_orientation)));
    };

    Bot.prototype.finishAction = function(action) {
        var targetPos;
        switch (action.id) {
            case Action.NOOP:
            case Action.SHOOT:
                return;
            case Action.PUSH:
            case Action.FALL:
                this.move_action = null;
                Bot.__super__.finishAction.call(this, action);
                return;
            case Action.TURN_LEFT:
            case Action.TURN_RIGHT:
                this.rotate_action = null;
                if (this.move_action) {
                    this.rest_orientation = this.rest_orientation.mul(this.rotate_orientation);
                    this.rotate_orientation.reset();
                } else {
                    this.orientation = this.orientation.mul(this.rotate_orientation.mul(this.rest_orientation));
                    this.rotate_orientation.reset();
                    this.rest_orientation.reset();
                }
                return;
        }
        if (action.id > Action.SHOOT) {
            return;
        }
        this.move_action = null;
        this.orientation = this.orientation.mul(this.climb_orientation);
        this.climb_orientation.reset();
        if (this.rotate_action && action.id !== Action.JUMP_FORWARD) {
            if (this.rotate_action.id === Action.TURN_LEFT) {
                this.orientation = this.orientation.mul(Quaternion.rotationAroundVector(90.0, new Vector(0, 1, 0)).mul(this.rest_orientation));
                this.rest_orientation = Quaternion.rotationAroundVector(-90.0, Vector.unitY);
            } else {
                this.orientation = this.orientation.mul(Quaternion.rotationAroundVector(-90.0, new Vector(0, 1, 0)).mul(this.rest_orientation));
                this.rest_orientation = Quaternion.rotationAroundVector(90.0, Vector.unitY);
            }
        }
        if (action.id !== Action.CLIMB_UP) {
            targetPos = this.current_position.round();
            world.objectMoved(this, this.position, targetPos);
            this.position = targetPos;
        }
        if (action.id !== Action.JUMP_FORWARD && this.rotate_action === null) {
            this.orientation = this.orientation.mul(this.rest_orientation);
            return this.rest_orientation.reset();
        }
    };

    Bot.prototype.actionFinished = function(action) {
        var forwardPos, occupant, ref, ref1;
        if (action.id === Action.PUSH && !this.direction.isZero()) {
            Bot.__super__.actionFinished.call(this, action);
            return;
        }
        if (this.move_action != null) {
            return;
        }
        if (action.id === Action.JUMP_FORWARD) {
            forwardPos = this.position.plus(this.getDir());
            if (world.isUnoccupiedPos(forwardPos)) {
                if (world.isUnoccupiedPos(forwardPos.minus(this.getUp()))) {
                    this.move_action = this.getActionWithId(Action.FALL_FORWARD);
                } else {
                    this.move_action = this.getActionWithId(Action.FORWARD);
                    world.playSound('BOT_LAND', this.getPos(), 0.25);
                }
            } else {
                if (world.isUnoccupiedPos(this.position.minus(this.getUp()))) {
                    this.move_action = this.getActionWithId(Action.CLIMB_UP);
                    world.playSound('BOT_LAND', this.getPos(), 0.5);
                }
            }
        } else if (world.isUnoccupiedPos(this.position.plus(this.getDown()))) {
            if (this.move) {
                if (world.isUnoccupiedPos(this.position.plus(this.getDir()))) {
                    if (world.isOccupiedPos(this.position.plus(this.getDir().minus(this.getUp())))) {
                        occupant = world.getOccupantAtPos(this.position.plus(this.getDir().minus(this.getUp())));
                        if ((occupant == null) || !(occupant != null ? occupant.isSlippery() : void 0)) {
                            this.move_action = this.getActionWithId(Action.FORWARD);
                        }
                    }
                } else {
                    occupant = world.getOccupantAtPos(this.position.plus(this.getDir()));
                    if ((occupant == null) || !(occupant != null ? occupant.isSlippery() : void 0)) {
                        this.move_action = this.getActionWithId(Action.CLIMB_UP);
                    }
                }
            }
            if (this.move_action == null) {
                this.move_action = this.getActionWithId(Action.FALL);
                this.direction = this.getDown();
            }
        } else if ((ref = action.id) === Action.FALL_FORWARD || ref === Action.FALL) {
            if (this.name === 'player') {
                world.playSound('BOT_LAND');
            } else {
                world.playSound('BOT_LAND', this.getPos());
            }
        }
        if (this.move_action != null) {
            Timer.addAction(this.move_action);
            return;
        }
        if (this.rotate_action != null) {
            return;
        }
        this.setPosition(this.current_position.round());
        this.setOrientation(this.current_orientation.round());
        if (this.move || this.jump || this.jump_once) {
            return this.moveBot();
        } else {
            this.dir_sgn = 1;
            if (action.id !== Action.NOOP) {
                this.jump_once = false;
            }
            if ((ref1 = world.getRealOccupantAtPos(this.position.plus(this.getDown()))) != null ? typeof ref1.isMutant === "function" ? ref1.isMutant() : void 0 : void 0) {
                klog('bot.actionFinished mutant below: startTimedAction NOOP');
                return this.startTimedAction(this.getActionWithId(Action.NOOP), 0);
            }
        }
    };

    Bot.prototype.moveBot = function() {
        var forwardPos, moveAction;
        this.move_action = null;
        forwardPos = this.position.plus(this.getDir());
        if (this.move && (this.jump || this.jump_once) && world.isUnoccupiedPos(this.position.plus(this.getUp()))) {
            if (world.isUnoccupiedPos(forwardPos.plus(this.getUp())) && world.isUnoccupiedPos(forwardPos)) {
                this.move_action = this.getActionWithId(Action.JUMP_FORWARD);
                world.playSound('BOT_JUMP');
            } else {
                this.move_action = this.getActionWithId(Action.JUMP);
            }
        } else if (this.move) {
            if (world.isUnoccupiedPos(forwardPos)) {
                if (world.isUnoccupiedPos(forwardPos.plus(this.getDown()))) {
                    this.move_action = this.getActionWithId(Action.CLIMB_DOWN);
                } else {
                    this.move_action = this.getActionWithId(Action.FORWARD);
                }
            } else {
                moveAction = this.getActionWithId(Action.FORWARD);
                if (this.push && world.mayObjectPushToPos(this, forwardPos, moveAction.getDuration())) {
                    moveAction.reset();
                    if (world.isUnoccupiedPos(forwardPos.plus(this.getDown()))) {
                        this.move_action = this.getActionWithId(Action.CLIMB_DOWN);
                    } else {
                        this.move_action = moveAction;
                    }
                } else {
                    this.move_action = this.getActionWithId(Action.CLIMB_UP);
                }
            }
        } else if (this.jump || this.jump_once) {
            if (world.isUnoccupiedPos(this.position.plus(this.getUp()))) {
                this.move_action = this.getActionWithId(Action.JUMP);
            }
        }
        this.jump_once = false;
        if (this.move_action) {
            return Timer.addAction(this.move_action);
        }
    };

    Bot.prototype.step = function() {
        if (this.takenOffset) {
            this.mesh.position.copy(this.current_position.plus(this.takenOffset));
        } else {
            this.mesh.position.copy(this.current_position);
        }
        this.mesh.quaternion.copy(this.current_orientation);
        this.leftTire.rotation.set(Vector.DEG2RAD(180 * this.left_tire_rot), Vector.DEG2RAD(90), 0);
        return this.rightTire.rotation.set(Vector.DEG2RAD(180 * this.right_tire_rot), Vector.DEG2RAD(-90), 0);
    };

    return Bot;

})(Pushable);

module.exports = Bot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUVqQixJQUFDLENBQUEsT0FBRCxH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QUMsVUFBVSxDQUFDLElBQWpCLENBQXNCLElBQUMsQ0FBQSxtQkFBdkI7UUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFuQixDQUF1QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsYUFBcEIsQ0FBdkIsRUFBMkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQTNELEVBQStFLENBQS9FO2VBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGNBQXBCLENBQXhCLEVBQTZELE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQyxFQUFoQixDQUE3RCxFQUFrRixDQUFsRjtJQVBFOzs7O0dBbGRROztBQTJkbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuXG57IGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblB1c2hhYmxlICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5CdWxsZXQgICAgID0gcmVxdWlyZSAnLi9idWxsZXQnXG5Qb3MgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblF1YXRlcm5pb24gPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuTWF0ZXJpYWwgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEJvdCBleHRlbmRzIFB1c2hhYmxlXG4gICAgICAgIFxuICAgIEA6IC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAb3JpZW50YXRpb24gICAgICAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgICAgICAgICAgXG4gICAgICAgIEBtaW5Nb3ZlcyA9IDEwMFxuXG4gICAgICAgIEBtb3ZlICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gICA9IG51bGxcbiAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAZGlyX3NnbiAgICAgICA9IDEuMFxuICAgICAgICBcbiAgICAgICAgc3VwZXIgXG5cbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GT1JXQVJELCAgICAgIFwibW92ZSBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9VUCwgICAgIFwiY2xpbWIgdXBcIiAgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9ET1dOLCAgIFwiY2xpbWIgZG93blwiICAgICA1MDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX0xFRlQsICAgIFwidHVybiBsZWZ0XCIgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX1JJR0hULCAgIFwidHVybiByaWdodFwiICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QLCAgICAgICAgIFwianVtcFwiICAgICAgICAgICAxMjBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIFwianVtcCBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GQUxMX0ZPUldBUkQsIFwiZmFsbCBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5TSE9PVCwgICAgICAgIFwic2hvb3RcIiAgICAgICAgICAyMDAgQWN0aW9uLlJFUEVBVFxuICAgIFxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5GQUxMKS5kdXJhdGlvbiA9IDEyMFxuICAgICAgICBAYWRkRXZlbnRXaXRoTmFtZSBcImRpZWRcIlxuICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgNTAwXG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIFxuICAgICAgICB0aXJlUmFkaXVzID0gMC4wNVxuICAgICAgICBub3NlID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSAwLjQwNCAwLjUgMzIgMTYgdHJ1ZVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSAzMiAzMiAxNiAgTWF0aC5QSVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSAzMiAzMiAwIDIqTWF0aC5QSSwgMCAyLjJcbiAgICAgICAgXG4gICAgICAgIG5tYXRyID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgICAgICB0cmFucyA9IG5ldyBUSFJFRS5WZWN0b3IzIDAsLTAuNTQzLDBcbiAgICAgICAgcm90ICAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlciBuZXcgVEhSRUUuRXVsZXIgVmVjdG9yLkRFRzJSQUQoMTgwKSwgMCAwXG4gICAgICAgIFxuICAgICAgICBubWF0ci5jb21wb3NlIHRyYW5zLCByb3QsIG5ldyBUSFJFRS5WZWN0b3IzIDEgMSAxXG4gICAgICAgIGdlb20ubWVyZ2Ugbm9zZSwgbm1hdHJcbiAgICAgICAgZ2VvbS5yb3RhdGVYIFZlY3Rvci5ERUcyUkFEIC05MFxuICAgICAgICBnZW9tLnNjYWxlIDAuNyAwLjcgMC43XG4gICAgICAgICAgIFxuICAgICAgICBNdXRhbnQgPSByZXF1aXJlICcuL211dGFudCcgICAgICAgICBcbiAgICAgICAgbXV0YW50ID0gQCBpbnN0YW5jZW9mIE11dGFudFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50LmNsb25lKCkgb3IgTWF0ZXJpYWwucGxheWVyXG5cbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5IDAuNS10aXJlUmFkaXVzLCB0aXJlUmFkaXVzLCAxNiAzMlxuICAgICAgICBnZW9tLnNjYWxlIDEgMSAyLjVcblxuICAgICAgICB0aXJlTWF0ID0gbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnRUaXJlLmNsb25lKCkgb3IgTWF0ZXJpYWwudGlyZVxuICAgICAgICBAbGVmdFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEBsZWZ0VGlyZS5wb3NpdGlvbi5zZXQgMC4zNSAwIDAgXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAbGVmdFRpcmVcblxuICAgICAgICBAcmlnaHRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAcmlnaHRUaXJlLnBvc2l0aW9uLnNldCAtMC4zNSAwIDAgXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IDAgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgXG4gICAgICAgIHRpcmVNYXQgPSBAbGVmdFRpcmUubWF0ZXJpYWxcbiAgICAgICAgYm90TWF0ID0gQG1lc2gubWF0ZXJpYWxcbiAgICAgICAgXG4gICAgICAgIHRpcmVNYXQudmlzaWJsZSA9IG9wYWNpdHkgPiAwXG4gICAgICAgIHRpcmVNYXQuZGVwdGhXcml0ZSA9IG9wYWNpdHkgPiAwLjVcbiAgICAgICAgYm90TWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgICAgICB0aXJlTWF0Lm9wYWNpdHkgPSBvcGFjaXR5XG4gICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuICAgIGdldERvd246IC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLm1pbnVzWVxuICAgIGdldFVwOiAgIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLnVuaXRZXG4gICAgZ2V0RGlyOiAoZGlyPUBkaXJfc2duKSAtPiBAb3JpZW50YXRpb24ucm90YXRlIG5ldyBWZWN0b3IgMCwwLGRpclxuICBcbiAgICBjdXJyZW50UG9zOiAgLT4gQGN1cnJlbnRfcG9zaXRpb24uY2xvbmUoKVxuICAgIGN1cnJlbnREaXI6ICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRaKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRVcDogICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRZKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRMZWZ0OiAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRYKS5ub3JtYWwoKVxuXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGRpZTogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWN0aW9uc09mT2JqZWN0IEBcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCA9IGZhbHNlXG4gICAgICAgIEBwdXNoICA9IGZhbHNlXG4gICAgXG4gICAgICAgIEBnZXRFdmVudFdpdGhOYW1lKFwiZGllZFwiKS50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIEBkaWVkICA9IHRydWVcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIHJlc2V0OiAoKSAtPlxuICAgIFxuICAgICAgICBAbGVmdF90aXJlX3JvdCAgID0gMC4wXG4gICAgICAgIEByaWdodF90aXJlX3JvdCAgPSAwLjBcbiAgICBcbiAgICAgICAgQGRpcmVjdGlvbi5yZXNldCgpXG4gICAgICAgIEBvcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBAbW92ZSAgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICAgPSBmYWxzZVxuICAgIFxuICAgIGlzRmFsbGluZzogLT4gQG1vdmVfYWN0aW9uIGFuZCBAbW92ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLkZBTExcbiAgICBcbiAgICAjICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgaW5pdEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgbmV3UG9zID0gbmV3IFBvcyBAcG9zaXRpb24gXG4gICAgICAgICMga2xvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX0gcG9zXCIsIG5ld1Bvc1xuICAgICAgICAjIGtsb2cgXCJpbml0QWN0aW9uICN7YWN0aW9uLm5hbWV9XCJcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AgICAgICAgICB0aGVuIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRk9SV0FSRCAgICAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV04gICB0aGVuIG5ld1Bvcy5hZGQgQGdldERpcigpLnBsdXMgQGdldERvd24oKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUCAgICAgICAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0VXAoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUF9GT1JXQVJEIHRoZW4gbmV3UG9zLmFkZCBAZ2V0VXAoKS5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTF9GT1JXQVJEIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RG93bigpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBuZXdQb3MuYWRkIEBnZXREb3duKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgbm90IG5ld1Bvcy5lcWwgbmV3IFBvcyBAcG9zaXRpb25cbiAgICAgICAgICAgIHdvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgQCwgbmV3UG9zLCBhY3Rpb24uZ2V0RHVyYXRpb24oKVxuICAgIFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwICAgICAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgIFxuICAgIHBlcmZvcm1BY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICByZWxUaW1lICA9IGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKSAgIyB+IEBjdXJyZW50IC8gQGdldER1cmF0aW9uKCkgXG4gICAgICAgIHJvdFRpbWUgID0gKGFjdGlvbi5jdXJyZW50LWFjdGlvbi5sYXN0KSAvIHBhcnNlSW50KDEwKmFjdGlvbi5kdXJhdGlvbi82KVxuICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5hdFN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgQnVsbGV0LnNob290RnJvbUJvdCBAXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkRcbiAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiByb3RUaW1lXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogcm90VGltZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QXG5cbiAgICAgICAgICAgICAgICBzaW5GYWMgPSBNYXRoLnNpbiBNYXRoLlBJLzIgKiByZWxUaW1lXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBzaW5GYWMgPSBNYXRoLnNpbiBNYXRoLlBJLzIgKiByZWxUaW1lXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiByb3RUaW1lKVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogcm90VGltZSlcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKSBcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAga2xvZyAnc3RpbGwgbmVlZGVkPydcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogcm90VGltZS8yXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogcm90VGltZS8yXG4gICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiByb3RUaW1lXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogcm90VGltZVxuICAgICAgICAgICAgICAgIGlmIHJlbFRpbWUgPD0gMC4yXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bCAocmVsVGltZS8wLjIpLzJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZWxUaW1lID49IDAuOClcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIDkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKCkubXVsIDAuNSsocmVsVGltZS0wLjgpLzAuMi8yXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogKHJlbFRpbWUtMC4yKS8wLjYgKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgcm90VmVjID0gKEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uKS5yb3RhdGUgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLnBsdXMoQGdldERvd24oKSkucGx1cyhyb3RWZWMpLm11bCAwLjVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fUklHSFQsIEFjdGlvbi5UVVJOX0xFRlRcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gPT0gbnVsbCBhbmQgYWN0aW9uLmF0U3RhcnQoKSAjIGlmIG5vdCBwZXJmb3JtaW5nIG1vdmUgYWN0aW9uIGFuZCBzdGFydCBvZiByb3RhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHVwZGF0ZSBAb3JpZW50YXRpb24gbm93LCBzbyBuZXh0IG1vdmUgYWN0aW9uIHdpbGwgbW92ZSBpbiBkZXNpcmVkIEBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IC1yb3RUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAgcm90VGltZVxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciByZWxUaW1lICogOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9ICByb3RUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAtcm90VGltZVxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgZmluaXNoQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgIFxuICAgICAgICAjIGtsb2cgXCJCb3QuZmluaXNoQWN0aW9uICN7YWN0aW9uLmlkfSAje2FjdGlvbi5uYW1lfVwiIGlmIGFjdGlvbi5uYW1lICE9ICdub29wJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QLCBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uVFVSTl9MRUZULCBBY3Rpb24uVFVSTl9SSUdIVFxuICAgICAgICAgICAgICAgIEByb3RhdGVfYWN0aW9uID0gbnVsbFxuICAgICAgICAgICAgICAgIGlmIEBtb3ZlX2FjdGlvbiAjIGJvdCBjdXJyZW50bHkgcGVyZm9ybWluZyBhIG1vdmUgYWN0aW9uIC0+IHN0b3JlIHJvdGF0aW9uIGluIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gQHJlc3Rfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIG1hdHJpeFxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgYWN0aW9uLmlkID4gQWN0aW9uLlNIT09UXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbiAjIHVwZGF0ZSBjbGltYiBAb3JpZW50YXRpb25cbiAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgXG4gICAgICAgIGlmIEByb3RhdGVfYWN0aW9uIGFuZCBhY3Rpb24uaWQgIT0gQWN0aW9uLkpVTVBfRk9SV0FSRCAjIGJvdCBpcyBjdXJyZW50bHkgcGVyZm9ybWluZyBhIHJvdGF0aW9uIC0+XG4gICAgICAgICAgICAjIHRha2Ugb3ZlciByZXN1bHQgb2Ygcm90YXRpb24gdG8gcHJldmVudCBzbGlkaW5nXG4gICAgICAgICAgICBpZiBAcm90YXRlX2FjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yKDkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WSAgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yKC05MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WSAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIHRhcmdldFBvcyA9IEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgICAgIHdvcmxkLm9iamVjdE1vdmVkIEAsIEBwb3NpdGlvbiwgdGFyZ2V0UG9zICMgdXBkYXRlIHdvcmxkIEBwb3NpdGlvblxuICAgICAgICAgICAgQHBvc2l0aW9uID0gdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkpVTVBfRk9SV0FSRCBhbmQgQHJvdGF0ZV9hY3Rpb24gPT0gbnVsbCAjIGlmIG5vdCBqdW1waW5nIGZvcndhcmRcbiAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gQG9yaWVudGF0aW9uXG4gICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICBcbiAgICBhY3Rpb25GaW5pc2hlZDogKGFjdGlvbikgLT5cbiAgICAgICAgIyBrbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICN7YWN0aW9uLm5hbWV9ICN7YWN0aW9uLmlkfVwiXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5QVVNIIGFuZCBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgIyBrbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiEnXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgbmV4dCBhY3Rpb24gZGVwZW5kaW5nIG9uIHR5cGUgb2YgZmluaXNoZWQgYWN0aW9uIGFuZCBzdXJyb3VuZGluZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgd2lsbCBhbHNvIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJyBAZ2V0UG9zKCksIDAuMjUgXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCB3aWxsIG5vdCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ubWludXMgQGdldFVwKCkgICMgYmVsb3cgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCcgQGdldFBvcygpLCAwLjVcbiAgICAgICAgZWxzZSBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyB3aWxsIGJlIGVtcHR5XG4gICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eScsIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKSwgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKVxuICAgICAgICAgICAgaWYgQG1vdmUgIyBzdGlja3kgaWYgbW92aW5nXG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSAgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgIyBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgZm9yd2FyZCBlbXB0eSdcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNPY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgIyBiZWxvdyBmb3J3YXJkIGlzIHNvbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudCA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm1pbnVzIEBnZXRVcCgpIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkgXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBvY2N1cGFudD8gb3Igbm90IG9jY3VwYW50Py5pc1NsaXBwZXJ5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24gPSBAZ2V0RG93bigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGVsc2UgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uRkFMTF9GT1JXQVJELCBBY3Rpb24uRkFMTF0gIyBsYW5kZWRcbiAgICAgICAgICAgIGlmIEBuYW1lID09ICdwbGF5ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpXG4gICAgICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICBUaW1lci5hZGRBY3Rpb24gQG1vdmVfYWN0aW9uXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAcm90YXRlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQHNldFBvc2l0aW9uIEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgQHNldE9yaWVudGF0aW9uIEBjdXJyZW50X29yaWVudGF0aW9uLnJvdW5kKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiB3b3JsZC5nZXRSZWFsT2NjdXBhbnRBdFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKT8uaXNNdXRhbnQ/KClcbiAgICAgICAgICAgICAgICAjIGtlZXAgYWN0aW9uIGNoYWluIGZsb3dpbmcgaW4gb3JkZXIgdG8gZGV0ZWN0IGVudmlyb25tZW50IGNoYW5nZXNcbiAgICAgICAgICAgICAgICBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgbXV0YW50IGJlbG93OiBzdGFydFRpbWVkQWN0aW9uIE5PT1AnXG4gICAgICAgICAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDBcblxuICAgICMgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG1vdmVCb3Q6ICgpIC0+XG5cbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgIGlmIEBtb3ZlIGFuZCAoQGp1bXAgb3IgQGp1bXBfb25jZSkgYW5kICAgICMganVtcCBtb2RlIG9yIGp1bXAgYWN0aXZhdGVkIHdoaWxlIG1vdmluZ1xuICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKSAgIyBhbmQgYWJvdmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcy5wbHVzIEBnZXRVcCgpKSBhbmRcbiAgICAgICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MpICAjIGZvcndhcmQgYW5kIGFib3ZlIGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9KVU1QJ1xuICAgICAgICAgICAgICAgIGVsc2UgIyBubyBzcGFjZSB0byBqdW1wIGZvcndhcmQgLT4ganVtcCB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIGVsc2UgaWYgQG1vdmUgXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAgIyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MucGx1cyBAZ2V0RG93bigpICBcbiAgICAgICAgICAgICAgICAgICAgIyBiZWxvdyBmb3J3YXJkIGFsc28gZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIGRvd24gaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgaXMgbm90IGVtcHR5XG4gICAgICAgICAgICAgICAgbW92ZUFjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgICAgICBpZiBAcHVzaCBhbmQgd29ybGQubWF5T2JqZWN0UHVzaFRvUG9zIEAsIGZvcndhcmRQb3MsIG1vdmVBY3Rpb24uZ2V0RHVyYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICAgICAgIyBwbGF5ZXIgaW4gcHVzaCBtb2RlIGFuZCBwdXNoaW5nIG9iamVjdCBpcyBwb3NzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgICMgYmVsb3cgZm9yd2FyZCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBtb3ZlQWN0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSAjIGp1c3QgY2xpbWIgdXBcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgZWxzZSBpZiBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkpXG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUFxuICAgICAgICBcbiAgICAgICAgIyByZXNldCB0aGUganVtcCBvbmNlIGZsYWcgKGVpdGhlciB3ZSBqdW1wZWQgb3IgaXQncyBub3QgcG9zc2libGUgdG8ganVtcCBhdCBjdXJyZW50IEBwb3NpdGlvbilcbiAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIFxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgXG4gICAgICAgIFxuICAgIHN0ZXA6IC0+XG4gICAgICAgIGlmIEB0YWtlbk9mZnNldFxuICAgICAgICAgICAgQG1lc2gucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvbi5wbHVzIEB0YWtlbk9mZnNldFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uXG4gICAgICAgIEBtZXNoLnF1YXRlcm5pb24uY29weSBAY3VycmVudF9vcmllbnRhdGlvblxuICAgICAgICBAbGVmdFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAbGVmdF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKDkwKSwgMFxuICAgICAgICBAcmlnaHRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQHJpZ2h0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdFxuIl19
//# sourceURL=../coffee/bot.coffee