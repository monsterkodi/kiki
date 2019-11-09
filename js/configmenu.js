// koffee 1.4.0

/*
 0000000   0000000   000   000  00000000  000   0000000   
000       000   000  0000  000  000       000  000        
000       000   000  000 0 000  000000    000  000  0000  
000       000   000  000  0000  000       000  000   000  
 0000000   0000000   000   000  000       000   0000000
 */
var Config, Menu,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Menu = require('./menu');

Config = (function(superClass) {
    extend(Config, superClass);

    function Config() {
        Config.__super__.constructor.apply(this, arguments);
    }

    return Config;

})(Menu);

module.exports = Config;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnbWVudS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsWUFBQTtJQUFBOzs7QUFRQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0FBRUQ7OztJQUVDLGdCQUFBO1FBQUcseUNBQUEsU0FBQTtJQUFIOzs7O0dBRmM7O0FBSXJCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgMDAwMCAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAwMDAwICAgXG4jIyNcblxuTWVudSA9IHJlcXVpcmUgJy4vbWVudSdcblxuY2xhc3MgQ29uZmlnIGV4dGVuZHMgTWVudVxuXG4gICAgQDogLT4gc3VwZXJcblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdcbiJdfQ==
//# sourceURL=../coffee/configmenu.coffee