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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lraS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsd0JBQUE7SUFBQTs7OztBQUFFLE9BQVMsT0FBQSxDQUFRLEtBQVI7O0FBQ1gsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUNSLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFFRjs7O0lBRVcsY0FBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7O1FBQ1YsSUFBQSxDQUFLLE9BQUwsRUFBYyxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQXBCO1FBQ0Esc0NBQU0sSUFBQyxDQUFBLElBQVA7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtJQUhTOzttQkFLYixLQUFBLEdBQU8sU0FBQTtRQUVILElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7UUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFaLEdBQXVCO1FBQ3ZCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVosR0FBa0I7UUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBWixHQUFtQjtRQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFaLEdBQW9CO1FBQ3BCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUI7UUFDckIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBWixHQUF5QjtRQUN6QixJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQW5CO1FBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxJQUFaO1FBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQWxDO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUE7ZUFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO0lBYkc7O21CQXFCUCxhQUFBLEdBQWUsU0FBQyxJQUFEO2VBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtJQUFWOzttQkFFZixLQUFBLEdBQU8sU0FBQTtRQUNILElBQUMsQ0FBQSxNQUFELENBQUE7ZUFDQSxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRkc7O21CQUlQLElBQUEsR0FBTSxTQUFBO1FBQ0YsS0FBSyxDQUFDLE1BQU4sQ0FBQTtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBO2VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQUhFOzttQkFLTixPQUFBLEdBQVMsU0FBQTtlQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBckIsRUFBa0MsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUF4QztJQUFOOzttQkFFVCxvQkFBQSxHQUFzQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtlQUE0QixLQUFLLENBQUMsb0JBQU4sQ0FBMkIsR0FBM0IsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUM7SUFBNUI7O21CQUN0QixrQkFBQSxHQUFzQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtlQUE0QixLQUFLLENBQUMsa0JBQU4sQ0FBMkIsR0FBM0IsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUM7SUFBNUI7Ozs7R0ExQ1A7O0FBNENuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwICAgIDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwXG5cbnsga2xvZyB9ID0gcmVxdWlyZSAna3hrJ1xuU3RhZ2UgPSByZXF1aXJlICcuL3N0YWdlJ1xuV29ybGQgPSByZXF1aXJlICcuL3dvcmxkJ1xuXG5jbGFzcyBLaWtpIGV4dGVuZHMgU3RhZ2VcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKEB2aWV3KSAtPiBcbiAgICAgICAga2xvZyBcInZpZXc6XCIsIEB2aWV3LmNsYXNzTmFtZVxuICAgICAgICBzdXBlciBAdmlld1xuICAgICAgICBAdmlldy5mb2N1cygpXG4gICAgXG4gICAgc3RhcnQ6IC0+IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICAgICAgQGVsZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgICAgIEBlbGVtLnN0eWxlLnRvcCA9ICcwJ1xuICAgICAgICBAZWxlbS5zdHlsZS5sZWZ0ID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLnJpZ2h0ID0gJzAnXG4gICAgICAgIEBlbGVtLnN0eWxlLmJvdHRvbSA9ICcwJ1xuICAgICAgICBAZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDA0XCJcbiAgICAgICAgQHZpZXcuYXBwZW5kQ2hpbGQgQGVsZW1cbiAgICAgICAgQHdvcmxkID0gV29ybGQuaW5pdCBAdmlld1xuICAgICAgICBAZWxlbS5hcHBlbmRDaGlsZCBAd29ybGQucmVuZGVyZXIuZG9tRWxlbWVudFxuICAgICAgICBAdmlldy5mb2N1cygpXG4gICAgICAgIEBhbmltYXRlKClcblxuICAgICMgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuICAgICMgICAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgICAgXG4gICAgIyAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwICAwMDAgICAgICBcbiAgICBcbiAgICBhbmltYXRpb25TdGVwOiAoc3RlcCkgPT4gQHdvcmxkLnN0ZXAgc3RlcFxuXG4gICAgcmVzZXQ6IC0+XG4gICAgICAgIEByZXN1bWUoKVxuICAgICAgICBAc3RhcnQoKVxuICAgICAgICBcbiAgICBzdG9wOiAtPlxuICAgICAgICBXb3JsZC5kZWluaXQoKVxuICAgICAgICBAZWxlbS5yZW1vdmUoKVxuICAgICAgICBAcGF1c2UoKVxuICAgICAgICBcbiAgICByZXNpemVkOiAoKSAtPiBAd29ybGQucmVzaXplZCBAdmlldy5jbGllbnRXaWR0aCwgQHZpZXcuY2xpZW50SGVpZ2h0XG5cbiAgICBtb2RLZXlDb21ib0V2ZW50RG93bjogKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+IHdvcmxkLm1vZEtleUNvbWJvRXZlbnREb3duIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICBtb2RLZXlDb21ib0V2ZW50VXA6ICAgKG1vZCwga2V5LCBjb21ibywgZXZlbnQpIC0+IHdvcmxkLm1vZEtleUNvbWJvRXZlbnRVcCAgIG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEtpa2lcbiJdfQ==
//# sourceURL=../coffee/kiki.coffee