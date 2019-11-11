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

    Stone.prototype.del = function() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        return Stone.__super__.del.apply(this, arguments);
    };

    Stone.prototype.isSlippery = function() {
        return this.slippery;
    };

    Stone.prototype.createMesh = function() {
        var cube, geom, i, j, k, len, len1, len2, mat, ref, ref1, ref2, x, y, z;
        geom = null;
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
                        if (!geom) {
                            geom = cube;
                        } else {
                            geom.merge(cube);
                            cube.dispose();
                        }
                    }
                }
            }
        } else {
            geom = new THREE.BoxBufferGeometry(0.98, 0.98, 0.98);
        }
        mat = Material.stone.clone();
        if (this.opacity != null) {
            mat.opacity = this.opacity;
        }
        if (this.color != null) {
            mat.color.set(this.color);
        }
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.receiveShadow = true;
        return this.mesh.castShadow = true;
    };

    return Stone;

})(Pushable);

module.exports = Stone;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbmUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHlCQUFBO0lBQUE7OztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVDLGVBQUMsR0FBRDtRQUVDLElBQUMsQ0FBQSxRQUFELGtCQUFZLEdBQUcsQ0FBRSxrQkFBTCxJQUFpQjtRQUM3QixJQUFDLENBQUEsT0FBRCxpQkFBVyxHQUFHLENBQUU7UUFDaEIsa0JBQUcsR0FBRyxDQUFFLGNBQVI7WUFDSSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBRyxDQUFDLEtBQWxCLENBQUg7Z0JBQ0ksSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFWLENBQWdCLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUExQixFQUE4QixHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBeEMsRUFBNEMsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQXRELEVBRGI7YUFBQSxNQUFBO2dCQUdJLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FBRyxDQUFDLE1BSGpCO2FBREo7O1FBS0Esd0NBQUEsU0FBQTtJQVREOztvQkFXSCxHQUFBLEdBQUssU0FBQTtRQUVELElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQWYsQ0FBQTtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQWYsQ0FBQTtlQUNBLGdDQUFBLFNBQUE7SUFKQzs7b0JBTUwsVUFBQSxHQUFZLFNBQUE7QUFBRyxlQUFPLElBQUMsQ0FBQTtJQUFYOztvQkFFWixVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxJQUFBLEdBQU87UUFDUCxJQUFHLElBQUMsQ0FBQSxRQUFKO0FBQ0k7QUFBQSxpQkFBQSxxQ0FBQTs7QUFDSTtBQUFBLHFCQUFBLHdDQUFBOztBQUNJO0FBQUEseUJBQUEsd0NBQUE7O3dCQUNJLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxXQUFWLENBQXNCLElBQXRCLEVBQTJCLElBQTNCLEVBQWdDLElBQWhDO3dCQUNQLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBQSxHQUFJLElBQW5CLEVBQXlCLENBQUEsR0FBSSxJQUE3QixFQUFtQyxDQUFBLEdBQUksSUFBdkM7d0JBQ0EsSUFBRyxDQUFJLElBQVA7NEJBQ0ksSUFBQSxHQUFPLEtBRFg7eUJBQUEsTUFBQTs0QkFHSSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7NEJBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBQSxFQUpKOztBQUhKO0FBREo7QUFESixhQURKO1NBQUEsTUFBQTtZQVlJLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxpQkFBVixDQUE0QixJQUE1QixFQUFpQyxJQUFqQyxFQUFzQyxJQUF0QyxFQVpYOztRQWNBLEdBQUEsR0FBTSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQWYsQ0FBQTtRQUNOLElBQTBCLG9CQUExQjtZQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWMsSUFBQyxDQUFBLFFBQWY7O1FBQ0EsSUFBd0Isa0JBQXhCO1lBQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFWLENBQWMsSUFBQyxDQUFBLEtBQWYsRUFBQTs7UUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEdBQXJCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO2VBQ3RCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixHQUFtQjtJQXZCWDs7OztHQXJCSTs7QUE4Q3BCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwIFxuIyAgICAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMCAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwXG5cblB1c2hhYmxlID0gcmVxdWlyZSAnLi9wdXNoYWJsZSdcbk1hdGVyaWFsID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgU3RvbmUgZXh0ZW5kcyBQdXNoYWJsZVxuICAgIFxuICAgIEA6IChvcHQpIC0+XG4gICAgICAgIFxuICAgICAgICBAc2xpcHBlcnkgPSBvcHQ/LnNsaXBwZXJ5IG9yIGZhbHNlXG4gICAgICAgIEBvcGFjaXR5ID0gb3B0Py5vcGFjaXR5XG4gICAgICAgIGlmIG9wdD8uY29sb3JcbiAgICAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkgb3B0LmNvbG9yXG4gICAgICAgICAgICAgICAgQGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yIG9wdC5jb2xvclswXSwgb3B0LmNvbG9yWzFdLCBvcHQuY29sb3JbMl1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAY29sb3IgPSBvcHQuY29sb3IgICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyXG5cbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAbWVzaC5nZW9tZXRyeS5kaXNwb3NlKClcbiAgICAgICAgQG1lc2gubWF0ZXJpYWwuZGlzcG9zZSgpXG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgIGlzU2xpcHBlcnk6IC0+IHJldHVybiBAc2xpcHBlcnlcbiAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgZ2VvbSA9IG51bGxcbiAgICAgICAgaWYgQHNsaXBwZXJ5XG4gICAgICAgICAgICBmb3IgeCBpbiBbLTEsMV1cbiAgICAgICAgICAgICAgICBmb3IgeSBpbiBbLTEsMV1cbiAgICAgICAgICAgICAgICAgICAgZm9yIHogaW4gWy0xLDFdXG4gICAgICAgICAgICAgICAgICAgICAgICBjdWJlID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5IDAuNDggMC40OCAwLjQ4XG4gICAgICAgICAgICAgICAgICAgICAgICBjdWJlLnRyYW5zbGF0ZSB4ICogMC4yNSwgeSAqIDAuMjUsIHogKiAwLjI1XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgZ2VvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb20gPSBjdWJlIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlb20ubWVyZ2UgY3ViZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1YmUuZGlzcG9zZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGdlb20gPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkgMC45OCAwLjk4IDAuOThcbiAgICAgICAgICAgIFxuICAgICAgICBtYXQgPSBNYXRlcmlhbC5zdG9uZS5jbG9uZSgpXG4gICAgICAgIG1hdC5vcGFjaXR5ID0gQG9wYWNpdHkgaWYgQG9wYWNpdHk/XG4gICAgICAgIG1hdC5jb2xvci5zZXQgQGNvbG9yIGlmIEBjb2xvcj9cbiAgICAgICAgXG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgbWF0XG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IFN0b25lXG4iXX0=
//# sourceURL=../coffee/stone.coffee