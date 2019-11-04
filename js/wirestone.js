// koffee 1.4.0
var Action, Face, Generator, Stone, Wall, Wire, WireStone,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Stone = require('./stone');

Wall = require('./wall');

Face = require('./face');

Wire = require('./wire');

Action = require('./action');

Generator = require('./generator');

WireStone = (function(superClass) {
    extend(WireStone, superClass);

    function WireStone() {
        this.wires = [null, null, null, null, null, null];
        WireStone.__super__.constructor.apply(this, arguments);
    }

    WireStone.prototype.initAction = function(action) {
        var generator, i, j, k, len, ref;
        switch (action.id) {
            case Action.FALL:
            case Action.PUSH:
                for (i = j = 0; j < 6; i = ++j) {
                    if (this.wires[i] != null) {
                        world.unsetObject(this.wires[i]);
                        this.wires[i].setActive(false);
                    }
                }
                ref = world.getObjectsOfType(Generator);
                for (k = 0, len = ref.length; k < len; k++) {
                    generator = ref[k];
                    if (generator.active) {
                        generator.activateWires();
                    }
                }
        }
        return WireStone.__super__.initAction.call(this, action);
    };

    WireStone.prototype.setPosition = function(pos) {
        var generator, i, j, k, len, newPos, ref;
        for (i = j = 0; j < 6; i = ++j) {
            newPos = pos.minus(Face.normalVectorForFace(i));
            if (this.isFreePos(newPos)) {
                if (this.wires[i] == null) {
                    this.wires[i] = new Wire((i + 3) % 6);
                    world.addObjectAtPos(this.wires[i], newPos);
                } else {
                    world.setObjectAtPos(this.wires[i], newPos);
                    this.wires[i].updateActive();
                }
            } else if (this.wires[i] != null) {
                this.wires[i].del();
                this.wires[i] = null;
            }
        }
        ref = world.getObjectsOfType(Generator);
        for (k = 0, len = ref.length; k < len; k++) {
            generator = ref[k];
            if (generator.active) {
                generator.activateWires();
            }
        }
        return WireStone.__super__.setPosition.call(this, pos);
    };

    WireStone.prototype.setCurrentPosition = function(pos) {
        var i, j, ref, results;
        WireStone.__super__.setCurrentPosition.call(this, pos);
        results = [];
        for (i = j = 0; j < 6; i = ++j) {
            results.push((ref = this.wires[i]) != null ? ref.setPosition(this.current_position.minus(Face.normalVectorForFace(i))) : void 0);
        }
        return results;
    };

    WireStone.prototype.isFreePos = function(pos) {
        var occupant;
        if (world.isUnoccupiedPos(pos)) {
            return true;
        }
        if (world.isValidPos(pos)) {
            occupant = world.getOccupantAtPos(pos);
            return !(occupant instanceof Wall) && !(occupant instanceof Stone);
        }
        return false;
    };

    return WireStone;

})(Stone);

