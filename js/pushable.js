// koffee 1.4.0
var Action, Item, Pushable, Timer, Vector,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Vector = require('./lib/vector');

Item = require('./item');

Action = require('./action');

Timer = require('./timer');

Pushable = (function(superClass) {
    extend(Pushable, superClass);

    Pushable.prototype.isSpaceEgoistic = function() {
        return true;
    };

    function Pushable() {
        Pushable.__super__.constructor.apply(this, arguments);
        this.pusher = null;
        this.direction = Vector.minusY;
        this.landing_sound = 'STONE_LAND';
        this.pushing_sound = 'STONE_MOVE';
        this.addAction(new Action(this, Action.NOOP, "noop"));
        this.addAction(new Action(this, Action.PUSH, "push", 1));
        this.addAction(new Action(this, Action.FALL, "fall", 40));
    }

    Pushable.prototype.setOrientation = function(q) {
        Pushable.__super__.setOrientation.call(this, q);
        if (this.pusher == null) {
            return this.direction = this.orientation.rotate(Vector.minusZ);
        }
    };

    Pushable.prototype.pushedByObjectInDirection = function(object, dir, duration) {
        var pushAction;
        pushAction = this.getActionWithId(Action.PUSH);
        this.pusher = object;
        this.move_action = pushAction;
        this.direction = new Vector(dir);
        pushAction.duration = world.unmapMsTime(duration);
        return Timer.addAction(pushAction);
    };

    Pushable.prototype.initAction = function(action) {
        var ref;
        if ((ref = action.id) === Action.PUSH || ref === Action.FALL) {
            if (action.id === Action.PUSH) {
                world.playSound(this.pushing_sound);
            }
            world.objectWillMoveToPos(this, this.position.plus(this.direction), action.getDuration());
            return;
        }
        return Pushable.__super__.initAction.call(this, action);
    };

    Pushable.prototype.performAction = function(action) {
        var ref;
        if ((ref = action.id) === Action.PUSH || ref === Action.FALL) {
            this.setCurrentPosition(this.position.plus(this.direction.mul(action.getRelativeTime())));
            return;
        }
        return Pushable.__super__.performAction.call(this, action);
    };

    Pushable.prototype.finishAction = function(action) {
        var ref, targetPos;
        if ((ref = action.id) === Action.PUSH || ref === Action.FALL) {
            this.move_action = null;
            targetPos = this.current_position.round();
            world.objectMoved(this, this.position, targetPos);
            this.setPosition(targetPos);
            return;
        }
        return Pushable.__super__.finishAction.call(this, action);
    };

    Pushable.prototype.actionFinished = function(action) {
        var Bomb, Bot, gravityDir, ref;
        if ((ref = action.id) === Action.PUSH || ref === Action.FALL) {
            Bot = require('./bot');
            Bomb = require('./bomb');
            gravityDir = this.direction;
            if (action.id === Action.PUSH) {
                if (this.pusher instanceof Bot) {
                    gravityDir = this.pusher.getDown();
                } else if (this.pusher instanceof Bomb) {
                    if (this instanceof Bot) {
                        if (this.direction.eql(this.getUp())) {
                            this.direction.reset();
                            return;
                        } else {
                            gravityDir = this.getDown();
                        }
                    } else {
                        this.direction.reset();
                        return;
                    }
                }
            }
            if (world.isUnoccupiedPos(this.position.plus(gravityDir))) {
                this.direction = gravityDir;
                this.move_action = this.getActionWithId(Action.FALL);
                Timer.addAction(this.move_action);
            } else {
                this.direction.reset();
                world.playSound(this.landing_sound, this.position);
            }
            return;
        }
        return Pushable.__super__.actionFinished.call(this, action);
    };

    return Pushable;

})(Item);

