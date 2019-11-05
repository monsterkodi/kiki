// koffee 1.4.0

/*
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000
 */
var LevelSelection, clamp, elem, klog, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('kxk'), clamp = ref.clamp, elem = ref.elem, klog = ref.klog;

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
        view.style.height = '66%';
        this.gameWorld.view.appendChild(view);
        this.world = new World(view, true);
        this.world.create(this.levels[this.index]);
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
        klog(this.index);
        return this.world.create(this.levels[this.index]);
    };

    LevelSelection.prototype.load = function() {
        global.world = this.gameWorld;
        this.gameWorld.create(this.levels[this.index]);
        delete this.gameWorld.levelSelection;
        return this.world.del();
    };

    LevelSelection.prototype.close = function() {
        var ref1;
        global.world = this.gameWorld;
        delete this.gameWorld.levelSelection;
        this.world.del();
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
        return this.world.resized(w, h * 0.66);
    };

    LevelSelection.prototype.step = function(step) {
        return this.world.step(step);
    };

    return LevelSelection;

})();

module.exports = LevelSelection;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLHNDQUFBO0lBQUE7O0FBUUEsTUFBd0IsT0FBQSxDQUFRLEtBQVIsQ0FBeEIsRUFBRSxpQkFBRixFQUFTLGVBQVQsRUFBZTs7QUFFVDtJQUVDLHdCQUFDLFNBQUQ7QUFFQyxZQUFBO1FBRkEsSUFBQyxDQUFBLFlBQUQ7OztRQUVBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjtRQUVSLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUV2QixJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsc0RBQTBCLENBQTFCLENBQUEsR0FBK0IsQ0FBaEMsQ0FBQSxHQUFxQyxJQUFDLENBQUEsTUFBTSxDQUFDO1FBRXRELElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQWhCLENBQUE7UUFFQSxJQUFBLEdBQU8sSUFBQSxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTSxTQUFOO1NBQUw7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFYLEdBQXNCO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWCxHQUFzQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVgsR0FBc0I7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFYLEdBQXNCO1FBRXRCLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQWhCLENBQTRCLElBQTVCO1FBRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBQWdCLElBQWhCO1FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFDLENBQUEsS0FBRCxDQUF0QjtRQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBL0IsRUFBa0MsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBeEQ7SUFyQkQ7OzZCQXVCSCxRQUFBLEdBQVUsU0FBQyxNQUFEO0FBRU4sZ0JBQU8sTUFBUDtBQUFBLGlCQUNTLE9BRFQ7QUFBQSxpQkFDaUIsTUFEakI7Z0JBQzZCLElBQUMsQ0FBQSxLQUFELElBQVU7QUFBdEI7QUFEakIsaUJBRVMsTUFGVDtBQUFBLGlCQUVnQixJQUZoQjtnQkFFNkIsSUFBQyxDQUFBLEtBQUQsSUFBVTtBQUF2QjtBQUZoQixpQkFHUyxTQUhUO2dCQUc2QixJQUFDLENBQUEsS0FBRCxJQUFVO0FBQTlCO0FBSFQsaUJBSVMsV0FKVDtnQkFJNkIsSUFBQyxDQUFBLEtBQUQsSUFBVTtBQUE5QjtBQUpULGlCQUtTLE1BTFQ7Z0JBSzZCLElBQUMsQ0FBQSxLQUFELEdBQVM7QUFBN0I7QUFMVCxpQkFNUyxLQU5UO2dCQU02QixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFlO0FBTnJEO1FBUUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFBLENBQU0sQ0FBTixFQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFlLENBQXhCLEVBQTJCLElBQUMsQ0FBQSxLQUE1QjtRQUNULElBQUEsQ0FBSyxJQUFDLENBQUEsS0FBTjtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLElBQUMsQ0FBQSxNQUFPLENBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBdEI7SUFaTTs7NkJBY1YsSUFBQSxHQUFNLFNBQUE7UUFFRixNQUFNLENBQUMsS0FBUCxHQUFlLElBQUMsQ0FBQTtRQUNoQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFDLENBQUEsS0FBRCxDQUExQjtRQUNBLE9BQU8sSUFBQyxDQUFBLFNBQVMsQ0FBQztlQUNsQixJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBQTtJQUxFOzs2QkFPTixLQUFBLEdBQU8sU0FBQTtBQUVILFlBQUE7UUFBQSxNQUFNLENBQUMsS0FBUCxHQUFlLElBQUMsQ0FBQTtRQUNoQixPQUFPLElBQUMsQ0FBQSxTQUFTLENBQUM7UUFDbEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQUE7ZUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFdBQVgsc0RBQWdELFNBQWhEO0lBTEc7OzZCQU9QLGdCQUFBLEdBQWtCLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO0FBRWQsZ0JBQU8sS0FBUDtBQUFBLGlCQUNTLEtBRFQ7dUJBQzhCLElBQUMsQ0FBQSxLQUFELENBQUE7QUFEOUIsaUJBRVMsT0FGVDtBQUFBLGlCQUVpQixPQUZqQjt1QkFFOEIsSUFBQyxDQUFBLElBQUQsQ0FBQTtBQUY5QixpQkFHUyxNQUhUO0FBQUEsaUJBR2dCLE9BSGhCO0FBQUEsaUJBR3dCLElBSHhCO0FBQUEsaUJBRzZCLE1BSDdCO0FBQUEsaUJBR29DLFNBSHBDO0FBQUEsaUJBRzhDLFdBSDlDO0FBQUEsaUJBRzBELE1BSDFEO0FBQUEsaUJBR2lFLEtBSGpFO3VCQUc0RSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7QUFINUU7SUFGYzs7NkJBT2xCLE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBSSxDQUFKO2VBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsQ0FBZixFQUFrQixDQUFBLEdBQUUsSUFBcEI7SUFBVjs7NkJBRVQsSUFBQSxHQUFNLFNBQUMsSUFBRDtlQUVGLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7SUFGRTs7Ozs7O0FBSVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcclxuMDAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgXHJcbjAwMCAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIFxyXG4wMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICBcclxuMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgXHJcbjAwMDAwMDAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAgIFxyXG4jIyNcclxuXHJcbnsgY2xhbXAsIGVsZW0sIGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcclxuXHJcbmNsYXNzIExldmVsU2VsZWN0aW9uXHJcbiAgICBcclxuICAgIEA6IChAZ2FtZVdvcmxkKSAtPlxyXG4gICAgICAgIFxyXG4gICAgICAgIFdvcmxkID0gcmVxdWlyZSAnLi93b3JsZCdcclxuICAgICAgICBcclxuICAgICAgICBAbGV2ZWxzID0gV29ybGQubGV2ZWxzLmxpc3RcclxuICAgICAgICBcclxuICAgICAgICBAaW5kZXggPSAoKEBnYW1lV29ybGQubGV2ZWxfaW5kZXggPyAwKSArIDEpICUgQGxldmVscy5sZW5ndGhcclxuICAgICAgICBcclxuICAgICAgICBAZ2FtZVdvcmxkLm1lbnUuZGVsKClcclxuICAgICAgICBcclxuICAgICAgICB2aWV3ID0gZWxlbSBjbGFzczoncHJldmlldydcclxuICAgICAgICB2aWV3LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xyXG4gICAgICAgIHZpZXcuc3R5bGUubGVmdCAgICAgPSAnMCdcclxuICAgICAgICB2aWV3LnN0eWxlLnJpZ2h0ICAgID0gJzAnXHJcbiAgICAgICAgdmlldy5zdHlsZS50b3AgICAgICA9ICcwJ1xyXG4gICAgICAgIHZpZXcuc3R5bGUuaGVpZ2h0ICAgPSAnNjYlJ1xyXG4gICAgICAgIFxyXG4gICAgICAgIEBnYW1lV29ybGQudmlldy5hcHBlbmRDaGlsZCB2aWV3XHJcbiAgICAgICAgXHJcbiAgICAgICAgQHdvcmxkID0gbmV3IFdvcmxkIHZpZXcsIHRydWVcclxuICAgICAgICBAd29ybGQuY3JlYXRlIEBsZXZlbHNbQGluZGV4XVxyXG4gICAgICAgIEByZXNpemVkIEBnYW1lV29ybGQuc2NyZWVuU2l6ZS53LCBAZ2FtZVdvcmxkLnNjcmVlblNpemUuaFxyXG4gICAgICAgIFxyXG4gICAgbmF2aWdhdGU6IChhY3Rpb24pIC0+XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoIGFjdGlvblxyXG4gICAgICAgICAgICB3aGVuICdyaWdodCcgJ2Rvd24nIHRoZW4gQGluZGV4ICs9IDFcclxuICAgICAgICAgICAgd2hlbiAnbGVmdCcgJ3VwJyAgICB0aGVuIEBpbmRleCAtPSAxXHJcbiAgICAgICAgICAgIHdoZW4gJ3BhZ2UgdXAnICAgICAgdGhlbiBAaW5kZXggLT0gMTBcclxuICAgICAgICAgICAgd2hlbiAncGFnZSBkb3duJyAgICB0aGVuIEBpbmRleCArPSAxMFxyXG4gICAgICAgICAgICB3aGVuICdob21lJyAgICAgICAgIHRoZW4gQGluZGV4ID0gMFxyXG4gICAgICAgICAgICB3aGVuICdlbmQnICAgICAgICAgIHRoZW4gQGluZGV4ID0gQGxldmVscy5sZW5ndGgtMVxyXG4gICAgICAgIFxyXG4gICAgICAgIEBpbmRleCA9IGNsYW1wIDAsIEBsZXZlbHMubGVuZ3RoLTEsIEBpbmRleFxyXG4gICAgICAgIGtsb2cgQGluZGV4XHJcbiAgICAgICAgQHdvcmxkLmNyZWF0ZSBAbGV2ZWxzW0BpbmRleF1cclxuICAgICAgICBcclxuICAgIGxvYWQ6IC0+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBnbG9iYWwud29ybGQgPSBAZ2FtZVdvcmxkXHJcbiAgICAgICAgQGdhbWVXb3JsZC5jcmVhdGUgQGxldmVsc1tAaW5kZXhdXHJcbiAgICAgICAgZGVsZXRlIEBnYW1lV29ybGQubGV2ZWxTZWxlY3Rpb25cclxuICAgICAgICBAd29ybGQuZGVsKClcclxuICAgICAgICBcclxuICAgIGNsb3NlOiAtPiBcclxuICAgICAgICBcclxuICAgICAgICBnbG9iYWwud29ybGQgPSBAZ2FtZVdvcmxkXHJcbiAgICAgICAgZGVsZXRlIEBnYW1lV29ybGQubGV2ZWxTZWxlY3Rpb25cclxuICAgICAgICBAd29ybGQuZGVsKClcclxuICAgICAgICBAZ2FtZVdvcmxkLmFwcGx5U2NoZW1lIEBnYW1lV29ybGQuZGljdC5zY2hlbWUgPyAnZGVmYXVsdCdcclxuICAgICAgICBcclxuICAgIG1vZEtleUNvbWJvRXZlbnQ6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSA9PlxyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCBjb21ib1xyXG4gICAgICAgICAgICB3aGVuICdlc2MnICAgICAgICAgICB0aGVuIEBjbG9zZSgpXHJcbiAgICAgICAgICAgIHdoZW4gJ2VudGVyJyAnc3BhY2UnIHRoZW4gQGxvYWQoKVxyXG4gICAgICAgICAgICB3aGVuICdsZWZ0JyAncmlnaHQnICd1cCcgJ2Rvd24nICdwYWdlIHVwJyAncGFnZSBkb3duJyAnaG9tZScgJ2VuZCcgdGhlbiBAbmF2aWdhdGUgY29tYm9cclxuICAgICAgICBcclxuICAgIHJlc2l6ZWQ6ICh3LCBoKSA9PiBAd29ybGQucmVzaXplZCB3LCBoKjAuNjZcclxuICAgICAgICBcclxuICAgIHN0ZXA6IChzdGVwKSAtPiBcclxuICAgIFxyXG4gICAgICAgIEB3b3JsZC5zdGVwIHN0ZXBcclxuICAgIFxyXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsU2VsZWN0aW9uXHJcbiJdfQ==
//# sourceURL=../coffee/levelselection.coffee