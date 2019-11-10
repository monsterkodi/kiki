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

    Gear.neighbors = [[[0, 1, 0], [0 - 1, 0], [0, 0, 1], [0, 0 - 1]], [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0 - 1]], [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0 - 1, 0]]];

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vhci5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsd0NBQUE7SUFBQTs7O0FBQUEsS0FBQSxHQUFXLE9BQUEsQ0FBUSxTQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxHQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFFTDs7O0lBRUYsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFFLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFVLENBQUMsQ0FBQSxHQUFHLENBQUosRUFBTSxDQUFOLENBQVYsRUFBb0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBcEIsRUFBNkIsQ0FBQyxDQUFELEVBQUcsQ0FBQSxHQUFHLENBQU4sQ0FBN0IsQ0FBRixFQUEwQyxDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBVSxDQUFDLENBQUMsQ0FBRixFQUFJLENBQUosRUFBTSxDQUFOLENBQVYsRUFBb0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBcEIsRUFBNkIsQ0FBQyxDQUFELEVBQUcsQ0FBQSxHQUFHLENBQU4sQ0FBN0IsQ0FBMUMsRUFBa0YsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVUsQ0FBQyxDQUFDLENBQUYsRUFBSSxDQUFKLEVBQU0sQ0FBTixDQUFWLEVBQW9CLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQXBCLEVBQTZCLENBQUMsQ0FBQSxHQUFHLENBQUosRUFBTSxDQUFOLENBQTdCLENBQWxGOztJQUVWLGNBQUMsSUFBRDtRQUFDLElBQUMsQ0FBQSxPQUFEO1FBQ0Esc0NBQU0sSUFBQyxDQUFBLElBQVA7UUFDQSxJ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OztBQXFFbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4jIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG5cblZhbHZlICAgID0gcmVxdWlyZSAnLi92YWx2ZSdcbkFjdGlvbiAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5Qb3MgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbkdlb20gICAgID0gcmVxdWlyZSAnLi9nZW9tJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBHZWFyIGV4dGVuZHMgVmFsdmVcbiAgICAgICAgXG4gICAgQG5laWdoYm9ycyA9IFsgW1swIDEgMF0sIFswIC0xIDBdLCBbMCAwIDFdLCBbMCAwIC0xXV0sIFtbMSAwIDBdLCBbLTEgMCAwXSwgWzAgMCwxXSwgWzAgMCAtMV1dLCBbWzEgMCAwXSwgWy0xIDAgMF0sIFswIDEgMF0sIFswIC0xIDBdXSBdXG4gICAgXG4gICAgQDogKEBmYWNlKSAtPlxuICAgICAgICBzdXBlciBAZmFjZVxuICAgICAgICBAdXBkYXRlTWVzaCgpXG5cbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBHZW9tLmdlYXIoKSwgIE1hdGVyaWFsLmdlYXJcbiAgICAgICAgdmFsdmUgPSBuZXcgVEhSRUUuTWVzaCBHZW9tLnZhbHZlKCksIE1hdGVyaWFsLnBsYXRlXG4gICAgICAgIHZhbHZlLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIHZhbHZlLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLmFkZCB2YWx2ZVxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICBuZWlnaGJvckdlYXJzOiAtPlxuICAgICAgICBcbiAgICAgICAgZGlycyA9IEdlYXIubmVpZ2hib3JzW0BmYWNlICUgM11cbiAgICAgICAgcG9zID0gQGdldFBvcygpXG4gICAgICAgIGdlYXJzID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzAuLi40XVxuICAgICAgICAgICAgbmVpZ2hib3IgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIHBvcy5wbHVzIG5ldyBQb3MgZGlyc1tpXVxuICAgICAgICAgICAgaWYgbmVpZ2hib3I/IGFuZCBuZWlnaGJvciBpbnN0YW5jZW9mIEdlYXJcbiAgICAgICAgICAgICAgICBpZiBuZWlnaGJvci5mYWNlID09IEBmYWNlXG4gICAgICAgICAgICAgICAgICAgIGdlYXJzLnB1c2ggbmVpZ2hib3JcbiAgICAgICAgZ2VhcnNcbiAgICBcbiAgICBpbml0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLlBVU0hcbiAgICAgICAgICAgIEBzZXRBY3RpdmUgZmFsc2VcbiAgICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uUFVTSCBvciBhY3Rpb24uaWQgPT0gQWN0aW9uLkZBTExcbiAgICAgICAgICAgIGlmIG5vdCBAbW92ZV9hY3Rpb24/XG4gICAgICAgICAgICAgICAgQHVwZGF0ZUFjdGl2ZSgpXG4gICAgXG4gICAgdXBkYXRlQWN0aXZlOiAtPlxuXG4gICAgICAgIEBzZXRBY3RpdmUgZmFsc2VcbiAgICAgICAgZm9yIGdlYXIgaW4gQG5laWdoYm9yR2VhcnMoKVxuICAgICAgICAgICAgaWYgZ2Vhci5hY3RpdmVcbiAgICAgICAgICAgICAgICBAc2V0QWN0aXZlIHRydWVcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgXG4gICAgc2V0QWN0aXZlOiAoYWN0aXZlKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGFjdGl2ZSAhPSBhY3RpdmVcbiAgICAgICAgICAgIEBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgQGFjdGl2ZSBhbmQgJ0dFQVJfT04nIG9yICdHRUFSX09GRidcbiAgICAgICAgICAgIGlmIEBhY3RpdmVcbiAgICAgICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5ST1RBVEVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc3RvcEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5ST1RBVEVcbiAgICAgICAgICAgIGZvciBnZWFyIGluIEBuZWlnaGJvckdlYXJzKClcbiAgICAgICAgICAgICAgICBpZiBAYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgIGdlYXIuc2V0QWN0aXZlIHRydWVcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGdlYXIudXBkYXRlQWN0aXZlKClcbiAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEdlYXJcbiJdfQ==
//# sourceURL=../coffee/gear.coffee