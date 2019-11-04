// koffee 1.4.0
var Action, Bot, Bullet, Material, Pos, Pushable, Quaternion, Timer, Vector, log,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

log = require('./tools/log');

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
        this.last_fume = 0;
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
        this.last_fume = 0;
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
        cosFac = Math.cos(Math.PI / 2 - Math.PI / 2 * relTime);
        sinFac = Math.sin(Math.PI / 2 * relTime);
        switch (action.id) {
            case Action.SHOOT:
                if (relTime === 0) {
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
                console.log('still needed?');
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
                if (this.move_action === null && relTime === 0.0) {
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
            console.log('super (Pushable) action!');
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
                console.log('bot.actionFinished mutant below: startTimedAction NOOP');
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
            this.move_action.keepRest();
            return Timer.addAction(this.move_action);
        }
    };

    Bot.prototype.step = function(step) {
        this.mesh.position.copy(this.current_position);
        this.mesh.quaternion.copy(this.current_orientation);
        this.leftTire.rotation.set(Vector.DEG2RAD(180 * this.left_tire_rot), Vector.DEG2RAD(90), 0);
        return this.rightTire.rotation.set(Vector.DEG2RAD(180 * this.right_tire_rot), Vector.DEG2RAD(-90), 0);
    };

    return Bot;

})(Pushable);

