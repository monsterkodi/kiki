// koffee 1.4.0
var Face, Gate, Geom, Item, Material, Vector, Wire,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Item = require('./item');

Geom = require('./geom');

Face = require('./face');

Gate = require('./gate');

Vector = require('./lib/vector');

Material = require('./material');

Wire = (function(superClass) {
    extend(Wire, superClass);

    Wire.UP = 1;

    Wire.RIGHT = 2;

    Wire.DOWN = 4;

    Wire.LEFT = 8;

    Wire.VERTICAL = 5;

    Wire.HORIZONTAL = 10;

    Wire.ALL = 15;

    function Wire(face, connections) {
        this.face = face != null ? face : Face.Z;
        this.connections = connections != null ? connections : Wire.ALL;
        this.glow = null;
        this.active = false;
        this.value = 1.0;
        Wire.__super__.constructor.apply(this, arguments);
        this.SWITCH_OFF_EVENT = this.addEventWithName("off");
        this.SWITCH_ON_EVENT = this.addEventWithName("on");
        this.SWITCHED_EVENT = this.addEventWithName("switched");
    }

    Wire.prototype.del = function() {
        var ref, ref1;
        if ((ref = this.glow) != null) {
            ref.material.map.dispose();
        }
        if ((ref1 = this.glow) != null) {
            ref1.material.dispose();
        }
        this.mesh.remove(this.glow);
        this.mesh.remove(this.wire);
        this.mesh.geometry.dispose();
        this.wire.geometry.dispose();
        return Wire.__super__.del.apply(this, arguments);
    };

    Wire.prototype.createMesh = function() {
        var geom, h, o, plane, s, w;
        o = 0.005;
        geom = new THREE.Geometry;
        h = 0.1;
        s = 0.5;
        w = s + o;
        if (this.connections & Wire.RIGHT) {
            plane = new THREE.PlaneGeometry(w, h);
            plane.translate(w / 2, 0, -s + o);
            geom.merge(plane);
            plane.dispose();
        }
        if (this.connections & Wire.LEFT) {
            plane = new THREE.PlaneGeometry(w, h);
            plane.translate(-w / 2, 0, -s + o);
            geom.merge(plane);
            plane.dispose();
        }
        if (this.connections & Wire.UP) {
            plane = new THREE.PlaneGeometry(h, w);
            plane.translate(0, w / 2, -s + o);
            geom.merge(plane);
            plane.dispose();
        }
        if (this.connections & Wire.DOWN) {
            plane = new THREE.PlaneGeometry(h, w);
            plane.translate(0, -w / 2, -s + o);
            geom.merge(plane);
            plane.dispose();
        }
        this.wire = new THREE.Mesh(geom, Material.wire);
        this.mesh = new THREE.Mesh(Geom.wire(), Material.wirePlate);
        this.mesh.add(this.wire);
        this.mesh.receiveShadow = true;
        this.mesh.position.copy(Face.normal(this.face).mul(-(0.5 + o)));
        return this.mesh.quaternion.copy(Face.orientation(this.face));
    };

    Wire.prototype.updateActive = function() {
        var j, len, ref, results, wire;
        ref = this.neighborWires();
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            wire = ref[j];
            if (wire.active) {
                results.push(this.setActive(true));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    Wire.prototype.setActive = function(active) {
        var gate, j, len, neighbors, wire;
        if (this.active !== active) {
            this.active = active;
            neighbors = this.neighborWires();
            for (j = 0, len = neighbors.length; j < len; j++) {
                wire = neighbors[j];
                wire.setActive(this.active);
            }
            gate = world.getObjectOfTypeAtPos(Gate, this.getPos());
            if (gate != null) {
                gate.setActive(this.active);
            }
            if (this.active) {
                if (this.glow == null) {
                    this.glow = new THREE.Sprite(Material.glow);
                    this.glow.position.set(0, 0, -0.3);
                    this.glow.scale.set(.5, .5, 1);
                    this.glow.renderOrder = 999;
                    this.mesh.add(this.glow);
                }
            } else if (this.glow != null) {
                this.glow.material.map.dispose();
                this.glow.material.dispose();
                this.mesh.remove(this.glow);
                this.glow = null;
            }
            this.events[this.active && this.SWITCH_ON_EVENT || this.SWITCH_OFF_EVENT].triggerActions();
            return this.events[this.SWITCHED_EVENT].triggerActions();
        }
    };

    Wire.prototype.neighborWires = function() {
        var i, iter, j, k, l, len, len1, len2, m, n, neighbor_dirs, neighbor_point, neighbor_points, neighbors, point, points, ref, rot, wires;
        wires = [];
        points = this.connectionPoints();
        neighbor_dirs = [];
        rot = Face.orientationForFace(this.face);
        n = Face.normalVectorForFace(this.face);
        neighbor_dirs.push(new Vector(0, 0, 0));
        if (this.connections & Wire.RIGHT) {
            neighbor_dirs.push(rot.rotate(new Vector(1, 0, 0)));
            neighbor_dirs.push(rot.rotate(new Vector(1, 0, 0)).minus(n));
        }
        if (this.connections & Wire.LEFT) {
            neighbor_dirs.push(rot.rotate(new Vector(-1, 0, 0)));
            neighbor_dirs.push(rot.rotate(new Vector(-1, 0, 0)).minus(n));
        }
        if (this.connections & Wire.UP) {
            neighbor_dirs.push(rot.rotate(new Vector(0, 1, 0)));
            neighbor_dirs.push(rot.rotate(new Vector(0, 1, 0)).minus(n));
        }
        if (this.connections & Wire.DOWN) {
            neighbor_dirs.push(rot.rotate(new Vector(0, -1, 0)));
            neighbor_dirs.push(rot.rotate(new Vector(0, -1, 0)).minus(n));
        }
        for (i = j = 0, ref = neighbor_dirs.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            neighbors = world.getObjectsOfTypeAtPos(Wire, this.position.plus(neighbor_dirs[i]));
            for (k = 0, len = neighbors.length; k < len; k++) {
                iter = neighbors[k];
                if (iter === this) {
                    continue;
                }
                neighbor_points = iter.connectionPoints();
                for (l = 0, len1 = points.length; l < len1; l++) {
                    point = points[l];
                    for (m = 0, len2 = neighbor_points.length; m < len2; m++) {
                        neighbor_point = neighbor_points[m];
                        if (neighbor_point.minus(point).length() < 0.1) {
                            wires.push(iter);
                        }
                    }
                }
            }
        }
        return wires;
    };

    Wire.prototype.connectionPoints = function() {
        var points, rot, to_border;
        points = [];
        to_border = Face.normal(this.face).mul(-0.5);
        rot = Face.orientation(this.face);
        if (this.connections & Wire.RIGHT) {
            points.push(this.position.plus(to_border.plus(rot.rotate(new Vector(0.5, 0, 0)))));
        }
        if (this.connections & Wire.LEFT) {
            points.push(this.position.plus(to_border.plus(rot.rotate(new Vector(-0.5, 0, 0)))));
        }
        if (this.connections & Wire.UP) {
            points.push(this.position.plus(to_border.plus(rot.rotate(new Vector(0, 0.5, 0)))));
        }
        if (this.connections & Wire.DOWN) {
            points.push(this.position.plus(to_border.plus(rot.rotate(new Vector(0, -0.5, 0)))));
        }
        return points;
    };

    return Wire;

})(Item);

module.exports = Wire;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lyZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsOENBQUE7SUFBQTs7O0FBQUEsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsY0FBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVGLElBQUMsQ0FBQSxFQUFELEdBQWE7O0lBQ2IsSUFBQyxDQUFBLEtBQUQsR0FBYTs7SUFDYixJQUFDLENBQUEsSUFBRCxHQUFhOztJQUNiLElBQUMsQ0FBQSxJQUFELEdBQWE7O0lBQ2IsSUFBQyxDQUFBLFFBQUQsR0FBYTs7SUFDYixJQUFDLENBQUEsVUFBRCxHQUFhOztJQUNiLElBQUMsQ0FBQSxHQUFELEdBQWE7O0lBRVYsY0FBQyxJQUFELEVBQWUsV0FBZjtRQUFDLElBQUMsQ0FBQSxzQkFBRCxPQUFNLElBQUksQ0FBQztRQUFHLElBQUMsQ0FBQSxvQ0FBRCxjQUFhLElBQUksQ0FBQztRQUVoQyxJQUFDLENBQUEsSUFBRCxHQUFVO1FBQ1YsSUFBQyxDQUFBLE1BQUQsR0FBVTtRQUNWLElBQUMsQ0FBQSxLQUFELEdBQVU7UUFFVix1Q0FBQSxTQUFBO1FBRUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQjtRQUNwQixJQUFDLENBQUEsZUFBRCxHQUFvQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBbEI7UUFDcEIsSUFBQyxDQUFBLGNBQUQsR0FBb0IsSUFBQyxDQUFBLGdCQUFELENBQWtCLFVBQWxCO0lBVnJCOzttQkFZSCxHQUFBLEdBQUssU0FBQTtBQUVELFlBQUE7O2VBQUssQ0FBRSxRQUFRLENBQUMsR0FB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LENBQUMsSUFBVixDQUFlLFNBQVMsQ0FBQyxJQUFWLENBQWUsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFJLE1BQUosQ0FBVyxDQUFDLEdBQVosRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBWCxDQUFmLENBQWYsQ0FBWixFQURKOztRQUVBLElBQUcsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsRUFBdkI7WUFDSSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLFNBQVMsQ0FBQyxJQUFWLENBQWUsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsR0FBZCxFQUFtQixDQUFuQixDQUFYLENBQWYsQ0FBZixDQUFaLEVBREo7O1FBRUEsSUFBRyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxJQUF2QjtZQUNJLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsU0FBUyxDQUFDLElBQVYsQ0FBZSxHQUFHLENBQUMsTUFBSixDQUFXLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFDLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBWCxDQUFmLENBQWYsQ0FBWixFQURKOztlQUVBO0lBYmM7Ozs7R0ExSUg7O0FBeUpuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDBcbiMgMDAwIDAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwMDAwMDAwICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAgICAgIDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5HZW9tICAgICA9IHJlcXVpcmUgJy4vZ2VvbSdcbkZhY2UgICAgID0gcmVxdWlyZSAnLi9mYWNlJ1xuR2F0ZSAgICAgPSByZXF1aXJlICcuL2dhdGUnXG5WZWN0b3IgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3Rvcidcbk1hdGVyaWFsID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgV2lyZSBleHRlbmRzIEl0ZW1cblxuICAgIEBVUCAgICAgICAgID0xXG4gICAgQFJJR0hUICAgICAgPTIgXG4gICAgQERPV04gICAgICAgPTRcbiAgICBATEVGVCAgICAgICA9OFxuICAgIEBWRVJUSUNBTCAgID01XG4gICAgQEhPUklaT05UQUwgPTEwXG4gICAgQEFMTCAgICAgICAgPTE1XG4gICAgXG4gICAgQDogKEBmYWNlPUZhY2UuWiwgQGNvbm5lY3Rpb25zPVdpcmUuQUxMKSAtPlxuICAgICAgICBcbiAgICAgICAgQGdsb3cgICA9IG51bGxcbiAgICAgICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIEB2YWx1ZSAgPSAxLjBcbiAgICAgICAgXG4gICAgICAgIHN1cGVyIFxuICAgIFxuICAgICAgICBAU1dJVENIX09GRl9FVkVOVCA9IEBhZGRFdmVudFdpdGhOYW1lIFwib2ZmXCJcbiAgICAgICAgQFNXSVRDSF9PTl9FVkVOVCAgPSBAYWRkRXZlbnRXaXRoTmFtZSBcIm9uXCJcbiAgICAgICAgQFNXSVRDSEVEX0VWRU5UICAgPSBAYWRkRXZlbnRXaXRoTmFtZSBcInN3aXRjaGVkXCJcbiAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIFxuICAgICAgICBAZ2xvdz8ubWF0ZXJpYWwubWFwLmRpc3Bvc2UoKVxuICAgICAgICBAZ2xvdz8ubWF0ZXJpYWwuZGlzcG9zZSgpXG4gICAgICAgIEBtZXNoLnJlbW92ZSBAZ2xvd1xuICAgICAgICBAbWVzaC5yZW1vdmUgQHdpcmVcbiAgICAgICAgQG1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpXG4gICAgICAgIEB3aXJlLmdlb21ldHJ5LmRpc3Bvc2UoKVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgbyA9IDAuMDA1XG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuR2VvbWV0cnlcbiAgICAgICAgXG4gICAgICAgIGggPSAwLjFcbiAgICAgICAgcyA9IDAuNVxuICAgICAgICB3ID0gcytvXG4gICAgICAgIFxuICAgICAgICBpZiBAY29ubmVjdGlvbnMgJiBXaXJlLlJJR0hUIFxuICAgICAgICAgICAgcGxhbmUgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSAgdywgaFxuICAgICAgICAgICAgcGxhbmUudHJhbnNsYXRlIHcvMiwgMCwgLXMrb1xuICAgICAgICAgICAgZ2VvbS5tZXJnZSBwbGFuZVxuICAgICAgICAgICAgcGxhbmUuZGlzcG9zZSgpXG4gICAgICAgIGlmIEBjb25uZWN0aW9ucyAmIFdpcmUuTEVGVCAgIFxuICAgICAgICAgICAgcGxhbmUgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSAgdywgaFxuICAgICAgICAgICAgcGxhbmUudHJhbnNsYXRlIC13LzIsIDAsIC1zK29cbiAgICAgICAgICAgIGdlb20ubWVyZ2UgcGxhbmVcbiAgICAgICAgICAgIHBsYW5lLmRpc3Bvc2UoKVxuICAgICAgICBpZiBAY29ubmVjdGlvbnMgJiBXaXJlLlVQIFxuICAgICAgICAgICAgcGxhbmUgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSAgaCwgd1xuICAgICAgICAgICAgcGxhbmUudHJhbnNsYXRlIDAsIHcvMiwgLXMrb1xuICAgICAgICAgICAgZ2VvbS5tZXJnZSBwbGFuZVxuICAgICAgICAgICAgcGxhbmUuZGlzcG9zZSgpXG4gICAgICAgIGlmIEBjb25uZWN0aW9ucyAmIFdpcmUuRE9XTiAgICBcbiAgICAgICAgICAgIHBsYW5lID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkgaCwgd1xuICAgICAgICAgICAgcGxhbmUudHJhbnNsYXRlIDAsIC13LzIsIC1zK29cbiAgICAgICAgICAgIGdlb20ubWVyZ2UgcGxhbmVcbiAgICAgICAgICAgIHBsYW5lLmRpc3Bvc2UoKVxuICAgICAgICBcbiAgICAgICAgQHdpcmUgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCAgICAgICAgTWF0ZXJpYWwud2lyZSAgICAgICAgICAgIFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIEdlb20ud2lyZSgpLCBNYXRlcmlhbC53aXJlUGxhdGVcbiAgICAgICAgQG1lc2guYWRkIEB3aXJlXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEBtZXNoLnBvc2l0aW9uLmNvcHkgRmFjZS5ub3JtYWwoQGZhY2UpLm11bCAtKDAuNStvKVxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgRmFjZS5vcmllbnRhdGlvbiBAZmFjZVxuICAgICAgICBcbiAgICB1cGRhdGVBY3RpdmU6IC0+XG4gICAgICAgIFxuICAgICAgICBmb3Igd2lyZSBpbiBAbmVpZ2hib3JXaXJlcygpXG4gICAgICAgICAgICBAc2V0QWN0aXZlIHRydWUgaWYgd2lyZS5hY3RpdmVcbiAgICBcbiAgICBzZXRBY3RpdmU6IChhY3RpdmUpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBAYWN0aXZlICE9IGFjdGl2ZVxuICAgICAgICAgICAgQGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAgICAgbmVpZ2hib3JzID0gQG5laWdoYm9yV2lyZXMoKVxuXG4gICAgICAgICAgICBmb3Igd2lyZSBpbiBuZWlnaGJvcnNcbiAgICAgICAgICAgICAgICB3aXJlLnNldEFjdGl2ZSBAYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2F0ZSA9IHdvcmxkLmdldE9iamVjdE9mVHlwZUF0UG9zIEdhdGUsIEBnZXRQb3MoKVxuICAgICAgICAgICAgZ2F0ZT8uc2V0QWN0aXZlIEBhY3RpdmVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGFjdGl2ZVxuICAgICAgICAgICAgICAgIGlmIG5vdCBAZ2xvdz9cbiAgICAgICAgICAgICAgICAgICAgQGdsb3cgPSBuZXcgVEhSRUUuU3ByaXRlIE1hdGVyaWFsLmdsb3dcbiAgICAgICAgICAgICAgICAgICAgQGdsb3cucG9zaXRpb24uc2V0IDAsIDAsIC0wLjNcbiAgICAgICAgICAgICAgICAgICAgQGdsb3cuc2NhbGUuc2V0IC41LCAuNSwgMVxuICAgICAgICAgICAgICAgICAgICBAZ2xvdy5yZW5kZXJPcmRlciA9IDk5OVxuICAgICAgICAgICAgICAgICAgICBAbWVzaC5hZGQgQGdsb3dcbiAgICAgICAgICAgIGVsc2UgaWYgQGdsb3c/XG4gICAgICAgICAgICAgICAgQGdsb3cubWF0ZXJpYWwubWFwLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIEBnbG93Lm1hdGVyaWFsLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIEBtZXNoLnJlbW92ZSBAZ2xvd1xuICAgICAgICAgICAgICAgIEBnbG93ID0gbnVsbFxuICAgIFxuICAgICAgICAgICAgQGV2ZW50c1tAYWN0aXZlIGFuZCBAU1dJVENIX09OX0VWRU5UIG9yIEBTV0lUQ0hfT0ZGX0VWRU5UXS50cmlnZ2VyQWN0aW9ucygpXG4gICAgICAgICAgICBAZXZlbnRzW0BTV0lUQ0hFRF9FVkVOVF0udHJpZ2dlckFjdGlvbnMoKVxuICAgIFxuICAgIG5laWdoYm9yV2lyZXM6IC0+XG4gICAgICAgIFxuICAgICAgICB3aXJlcyA9IFtdXG4gICAgICAgIHBvaW50cyA9IEBjb25uZWN0aW9uUG9pbnRzKClcblxuICAgICAgICBuZWlnaGJvcl9kaXJzID0gW11cbiAgICAgICAgIFxuICAgICAgICByb3QgPSBGYWNlLm9yaWVudGF0aW9uRm9yRmFjZSBAZmFjZVxuICAgICAgICBuICAgPSBGYWNlLm5vcm1hbFZlY3RvckZvckZhY2UgQGZhY2VcbiAgICBcbiAgICAgICAgbmVpZ2hib3JfZGlycy5wdXNoIG5ldyBWZWN0b3IgMCAwIDAgXG4gICAgICAgICBcbiAgICAgICAgaWYgQGNvbm5lY3Rpb25zICYgV2lyZS5SSUdIVCBcbiAgICAgICAgICAgIG5laWdoYm9yX2RpcnMucHVzaCByb3Qucm90YXRlIG5ldyBWZWN0b3IoMSwwLDApXG4gICAgICAgICAgICBuZWlnaGJvcl9kaXJzLnB1c2ggcm90LnJvdGF0ZShuZXcgVmVjdG9yKDEsMCwwKSkubWludXMgblxuICAgICAgICBpZiBAY29ubmVjdGlvbnMgJiBXaXJlLkxFRlQgIFxuICAgICAgICAgICAgbmVpZ2hib3JfZGlycy5wdXNoIHJvdC5yb3RhdGUgbmV3IFZlY3RvcigtMSwwLDApXG4gICAgICAgICAgICBuZWlnaGJvcl9kaXJzLnB1c2ggcm90LnJvdGF0ZShuZXcgVmVjdG9yKC0xLDAsMCkpLm1pbnVzIG5cbiAgICAgICAgaWYgQGNvbm5lY3Rpb25zICYgV2lyZS5VUCAgICBcbiAgICAgICAgICAgIG5laWdoYm9yX2RpcnMucHVzaCByb3Qucm90YXRlIG5ldyBWZWN0b3IoMCwxLDApXG4gICAgICAgICAgICBuZWlnaGJvcl9kaXJzLnB1c2ggcm90LnJvdGF0ZShuZXcgVmVjdG9yKDAsMSwwKSkubWludXMgblxuICAgICAgICBpZiBAY29ubmVjdGlvbnMgJiBXaXJlLkRPV05cbiAgICAgICAgICAgIG5laWdoYm9yX2RpcnMucHVzaCByb3Qucm90YXRlIG5ldyBWZWN0b3IoMCwtMSwwKVxuICAgICAgICAgICAgbmVpZ2hib3JfZGlycy5wdXNoIHJvdC5yb3RhdGUobmV3IFZlY3RvcigwLC0xLDApKS5taW51cyBuXG4gICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5uZWlnaGJvcl9kaXJzLmxlbmd0aF1cbiAgICAgICAgICAgIG5laWdoYm9ycyA9IHdvcmxkLmdldE9iamVjdHNPZlR5cGVBdFBvcyBXaXJlLCBAcG9zaXRpb24ucGx1cyBuZWlnaGJvcl9kaXJzW2ldXG4gICAgICAgICAgICBmb3IgaXRlciBpbiBuZWlnaGJvcnNcbiAgICAgICAgICAgICAgICBjb250aW51ZSBpZiBpdGVyID09IEBcbiAgICAgICAgICAgICAgICBuZWlnaGJvcl9wb2ludHMgPSBpdGVyLmNvbm5lY3Rpb25Qb2ludHMoKVxuICAgICAgICAgICAgICAgIGZvciBwb2ludCBpbiBwb2ludHNcbiAgICAgICAgICAgICAgICAgICAgZm9yIG5laWdoYm9yX3BvaW50IGluIG5laWdoYm9yX3BvaW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbmVpZ2hib3JfcG9pbnQubWludXMocG9pbnQpLmxlbmd0aCgpIDwgMC4xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lyZXMucHVzaCBpdGVyXG4gICAgICAgIHdpcmVzXG4gICAgXG4gICAgY29ubmVjdGlvblBvaW50czogLT5cbiAgICAgICAgXG4gICAgICAgIHBvaW50cyA9IFtdXG4gICAgICAgIHRvX2JvcmRlciA9IEZhY2Uubm9ybWFsKEBmYWNlKS5tdWwgLTAuNVxuICAgICAgICByb3QgPSBGYWNlLm9yaWVudGF0aW9uIEBmYWNlXG4gICAgICAgIGlmIEBjb25uZWN0aW9ucyAmIFdpcmUuUklHSFQgXG4gICAgICAgICAgICBwb2ludHMucHVzaCBAcG9zaXRpb24ucGx1cyB0b19ib3JkZXIucGx1cyByb3Qucm90YXRlIG5ldyBWZWN0b3IgMC41LCAwLCAwXG4gICAgICAgIGlmIEBjb25uZWN0aW9ucyAmIFdpcmUuTEVGVFxuICAgICAgICAgICAgcG9pbnRzLnB1c2ggQHBvc2l0aW9uLnBsdXMgdG9fYm9yZGVyLnBsdXMgcm90LnJvdGF0ZSBuZXcgVmVjdG9yIC0wLjUsIDAsIDBcbiAgICAgICAgaWYgQGNvbm5lY3Rpb25zICYgV2lyZS5VUCBcbiAgICAgICAgICAgIHBvaW50cy5wdXNoIEBwb3NpdGlvbi5wbHVzIHRvX2JvcmRlci5wbHVzIHJvdC5yb3RhdGUgbmV3IFZlY3RvciAwLCAwLjUsIDBcbiAgICAgICAgaWYgQGNvbm5lY3Rpb25zICYgV2lyZS5ET1dOXG4gICAgICAgICAgICBwb2ludHMucHVzaCBAcG9zaXRpb24ucGx1cyB0b19ib3JkZXIucGx1cyByb3Qucm90YXRlIG5ldyBWZWN0b3IgMCwgLTAuNSwgMFxuICAgICAgICBwb2ludHNcbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IFdpcmVcbiJdfQ==
//# sourceURL=../coffee/wire.coffee