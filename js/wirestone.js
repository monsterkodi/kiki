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

    WireStone.prototype.del = function() {
        var j, len, ref, wire;
        ref = this.wires;
        for (j = 0, len = ref.length; j < len; j++) {
            wire = ref[j];
            if (wire != null) {
                wire.del();
            }
        }
        return WireStone.__super__.del.apply(this, arguments);
    };

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lyZXN0b25lLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxxREFBQTtJQUFBOzs7QUFBQSxLQUFBLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBQ1osSUFBQSxHQUFZLE9BQUEsQ0FBUSxRQUFSOztBQUNaLElBQUEsR0FBWSxPQUFBLENBQVEsUUFBUjs7QUFDWixJQUFBLEdBQVksT0FBQSxDQUFRLFFBQVI7O0FBQ1osTUFBQSxHQUFZLE9BQUEsQ0FBUSxVQUFSOztBQUNaLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7QUFFTjs7O0lBRUMsbUJBQUE7UUFDQyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO1FBQ1QsNENBQUEsU0FBQTtJQUZEOzt3QkFJSCxHQUFBLEdBQUssU0FBQTtBQUVELFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFDSSxJQUFJLENBQUUsR0FBTixDQUFBOztBQURKO2VBRUEsb0NBQUEsU0FBQTtJQUpDOzt3QkFNTCxVQUFBLEdBQVksU0FBQyxNQUFEO0FBRVIsWUFBQTtBQUFBLGdCQUFPLE1BQU0sQ0FBQyxFQUFkO0FBQUEsaUJBQ1MsTUFBTSxDQUFDLElBRGhCO0FBQUEsaUJBQ3NCLE1BQU0sQ0FBQyxJQUQ3QjtBQUVRLHFCQUFTLHlCQUFUO29CQUNJLElBQUcscUJBQUg7d0JBQ0ksS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQXpCO3dCQUNBLElBQUMsQ0FBQSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBVixDQUFvQixLQUFwQixFQUZKOztBQURKO0FBSUE7QUFBQSxxQkFBQSxxQ0FBQTs7b0JBQ0ksSUFBNkIsU0FBUyxDQUFDLE1BQXZDO3dCQUFBLFNBQVMsQ0FBQyxhQUFWLENBQUEsRUFBQTs7QUFESjtBQU5SO2VBUUEsMENBQU0sTUFBTjtJQVZROzt3QkFZWixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBRVQsWUFBQTtBQUFBLGFBQVMseUJBQVQ7WUFDSSxNQUFBLEdBQVMsR0FBRyxDQUFDLEtBQUosQ0FBVSxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsQ0FBekIsQ0FBVjtZQUNULElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQUg7Z0JBQ0ksSUFBTyxxQkFBUDtvQkFDSSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUCxHQUFZLElBQUksSUFBSixDQUFTLENBQUMsQ0FBQSxHQUFFLENBQUgsQ0FBQSxHQUFNLENBQWY7b0JBQ1osS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQTVCLEVBQWdDLE1BQWhDLEVBRko7aUJBQUEsTUFBQTtvQkFJSSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBNUIsRUFBZ0MsTUFBaEM7b0JBQ0EsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFWLENBQUEsRUFMSjtpQkFESjthQUFBLE1BT0ssSUFBRyxxQkFBSDtnQkFDRCxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQVYsQ0FBQTtnQkFDQSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUCxHQUFZLEtBRlg7O0FBVFQ7QUFhQTtBQUFBLGFBQUEscUNBQUE7O1lBQ0ksSUFBRyxTQUFTLENBQUMsTUFBYjtnQkFDSSxTQUFTLENBQUMsYUFBVixDQUFBLEVBREo7O0FBREo7ZUFJQSwyQ0FBTSxHQUFOO0lBbkJTOzt3QkFxQmIsa0JBQUEsR0FBb0IsU0FBQyxHQUFEO0FBRWhCLFlBQUE7UUFBQSxrREFBTSxHQUFOO0FBQ0E7YUFBUyx5QkFBVDs0REFDYSxDQUFFLFdBQVgsQ0FBdUIsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEtBQWxCLENBQXdCLElBQUksQ0FBQyxtQkFBTCxDQUF5QixDQUF6QixDQUF4QixDQUF2QjtBQURKOztJQUhnQjs7d0JBTXBCLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFFUCxZQUFBO1FBQUEsSUFBRyxLQUFLLENBQUMsZUFBTixDQUFzQixHQUF0QixDQUFIO0FBQ0ksbUJBQU8sS0FEWDs7UUFFQSxJQUFHLEtBQUssQ0FBQyxVQUFOLENBQWlCLEdBQWpCLENBQUg7WUFDSSxRQUFBLEdBQVcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLEdBQXZCO0FBQ1gsbUJBQU8sQ0FBSSxDQUFDLFFBQUEsWUFBb0IsSUFBckIsQ0FBSixJQUFtQyxDQUFJLENBQUMsUUFBQSxZQUFvQixLQUFyQixFQUZsRDs7QUFHQSxlQUFPO0lBUEE7Ozs7R0FuRFM7O0FBNER4QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgIFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG5cblN0b25lICAgICA9IHJlcXVpcmUgJy4vc3RvbmUnXG5XYWxsICAgICAgPSByZXF1aXJlICcuL3dhbGwnXG5GYWNlICAgICAgPSByZXF1aXJlICcuL2ZhY2UnXG5XaXJlICAgICAgPSByZXF1aXJlICcuL3dpcmUnXG5BY3Rpb24gICAgPSByZXF1aXJlICcuL2FjdGlvbidcbkdlbmVyYXRvciA9IHJlcXVpcmUgJy4vZ2VuZXJhdG9yJ1xuXG5jbGFzcyBXaXJlU3RvbmUgZXh0ZW5kcyBTdG9uZVxuICAgIFxuICAgIEA6IC0+XG4gICAgICAgIEB3aXJlcyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBmb3Igd2lyZSBpbiBAd2lyZXNcbiAgICAgICAgICAgIHdpcmU/LmRlbCgpXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5GQUxMLCBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgICAgIGZvciBpIGluIFswLi4uNl1cbiAgICAgICAgICAgICAgICAgICAgaWYgQHdpcmVzW2ldP1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQudW5zZXRPYmplY3QgQHdpcmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICBAd2lyZXNbaV0uc2V0QWN0aXZlIGZhbHNlXG4gICAgICAgICAgICAgICAgZm9yIGdlbmVyYXRvciBpbiB3b3JsZC5nZXRPYmplY3RzT2ZUeXBlIEdlbmVyYXRvciAjID8/P1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0b3IuYWN0aXZhdGVXaXJlcygpIGlmIGdlbmVyYXRvci5hY3RpdmUgIyA/Pz9cbiAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgXG4gICAgc2V0UG9zaXRpb246IChwb3MpIC0+ICAgICAgXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4uLjZdXG4gICAgICAgICAgICBuZXdQb3MgPSBwb3MubWludXMgRmFjZS5ub3JtYWxWZWN0b3JGb3JGYWNlIGlcbiAgICAgICAgICAgIGlmIEBpc0ZyZWVQb3MgbmV3UG9zXG4gICAgICAgICAgICAgICAgaWYgbm90IEB3aXJlc1tpXT9cbiAgICAgICAgICAgICAgICAgICAgQHdpcmVzW2ldID0gbmV3IFdpcmUgKGkrMyklNlxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBAd2lyZXNbaV0sIG5ld1Bvc1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgd29ybGQuc2V0T2JqZWN0QXRQb3MgQHdpcmVzW2ldLCBuZXdQb3NcbiAgICAgICAgICAgICAgICAgICAgQHdpcmVzW2ldLnVwZGF0ZUFjdGl2ZSgpXG4gICAgICAgICAgICBlbHNlIGlmIEB3aXJlc1tpXT9cbiAgICAgICAgICAgICAgICBAd2lyZXNbaV0uZGVsKClcbiAgICAgICAgICAgICAgICBAd2lyZXNbaV0gPSBudWxsXG4gICAgXG4gICAgICAgIGZvciBnZW5lcmF0b3IgaW4gd29ybGQuZ2V0T2JqZWN0c09mVHlwZSBHZW5lcmF0b3JcbiAgICAgICAgICAgIGlmIGdlbmVyYXRvci5hY3RpdmVcbiAgICAgICAgICAgICAgICBnZW5lcmF0b3IuYWN0aXZhdGVXaXJlcygpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyIHBvc1xuICAgIFxuICAgIHNldEN1cnJlbnRQb3NpdGlvbjogKHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHN1cGVyIHBvc1xuICAgICAgICBmb3IgaSBpbiBbMC4uLjZdXG4gICAgICAgICAgICBAd2lyZXNbaV0/LnNldFBvc2l0aW9uIEBjdXJyZW50X3Bvc2l0aW9uLm1pbnVzIEZhY2Uubm9ybWFsVmVjdG9yRm9yRmFjZSBpXG4gICAgXG4gICAgaXNGcmVlUG9zOiAocG9zKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgaWYgd29ybGQuaXNWYWxpZFBvcyBwb3NcbiAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgIHJldHVybiBub3QgKG9jY3VwYW50IGluc3RhbmNlb2YgV2FsbCkgYW5kIG5vdCAob2NjdXBhbnQgaW5zdGFuY2VvZiBTdG9uZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBXaXJlU3RvbmVcbiJdfQ==
//# sourceURL=../coffee/wirestone.coffee