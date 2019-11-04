// koffee 1.4.0
var Material, Pushable, Stone,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Pushable = require('./pushable');

Material = require('./material');

Stone = (function(superClass) {
    extend(Stone, superClass);

    function Stone(opt) {
        this.slippery = (opt != null ? opt.slippery : void 0) || false;
        this.opacity = opt != null ? opt.opacity : void 0;
        if (opt != null ? opt.color : void 0) {
            if (Array.isArray(opt.color)) {
                this.color = new THREE.Color(opt.color[0], opt.color[1], opt.color[2]);
            } else {
                this.color = opt.color;
            }
        }
        Stone.__super__.constructor.apply(this, arguments);
    }

    Stone.prototype.isSlippery = function() {
        return this.slippery;
    };

    Stone.prototype.createMesh = function() {
        var cube, i, j, k, len, len1, len2, ref, ref1, ref2, x, y, z;
        if (this.slippery) {
            ref = [-1, 1];
            for (i = 0, len = ref.length; i < len; i++) {
                x = ref[i];
                ref1 = [-1, 1];
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                    y = ref1[j];
                    ref2 = [-1, 1];
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                        z = ref2[k];
                        cube = new THREE.BoxGeometry(0.48, 0.48, 0.48);
                        cube.translate(x * 0.25, y * 0.25, z * 0.25);
                        if (!this.geom) {
                            this.geom = cube;
                        } else {
                            this.geom.merge(cube);
                        }
                    }
                }
            }
        } else {
            this.geom = new THREE.BoxBufferGeometry(0.98, 0.98, 0.98);
        }
        this.mat = Material.stone.clone();
        if (this.opacity != null) {
            this.mat.opacity = this.opacity;
        }
        if (this.color != null) {
            this.mat.color.set(this.color);
        }
        this.mesh = new THREE.Mesh(this.geom, this.mat);
        this.mesh.receiveShadow = true;
        return this.mesh.castShadow = true;
    };

    return Stone;

})(Pushable);

module.exports = Stone;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbmUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHlCQUFBO0lBQUE7OztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVXLGVBQUMsR0FBRDtRQUNULElBQUMsQ0FBQSxRQUFELGtCQUFZLEdBQUcsQ0FBRSxrQkFBTCxJQUFpQjtRQUM3QixJQUFDLENBQUEsT0FBRCxpQkFBVyxHQUFHLENBQUU7UUFDaEIsa0JBQUcsR0FBRyxDQUFFLGNBQVI7WUFDSSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBRyxDQUFDLEtBQWxCLENBQUg7Z0JBQ0ksSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFWLENBQWdCLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUExQixFQUE4QixHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBeEMsRUFBNEMsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQXRELEVBRGI7YUFBQSxNQUFBO2dCQUdJLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FBRyxDQUFDLE1BSGpCO2FBREo7O1FBS0Esd0NBQUEsU0FBQTtJQVJTOztvQkFVYixVQUFBLEdBQVksU0FBQTtBQUFHLGVBQU8sSUFBQyxDQUFBO0lBQVg7O29CQUVaLFVBQUEsR0FBWSxTQUFBO0FBQ1IsWUFBQTtRQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7QUFDSTtBQUFBLGlCQUFBLHFDQUFBOztBQUNJO0FBQUEscUJBQUEsd0NBQUE7O0FBQ0k7QUFBQSx5QkFBQSx3Q0FBQTs7d0JBQ0ksSUFBQSxHQUFPLElBQUksS0FBSyxDQUFDLFdBQVYsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEM7d0JBQ1AsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFBLEdBQUksSUFBbkIsRUFBeUIsQ0FBQSxHQUFJLElBQTdCLEVBQW1DLENBQUEsR0FBSSxJQUF2Qzt3QkFDQSxJQUFHLENBQUksSUFBQyxDQUFBLElBQVI7NEJBQ0ksSUFBQyxDQUFBLElBQUQsR0FBUSxLQURaO3lCQUFBLE1BQUE7NEJBR0ksSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixFQUhKOztBQUhKO0FBREo7QUFESixhQURKO1NBQUEsTUFBQTtZQVdJLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FBNEIsSUFBNUIsRUFBaUMsSUFBakMsRUFBc0MsSUFBdEMsRUFYWjs7UUFZQSxJQUFDLENBQUEsR0FBRCxHQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBZixDQUFBO1FBQ1AsSUFBMkIsb0JBQTNCO1lBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLEdBQWUsSUFBQyxDQUFBLFFBQWhCOztRQUNBLElBQXlCLGtCQUF6QjtZQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQVgsQ0FBZSxJQUFDLENBQUEsS0FBaEIsRUFBQTs7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsSUFBaEIsRUFBc0IsSUFBQyxDQUFBLEdBQXZCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO2VBQ3RCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQjtJQWxCWDs7OztHQWRJOztBQWtDcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxuUHVzaGFibGUgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBTdG9uZSBleHRlbmRzIFB1c2hhYmxlXG4gICAgXG4gICAgY29uc3RydWN0b3I6IChvcHQpIC0+XG4gICAgICAgIEBzbGlwcGVyeSA9IG9wdD8uc2xpcHBlcnkgb3IgZmFsc2VcbiAgICAgICAgQG9wYWNpdHkgPSBvcHQ/Lm9wYWNpdHlcbiAgICAgICAgaWYgb3B0Py5jb2xvclxuICAgICAgICAgICAgaWYgQXJyYXkuaXNBcnJheSBvcHQuY29sb3JcbiAgICAgICAgICAgICAgICBAY29sb3IgPSBuZXcgVEhSRUUuQ29sb3Igb3B0LmNvbG9yWzBdLCBvcHQuY29sb3JbMV0sIG9wdC5jb2xvclsyXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBjb2xvciA9IG9wdC5jb2xvciAgICAgICAgICAgICAgICBcbiAgICAgICAgc3VwZXJcblxuICAgIGlzU2xpcHBlcnk6IC0+IHJldHVybiBAc2xpcHBlcnlcbiAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBpZiBAc2xpcHBlcnlcbiAgICAgICAgICAgIGZvciB4IGluIFstMSwxXVxuICAgICAgICAgICAgICAgIGZvciB5IGluIFstMSwxXVxuICAgICAgICAgICAgICAgICAgICBmb3IgeiBpbiBbLTEsMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1YmUgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkgMC40OCwgMC40OCwgMC40OFxuICAgICAgICAgICAgICAgICAgICAgICAgY3ViZS50cmFuc2xhdGUgeCAqIDAuMjUsIHkgKiAwLjI1LCB6ICogMC4yNVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IEBnZW9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGdlb20gPSBjdWJlIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBnZW9tLm1lcmdlIGN1YmVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGdlb20gPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkgMC45OCwwLjk4LDAuOThcbiAgICAgICAgQG1hdCA9IE1hdGVyaWFsLnN0b25lLmNsb25lKClcbiAgICAgICAgQG1hdC5vcGFjaXR5ID0gQG9wYWNpdHkgaWYgQG9wYWNpdHk/XG4gICAgICAgIEBtYXQuY29sb3Iuc2V0IEBjb2xvciBpZiBAY29sb3I/XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggQGdlb20sIEBtYXRcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2guY2FzdFNoYWRvdyA9IHRydWVcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gU3RvbmVcbiJdfQ==
//# sourceURL=../coffee/stone.coffee