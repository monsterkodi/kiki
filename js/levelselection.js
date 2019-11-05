// koffee 1.4.0

/*
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000
 */
var LevelSelection, elem,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

elem = require('kxk').elem;

LevelSelection = (function() {
    function LevelSelection(gameWorld) {
        var World, view;
        this.gameWorld = gameWorld;
        this.resized = bind(this.resized, this);
        this.modKeyComboEvent = bind(this.modKeyComboEvent, this);
        this.gameWorld.menu.del();
        view = elem({
            "class": 'preview'
        });
        view.style.position = 'absolute';
        view.style.left = '0';
        view.style.right = '0';
        view.style.top = '0';
        view.style.height = '66%';
        this.gameWorld.view.appendChild(view);
        World = require('./world');
        this.world = new World(view, true);
        this.world.create('bombs');
        this.resized(this.gameWorld.screenSize.w, this.gameWorld.screenSize.h);
    }

    LevelSelection.prototype.navigate = function(action) {};

    LevelSelection.prototype.load = function() {};

    LevelSelection.prototype.close = function() {
        var ref;
        global.world = this.gameWorld;
        delete this.gameWorld.levelSelection;
        this.world.del();
        return this.gameWorld.applyScheme((ref = this.gameWorld.dict.scheme) != null ? ref : 'default');
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
        return this.world.resized(w, h * 0.66);
    };

    LevelSelection.prototype.step = function(step) {
        return this.world.step(step);
    };

    return LevelSelection;

})();

