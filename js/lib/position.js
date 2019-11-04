// koffee 1.4.0
var Position;

Position = (function() {
    function Position(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
    }

    Position.prototype.plus = function(s) {
        return new Position(this.w + s.w, this.h + s.h);
    };

    Position.prototype.minus = function(s) {
        return new Position(this.w - s.w, this.h - s.h);
    };

    Position.prototype.eql = function(s) {
        return this.x === s.x && this.y === s.y;
    };

    return Position;

})();

module.exports = Position;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFNO0lBRVcsa0JBQUMsQ0FBRCxFQUFPLENBQVA7UUFBQyxJQUFDLENBQUEsZ0JBQUQsSUFBRztRQUFHLElBQUMsQ0FBQSxnQkFBRCxJQUFHO0lBQVY7O3VCQUViLElBQUEsR0FBTyxTQUFDLENBQUQ7ZUFBTyxJQUFJLFFBQUosQ0FBYSxJQUFDLENBQUEsQ0FBRCxHQUFHLENBQUMsQ0FBQyxDQUFsQixFQUFvQixJQUFDLENBQUEsQ0FBRCxHQUFHLENBQUMsQ0FBQyxDQUF6QjtJQUFQOzt1QkFDUCxLQUFBLEdBQU8sU0FBQyxDQUFEO2VBQU8sSUFBSSxRQUFKLENBQWEsSUFBQyxDQUFBLENBQUQsR0FBRyxDQUFDLENBQUMsQ0FBbEIsRUFBb0IsSUFBQyxDQUFBLENBQUQsR0FBRyxDQUFDLENBQUMsQ0FBekI7SUFBUDs7dUJBQ1AsR0FBQSxHQUFPLFNBQUMsQ0FBRDtlQUFPLElBQUMsQ0FBQSxDQUFELEtBQU0sQ0FBQyxDQUFDLENBQVIsSUFBYyxJQUFDLENBQUEsQ0FBRCxLQUFNLENBQUMsQ0FBQztJQUE3Qjs7Ozs7O0FBRVgsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuIyAwMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAgIDAwMCAgMDAwICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiMgMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG5jbGFzcyBQb3NpdGlvblxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAoQHg9MCwgQHk9MCkgLT5cbiAgICBcbiAgICBwbHVzOiAgKHMpIC0+IG5ldyBQb3NpdGlvbiBAdytzLncsQGgrcy5oXG4gICAgbWludXM6IChzKSAtPiBuZXcgUG9zaXRpb24gQHctcy53LEBoLXMuaFxuICAgIGVxbDogICAocykgLT4gQHggPT0gcy54IGFuZCBAeSA9PSBzLnlcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IFBvc2l0aW9uXG4iXX0=
//# sourceURL=../../coffee/lib/position.coffee