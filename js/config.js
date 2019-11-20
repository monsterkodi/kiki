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
        this.onShadows = bind(this.onShadows, this);
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

    Config.prototype.onShadows = function(d) {
        var shadows;
        if (d == null) {
            d = 1;
        }
        shadows = !prefs.get('shadows', true);
        prefs.set('shadows', shadows);
        return global.world.enableShadows(shadows);
    };

    Config.prototype.addItems = function() {
        this.addItem("volume " + (prefs.get('volume', 3)), this.onVolume);
        this.addItem("speed " + (prefs.get('speed', 3)), this.onSpeed);
        this.addItem("fps " + (prefs.get('fps', 60)), this.onFPS);
        return this.addItem("shadows " + (prefs.get('shadows', true) && 'on' || 'off'), this.onShadows);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxzQ0FBQTtJQUFBOzs7O0FBUUEsTUFBbUIsT0FBQSxDQUFRLEtBQVIsQ0FBbkIsRUFBRSxpQkFBRixFQUFTOztBQUVULElBQUEsR0FBUSxPQUFBLENBQVEsUUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBRUY7OztJQUVDLGdCQUFBOzs7OztRQUNDLHlDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsUUFBRCxDQUFBO1FBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUhEOztxQkFLSCxRQUFBLEdBQVUsU0FBQyxDQUFEO0FBQ04sWUFBQTs7WUFETyxJQUFFOztRQUNULEdBQUEsR0FBTSxDQUFBLEdBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxRQUFWLEVBQW1CLENBQW5CO1FBQ1YsR0FBQSxHQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsQ0FBUixFQUFVLEdBQVY7UUFDTixLQUFLLENBQUMsR0FBTixDQUFVLFFBQVYsRUFBbUIsR0FBbkI7ZUFDQSxLQUFLLENBQUMsTUFBTixHQUFlLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxRQUFWLEVBQW1CLENBQW5CLENBQUQsQ0FBQSxHQUF5QjtJQUpsQzs7cUJBTVYsT0FBQSxHQUFTLFNBQUMsQ0FBRDtBQUNMLFlBQUE7O1lBRE0sSUFBRTs7UUFDUixLQUFBLEdBQVEsQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsT0FBVixFQUFrQixDQUFsQjtRQUNaLEtBQUEsR0FBUSxLQUFBLENBQU0sQ0FBTixFQUFRLENBQVIsRUFBVSxLQUFWO1FBQ1IsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQWtCLEtBQWxCO2VBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLENBQUEsR0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFOLENBQVUsT0FBVixF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ICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAgICAgMDAwICAwMDAgIDAwMDAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAwMDAgICAwMDAgIFxuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwMDAwMCAgIFxuIyMjXG5cbnsgcHJlZnMsIGNsYW1wIH0gPSByZXF1aXJlICdreGsnXG5cbk1lbnUgID0gcmVxdWlyZSAnLi9tZW51J1xuU291bmQgPSByZXF1aXJlICcuL3NvdW5kJ1xuXG5jbGFzcyBDb25maWcgZXh0ZW5kcyBNZW51XG5cbiAgICBAOiAtPiBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgQGFkZEl0ZW1zKClcbiAgICAgICAgQHNob3coKVxuICAgICAgICBcbiAgICBvblZvbHVtZTogKGQ9MSkgPT5cbiAgICAgICAgdm9sID0gZCArIHByZWZzLmdldCAndm9sdW1lJyAzXG4gICAgICAgIHZvbCA9IGNsYW1wIDAgNSB2b2xcbiAgICAgICAgcHJlZnMuc2V0ICd2b2x1bWUnIHZvbFxuICAgICAgICBTb3VuZC5tYXN0ZXIgPSAocHJlZnMuZ2V0ICd2b2x1bWUnIDMpIC8gNVxuICAgICAgICBcbiAgICBvblNwZWVkOiAoZD0xKSA9PlxuICAgICAgICBzcGVlZCA9IGQgKyBwcmVmcy5nZXQgJ3NwZWVkJyAzXG4gICAgICAgIHNwZWVkID0gY2xhbXAgMSA1IHNwZWVkXG4gICAgICAgIHByZWZzLnNldCAnc3BlZWQnIHNwZWVkXG4gICAgICAgIGdsb2JhbC53b3JsZC5zcGVlZCA9IDYgKyAocHJlZnMuZ2V0ICdzcGVlZCcgMykgLSAzICMgNC04XG5cbiAgICBvbkZQUzogKGQ9MSkgPT5cbiAgICAgICAgZnBzID0gcHJlZnMuZ2V0KCdmcHMnIDYwKSA9PSA2MCBhbmQgMzAgb3IgNjBcbiAgICAgICAgcHJlZnMuc2V0ICdmcHMnIGZwc1xuICAgICAgICBnbG9iYWwud29ybGQuZnBzID0gZnBzXG5cbiAgICBvblNoYWRvd3M6IChkPTEpID0+XG4gICAgICAgIHNoYWRvd3MgPSBub3QgcHJlZnMuZ2V0ICdzaGFkb3dzJyB0cnVlXG4gICAgICAgIHByZWZzLnNldCAnc2hhZG93cycgc2hhZG93c1xuICAgICAgICBnbG9iYWwud29ybGQuZW5hYmxlU2hhZG93cyBzaGFkb3dzXG4gICAgICAgIFxuICAgIGFkZEl0ZW1zOiAtPlxuICAgICAgICBcbiAgICAgICAgQGFkZEl0ZW0gXCJ2b2x1bWUgI3twcmVmcy5nZXQgJ3ZvbHVtZScgM31cIiBAb25Wb2x1bWVcbiAgICAgICAgQGFkZEl0ZW0gXCJzcGVlZCAje3ByZWZzLmdldCAnc3BlZWQnIDN9XCIgIEBvblNwZWVkXG4gICAgICAgIEBhZGRJdGVtIFwiZnBzICN7cHJlZnMuZ2V0ICdmcHMnIDYwfVwiICBAb25GUFNcbiAgICAgICAgQGFkZEl0ZW0gXCJzaGFkb3dzICN7cHJlZnMuZ2V0KCdzaGFkb3dzJyB0cnVlKSBhbmQgJ29uJyBvciAnb2ZmJ31cIiBAb25TaGFkb3dzXG4gICAgICAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgXG4gICAgICAgIEB3aWR0aCA9IEBoZWlnaHQgPSAwXG4gICAgICAgIHdoaWxlIEBtZXNoLmNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAgICAgQG1lc2gucmVtb3ZlIEBtZXNoLmNoaWxkcmVuWzBdXG4gICAgICAgIEBjYWxsYmFja3MgPSBbXVxuICAgICAgICBAYWRkSXRlbXMoKVxuICAgICAgICBAc2V0T3BhY2l0eSAxXG4gICAgICAgIEBzZXRDdXJyZW50IEBjdXJyZW50XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50OiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBrZXlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAncmlnaHQnXG4gICAgICAgICAgICAgICAgQGNhbGxiYWNrc1tAY3VycmVudF0oKVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9TRUxFQ1QnXG4gICAgICAgICAgICAgICAgQHVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnbGVmdCdcbiAgICAgICAgICAgICAgICBAY2FsbGJhY2tzW0BjdXJyZW50XSAtMVxuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9TRUxFQ1QnXG4gICAgICAgICAgICAgICAgQHVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiAnZW50ZXInXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdNRU5VX0ZBREUnXG4gICAgICAgICAgICAgICAgQGZhZGVPdXQoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZ1xuIl19
//# sourceURL=../coffee/config.coffee