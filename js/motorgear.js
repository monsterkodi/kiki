// koffee 1.4.0
var Action, Face, Gear, Geom, Material, MotorCylinder, MotorGear, Quaternion,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Gear = require('./gear');

Geom = require('./geom');

Face = require('./face');

Action = require('./action');

Material = require('./material');

Quaternion = require('./lib/quaternion');

MotorCylinder = require('./motorcylinder');

MotorGear = (function(superClass) {
    extend(MotorGear, superClass);

    function MotorGear(face) {
        this.face = face;
        MotorGear.__super__.constructor.call(this, this.face);
    }

    MotorGear.prototype.del = function() {
        this.mesh.geometry.dispose();
        this.gear.geometry.dispose();
        return MotorGear.__super__.del.apply(this, arguments);
    };

    MotorGear.prototype.setPosition = function(pos) {
        MotorGear.__super__.setPosition.call(this, pos);
        return this.updateActive();
    };

    MotorGear.prototype.createMesh = function() {
        this.mesh = new THREE.Mesh(Geom.motor(), Material.plate);
        this.gear = new THREE.Mesh(Geom.gear(), Material.gear);
        this.gear.receiveShadow = true;
        this.gear.castShadow = true;
        this.mesh.add(this.gear);
        this.mesh.receiveShadow = true;
        return this.mesh.castShadow = true;
    };

    MotorGear.prototype.initAction = function(action) {
        var isCylinder, occupant, pos, ref;
        if ((ref = action.id) === Action.PUSH || ref === Action.FALL) {
            pos = this.position.plus(Face.normal(this.face));
            occupant = world.getOccupantAtPos(pos);
            isCylinder = occupant instanceof MotorCylinder && occupant.face === this.face;
            if (isCylinder) {
                occupant.setActive(false);
            }
        }
        return MotorGear.__super__.initAction.call(this, action);
    };

    MotorGear.prototype.updateMesh = function() {
        var rot;
        rot = Quaternion.rotationAroundVector((this.clockwise && 1 || -1) * this.angle, 0, 0, 1);
        this.gear.quaternion.copy(rot);
        return this.mesh.quaternion.copy(Face.orientation(this.face));
    };

    MotorGear.prototype.updateActive = function() {
        var isCylinder, occupant, pos;
        pos = this.position.plus(Face.normal(this.face));
        occupant = world.getOccupantAtPos(pos);
        isCylinder = occupant instanceof MotorCylinder && occupant.face === this.face && !occupant.move_action;
        this.setActive(isCylinder);
        if (isCylinder) {
            return occupant.setActive(true);
        }
    };

    return MotorGear;

})(Gear);

