// koffee 1.4.0
var Stage, keyinfo;

keyinfo = require('kxk').keyinfo;

Stage = (function() {
    function Stage(view) {
        this.view = view;
        this.paused = false;
        this.view.onkeydown = this.onKeyDown;
        this.view.onkeyup = this.onKeyUp;
    }

    return Stage;

})();

module.exports = Stage;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFFLFVBQVksT0FBQSxDQUFRLEtBQVI7O0FBRVI7SUFFQyxlQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDtRQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsSUFBQyxDQUFBO1FBQ25CLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixHQUFrQixJQUFDLENBQUE7SUFIcEI7Ozs7OztBQU1QLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwXG5cbnsga2V5aW5mbyB9ID0gcmVxdWlyZSAna3hrJ1xuXG5jbGFzcyBTdGFnZVxuICAgIFxuICAgIEA6IChAdmlldykgLT5cbiAgICAgICAgQHBhdXNlZCA9IGZhbHNlXG4gICAgICAgIEB2aWV3Lm9ua2V5ZG93biA9IEBvbktleURvd25cbiAgICAgICAgQHZpZXcub25rZXl1cCAgID0gQG9uS2V5VXBcblxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gU3RhZ2VcbiJdfQ==
//# sourceURL=../coffee/stage.coffee