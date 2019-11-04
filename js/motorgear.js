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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW90b3JnZWFyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSx3RUFBQTtJQUFBOzs7QUFBQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSOztBQUNoQixNQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSOztBQUNoQixRQUFBLEdBQWdCLE9BQUEsQ0FBUSxZQUFSOztBQUNoQixVQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7QUFDaEIsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0FBRVY7OztJQUVDLG1CQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDtRQUNBLDJDQUFNLElBQUMsQ0FBQSxJQUFQO0lBREQ7O3dCQUdILFdBQUEsR0FBYSxTQUFDLEdBQUQ7UUFDVCwyQ0FBTSxHQUFOO2VBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUZTOzt3QkFJYixVQUFBLEdBQVksU0FBQTtRQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FBZixFQUE2QixRQUFRLENBQUMsS0FBdEM7UUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWYsRUFBNkIsUUFBUSxDQUFDLElBQXRDO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO1FBQ3RCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQjtRQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsSUFBWDtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBTixHQUFzQjtlQUN0QixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUI7SUFQWDs7d0JBU1osVUFBQSxHQUFZLFNBQUMsTUFBRDtBQUVSLFlBQUE7UUFBQSxXQUFHLE1BQU0sQ0FBQyxHQUFQLEtBQWMsTUFBTSxDQUFDLElBQXJCLElBQUEsR0FBQSxLQUEyQixNQUFNLENBQUMsSUFBckM7WUFDSSxHQUFBLEdBQU0sSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFDLENBQUEsSUFBYixDQUFmO1lBQ04sUUFBQSxHQUFXLEtBQUssQ0FBQyxnQkFBTixDQUF1QixHQUF2QjtZQUNYLFVBQUEsR0FBYSxRQUFBLFlBQW9CLGFBQXBCLElBQXNDLFFBQVEsQ0FBQyxJQUFULEtBQWlCLElBQUMsQ0FBQTtZQUNyRSxJQUE0QixVQUE1QjtnQkFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixLQUFuQixFQUFBO2FBSko7O2VBS0EsMENBQU0sTUFBTjtJQVBROzt3QkFTWixVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxHQUFBLEdBQU0sVUFBVSxDQUFDLG9CQUFYLENBQWdDLENBQUMsSUFBQyxDQUFBLFNBQUQsSUFBZSxDQUFmLElBQW9CLENBQUMsQ0FBdEIsQ0FBQSxHQUEyQixJQUFDLENBQUEsS0FBNUQsRUFBbUUsQ0FBbkUsRUFBcUUsQ0FBckUsRUFBdUUsQ0FBdkU7UUFDTixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFqQixDQUFzQixHQUF0QjtlQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWpCLENBQXNCLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQUMsQ0FBQSxJQUFsQixDQUF0QjtJQUpROzt3QkFNWixZQUFBLEdBQWMsU0FBQTtBQUNWLFlBQUE7UUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFDLENBQUEsSUFBYixDQUFmO1FBRU4sUUFBQSxHQUFXLEtBQUssQ0FBQyxnQkFBTixDQUF1QixHQUF2QjtRQUNYLFVBQUEsR0FBYSxRQUFBLFlBQW9CLGFBQXBCLElBQXNDLFFBQVEsQ0FBQyxJQUFULEtBQWlCLElBQUMsQ0FBQSxJQUF4RCxJQUFpRSxDQUFJLFFBQVEsQ0FBQztRQUMzRixJQUFDLENBQUEsU0FBRCxDQUFXLFVBQVg7UUFDQSxJQUEyQixVQUEzQjttQkFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixJQUFuQixFQUFBOztJQU5VOzs7O0dBakNNOztBQXlDeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcblxuR2VhciAgICAgICAgICA9IHJlcXVpcmUgJy4vZ2Vhcidcbkdlb20gICAgICAgICAgPSByZXF1aXJlICcuL2dlb20nXG5GYWNlICAgICAgICAgID0gcmVxdWlyZSAnLi9mYWNlJ1xuQWN0aW9uICAgICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWF0ZXJpYWwgICAgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5RdWF0ZXJuaW9uICAgID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcbk1vdG9yQ3lsaW5kZXIgPSByZXF1aXJlICcuL21vdG9yY3lsaW5kZXInXG5cbmNsYXNzIE1vdG9yR2VhciBleHRlbmRzIEdlYXJcbiAgICBcbiAgICBAOiAoQGZhY2UpIC0+XG4gICAgICAgIHN1cGVyIEBmYWNlXG4gICAgICAgIFxuICAgIHNldFBvc2l0aW9uOiAocG9zKSAtPlxuICAgICAgICBzdXBlciBwb3NcbiAgICAgICAgQHVwZGF0ZUFjdGl2ZSgpXG5cbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIEdlb20ubW90b3IoKSwgTWF0ZXJpYWwucGxhdGVcbiAgICAgICAgQGdlYXIgPSBuZXcgVEhSRUUuTWVzaCBHZW9tLmdlYXIoKSwgIE1hdGVyaWFsLmdlYXJcbiAgICAgICAgQGdlYXIucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgQGdlYXIuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2guYWRkIEBnZWFyXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlXG5cbiAgICBpbml0QWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJNb3RvckdlYXIuaW5pdEFjdGlvbiBhY3Rpb24gI3thY3Rpb24ubmFtZX1cIlxuICAgICAgICBpZiBhY3Rpb24uaWQgaW4gW0FjdGlvbi5QVVNILCBBY3Rpb24uRkFMTF1cbiAgICAgICAgICAgIHBvcyA9IEBwb3NpdGlvbi5wbHVzIEZhY2Uubm9ybWFsIEBmYWNlXG4gICAgICAgICAgICBvY2N1cGFudCA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgcG9zIFxuICAgICAgICAgICAgaXNDeWxpbmRlciA9IG9jY3VwYW50IGluc3RhbmNlb2YgTW90b3JDeWxpbmRlciBhbmQgb2NjdXBhbnQuZmFjZSA9PSBAZmFjZVxuICAgICAgICAgICAgb2NjdXBhbnQuc2V0QWN0aXZlIGZhbHNlIGlmIGlzQ3lsaW5kZXJcbiAgICAgICAgc3VwZXIgYWN0aW9uXG4gICAgICAgIFxuICAgIHVwZGF0ZU1lc2g6IC0+XG4gICAgICAgICMga2xvZyBcIlZhbHZlLnVwZGF0ZU1lc2ggI3tAYW5nbGV9ICN7QGZhY2V9XCJcbiAgICAgICAgcm90ID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciAoQGNsb2Nrd2lzZSBhbmQgMSBvciAtMSkgKiBAYW5nbGUsIDAsMCwxXG4gICAgICAgIEBnZWFyLnF1YXRlcm5pb24uY29weSByb3QgI0ZhY2Uub3JpZW50YXRpb25Gb3JGYWNlKEBmYWNlKS5tdWwgcm90XG4gICAgICAgIEBtZXNoLnF1YXRlcm5pb24uY29weSBGYWNlLm9yaWVudGF0aW9uIEBmYWNlXG4gICAgICAgIFxuICAgIHVwZGF0ZUFjdGl2ZTogLT5cbiAgICAgICAgcG9zID0gQHBvc2l0aW9uLnBsdXMgRmFjZS5ub3JtYWwgQGZhY2VcbiAgICAgICAgIyBrbG9nIFwiTW90b3JHZWFyLnVwZGF0ZUFjdGl2ZSAje0BhY3RpdmV9XCIsIHBvcywgd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyhwb3MpIGluc3RhbmNlb2YgTW90b3JDeWxpbmRlclxuICAgICAgICBvY2N1cGFudCA9IHdvcmxkLmdldE9jY3VwYW50QXRQb3MgcG9zIFxuICAgICAgICBpc0N5bGluZGVyID0gb2NjdXBhbnQgaW5zdGFuY2VvZiBNb3RvckN5bGluZGVyIGFuZCBvY2N1cGFudC5mYWNlID09IEBmYWNlIGFuZCBub3Qgb2NjdXBhbnQubW92ZV9hY3Rpb25cbiAgICAgICAgQHNldEFjdGl2ZSBpc0N5bGluZGVyXG4gICAgICAgIG9jY3VwYW50LnNldEFjdGl2ZSB0cnVlIGlmIGlzQ3lsaW5kZXJcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IE1vdG9yR2VhclxuIl19
//# sourceURL=../coffee/motorgear.coffee