// koffee 1.4.0

/*
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000
 */
var LevelSelName, LevelSelection, clamp, elem, prefs, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('kxk'), prefs = ref.prefs, clamp = ref.clamp, elem = ref.elem;

LevelSelName = require('./levelselname');

LevelSelection = (function() {
    function LevelSelection(gameWorld) {
        var World, ref1, ref2, view;
        this.gameWorld = gameWorld;
        this.resized = bind(this.resized, this);
        this.modKeyComboEvent = bind(this.modKeyComboEvent, this);
        World = require('./world');
        this.levels = World.levels.list;
        this.index = (((ref1 = this.gameWorld.level_index) != null ? ref1 : 0) + 1) % this.levels.length;
        if ((ref2 = this.gameWorld.menu) != null) {
            ref2.del();
        }
        view = elem({
            "class": 'preview'
        });
        view.style.position = 'absolute';
        view.style.left = '0';
        view.style.right = '0';
        view.style.top = '0';
        view.style.bottom = '0';
        this.gameWorld.view.appendChild(view);
        this.world = new World(view, true);
        this.world.create(this.levels[this.index]);
        this.addName();
        this.resized(this.gameWorld.screenSize.w, this.gameWorld.screenSize.h);
    }

    LevelSelection.prototype.addName = function() {
        this.world.text = new LevelSelName(this.levels[this.index]);
        this.world.text.addText("");
        return this.world.text.addText("" + (prefs.get("solved▸" + this.levels[this.index], false) && 'solved' || this.index + 1), 0.8);
    };

    LevelSelection.prototype.navigate = function(action) {
        var oldIndex;
        oldIndex = this.index;
        switch (action) {
            case 'right':
            case 'down':
                this.index += 1;
                break;
            case 'left':
            case 'up':
                this.index -= 1;
                break;
            case 'page up':
                this.index -= 10;
                break;
            case 'page down':
                this.index += 10;
                break;
            case 'home':
                this.index = 0;
                break;
            case 'end':
                this.index = this.levels.length - 1;
        }
        this.index = clamp(0, this.levels.length - 1, this.index);
        if (oldIndex !== this.index) {
            this.world.playSound('MENU_ITEM');
            this.world.create(this.levels[this.index]);
            this.addName();
            return this.resized(this.gameWorld.screenSize.w, this.gameWorld.screenSize.h);
        }
    };

    LevelSelection.prototype.del = function() {
        delete this.gameWorld.levelSelection;
        return this.world.del();
    };

    LevelSelection.prototype.load = function() {
        this.world.playSound('MENU_SELECT');
        global.world = this.gameWorld;
        this.gameWorld.create(this.levels[this.index], false);
        return this.del();
    };

    LevelSelection.prototype.close = function() {
        var ref1;
        this.world.playSound('MENU_ABORT');
        global.world = this.gameWorld;
        this.del();
        return this.gameWorld.applyScheme((ref1 = this.gameWorld.dict.scheme) != null ? ref1 : 'default');
    };

    LevelSelection.prototype.modKeyComboEvent = function(mod, key, combo, event) {
        switch (combo) {
            case 'esc':
                return this.close();
            case 'enter':
            case 'space':
                return this.load();
            case 'left':
            case 'right':
            case 'up':
            case 'down':
            case 'page up':
            case 'page down':
            case 'home':
            case 'end':
                return this.navigate(combo);
        }
    };

    LevelSelection.prototype.resized = function(w, h) {
        return this.world.resized(w, h);
    };

    LevelSelection.prototype.step = function() {
        return this.world.step();
    };

    return LevelSelection;

})();

