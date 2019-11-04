// koffee 1.4.0
var Action, Material, Menu, ScreenText, kerror,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

kerror = require('kxk').kerror;

ScreenText = require('./screentext');

Action = require('./action');

Material = require('./material');

Menu = (function(superClass) {
    extend(Menu, superClass);

    function Menu() {
        this.current = 0;
        this.callbacks = [];
        this.lineHeight = 1.1;
        Menu.__super__.constructor.apply(this, arguments);
        this.getActionWithId(Action.SHOW).duration = 250;
        this.getActionWithId(Action.HIDE).duration = 200;
    }

    Menu.prototype.del = function() {
        world.menu = null;
        return Menu.__super__.del.apply(this, arguments);
    };

    Menu.prototype.addItem = function(text, cb) {
        this.callbacks.push(cb);
        return this.addText(text);
    };

    Menu.prototype.show = function() {
        world.playSound('MENU_FADE');
        this.setCurrent(this.current);
        return Menu.__super__.show.apply(this, arguments);
    };

    Menu.prototype.setCurrent = function(current) {
        var ci, i, m, o, ref, results, z;
        this.current = (this.mesh.children.length + current) % this.mesh.children.length;
        results = [];
        for (ci = i = 0, ref = this.mesh.children.length; 0 <= ref ? i < ref : i > ref; ci = 0 <= ref ? ++i : --i) {
            m = ci === this.current && Material.menu || Material.text;
            o = this.mesh.children[ci].material.opacity;
            this.mesh.children[ci].material = m.clone();
            this.mesh.children[ci].material.opacity = o;
            z = ci === this.current && 4 || 0;
            results.push(this.mesh.children[ci].position.set(this.mesh.children[ci].position.x, this.mesh.children[ci].position.y, z));
        }
        return results;
    };

    Menu.prototype.next = function() {
        world.playSound('MENU_ITEM');
        return this.setCurrent(this.current + 1);
    };

    Menu.prototype.prev = function() {
        world.playSound('MENU_ITEM');
        return this.setCurrent(this.current - 1);
    };

    Menu.prototype.modKeyComboEvent = function(mod, key, combo, event) {
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

    return Menu;

})(ScreenText);

module.exports = Menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsMENBQUE7SUFBQTs7O0FBQUUsU0FBVyxPQUFBLENBQVEsS0FBUjs7QUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFFUDs7O0lBRVcsY0FBQTtRQUNULElBQUMsQ0FBQSxPQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsU0FBRCxHQUFhO1FBQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYztRQUNkLHVDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxRQUE5QixHQUF5QztRQUN6QyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxRQUE5QixHQUF5QztJQU5oQzs7bUJBUWIsR0FBQSxHQUFLLFNBQUE7UUFDRCxLQUFLLENBQUMsSUFBTixHQUFhO2VBQ2IsK0JBQUEsU0FBQTtJQUZDOzttQkFJTCxPQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sRUFBUDtRQUNMLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixFQUFoQjtlQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDtJQUZLOzttQkFJVCxJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxTQUFOLENBQWdCLFdBQWhCO1FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBYjtlQUNBLGdDQUFBLFNBQUE7SUFIRTs7bUJBS04sVUFBQSxHQUFZLFNBQUMsT0FBRDtBQUNSLFlBQUE7UUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBZixHQUF3QixPQUF6QixDQUFBLEdBQW9DLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlEO2FBQVUsb0dBQVY7WUFDSSxDQUFBLEdBQUksRUFBQSxLQUFNLElBQUMsQ0FBQSxPQUFQLElBQW1CLFFBQVEsQ0FBQyxJQUE1QixJQUFvQyxRQUFRLENBQUM7WUFDakQsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNoQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFuQixHQUE4QixDQUFDLENBQUMsS0FBRixDQUFBO1lBQzlCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUE1QixHQUFzQztZQUN0QyxDQUFBLEdBQUksRUFBQSxLQUFNLElBQUMsQ0FBQSxPQUFQLElBQW1CLENBQW5CLElBQXdCO3lCQUM1QixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFRLENBQUMsR0FBNUIsQ0FBZ0MsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFTLENBQUEsRUFBQSxDQUFHLENBQUMsUUFBUSxDQUFDLENBQTVELEVBQStELElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUEzRixFQUE4RixDQUE5RjtBQU5KOztJQUZROzttQkFVWixJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxTQUFOLENBQWdCLFdBQWhCO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQXZCO0lBRkU7O21CQUdOLElBQUEsR0FBTSxTQUFBO1FBQ0YsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7ZUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBdkI7SUFGRTs7bUJBSU4sZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFZCxnQkFBTyxHQUFQO0FBQUEsaUJBQ1MsS0FEVDtnQkFFUSxLQUFLLENBQUMsU0FBTixDQUFnQixZQUFoQjt1QkFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO0FBSFIsaUJBSVMsTUFKVDtBQUFBLGlCQUlpQixPQUpqQjtBQUFBLGlCQUkwQixHQUoxQjtBQUFBLGlCQUkrQixHQUovQjt1QkFLUSxJQUFDLENBQUEsSUFBRCxDQUFBO0FBTFIsaUJBTVMsTUFOVDtBQUFBLGlCQU1pQixJQU5qQjtBQUFBLGlCQU11QixHQU52QjtBQUFBLGlCQU00QixHQU41Qjt1QkFPUSxJQUFDLENBQUEsSUFBRCxDQUFBO0FBUFIsaUJBUVMsT0FSVDtnQkFTUSxLQUFLLENBQUMsU0FBTixDQUFnQixhQUFoQjtnQkFDQSxJQUFHLFVBQUEsS0FBYyxPQUFPLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBbkM7b0JBQ0ksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFYLENBQUEsRUFESjtpQkFBQSxNQUFBO29CQUdJLE1BQUEsQ0FBTyxtQkFBQSxHQUFvQixJQUFDLENBQUEsT0FBNUIsRUFISjs7dUJBSUEsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQWRSO0lBRmM7Ozs7R0F4Q0g7O0FBMERuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcblxueyBrZXJyb3IgfSA9IHJlcXVpcmUgJ2t4aydcblNjcmVlblRleHQgPSByZXF1aXJlICcuL3NjcmVlbnRleHQnXG5BY3Rpb24gICAgID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5NYXRlcmlhbCAgID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgTWVudSBleHRlbmRzIFNjcmVlblRleHRcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBAY3VycmVudCA9IDBcbiAgICAgICAgQGNhbGxiYWNrcyA9IFtdXG4gICAgICAgIEBsaW5lSGVpZ2h0ID0gMS4xXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLlNIT1cpLmR1cmF0aW9uID0gMjUwXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLkhJREUpLmR1cmF0aW9uID0gMjAwXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgd29ybGQubWVudSA9IG51bGxcbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgYWRkSXRlbTogKHRleHQsIGNiKSAtPlxuICAgICAgICBAY2FsbGJhY2tzLnB1c2ggY2JcbiAgICAgICAgQGFkZFRleHQgdGV4dFxuICAgICAgXG4gICAgc2hvdzogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9GQURFJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudFxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBzZXRDdXJyZW50OiAoY3VycmVudCkgLT4gICAgICAgIFxuICAgICAgICBAY3VycmVudCA9IChAbWVzaC5jaGlsZHJlbi5sZW5ndGggKyBjdXJyZW50KSAlIEBtZXNoLmNoaWxkcmVuLmxlbmd0aFxuICAgICAgICBmb3IgY2kgaW4gWzAuLi5AbWVzaC5jaGlsZHJlbi5sZW5ndGhdXG4gICAgICAgICAgICBtID0gY2kgPT0gQGN1cnJlbnQgYW5kIE1hdGVyaWFsLm1lbnUgb3IgTWF0ZXJpYWwudGV4dFxuICAgICAgICAgICAgbyA9IEBtZXNoLmNoaWxkcmVuW2NpXS5tYXRlcmlhbC5vcGFjaXR5XG4gICAgICAgICAgICBAbWVzaC5jaGlsZHJlbltjaV0ubWF0ZXJpYWwgPSBtLmNsb25lKClcbiAgICAgICAgICAgIEBtZXNoLmNoaWxkcmVuW2NpXS5tYXRlcmlhbC5vcGFjaXR5ID0gb1xuICAgICAgICAgICAgeiA9IGNpID09IEBjdXJyZW50IGFuZCA0IG9yIDBcbiAgICAgICAgICAgIEBtZXNoLmNoaWxkcmVuW2NpXS5wb3NpdGlvbi5zZXQgQG1lc2guY2hpbGRyZW5bY2ldLnBvc2l0aW9uLngsIEBtZXNoLmNoaWxkcmVuW2NpXS5wb3NpdGlvbi55LCB6XG4gICAgICAgIFxuICAgIG5leHQ6IC0+IFxuICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfSVRFTSdcbiAgICAgICAgQHNldEN1cnJlbnQgQGN1cnJlbnQgKyAxXG4gICAgcHJldjogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9JVEVNJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudCAtIDFcblxuICAgIG1vZEtleUNvbWJvRXZlbnQ6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGtleVxuICAgICAgICAgICAgd2hlbiAnZXNjJ1xuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9BQk9SVCdcbiAgICAgICAgICAgICAgICBAZmFkZU91dCgpXG4gICAgICAgICAgICB3aGVuICdkb3duJywgJ3JpZ2h0JywgJ3MnLCAnZCdcbiAgICAgICAgICAgICAgICBAbmV4dCgpXG4gICAgICAgICAgICB3aGVuICdsZWZ0JywgJ3VwJywgJ3cnLCAnYSdcbiAgICAgICAgICAgICAgICBAcHJldigpXG4gICAgICAgICAgICB3aGVuICdlbnRlcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfU0VMRUNUJ1xuICAgICAgICAgICAgICAgIGlmICdmdW5jdGlvbicgPT0gdHlwZW9mIEBjYWxsYmFja3NbQGN1cnJlbnRdXG4gICAgICAgICAgICAgICAgICAgIEBjYWxsYmFja3NbQGN1cnJlbnRdKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIm5vIG1lbnUgY2FsbGJhY2sgI3tAY3VycmVudH1cIlxuICAgICAgICAgICAgICAgIEBmYWRlT3V0KClcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51XG4iXX0=
//# sourceURL=../coffee/menu.coffee