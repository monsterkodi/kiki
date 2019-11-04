// koffee 1.4.0
var Cell, TmpObject, _;

_ = require('kxk')._;

TmpObject = require('./tmpobject');

Cell = (function() {
    function Cell() {
        this.objects = [];
    }

    Cell.prototype.isEmpty = function() {
        return this.objects.length === 0;
    };

    Cell.prototype.getObjectsOfType = function(clss) {
        return this.objects.filter(function(o) {
            return o instanceof clss;
        });
    };

    Cell.prototype.getObjectOfType = function(clss) {
        return _.find(this.objects, function(o) {
            return o instanceof clss;
        });
    };

    Cell.prototype.getRealObjectOfType = function(clss) {
        return _.find(this.objects, function(o) {
            return o instanceof clss || o instanceof TmpObject && o.object instanceof clss;
        });
    };

    Cell.prototype.getOccupant = function() {
        return _.find(this.objects, function(o) {
            return o.isSpaceEgoistic();
        });
    };

    Cell.prototype.removeObject = function(object) {
        var i, len, o, ref;
        ref = this.objects;
        for (i = 0, len = ref.length; i < len; i++) {
            o = ref[i];
            if (o !== object) {
                if (o != null) {
                    o.cellMateLeft(object);
                }
            }
        }
        return _.remove(this.objects, function(o) {
            return o === object || o.object === object;
        });
    };

    Cell.prototype.addObject = function(object) {
        var i, len, o, ref;
        ref = this.objects;
        for (i = 0, len = ref.length; i < len; i++) {
            o = ref[i];
            if (o != null) {
                o.newCellMate(object);
            }
        }
        return this.objects.push(object);
    };

    return Cell;

})();

module.exports = Cell;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUE7O0FBQUUsSUFBTSxPQUFBLENBQVEsS0FBUjs7QUFDUixTQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVI7O0FBRVI7SUFFVyxjQUFBO1FBQU0sSUFBQyxDQUFBLE9BQUQsR0FBVztJQUFqQjs7bUJBRWIsT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUI7SUFBdEI7O21CQUNULGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhO1FBQXBCLENBQWhCO0lBQVY7O21CQUNsQixlQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO21CQUFPLENBQUEsWUFBYTtRQUFwQixDQUFqQjtJQUFWOzttQkFFbEIsbUJBQUEsR0FBcUIsU0FBQyxJQUFEO2VBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhLElBQWIsSUFBcUIsQ0FBQSxZQUFhLFNBQWIsSUFBMkIsQ0FBQyxDQUFDLE1BQUYsWUFBb0I7UUFBM0UsQ0FBakI7SUFBVjs7bUJBQ3JCLFdBQUEsR0FBYSxTQUFBO2VBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQTtRQUFQLENBQWpCO0lBQUg7O21CQUViLFlBQUEsR0FBYyxTQUFDLE1BQUQ7QUFFVixZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQTBCLENBQUEsS0FBSyxNQUEvQjs7b0JBQUEsQ0FBQyxDQUFFLFlBQUgsQ0FBZ0IsTUFBaEI7aUJBQUE7O0FBREo7ZUFFQSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxPQUFWLEVBQW1CLFNBQUMsQ0FBRDttQkFBTyxDQUFBLEtBQUssTUFBTCxJQUFlLENBQUMsQ0FBQyxNQUFGLEtBQVk7UUFBbEMsQ0FBbkI7SUFKVTs7bUJBT2QsU0FBQSxHQUFXLFNBQUMsTUFBRDtBQUVQLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFDSSxDQUFDLENBQUUsV0FBSCxDQUFlLE1BQWY7O0FBREo7ZUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO0lBSk87Ozs7OztBQU1mLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwXG5cbnsgXyB9ID0gcmVxdWlyZSAna3hrJ1xuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcblxuY2xhc3MgQ2VsbFxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAoKSAtPiBAb2JqZWN0cyA9IFtdXG4gICAgXG4gICAgaXNFbXB0eTogLT4gQG9iamVjdHMubGVuZ3RoID09IDAgICAgXG4gICAgZ2V0T2JqZWN0c09mVHlwZTogKGNsc3MpIC0+IEBvYmplY3RzLmZpbHRlciAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPYmplY3RPZlR5cGU6ICAoY2xzcykgLT4gXy5maW5kIEBvYmplY3RzLCAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3NcblxuICAgIGdldFJlYWxPYmplY3RPZlR5cGU6IChjbHNzKSAtPiBfLmZpbmQgQG9iamVjdHMsIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzcyBvciBvIGluc3RhbmNlb2YgVG1wT2JqZWN0IGFuZCBvLm9iamVjdCBpbnN0YW5jZW9mIGNsc3NcbiAgICBnZXRPY2N1cGFudDogLT4gXy5maW5kIEBvYmplY3RzLCAobykgLT4gby5pc1NwYWNlRWdvaXN0aWMoKVxuXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICAjIGxvZyBcImNlbGwucmVtb3ZlT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCIsIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgbz8uY2VsbE1hdGVMZWZ0IG9iamVjdCBpZiBvICE9IG9iamVjdFxuICAgICAgICBfLnJlbW92ZSBAb2JqZWN0cywgKG8pIC0+IG8gPT0gb2JqZWN0IG9yIG8ub2JqZWN0ID09IG9iamVjdFxuICAgICAgICAjIGxvZyBcImNlbGwucmVtb3ZlT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCIsIEBvYmplY3RzLmxlbmd0aFxuXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICAjIGxvZyBcImNlbGwuYWRkT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCJcbiAgICAgICAgZm9yIG8gaW4gQG9iamVjdHNcbiAgICAgICAgICAgIG8/Lm5ld0NlbGxNYXRlIG9iamVjdFxuICAgICAgICBAb2JqZWN0cy5wdXNoIG9iamVjdFxuXG5tb2R1bGUuZXhwb3J0cyA9IENlbGwiXX0=
//# sourceURL=../coffee/cell.coffee