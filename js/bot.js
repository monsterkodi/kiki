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
        var dltTime, relTime, rotVec, sinFac;
        relTime = action.getRelativeTime();
        dltTime = action.getRelativeDelta();
        this.lastActionDelta = dltTime;
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
                sinFac = Math.sin(Math.PI / 2 * relTime);
                this.current_position = this.position.plus(this.getUp().mul(sinFac));
                return;
            case Action.JUMP_FORWARD:
                sinFac = Math.sin(Math.PI / 2 * relTime);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUVqQixJQUFDLENBQUEsT0FBRCxHQUFpQjtRQUVqQixzQ0FBQSxTQUFBO1FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQW1DLGNBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsUUFBckIsRUFBbUMsVUFBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxVQUFyQixFQUFtQyxZQUFuQyxFQUFvRCxHQUFwRCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLFNBQXJCLEVBQW1DLFdBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsVUFBckIsRUFBbUMsWUFBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxJQUFyQixFQUFtQyxNQUFuQyxFQUFvRCxHQUFwRCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLFlBQXJCLEVBQW1DLGNBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsWUFBckIsRUFBbUMsY0FBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxLQUFyQixFQUFtQyxPQUFuQyxFQUFvRCxHQUFwRCxFQUF3RCxNQUFNLENBQUMsTUFBL0QsQ0FBWDtRQUVBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUE2QixDQUFDLFFBQTlCLEdBQXlDO1FBQ3pDLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixNQUFsQjtRQUVBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBbEIsRUFBaUQsR0FBakQ7SUEzQ0Q7O2tCQTZDSCxVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxVQUFBLEdBQWE7UUFDYixJQUFBLEdBQU8sSUFBSSxLQUFLLENBQUMsWUFBVixDQUF1QixLQUF2QixFQUE2QixHQUE3QixFQUFpQyxFQUFqQyxFQUFvQyxFQUFwQyxFQUF1QyxJQUF2QztRQUNQLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCLEdBQXpCLEVBQTZCLEVBQTdCLEVBQWdDLEVBQWhDLEVBQW1DLEVBQW5DLEVBQXVDLElBQUksQ0FBQyxFQUE1QztRQUNQLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCLEdBQXpCLEVBQTZCLEVBQTdCLEVBQWdDLEVBQWhDLEVBQW1DLENBQW5DLEVBQXFDLENBQUEsR0FBRSxJQUFJLENBQUMsRUFBNUMsRUFBZ0QsQ0FBaEQsRUFBa0QsR0FBbEQ7UUFFUCxLQUFBLEdBQVEsSUFBSSxLQUFLLENBQUMsT0FBVixDQUFBO1FBQ1IsS0FBQSxHQUFRLElBQUksS0FBSyxDQUFDLE9BQVYsQ0FBa0IsQ0FBbEIsRUFBb0IsQ0FBQyxLQUFyQixFQUEyQixDQUEzQjtRQUNSLEdBQUEsR0FBUSxJQUFJLEtBQUssQ0FBQyxVQUFWLENBQUEsQ0FBc0IsQ0FBQyxZQUF2QixDQUFvQyxJQUFJLEtBQUssQ0FBQyxLQUFWLENBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBZixDQUFoQixFQUFxQyxDQUFyQyxFQUF1QyxDQUF2QyxDQUFwQztRQUVSLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBZCxFQUFxQixHQUFyQixFQUEwQixJQUFJLEtBQUssQ0FBQyxPQUFWLENBQWtCLENBQWxCLEVBQW9CLENBQXBCLEVBQXNCLENBQXRCLENBQTFCO1FBQ0EsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLEtBQWpCO1FBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFlLENBQUMsRUFBaEIsQ0FBYjtRQUNBLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxFQUFlLEdBQWYsRUFBbUIsR0FBbkI7UUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7UUFDVCxNQUFBLEdBQVMsSUFBQSxZQUFhO1FBQ3RCLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsTUFBQSxJQUFXLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBQSxDQUFYLElBQXNDLFFBQVEsQ0FBQyxNQUFwRTtRQUVSLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxhQUFWLENBQXdCLEdBQUEsR0FBSSxVQUE1QixFQUF3QyxVQUF4QyxFQUFvRCxFQUFwRCxFQUF1RCxFQUF2RDtRQUNQLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxFQUFhLENBQWIsRUFBZSxHQUFmO1FBQ0EsT0FBQSxHQUFVLE1BQUEsSUFBVyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQXBCLENBQUEsQ0FBWCxJQUEwQyxRQUFRLENBQUM7UUFDN0QsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixPQUFyQjtRQUNaLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQW5CLENBQXVCLElBQXZCLEVBQTRCLENBQTVCLEVBQThCLENBQTlCO1FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBbkIsQ0FBdUIsQ0FBdkIsRUFBMEIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQTFCLEVBQThDLENBQTlDO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLFFBQVg7UUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCO1FBQ2IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsQ0FBQyxJQUF6QixFQUE4QixDQUE5QixFQUFnQyxDQUFoQztRQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQXBCLENBQXdCLENBQXhCLEVBQTBCLE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQyxFQUFoQixDQUExQixFQUErQyxDQUEvQztRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxTQUFYO1FBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLEdBQW1CLElBQUMsQ0FBQSxTQUFTLENBQUMsVUFBWCxHQUF3QixJQUFDLENBQUEsUUFBUSxDQUFDLFVBQVYsR0FBdUI7ZUFDbEUsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCLElBQUMsQ0FBQSxRQUFRLENBQUMsYUFBVixHQUEwQixJQUFDLENBQUEsU0FBUyxDQUFDLGFBQVgsR0FBMkI7SUFsQ25FOztrQkFvQ1osVUFBQSxHQUFZLFNBQUMsT0FBRDtBQUNSLFlBQUE7UUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFFBQVEsQ0FBQztRQUNwQixNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQztRQUNmLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQUEsR0FBVTtRQUM1QixPQUFPLENBQUMsVUFBUixHQUFxQixPQUFBLEdBQVU7UUFDL0IsTUFBTSxDQUFDLFVBQVAsR0FBb0IsT0FBQSxHQUFVO1FBQzlCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO2VBQ2pCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCO0lBUFY7O2tCQWVaLE9BQUEsR0FBUyxTQUFBO2VBQUcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLE1BQU0sQ0FBQyxNQUEzQjtJQUFIOztrQkFDVCxLQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixNQUFNLENBQUMsS0FBM0I7SUFBSDs7a0JBQ1QsTUFBQSxHQUFRLFNBQUMsR0FBRDs7WUFBQyxNQUFJLElBQUMsQ0FBQTs7ZUFBWSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0IsSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFhLENBQWIsRUFBZSxHQUFmLENBQXBCO0lBQWxCOztrQkFFUixVQUFBLEdBQWEsU0FBQTtlQUFHLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBO0lBQUg7O2tCQUNiLFVBQUEsR0FBYSxTQUFBO2VBQUcsSUFBQyxDQUFBLG1CQUFtQixDQUFDLE1BQXJCLENBQTRCLE1BQU0sQ0FBQyxLQUFuQyxDQUF5QyxDQUFDLE1BQTFDLENBQUE7SUFBSDs7a0JBQ2IsU0FBQSxHQUFhLFNBQUE7ZUFBRyxJQUFDLENBQUEsbUJBQW1CLENBQUMsTUFBckIsQ0FBNEIsTUFBTSxDQUFDLEtBQW5DLENBQXlDLENBQUMsTUFBMUMsQ0FBQTtJQUFIOztrQkFDYixXQUFBLEdBQWEsU0FBQTtlQUFHLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxNQUFyQixDQUE0QixNQUFNLENBQUMsS0FBbkMsQ0FBeUMsQ0FBQyxNQUExQyxDQUFBO0lBQUg7O2tCQVFiLEdBQUEsR0FBSyxTQUFBO1FBQ0QsS0FBSyxDQUFDLHFCQUFOLENBQTRCLElBQTVCO1FBRUEsSUFBQyxDQUFBLElBQUQsR0FBUztRQUNULElBQUMsQ0FBQSxJQUFELEdBQVM7UUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO1FBQ1QsSUFBQyxDQUFBLElBQUQsR0FBUztRQUVULElBQUMsQ0FBQSxnQkFBRCxDQUFrQixNQUFsQixDQUF5QixDQUFDLGNBQTFCLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxHQUFTO0lBVFI7O2tCQWlCTCxLQUFBLEdBQU8sU0FBQTtRQUVILElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBO1FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7UUFDQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsS0FBckIsQ0FBQTtRQUNBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxLQUFwQixDQUFBO1FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQW5CLENBQUE7UUFDQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsS0FBbEIsQ0FBQTtRQUVBLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFDZixJQUFDLENBQUEsSUFBRCxHQUFlO1FBQ2YsSUFBQyxDQUFBLElBQUQsR0FBZTtRQUNmLElBQUMsQ0FBQSxJQUFELEdBQWU7UUFDZixJQUFDLENBQUEsS0FBRCxHQUFlO1FBQ2YsSUFBQyxDQUFBLFNBQUQsR0FBZTtlQUNmLElBQUMsQ0FBQSxJQUFELEdBQWU7SUFsQlo7O2tCQW9CUCxTQUFBLEdBQVcsU0FBQTtlQUFHLElBQUMsQ0FBQSxXQUFELElBQWlCLElBQUMsQ0FBQSxXQUFXLENBQUMsRUFBYixLQUFtQixNQUFNLENBQUM7SUFBOUM7O2tCQVFYLFVBQUEsR0FBWSxTQUFDLE1BQUQ7QUFDUixZQUFBO1FBQUEsTUFBQSxHQUFTLElBQUksR0FBSixDQUFRLElBQUMsQ0FBQSxRQUFUO0FBSVQsZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsSUFEaEI7QUFDa0M7QUFEbEMsaUJBRVMsTUFBTSxDQUFDLE9BRmhCO2dCQUVrQyxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBWDtBQUF6QjtBQUZULGlCQUdTLE1BQU0sQ0FBQyxVQUhoQjtnQkFHa0MsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFmLENBQVg7QUFBekI7QUFIVCxpQkFJUyxNQUFNLENBQUMsSUFKaEI7Z0JBSWtDLE1BQU0sQ0FBQyxHQUFQLENBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFYO0FBQXpCO0FBSlQsaUJBS1MsTUFBTSxDQUFDLFlBTGhCO2dCQUtrQyxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUSxDQUFDLElBQVQsQ0FBYyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWQsQ0FBWDtBQUF6QjtBQUxULGlCQU1TLE1BQU0sQ0FBQyxZQU5oQjtnQkFNa0MsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBaEIsQ0FBWDtBQUF6QjtBQU5ULGlCQU9TLE1BQU0sQ0FBQyxJQVBoQjtnQkFRUSxJQUFHLENBQUksSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQUEsQ0FBUDtvQkFDSSxvQ0FBTSxNQUFOO0FBQ0EsMkJBRko7O2dCQUdBLE1BQU0sQ0FBQyxHQUFQLENBQVcsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFYO0FBSkM7QUFQVDtnQkFhUSxvQ0FBTSxNQUFOO0FBQ0E7QUFkUjtRQWdCQSxJQUFHLENBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFJLEdBQUosQ0FBUSxJQUFDLENBQUEsUUFBVCxDQUFYLENBQVA7bUJBRUksS0FBSyxDQUFDLG1CQUFOLENBQTBCLElBQTFCLEVBQTZCLE1BQTdCLEVBQXFDLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBckMsRUFGSjs7SUFyQlE7O2tCQStCWixhQUFBLEdBQWUsU0FBQyxNQUFEO0FBRVgsWUFBQTtRQUFBLE9BQUEsR0FBVyxNQUFNLENBQUMsZUFBUCxDQUFBO1FBQ1gsT0FBQSxHQUFXLE1BQU0sQ0FBQyxnQkFBUCxDQUFBO1FBRVgsSUFBQyxDQUFBLGVBQUQsR0FBbUI7QUFFbkIsZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsS0FEaEI7Z0JBRVEsSUFBRyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUg7b0JBQ0ksTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFESjs7QUFEQztBQURULGlCQUtTLE1BQU0sQ0FBQyxJQUxoQjtBQUswQjtBQUwxQixpQkFPUyxNQUFNLENBQUMsT0FQaEI7Z0JBU1EsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLEdBQVYsQ0FBYyxPQUFkLENBQWY7QUFDcEI7QUFaUixpQkFjUyxNQUFNLENBQUMsSUFkaEI7Z0JBZ0JRLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxFQUFMLEdBQVEsQ0FBUixHQUFZLE9BQXJCO2dCQUNULElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVEsQ0FBQyxHQUFULENBQWEsTUFBYixDQUFmO0FBQ3BCO0FBbEJSLGlCQW9CUyxNQUFNLENBQUMsWUFwQmhCO2dCQXNCUSxNQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsRUFBTCxHQUFRLENBQVIsR0FBWSxPQUFyQjtnQkFDVCxJQUFDLENBQUEsYUFBRCxJQUFtQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsRUFBTCxHQUFRLENBQVIsR0FBWSxPQUFyQjtnQkFDdkIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEVBQUwsR0FBUSxDQUFSLEdBQVksT0FBckI7Z0JBQ3ZCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxHQUFWLENBQWMsT0FBZCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUSxDQUFDLEdBQVQsQ0FBYSxNQUFiLENBQTVCLENBQWY7QUFDcEI7QUExQlIsaUJBNEJTLE1BQU0sQ0FBQyxZQTVCaEI7Z0JBOEJRLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxHQUFWLENBQWMsT0FBZCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQTVCLENBQWY7QUFDcEI7QUEvQlIsaUJBaUNTLE1BQU0sQ0FBQyxJQWpDaEI7Z0JBbUNRLElBQUcsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxDQUFQO29CQUNJLHVDQUFNLE1BQU47QUFDQSwyQkFGSjs7Z0JBR0EsSUFBQSxDQUFLLGVBQUw7Z0JBQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQWY7QUFDcEI7QUF4Q1IsaUJBMENTLE1BQU0sQ0FBQyxRQTFDaEI7Z0JBNENRLElBQUMsQ0FBQSxhQUFELElBQW1CLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxHQUFtQjtnQkFDdEMsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLEdBQW1CO2dCQUN0QyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsVUFBVSxDQUFDLG9CQUFYLENBQWdDLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxHQUFxQixDQUFDLElBQXRELEVBQTRELE1BQU0sQ0FBQyxLQUFuRTtBQUNyQjtBQS9DUixpQkFpRFMsTUFBTSxDQUFDLFVBakRoQjtnQkFtRFEsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBRyxPQUFBLElBQVcsR0FBZDtvQkFDSSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsR0FBVixDQUFjLENBQUMsT0FBQSxHQUFRLEdBQVQsQ0FBQSxHQUFjLENBQTVCLENBQWYsRUFEeEI7aUJBQUEsTUFFSyxJQUFJLE9BQUEsSUFBVyxHQUFmO29CQUNELElBQUMsQ0FBQSxpQkFBRCxHQUFxQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUEzQyxFQUFpRCxNQUFNLENBQUMsS0FBeEQ7b0JBQ3JCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsR0FBWCxDQUFlLEdBQUEsR0FBSSxDQUFDLE9BQUEsR0FBUSxHQUFULENBQUEsR0FBYyxHQUFkLEdBQWtCLENBQXJDLENBQWYsQ0FBZixFQUZuQjtpQkFBQSxNQUFBO29CQUlELElBQUMsQ0FBQSxpQkFBRCxHQUFxQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLE9BQUEsR0FBUSxHQUFULENBQVgsR0FBeUIsR0FBekIsR0FBK0IsSUFBL0QsRUFBcUUsTUFBTSxDQUFDLEtBQTVFO29CQUNyQixNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGlCQUFsQixDQUFELENBQXFDLENBQUMsTUFBdEMsQ0FBNkMsTUFBTSxDQUFDLEtBQXBEO29CQUNULElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFmLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsTUFBaEMsQ0FBdUMsQ0FBQyxHQUF4QyxDQUE0QyxHQUE1QyxDQUFmLEVBTm5COztBQU9MO0FBOURSLGlCQWdFUyxNQUFNLENBQUMsVUFoRWhCO0FBQUEsaUJBZ0U0QixNQUFNLENBQUMsU0FoRW5DO2dCQWtFUSxJQUFHLElBQUMsQ0FBQSxXQUFELEtBQWdCLElBQWhCLElBQXlCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBNUI7b0JBRUksSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxTQUF2Qjt3QkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBaEMsRUFBc0MsTUFBTSxDQUFDLEtBQTdDLENBQWpCO3dCQUNmLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsRUFGeEI7cUJBQUEsTUFBQTt3QkFJSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsQ0FBakI7d0JBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxNQUFNLENBQUMsS0FBN0MsRUFMeEI7cUJBRko7O2dCQVNBLElBQUcsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsU0FBdkI7b0JBQ0ksSUFBQyxDQUFBLGFBQUQsSUFBbUIsQ0FBQztvQkFDcEIsSUFBQyxDQUFBLGNBQUQsSUFBb0I7b0JBQ3BCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsT0FBQSxHQUFVLElBQTFDLEVBQWdELE1BQU0sQ0FBQyxLQUF2RCxFQUgxQjtpQkFBQSxNQUFBO29CQUtJLElBQUMsQ0FBQSxhQUFELElBQW9CO29CQUNwQixJQUFDLENBQUEsY0FBRCxJQUFtQixDQUFDO29CQUNwQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsVUFBVSxDQUFDLG9CQUFYLENBQWdDLE9BQUEsR0FBVSxDQUFDLElBQTNDLEVBQWlELE1BQU0sQ0FBQyxLQUF4RCxFQVAxQjs7QUFRQTtBQW5GUjtnQkF1RlEsdUNBQU0sTUFBTjtBQUNBO0FBeEZSO2VBMEZBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQW5CLENBQXVCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsZ0JBQXpCLENBQXZCLENBQWpCO0lBakdaOztrQkF5R2YsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUlWLFlBQUE7QUFBQSxnQkFBTyxNQUFNLENBQUMsRUFBZDtBQUFBLGlCQUNTLE1BQU0sQ0FBQyxJQURoQjtBQUFBLGlCQUNzQixNQUFNLENBQUMsS0FEN0I7QUFFUTtBQUZSLGlCQUdTLE1BQU0sQ0FBQyxJQUhoQjtBQUFBLGlCQUdzQixNQUFNLENBQUMsSUFIN0I7Z0JBSVEsSUFBQyxDQUFBLFdBQUQsR0FBZTtnQkFDZixzQ0FBTSxNQUFOO0FBQ0E7QUFOUixpQkFPUyxNQUFNLENBQUMsU0FQaEI7QUFBQSxpQkFPMkIsTUFBTSxDQUFDLFVBUGxDO2dCQVFRLElBQUMsQ0FBQSxhQUFELEdBQWlCO2dCQUNqQixJQUFHLElBQUMsQ0FBQSxXQUFKO29CQUNJLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsZ0JBQWdCLENBQUMsR0FBbEIsQ0FBc0IsSUFBQyxDQUFBLGtCQUF2QjtvQkFDcEIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEtBQXBCLENBQUEsRUFGSjtpQkFBQSxNQUFBO29CQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsZ0JBQXpCLENBQWpCO29CQUNmLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxLQUFwQixDQUFBO29CQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBLEVBTko7O0FBT0E7QUFoQlI7UUFrQkEsSUFBVSxNQUFNLENBQUMsRUFBUCxHQUFZLE1BQU0sQ0FBQyxLQUE3QjtBQUFBLG1CQUFBOztRQUVBLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFFZixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsaUJBQWxCO1FBQ2YsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQW5CLENBQUE7UUFFQSxJQUFHLElBQUMsQ0FBQSxhQUFELElBQW1CLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFlBQTFDO1lBRUksSUFBRyxJQUFDLENBQUEsYUFBYSxDQUFDLEVBQWYsS0FBcUIsTUFBTSxDQUFDLFNBQS9CO2dCQUNJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsQ0FBdEMsQ0FBd0QsQ0FBQyxHQUF6RCxDQUE2RCxJQUFDLENBQUEsZ0JBQTlELENBQWpCO2dCQUNmLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsRUFGeEI7YUFBQSxNQUFBO2dCQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxDQUFDLElBQWpDLEVBQXVDLElBQUksTUFBSixDQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZixDQUF2QyxDQUF5RCxDQUFDLEdBQTFELENBQThELElBQUMsQ0FBQSxnQkFBL0QsQ0FBakI7Z0JBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxNQUFNLENBQUMsS0FBN0MsRUFMeEI7YUFGSjs7UUFTQSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFFBQXZCO1lBQ0ksU0FBQSxHQUFZLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBO1lBQ1osS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEIsRUFBcUIsSUFBQyxDQUFBLFFBQXRCLEVBQWdDLFNBQWhDO1lBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxVQUhoQjs7UUFLQSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFlBQXBCLElBQXFDLElBQUMsQ0FBQSxhQUFELEtBQWtCLElBQTFEO1lBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGdCQUFsQjttQkFDZixJQUFDLENBQUEsZ0JBQWdCLENBQUMsS0FBbEIsQ0FBQSxFQUZKOztJQTNDVTs7a0JBcURkLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO0FBR1osWUFBQTtRQUFBLElBQUcsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsSUFBcEIsSUFBNkIsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxDQUFwQztZQUNJLElBQUEsQ0FBSywwQkFBTDtZQUNBLHdDQUFNLE1BQU47QUFDQSxtQkFISjs7UUFLQSxJQUFHLHdCQUFIO0FBRUksbUJBRko7O1FBS0EsSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxZQUF2QjtZQUNJLFVBQUEsR0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWY7WUFDYixJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQXRCLENBQUg7Z0JBQ0ksSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFDLENBQUEsS0FBRCxDQUFBLENBQWpCLENBQXRCLENBQUg7b0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsWUFBeEIsRUFEbkI7aUJBQUEsTUFBQTtvQkFHSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxPQUF4QjtvQkFDZixLQUFLLENBQUMsU0FBTixDQUFnQixVQUFoQixFQUEyQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQTNCLEVBQXNDLElBQXRDLEVBSko7aUJBREo7YUFBQSxNQUFBO2dCQU9JLElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBSDtvQkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxRQUF4QjtvQkFDZixLQUFLLENBQUMsU0FBTixDQUFnQixVQUFoQixFQUEyQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQTNCLEVBQXNDLEdBQXRDLEVBRko7aUJBUEo7YUFGSjtTQUFBLE1BWUssSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWYsQ0FBdEIsQ0FBSDtZQUVELElBQUcsSUFBQyxDQUFBLElBQUo7Z0JBQ0ksSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWYsQ0FBdEIsQ0FBSDtvQkFFSSxJQUFHLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLEtBQVYsQ0FBZ0IsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFoQixDQUFmLENBQXBCLENBQUg7d0JBQ0ksUUFBQSxHQUFXLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxLQUFWLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBZixDQUF2Qjt3QkFDWCxJQUFPLGtCQUFKLElBQWlCLHFCQUFJLFFBQVEsQ0FBRSxVQUFWLENBQUEsV0FBeEI7NEJBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsT0FBeEIsRUFEbkI7eUJBRko7cUJBRko7aUJBQUEsTUFBQTtvQkFPSSxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBZixDQUF2QjtvQkFDWCxJQUFPLGtCQUFKLElBQWlCLHFCQUFJLFFBQVEsQ0FBRSxVQUFWLENBQUEsV0FBeEI7d0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsUUFBeEIsRUFEbkI7cUJBUko7aUJBREo7O1lBWUEsSUFBTyx3QkFBUDtnQkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QjtnQkFDZixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFELENBQUEsRUFGakI7YUFkQztTQUFBLE1Ba0JBLFdBQUcsTUFBTSxDQUFDLEdBQVAsS0FBYyxNQUFNLENBQUMsWUFBckIsSUFBQSxHQUFBLEtBQW1DLE1BQU0sQ0FBQyxJQUE3QztZQUNELElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxRQUFaO2dCQUNJLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLEVBREo7YUFBQSxNQUFBO2dCQUdJLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLEVBQTRCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBNUIsRUFISjthQURDOztRQU1MLElBQUcsd0JBQUg7WUFDSSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsV0FBakI7QUFDQSxtQkFGSjs7UUFJQSxJQUFVLDBCQUFWO0FBQUEsbUJBQUE7O1FBRUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsS0FBbEIsQ0FBQSxDQUFiO1FBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEtBQXJCLENBQUEsQ0FBaEI7UUFFQSxJQUFHLElBQUMsQ0FBQSxJQUFELElBQVMsSUFBQyxDQUFBLElBQVYsSUFBa0IsSUFBQyxDQUFBLFNBQXRCO21CQUNJLElBQUMsQ0FBQSxPQUFELENBQUEsRUFESjtTQUFBLE1BQUE7WUFHSSxJQUFDLENBQUEsT0FBRCxHQUFXO1lBQ1gsSUFBc0IsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsSUFBMUM7Z0JBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxNQUFiOztZQUVBLGdJQUF3RCxDQUFFLDRCQUExRDtnQkFFSSxJQUFBLENBQUssd0RBQUw7dUJBQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUFsQixFQUFpRCxDQUFqRCxFQUhKO2FBTko7O0lBMURZOztrQkEyRWhCLE9BQUEsR0FBUyxTQUFBO0FBRUwsWUFBQTtRQUFBLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFDZixVQUFBLEdBQWEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFmO1FBQ2IsSUFBRyxJQUFDLENBQUEsSUFBRCxJQUFVLENBQUMsSUFBQyxDQUFBLElBQUQsSUFBUyxJQUFDLENBQUEsU0FBWCxDQUFWLElBQ0MsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFmLENBQXRCLENBREo7WUFFUSxJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBQSxJQUNDLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQXRCLENBREo7Z0JBRVEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsWUFBeEI7Z0JBQ2YsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsVUFBaEIsRUFIUjthQUFBLE1BQUE7Z0JBS0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsRUFMbkI7YUFGUjtTQUFBLE1BUUssSUFBRyxJQUFDLENBQUEsSUFBSjtZQUNELElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsVUFBdEIsQ0FBSDtnQkFDSSxJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBSDtvQkFFSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxVQUF4QixFQUZuQjtpQkFBQSxNQUFBO29CQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCLEVBSm5CO2lCQURKO2FBQUEsTUFBQTtnQkFPSSxVQUFBLEdBQWEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCO2dCQUNiLElBQUcsSUFBQyxDQUFBLElBQUQsSUFBVSxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsSUFBekIsRUFBNEIsVUFBNUIsRUFBd0MsVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUF4QyxDQUFiO29CQUNJLFVBQVUsQ0FBQyxLQUFYLENBQUE7b0JBRUEsSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsT0FBRCxDQUFBLENBQWhCLENBQXRCLENBQUg7d0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsVUFBeEIsRUFEbkI7cUJBQUEsTUFBQTt3QkFHSSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBSG5CO3FCQUhKO2lCQUFBLE1BQUE7b0JBUUksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsUUFBeEIsRUFSbkI7aUJBUko7YUFEQztTQUFBLE1Ba0JBLElBQUcsSUFBQyxDQUFBLElBQUQsSUFBUyxJQUFDLENBQUEsU0FBYjtZQUNELElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFmLENBQXRCLENBQUg7Z0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsRUFEbkI7YUFEQzs7UUFLTCxJQUFDLENBQUEsU0FBRCxHQUFhO1FBRWIsSUFBRyxJQUFDLENBQUEsV0FBSjttQkFDSSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsV0FBakIsRUFESjs7SUFyQ0s7O2tCQThDVCxJQUFBLEdBQU0sU0FBQTtRQUNGLElBQUcsSUFBQyxDQUFBLFdBQUo7WUFDSSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUFDLENBQUEsV0FBeEIsQ0FBcEIsRUFESjtTQUFBLE1BQUE7WUFHSSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxnQkFBckIsRUFISjs7UUFJQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFqQixDQUFzQixJQUFDLENBQUEsbUJBQXZCO1FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBbkIsQ0FBdUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGFBQXBCLENBQXZCLEVBQTJELE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUEzRCxFQUErRSxDQUEvRTtlQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQXBCLENBQXdCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBQSxHQUFJLElBQUMsQ0FBQSxjQUFwQixDQUF4QixFQUE2RCxNQUFNLENBQUMsT0FBUCxDQUFlLENBQUMsRUFBaEIsQ0FBN0QsRUFBa0YsQ0FBbEY7SUFQRTs7OztHQXBkUTs7QUE2ZGxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgICAwMDAgICBcblxueyBrbG9nIH0gPSByZXF1aXJlICdreGsnXG5QdXNoYWJsZSAgID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbkFjdGlvbiAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcblRpbWVyICAgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuQnVsbGV0ICAgICA9IHJlcXVpcmUgJy4vYnVsbGV0J1xuUG9zICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblZlY3RvciAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5RdWF0ZXJuaW9uID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcbk1hdGVyaWFsICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBCb3QgZXh0ZW5kcyBQdXNoYWJsZVxuICAgICAgICBcbiAgICBAOiAtPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAZGlyZWN0aW9uICAgICAgICAgICA9IG5ldyBWZWN0b3JcbiAgICAgICAgQG9yaWVudGF0aW9uICAgICAgICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIFxuICAgICAgICBAbGFzdEFjdGlvbkRlbHRhID0gMC4wXG4gICAgICAgICAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgICAgICBcbiAgICAgICAgQG1pbk1vdmVzID0gMTAwXG5cbiAgICAgICAgQG1vdmUgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgID0gbnVsbFxuICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBkaXJfc2duICAgICAgID0gMS4wXG4gICAgICAgIFxuICAgICAgICBzdXBlciBcblxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZPUldBUkQsICAgICAgXCJtb3ZlIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX1VQLCAgICAgXCJjbGltYiB1cFwiICAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX0RPV04sICAgXCJjbGltYiBkb3duXCIgICAgIDUwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fTEVGVCwgICAgXCJ0dXJuIGxlZnRcIiAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fUklHSFQsICAgXCJ0dXJuIHJpZ2h0XCIgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVAsICAgICAgICAgXCJqdW1wXCIgICAgICAgICAgIDEyMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVBfRk9SV0FSRCwgXCJqdW1wIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZBTExfRk9SV0FSRCwgXCJmYWxsIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlNIT09ULCAgICAgICAgXCJzaG9vdFwiICAgICAgICAgIDIwMCBBY3Rpb24uUkVQRUFUXG4gICAgXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLkZBTEwpLmR1cmF0aW9uID0gMTIwXG4gICAgICAgIEBhZGRFdmVudFdpdGhOYW1lIFwiZGllZFwiXG4gICAgXG4gICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLk5PT1ApLCA1MDBcbiAgICAgICAgXG4gICAgY3JlYXRlTWVzaDogLT5cbiAgICAgICAgXG4gICAgICAgIHRpcmVSYWRpdXMgPSAwLjA1XG4gICAgICAgIG5vc2UgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5IDAuNDA0IDAuNSAzMiAxNiB0cnVlXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41IDMyIDMyIDE2ICBNYXRoLlBJXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41IDMyIDMyIDAgMipNYXRoLlBJLCAwIDIuMlxuICAgICAgICBcbiAgICAgICAgbm1hdHIgPSBuZXcgVEhSRUUuTWF0cml4NCgpXG4gICAgICAgIHRyYW5zID0gbmV3IFRIUkVFLlZlY3RvcjMgMCwtMC41NDMsMFxuICAgICAgICByb3QgICA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyIG5ldyBUSFJFRS5FdWxlciBWZWN0b3IuREVHMlJBRCgxODApLCAwIDBcbiAgICAgICAgXG4gICAgICAgIG5tYXRyLmNvbXBvc2UgdHJhbnMsIHJvdCwgbmV3IFRIUkVFLlZlY3RvcjMgMSAxIDFcbiAgICAgICAgZ2VvbS5tZXJnZSBub3NlLCBubWF0clxuICAgICAgICBnZW9tLnJvdGF0ZVggVmVjdG9yLkRFRzJSQUQgLTkwXG4gICAgICAgIGdlb20uc2NhbGUgMC43IDAuNyAwLjdcbiAgICAgICAgICAgXG4gICAgICAgIE11dGFudCA9IHJlcXVpcmUgJy4vbXV0YW50JyAgICAgICAgIFxuICAgICAgICBtdXRhbnQgPSBAIGluc3RhbmNlb2YgTXV0YW50XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnQuY2xvbmUoKSBvciBNYXRlcmlhbC5wbGF5ZXJcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkgMC41LXRpcmVSYWRpdXMsIHRpcmVSYWRpdXMsIDE2IDMyXG4gICAgICAgIGdlb20uc2NhbGUgMSAxIDIuNVxuICAgICAgICB0aXJlTWF0ID0gbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnRUaXJlLmNsb25lKCkgb3IgTWF0ZXJpYWwudGlyZVxuICAgICAgICBAbGVmdFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEBsZWZ0VGlyZS5wb3NpdGlvbi5zZXQgMC4zNSAwIDAgXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAbGVmdFRpcmVcblxuICAgICAgICBAcmlnaHRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAcmlnaHRUaXJlLnBvc2l0aW9uLnNldCAtMC4zNSAwIDAgXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IDAgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgdGlyZU1hdCA9IEBsZWZ0VGlyZS5tYXRlcmlhbFxuICAgICAgICBib3RNYXQgPSBAbWVzaC5tYXRlcmlhbFxuICAgICAgICB0aXJlTWF0LnZpc2libGUgPSBvcGFjaXR5ID4gMFxuICAgICAgICB0aXJlTWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICAgICAgdGlyZU1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbiAgICBnZXREb3duOiAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1lcbiAgICBnZXRVcDogICAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci51bml0WVxuICAgIGdldERpcjogKGRpcj1AZGlyX3NnbikgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBuZXcgVmVjdG9yIDAsMCxkaXJcbiAgXG4gICAgY3VycmVudFBvczogIC0+IEBjdXJyZW50X3Bvc2l0aW9uLmNsb25lKClcbiAgICBjdXJyZW50RGlyOiAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0Wikubm9ybWFsKClcbiAgICBjdXJyZW50VXA6ICAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WSkubm9ybWFsKClcbiAgICBjdXJyZW50TGVmdDogLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WCkubm9ybWFsKClcblxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBkaWU6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICAgICBAbW92ZSAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgPSBmYWxzZVxuICAgIFxuICAgICAgICBAZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBAZGllZCAgPSB0cnVlXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICByZXNldDogKCkgLT5cbiAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgXG4gICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICBAb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgQG1vdmUgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgID0gZmFsc2VcbiAgICBcbiAgICBpc0ZhbGxpbmc6IC0+IEBtb3ZlX2FjdGlvbiBhbmQgQG1vdmVfYWN0aW9uLmlkID09IEFjdGlvbi5GQUxMXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIG5ld1BvcyA9IG5ldyBQb3MgQHBvc2l0aW9uIFxuICAgICAgICAjIGtsb2cgXCJpbml0QWN0aW9uICN7YWN0aW9uLm5hbWV9IHBvc1wiLCBuZXdQb3NcbiAgICAgICAgIyBrbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QICAgICAgICAgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkQgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVAgICAgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldERvd24oKS5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgbmV3UG9zLmFkZCBAZ2V0RG93bigpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG5vdCBuZXdQb3MuZXFsIG5ldyBQb3MgQHBvc2l0aW9uXG4gICAgICAgICAgICAjIGtsb2cgJ2JvdC5pbml0QWN0aW9uIG9iamVjdFdpbGxNb3ZlVG9Qb3M6JywgbmV3UG9zXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIEAsIG5ld1BvcywgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMCAgICAgMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVsVGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKCkgICMgfiBAY3VycmVudCAvIEBnZXREdXJhdGlvbigpIFxuICAgICAgICBkbHRUaW1lICA9IGFjdGlvbi5nZXRSZWxhdGl2ZURlbHRhKCkgIyAoQGN1cnJlbnQtQGxhc3QpIC8gQGdldER1cmF0aW9uKClcbiAgICBcbiAgICAgICAgQGxhc3RBY3Rpb25EZWx0YSA9IGRsdFRpbWVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uYXRTdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogZGx0VGltZSlcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYykgXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGtsb2cgJ3N0aWxsIG5lZWRlZD8nXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lIDw9IDAuMlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwgKHJlbFRpbWUvMC4yKS8yXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVsVGltZSA+PSAwLjgpXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpLm11bCAwLjUrKHJlbFRpbWUtMC44KS8wLjIvMlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIChyZWxUaW1lLTAuMikvMC42ICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIHJvdFZlYyA9IChAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbikucm90YXRlIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzKEBnZXREb3duKCkpLnBsdXMocm90VmVjKS5tdWwgMC41XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uVFVSTl9MRUZUXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uID09IG51bGwgYW5kIGFjdGlvbi5hdFN0YXJ0KCkgIyBpZiBub3QgcGVyZm9ybWluZyBtb3ZlIGFjdGlvbiBhbmQgc3RhcnQgb2Ygcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB1cGRhdGUgQG9yaWVudGF0aW9uIG5vdywgc28gbmV4dCBtb3ZlIGFjdGlvbiB3aWxsIG1vdmUgaW4gZGVzaXJlZCBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgIFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAtZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIDkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAgZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGZpbmlzaEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICBcbiAgICAgICAgIyBrbG9nIFwiQm90LmZpbmlzaEFjdGlvbiAje2FjdGlvbi5pZH0gI3thY3Rpb24ubmFtZX1cIiBpZiBhY3Rpb24ubmFtZSAhPSAnbm9vcCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCwgQWN0aW9uLlNIT09UXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5QVVNILCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFRcbiAgICAgICAgICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gIyBib3QgY3VycmVudGx5IHBlcmZvcm1pbmcgYSBtb3ZlIGFjdGlvbiAtPiBzdG9yZSByb3RhdGlvbiBpbiBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IEByZXN0X29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBtYXRyaXhcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIGFjdGlvbi5pZCA+IEFjdGlvbi5TSE9PVFxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24gIyB1cGRhdGUgY2xpbWIgQG9yaWVudGF0aW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcm90YXRlX2FjdGlvbiBhbmQgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgIyBib3QgaXMgY3VycmVudGx5IHBlcmZvcm1pbmcgYSByb3RhdGlvbiAtPlxuICAgICAgICAgICAgIyB0YWtlIG92ZXIgcmVzdWx0IG9mIHJvdGF0aW9uIHRvIHByZXZlbnQgc2xpZGluZ1xuICAgICAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3Rvcig5MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvcigtOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICB0YXJnZXRQb3MgPSBAY3VycmVudF9wb3NpdGlvbi5yb3VuZCgpXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RNb3ZlZCBALCBAcG9zaXRpb24sIHRhcmdldFBvcyAjIHVwZGF0ZSB3b3JsZCBAcG9zaXRpb25cbiAgICAgICAgICAgIEBwb3NpdGlvbiA9IHRhcmdldFBvc1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgYW5kIEByb3RhdGVfYWN0aW9uID09IG51bGwgIyBpZiBub3QganVtcGluZyBmb3J3YXJkXG4gICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIEBvcmllbnRhdGlvblxuICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAje2FjdGlvbi5uYW1lfSAje2FjdGlvbi5pZH1cIlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSCBhbmQgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgIGtsb2cgJ3N1cGVyIChQdXNoYWJsZSkgYWN0aW9uISdcbiAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj8gIyBhY3Rpb24gd2FzIG5vdCBhIG1vdmUgYWN0aW9uIC0+IHJldHVyblxuICAgICAgICAgICAgIyBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgd2FzIG5vdCBhIG1vdmUgYWN0aW9uISdcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgZmluZCBuZXh0IGFjdGlvbiBkZXBlbmRpbmcgb24gdHlwZSBvZiBmaW5pc2hlZCBhY3Rpb24gYW5kIHN1cnJvdW5kaW5nIGVudmlyb25tZW50XG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLm1pbnVzIEBnZXRVcCgpICMgYmVsb3cgZm9yd2FyZCB3aWxsIGFsc28gYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnIEBnZXRQb3MoKSwgMC4yNSBcbiAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIHdpbGwgbm90IGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5taW51cyBAZ2V0VXAoKSAgIyBiZWxvdyBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJyBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIGJlbG93IGVtcHR5Jywgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpLCBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICBpZiBAbW92ZSAjIHN0aWNreSBpZiBtb3ZpbmdcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpICAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uP1xuICAgICAgICAgICAgICAgIFxuICAgICAgICBAc2V0UG9zaXRpb24gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICBAc2V0T3JpZW50YXRpb24gQGN1cnJlbnRfb3JpZW50YXRpb24ucm91bmQoKVxuXG4gICAgICAgIGlmIEBtb3ZlIG9yIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIEBtb3ZlQm90KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpcl9zZ24gPSAxXG4gICAgICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5OT09QXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdvcmxkLmdldFJlYWxPY2N1cGFudEF0UG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpPy5pc011dGFudD8oKVxuICAgICAgICAgICAgICAgICMga2VlcCBhY3Rpb24gY2hhaW4gZmxvd2luZyBpbiBvcmRlciB0byBkZXRlY3QgZW52aXJvbm1lbnQgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBtdXRhbnQgYmVsb3c6IHN0YXJ0VGltZWRBY3Rpb24gTk9PUCdcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgMFxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cblxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIGZvcndhcmRQb3MgPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgaWYgQG1vdmUgYW5kIChAanVtcCBvciBAanVtcF9vbmNlKSBhbmQgICAgIyBqdW1wIG1vZGUgb3IganVtcCBhY3RpdmF0ZWQgd2hpbGUgbW92aW5nXG4gICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkpICAjIGFuZCBhYm92ZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcykgICMgZm9yd2FyZCBhbmQgYWJvdmUgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0pVTVAnXG4gICAgICAgICAgICAgICAgZWxzZSAjIG5vIHNwYWNlIHRvIGp1bXAgZm9yd2FyZCAtPiBqdW1wIHVwXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICBcbiAgICAgICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgaWYgQHRha2VuT2Zmc2V0XG4gICAgICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uLnBsdXMgQHRha2VuT2Zmc2V0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBtZXNoLnBvc2l0aW9uLmNvcHkgQGN1cnJlbnRfcG9zaXRpb25cbiAgICAgICAgQG1lc2gucXVhdGVybmlvbi5jb3B5IEBjdXJyZW50X29yaWVudGF0aW9uXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkBsZWZ0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAcmlnaHRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCgtOTApLCAwXG5cbm1vZHVsZS5leHBvcnRzID0gQm90XG4iXX0=
//# sourceURL=../coffee/bot.coffee