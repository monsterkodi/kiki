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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFVyxhQUFBO1FBRVQsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxTQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxH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QUMsUUFBUSxDQUFDLEdBQW5CLENBQXVCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBQSxHQUFJLElBQUMsQ0FBQSxhQUFwQixDQUF2QixFQUEyRCxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBM0QsRUFBK0UsQ0FBL0U7ZUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFwQixDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsY0FBcEIsQ0FBeEIsRUFBNkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLEVBQWhCLENBQTdELEVBQWtGLENBQWxGO0lBSkU7Ozs7R0FyZFE7O0FBMmRsQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgMDAwICAgXG5cbnsga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuUHVzaGFibGUgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5UaW1lciAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkJ1bGxldCAgICAgPSByZXF1aXJlICcuL2J1bGxldCdcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgQm90IGV4dGVuZHMgUHVzaGFibGVcbiAgICAgICAgXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAb3JpZW50YXRpb24gICAgICAgICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgICAgICBAbGFzdF9mdW1lICAgICAgID0gMFxuICAgICAgICAgICAgXG4gICAgICAgIEBtaW5Nb3ZlcyA9IDEwMFxuXG4gICAgICAgIEBtb3ZlICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gICA9IG51bGxcbiAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAZGlyX3NnbiAgICAgICA9IDEuMFxuICAgICAgICBcbiAgICAgICAgc3VwZXIgXG5cbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GT1JXQVJELCAgICAgIFwibW92ZSBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfVVAsICAgICBcImNsaW1iIHVwXCIsICAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX0RPV04sICAgXCJjbGltYiBkb3duXCIsICAgICA1MDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX0xFRlQsICAgIFwidHVybiBsZWZ0XCIsICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uVFVSTl9SSUdIVCwgICBcInR1cm4gcmlnaHRcIiwgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVAsICAgICAgICAgXCJqdW1wXCIsICAgICAgICAgICAxMjBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIFwianVtcCBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRkFMTF9GT1JXQVJELCBcImZhbGwgZm9yd2FyZFwiLCAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlNIT09ULCAgICAgICAgXCJzaG9vdFwiLCAgICAgICAgICAyMDAsIEFjdGlvbi5SRVBFQVRcbiAgICBcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uRkFMTCkuZHVyYXRpb24gPSAxMjBcbiAgICAgICAgQGFkZEV2ZW50V2l0aE5hbWUgXCJkaWVkXCJcbiAgICBcbiAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZChBY3Rpb24uTk9PUCksIDUwMFxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICB0aXJlUmFkaXVzID0gMC4wNVxuICAgICAgICBub3NlID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSAwLjQwNCwgMC41LCAzMiwgMTYsIHRydWVcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMTYsIE1hdGguUElcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMCwgMipNYXRoLlBJLCAwLCAyLjJcbiAgICAgICAgXG4gICAgICAgIG5tYXRyID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgICAgICB0cmFucyA9IG5ldyBUSFJFRS5WZWN0b3IzIDAsLTAuNTQzLDBcbiAgICAgICAgcm90ICAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlciBuZXcgVEhSRUUuRXVsZXIgVmVjdG9yLkRFRzJSQUQoMTgwKSwgMCwgMFxuICAgICAgICBcbiAgICAgICAgbm1hdHIuY29tcG9zZSB0cmFucywgcm90LCBuZXcgVEhSRUUuVmVjdG9yMyAxLDEsMVxuICAgICAgICBnZW9tLm1lcmdlIG5vc2UsIG5tYXRyXG4gICAgICAgIGdlb20ucm90YXRlWCBWZWN0b3IuREVHMlJBRCAtOTBcbiAgICAgICAgZ2VvbS5zY2FsZSAwLjcsIDAuNywgMC43XG4gICAgICAgICAgIFxuICAgICAgICBNdXRhbnQgPSByZXF1aXJlICcuL211dGFudCcgICAgICAgICBcbiAgICAgICAgbXV0YW50ID0gQCBpbnN0YW5jZW9mIE11dGFudFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50LmNsb25lKCkgb3IgTWF0ZXJpYWwucGxheWVyXG5cbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5IDAuNS10aXJlUmFkaXVzLCB0aXJlUmFkaXVzLCAxNiwgMzJcbiAgICAgICAgZ2VvbS5zY2FsZSAxLDEsMi41XG4gICAgICAgIHRpcmVNYXQgPSBtdXRhbnQgYW5kIE1hdGVyaWFsLm11dGFudFRpcmUuY2xvbmUoKSBvciBNYXRlcmlhbC50aXJlXG4gICAgICAgIEBsZWZ0VGlyZSA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIHRpcmVNYXRcbiAgICAgICAgQGxlZnRUaXJlLnBvc2l0aW9uLnNldCAwLjM1LDAsMCBcbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCAwLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQG1lc2guYWRkIEBsZWZ0VGlyZVxuXG4gICAgICAgIEByaWdodFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEByaWdodFRpcmUucG9zaXRpb24uc2V0IC0wLjM1LDAsMCBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgdGlyZU1hdCA9IEBsZWZ0VGlyZS5tYXRlcmlhbFxuICAgICAgICBib3RNYXQgPSBAbWVzaC5tYXRlcmlhbFxuICAgICAgICB0aXJlTWF0LnZpc2libGUgPSBvcGFjaXR5ID4gMFxuICAgICAgICB0aXJlTWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICAgICAgdGlyZU1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbiAgICBnZXREb3duOiAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1lcbiAgICBnZXRVcDogICAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci51bml0WVxuICAgIGdldERpcjogIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgbmV3IFZlY3RvciAwLDAsQGRpcl9zZ25cbiAgXG4gICAgY3VycmVudFBvczogIC0+IEBjdXJyZW50X3Bvc2l0aW9uLmNsb25lKClcbiAgICBjdXJyZW50RGlyOiAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0Wikubm9ybWFsKClcbiAgICBjdXJyZW50VXA6ICAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WSkubm9ybWFsKClcbiAgICBjdXJyZW50TGVmdDogLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WCkubm9ybWFsKClcblxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBkaWU6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICAgICBAbW92ZSAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgPSBmYWxzZVxuICAgIFxuICAgICAgICBAZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBAZGllZCAgPSB0cnVlXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICByZXNldDogKCkgLT5cbiAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgIEBsYXN0X2Z1bWUgICAgICAgPSAwXG4gICAgXG4gICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICBAb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgQG1vdmUgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgID0gZmFsc2VcbiAgICBcbiAgICBpc0ZhbGxpbmc6IC0+IEBtb3ZlX2FjdGlvbiBhbmQgQG1vdmVfYWN0aW9uLmlkID09IEFjdGlvbi5GQUxMXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIG5ld1BvcyA9IG5ldyBQb3MgQHBvc2l0aW9uIFxuICAgICAgICAjIGxvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX0gcG9zXCIsIG5ld1Bvc1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCAgICAgICAgIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTiAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QICAgICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXREb3duKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5hZGQgQGdldERvd24oKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBub3QgbmV3UG9zLmVxbCBuZXcgUG9zIEBwb3NpdGlvblxuICAgICAgICAgICAgIyBsb2cgJ2JvdC5pbml0QWN0aW9uIG9iamVjdFdpbGxNb3ZlVG9Qb3M6JywgbmV3UG9zXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIEAsIG5ld1BvcywgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMCAgICAgMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVsVGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKClcbiAgICAgICAgZGx0VGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpXG4gICAgXG4gICAgICAgIGNvc0ZhYyA9IE1hdGguY29zIE1hdGguUEkvMiAtIE1hdGguUEkvMiAqIHJlbFRpbWVcbiAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIGlmIHJlbFRpbWUgPT0gMFxuICAgICAgICAgICAgICAgICAgICBCdWxsZXQuc2hvb3RGcm9tQm90IEBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRk9SV0FSRFxuICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IDEgLSBNYXRoLmNvcyhNYXRoLlBJLzIgKiBkbHRUaW1lKVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogZGx0VGltZSlcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0VXAoKS5tdWwoc2luRmFjKSBcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSkucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAga2xvZyAnc3RpbGwgbmVlZGVkPydcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkubXVsKHJlbFRpbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZS8yXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogZGx0VGltZS8yXG4gICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTlxuICAgICAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIGlmIHJlbFRpbWUgPD0gMC4yXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bCAocmVsVGltZS8wLjIpLzJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZWxUaW1lID49IDAuOClcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIDkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKCkubXVsIDAuNSsocmVsVGltZS0wLjgpLzAuMi8yXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIEBkaXJfc2duICogKHJlbFRpbWUtMC4yKS8wLjYgKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgcm90VmVjID0gKEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uKS5yb3RhdGUgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLnBsdXMoQGdldERvd24oKSkucGx1cyhyb3RWZWMpLm11bCAwLjVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fUklHSFQsIEFjdGlvbi5UVVJOX0xFRlRcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gPT0gbnVsbCBhbmQgcmVsVGltZSA9PSAwLjAgIyBpZiBub3QgcGVyZm9ybWluZyBtb3ZlIGFjdGlvbiBhbmQgc3RhcnQgb2Ygcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB1cGRhdGUgQG9yaWVudGF0aW9uIG5vdywgc28gbmV4dCBtb3ZlIGFjdGlvbiB3aWxsIG1vdmUgaW4gZGVzaXJlZCBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgIFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAtZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIDkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAgZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGZpbmlzaEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICBcbiAgICAgICAgIyBsb2cgXCJCb3QuZmluaXNoQWN0aW9uICN7YWN0aW9uLmlkfSAje2FjdGlvbi5uYW1lfVwiIGlmIGFjdGlvbi5uYW1lICE9ICdub29wJ1xuICAgICAgICAgICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QLCBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uVFVSTl9MRUZULCBBY3Rpb24uVFVSTl9SSUdIVFxuICAgICAgICAgICAgICAgIEByb3RhdGVfYWN0aW9uID0gbnVsbFxuICAgICAgICAgICAgICAgIGlmIEBtb3ZlX2FjdGlvbiAjIGJvdCBjdXJyZW50bHkgcGVyZm9ybWluZyBhIG1vdmUgYWN0aW9uIC0+IHN0b3JlIHJvdGF0aW9uIGluIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gQHJlc3Rfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIG1hdHJpeFxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgYWN0aW9uLmlkID4gQWN0aW9uLlNIT09UXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbiAjIHVwZGF0ZSBjbGltYiBAb3JpZW50YXRpb25cbiAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgXG4gICAgICAgIGlmIEByb3RhdGVfYWN0aW9uIGFuZCBhY3Rpb24uaWQgIT0gQWN0aW9uLkpVTVBfRk9SV0FSRCAjIGJvdCBpcyBjdXJyZW50bHkgcGVyZm9ybWluZyBhIHJvdGF0aW9uIC0+XG4gICAgICAgICAgICAjIHRha2Ugb3ZlciByZXN1bHQgb2Ygcm90YXRpb24gdG8gcHJldmVudCBzbGlkaW5nXG4gICAgICAgICAgICBpZiBAcm90YXRlX2FjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yKDkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WSAgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yKC05MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WSAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIHRhcmdldFBvcyA9IEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgICAgIHdvcmxkLm9iamVjdE1vdmVkIEAsIEBwb3NpdGlvbiwgdGFyZ2V0UG9zICMgdXBkYXRlIHdvcmxkIEBwb3NpdGlvblxuICAgICAgICAgICAgQHBvc2l0aW9uID0gdGFyZ2V0UG9zXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkpVTVBfRk9SV0FSRCBhbmQgQHJvdGF0ZV9hY3Rpb24gPT0gbnVsbCAjIGlmIG5vdCBqdW1waW5nIGZvcndhcmRcbiAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gQG9yaWVudGF0aW9uXG4gICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICBcbiAgICBhY3Rpb25GaW5pc2hlZDogKGFjdGlvbikgLT5cbiAgICAgICAgIyBsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgI3thY3Rpb24ubmFtZX0gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlBVU0ggYW5kIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICBrbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMgbG9nICdib3QuYWN0aW9uRmluaXNoZWQgd2FzIG5vdCBhIG1vdmUgYWN0aW9uISdcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgZmluZCBuZXh0IGFjdGlvbiBkZXBlbmRpbmcgb24gdHlwZSBvZiBmaW5pc2hlZCBhY3Rpb24gYW5kIHN1cnJvdW5kaW5nIGVudmlyb25tZW50XG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLm1pbnVzIEBnZXRVcCgpICMgYmVsb3cgZm9yd2FyZCB3aWxsIGFsc28gYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKCksIDAuMjUgXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCB3aWxsIG5vdCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ubWludXMgQGdldFVwKCkgICMgYmVsb3cgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT1RfTEFORCcsIEBnZXRQb3MoKSwgMC41XG4gICAgICAgIGVsc2UgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkgICMgYmVsb3cgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgIyBsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eScsIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKSwgQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKVxuICAgICAgICAgICAgaWYgQG1vdmUgIyBzdGlja3kgaWYgbW92aW5nXG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSAgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgIyBsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uPyBcbiAgICAgICAgXG4gICAgICAgIEBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgIyBsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgJyN7YWN0aW9uLm5hbWV9JyBwb3NpdGlvbjpcIiwgQHBvc2l0aW9uIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLkZPUldBUkQsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIEFjdGlvbi5DTElNQl9ET1dOXVxuICAgICAgICAgICAgIyBsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgJyN7YWN0aW9uLm5hbWV9JyBvcmllbnRhdGlvbjpcIiwgQG9yaWVudGF0aW9uLnJvdW5kZWQoKS5uYW1lIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFQsIEFjdGlvbi5DTElNQl9VUF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgd29ybGQuZ2V0UmVhbE9jY3VwYW50QXRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldERvd24oKSk/LmlzTXV0YW50PygpXG4gICAgICAgICAgICAgICAgIyBrZWVwIGFjdGlvbiBjaGFpbiBmbG93aW53ZyBpbiBvcmRlciB0byBkZXRlY3QgZW52aXJvbm1lbnQgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBtdXRhbnQgYmVsb3c6IHN0YXJ0VGltZWRBY3Rpb24gTk9PUCdcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgMFxuXG4gICAgZml4T3JpZW50YXRpb25BbmRQb3NpdGlvbjogLT5cbiAgICAgICAgQHNldFBvc2l0aW9uIEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgQHNldE9yaWVudGF0aW9uIEBjdXJyZW50X29yaWVudGF0aW9uLnJvdW5kKClcblxuICAgICMgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMCAwMDAgICAwMDAwMDAwIFxuICAgICMgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwXG4gICAgICAgIFxuICAgIG1vdmVCb3Q6ICgpIC0+XG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICBpZiBAbW92ZSBhbmQgKEBqdW1wIG9yIEBqdW1wX29uY2UpIGFuZCAgICAjIGp1bXAgbW9kZSBvciBqdW1wIGFjdGl2YXRlZCB3aGlsZSBtb3ZpbmdcbiAgICAgICAgICAgIEBkaXJfc2duID09IDEuMCBhbmQgICAgICAgICAgICAgICAgICAgICAjIGFuZCBtb3ZpbmcgZm9yd2FyZFxuICAgICAgICAgICAgICAgIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSkgICMgYW5kIGFib3ZlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MpICAjIGZvcndhcmQgYW5kIGFib3ZlIGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICBlbHNlICMgbm8gc3BhY2UgdG8ganVtcCBmb3J3YXJkIC0+IGp1bXAgdXBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgQG1vdmVfYWN0aW9uLmtlZXBSZXN0KCkgIyB0cnkgdG8gbWFrZSBzdWJzZXF1ZW50IGFjdGlvbnMgc21vb3RoXG4gICAgICAgICAgICBUaW1lci5hZGRBY3Rpb24gQG1vdmVfYWN0aW9uXG4gICAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgIFxuICAgICMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgIFxuICAgICAgICBcbiAgICBzdGVwOiAoc3RlcCkgLT5cbiAgICAgICAgQG1lc2gucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvblxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgQGN1cnJlbnRfb3JpZW50YXRpb25cbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQGxlZnRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkByaWdodF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcblxubW9kdWxlLmV4cG9ydHMgPSBCb3RcbiJdfQ==
//# sourceURL=../coffee/bot.coffee