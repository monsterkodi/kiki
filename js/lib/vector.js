// koffee 1.4.0
var Vector;

Vector = (function() {
    function Vector(x, y, z, w) {
        var ref, ref1;
        if (x == null) {
            x = 0;
        }
        if (y == null) {
            y = 0;
        }
        if (z == null) {
            z = 0;
        }
        if (w == null) {
            w = 0;
        }
        if ((x.x != null) && (x.y != null)) {
            this.copy(x);
        } else if (Array.isArray(x)) {
            this.x = x[0];
            this.y = x[1];
            this.z = (ref = x[2]) != null ? ref : 0;
            this.w = (ref1 = x[3]) != null ? ref1 : 0;
        } else {
            this.x = x;
            this.y = y;
            this.z = z != null ? z : 0;
            this.w = w != null ? w : 0;
        }
        if (Number.isNaN(this.x || Number.isNaN(this.w))) {
            throw new Error;
        }
    }

    Vector.prototype.threeVector = function() {
        return new THREE.Vector3(this.x, this.y, this.z);
    };

    Vector.prototype.clone = function() {
        return new Vector(this);
    };

    Vector.prototype.copy = function(v) {
        var ref, ref1;
        this.x = v.x;
        this.y = v.y;
        this.z = (ref = v.z) != null ? ref : 0;
        this.w = (ref1 = v.w) != null ? ref1 : 0;
        return this;
    };

    Vector.prototype.normal = function() {
        return new Vector(this).normalize();
    };

    Vector.prototype.parallel = function(n) {
        var dot;
        dot = this.x * n.x + this.y * n.y + this.z * n.z;
        return new Vector(dot * n.x, dot * n.y, dot * n.z);
    };

    Vector.prototype.perpendicular = function(n) {
        var dot;
        dot = this.x * n.x + this.y * n.y + this.z * n.z;
        return new Vector(this.x - dot * n.x, this.y - dot * n.y, this.z - dot * n.z);
    };

    Vector.prototype.reflect = function(n) {
        var dot;
        dot = 2 * (this.x * n.x + this.y * n.y + this.z * n.z);
        return new Vector(this.x - dot * n.x, this.y - dot * n.y, this.z - dot * n.z);
    };

    Vector.prototype.cross = function(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    };

    Vector.prototype.normalize = function() {
        var l;
        l = this.length();
        if (l) {
            l = 1.0 / l;
            this.x *= l;
            this.y *= l;
            this.z *= l;
            this.w *= l;
        }
        return this;
    };

    Vector.prototype.xyperp = function() {
        return new Vector(-this.y, this.x);
    };

    Vector.prototype.round = function() {
        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z), this.w);
    };

    Vector.prototype.xyangle = function(v) {
        var otherXY, thisXY;
        thisXY = new Vector(this.x, this.y).normal();
        otherXY = new Vector(v.x, v.y).normal();
        if (thisXY.xyperp().dot(otherXY >= 0)) {
            return Vector.RAD2DEG(Math.acos(thisXY.dot(otherXY)));
        }
        return -Vector.RAD2DEG(Math.acos(thisXY.dot(otherXY)));
    };

    Vector.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };

    Vector.prototype.angle = function(v) {
        return Vector.RAD2DEG(Math.acos(this.normal().dot(v.normal())));
    };

    Vector.prototype.dot = function(v) {
        var ref;
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * ((ref = v.w) != null ? ref : 0);
    };

    Vector.prototype.mul = function(f) {
        return new Vector(this.x * f, this.y * f, this.z * f, this.w * f);
    };

    Vector.prototype.div = function(d) {
        return new Vector(this.x / d, this.y / d, this.z / d, this.w / d);
    };

    Vector.prototype.plus = function(v) {
        return new Vector(v).add(this);
    };

    Vector.prototype.minus = function(v) {
        return new Vector(v).neg().add(this);
    };

    Vector.prototype.to = function(v) {
        return new Vector(this).neg().add(v);
    };

    Vector.prototype.neg = function() {
        return new Vector(-this.x, -this.y, -this.z, -this.w);
    };

    Vector.prototype.add = function(v) {
        var ref, ref1;
        this.x += v.x;
        this.y += v.y;
        this.z += (ref = v.z) != null ? ref : 0;
        this.w += (ref1 = v.w) != null ? ref1 : 0;
        return this;
    };

    Vector.prototype.sub = function(v) {
        var ref, ref1;
        this.x -= v.x;
        this.y -= v.y;
        this.z -= (ref = v.z) != null ? ref : 0;
        this.w -= (ref1 = v.w) != null ? ref1 : 0;
        return this;
    };

    Vector.prototype.scale = function(f) {
        this.x *= f;
        this.y *= f;
        this.z *= f;
        this.w *= f;
        return this;
    };

    Vector.prototype.reset = function() {
        this.x = this.y = this.z = this.w = 0;
        return this;
    };

    Vector.prototype.isZero = function() {
        var ref, ref1, ref2;
        return (((this.x === (ref2 = this.y) && ref2 === (ref1 = this.z)) && ref1 === (ref = this.w)) && ref === 0);
    };

    Vector.rayPlaneIntersection = function(rayPos, rayDirection, planePos, planeNormal) {
        var x;
        x = planePos.minus(rayPos).dot(planeNormal) / rayDirection.dot(planeNormal);
        return rayPos.plus(rayDirection.mul(x));
    };

    Vector.pointMappedToPlane = function(point, planePos, planeNormal) {
        return point.minus(planeNormal).dot(point.minus(planePos).dot(planeNormal));
    };

    Vector.rayPlaneIntersectionFactor = function(rayPos, rayDir, planePos, planeNormal) {
        var r, rayDot;
        rayDot = rayDir.dot(planeNormal);
        if (Number.isNaN(rayDot)) {
            throw new Error;
        }
        if (rayDot === 0) {
            return 2;
        }
        r = planePos.minus(rayPos).dot(planeNormal) / rayDot;
        if (Number.isNaN(r)) {
            console.log('rayPos', rayPos);
            console.log('rayDir', rayDir);
            console.log('planePos', planePos);
            console.log('planeNormal', planeNormal);
            throw new Error;
        }
        return r;
    };

    Vector.DEG2RAD = function(d) {
        return Math.PI * d / 180.0;
    };

    Vector.RAD2DEG = function(r) {
        return r * 180.0 / Math.PI;
    };

    Vector.unitX = new Vector(1, 0, 0);

    Vector.unitY = new Vector(0, 1, 0);

    Vector.unitZ = new Vector(0, 0, 1);

    Vector.minusX = new Vector(-1, 0, 0);

    Vector.minusY = new Vector(0, -1, 0);

    Vector.minusZ = new Vector(0, 0, -1);

    Vector.X = 0;

    Vector.Y = 1;

    Vector.Z = 2;

    Vector.W = 3;

    Vector.SX = 0;

    Vector.SY = 5;

    Vector.SZ = 10;

    Vector.TX = 12;

    Vector.TY = 13;

    Vector.TZ = 14;

    return Vector;

})();