module.exports = Pushable;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaGFibGUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHFDQUFBO0lBQUE7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsY0FBUjs7QUFDVCxJQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULEtBQUEsR0FBUyxPQUFBLENBQVEsU0FBUjs7QUFFSDs7O3VCQUVGLGVBQUEsR0FBaUIsU0FBQTtlQUFHO0lBQUg7O0lBRUosa0JBQUE7UUFDVCwyQ0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxTQUFELEdBQWMsTUFBTSxDQUFDO1FBQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCO1FBQ2pCLElBQUMsQ0FBQSxhQUFELEdBQWlCO1FBRWpCLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxJQUFyQixFQUEyQixNQUEzQixDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLElBQXJCLEVBQTJCLE1BQTNCLEVBQW1DLENBQW5DLENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsRUFBbkMsQ0FBWDtJQVRTOzt1QkFXYixjQUFBLEdBQWdCLFNBQUMsQ0FBRDtRQUNaLDZDQUFNLENBQU47UUFDQSxJQUFPLG1CQUFQO21CQUNJLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLE1BQU0sQ0FBQyxNQUEzQixFQURqQjs7SUFGWTs7dUJBS2hCLHlCQUFBLEdBQTJCLFNBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxRQUFkO0FBRXZCLFlB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QUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQTtBQUNBLCtCQVRKO3FCQURDO2lCQUhUOztZQWVBLElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsVUFBZixDQUF0QixDQUFIO2dCQUNJLElBQUMsQ0FBQSxTQUFELEdBQWE7Z0JBQ2IsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEI7Z0JBRWYsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLFdBQWpCLEVBSko7YUFBQSxNQUFBO2dCQU1JLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBO2dCQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxhQUFqQixFQUFnQyxJQUFDLENBQUEsUUFBakMsRUFQSjs7QUFTQSxtQkE1Qko7O2VBNkJBLDZDQUFNLE1BQU47SUE5Qlk7Ozs7R0FyREc7O0FBcUZ2QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgIFxuIyAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cblZlY3RvciA9IHJlcXVpcmUgJy4vbGliL3ZlY3Rvcidcbkl0ZW0gICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgID0gcmVxdWlyZSAnLi90aW1lcidcblxuY2xhc3MgUHVzaGFibGUgZXh0ZW5kcyBJdGVtXG5cbiAgICBpc1NwYWNlRWdvaXN0aWM6IC0+IHRydWVcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgQHB1c2hlciAgICAgPSBudWxsXG4gICAgICAgIEBkaXJlY3Rpb24gID0gVmVjdG9yLm1pbnVzWVxuICAgICAgICBAbGFuZGluZ19zb3VuZCA9ICdTVE9ORV9MQU5EJ1xuICAgICAgICBAcHVzaGluZ19zb3VuZCA9ICdTVE9ORV9NT1ZFJ1xuICAgICAgICBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5OT09QLCBcIm5vb3BcIlxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlBVU0gsIFwicHVzaFwiLCAxICMgc2V0IGR1cmF0aW9uIHRvIG1ha2UgaXQgVElNRURcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5GQUxMLCBcImZhbGxcIiwgNDBcblxuICAgIHNldE9yaWVudGF0aW9uOiAocSkgLT4gXG4gICAgICAgIHN1cGVyIHFcbiAgICAgICAgaWYgbm90IEBwdXNoZXI/XG4gICAgICAgICAgICBAZGlyZWN0aW9uID0gQG9yaWVudGF0aW9uLnJvdGF0ZSBWZWN0b3IubWludXNaXG5cbiAgICBwdXNoZWRCeU9iamVjdEluRGlyZWN0aW9uOiAob2JqZWN0LCBkaXIsIGR1cmF0aW9uKSAtPlxuICAgICAgICAjIGxvZyBcInB1c2hhYmxlLnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gI3tAbmFtZX0gcHVzaGVyOiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCJcbiAgICAgICAgcHVzaEFjdGlvbiAgID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uUFVTSFxuICAgICAgICBAcHVzaGVyICAgICAgPSBvYmplY3RcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gcHVzaEFjdGlvblxuICAgICAgICBAZGlyZWN0aW9uICAgPSBuZXcgVmVjdG9yIGRpclxuICAgICAgICBwdXNoQWN0aW9uLmR1cmF0aW9uID0gd29ybGQudW5tYXBNc1RpbWUgZHVyYXRpb25cbiAgICAgICAgVGltZXIuYWRkQWN0aW9uIHB1c2hBY3Rpb25cblxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXVxuICAgICAgICAgICAgd29ybGQucGxheVNvdW5kIEBwdXNoaW5nX3NvdW5kIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBALCBAcG9zaXRpb24ucGx1cyhAZGlyZWN0aW9uKSwgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBzdXBlciBhY3Rpb25cblxuICAgIHBlcmZvcm1BY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXVxuICAgICAgICAgICAgIyBsb2cgXCJwdXNoYWJsZS5wZXJmb3JtQWN0aW9uICN7QG5hbWV9ICN7YWN0aW9uLmlkfVwiLCBAcG9zaXRpb24sIEBkaXJlY3Rpb25cbiAgICAgICAgICAgIEBzZXRDdXJyZW50UG9zaXRpb24gQHBvc2l0aW9uLnBsdXMgQGRpcmVjdGlvbi5tdWwgYWN0aW9uLmdldFJlbGF0aXZlVGltZSgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgc3VwZXIgYWN0aW9uXG5cbiAgICBmaW5pc2hBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXVxuICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gbnVsbFxuICAgICAgICAgICAgdGFyZ2V0UG9zID0gQGN1cnJlbnRfcG9zaXRpb24ucm91bmQoKVxuICAgICAgICAgICAgd29ybGQub2JqZWN0TW92ZWQgQCwgQHBvc2l0aW9uLCB0YXJnZXRQb3NcbiAgICAgICAgICAgICMgbG9nIFwicHVzaGFibGUuZmluaXNoQWN0aW9uICN7YWN0aW9uLmlkfVwiLCB0YXJnZXRQb3NcbiAgICAgICAgICAgIEBzZXRQb3NpdGlvbiB0YXJnZXRQb3NcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBzdXBlciBhY3Rpb25cblxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPiAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExdXG4gICAgICAgICAgICBCb3QgID0gcmVxdWlyZSAnLi9ib3QnXG4gICAgICAgICAgICBCb21iID0gcmVxdWlyZSAnLi9ib21iJ1xuICAgICAgICAgICAgZ3Jhdml0eURpciA9IEBkaXJlY3Rpb25cbiAgICAgICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgICAgIGlmIEBwdXNoZXIgaW5zdGFuY2VvZiBCb3RcbiAgICAgICAgICAgICAgICAgICAgZ3Jhdml0eURpciA9IEBwdXNoZXIuZ2V0RG93bigpXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBAcHVzaGVyIGluc3RhbmNlb2YgQm9tYlxuICAgICAgICAgICAgICAgICAgICBpZiBAIGluc3RhbmNlb2YgQm90XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBAZGlyZWN0aW9uLmVxbCBAZ2V0VXAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgYm90cyBkb24ndCBmYWxsIHRocm91Z2ggYm9tYiBzcGxpdHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXZpdHlEaXIgPSBAZ2V0RG93bigpICMgYm90cyBwdXNoZWQgYnkgYm9tYnMgZmFsbCBkb3duXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICMgb2JqZWN0cyBwdXNoZWQgYnkgYm9tYnMgZG9uJ3QgZmFsbFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgQHBvc2l0aW9uLnBsdXMgZ3Jhdml0eURpclxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24gPSBncmF2aXR5RGlyXG4gICAgICAgICAgICAgICAgQG1vdmVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgICAgICMgbG9nICdQdXNoYWJsZS5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eSwgZmFsbCEnXG4gICAgICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCBAbGFuZGluZ19zb3VuZCwgQHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgc3VwZXIgYWN0aW9uXG5cbm1vZHVsZS5leHBvcnRzID0gUHVzaGFibGVcbiJdfQ==
//# sourceURL=../coffee/pushable.coffee