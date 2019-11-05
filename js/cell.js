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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUE7O0FBQUUsSUFBTSxPQUFBLENBQVEsS0FBUjs7QUFFUixTQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVI7O0FBRVI7SUFFQyxjQUFBO1FBQU0sSUFBQyxDQUFBLE9BQUQsR0FBVztJQUFqQjs7bUJBRUgsT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUI7SUFBdEI7O21CQUNULGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhO1FBQXBCLENBQWhCO0lBQVY7O21CQUNsQixlQUFBLEdBQWtCLFNBQUMsSUFBRDtlQUFVLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO21CQUFPLENBQUEsWUFBYTtRQUFwQixDQUFqQjtJQUFWOzttQkFFbEIsbUJBQUEsR0FBcUIsU0FBQyxJQUFEO2VBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQSxZQUFhLElBQWIsSUFBcUIsQ0FBQSxZQUFhLFNBQWIsSUFBMkIsQ0FBQyxDQUFDLE1BQUYsWUFBb0I7UUFBM0UsQ0FBakI7SUFBVjs7bUJBQ3JCLFdBQUEsR0FBYSxTQUFBO2VBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQTtRQUFQLENBQWpCO0lBQUg7O21CQUViLFlBQUEsR0FBYyxTQUFDLE1BQUQ7QUFFVixZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQTBCLENBQUEsS0FBSyxNQUEvQjs7b0JBQUEsQ0FBQyxDQUFFLFlBQUgsQ0FBZ0IsTUFBaEI7aUJBQUE7O0FBREo7ZUFFQSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxPQUFWLEVBQW1CLFNBQUMsQ0FBRDttQkFBTyxDQUFBLEtBQUssTUFBTCxJQUFlLENBQUMsQ0FBQyxNQUFGLEtBQVk7UUFBbEMsQ0FBbkI7SUFKVTs7bUJBT2QsU0FBQSxHQUFXLFNBQUMsTUFBRDtBQUVQLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFDSSxDQUFDLENBQUUsV0FBSCxDQUFlLE1BQWY7O0FBREo7ZUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO0lBSk87Ozs7OztBQU1mLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgXG4jICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwXG5cbnsgXyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5UbXBPYmplY3QgICA9IHJlcXVpcmUgJy4vdG1wb2JqZWN0J1xuXG5jbGFzcyBDZWxsXG4gICAgXG4gICAgQDogKCkgLT4gQG9iamVjdHMgPSBbXVxuICAgIFxuICAgIGlzRW1wdHk6IC0+IEBvYmplY3RzLmxlbmd0aCA9PSAwICAgIFxuICAgIGdldE9iamVjdHNPZlR5cGU6IChjbHNzKSAtPiBAb2JqZWN0cy5maWx0ZXIgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2JqZWN0T2ZUeXBlOiAgKGNsc3MpIC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8gaW5zdGFuY2VvZiBjbHNzXG5cbiAgICBnZXRSZWFsT2JqZWN0T2ZUeXBlOiAoY2xzcykgLT4gXy5maW5kIEBvYmplY3RzLCAobykgLT4gbyBpbnN0YW5jZW9mIGNsc3Mgb3IgbyBpbnN0YW5jZW9mIFRtcE9iamVjdCBhbmQgby5vYmplY3QgaW5zdGFuY2VvZiBjbHNzXG4gICAgZ2V0T2NjdXBhbnQ6IC0+IF8uZmluZCBAb2JqZWN0cywgKG8pIC0+IG8uaXNTcGFjZUVnb2lzdGljKClcblxuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgIyBrbG9nIFwiY2VsbC5yZW1vdmVPYmplY3QgI3tvYmplY3QubmFtZX1cIiwgQG9iamVjdHMubGVuZ3RoXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBvPy5jZWxsTWF0ZUxlZnQgb2JqZWN0IGlmIG8gIT0gb2JqZWN0XG4gICAgICAgIF8ucmVtb3ZlIEBvYmplY3RzLCAobykgLT4gbyA9PSBvYmplY3Qgb3Igby5vYmplY3QgPT0gb2JqZWN0XG4gICAgICAgICMga2xvZyBcImNlbGwucmVtb3ZlT2JqZWN0ICN7b2JqZWN0Lm5hbWV9XCIsIEBvYmplY3RzLmxlbmd0aFxuXG4gICAgYWRkT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICAjIGtsb2cgXCJjZWxsLmFkZE9iamVjdCAje29iamVjdC5uYW1lfVwiXG4gICAgICAgIGZvciBvIGluIEBvYmplY3RzXG4gICAgICAgICAgICBvPy5uZXdDZWxsTWF0ZSBvYmplY3RcbiAgICAgICAgQG9iamVjdHMucHVzaCBvYmplY3RcblxubW9kdWxlLmV4cG9ydHMgPSBDZWxsIl19
//# sourceURL=../coffee/cell.coffee