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
        this.mesh.position.copy(this.current_position);
        this.mesh.quaternion.copy(this.current_orientation);
        this.leftTire.rotation.set(Vector.DEG2RAD(180 * this.left_tire_rot), Vector.DEG2RAD(90), 0);
        return this.rightTire.rotation.set(Vector.DEG2RAD(180 * this.right_tire_rot), Vector.DEG2RAD(-90), 0);
    };

    return Bot;

})(Pushable);

module.exports = Bot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxH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LENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBM0QsRUFBK0UsQ0FBL0U7ZUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFwQixDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsY0FBcEIsQ0FBeEIsRUFBNkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLEVBQWhCLENBQTdELEVBQWtGLENBQWxGO0lBSkU7Ozs7R0ExZFE7O0FBZ2VsQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgMDAwICAgXG5cbnsga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuUHVzaGFibGUgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5UaW1lciAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkJ1bGxldCAgICAgPSByZXF1aXJlICcuL2J1bGxldCdcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgQm90IGV4dGVuZHMgUHVzaGFibGVcbiAgICAgICAgXG4gICAgQDogKCkgLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBvcmllbnRhdGlvbiAgICAgICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBcbiAgICAgICAgQGxhc3RBY3Rpb25EZWx0YSA9IDAuMFxuICAgICAgICAgICAgXG4gICAgICAgIEBsZWZ0X3RpcmVfcm90ICAgPSAwLjBcbiAgICAgICAgQHJpZ2h0X3RpcmVfcm90ICA9IDAuMFxuICAgICAgICAgICAgXG4gICAgICAgIEBtaW5Nb3ZlcyA9IDEwMFxuXG4gICAgICAgIEBtb3ZlICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBzaG9vdCAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgPSBmYWxzZVxuICAgICAgICBAZGllZCAgICAgICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBAbW92ZV9hY3Rpb24gICA9IG51bGxcbiAgICAgICAgQHJvdGF0ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAZGlyX3NnbiAgICAgICA9IDEuMFxuICAgICAgICBcbiAgICAgICAgc3VwZXIgXG5cbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GT1JXQVJELCAgICAgIFwibW92ZSBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9VUCwgICAgIFwiY2xpbWIgdXBcIiAgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5DTElNQl9ET1dOLCAgIFwiY2xpbWIgZG93blwiICAgICA1MDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX0xFRlQsICAgIFwidHVybiBsZWZ0XCIgICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5UVVJOX1JJR0hULCAgIFwidHVybiByaWdodFwiICAgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QLCAgICAgICAgIFwianVtcFwiICAgICAgICAgICAxMjBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIFwianVtcCBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GQUxMX0ZPUldBUkQsIFwiZmFsbCBmb3J3YXJkXCIgICAyMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5TSE9PVCwgICAgICAgIFwic2hvb3RcIiAgICAgICAgICAyMDAgQWN0aW9uLlJFUEVBVFxuICAgIFxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5GQUxMKS5kdXJhdGlvbiA9IDEyMFxuICAgICAgICBAYWRkRXZlbnRXaXRoTmFtZSBcImRpZWRcIlxuICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgNTAwXG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIFxuICAgICAgICB0aXJlUmFkaXVzID0gMC4wNVxuICAgICAgICBub3NlID0gbmV3IFRIUkVFLkNvbmVHZW9tZXRyeSAwLjQwNCwgMC41LCAzMiwgMTYsIHRydWVcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMTYsIE1hdGguUElcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAwLjUsIDMyLCAzMiwgMCwgMipNYXRoLlBJLCAwLCAyLjJcbiAgICAgICAgXG4gICAgICAgIG5tYXRyID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgICAgICB0cmFucyA9IG5ldyBUSFJFRS5WZWN0b3IzIDAsLTAuNTQzLDBcbiAgICAgICAgcm90ICAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpLnNldEZyb21FdWxlciBuZXcgVEhSRUUuRXVsZXIgVmVjdG9yLkRFRzJSQUQoMTgwKSwgMCwgMFxuICAgICAgICBcbiAgICAgICAgbm1hdHIuY29tcG9zZSB0cmFucywgcm90LCBuZXcgVEhSRUUuVmVjdG9yMyAxLDEsMVxuICAgICAgICBnZW9tLm1lcmdlIG5vc2UsIG5tYXRyXG4gICAgICAgIGdlb20ucm90YXRlWCBWZWN0b3IuREVHMlJBRCAtOTBcbiAgICAgICAgZ2VvbS5zY2FsZSAwLjcsIDAuNywgMC43XG4gICAgICAgICAgIFxuICAgICAgICBNdXRhbnQgPSByZXF1aXJlICcuL211dGFudCcgICAgICAgICBcbiAgICAgICAgbXV0YW50ID0gQCBpbnN0YW5jZW9mIE11dGFudFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIG11dGFudCBhbmQgTWF0ZXJpYWwubXV0YW50LmNsb25lKCkgb3IgTWF0ZXJpYWwucGxheWVyXG5cbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5IDAuNS10aXJlUmFkaXVzLCB0aXJlUmFkaXVzLCAxNiwgMzJcbiAgICAgICAgZ2VvbS5zY2FsZSAxLDEsMi41XG4gICAgICAgIHRpcmVNYXQgPSBtdXRhbnQgYW5kIE1hdGVyaWFsLm11dGFudFRpcmUuY2xvbmUoKSBvciBNYXRlcmlhbC50aXJlXG4gICAgICAgIEBsZWZ0VGlyZSA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIHRpcmVNYXRcbiAgICAgICAgQGxlZnRUaXJlLnBvc2l0aW9uLnNldCAwLjM1LDAsMCBcbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCAwLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQG1lc2guYWRkIEBsZWZ0VGlyZVxuXG4gICAgICAgIEByaWdodFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEByaWdodFRpcmUucG9zaXRpb24uc2V0IC0wLjM1LDAsMCBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgdGlyZU1hdCA9IEBsZWZ0VGlyZS5tYXRlcmlhbFxuICAgICAgICBib3RNYXQgPSBAbWVzaC5tYXRlcmlhbFxuICAgICAgICB0aXJlTWF0LnZpc2libGUgPSBvcGFjaXR5ID4gMFxuICAgICAgICB0aXJlTWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICAgICAgdGlyZU1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbiAgICBnZXREb3duOiAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1lcbiAgICBnZXRVcDogICAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci51bml0WVxuICAgIGdldERpcjogKGRpcj1AZGlyX3NnbikgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBuZXcgVmVjdG9yIDAsMCxkaXJcbiAgXG4gICAgY3VycmVudFBvczogIC0+IEBjdXJyZW50X3Bvc2l0aW9uLmNsb25lKClcbiAgICBjdXJyZW50RGlyOiAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0Wikubm9ybWFsKClcbiAgICBjdXJyZW50VXA6ICAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WSkubm9ybWFsKClcbiAgICBjdXJyZW50TGVmdDogLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WCkubm9ybWFsKClcblxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBkaWU6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICAgICBAbW92ZSAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgPSBmYWxzZVxuICAgIFxuICAgICAgICBAZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBAZGllZCAgPSB0cnVlXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICByZXNldDogKCkgLT5cbiAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgXG4gICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICBAb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgQG1vdmUgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgID0gZmFsc2VcbiAgICBcbiAgICBpc0ZhbGxpbmc6IC0+IEBtb3ZlX2FjdGlvbiBhbmQgQG1vdmVfYWN0aW9uLmlkID09IEFjdGlvbi5GQUxMXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIG5ld1BvcyA9IG5ldyBQb3MgQHBvc2l0aW9uIFxuICAgICAgICAjIGtsb2cgXCJpbml0QWN0aW9uICN7YWN0aW9uLm5hbWV9IHBvc1wiLCBuZXdQb3NcbiAgICAgICAgIyBrbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QICAgICAgICAgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkQgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVAgICAgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldERvd24oKS5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgbmV3UG9zLmFkZCBAZ2V0RG93bigpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG5vdCBuZXdQb3MuZXFsIG5ldyBQb3MgQHBvc2l0aW9uXG4gICAgICAgICAgICAjIGtsb2cgJ2JvdC5pbml0QWN0aW9uIG9iamVjdFdpbGxNb3ZlVG9Qb3M6JywgbmV3UG9zXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIEAsIG5ld1BvcywgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMCAgICAgMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVsVGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKCkgICMgfiBAY3VycmVudCAvIEBnZXREdXJhdGlvbigpIFxuICAgICAgICBkbHRUaW1lICA9IGFjdGlvbi5nZXRSZWxhdGl2ZURlbHRhKCkgIyAoQGN1cnJlbnQtQGxhc3QpIC8gQGdldER1cmF0aW9uKClcbiAgICBcbiAgICAgICAgQGxhc3RBY3Rpb25EZWx0YSA9IGRsdFRpbWVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uYXRTdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogZGx0VGltZSlcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIGRsdFRpbWUpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYykgXG4gICAgICAgICAgICAgICAgIyBpZiBhY3Rpb24udGFrZW5cbiAgICAgICAgICAgICAgICAgICAgIyBrbG9nICd0YWtlbicgcmVsVGltZSwgYWN0aW9uLnRha2VuXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGtsb2cgJ3N0aWxsIG5lZWRlZD8nXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWUvMlxuICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogZGx0VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIGRsdFRpbWVcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lIDw9IDAuMlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwgKHJlbFRpbWUvMC4yKS8yXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVsVGltZSA+PSAwLjgpXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpLm11bCAwLjUrKHJlbFRpbWUtMC44KS8wLjIvMlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIChyZWxUaW1lLTAuMikvMC42ICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIHJvdFZlYyA9IChAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbikucm90YXRlIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzKEBnZXREb3duKCkpLnBsdXMocm90VmVjKS5tdWwgMC41XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uVFVSTl9MRUZUXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uID09IG51bGwgYW5kIGFjdGlvbi5hdFN0YXJ0KCkgIyBpZiBub3QgcGVyZm9ybWluZyBtb3ZlIGFjdGlvbiBhbmQgc3RhcnQgb2Ygcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB1cGRhdGUgQG9yaWVudGF0aW9uIG5vdywgc28gbmV4dCBtb3ZlIGFjdGlvbiB3aWxsIG1vdmUgaW4gZGVzaXJlZCBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgIFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAtZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gIGRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIDkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAgZGx0VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gLWRsdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGZpbmlzaEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICBcbiAgICAgICAgIyBrbG9nIFwiQm90LmZpbmlzaEFjdGlvbiAje2FjdGlvbi5pZH0gI3thY3Rpb24ubmFtZX1cIiBpZiBhY3Rpb24ubmFtZSAhPSAnbm9vcCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCwgQWN0aW9uLlNIT09UXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5QVVNILCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFRcbiAgICAgICAgICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gIyBib3QgY3VycmVudGx5IHBlcmZvcm1pbmcgYSBtb3ZlIGFjdGlvbiAtPiBzdG9yZSByb3RhdGlvbiBpbiBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IEByZXN0X29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBtYXRyaXhcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIGFjdGlvbi5pZCA+IEFjdGlvbi5TSE9PVFxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24gIyB1cGRhdGUgY2xpbWIgQG9yaWVudGF0aW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcm90YXRlX2FjdGlvbiBhbmQgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgIyBib3QgaXMgY3VycmVudGx5IHBlcmZvcm1pbmcgYSByb3RhdGlvbiAtPlxuICAgICAgICAgICAgIyB0YWtlIG92ZXIgcmVzdWx0IG9mIHJvdGF0aW9uIHRvIHByZXZlbnQgc2xpZGluZ1xuICAgICAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3Rvcig5MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvcigtOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICB0YXJnZXRQb3MgPSBAY3VycmVudF9wb3NpdGlvbi5yb3VuZCgpXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RNb3ZlZCBALCBAcG9zaXRpb24sIHRhcmdldFBvcyAjIHVwZGF0ZSB3b3JsZCBAcG9zaXRpb25cbiAgICAgICAgICAgIEBwb3NpdGlvbiA9IHRhcmdldFBvc1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgYW5kIEByb3RhdGVfYWN0aW9uID09IG51bGwgIyBpZiBub3QganVtcGluZyBmb3J3YXJkXG4gICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIEBvcmllbnRhdGlvblxuICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAje2FjdGlvbi5uYW1lfSAje2FjdGlvbi5pZH1cIlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSCBhbmQgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgIGtsb2cgJ3N1cGVyIChQdXNoYWJsZSkgYWN0aW9uISdcbiAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj8gIyBhY3Rpb24gd2FzIG5vdCBhIG1vdmUgYWN0aW9uIC0+IHJldHVyblxuICAgICAgICAgICAgIyBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgd2FzIG5vdCBhIG1vdmUgYWN0aW9uISdcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgZmluZCBuZXh0IGFjdGlvbiBkZXBlbmRpbmcgb24gdHlwZSBvZiBmaW5pc2hlZCBhY3Rpb24gYW5kIHN1cnJvdW5kaW5nIGVudmlyb25tZW50XG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLm1pbnVzIEBnZXRVcCgpICMgYmVsb3cgZm9yd2FyZCB3aWxsIGFsc28gYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnIEBnZXRQb3MoKSwgMC4yNSBcbiAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIHdpbGwgbm90IGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5taW51cyBAZ2V0VXAoKSAgIyBiZWxvdyBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJyBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIGJlbG93IGVtcHR5Jywgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpLCBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICBpZiBAbW92ZSAjIHN0aWNreSBpZiBtb3ZpbmdcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpICAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uP1xuICAgICAgICBcbiAgICAgICAgQHNldFBvc2l0aW9uIEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgQHNldE9yaWVudGF0aW9uIEBjdXJyZW50X29yaWVudGF0aW9uLnJvdW5kKClcblxuICAgICAgICBpZiBAbW92ZSBvciBAanVtcCBvciBAanVtcF9vbmNlXG4gICAgICAgICAgICAjIGtsb2cgJ21vdmVCb3QnIChAanVtcCBhbmQgJ2p1bXAnIG9yICcnKSwgKEBqdW1wX29uY2UgYW5kICdvbmNlJyBvciAnJylcbiAgICAgICAgICAgIEBtb3ZlQm90KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpcl9zZ24gPSAxXG4gICAgICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5OT09QXG4gICAgICAgICAgICAjIGtsb2cgXCJib3QuYWN0aW9uRmluaXNoZWQgJyN7YWN0aW9uLm5hbWV9JyBwb3NpdGlvbjpcIiwgQHBvc2l0aW9uIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLkZPUldBUkQsIEFjdGlvbi5KVU1QX0ZPUldBUkQsIEFjdGlvbi5DTElNQl9ET1dOXVxuICAgICAgICAgICAgIyBrbG9nIFwiYm90LmFjdGlvbkZpbmlzaGVkICcje2FjdGlvbi5uYW1lfScgb3JpZW50YXRpb246XCIsIEBvcmllbnRhdGlvbi5yb3VuZGVkKCkubmFtZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5UVVJOX0xFRlQsIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uQ0xJTUJfVVBdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdvcmxkLmdldFJlYWxPY2N1cGFudEF0UG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpPy5pc011dGFudD8oKVxuICAgICAgICAgICAgICAgICMga2VlcCBhY3Rpb24gY2hhaW4gZmxvd2luZyBpbiBvcmRlciB0byBkZXRlY3QgZW52aXJvbm1lbnQgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBtdXRhbnQgYmVsb3c6IHN0YXJ0VGltZWRBY3Rpb24gTk9PUCdcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgMFxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cbiAgICAgICAgIyBrbG9nICdtb3ZlQm90JyBAbW92ZSwgQG1vdmVfYWN0aW9uXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgZm9yd2FyZFBvcyA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKVxuICAgICAgICBpZiBAbW92ZSBhbmQgKEBqdW1wIG9yIEBqdW1wX29uY2UpIGFuZCAgICAjIGp1bXAgbW9kZSBvciBqdW1wIGFjdGl2YXRlZCB3aGlsZSBtb3ZpbmdcbiAgICAgICAgICAgICMgQGRpcl9zZ24gPT0gMS4wIGFuZCAgICAgICAgICAgICAgICAgICAgICMgYW5kIG1vdmluZyBmb3J3YXJkXG4gICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkpICAjIGFuZCBhYm92ZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcykgICMgZm9yd2FyZCBhbmQgYWJvdmUgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0pVTVAnXG4gICAgICAgICAgICAgICAgZWxzZSAjIG5vIHNwYWNlIHRvIGp1bXAgZm9yd2FyZCAtPiBqdW1wIHVwXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICBcbiAgICAgICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgQG1lc2gucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvblxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgQGN1cnJlbnRfb3JpZW50YXRpb25cbiAgICAgICAgQGxlZnRUaXJlLnJvdGF0aW9uLnNldCBWZWN0b3IuREVHMlJBRCgxODAqQGxlZnRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCg5MCksIDBcbiAgICAgICAgQHJpZ2h0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkByaWdodF90aXJlX3JvdCksIFZlY3Rvci5ERUcyUkFEKC05MCksIDBcblxubW9kdWxlLmV4cG9ydHMgPSBCb3RcbiJdfQ==
//# sourceURL=../coffee/bot.coffee