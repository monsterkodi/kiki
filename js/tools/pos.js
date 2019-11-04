// koffee 1.4.0
var Pos,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Pos = (function() {
    function Pos(x1, y1) {
        this.x = x1;
        this.y = y1;
        this.clamp = bind(this.clamp, this);
        this.sub = bind(this.sub, this);
        this.add = bind(this.add, this);
        this.mul = bind(this.mul, this);
        this.scale = bind(this.scale, this);
        this._str = bind(this._str, this);
        this.check = bind(this.check, this);
        this.notSame = bind(this.notSame, this);
        this.same = bind(this.same, this);
        this.dist = bind(this.dist, this);
        this.distSquare = bind(this.distSquare, this);
        this.square = bind(this.square, this);
        this.length = bind(this.length, this);
        this.max = bind(this.max, this);
        this.min = bind(this.min, this);
        this.mid = bind(this.mid, this);
        this.to = bind(this.to, this);
        this.clamped = bind(this.clamped, this);
        this.times = bind(this.times, this);
        this.minus = bind(this.minus, this);
        this.plus = bind(this.plus, this);
        this.copy = bind(this.copy, this);
    }

    Pos.prototype.copy = function() {
        return new Pos(this.x, this.y);
    };

    Pos.prototype.plus = function(val) {
        var newPos;
        newPos = this.copy();
        if (val != null) {
            if (!isNaN(val.x)) {
                newPos.x += val.x;
            }
            if (!isNaN(val.y)) {
                newPos.y += val.y;
            }
        }
        return newPos;
    };

    Pos.prototype.minus = function(val) {
        var newPos;
        newPos = this.copy();
        if (val != null) {
            if (!isNaN(val.x)) {
                newPos.x -= val.x;
            }
            if (!isNaN(val.y)) {
                newPos.y -= val.y;
            }
        }
        return newPos;
    };

    Pos.prototype.times = function(val) {
        return this.copy().scale(val);
    };

    Pos.prototype.clamped = function(lower, upper) {
        return this.copy().clamp(lower, upper);
    };

    Pos.prototype.to = function(other) {
        return other.minus(this);
    };

    Pos.prototype.mid = function(other) {
        return this.plus(other).scale(0.5);
    };

    Pos.prototype.min = function(val) {
        var newPos;
        newPos = this.copy();
        if (val == null) {
            return newPos;
        }
        if (!isNaN(val.x) && this.x > val.x) {
            newPos.x = val.x;
        }
        if (!isNaN(val.y) && this.y > val.y) {
            newPos.y = val.y;
        }
        return newPos;
    };

    Pos.prototype.max = function(val) {
        var newPos;
        newPos = this.copy();
        if (val == null) {
            return newPos;
        }
        if (!isNaN(val.x) && this.x < val.x) {
            newPos.x = val.x;
        }
        if (!isNaN(val.y) && this.y < val.y) {
            newPos.y = val.y;
        }
        return newPos;
    };

    Pos.prototype.length = function() {
        return Math.sqrt(this.square());
    };

    Pos.prototype.square = function() {
        return (this.x * this.x) + (this.y * this.y);
    };

    Pos.prototype.distSquare = function(o) {
        return this.minus(o).square();
    };

    Pos.prototype.dist = function(o) {
        return Math.sqrt(this.distSquare(o));
    };

    Pos.prototype.same = function(o) {
        return this.x === (o != null ? o.x : void 0) && this.y === (o != null ? o.y : void 0);
    };

    Pos.prototype.notSame = function(o) {
        return this.x !== (o != null ? o.x : void 0) || this.y !== (o != null ? o.y : void 0);
    };

    Pos.prototype.check = function() {
        var newPos;
        newPos = this.copy();
        if (isNaN(newPos.x)) {
            newPos.x = 0;
        }
        if (isNaN(newPos.y)) {
            newPos.y = 0;
        }
        return newPos;
    };

    Pos.prototype._str = function() {
        var s;
        s = (this.x != null ? "<x:" + this.x + " " : void 0) || "<NaN ";
        return s += (this.y != null ? "y:" + this.y + ">" : void 0) || "NaN>";
    };

    Pos.prototype.scale = function(val) {
        this.x *= val;
        this.y *= val;
        return this;
    };

    Pos.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    };

    Pos.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    };

    Pos.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };

    Pos.prototype.clamp = function(lower, upper) {
        var clamp;
        if ((lower != null) && (upper != null)) {
            clamp = require('./tools').clamp;
            this.x = clamp(lower.x, upper.x, this.x);
            this.y = clamp(lower.y, upper.y, this.y);
        }
        return this;
    };

    return Pos;

})();

