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
        if (state.left.y < -0.2 && this.last.left.y >= -0.2) {
            down('down');
        }
        if (state.left.y > -0.1 && this.last.left.y <= -0.1) {
            up('down');
        }
        if (state.left.y < 0.1 && this.last.left.y >= 0.1) {
            up('up');
        }
        if (state.left.y > 0.2 && this.last.left.y <= 0.2) {
            down('up');
        }
        if (state.right.y < -0.2 && this.last.right.y >= -0.2) {
            down('down');
        }
        if (state.right.y > -0.1 && this.last.right.y <= -0.1) {
            up('down');
        }
        if (state.right.y < 0.1 && this.last.right.y >= 0.1) {
            up('up');
        }
        if (state.right.y > 0.2 && this.last.right.y <= 0.2) {
            down('up');
        }
        if (this.inhibit.left && state.left.x >= -0.08 && state.right.x >= -0.08) {
            this.inhibit.left = false;
        }
        if (this.inhibit.right && state.left.x <= 0.08 && state.right.x <= 0.08) {
            this.inhibit.right = false;
        }
        if (!this.inhibit.left && state.left.x < -0.18 && this.last.left.x >= -0.18) {
            down('left');
            up('left');
            this.inhibit.left = true;
        }
        if (!this.inhibit.right && state.left.x > 0.18 && this.last.left.x <= 0.18) {
            down('right');
            up('right');
            this.inhibit.right = true;
        }
        if (!this.inhibit.left && state.right.x < -0.18 && this.last.right.x >= -0.18) {
            down('left');
            up('left');
            this.inhibit.left = true;
        }
        if (!this.inhibit.right && state.right.x > 0.18 && this.last.right.x <= 0.18) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxtQ0FBQTtJQUFBOzs7O0FBQUEsTUFBc0IsT0FBQSxDQUFRLEtBQVIsQ0FBdEIsRUFBRSxxQkFBRixFQUFXLGFBQVgsRUFBZ0I7O0FBRWhCLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFRDs7O0lBRUMsaUJBQUE7Ozs7UUFFQyxJQUFDLENBQUEsSUFBRCxHQUFRO1lBQUEsSUFBQSxFQUFLO2dCQUFDLENBQUEsRUFBRSxDQUFIO2dCQUFLLENBQUEsRUFBRSxDQUFQO2FBQUw7WUFBZ0IsS0FBQSxFQUFNO2dCQUFDLENBQUEsRUFBRSxDQUFIO2dCQUFLLENBQUEsRUFBRSxDQUFQO2FBQXRCOztRQUNSLElBQUMsQ0FBQSxPQUFELEdBQVc7WUFBQSxJQUFBLEVBQUssQ0FBTDtZQUFPLEtBQUEsRUFBTSxDQUFiOztRQUNYLHlDQUNJO1lBQUEsR0FBQSxFQUFRLFNBQVI7WUFDQSxHQUFBLEVBQVEsT0FBQSxDQUFRLGlCQUFSLENBRFI7WUFFQSxJQUFBLEVBQVEscUJBRlI7WUFHQSxJQUFBLEVBQVEsaUJBSFI7WUFJQSxjQUFBLEVBQWdCLEdBSmhCO1lBS0EsT0FBQSxFQUFTLEtBTFQ7WUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BTlQ7U0FESjtJQUpEOztzQkFhSCxNQUFBLEdBQVEsU0FBQTtRQUVKLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxJQUFKLENBQVMsQ0FBQSxDQUFFLE9BQUYsQ0FBVDtRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO1FBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxFQUFMLENBQVEsUUFBUixFQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQXZCO1FBRUEsT0FBTyxDQUFDLEVBQVIsQ0FBVyxRQUFYLEVBQW9CLElBQUMsQ0FBQSxXQUFyQjtlQUNBLE9BQU8sQ0FBQyxFQUFSLENBQVcs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QUFIO1lBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULEdBQWlCLEtBSHJCOztRQUtBLElBQUcsQ0FBSSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQWIsSUFBc0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLENBQUMsSUFBdkMsSUFBZ0QsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBWixJQUFpQixDQUFDLElBQXJFO1lBQ0ksSUFBQSxDQUFLLE1BQUw7WUFDQSxFQUFBLENBQUcsTUFBSDtZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixLQUhwQjs7UUFLQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFiLElBQXVCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUF2QyxJQUFnRCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFaLElBQWlCLElBQXBFO1lBQ0ksSUFBQSxDQUFLLE9BQUw7WUFDQSxFQUFBLENBQUcsT0FBSDtZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixLQUhyQjs7UUFLQSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYSxLQUFLLENBQUM7ZUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDO0lBMUNiOzs7O0dBOUNPOztBQTBGdEIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwXG5cbnsgZ2FtZXBhZCwgd2luLCAkIH0gPSByZXF1aXJlICdreGsnXG5cbktpa2kgPSByZXF1aXJlICcuL2tpa2knXG5cbmNsYXNzIE1haW5XaW4gZXh0ZW5kcyB3aW5cbiAgICBcbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgQGxhc3QgPSBsZWZ0Ont4OjAgeTowfSwgcmlnaHQ6e3g6MCB5OjB9XG4gICAgICAgIEBpbmhpYml0ID0gbGVmdDowIHJpZ2h0OjBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgICAgIGRpcjogICAgX19kaXJuYW1lXG4gICAgICAgICAgICBwa2c6ICAgIHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgIG1lbnU6ICAgJy4uL2NvZmZlZS9tZW51Lm5vb24nXG4gICAgICAgICAgICBpY29uOiAgICcuLi9pbWcvbWluaS5wbmcnXG4gICAgICAgICAgICBwcmVmc1NlcGVyYXRvcjogJ+KWuCdcbiAgICAgICAgICAgIGNvbnRleHQ6IGZhbHNlXG4gICAgICAgICAgICBvbkxvYWQ6IEBvbkxvYWRcbiAgICAgICAgICAgIFxuICAgIG9uTG9hZDogPT5cblxuICAgICAgICBAa2lraSA9IG5ldyBLaWtpICQgJyNtYWluJ1xuICAgICAgICBAa2lraS5zdGFydCgpXG4gICAgICAgIEB3aW4ub24gJ3Jlc2l6ZScgQGtpa2kucmVzaXplZCAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBnYW1lcGFkLm9uICdidXR0b24nIEBvblBhZEJ1dHRvblxuICAgICAgICBnYW1lcGFkLm9uICdheGlzJyAgIEBvblBhZEF4aXNcbiAgICAgICAgXG4gICAgb25QYWRCdXR0b246IChidXR0b24sIHZhbHVlKSA9PlxuICAgICAgICBcbiAgICAgICAga2V5ID0gc3dpdGNoIGJ1dHRvblxuICAgICAgICAgICAgd2hlbiAnTWVudScgIHRoZW4gJ2VzYydcbiAgICAgICAgICAgIHdoZW4gJ0JhY2snICB0aGVuICdxJ1xuICAgICAgICAgICAgd2hlbiAnU3RhcnQnIHRoZW4gJ2UnXG4gICAgICAgICAgICB3aGVuICdBJyAgICAgdGhlbiAnc3BhY2UnXG4gICAgICAgICAgICB3aGVuICdCJyAgICAgdGhlbiAnZidcbiAgICAgICAgICAgIHdoZW4gJ1gnICAgICB0aGVuICdjdHJsJ1xuICAgICAgICAgICAgd2hlbiAnWScgICAgIHRoZW4gJ2MnXG4gICAgICAgICAgICB3aGVuICdSVCcgICAgdGhlbiAnZidcbiAgICAgICAgICAgIHdoZW4gJ0xUJyAgICB0aGVuICdjdHJsJ1xuICAgICAgICAgICAgd2hlbiAnTEInICAgIHRoZW4gJ2xlZnQnXG4gICAgICAgICAgICB3aGVuICdSQicgICAgdGhlbiAncmlnaHQnXG4gICAgICAgICAgICB3aGVuICdVcCcgJ0Rvd24nICdMZWZ0JyAnUmlnaHQnIHRoZW4gYnV0dG9uLnRvTG93ZXJDYXNlKClcblxuICAgICAgICBpZiBrZXlcbiAgICAgICAgICAgIGlmIHZhbHVlXG4gICAgICAgICAgICAgICAgQGtpa2kud29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gJycga2V5LCBrZXlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAa2lraS53b3JsZC5tb2RLZXlDb21ib0V2ZW50VXAgJycga2V5LCBrZXlcblxuICAgIG9uUGFkQXhpczogKHN0YXRlKSA9PiBcblxuICAgICAgICBkb3duID0gKGtleSkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gJycga2V5LCBrZXlcbiAgICAgICAgdXAgICA9IChrZXkpIC0+IHdvcmxkLm1vZEtleUNvbWJvRXZlbnRVcCAnJyBrZXksIGtleVxuXG4gICAgICAgIGlmIHN0YXRlLmxlZnQueSA8IC0wLjIgYW5kIEBsYXN0LmxlZnQueSA+PSAtMC4yIHRoZW4gZG93biAnZG93bidcbiAgICAgICAgaWYgc3RhdGUubGVmdC55ID4gLTAuMSBhbmQgQGxhc3QubGVmdC55IDw9IC0wLjEgdGhlbiB1cCAgICdkb3duJ1xuICAgICAgICBpZiBzdGF0ZS5sZWZ0LnkgPCAgMC4xIGFuZCBAbGFzdC5sZWZ0LnkgPj0gIDAuMSB0aGVuIHVwICAgJ3VwJ1xuICAgICAgICBpZiBzdGF0ZS5sZWZ0LnkgPiAgMC4yIGFuZCBAbGFzdC5sZWZ0LnkgPD0gIDAuMiB0aGVuIGRvd24gJ3VwJ1xuXG4gICAgICAgIGlmIHN0YXRlLnJpZ2h0LnkgPCAtMC4yIGFuZCBAbGFzdC5yaWdodC55ID49IC0wLjIgdGhlbiBkb3duICdkb3duJ1xuICAgICAgICBpZiBzdGF0ZS5yaWdodC55ID4gLTAuMSBhbmQgQGxhc3QucmlnaHQueSA8PSAtMC4xIHRoZW4gdXAgICAnZG93bidcbiAgICAgICAgaWYgc3RhdGUucmlnaHQueSA8ICAwLjEgYW5kIEBsYXN0LnJpZ2h0LnkgPj0gIDAuMSB0aGVuIHVwICAgJ3VwJ1xuICAgICAgICBpZiBzdGF0ZS5yaWdodC55ID4gIDAuMiBhbmQgQGxhc3QucmlnaHQueSA8PSAgMC4yIHRoZW4gZG93biAndXAnXG4gIFxuICAgICAgICBpZiBAaW5oaWJpdC5sZWZ0IGFuZCBzdGF0ZS5sZWZ0LnggPj0gLTAuMDggYW5kIHN0YXRlLnJpZ2h0LnggPj0gLTAuMDhcbiAgICAgICAgICAgIEBpbmhpYml0LmxlZnQgPSBmYWxzZVxuXG4gICAgICAgIGlmIEBpbmhpYml0LnJpZ2h0IGFuZCBzdGF0ZS5sZWZ0LnggPD0gMC4wOCBhbmQgc3RhdGUucmlnaHQueCA8PSAwLjA4XG4gICAgICAgICAgICBAaW5oaWJpdC5yaWdodCA9IGZhbHNlXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgbm90IEBpbmhpYml0LmxlZnQgYW5kIHN0YXRlLmxlZnQueCA8IC0wLjE4IGFuZCBAbGFzdC5sZWZ0LnggPj0gLTAuMTggXG4gICAgICAgICAgICBkb3duICdsZWZ0J1xuICAgICAgICAgICAgdXAgJ2xlZnQnXG4gICAgICAgICAgICBAaW5oaWJpdC5sZWZ0ID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAaW5oaWJpdC5yaWdodCBhbmQgc3RhdGUubGVmdC54ID4gMC4xOCBhbmQgQGxhc3QubGVmdC54IDw9IDAuMThcbiAgICAgICAgICAgIGRvd24gJ3JpZ2h0J1xuICAgICAgICAgICAgdXAgJ3JpZ2h0J1xuICAgICAgICAgICAgQGluaGliaXQucmlnaHQgPSB0cnVlXG5cbiAgICAgICAgaWYgbm90IEBpbmhpYml0LmxlZnQgYW5kIHN0YXRlLnJpZ2h0LnggPCAtMC4xOCBhbmQgQGxhc3QucmlnaHQueCA+PSAtMC4xOFxuICAgICAgICAgICAgZG93biAnbGVmdCdcbiAgICAgICAgICAgIHVwICdsZWZ0J1xuICAgICAgICAgICAgQGluaGliaXQubGVmdCA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBub3QgQGluaGliaXQucmlnaHQgYW5kIHN0YXRlLnJpZ2h0LnggPiAwLjE4IGFuZCBAbGFzdC5yaWdodC54IDw9IDAuMThcbiAgICAgICAgICAgIGRvd24gJ3JpZ2h0J1xuICAgICAgICAgICAgdXAgJ3JpZ2h0J1xuICAgICAgICAgICAgQGluaGliaXQucmlnaHQgPSB0cnVlXG4gICAgICAgICAgICBcbiAgICAgICAgQGxhc3QubGVmdCA9IHN0YXRlLmxlZnRcbiAgICAgICAgQGxhc3QucmlnaHQgPSBzdGF0ZS5yaWdodFxuICAgICAgICBcbm5ldyBNYWluV2luICAgICAgICAgICAgXG4iXX0=
//# sourceURL=../coffee/window.coffee