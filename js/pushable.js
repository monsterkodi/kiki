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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaGFibGUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHFDQUFBO0lBQUE7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsY0FBUjs7QUFDVCxJQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULEtBQUEsR0FBUyxPQUFBLENBQVEsU0FBUjs7QUFFSDs7O3VCQUVGLGVBQUEsR0FBaUIsU0FBQTtlQUFHO0lBQUg7O0lBRWQsa0JBQUE7UUFDQywyQ0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBYztRQUNkLElBQUMsQ0FBQSxTQUFELEdBQWMsTUFBTSxDQUFDO1FBQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCO1FBQ2pCLElBQUMsQ0FBQSxhQUFELEdBQWlCO1FBRWpCLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxJQUFyQixFQUEyQixNQUEzQixDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLElBQXJCLEVBQTJCLE1BQTNCLEVBQW1DLENBQW5DLENBQVg7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsRUFBbkMsQ0FBWDtJQVREOzt1QkFXSCxjQUFBLEdBQWdCLFNBQUMsQ0FBRDtRQUNaLDZDQUFNLENBQU47UUFDQSxJQUFPLG1CQUFQO21CQUNJLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLE1BQU0sQ0FBQyxNQUEzQixFQURqQjs7SUFGWTs7dUJBS2hCLHlCQUFBLEdBQTJCLFNBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxRQUFkO0FBRXZCLFlBQUE7UUFBQSxVQUFBLEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLElBQXhCO1FBQ2YsSUFBQyxDQUFBLE1BQUQsR0FBZTtRQUNmLElBQUMsQ0FBQSxXQUFELEdBQWU7UUFDZixJQUFDLENBQUEsU0FBRCxHQUFlLElBQUksTUFBSixDQUFXLEdBQVg7UUFDZixVQUFVLENBQUMsUUFBWCxHQUFzQixLQUFLLENBQUMsV0FBTixDQUFrQixRQUFsQjtlQUN0QixLQUFLLENBQUMsU0FBTixDQUFnQixVQUFoQjtJQVB1Qjs7dUJBUzNCLFVBQUEsR0FBWSxTQUFDLE1BQUQ7QUFDUixZQUFBO1FBQUEsV0FBRyxNQUFNLENBQUMsR0FBUCxLQUFjLE1BQU0sQ0FBQyxJQUFyQixJQUFBLEdBQUEsS0FBMkIsTUFBTSxDQUFDLElBQXJDO1lBQ0ksSUFBa0MsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsSUFBdEQ7Z0JBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLGFBQWpCLEVBQUE7O1lBQ0EsS0FBSyxDQUFDLG1CQUFOLENBQTBCLElBQTFCLEVBQTZCLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUMsQ0FBQSxTQUFoQixDQUE3QixFQUF5RCxNQUFNLENBQUMsV0FBUCxDQUFBLENBQXpEO0FBQ0EsbUJBSEo7O2VBSUEseUNBQU0sTUFBTjtJQUxROzt1QkFPWixhQUFBLEdBQWUsU0FBQyxNQUFEO0FBQ1gsWUFBQTtRQUFBLFdBQUcsTUFBTSxDQUFDLEdBQVAsS0FBYyxNQUFNLENBQUMsSUFBckIsSUFBQSxHQUFBLEtBQTJCLE1BQU0sQ0FBQyxJQUFyQztZQUVJLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxNQUFNLENBQUMsZUFBUCxDQUFBLENBQWYsQ0FBZixDQUFwQjtBQUNBLG1CQUhKOztlQUlBLDRDQUFNLE1BQU47SUFMVzs7dUJBT2YsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUNWLFlBQUE7UUFBQSxXQUFHLE1BQU0sQ0FBQyxHQUFQLEtBQWMsTUFBTSxDQUFDLElBQXJCLElBQUEsR0FBQSxLQUEyQixNQUFNLENBQUMsSUFBckM7WUFDSSxJQUFDLENBQUEsV0FBRCxHQUFlO1lBQ2YsU0FBQSxHQUFZLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxLQUFsQixDQUFBO1lBQ1osS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEIsRUFBcUIsSUFBQyxDQUFBLFFBQXRCLEVBQWdDLFNBQWhDO1lBRUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxTQUFiO0FBQ0EsbUJBTko7O2VBT0EsMkNBQU0sTUFBTjtJQVJVOzt1QkFVZCxjQUFBLEdBQWdCLFNBQUMsTUFBRDtBQUNaLFlBQUE7UUFBQSxXQUFHLE1BQU0sQ0FBQyxHQUFQLEtBQWMsTUFBTSxDQUFDLElBQXJCLElBQUEsR0FBQSxLQUEyQixNQUFNLENBQUMsSUFBckM7WUFDSSxHQUFBLEdBQU8sT0FBQSxDQUFRLE9BQVI7WUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7WUFDUCxVQUFBLEdBQWEsSUFBQyxDQUFBO1lBQ2QsSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxJQUF2QjtnQkFDSSxJQUFHLElBQUMsQ0FBQSxNQUFELFlBQW1CLEdBQXRCO29CQUNJLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxFQURqQjtpQkFBQSxNQUVLLElBQUcsSUFBQyxDQUFBLE1BQUQsWUFBbUIsSUFBdEI7b0JBQ0QsSUFBRyxJQUFBLFlBQWEsR0FBaEI7d0JBQ0ksSUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQWYsQ0FBSDs0QkFFSSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQTtBQUNBLG1DQUhKO3lCQUFBLE1BQUE7NEJBS0ksVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFELENBQUEsRUFMakI7eUJBREo7cUJBQUEsTUFBQTt3QkFRSSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQTtBQUNBLCtCQVRKO3FCQURDO2lCQUhUOztZQWVBLElBQUcsS0FBSyxDQUFDLGVBQU4sQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsVUFBZixDQUF0QixDQUFIO2dCQUNJLElBQUMsQ0FBQSxTQUFELEdBQWE7Z0JBQ2IsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEI7Z0JBRWYsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLFdBQWpCLEVBSko7YUFBQSxNQUFBO2dCQU1JLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBO2dCQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxhQUFqQixFQUFnQyxJQUFDLENBQUEsUUFBakMsRUFQSjs7QUFTQSxtQkE1Qko7O2VBNkJBLDZDQUFNLE1BQU47SUE5Qlk7Ozs7R0FyREc7O0FBcUZ2QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAgICAgICAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgIFxuIyAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cblZlY3RvciA9IHJlcXVpcmUgJy4vbGliL3ZlY3Rvcidcbkl0ZW0gICA9IHJlcXVpcmUgJy4vaXRlbSdcbkFjdGlvbiA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgID0gcmVxdWlyZSAnLi90aW1lcidcblxuY2xhc3MgUHVzaGFibGUgZXh0ZW5kcyBJdGVtXG5cbiAgICBpc1NwYWNlRWdvaXN0aWM6IC0+IHRydWVcbiAgICBcbiAgICBAOiAoKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBAcHVzaGVyICAgICA9IG51bGxcbiAgICAgICAgQGRpcmVjdGlvbiAgPSBWZWN0b3IubWludXNZXG4gICAgICAgIEBsYW5kaW5nX3NvdW5kID0gJ1NUT05FX0xBTkQnXG4gICAgICAgIEBwdXNoaW5nX3NvdW5kID0gJ1NUT05FX01PVkUnXG4gICAgICAgIFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLk5PT1AsIFwibm9vcFwiXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uUFVTSCwgXCJwdXNoXCIsIDEgIyBzZXQgZHVyYXRpb24gdG8gbWFrZSBpdCBUSU1FRFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLkZBTEwsIFwiZmFsbFwiLCA0MFxuXG4gICAgc2V0T3JpZW50YXRpb246IChxKSAtPiBcbiAgICAgICAgc3VwZXIgcVxuICAgICAgICBpZiBub3QgQHB1c2hlcj9cbiAgICAgICAgICAgIEBkaXJlY3Rpb24gPSBAb3JpZW50YXRpb24ucm90YXRlIFZlY3Rvci5taW51c1pcblxuICAgIHB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb246IChvYmplY3QsIGRpciwgZHVyYXRpb24pIC0+XG4gICAgICAgICMga2xvZyBcInB1c2hhYmxlLnB1c2hlZEJ5T2JqZWN0SW5EaXJlY3Rpb24gI3tAbmFtZX0gcHVzaGVyOiN7b2JqZWN0Lm5hbWV9IGR1cmF0aW9uOiN7ZHVyYXRpb259XCJcbiAgICAgICAgcHVzaEFjdGlvbiAgID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uUFVTSFxuICAgICAgICBAcHVzaGVyICAgICAgPSBvYmplY3RcbiAgICAgICAgQG1vdmVfYWN0aW9uID0gcHVzaEFjdGlvblxuICAgICAgICBAZGlyZWN0aW9uICAgPSBuZXcgVmVjdG9yIGRpclxuICAgICAgICBwdXNoQWN0aW9uLmR1cmF0aW9uID0gd29ybGQudW5tYXBNc1RpbWUgZHVyYXRpb25cbiAgICAgICAgVGltZXIuYWRkQWN0aW9uIHB1c2hBY3Rpb25cblxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXVxuICAgICAgICAgICAgd29ybGQucGxheVNvdW5kIEBwdXNoaW5nX3NvdW5kIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgd29ybGQub2JqZWN0V2lsbE1vdmVUb1BvcyBALCBAcG9zaXRpb24ucGx1cyhAZGlyZWN0aW9uKSwgYWN0aW9uLmdldER1cmF0aW9uKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBzdXBlciBhY3Rpb25cblxuICAgIHBlcmZvcm1BY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbi5pZCBpbiBbQWN0aW9uLlBVU0gsIEFjdGlvbi5GQUxMXVxuICAgICAgICAgICAgIyBrbG9nIFwicHVzaGFibGUucGVyZm9ybUFjdGlvbiAje0BuYW1lfSAje2FjdGlvbi5pZH1cIiwgQHBvc2l0aW9uLCBAZGlyZWN0aW9uXG4gICAgICAgICAgICBAc2V0Q3VycmVudFBvc2l0aW9uIEBwb3NpdGlvbi5wbHVzIEBkaXJlY3Rpb24ubXVsIGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHN1cGVyIGFjdGlvblxuXG4gICAgZmluaXNoQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5QVVNILCBBY3Rpb24uRkFMTF1cbiAgICAgICAgICAgIEBtb3ZlX2FjdGlvbiA9IG51bGxcbiAgICAgICAgICAgIHRhcmdldFBvcyA9IEBjdXJyZW50X3Bvc2l0aW9uLnJvdW5kKClcbiAgICAgICAgICAgIHdvcmxkLm9iamVjdE1vdmVkIEAsIEBwb3NpdGlvbiwgdGFyZ2V0UG9zXG4gICAgICAgICAgICAjIGtsb2cgXCJwdXNoYWJsZS5maW5pc2hBY3Rpb24gI3thY3Rpb24uaWR9XCIsIHRhcmdldFBvc1xuICAgICAgICAgICAgQHNldFBvc2l0aW9uIHRhcmdldFBvc1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHN1cGVyIGFjdGlvblxuXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+ICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5QVVNILCBBY3Rpb24uRkFMTF1cbiAgICAgICAgICAgIEJvdCAgPSByZXF1aXJlICcuL2JvdCdcbiAgICAgICAgICAgIEJvbWIgPSByZXF1aXJlICcuL2JvbWInXG4gICAgICAgICAgICBncmF2aXR5RGlyID0gQGRpcmVjdGlvblxuICAgICAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5QVVNIXG4gICAgICAgICAgICAgICAgaWYgQHB1c2hlciBpbnN0YW5jZW9mIEJvdFxuICAgICAgICAgICAgICAgICAgICBncmF2aXR5RGlyID0gQHB1c2hlci5nZXREb3duKClcbiAgICAgICAgICAgICAgICBlbHNlIGlmIEBwdXNoZXIgaW5zdGFuY2VvZiBCb21iXG4gICAgICAgICAgICAgICAgICAgIGlmIEAgaW5zdGFuY2VvZiBCb3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIEBkaXJlY3Rpb24uZXFsIEBnZXRVcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBib3RzIGRvbid0IGZhbGwgdGhyb3VnaCBib21iIHNwbGl0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGRpcmVjdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jhdml0eURpciA9IEBnZXREb3duKCkgIyBib3RzIHB1c2hlZCBieSBib21icyBmYWxsIGRvd25cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGRpcmVjdGlvbi5yZXNldCgpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIyBvYmplY3RzIHB1c2hlZCBieSBib21icyBkb24ndCBmYWxsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdvcmxkLmlzVW5vY2N1cGllZFBvcyBAcG9zaXRpb24ucGx1cyBncmF2aXR5RGlyXG4gICAgICAgICAgICAgICAgQGRpcmVjdGlvbiA9IGdyYXZpdHlEaXJcbiAgICAgICAgICAgICAgICBAbW92ZV9hY3Rpb24gPSBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GQUxMXG4gICAgICAgICAgICAgICAgIyBrbG9nICdQdXNoYWJsZS5hY3Rpb25GaW5pc2hlZCBiZWxvdyBlbXB0eSwgZmFsbCEnXG4gICAgICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBtb3ZlX2FjdGlvblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBkaXJlY3Rpb24ucmVzZXQoKVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCBAbGFuZGluZ19zb3VuZCwgQHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgc3VwZXIgYWN0aW9uXG5cbm1vZHVsZS5leHBvcnRzID0gUHVzaGFibGVcbiJdfQ==
//# sourceURL=../coffee/pushable.coffee