module.exports = WireStone;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lyZXN0b25lLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxxREFBQTtJQUFBOzs7QUFBQSxLQUFBLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBQ1osSUFBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSOztBQUNaLElBQUEsR0FBWSxPQUFBLENBQVEsUUFBUjs7QUFDWixJQUFBLEdBQVksT0FBQSxDQUFRLFFBQVI7O0FBQ1osTUFBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSOztBQUNaLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7QUFFTjs7O0lBRUMsbUJBQUE7UUFDQyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO1FBQ1QsNENBQUEsU0FBQTtJQUZEOzt3QkFJSCxVQUFBLEdBQVksU0FBQyxNQUFEO0FBQ1IsWUFBQTtBQUFBLGdCQUFPLE1BQU0sQ0FBQyxFQUFkO0FBQUEsaUJBQ1MsTUFBTSxDQUFDLElBRGhCO0FBQUEsaUJBQ3NCLE1BQU0sQ0FBQyxJQUQ3QjtBQUVRLHFCQUFTLHlCQUFUO29CQUNJLElBQUcscUJBQUg7d0JBQ0ksS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQXpCO3dCQUNBLElBQUMsQ0FBQSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBVixDQUFvQixLQUFwQixFQUZKOztBQURKO0FBSUE7QUFBQSxxQkFBQSxxQ0FBQTs7b0JBQ0ksSUFBNkIsU0FBUyxDQUFDLE1BQXZDO3dCQUFBLFNBQVMsQ0FBQyxhQUFWLENBQUEsRUFBQTs7QUFESjtBQU5SO2VBUUEsMENBQU0sTUFBTjtJQVRROzt3QkFXWixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1QsWUFBQTtBQUFBLGFBQVMseUJBQVQ7WUFDSSxNQUFBLEdBQVMsR0FBRyxDQUFDLEtBQUosQ0FBVSxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsQ0FBekIsQ0FBVjtZQUNULElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQUg7Z0JBQ0ksSUFBTyxxQkFBUDtvQkFDSSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUCxHQUFZLElBQUksSUFBSixDQUFTLENBQUMsQ0FBQSxHQUFFLENBQUgsQ0FBQSxHQUFNLENBQWY7b0JBQ1osS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQTVCLEVBQWdDLE1BQWhDLEVBRko7aUJBQUEsTUFBQTtvQkFJSSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBNUIsRUFBZ0MsTUFBaEM7b0JBQ0EsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFWLENBQUEsRUFMSjtpQkFESjthQUFBLE1BT0ssSUFBRyxxQkFBSDtnQkFDRCxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQVYsQ0FBQTtnQkFDQSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUCxHQUFZLEtBRlg7O0FBVFQ7QUFhQTtBQUFBLGFBQUEscUNBQUE7O1lBQ0ksSUFBRyxTQUFTLENBQUMsTUFBYjtnQkFDSSxTQUFTLENBQUMsYUFBVixDQUFBLEVBREo7O0FBREo7ZUFJQSwyQ0FBTSxHQUFOO0lBbEJTOzt3QkFvQmIsa0JBQUEsR0FBb0IsU0FBQyxHQUFEO0FBQ2hCLFlBQUE7UUFBQSxrREFBTSxHQUFOO0FBQ0E7YUFBUyx5QkFBVDs0REFDYSxDQUFFLFdBQVgsQ0FBdUIsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEtBQWxCLENBQXdCLElBQUksQ0FBQyxtQkFBTCxDQUF5QixDQUF6QixDQUF4QixDQUF2QjtBQURKOztJQUZnQjs7d0JBS3BCLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDUCxZQUFBO1FBQUEsSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixHQUF0QixDQUFIO0FBQ0ksbUJBQU8sS0FEWDs7UUFFQSxJQUFHLEtBQUssQ0FBQyxVQUFOLENBQWlCLEdBQWpCLENBQUg7WUFDSSxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLEdBQXZCO0FBQ1gsbUJBQU8sQ0FBSSxDQUFDLFFBQUEsWUFBb0IsSUFBckIsQ0FBSixJQUFtQyxDQUFJLENBQUMsUUFBQSxZQUFvQixLQUFyQixFQUZsRDs7QUFHQSxlQUFPO0lBTkE7Ozs7R0ExQ1M7O0FBa0R4QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgIFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG5cblN0b25lICAgICA9IHJlcXVpcmUgJy4vc3RvbmUnXG5XYWxsICAgICAgPSByZXF1aXJlICcuL3dhbGwnXG5GYWNlICAgICAgPSByZXF1aXJlICcuL2ZhY2UnXG5XaXJlICAgICAgPSByZXF1aXJlICcuL3dpcmUnXG5BY3Rpb24gICAgPSByZXF1aXJlICcuL2FjdGlvbidcbkdlbmVyYXRvciA9IHJlcXVpcmUgJy4vZ2VuZXJhdG9yJ1xuXG5jbGFzcyBXaXJlU3RvbmUgZXh0ZW5kcyBTdG9uZVxuICAgIFxuICAgIEA6ICgpIC0+XG4gICAgICAgIEB3aXJlcyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBpbml0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMLCBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgICAgIGZvciBpIGluIFswLi4uNl1cbiAgICAgICAgICAgICAgICAgICAgaWYgQHdpcmVzW2ldP1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQudW5zZXRPYmplY3QgQHdpcmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICBAd2lyZXNbaV0uc2V0QWN0aXZlIGZhbHNlXG4gICAgICAgICAgICAgICAgZm9yIGdlbmVyYXRvciBpbiB3b3JsZC5nZXRPYmplY3RzT2ZUeXBlIEdlbmVyYXRvciAjID8/P1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0b3IuYWN0aXZhdGVXaXJlcygpIGlmIGdlbmVyYXRvci5hY3RpdmUgIyA/Pz9cbiAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgXG4gICAgc2V0UG9zaXRpb246IChwb3MpIC0+ICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi4uNl1cbiAgICAgICAgICAgIG5ld1BvcyA9IHBvcy5taW51cyBGYWNlLm5vcm1hbFZlY3RvckZvckZhY2UgaVxuICAgICAgICAgICAgaWYgQGlzRnJlZVBvcyBuZXdQb3NcbiAgICAgICAgICAgICAgICBpZiBub3QgQHdpcmVzW2ldP1xuICAgICAgICAgICAgICAgICAgICBAd2lyZXNbaV0gPSBuZXcgV2lyZSAoaSszKSU2XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIEB3aXJlc1tpXSwgbmV3UG9zXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5zZXRPYmplY3RBdFBvcyBAd2lyZXNbaV0sIG5ld1Bvc1xuICAgICAgICAgICAgICAgICAgICBAd2lyZXNbaV0udXBkYXRlQWN0aXZlKClcbiAgICAgICAgICAgIGVsc2UgaWYgQHdpcmVzW2ldP1xuICAgICAgICAgICAgICAgIEB3aXJlc1tpXS5kZWwoKVxuICAgICAgICAgICAgICAgIEB3aXJlc1tpXSA9IG51bGxcbiAgICBcbiAgICAgICAgZm9yIGdlbmVyYXRvciBpbiB3b3JsZC5nZXRPYmplY3RzT2ZUeXBlIEdlbmVyYXRvclxuICAgICAgICAgICAgaWYgZ2VuZXJhdG9yLmFjdGl2ZVxuICAgICAgICAgICAgICAgIGdlbmVyYXRvci5hY3RpdmF0ZVdpcmVzKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3VwZXIgcG9zXG4gICAgXG4gICAgc2V0Q3VycmVudFBvc2l0aW9uOiAocG9zKSAtPlxuICAgICAgICBzdXBlciBwb3NcbiAgICAgICAgZm9yIGkgaW4gWzAuLi42XVxuICAgICAgICAgICAgQHdpcmVzW2ldPy5zZXRQb3NpdGlvbiBAY3VycmVudF9wb3NpdGlvbi5taW51cyBGYWNlLm5vcm1hbFZlY3RvckZvckZhY2UgaVxuICAgIFxuICAgIGlzRnJlZVBvczogKHBvcykgLT5cbiAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgd29ybGQuaXNWYWxpZFBvcyBwb3NcbiAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiBub3QgKG9jY3VwYW50IGluc3RhbmNlb2YgV2FsbCkgYW5kIG5vdCAob2NjdXBhbnQgaW5zdGFuY2VvZiBTdG9uZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBXaXJlU3RvbmVcbiJdfQ==
//# sourceURL=../coffee/wirestone.coffee