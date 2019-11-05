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
        this.modKeyComboEventUp = bind(this.modKeyComboEventUp, this);
        this.modKeyComboEventDown = bind(this.modKeyComboEventDown, this);
        this.resized = bind(this.resized, this);
        this.animationStep = bind(this.animationStep, this);
        klog("view:", this.view.className);
        Kiki.__super__.constructor.call(this, this.view);
        this.view.focus();
    }

    Kiki.prototype.start = function() {
        this.world = World.init(this.view);
        this.view.focus();
        return this.animate();
    };

    Kiki.prototype.animationStep = function(step) {
        return this.world.step(step);
    };

    Kiki.prototype.resized = function() {
        return this.world.resized(this.view.clientWidth, this.view.clientHeight);
    };

    Kiki.prototype.modKeyComboEventDown = function(mod, key, combo, event) {
        return this.world.modKeyComboEventDown(mod, key, combo, event);
    };

    Kiki.prototype.modKeyComboEventUp = function(mod, key, combo, event) {
        return this.world.modKeyComboEventUp(mod, key, combo, event);
    };

    return Kiki;

})(Stage);

module.exports = Kiki;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lraS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsd0JBQUE7SUFBQTs7OztBQUFFLE9BQVMsT0FBQSxDQUFRLEtBQVI7O0FBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFFRjs7O0lBRUMsY0FBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7Ozs7O1FBQ0EsSUFBQSxDQUFLLE9BQUwsRUFBYyxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQXBCO1FBQ0Esc0NBQU0sSUFBQyxDQUFBLElBQVA7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtJQUhEOzttQkFLSCxLQUFBLEdBQU8sU0FBQTtRQUVILElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFDLENBQUEsSUFBWjtRQUNULElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQUpHOzttQkFZUCxhQUFBLEdBQWUsU0FBQyxJQUFEO2VBRVgsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtJQUZXOzttQkFTZixPQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBckIsRUFBa0MsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUF4QztJQUFIOzttQkFFVCxvQkFBQSxHQUFzQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtlQUE0QixJQUFDLENBQUEsS0FBSyxDQUFDLG9CQUFQLENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDO0lBQTVCOzttQkFDdEIsa0JBQUEsR0FBc0IsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEI7ZUFBNEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxrQkFBUCxDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QztJQUE1Qjs7OztHQS9CUDs7QUFpQ25CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMCAgICAwMDAgIDAwMDAwMDAgICAgMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDBcblxueyBrbG9nIH0gPSByZXF1aXJlICdreGsnXG5TdGFnZSA9IHJlcXVpcmUgJy4vc3RhZ2UnXG5Xb3JsZCA9IHJlcXVpcmUgJy4vd29ybGQnXG5cbmNsYXNzIEtpa2kgZXh0ZW5kcyBTdGFnZVxuICAgIFxuICAgIEA6IChAdmlldykgLT5cbiAgICAgICAga2xvZyBcInZpZXc6XCIsIEB2aWV3LmNsYXNzTmFtZVxuICAgICAgICBzdXBlciBAdmlld1xuICAgICAgICBAdmlldy5mb2N1cygpXG4gICAgXG4gICAgc3RhcnQ6IC0+IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAd29ybGQgPSBXb3JsZC5pbml0IEB2aWV3XG4gICAgICAgIEB2aWV3LmZvY3VzKClcbiAgICAgICAgQGFuaW1hdGUoKVxuXG4gICAgIyAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4gICAgIyAgICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICBcbiAgICAjICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgICAgIFxuICAgIFxuICAgIGFuaW1hdGlvblN0ZXA6IChzdGVwKSA9PiBcbiAgICBcbiAgICAgICAgQHdvcmxkLnN0ZXAgc3RlcFxuXG4gICAgIyByZXNldDogLT5cbiMgICAgICAgICBcbiAgICAgICAgIyBAcmVzdW1lKClcbiAgICAgICAgIyBAc3RhcnQoKVxuICAgICAgICAgICAgICAgIFxuICAgIHJlc2l6ZWQ6ID0+IEB3b3JsZC5yZXNpemVkIEB2aWV3LmNsaWVudFdpZHRoLCBAdmlldy5jbGllbnRIZWlnaHRcblxuICAgIG1vZEtleUNvbWJvRXZlbnREb3duOiAobW9kLCBrZXksIGNvbWJvLCBldmVudCkgPT4gQHdvcmxkLm1vZEtleUNvbWJvRXZlbnREb3duIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6ICAgKG1vZCwga2V5LCBjb21ibywgZXZlbnQpID0+IEB3b3JsZC5tb2RLZXlDb21ib0V2ZW50VXAgICBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBLaWtpXG4iXX0=
//# sourceURL=../coffee/kiki.coffee