module.exports = Vector;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVjdG9yLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQTs7QUFBTTtJQUVDLGdCQUFDLENBQUQsRUFBSyxDQUFMLEVBQVMsQ0FBVCxFQUFhLENBQWI7QUFFQyxZQUFBOztZQUZBLElBQUU7OztZQUFFLElBQUU7OztZQUFFLElBQUU7OztZQUFFLElBQUU7O1FBRWQsSUFBRyxhQUFBLElBQVMsYUFBWjtZQUNJLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBTixFQURKO1NBQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxDQUFIO1lBQ0QsSUFBQyxDQUFBLENBQUQsR0FBSyxDQUFFLENBQUEsQ0FBQTtZQUNQLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBRSxDQUFBLENBQUE7WUFDUCxJQUFDLENBQUEsQ0FBRCxnQ0FBWTtZQUNaLElBQUMsQ0FBQSxDQUFELGtDQUFZLEVBSlg7U0FBQSxNQUFBO1lBTUQsSUFBQyxDQUFBLENBQUQsR0FBSztZQUNMLElBQUMsQ0FBQSxDQUFELEdBQUs7WUFDTCxJQUFDLENBQUEsQ0FBRCxlQUFLLElBQUk7WUFDVCxJQUFDLENBQUEsQ0FBRCxlQUFLLElBQUksRUFUUjs7UUFVTCxJQUFHLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBQyxDQUFBLENBQUQsSUFBTSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQUMsQ0FBQSxDQUFkLENBQW5CLENBQUg7QUFDSSxrQkFBTSxJQUFJLE1BRGQ7O0lBZEQ7O3FCQWlCSCxXQUFBLEdBQWEsU0FBQTtlQUFHLElBQUksS0FBSyxDQUFDLE9BQVYsQ0FBa0IsSUFBQyxDQUFBLENBQW5CLEVBQXNCLElBQUMsQ0FBQSxDQUF2QixFQUEwQixJQUFDLENBQUEsQ0FBM0I7SUFBSDs7cUJBQ2IsS0FBQSxHQUFPLFNBQUE7ZUFBRyxJQUFJLE1BQUosQ0FBVyxJQUFYO0lBQUg7O3FCQUNQLElBQUEsR0FBTSxTQUFDLENBQUQ7QUFD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R0FBTTs7SUFDTixNQUFDLENBQUEsRUFBRCxHQUFNOztJQUNOLE1BQUMsQ0FBQSxFQUFELEdBQU07O0lBQ04sTUFBQyxDQUFBLEVBQUQsR0FBTTs7SUFDTixNQUFDLENBQUEsRUFBRCxHQUFNOzs7Ozs7QUFFVixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAgICAgIDAgICAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuY2xhc3MgVmVjdG9yXG5cbiAgICBAOiAoeD0wLHk9MCx6PTAsdz0wKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgeC54PyBhbmQgeC55P1xuICAgICAgICAgICAgQGNvcHkgeFxuICAgICAgICBlbHNlIGlmIEFycmF5LmlzQXJyYXkgeFxuICAgICAgICAgICAgQHggPSB4WzBdXG4gICAgICAgICAgICBAeSA9IHhbMV1cbiAgICAgICAgICAgIEB6ID0geFsyXSA/IDBcbiAgICAgICAgICAgIEB3ID0geFszXSA/IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHggPSB4XG4gICAgICAgICAgICBAeSA9IHlcbiAgICAgICAgICAgIEB6ID0geiA/IDBcbiAgICAgICAgICAgIEB3ID0gdyA/IDBcbiAgICAgICAgaWYgTnVtYmVyLmlzTmFOIEB4IG9yIE51bWJlci5pc05hTiBAd1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgICAgXG4gICAgdGhyZWVWZWN0b3I6IC0+IG5ldyBUSFJFRS5WZWN0b3IzIEB4LCBAeSwgQHpcbiAgICBjbG9uZTogLT4gbmV3IFZlY3RvciBAXG4gICAgY29weTogKHYpIC0+IFxuICAgICAgICBAeCA9IHYueFxuICAgICAgICBAeSA9IHYueSBcbiAgICAgICAgQHogPSB2LnogPyAwXG4gICAgICAgIEB3ID0gdi53ID8gMFxuICAgICAgICBAXG5cbiAgICBub3JtYWw6IC0+IG5ldyBWZWN0b3IoQCkubm9ybWFsaXplKClcbiAgICBcbiAgICBwYXJhbGxlbDogKG4pIC0+XG4gICAgICAgIGRvdCA9IEB4Km4ueCArIEB5Km4ueSArIEB6Km4uelxuICAgICAgICBuZXcgVmVjdG9yIGRvdCpuLngsIGRvdCpuLnksIGRvdCpuLnpcblxuICAgICMgcmV0dXJucyB0aGUgcHJvamVjdGlvbiBvZiBub3JtYWxpemVkIHZlY3RvciBuIHRvIHZlY3RvciB0aGF0IGlzIHBlcnBlbmRpY3VsYXIgdG8gdGhpc1xuICAgIHBlcnBlbmRpY3VsYXI6IChuKSAtPlxuICAgICAgICBkb3QgPSBAeCpuLnggKyBAeSpuLnkgKyBAeipuLnpcbiAgICAgICAgbmV3IFZlY3RvciBAeC1kb3Qqbi54LCBAeS1kb3Qqbi55LCBAei1kb3Qqbi56IFxuXG4gICAgcmVmbGVjdDogKG4pIC0+XG4gICAgICAgIGRvdCA9IDIqKEB4Km4ueCArIEB5Km4ueSArIEB6Km4ueilcbiAgICAgICAgbmV3IFZlY3RvciBAeC1kb3Qqbi54LCBAeS1kb3Qqbi55LCBAei1kb3Qqbi56XG5cbiAgICBjcm9zczogKHYpIC0+IG5ldyBWZWN0b3IgQHkqdi56LUB6KnYueSwgQHoqdi54LUB4KnYueiwgQHgqdi55LUB5KnYueFxuICAgIG5vcm1hbGl6ZTogLT5cbiAgICAgICAgbCA9IEBsZW5ndGgoKVxuICAgICAgICBpZiBsXG4gICAgICAgICAgICBsID0gMS4wL2xcbiAgICAgICAgICAgIEB4ICo9IGxcbiAgICAgICAgICAgIEB5ICo9IGxcbiAgICAgICAgICAgIEB6ICo9IGxcbiAgICAgICAgICAgIEB3ICo9IGxcbiAgICAgICAgQCAgICBcblxuICAgIHh5cGVycDogLT4gbmV3IFZlY3RvciAtQHksIEB4XG4gICAgcm91bmQ6ICAtPiBuZXcgVmVjdG9yIE1hdGgucm91bmQoQHgpLCBNYXRoLnJvdW5kKEB5KSwgTWF0aC5yb3VuZChAeiksIEB3XG5cbiAgICB4eWFuZ2xlOiAodikgLT5cbiAgICAgICAgdGhpc1hZICA9IG5ldyBWZWN0b3IoQHgsIEB5KS5ub3JtYWwoKVxuICAgICAgICBvdGhlclhZID0gbmV3IFZlY3Rvcih2LngsIHYueSkubm9ybWFsKClcbiAgICAgICAgaWYgdGhpc1hZLnh5cGVycCgpLmRvdCBvdGhlclhZID49IDAgXG4gICAgICAgICAgICByZXR1cm4gVmVjdG9yLlJBRDJERUcoTWF0aC5hY29zKHRoaXNYWS5kb3Qgb3RoZXJYWSkpXG4gICAgICAgIC1WZWN0b3IuUkFEMkRFRyhNYXRoLmFjb3ModGhpc1hZLmRvdCBvdGhlclhZKSlcblxuICAgIGxlbmd0aDogICAgLT4gTWF0aC5zcXJ0IEB4KkB4K0B5KkB5K0B6KkB6K0B3KkB3XG4gICAgYW5nbGU6ICh2KSAtPiBWZWN0b3IuUkFEMkRFRyBNYXRoLmFjb3MgQG5vcm1hbCgpLmRvdCB2Lm5vcm1hbCgpXG4gICAgZG90OiAgICh2KSAtPiBAeCp2LnggKyBAeSp2LnkgKyBAeip2LnogKyBAdyoodi53ID8gMClcbiAgICBcbiAgICBtdWw6ICAgKGYpIC0+IG5ldyBWZWN0b3IgQHgqZiwgQHkqZiwgQHoqZiwgQHcqZlxuICAgIGRpdjogICAoZCkgLT4gbmV3IFZlY3RvciBAeC9kLCBAeS9kLCBAei9kLCBAdy9kXG4gICAgcGx1czogICh2KSAtPiBuZXcgVmVjdG9yKHYpLmFkZCBAXG4gICAgbWludXM6ICh2KSAtPiBuZXcgVmVjdG9yKHYpLm5lZygpLmFkZCBAXG4gICAgdG86ICAgICh2KSAtPiBuZXcgVmVjdG9yKEApLm5lZygpLmFkZCB2XG4gICAgbmVnOiAgICAgICAtPiBuZXcgVmVjdG9yIC1AeCwgLUB5LCAtQHosIC1Ad1xuICAgICBcbiAgICBhZGQ6ICh2KSAtPlxuICAgICAgICBAeCArPSB2LnggXG4gICAgICAgIEB5ICs9IHYueSBcbiAgICAgICAgQHogKz0gdi56ID8gMFxuICAgICAgICBAdyArPSB2LncgPyAwXG4gICAgICAgIEBcbiAgICBcbiAgICBzdWI6ICh2KSAtPlxuICAgICAgICBAeCAtPSB2LnggXG4gICAgICAgIEB5IC09IHYueSBcbiAgICAgICAgQHogLT0gdi56ID8gMFxuICAgICAgICBAdyAtPSB2LncgPyAwXG4gICAgICAgIEBcbiAgICBcbiAgICBzY2FsZTogKGYpIC0+XG4gICAgICAgIEB4ICo9IGZcbiAgICAgICAgQHkgKj0gZlxuICAgICAgICBAeiAqPSBmXG4gICAgICAgIEB3ICo9IGZcbiAgICAgICAgQFxuICAgICAgICBcbiAgICByZXNldDogLT5cbiAgICAgICAgQHggPSBAeSA9IEB6ID0gQHcgPSAwXG4gICAgICAgIEBcbiAgICBcbiAgICBpc1plcm86IC0+IEB4ID09IEB5ID09IEB6ID09IEB3ID09IDBcblxuICAgIEByYXlQbGFuZUludGVyc2VjdGlvbjogKHJheVBvcywgcmF5RGlyZWN0aW9uLCBwbGFuZVBvcywgcGxhbmVOb3JtYWwpIC0+XG4gICAgICAgIHggPSBwbGFuZVBvcy5taW51cyhyYXlQb3MpLmRvdChwbGFuZU5vcm1hbCkgLyByYXlEaXJlY3Rpb24uZG90KHBsYW5lTm9ybWFsKVxuICAgICAgICByZXR1cm4gcmF5UG9zLnBsdXMgcmF5RGlyZWN0aW9uLm11bCB4XG5cbiAgICBAcG9pbnRNYXBwZWRUb1BsYW5lOiAocG9pbnQsIHBsYW5lUG9zLCBwbGFuZU5vcm1hbCkgLT5cbiAgICAgICAgcG9pbnQubWludXMocGxhbmVOb3JtYWwpLmRvdCBwb2ludC5taW51cyhwbGFuZVBvcykuZG90KHBsYW5lTm9ybWFsKVxuXG4gICAgQHJheVBsYW5lSW50ZXJzZWN0aW9uRmFjdG9yOiAocmF5UG9zLCByYXlEaXIsIHBsYW5lUG9zLCBwbGFuZU5vcm1hbCkgLT5cbiAgICAgICAgcmF5RG90ID0gcmF5RGlyLmRvdCBwbGFuZU5vcm1hbFxuICAgICAgICBpZiBOdW1iZXIuaXNOYU4gcmF5RG90XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JcbiAgICAgICAgcmV0dXJuIDIgaWYgcmF5RG90ID09IDBcbiAgICAgICAgciA9IHBsYW5lUG9zLm1pbnVzKHJheVBvcykuZG90KHBsYW5lTm9ybWFsKSAvIHJheURvdFxuICAgICAgICBpZiBOdW1iZXIuaXNOYU4gclxuICAgICAgICAgICAgbG9nICdyYXlQb3MnLCByYXlQb3NcbiAgICAgICAgICAgIGxvZyAncmF5RGlyJywgcmF5RGlyXG4gICAgICAgICAgICBsb2cgJ3BsYW5lUG9zJywgcGxhbmVQb3NcbiAgICAgICAgICAgIGxvZyAncGxhbmVOb3JtYWwnLCBwbGFuZU5vcm1hbFxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIHJcblxuICAgIEBERUcyUkFEOiAoZCkgLT4gTWF0aC5QSSpkLzE4MC4wXG4gICAgQFJBRDJERUc6IChyKSAtPiByKjE4MC4wL01hdGguUElcbiAgICBcbiAgICBAdW5pdFggID0gbmV3IFZlY3RvciAxLDAsMFxuICAgIEB1bml0WSAgPSBuZXcgVmVjdG9yIDAsMSwwXG4gICAgQHVuaXRaICA9IG5ldyBWZWN0b3IgMCwwLDFcbiAgICBAbWludXNYID0gbmV3IFZlY3RvciAtMSwwLDBcbiAgICBAbWludXNZID0gbmV3IFZlY3RvciAwLC0xLDBcbiAgICBAbWludXNaID0gbmV3IFZlY3RvciAwLDAsLTFcbiAgICBcbiAgICBAWCAgPSAwXG4gICAgQFkgID0gMVxuICAgIEBaICA9IDJcbiAgICBAVyAgPSAzXG4gICAgQFNYID0gMFxuICAgIEBTWSA9IDVcbiAgICBAU1ogPSAxMFxuICAgIEBUWCA9IDEyXG4gICAgQFRZID0gMTNcbiAgICBAVFogPSAxNFxuXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvciJdfQ==
//# sourceURL=../../coffee/lib/vector.coffee