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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUE7O0FBQUUsSUFBTSxPQUFBLENBQVEsS0FBUjs7QUFFUixTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVI7O0FBRU47SUFFQyxjQUFBO1FBQUcsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUFkOzttQkFFSCxPQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQjtJQUF0Qjs7bUJBQ1QsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO2VBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDttQkFBTyxDQUFBLFlBQWE7UUFBcEIsQ0FBaEI7SUFBVjs7bUJBQ2xCLGVBQUEsR0FBa0IsU0FBQyxJQUFEO2VBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhO1FBQXBCLENBQWpCO0lBQVY7O21CQUVsQixtQkFBQSxHQUFxQixTQUFDLElBQUQ7ZUFBVSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDttQkFBTyxDQUFBLFlBQWEsSUFBYixJQUFxQixDQUFBLFlBQWEsU0FBYixJQUEyQixDQUFDLENBQUMsTUFBRixZQUFvQjtRQUEzRSxDQUFqQjtJQUFWOzttQkFDckIsV0FBQSxHQUFhLFNBQUE7ZUFBRyxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsZUFBRixDQUFBO1FBQVAsQ0FBakI7SUFBSDs7bUJBRWIsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUVWLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7O1lBQ0ksSUFBMEIsQ0FBQSxLQUFLLE1BQS9COztvQkFBQSxDQUFDLENBQUUsWUFBSCxDQUFnQixNQUFoQjtpQkFBQTs7QUFESjtlQUVBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLE9BQVYsRUFBbUIsU0FBQyxDQUFEO21CQUFPLENBQUEsS0FBSyxNQUFMLElBQWUsQ0FBQyxDQUFDLE1BQUYsS0FBWTtRQUFsQyxDQUFuQjtJQUpVOzttQkFPZCxTQUFBLEdBQVcsU0FBQyxNQUFEO0FBRVAsWUFBQTtBQUFBO0FBQUEsYUFBQSxxQ0FBQTs7O2dCQUNJLENBQUMsQ0FBRSxXQUFILENBQWUsTUFBZjs7QUFESjtlQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7SUFKTzs7Ozs7O0FBTWYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDBcblxueyBfIH0gPSByZXF1aXJlICdreGsnXG5cblRtcE9iamVjdCA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuXG5jbGFzcyBDZWxsXG4gICAgXG4gICAgQDogLT4gQG9iamVjdHMgPSBbXVxuICAgIFxuICAgIGlzRW1wdHk6IC0+IEBvYmplY3RzLmxlbmd0aCA9PSAwICAgIFxuICAgIGdldE9iamVjdHNPZlR5cGU6IChjbHNzKSAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0T2ZUeXBlOiAgKGNsc3MpIC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG5cbiAgICBnZXRSZWFsT2JqZWN0T2ZUeXBlOiAoY2xzcykgLT4gXy5maW5kIEBvYmplY3RzLCAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3Mgb3IgbyBpbnN0YW5jZW9mIFRtcE9iamVjdCBhbmQgby5vYmplY3QgaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2NjdXBhbnQ6IC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8uaXNTcGFjZUVnb2lzdGljKClcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgIyBrbG9nIFwiY2VsbC5yZW1vdmVPYmplY3QgI3tvYmplY3QubmFtZX1cIiwgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBvPy5jZWxsTWF0ZUxlZnQgb2JqZWN0IGlmIG8gIT0gb2JqZWN0XG4gICAgICAgIF8ucmVtb3ZlIEBvYmplY3RzLCAobykgLT4gbyA9PSBvYmplY3Qgb3Igby5vYmplY3QgPT0gb2JqZWN0XG4gICAgICAgICMga2xvZyBcImNlbGwucmVtb3ZlT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCIsIEBvYmplY3RzLmxlbmd0aFxuXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICAjIGtsb2cgXCJjZWxsLmFkZE9iamVjdCAje29iamVjdC5uYW1lfVwiXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBvPy5uZXdDZWxsTWF0ZSBvYmplY3RcbiAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3RcblxubW9kdWxlLmV4cG9ydHMgPSBDZWxsIl19
//# sourceURL=../coffee/cell.coffee