module.exports = function(x, y) {
    return new Pos(x, y);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxHQUFBO0lBQUE7O0FBQU07SUFFVyxhQUFDLEVBQUQsRUFBSyxFQUFMO1FBQUMsSUFBQyxDQUFBLElBQUQ7UUFBSSxJQUFDLENBQUEsSUFBRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTDs7a0JBRWIsSUFBQSxHQUFNLFNBQUE7ZUFBRyxJQUFJLEdBQUosQ0FBUSxJQUFDLENBQUEsQ0FBVCxFQUFZLElBQUMsQ0FBQSxDQUFiO0lBQUg7O2tCQUVOLElBQUEsR0FBTSxTQUFDLEdBQUQ7QUFDRixZQUFBO1FBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxJQUFELENBQUE7UUFDVCxJQUFHLFdBQUg7WUFDSSxJQUFBLENBQTBCLEtBQUEsQ0FBTSxHQUFHLENBQUMsQ0FBVixDQUExQjtnQkFBQSxNQUFNLENBQUMsQ0FBUCxJQUFZLEdBQUcsQ0FBQyxFQUFoQjs7WUFDQSxJQUFBLENBQTBCLEtBQUEsQ0FBTSxHQUFHLENBQUMsQ0FBVixDQUExQjtnQkFBQSxNQUFNLENBQUMsQ0FBUCxJQUFZLEdBQUcsQ0FBQyxFQUFoQjthQUZKOztlQUdBO0lBTEU7O2tCQU9OLEtBQUEsR0FBTyxTQUFDLEdBQUQ7QUFDSCxZQUFBO1FBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxJQUFELENBQUE7UUFDVCxJQUFHLFdBQUg7WUFDSSxJQUFBLENBQTBCLEtBQUEsQ0FBTSxHQUFHLENBQUMsQ0FBVixDQUExQjtnQkFBQSxNQUFNLENBQUMsQ0FBUCxJQUFZLEdBQUcsQ0FBQyxFQUFoQjs7WUFDQSxJQUFBLENBQTBCLEtBQUEsQ0FBTSxHQUFHLENBQUMsQ0FBVixDQUExQjtnQkFBQSxNQUFNLENBQUMsQ0FBUCxJQUFZLEdBQUcsQ0FBQyxFQUFoQjthQUZKOztlQUdBO0lBTEc7O2tCQU9QLEtBQUEsR0FBTyxTQUFDLEdBQUQ7ZUFBUyxJQUFDLENBQUEsSUFBRCxDQUFB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LEtBQUssQ0FBQyxDQUFaLEVBQWUsS0FBSyxDQUFDLENBQXJCLEVBQXdCLElBQUMsQ0FBQSxDQUF6QixFQUhUOztlQUlBO0lBTEc7Ozs7OztBQU9YLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsQ0FBRCxFQUFHLENBQUg7V0FBUyxJQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVUsQ0FBVjtBQUFUIiwic291cmNlc0NvbnRlbnQiOlsiIzAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMFxuIzAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIzAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwIFxuIzAwMCAgICAgICAgMDAwICAgMDAwICAgICAgIDAwMFxuIzAwMCAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwIFxuXG5jbGFzcyBQb3NcblxuICAgIGNvbnN0cnVjdG9yOiAoQHgsIEB5KSAtPlxuICAgICAgICBcbiAgICBjb3B5OiA9PiBuZXcgUG9zIEB4LCBAeVxuXG4gICAgcGx1czogKHZhbCkgPT5cbiAgICAgICAgbmV3UG9zID0gQGNvcHkoKVxuICAgICAgICBpZiB2YWw/XG4gICAgICAgICAgICBuZXdQb3MueCArPSB2YWwueCAgdW5sZXNzIGlzTmFOKHZhbC54KVxuICAgICAgICAgICAgbmV3UG9zLnkgKz0gdmFsLnkgIHVubGVzcyBpc05hTih2YWwueSlcbiAgICAgICAgbmV3UG9zXG5cbiAgICBtaW51czogKHZhbCkgPT5cbiAgICAgICAgbmV3UG9zID0gQGNvcHkoKVxuICAgICAgICBpZiB2YWw/XG4gICAgICAgICAgICBuZXdQb3MueCAtPSB2YWwueCAgdW5sZXNzIGlzTmFOKHZhbC54KVxuICAgICAgICAgICAgbmV3UG9zLnkgLT0gdmFsLnkgIHVubGVzcyBpc05hTih2YWwueSlcbiAgICAgICAgbmV3UG9zXG4gICAgICAgIFxuICAgIHRpbWVzOiAodmFsKSA9PiBAY29weSgpLnNjYWxlIHZhbFxuICAgICAgICBcbiAgICBjbGFtcGVkOiAobG93ZXIsIHVwcGVyKSA9PiBAY29weSgpLmNsYW1wIGxvd2VyLCB1cHBlclxuICAgICAgICBcbiAgICB0bzogIChvdGhlcikgPT4gb3RoZXIubWludXMgQFxuICAgIG1pZDogKG90aGVyKSA9PiBAcGx1cyhvdGhlcikuc2NhbGUgMC41XG5cbiAgICBtaW46ICh2YWwpID0+XG4gICAgICAgIG5ld1BvcyA9IEBjb3B5KClcbiAgICAgICAgcmV0dXJuIG5ld1BvcyB1bmxlc3MgdmFsP1xuICAgICAgICBuZXdQb3MueCA9IHZhbC54ICBpZiBub3QgaXNOYU4odmFsLngpIGFuZCBAeCA+IHZhbC54XG4gICAgICAgIG5ld1Bvcy55ID0gdmFsLnkgIGlmIG5vdCBpc05hTih2YWwueSkgYW5kIEB5ID4gdmFsLnlcbiAgICAgICAgbmV3UG9zXG5cbiAgICBtYXg6ICh2YWwpID0+XG4gICAgICAgIG5ld1BvcyA9IEBjb3B5KClcbiAgICAgICAgcmV0dXJuIG5ld1BvcyB1bmxlc3MgdmFsP1xuICAgICAgICBuZXdQb3MueCA9IHZhbC54ICBpZiBub3QgaXNOYU4odmFsLngpIGFuZCBAeCA8IHZhbC54XG4gICAgICAgIG5ld1Bvcy55ID0gdmFsLnkgIGlmIG5vdCBpc05hTih2YWwueSkgYW5kIEB5IDwgdmFsLnlcbiAgICAgICAgbmV3UG9zXG5cbiAgICBsZW5ndGg6ICAgICAgICAgPT4gcmV0dXJuIE1hdGguc3FydCBAc3F1YXJlKClcbiAgICBzcXVhcmU6ICAgICAgICAgPT4gKEB4ICogQHgpICsgKEB5ICogQHkpXG4gICAgZGlzdFNxdWFyZTogKG8pID0+IEBtaW51cyhvKS5zcXVhcmUoKVxuICAgIGRpc3Q6ICAgICAgIChvKSA9PiBNYXRoLnNxcnQgQGRpc3RTcXVhcmUobylcbiAgICBzYW1lOiAgICAgICAobykgPT4gQHggPT0gbz8ueCBhbmQgQHkgPT0gbz8ueVxuICAgIG5vdFNhbWU6ICAgIChvKSA9PiBAeCAhPSBvPy54IG9yICBAeSAhPSBvPy55XG5cbiAgICBjaGVjazogPT5cbiAgICAgICAgbmV3UG9zID0gQGNvcHkoKVxuICAgICAgICBuZXdQb3MueCA9IDAgaWYgaXNOYU4obmV3UG9zLngpXG4gICAgICAgIG5ld1Bvcy55ID0gMCBpZiBpc05hTihuZXdQb3MueSlcbiAgICAgICAgbmV3UG9zXG5cbiAgICBfc3RyOiA9PiBcbiAgICAgICAgcyAgPSAoXCI8eDoje0B4fSBcIiBpZiBAeD8pIG9yIFwiPE5hTiBcIlxuICAgICAgICBzICs9IChcInk6I3tAeX0+XCIgaWYgQHk/KSBvciBcIk5hTj5cIlxuXG4gICAgI19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXyBkZXN0cnVjdGl2ZVxuICAgIFxuICAgIHNjYWxlOiAodmFsKSA9PlxuICAgICAgICBAeCAqPSB2YWxcbiAgICAgICAgQHkgKj0gdmFsXG4gICAgICAgIEBcblxuICAgIG11bDogKG90aGVyKSA9PlxuICAgICAgICBAeCAqPSBvdGhlci54XG4gICAgICAgIEB5ICo9IG90aGVyLnlcbiAgICAgICAgQFxuXG4gICAgYWRkOiAob3RoZXIpID0+XG4gICAgICAgIEB4ICs9IG90aGVyLnhcbiAgICAgICAgQHkgKz0gb3RoZXIueVxuICAgICAgICBAXG5cbiAgICBzdWI6IChvdGhlcikgPT5cbiAgICAgICAgQHggLT0gb3RoZXIueFxuICAgICAgICBAeSAtPSBvdGhlci55XG4gICAgICAgIEBcblxuICAgIGNsYW1wOiAobG93ZXIsIHVwcGVyKSA9PlxuICAgICAgICBpZiBsb3dlcj8gYW5kIHVwcGVyP1xuICAgICAgICAgICAge2NsYW1wfSA9IHJlcXVpcmUgJy4vdG9vbHMnXG4gICAgICAgICAgICBAeCA9IGNsYW1wKGxvd2VyLngsIHVwcGVyLngsIEB4KVxuICAgICAgICAgICAgQHkgPSBjbGFtcChsb3dlci55LCB1cHBlci55LCBAeSlcbiAgICAgICAgQFxuXG5tb2R1bGUuZXhwb3J0cyA9ICh4LHkpIC0+IG5ldyBQb3MgeCx5XG4iXX0=
//# sourceURL=../../coffee/tools/pos.coffee