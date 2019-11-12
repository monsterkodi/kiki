// koffee 1.4.0
var $, Kiki, MainWin, gamepad, ref, win,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), gamepad = ref.gamepad, win = ref.win, $ = ref.$;

Kiki = require('./kiki');

MainWin = (function(superClass) {
    extend(MainWin, superClass);

    function MainWin() {
        this.onPadAxis = bind(this.onPadAxis, this);
        this.onPadButton = bind(this.onPadButton, this);
        this.onLoad = bind(this.onLoad, this);
        this.last = {
            left: {
                x: 0,
                y: 0
            },
            right: {
                x: 0,
                y: 0
            }
        };
        this.inhibit = {
            left: 0,
            right: 0
        };
        MainWin.__super__.constructor.call(this, {
            dir: __dirname,
            pkg: require('../package.json'),
            menu: '../coffee/menu.noon',
            icon: '../img/mini.png',
            prefsSeperator: '▸',
            context: false,
            onLoad: this.onLoad
        });
    }

    MainWin.prototype.onLoad = function() {
        this.kiki = new Kiki($('#main'));
        this.kiki.start();
        this.win.on('resize', this.kiki.resized);
        gamepad.on('button', this.onPadButton);
        return gamepad.on('axis', this.onPadAxis);
    };

    MainWin.prototype.onPadButton = function(button, value) {
        var key;
        key = (function() {
            switch (button) {
                case 'Menu':
                    return 'esc';
                case 'Back':
                    return 'q';
                case 'Start':
                    return 'e';
                case 'A':
                    return 'space';
                case 'B':
                    return 'f';
                case 'X':
                    return 'ctrl';
                case 'Y':
                    return 'c';
                case 'RT':
                    return 'f';
                case 'LT':
                    return 'ctrl';
                case 'LB':
                    return 'left';
                case 'RB':
                    return 'right';
                case 'Up':
                case 'Down':
                case 'Left':
                case 'Right':
                    return button.toLowerCase();
            }
        })();
        if (key) {
            if (value) {
                return this.kiki.world.modKeyComboEventDown('', key, key);
            } else {
                return this.kiki.world.modKeyComboEventUp('', key, key);
            }
        }
    };

    MainWin.prototype.onPadAxis = function(state) {
        var down, up;
        down = function(key) {
            return world.modKeyComboEventDown('', key, key);
        };
        up = function(key) {
            return world.modKeyComboEventUp('', key, key);
        };
        if (state.left.y < -0.20 && this.last.left.y >= -0.20) {
            down('down');
        }
        if (state.left.y > -0.12 && this.last.left.y <= -0.12) {
            up('down');
        }
        if (state.left.y < 0.12 && this.last.left.y >= 0.12) {
            up('up');
        }
        if (state.left.y > 0.20 && this.last.left.y <= 0.20) {
            down('up');
        }
        if (state.right.y < -0.20 && this.last.right.y >= -0.20) {
            down('down');
        }
        if (state.right.y > -0.12 && this.last.right.y <= -0.12) {
            up('down');
        }
        if (state.right.y < 0.12 && this.last.right.y >= 0.12) {
            up('up');
        }
        if (state.right.y > 0.20 && this.last.right.y <= 0.20) {
            down('up');
        }
        if (this.inhibit.left && state.left.x >= -0.12 && state.right.x >= -0.12) {
            this.inhibit.left = false;
        }
        if (this.inhibit.right && state.left.x <= 0.12 && state.right.x <= 0.12) {
            this.inhibit.right = false;
        }
        if (!this.inhibit.left && state.left.x < -0.33 && this.last.left.x >= -0.33) {
            down('left');
            up('left');
            this.inhibit.left = true;
        }
        if (!this.inhibit.right && state.left.x > 0.33 && this.last.left.x <= 0.33) {
            down('right');
            up('right');
            this.inhibit.right = true;
        }
        if (!this.inhibit.left && state.right.x < -0.33 && this.last.right.x >= -0.33) {
            down('left');
            up('left');
            this.inhibit.left = true;
        }
        if (!this.inhibit.right && state.right.x > 0.33 && this.last.right.x <= 0.33) {
            down('right');
            up('right');
            this.inhibit.right = true;
        }
        this.last.left = state.left;
        return this.last.right = state.right;
    };

    return MainWin;

})(win);

