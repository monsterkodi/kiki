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
        this.lastActionDelta = 0.0;
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

    Bot.prototype.getDir = function() {
        return this.orientation.rotate(new Vector(0, 0, this.dir_sgn));
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
        var cosFac, dltTime, relTime, rotVec, sinFac;
        relTime = action.getRelativeTime();
        dltTime = action.getRelativeDelta();
        this.lastActionDelta = dltTime;
        cosFac = Math.cos(Math.PI / 2 - Math.PI / 2 * relTime);
        sinFac = Math.sin(Math.PI / 2 * relTime);
        switch (action.id) {
            case Action.SHOOT:
                if (action.atStart()) {
                    Bullet.shootFromBot(this);
                }
                break;
            case Action.NOOP:
                return;
            case Action.FORWARD:
                this.left_tire_rot += this.dir_sgn * dltTime;
                this.right_tire_rot += this.dir_sgn * dltTime;
                this.current_position = this.position.plus(this.getDir().mul(relTime));
                return;
            case Action.JUMP:
                this.current_position = this.position.plus(this.getUp().mul(sinFac));
                return;
            case Action.JUMP_FORWARD:
                this.left_tire_rot += 1 - Math.cos(Math.PI / 2 * dltTime);
                this.right_tire_rot += 1 - Math.cos(Math.PI / 2 * dltTime);
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
                this.left_tire_rot += this.dir_sgn * dltTime / 2;
                this.right_tire_rot += this.dir_sgn * dltTime / 2;
                this.climb_orientation = Quaternion.rotationAroundVector(this.dir_sgn * relTime * -90.0, Vector.unitX);
                break;
            case Action.CLIMB_DOWN:
                this.left_tire_rot += this.dir_sgn * dltTime;
                this.right_tire_rot += this.dir_sgn * dltTime;
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
                    this.left_tire_rot += -dltTime;
                    this.right_tire_rot += dltTime;
                    this.rotate_orientation = Quaternion.rotationAroundVector(relTime * 90.0, Vector.unitY);
                } else {
                    this.left_tire_rot += dltTime;
                    this.right_tire_rot += -dltTime;
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
            klog('super (Pushable) action!');
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
        this.fixOrientationAndPosition();
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

    Bot.prototype.fixOrientationAndPosition = function() {
        this.setPosition(this.current_position.round());
        return this.setOrientation(this.current_orientation.round());
    };

    Bot.prototype.moveBot = function() {
        var forwardPos, moveAction;
        this.move_action = null;
        forwardPos = this.position.plus(this.getDir());
        if (this.move && (this.jump || this.jump_once) && this.dir_sgn === 1.0 && world.isUnoccupiedPos(this.position.plus(this.getUp()))) {
            if (world.isUnoccupiedPos(forwardPos.plus(this.getUp())) && world.isUnoccupiedPos(forwardPos)) {
                this.move_action = this.getActionWithId(Action.JUMP_FORWARD);
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
        this.mesh.position.copy(this.current_position);
        this.mesh.quaternion.copy(this.current_orientation);
        this.leftTire.rotation.set(Vector.DEG2RAD(180 * this.left_tire_rot), Vector.DEG2RAD(90), 0);
        return this.rightTire.rotation.set(Vector.DEG2RAD(180 * this.right_tire_rot), Vector.DEG2RAD(-90), 0);
    };

    return Bot;

})(Pushable);

module.exports = Bot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxH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QUF1QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsYUFBcEIsQ0FBdkIsRUFBMkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQTNELEVBQStFLENBQS9FO2VBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGNBQXBCLENBQXhCLEVBQTZELE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQyxFQUFoQixDQUE3RCxFQUFrRixDQUFsRjtJQUpFOzs7O0dBM2RROztBQWllbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuXG57IGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblB1c2hhYmxlICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5CdWxsZXQgICAgID0gcmVxdWlyZSAnLi9idWxsZXQnXG5Qb3MgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblF1YXRlcm5pb24gPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuTWF0ZXJpYWwgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEJvdCBleHRlbmRzIFB1c2hhYmxlXG4gICAgICAgIFxuICAgIEA6ICgpIC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAb3JpZW50YXRpb24gICAgICAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgXG4gICAgICAgIEBsYXN0QWN0aW9uRGVsdGEgPSAwLjBcbiAgICAgICAgICAgIFxuICAgICAgICBAbGVmdF90aXJlX3JvdCAgID0gMC4wXG4gICAgICAgIEByaWdodF90aXJlX3JvdCAgPSAwLjBcbiAgICAgICAgICAgIFxuICAgICAgICBAbWluTW92ZXMgPSAxMDBcblxuICAgICAgICBAbW92ZSAgICAgICA9IGZhbHNlXG4gICAgICAgIEBwdXNoICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wX29uY2UgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uICAgPSBudWxsXG4gICAgICAgIEByb3RhdGVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQGRpcl9zZ24gICAgICAgPSAxLjBcbiAgICAgICAgXG4gICAgICAgIHN1cGVyIFxuXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRk9SV0FSRCwgICAgICBcIm1vdmUgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfVVAsICAgICBcImNsaW1iIHVwXCIgICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfRE9XTiwgICBcImNsaW1iIGRvd25cIiAgICAgNTAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9MRUZULCAgICBcInR1cm4gbGVmdFwiICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9SSUdIVCwgICBcInR1cm4gcmlnaHRcIiAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUCwgICAgICAgICBcImp1bXBcIiAgICAgICAgICAgMTIwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUF9GT1JXQVJELCBcImp1bXAgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRkFMTF9GT1JXQVJELCBcImZhbGwgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uU0hPT1QsICAgICAgICBcInNob290XCIgICAgICAgICAgMjAwIEFjdGlvbi5SRVBFQVRcbiAgICBcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uRkFMTCkuZHVyYXRpb24gPSAxMjBcbiAgICAgICAgQGFkZEV2ZW50V2l0aE5hbWUgXCJkaWVkXCJcbiAgICBcbiAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDUwMFxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgdGlyZVJhZGl1cyA9IDAuMDVcbiAgICAgICAgbm9zZSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkgMC40MDQsIDAuNSwgMzIsIDE2LCB0cnVlXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41LCAzMiwgMzIsIDE2LCBNYXRoLlBJXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41LCAzMiwgMzIsIDAsIDIqTWF0aC5QSSwgMCwgMi4yXG4gICAgICAgIFxuICAgICAgICBubWF0ciA9IG5ldyBUSFJFRS5NYXRyaXg0KClcbiAgICAgICAgdHJhbnMgPSBuZXcgVEhSRUUuVmVjdG9yMyAwLC0wLjU0MywwXG4gICAgICAgIHJvdCAgID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIgbmV3IFRIUkVFLkV1bGVyIFZlY3Rvci5ERUcyUkFEKDE4MCksIDAsIDBcbiAgICAgICAgXG4gICAgICAgIG5tYXRyLmNvbXBvc2UgdHJhbnMsIHJvdCwgbmV3IFRIUkVFLlZlY3RvcjMgMSwxLDFcbiAgICAgICAgZ2VvbS5tZXJnZSBub3NlLCBubWF0clxuICAgICAgICBnZW9tLnJvdGF0ZVggVmVjdG9yLkRFRzJSQUQgLTkwXG4gICAgICAgIGdlb20uc2NhbGUgMC43LCAwLjcsIDAuN1xuICAgICAgICAgICBcbiAgICAgICAgTXV0YW50ID0gcmVxdWlyZSAnLi9tdXRhbnQnICAgICAgICAgXG4gICAgICAgIG11dGFudCA9IEAgaW5zdGFuY2VvZiBNdXRhbnRcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBtdXRhbnQgYW5kIE1hdGVyaWFsLm11dGFudC5jbG9uZSgpIG9yIE1hdGVyaWFsLnBsYXllclxuXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSAwLjUtdGlyZVJhZGl1cywgdGlyZVJhZGl1cywgMTYsIDMyXG4gICAgICAgIGdlb20uc2NhbGUgMSwxLDIuNVxuICAgICAgICB0aXJlTWF0ID0gbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnRUaXJlLmNsb25lKCkgb3IgTWF0ZXJpYWwudGlyZVxuICAgICAgICBAbGVmdFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEBsZWZ0VGlyZS5wb3NpdGlvbi5zZXQgMC4zNSwwLDAgXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAbGVmdFRpcmVcblxuICAgICAgICBAcmlnaHRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAcmlnaHRUaXJlLnBvc2l0aW9uLnNldCAtMC4zNSwwLDAgXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IDAsIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcbiAgICAgICAgQG1lc2guYWRkIEByaWdodFRpcmVcblxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gQHJpZ2h0VGlyZS5jYXN0U2hhZG93ID0gQGxlZnRUaXJlLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSBAbGVmdFRpcmUucmVjZWl2ZVNoYWRvdyA9IEByaWdodFRpcmUucmVjZWl2ZVNoYWRvdyA9IHRydWUgXG4gICAgICAgICAgICBcbiAgICBzZXRPcGFjaXR5OiAob3BhY2l0eSkgLT4gXG4gICAgICAgIHRpcmVNYXQgPSBAbGVmdFRpcmUubWF0ZXJpYWxcbiAgICAgICAgYm90TWF0ID0gQG1lc2gubWF0ZXJpYWxcbiAgICAgICAgdGlyZU1hdC52aXNpYmxlID0gb3BhY2l0eSA+IDBcbiAgICAgICAgdGlyZU1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQuZGVwdGhXcml0ZSA9IG9wYWNpdHkgPiAwLjVcbiAgICAgICAgYm90TWF0Lm9wYWNpdHkgPSBvcGFjaXR5XG4gICAgICAgIHRpcmVNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG4gICAgZ2V0RG93bjogLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBWZWN0b3IubWludXNZXG4gICAgZ2V0VXA6ICAgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICBnZXREaXI6ICAtPiBAb3JpZW50YXRpb24ucm90YXRlIG5ldyBWZWN0b3IgMCwwLEBkaXJfc2duXG4gIFxuICAgIGN1cnJlbnRQb3M6ICAtPiBAY3VycmVudF9wb3NpdGlvbi5jbG9uZSgpXG4gICAgY3VycmVudERpcjogIC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFopLm5vcm1hbCgpXG4gICAgY3VycmVudFVwOiAgIC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFkpLm5vcm1hbCgpXG4gICAgY3VycmVudExlZnQ6IC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFgpLm5vcm1hbCgpXG5cbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgZGllOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBY3Rpb25zT2ZPYmplY3QgQFxuICAgICAgICBcbiAgICAgICAgQG1vdmUgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgID0gZmFsc2VcbiAgICAgICAgQHNob290ID0gZmFsc2VcbiAgICAgICAgQHB1c2ggID0gZmFsc2VcbiAgICBcbiAgICAgICAgQGdldEV2ZW50V2l0aE5hbWUoXCJkaWVkXCIpLnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgQGRpZWQgID0gdHJ1ZVxuICAgIFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgcmVzZXQ6ICgpIC0+XG4gICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgIFxuICAgICAgICBAZGlyZWN0aW9uLnJlc2V0KClcbiAgICAgICAgQG9yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIEBtb3ZlICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBwdXNoICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wX29uY2UgICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgICA9IGZhbHNlXG4gICAgXG4gICAgaXNGYWxsaW5nOiAtPiBAbW92ZV9hY3Rpb24gYW5kIEBtb3ZlX2FjdGlvbi5pZCA9PSBBY3Rpb24uRkFMTFxuICAgIFxuICAgICMgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBpbml0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBuZXdQb3MgPSBuZXcgUG9zIEBwb3NpdGlvbiBcbiAgICAgICAgIyBrbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfSBwb3NcIiwgbmV3UG9zXG4gICAgICAgICMga2xvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX1cIlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCAgICAgICAgIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTiAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QICAgICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXREb3duKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5hZGQgQGdldERvd24oKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBub3QgbmV3UG9zLmVxbCBuZXcgUG9zIEBwb3NpdGlvblxuICAgICAgICAgICAgIyBrbG9nICdib3QuaW5pdEFjdGlvbiBvYmplY3RXaWxsTW92ZVRvUG9zOicsIG5ld1Bvc1xuICAgICAgICAgICAgd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBALCBuZXdQb3MsIGFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAgICAgIDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgXG4gICAgcGVyZm9ybUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHJlbFRpbWUgID0gYWN0aW9uLmdldFJlbGF0aXZlVGltZSgpICAjIH4gQGN1cnJlbnQgLyBAZ2V0RHVyYXRpb24oKSBcbiAgICAgICAgZGx0VGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpICMgKEBjdXJyZW50LUBsYXN0KSAvIEBnZXREdXJhdGlvbigpXG4gICAgXG4gICAgICAgIEBsYXN0QWN0aW9uRGVsdGEgPSBkbHRUaW1lXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGNvc0ZhYyA9IE1hdGguY29zIE1hdGguUEkvMiAtIE1hdGguUEkvMiAqIHJlbFRpbWVcbiAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uYXRTdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAjIGxvZyAncjonIHJlbFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiBkbHRUaW1lKVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXRVcCgpLm11bChzaW5GYWMpIFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXREb3duKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBrbG9nICdzdGlsbCBuZWVkZWQ/J1xuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgaWYgcmVsVGltZSA8PSAwLjJcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsIChyZWxUaW1lLzAuMikvMlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlbFRpbWUgPj0gMC44KVxuICAgICAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLnBsdXMgQGdldERvd24oKS5tdWwgMC41KyhyZWxUaW1lLTAuOCkvMC4yLzJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiAocmVsVGltZS0wLjIpLzAuNiAqIDkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgICAgICByb3RWZWMgPSAoQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24pLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyhAZ2V0RG93bigpKS5wbHVzKHJvdFZlYykubXVsIDAuNVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLlRVUk5fTEVGVFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIEBtb3ZlX2FjdGlvbiA9PSBudWxsIGFuZCBhY3Rpb24uYXRTdGFydCgpICMgaWYgbm90IHBlcmZvcm1pbmcgbW92ZSBhY3Rpb24gYW5kIHN0YXJ0IG9mIHJvdGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdXBkYXRlIEBvcmllbnRhdGlvbiBub3csIHNvIG5leHQgbW92ZSBhY3Rpb24gd2lsbCBtb3ZlIGluIGRlc2lyZWQgQGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9ICBkbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiA5MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IC1kbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBmaW5pc2hBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgXG4gICAgICAgICMga2xvZyBcIkJvdC5maW5pc2hBY3Rpb24gI3thY3Rpb24uaWR9ICN7YWN0aW9uLm5hbWV9XCIgaWYgYWN0aW9uLm5hbWUgIT0gJ25vb3AnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AsIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hUXG4gICAgICAgICAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uICMgYm90IGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgbW92ZSBhY3Rpb24gLT4gc3RvcmUgcm90YXRpb24gaW4gQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBAcmVzdF9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gbWF0cml4XG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBhY3Rpb24uaWQgPiBBY3Rpb24uU0hPT1RcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uICMgdXBkYXRlIGNsaW1iIEBvcmllbnRhdGlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24gYW5kIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEICMgYm90IGlzIGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgcm90YXRpb24gLT5cbiAgICAgICAgICAgICMgdGFrZSBvdmVyIHJlc3VsdCBvZiByb3RhdGlvbiB0byBwcmV2ZW50IHNsaWRpbmdcbiAgICAgICAgICAgIGlmIEByb3RhdGVfYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoLTkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgdGFyZ2V0UG9zID0gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICAgICAgd29ybGQub2JqZWN0TW92ZWQgQCwgQHBvc2l0aW9uLCB0YXJnZXRQb3MgIyB1cGRhdGUgd29ybGQgQHBvc2l0aW9uXG4gICAgICAgICAgICBAcG9zaXRpb24gPSB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEIGFuZCBAcm90YXRlX2FjdGlvbiA9PSBudWxsICMgaWYgbm90IGp1bXBpbmcgZm9yd2FyZFxuICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBAb3JpZW50YXRpb25cbiAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgI3thY3Rpb24ubmFtZX0gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlBVU0ggYW5kIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICBrbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiEnXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgbmV4dCBhY3Rpb24gZGVwZW5kaW5nIG9uIHR5cGUgb2YgZmluaXNoZWQgYWN0aW9uIGFuZCBzdXJyb3VuZGluZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgd2lsbCBhbHNvIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpLCAwLjI1IFxuICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgd2lsbCBub3QgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLm1pbnVzIEBnZXRVcCgpICAjIGJlbG93IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIGJlbG93IGVtcHR5Jywgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpLCBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICBpZiBAbW92ZSAjIHN0aWNreSBpZiBtb3ZpbmdcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpICAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uPyBcbiAgICAgICAgXG4gICAgICAgIEBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgIyBrbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgcG9zaXRpb246XCIsIEBwb3NpdGlvbiBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GT1JXQVJELCBBY3Rpb24uSlVNUF9GT1JXQVJELCBBY3Rpb24uQ0xJTUJfRE9XTl1cbiAgICAgICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAnI3thY3Rpb24ubmFtZX0nIG9yaWVudGF0aW9uOlwiLCBAb3JpZW50YXRpb24ucm91bmRlZCgpLm5hbWUgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uVFVSTl9MRUZULCBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLkNMSU1CX1VQXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiB3b3JsZC5nZXRSZWFsT2NjdXBhbnRBdFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKT8uaXNNdXRhbnQ/KClcbiAgICAgICAgICAgICAgICAjIGtlZXAgYWN0aW9uIGNoYWluIGZsb3dpbndnIGluIG9yZGVyIHRvIGRldGVjdCBlbnZpcm9ubWVudCBjaGFuZ2VzXG4gICAgICAgICAgICAgICAga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIG11dGFudCBiZWxvdzogc3RhcnRUaW1lZEFjdGlvbiBOT09QJ1xuICAgICAgICAgICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLk5PT1ApLCAwXG5cbiAgICBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uOiAtPlxuICAgICAgICBAc2V0UG9zaXRpb24gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICBAc2V0T3JpZW50YXRpb24gQGN1cnJlbnRfb3JpZW50YXRpb24ucm91bmQoKVxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cbiAgICAgICAgIyBrbG9nICdtb3ZlQm90JyBAbW92ZSwgQG1vdmVfYWN0aW9uXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICBpZiBAbW92ZSBhbmQgKEBqdW1wIG9yIEBqdW1wX29uY2UpIGFuZCAgICAjIGp1bXAgbW9kZSBvciBqdW1wIGFjdGl2YXRlZCB3aGlsZSBtb3ZpbmdcbiAgICAgICAgICAgIEBkaXJfc2duID09IDEuMCBhbmQgICAgICAgICAgICAgICAgICAgICAjIGFuZCBtb3ZpbmcgZm9yd2FyZFxuICAgICAgICAgICAgICAgIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSkgICMgYW5kIGFib3ZlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MpICAjIGZvcndhcmQgYW5kIGFib3ZlIGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICBlbHNlICMgbm8gc3BhY2UgdG8ganVtcCBmb3J3YXJkIC0+IGp1bXAgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICBcbiAgICAgICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgQG1lc2gucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvblxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgQGN1cnJlbnRfb3JpZW50YXRpb25cbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQGxlZnRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkByaWdodF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcblxubW9kdWxlLmV4cG9ydHMgPSBCb3RcbiJdfQ==
//# sourceURL=../coffee/bot.coffee