module.exports = LevelSelection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLHFEQUFBO0lBQUE7O0FBUUEsTUFBeUIsT0FBQSxDQUFRLEtBQVIsQ0FBekIsRUFBRSxpQkFBRixFQUFTLGlCQUFULEVBQWdCOztBQUVoQixZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSOztBQUVUO0lBRUMsd0JBQUMsU0FBRDtBQUVDLFlBQUE7UUFGQSxJQUFDLENBQUEsWUFBRDs7O1FBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSO1FBRVIsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXZCLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxzREFBMEIsQ0FBMUIsQ0FBQSxHQUErQixDQUFoQyxDQUFBLEdBQXFDLElBQUMsQ0FBQSxNQUFNLENBQUM7O2dCQUV2QyxDQUFFLEdBQWpCLENBQUE7O1FBRUEsSUFBQSxHQUFPLElBQUEsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU0sU0FBTjtTQUFMO1FBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWCxHQUFzQjtRQUN0QixJQUFDLENBQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFoQixDQUE0QixJQUE1QjtRQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxLQUFKLENBQVUsSUFBVixFQUFnQixJQUFoQjtRQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLElBQUMsQ0FBQSxNQUFPLENBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBdEI7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QTtlQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxzREFBZ0QsU0FBaEQ7SUFMRzs7NkJBT1AsZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFZCxnQkFBTyxLQUFQO0FBQUEsaUJBQ1MsS0FEVDt1QkFDOEIsSUFBQyxDQUFBLEtBQUQsQ0FBQTtBQUQ5QixpQkFFUyxPQUZUO0FBQUEsaUJBRWlCLE9BRmpCO3VCQUU4QixJQUFDLENBQUEsSUFBRCxDQUFBO0FBRjlCLGlCQUdTLE1BSFQ7QUFBQSxpQkFHZ0IsT0FIaEI7QUFBQSxpQkFHd0IsSUFIeEI7QUFBQSxpQkFHNkIsTUFIN0I7QUFBQSxpQkFHb0MsU0FIcEM7QUFBQSxpQkFHOEMsV0FIOUM7QUFBQSxpQkFHMEQsTUFIMUQ7QUFBQSxpQkFHaUUsS0FIakU7dUJBRzRFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtBQUg1RTtJQUZjOzs2QkFPbEIsT0FBQSxHQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0lBQVY7OzZCQUVULElBQUEsR0FBTSxTQUFBO2VBRUYsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7SUFGRTs7Ozs7O0FBSVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIFxuMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgXG4wMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICBcbjAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwMDAwMCAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIyNcblxueyBwcmVmcywgY2xhbXAsIGVsZW0gfSA9IHJlcXVpcmUgJ2t4aydcblxuTGV2ZWxTZWxOYW1lID0gcmVxdWlyZSAnLi9sZXZlbHNlbG5hbWUnXG5cbmNsYXNzIExldmVsU2VsZWN0aW9uXG4gICAgXG4gICAgQDogKEBnYW1lV29ybGQpIC0+XG4gICAgICAgIFxuICAgICAgICBXb3JsZCA9IHJlcXVpcmUgJy4vd29ybGQnXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxzID0gV29ybGQubGV2ZWxzLmxpc3RcbiAgICAgICAgXG4gICAgICAgIEBpbmRleCA9ICgoQGdhbWVXb3JsZC5sZXZlbF9pbmRleCA/IDApICsgMSkgJSBAbGV2ZWxzLmxlbmd0aFxuICAgICAgICBcbiAgICAgICAgQGdhbWVXb3JsZC5tZW51Py5kZWwoKVxuXG4gICAgICAgIHZpZXcgPSBlbGVtIGNsYXNzOidwcmV2aWV3J1xuICAgICAgICB2aWV3LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICB2aWV3LnN0eWxlLmxlZnQgICAgID0gJzAnXG4gICAgICAgIHZpZXcuc3R5bGUucmlnaHQgICAgPSAnMCdcbiAgICAgICAgdmlldy5zdHlsZS50b3AgICAgICA9ICcwJ1xuICAgICAgICB2aWV3LnN0eWxlLmJvdHRvbSAgID0gJzAnXG4gICAgICAgIEBnYW1lV29ybGQudmlldy5hcHBlbmRDaGlsZCB2aWV3XG4gICAgICAgIEB3b3JsZCA9IG5ldyBXb3JsZCB2aWV3LCB0cnVlXG4gICAgICAgIEB3b3JsZC5jcmVhdGUgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEBhZGROYW1lKClcbiAgICAgICAgQHJlc2l6ZWQgQGdhbWVXb3JsZC5zY3JlZW5TaXplLncsIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS5oXG5cbiAgICBhZGROYW1lOiAtPiBcbiAgICAgICAgXG4gICAgICAgIEB3b3JsZC50ZXh0ID0gbmV3IExldmVsU2VsTmFtZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgQHdvcmxkLnRleHQuYWRkVGV4dCBcIlwiXG4gICAgICAgIEB3b3JsZC50ZXh0LmFkZFRleHQgXCIje3ByZWZzLmdldChcInNvbHZlZOKWuCN7QGxldmVsc1tAaW5kZXhdfVwiIGZhbHNlKSBhbmQgJ3NvbHZlZCcgb3IgQGluZGV4KzF9XCIgMC44XG4gICAgICAgIFxuICAgIG5hdmlnYXRlOiAoYWN0aW9uKSAtPlxuICAgICAgICBcbiAgICAgICAgb2xkSW5kZXggPSBAaW5kZXhcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb25cbiAgICAgICAgICAgIHdoZW4gJ3JpZ2h0JyAnZG93bicgdGhlbiBAaW5kZXggKz0gMVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3VwJyAgICB0aGVuIEBpbmRleCAtPSAxXG4gICAgICAgICAgICB3aGVuICdwYWdlIHVwJyAgICAgIHRoZW4gQGluZGV4IC09IDEwXG4gICAgICAgICAgICB3aGVuICdwYWdlIGRvd24nICAgIHRoZW4gQGluZGV4ICs9IDEwXG4gICAgICAgICAgICB3aGVuICdob21lJyAgICAgICAgIHRoZW4gQGluZGV4ID0gMFxuICAgICAgICAgICAgd2hlbiAnZW5kJyAgICAgICAgICB0aGVuIEBpbmRleCA9IEBsZXZlbHMubGVuZ3RoLTFcbiAgICAgICAgXG4gICAgICAgIEBpbmRleCA9IGNsYW1wIDAsIEBsZXZlbHMubGVuZ3RoLTEsIEBpbmRleFxuXG4gICAgICAgIGlmIG9sZEluZGV4ICE9IEBpbmRleFxuICAgICAgICAgICAgQHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9JVEVNJ1xuICAgICAgICAgICAgQHdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgICAgIEBhZGROYW1lKClcbiAgICAgICAgICAgIEByZXNpemVkIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS53LCBAZ2FtZVdvcmxkLnNjcmVlblNpemUuaFxuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBkZWxldGUgQGdhbWVXb3JsZC5sZXZlbFNlbGVjdGlvblxuICAgICAgICBAd29ybGQuZGVsKClcbiAgICAgICAgXG4gICAgbG9hZDogLT5cbiAgICAgICAgICAgICAgXG4gICAgICAgIEB3b3JsZC5wbGF5U291bmQgJ01FTlVfU0VMRUNUJ1xuICAgICAgICBnbG9iYWwud29ybGQgPSBAZ2FtZVdvcmxkXG4gICAgICAgIEBnYW1lV29ybGQuY3JlYXRlIEBsZXZlbHNbQGluZGV4XSwgZmFsc2VcbiAgICAgICAgQGRlbCgpXG4gICAgICAgIFxuICAgIGNsb3NlOiAtPiBcbiAgICAgICAgXG4gICAgICAgIEB3b3JsZC5wbGF5U291bmQgJ01FTlVfQUJPUlQnXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBnYW1lV29ybGRcbiAgICAgICAgQGRlbCgpXG4gICAgICAgIEBnYW1lV29ybGQuYXBwbHlTY2hlbWUgQGdhbWVXb3JsZC5kaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuICAgICAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgPT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyAgICAgICAgICAgdGhlbiBAY2xvc2UoKVxuICAgICAgICAgICAgd2hlbiAnZW50ZXInICdzcGFjZScgdGhlbiBAbG9hZCgpXG4gICAgICAgICAgICB3aGVuICdsZWZ0JyAncmlnaHQnICd1cCcgJ2Rvd24nICdwYWdlIHVwJyAncGFnZSBkb3duJyAnaG9tZScgJ2VuZCcgdGhlbiBAbmF2aWdhdGUgY29tYm9cbiAgICAgICAgXG4gICAgcmVzaXplZDogKHcsIGgpID0+IEB3b3JsZC5yZXNpemVkIHcsIGhcbiAgICAgICAgXG4gICAgc3RlcDogLT4gXG4gICAgXG4gICAgICAgIEB3b3JsZC5zdGVwKClcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxTZWxlY3Rpb25cbiJdfQ==
//# sourceURL=../coffee/levelselection.coffee