new MainWin;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxtQ0FBQTtJQUFBOzs7O0FBQUEsTUFBc0IsT0FBQSxDQUFRLEtBQVIsQ0FBdEIsRUFBRSxxQkFBRixFQUFXLGFBQVgsRUFBZ0I7O0FBRWhCLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFRDs7O0lBRUMsaUJBQUE7Ozs7UUFFQyxJQUFDLENBQUEsSUFBRCxHQUFRO1lBQUEsSUFBQSxFQUFLO2dCQUFDLENBQUEsRUFBRSxDQUFIO2dCQUFLLENBQUEsRUFBRSxDQUFQO2FBQUw7WUFBZ0IsS0FBQSxFQUFNO2dCQUFDLENBQUEsRUFBRSxDQUFIO2dCQUFLLENBQUEsRUFBRSxDQUFQO2FBQXRCOztRQUNSLElBQUMsQ0FBQSxPQUFELEdBQVc7WUFBQSxJQUFBLEVBQUssQ0FBTDtZQUFPLEtBQUEsRUFBTSxDQUFiOztRQUNYLHlDQUNJO1lBQUEsR0FBQSxFQUFRLFNBQVI7WUFDQSxHQUFBLEVBQVEsT0FBQSxDQUFRLGlCQUFSLENBRFI7WUFFQSxJQUFBLEVBQVEscUJBRlI7WUFHQSxJQUFBLEVBQVEsaUJBSFI7WUFJQSxjQUFBLEVBQWdCLEdBSmhCO1lBS0EsT0FBQSxFQUFTLEtBTFQ7WUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BTlQ7U0FESjtJQUpEOztzQkFhSCxNQUFBLEdBQVEsU0FBQTtRQUVKLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxJQUFKLENBQVMsQ0FBQSxDQUFFLE9BQUYsQ0FBVDtRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO1FBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQUFMLENBQVEsUUFBUixFQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQXZCO1FBRUEsT0FBTyxDQUFDLEVBQVIsQ0FBVyxRQUFYLEVBQW9CLElBQUMsQ0FBQSxXQUFyQjtlQUNBLE9BQU8sQ0FBQyxFQUFSLENBQVcsTUFBWCxFQUFvQixJQUFDLENBQUEsU0FBckI7SUFQSTs7c0JBU1IsV0FBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLEtBQVQ7QUFFVCxZQUFBO1FBQUEsR0FBQTtBQUFNLG9CQUFPLE1BQVA7QUFBQSxxQkFDRyxNQURIOzJCQUNnQjtBQURoQixxQkFFRyxNQUZIOzJCQUVnQjtBQUZoQixxQkFHRyxPQUhIOzJCQUdnQjtBQUhoQixxQkFJRyxHQUpIOzJCQUlnQjtBQUpoQixxQkFLRyxHQUxIOzJCQUtnQjtBQUxoQixxQkFNRyxHQU5IOzJCQU1nQjtBQU5oQixxQkFPRyxHQVBIOzJCQU9nQjtBQVBoQixxQkFRRyxJQVJIOzJCQVFnQjtBQVJoQixxQkFTRyxJQVRIOzJCQVNnQjtBQVRoQixxQkFVRyxJQVZIOzJCQVVnQjtBQVZoQixxQkFXRyxJQVhIOzJCQVdnQjtBQVhoQixxQkFZRyxJQVpIO0FBQUEscUJBWVEsTUFaUjtBQUFBLHFCQVllLE1BWmY7QUFBQSxxQkFZc0IsT0FadEI7MkJBWW1DLE1BQU0sQ0FBQyxXQUFQLENBQUE7QUFabkM7O1FBY04sSUFBRyxHQUFIO1lBQ0ksSUFBRyxLQUFIO3VCQUNJLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFaLENBQWlDLEVBQWpDLEVBQW9DLEdBQXBDLEVBQXlDLEdBQXpDLEVBREo7YUFBQSxNQUFBO3VCQUdJLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFaLENBQStCLEVBQS9CLEVBQWtDLEdBQWxDLEVBQXVDLEdBQXZDLEVBSEo7YUFESjs7SUFoQlM7O3NCQXNCYixTQUFBLEdBQVcsU0FBQyxLQUFEO0FBRVAsWUFBQTtRQUFBLElBQUEsR0FBTyxTQUFDLEdBQUQ7bUJBQVMsS0FBSyxDQUFDLG9CQUFOLENBQTJCLEVBQTNCLEVBQThCLEdBQTlCLEVBQW1DLEdBQW5DO1FBQVQ7UUFDUCxFQUFBLEdBQU8sU0FBQyxHQUFEO21CQUFTLEtBQUssQ0FBQyxrQkFBTixDQUF5QixFQUF6QixFQUE0QixHQUE1QixFQUFpQyxHQUFqQztRQUFUO1FBRVAsSUFBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQVgsR0FBZSxDQUFDLElBQWhCLElBQXlCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQVgsSUFBZ0IsQ0FBQyxJQUE3QztZQUF1RCxJQUFBLENBQUssTUFBTCxFQUF2RDs7UUFDQSxJQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBWCxHQUFlLENBQUMsSUFBaEIsSUFBeUIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBWCxJQUFnQixDQUFDLElBQTdDO1lBQXVELEVBQUEsQ0FBSyxNQUFMLEVBQXZEOztRQUNBLElBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFYLEdBQWdCLElBQWhCLElBQXlCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQVgsSUFBaUIsSUFBN0M7WUFBdUQsRUFBQSxDQUFLLElBQUwsRUFBdkQ7O1FBQ0EsSUFBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQVgsR0FBZ0IsSUFBaEIsSUFBeUIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBWCxJQUFpQixJQUE3QztZQUF1RCxJQUFBLENBQUssSUFBTCxFQUF2RDs7UUFFQSxJQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixDQUFDLElBQWpCLElBQTBCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQVosSUFBaUIsQ0FBQyxJQUEvQztZQUF5RCxJQUFBLENBQUssTUFBTCxFQUF6RDs7UUFDQSxJQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixDQUFDLElBQWpCLElBQTBCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQVosSUFBaUIsQ0FBQyxJQUEvQztZQUF5RCxFQUFBLENBQUssTUFBTCxFQUF6RDs7UUFDQSxJQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFpQixJQUFqQixJQUEwQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFaLElBQWtCLElBQS9DO1lBQXlELEVBQUEsQ0FBSyxJQUFMLEVBQXpEOztRQUNBLElBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWlCLElBQWpCLElBQTBCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQVosSUFBa0IsSUFBL0M7WUFBeUQsSUFBQSxDQUFLLElBQUwsRUFBekQ7O1FBRUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsSUFBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFYLElBQWdCLENBQUMsSUFBbkMsSUFBNEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLElBQWlCLENBQUMsSUFBakU7WUFDSSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsR0FBZ0IsTUFEcEI7O1FBR0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsSUFBbUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFYLElBQWdCLElBQW5DLElBQTRDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixJQUFpQixJQUFoRTtZQUNJLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixNQURyQjs7UUFHQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFiLElBQXNCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBWCxHQUFlLENBQUMsSUFBdEMsSUFBK0MsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBWCxJQUFnQixDQUFDLElBQW5FO1lBQ0ksSUFBQSxDQUFLLE1BQUw7WUFDQSxFQUFBLENBQUcsTUFBSDtZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixLQUhwQjs7UUFLQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFiLElBQXVCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBWCxHQUFlLElBQXRDLElBQStDLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQVgsSUFBZ0IsSUFBbEU7WUFDSSxJQUFBLENBQUssT0FBTDtZQUNBLEVBQUEsQ0FBRyxPQUFIO1lBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULEdBQWlCLEtBSHJCOztRQUtBLElBQUcsQ0FBSSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQWIsSUFBc0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLENBQUMsSUFBdkMsSUFBZ0QsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBWixJQUFpQixDQUFDLElBQXJFO1lBQ0ksSUFBQSxDQUFLLE1BQUw7WUFDQSxFQUFBLENBQUcsTUFBSDtZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixLQUhwQjs7UUFLQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFiLElBQXVCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUF2QyxJQUFnRCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFaLElBQWlCLElBQXBFO1lBQ0ksSUFBQSxDQUFLLE9BQUw7WUFDQSxFQUFBLENBQUcsT0FBSDtZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixLQUhyQjs7UUFLQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYSxLQUFLLENBQUM7ZUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDO0lBMUNiOzs7O0dBOUNPOztBQTBGdEIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwXG5cbnsgZ2FtZXBhZCwgd2luLCAkIH0gPSByZXF1aXJlICdreGsnXG5cbktpa2kgPSByZXF1aXJlICcuL2tpa2knXG5cbmNsYXNzIE1haW5XaW4gZXh0ZW5kcyB3aW5cbiAgICBcbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgQGxhc3QgPSBsZWZ0Ont4OjAgeTowfSwgcmlnaHQ6e3g6MCB5OjB9XG4gICAgICAgIEBpbmhpYml0ID0gbGVmdDowIHJpZ2h0OjBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgICAgIGRpcjogICAgX19kaXJuYW1lXG4gICAgICAgICAgICBwa2c6ICAgIHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgIG1lbnU6ICAgJy4uL2NvZmZlZS9tZW51Lm5vb24nXG4gICAgICAgICAgICBpY29uOiAgICcuLi9pbWcvbWluaS5wbmcnXG4gICAgICAgICAgICBwcmVmc1NlcGVyYXRvcjogJ+KWuCdcbiAgICAgICAgICAgIGNvbnRleHQ6IGZhbHNlXG4gICAgICAgICAgICBvbkxvYWQ6IEBvbkxvYWRcbiAgICAgICAgICAgIFxuICAgIG9uTG9hZDogPT5cblxuICAgICAgICBAa2lraSA9IG5ldyBLaWtpICQgJyNtYWluJ1xuICAgICAgICBAa2lraS5zdGFydCgpXG4gICAgICAgIEB3aW4ub24gJ3Jlc2l6ZScgQGtpa2kucmVzaXplZCAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBnYW1lcGFkLm9uICdidXR0b24nIEBvblBhZEJ1dHRvblxuICAgICAgICBnYW1lcGFkLm9uICdheGlzJyAgIEBvblBhZEF4aXNcbiAgICAgICAgXG4gICAgb25QYWRCdXR0b246IChidXR0b24sIHZhbHVlKSA9PlxuICAgICAgICBcbiAgICAgICAga2V5ID0gc3dpdGNoIGJ1dHRvblxuICAgICAgICAgICAgd2hlbiAnTWVudScgIHRoZW4gJ2VzYydcbiAgICAgICAgICAgIHdoZW4gJ0JhY2snICB0aGVuICdxJ1xuICAgICAgICAgICAgd2hlbiAnU3RhcnQnIHRoZW4gJ2UnXG4gICAgICAgICAgICB3aGVuICdBJyAgICAgdGhlbiAnc3BhY2UnXG4gICAgICAgICAgICB3aGVuICdCJyAgICAgdGhlbiAnZidcbiAgICAgICAgICAgIHdoZW4gJ1gnICAgICB0aGVuICdjdHJsJ1xuICAgICAgICAgICAgd2hlbiAnWScgICAgIHRoZW4gJ2MnXG4gICAgICAgICAgICB3aGVuICdSVCcgICAgdGhlbiAnZidcbiAgICAgICAgICAgIHdoZW4gJ0xUJyAgICB0aGVuICdjdHJsJ1xuICAgICAgICAgICAgd2hlbiAnTEInICAgIHRoZW4gJ2xlZnQnXG4gICAgICAgICAgICB3aGVuICdSQicgICAgdGhlbiAncmlnaHQnXG4gICAgICAgICAgICB3aGVuICdVcCcgJ0Rvd24nICdMZWZ0JyAnUmlnaHQnIHRoZW4gYnV0dG9uLnRvTG93ZXJDYXNlKClcblxuICAgICAgICBpZiBrZXlcbiAgICAgICAgICAgIGlmIHZhbHVlXG4gICAgICAgICAgICAgICAgQGtpa2kud29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gJycga2V5LCBrZXlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAa2lraS53b3JsZC5tb2RLZXlDb21ib0V2ZW50VXAgJycga2V5LCBrZXlcblxuICAgIG9uUGFkQXhpczogKHN0YXRlKSA9PiBcblxuICAgICAgICBkb3duID0gKGtleSkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gJycga2V5LCBrZXlcbiAgICAgICAgdXAgICA9IChrZXkpIC0+IHdvcmxkLm1vZEtleUNvbWJvRXZlbnRVcCAnJyBrZXksIGtleVxuXG4gICAgICAgIGlmIHN0YXRlLmxlZnQueSA8IC0wLjIwIGFuZCBAbGFzdC5sZWZ0LnkgPj0gLTAuMjAgdGhlbiBkb3duICdkb3duJ1xuICAgICAgICBpZiBzdGF0ZS5sZWZ0LnkgPiAtMC4xMiBhbmQgQGxhc3QubGVmdC55IDw9IC0wLjEyIHRoZW4gdXAgICAnZG93bidcbiAgICAgICAgaWYgc3RhdGUubGVmdC55IDwgIDAuMTIgYW5kIEBsYXN0LmxlZnQueSA+PSAgMC4xMiB0aGVuIHVwICAgJ3VwJ1xuICAgICAgICBpZiBzdGF0ZS5sZWZ0LnkgPiAgMC4yMCBhbmQgQGxhc3QubGVmdC55IDw9ICAwLjIwIHRoZW4gZG93biAndXAnXG5cbiAgICAgICAgaWYgc3RhdGUucmlnaHQueSA8IC0wLjIwIGFuZCBAbGFzdC5yaWdodC55ID49IC0wLjIwIHRoZW4gZG93biAnZG93bidcbiAgICAgICAgaWYgc3RhdGUucmlnaHQueSA+IC0wLjEyIGFuZCBAbGFzdC5yaWdodC55IDw9IC0wLjEyIHRoZW4gdXAgICAnZG93bidcbiAgICAgICAgaWYgc3RhdGUucmlnaHQueSA8ICAwLjEyIGFuZCBAbGFzdC5yaWdodC55ID49ICAwLjEyIHRoZW4gdXAgICAndXAnXG4gICAgICAgIGlmIHN0YXRlLnJpZ2h0LnkgPiAgMC4yMCBhbmQgQGxhc3QucmlnaHQueSA8PSAgMC4yMCB0aGVuIGRvd24gJ3VwJ1xuICBcbiAgICAgICAgaWYgQGluaGliaXQubGVmdCBhbmQgc3RhdGUubGVmdC54ID49IC0wLjEyIGFuZCBzdGF0ZS5yaWdodC54ID49IC0wLjEyXG4gICAgICAgICAgICBAaW5oaWJpdC5sZWZ0ID0gZmFsc2VcblxuICAgICAgICBpZiBAaW5oaWJpdC5yaWdodCBhbmQgc3RhdGUubGVmdC54IDw9IDAuMTIgYW5kIHN0YXRlLnJpZ2h0LnggPD0gMC4xMlxuICAgICAgICAgICAgQGluaGliaXQucmlnaHQgPSBmYWxzZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAaW5oaWJpdC5sZWZ0IGFuZCBzdGF0ZS5sZWZ0LnggPCAtMC4zMyBhbmQgQGxhc3QubGVmdC54ID49IC0wLjMzIFxuICAgICAgICAgICAgZG93biAnbGVmdCdcbiAgICAgICAgICAgIHVwICdsZWZ0J1xuICAgICAgICAgICAgQGluaGliaXQubGVmdCA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBub3QgQGluaGliaXQucmlnaHQgYW5kIHN0YXRlLmxlZnQueCA+IDAuMzMgYW5kIEBsYXN0LmxlZnQueCA8PSAwLjMzXG4gICAgICAgICAgICBkb3duICdyaWdodCdcbiAgICAgICAgICAgIHVwICdyaWdodCdcbiAgICAgICAgICAgIEBpbmhpYml0LnJpZ2h0ID0gdHJ1ZVxuXG4gICAgICAgIGlmIG5vdCBAaW5oaWJpdC5sZWZ0IGFuZCBzdGF0ZS5yaWdodC54IDwgLTAuMzMgYW5kIEBsYXN0LnJpZ2h0LnggPj0gLTAuMzNcbiAgICAgICAgICAgIGRvd24gJ2xlZnQnXG4gICAgICAgICAgICB1cCAnbGVmdCdcbiAgICAgICAgICAgIEBpbmhpYml0LmxlZnQgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgbm90IEBpbmhpYml0LnJpZ2h0IGFuZCBzdGF0ZS5yaWdodC54ID4gMC4zMyBhbmQgQGxhc3QucmlnaHQueCA8PSAwLjMzXG4gICAgICAgICAgICBkb3duICdyaWdodCdcbiAgICAgICAgICAgIHVwICdyaWdodCdcbiAgICAgICAgICAgIEBpbmhpYml0LnJpZ2h0ID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBsYXN0LmxlZnQgPSBzdGF0ZS5sZWZ0XG4gICAgICAgIEBsYXN0LnJpZ2h0ID0gc3RhdGUucmlnaHRcbiAgICAgICAgXG5uZXcgTWFpbldpbiAgICAgICAgICAgIFxuIl19
//# sourceURL=../coffee/window.coffee