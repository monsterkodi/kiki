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

    Config.prototype.addItems = function() {
        this.addItem("volume " + (prefs.get('volume', 3)), this.onVolume);
        return this.addItem("speed " + (prefs.get('speed', 3)), this.onSpeed);
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
        var ref1, ref2;
        switch (key) {
            case 'right':
                if ((ref1 = this.current) === 0 || ref1 === 1) {
                    this.callbacks[this.current]();
                    world.playSound('MENU_SELECT');
                    this.update();
                }
                return;
            case 'left':
                if ((ref2 = this.current) === 0 || ref2 === 1) {
                    this.callbacks[this.current](-1);
                    world.playSound('MENU_SELECT');
                    this.update();
                }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7O0FBQUEsSUFBQSxzQ0FBQTtJQUFBOzs7O0FBUUEsTUFBbUIsT0FBQSxDQUFRLEtBQVIsQ0FBbkIsRUFBRSxpQkFBRixFQUFTOztBQUVULElBQUEsR0FBUSxPQUFBLENBQVEsUUFBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBRUY7OztJQUVDLGdCQUFBOzs7UUFDQyx5Q0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7SUFIRDs7cUJBS0gsUUFBQSxHQUFVLFNBQUMsQ0FBRDtBQUNOLFlBQUE7O1lBRE8sSUFBRTs7UUFDVCxHQUFBLEdBQU0sQ0FBQSxHQUFJLEtBQUssQ0FBQyxHQUFOLENBQVUsUUFBVixFQUFtQixDQUFuQjtRQUNWLEdBQUEsR0FBTSxLQUFBLENBQU0sQ0FBTixFQUFRLENBQVIsRUFBVSxHQUFWO1FBQ04sS0FBSyxDQUFDLEdBQU4sQ0FBVSxRQUFWLEVBQW1CLEdBQW5CO2VBQ0EsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFDLEtBQUssQ0FBQyxHQUFOLENBQVUsUUFBVixFQUFtQixDQUFuQixDQUFELENBQUEsR0FBeUI7SUFKbEM7O3FCQU1WLE9BQUEsR0FBUyxTQUFDLENBQUQ7QUFDTCxZQUFBOztZQURNLElBQUU7O1FBQ1IsS0FBQSxHQUFRLENBQUEsR0FBSSxLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsQ0FBbEI7UUFDWixLQUFBLEdBQVEsS0FBQSxDQUFNLENBQU4sRUFBUSxDQUFSLEVBQVUsS0FBVjtRQUNSLEtBQUssQ0FBQyxHQUFOLENBQVUsT0FBVixFQUFrQixLQUFsQjtlQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixDQUFBLEdBQUksQ0FBQyxLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsQ0FBbEIsQ0FBRCxDQUFKLEdBQTRCO0lBSjVDOztxQkFNVCxRQUFBLEdBQVUsU0FBQTtRQUVOLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQSxHQUFTLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxRQUFWLEVBQW1CLENBQW5CLENBQUQsQ0FBbEIsRUFBMEMsSUFBQyxDQUFBLFFBQTNDO2VBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFBLEdBQVEsQ0FBQyxLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsRUFBa0IsQ0FBbEIsQ0FBRCxDQUFqQixFQUF5QyxJQUFDLENBQUEsT0FBMUM7SUFITTs7cUJBS1YsTUFBQSxHQUFRLFNBQUE7UUFFSixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFELEdBQVU7QUFDbkIsZUFBTSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFyQjtZQUNJLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBNUI7UUFESjtRQUVBLElBQUMsQ0FBQSxTQUFELEdBQWE7UUFDYixJQUFDLENBQUEsUUFBRCxDQUFBO1FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxDQUFaO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsT0FBYjtJQVJJOztxQkFVUixnQkFBQSxHQUFrQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtBQUVkLFlBQUE7QUFBQSxnQkFBTyxHQUFQO0FBQUEsaUJBRVMsT0FGVDtnQkFHUSxZQUFHLElBQUMsQ0FBQSxRQUFELEtBQWEsQ0FBYixJQUFBLElBQUEsS0FBZ0IsQ0FBbkI7b0JBQ0ksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFYLENBQUE7b0JBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsYUFBaEI7b0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUhKOztBQUlBO0FBUFIsaUJBU1MsTUFUVDtnQkFVUSxZQUFHLElBQUMsQ0FBQSxRQUFELEtBQWEsQ0FBYixJQUFBLElBQUEsS0FBZ0IsQ0FBbkI7b0JBQ0ksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBRCxDQUFYLENBQXFCLENBQUMsQ0FBdEI7b0JBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsYUFBaEI7b0JBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUhKOztBQUlBO0FBZFIsaUJBZ0JTLE9BaEJUO2dCQWlCUSxLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQjtnQkFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO0FBQ0E7QUFuQlI7ZUFxQkEsOENBQUEsU0FBQTtJQXZCYzs7OztHQWxDRDs7QUEyRHJCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAwMDAwICAgXG4jIyNcblxueyBwcmVmcywgY2xhbXAgfSA9IHJlcXVpcmUgJ2t4aydcblxuTWVudSAgPSByZXF1aXJlICcuL21lbnUnXG5Tb3VuZCA9IHJlcXVpcmUgJy4vc291bmQnXG5cbmNsYXNzIENvbmZpZyBleHRlbmRzIE1lbnVcblxuICAgIEA6IC0+IFxuICAgICAgICBzdXBlclxuICAgICAgICBAYWRkSXRlbXMoKVxuICAgICAgICBAc2hvdygpXG4gICAgICAgIFxuICAgIG9uVm9sdW1lOiAoZD0xKSA9PlxuICAgICAgICB2b2wgPSBkICsgcHJlZnMuZ2V0ICd2b2x1bWUnIDNcbiAgICAgICAgdm9sID0gY2xhbXAgMCA1IHZvbFxuICAgICAgICBwcmVmcy5zZXQgJ3ZvbHVtZScgdm9sXG4gICAgICAgIFNvdW5kLm1hc3RlciA9IChwcmVmcy5nZXQgJ3ZvbHVtZScgMykgLyA1XG4gICAgICAgIFxuICAgIG9uU3BlZWQ6IChkPTEpID0+XG4gICAgICAgIHNwZWVkID0gZCArIHByZWZzLmdldCAnc3BlZWQnIDNcbiAgICAgICAgc3BlZWQgPSBjbGFtcCAxIDUgc3BlZWRcbiAgICAgICAgcHJlZnMuc2V0ICdzcGVlZCcgc3BlZWRcbiAgICAgICAgZ2xvYmFsLndvcmxkLnNwZWVkID0gNiArIChwcmVmcy5nZXQgJ3NwZWVkJyAzKSAtIDMgIyA0LThcbiAgICBcbiAgICBhZGRJdGVtczogLT5cbiAgICAgICAgXG4gICAgICAgIEBhZGRJdGVtIFwidm9sdW1lICN7cHJlZnMuZ2V0ICd2b2x1bWUnIDN9XCIgQG9uVm9sdW1lXG4gICAgICAgIEBhZGRJdGVtIFwic3BlZWQgI3twcmVmcy5nZXQgJ3NwZWVkJyAzfVwiICBAb25TcGVlZFxuICAgICAgICBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIFxuICAgICAgICBAd2lkdGggPSBAaGVpZ2h0ID0gMFxuICAgICAgICB3aGlsZSBAbWVzaC5jaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgICAgIEBtZXNoLnJlbW92ZSBAbWVzaC5jaGlsZHJlblswXVxuICAgICAgICBAY2FsbGJhY2tzID0gW11cbiAgICAgICAgQGFkZEl0ZW1zKClcbiAgICAgICAgQHNldE9wYWNpdHkgMVxuICAgICAgICBAc2V0Q3VycmVudCBAY3VycmVudFxuXG4gICAgbW9kS2V5Q29tYm9FdmVudDogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2gga2V5XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ3JpZ2h0J1xuICAgICAgICAgICAgICAgIGlmIEBjdXJyZW50IGluIFswLCAxXVxuICAgICAgICAgICAgICAgICAgICBAY2FsbGJhY2tzW0BjdXJyZW50XSgpXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9TRUxFQ1QnXG4gICAgICAgICAgICAgICAgICAgIEB1cGRhdGUoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2xlZnQnXG4gICAgICAgICAgICAgICAgaWYgQGN1cnJlbnQgaW4gWzAsIDFdXG4gICAgICAgICAgICAgICAgICAgIEBjYWxsYmFja3NbQGN1cnJlbnRdIC0xXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9TRUxFQ1QnXG4gICAgICAgICAgICAgICAgICAgIEB1cGRhdGUoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gJ2VudGVyJ1xuICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnTUVOVV9GQURFJ1xuICAgICAgICAgICAgICAgIEBmYWRlT3V0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBzdXBlclxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdcbiJdfQ==
//# sourceURL=../coffee/config.coffee