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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLGNBQUE7SUFBQTs7QUFBRSxVQUFZLE9BQUEsQ0FBUSxLQUFSOztBQUVSO0lBRUMsZUFBQyxJQUFEO1FBQUMsSUFBQyxDQUFBLE9BQUQ7Ozs7Ozs7UUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO1FBQ1YsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLElBQUMsQ0FBQTtRQUNuQixJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBa0IsSUFBQyxDQUFBO0lBSHBCOztvQkFLSCxLQUFBLEdBQU8sU0FBQTtlQUFHLElBQUMsQ0FBQSxPQUFELENBQUE7SUFBSDs7b0JBQ1AsS0FBQSxHQUFPLFNBQUE7ZUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQWI7O29CQUNQLE1BQUEsR0FBUSxTQUFBO2VBQUcsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUFiOztvQkFFUixPQUFBLEdBQVMsU0FBQTtBQUNMLFlBQUE7UUFBQSxxQkFBQSxDQUFzQixJQUFDLENBQUEsT0FBdkI7UUFDQSxJQUFBLEdBQVEsR0FBQSxHQUFJO1FBQ1osSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFSO1lBQ0ksSUFBQSxHQUNJO2dCQUFBLEtBQUEsRUFBTyxJQUFBLEdBQUssSUFBWjtnQkFDQSxLQUFBLEVBQU8sSUFEUDs7bUJBRUosSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLEVBSko7O0lBSEs7O29CQVNULFNBQUEsR0FBVyxTQUFDLEtBQUQ7QUFDUCxZQUFBO1FBQUEsTUFBb0IsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBakIsQ0FBcEIsRUFBQyxhQUFELEVBQU0sYUFBTixFQUFXO1FBQ1gsSUFBVSxDQUFJLEtBQWQ7QUFBQSxtQkFBQTs7UUFDQSxJQUFVLEdBQUEsS0FBTyxhQUFqQjtBQUFBLG1CQUFBOztpRUFDQSxJQUFDLENBQUEscUJBQXNCLEtBQUssS0FBSyxPQUFPO0lBSmpDOztvQkFNWCxPQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ0wsWUFBQTtRQUFBLE1BQW9CLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEtBQWpCLENBQXBCLEVBQUMsYUFBRCxFQUFNLGFBQU4sRUFBVztRQUNYLElBQVUsQ0FBSSxLQUFkO0FBQUEsbUJBQUE7O1FBQ0EsSUFBVSxHQUFBLEtBQU8sYUFBakI7QUFBQSxtQkFBQTs7K0RBQ0EsSUFBQyxDQUFBLG1CQUFvQixLQUFLLEtBQUssT0FBTztJQUpqQzs7Ozs7O0FBTWIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMFxuIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwMDAwMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDBcblxueyBrZXlpbmZvIH0gPSByZXF1aXJlICdreGsnXG5cbmNsYXNzIFN0YWdlXG4gICAgXG4gICAgQDogKEB2aWV3KSAtPlxuICAgICAgICBAcGF1c2VkID0gZmFsc2VcbiAgICAgICAgQHZpZXcub25rZXlkb3duID0gQG9uS2V5RG93blxuICAgICAgICBAdmlldy5vbmtleXVwICAgPSBAb25LZXlVcFxuICAgIFxuICAgIHN0YXJ0OiA9PiBAYW5pbWF0ZSgpXG4gICAgcGF1c2U6ID0+IEBwYXVzZWQgPSB0cnVlXG4gICAgcmVzdW1lOiA9PiBAcGF1c2VkID0gZmFsc2VcbiAgICBcbiAgICBhbmltYXRlOiA9PlxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQGFuaW1hdGVcbiAgICAgICAgc2VjcyAgPSAxLjAvNjAuMFxuICAgICAgICBpZiBub3QgQHBhdXNlZFxuICAgICAgICAgICAgc3RlcCA9IFxuICAgICAgICAgICAgICAgIGRlbHRhOiBzZWNzKjEwMDBcbiAgICAgICAgICAgICAgICBkc2Vjczogc2Vjc1xuICAgICAgICAgICAgQGFuaW1hdGlvblN0ZXAgc3RlcFxuXG4gICAgb25LZXlEb3duOiAoZXZlbnQpID0+XG4gICAgICAgIHttb2QsIGtleSwgY29tYm99ID0ga2V5aW5mby5mb3JFdmVudCBldmVudFxuICAgICAgICByZXR1cm4gaWYgbm90IGNvbWJvXG4gICAgICAgIHJldHVybiBpZiBrZXkgPT0gJ3JpZ2h0IGNsaWNrJyAjIHdlaXJkIHJpZ2h0IGNvbW1hbmQga2V5XG4gICAgICAgIEBtb2RLZXlDb21ib0V2ZW50RG93bj8gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgXG4gICAgb25LZXlVcDogKGV2ZW50KSA9PlxuICAgICAgICB7bW9kLCBrZXksIGNvbWJvfSA9IGtleWluZm8uZm9yRXZlbnQgZXZlbnQgICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgbm90IGNvbWJvXG4gICAgICAgIHJldHVybiBpZiBrZXkgPT0gJ3JpZ2h0IGNsaWNrJyAjIHdlaXJkIHJpZ2h0IGNvbW1hbmQga2V5XG4gICAgICAgIEBtb2RLZXlDb21ib0V2ZW50VXA/IG1vZCwga2V5LCBjb21ibywgZXZlbnRcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWdlXG4iXX0=
//# sourceURL=../coffee/stage.coffee