module.exports = LevelSelection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG9CQUFBO0lBQUE7O0FBUUUsT0FBUyxPQUFBLENBQVEsS0FBUjs7QUFFTDtJQUVDLHdCQUFDLFNBQUQ7QUFFQyxZQUFBO1FBRkEsSUFBQyxDQUFBLFlBQUQ7OztRQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQWhCLENBQUE7UUFFQSxJQUFBLEdBQU8sSUFBQSxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTSxTQUFOO1NBQUw7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFYLEdBQXNCO1FBRXRCLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQWhCLENBQTRCLElBQTVCO1FBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSO1FBQ1IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBQWdCLElBQWhCO1FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsT0FBZDtRQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBL0IsRUFBa0MsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBeEQ7SUFoQkQ7OzZCQWtCSCxRQUFBLEdBQVUsU0FBQyxNQUFELEdBQUE7OzZCQUVWLElBQUEsR0FBTSxTQUFBLEdBQUE7OzZCQUVOLEtBQUEsR0FBTyxTQUFBO0FBRUgsWUFBQTtRQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBQyxDQUFBO1FBQ2hCLE9BQU8sSUFBQyxDQUFBLFNBQVMsQ0FBQztRQUNsQixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBQTtlQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxvREFBZ0QsU0FBaEQ7SUFMRzs7NkJBT1AsZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFZCxnQkFBTyxLQUFQO0FBQUEsaUJBQ1MsS0FEVDt1QkFDOEIsSUFBQyxDQUFBLEtBQUQsQ0FBQTtBQUQ5QixpQkFFUyxPQUZUO0FBQUEsaUJBRWlCLE9BRmpCO3VCQUU4QixJQUFDLENBQUEsSUFBRCxDQUFBO0FBRjlCLGlCQUdTLE1BSFQ7QUFBQSxpQkFHZ0IsT0FIaEI7QUFBQSxpQkFHd0IsSUFIeEI7QUFBQSxpQkFHNkIsTUFIN0I7QUFBQSxpQkFHb0MsU0FIcEM7QUFBQSxpQkFHOEMsV0FIOUM7QUFBQSxpQkFHMEQsTUFIMUQ7QUFBQSxpQkFHaUUsS0FIakU7dUJBRzRFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtBQUg1RTtJQUZjOzs2QkFPbEIsT0FBQSxHQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLENBQUEsR0FBRSxJQUFwQjtJQUFWOzs2QkFFVCxJQUFBLEdBQU0sU0FBQyxJQUFEO2VBRUYsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtJQUZFOzs7Ozs7QUFJVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xyXG4wMDAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICBcclxuMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgXHJcbjAwMCAgICAgIDAwMDAwMDAgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIFxyXG4wMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcclxuMDAwMDAwMCAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMCAgXHJcbiMjI1xyXG5cclxueyBlbGVtIH0gPSByZXF1aXJlICdreGsnXHJcblxyXG5jbGFzcyBMZXZlbFNlbGVjdGlvblxyXG4gICAgXHJcbiAgICBAOiAoQGdhbWVXb3JsZCkgLT5cclxuICAgICAgICBcclxuICAgICAgICBAZ2FtZVdvcmxkLm1lbnUuZGVsKClcclxuICAgICAgICBcclxuICAgICAgICB2aWV3ID0gZWxlbSBjbGFzczoncHJldmlldydcclxuICAgICAgICB2aWV3LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgIHZpZXcuc3R5bGUubGVmdCAgICAgPSAnMCdcclxuICAgICAgICB2aWV3LnN0eWxlLnJpZ2h0ICAgID0gJzAnXHJcbiAgICAgICAgdmlldy5zdHlsZS50b3AgICAgICA9ICcwJ1xyXG4gICAgICAgIHZpZXcuc3R5bGUuaGVpZ2h0ICAgPSAnNjYlJ1xyXG4gICAgICAgIFxyXG4gICAgICAgIEBnYW1lV29ybGQudmlldy5hcHBlbmRDaGlsZCB2aWV3XHJcbiAgICAgICAgXHJcbiAgICAgICAgV29ybGQgPSByZXF1aXJlICcuL3dvcmxkJ1xyXG4gICAgICAgIEB3b3JsZCA9IG5ldyBXb3JsZCB2aWV3LCB0cnVlXHJcbiAgICAgICAgQHdvcmxkLmNyZWF0ZSAnYm9tYnMnXHJcbiAgICAgICAgQHJlc2l6ZWQgQGdhbWVXb3JsZC5zY3JlZW5TaXplLncsIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS5oXHJcbiAgICAgICAgXHJcbiAgICBuYXZpZ2F0ZTogKGFjdGlvbikgLT5cclxuICAgICAgICBcclxuICAgIGxvYWQ6IC0+XHJcbiAgICAgICAgXHJcbiAgICBjbG9zZTogLT4gXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gQGdhbWVXb3JsZFxyXG4gICAgICAgIGRlbGV0ZSBAZ2FtZVdvcmxkLmxldmVsU2VsZWN0aW9uXHJcbiAgICAgICAgQHdvcmxkLmRlbCgpXHJcbiAgICAgICAgQGdhbWVXb3JsZC5hcHBseVNjaGVtZSBAZ2FtZVdvcmxkLmRpY3Quc2NoZW1lID8gJ2RlZmF1bHQnXHJcbiAgICAgICAgXHJcbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgPT5cclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggY29tYm9cclxuICAgICAgICAgICAgd2hlbiAnZXNjJyAgICAgICAgICAgdGhlbiBAY2xvc2UoKVxyXG4gICAgICAgICAgICB3aGVuICdlbnRlcicgJ3NwYWNlJyB0aGVuIEBsb2FkKClcclxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3JpZ2h0JyAndXAnICdkb3duJyAncGFnZSB1cCcgJ3BhZ2UgZG93bicgJ2hvbWUnICdlbmQnIHRoZW4gQG5hdmlnYXRlIGNvbWJvXHJcbiAgICAgICAgXHJcbiAgICByZXNpemVkOiAodywgaCkgPT4gQHdvcmxkLnJlc2l6ZWQgdywgaCowLjY2XHJcbiAgICAgICAgXHJcbiAgICBzdGVwOiAoc3RlcCkgLT4gXHJcbiAgICBcclxuICAgICAgICBAd29ybGQuc3RlcCBzdGVwXHJcbiAgICBcclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbFNlbGVjdGlvblxyXG4iXX0=
//# sourceURL=../coffee/levelselection.coffee