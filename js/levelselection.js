// koffee 1.4.0

/*
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000
 */
var LevelSelection, ScreenText, clamp, elem, klog, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('kxk'), clamp = ref.clamp, elem = ref.elem, klog = ref.klog;

ScreenText = require('./screentext');

LevelSelection = (function() {
    function LevelSelection(gameWorld) {
        var World, h, ref1, ref2, view, w;
        this.gameWorld = gameWorld;
        this.resized = bind(this.resized, this);
        this.modKeyComboEvent = bind(this.modKeyComboEvent, this);
        World = require('./world');
        this.levels = World.levels.list;
        this.index = (((ref1 = this.gameWorld.level_index) != null ? ref1 : 0) + 1) % this.levels.length;
        this.gameWorld.menu.del();
        ref2 = this.gameWorld.screenSize, w = ref2.w, h = ref2.h;
        view = elem({
            "class": 'names'
        });
        view.style.position = 'absolute';
        view.style.left = '0';
        view.style.right = '0';
        view.style.top = '66%';
        view.style.bottom = '0';
        this.gameWorld.view.appendChild(view);
        this.names = new World(view, true);
        view = elem({
            "class": 'preview'
        });
        view.style.position = 'absolute';
        view.style.left = '0';
        view.style.right = '0';
        view.style.top = '0';
        view.style.height = '66%';
        this.gameWorld.view.appendChild(view);
        this.world = new World(view, true);
        this.world.create(this.levels[this.index]);
        this.names.text = new ScreenText(this.levels[this.index]);
        this.resized(w, h);
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
        return this.names.text = new ScreenText(this.levels[this.index]);
    };

    LevelSelection.prototype.del = function() {
        delete this.gameWorld.levelSelection;
        this.world.del();
        return this.names.del();
    };

    LevelSelection.prototype.load = function() {
        global.world = this.gameWorld;
        this.gameWorld.create(this.levels[this.index]);
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
        this.world.resized(w, h * 0.66);
        return this.names.resized(w, h * 0.34);
    };

    LevelSelection.prototype.step = function(step) {
        this.world.step(step);
        return this.names.step(step);
    };

    return LevelSelection;

})();

