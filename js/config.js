// koffee 1.4.0

/*
 0000000   0000000   000   000  00000000  000   0000000   
000       000   000  0000  000  000       000  000        
000       000   000  000 0 000  000000    000  000  0000  
000       000   000  000  0000  000       000  000   000  
 0000000   0000000   000   000  000       000   0000000
 */
var Config, Menu, Sound, clamp, prefs, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), prefs = ref.prefs, clamp = ref.clamp;

Menu = require('./menu');

Sound = require('./sound');

Config = (function(superClass) {
    extend(Config, superClass);

    function Config() {
        this.onFPS = bind(this.onFPS, this);
        this.onSpeed = bind(this.onSpeed, this);
        this.onVolume = bind(this.onVolume, this);
        Config.__super__.constructor.apply(this, arguments);
        this.addItems();
        this.show();
    }

    Config.prototype.onVolume = function(d) {
        var vol;
        if (d == null) {
            d = 1;
        }
        vol = d + prefs.get('volume', 3);
        vol = clamp(0, 5, vol);
        prefs.set('volume', vol);
        return Sound.master = (prefs.get('volume', 3)) / 5;
    };

    Config.prototype.onSpeed = function(d) {
        var speed;
        if (d == null) {
            d = 1;
        }
        speed = d + prefs.get('speed', 3);
        speed = clamp(1, 5, speed);
        prefs.set('speed', speed);
        return global.world.speed = 6 + (prefs.get('speed', 3)) - 3;
    };

    Config.prototype.onFPS = function(d) {
        var fps;
        if (d == null) {
            d = 1;
        }
        fps = prefs.get('fps', 60) === 60 && 30 || 60;
        prefs.set('fps', fps);
        return global.world.fps = fps;
    };

    Config.prototype.addItems = function() {
        this.addItem("volume " + (prefs.get('volume', 3)), this.onVolume);
        this.addItem("speed " + (prefs.get('speed', 3)), this.onSpeed);
        return this.addItem("fps " + (prefs.get('fps', 60)), this.onFPS);
    };

    Config.prototype.update = function() {
        this.width = this.height = 0;
        while (this.mesh.children.length) {
            this.mesh.remove(this.mesh.children[0]);
        }
        this.callbacks = [];
        this.addItems();
        this.setOpacity(1);
        return this.setCurrent(this.current);
    };

    Config.prototype.modKeyComboEvent = function(mod, key, combo, event) {
        switch (key) {
            case 'right':
                this.callbacks[this.current]();
                world.playSound('MENU_SELECT');
                this.update();
                return;
            case 'left':
                this.callbacks[this.current](-1);
                world.playSound('MENU_SELECT');
                this.update();
                return;
            case 'enter':
                world.playSound('MENU_FADE');
                this.fadeOut();
                return;
        }
        return Config.__super__.modKeyComboEvent.apply(this, arguments);
    };

    return Config;

})(Menu);

