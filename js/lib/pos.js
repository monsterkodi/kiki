// koffee 1.4.0
var Pos, Vector;

Vector = require('./vector');

Pos = (function() {
    function Pos(x, y, z) {
        var ref;
        if (x == null) {
            x = 0;
        }
        if (y == null) {
            y = 0;
        }
        if (z == null) {
            z = 0;
        }
        if ((x.x != null) && (x.y != null)) {
            this.x = Math.round(x.x);
            this.y = Math.round(x.y);
            this.z = Math.round((ref = x.z) != null ? ref : 0);
        } else if (Array.isArray(x)) {
            this.x = Math.floor(x[0]);
            this.y = Math.floor(x[1]);
            this.z = Math.floor(x[2]);
        } else {
            this.x = Math.floor(x);
            this.y = Math.floor(y);
            this.z = Math.floor(z);
        }
        if (Number.isNaN(this.x)) {
            throw new Error;
        }
    }

    Pos.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    Pos.prototype.vector = function() {
        return new Vector(this.x, this.y, this.z);
    };

    Pos.prototype.minus = function(p) {
        return new Pos(this.x - p.x, this.y - p.y, this.z - p.z);
    };

    Pos.prototype.plus = function(p) {
        return new Pos(this.x + p.x, this.y + p.y, this.z + p.z);
    };

    Pos.prototype.mul = function(f) {
        return new Pos(this.x * f, this.y * f, this.z * f);
    };

    Pos.prototype.div = function(d) {
        return new Pos(Math.floor(this.x / d), Math.floor(this.y / d), Math.floor(this.z / d));
    };

    Pos.prototype.eql = function(p) {
        return this.x === p.x && this.y === p.y && this.z === p.z;
    };

    Pos.prototype.str = function() {
        return this.x + " " + this.y + " " + this.z;
    };

    Pos.prototype.reset = function() {
        this.x = this.y = this.z = 0;
        return this;
    };

    Pos.prototype.add = function(p) {
        this.x = Math.round(this.x + p.x);
        this.y = Math.round(this.y + p.y);
        this.z = Math.round(this.z + p.z);
        return this;
    };

    Pos.prototype.sub = function(p) {
        this.x = Math.round(this.x - p.x);
        this.y = Math.round(this.y - p.y);
        this.z = Math.round(this.z - p.z);
        return this;
    };

    return Pos;

})();

module.exports = Pos;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQTs7QUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7SUFFVyxhQUFDLENBQUQsRUFBTSxDQUFOLEVBQVcsQ0FBWDtBQUVULFlBQUE7O1lBRlUsSUFBRTs7O1lBQUcsSUFBRTs7O1lBQUcsSUFBRTs7UUFFdEIsSUFBRyxhQUFBLElBQVMsYUFBWjtZQUNJLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBYjtZQUNMLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBYjtZQUNMLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsNkJBQWlCLENBQWpCLEVBSFQ7U0FBQSxNQUlLLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBQUg7WUFDRCxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBRSxDQUFBLENBQUEsQ0FBYjtZQUNMLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFFLENBQUEsQ0FBQSxDQUFiO1lBQ0wsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUUsQ0FBQSxDQUFBLENBQWIsRUFISjtTQUFBLE1BQUE7WUFLRCxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWDtZQUNMLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYO1lBQ0wsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsRUFQSjs7UUFTTCxJQUFHLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBQyxDQUFBLENBQWQsQ0FBSDtBQUNJLGtCQUFNLElBQUksTUFEZDs7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TCxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLENBQUQsR0FBSyxDQUFDLENBQUMsQ0FBbEI7ZUFDTDtJQUpDOzs7Ozs7QUFNVCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAgIDAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwIFxuIyAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAgIDAwMFxuIyAgIDAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwIFxuXG5WZWN0b3IgPSByZXF1aXJlICcuL3ZlY3RvcidcblxuY2xhc3MgUG9zXG5cbiAgICBjb25zdHJ1Y3RvcjogKHg9MCwgeT0wLCB6PTApIC0+XG4gICAgICAgIFxuICAgICAgICBpZiB4Lng/IGFuZCB4Lnk/XG4gICAgICAgICAgICBAeCA9IE1hdGgucm91bmQgeC54XG4gICAgICAgICAgICBAeSA9IE1hdGgucm91bmQgeC55XG4gICAgICAgICAgICBAeiA9IE1hdGgucm91bmQgeC56ID8gMFxuICAgICAgICBlbHNlIGlmIEFycmF5LmlzQXJyYXkgeFxuICAgICAgICAgICAgQHggPSBNYXRoLmZsb29yIHhbMF1cbiAgICAgICAgICAgIEB5ID0gTWF0aC5mbG9vciB4WzFdXG4gICAgICAgICAgICBAeiA9IE1hdGguZmxvb3IgeFsyXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAeCA9IE1hdGguZmxvb3IgeFxuICAgICAgICAgICAgQHkgPSBNYXRoLmZsb29yIHlcbiAgICAgICAgICAgIEB6ID0gTWF0aC5mbG9vciB6XG4gICAgICAgICMgbG9nIFwiUG9zICN7QHh9ICN7QHl9ICN7QHp9XCJcbiAgICAgICAgaWYgTnVtYmVyLmlzTmFOIEB4XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JcblxuICAgIGxlbmd0aDogICAgLT4gTWF0aC5zcXJ0IEB4KkB4ICsgQHkqQHkgKyBAeipAelxuICAgIHZlY3RvcjogICAgLT4gbmV3IFZlY3RvciBAeCwgQHksIEB6IFxuICAgIG1pbnVzOiAocCkgLT4gbmV3IFBvcyBAeC1wLngsIEB5LXAueSwgQHotcC56XG4gICAgcGx1czogIChwKSAtPiBuZXcgUG9zIEB4K3AueCwgQHkrcC55LCBAeitwLnpcbiAgICBtdWw6ICAgKGYpIC0+IG5ldyBQb3MgQHgqZiwgQHkqZiwgQHoqZlxuICAgIGRpdjogICAoZCkgLT4gbmV3IFBvcyBNYXRoLmZsb29yKEB4L2QpLCBNYXRoLmZsb29yKEB5L2QpLCBNYXRoLmZsb29yKEB6L2QpXG4gICAgZXFsOiAgIChwKSAtPiBAeD09cC54IGFuZCBAeT09cC55IGFuZCBAej09cC56XG4gICAgc3RyOiAgICAgICAtPiBcIiN7QHh9ICN7QHl9ICN7QHp9XCJcblxuICAgIHJlc2V0OiAtPiBcbiAgICAgICAgQHggPSBAeSA9IEB6ID0gMFxuICAgICAgICBAXG4gICAgXG4gICAgYWRkOiAocCkgLT4gXG4gICAgICAgIEB4ID0gTWF0aC5yb3VuZCBAeCArIHAueCBcbiAgICAgICAgQHkgPSBNYXRoLnJvdW5kIEB5ICsgcC55IFxuICAgICAgICBAeiA9IE1hdGgucm91bmQgQHogKyBwLnpcbiAgICAgICAgQFxuICAgICAgICBcbiAgICBzdWI6IChwKSAtPiBcbiAgICAgICAgQHggPSBNYXRoLnJvdW5kIEB4IC0gcC54IFxuICAgICAgICBAeSA9IE1hdGgucm91bmQgQHkgLSBwLnkgXG4gICAgICAgIEB6ID0gTWF0aC5yb3VuZCBAeiAtIHAuelxuICAgICAgICBAXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zXG4iXX0=
//# sourceURL=../../coffee/lib/pos.coffee