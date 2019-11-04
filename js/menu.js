// koffee 1.4.0
var Action, Material, Menu, ScreenText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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
                this.callbacks[this.current]();
                return this.fadeOut();
        }
    };

    return Menu;

})(ScreenText);

module.exports = Menu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsa0NBQUE7SUFBQTs7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixRQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0FBRVA7OztJQUVXLGNBQUE7UUFDVCxJQUFDLENBQUEsT0FBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLFNBQUQsR0FBYTtRQUNiLElBQUMsQ0FBQSxVQUFELEdBQWM7UUFDZCx1Q0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLElBQXhCLENBQTZCLENBQUMsUUFBOUIsR0FBeUM7UUFDekMsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLElBQXhCLENBQTZCLENBQUMsUUFBOUIsR0FBeUM7SUFOaEM7O21CQVFiLEdBQUEsR0FBSyxTQUFBO1FBQ0QsS0FBSyxDQUFDLElBQU4sR0FBYTtlQUNiLCtCQUFBLFNBQUE7SUFGQzs7bUJBSUwsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLEVBQVA7UUFDTCxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsRUFBaEI7ZUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7SUFGSzs7bUJBSVQsSUFBQSxHQUFNLFNBQUE7UUFDRixLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQjtRQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE9BQWI7ZUFDQSxnQ0FBQSxTQUFBO0lBSEU7O21CQUtOLFVBQUEsR0FBWSxTQUFDLE9BQUQ7QUFDUixZQUFBO1FBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQWYsR0FBd0IsT0FBekIsQ0FBQSxHQUFvQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM5RDthQUFVLG9HQUFWO1lBQ0ksQ0FBQSxHQUFJLEVBQUEsS0FBTSxJQUFDLENBQUEsT0FBUCxJQUFtQixRQUFRLENBQUMsSUFBNUIsSUFBb0MsUUFBUSxDQUFDO1lBQ2pELENBQUEsR0FBSSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFRLENBQUM7WUFDaEMsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFTLENBQUEsRUFBQSxDQUFHLENBQUMsUUFBbkIsR0FBOEIsQ0FBQyxDQUFDLEtBQUYsQ0FBQTtZQUM5QixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFRLENBQUMsT0FBNUIsR0FBc0M7WUFDdEMsQ0FBQSxHQUFJLEVBQUEsS0FBTSxJQUFDLENBQUEsT0FBUCxJQUFtQixDQUFuQixJQUF3Qjt5QkFDNUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFTLENBQUEsRUFBQSxDQUFHLENBQUMsUUFBUSxDQUFDLEdBQTVCLENBQWdDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLEVBQUEsQ0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUE1RCxFQUErRCxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxFQUFBLENBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBM0YsRUFBOEYsQ0FBOUY7QUFOSjs7SUFGUTs7bUJBVVosSUFBQSxHQUFNLFNBQUE7UUFDRixLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQjtlQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUF2QjtJQUZFOzttQkFHTixJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxTQUFOLENBQWdCLFdBQWhCO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQXZCO0lBRkU7O21CQUlOLGdCQUFBLEdBQWtCLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBQ2QsZ0JBQU8sR0FBUDtBQUFBLGlCQUNTLEtBRFQ7Z0JBRVEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsWUFBaEI7dUJBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUhSLGlCQUlTLE1BSlQ7QUFBQSxpQkFJaUIsT0FKakI7QUFBQSxpQkFJMEIsR0FKMUI7QUFBQSxpQkFJK0IsR0FKL0I7dUJBS1EsSUFBQyxDQUFBLElBQUQsQ0FBQTtBQUxSLGlCQU1TLE1BTlQ7QUFBQSxpQkFNaUIsSUFOakI7QUFBQSxpQkFNdUIsR0FOdkI7QUFBQSxpQkFNNEIsR0FONUI7dUJBT1EsSUFBQyxDQUFBLElBQUQsQ0FBQTtBQVBSLGlCQVFTLE9BUlQ7Z0JBU1EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsYUFBaEI7Z0JBQ0EsSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFYLENBQUE7dUJBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQVhSO0lBRGM7Ozs7R0F4Q0g7O0FBc0RuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcblxuU2NyZWVuVGV4dCA9IHJlcXVpcmUgJy4vc2NyZWVudGV4dCdcbkFjdGlvbiAgICAgPSByZXF1aXJlICcuL2FjdGlvbidcbk1hdGVyaWFsICAgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBNZW51IGV4dGVuZHMgU2NyZWVuVGV4dFxuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIEBjdXJyZW50ID0gMFxuICAgICAgICBAY2FsbGJhY2tzID0gW11cbiAgICAgICAgQGxpbmVIZWlnaHQgPSAxLjFcbiAgICAgICAgc3VwZXJcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uU0hPVykuZHVyYXRpb24gPSAyNTBcbiAgICAgICAgQGdldEFjdGlvbldpdGhJZChBY3Rpb24uSElERSkuZHVyYXRpb24gPSAyMDBcbiAgICAgICAgXG4gICAgZGVsOiAtPlxuICAgICAgICB3b3JsZC5tZW51ID0gbnVsbFxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBhZGRJdGVtOiAodGV4dCwgY2IpIC0+XG4gICAgICAgIEBjYWxsYmFja3MucHVzaCBjYlxuICAgICAgICBAYWRkVGV4dCB0ZXh0XG4gICAgICBcbiAgICBzaG93OiAtPiBcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX0ZBREUnXG4gICAgICAgIEBzZXRDdXJyZW50IEBjdXJyZW50XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgIHNldEN1cnJlbnQ6IChjdXJyZW50KSAtPiAgICAgICAgXG4gICAgICAgIEBjdXJyZW50ID0gKEBtZXNoLmNoaWxkcmVuLmxlbmd0aCArIGN1cnJlbnQpICUgQG1lc2guY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGZvciBjaSBpbiBbMC4uLkBtZXNoLmNoaWxkcmVuLmxlbmd0aF1cbiAgICAgICAgICAgIG0gPSBjaSA9PSBAY3VycmVudCBhbmQgTWF0ZXJpYWwubWVudSBvciBNYXRlcmlhbC50ZXh0XG4gICAgICAgICAgICBvID0gQG1lc2guY2hpbGRyZW5bY2ldLm1hdGVyaWFsLm9wYWNpdHlcbiAgICAgICAgICAgIEBtZXNoLmNoaWxkcmVuW2NpXS5tYXRlcmlhbCA9IG0uY2xvbmUoKVxuICAgICAgICAgICAgQG1lc2guY2hpbGRyZW5bY2ldLm1hdGVyaWFsLm9wYWNpdHkgPSBvXG4gICAgICAgICAgICB6ID0gY2kgPT0gQGN1cnJlbnQgYW5kIDQgb3IgMFxuICAgICAgICAgICAgQG1lc2guY2hpbGRyZW5bY2ldLnBvc2l0aW9uLnNldCBAbWVzaC5jaGlsZHJlbltjaV0ucG9zaXRpb24ueCwgQG1lc2guY2hpbGRyZW5bY2ldLnBvc2l0aW9uLnksIHpcbiAgICAgICAgXG4gICAgbmV4dDogLT4gXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9JVEVNJ1xuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudCArIDFcbiAgICBwcmV2OiAtPiBcbiAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX0lURU0nXG4gICAgICAgIEBzZXRDdXJyZW50IEBjdXJyZW50IC0gMVxuXG4gICAgbW9kS2V5Q29tYm9FdmVudDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIHN3aXRjaCBrZXlcbiAgICAgICAgICAgIHdoZW4gJ2VzYydcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfQUJPUlQnXG4gICAgICAgICAgICAgICAgQGZhZGVPdXQoKVxuICAgICAgICAgICAgd2hlbiAnZG93bicsICdyaWdodCcsICdzJywgJ2QnXG4gICAgICAgICAgICAgICAgQG5leHQoKVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcsICd1cCcsICd3JywgJ2EnXG4gICAgICAgICAgICAgICAgQHByZXYoKVxuICAgICAgICAgICAgd2hlbiAnZW50ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX1NFTEVDVCdcbiAgICAgICAgICAgICAgICBAY2FsbGJhY2tzW0BjdXJyZW50XSgpXG4gICAgICAgICAgICAgICAgQGZhZGVPdXQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVcbiJdfQ==
//# sourceURL=../coffee/menu.coffee