// koffee 1.4.0
var Stage, keyinfo,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

keyinfo = require('kxk').keyinfo;

Stage = (function() {
    function Stage(view) {
        this.view = view;
        this.onKeyUp = bind(this.onKeyUp, this);
        this.onKeyDown = bind(this.onKeyDown, this);
        this.animate = bind(this.animate, this);
        this.resume = bind(this.resume, this);
        this.pause = bind(this.pause, this);
        this.start = bind(this.start, this);
        this.paused = false;
        this.view.onkeydown = this.onKeyDown;
        this.view.onkeyup = this.onKeyUp;
    }

    Stage.prototype.start = function() {
        return this.animate();
    };

    Stage.prototype.pause = function() {
        return this.paused = true;
    };

    Stage.prototype.resume = function() {
        return this.paused = false;
    };

    Stage.prototype.animate = function() {
        var secs, step;
        requestAnimationFrame(this.animate);
        secs = 1.0 / 60.0;
        if (!this.paused) {
            step = {
                delta: secs * 1000,
                dsecs: secs
            };
            return this.animationStep(step);
        }
    };

    Stage.prototype.onKeyDown = function(event) {
        var combo, key, mod, ref;
        ref = keyinfo.forEvent(event), mod = ref.mod, key = ref.key, combo = ref.combo;
        if (!combo) {
            return;
        }
        if (key === 'right click') {
            return;
        }
        return typeof this.modKeyComboEventDown === "function" ? this.modKeyComboEventDown(mod, key, combo, event) : void 0;
    };

    Stage.prototype.onKeyUp = function(event) {
        var combo, key, mod, ref;
        ref = keyinfo.forEvent(event), mod = ref.mod, key = ref.key, combo = ref.combo;
        if (!combo) {
            return;
        }
        if (key === 'right click') {
            return;
        }
        return typeof this.modKeyComboEventUp === "function" ? this.modKeyComboEventUp(mod, key, combo, event) : void 0;
    };

    return Stage;

})();

module.exports = Stage;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLGNBQUE7SUFBQTs7QUFBRSxVQUFZLE9BQUEsQ0FBUSxLQUFSOztBQUVSO0lBRVcsZUFBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7Ozs7Ozs7UUFDVixJQUFDLENBQUEsTUFBRCxHQUFVO1FBQ1YsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLElBQUMsQ0FBQTtRQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBa0IsSUFBQyxDQUFBO0lBSFY7O29CQUtiLEtBQUEsR0FBTyxTQUFBO2VBQUcsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQUFIOztvQkFDUCxLQUFBLEdBQU8sU0FBQTtlQUFHLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFBYjs7b0JBQ1AsTUFBQSxHQUFRLFNBQUE7ZUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQWI7O29CQUVSLE9BQUEsR0FBUyxTQUFBO0FBQ0wsWUFBQTtRQUFBLHFCQUFBLENBQXNCLElBQUMsQ0FBQSxPQUF2QjtRQUNBLElBQUEsR0FBUSxHQUFBLEdBQUk7UUFDWixJQUFHLENBQUksSUFBQyxDQUFBLE1BQVI7WUFDSSxJQUFBLEdBQ0k7Z0JBQUEsS0FBQSxFQUFPLElBQUEsR0FBSyxJQUFaO2dCQUNBLEtBQUEsRUFBTyxJQURQOzttQkFFSixJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFKSjs7SUFISzs7b0JBU1QsU0FBQSxHQUFXLFNBQUMsS0FBRDtBQUNQLFlBQUE7UUFBQSxNQUFvQixPQUFPLENBQUMsUUFBUixDQUFpQixLQUFqQixDQUFwQixFQUFDLGFBQUQsRUFBTSxhQUFOLEVBQVc7UUFDWCxJQUFVLENBQUksS0FBZDtBQUFBLG1CQUFBOztRQUNBLElBQVUsR0FBQSxLQUFPLGFBQWpCO0FBQUEsbUJBQUE7O2lFQUNBLElBQUMsQ0FBQSxxQkFBc0IsS0FBSyxLQUFLLE9BQU87SUFKakM7O29CQU1YLE9BQUEsR0FBUyxTQUFDLEtBQUQ7QUFDTCxZQUFBO1FBQUEsTUFBb0IsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBakIsQ0FBcEIsRUFBQyxhQUFELEVBQU0sYUFBTixFQUFXO1FBQ1gsSUFBVSxDQUFJLEtBQWQ7QUFBQSxtQkFBQTs7UUFDQSxJQUFVLEdBQUEsS0FBTyxhQUFqQjtBQUFBLG1CQUFBOzsrREFDQSxJQUFDLENBQUEsbUJBQW9CLEtBQUssS0FBSyxPQUFPO0lBSmpDOzs7Ozs7QUFNYixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwXG4jIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAwMDAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMCBcbiMgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMFxuXG57IGtleWluZm8gfSA9IHJlcXVpcmUgJ2t4aydcblxuY2xhc3MgU3RhZ2VcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKEB2aWV3KSAtPiBcbiAgICAgICAgQHBhdXNlZCA9IGZhbHNlXG4gICAgICAgIEB2aWV3Lm9ua2V5ZG93biA9IEBvbktleURvd25cbiAgICAgICAgQHZpZXcub25rZXl1cCAgID0gQG9uS2V5VXBcbiAgICBcbiAgICBzdGFydDogPT4gQGFuaW1hdGUoKVxuICAgIHBhdXNlOiA9PiBAcGF1c2VkID0gdHJ1ZVxuICAgIHJlc3VtZTogPT4gQHBhdXNlZCA9IGZhbHNlXG4gICAgXG4gICAgYW5pbWF0ZTogPT5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBhbmltYXRlXG4gICAgICAgIHNlY3MgID0gMS4wLzYwLjBcbiAgICAgICAgaWYgbm90IEBwYXVzZWRcbiAgICAgICAgICAgIHN0ZXAgPSBcbiAgICAgICAgICAgICAgICBkZWx0YTogc2VjcyoxMDAwXG4gICAgICAgICAgICAgICAgZHNlY3M6IHNlY3NcbiAgICAgICAgICAgIEBhbmltYXRpb25TdGVwIHN0ZXBcblxuICAgIG9uS2V5RG93bjogKGV2ZW50KSA9PlxuICAgICAgICB7bW9kLCBrZXksIGNvbWJvfSA9IGtleWluZm8uZm9yRXZlbnQgZXZlbnRcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBjb21ib1xuICAgICAgICByZXR1cm4gaWYga2V5ID09ICdyaWdodCBjbGljaycgIyB3ZWlyZCByaWdodCBjb21tYW5kIGtleVxuICAgICAgICBAbW9kS2V5Q29tYm9FdmVudERvd24/IG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgIFxuICAgIG9uS2V5VXA6IChldmVudCkgPT5cbiAgICAgICAge21vZCwga2V5LCBjb21ib30gPSBrZXlpbmZvLmZvckV2ZW50IGV2ZW50ICAgICAgICBcbiAgICAgICAgcmV0dXJuIGlmIG5vdCBjb21ib1xuICAgICAgICByZXR1cm4gaWYga2V5ID09ICdyaWdodCBjbGljaycgIyB3ZWlyZCByaWdodCBjb21tYW5kIGtleVxuICAgICAgICBAbW9kS2V5Q29tYm9FdmVudFVwPyBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBTdGFnZVxuIl19
//# sourceURL=../coffee/stage.coffee