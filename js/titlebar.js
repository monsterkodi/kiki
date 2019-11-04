// koffee 1.4.0
var $, Titlebar, electron, ipc;

$ = require('kxk').$;

electron = require('electron');

ipc = electron.ipcRenderer;

Titlebar = (function() {
    function Titlebar() {
        this.elem = $('.titlebar');
        this.elem.ondblclick = (function(_this) {
            return function(event) {
                console.log(window.winID);
                return ipc.send('maximizeWindow', window.winID);
            };
        })(this);
        this.selected = -1;
    }

    return Titlebar;

})();

module.exports = Titlebar;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGViYXIuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFFLElBQU0sT0FBQSxDQUFRLEtBQVI7O0FBQ1IsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztBQUNYLEdBQUEsR0FBVyxRQUFRLENBQUM7O0FBRWQ7SUFFQyxrQkFBQTtRQUNDLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBQSxDQUFFLFdBQUY7UUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUIsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxLQUFEO2dCQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBTSxDQUFDLEtBQW5CO3VCQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsZ0JBQVQsRUFBMkIsTUFBTSxDQUFDLEtBQWxDO1lBRmU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO1FBR25CLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQztJQUxkOzs7Ozs7QUFPUCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAwICAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAwMDAwICBcbiMgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcblxueyAkIH0gPSByZXF1aXJlICdreGsnXG5lbGVjdHJvbiA9IHJlcXVpcmUgJ2VsZWN0cm9uJ1xuaXBjICAgICAgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxuXG5jbGFzcyBUaXRsZWJhclxuICAgIFxuICAgIEA6ICgpIC0+XG4gICAgICAgIEBlbGVtID0gJCgnLnRpdGxlYmFyJylcbiAgICAgICAgQGVsZW0ub25kYmxjbGljayA9IChldmVudCkgPT4gXG4gICAgICAgICAgICBjb25zb2xlLmxvZyB3aW5kb3cud2luSURcbiAgICAgICAgICAgIGlwYy5zZW5kICdtYXhpbWl6ZVdpbmRvdycsIHdpbmRvdy53aW5JRFxuICAgICAgICBAc2VsZWN0ZWQgPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gVGl0bGViYXJcbiJdfQ==
//# sourceURL=../coffee/titlebar.coffee