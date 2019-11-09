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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2RUFBQTtJQUFBOzs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUNYLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBQ2IsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixHQUFBLEdBQWEsT0FBQSxDQUFRLFdBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUVQOzs7SUFFQyxhQUFBO1FBRUMsSUFBQyxDQUFBLFNBQUQsR0FBdUIsSUFBSTtRQUMzQixJQUFDLENBQUEsV0FBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxrQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxpQkFBRCxHQUF1QixJQUFJO1FBQzNCLElBQUMsQ0FBQSxnQkFBRCxHQUF1QixJQUFJO1FBRTNCLElBQUMsQ0FBQSxhQUFELEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQW1CO1FBRW5CLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFFWixJQUFDLENBQUEsSUFBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLElBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFDZCxJQUFDLENBQUEsS0FBRCxHQUFjO1FBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxJQUFELEdBQWM7UUFFZCxJQUFDLENBQUEsV0FBRCxHQUFpQjtRQUNqQixJQUFDLENBQUEsYUFBRCxHQUFpQjtRQUVqQixJQUFDLENBQUEsT0FBRCxH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SUEsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBakIsQ0FBc0IsSUFBQyxDQUFBLG1CQUF2QjtRQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQW5CLENBQXVCLE1BQU0sQ0FBQyxPQUFQLENBQWUsR0FBQSxHQUFJLElBQUMsQ0FBQSxhQUFwQixDQUF2QixFQUEyRCxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBM0QsRUFBK0UsQ0FBL0U7ZUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFwQixDQUF3QixNQUFNLENBQUMsT0FBUCxDQUFlLEdBQUEsR0FBSSxJQUFDLENBQUEsY0FBcEIsQ0FBeEIsRUFBNkQsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLEVBQWhCLENBQTdELEVBQWtGLENBQWxGO0lBUEU7Ozs7R0FoZFE7O0FBeWRsQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgICAwMDAwMDAwICAgICAgMDAwICAgXG5cbnsga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuUHVzaGFibGUgICA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5UaW1lciAgICAgID0gcmVxdWlyZSAnLi90aW1lcidcbkJ1bGxldCAgICAgPSByZXF1aXJlICcuL2J1bGxldCdcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgQm90IGV4dGVuZHMgUHVzaGFibGVcbiAgICAgICAgXG4gICAgQDogLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBvcmllbnRhdGlvbiAgICAgICAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBAcm90YXRlX29yaWVudGF0aW9uICA9IG5ldyBRdWF0ZXJuaW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiAgID0gbmV3IFF1YXRlcm5pb25cbiAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gICAgPSBuZXcgUXVhdGVybmlvblxuICAgICAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgICAgICAgICBcbiAgICAgICAgQG1pbk1vdmVzID0gMTAwXG5cbiAgICAgICAgQG1vdmUgICAgICAgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgICAgICA9IGZhbHNlXG4gICAgICAgIEBqdW1wICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgPSBmYWxzZVxuICAgICAgICBAanVtcF9vbmNlICA9IGZhbHNlXG4gICAgICAgIEBkaWVkICAgICAgID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgID0gbnVsbFxuICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIEBkaXJfc2duICAgICAgID0gMS4wXG4gICAgICAgIFxuICAgICAgICBzdXBlciBcblxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZPUldBUkQsICAgICAgXCJtb3ZlIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX1VQLCAgICAgXCJjbGltYiB1cFwiICAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkNMSU1CX0RPV04sICAgXCJjbGltYiBkb3duXCIgICAgIDUwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fTEVGVCwgICAgXCJ0dXJuIGxlZnRcIiAgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlRVUk5fUklHSFQsICAgXCJ0dXJuIHJpZ2h0XCIgICAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVAsICAgICAgICAgXCJqdW1wXCIgICAgICAgICAgIDEyMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkpVTVBfRk9SV0FSRCwgXCJqdW1wIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZBTExfRk9SV0FSRCwgXCJmYWxsIGZvcndhcmRcIiAgIDIwMFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlNIT09ULCAgICAgICAgXCJzaG9vdFwiICAgICAgICAgIDIwMCBBY3Rpb24uUkVQRUFUXG4gICAgXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLkZBTEwpLmR1cmF0aW9uID0gMTIwXG4gICAgICAgIEBhZGRFdmVudFdpdGhOYW1lIFwiZGllZFwiXG4gICAgXG4gICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLk5PT1ApLCA1MDBcbiAgICAgICAgXG4gICAgY3JlYXRlTWVzaDogLT5cbiAgICAgICAgXG4gICAgICAgIHRpcmVSYWRpdXMgPSAwLjA1XG4gICAgICAgIG5vc2UgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5IDAuNDA0IDAuNSAzMiAxNiB0cnVlXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41IDMyIDMyIDE2ICBNYXRoLlBJXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC41IDMyIDMyIDAgMipNYXRoLlBJLCAwIDIuMlxuICAgICAgICBcbiAgICAgICAgbm1hdHIgPSBuZXcgVEhSRUUuTWF0cml4NCgpXG4gICAgICAgIHRyYW5zID0gbmV3IFRIUkVFLlZlY3RvcjMgMCwtMC41NDMsMFxuICAgICAgICByb3QgICA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCkuc2V0RnJvbUV1bGVyIG5ldyBUSFJFRS5FdWxlciBWZWN0b3IuREVHMlJBRCgxODApLCAwIDBcbiAgICAgICAgXG4gICAgICAgIG5tYXRyLmNvbXBvc2UgdHJhbnMsIHJvdCwgbmV3IFRIUkVFLlZlY3RvcjMgMSAxIDFcbiAgICAgICAgZ2VvbS5tZXJnZSBub3NlLCBubWF0clxuICAgICAgICBnZW9tLnJvdGF0ZVggVmVjdG9yLkRFRzJSQUQgLTkwXG4gICAgICAgIGdlb20uc2NhbGUgMC43IDAuNyAwLjdcbiAgICAgICAgICAgXG4gICAgICAgIE11dGFudCA9IHJlcXVpcmUgJy4vbXV0YW50JyAgICAgICAgIFxuICAgICAgICBtdXRhbnQgPSBAIGluc3RhbmNlb2YgTXV0YW50XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnQuY2xvbmUoKSBvciBNYXRlcmlhbC5wbGF5ZXJcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkgMC41LXRpcmVSYWRpdXMsIHRpcmVSYWRpdXMsIDE2IDMyXG4gICAgICAgIGdlb20uc2NhbGUgMSAxIDIuNVxuICAgICAgICB0aXJlTWF0ID0gbXV0YW50IGFuZCBNYXRlcmlhbC5tdXRhbnRUaXJlLmNsb25lKCkgb3IgTWF0ZXJpYWwudGlyZVxuICAgICAgICBAbGVmdFRpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCB0aXJlTWF0XG4gICAgICAgIEBsZWZ0VGlyZS5wb3NpdGlvbi5zZXQgMC4zNSAwIDAgXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgMCwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEBtZXNoLmFkZCBAbGVmdFRpcmVcblxuICAgICAgICBAcmlnaHRUaXJlID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgdGlyZU1hdFxuICAgICAgICBAcmlnaHRUaXJlLnBvc2l0aW9uLnNldCAtMC4zNSAwIDAgXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IDAgVmVjdG9yLkRFRzJSQUQoLTkwKSwgMFxuICAgICAgICBAbWVzaC5hZGQgQHJpZ2h0VGlyZVxuXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSBAcmlnaHRUaXJlLmNhc3RTaGFkb3cgPSBAbGVmdFRpcmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IEBsZWZ0VGlyZS5yZWNlaXZlU2hhZG93ID0gQHJpZ2h0VGlyZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZSBcbiAgICAgICAgICAgIFxuICAgIHNldE9wYWNpdHk6IChvcGFjaXR5KSAtPiBcbiAgICAgICAgdGlyZU1hdCA9IEBsZWZ0VGlyZS5tYXRlcmlhbFxuICAgICAgICBib3RNYXQgPSBAbWVzaC5tYXRlcmlhbFxuICAgICAgICB0aXJlTWF0LnZpc2libGUgPSBvcGFjaXR5ID4gMFxuICAgICAgICB0aXJlTWF0LmRlcHRoV3JpdGUgPSBvcGFjaXR5ID4gMC41XG4gICAgICAgIGJvdE1hdC5kZXB0aFdyaXRlID0gb3BhY2l0eSA+IDAuNVxuICAgICAgICBib3RNYXQub3BhY2l0eSA9IG9wYWNpdHlcbiAgICAgICAgdGlyZU1hdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbiAgICBnZXREb3duOiAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1lcbiAgICBnZXRVcDogICAtPiBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci51bml0WVxuICAgIGdldERpcjogKGRpcj1AZGlyX3NnbikgLT4gQG9yaWVudGF0aW9uLnJvdGF0ZSBuZXcgVmVjdG9yIDAsMCxkaXJcbiAgXG4gICAgY3VycmVudFBvczogIC0+IEBjdXJyZW50X3Bvc2l0aW9uLmNsb25lKClcbiAgICBjdXJyZW50RGlyOiAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0Wikubm9ybWFsKClcbiAgICBjdXJyZW50VXA6ICAgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WSkubm9ybWFsKClcbiAgICBjdXJyZW50TGVmdDogLT4gQGN1cnJlbnRfb3JpZW50YXRpb24ucm90YXRlKFZlY3Rvci51bml0WCkubm9ybWFsKClcblxuICAgICMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDBcbiAgICBcbiAgICBkaWU6ICgpIC0+XG4gICAgICAgIFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICAgICBAbW92ZSAgPSBmYWxzZVxuICAgICAgICBAanVtcCAgPSBmYWxzZVxuICAgICAgICBAc2hvb3QgPSBmYWxzZVxuICAgICAgICBAcHVzaCAgPSBmYWxzZVxuICAgIFxuICAgICAgICBAZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikudHJpZ2dlckFjdGlvbnMoKVxuICAgICAgICBAZGllZCAgPSB0cnVlXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAgICAwMDAgICBcbiAgICBcbiAgICByZXNldDogKCkgLT5cbiAgICBcbiAgICAgICAgQGxlZnRfdGlyZV9yb3QgICA9IDAuMFxuICAgICAgICBAcmlnaHRfdGlyZV9yb3QgID0gMC4wXG4gICAgXG4gICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICBAb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAY2xpbWJfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICBAcmVzdF9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgXG4gICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgQG1vdmUgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHB1c2ggICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXAgICAgICAgID0gZmFsc2VcbiAgICAgICAgQHNob290ICAgICAgID0gZmFsc2VcbiAgICAgICAgQGp1bXBfb25jZSAgID0gZmFsc2VcbiAgICAgICAgQGRpZWQgICAgICAgID0gZmFsc2VcbiAgICBcbiAgICBpc0ZhbGxpbmc6IC0+IEBtb3ZlX2FjdGlvbiBhbmQgQG1vdmVfYWN0aW9uLmlkID09IEFjdGlvbi5GQUxMXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIG5ld1BvcyA9IG5ldyBQb3MgQHBvc2l0aW9uIFxuICAgICAgICAjIGtsb2cgXCJpbml0QWN0aW9uICN7YWN0aW9uLm5hbWV9IHBvc1wiLCBuZXdQb3NcbiAgICAgICAgIyBrbG9nIFwiaW5pdEFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5OT09QICAgICAgICAgdGhlbiByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZPUldBUkQgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldERpcigpXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5DTElNQl9ET1dOICAgdGhlbiBuZXdQb3MuYWRkIEBnZXREaXIoKS5wbHVzIEBnZXREb3duKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVAgICAgICAgICB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkpVTVBfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldFVwKCkucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExfRk9SV0FSRCB0aGVuIG5ld1Bvcy5hZGQgQGdldERvd24oKS5wbHVzIEBnZXREaXIoKVxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZGlyZWN0aW9uLmlzWmVybygpXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvbiBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgbmV3UG9zLmFkZCBAZ2V0RG93bigpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIG5vdCBuZXdQb3MuZXFsIG5ldyBQb3MgQHBvc2l0aW9uXG4gICAgICAgICAgICAjIGtsb2cgJ2JvdC5pbml0QWN0aW9uIG9iamVjdFdpbGxNb3ZlVG9Qb3M6JywgbmV3UG9zXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RXaWxsTW92ZVRvUG9zIEAsIG5ld1BvcywgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMCAgICAgMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjIDAwMCAgICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVsVGltZSAgPSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKCkgICMgfiBAY3VycmVudCAvIEBnZXREdXJhdGlvbigpIFxuICAgICAgICByb3RUaW1lICA9IChhY3Rpb24uY3VycmVudC1hY3Rpb24ubGFzdCkgLyBwYXJzZUludCgxMCphY3Rpb24uZHVyYXRpb24vNilcbiAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uU0hPT1RcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uYXRTdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCB0aGVuIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GT1JXQVJEXG4gICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogcm90VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIHJvdFRpbWVcbiAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uSlVNUFxuXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYylcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgc2luRmFjID0gTWF0aC5zaW4gTWF0aC5QSS8yICogcmVsVGltZVxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAxIC0gTWF0aC5jb3MoTWF0aC5QSS8yICogcm90VGltZSlcbiAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gMSAtIE1hdGguY29zKE1hdGguUEkvMiAqIHJvdFRpbWUpXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldFVwKCkubXVsKHNpbkZhYykgXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMX0ZPUldBUkRcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubXVsKHJlbFRpbWUpLnBsdXMgQGdldERvd24oKS5tdWwocmVsVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkZBTExcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGtsb2cgJ3N0aWxsIG5lZWRlZD8nXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpLm11bChyZWxUaW1lKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSBAZGlyX3NnbiAqIHJvdFRpbWUvMlxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIHJvdFRpbWUvMlxuICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiByZWxUaW1lICogLTkwLjAsIFZlY3Rvci51bml0WFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkNMSU1CX0RPV05cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgQGxlZnRfdGlyZV9yb3QgICs9IEBkaXJfc2duICogcm90VGltZVxuICAgICAgICAgICAgICAgIEByaWdodF90aXJlX3JvdCArPSBAZGlyX3NnbiAqIHJvdFRpbWVcbiAgICAgICAgICAgICAgICBpZiByZWxUaW1lIDw9IDAuMlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5tdWwgKHJlbFRpbWUvMC4yKS8yXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVsVGltZSA+PSAwLjgpXG4gICAgICAgICAgICAgICAgICAgIEBjbGltYl9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgQGRpcl9zZ24gKiA5MC4wLCBWZWN0b3IudW5pdFhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkucGx1cyBAZ2V0RG93bigpLm11bCAwLjUrKHJlbFRpbWUtMC44KS8wLjIvMlxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNsaW1iX29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBAZGlyX3NnbiAqIChyZWxUaW1lLTAuMikvMC42ICogOTAuMCwgVmVjdG9yLnVuaXRYXG4gICAgICAgICAgICAgICAgICAgIHJvdFZlYyA9IChAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbikucm90YXRlIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5wbHVzKEBnZXREb3duKCkpLnBsdXMocm90VmVjKS5tdWwgMC41XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5UVVJOX1JJR0hULCBBY3Rpb24uVFVSTl9MRUZUXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vdmVfYWN0aW9uID09IG51bGwgYW5kIGFjdGlvbi5hdFN0YXJ0KCkgIyBpZiBub3QgcGVyZm9ybWluZyBtb3ZlIGFjdGlvbiBhbmQgc3RhcnQgb2Ygcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgIyB1cGRhdGUgQG9yaWVudGF0aW9uIG5vdywgc28gbmV4dCBtb3ZlIGFjdGlvbiB3aWxsIG1vdmUgaW4gZGVzaXJlZCBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgOTAuMCwgVmVjdG9yLnVuaXRZXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgLTkwLjAsIFZlY3Rvci51bml0WVxuICAgICAgICAgICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIDkwLjAsIFZlY3Rvci51bml0WVxuICAgIFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uVFVSTl9MRUZUXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAtcm90VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gIHJvdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIDkwLjAsIFZlY3Rvci51bml0WSBcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBsZWZ0X3RpcmVfcm90ICArPSAgcm90VGltZVxuICAgICAgICAgICAgICAgICAgICBAcmlnaHRfdGlyZV9yb3QgKz0gLXJvdFRpbWVcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbiA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgcmVsVGltZSAqIC05MC4wLCBWZWN0b3IudW5pdFkgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEBjbGltYl9vcmllbnRhdGlvbi5tdWwgQHJvdGF0ZV9vcmllbnRhdGlvbi5tdWwgQHJlc3Rfb3JpZW50YXRpb25cbiAgICBcbiAgICAjIDAwMDAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgMDAwMDAwICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGZpbmlzaEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICBcbiAgICAgICAgIyBrbG9nIFwiQm90LmZpbmlzaEFjdGlvbiAje2FjdGlvbi5pZH0gI3thY3Rpb24ubmFtZX1cIiBpZiBhY3Rpb24ubmFtZSAhPSAnbm9vcCdcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uTk9PUCwgQWN0aW9uLlNIT09UXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5QVVNILCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLlRVUk5fTEVGVCwgQWN0aW9uLlRVUk5fUklHSFRcbiAgICAgICAgICAgICAgICBAcm90YXRlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgICAgICBpZiBAbW92ZV9hY3Rpb24gIyBib3QgY3VycmVudGx5IHBlcmZvcm1pbmcgYSBtb3ZlIGFjdGlvbiAtPiBzdG9yZSByb3RhdGlvbiBpbiBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICBAcmVzdF9vcmllbnRhdGlvbiA9IEByZXN0X29yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIEByb3RhdGVfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAcm90YXRlX29yaWVudGF0aW9uLm11bCBAcmVzdF9vcmllbnRhdGlvbiAjIHVwZGF0ZSByb3RhdGlvbiBtYXRyaXhcbiAgICAgICAgICAgICAgICAgICAgQHJvdGF0ZV9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uLnJlc2V0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIGFjdGlvbi5pZCA+IEFjdGlvbi5TSE9PVFxuICAgICAgICBcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgQG9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uLm11bCBAY2xpbWJfb3JpZW50YXRpb24gIyB1cGRhdGUgY2xpbWIgQG9yaWVudGF0aW9uXG4gICAgICAgIEBjbGltYl9vcmllbnRhdGlvbi5yZXNldCgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcm90YXRlX2FjdGlvbiBhbmQgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgIyBib3QgaXMgY3VycmVudGx5IHBlcmZvcm1pbmcgYSByb3RhdGlvbiAtPlxuICAgICAgICAgICAgIyB0YWtlIG92ZXIgcmVzdWx0IG9mIHJvdGF0aW9uIHRvIHByZXZlbnQgc2xpZGluZ1xuICAgICAgICAgICAgaWYgQHJvdGF0ZV9hY3Rpb24uaWQgPT0gQWN0aW9uLlRVUk5fTEVGVFxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3Rvcig5MC4wLCBuZXcgVmVjdG9yKDAsMSwwKSkubXVsIEByZXN0X29yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24gPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIC05MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBvcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbi5tdWwgUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvcigtOTAuMCwgbmV3IFZlY3RvcigwLDEsMCkpLm11bCBAcmVzdF9vcmllbnRhdGlvblxuICAgICAgICAgICAgICAgIEByZXN0X29yaWVudGF0aW9uID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciA5MC4wLCBWZWN0b3IudW5pdFkgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLkNMSU1CX1VQXG4gICAgICAgICAgICB0YXJnZXRQb3MgPSBAY3VycmVudF9wb3NpdGlvbi5yb3VuZCgpXG4gICAgICAgICAgICB3b3JsZC5vYmplY3RNb3ZlZCBALCBAcG9zaXRpb24sIHRhcmdldFBvcyAjIHVwZGF0ZSB3b3JsZCBAcG9zaXRpb25cbiAgICAgICAgICAgIEBwb3NpdGlvbiA9IHRhcmdldFBvc1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5KVU1QX0ZPUldBUkQgYW5kIEByb3RhdGVfYWN0aW9uID09IG51bGwgIyBpZiBub3QganVtcGluZyBmb3J3YXJkXG4gICAgICAgICAgICBAb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24ubXVsIEByZXN0X29yaWVudGF0aW9uICMgdXBkYXRlIHJvdGF0aW9uIEBvcmllbnRhdGlvblxuICAgICAgICAgICAgQHJlc3Rfb3JpZW50YXRpb24ucmVzZXQoKVxuICAgIFxuICAgICMgMDAwMDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAwMDAwMDAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgICMga2xvZyBcImJvdC5hY3Rpb25GaW5pc2hlZCAje2FjdGlvbi5uYW1lfSAje2FjdGlvbi5pZH1cIlxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSCBhbmQgbm90IEBkaXJlY3Rpb24uaXNaZXJvKClcbiAgICAgICAgICAgIGtsb2cgJ3N1cGVyIChQdXNoYWJsZSkgYWN0aW9uISdcbiAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj8gIyBhY3Rpb24gd2FzIG5vdCBhIG1vdmUgYWN0aW9uIC0+IHJldHVyblxuICAgICAgICAgICAgIyBrbG9nICdib3QuYWN0aW9uRmluaXNoZWQgd2FzIG5vdCBhIG1vdmUgYWN0aW9uISdcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgXG4gICAgICAgICMgZmluZCBuZXh0IGFjdGlvbiBkZXBlbmRpbmcgb24gdHlwZSBvZiBmaW5pc2hlZCBhY3Rpb24gYW5kIHN1cnJvdW5kaW5nIGVudmlyb25tZW50XG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uSlVNUF9GT1JXQVJEXG4gICAgICAgICAgICBmb3J3YXJkUG9zID0gQHBvc2l0aW9uLnBsdXMgQGdldERpcigpXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcyAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLm1pbnVzIEBnZXRVcCgpICMgYmVsb3cgZm9yd2FyZCB3aWxsIGFsc28gYmUgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTF9GT1JXQVJEXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnIEBnZXRQb3MoKSwgMC4yNSBcbiAgICAgICAgICAgIGVsc2UgIyBmb3J3YXJkIHdpbGwgbm90IGJlIGVtcHR5XG4gICAgICAgICAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIEBwb3NpdGlvbi5taW51cyBAZ2V0VXAoKSAgIyBiZWxvdyBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJyBAZ2V0UG9zKCksIDAuNVxuICAgICAgICBlbHNlIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpICAjIGJlbG93IHdpbGwgYmUgZW1wdHlcbiAgICAgICAgICAgICMga2xvZyAnYm90LmFjdGlvbkZpbmlzaGVkIGJlbG93IGVtcHR5Jywgd29ybGQuaXNVbm9jY3VwaWVkUG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpLCBAcG9zaXRpb24ucGx1cyBAZ2V0RG93bigpXG4gICAgICAgICAgICBpZiBAbW92ZSAjIHN0aWNreSBpZiBtb3ZpbmdcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgQGdldERpcigpICAjIGZvcndhcmQgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgICAgICAjIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBmb3J3YXJkIGVtcHR5J1xuICAgICAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc09jY3VwaWVkUG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKS5taW51cyBAZ2V0VXAoKSAjIGJlbG93IGZvcndhcmQgaXMgc29saWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKCkubWludXMgQGdldFVwKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3Qgb2NjdXBhbnQ/IG9yIG5vdCBvY2N1cGFudD8uaXNTbGlwcGVyeSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBnZXREaXIoKSBcbiAgICAgICAgICAgICAgICAgICAgaWYgbm90IG9jY3VwYW50PyBvciBub3Qgb2NjdXBhbnQ/LmlzU2xpcHBlcnkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uQ0xJTUJfVVBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IEBnZXREb3duKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5GQUxMX0ZPUldBUkQsIEFjdGlvbi5GQUxMXSAjIGxhbmRlZFxuICAgICAgICAgICAgaWYgQG5hbWUgPT0gJ3BsYXllcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPVF9MQU5EJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0xBTkQnLCBAZ2V0UG9zKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAbW92ZV9hY3Rpb25cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIEByb3RhdGVfYWN0aW9uP1xuICAgICAgICAgICAgICAgIFxuICAgICAgICBAc2V0UG9zaXRpb24gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICBAc2V0T3JpZW50YXRpb24gQGN1cnJlbnRfb3JpZW50YXRpb24ucm91bmQoKVxuXG4gICAgICAgIGlmIEBtb3ZlIG9yIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIEBtb3ZlQm90KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpcl9zZ24gPSAxXG4gICAgICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgaWYgYWN0aW9uLmlkICE9IEFjdGlvbi5OT09QXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdvcmxkLmdldFJlYWxPY2N1cGFudEF0UG9zKEBwb3NpdGlvbi5wbHVzIEBnZXREb3duKCkpPy5pc011dGFudD8oKVxuICAgICAgICAgICAgICAgICMga2VlcCBhY3Rpb24gY2hhaW4gZmxvd2luZyBpbiBvcmRlciB0byBkZXRlY3QgZW52aXJvbm1lbnQgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGtsb2cgJ2JvdC5hY3Rpb25GaW5pc2hlZCBtdXRhbnQgYmVsb3c6IHN0YXJ0VGltZWRBY3Rpb24gTk9PUCdcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgMFxuXG4gICAgIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCAgIDAwMDAwMDAgXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgICAwICAgICAgMDAwMDAwMDBcbiAgICAgICAgXG4gICAgbW92ZUJvdDogKCkgLT5cblxuICAgICAgICBAbW92ZV9hY3Rpb24gPSBudWxsXG4gICAgICAgIGZvcndhcmRQb3MgPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgaWYgQG1vdmUgYW5kIChAanVtcCBvciBAanVtcF9vbmNlKSBhbmQgICAgIyBqdW1wIG1vZGUgb3IganVtcCBhY3RpdmF0ZWQgd2hpbGUgbW92aW5nXG4gICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoQHBvc2l0aW9uLnBsdXMgQGdldFVwKCkpICAjIGFuZCBhYm92ZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhmb3J3YXJkUG9zLnBsdXMgQGdldFVwKCkpIGFuZFxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5pc1Vub2NjdXBpZWRQb3MoZm9yd2FyZFBvcykgICMgZm9yd2FyZCBhbmQgYWJvdmUgZm9yd2FyZCBhbHNvIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QX0ZPUldBUkRcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0pVTVAnXG4gICAgICAgICAgICAgICAgZWxzZSAjIG5vIHNwYWNlIHRvIGp1bXAgZm9yd2FyZCAtPiBqdW1wIHVwXG4gICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkpVTVBcbiAgICAgICAgZWxzZSBpZiBAbW92ZSBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zICAjIGZvcndhcmQgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgZm9yd2FyZFBvcy5wbHVzIEBnZXREb3duKCkgIFxuICAgICAgICAgICAgICAgICAgICAjIGJlbG93IGZvcndhcmQgYWxzbyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgZWxzZSAjIGZvcndhcmQgZG93biBpcyBzb2xpZFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GT1JXQVJEXG4gICAgICAgICAgICBlbHNlICMgZm9yd2FyZCBpcyBub3QgZW1wdHlcbiAgICAgICAgICAgICAgICBtb3ZlQWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRk9SV0FSRFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoIGFuZCB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgZm9yd2FyZFBvcywgbW92ZUFjdGlvbi5nZXREdXJhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIG1vdmVBY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAjIHBsYXllciBpbiBwdXNoIG1vZGUgYW5kIHB1c2hpbmcgb2JqZWN0IGlzIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBmb3J3YXJkUG9zLnBsdXMgQGdldERvd24oKSAgIyBiZWxvdyBmb3J3YXJkIGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9ET1dOXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG1vdmVBY3Rpb25cbiAgICAgICAgICAgICAgICBlbHNlICMganVzdCBjbGltYiB1cFxuICAgICAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5DTElNQl9VUFxuICAgICAgICBlbHNlIGlmIEBqdW1wIG9yIEBqdW1wX29uY2VcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyhAcG9zaXRpb24ucGx1cyBAZ2V0VXAoKSlcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5KVU1QXG4gICAgICAgIFxuICAgICAgICAjIHJlc2V0IHRoZSBqdW1wIG9uY2UgZmxhZyAoZWl0aGVyIHdlIGp1bXBlZCBvciBpdCdzIG5vdCBwb3NzaWJsZSB0byBqdW1wIGF0IGN1cnJlbnQgQHBvc2l0aW9uKVxuICAgICAgICBAanVtcF9vbmNlID0gZmFsc2UgXG4gICAgXG4gICAgICAgIGlmIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICBcbiAgICAgICAgXG4gICAgc3RlcDogLT5cbiAgICAgICAgaWYgQHRha2VuT2Zmc2V0XG4gICAgICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uLnBsdXMgQHRha2VuT2Zmc2V0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBtZXNoLnBvc2l0aW9uLmNvcHkgQGN1cnJlbnRfcG9zaXRpb25cbiAgICAgICAgQG1lc2gucXVhdGVybmlvbi5jb3B5IEBjdXJyZW50X29yaWVudGF0aW9uXG4gICAgICAgIEBsZWZ0VGlyZS5yb3RhdGlvbi5zZXQgVmVjdG9yLkRFRzJSQUQoMTgwKkBsZWZ0X3RpcmVfcm90KSwgVmVjdG9yLkRFRzJSQUQoOTApLCAwXG4gICAgICAgIEByaWdodFRpcmUucm90YXRpb24uc2V0IFZlY3Rvci5ERUcyUkFEKDE4MCpAcmlnaHRfdGlyZV9yb3QpLCBWZWN0b3IuREVHMlJBRCgtOTApLCAwXG5cbm1vZHVsZS5leHBvcnRzID0gQm90XG4iXX0=
//# sourceURL=../coffee/bot.coffee