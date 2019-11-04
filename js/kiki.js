// koffee 1.4.0
var Kiki, Stage, World, klog,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

klog = require('kxk').klog;

Stage = require('./stage');

World = require('./world');

Kiki = (function(superClass) {
    extend(Kiki, superClass);

    function Kiki(view) {
        this.view = view;
        this.resized = bind(this.resized, this);
        this.animationStep = bind(this.animationStep, this);
        klog("view:", this.view.className);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lraS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsd0JBQUE7SUFBQTs7OztBQUFFLE9BQVMsT0FBQSxDQUFRLEtBQVI7O0FBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFFRjs7O0lBRUMsY0FBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7OztRQUNBLElBQUEsQ0FBSyxPQUFMLEVBQWMsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFwQjtRQUNBLHNDQUFNLElBQUMsQ0FBQSxJQUFQO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUE7SUFIRDs7bUJBS0gsS0FBQSxHQUFPLFNBQUE7UUFFSCxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWixHQUF1QjtRQUN2QixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFaLEdBQWtCO1FBQ2xCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQVosR0FBbUI7UUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWixHQUFvQjtRQUNwQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFaLEdBQXFCO1FBQ3JCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVosR0FBeUI7UUFDekIsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLElBQUMsQ0FBQSxJQUFuQjtRQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFDLENBQUEsSUFBWjtRQUNULElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFsQztRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQWJHOzttQkFxQlAsYUFBQSxHQUFlLFNBQUMsSUFBRDtlQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7SUFBVjs7bUJBRWYsS0FBQSxHQUFPLFNBQUE7UUFDSCxJQUFDLENBQUEsTUFBRCxDQUFBO2VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQUZHOzttQkFJUCxJQUFBLEdBQU0sU0FBQTtRQUNGLEtBQUssQ0FBQyxNQUFOLENBQUE7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQTtlQUNBLElBQUMsQ0FBQSxLQUFELENBQUE7SUFIRTs7bUJBS04sT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBZSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQXJCLEVBQWtDLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBeEM7SUFBSDs7bUJBRVQsb0JBQUEsR0FBc0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7ZUFBNEIsS0FBSyxDQUFDLG9CQUFOLENBQTJCLEdBQTNCLEVBQWdDLEdBQWhDLEVBQXFDLEtBQXJDLEVBQTRDLEtBQTVDO0lBQTVCOzttQkFDdEIsa0JBQUEsR0FBc0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7ZUFBNEIsS0FBSyxDQUFDLGtCQUFOLENBQTJCLEdBQTNCLEVBQWdDLEdBQWhDLEVBQXFDLEtBQXJDLEVBQTRDLEtBQTVDO0lBQTVCOzs7O0dBMUNQOztBQTRDbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMCAgICAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMFxuXG57IGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblN0YWdlID0gcmVxdWlyZSAnLi9zdGFnZSdcbldvcmxkID0gcmVxdWlyZSAnLi93b3JsZCdcblxuY2xhc3MgS2lraSBleHRlbmRzIFN0YWdlXG4gICAgXG4gICAgQDogKEB2aWV3KSAtPlxuICAgICAgICBrbG9nIFwidmlldzpcIiwgQHZpZXcuY2xhc3NOYW1lXG4gICAgICAgIHN1cGVyIEB2aWV3XG4gICAgICAgIEB2aWV3LmZvY3VzKClcbiAgICBcbiAgICBzdGFydDogLT4gXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICBAZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgICAgICAgQGVsZW0uc3R5bGUudG9wID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLmxlZnQgPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUucmlnaHQgPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUuYm90dG9tID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSBcIiMwMDRcIlxuICAgICAgICBAdmlldy5hcHBlbmRDaGlsZCBAZWxlbVxuICAgICAgICBAd29ybGQgPSBXb3JsZC5pbml0IEB2aWV3XG4gICAgICAgIEBlbGVtLmFwcGVuZENoaWxkIEB3b3JsZC5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgICAgIEB2aWV3LmZvY3VzKClcbiAgICAgICAgQGFuaW1hdGUoKVxuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIGFuaW1hdGlvblN0ZXA6IChzdGVwKSA9PiBAd29ybGQuc3RlcCBzdGVwXG5cbiAgICByZXNldDogLT5cbiAgICAgICAgQHJlc3VtZSgpXG4gICAgICAgIEBzdGFydCgpXG4gICAgICAgIFxuICAgIHN0b3A6IC0+XG4gICAgICAgIFdvcmxkLmRlaW5pdCgpXG4gICAgICAgIEBlbGVtLnJlbW92ZSgpXG4gICAgICAgIEBwYXVzZSgpXG4gICAgICAgIFxuICAgIHJlc2l6ZWQ6ID0+IEB3b3JsZC5yZXNpemVkIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcblxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudERvd24gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgIG1vZEtleUNvbWJvRXZlbnRVcDogICAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgLT4gd29ybGQubW9kS2V5Q29tYm9FdmVudFVwICAgbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gS2lraVxuIl19
//# sourceURL=../coffee/kiki.coffee