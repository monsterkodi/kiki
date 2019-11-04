// koffee 1.4.0
var Action, Bomb, Splitter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Bomb = require('./bomb');

Action = require('./action');

Splitter = (function(superClass) {
    extend(Splitter, superClass);

    Splitter.prototype.isSpaceEgoistic = function() {
        return false;
    };

    function Splitter(dir) {
        Splitter.__super__.constructor.apply(this, arguments);
        this.size = 0.0;
        this.splitted = true;
        this.direction = dir;
        this.startTimedAction(this.getActionWithId(Action.EXPLODE));
        this.updateMesh();
    }

    return Splitter;

})(Bomb);

module.exports = Splitter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHNCQUFBO0lBQUE7OztBQUFBLElBQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7Ozt1QkFFRixlQUFBLEdBQWlCLFNBQUE7ZUFBRztJQUFIOztJQUVkLGtCQUFDLEdBQUQ7UUFDQywyQ0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBYTtRQUNiLElBQUMsQ0FBQSxRQUFELEdBQWE7UUFDYixJQUFDLENBQUEsU0FBRCxHQUFhO1FBRWIsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxPQUF4QixDQUFsQjtRQUNBLElBQUMsQ0FBQSxVQUFELENBQUE7SUFQRDs7OztHQUpnQjs7QUFhdkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMCAgXG4jICAgICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgIDAwMCAgICAgMDAwICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgMDAwMDAwMCAgIDAwMCAgICAgICAgMDAwMDAwMCAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuXG5Cb21iICAgPSByZXF1aXJlICcuL2JvbWInXG5BY3Rpb24gPSByZXF1aXJlICcuL2FjdGlvbidcblxuY2xhc3MgU3BsaXR0ZXIgZXh0ZW5kcyBCb21iXG5cbiAgICBpc1NwYWNlRWdvaXN0aWM6IC0+IGZhbHNlXG4gICAgICAgIFxuICAgIEA6IChkaXIpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBzaXplICAgICAgPSAwLjBcbiAgICAgICAgQHNwbGl0dGVkICA9IHRydWVcbiAgICAgICAgQGRpcmVjdGlvbiA9IGRpclxuICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5FWFBMT0RFXG4gICAgICAgIEB1cGRhdGVNZXNoKClcblxubW9kdWxlLmV4cG9ydHMgPSBTcGxpdHRlclxuIl19
//# sourceURL=../coffee/splitter.coffee