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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsb0NBQUE7SUFBQTs7O0FBQUEsS0FBQSxHQUFhLE9BQUEsQ0FBUSxTQUFSOztBQUNiLEdBQUEsR0FBYSxPQUFBLENBQVEsV0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUjs7QUFFUDs7O0lBRVcsY0FBQTtRQUNULHVDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxXQUFXLENBQUM7O1lBQ3JCLElBQUMsQ0FBQTs7UUFDRCxJQUF5QixpQkFBekI7WUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLElBQWpCLEVBQUE7O1FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSTtRQUN4QixJQUFDLENBQUEsU0FBRCxHQUFvQixJQUFJO1FBQ3hCLElBQUMsQ0FBQSxXQUFELEdBQW9CO0lBUlg7O21CQVViLEdBQUEsR0FBSyxTQUFBO1FBQ0QsSUFBVSxJQUFDLENBQUEsSUFBRCxLQUFTLEtBQW5CO0FBQUEsbUJBQUE7O1FBQ0EsK0JBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxJQUFELEdBQVE7UUFDUixJQUE0QixpQkFBNUI7WUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLElBQXBCLEVBQUE7O1FBQ0EsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsSUFBbkI7ZUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFNBQU47SUFOQzs7bUJBUUwsV0FBQSxHQUFhLFNBQUEsR0FBQTs7bUJBQ2IsWUFBQSxHQUFjLFNBQUEsR0FBQTs7bUJBQ2QsWUFBQSxHQUFjLFNBQUEsR0FBQTs7bUJBQ2QsTUFBQSxHQUFRLFNBQUEsR0FBQTs7bUJBRVIsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7bUJBQ2pCLFVBQUEsR0FBWSxTQUFBO2VBQUc7SUFBSDs7bUJBRVosV0FBQSxHQUFhLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO1FBQ1QsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWY7ZUFDWixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBQyxDQUFBLFFBQXJCO0lBRlM7O21CQUliLE1BQUEsR0FBUSxTQUFBO2VBQUcsSUFBSSxHQUFKLENBQVEsSUFBQyxDQUFBLGdCQUFUO0lBQUg7O21CQUNSLE1BQUEsR0FBUSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtlQUVKLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBSSxHQUFKLENBQVEsQ0FBUixFQUFVLENBQVYsRUFBWSxDQUFaLENBQWI7SUFGSTs7bUJBSVIsY0FBQSxHQUFnQixTQUFDLENBQUQ7ZUFDWixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLFVBQUosQ0FBZSxDQUFmO0lBRDFCOzttQkFHaEIsa0JBQUEsR0FBb0IsU0FBQyxDQUFEO0FBRWhCLFlBQUE7UUFBQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSSxNQUFKLENBQVcsQ0FBWDs4Q0FDZixDQUFFLFFBQVEsQ0FBQyxJQUFoQixDQUFxQixJQUFDLENBQUEsZ0JBQXRCO0lBSGdCOzttQkFLcEIscUJBQUEsR0FBdUIsU0FBQyxDQUFEO2VBQU8sSUFBQyxDQUFBLG1CQUFELEdBQXVCO0lBQTlCOzs7O0dBN0NSOztBQStDbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwICAgICAwMFxuIyAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4jICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAwIDAwMFxuIyAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgMDAwXG5cbkFjdG9yICAgICAgPSByZXF1aXJlICcuL2FjdG9yJ1xuUG9zICAgICAgICA9IHJlcXVpcmUgJy4vbGliL3BvcydcblZlY3RvciAgICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5RdWF0ZXJuaW9uID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblxuY2xhc3MgSXRlbSBleHRlbmRzIEFjdG9yXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgQG5hbWUgPSBAY29uc3RydWN0b3IubmFtZVxuICAgICAgICBAY3JlYXRlTWVzaD8oKVxuICAgICAgICB3b3JsZC5zY2VuZS5hZGQgQG1lc2ggaWYgQG1lc2g/XG4gICAgICAgIEBwb3NpdGlvbiAgICAgICAgID0gbmV3IFZlY3RvclxuICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IG5ldyBWZWN0b3JcbiAgICAgICAgQGRpcmVjdGlvbiAgICAgICAgPSBuZXcgVmVjdG9yXG4gICAgICAgIEBtb3ZlX2FjdGlvbiAgICAgID0gbnVsbFxuXG4gICAgZGVsOiAtPlxuICAgICAgICByZXR1cm4gaWYgQG5hbWUgPT0gJ2RlbCdcbiAgICAgICAgc3VwZXIgXG4gICAgICAgIEBuYW1lID0gJ2RlbCdcbiAgICAgICAgd29ybGQuc2NlbmUucmVtb3ZlIEBtZXNoIGlmIEBtZXNoP1xuICAgICAgICB3b3JsZC5yZW1vdmVPYmplY3QgQFxuICAgICAgICBAZW1pdCAnZGVsZXRlZCdcbiAgICAgICAgXG4gICAgbmV3Q2VsbE1hdGU6IC0+XG4gICAgY2VsbE1hdGVMZWZ0OiAtPlxuICAgIGJ1bGxldEltcGFjdDogLT5cbiAgICByZW5kZXI6IC0+XG4gICAgICAgIFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gZmFsc2VcbiAgICBpc1NsaXBwZXJ5OiAtPiBmYWxzZVxuICAgIFxuICAgIHNldFBvc2l0aW9uOiAoeCx5LHopIC0+IFxuICAgICAgICBAcG9zaXRpb24gPSBuZXcgVmVjdG9yIHgseSx6XG4gICAgICAgIEBzZXRDdXJyZW50UG9zaXRpb24gQHBvc2l0aW9uXG5cbiAgICBnZXRQb3M6IC0+IG5ldyBQb3MgQGN1cnJlbnRfcG9zaXRpb25cbiAgICBzZXRQb3M6ICh4LHkseikgLT4gXG4gICAgICAgICMgbG9nIFwiaXRlbS5zZXRQb3MgI3tAbmFtZX0gI3t4fSAje3l9ICN7en1cIlxuICAgICAgICBAc2V0UG9zaXRpb24gbmV3IFBvcyB4LHkselxuICAgIFxuICAgIHNldE9yaWVudGF0aW9uOiAocSkgLT4gXG4gICAgICAgIEBjdXJyZW50X29yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uID0gbmV3IFF1YXRlcm5pb24gcVxuICAgICAgICBcbiAgICBzZXRDdXJyZW50UG9zaXRpb246IChwKSAtPiBcbiAgICAgICAgIyBsb2cgXCJpdGVtLnNldEN1cnJlbnRQb3NpdGlvbiAje0BuYW1lfVwiLCBwXG4gICAgICAgIEBjdXJyZW50X3Bvc2l0aW9uID0gbmV3IFZlY3RvciBwXG4gICAgICAgIEBtZXNoPy5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uXG4gICAgICAgIFxuICAgIHNldEN1cnJlbnRPcmllbnRhdGlvbjogKHEpIC0+IEBjdXJyZW50X29yaWVudGF0aW9uID0gcVxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBJdGVtIl19
//# sourceURL=../coffee/item.coffee