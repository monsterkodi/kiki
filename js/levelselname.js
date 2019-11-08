// koffee 1.4.0
var Action, LevelSelName, ScreenText, kerror,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

kerror = require('kxk').kerror;

ScreenText = require('./screentext');

Action = require('./action');

LevelSelName = (function(superClass) {
    extend(LevelSelName, superClass);

    function LevelSelName(text) {
        LevelSelName.__super__.constructor.call(this);
        if (text) {
            this.addText(text, 2);
        }
        this.show();
    }

    LevelSelName.prototype.resized = function(w, h) {
        this.aspect = w / (h * 0.3);
        this.camera.aspect = this.aspect;
        return this.camera.updateProjectionMatrix();
    };

    return LevelSelName;

})(ScreenText);

module.exports = LevelSelName;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxuYW1lLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQSx3Q0FBQTtJQUFBOzs7QUFBRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBRVA7OztJQUVDLHNCQUFDLElBQUQ7UUFFQyw0Q0FBQTtRQUNBLElBQW9CLElBQXBCO1lBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQWUsQ0FBZixFQUFBOztRQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7SUFKRDs7MkJBTUgsT0FBQSxHQUFTLFNBQUMsQ0FBRCxFQUFHLENBQUg7UUFFTCxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUEsR0FBRSxDQUFDLENBQUEsR0FBRSxHQUFIO1FBQ1osSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQUMsQ0FBQTtlQUNsQixJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUE7SUFKSzs7OztHQVJjOztBQWMzQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAwMDAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMCAgICBcbiMgMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgXG4jIDAwMCAgICAgIDAwMDAwMDAgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAwIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAgIFxuIyAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgICBcbiMgMDAwMDAwMCAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAgXG5cbnsga2Vycm9yIH0gPSByZXF1aXJlICdreGsnXG5cblNjcmVlblRleHQgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5cbmNsYXNzIExldmVsU2VsTmFtZSBleHRlbmRzIFNjcmVlblRleHRcblxuICAgIEA6ICh0ZXh0KSAtPlxuXG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgQGFkZFRleHQgdGV4dCwgMiBpZiB0ZXh0XG4gICAgICAgIEBzaG93KClcbiAgICAgICAgXG4gICAgcmVzaXplZDogKHcsaCkgLT5cbiAgICAgICAgXG4gICAgICAgIEBhc3BlY3QgPSB3LyhoKjAuMylcbiAgICAgICAgQGNhbWVyYS5hc3BlY3QgPSBAYXNwZWN0XG4gICAgICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbFNlbE5hbWVcbiJdfQ==
//# sourceURL=../coffee/levelselname.coffee