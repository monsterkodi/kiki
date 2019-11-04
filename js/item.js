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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsb0NBQUE7SUFBQTs7O0FBQUEsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLEdBQUEsR0FBYSxPQUFBLENBQVEsV0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUjs7QUFFUDs7O0lBRUMsY0FBQTtRQUNDLHVDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxXQUFXLENBQUM7O1lBQ3JCLElBQUMsQ0FBQTs7UUFDRCxJQUF5QixpQkFBekI7WUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLElBQWpCLEVBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsU0FBRCxHQUFvQixJQUFJO1FBQ3hCLElBQUMsQ0FBQSxXQUFELEdBQW9CO0lBUnJCOzttQkFVSCxHQUFBLEdBQUssU0FBQTtRQUNELElBQVUsSUFBQyxDQUFBLElBQUQsS0FBUyxLQUFuQjtBQUFBLG1CQUFBOztRQUNBLCtCQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRO1FBQ1IsSUFBNEIsaUJBQTVCO1lBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLENBQW1CLElBQUMsQ0FBQSxJQUFwQixFQUFBOztRQUNBLEtBQUssQ0FBQyxZQUFOLENBQW1CLElBQW5CO2VBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOO0lBTkM7O21CQVFMLFdBQUEsR0FBYSxTQUFBLEdBQUE7O21CQUNiLFlBQUEsR0FBYyxTQUFBLEdBQUE7O21CQUNkLFlBQUEsR0FBYyxTQUFBLEdBQUE7O21CQUNkLE1BQUEsR0FBUSxTQUFBLEdBQUE7O21CQUVSLGVBQUEsR0FBaUIsU0FBQTtlQUFHO0lBQUg7O21CQUNqQixVQUFBLEdBQVksU0FBQTtlQUFHO0lBQUg7O21CQUVaLFdBQUEsR0FBYSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtRQUNULElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFhLENBQWIsRUFBZSxDQUFmO2VBQ1osSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUMsQ0FBQSxRQUFyQjtJQUZTOzttQkFJYixNQUFBLEdBQVEsU0FBQTtlQUFHLElBQUksR0FBSixDQUFRLElBQUMsQ0FBQSxnQkFBVDtJQUFIOzttQkFDUixNQUFBLEdBQVEsU0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUw7ZUFFSixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUksR0FBSixDQUFRLENBQVIsRUFBVSxDQUFWLEVBQVksQ0FBWixDQUFiO0lBRkk7O21CQUlSLGNBQUEsR0FBZ0IsU0FBQyxDQUFEO2VBQ1osSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxVQUFKLENBQWUsQ0FBZjtJQUQxQjs7bUJBR2hCLGtCQUFBLEdBQW9CLFNBQUMsQ0FBRDtBQUVoQixZQUFBO1FBQUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksTUFBSixDQUFXLENBQVg7OENBQ2YsQ0FBRSxRQUFRLENBQUMsSUFBaEIsQ0FBcUIsSUFBQyxDQUFBLGdCQUF0QjtJQUhnQjs7bUJBS3BCLHFCQUFBLEdBQXVCLFNBQUMsQ0FBRDtlQUFPLElBQUMsQ0FBQSxtQkFBRCxHQUF1QjtJQUE5Qjs7OztHQTdDUjs7QUErQ25CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMCAgICAgMDBcbiMgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAwXG4jICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgMCAwMDBcbiMgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuXG5BY3RvciAgICAgID0gcmVxdWlyZSAnLi9hY3RvcidcblBvcyAgICAgICAgPSByZXF1aXJlICcuL2xpYi9wb3MnXG5WZWN0b3IgICAgID0gcmVxdWlyZSAnLi9saWIvdmVjdG9yJ1xuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4vbGliL3F1YXRlcm5pb24nXG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBBY3RvclxuXG4gICAgQDogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgQG5hbWUgPSBAY29uc3RydWN0b3IubmFtZVxuICAgICAgICBAY3JlYXRlTWVzaD8oKVxuICAgICAgICB3b3JsZC5zY2VuZS5hZGQgQG1lc2ggaWYgQG1lc2g/XG4gICAgICAgIEBwb3NpdGlvbiAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IG5ldyBWZWN0b3JcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgICAgID0gbnVsbFxuXG4gICAgZGVsOiAtPlxuICAgICAgICByZXR1cm4gaWYgQG5hbWUgPT0gJ2RlbCdcbiAgICAgICAgc3VwZXIgXG4gICAgICAgIEBuYW1lID0gJ2RlbCdcbiAgICAgICAgd29ybGQuc2NlbmUucmVtb3ZlIEBtZXNoIGlmIEBtZXNoP1xuICAgICAgICB3b3JsZC5yZW1vdmVPYmplY3QgQFxuICAgICAgICBAZW1pdCAnZGVsZXRlZCdcbiAgICAgICAgXG4gICAgbmV3Q2VsbE1hdGU6IC0+XG4gICAgY2VsbE1hdGVMZWZ0OiAtPlxuICAgIGJ1bGxldEltcGFjdDogLT5cbiAgICByZW5kZXI6IC0+XG4gICAgICAgIFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gZmFsc2VcbiAgICBpc1NsaXBwZXJ5OiAtPiBmYWxzZVxuICAgIFxuICAgIHNldFBvc2l0aW9uOiAoeCx5LHopIC0+IFxuICAgICAgICBAcG9zaXRpb24gPSBuZXcgVmVjdG9yIHgseSx6XG4gICAgICAgIEBzZXRDdXJyZW50UG9zaXRpb24gQHBvc2l0aW9uXG5cbiAgICBnZXRQb3M6IC0+IG5ldyBQb3MgQGN1cnJlbnRfcG9zaXRpb25cbiAgICBzZXRQb3M6ICh4LHkseikgLT4gXG4gICAgICAgICMga2xvZyBcIml0ZW0uc2V0UG9zICN7QG5hbWV9ICN7eH0gI3t5fSAje3p9XCJcbiAgICAgICAgQHNldFBvc2l0aW9uIG5ldyBQb3MgeCx5LHpcbiAgICBcbiAgICBzZXRPcmllbnRhdGlvbjogKHEpIC0+IFxuICAgICAgICBAY3VycmVudF9vcmllbnRhdGlvbiA9IEBvcmllbnRhdGlvbiA9IG5ldyBRdWF0ZXJuaW9uIHFcbiAgICAgICAgXG4gICAgc2V0Q3VycmVudFBvc2l0aW9uOiAocCkgLT4gXG4gICAgICAgICMga2xvZyBcIml0ZW0uc2V0Q3VycmVudFBvc2l0aW9uICN7QG5hbWV9XCIsIHBcbiAgICAgICAgQGN1cnJlbnRfcG9zaXRpb24gPSBuZXcgVmVjdG9yIHBcbiAgICAgICAgQG1lc2g/LnBvc2l0aW9uLmNvcHkgQGN1cnJlbnRfcG9zaXRpb25cbiAgICAgICAgXG4gICAgc2V0Q3VycmVudE9yaWVudGF0aW9uOiAocSkgLT4gQGN1cnJlbnRfb3JpZW50YXRpb24gPSBxXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZW0iXX0=
//# sourceURL=../coffee/item.coffee