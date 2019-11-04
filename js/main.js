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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsU0FBQTtJQUFBOzs7QUFRRSxNQUFRLE9BQUEsQ0FBUSxLQUFSOztBQUVKOzs7SUFFQyxjQUFBO1FBRUMsc0NBQ0k7WUFBQSxHQUFBLEVBQWdCLFNBQWhCO1lBQ0EsR0FBQSxFQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FEaEI7WUFFQSxLQUFBLEVBQWdCLFlBRmhCO1lBR0EsSUFBQSxFQUFnQixnQkFIaEI7WUFJQSxLQUFBLEVBQWdCLGtCQUpoQjtZQUtBLGNBQUEsRUFBZ0IsR0FMaEI7WUFNQSxLQUFBLEVBQWdCLElBTmhCO1lBT0EsTUFBQSxFQUFnQixHQVBoQjtZQVFBLFFBQUEsRUFBZ0IsR0FSaEI7WUFTQSxTQUFBLEVBQWdCLEdBVGhCO1NBREo7SUFGRDs7OztHQUZZOztBQWdCbkIsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgMDAwICAgMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDBcbjAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgIDAwMCAwIDAwMFxuMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwXG4wMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMjI1xuXG57IGFwcCB9ID0gcmVxdWlyZSAna3hrJ1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgYXBwXG5cbiAgICBAOiAtPlxuICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgICAgIGRpcjogICAgICAgICAgICBfX2Rpcm5hbWVcbiAgICAgICAgICAgIHBrZzogICAgICAgICAgICByZXF1aXJlICcuLi9wYWNrYWdlLmpzb24nXG4gICAgICAgICAgICBpbmRleDogICAgICAgICAgJ2luZGV4Lmh0bWwnXG4gICAgICAgICAgICBpY29uOiAgICAgICAgICAgJy4uL2ltZy9hcHAuaWNvJ1xuICAgICAgICAgICAgYWJvdXQ6ICAgICAgICAgICcuLi9pbWcvYWJvdXQucG5nJ1xuICAgICAgICAgICAgcHJlZnNTZXBlcmF0b3I6ICfilrgnXG4gICAgICAgICAgICB3aWR0aDogICAgICAgICAgMTAyNFxuICAgICAgICAgICAgaGVpZ2h0OiAgICAgICAgIDc2OFxuICAgICAgICAgICAgbWluV2lkdGg6ICAgICAgIDMwMFxuICAgICAgICAgICAgbWluSGVpZ2h0OiAgICAgIDMwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbm5ldyBNYWluIl19
//# sourceURL=../coffee/main.coffee