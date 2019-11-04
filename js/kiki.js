// koffee 1.4.0
var Kiki, Stage, World, log,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Stage = require('./stage');

log = require('./tools/log');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lraS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsdUJBQUE7SUFBQTs7OztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUjs7QUFDUixHQUFBLEdBQVEsT0FBQSxDQUFRLGFBQVI7O0FBQ1IsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSOztBQUVGOzs7SUFFVyxjQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDs7UUFDWCxPQUFBLENBQUMsR0FBRCxDQUFLLE9BQUwsRUFBYyxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQXBCO1FBQ0Msc0NBQU0sSUFBQyxDQUFBLElBQVA7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtJQUhTOzttQkFLYixLQUFBLEdBQU8sU0FBQTtRQUVILElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7UUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFaLEdBQXVCO1FBQ3ZCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVosR0FBa0I7UUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBWixHQUFtQjtRQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFaLEdBQW9CO1FBQ3BCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUI7UUFDckIsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBWixHQUF5QjtRQUN6QixJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQW5CO1FBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxJQUFaO1FBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQWxDO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUE7ZUFDQSxJQUFDLENBQUEsT0FBRCxDQUFBO0lBYkc7O21CQXFCUCxhQUFBLEdBQWUsU0FBQyxJQUFEO2VBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtJQUFWOzttQkFFZixLQUFBLEdBQU8sU0FBQTtRQUNILElBQUMsQ0FBQSxNQUFELENBQUE7ZUFDQSxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRkc7O21CQUlQLElBQUEsR0FBTSxTQUFBO1FBQ0YsS0FBSyxDQUFDLE1BQU4sQ0FBQTtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBO2VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQUhFOzttQkFLTixPQUFBLEdBQVMsU0FBQTtlQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBckIsRUFBa0MsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUF4QztJQUFOOzttQkFFVCxvQkFBQSxHQUFzQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtlQUE0QixLQUFLLENBQUMsb0JBQU4sQ0FBMkIsR0FBM0IsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUM7SUFBNUI7O21CQUN0QixrQkFBQSxHQUFzQixTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixLQUFsQjtlQUE0QixLQUFLLENBQUMsa0JBQU4sQ0FBMkIsR0FBM0IsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUM7SUFBNUI7Ozs7R0ExQ1A7O0FBNENuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwICAgIDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwXG5cblN0YWdlID0gcmVxdWlyZSAnLi9zdGFnZSdcbmxvZyAgID0gcmVxdWlyZSAnLi90b29scy9sb2cnXG5Xb3JsZCA9IHJlcXVpcmUgJy4vd29ybGQnXG5cbmNsYXNzIEtpa2kgZXh0ZW5kcyBTdGFnZVxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAoQHZpZXcpIC0+IFxuICAgICAgICBsb2cgXCJ2aWV3OlwiLCBAdmlldy5jbGFzc05hbWVcbiAgICAgICAgc3VwZXIgQHZpZXdcbiAgICAgICAgQHZpZXcuZm9jdXMoKVxuICAgIFxuICAgIHN0YXJ0OiAtPiBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgIEBlbGVtLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgICAgICBAZWxlbS5zdHlsZS50b3AgPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUubGVmdCA9ICcwJ1xuICAgICAgICBAZWxlbS5zdHlsZS5yaWdodCA9ICcwJ1xuICAgICAgICBAZWxlbS5zdHlsZS5ib3R0b20gPSAnMCdcbiAgICAgICAgQGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9IFwiIzAwNFwiXG4gICAgICAgIEB2aWV3LmFwcGVuZENoaWxkIEBlbGVtXG4gICAgICAgIEB3b3JsZCA9IFdvcmxkLmluaXQgQHZpZXdcbiAgICAgICAgQGVsZW0uYXBwZW5kQ2hpbGQgQHdvcmxkLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICAgICAgQHZpZXcuZm9jdXMoKVxuICAgICAgICBAYW5pbWF0ZSgpXG5cbiAgICAjICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuICAgICMgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiAgICAjICAgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgIFxuICAgICMgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgICAgXG4gICAgXG4gICAgYW5pbWF0aW9uU3RlcDogKHN0ZXApID0+IEB3b3JsZC5zdGVwIHN0ZXBcblxuICAgIHJlc2V0OiAtPlxuICAgICAgICBAcmVzdW1lKClcbiAgICAgICAgQHN0YXJ0KClcbiAgICAgICAgXG4gICAgc3RvcDogLT5cbiAgICAgICAgV29ybGQuZGVpbml0KClcbiAgICAgICAgQGVsZW0ucmVtb3ZlKClcbiAgICAgICAgQHBhdXNlKClcbiAgICAgICAgXG4gICAgcmVzaXplZDogKCkgLT4gQHdvcmxkLnJlc2l6ZWQgQHZpZXcuY2xpZW50V2lkdGgsIEB2aWV3LmNsaWVudEhlaWdodFxuXG4gICAgbW9kS2V5Q29tYm9FdmVudERvd246IChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPiB3b3JsZC5tb2RLZXlDb21ib0V2ZW50RG93biBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgbW9kS2V5Q29tYm9FdmVudFVwOiAgIChtb2QsIGtleSwgY29tYm8sIGV2ZW50KSAtPiB3b3JsZC5tb2RLZXlDb21ib0V2ZW50VXAgICBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBLaWtpXG4iXX0=
//# sourceURL=../coffee/kiki.coffee