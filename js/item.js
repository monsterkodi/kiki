// koffee 1.4.0
var Actor, Item, Pos, Quaternion, Vector,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Actor = require('./actor');

Pos = require('./lib/pos');

Vector = require('./lib/vector');

Quaternion = require('./lib/quaternion');

Item = (function(superClass) {
    extend(Item, superClass);

    function Item() {
        Item.__super__.constructor.apply(this, arguments);
        this.name = this.constructor.name;
        if (typeof this.createMesh === "function") {
            this.createMesh();
        }
        if (this.mesh != null) {
            world.scene.add(this.mesh);
        }
        this.position = new Vector;
        this.current_position = new Vector;
        this.direction = new Vector;
        this.move_action = null;
    }

    Item.prototype.del = function() {
        if (this.name === 'del') {
            return;
        }
        Item.__super__.del.apply(this, arguments);
        this.name = 'del';
        if (this.mesh != null) {
            world.scene.remove(this.mesh);
        }
        world.removeObject(this);
        return this.emit('deleted');
    };

    Item.prototype.newCellMate = function() {};

    Item.prototype.cellMateLeft = function() {};

    Item.prototype.bulletImpact = function() {};

    Item.prototype.render = function() {};

    Item.prototype.isSpaceEgoistic = function() {
        return false;
    };

    Item.prototype.isSlippery = function() {
        return false;
    };

    Item.prototype.setPosition = function(x, y, z) {
        this.position = new Vector(x, y, z);
        return this.setCurrentPosition(this.position);
    };

    Item.prototype.getPos = function() {
        return new Pos(this.current_position);
    };

    Item.prototype.setPos = function(x, y, z) {
        return this.setPosition(new Pos(x, y, z));
    };

    Item.prototype.setOrientation = function(q) {
        return this.current_orientation = this.orientation = new Quaternion(q);
    };

    Item.prototype.setCurrentPosition = function(p) {
        var ref;
        this.current_position = new Vector(p);
        return (ref = this.mesh) != null ? ref.position.copy(this.current_position) : void 0;
    };

    Item.prototype.setCurrentOrientation = function(q) {
        return this.current_orientation = q;
    };

    return Item;

})(Actor);

