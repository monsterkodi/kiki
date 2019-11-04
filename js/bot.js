// koffee 1.4.0
var Action, Bot, Bullet, Material, Pos, Pushable, Quaternion, Timer, Vector,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSx1RUFBQTtJQUFBOzs7QUFBQSxRQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLEtBQUEsR0FBYSxPQUFBLENBQVEsU0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsR0FBQSxHQUFhLE9BQUEsQ0FBUSxXQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLGtCQUFSOztBQUNiLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFFUDs7O0lBRVcsYUFBQTtRQUVULElBQUMsQ0FBQSxTQUFELEdBQXVCLElBQUk7UUFDM0IsSUFBQyxDQUFBLFdBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsa0JBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsaUJBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsZ0JBQUQsR0FBdUIsSUFBSTtRQUUzQixJQUFDLENBQUEsYUFBRCxHQUFtQjtRQUNuQixJQUFDLENBQUEsY0FBRCxHQUFtQjtRQUNuQixJQUFDLENBQUEsU0FBRCxHQUFtQjtRQUVuQixJQUFDLENBQUEsUUFBRCxHQUFZO1FBRVosSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLEtBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxTQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsSUFBRCxHQUFjO1FBRWQsSUFBQyxDQUFBLFdBQUQsR0FBaUI7UUFDakIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7UUFFakIsSUFBQyxDQUFBLE9BQUQs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USxDQUFDLFFBQVEsQ0FBQyxHQUFuQixDQUF1QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsYUFBcEIsQ0FBdkIsRUFBMkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQTNELEVBQStFLENBQS9FO2VBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGNBQXBCLENBQXhCLEVBQTZELE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQyxFQUFoQixDQUE3RCxFQUFrRixDQUFsRjtJQUpFOzs7O0dBcmRROztBQTJkbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuXG5QdXNoYWJsZSAgID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbkFjdGlvbiAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcblRpbWVyICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQnVsbGV0ICAgICA9IHJlcXVpcmUgJy4vYnVsbGV0J1xuUG9zICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblZlY3RvciAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5RdWF0ZXJuaW9uID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcbk1hdGVyaWFsICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBCb3QgZXh0ZW5kcyBQdXNoYWJsZVxuICAgICAgICBcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBvcmllbnRhdGlvbiAgICAgICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgIEBsYXN0X2Z1bWUgICAgICAgPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgQG1pbk1vdmVzID0gMTAwXG5cbiAgICAgICAgQG1vdmUgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgID0gbnVsbFxuICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBkaXJfc2duICAgICAgID0gMS4wXG4gICAgICAgIFxuICAgICAgICBzdXBlciBcblxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZPUldBUkQsICAgICAgXCJtb3ZlIGZvcndhcmRcIiwgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9VUCwgICAgIFwiY2xpbWIgdXBcIiwgICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfRE9XTiwgICBcImNsaW1iIGRvd25cIiwgICAgIDUwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fTEVGVCwgICAgXCJ0dXJuIGxlZnRcIiwgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX1JJR0hULCAgIFwidHVybiByaWdodFwiLCAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUCwgICAgICAgICBcImp1bXBcIiwgICAgICAgICAgIDEyMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVBfRk9SV0FSRCwgXCJqdW1wIGZvcndhcmRcIiwgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GQUxMX0ZPUldBUkQsIFwiZmFsbCBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uU0hPT1QsICAgICAgICBcInNob290XCIsICAgICAgICAgIDIwMCwgQWN0aW9uLlJFUEVBVFxuICAgIFxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5GQUxMKS5kdXJhdGlvbiA9IDEyMFxuICAgICAgICBAYWRkRXZlbnRXaXRoTmFtZSBcImRpZWRcIlxuICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgNTAwXG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIHRpcmVSYWRpdXMgPSAwLjA1XG4gICAgICAgIG5vc2UgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5IDAuNDA0LCAwLjUsIDMyLCAxNiwgdHJ1ZVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSwgMzIsIDMyLCAxNiwgTWF0aC5QSVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSwgMzIsIDMyLCAwLCAyKk1hdGguUEksIDAsIDIuMlxuICAgICAgICBcbiAgICAgICAgbm1hdHIgPSBuZXcgVEhSRUUuTWF0cml4NCgpXG4gICAgICAgIHRyYW5zID0gbmV3IFRIUkVFLlZlY3RvcjMgMCwtMC41NDMsMFxuICAgICAgICByb3QgICA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyIG5ldyBUSFJFRS5FdWxlciBWZWN0b3IuREVHMlJBRCgxODApLCAwLCAwXG4gICAgICAgIFxuICAgICAgICBubWF0ci5jb21wb3NlIHRyYW5zLCByb3QsIG5ldyBUSFJFRS5WZWN0b3IzIDEsMSwxXG4gICAgICAgIGdlb20ubWVyZ2Ugbm9zZSwgbm1hdHJcbiAgICAgICAgZ2VvbS5yb3RhdGVYIFZlY3Rvci5ERUcyUkFEIC05MFxuICAgICAgICBnZW9tLnNjYWxlIDAuNywgMC43LCAwLjdcbiAgICAgICAgICAgXG4gICAgICAgIE11dGFudCA9IHJlcXVpcmUgJy4vbXV0YW50JyAgICAgICAgIFxuICAgICAgICBtdXRhbnQgPSBAIGluc3RhbmNlb2YgTXV0YW50XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnQuY2xvbmUoKSBvciBNYXRlcmlhbC5wbGF5ZXJcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkgMC41LXRpcmVSYWRpdXMsIHRpcmVSYWRpdXMsIDE2LCAzMlxuICAgICAgICBnZW9tLnNjYWxlIDEsMSwyLjVcbiAgICAgICAgdGlyZU1hdCA9IG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50VGlyZS5jbG9uZSgpIG9yIE1hdGVyaWFsLnRpcmVcbiAgICAgICAgQGxlZnRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAbGVmdFRpcmUucG9zaXRpb24uc2V0IDAuMzUsMCwwIFxuICAgICAgICBAbGVmdFRpcmUucm90YXRpb24uc2V0IDAsIFZlY3Rvci5ERUcyUkFEKDkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQGxlZnRUaXJlXG5cbiAgICAgICAgQHJpZ2h0VGlyZSA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIHRpcmVNYXRcbiAgICAgICAgQHJpZ2h0VGlyZS5wb3NpdGlvbi5zZXQgLTAuMzUsMCwwIFxuICAgICAgICBAcmlnaHRUaXJlLnJvdGF0aW9uLnNldCAwLCBWZWN0b3IuREVHMlJBRCgtOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAcmlnaHRUaXJlXG5cbiAgICAgICAgQG1lc2guY2FzdFNoYWRvdyA9IEByaWdodFRpcmUuY2FzdFNoYWRvdyA9IEBsZWZ0VGlyZS5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gQGxlZnRUaXJlLnJlY2VpdmVTaGFkb3cgPSBAcmlnaHRUaXJlLnJlY2VpdmVTaGFkb3cgPSB0cnVlIFxuICAgICAgICAgICAgXG4gICAgc2V0T3BhY2l0eTogKG9wYWNpdHkpIC0+IFxuICAgICAgICB0aXJlTWF0ID0gQGxlZnRUaXJlLm1hdGVyaWFsXG4gICAgICAgIGJvdE1hdCA9IEBtZXNoLm1hdGVyaWFsXG4gICAgICAgIHRpcmVNYXQudmlzaWJsZSA9IG9wYWNpdHkgPiAwXG4gICAgICAgIHRpcmVNYXQuZGVwdGhXcml0ZSA9IG9wYWNpdHkgPiAwLjVcbiAgICAgICAgYm90TWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgICAgICB0aXJlTWF0Lm9wYWNpdHkgPSBvcGFjaXR5XG4gICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuICAgIGdldERvd246IC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLm1pbnVzWVxuICAgIGdldFVwOiAgIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLnVuaXRZXG4gICAgZ2V0RGlyOiAgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBuZXcgVmVjdG9yIDAsMCxAZGlyX3NnblxuICBcbiAgICBjdXJyZW50UG9zOiAgLT4gQGN1cnJlbnRfcG9zaXRpb24uY2xvbmUoKVxuICAgIGN1cnJlbnREaXI6ICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRaKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRVcDogICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRZKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRMZWZ0OiAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRYKS5ub3JtYWwoKVxuXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGRpZTogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWN0aW9uc09mT2JqZWN0IEBcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCA9IGZhbHNlXG4gICAgICAgIEBwdXNoICA9IGZhbHNlXG4gICAgXG4gICAgICAgIEBnZXRFdmVudFdpdGhOYW1lKFwiZGllZFwiKS50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIEBkaWVkICA9IHRydWVcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIHJlc2V0OiAoKSAtPlxuICAgIFxuICAgICAgICBAbGVmdF90aXJlX3JvdCAgID0gMC4wXG4gICAgICAgIEByaWdodF90aXJlX3JvdCAgPSAwLjBcbiAgICAgICAgQGxhc3RfZnVtZSAgICAgICA9IDBcbiAgICBcbiAgICAgICAgQGRpcmVjdGlvbi5yZXNldCgpXG4gICAgICAgIEBvcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBAbW92ZSAgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICAgPSBmYWxzZVxuICAgIFxuICAgIGlzRmFsbGluZzogLT4gQG1vdmVfYWN0aW9uIGFuZCBAbW92ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLkZBTExcbiAgICBcbiAgICAjICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgaW5pdEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgbmV3UG9zID0gbmV3IFBvcyBAcG9zaXRpb24gXG4gICAgICAgICMgbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfSBwb3NcIiwgbmV3UG9zXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QICAgICAgICAgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkQgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVAgICAgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldERvd24oKS5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgbmV3UG9zLmFkZCBAZ2V0RG93bigpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG5vdCBuZXdQb3MuZXFsIG5ldyBQb3MgQHBvc2l0aW9uXG4gICAgICAgICAgICAjIGxvZyAnYm90LmluaXRBY3Rpb24gb2JqZWN0V2lsbE1vdmVUb1BvczonLCBuZXdQb3NcbiAgICAgICAgICAgIHdvcmxkLm9iamVjdFdpbGxNb3ZlVG9Qb3MgQCwgbmV3UG9zLCBhY3Rpb24uZ2V0RHVyYXRpb24oKVxuICAgIFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwICAgICAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgIFxuICAgIHBlcmZvcm1BY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICByZWxUaW1lICA9IGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKVxuICAgICAgICBkbHRUaW1lICA9IGFjdGlvbi5nZXRSZWxhdGl2ZURlbHRhKClcbiAgICBcbiAgICAgICAgY29zRmFjID0gTWF0aC5jb3MgTWF0aC5QSS8yIC0gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICBzaW5GYWMgPSBNYXRoLnNpbiBNYXRoLlBJLzIgKiByZWxUaW1lXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlNIT09UXG4gICAgICAgICAgICAgICAgaWYgcmVsVGltZSA9PSAwXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiBkbHRUaW1lKVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXRVcCgpLm11bChzaW5GYWMpIFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXREb3duKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBsb2cgJ3N0aWxsIG5lZWRlZD8nXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lIDw9IDAuMlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwgKHJlbFRpbWUvMC4yKS8yXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVsVGltZSA+PSAwLjgpXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpLm11bCAwLjUrKHJlbFRpbWUtMC44KS8wLjIvMlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIChyZWxUaW1lLTAuMikvMC42ICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIHJvdFZlYyA9IChAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbikucm90YXRlIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzKEBnZXREb3duKCkpLnBsdXMocm90VmVjKS5tdWwgMC41XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uVFVSTl9MRUZUXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uID09IG51bGwgYW5kIHJlbFRpbWUgPT0gMC4wICMgaWYgbm90IHBlcmZvcm1pbmcgbW92ZSBhY3Rpb24gYW5kIHN0YXJ0IG9mIHJvdGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdXBkYXRlIEBvcmllbnRhdGlvbiBub3csIHNvIG5leHQgbW92ZSBhY3Rpb24gd2lsbCBtb3ZlIGluIGRlc2lyZWQgQGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9ICBkbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiA5MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IC1kbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBmaW5pc2hBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgXG4gICAgICAgICMgbG9nIFwiQm90LmZpbmlzaEFjdGlvbiAje2FjdGlvbi5pZH0gI3thY3Rpb24ubmFtZX1cIiBpZiBhY3Rpb24ubmFtZSAhPSAnbm9vcCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCwgQWN0aW9uLlNIT09UXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5QVVNILCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFRcbiAgICAgICAgICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gIyBib3QgY3VycmVudGx5IHBlcmZvcm1pbmcgYSBtb3ZlIGFjdGlvbiAtPiBzdG9yZSByb3RhdGlvbiBpbiBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IEByZXN0X29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBtYXRyaXhcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIGFjdGlvbi5pZCA+IEFjdGlvbi5TSE9PVFxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24gIyB1cGRhdGUgY2xpbWIgQG9yaWVudGF0aW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcm90YXRlX2FjdGlvbiBhbmQgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgIyBib3QgaXMgY3VycmVudGx5IHBlcmZvcm1pbmcgYSByb3RhdGlvbiAtPlxuICAgICAgICAgICAgIyB0YWtlIG92ZXIgcmVzdWx0IG9mIHJvdGF0aW9uIHRvIHByZXZlbnQgc2xpZGluZ1xuICAgICAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3Rvcig5MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvcigtOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICB0YXJnZXRQb3MgPSBAY3VycmVudF9wb3NpdGlvbi5yb3VuZCgpXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RNb3ZlZCBALCBAcG9zaXRpb24sIHRhcmdldFBvcyAjIHVwZGF0ZSB3b3JsZCBAcG9zaXRpb25cbiAgICAgICAgICAgIEBwb3NpdGlvbiA9IHRhcmdldFBvc1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgYW5kIEByb3RhdGVfYWN0aW9uID09IG51bGwgIyBpZiBub3QganVtcGluZyBmb3J3YXJkXG4gICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIEBvcmllbnRhdGlvblxuICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgICMgbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICN7YWN0aW9uLm5hbWV9ICN7YWN0aW9uLmlkfVwiXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5QVVNIIGFuZCBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMgbG9nICdib3QuYWN0aW9uRmluaXNoZWQgd2FzIG5vdCBhIG1vdmUgYWN0aW9uISdcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgZmluZCBuZXh0IGFjdGlvbiBkZXBlbmRpbmcgb24gdHlwZSBvZiBmaW5pc2hlZCBhY3Rpb24gYW5kIHN1cnJvdW5kaW5nIGVudmlyb25tZW50XG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLm1pbnVzIEBnZXRVcCgpICMgYmVsb3cgZm9yd2FyZCB3aWxsIGFsc28gYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKCksIDAuMjUgXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCB3aWxsIG5vdCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ubWludXMgQGdldFVwKCkgICMgYmVsb3cgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCcsIEBnZXRQb3MoKSwgMC41XG4gICAgICAgIGVsc2UgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkgICMgYmVsb3cgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgIyBsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eScsIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKSwgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKVxuICAgICAgICAgICAgaWYgQG1vdmUgIyBzdGlja3kgaWYgbW92aW5nXG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSAgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgIyBsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uPyBcbiAgICAgICAgXG4gICAgICAgIEBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgIyBsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgJyN7YWN0aW9uLm5hbWV9JyBwb3NpdGlvbjpcIiwgQHBvc2l0aW9uIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLkZPUldBUkQsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIEFjdGlvbi5DTElNQl9ET1dOXVxuICAgICAgICAgICAgIyBsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgJyN7YWN0aW9uLm5hbWV9JyBvcmllbnRhdGlvbjpcIiwgQG9yaWVudGF0aW9uLnJvdW5kZWQoKS5uYW1lIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFQsIEFjdGlvbi5DTElNQl9VUF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgd29ybGQuZ2V0UmVhbE9jY3VwYW50QXRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKSk/LmlzTXV0YW50PygpXG4gICAgICAgICAgICAgICAgIyBrZWVwIGFjdGlvbiBjaGFpbiBmbG93aW53ZyBpbiBvcmRlciB0byBkZXRlY3QgZW52aXJvbm1lbnQgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGxvZyAnYm90LmFjdGlvbkZpbmlzaGVkIG11dGFudCBiZWxvdzogc3RhcnRUaW1lZEFjdGlvbiBOT09QJ1xuICAgICAgICAgICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLk5PT1ApLCAwXG5cbiAgICBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uOiAtPlxuICAgICAgICBAc2V0UG9zaXRpb24gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICBAc2V0T3JpZW50YXRpb24gQGN1cnJlbnRfb3JpZW50YXRpb24ucm91bmQoKVxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgIGlmIEBtb3ZlIGFuZCAoQGp1bXAgb3IgQGp1bXBfb25jZSkgYW5kICAgICMganVtcCBtb2RlIG9yIGp1bXAgYWN0aXZhdGVkIHdoaWxlIG1vdmluZ1xuICAgICAgICAgICAgQGRpcl9zZ24gPT0gMS4wIGFuZCAgICAgICAgICAgICAgICAgICAgICMgYW5kIG1vdmluZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKSAgIyBhbmQgYWJvdmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MucGx1cyBAZ2V0VXAoKSkgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcykgICMgZm9yd2FyZCBhbmQgYWJvdmUgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgIyBubyBzcGFjZSB0byBqdW1wIGZvcndhcmQgLT4ganVtcCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUFxuICAgICAgICBlbHNlIGlmIEBtb3ZlIFxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgICMgZm9yd2FyZCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgXG4gICAgICAgICAgICAgICAgICAgICMgYmVsb3cgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBkb3duIGlzIHNvbGlkXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgaWYgQHB1c2ggYW5kIHdvcmxkLm1heU9iamVjdFB1c2hUb1BvcyBALCBmb3J3YXJkUG9zLCBtb3ZlQWN0aW9uLmdldER1cmF0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgbW92ZUFjdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgICMgcGxheWVyIGluIHB1c2ggbW9kZSBhbmQgcHVzaGluZyBvYmplY3QgaXMgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gbW92ZUFjdGlvblxuICAgICAgICAgICAgICAgIGVsc2UgIyBqdXN0IGNsaW1iIHVwXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIGVsc2UgaWYgQGp1bXAgb3IgQGp1bXBfb25jZVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKVxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgXG4gICAgICAgICMgcmVzZXQgdGhlIGp1bXAgb25jZSBmbGFnIChlaXRoZXIgd2UganVtcGVkIG9yIGl0J3Mgbm90IHBvc3NpYmxlIHRvIGp1bXAgYXQgY3VycmVudCBAcG9zaXRpb24pXG4gICAgICAgIEBqdW1wX29uY2UgPSBmYWxzZSBcbiAgICBcbiAgICAgICAgaWYgQG1vdmVfYWN0aW9uXG4gICAgICAgICAgICBAbW92ZV9hY3Rpb24ua2VlcFJlc3QoKSAjIHRyeSB0byBtYWtlIHN1YnNlcXVlbnQgYWN0aW9ucyBzbW9vdGhcbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgXG4gICAgICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPlxuICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uXG4gICAgICAgIEBtZXNoLnF1YXRlcm5pb24uY29weSBAY3VycmVudF9vcmllbnRhdGlvblxuICAgICAgICBAbGVmdFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAbGVmdF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKDkwKSwgMFxuICAgICAgICBAcmlnaHRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQHJpZ2h0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdFxuIl19
//# sourceURL=../coffee/bot.coffee