// koffee 1.4.0
var Kiki, Stage, World,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Stage = require('./stage');

World = require('./world');

Kiki = (function(superClass) {
    extend(Kiki, superClass);

    function Kiki(view) {
        this.view = view;
        this.animationStep = bind(this.animationStep, this);
        console.log("view:", this.view.className);
        Kiki.__super__.constructor.call(this, this.view);
        this.view.focus();
    }

    Kiki.prototype.start = function() {
        this.elem = document.createElement('div');
        this.elem.style.position = 'absolute';
        this.elem.style.top = '0';
        this.elem.style.left = '0';
        this.elem.style.right = '0';
        this.elem.style.bottom = '0';
        this.elem.style.background = "#004";
        this.view.appendChild(this.elem);
        this.world = World.init(this.view);
        this.elem.appendChild(this.world.renderer.domElement);
        this.view.focus();
        return this.animate();
    };

    Kiki.prototype.animationStep = function(step) {
        return this.world.step(step);
    };

    Kiki.prototype.reset = function() {
        this.resume();
        return this.start();
    };

    Kiki.prototype.stop = function() {
        World.deinit();
        this.elem.remove();
        return this.pause();
    };

    Kiki.prototype.resized = function() {
        return this.world.resized(this.view.clientWidth, this.view.clientHeight);
    };

    Kiki.prototype.modKeyComboEventDown = function(mod, key, combo, event) {
        return world.modKeyComboEventDown(mod, key, combo, event);
    };

    Kiki.prototype.modKeyComboEventUp = function(mod, key, combo, event) {
        return world.modKeyComboEventUp(mod, key, combo, event);
    };

    return Kiki;

})(Stage);

module.exports = Kiki;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lraS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsa0JBQUE7SUFBQTs7OztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFDUixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBRUY7OztJQUVXLGNBQUMsSUFBRDtRQUFDLElBQUMsQ0FBQSxPQUFEOztRQUNYLE9BQUEsQ0FBQyxHQUFELENBQUssT0FBTCxFQUFjLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBcEI7UUFDQyxzQ0FBTSxJQUFDLENBQUEsSUFBUDtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO0lBSFM7O21CQUtiLEtBQUEsR0FBTyxTQUFBO1FBRUgsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVosR0FBdUI7UUFDdkIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBWixHQUFrQjtRQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFaLEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQVosR0FBb0I7UUFDcEIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBWixHQUFxQjtRQUNyQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFaLEdBQXlCO1FBQ3pCLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsSUFBbkI7UUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQVo7UUFDVCxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBbEM7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtlQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7SUFiRzs7bUJBcUJQLGFBQUEsR0FBZSxTQUFDLElBQUQ7ZUFBVSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxJQUFaO0lBQVY7O21CQUVmLEtBQUEsR0FBTyxTQUFBO1FBQ0gsSUFBQyxDQUFBLE1BQUQsQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFELENBQUE7SUFGRzs7bUJBSVAsSUFBQSxHQUFNLFNBQUE7UUFDRixLQUFLLENBQUMsTUFBTixDQUFBO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQUE7ZUFDQSxJQUFDLENBQUEsS0FBRCxDQUFBO0lBSEU7O21CQUtOLE9BQUEsR0FBUyxTQUFBO2VBQU0sSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFyQixFQUFrQyxJQUFDLENBQUEsSUFBSSxDQUFDLFlBQXhDO0lBQU47O21CQUVULG9CQUFBLEdBQXNCLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO2VBQTRCLEtBQUssQ0FBQyxvQkFBTixDQUEyQixHQUEzQixFQUFnQyxHQUFoQyxFQUFxQyxLQUFyQyxFQUE0QyxLQUE1QztJQUE1Qjs7bUJBQ3RCLGtCQUFBLEdBQXNCLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYLEVBQWtCLEtBQWxCO2VBQTRCLEtBQUssQ0FBQyxrQkFBTixDQUEyQixHQUEzQixFQUFnQyxHQUFoQyxFQUFxQyxLQUFyQyxFQUE0QyxLQUE1QztJQUE1Qjs7OztHQTFDUDs7QUE0Q25CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAgICAgMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDBcblxuU3RhZ2UgPSByZXF1aXJlICcuL3N0YWdlJ1xuV29ybGQgPSByZXF1aXJlICcuL3dvcmxkJ1xuXG5jbGFzcyBLaWtpIGV4dGVuZHMgU3RhZ2VcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKEB2aWV3KSAtPiBcbiAgICAgICAgbG9nIFwidmlldzpcIiwgQHZpZXcuY2xhc3NOYW1lXG4gICAgICAgIHN1cGVyIEB2aWV3XG4gICAgICAgIEB2aWV3LmZvY3VzKClcbiAgICBcbiAgICBzdGFydDogLT4gXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICBAZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICAgICAgQGVsZW0uc3R5bGUudG9wID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLmxlZnQgPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUucmlnaHQgPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUuYm90dG9tID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSBcIiMwMDRcIlxuICAgICAgICBAdmlldy5hcHBlbmRDaGlsZCBAZWxlbVxuICAgICAgICBAd29ybGQgPSBXb3JsZC5pbml0IEB2aWV3XG4gICAgICAgIEBlbGVtLmFwcGVuZENoaWxkIEB3b3JsZC5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgICAgIEB2aWV3LmZvY3VzKClcbiAgICAgICAgQGFuaW1hdGUoKVxuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIGFuaW1hdGlvblN0ZXA6IChzdGVwKSA9PiBAd29ybGQuc3RlcCBzdGVwXG5cbiAgICByZXNldDogLT5cbiAgICAgICAgQHJlc3VtZSgpXG4gICAgICAgIEBzdGFydCgpXG4gICAgICAgIFxuICAgIHN0b3A6IC0+XG4gICAgICAgIFdvcmxkLmRlaW5pdCgpXG4gICAgICAgIEBlbGVtLnJlbW92ZSgpXG4gICAgICAgIEBwYXVzZSgpXG4gICAgICAgIFxuICAgIHJlc2l6ZWQ6ICgpIC0+IEB3b3JsZC5yZXNpemVkIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcblxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgIG1vZEtleUNvbWJvRXZlbnRVcDogICAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudFVwICAgbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gS2lraVxuIl19
//# sourceURL=../coffee/kiki.coffee