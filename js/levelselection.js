// koffee 1.4.0

/*
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000
 */
var LevelSelName, LevelSelection, clamp, elem, klog, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('kxk'), clamp = ref.clamp, elem = ref.elem, klog = ref.klog;

LevelSelName = require('./levelselname');

LevelSelection = (function() {
    function LevelSelection(gameWorld) {
        var World, ref1, view;
        this.gameWorld = gameWorld;
        this.resized = bind(this.resized, this);
        this.modKeyComboEvent = bind(this.modKeyComboEvent, this);
        World = require('./world');
        this.levels = World.levels.list;
        this.index = (((ref1 = this.gameWorld.level_index) != null ? ref1 : 0) + 1) % this.levels.length;
        this.gameWorld.menu.del();
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
        this.world.text = new LevelSelName(this.levels[this.index]);
        this.resized(this.gameWorld.screenSize.w, this.gameWorld.screenSize.h);
    }

    LevelSelection.prototype.navigate = function(action) {
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
        klog(this.index, this.levels[this.index]);
        this.world.create(this.levels[this.index]);
        this.world.text = new LevelSelName(this.levels[this.index]);
        return this.resized(this.gameWorld.screenSize.w, this.gameWorld.screenSize.h);
    };

    LevelSelection.prototype.del = function() {
        delete this.gameWorld.levelSelection;
        return this.world.del();
    };

    LevelSelection.prototype.load = function() {
        global.world = this.gameWorld;
        this.gameWorld.create(this.levels[this.index], false);
        return this.del();
    };

    LevelSelection.prototype.close = function() {
        var ref1;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG9EQUFBO0lBQUE7O0FBUUEsTUFBd0IsT0FBQSxDQUFRLEtBQVIsQ0FBeEIsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZTs7QUFFZixZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSOztBQUVUO0lBRUMsd0JBQUMsU0FBRDtBQUVDLFlBQUE7UUFGQSxJQUFDLENBQUEsWUFBRDs7O1FBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSO1FBRVIsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXZCLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxzREFBMEIsQ0FBMUIsQ0FBQSxHQUErQixDQUFoQyxDQUFBLEdBQXFDLElBQUMsQ0FBQSxNQUFNLENBQUM7UUFFdEQsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBaEIsQ0FBQTtRQUVBLElBQUEsR0FBTyxJQUFBLENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFNLFNBQU47U0FBTDtRQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQVgsR0FBc0I7UUFDdEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBaEIsQ0FBNEIsSUFBNUI7UUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksS0FBSixDQUFVLElBQVYsRUFBZ0IsSUFBaEI7UUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsTUFBTyxDQUFBLElB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QUFBQSxpQkFHaUUsS0FIakU7dUJBRzRFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtBQUg1RTtJQUZjOzs2QkFPbEIsT0FBQSxHQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0lBQVY7OzZCQUVULElBQUEsR0FBTSxTQUFBO2VBRUYsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7SUFGRTs7Ozs7O0FBSVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIFxuMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgXG4wMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICBcbjAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwMDAwMCAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIyNcblxueyBjbGFtcCwgZWxlbSwga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5MZXZlbFNlbE5hbWUgPSByZXF1aXJlICcuL2xldmVsc2VsbmFtZSdcblxuY2xhc3MgTGV2ZWxTZWxlY3Rpb25cbiAgICBcbiAgICBAOiAoQGdhbWVXb3JsZCkgLT5cbiAgICAgICAgXG4gICAgICAgIFdvcmxkID0gcmVxdWlyZSAnLi93b3JsZCdcbiAgICAgICAgXG4gICAgICAgIEBsZXZlbHMgPSBXb3JsZC5sZXZlbHMubGlzdFxuICAgICAgICBcbiAgICAgICAgQGluZGV4ID0gKChAZ2FtZVdvcmxkLmxldmVsX2luZGV4ID8gMCkgKyAxKSAlIEBsZXZlbHMubGVuZ3RoXG4gICAgICAgIFxuICAgICAgICBAZ2FtZVdvcmxkLm1lbnUuZGVsKClcblxuICAgICAgICB2aWV3ID0gZWxlbSBjbGFzczoncHJldmlldydcbiAgICAgICAgdmlldy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICAgICAgdmlldy5zdHlsZS5sZWZ0ICAgICA9ICcwJ1xuICAgICAgICB2aWV3LnN0eWxlLnJpZ2h0ICAgID0gJzAnXG4gICAgICAgIHZpZXcuc3R5bGUudG9wICAgICAgPSAnMCdcbiAgICAgICAgdmlldy5zdHlsZS5ib3R0b20gICA9ICcwJ1xuICAgICAgICBAZ2FtZVdvcmxkLnZpZXcuYXBwZW5kQ2hpbGQgdmlld1xuICAgICAgICBAd29ybGQgPSBuZXcgV29ybGQgdmlldywgdHJ1ZVxuICAgICAgICBAd29ybGQuY3JlYXRlIEBsZXZlbHNbQGluZGV4XVxuICAgICAgICBAd29ybGQudGV4dCA9IG5ldyBMZXZlbFNlbE5hbWUgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEByZXNpemVkIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS53LCBAZ2FtZVdvcmxkLnNjcmVlblNpemUuaFxuICAgICAgICBcbiAgICBuYXZpZ2F0ZTogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb25cbiAgICAgICAgICAgIHdoZW4gJ3JpZ2h0JyAnZG93bicgdGhlbiBAaW5kZXggKz0gMVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3VwJyAgICB0aGVuIEBpbmRleCAtPSAxXG4gICAgICAgICAgICB3aGVuICdwYWdlIHVwJyAgICAgIHRoZW4gQGluZGV4IC09IDEwXG4gICAgICAgICAgICB3aGVuICdwYWdlIGRvd24nICAgIHRoZW4gQGluZGV4ICs9IDEwXG4gICAgICAgICAgICB3aGVuICdob21lJyAgICAgICAgIHRoZW4gQGluZGV4ID0gMFxuICAgICAgICAgICAgd2hlbiAnZW5kJyAgICAgICAgICB0aGVuIEBpbmRleCA9IEBsZXZlbHMubGVuZ3RoLTFcbiAgICAgICAgXG4gICAgICAgIEBpbmRleCA9IGNsYW1wIDAsIEBsZXZlbHMubGVuZ3RoLTEsIEBpbmRleFxuICAgICAgICBrbG9nIEBpbmRleCwgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEB3b3JsZC5jcmVhdGUgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEB3b3JsZC50ZXh0ID0gbmV3IExldmVsU2VsTmFtZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgQHJlc2l6ZWQgQGdhbWVXb3JsZC5zY3JlZW5TaXplLncsIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS5oXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgXG4gICAgICAgIGRlbGV0ZSBAZ2FtZVdvcmxkLmxldmVsU2VsZWN0aW9uXG4gICAgICAgIEB3b3JsZC5kZWwoKVxuICAgICAgICBcbiAgICBsb2FkOiAtPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAZ2FtZVdvcmxkXG4gICAgICAgIEBnYW1lV29ybGQuY3JlYXRlIEBsZXZlbHNbQGluZGV4XSwgZmFsc2VcbiAgICAgICAgQGRlbCgpXG4gICAgICAgIFxuICAgIGNsb3NlOiAtPiBcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBnYW1lV29ybGRcbiAgICAgICAgQGRlbCgpXG4gICAgICAgIEBnYW1lV29ybGQuYXBwbHlTY2hlbWUgQGdhbWVXb3JsZC5kaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuICAgICAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgPT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyAgICAgICAgICAgdGhlbiBAY2xvc2UoKVxuICAgICAgICAgICAgd2hlbiAnZW50ZXInICdzcGFjZScgdGhlbiBAbG9hZCgpXG4gICAgICAgICAgICB3aGVuICdsZWZ0JyAncmlnaHQnICd1cCcgJ2Rvd24nICdwYWdlIHVwJyAncGFnZSBkb3duJyAnaG9tZScgJ2VuZCcgdGhlbiBAbmF2aWdhdGUgY29tYm9cbiAgICAgICAgXG4gICAgcmVzaXplZDogKHcsIGgpID0+IEB3b3JsZC5yZXNpemVkIHcsIGhcbiAgICAgICAgXG4gICAgc3RlcDogLT4gXG4gICAgXG4gICAgICAgIEB3b3JsZC5zdGVwKClcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxTZWxlY3Rpb25cbiJdfQ==
//# sourceURL=../coffee/levelselection.coffee