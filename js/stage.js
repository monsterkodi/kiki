// koffee 1.4.0
var Stage, keyinfo, log,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

log = require('./tools/log');

keyinfo = require('./tools/keyinfo');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLG1CQUFBO0lBQUE7O0FBQUEsR0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSOztBQUNWLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVI7O0FBRUo7SUFFVyxlQUFDLElBQUQ7UUFBQyxJQUFDLENBQUEsT0FBRDs7Ozs7OztRQUNWLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsSUFBQyxDQUFBO1FBQ25CLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixHQUFrQixJQUFDLENBQUE7SUFIVjs7b0JBS2IsS0FBQSxHQUFPLFNBQUE7ZUFBRyxJQUFDLENBQUEsT0FBRCxDQUFBO0lBQUg7O29CQUNQLEtBQUEsR0FBTyxTQUFBO2VBQUcsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUFiOztvQkFDUCxNQUFBLEdBQVEsU0FBQTtlQUFHLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFBYjs7b0JBRVIsT0FBQSxHQUFTLFNBQUE7QUFDTCxZQUFBO1FBQUEscUJBQUEsQ0FBc0IsSUFBQyxDQUFBLE9BQXZCO1FBQ0EsSUFBQSxHQUFRLEdBQUEsR0FBSTtRQUNaLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBUjtZQUNJLElBQUEsR0FDSTtnQkFBQSxLQUFBLEVBQU8sSUFBQSxHQUFLLElBQVo7Z0JBQ0EsS0FBQSxFQUFPLElBRFA7O21CQUVKLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUpKOztJQUhLOztvQkFTVCxTQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1AsWUFBQTtRQUFBLE1BQW9CLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEtBQWpCLENBQXBCLEVBQUMsYUFBRCxFQUFNLGFBQU4sRUFBVztRQUNYLElBQVUsQ0FBSSxLQUFkO0FBQUEsbUJBQUE7O1FBQ0EsSUFBVSxHQUFBLEtBQU8sYUFBakI7QUFBQSxtQkFBQTs7aUVBQ0EsSUFBQyxDQUFBLHFCQUFzQixLQUFLLEtBQUssT0FBTztJQUpqQzs7b0JBTVgsT0FBQSxHQUFTLFNBQUMsS0FBRDtBQUNMLFlBQUE7UUFBQSxNQUFvQixPQUFPLENBQUMsUUFBUixDQUFpQixLQUFqQixDQUFwQixFQUFDLGFBQUQsRUFBTSxhQUFOLEVBQVc7UUFDWCxJQUFVLENBQUksS0FBZDtBQUFBLG1CQUFBOztRQUNBLElBQVUsR0FBQSxLQUFPLGFBQWpCO0FBQUEsbUJBQUE7OytEQUNBLElBQUMsQ0FBQSxtQkFBb0IsS0FBSyxLQUFLLE9BQU87SUFKakM7Ozs7OztBQU1iLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwXG5cbmxvZyAgICAgPSByZXF1aXJlICcuL3Rvb2xzL2xvZydcbmtleWluZm8gPSByZXF1aXJlICcuL3Rvb2xzL2tleWluZm8nXG5cbmNsYXNzIFN0YWdlXG4gICAgXG4gICAgY29uc3RydWN0b3I6IChAdmlldykgLT4gXG4gICAgICAgIEBwYXVzZWQgPSBmYWxzZVxuICAgICAgICBAdmlldy5vbmtleWRvd24gPSBAb25LZXlEb3duXG4gICAgICAgIEB2aWV3Lm9ua2V5dXAgICA9IEBvbktleVVwXG4gICAgXG4gICAgc3RhcnQ6ID0+IEBhbmltYXRlKClcbiAgICBwYXVzZTogPT4gQHBhdXNlZCA9IHRydWVcbiAgICByZXN1bWU6ID0+IEBwYXVzZWQgPSBmYWxzZVxuICAgIFxuICAgIGFuaW1hdGU6ID0+XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSBAYW5pbWF0ZVxuICAgICAgICBzZWNzICA9IDEuMC82MC4wXG4gICAgICAgIGlmIG5vdCBAcGF1c2VkXG4gICAgICAgICAgICBzdGVwID0gXG4gICAgICAgICAgICAgICAgZGVsdGE6IHNlY3MqMTAwMFxuICAgICAgICAgICAgICAgIGRzZWNzOiBzZWNzXG4gICAgICAgICAgICBAYW5pbWF0aW9uU3RlcCBzdGVwXG5cbiAgICBvbktleURvd246IChldmVudCkgPT5cbiAgICAgICAge21vZCwga2V5LCBjb21ib30gPSBrZXlpbmZvLmZvckV2ZW50IGV2ZW50XG4gICAgICAgIHJldHVybiBpZiBub3QgY29tYm9cbiAgICAgICAgcmV0dXJuIGlmIGtleSA9PSAncmlnaHQgY2xpY2snICMgd2VpcmQgcmlnaHQgY29tbWFuZCBrZXlcbiAgICAgICAgQG1vZEtleUNvbWJvRXZlbnREb3duPyBtb2QsIGtleSwgY29tYm8sIGV2ZW50XG4gICBcbiAgICBvbktleVVwOiAoZXZlbnQpID0+XG4gICAgICAgIHttb2QsIGtleSwgY29tYm99ID0ga2V5aW5mby5mb3JFdmVudCBldmVudCAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiBub3QgY29tYm9cbiAgICAgICAgcmV0dXJuIGlmIGtleSA9PSAncmlnaHQgY2xpY2snICMgd2VpcmQgcmlnaHQgY29tbWFuZCBrZXlcbiAgICAgICAgQG1vZEtleUNvbWJvRXZlbnRVcD8gbW9kLCBrZXksIGNvbWJvLCBldmVudFxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gU3RhZ2VcbiJdfQ==
//# sourceURL=../coffee/stage.coffee