module.exports = LevelSelection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLGtEQUFBO0lBQUE7O0FBUUEsTUFBd0IsT0FBQSxDQUFRLEtBQVIsQ0FBeEIsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZTs7QUFFZixVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBRVA7SUFFQyx3QkFBQyxTQUFEO0FBRUMsWUFBQTtRQUZBLElBQUMsQ0FBQSxZQUFEOzs7UUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7UUFFUixJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFdkIsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLHNEQUEwQixDQUExQixDQUFBLEdBQStCLENBQWhDLENBQUEsR0FBcUMsSUFBQyxDQUFBLE1BQU0sQ0FBQztRQUV0RCxJQUFDLENBQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFoQixDQUFBO1FBRUEsT0FBUSxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQW5CLEVBQUMsVUFBRCxFQUFHO1FBRUgsSUFBQSxHQUFPLElBQUEsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU0sT0FBTjtTQUFMO1FBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWCxHQUFzQjtRQUN0QixJQUFDLENBQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFoQixDQUE0QixJQUE1QjtRQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxLQUFKLENBQVUsSUFBVixFQUFnQixJQUFoQjtRQUVULElB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LEVBQWtCLEtBQWxCO0FBRWQsZ0JBQU8sS0FBUDtBQUFBLGlCQUNTLEtBRFQ7dUJBQzhCLElBQUMsQ0FBQSxLQUFELENBQUE7QUFEOUIsaUJBRVMsT0FGVDtBQUFBLGlCQUVpQixPQUZqQjt1QkFFOEIsSUFBQyxDQUFBLElBQUQsQ0FBQTtBQUY5QixpQkFHUyxNQUhUO0FBQUEsaUJBR2dCLE9BSGhCO0FBQUEsaUJBR3dCLElBSHhCO0FBQUEsaUJBRzZCLE1BSDdCO0FBQUEsaUJBR29DLFNBSHBDO0FBQUEsaUJBRzhDLFdBSDlDO0FBQUEsaUJBRzBELE1BSDFEO0FBQUEsaUJBR2lFLEtBSGpFO3VCQUc0RSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7QUFINUU7SUFGYzs7NkJBT2xCLE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBSSxDQUFKO1FBQ0wsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsQ0FBZixFQUFrQixDQUFBLEdBQUUsSUFBcEI7ZUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLENBQUEsR0FBRSxJQUFwQjtJQUZLOzs2QkFJVCxJQUFBLEdBQU0sU0FBQyxJQUFEO1FBRUYsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7SUFIRTs7Ozs7O0FBS1YsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbjAwMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgIFxuMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgXG4wMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICBcbjAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwMDAwMCAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIyNcblxueyBjbGFtcCwgZWxlbSwga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5TY3JlZW5UZXh0ID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuXG5jbGFzcyBMZXZlbFNlbGVjdGlvblxuICAgIFxuICAgIEA6IChAZ2FtZVdvcmxkKSAtPlxuICAgICAgICBcbiAgICAgICAgV29ybGQgPSByZXF1aXJlICcuL3dvcmxkJ1xuICAgICAgICBcbiAgICAgICAgQGxldmVscyA9IFdvcmxkLmxldmVscy5saXN0XG4gICAgICAgIFxuICAgICAgICBAaW5kZXggPSAoKEBnYW1lV29ybGQubGV2ZWxfaW5kZXggPyAwKSArIDEpICUgQGxldmVscy5sZW5ndGhcbiAgICAgICAgXG4gICAgICAgIEBnYW1lV29ybGQubWVudS5kZWwoKVxuXG4gICAgICAgIHt3LGh9ID0gQGdhbWVXb3JsZC5zY3JlZW5TaXplXG4gICAgICAgIFxuICAgICAgICB2aWV3ID0gZWxlbSBjbGFzczonbmFtZXMnXG4gICAgICAgIHZpZXcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgICAgIHZpZXcuc3R5bGUubGVmdCAgICAgPSAnMCdcbiAgICAgICAgdmlldy5zdHlsZS5yaWdodCAgICA9ICcwJ1xuICAgICAgICB2aWV3LnN0eWxlLnRvcCAgICAgID0gJzY2JSdcbiAgICAgICAgdmlldy5zdHlsZS5ib3R0b20gICA9ICcwJ1xuICAgICAgICBAZ2FtZVdvcmxkLnZpZXcuYXBwZW5kQ2hpbGQgdmlld1xuICAgICAgICBAbmFtZXMgPSBuZXcgV29ybGQgdmlldywgdHJ1ZVxuICAgICAgICBcbiAgICAgICAgdmlldyA9IGVsZW0gY2xhc3M6J3ByZXZpZXcnXG4gICAgICAgIHZpZXcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgICAgIHZpZXcuc3R5bGUubGVmdCAgICAgPSAnMCdcbiAgICAgICAgdmlldy5zdHlsZS5yaWdodCAgICA9ICcwJ1xuICAgICAgICB2aWV3LnN0eWxlLnRvcCAgICAgID0gJzAnXG4gICAgICAgIHZpZXcuc3R5bGUuaGVpZ2h0ICAgPSAnNjYlJ1xuICAgICAgICBAZ2FtZVdvcmxkLnZpZXcuYXBwZW5kQ2hpbGQgdmlld1xuICAgICAgICBAd29ybGQgPSBuZXcgV29ybGQgdmlldywgdHJ1ZVxuICAgICAgICBcbiAgICAgICAgQHdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgXG4gICAgICAgIEBuYW1lcy50ZXh0ID0gbmV3IFNjcmVlblRleHQgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEByZXNpemVkIHcsaFxuICAgICAgICBcbiAgICBuYXZpZ2F0ZTogKGFjdGlvbikgLT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBhY3Rpb25cbiAgICAgICAgICAgIHdoZW4gJ3JpZ2h0JyAnZG93bicgdGhlbiBAaW5kZXggKz0gMVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3VwJyAgICB0aGVuIEBpbmRleCAtPSAxXG4gICAgICAgICAgICB3aGVuICdwYWdlIHVwJyAgICAgIHRoZW4gQGluZGV4IC09IDEwXG4gICAgICAgICAgICB3aGVuICdwYWdlIGRvd24nICAgIHRoZW4gQGluZGV4ICs9IDEwXG4gICAgICAgICAgICB3aGVuICdob21lJyAgICAgICAgIHRoZW4gQGluZGV4ID0gMFxuICAgICAgICAgICAgd2hlbiAnZW5kJyAgICAgICAgICB0aGVuIEBpbmRleCA9IEBsZXZlbHMubGVuZ3RoLTFcbiAgICAgICAgXG4gICAgICAgIEBpbmRleCA9IGNsYW1wIDAsIEBsZXZlbHMubGVuZ3RoLTEsIEBpbmRleFxuICAgICAgICBrbG9nIEBpbmRleCwgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEB3b3JsZC5jcmVhdGUgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEBuYW1lcy50ZXh0ID0gbmV3IFNjcmVlblRleHQgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIFxuICAgIGRlbDogLT5cbiAgICAgICAgXG4gICAgICAgIGRlbGV0ZSBAZ2FtZVdvcmxkLmxldmVsU2VsZWN0aW9uXG4gICAgICAgIEB3b3JsZC5kZWwoKVxuICAgICAgICBAbmFtZXMuZGVsKClcbiAgICAgICAgXG4gICAgbG9hZDogLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gQGdhbWVXb3JsZFxuICAgICAgICBAZ2FtZVdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgQGRlbCgpXG4gICAgICAgIFxuICAgIGNsb3NlOiAtPiBcbiAgICAgICAgXG4gICAgICAgIGdsb2JhbC53b3JsZCA9IEBnYW1lV29ybGRcbiAgICAgICAgQGRlbCgpXG4gICAgICAgIEBnYW1lV29ybGQuYXBwbHlTY2hlbWUgQGdhbWVXb3JsZC5kaWN0LnNjaGVtZSA/ICdkZWZhdWx0J1xuICAgICAgICBcbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgPT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBjb21ib1xuICAgICAgICAgICAgd2hlbiAnZXNjJyAgICAgICAgICAgdGhlbiBAY2xvc2UoKVxuICAgICAgICAgICAgd2hlbiAnZW50ZXInICdzcGFjZScgdGhlbiBAbG9hZCgpXG4gICAgICAgICAgICB3aGVuICdsZWZ0JyAncmlnaHQnICd1cCcgJ2Rvd24nICdwYWdlIHVwJyAncGFnZSBkb3duJyAnaG9tZScgJ2VuZCcgdGhlbiBAbmF2aWdhdGUgY29tYm9cbiAgICAgICAgXG4gICAgcmVzaXplZDogKHcsIGgpID0+IFxuICAgICAgICBAd29ybGQucmVzaXplZCB3LCBoKjAuNjZcbiAgICAgICAgQG5hbWVzLnJlc2l6ZWQgdywgaCowLjM0XG4gICAgICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPiBcbiAgICBcbiAgICAgICAgQHdvcmxkLnN0ZXAgc3RlcFxuICAgICAgICBAbmFtZXMuc3RlcCBzdGVwXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsU2VsZWN0aW9uXG4iXX0=
//# sourceURL=../coffee/levelselection.coffee