module.exports = Config;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxzQ0FBQTtJQUFBOzs7O0FBUUEsTUFBbUIsT0FBQSxDQUFRLEtBQVIsQ0FBbkIsRUFBRSxpQkFBRixFQUFTOztBQUVULElBQUEsR0FBUSxPQUFBLENBQVEsUUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBRUY7OztJQUVDLGdCQUFBOzs7O1FBQ0MseUNBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxRQUFELENBQUE7UUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBSEQ7O3FCQUtILFFBQUEsR0FBVSxTQUFDLENBQUQ7QUFDTixZQUFBOztZQURPLElBQUU7O1FBQ1QsR0FBQSxHQUFNLENBQUEsR0FBSSxLQUFLLENBQUMsR0FBTixDQUFVLFFBQVYsRUFBbUIsQ0FBbkI7UUFDVixHQUFBLEdBQU0sS0FBQSxDQUFNLENBQU4sRUFBUSxDQUFSLEVBQVUsR0FBVjtRQUNOLEtBQUssQ0FBQyxHQUFOLENBQVUsUUFBVixFQUFtQixHQUFuQjtlQUNBLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBQyxLQUFLLENBQUMsR0FBTixDQUFVLFFBQVYsRUFBbUIsQ0FBbkIsQ0FBRCxDQUFBLEdBQXlCO0lBSmxDOztxQkFNVixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ0wsWUFBQTs7WUFETSxJQUFFOztRQUNSLEtBQUEsR0FBUSxDQUFBLEdBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQWtCLENBQWxCO1FBQ1osS0FBQSxHQUFRLEtBQUEsQ0FBTSxDQUFOLEVBQVEsQ0FBUixFQUFVLEtBQVY7UUFDUixLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsS0FBbEI7ZUFDQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBcUIsQ0FBQSxHQUFJLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQWtCLENBQWxCLENBQUQsQ0FBSixHQUE0QjtJQUo1Qzs7cUJBTVQsS0FBQSxHQUFPLFNBQUMsQ0FBRDtBQUNILFlBQUE7O1lBREksSUFBRTs7UUFDTixHQUFBLEdBQU0sS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWdCLEVBQWhCLENBQUEsS0FBdUIsRUFBdkIsSUFBOEIsRUFBOUIsSUFBb0M7UUFDMUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWdCLEdBQWhCO2VBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFiLEdBQW1CO0lBSGhCOztxQkFLUCxRQUFBLEdBQVUsU0FBQTtRQUVOLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQSxHQUFTLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxRQUFWLEVBQW1CLENBQW5CLENBQUQsQ0FBbEIsRUFBMEMsSUFBQyxDQUFBLFFBQTNDO1FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFBLEdBQVEsQ0FBQyxLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsQ0FBbEIsQ0FBRCxDQUFqQixFQUF5QyxJQUFDLENBQUEsT0FBMUM7ZUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLE1BQUEsR0FBTSxDQUFDLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFnQixFQUFoQixDQUFELENBQWYsRUFBc0MsSUFBQyxDQUFBLEtBQXZDO0lBSk07O3FCQU1WLE1BQUEsR0FBUSxTQUFBO1FBRUosSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBRCxHQUFVO0FBQ25CLGVBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBckI7WUFDSSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQTVCO1FBREo7UUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhO1FBQ2IsSUFBQyxDQUFBLFFBQUQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxVQUFELENBQVksQ0FBWjtlQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLE9BQWI7SUFSSTs7cUJBVVIsZ0JBQUEsR0FBa0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7QUFFZCxnQkFBTyxHQUFQO0FBQUEsaUJBRVMsT0FGVDtnQkFHUSxJQUFDLENBQUEsU0FBVSxDQUFBLElBQUMsQ0FBQSxPQUFELENBQVgsQ0FBQTtnQkFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixhQUFoQjtnQkFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0FBQ0E7QUFOUixpQkFRUyxNQVJUO2dCQVNRLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBWCxDQUFxQixDQUFDLENBQXRCO2dCQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLGFBQWhCO2dCQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7QUFDQTtBQVpSLGlCQWNTLE9BZFQ7Z0JBZVEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7Z0JBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtBQUNBO0FBakJSO2VBbUJBLDhDQUFBLFNBQUE7SUFyQmM7Ozs7R0F4Q0Q7O0FBK0RyQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAgICAgMDAwICAwMDAgIDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwMDAwMCAgIFxuIyMjXG5cbnsgcHJlZnMsIGNsYW1wIH0gPSByZXF1aXJlICdreGsnXG5cbk1lbnUgID0gcmVxdWlyZSAnLi9tZW51J1xuU291bmQgPSByZXF1aXJlICcuL3NvdW5kJ1xuXG5jbGFzcyBDb25maWcgZXh0ZW5kcyBNZW51XG5cbiAgICBAOiAtPiBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgQGFkZEl0ZW1zKClcbiAgICAgICAgQHNob3coKVxuICAgICAgICBcbiAgICBvblZvbHVtZTogKGQ9MSkgPT5cbiAgICAgICAgdm9sID0gZCArIHByZWZzLmdldCAndm9sdW1lJyAzXG4gICAgICAgIHZvbCA9IGNsYW1wIDAgNSB2b2xcbiAgICAgICAgcHJlZnMuc2V0ICd2b2x1bWUnIHZvbFxuICAgICAgICBTb3VuZC5tYXN0ZXIgPSAocHJlZnMuZ2V0ICd2b2x1bWUnIDMpIC8gNVxuICAgICAgICBcbiAgICBvblNwZWVkOiAoZD0xKSA9PlxuICAgICAgICBzcGVlZCA9IGQgKyBwcmVmcy5nZXQgJ3NwZWVkJyAzXG4gICAgICAgIHNwZWVkID0gY2xhbXAgMSA1IHNwZWVkXG4gICAgICAgIHByZWZzLnNldCAnc3BlZWQnIHNwZWVkXG4gICAgICAgIGdsb2JhbC53b3JsZC5zcGVlZCA9IDYgKyAocHJlZnMuZ2V0ICdzcGVlZCcgMykgLSAzICMgNC04XG5cbiAgICBvbkZQUzogKGQ9MSkgPT5cbiAgICAgICAgZnBzID0gcHJlZnMuZ2V0KCdmcHMnIDYwKSA9PSA2MCBhbmQgMzAgb3IgNjBcbiAgICAgICAgcHJlZnMuc2V0ICdmcHMnIGZwc1xuICAgICAgICBnbG9iYWwud29ybGQuZnBzID0gZnBzXG4gICAgICAgIFxuICAgIGFkZEl0ZW1zOiAtPlxuICAgICAgICBcbiAgICAgICAgQGFkZEl0ZW0gXCJ2b2x1bWUgI3twcmVmcy5nZXQgJ3ZvbHVtZScgM31cIiBAb25Wb2x1bWVcbiAgICAgICAgQGFkZEl0ZW0gXCJzcGVlZCAje3ByZWZzLmdldCAnc3BlZWQnIDN9XCIgIEBvblNwZWVkXG4gICAgICAgIEBhZGRJdGVtIFwiZnBzICN7cHJlZnMuZ2V0ICdmcHMnIDYwfVwiICBAb25GUFNcbiAgICAgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBcbiAgICAgICAgQHdpZHRoID0gQGhlaWdodCA9IDBcbiAgICAgICAgd2hpbGUgQG1lc2guY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgICAgICBAbWVzaC5yZW1vdmUgQG1lc2guY2hpbGRyZW5bMF1cbiAgICAgICAgQGNhbGxiYWNrcyA9IFtdXG4gICAgICAgIEBhZGRJdGVtcygpXG4gICAgICAgIEBzZXRPcGFjaXR5IDFcbiAgICAgICAgQHNldEN1cnJlbnQgQGN1cnJlbnRcblxuICAgIG1vZEtleUNvbWJvRXZlbnQ6IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGtleVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdyaWdodCdcbiAgICAgICAgICAgICAgICBAY2FsbGJhY2tzW0BjdXJyZW50XSgpXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX1NFTEVDVCdcbiAgICAgICAgICAgICAgICBAdXBkYXRlKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdsZWZ0J1xuICAgICAgICAgICAgICAgIEBjYWxsYmFja3NbQGN1cnJlbnRdIC0xXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX1NFTEVDVCdcbiAgICAgICAgICAgICAgICBAdXBkYXRlKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuICdlbnRlcidcbiAgICAgICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ01FTlVfRkFERSdcbiAgICAgICAgICAgICAgICBAZmFkZU91dCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnXG4iXX0=
//# sourceURL=../coffee/config.coffee