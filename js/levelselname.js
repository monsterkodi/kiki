// koffee 1.4.0
var Action, LevelSelName, ScreenText, kerror,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

kerror = require('kxk').kerror;

ScreenText = require('./screentext');

Action = require('./action');

LevelSelName = (function(superClass) {
    extend(LevelSelName, superClass);

    function LevelSelName(text) {
        LevelSelName.__super__.constructor.call(this);
        this.addText(text, 2);
        this.show();
    }

    LevelSelName.prototype.resized = function(w, h) {
        this.aspect = w / (h * 0.3);
        this.camera.aspect = this.aspect;
        return this.camera.updateProjectionMatrix();
    };

    return LevelSelName;

})(ScreenText);

module.exports = LevelSelName;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzZWxuYW1lLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQSx3Q0FBQTtJQUFBOzs7QUFBRSxTQUFXLE9BQUEsQ0FBUSxLQUFSOztBQUViLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLFVBQVI7O0FBRVA7OztJQUVDLHNCQUFDLElBQUQ7UUFFQyw0Q0FBQTtRQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLENBQWY7UUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBSkQ7OzJCQU1ILE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBRyxDQUFIO1FBRUwsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFBLEdBQUUsQ0FBQyxDQUFBLEdBQUUsR0FBSDtRQUNaLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUE7ZUFDbEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBO0lBSks7Ozs7R0FSYzs7QUFjM0IsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgMDAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgICAgICAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAgXG4jIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgIFxuIyAwMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgMCAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwICAgICBcbiMgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAgXG4jIDAwMDAwMDAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgIFxuXG57IGtlcnJvciB9ID0gcmVxdWlyZSAna3hrJ1xuXG5TY3JlZW5UZXh0ID0gcmVxdWlyZSAnLi9zY3JlZW50ZXh0J1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuXG5jbGFzcyBMZXZlbFNlbE5hbWUgZXh0ZW5kcyBTY3JlZW5UZXh0XG5cbiAgICBAOiAodGV4dCkgLT5cblxuICAgICAgICBzdXBlcigpXG4gICAgICAgIEBhZGRUZXh0IHRleHQsIDJcbiAgICAgICAgQHNob3coKVxuICAgICAgICBcbiAgICByZXNpemVkOiAodyxoKSAtPlxuICAgICAgICBcbiAgICAgICAgQGFzcGVjdCA9IHcvKGgqMC4zKVxuICAgICAgICBAY2FtZXJhLmFzcGVjdCA9IEBhc3BlY3RcbiAgICAgICAgQGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsU2VsTmFtZVxuIl19
//# sourceURL=../coffee/levelselname.coffee