// koffee 1.4.0

/*
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
 */
var Main, app,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

app = require('kxk').app;

Main = (function(superClass) {
    extend(Main, superClass);

    function Main() {
        Main.__super__.constructor.call(this, {
            dir: __dirname,
            dirs: ['levels', 'lib'],
            pkg: require('../package.json'),
            index: 'index.html',
            icon: '../img/app.ico',
            about: '../img/about.png',
            prefsSeperator: '▸',
            width: 1024,
            height: 768,
            minWidth: 300,
            minHeight: 300
        });
    }

    return Main;

})(app);

new Main;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsU0FBQTtJQUFBOzs7QUFRRSxNQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVKOzs7SUFFQyxjQUFBO1FBRUMsc0NBQ0k7WUFBQSxHQUFBLEVBQWdCLFNBQWhCO1lBQ0EsSUFBQSxFQUFnQixDQUFDLFFBQUQsRUFBVSxLQUFWLENBRGhCO1lBRUEsR0FBQSxFQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FGaEI7WUFHQSxLQUFBLEVBQWdCLFlBSGhCO1lBSUEsSUFBQSxFQUFnQixnQkFKaEI7WUFLQSxLQUFBLEVBQWdCLGtCQUxoQjtZQU1BLGNBQUEsRUFBZ0IsR0FOaEI7WUFPQSxLQUFBLEVBQWdCLElBUGhCO1lBUUEsTUFBQSxFQUFnQixHQVJoQjtZQVNBLFFBQUEsRUFBZ0IsR0FUaEI7WUFVQSxTQUFBLEVBQWdCLEdBVmhCO1NBREo7SUFGRDs7OztHQUZZOztBQWlCbkIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDBcbjAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgIDAwMCAwIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMjI1xuXG57IGFwcCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgYXBwXG5cbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgICAgIGRpcjogICAgICAgICAgICBfX2Rpcm5hbWVcbiAgICAgICAgICAgIGRpcnM6ICAgICAgICAgICBbJ2xldmVscycgJ2xpYiddXG4gICAgICAgICAgICBwa2c6ICAgICAgICAgICAgcmVxdWlyZSAnLi4vcGFja2FnZS5qc29uJ1xuICAgICAgICAgICAgaW5kZXg6ICAgICAgICAgICdpbmRleC5odG1sJ1xuICAgICAgICAgICAgaWNvbjogICAgICAgICAgICcuLi9pbWcvYXBwLmljbydcbiAgICAgICAgICAgIGFib3V0OiAgICAgICAgICAnLi4vaW1nL2Fib3V0LnBuZydcbiAgICAgICAgICAgIHByZWZzU2VwZXJhdG9yOiAn4pa4J1xuICAgICAgICAgICAgd2lkdGg6ICAgICAgICAgIDEwMjRcbiAgICAgICAgICAgIGhlaWdodDogICAgICAgICA3NjhcbiAgICAgICAgICAgIG1pbldpZHRoOiAgICAgICAzMDBcbiAgICAgICAgICAgIG1pbkhlaWdodDogICAgICAzMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5uZXcgTWFpbiJdfQ==
//# sourceURL=../coffee/main.coffee