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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxTQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxH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QUMsUUFBUSxDQUFDLEdBQW5CLENBQXVCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBQSxHQUFJLElBQUMsQ0FBQSxhQUFwQixDQUF2QixFQUEyRCxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBM0QsRUFBK0UsQ0FBL0U7ZUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFwQixDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsY0FBcEIsQ0FBeEIsRUFBNkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLEVBQWhCLENBQTdELEVBQWtGLENBQWxGO0lBSkU7Ozs7R0FyZFE7O0FBMmRsQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgMDAwICAgXG5cbnsga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuUHVzaGFibGUgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5UaW1lciAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkJ1bGxldCAgICAgPSByZXF1aXJlICcuL2J1bGxldCdcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgQm90IGV4dGVuZHMgUHVzaGFibGVcbiAgICAgICAgXG4gICAgQDogKCkgLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBvcmllbnRhdGlvbiAgICAgICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgIEBsYXN0X2Z1bWUgICAgICAgPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgQG1pbk1vdmVzID0gMTAwXG5cbiAgICAgICAgQG1vdmUgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgID0gbnVsbFxuICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBkaXJfc2duICAgICAgID0gMS4wXG4gICAgICAgIFxuICAgICAgICBzdXBlciBcblxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZPUldBUkQsICAgICAgXCJtb3ZlIGZvcndhcmRcIiwgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9VUCwgICAgIFwiY2xpbWIgdXBcIiwgICAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uQ0xJTUJfRE9XTiwgICBcImNsaW1iIGRvd25cIiwgICAgIDUwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fTEVGVCwgICAgXCJ0dXJuIGxlZnRcIiwgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX1JJR0hULCAgIFwidHVybiByaWdodFwiLCAgICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uSlVNUCwgICAgICAgICBcImp1bXBcIiwgICAgICAgICAgIDEyMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVBfRk9SV0FSRCwgXCJqdW1wIGZvcndhcmRcIiwgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GQUxMX0ZPUldBUkQsIFwiZmFsbCBmb3J3YXJkXCIsICAgMjAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uU0hPT1QsICAgICAgICBcInNob290XCIsICAgICAgICAgIDIwMCwgQWN0aW9uLlJFUEVBVFxuICAgIFxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5GQUxMKS5kdXJhdGlvbiA9IDEyMFxuICAgICAgICBAYWRkRXZlbnRXaXRoTmFtZSBcImRpZWRcIlxuICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgNTAwXG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIHRpcmVSYWRpdXMgPSAwLjA1XG4gICAgICAgIG5vc2UgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5IDAuNDA0LCAwLjUsIDMyLCAxNiwgdHJ1ZVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSwgMzIsIDMyLCAxNiwgTWF0aC5QSVxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuNSwgMzIsIDMyLCAwLCAyKk1hdGguUEksIDAsIDIuMlxuICAgICAgICBcbiAgICAgICAgbm1hdHIgPSBuZXcgVEhSRUUuTWF0cml4NCgpXG4gICAgICAgIHRyYW5zID0gbmV3IFRIUkVFLlZlY3RvcjMgMCwtMC41NDMsMFxuICAgICAgICByb3QgICA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyIG5ldyBUSFJFRS5FdWxlciBWZWN0b3IuREVHMlJBRCgxODApLCAwLCAwXG4gICAgICAgIFxuICAgICAgICBubWF0ci5jb21wb3NlIHRyYW5zLCByb3QsIG5ldyBUSFJFRS5WZWN0b3IzIDEsMSwxXG4gICAgICAgIGdlb20ubWVyZ2Ugbm9zZSwgbm1hdHJcbiAgICAgICAgZ2VvbS5yb3RhdGVYIFZlY3Rvci5ERUcyUkFEIC05MFxuICAgICAgICBnZW9tLnNjYWxlIDAuNywgMC43LCAwLjdcbiAgICAgICAgICAgXG4gICAgICAgIE11dGFudCA9IHJlcXVpcmUgJy4vbXV0YW50JyAgICAgICAgIFxuICAgICAgICBtdXRhbnQgPSBAIGluc3RhbmNlb2YgTXV0YW50XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnQuY2xvbmUoKSBvciBNYXRlcmlhbC5wbGF5ZXJcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkgMC41LXRpcmVSYWRpdXMsIHRpcmVSYWRpdXMsIDE2LCAzMlxuICAgICAgICBnZW9tLnNjYWxlIDEsMSwyLjVcbiAgICAgICAgdGlyZU1hdCA9IG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50VGlyZS5jbG9uZSgpIG9yIE1hdGVyaWFsLnRpcmVcbiAgICAgICAgQGxlZnRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAbGVmdFRpcmUucG9zaXRpb24uc2V0IDAuMzUsMCwwIFxuICAgICAgICBAbGVmdFRpcmUucm90YXRpb24uc2V0IDAsIFZlY3Rvci5ERUcyUkFEKDkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQGxlZnRUaXJlXG5cbiAgICAgICAgQHJpZ2h0VGlyZSA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIHRpcmVNYXRcbiAgICAgICAgQHJpZ2h0VGlyZS5wb3NpdGlvbi5zZXQgLTAuMzUsMCwwIFxuICAgICAgICBAcmlnaHRUaXJlLnJvdGF0aW9uLnNldCAwLCBWZWN0b3IuREVHMlJBRCgtOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAcmlnaHRUaXJlXG5cbiAgICAgICAgQG1lc2guY2FzdFNoYWRvdyA9IEByaWdodFRpcmUuY2FzdFNoYWRvdyA9IEBsZWZ0VGlyZS5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gQGxlZnRUaXJlLnJlY2VpdmVTaGFkb3cgPSBAcmlnaHRUaXJlLnJlY2VpdmVTaGFkb3cgPSB0cnVlIFxuICAgICAgICAgICAgXG4gICAgc2V0T3BhY2l0eTogKG9wYWNpdHkpIC0+IFxuICAgICAgICB0aXJlTWF0ID0gQGxlZnRUaXJlLm1hdGVyaWFsXG4gICAgICAgIGJvdE1hdCA9IEBtZXNoLm1hdGVyaWFsXG4gICAgICAgIHRpcmVNYXQudmlzaWJsZSA9IG9wYWNpdHkgPiAwXG4gICAgICAgIHRpcmVNYXQuZGVwdGhXcml0ZSA9IG9wYWNpdHkgPiAwLjVcbiAgICAgICAgYm90TWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgICAgICB0aXJlTWF0Lm9wYWNpdHkgPSBvcGFjaXR5XG4gICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuICAgIGdldERvd246IC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLm1pbnVzWVxuICAgIGdldFVwOiAgIC0+IEBvcmllbnRhdGlvbi5yb3RhdGUgVmVjdG9yLnVuaXRZXG4gICAgZ2V0RGlyOiAgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBuZXcgVmVjdG9yIDAsMCxAZGlyX3NnblxuICBcbiAgICBjdXJyZW50UG9zOiAgLT4gQGN1cnJlbnRfcG9zaXRpb24uY2xvbmUoKVxuICAgIGN1cnJlbnREaXI6ICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRaKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRVcDogICAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRZKS5ub3JtYWwoKVxuICAgIGN1cnJlbnRMZWZ0OiAtPiBAY3VycmVudF9vcmllbnRhdGlvbi5yb3RhdGUoVmVjdG9yLnVuaXRYKS5ub3JtYWwoKVxuXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIGRpZTogKCkgLT5cbiAgICAgICAgVGltZXIucmVtb3ZlQWN0aW9uc09mT2JqZWN0IEBcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCA9IGZhbHNlXG4gICAgICAgIEBwdXNoICA9IGZhbHNlXG4gICAgXG4gICAgICAgIEBnZXRFdmVudFdpdGhOYW1lKFwiZGllZFwiKS50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgIEBkaWVkICA9IHRydWVcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIHJlc2V0OiAoKSAtPlxuICAgIFxuICAgICAgICBAbGVmdF90aXJlX3JvdCAgID0gMC4wXG4gICAgICAgIEByaWdodF90aXJlX3JvdCAgPSAwLjBcbiAgICAgICAgQGxhc3RfZnVtZSAgICAgICA9IDBcbiAgICBcbiAgICAgICAgQGRpcmVjdGlvbi5yZXNldCgpXG4gICAgICAgIEBvcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBAbW92ZSAgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICAgPSBmYWxzZVxuICAgIFxuICAgIGlzRmFsbGluZzogLT4gQG1vdmVfYWN0aW9uIGFuZCBAbW92ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLkZBTExcbiAgICBcbiAgICAjICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgaW5pdEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgbmV3UG9zID0gbmV3IFBvcyBAcG9zaXRpb24gXG4gICAgICAgICMga2xvZyBcImluaXRBY3Rpb24gI3thY3Rpb24ubmFtZX0gcG9zXCIsIG5ld1Bvc1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCAgICAgICAgIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uQ0xJTUJfRE9XTiAgIHRoZW4gbmV3UG9zLmFkZCBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QICAgICAgICAgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXRVcCgpLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkQgdGhlbiBuZXdQb3MuYWRkIEBnZXREb3duKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBpZiBub3QgQGRpcmVjdGlvbi5pc1plcm8oKVxuICAgICAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb24gXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIG5ld1Bvcy5hZGQgQGdldERvd24oKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBub3QgbmV3UG9zLmVxbCBuZXcgUG9zIEBwb3NpdGlvblxuICAgICAgICAgICAgIyBrbG9nICdib3QuaW5pdEFjdGlvbiBvYmplY3RXaWxsTW92ZVRvUG9zOicsIG5ld1Bvc1xuICAgICAgICAgICAgd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBALCBuZXdQb3MsIGFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAgICAgIDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4gICAgXG4gICAgcGVyZm9ybUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHJlbFRpbWUgID0gYWN0aW9uLmdldFJlbGF0aXZlVGltZSgpXG4gICAgICAgIGRsdFRpbWUgID0gYWN0aW9uLmdldFJlbGF0aXZlRGVsdGEoKVxuICAgIFxuICAgICAgICBjb3NGYWMgPSBNYXRoLmNvcyBNYXRoLlBJLzIgLSBNYXRoLlBJLzIgKiByZWxUaW1lXG4gICAgICAgIHNpbkZhYyA9IE1hdGguc2luIE1hdGguUEkvMiAqIHJlbFRpbWVcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lID09IDBcbiAgICAgICAgICAgICAgICAgICAgQnVsbGV0LnNob290RnJvbUJvdCBAXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QIHRoZW4gcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkRcbiAgICBcbiAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gQGRpcl9zZ24gKiBkbHRUaW1lXG4gICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpLm11bChzaW5GYWMpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogZGx0VGltZSlcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYykgXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGtsb2cgJ3N0aWxsIG5lZWRlZD8nXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lIDw9IDAuMlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwgKHJlbFRpbWUvMC4yKS8yXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVsVGltZSA+PSAwLjgpXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpLm11bCAwLjUrKHJlbFRpbWUtMC44KS8wLjIvMlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIChyZWxUaW1lLTAuMikvMC42ICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIHJvdFZlYyA9IChAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbikucm90YXRlIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzKEBnZXREb3duKCkpLnBsdXMocm90VmVjKS5tdWwgMC41XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uVFVSTl9MRUZUXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uID09IG51bGwgYW5kIHJlbFRpbWUgPT0gMC4wICMgaWYgbm90IHBlcmZvcm1pbmcgbW92ZSBhY3Rpb24gYW5kIHN0YXJ0IG9mIHJvdGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICMgdXBkYXRlIEBvcmllbnRhdGlvbiBub3csIHNvIG5leHQgbW92ZSBhY3Rpb24gd2lsbCBtb3ZlIGluIGRlc2lyZWQgQGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFlcbiAgICAgICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFlcbiAgICBcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9ICBkbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiA5MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbGVmdF90aXJlX3JvdCAgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICs9IC1kbHRUaW1lXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIHJlbFRpbWUgKiAtOTAuMCwgVmVjdG9yLnVuaXRZIFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24ubXVsIEByb3RhdGVfb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBmaW5pc2hBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgXG4gICAgICAgICMga2xvZyBcIkJvdC5maW5pc2hBY3Rpb24gI3thY3Rpb24uaWR9ICN7YWN0aW9uLm5hbWV9XCIgaWYgYWN0aW9uLm5hbWUgIT0gJ25vb3AnXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLk5PT1AsIEFjdGlvbi5TSE9PVFxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hUXG4gICAgICAgICAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uICMgYm90IGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgbW92ZSBhY3Rpb24gLT4gc3RvcmUgcm90YXRpb24gaW4gQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBAcmVzdF9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb24gIyB1cGRhdGUgcm90YXRpb24gbWF0cml4XG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBhY3Rpb24uaWQgPiBBY3Rpb24uU0hPT1RcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgQGNsaW1iX29yaWVudGF0aW9uICMgdXBkYXRlIGNsaW1iIEBvcmllbnRhdGlvblxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24gYW5kIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEICMgYm90IGlzIGN1cnJlbnRseSBwZXJmb3JtaW5nIGEgcm90YXRpb24gLT5cbiAgICAgICAgICAgICMgdGFrZSBvdmVyIHJlc3VsdCBvZiByb3RhdGlvbiB0byBwcmV2ZW50IHNsaWRpbmdcbiAgICAgICAgICAgIGlmIEByb3RhdGVfYWN0aW9uLmlkID09IEFjdGlvbi5UVVJOX0xFRlRcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAtOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IoLTkwLjAsIG5ldyBWZWN0b3IoMCwxLDApKS5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgdGFyZ2V0UG9zID0gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICAgICAgd29ybGQub2JqZWN0TW92ZWQgQCwgQHBvc2l0aW9uLCB0YXJnZXRQb3MgIyB1cGRhdGUgd29ybGQgQHBvc2l0aW9uXG4gICAgICAgICAgICBAcG9zaXRpb24gPSB0YXJnZXRQb3NcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uSlVNUF9GT1JXQVJEIGFuZCBAcm90YXRlX2FjdGlvbiA9PSBudWxsICMgaWYgbm90IGp1bXBpbmcgZm9yd2FyZFxuICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBAb3JpZW50YXRpb25cbiAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgI3thY3Rpb24ubmFtZX0gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlBVU0ggYW5kIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICBrbG9nICdzdXBlciAoUHVzaGFibGUpIGFjdGlvbiEnXG4gICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgIFxuICAgICAgICBpZiBAbW92ZV9hY3Rpb24/ICMgYWN0aW9uIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiAtPiByZXR1cm5cbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIHdhcyBub3QgYSBtb3ZlIGFjdGlvbiEnXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgbmV4dCBhY3Rpb24gZGVwZW5kaW5nIG9uIHR5cGUgb2YgZmluaXNoZWQgYWN0aW9uIGFuZCBzdXJyb3VuZGluZyBlbnZpcm9ubWVudFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkpVTVBfRk9SV0FSRFxuICAgICAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgIyBmb3J3YXJkIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgd2lsbCBhbHNvIGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZBTExfRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJywgQGdldFBvcygpLCAwLjI1IFxuICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgd2lsbCBub3QgYmUgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLm1pbnVzIEBnZXRVcCgpICAjIGJlbG93IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIGJlbG93IGVtcHR5Jywgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpLCBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICBpZiBAbW92ZSAjIHN0aWNreSBpZiBtb3ZpbmdcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpICAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uPyBcbiAgICAgICAgXG4gICAgICAgIEBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICBAbW92ZUJvdCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXJfc2duID0gMVxuICAgICAgICAgICAgQGp1bXBfb25jZSA9IGZhbHNlIGlmIGFjdGlvbi5pZCAhPSBBY3Rpb24uTk9PUFxuICAgICAgICAgICAgIyBrbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgcG9zaXRpb246XCIsIEBwb3NpdGlvbiBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GT1JXQVJELCBBY3Rpb24uSlVNUF9GT1JXQVJELCBBY3Rpb24uQ0xJTUJfRE9XTl1cbiAgICAgICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAnI3thY3Rpb24ubmFtZX0nIG9yaWVudGF0aW9uOlwiLCBAb3JpZW50YXRpb24ucm91bmRlZCgpLm5hbWUgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uVFVSTl9MRUZULCBBY3Rpb24uVFVSTl9SSUdIVCwgQWN0aW9uLkNMSU1CX1VQXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiB3b3JsZC5nZXRSZWFsT2NjdXBhbnRBdFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpKT8uaXNNdXRhbnQ/KClcbiAgICAgICAgICAgICAgICAjIGtlZXAgYWN0aW9uIGNoYWluIGZsb3dpbndnIGluIG9yZGVyIHRvIGRldGVjdCBlbnZpcm9ubWVudCBjaGFuZ2VzXG4gICAgICAgICAgICAgICAga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIG11dGFudCBiZWxvdzogc3RhcnRUaW1lZEFjdGlvbiBOT09QJ1xuICAgICAgICAgICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLk5PT1ApLCAwXG5cbiAgICBmaXhPcmllbnRhdGlvbkFuZFBvc2l0aW9uOiAtPlxuICAgICAgICBAc2V0UG9zaXRpb24gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICBAc2V0T3JpZW50YXRpb24gQGN1cnJlbnRfb3JpZW50YXRpb24ucm91bmQoKVxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgIGlmIEBtb3ZlIGFuZCAoQGp1bXAgb3IgQGp1bXBfb25jZSkgYW5kICAgICMganVtcCBtb2RlIG9yIGp1bXAgYWN0aXZhdGVkIHdoaWxlIG1vdmluZ1xuICAgICAgICAgICAgQGRpcl9zZ24gPT0gMS4wIGFuZCAgICAgICAgICAgICAgICAgICAgICMgYW5kIG1vdmluZyBmb3J3YXJkXG4gICAgICAgICAgICAgICAgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKSAgIyBhbmQgYWJvdmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zKGZvcndhcmRQb3MucGx1cyBAZ2V0VXAoKSkgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcykgICMgZm9yd2FyZCBhbmQgYWJvdmUgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgIyBubyBzcGFjZSB0byBqdW1wIGZvcndhcmQgLT4ganVtcCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSlVNUFxuICAgICAgICBlbHNlIGlmIEBtb3ZlIFxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MgICMgZm9yd2FyZCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgXG4gICAgICAgICAgICAgICAgICAgICMgYmVsb3cgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBkb3duIGlzIHNvbGlkXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZPUldBUkRcbiAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgaWYgQHB1c2ggYW5kIHdvcmxkLm1heU9iamVjdFB1c2hUb1BvcyBALCBmb3J3YXJkUG9zLCBtb3ZlQWN0aW9uLmdldER1cmF0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgbW92ZUFjdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgICMgcGxheWVyIGluIHB1c2ggbW9kZSBhbmQgcHVzaGluZyBvYmplY3QgaXMgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIGZvcndhcmRQb3MucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gbW92ZUFjdGlvblxuICAgICAgICAgICAgICAgIGVsc2UgIyBqdXN0IGNsaW1iIHVwXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIGVsc2UgaWYgQGp1bXAgb3IgQGp1bXBfb25jZVxuICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXRVcCgpKVxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgXG4gICAgICAgICMgcmVzZXQgdGhlIGp1bXAgb25jZSBmbGFnIChlaXRoZXIgd2UganVtcGVkIG9yIGl0J3Mgbm90IHBvc3NpYmxlIHRvIGp1bXAgYXQgY3VycmVudCBAcG9zaXRpb24pXG4gICAgICAgIEBqdW1wX29uY2UgPSBmYWxzZSBcbiAgICBcbiAgICAgICAgaWYgQG1vdmVfYWN0aW9uXG4gICAgICAgICAgICBAbW92ZV9hY3Rpb24ua2VlcFJlc3QoKSAjIHRyeSB0byBtYWtlIHN1YnNlcXVlbnQgYWN0aW9ucyBzbW9vdGhcbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgXG4gICAgIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgXG4gICAgICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPlxuICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uXG4gICAgICAgIEBtZXNoLnF1YXRlcm5pb24uY29weSBAY3VycmVudF9vcmllbnRhdGlvblxuICAgICAgICBAbGVmdFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAbGVmdF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKDkwKSwgMFxuICAgICAgICBAcmlnaHRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQHJpZ2h0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdFxuIl19
//# sourceURL=../coffee/bot.coffee