module.exports = Bot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw0RUFBQTtJQUFBOzs7QUFBQSxHQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixLQUFBLEdBQWEsT0FBQSxDQUFRLFNBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLEdBQUEsR0FBYSxPQUFBLENBQVEsV0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUjs7QUFDYixRQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0FBRVA7OztJQUVXLGFBQUE7UUFFVCxJQUFDLENBQUEsU0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxXQUFELEdBQXVCLElBQUk7UUFDM0IsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUk7UUFDM0IsSUFBQyxDQUFBLGtCQUFELEdBQXVCLElBQUk7UUFDM0IsSUFBQyxDQUFBLGlCQUFELEdBQXVCLElBQUk7UUFDM0IsSUFBQyxDQUFBLGdCQUFELEdBQXVCLElBQUk7UUFFM0IsSUFBQyxDQUFBLGFBQUQsR0FBbUI7UUFDbkIsSUFBQyxDQUFBLGNBQUQsR0FBbUI7UUFDbkIsSUFBQyxDQUFBLFNBQUQsR0FBbUI7UUFFbkIsSUFBQyxDQUFBLFFBQUQsR0FBWTtRQUVaLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxLQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsU0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUVkLElBQUMsQ0FBQSxXQUFELEdBQWlCO1FBQ2pCLElBQUMsQ0FBQSxh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LENBQUEsbUJBQXZCO1FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBbkIsQ0FBdUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGFBQXBCLENBQXZCLEVBQTJELE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUEzRCxFQUErRSxDQUEvRTtlQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQXBCLENBQXdCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBQSxHQUFJLElBQUMsQ0FBQSxjQUFwQixDQUF4QixFQUE2RCxNQUFNLENBQUMsT0FBUCxDQUFlLENBQUMsRUFBaEIsQ0FBN0QsRUFBa0YsQ0FBbEY7SUFKRTs7OztHQXJkUTs7QUEyZGxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAwMDAgICBcblxubG9nICAgICAgICA9IHJlcXVpcmUgJy4vdG9vbHMvbG9nJ1xuUHVzaGFibGUgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5UaW1lciAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkJ1bGxldCAgICAgPSByZXF1aXJlICcuL2J1bGxldCdcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgQm90IGV4dGVuZHMgUHVzaGFibGVcbiAgICAgICAgXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAb3JpZW50YXRpb24gICAgICAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgICAgICBAbGFzdF9mdW1lICAgICAgID0gMFxuICAgICAgICAgICAgXG4gICAgICAgIEBtaW5Nb3ZlcyA9IDEwMFxuXG4gICAgICAgIEBtb3ZlICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gICA9IG51bGxcbiAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAZGlyX3NnbiAgICAgICA9IDEuMFxuICAgICAgICBcbiAgICAgICAgc3VwZXIgXG5cbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GT1JXQVJELCAgICAgIFwibW92ZSBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfVVAsICAgICBcImNsaW1iIHVwXCIsICAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX0RPV04sICAgXCJjbGltYiBkb3duXCIsICAgICA1MDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX0xFRlQsICAgIFwidHVybiBsZWZ0XCIsICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9SSUdIVCwgICBcInR1cm4gcmlnaHRcIiwgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVAsICAgICAgICAgXCJqdW1wXCIsICAgICAgICAgICAxMjBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIFwianVtcCBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRkFMTF9GT1JXQVJELCBcImZhbGwgZm9yd2FyZFwiLCAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlNIT09ULCAgICAgICAgXCJzaG9vdFwiLCAgICAgICAgICAyMDAsIEFjdGlvbi5SRVBFQVRcbiAgICBcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uRkFMTCkuZHVyYXRpb24gPSAxMjBcbiAgICAgICAgQGFkZEV2ZW50V2l0aE5hbWUgXCJkaWVkXCJcbiAgICBcbiAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDUwMFxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICB0aXJlUmFkaXVzID0gMC4wNVxuICAgICAgICBub3NlID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSAwLjQwNCwgMC41LCAzMiwgMTYsIHRydWVcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMTYsIE1hdGguUElcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMCwgMipNYXRoLlBJLCAwLCAyLjJcbiAgICAgICAgXG4gICAgICAgIG5tYXRyID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgICAgICB0cmFucyA9IG5ldyBUSFJFRS5WZWN0b3IzIDAsLTAuNTQzLDBcbiAgICAgICAgcm90ICAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlciBuZXcgVEhSRUUuRXVsZXIgVmVjdG9yLkRFRzJSQUQoMTgwKSwgMCwgMFxuICAgICAgICBcbiAgICAgICAgbm1hdHIuY29tcG9zZSB0cmFucywgcm90LCBuZXcgVEhSRUUuVmVjdG9yMyAxLDEsMVxuICAgICAgICBnZW9tLm1lcmdlIG5vc2UsIG5tYXRyXG4gICAgICAgIGdlb20ucm90YXRlWCBWZWN0b3IuREVHMlJBRCAtOTBcbiAgICAgICAgZ2VvbS5zY2FsZSAwLjcsIDAuNywgMC43XG4gICAgICAgICAgIFxuICAgICAgICBNdXRhbnQgPSByZXF1aXJlICcuL211dGFudCcgICAgICAgICBcbiAgICAgICAgbXV0YW50ID0gQCBpbnN0YW5jZW9mIE11dGFudFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50LmNsb25lKCkgb3IgTWF0ZXJpYWwucGxheWVyXG5cbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5IDAuNS10aXJlUmFkaXVzLCB0aXJlUmFkaXVzLCAxNiwgMzJcbiAgICAgICAgZ2VvbS5zY2FsZSAxLDEsMi41XG4gICAgICAgIHRpcmVNYXQgPSBtdXRhbnQgYW5kIE1hdGVyaWFsLm11dGFudFRpcmUuY2xvbmUoKSBvciBNYXRlcmlhbC50aXJlXG4gICAgICAgIEBsZWZ0VGlyZSA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIHRpcmVNYXRcbiAgICAgICAgQGxlZnRUaXJlLnBvc2l0aW9uLnNldCAwLjM1LDAsMCBcbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCAwLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQG1lc2guYWRkIEBsZWZ0VGlyZVxuXG4gICAgICAgIEByaWdodFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEByaWdodFRpcmUucG9zaXRpb24uc2V0IC0wLjM1LDAsMCBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgdGlyZU1hdCA9IEBsZWZ0VGlyZS5tYXRlcmlhbFxuICAgICAgICBib3RNYXQgPSBAbWVzaC5tYXRlcmlhbFxuICAgICAgICB0aXJlTWF0LnZpc2libGUgPSBvcGFjaXR5ID4gMFxuICAgICAgICB0aXJlTWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICAgICAgdGlyZU1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbiAgICBnZXREb3duOiAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1lcbiAgICBnZXRVcDogICAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci51bml0WVxuICAgIGdldERpcjogIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgbmV3IFZlY3RvciAwLDAsQGRpcl9zZ25cbiAgXG4gICAgY3VycmVudFBvczogIC0+IEBjdXJyZW50X3Bvc2l0aW9uLmNsb25lKClcbiAgICBjdXJyZW50RGlyOiAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0Wikubm9ybWFsKClcbiAgICBjdXJyZW50VXA6ICAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WSkubm9ybWFsKClcbiAgICBjdXJyZW50TGVmdDogLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WCkubm9ybWFsKClcblxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBkaWU6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICAgICBAbW92ZSAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgPSBmYWxzZVxuICAgIFxuICAgICAgICBAZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBAZGllZCAgPSB0cnVlXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICByZXNldDogKCkgLT5cbiAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgIEBsYXN0X2Z1bWUgICAgICAgPSAwXG4gICAgXG4gICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICBAb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgQG1vdmUgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgID0gZmFsc2VcbiAgICBcbiAgICBpc0ZhbGxpbmc6IC0+IEBtb3ZlX2FjdGlvbiBhbmQgQG1vdmVfYWN0aW9uLmlkID09IEFjdGlvbi5GQUxMXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIG5ld1BvcyA9IG5ldyBQb3MgQHBvc2l0aW9uIFxuICAgICAgICAjIGxvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX0gcG9zXCIsIG5ld1Bvc1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCAgICAgICAgIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTiAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QICAgICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXREb3duKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5hZGQgQGdldERvd24oKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBub3QgbmV3UG9zLmVxbCBuZXcgUG9zIEBwb3NpdGlvblxuICAgICAgICAgICAgIyBsb2cgJ2JvdC5pbml0QWN0aW9uIG9iamVjdFdpbGxNb3ZlVG9Qb3M6JywgbmV3UG9zXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIEAsIG5ld1BvcywgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMCAgICAgMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVsVGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKClcbiAgICAgICAgZGx0VGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpXG4gICAgXG4gICAgICAgIGNvc0ZhYyA9IE1hdGguY29zIE1hdGguUEkvMiAtIE1hdGguUEkvMiAqIHJlbFRpbWVcbiAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIGlmIHJlbFRpbWUgPT0gMFxuICAgICAgICAgICAgICAgICAgICBCdWxsZXQuc2hvb3RGcm9tQm90IEBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRk9SV0FSRFxuICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiBkbHRUaW1lKVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogZGx0VGltZSlcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKSBcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgbG9nICdzdGlsbCBuZWVkZWQ/J1xuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgaWYgcmVsVGltZSA8PSAwLjJcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsIChyZWxUaW1lLzAuMikvMlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlbFRpbWUgPj0gMC44KVxuICAgICAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLnBsdXMgQGdldERvd24oKS5tdWwgMC41KyhyZWxUaW1lLTAuOCkvMC4yLzJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiAocmVsVGltZS0wLjIpLzAuNiAqIDkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgICAgICByb3RWZWMgPSAoQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24pLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyhAZ2V0RG93bigpKS5wbHVzKHJvdFZlYykubXVsIDAuNVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLlRVUk5fTEVGVFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIEBtb3ZlX2FjdGlvbiA9PSBudWxsIGFuZCByZWxUaW1lID09IDAuMCAjIGlmIG5vdCBwZXJmb3JtaW5nIG1vdmUgYWN0aW9uIGFuZCBzdGFydCBvZiByb3RhdGlvblxuICAgICAgICAgICAgICAgICAgICAjIHVwZGF0ZSBAb3JpZW50YXRpb24gbm93LCBzbyBuZXh0IG1vdmUgYWN0aW9uIHdpbGwgbW92ZSBpbiBkZXNpcmVkIEBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IC1kbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAgZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciByZWxUaW1lICogOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9ICBkbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAtZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgZmluaXNoQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgIFxuICAgICAgICAjIGxvZyBcIkJvdC5maW5pc2hBY3Rpb24gI3thY3Rpb24uaWR9ICN7YWN0aW9uLm5hbWV9XCIgaWYgYWN0aW9uLm5hbWUgIT0gJ25vb3AnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AsIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hUXG4gICAgICAgICAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uICMgYm90IGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgbW92ZSBhY3Rpb24gLT4gc3RvcmUgcm90YXRpb24gaW4gQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBAcmVzdF9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gbWF0cml4XG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBhY3Rpb24uaWQgPiBBY3Rpb24uU0hPT1RcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uICMgdXBkYXRlIGNsaW1iIEBvcmllbnRhdGlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24gYW5kIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEICMgYm90IGlzIGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgcm90YXRpb24gLT5cbiAgICAgICAgICAgICMgdGFrZSBvdmVyIHJlc3VsdCBvZiByb3RhdGlvbiB0byBwcmV2ZW50IHNsaWRpbmdcbiAgICAgICAgICAgIGlmIEByb3RhdGVfYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoLTkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgdGFyZ2V0UG9zID0gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICAgICAgd29ybGQub2JqZWN0TW92ZWQgQCwgQHBvc2l0aW9uLCB0YXJnZXRQb3MgIyB1cGRhdGUgd29ybGQgQHBvc2l0aW9uXG4gICAgICAgICAgICBAcG9zaXRpb24gPSB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEIGFuZCBAcm90YXRlX2FjdGlvbiA9PSBudWxsICMgaWYgbm90IGp1bXBpbmcgZm9yd2FyZFxuICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBAb3JpZW50YXRpb25cbiAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGxvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAje2FjdGlvbi5uYW1lfSAje2FjdGlvbi5pZH1cIlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSCBhbmQgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgIGxvZyAnc3VwZXIgKFB1c2hhYmxlKSBhY3Rpb24hJ1xuICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgaWYgQG1vdmVfYWN0aW9uPyAjIGFjdGlvbiB3YXMgbm90IGEgbW92ZSBhY3Rpb24gLT4gcmV0dXJuXG4gICAgICAgICAgICAjIGxvZyAnYm90LmFjdGlvbkZpbmlzaGVkIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiEnXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgbmV4dCBhY3Rpb24gZGVwZW5kaW5nIG9uIHR5cGUgb2YgZmluaXNoZWQgYWN0aW9uIGFuZCBzdXJyb3VuZGluZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgd2lsbCBhbHNvIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpLCAwLjI1IFxuICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgd2lsbCBub3QgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLm1pbnVzIEBnZXRVcCgpICAjIGJlbG93IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMgbG9nICdib3QuYWN0aW9uRmluaXNoZWQgYmVsb3cgZW1wdHknLCB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKSksIEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKClcbiAgICAgICAgICAgIGlmIEBtb3ZlICMgc3RpY2t5IGlmIG1vdmluZ1xuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkgICMgZm9yd2FyZCB3aWxsIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICMgbG9nICdib3QuYWN0aW9uRmluaXNoZWQgZm9yd2FyZCBlbXB0eSdcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNPY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgIyBiZWxvdyBmb3J3YXJkIGlzIHNvbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudCA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm1pbnVzIEBnZXRVcCgpIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkgXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBvY2N1cGFudD8gb3Igbm90IG9jY3VwYW50Py5pc1NsaXBwZXJ5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24gPSBAZ2V0RG93bigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGVsc2UgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uRkFMTF9GT1JXQVJELCBBY3Rpb24uRkFMTF0gIyBsYW5kZWRcbiAgICAgICAgICAgIGlmIEBuYW1lID09ICdwbGF5ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpXG4gICAgICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICBUaW1lci5hZGRBY3Rpb24gQG1vdmVfYWN0aW9uXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAcm90YXRlX2FjdGlvbj8gXG4gICAgICAgIFxuICAgICAgICBAZml4T3JpZW50YXRpb25BbmRQb3NpdGlvbigpXG5cbiAgICAgICAgaWYgQG1vdmUgb3IgQGp1bXAgb3IgQGp1bXBfb25jZVxuICAgICAgICAgICAgQG1vdmVCb3QoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGlyX3NnbiA9IDFcbiAgICAgICAgICAgIEBqdW1wX29uY2UgPSBmYWxzZSBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLk5PT1BcbiAgICAgICAgICAgICMgbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgcG9zaXRpb246XCIsIEBwb3NpdGlvbiBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GT1JXQVJELCBBY3Rpb24uSlVNUF9GT1JXQVJELCBBY3Rpb24uQ0xJTUJfRE9XTl1cbiAgICAgICAgICAgICMgbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgb3JpZW50YXRpb246XCIsIEBvcmllbnRhdGlvbi5yb3VuZGVkKCkubmFtZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uQ0xJTUJfVVBdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdvcmxkLmdldFJlYWxPY2N1cGFudEF0UG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpPy5pc011dGFudD8oKVxuICAgICAgICAgICAgICAgICMga2VlcCBhY3Rpb24gY2hhaW4gZmxvd2lud2cgaW4gb3JkZXIgdG8gZGV0ZWN0IGVudmlyb25tZW50IGNoYW5nZXNcbiAgICAgICAgICAgICAgICBsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBtdXRhbnQgYmVsb3c6IHN0YXJ0VGltZWRBY3Rpb24gTk9PUCdcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgMFxuXG4gICAgZml4T3JpZW50YXRpb25BbmRQb3NpdGlvbjogLT5cbiAgICAgICAgQHNldFBvc2l0aW9uIEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgQHNldE9yaWVudGF0aW9uIEBjdXJyZW50X29yaWVudGF0aW9uLnJvdW5kKClcblxuICAgICMgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG1vdmVCb3Q6ICgpIC0+XG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICBpZiBAbW92ZSBhbmQgKEBqdW1wIG9yIEBqdW1wX29uY2UpIGFuZCAgICAjIGp1bXAgbW9kZSBvciBqdW1wIGFjdGl2YXRlZCB3aGlsZSBtb3ZpbmdcbiAgICAgICAgICAgIEBkaXJfc2duID09IDEuMCBhbmQgICAgICAgICAgICAgICAgICAgICAjIGFuZCBtb3ZpbmcgZm9yd2FyZFxuICAgICAgICAgICAgICAgIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSkgICMgYW5kIGFib3ZlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MpICAjIGZvcndhcmQgYW5kIGFib3ZlIGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICBlbHNlICMgbm8gc3BhY2UgdG8ganVtcCBmb3J3YXJkIC0+IGp1bXAgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgQG1vdmVfYWN0aW9uLmtlZXBSZXN0KCkgIyB0cnkgdG8gbWFrZSBzdWJzZXF1ZW50IGFjdGlvbnMgc21vb3RoXG4gICAgICAgICAgICBUaW1lci5hZGRBY3Rpb24gQG1vdmVfYWN0aW9uXG4gICAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgIFxuICAgICAgICBcbiAgICBzdGVwOiAoc3RlcCkgLT5cbiAgICAgICAgQG1lc2gucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvblxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgQGN1cnJlbnRfb3JpZW50YXRpb25cbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQGxlZnRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkByaWdodF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcblxubW9kdWxlLmV4cG9ydHMgPSBCb3RcbiJdfQ==
//# sourceURL=../coffee/bot.coffee