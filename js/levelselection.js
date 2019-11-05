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

    LevelSelection.prototype.step = function(step) {
        return this.world.step(step);
    };

    return LevelSelection;

})();

module.exports = LevelSelection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG9EQUFBO0lBQUE7O0FBUUEsTUFBd0IsT0FBQSxDQUFRLEtBQVIsQ0FBeEIsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZTs7QUFFZixZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSOztBQUVUO0lBRUMsd0JBQUMsU0FBRDtBQUVDLFlBQUE7UUFGQSxJQUFDLENBQUEsWUFBRDs7O1FBRUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSO1FBRVIsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXZCLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxzREFBMEIsQ0FBMUIsQ0FBQSxHQUErQixDQUFoQyxDQUFBLEdBQXFDLElBQUMsQ0FBQSxNQUFNLENBQUM7UUFFdEQsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBaEIsQ0FBQTtRQUVBLElBQUEsR0FBTyxJQUFBLENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFNLFNBQU47U0FBTDtRQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQVgsR0FBc0I7UUFDdEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBaEIsQ0FBNEIsSUFBNUI7UUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksS0FBSixDQUFVLElBQVYsRUFBZ0IsSUFBaEI7UUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsTUFBTyxDQUFBLElB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QUFBQSxpQkFHaUUsS0FIakU7dUJBRzRFLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtBQUg1RTtJQUZjOzs2QkFPbEIsT0FBQSxHQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0lBQVY7OzZCQUVULElBQUEsR0FBTSxTQUFDLElBQUQ7ZUFFRixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxJQUFaO0lBRkU7Ozs7OztBQUlWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4wMDAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgICAgIDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAgICBcbjAwMCAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIFxuMDAwICAgICAgMDAwMDAwMCAgICAwMDAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgXG4wMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICBcbjAwMDAwMDAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuIyMjXG5cbnsgY2xhbXAsIGVsZW0sIGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblxuTGV2ZWxTZWxOYW1lID0gcmVxdWlyZSAnLi9sZXZlbHNlbG5hbWUnXG5cbmNsYXNzIExldmVsU2VsZWN0aW9uXG4gICAgXG4gICAgQDogKEBnYW1lV29ybGQpIC0+XG4gICAgICAgIFxuICAgICAgICBXb3JsZCA9IHJlcXVpcmUgJy4vd29ybGQnXG4gICAgICAgIFxuICAgICAgICBAbGV2ZWxzID0gV29ybGQubGV2ZWxzLmxpc3RcbiAgICAgICAgXG4gICAgICAgIEBpbmRleCA9ICgoQGdhbWVXb3JsZC5sZXZlbF9pbmRleCA/IDApICsgMSkgJSBAbGV2ZWxzLmxlbmd0aFxuICAgICAgICBcbiAgICAgICAgQGdhbWVXb3JsZC5tZW51LmRlbCgpXG5cbiAgICAgICAgdmlldyA9IGVsZW0gY2xhc3M6J3ByZXZpZXcnXG4gICAgICAgIHZpZXcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgICAgIHZpZXcuc3R5bGUubGVmdCAgICAgPSAnMCdcbiAgICAgICAgdmlldy5zdHlsZS5yaWdodCAgICA9ICcwJ1xuICAgICAgICB2aWV3LnN0eWxlLnRvcCAgICAgID0gJzAnXG4gICAgICAgIHZpZXcuc3R5bGUuYm90dG9tICAgPSAnMCdcbiAgICAgICAgQGdhbWVXb3JsZC52aWV3LmFwcGVuZENoaWxkIHZpZXdcbiAgICAgICAgQHdvcmxkID0gbmV3IFdvcmxkIHZpZXcsIHRydWVcbiAgICAgICAgQHdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF1cbiAgICAgICAgQHdvcmxkLnRleHQgPSBuZXcgTGV2ZWxTZWxOYW1lIEBsZXZlbHNbQGluZGV4XVxuICAgICAgICBAcmVzaXplZCBAZ2FtZVdvcmxkLnNjcmVlblNpemUudywgQGdhbWVXb3JsZC5zY3JlZW5TaXplLmhcbiAgICAgICAgXG4gICAgbmF2aWdhdGU6IChhY3Rpb24pIC0+XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggYWN0aW9uXG4gICAgICAgICAgICB3aGVuICdyaWdodCcgJ2Rvd24nIHRoZW4gQGluZGV4ICs9IDFcbiAgICAgICAgICAgIHdoZW4gJ2xlZnQnICd1cCcgICAgdGhlbiBAaW5kZXggLT0gMVxuICAgICAgICAgICAgd2hlbiAncGFnZSB1cCcgICAgICB0aGVuIEBpbmRleCAtPSAxMFxuICAgICAgICAgICAgd2hlbiAncGFnZSBkb3duJyAgICB0aGVuIEBpbmRleCArPSAxMFxuICAgICAgICAgICAgd2hlbiAnaG9tZScgICAgICAgICB0aGVuIEBpbmRleCA9IDBcbiAgICAgICAgICAgIHdoZW4gJ2VuZCcgICAgICAgICAgdGhlbiBAaW5kZXggPSBAbGV2ZWxzLmxlbmd0aC0xXG4gICAgICAgIFxuICAgICAgICBAaW5kZXggPSBjbGFtcCAwLCBAbGV2ZWxzLmxlbmd0aC0xLCBAaW5kZXhcbiAgICAgICAga2xvZyBAaW5kZXgsIEBsZXZlbHNbQGluZGV4XVxuICAgICAgICBAd29ybGQuY3JlYXRlIEBsZXZlbHNbQGluZGV4XVxuICAgICAgICBAd29ybGQudGV4dCA9IG5ldyBMZXZlbFNlbE5hbWUgQGxldmVsc1tAaW5kZXhdXG4gICAgICAgIEByZXNpemVkIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS53LCBAZ2FtZVdvcmxkLnNjcmVlblNpemUuaFxuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBkZWxldGUgQGdhbWVXb3JsZC5sZXZlbFNlbGVjdGlvblxuICAgICAgICBAd29ybGQuZGVsKClcbiAgICAgICAgXG4gICAgbG9hZDogLT5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZ2xvYmFsLndvcmxkID0gQGdhbWVXb3JsZFxuICAgICAgICBAZ2FtZVdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF0sIGZhbHNlXG4gICAgICAgIEBkZWwoKVxuICAgICAgICBcbiAgICBjbG9zZTogLT4gXG4gICAgICAgIFxuICAgICAgICBnbG9iYWwud29ybGQgPSBAZ2FtZVdvcmxkXG4gICAgICAgIEBkZWwoKVxuICAgICAgICBAZ2FtZVdvcmxkLmFwcGx5U2NoZW1lIEBnYW1lV29ybGQuZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcbiAgICAgICAgXG4gICAgbW9kS2V5Q29tYm9FdmVudDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpID0+XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggY29tYm9cbiAgICAgICAgICAgIHdoZW4gJ2VzYycgICAgICAgICAgIHRoZW4gQGNsb3NlKClcbiAgICAgICAgICAgIHdoZW4gJ2VudGVyJyAnc3BhY2UnIHRoZW4gQGxvYWQoKVxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3JpZ2h0JyAndXAnICdkb3duJyAncGFnZSB1cCcgJ3BhZ2UgZG93bicgJ2hvbWUnICdlbmQnIHRoZW4gQG5hdmlnYXRlIGNvbWJvXG4gICAgICAgIFxuICAgIHJlc2l6ZWQ6ICh3LCBoKSA9PiBAd29ybGQucmVzaXplZCB3LCBoXG4gICAgICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPiBcbiAgICBcbiAgICAgICAgQHdvcmxkLnN0ZXAgc3RlcFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbFNlbGVjdGlvblxuIl19
//# sourceURL=../coffee/levelselection.coffee