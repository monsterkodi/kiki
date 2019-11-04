// koffee 1.4.0
var Cell, TmpObject, _;

TmpObject = require('./tmpobject');

_ = require('lodash');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUE7O0FBQUEsU0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSOztBQUNkLENBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFFUjtJQUVXLGNBQUE7UUFBTSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQWpCOzttQkFFYixPQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQjtJQUF0Qjs7bUJBQ1QsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO2VBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDttQkFBTyxDQUFBLFlBQWE7UUFBcEIsQ0FBaEI7SUFBVjs7bUJBQ2xCLGVBQUEsR0FBa0IsU0FBQyxJQUFEO2VBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhO1FBQXBCLENBQWpCO0lBQVY7O21CQUVsQixtQkFBQSxHQUFxQixTQUFDLElBQUQ7ZUFBVSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDttQkFBTyxDQUFBLFlBQWEsSUFBYixJQUFxQixDQUFBLFlBQWEsU0FBYixJQUEyQixDQUFDLENBQUMsTUFBRixZQUFvQjtRQUEzRSxDQUFqQjtJQUFWOzttQkFDckIsV0FBQSxHQUFhLFNBQUE7ZUFBRyxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsZUFBRixDQUFBO1FBQVAsQ0FBakI7SUFBSDs7bUJBRWIsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUVWLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7O1lBQ0ksSUFBMEIsQ0FBQSxLQUFLLE1BQS9COztvQkFBQSxDQUFDLENBQUUsWUFBSCxDQUFnQixNQUFoQjtpQkFBQTs7QUFESjtlQUVBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLE9BQVYsRUFBbUIsU0FBQyxDQUFEO21CQUFPLENBQUEsS0FBSyxNQUFMLElBQWUsQ0FBQyxDQUFDLE1BQUYsS0FBWTtRQUFsQyxDQUFuQjtJQUpVOzttQkFPZCxTQUFBLEdBQVcsU0FBQyxNQUFEO0FBRVAsWUFBQTtBQUFBO0FBQUEsYUFBQSxxQ0FBQTs7O2dCQUNJLENBQUMsQ0FBRSxXQUFILENBQWUsTUFBZjs7QUFESjtlQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7SUFKTzs7Ozs7O0FBTWYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcblxuVG1wT2JqZWN0ICAgPSByZXF1aXJlICcuL3RtcG9iamVjdCdcbl8gICAgICAgICAgID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBDZWxsXG4gICAgXG4gICAgY29uc3RydWN0b3I6ICgpIC0+IEBvYmplY3RzID0gW11cbiAgICBcbiAgICBpc0VtcHR5OiAtPiBAb2JqZWN0cy5sZW5ndGggPT0gMCAgICBcbiAgICBnZXRPYmplY3RzT2ZUeXBlOiAoY2xzcykgLT4gQG9iamVjdHMuZmlsdGVyIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9iamVjdE9mVHlwZTogIChjbHNzKSAtPiBfLmZpbmQgQG9iamVjdHMsIChvKSAtPiBvIGluc3RhbmNlb2YgY2xzc1xuXG4gICAgZ2V0UmVhbE9iamVjdE9mVHlwZTogKGNsc3MpIC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzIG9yIG8gaW5zdGFuY2VvZiBUbXBPYmplY3QgYW5kIG8ub2JqZWN0IGluc3RhbmNlb2YgY2xzc1xuICAgIGdldE9jY3VwYW50OiAtPiBfLmZpbmQgQG9iamVjdHMsIChvKSAtPiBvLmlzU3BhY2VFZ29pc3RpYygpXG5cbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgICMgbG9nIFwiY2VsbC5yZW1vdmVPYmplY3QgI3tvYmplY3QubmFtZX1cIiwgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBvPy5jZWxsTWF0ZUxlZnQgb2JqZWN0IGlmIG8gIT0gb2JqZWN0XG4gICAgICAgIF8ucmVtb3ZlIEBvYmplY3RzLCAobykgLT4gbyA9PSBvYmplY3Qgb3Igby5vYmplY3QgPT0gb2JqZWN0XG4gICAgICAgICMgbG9nIFwiY2VsbC5yZW1vdmVPYmplY3QgI3tvYmplY3QubmFtZX1cIiwgQG9iamVjdHMubGVuZ3RoXG5cbiAgICBhZGRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgICMgbG9nIFwiY2VsbC5hZGRPYmplY3QgI3tvYmplY3QubmFtZX1cIlxuICAgICAgICBmb3IgbyBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgbz8ubmV3Q2VsbE1hdGUgb2JqZWN0XG4gICAgICAgIEBvYmplY3RzLnB1c2ggb2JqZWN0XG5cbm1vZHVsZS5leHBvcnRzID0gQ2VsbCJdfQ==
//# sourceURL=../coffee/cell.coffee