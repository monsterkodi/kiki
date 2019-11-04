// koffee 1.4.0
var Item, TmpObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Item = require('./item');

TmpObject = (function(superClass) {
    extend(TmpObject, superClass);

    TmpObject.tmpID = 0;

    TmpObject.prototype.isSpaceEgoistic = function() {
        return true;
    };

    function TmpObject(o) {
        TmpObject.tmpID += 1;
        this.time = 0;
        this.object = o;
        this.name = "tmp" + TmpObject.tmpID;
        TmpObject.__super__.constructor.apply(this, arguments);
        this.setPos(o.getPos());
    }

    TmpObject.prototype.del = function() {
        return TmpObject.__super__.del.apply(this, arguments);
    };

    return TmpObject;

})(Item);

module.exports = TmpObject;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG1wb2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxlQUFBO0lBQUE7OztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFRDs7O0lBRUYsU0FBQyxDQUFBLEtBQUQsR0FBUzs7d0JBQ1QsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFZCxtQkFBQyxDQUFEO1FBQ0MsU0FBUyxDQUFDLEtBQVYsSUFBbUI7UUFDbkIsSUFBQyxDQUFBLElBQUQsR0FBUTtRQUNSLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsSUFBRCxHQUFRLEtBQUEsR0FBTSxTQUFTLENBQUM7UUFDeEIsNENBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsQ0FBQyxDQUFDLE1BQUYsQ0FBQSxDQUFSO0lBTkQ7O3dCQVFILEdBQUEsR0FBSyxTQUFBO2VBRUQsb0NBQUEsU0FBQTtJQUZDOzs7O0dBYmU7O0FBaUJ4QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDBcbiMgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiMgICAgMDAwICAgICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgICAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgICAwMDAgICBcbiMgICAgMDAwICAgICAwMDAgMCAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICBcbiMgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICBcblxuSXRlbSA9IHJlcXVpcmUgJy4vaXRlbSdcblxuY2xhc3MgVG1wT2JqZWN0IGV4dGVuZHMgSXRlbVxuICAgIFxuICAgIEB0bXBJRCA9IDBcbiAgICBpc1NwYWNlRWdvaXN0aWM6IC0+IHRydWVcbiAgICBcbiAgICBAOiAobykgLT5cbiAgICAgICAgVG1wT2JqZWN0LnRtcElEICs9IDFcbiAgICAgICAgQHRpbWUgPSAwXG4gICAgICAgIEBvYmplY3QgPSBvXG4gICAgICAgIEBuYW1lID0gXCJ0bXAje1RtcE9iamVjdC50bXBJRH1cIlxuICAgICAgICBzdXBlclxuICAgICAgICBAc2V0UG9zIG8uZ2V0UG9zKClcbiAgICBcbiAgICBkZWw6IC0+IFxuICAgICAgICAjIGtsb2cgXCJ0bXBPYmplY3QgLS0tLS0tLS0gZGVsICN7QG5hbWV9XCIsIEBnZXRQb3MoKVxuICAgICAgICBzdXBlclxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gVG1wT2JqZWN0XG4iXX0=
//# sourceURL=../coffee/tmpobject.coffee