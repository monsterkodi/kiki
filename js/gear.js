// koffee 1.4.0
var Action, Gear, Geom, Material, Pos, Valve,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Valve = require('./valve');

Action = require('./action');

Pos = require('./lib/pos');

Geom = require('./geom');

Material = require('./material');

Gear = (function(superClass) {
    extend(Gear, superClass);

    Gear.neighbors = [[[0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]]];

    function Gear(face) {
        this.face = face;
        Gear.__super__.constructor.call(this, this.face);
        this.updateMesh();
    }

    Gear.prototype.createMesh = function() {
        var valve;
        this.mesh = new THREE.Mesh(Geom.gear(), Material.gear);
        valve = new THREE.Mesh(Geom.valve(), Material.plate);
        valve.receiveShadow = true;
        valve.castShadow = true;
        this.mesh.add(valve);
        this.mesh.receiveShadow = true;
        return this.mesh.castShadow = true;
    };

    Gear.prototype.neighborGears = function() {
        var dirs, gears, i, j, neighbor, pos;
        dirs = Gear.neighbors[this.face % 3];
        pos = this.getPos();
        gears = [];
        for (i = j = 0; j < 4; i = ++j) {
            neighbor = world.getOccupantAtPos(pos.plus(new Pos(dirs[i])));
            if ((neighbor != null) && neighbor instanceof Gear) {
                if (neighbor.face === this.face) {
                    gears.push(neighbor);
                }
            }
        }
        return gears;
    };

    Gear.prototype.initAction = function(action) {
        Gear.__super__.initAction.call(this, action);
        if (action.id === Action.PUSH) {
            return this.setActive(false);
        }
    };

    Gear.prototype.actionFinished = function(action) {
        Gear.__super__.actionFinished.call(this, action);
        if (action.id === Action.PUSH || action.id === Action.FALL) {
            if (this.move_action == null) {
                return this.updateActive();
            }
        }
    };

    Gear.prototype.updateActive = function() {
        var gear, j, len, ref;
        this.setActive(false);
        ref = this.neighborGears();
        for (j = 0, len = ref.length; j < len; j++) {
            gear = ref[j];
            if (gear.active) {
                this.setActive(true);
                return;
            }
        }
    };

    Gear.prototype.setActive = function(active) {
        var gear, j, len, ref, results;
        if (this.active !== active) {
            this.active = active;
            world.playSound(this.active && 'GEAR_ON' || 'GEAR_OFF');
            if (this.active) {
                this.startTimedAction(this.getActionWithId(Action.ROTATE));
            } else {
                this.stopAction(this.getActionWithId(Action.ROTATE));
            }
            ref = this.neighborGears();
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                gear = ref[j];
                if (this.active) {
                    results.push(gear.setActive(true));
                } else {
                    results.push(gear.updateActive());
                }
            }
            return results;
        }
    };

    return Gear;

})(Valve);