module.exports = Item;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsb0NBQUE7SUFBQTs7O0FBQUEsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLEdBQUEsR0FBYSxPQUFBLENBQVEsV0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUjs7QUFFUDs7O0lBRUMsY0FBQTtRQUNDLHVDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxXQUFXLENBQUM7O1lBQ3JCLElBQUMsQ0FBQTs7UUFDRCxJQUF5QixpQkFBekI7WUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLElBQWpCLEVBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsU0FBRCxHQUFvQixJQUFJO1FBQ3hCLElBQUMsQ0FBQSxXQUFELEdBQW9CO0lBUnJCOzttQkFVSCxHQUFBLEdBQUssU0FBQTtRQUNELElBQVUsSUFBQyxDQUFBLElBQUQsS0FBUyxLQUFuQjtBQUFBLG1CQUFBOztRQUNBLCtCQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRO1FBQ1IsSUFBRyxpQkFBSDtZQUNJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsSUFBcEIsRUFESjs7UUFFQSxLQUFLLENBQUMsWUFBTixDQUFtQixJQUFuQjtlQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTjtJQVBDOzttQkFTTCxXQUFBLEdBQWEsU0FBQSxHQUFBOzttQkFDYixZQUFBLEdBQWMsU0FBQSxHQUFBOzttQkFDZCxZQUFBLEdBQWMsU0FBQSxHQUFBOzttQkFDZCxNQUFBLEdBQVEsU0FBQSxHQUFBOzttQkFFUixlQUFBLEdBQWlCLFNBQUE7ZUFBRztJQUFIOzttQkFDakIsVUFBQSxHQUFZLFNBQUE7ZUFBRztJQUFIOzttQkFFWixXQUFBLEdBQWEsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUw7UUFDVCxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksTUFBSixDQUFXLENBQVgsRUFBYSxDQUFiLEVBQWUsQ0FBZjtlQUNaLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFDLENBQUEsUUFBckI7SUFGUzs7bUJBSWIsTUFBQSxHQUFRLFNBQUE7ZUFBRyxJQUFJLEdBQUosQ0FBUSxJQUFDLENBQUEsZ0JBQVQ7SUFBSDs7bUJBQ1IsTUFBQSxHQUFRLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO2VBQ0osSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVUsQ0FBVixFQUFZLENBQVosQ0FBYjtJQURJOzttQkFHUixjQUFBLEdBQWdCLFNBQUMsQ0FBRDtlQUNaLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksVUFBSixDQUFlLENBQWY7SUFEMUI7O21CQUdoQixrQkFBQSxHQUFvQixTQUFDLENBQUQ7QUFDaEIsWUFBQTtRQUFBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLE1BQUosQ0FBVyxDQUFYOzhDQUNmLENBQUUsUUFBUSxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxnQkFBdEI7SUFGZ0I7O21CQUlwQixxQkFBQSxHQUF1QixTQUFDLENBQUQ7ZUFBTyxJQUFDLENBQUEsbUJBQUQsR0FBdUI7SUFBOUI7Ozs7R0E1Q1I7O0FBOENuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAgICAgIDAwXG4jICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIyAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwIDAgMDAwXG4jICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAwMDBcblxuQWN0b3IgICAgICA9IHJlcXVpcmUgJy4vYWN0b3InXG5Qb3MgICAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblF1YXRlcm5pb24gPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuXG5jbGFzcyBJdGVtIGV4dGVuZHMgQWN0b3JcblxuICAgIEA6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBuYW1lID0gQGNvbnN0cnVjdG9yLm5hbWVcbiAgICAgICAgQGNyZWF0ZU1lc2g/KClcbiAgICAgICAgd29ybGQuc2NlbmUuYWRkIEBtZXNoIGlmIEBtZXNoP1xuICAgICAgICBAcG9zaXRpb24gICAgICAgICA9IG5ldyBWZWN0b3JcbiAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBuZXcgVmVjdG9yXG4gICAgICAgIEBkaXJlY3Rpb24gICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAbW92ZV9hY3Rpb24gICAgICA9IG51bGxcblxuICAgIGRlbDogLT5cbiAgICAgICAgcmV0dXJuIGlmIEBuYW1lID09ICdkZWwnXG4gICAgICAgIHN1cGVyIFxuICAgICAgICBAbmFtZSA9ICdkZWwnXG4gICAgICAgIGlmIEBtZXNoP1xuICAgICAgICAgICAgd29ybGQuc2NlbmUucmVtb3ZlIEBtZXNoIFxuICAgICAgICB3b3JsZC5yZW1vdmVPYmplY3QgQFxuICAgICAgICBAZW1pdCAnZGVsZXRlZCdcbiAgICAgICAgXG4gICAgbmV3Q2VsbE1hdGU6IC0+XG4gICAgY2VsbE1hdGVMZWZ0OiAtPlxuICAgIGJ1bGxldEltcGFjdDogLT5cbiAgICByZW5kZXI6IC0+XG4gICAgICAgIFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gZmFsc2VcbiAgICBpc1NsaXBwZXJ5OiAtPiBmYWxzZVxuICAgIFxuICAgIHNldFBvc2l0aW9uOiAoeCx5LHopIC0+IFxuICAgICAgICBAcG9zaXRpb24gPSBuZXcgVmVjdG9yIHgseSx6XG4gICAgICAgIEBzZXRDdXJyZW50UG9zaXRpb24gQHBvc2l0aW9uXG5cbiAgICBnZXRQb3M6IC0+IG5ldyBQb3MgQGN1cnJlbnRfcG9zaXRpb25cbiAgICBzZXRQb3M6ICh4LHkseikgLT4gXG4gICAgICAgIEBzZXRQb3NpdGlvbiBuZXcgUG9zIHgseSx6XG4gICAgXG4gICAgc2V0T3JpZW50YXRpb246IChxKSAtPiBcbiAgICAgICAgQGN1cnJlbnRfb3JpZW50YXRpb24gPSBAb3JpZW50YXRpb24gPSBuZXcgUXVhdGVybmlvbiBxXG4gICAgICAgIFxuICAgIHNldEN1cnJlbnRQb3NpdGlvbjogKHApIC0+IFxuICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IG5ldyBWZWN0b3IgcFxuICAgICAgICBAbWVzaD8ucG9zaXRpb24uY29weSBAY3VycmVudF9wb3NpdGlvblxuICAgICAgICBcbiAgICBzZXRDdXJyZW50T3JpZW50YXRpb246IChxKSAtPiBAY3VycmVudF9vcmllbnRhdGlvbiA9IHFcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gSXRlbSJdfQ==
//# sourceURL=../coffee/item.coffee