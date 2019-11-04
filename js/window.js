// koffee 1.4.0
var $, Kiki, MainWin, ref, win,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

ref = require('kxk'), win = ref.win, $ = ref.$;

Kiki = require('./kiki');

MainWin = (function(superClass) {
    extend(MainWin, superClass);

    function MainWin() {
        this.onLoad = bind(this.onLoad, this);
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
        return this.win.on('resize', this.kiki.resized);
    };

    return MainWin;

})(win);

new MainWin;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSwwQkFBQTtJQUFBOzs7O0FBQUEsTUFBYSxPQUFBLENBQVEsS0FBUixDQUFiLEVBQUUsYUFBRixFQUFPOztBQUVQLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFRDs7O0lBRUMsaUJBQUE7O1FBRUMseUNBQ0k7WUFBQSxHQUFBLEVBQVEsU0FBUjtZQUNBLEdBQUEsRUFBUSxPQUFBLENBQVEsaUJBQVIsQ0FEUjtZQUVBLElBQUEsRUFBUSxxQkFGUjtZQUdBLElBQUEsRUFBUSxpQkFIUjtZQUlBLGNBQUEsRUFBZ0IsR0FKaEI7WUFLQSxPQUFBLEVBQVMsS0FMVDtZQU1BLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFOVDtTQURKO0lBRkQ7O3NCQVdILE1BQUEsR0FBUSxTQUFBO1FBRUosSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLElBQUosQ0FBUyxDQUFBLENBQUUsT0FBRixDQUFUO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUE7ZUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLEVBQUwsQ0FBUSxRQUFSLEVBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBdkI7SUFKSTs7OztHQWJVOztBQW1CdEIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwXG5cbnsgd2luLCAkIH0gPSByZXF1aXJlICdreGsnXG5cbktpa2kgPSByZXF1aXJlICcuL2tpa2knXG5cbmNsYXNzIE1haW5XaW4gZXh0ZW5kcyB3aW5cbiAgICBcbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgICAgIGRpcjogICAgX19kaXJuYW1lXG4gICAgICAgICAgICBwa2c6ICAgIHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgIG1lbnU6ICAgJy4uL2NvZmZlZS9tZW51Lm5vb24nXG4gICAgICAgICAgICBpY29uOiAgICcuLi9pbWcvbWluaS5wbmcnXG4gICAgICAgICAgICBwcmVmc1NlcGVyYXRvcjogJ+KWuCdcbiAgICAgICAgICAgIGNvbnRleHQ6IGZhbHNlXG4gICAgICAgICAgICBvbkxvYWQ6IEBvbkxvYWRcbiAgICAgICAgICAgIFxuICAgIG9uTG9hZDogPT5cblxuICAgICAgICBAa2lraSA9IG5ldyBLaWtpICQgJyNtYWluJ1xuICAgICAgICBAa2lraS5zdGFydCgpXG4gICAgICAgIEB3aW4ub24gJ3Jlc2l6ZScgQGtpa2kucmVzaXplZFxuICAgICAgICBcbm5ldyBNYWluV2luICAgICAgICAgICAgXG4iXX0=
//# sourceURL=../coffee/window.coffee