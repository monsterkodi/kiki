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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUE7O0FBQUUsSUFBTSxPQUFBLENBQVEsS0FBUjs7QUFDUixTQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVI7O0FBRVI7SUFFQyxjQUFBO1FBQU0sSUFBQyxDQUFBLE9BQUQsR0FBVztJQUFqQjs7bUJBRUgsT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUI7SUFBdEI7O21CQUNULGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhO1FBQXBCLENBQWhCO0lBQVY7O21CQUNsQixlQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO21CQUFPLENBQUEsWUFBYTtRQUFwQixDQUFqQjtJQUFWOzttQkFFbEIsbUJBQUEsR0FBcUIsU0FBQyxJQUFEO2VBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhLElBQWIsSUFBcUIsQ0FBQSxZQUFhLFNBQWIsSUFBMkIsQ0FBQyxDQUFDLE1BQUYsWUFBb0I7UUFBM0UsQ0FBakI7SUFBVjs7bUJBQ3JCLFdBQUEsR0FBYSxTQUFBO2VBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQTtRQUFQLENBQWpCO0lBQUg7O21CQUViLFlBQUEsR0FBYyxTQUFDLE1BQUQ7QUFFVixZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQTBCLENBQUEsS0FBSyxNQUEvQjs7b0JBQUEsQ0FBQyxDQUFFLFlBQUgsQ0FBZ0IsTUFBaEI7aUJBQUE7O0FBREo7ZUFFQSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxPQUFWLEVBQW1CLFNBQUMsQ0FBRDttQkFBTyxDQUFBLEtBQUssTUFBTCxJQUFlLENBQUMsQ0FBQyxNQUFGLEtBQVk7UUFBbEMsQ0FBbkI7SUFKVTs7bUJBT2QsU0FBQSxHQUFXLFNBQUMsTUFBRDtBQUVQLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFDSSxDQUFDLENBQUUsV0FBSCxDQUFlLE1BQWY7O0FBREo7ZUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO0lBSk87Ozs7OztBQU1mLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwXG5cbnsgXyB9ID0gcmVxdWlyZSAna3hrJ1xuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcblxuY2xhc3MgQ2VsbFxuICAgIFxuICAgIEA6ICgpIC0+IEBvYmplY3RzID0gW11cbiAgICBcbiAgICBpc0VtcHR5OiAtPiBAb2JqZWN0cy5sZW5ndGggPT0gMCAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAoY2xzcykgLT4gQG9iamVjdHMuZmlsdGVyIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9iamVjdE9mVHlwZTogIChjbHNzKSAtPiBfLmZpbmQgQG9iamVjdHMsIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuXG4gICAgZ2V0UmVhbE9iamVjdE9mVHlwZTogKGNsc3MpIC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzIG9yIG8gaW5zdGFuY2VvZiBUbXBPYmplY3QgYW5kIG8ub2JqZWN0IGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9jY3VwYW50OiAtPiBfLmZpbmQgQG9iamVjdHMsIChvKSAtPiBvLmlzU3BhY2VFZ29pc3RpYygpXG5cbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgICMga2xvZyBcImNlbGwucmVtb3ZlT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCIsIEBvYmplY3RzLmxlbmd0aFxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgbz8uY2VsbE1hdGVMZWZ0IG9iamVjdCBpZiBvICE9IG9iamVjdFxuICAgICAgICBfLnJlbW92ZSBAb2JqZWN0cywgKG8pIC0+IG8gPT0gb2JqZWN0IG9yIG8ub2JqZWN0ID09IG9iamVjdFxuICAgICAgICAjIGtsb2cgXCJjZWxsLnJlbW92ZU9iamVjdCAje29iamVjdC5uYW1lfVwiLCBAb2JqZWN0cy5sZW5ndGhcblxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgIyBrbG9nIFwiY2VsbC5hZGRPYmplY3QgI3tvYmplY3QubmFtZX1cIlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgbz8ubmV3Q2VsbE1hdGUgb2JqZWN0XG4gICAgICAgIEBvYmplY3RzLnB1c2ggb2JqZWN0XG5cbm1vZHVsZS5leHBvcnRzID0gQ2VsbCJdfQ==
//# sourceURL=../coffee/cell.coffee