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
        this.mesh.position.copy(this.current_position);
        this.mesh.quaternion.copy(this.current_orientation);
        this.leftTire.rotation.set(Vector.DEG2RAD(180 * this.left_tire_rot), Vector.DEG2RAD(90), 0);
        return this.rightTire.rotation.set(Vector.DEG2RAD(180 * this.right_tire_rot), Vector.DEG2RAD(-90), 0);
    };

    return Bot;

})(Pushable);

module.exports = Bot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUVqQixJQUFDLENBQUEsT0FBRCxHQUFpQjtRQUVqQixzQ0FBQSxTQUFBO1FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQW1DLGNBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsUUFBckIsRUFBbUMsVUFBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxVQUFyQixFQUFtQyxZQUFuQyxFQUFvRCxHQUFwRCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLFNBQXJCLEVBQW1DLFdBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsVUFBckIsRUFBbUMsWUFBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxJQUFyQixFQUFtQyxNQUFuQyxFQUFvRCxHQUFwRCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLFlBQXJCLEVBQW1DLGNBQW5DLEVBQW9ELEdBQXBELENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsWUFBckIsRUFBbUMsY0FBbkMsRUFBb0QsR0FBcEQsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxLQUFyQixFQUFtQyxPQUFuQyxFQUFvRCxHQUFwRCxFQUF3RCxNQUFNLENBQUMsTUFBL0QsQ0FBWDtRQUVBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUE2QixDQUFDLFFBQTlCLEdBQXlDO1FBQ3pDLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixNQUFsQjtRQUVBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBbEIsRUFBaUQsR0FBakQ7SUEzQ0Q7O2tCQTZDSCxVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxVQUFBLEdBQWE7UUFDYixJQUFBLEdBQU8sSUFBSSxLQUFLLENBQUMsWUFBVixDQUF1QixLQUF2QixFQUE4QixHQUE5QixFQUFtQyxFQUFuQyxFQUF1QyxFQUF2QyxFQUEyQyxJQUEzQztRQUNQLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCLEdBQXpCLEVBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDLEVBQXRDLEVBQTBDLElBQUksQ0FBQyxFQUEvQztRQUNQLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCLEdBQXpCLEVBQThCLEVBQTlCLEVBQWtDLEVBQWxDLEVBQXNDLENBQXRDLEVBQXlDLENBQUEsR0FBRSxJQUFJLENBQUMsRUFBaEQsRUFBb0QsQ0FBcEQsRUFBdUQsR0FBdkQ7UUFFUCxLQUFBLEdBQVEsSUFBSSxLQUFLLENBQUMsT0FBVixDQUFBO1FBQ1IsS0FBQSxHQUFRLElBQUksS0FBSyxDQUFDLE9BQVYsQ0FBa0IsQ0FBbEIsRUFBb0IsQ0FBQyxLQUFyQixFQUEyQixDQUEzQjtRQUNSLEdBQUEsR0FBUSxJQUFJLEtBQUssQ0FBQyxVQUFWLENBQUEsQ0FBc0IsQ0FBQyxZQUF2QixDQUFvQyxJQUFJLEtBQUssQ0FBQyxLQUFWLENBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBZixDQUFoQixFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxDQUFwQztRQUVSLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBZCxFQUFxQixHQUFyQixFQUEwQixJQUFJLEtBQUssQ0FBQyxPQUFWLENBQWtCLENBQWxCLEVBQW9CLENBQXBCLEVBQXNCLENBQXRCLENBQTFCO1FBQ0EsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLEtBQWpCO1FBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFlLENBQUMsRUFBaEIsQ0FBYjtRQUNBLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQjtRQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjtRQUNULE1BQUEsR0FBUyxJQUFBLFlBQWE7UUFDdEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixNQUFBLElBQVcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixDQUFBLENBQVgsSUFBc0MsUUFBUSxDQUFDLE1BQXBFO1FBRVIsSUFBQSxHQUFPLElBQUksS0FBSyxDQUFDLGFBQVYsQ0FBd0IsR0FBQSxHQUFJLFVBQTVCLEVBQXdDLFVBQXhDLEVBQW9ELEVBQXBELEVBQXdELEVBQXhEO1FBQ1AsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLEdBQWY7UUFDQSxPQUFBLEdBQVUsTUFBQSxJQUFXLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBcEIsQ0FBQSxDQUFYLElBQTBDLFFBQVEsQ0FBQztRQUM3RCxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCO1FBQ1osSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBbkIsQ0FBdUIsSUFBdkIsRUFBNEIsQ0FBNUIsRUFBOEIsQ0FBOUI7UUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFuQixDQUF1QixDQUF2QixFQUEwQixNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBMUIsRUFBOEMsQ0FBOUM7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsUUFBWDtRQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsT0FBckI7UUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFwQixDQUF3QixDQUFDLElBQXpCLEVBQThCLENBQTlCLEVBQWdDLENBQWhDO1FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsQ0FBeEIsRUFBMkIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLEVBQWhCLENBQTNCLEVBQWdELENBQWhEO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLFNBQVg7UUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFYLEdBQXdCLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixHQUF1QjtlQUNsRSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxhQUFWLEdBQTBCLElBQUMsQ0FBQSxTQUFTLENBQUMsYUFBWCxHQUEyQjtJQWxDbkU7O2tCQW9DWixVQUFBLEdBQVksU0FBQyxPQUFEO0FBQ1IsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsUUFBUSxDQUFDO1FBQ3BCLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDO1FBQ2YsT0FBTyxDQUFDLE9BQVIsR0FBa0IsT0FBQSxHQUFVO1FBQzVCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQUEsR0FBVTtRQUMvQixNQUFNLENBQUMsVUFBUCxHQUFvQixPQUFBLEdBQVU7UUFDOUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7ZUFDakIsT0FBTyxDQUFDLE9BQVIsR0FBa0I7SUFQVjs7a0JBZVosT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBb0IsTUFBTSxDQUFDLE1BQTNCO0lBQUg7O2tCQUNULEtBQUEsR0FBUyxTQUFBO2VBQUcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLE1BQU0sQ0FBQyxLQUEzQjtJQUFIOztrQkFDVCxNQUFBLEdBQVEsU0FBQyxHQUFEOztZQUFDLE1BQUksSUFBQyxDQUFBOztlQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLEdBQWYsQ0FBcEI7SUFBbEI7O2tCQUVSLFVBQUEsR0FBYSxTQUFBO2VBQUcsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEtBQWxCLENBQUE7SUFBSDs7a0JBQ2IsVUFBQSxHQUFhLFNBQUE7ZUFBRyxJQUFDLENBQUEsbUJBQW1CLENBQUMsTUFBckIsQ0FBNEIsTUFBTSxDQUFDLEtBQW5DLENBQXlDLENBQUMsTUFBMUMsQ0FBQTtJQUFIOztrQkFDYixTQUFBLEdBQWEsU0FBQTtlQUFHLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxNQUFyQixDQUE0QixNQUFNLENBQUMsS0FBbkMsQ0FBeUMsQ0FBQyxNQUExQyxDQUFBO0lBQUg7O2tCQUNiLFdBQUEsR0FBYSxTQUFBO2VBQUcsSUFBQyxDQUFBLG1CQUFtQixDQUFDLE1BQXJCLENBQTRCLE1BQU0sQ0FBQyxLQUFuQyxDQUF5QyxDQUFDLE1BQTFDLENBQUE7SUFBSDs7a0JBUWIsR0FBQSxHQUFLLFNBQUE7UUFDRCxLQUFLLENBQUMscUJBQU4sQ0FBNEIsSUFBNUI7UUFFQSxJQUFDLENBQUEsSUFBRCxHQUFTO1FBQ1QsSUFBQyxDQUFBLElBQUQsR0FBUztRQUNULElBQUMsQ0FBQSxLQUFELEdBQVM7UUFDVCxJQUFDLENBQUEsSUFBRCxHQUFTO1FBRVQsSUFBQyxDQUFBLGdCQUFELENBQWtCLE1BQWxCLENBQXlCLENBQUMsY0FBMUIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELEdBQVM7SUFUUjs7a0JBaUJMLEtBQUEsR0FBTyxTQUFBO1FBRUgsSUFBQyxDQUFBLGFBQUQsR0FBbUI7UUFDbkIsSUFBQyxDQUFBLGNBQUQsR0FBbUI7UUFFbkIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUE7UUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsQ0FBQTtRQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxLQUFyQixDQUFBO1FBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEtBQXBCLENBQUE7UUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsS0FBbkIsQ0FBQTtRQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBO1FBRUEsSUFBQyxDQUFBLFdBQUQsR0FBZTtRQUNmLElBQUMsQ0FBQSxJQUFELEdBQWU7UUFDZixJQUFDLENBQUEsSUFBRCxHQUFlO1FBQ2YsSUFBQyxDQUFBLElBQUQsR0FBZTtRQUNmLElBQUMsQ0FBQSxLQUFELEdBQWU7UUFDZixJQUFDLENBQUEsU0FBRCxHQUFlO2VBQ2YsSUFBQyxDQUFBLElBQUQsR0FBZTtJQWxCWjs7a0JBb0JQLFNBQUEsR0FBVyxTQUFBO2VBQUcsSUFBQyxDQUFBLFdBQUQsSUFBaUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLEtBQW1CLE1BQU0sQ0FBQztJQUE5Qzs7a0JBUVgsVUFBQSxHQUFZLFNBQUMsTUFBRDtBQUNSLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxHQUFKLENBQVEsSUFBQyxDQUFBLFFBQVQ7QUFJVCxnQkFBTyxNQUFNLENBQUMsRUFBZDtBQUFBLGlCQUNTLE1BQU0sQ0FBQyxJQURoQjtBQUNrQztBQURsQyxpQkFFUyxNQUFNLENBQUMsT0FGaEI7Z0JBRWtDLE1BQU0sQ0FBQyxHQUFQLENBQVcsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFYO0FBQXpCO0FBRlQsaUJBR1MsTUFBTSxDQUFDLFVBSGhCO2dCQUdrQyxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWYsQ0FBWDtBQUF6QjtBQUhULGlCQUlTLE1BQU0sQ0FBQyxJQUpoQjtnQkFJa0MsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVg7QUFBekI7QUFKVCxpQkFLUyxNQUFNLENBQUMsWUFMaEI7Z0JBS2tDLE1BQU0sQ0FBQyxHQUFQLENBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFRLENBQUMsSUFBVCxDQUFjLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBZCxDQUFYO0FBQXpCO0FBTFQsaUJBTVMsTUFBTSxDQUFDLFlBTmhCO2dCQU1rQyxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFoQixDQUFYO0FBQXpCO0FBTlQsaUJBT1MsTUFBTSxDQUFDLElBUGhCO2dCQVFRLElBQUcsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxDQUFQO29CQUNJLG9DQUFNLE1BQU47QUFDQSwyQkFGSjs7Z0JBR0EsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVg7QUFKQztBQVBUO2dCQWFRLG9DQUFNLE1BQU47QUFDQTtBQWRSO1FBZ0JBLElBQUcsQ0FBSSxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUksR0FBSixDQUFRLElBQUMsQ0FBQSxRQUFULENBQVgsQ0FBUDttQkFFSSxLQUFLLENBQUMsbUJBQU4sQ0FBMEIsSUFBMUIsRUFBNkIsTUFBN0IsRUFBcUMsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUFyQyxFQUZKOztJQXJCUTs7a0JBK0JaLGFBQUEsR0FBZSxTQUFDLE1BQUQ7QUFFWCxZQUFBO1FBQUEsT0FBQSxHQUFXLE1BQU0sQ0FBQyxlQUFQLENBQUE7UUFDWCxPQUFBLEdBQVcsTUFBTSxDQUFDLGdCQUFQLENBQUE7UUFFWCxJQUFDLENBQUEsZUFBRCxHQUFtQjtRQUVuQixNQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsRUFBTCxHQUFRLENBQVIsR0FBWSxJQUFJLENBQUMsRUFBTCxHQUFRLENBQVIsR0FBWSxPQUFqQztRQUNULE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxFQUFMLEdBQVEsQ0FBUixHQUFZLE9BQXJCO0FBRVQsZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsS0FEaEI7Z0JBRVEsSUFBRyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUg7b0JBQ0ksTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFESjs7QUFEQztBQURULGlCQUtTLE1BQU0sQ0FBQyxJQUxoQjtBQUswQjtBQUwxQixpQkFPUyxNQUFNLENBQUMsT0FQaEI7Z0JBU1EsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFFOUIsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLEdBQVYsQ0FBYyxPQUFkLENBQWY7QUFDcEI7QUFiUixpQkFlUyxNQUFNLENBQUMsSUFmaEI7Z0JBaUJRLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQVEsQ0FBQyxHQUFULENBQWEsTUFBYixDQUFmO0FBQ3BCO0FBbEJSLGlCQW9CUyxNQUFNLENBQUMsWUFwQmhCO2dCQXNCUSxJQUFDLENBQUEsYUFBRCxJQUFtQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsRUFBTCxHQUFRLENBQVIsR0FBWSxPQUFyQjtnQkFDdkIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEVBQUwsR0FBUSxDQUFSLEdBQVksT0FBckI7Z0JBQ3ZCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxHQUFWLENBQWMsT0FBZCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUSxDQUFDLEdBQVQsQ0FBYSxNQUFiLENBQTVCLENBQWY7QUFDcEI7QUF6QlIsaUJBMkJTLE1BQU0sQ0FBQyxZQTNCaEI7Z0JBNkJRLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxHQUFWLENBQWMsT0FBZCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQTVCLENBQWY7QUFDcEI7QUE5QlIsaUJBZ0NTLE1BQU0sQ0FBQyxJQWhDaEI7Z0JBa0NRLElBQUcsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxDQUFQO29CQUNJLHVDQUFNLE1BQU47QUFDQSwyQkFGSjs7Z0JBR0EsSUFBQSxDQUFLLGVBQUw7Z0JBQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQWY7QUFDcEI7QUF2Q1IsaUJBeUNTLE1BQU0sQ0FBQyxRQXpDaEI7Z0JBMkNRLElBQUMsQ0FBQSxhQUFELElBQW1CLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxHQUFtQjtnQkFDdEMsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLEdBQW1CO2dCQUN0QyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsVUFBVSxDQUFDLG9CQUFYLENBQWdDLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxHQUFxQixDQUFDLElBQXRELEVBQTRELE1BQU0sQ0FBQyxLQUFuRTtBQUNyQjtBQTlDUixpQkFnRFMsTUFBTSxDQUFDLFVBaERoQjtnQkFrRFEsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBQyxDQUFBLGNBQUQsSUFBbUIsSUFBQyxDQUFBLE9BQUQsR0FBVztnQkFDOUIsSUFBRyxPQUFBLElBQVcsR0FBZDtvQkFDSSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsR0FBVixDQUFjLENBQUMsT0FBQSxHQUFRLEdBQVQsQ0FBQSxHQUFjLENBQTVCLENBQWYsRUFEeEI7aUJBQUEsTUFFSyxJQUFJLE9BQUEsSUFBVyxHQUFmO29CQUNELElBQUMsQ0FBQSxpQkFBRCxHQUFxQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUEzQyxFQUFpRCxNQUFNLENBQUMsS0FBeEQ7b0JBQ3JCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsR0FBWCxDQUFlLEdBQUEsR0FBSSxDQUFDLE9BQUEsR0FBUSxHQUFULENBQUEsR0FBYyxHQUFkLEdBQWtCLENBQXJDLENBQWYsQ0FBZixFQUZuQjtpQkFBQSxNQUFBO29CQUlELElBQUMsQ0FBQSxpQkFBRCxHQUFxQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLE9BQUEsR0FBUSxHQUFULENBQVgsR0FBeUIsR0FBekIsR0FBK0IsSUFBL0QsRUFBcUUsTUFBTSxDQUFDLEtBQTVFO29CQUNyQixNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGlCQUFsQixDQUFELENBQXFDLENBQUMsTUFBdEMsQ0FBNkMsTUFBTSxDQUFDLEtBQXBEO29CQUNULElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFmLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsTUFBaEMsQ0FBdUMsQ0FBQyxHQUF4QyxDQUE0QyxHQUE1QyxDQUFmLEVBTm5COztBQU9MO0FBN0RSLGlCQStEUyxNQUFNLENBQUMsVUEvRGhCO0FBQUEsaUJBK0Q0QixNQUFNLENBQUMsU0EvRG5DO2dCQWlFUSxJQUFHLElBQUMsQ0FBQSxXQUFELEtBQWdCLElBQWhCLElBQXlCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBNUI7b0JBRUksSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxTQUF2Qjt3QkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsSUFBaEMsRUFBc0MsTUFBTSxDQUFDLEtBQTdDLENBQWpCO3dCQUNmLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsRUFGeEI7cUJBQUEsTUFBQTt3QkFJSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsQ0FBakI7d0JBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxNQUFNLENBQUMsS0FBN0MsRUFMeEI7cUJBRko7O2dCQVNBLElBQUcsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsU0FBdkI7b0JBQ0ksSUFBQyxDQUFBLGFBQUQsSUFBbUIsQ0FBQztvQkFDcEIsSUFBQyxDQUFBLGNBQUQsSUFBb0I7b0JBQ3BCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsT0FBQSxHQUFVLElBQTFDLEVBQWdELE1BQU0sQ0FBQyxLQUF2RCxFQUgxQjtpQkFBQSxNQUFBO29CQUtJLElBQUMsQ0FBQSxhQUFELElBQW9CO29CQUNwQixJQUFDLENBQUEsY0FBRCxJQUFtQixDQUFDO29CQUNwQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsVUFBVSxDQUFDLG9CQUFYLENBQWdDLE9BQUEsR0FBVSxDQUFDLElBQTNDLEVBQWlELE1BQU0sQ0FBQyxLQUF4RCxFQVAxQjs7QUFRQTtBQWxGUjtnQkFzRlEsdUNBQU0sTUFBTjtBQUNBO0FBdkZSO2VBeUZBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQW5CLENBQXVCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsZ0JBQXpCLENBQXZCLENBQWpCO0lBbkdaOztrQkEyR2YsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUlWLFlBQUE7QUFBQSxnQkFBTyxNQUFNLENBQUMsRUFBZDtBQUFBLGlCQUNTLE1BQU0sQ0FBQyxJQURoQjtBQUFBLGlCQUNzQixNQUFNLENBQUMsS0FEN0I7QUFFUTtBQUZSLGlCQUdTLE1BQU0sQ0FBQyxJQUhoQjtBQUFBLGlCQUdzQixNQUFNLENBQUMsSUFIN0I7Z0JBSVEsSUFBQyxDQUFBLFdBQUQsR0FBZTtnQkFDZixzQ0FBTSxNQUFOO0FBQ0E7QUFOUixpQkFPUyxNQUFNLENBQUMsU0FQaEI7QUFBQSxpQkFPMkIsTUFBTSxDQUFDLFVBUGxDO2dCQVFRLElBQUMsQ0FBQSxhQUFELEdBQWlCO2dCQUNqQixJQUFHLElBQUMsQ0FBQSxXQUFKO29CQUNJLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsZ0JBQWdCLENBQUMsR0FBbEIsQ0FBc0IsSUFBQyxDQUFBLGtCQUF2QjtvQkFDcEIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEtBQXBCLENBQUEsRUFGSjtpQkFBQSxNQUFBO29CQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsZ0JBQXpCLENBQWpCO29CQUNmLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxLQUFwQixDQUFBO29CQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBLEVBTko7O0FBT0E7QUFoQlI7UUFrQkEsSUFBVSxNQUFNLENBQUMsRUFBUCxHQUFZLE1BQU0sQ0FBQyxLQUE3QjtBQUFBLG1CQUFBOztRQUVBLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFFZixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsaUJBQWxCO1FBQ2YsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQW5CLENBQUE7UUFFQSxJQUFHLElBQUMsQ0FBQSxhQUFELElBQW1CLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFlBQTFDO1lBRUksSUFBRyxJQUFDLENBQUEsYUFBYSxDQUFDLEVBQWYsS0FBcUIsTUFBTSxDQUFDLFNBQS9CO2dCQUNJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsQ0FBdEMsQ0FBd0QsQ0FBQyxHQUF6RCxDQUE2RCxJQUFDLENBQUEsZ0JBQTlELENBQWpCO2dCQUNmLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQyxJQUFqQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsRUFGeEI7YUFBQSxNQUFBO2dCQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxDQUFDLElBQWpDLEVBQXVDLElBQUksTUFBSixDQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZixDQUF2QyxDQUF5RCxDQUFDLEdBQTFELENBQThELElBQUMsQ0FBQSxnQkFBL0QsQ0FBakI7Z0JBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxJQUFoQyxFQUFzQyxNQUFNLENBQUMsS0FBN0MsRUFMeEI7YUFGSjs7UUFTQSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFFBQXZCO1lBQ0ksU0FBQSxHQUFZLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBO1lBQ1osS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEIsRUFBcUIsSUFBQyxDQUFBLFFBQXRCLEVBQWdDLFNBQWhDO1lBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxVQUhoQjs7UUFLQSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLFlBQXBCLElBQXFDLElBQUMsQ0FBQSxhQUFELEtBQWtCLElBQTFEO1lBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGdCQUFsQjttQkFDZixJQUFDLENBQUEsZ0JBQWdCLENBQUMsS0FBbEIsQ0FBQSxFQUZKOztJQTNDVTs7a0JBcURkLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO0FBR1osWUFBQTtRQUFBLElBQUcsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsSUFBcEIsSUFBNkIsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBQSxDQUFwQztZQUNJLElBQUEsQ0FBSywwQkFBTDtZQUNBLHdDQUFNLE1BQU47QUFDQSxtQkFISjs7UUFLQSxJQUFHLHdCQUFIO0FBRUksbUJBRko7O1FBS0EsSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxZQUF2QjtZQUNJLFVBQUEsR0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWY7WUFDYixJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQXRCLENBQUg7Z0JBQ0ksSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFDLENBQUEsS0FBRCxDQUFBLENBQWpCLENBQXRCLENBQUg7b0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsWUFBeEIsRUFEbkI7aUJBQUEsTUFBQTtvQkFHSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxPQUF4QjtvQkFDZixLQUFLLENBQUMsU0FBTixDQUFnQixVQUFoQixFQUEyQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQTNCLEVBQXNDLElBQXRDLEVBSko7aUJBREo7YUFBQSxNQUFBO2dCQU9JLElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBSDtvQkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxRQUF4QjtvQkFDZixLQUFLLENBQUMsU0FBTixDQUFnQixVQUFoQixFQUEyQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQTNCLEVBQXNDLEdBQXRDLEVBRko7aUJBUEo7YUFGSjtTQUFBLE1BWUssSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWYsQ0FBdEIsQ0FBSDtZQUVELElBQUcsSUFBQyxDQUFBLElBQUo7Z0JBQ0ksSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWYsQ0FBdEIsQ0FBSDtvQkFFSSxJQUFHLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLEtBQVYsQ0FBZ0IsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFoQixDQUFmLENBQXBCLENBQUg7d0JBQ0ksUUFBQSxHQUFXLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxLQUFWLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBZixDQUF2Qjt3QkFDWCxJQUFPLGtCQUFKLElBQWlCLHFCQUFJLFFBQVEsQ0FBRSxVQUFWLENBQUEsV0FBeEI7NEJBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsT0FBeEIsRUFEbkI7eUJBRko7cUJBRko7aUJBQUEsTUFBQTtvQkFPSSxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBZixDQUF2QjtvQkFDWCxJQUFPLGtCQUFKLElBQWlCLHFCQUFJLFFBQVEsQ0FBRSxVQUFWLENBQUEsV0FBeEI7d0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsUUFBeEIsRUFEbkI7cUJBUko7aUJBREo7O1lBWUEsSUFBTyx3QkFBUDtnQkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QjtnQkFDZixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFELENBQUEsRUFGakI7YUFkQztTQUFBLE1Ba0JBLFdBQUcsTUFBTSxDQUFDLEdBQVAsS0FBYyxNQUFNLENBQUMsWUFBckIsSUFBQSxHQUFBLEtBQW1DLE1BQU0sQ0FBQyxJQUE3QztZQUNELElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxRQUFaO2dCQUNJLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLEVBREo7YUFBQSxNQUFBO2dCQUdJLEtBQUssQ0FBQyxTQUFOLENBQWdCLFVBQWhCLEVBQTRCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBNUIsRUFISjthQURDOztRQU1MLElBQUcsd0JBQUg7WUFDSSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsV0FBakI7QUFDQSxtQkFGSjs7UUFJQSxJQUFVLDBCQUFWO0FBQUEsbUJBQUE7O1FBRUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsS0FBbEIsQ0FBQSxDQUFiO1FBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEtBQXJCLENBQUEsQ0FBaEI7UUFFQSxJQUFHLElBQUMsQ0FBQSxJQUFELElBQVMsSUFBQyxDQUFBLElBQVYsSUFBa0IsSUFBQyxDQUFBLFNBQXRCO21CQUVJLElBQUMsQ0FBQSxPQUFELENBQUEsRUFGSjtTQUFBLE1BQUE7WUFJSSxJQUFDLENBQUEsT0FBRCxHQUFXO1lBQ1gsSUFBc0IsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsSUFBMUM7Z0JBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxNQUFiOztZQUlBLGdJQUF3RCxDQUFFLDRCQUExRDtnQkFFSSxJQUFBLENBQUssd0RBQUw7dUJBQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUFsQixFQUFpRCxDQUFqRCxFQUhKO2FBVEo7O0lBMURZOztrQkE4RWhCLE9BQUEsR0FBUyxTQUFBO0FBRUwsWUFBQTtRQUFBLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFDZixVQUFBLEdBQWEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFmO1FBQ2IsSUFBRyxJQUFDLENBQUEsSUFBRCxJQUFVLENBQUMsSUFBQyxDQUFBLElBQUQsSUFBUyxJQUFDLENBQUEsU0FBWCxDQUFWLElBRUMsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFmLENBQXRCLENBRko7WUFHUSxJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBQSxJQUNDLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQXRCLENBREo7Z0JBRVEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsWUFBeEI7Z0JBQ2YsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsVUFBaEIsRUFIUjthQUFBLE1BQUE7Z0JBS0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsRUFMbkI7YUFIUjtTQUFBLE1BU0ssSUFBRyxJQUFDLENBQUEsSUFBSjtZQUNELElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsVUFBdEIsQ0FBSDtnQkFDSSxJQUFHLEtBQUssQ0FBQyxlQUFOLENBQXNCLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBaEIsQ0FBdEIsQ0FBSDtvQkFFSSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxVQUF4QixFQUZuQjtpQkFBQSxNQUFBO29CQUlJLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCLEVBSm5CO2lCQURKO2FBQUEsTUFBQTtnQkFPSSxVQUFBLEdBQWEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCO2dCQUNiLElBQUcsSUFBQyxDQUFBLElBQUQsSUFBVSxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsSUFBekIsRUFBNEIsVUFBNUIsRUFBd0MsVUFBVSxDQUFDLFdBQVgsQ0FBQSxDQUF4QyxDQUFiO29CQUNJLFVBQVUsQ0FBQyxLQUFYLENBQUE7b0JBRUEsSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsT0FBRCxDQUFBLENBQWhCLENBQXRCLENBQUg7d0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsVUFBeEIsRUFEbkI7cUJBQUEsTUFBQTt3QkFHSSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBSG5CO3FCQUhKO2lCQUFBLE1BQUE7b0JBUUksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsUUFBeEIsRUFSbkI7aUJBUko7YUFEQztTQUFBLE1Ba0JBLElBQUcsSUFBQyxDQUFBLElBQUQsSUFBUyxJQUFDLENBQUEsU0FBYjtZQUNELElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFmLENBQXRCLENBQUg7Z0JBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsRUFEbkI7YUFEQzs7UUFLTCxJQUFDLENBQUEsU0FBRCxHQUFhO1FBRWIsSUFBRyxJQUFDLENBQUEsV0FBSjttQkFDSSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsV0FBakIsRUFESjs7SUF0Q0s7O2tCQStDVCxJQUFBLEdBQU0sU0FBQTtRQUNGLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGdCQUFyQjtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWpCLENBQXNCLElBQUMsQ0FBQSxtQkFBdkI7UUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFuQixDQUF1QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsYUFBcEIsQ0FBdkIsRUFBMkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQTNELEVBQStFLENBQS9FO2VBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBcEIsQ0FBd0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxHQUFBLEdBQUksSUFBQyxDQUFBLGNBQXBCLENBQXhCLEVBQTZELE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBQyxFQUFoQixDQUE3RCxFQUFrRixDQUFsRjtJQUpFOzs7O0dBMWRROztBQWdlbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuXG57IGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblB1c2hhYmxlICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgICAgICA9IHJlcXVpcmUgJy4vdGltZXInXG5CdWxsZXQgICAgID0gcmVxdWlyZSAnLi9idWxsZXQnXG5Qb3MgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblF1YXRlcm5pb24gPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuTWF0ZXJpYWwgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEJvdCBleHRlbmRzIFB1c2hhYmxlXG4gICAgICAgIFxuICAgIEA6ICgpIC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAb3JpZW50YXRpb24gICAgICAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgXG4gICAgICAgIEBsYXN0QWN0aW9uRGVsdGEgPSAwLjBcbiAgICAgICAgICAgIFxuICAgICAgICBAbGVmdF90aXJlX3JvdCAgID0gMC4wXG4gICAgICAgIEByaWdodF90aXJlX3JvdCAgPSAwLjBcbiAgICAgICAgICAgIFxuICAgICAgICBAbWluTW92ZXMgPSAxMDBcblxuICAgICAgICBAbW92ZSAgICAgICA9IGZhbHNlXG4gICAgICAgIEBwdXNoICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wX29uY2UgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uICAgPSBudWxsXG4gICAgICAgIEByb3RhdGVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQGRpcl9zZ24gICAgICAgPSAxLjBcbiAgICAgICAgXG4gICAgICAgIHN1cGVyIFxuXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRk9SV0FSRCwgICAgICBcIm1vdmUgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfVVAsICAgICBcImNsaW1iIHVwXCIgICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfRE9XTiwgICBcImNsaW1iIGRvd25cIiAgICAgNTAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9MRUZULCAgICBcInR1cm4gbGVmdFwiICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9SSUdIVCwgICBcInR1cm4gcmlnaHRcIiAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUCwgICAgICAgICBcImp1bXBcIiAgICAgICAgICAgMTIwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUF9GT1JXQVJELCBcImp1bXAgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRkFMTF9GT1JXQVJELCBcImZhbGwgZm9yd2FyZFwiICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uU0hPT1QsICAgICAgICBcInNob290XCIgICAgICAgICAgMjAwIEFjdGlvbi5SRVBFQVRcbiAgICBcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uRkFMTCkuZHVyYXRpb24gPSAxMjBcbiAgICAgICAgQGFkZEV2ZW50V2l0aE5hbWUgXCJkaWVkXCJcbiAgICBcbiAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDUwMFxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgdGlyZVJhZGl1cyA9IDAuMDVcbiAgICAgICAgbm9zZSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkgMC40MDQsIDAuNSwgMzIsIDE2LCB0cnVlXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41LCAzMiwgMzIsIDE2LCBNYXRoLlBJXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41LCAzMiwgMzIsIDAsIDIqTWF0aC5QSSwgMCwgMi4yXG4gICAgICAgIFxuICAgICAgICBubWF0ciA9IG5ldyBUSFJFRS5NYXRyaXg0KClcbiAgICAgICAgdHJhbnMgPSBuZXcgVEhSRUUuVmVjdG9yMyAwLC0wLjU0MywwXG4gICAgICAgIHJvdCAgID0gbmV3IFRIUkVFLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIgbmV3IFRIUkVFLkV1bGVyIFZlY3Rvci5ERUcyUkFEKDE4MCksIDAsIDBcbiAgICAgICAgXG4gICAgICAgIG5tYXRyLmNvbXBvc2UgdHJhbnMsIHJvdCwgbmV3IFRIUkVFLlZlY3RvcjMgMSwxLDFcbiAgICAgICAgZ2VvbS5tZXJnZSBub3NlLCBubWF0clxuICAgICAgICBnZW9tLnJvdGF0ZVggVmVjdG9yLkRFRzJSQUQgLTkwXG4gICAgICAgIGdlb20uc2NhbGUgMC43LCAwLjcsIDAuN1xuICAgICAgICAgICBcbiAgICAgICAgTXV0YW50ID0gcmVxdWlyZSAnLi9tdXRhbnQnICAgICAgICAgXG4gICAgICAgIG11dGFudCA9IEAgaW5zdGFuY2VvZiBNdXRhbnRcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBtdXRhbnQgYW5kIE1hdGVyaWFsLm11dGFudC5jbG9uZSgpIG9yIE1hdGVyaWFsLnBsYXllclxuXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSAwLjUtdGlyZVJhZGl1cywgdGlyZVJhZGl1cywgMTYsIDMyXG4gICAgICAgIGdlb20uc2NhbGUgMSwxLDIuNVxuICAgICAgICB0aXJlTWF0ID0gbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnRUaXJlLmNsb25lKCkgb3IgTWF0ZXJpYWwudGlyZVxuICAgICAgICBAbGVmdFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEBsZWZ0VGlyZS5wb3NpdGlvbi5zZXQgMC4zNSwwLDAgXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAbGVmdFRpcmVcblxuICAgICAgICBAcmlnaHRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAcmlnaHRUaXJlLnBvc2l0aW9uLnNldCAtMC4zNSwwLDAgXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IDAsIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcbiAgICAgICAgQG1lc2guYWRkIEByaWdodFRpcmVcblxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gQHJpZ2h0VGlyZS5jYXN0U2hhZG93ID0gQGxlZnRUaXJlLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSBAbGVmdFRpcmUucmVjZWl2ZVNoYWRvdyA9IEByaWdodFRpcmUucmVjZWl2ZVNoYWRvdyA9IHRydWUgXG4gICAgICAgICAgICBcbiAgICBzZXRPcGFjaXR5OiAob3BhY2l0eSkgLT4gXG4gICAgICAgIHRpcmVNYXQgPSBAbGVmdFRpcmUubWF0ZXJpYWxcbiAgICAgICAgYm90TWF0ID0gQG1lc2gubWF0ZXJpYWxcbiAgICAgICAgdGlyZU1hdC52aXNpYmxlID0gb3BhY2l0eSA+IDBcbiAgICAgICAgdGlyZU1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQuZGVwdGhXcml0ZSA9IG9wYWNpdHkgPiAwLjVcbiAgICAgICAgYm90TWF0Lm9wYWNpdHkgPSBvcGFjaXR5XG4gICAgICAgIHRpcmVNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG4gICAgZ2V0RG93bjogLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBWZWN0b3IubWludXNZXG4gICAgZ2V0VXA6ICAgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICBnZXREaXI6IChkaXI9QGRpcl9zZ24pIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgbmV3IFZlY3RvciAwLDAsZGlyXG4gIFxuICAgIGN1cnJlbnRQb3M6ICAtPiBAY3VycmVudF9wb3NpdGlvbi5jbG9uZSgpXG4gICAgY3VycmVudERpcjogIC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFopLm5vcm1hbCgpXG4gICAgY3VycmVudFVwOiAgIC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFkpLm5vcm1hbCgpXG4gICAgY3VycmVudExlZnQ6IC0+IEBjdXJyZW50X29yaWVudGF0aW9uLnJvdGF0ZShWZWN0b3IudW5pdFgpLm5vcm1hbCgpXG5cbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgZGllOiAoKSAtPlxuICAgICAgICBUaW1lci5yZW1vdmVBY3Rpb25zT2ZPYmplY3QgQFxuICAgICAgICBcbiAgICAgICAgQG1vdmUgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgID0gZmFsc2VcbiAgICAgICAgQHNob290ID0gZmFsc2VcbiAgICAgICAgQHB1c2ggID0gZmFsc2VcbiAgICBcbiAgICAgICAgQGdldEV2ZW50V2l0aE5hbWUoXCJkaWVkXCIpLnRyaWdnZXJBY3Rpb25zKClcbiAgICAgICAgQGRpZWQgID0gdHJ1ZVxuICAgIFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgcmVzZXQ6ICgpIC0+XG4gICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgIFxuICAgICAgICBAZGlyZWN0aW9uLnJlc2V0KClcbiAgICAgICAgQG9yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIEBtb3ZlICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBwdXNoICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wX29uY2UgICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgICA9IGZhbHNlXG4gICAgXG4gICAgaXNGYWxsaW5nOiAtPiBAbW92ZV9hY3Rpb24gYW5kIEBtb3ZlX2FjdGlvbi5pZCA9PSBBY3Rpb24uRkFMTFxuICAgIFxuICAgICMgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBpbml0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBuZXdQb3MgPSBuZXcgUG9zIEBwb3NpdGlvbiBcbiAgICAgICAgIyBrbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfSBwb3NcIiwgbmV3UG9zXG4gICAgICAgICMga2xvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX1cIlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCAgICAgICAgIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTiAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QICAgICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXREb3duKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5hZGQgQGdldERvd24oKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBub3QgbmV3UG9zLmVxbCBuZXcgUG9zIEBwb3NpdGlvblxuICAgICAgICAgICAgIyBrbG9nICdib3QuaW5pdEFjdGlvbiBvYmplY3RXaWxsTW92ZVRvUG9zOicsIG5ld1Bvc1xuICAgICAgICAgICAgd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBALCBuZXdQb3MsIGFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAgICAgIDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgXG4gICAgcGVyZm9ybUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHJlbFRpbWUgID0gYWN0aW9uLmdldFJlbGF0aXZlVGltZSgpICAjIH4gQGN1cnJlbnQgLyBAZ2V0RHVyYXRpb24oKSBcbiAgICAgICAgZGx0VGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpICMgKEBjdXJyZW50LUBsYXN0KSAvIEBnZXREdXJhdGlvbigpXG4gICAgXG4gICAgICAgIEBsYXN0QWN0aW9uRGVsdGEgPSBkbHRUaW1lXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGNvc0ZhYyA9IE1hdGguY29zIE1hdGguUEkvMiAtIE1hdGguUEkvMiAqIHJlbFRpbWVcbiAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uYXRTdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAjIGxvZyAncjonIHJlbFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiBkbHRUaW1lKVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXRVcCgpLm11bChzaW5GYWMpIFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKS5wbHVzIEBnZXREb3duKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBrbG9nICdzdGlsbCBuZWVkZWQ/J1xuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lLzJcbiAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgaWYgcmVsVGltZSA8PSAwLjJcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsIChyZWxUaW1lLzAuMikvMlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlbFRpbWUgPj0gMC44KVxuICAgICAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLnBsdXMgQGdldERvd24oKS5tdWwgMC41KyhyZWxUaW1lLTAuOCkvMC4yLzJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiAocmVsVGltZS0wLjIpLzAuNiAqIDkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgICAgICByb3RWZWMgPSAoQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24pLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyhAZ2V0RG93bigpKS5wbHVzKHJvdFZlYykubXVsIDAuNVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLlRVUk5fTEVGVFxuICAgIFxuICAgICAgICAgICAgICAgIGlmIEBtb3ZlX2FjdGlvbiA9PSBudWxsIGFuZCBhY3Rpb24uYXRTdGFydCgpICMgaWYgbm90IHBlcmZvcm1pbmcgbW92ZSBhY3Rpb24gYW5kIHN0YXJ0IG9mIHJvdGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdXBkYXRlIEBvcmllbnRhdGlvbiBub3csIHNvIG5leHQgbW92ZSBhY3Rpb24gd2lsbCBtb3ZlIGluIGRlc2lyZWQgQGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9ICBkbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiA5MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IC1kbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBmaW5pc2hBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgXG4gICAgICAgICMga2xvZyBcIkJvdC5maW5pc2hBY3Rpb24gI3thY3Rpb24uaWR9ICN7YWN0aW9uLm5hbWV9XCIgaWYgYWN0aW9uLm5hbWUgIT0gJ25vb3AnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AsIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hUXG4gICAgICAgICAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uICMgYm90IGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgbW92ZSBhY3Rpb24gLT4gc3RvcmUgcm90YXRpb24gaW4gQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBAcmVzdF9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gbWF0cml4XG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBhY3Rpb24uaWQgPiBBY3Rpb24uU0hPT1RcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uICMgdXBkYXRlIGNsaW1iIEBvcmllbnRhdGlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24gYW5kIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEICMgYm90IGlzIGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgcm90YXRpb24gLT5cbiAgICAgICAgICAgICMgdGFrZSBvdmVyIHJlc3VsdCBvZiByb3RhdGlvbiB0byBwcmV2ZW50IHNsaWRpbmdcbiAgICAgICAgICAgIGlmIEByb3RhdGVfYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoLTkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgdGFyZ2V0UG9zID0gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICAgICAgd29ybGQub2JqZWN0TW92ZWQgQCwgQHBvc2l0aW9uLCB0YXJnZXRQb3MgIyB1cGRhdGUgd29ybGQgQHBvc2l0aW9uXG4gICAgICAgICAgICBAcG9zaXRpb24gPSB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEIGFuZCBAcm90YXRlX2FjdGlvbiA9PSBudWxsICMgaWYgbm90IGp1bXBpbmcgZm9yd2FyZFxuICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBAb3JpZW50YXRpb25cbiAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgI3thY3Rpb24ubmFtZX0gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlBVU0ggYW5kIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICBrbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiEnXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgbmV4dCBhY3Rpb24gZGVwZW5kaW5nIG9uIHR5cGUgb2YgZmluaXNoZWQgYWN0aW9uIGFuZCBzdXJyb3VuZGluZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgd2lsbCBhbHNvIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJyBAZ2V0UG9zKCksIDAuMjUgXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCB3aWxsIG5vdCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ubWludXMgQGdldFVwKCkgICMgYmVsb3cgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCcgQGdldFBvcygpLCAwLjVcbiAgICAgICAgZWxzZSBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyB3aWxsIGJlIGVtcHR5XG4gICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eScsIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKSwgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKVxuICAgICAgICAgICAgaWYgQG1vdmUgIyBzdGlja3kgaWYgbW92aW5nXG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSAgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgIyBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgZm9yd2FyZCBlbXB0eSdcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNPY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgIyBiZWxvdyBmb3J3YXJkIGlzIHNvbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBvY2N1cGFudCA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm1pbnVzIEBnZXRVcCgpIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkgXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBvY2N1cGFudD8gb3Igbm90IG9jY3VwYW50Py5pc1NsaXBwZXJ5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24gPSBAZ2V0RG93bigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGVsc2UgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uRkFMTF9GT1JXQVJELCBBY3Rpb24uRkFMTF0gIyBsYW5kZWRcbiAgICAgICAgICAgIGlmIEBuYW1lID09ICdwbGF5ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpXG4gICAgICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICBUaW1lci5hZGRBY3Rpb24gQG1vdmVfYWN0aW9uXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBAcm90YXRlX2FjdGlvbj9cbiAgICAgICAgXG4gICAgICAgIEBzZXRQb3NpdGlvbiBAY3VycmVudF9wb3NpdGlvbi5yb3VuZCgpXG4gICAgICAgIEBzZXRPcmllbnRhdGlvbiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3VuZCgpXG5cbiAgICAgICAgaWYgQG1vdmUgb3IgQGp1bXAgb3IgQGp1bXBfb25jZVxuICAgICAgICAgICAgIyBrbG9nICdtb3ZlQm90JyAoQGp1bXAgYW5kICdqdW1wJyBvciAnJyksIChAanVtcF9vbmNlIGFuZCAnb25jZScgb3IgJycpXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgIyBrbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgcG9zaXRpb246XCIsIEBwb3NpdGlvbiBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GT1JXQVJELCBBY3Rpb24uSlVNUF9GT1JXQVJELCBBY3Rpb24uQ0xJTUJfRE9XTl1cbiAgICAgICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAnI3thY3Rpb24ubmFtZX0nIG9yaWVudGF0aW9uOlwiLCBAb3JpZW50YXRpb24ucm91bmRlZCgpLm5hbWUgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uVFVSTl9MRUZULCBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLkNMSU1CX1VQXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiB3b3JsZC5nZXRSZWFsT2NjdXBhbnRBdFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKT8uaXNNdXRhbnQ/KClcbiAgICAgICAgICAgICAgICAjIGtlZXAgYWN0aW9uIGNoYWluIGZsb3dpbmcgaW4gb3JkZXIgdG8gZGV0ZWN0IGVudmlyb25tZW50IGNoYW5nZXNcbiAgICAgICAgICAgICAgICBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgbXV0YW50IGJlbG93OiBzdGFydFRpbWVkQWN0aW9uIE5PT1AnXG4gICAgICAgICAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDBcblxuICAgICMgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG1vdmVCb3Q6ICgpIC0+XG4gICAgICAgICMga2xvZyAnbW92ZUJvdCcgQG1vdmUsIEBtb3ZlX2FjdGlvblxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIGZvcndhcmRQb3MgPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgaWYgQG1vdmUgYW5kIChAanVtcCBvciBAanVtcF9vbmNlKSBhbmQgICAgIyBqdW1wIG1vZGUgb3IganVtcCBhY3RpdmF0ZWQgd2hpbGUgbW92aW5nXG4gICAgICAgICAgICAjIEBkaXJfc2duID09IDEuMCBhbmQgICAgICAgICAgICAgICAgICAgICAjIGFuZCBtb3ZpbmcgZm9yd2FyZFxuICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKSAgIyBhbmQgYWJvdmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcy5wbHVzIEBnZXRVcCgpKSBhbmRcbiAgICAgICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MpICAjIGZvcndhcmQgYW5kIGFib3ZlIGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9KVU1QJ1xuICAgICAgICAgICAgICAgIGVsc2UgIyBubyBzcGFjZSB0byBqdW1wIGZvcndhcmQgLT4ganVtcCB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIGVsc2UgaWYgQG1vdmUgXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAgIyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MucGx1cyBAZ2V0RG93bigpICBcbiAgICAgICAgICAgICAgICAgICAgIyBiZWxvdyBmb3J3YXJkIGFsc28gZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIGRvd24gaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgaXMgbm90IGVtcHR5XG4gICAgICAgICAgICAgICAgbW92ZUFjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgICAgICBpZiBAcHVzaCBhbmQgd29ybGQubWF5T2JqZWN0UHVzaFRvUG9zIEAsIGZvcndhcmRQb3MsIG1vdmVBY3Rpb24uZ2V0RHVyYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICAgICAgIyBwbGF5ZXIgaW4gcHVzaCBtb2RlIGFuZCBwdXNoaW5nIG9iamVjdCBpcyBwb3NzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgICMgYmVsb3cgZm9yd2FyZCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBtb3ZlQWN0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSAjIGp1c3QgY2xpbWIgdXBcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgZWxzZSBpZiBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkpXG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUFxuICAgICAgICBcbiAgICAgICAgIyByZXNldCB0aGUganVtcCBvbmNlIGZsYWcgKGVpdGhlciB3ZSBqdW1wZWQgb3IgaXQncyBub3QgcG9zc2libGUgdG8ganVtcCBhdCBjdXJyZW50IEBwb3NpdGlvbilcbiAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIFxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgXG4gICAgICAgIFxuICAgIHN0ZXA6IC0+XG4gICAgICAgIEBtZXNoLnBvc2l0aW9uLmNvcHkgQGN1cnJlbnRfcG9zaXRpb25cbiAgICAgICAgQG1lc2gucXVhdGVybmlvbi5jb3B5IEBjdXJyZW50X29yaWVudGF0aW9uXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkBsZWZ0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAcmlnaHRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCgtOTApLCAwXG5cbm1vZHVsZS5leHBvcnRzID0gQm90XG4iXX0=
//# sourceURL=../coffee/bot.coffee