module.exports = MotorGear;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90b3JnZWFyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSx3RUFBQTtJQUFBOzs7QUFBQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixNQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSOztBQUNoQixRQUFBLEdBQWdCLE9BQUEsQ0FBUSxZQUFSOztBQUNoQixVQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7QUFDaEIsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0FBRVY7OztJQUVDLG1CQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDtRQUNBLDJDQUFNLElBQUMsQ0FBQSxJQUFQO0lBREQ7O3dCQUdILEdBQUEsR0FBSyxTQUFBO1FBRUQsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZixDQUFBO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZixDQUFBO2VBQ0Esb0NBQUEsU0FBQTtJQUpDOzt3QkFNTCxXQUFBLEdBQWEsU0FBQyxHQUFEO1FBQ1QsMkNBQU0sR0FBTjtlQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7SUFGUzs7d0JBSWIsVUFBQSxHQUFZLFNBQUE7UUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFBLENBQWYsRUFBNkIsUUFBUSxDQUFDLEtBQXRDO1FBQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFmLEVBQTZCLFFBQVEsQ0FBQyxJQUF0QztRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBTixHQUFzQjtRQUN0QixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUI7UUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLElBQVg7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7ZUFDdEIsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLEdBQW1CO0lBUFg7O3dCQVNaLFVBQUEsR0FBWSxTQUFDLE1BQUQ7QUFFUixZQUFBO1FBQUEsV0FBRyxNQUFNLENBQUMsR0FBUCxLQUFjLE1BQU0sQ0FBQyxJQUFyQixJQUFBLEdBQUEsS0FBMkIsTUFBTSxDQUFDLElBQXJDO1lBQ0ksR0FBQSxHQUFNLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUksQ0FBQyxNQUFMLENBQVksSUFBQyxDQUFBLElBQWIsQ0FBZjtZQUNOLFFBQUEsR0FBVyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsR0FBdkI7WUFDWCxVQUFBLEdBQWEsUUFBQSxZQUFvQixhQUFwQixJQUFzQyxRQUFRLENBQUMsSUFBVCxLQUFpQixJQUFDLENBQUE7WUFDckUsSUFBNEIsVUFBNUI7Z0JBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBQTthQUpKOztlQUtBLDBDQUFNLE1BQU47SUFQUTs7d0JBU1osVUFBQSxHQUFZLFNBQUE7QUFFUixZQUFBO1FBQUEsR0FBQSxHQUFNLFVBQVUsQ0FBQyxvQkFBWCxDQUFnQyxDQUFDLElBQUMsQ0FBQSxTQUFELElBQWUsQ0FBZixJQUFvQixDQUFDLENBQXRCLENBQUEsR0FBMkIsSUFBQyxDQUFBLEtBQTVELEVBQW1FLENBQW5FLEVBQXFFLENBQXJFLEVBQXVFLENBQXZFO1FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBakIsQ0FBc0IsR0FBdEI7ZUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFqQixDQUFzQixJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFDLENBQUEsSUFBbEIsQ0FBdEI7SUFKUTs7d0JBTVosWUFBQSxHQUFjLFNBQUE7QUFDVixZQUFBO1FBQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQUksQ0FBQyxNQUFMLENBQVksSUFBQyxDQUFBLElBQWIsQ0FBZjtRQUVOLFFBQUEsR0FBVyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsR0FBdkI7UUFDWCxVQUFBLEdBQWEsUUFBQSxZQUFvQixhQUFwQixJQUFzQyxRQUFRLENBQUMsSUFBVCxLQUFpQixJQUFDLENBQUEsSUFBeEQsSUFBaUUsQ0FBSSxRQUFRLENBQUM7UUFDM0YsSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYO1FBQ0EsSUFBMkIsVUFBM0I7bUJBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsSUFBbkIsRUFBQTs7SUFOVTs7OztHQXZDTTs7QUErQ3hCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAgIFxuIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG5cbkdlYXIgICAgICAgICAgPSByZXF1aXJlICcuL2dlYXInXG5HZW9tICAgICAgICAgID0gcmVxdWlyZSAnLi9nZW9tJ1xuRmFjZSAgICAgICAgICA9IHJlcXVpcmUgJy4vZmFjZSdcbkFjdGlvbiAgICAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1hdGVyaWFsICAgICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuUXVhdGVybmlvbiAgICA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5Nb3RvckN5bGluZGVyID0gcmVxdWlyZSAnLi9tb3RvcmN5bGluZGVyJ1xuXG5jbGFzcyBNb3RvckdlYXIgZXh0ZW5kcyBHZWFyXG4gICAgXG4gICAgQDogKEBmYWNlKSAtPlxuICAgICAgICBzdXBlciBAZmFjZVxuXG4gICAgZGVsOiAtPlxuICAgICAgICBcbiAgICAgICAgQG1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpXG4gICAgICAgIEBnZWFyLmdlb21ldHJ5LmRpc3Bvc2UoKVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBzZXRQb3NpdGlvbjogKHBvcykgLT5cbiAgICAgICAgc3VwZXIgcG9zXG4gICAgICAgIEB1cGRhdGVBY3RpdmUoKVxuXG4gICAgY3JlYXRlTWVzaDogLT5cbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBHZW9tLm1vdG9yKCksIE1hdGVyaWFsLnBsYXRlXG4gICAgICAgIEBnZWFyID0gbmV3IFRIUkVFLk1lc2ggR2VvbS5nZWFyKCksICBNYXRlcmlhbC5nZWFyXG4gICAgICAgIEBnZWFyLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBnZWFyLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLmFkZCBAZ2VhclxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZVxuXG4gICAgaW5pdEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgIyBrbG9nIFwiTW90b3JHZWFyLmluaXRBY3Rpb24gYWN0aW9uICN7YWN0aW9uLm5hbWV9XCJcbiAgICAgICAgaWYgYWN0aW9uLmlkIGluIFtBY3Rpb24uUFVTSCwgQWN0aW9uLkZBTExdXG4gICAgICAgICAgICBwb3MgPSBAcG9zaXRpb24ucGx1cyBGYWNlLm5vcm1hbCBAZmFjZVxuICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIHBvcyBcbiAgICAgICAgICAgIGlzQ3lsaW5kZXIgPSBvY2N1cGFudCBpbnN0YW5jZW9mIE1vdG9yQ3lsaW5kZXIgYW5kIG9jY3VwYW50LmZhY2UgPT0gQGZhY2VcbiAgICAgICAgICAgIG9jY3VwYW50LnNldEFjdGl2ZSBmYWxzZSBpZiBpc0N5bGluZGVyXG4gICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICBcbiAgICB1cGRhdGVNZXNoOiAtPlxuICAgICAgICAjIGtsb2cgXCJWYWx2ZS51cGRhdGVNZXNoICN7QGFuZ2xlfSAje0BmYWNlfVwiXG4gICAgICAgIHJvdCA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgKEBjbG9ja3dpc2UgYW5kIDEgb3IgLTEpICogQGFuZ2xlLCAwLDAsMVxuICAgICAgICBAZ2Vhci5xdWF0ZXJuaW9uLmNvcHkgcm90ICNGYWNlLm9yaWVudGF0aW9uRm9yRmFjZShAZmFjZSkubXVsIHJvdFxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgRmFjZS5vcmllbnRhdGlvbiBAZmFjZVxuICAgICAgICBcbiAgICB1cGRhdGVBY3RpdmU6IC0+XG4gICAgICAgIHBvcyA9IEBwb3NpdGlvbi5wbHVzIEZhY2Uubm9ybWFsIEBmYWNlXG4gICAgICAgICMga2xvZyBcIk1vdG9yR2Vhci51cGRhdGVBY3RpdmUgI3tAYWN0aXZlfVwiLCBwb3MsIHdvcmxkLmdldE9jY3VwYW50QXRQb3MocG9zKSBpbnN0YW5jZW9mIE1vdG9yQ3lsaW5kZXJcbiAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRPY2N1cGFudEF0UG9zIHBvcyBcbiAgICAgICAgaXNDeWxpbmRlciA9IG9jY3VwYW50IGluc3RhbmNlb2YgTW90b3JDeWxpbmRlciBhbmQgb2NjdXBhbnQuZmFjZSA9PSBAZmFjZSBhbmQgbm90IG9jY3VwYW50Lm1vdmVfYWN0aW9uXG4gICAgICAgIEBzZXRBY3RpdmUgaXNDeWxpbmRlclxuICAgICAgICBvY2N1cGFudC5zZXRBY3RpdmUgdHJ1ZSBpZiBpc0N5bGluZGVyXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBNb3RvckdlYXJcbiJdfQ==
//# sourceURL=../coffee/motorgear.coffee