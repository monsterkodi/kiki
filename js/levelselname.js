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
        this.lineHeight = 1.1;
        LevelSelName.__super__.constructor.apply(this, arguments);
        this.getActionWithId(Action.SHOW).duration = 250;
        this.getActionWithId(Action.HIDE).duration = 200;
    }

    LevelSelName.prototype.del = function() {
        return LevelSelName.__super__.del.apply(this, arguments);
    };

    LevelSelName.prototype.addItem = function(text, cb) {
        this.callbacks.push(cb);
        return this.addText(text);
    };

    LevelSelName.prototype.show = function() {
        world.playSound('MENU_FADE');
        this.setCurrent(this.current);
        return LevelSelName.__super__.show.apply(this, arguments);
    };

    LevelSelName.prototype.next = function() {
        world.playSound('MENU_ITEM');
        return this.setCurrent(this.current + 1);
    };

    LevelSelName.prototype.prev = function() {
        world.playSound('MENU_ITEM');
        return this.setCurrent(this.current - 1);
    };

    LevelSelName.prototype.modKeyComboEvent = function(mod, key, combo, event) {
        switch (key) {
            case 'esc':
                world.playSound('MENU_ABORT');
                return this.fadeOut();
            case 'down':
            case 'right':
            case 's':
            case 'd':
                return this.next();
            case 'left':
            case 'up':
            case 'w':
            case 'a':
                return this.prev();
            case 'enter':
                world.playSound('MENU_SELECT');
                if ('function' === typeof this.callbacks[this.current]) {
                    this.callbacks[this.current]();
                } else {
                    kerror("no menu callback " + this.current);
                }
                return this.fadeOut();
        }
    };

    return LevelSelName;

})(ScreenText);

module.exports = Menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxuYW1lLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQSx3Q0FBQTtJQUFBOzs7QUFBRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBR1A7OztJQUVDLHNCQUFDLElBQUQ7UUFFQyxJQUFDLENBQUEsVUFBRCxHQUFjO1FBQ2QsK0NBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUE2QixDQUFDLFFBQTlCLEdBQXlDO1FBQ3pDLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUE2QixDQUFDLFFBQTlCLEdBQXlDO0lBTDFDOzsyQkFPSCxHQUFBLEdBQUssU0FBQTtlQUFHLHVDQUFBLFNBQUE7SUFBSDs7MkJBRUwsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLEVBQVA7UUFDTCxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsRUFBaEI7ZUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7SUFGSzs7MkJBSVQsSUFBQSxHQUFNLFNBQUE7UUFDRixLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQjtRQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE9BQWI7ZUFDQSx3Q0FBQSxTQUFBO0lBSEU7OzJCQUtOLElBQUEsR0FBTSxTQUFBO1FBQ0YsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7ZUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBdkI7SUFGRTs7MkJBSU4sSUFBQSxHQUFNLFNBQUE7UUFDRixLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQjtlQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUF2QjtJQUZFOzsyQkFJTixnQkFBQSxHQUFrQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtBQUVkLGdCQUFPLEdBQVA7QUFBQSxpQkFDUyxLQURUO2dCQUVRLEtBQUssQ0FBQyxTQUFOLENBQWdCLFlBQWhCO3VCQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7QUFIUixpQkFJUyxNQUpUO0FBQUEsaUJBSWdCLE9BSmhCO0FBQUEsaUJBSXdCLEdBSnhCO0FBQUEsaUJBSTRCLEdBSjVCO3VCQUtRLElBQUMsQ0FBQSxJQUFELENBQUE7QUFMUixpQkFNUyxNQU5UO0FBQUEsaUJBTWdCLElBTmhCO0FBQUEsaUJBTXFCLEdBTnJCO0FBQUEsaUJBTXlCLEdBTnpCO3VCQU9RLElBQUMsQ0FBQSxJQUFELENBQUE7QUFQUixpQkFRUyxPQVJUO2dCQVNRLEtBQUssQ0FBQyxTQUFOLENBQWdCLGFBQWhCO2dCQUNBLElBQUcsVUFBQSxLQUFjLE9BQU8sSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFuQztvQkFDSSxJQUFDLENBQUEsU0FBVSxDQUFBLElBQUMsQ0FBQSxPQUFELENBQVgsQ0FBQSxFQURKO2lCQUFBLE1BQUE7b0JBR0ksTUFBQSxDQUFPLG1CQUFBLEdBQW9CLElBQUMsQ0FBQSxPQUE1QixFQUhKOzt1QkFJQSxJQUFDLENBQUEsT0FBRCxDQUFBO0FBZFI7SUFGYzs7OztHQTVCSzs7QUE4QzNCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jIDAwMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgIFxuIyAwMDAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAwMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgICBcbiMgMDAwICAgICAgMDAwMDAwMCAgICAwMDAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwIDAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAgXG4jIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAgIFxuIyAwMDAwMDAwICAwMDAwMDAwMCAgICAgIDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgICBcblxueyBrZXJyb3IgfSA9IHJlcXVpcmUgJ2t4aydcblxuU2NyZWVuVGV4dCA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcbkFjdGlvbiAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbiMgTWF0ZXJpYWwgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIExldmVsU2VsTmFtZSBleHRlbmRzIFNjcmVlblRleHRcblxuICAgIEA6ICh0ZXh0KSAtPlxuXG4gICAgICAgIEBsaW5lSGVpZ2h0ID0gMS4xXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLlNIT1cpLmR1cmF0aW9uID0gMjUwXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLkhJREUpLmR1cmF0aW9uID0gMjAwXG4gICAgICAgIFxuICAgIGRlbDogLT4gc3VwZXJcbiAgICAgICAgXG4gICAgYWRkSXRlbTogKHRleHQsIGNiKSAtPlxuICAgICAgICBAY2FsbGJhY2tzLnB1c2ggY2JcbiAgICAgICAgQGFkZFRleHQgdGV4dFxuICAgICAgXG4gICAgc2hvdzogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9GQURFJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudFxuICAgICAgICBzdXBlclxuICAgICAgICAgICAgICAgIFxuICAgIG5leHQ6IC0+IFxuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfSVRFTSdcbiAgICAgICAgQHNldEN1cnJlbnQgQGN1cnJlbnQgKyAxXG4gICAgICAgIFxuICAgIHByZXY6IC0+IFxuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfSVRFTSdcbiAgICAgICAgQHNldEN1cnJlbnQgQGN1cnJlbnQgLSAxXG5cbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBrZXlcbiAgICAgICAgICAgIHdoZW4gJ2VzYydcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfQUJPUlQnXG4gICAgICAgICAgICAgICAgQGZhZGVPdXQoKVxuICAgICAgICAgICAgd2hlbiAnZG93bicgJ3JpZ2h0JyAncycgJ2QnXG4gICAgICAgICAgICAgICAgQG5leHQoKVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3VwJyAndycgJ2EnXG4gICAgICAgICAgICAgICAgQHByZXYoKVxuICAgICAgICAgICAgd2hlbiAnZW50ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX1NFTEVDVCdcbiAgICAgICAgICAgICAgICBpZiAnZnVuY3Rpb24nID09IHR5cGVvZiBAY2FsbGJhY2tzW0BjdXJyZW50XVxuICAgICAgICAgICAgICAgICAgICBAY2FsbGJhY2tzW0BjdXJyZW50XSgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXJyb3IgXCJubyBtZW51IGNhbGxiYWNrICN7QGN1cnJlbnR9XCJcbiAgICAgICAgICAgICAgICBAZmFkZU91dCgpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVxuIl19
//# sourceURL=../coffee/levelselname.coffee