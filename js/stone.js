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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbmUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHlCQUFBO0lBQUE7OztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVDLGVBQUMsR0FBRDtRQUNDLElBQUMsQ0FBQSxRQUFELGtCQUFZLEdBQUcsQ0FBRSxrQkFBTCxJQUFpQjtRQUM3QixJQUFDLENBQUEsT0FBRCxpQkFBVyxHQUFHLENBQUU7UUFDaEIsa0JBQUcsR0FBRyxDQUFFLGNBQVI7WUFDSSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBRyxDQUFDLEtBQWxCLENBQUg7Z0JBQ0ksSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFWLENBQWdCLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUExQixFQUE4QixHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBeEMsRUFBNEMsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQXRELEVBRGI7YUFBQSxNQUFBO2dCQUdJLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FBRyxDQUFDLE1BSGpCO2FBREo7O1FBS0Esd0NBQUEsU0FBQTtJQVJEOztvQkFVSCxVQUFBLEdBQVksU0FBQTtBQUFHLGVBQU8sSUFBQyxDQUFBO0lBQVg7O29CQUVaLFVBQUEsR0FBWSxTQUFBO0FBQ1IsWUFBQTtRQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7QUFDSTtBQUFBLGlCQUFBLHFDQUFBOztBQUNJO0FBQUEscUJBQUEsd0NBQUE7O0FBQ0k7QUFBQSx5QkFBQSx3Q0FBQTs7d0JBQ0ksSUFBQSxHQUFPLElBQUksS0FBSyxDQUFDLFdBQVYsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEM7d0JBQ1AsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFBLEdBQUksSUFBbkIsRUFBeUIsQ0FBQSxHQUFJLElBQTdCLEVBQW1DLENBQUEsR0FBSSxJQUF2Qzt3QkFDQSxJQUFHLENBQUksSUFBQyxDQUFBLElBQVI7NEJBQ0ksSUFBQyxDQUFBLElBQUQsR0FBUSxLQURaO3lCQUFBLE1BQUE7NEJBR0ksSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixFQUhKOztBQUhKO0FBREo7QUFESixhQURKO1NBQUEsTUFBQTtZQVdJLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FBNEIsSUFBNUIsRUFBaUMsSUFBakMsRUFBc0MsSUFBdEMsRUFYWjs7UUFZQSxJQUFDLENBQUEsR0FBRCxHQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBZixDQUFBO1FBQ1AsSUFBMkIsb0JBQTNCO1lBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLEdBQWUsSUFBQyxDQUFBLFFBQWhCOztRQUNBLElBQXlCLGtCQUF6QjtZQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQVgsQ0FBZSxJQUFDLENBQUEsS0FBaEIsRUFBQTs7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsSUFBaEIsRUFBc0IsSUFBQyxDQUFBLEdBQXZCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO2VBQ3RCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQjtJQWxCWDs7OztHQWRJOztBQWtDcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwICAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxuUHVzaGFibGUgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBTdG9uZSBleHRlbmRzIFB1c2hhYmxlXG4gICAgXG4gICAgQDogKG9wdCkgLT5cbiAgICAgICAgQHNsaXBwZXJ5ID0gb3B0Py5zbGlwcGVyeSBvciBmYWxzZVxuICAgICAgICBAb3BhY2l0eSA9IG9wdD8ub3BhY2l0eVxuICAgICAgICBpZiBvcHQ/LmNvbG9yXG4gICAgICAgICAgICBpZiBBcnJheS5pc0FycmF5IG9wdC5jb2xvclxuICAgICAgICAgICAgICAgIEBjb2xvciA9IG5ldyBUSFJFRS5Db2xvciBvcHQuY29sb3JbMF0sIG9wdC5jb2xvclsxXSwgb3B0LmNvbG9yWzJdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGNvbG9yID0gb3B0LmNvbG9yICAgICAgICAgICAgICAgIFxuICAgICAgICBzdXBlclxuXG4gICAgaXNTbGlwcGVyeTogLT4gcmV0dXJuIEBzbGlwcGVyeVxuICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIGlmIEBzbGlwcGVyeVxuICAgICAgICAgICAgZm9yIHggaW4gWy0xLDFdXG4gICAgICAgICAgICAgICAgZm9yIHkgaW4gWy0xLDFdXG4gICAgICAgICAgICAgICAgICAgIGZvciB6IGluIFstMSwxXVxuICAgICAgICAgICAgICAgICAgICAgICAgY3ViZSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSAwLjQ4LCAwLjQ4LCAwLjQ4XG4gICAgICAgICAgICAgICAgICAgICAgICBjdWJlLnRyYW5zbGF0ZSB4ICogMC4yNSwgeSAqIDAuMjUsIHogKiAwLjI1XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQGdlb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZ2VvbSA9IGN1YmUgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGdlb20ubWVyZ2UgY3ViZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZ2VvbSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSAwLjk4LDAuOTgsMC45OFxuICAgICAgICBAbWF0ID0gTWF0ZXJpYWwuc3RvbmUuY2xvbmUoKVxuICAgICAgICBAbWF0Lm9wYWNpdHkgPSBAb3BhY2l0eSBpZiBAb3BhY2l0eT9cbiAgICAgICAgQG1hdC5jb2xvci5zZXQgQGNvbG9yIGlmIEBjb2xvcj9cbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBAZ2VvbSwgQG1hdFxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBTdG9uZVxuIl19
//# sourceURL=../coffee/stone.coffee