module.exports = Gear;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vhci5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsd0NBQUE7SUFBQTs7O0FBQUEsS0FBQSxHQUFXLE9BQUEsQ0FBUSxTQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxHQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFFTDs7O0lBRUYsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFFLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFVLENBQUMsQ0FBRCxFQUFHLENBQUMsQ0FBSixFQUFNLENBQU4sQ0FBVixFQUFvQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFwQixFQUE2QixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBQyxDQUFOLENBQTdCLENBQUYsRUFBMEMsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVUsQ0FBQyxDQUFDLENBQUYsRUFBSSxDQUFKLEVBQU0sQ0FBTixDQUFWLEVBQW9CLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQXBCLEVBQTZCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFDLENBQU4sQ0FBN0IsQ0FBMUMsRUFBa0YsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVUsQ0FBQyxDQUFDLENBQUYsRUFBSSxDQUFKLEVBQU0sQ0FBTixDQUFWLEVBQW9CLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQXBCLEVBQTZCLENBQUMsQ0FBRCxFQUFHLENBQUMsQ0FBSixFQUFNLENBQU4sQ0FBN0IsQ0FBbEY7O0lBRVYsY0FBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7UUFDQSxzQ0FBTSxJ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MkJBUko7O0lBRk87Ozs7R0FyREk7O0FBcUVuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcblxuVmFsdmUgICAgPSByZXF1aXJlICcuL3ZhbHZlJ1xuQWN0aW9uICAgPSByZXF1aXJlICcuL2FjdGlvbidcblBvcyAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuR2VvbSAgICAgPSByZXF1aXJlICcuL2dlb20nXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEdlYXIgZXh0ZW5kcyBWYWx2ZVxuICAgICAgICBcbiAgICBAbmVpZ2hib3JzID0gWyBbWzAgMSAwXSwgWzAsLTEgMF0sIFswIDAgMV0sIFswIDAsLTFdXSwgW1sxIDAgMF0sIFstMSAwIDBdLCBbMCAwIDFdLCBbMCAwLC0xXV0sIFtbMSAwIDBdLCBbLTEgMCAwXSwgWzAgMSAwXSwgWzAsLTEgMF1dIF1cbiAgICBcbiAgICBAOiAoQGZhY2UpIC0+XG4gICAgICAgIHN1cGVyIEBmYWNlXG4gICAgICAgIEB1cGRhdGVNZXNoKClcblxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIEdlb20uZ2VhcigpLCAgTWF0ZXJpYWwuZ2VhclxuICAgICAgICB2YWx2ZSA9IG5ldyBUSFJFRS5NZXNoIEdlb20udmFsdmUoKSwgTWF0ZXJpYWwucGxhdGVcbiAgICAgICAgdmFsdmUucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgdmFsdmUuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2guYWRkIHZhbHZlXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIFxuICAgIG5laWdoYm9yR2VhcnM6IC0+XG4gICAgICAgIFxuICAgICAgICBkaXJzID0gR2Vhci5uZWlnaGJvcnNbQGZhY2UgJSAzXVxuICAgICAgICBwb3MgPSBAZ2V0UG9zKClcbiAgICAgICAgZ2VhcnMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMC4uLjRdXG4gICAgICAgICAgICBuZWlnaGJvciA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgcG9zLnBsdXMgbmV3IFBvcyBkaXJzW2ldXG4gICAgICAgICAgICBpZiBuZWlnaGJvcj8gYW5kIG5laWdoYm9yIGluc3RhbmNlb2YgR2VhclxuICAgICAgICAgICAgICAgIGlmIG5laWdoYm9yLmZhY2UgPT0gQGZhY2VcbiAgICAgICAgICAgICAgICAgICAgZ2VhcnMucHVzaCBuZWlnaGJvclxuICAgICAgICBnZWFyc1xuICAgIFxuICAgIGluaXRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSFxuICAgICAgICAgICAgQHNldEFjdGl2ZSBmYWxzZVxuICAgICBcbiAgICBhY3Rpb25GaW5pc2hlZDogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICBcbiAgICAgICAgaWYgYWN0aW9uLmlkID09IEFjdGlvbi5QVVNIIG9yIGFjdGlvbi5pZCA9PSBBY3Rpb24uRkFMTFxuICAgICAgICAgICAgaWYgbm90IEBtb3ZlX2FjdGlvbj9cbiAgICAgICAgICAgICAgICBAdXBkYXRlQWN0aXZlKClcbiAgICBcbiAgICB1cGRhdGVBY3RpdmU6IC0+XG5cbiAgICAgICAgQHNldEFjdGl2ZSBmYWxzZVxuICAgICAgICBmb3IgZ2VhciBpbiBAbmVpZ2hib3JHZWFycygpXG4gICAgICAgICAgICBpZiBnZWFyLmFjdGl2ZVxuICAgICAgICAgICAgICAgIEBzZXRBY3RpdmUgdHJ1ZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICBcbiAgICBzZXRBY3RpdmU6IChhY3RpdmUpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAYWN0aXZlICE9IGFjdGl2ZVxuICAgICAgICAgICAgQGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCBAYWN0aXZlIGFuZCAnR0VBUl9PTicgb3IgJ0dFQVJfT0ZGJ1xuICAgICAgICAgICAgaWYgQGFjdGl2ZVxuICAgICAgICAgICAgICAgIEBzdGFydFRpbWVkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLlJPVEFURVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzdG9wQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLlJPVEFURVxuICAgICAgICAgICAgZm9yIGdlYXIgaW4gQG5laWdoYm9yR2VhcnMoKVxuICAgICAgICAgICAgICAgIGlmIEBhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgZ2Vhci5zZXRBY3RpdmUgdHJ1ZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZ2Vhci51cGRhdGVBY3RpdmUoKVxuICAgICBcbm1vZHVsZS5leHBvcnRzID0gR2VhclxuIl19
//# sourceURL=../coffee/gear.coffee