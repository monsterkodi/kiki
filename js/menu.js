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
        this.getActionWithId(Action.SHOW).duration = 100;
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
        world.playSound('GEAR_ON');
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
                if (world.menu === this) {
                    return this.fadeOut();
                }
        }
    };

    return Menu;

})(ScreenText);

module.exports = Menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsMENBQUE7SUFBQTs7O0FBQUUsU0FBVyxPQUFBLENBQVEsS0FBUjs7QUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLFFBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7QUFFUDs7O0lBRUMsY0FBQTtRQUVDLElBQUMsQ0FBQSxPQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsU0FBRCxHQUFhO1FBQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYztRQUNkLHVDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxRQUE5QixHQUF5QztRQUN6QyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxRQUE5QixHQUF5QztJQVAxQzs7bUJBU0gsR0FBQSxHQUFLLFNBQUE7UUFDRCxLQUFLLENBQUMsSUFBTixHQUFhO2VBQ2IsK0JBQUEsU0FBQTtJQUZDOzttQkFJTCxPQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sRUFBUDtRQUVMLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixFQUFoQjtlQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDtJQUhLOzttQkFLVCxJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxTQUFOLENBQWdCLFNBQWhCO1FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBYjtlQUNBLGdDQUFBLFNBQUE7SUFIRTs7bUJBS04sVUFBQSxHQUFZLFNBQUMsT0FBRDtBQUNSLFlBQUE7UUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBZixHQUF3QixPQUF6QixDQUFBLEdBQW9DLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlEO2FBQVUsb0dBQVY7WUFDSSxDQUFBLEdBQUksRUFBQSxLQUFNLElBQUMsQ0FBQSxPQUFQLElBQW1CLFFBQVEsQ0FBQyxJQUE1QixJQUFvQyxRQUFRLENBQUM7WUFDakQsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNoQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFuQixHQUE4QixDQUFDLENBQUMsS0FBRixDQUFBO1lBQzlCLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUE1QixHQUFzQztZQUN0QyxDQUFBLEdBQUksRUFBQSxLQUFNLElBQUMsQ0FBQSxPQUFQLElBQW1CLENBQW5CLElBQXdCO3lCQUM1QixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFRLENBQUMsR0FBNUIsQ0FBZ0MsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFTLENBQUEsRUFBQSxDQUFHLENBQUMsUUFBUSxDQUFDLENBQTVELEVBQStELElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUEzRixFQUE4RixDQUE5RjtBQU5KOztJQUZROzttQkFVWixJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxTQUFOLENBQWdCLFdBQWhCO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQXZCO0lBRkU7O21CQUlOLElBQUEsR0FBTSxTQUFBO1FBQ0YsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7ZUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBdkI7SUFGRTs7bUJBSU4sZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFZCxnQkFBTyxHQUFQO0FBQUEsaUJBQ1MsS0FEVDtnQkFFUSxLQUFLLENBQUMsU0FBTixDQUFnQixZQUFoQjt1QkFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO0FBSFIsaUJBSVMsTUFKVDtBQUFBLGlCQUlnQixPQUpoQjtBQUFBLGlCQUl3QixHQUp4QjtBQUFBLGlCQUk0QixHQUo1Qjt1QkFLUSxJQUFDLENBQUEsSUFBRCxDQUFBO0FBTFIsaUJBTVMsTUFOVDtBQUFBLGlCQU1nQixJQU5oQjtBQUFBLGlCQU1xQixHQU5yQjtBQUFBLGlCQU15QixHQU56Qjt1QkFPUSxJQUFDLENBQUEsSUFBRCxDQUFBO0FBUFIsaUJBUVMsT0FSVDtnQkFTUSxLQUFLLENBQUMsU0FBTixDQUFnQixhQUFoQjtnQkFDQSxJQUFHLFVBQUEsS0FBYyxPQUFPLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBbkM7b0JBQ0ksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFYLENBQUEsRUFESjtpQkFBQSxNQUFBO29CQUdJLE1BQUEsQ0FBTyxtQkFBQSxHQUFvQixJQUFDLENBQUEsT0FBNUIsRUFISjs7Z0JBSUEsSUFBRyxLQUFLLENBQUMsSUFBTixLQUFjLElBQWpCOzJCQUNJLElBQUMsQ0FBQSxPQUFELENBQUEsRUFESjs7QUFkUjtJQUZjOzs7O0dBM0NIOztBQThEbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwXG4jICAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgXG5cbnsga2Vycm9yIH0gPSByZXF1aXJlICdreGsnXG5TY3JlZW5UZXh0ID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWF0ZXJpYWwgICA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIE1lbnUgZXh0ZW5kcyBTY3JlZW5UZXh0XG5cbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnQgPSAwXG4gICAgICAgIEBjYWxsYmFja3MgPSBbXVxuICAgICAgICBAbGluZUhlaWdodCA9IDEuMVxuICAgICAgICBzdXBlclxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5TSE9XKS5kdXJhdGlvbiA9IDEwMFxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5ISURFKS5kdXJhdGlvbiA9IDIwMFxuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIHdvcmxkLm1lbnUgPSBudWxsXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgIGFkZEl0ZW06ICh0ZXh0LCBjYikgLT5cbiAgICAgICAgXG4gICAgICAgIEBjYWxsYmFja3MucHVzaCBjYlxuICAgICAgICBAYWRkVGV4dCB0ZXh0XG4gICAgICBcbiAgICBzaG93OiAtPiBcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdHRUFSX09OJyAjICdBVE9NX0RJR0VTVCcgIydNRU5VX0ZBREUnXG4gICAgICAgIEBzZXRDdXJyZW50IEBjdXJyZW50XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgIHNldEN1cnJlbnQ6IChjdXJyZW50KSAtPiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50ID0gKEBtZXNoLmNoaWxkcmVuLmxlbmd0aCArIGN1cnJlbnQpICUgQG1lc2guY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGZvciBjaSBpbiBbMC4uLkBtZXNoLmNoaWxkcmVuLmxlbmd0aF1cbiAgICAgICAgICAgIG0gPSBjaSA9PSBAY3VycmVudCBhbmQgTWF0ZXJpYWwubWVudSBvciBNYXRlcmlhbC50ZXh0XG4gICAgICAgICAgICBvID0gQG1lc2guY2hpbGRyZW5bY2ldLm1hdGVyaWFsLm9wYWNpdHlcbiAgICAgICAgICAgIEBtZXNoLmNoaWxkcmVuW2NpXS5tYXRlcmlhbCA9IG0uY2xvbmUoKVxuICAgICAgICAgICAgQG1lc2guY2hpbGRyZW5bY2ldLm1hdGVyaWFsLm9wYWNpdHkgPSBvXG4gICAgICAgICAgICB6ID0gY2kgPT0gQGN1cnJlbnQgYW5kIDQgb3IgMFxuICAgICAgICAgICAgQG1lc2guY2hpbGRyZW5bY2ldLnBvc2l0aW9uLnNldCBAbWVzaC5jaGlsZHJlbltjaV0ucG9zaXRpb24ueCwgQG1lc2guY2hpbGRyZW5bY2ldLnBvc2l0aW9uLnksIHpcbiAgICAgICAgXG4gICAgbmV4dDogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9JVEVNJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudCArIDFcbiAgICAgICAgXG4gICAgcHJldjogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9JVEVNJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudCAtIDFcblxuICAgIG1vZEtleUNvbWJvRXZlbnQ6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGtleVxuICAgICAgICAgICAgd2hlbiAnZXNjJ1xuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9BQk9SVCdcbiAgICAgICAgICAgICAgICBAZmFkZU91dCgpXG4gICAgICAgICAgICB3aGVuICdkb3duJyAncmlnaHQnICdzJyAnZCdcbiAgICAgICAgICAgICAgICBAbmV4dCgpXG4gICAgICAgICAgICB3aGVuICdsZWZ0JyAndXAnICd3JyAnYSdcbiAgICAgICAgICAgICAgICBAcHJldigpXG4gICAgICAgICAgICB3aGVuICdlbnRlcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfU0VMRUNUJ1xuICAgICAgICAgICAgICAgIGlmICdmdW5jdGlvbicgPT0gdHlwZW9mIEBjYWxsYmFja3NbQGN1cnJlbnRdXG4gICAgICAgICAgICAgICAgICAgIEBjYWxsYmFja3NbQGN1cnJlbnRdKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtlcnJvciBcIm5vIG1lbnUgY2FsbGJhY2sgI3tAY3VycmVudH1cIlxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLm1lbnUgPT0gQFxuICAgICAgICAgICAgICAgICAgICBAZmFkZU91dCgpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVxuIl19
//# sourceURL=../coffee/menu.coffee