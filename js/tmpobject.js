// koffee 1.4.0
var Item, TmpObject, log,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

log = require('./tools/log');

Item = require('./item');

TmpObject = (function(superClass) {
    extend(TmpObject, superClass);

    TmpObject.tmpID = 0;

    TmpObject.prototype.isSpaceEgoistic = function() {
        return true;
    };

    function TmpObject(o) {
        TmpObject.tmpID += 1;
        this.time = 0;
        this.object = o;
        this.name = "tmp" + TmpObject.tmpID;
        TmpObject.__super__.constructor.apply(this, arguments);
        this.setPos(o.getPos());
    }

    TmpObject.prototype.del = function() {
        return TmpObject.__super__.del.apply(this, arguments);
    };

    return TmpObject;

})(Item);

module.exports = TmpObject;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG1wb2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxvQkFBQTtJQUFBOzs7QUFBQSxHQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztBQUVEOzs7SUFFRixTQUFDLENBQUEsS0FBRCxHQUFTOzt3QkFDVCxlQUFBLEdBQWlCLFNBQUE7ZUFBRztJQUFIOztJQUVKLG1CQUFDLENBQUQ7UUFDVCxTQUFTLENBQUMsS0FBVixJQUFtQjtRQUNuQixJQUFDLENBQUEsSUFBRCxHQUFRO1FBQ1IsSUFBQyxDQUFBLE1BQUQsR0FBVTtRQUNWLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FBQSxHQUFNLFNBQVMsQ0FBQztRQUN4Qiw0Q0FBQSxTQUFBO1FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFDLENBQUMsTUFBRixDQUFBLENBQVI7SUFOUzs7d0JBUWIsR0FBQSxHQUFLLFNBQUE7ZUFFRCxvQ0FBQSxTQUFBO0lBRkM7Ozs7R0FiZTs7QUFpQnhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwMFxuIyAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuIyAgICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgIFxuIyAgICAwMDAgICAgIDAwMCAwIDAwMCAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgIFxuIyAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgIFxuXG5sb2cgID0gcmVxdWlyZSAnLi90b29scy9sb2cnXG5JdGVtID0gcmVxdWlyZSAnLi9pdGVtJ1xuXG5jbGFzcyBUbXBPYmplY3QgZXh0ZW5kcyBJdGVtXG4gICAgXG4gICAgQHRtcElEID0gMFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gdHJ1ZVxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAobykgLT5cbiAgICAgICAgVG1wT2JqZWN0LnRtcElEICs9IDFcbiAgICAgICAgQHRpbWUgPSAwXG4gICAgICAgIEBvYmplY3QgPSBvXG4gICAgICAgIEBuYW1lID0gXCJ0bXAje1RtcE9iamVjdC50bXBJRH1cIlxuICAgICAgICBzdXBlclxuICAgICAgICBAc2V0UG9zIG8uZ2V0UG9zKClcbiAgICBcbiAgICBkZWw6IC0+IFxuICAgICAgICAjIGxvZyBcInRtcE9iamVjdCAtLS0tLS0tLSBkZWwgI3tAbmFtZX1cIiwgQGdldFBvcygpXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBUbXBPYmplY3RcbiJdfQ==
//# sourceURL=../coffee/tmpobject.coffee