// koffee 1.4.0
var Gear, Generator, Geom, Material, Wire,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Gear = require('./gear');

Geom = require('./geom');

Wire = require('./wire');

Material = require('./material');

Generator = (function(superClass) {
    extend(Generator, superClass);

    function Generator(face) {
        Generator.__super__.constructor.call(this, face);
    }

    Generator.prototype.createMesh = function() {
        this.mesh = new THREE.Mesh(Geom.generator(), Material.plate);
        this.mesh.add(new THREE.Mesh(Geom.gear(), Material.gear));
        return this.mesh.receiveShadow = true;
    };

    Generator.prototype.activateWires = function() {
        var i, len, results, wire, wires;
        wires = world.getObjectsOfTypeAtPos(Wire, this.getPos());
        results = [];
        for (i = 0, len = wires.length; i < len; i++) {
            wire = wires[i];
            results.push(wire.setActive(this.active));
        }
        return results;
    };

    Generator.prototype.setActive = function(active) {
        if (this.active !== active) {
            Generator.__super__.setActive.call(this, active);
            this.activateWires();
            return world.playSound(this.active && 'GENERATOR_ON' || 'GENERATOR_OFF');
        }
    };

    return Generator;

})(Gear);

module.exports = Generator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxxQ0FBQTtJQUFBOzs7QUFBQSxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVXLG1CQUFDLElBQUQ7UUFDVCwyQ0FBTSxJQUFOO0lBRFM7O3dCQUdiLFVBQUEsR0FBWSxTQUFBO1FBQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFmLEVBQWlDLFFBQVEsQ0FBQyxLQUExQztRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWYsRUFBK0IsUUFBUSxDQUFDLElBQXhDLENBQVY7ZUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7SUFIZDs7d0JBS1osYUFBQSxHQUFlLFNBQUE7QUFDWCxZQUFBO1FBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxxQkFBTixDQUE0QixJQUE1QixFQUFrQyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWxDO0FBQ1I7YUFBQSx1Q0FBQTs7eUJBQ0ksSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsTUFBaEI7QUFESjs7SUFGVzs7d0JBS2YsU0FBQSxHQUFXLFNBQUMsTUFBRDtRQUNQLElBQUcsSUFBQyxDQUFBLE1BQUQsS0FBVyxNQUFkO1lBQ0kseUNBQU0sTUFBTjtZQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7bUJBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLE1BQUQsSUFBWSxjQUFaLElBQThCLGVBQTlDLEVBSEo7O0lBRE87Ozs7R0FmUzs7QUFxQnhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAwMDAgICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgIDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG5HZWFyICAgICA9IHJlcXVpcmUgJy4vZ2Vhcidcbkdlb20gICAgID0gcmVxdWlyZSAnLi9nZW9tJ1xuV2lyZSAgICAgPSByZXF1aXJlICcuL3dpcmUnXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEdlbmVyYXRvciBleHRlbmRzIEdlYXJcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKGZhY2UpIC0+IFxuICAgICAgICBzdXBlciBmYWNlXG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggR2VvbS5nZW5lcmF0b3IoKSwgTWF0ZXJpYWwucGxhdGVcbiAgICAgICAgQG1lc2guYWRkIG5ldyBUSFJFRS5NZXNoIEdlb20uZ2VhcigpLCAgICBNYXRlcmlhbC5nZWFyXG4gICAgICAgIEBtZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIFxuICAgIGFjdGl2YXRlV2lyZXM6IC0+XG4gICAgICAgIHdpcmVzID0gd29ybGQuZ2V0T2JqZWN0c09mVHlwZUF0UG9zIFdpcmUsIEBnZXRQb3MoKVxuICAgICAgICBmb3Igd2lyZSBpbiB3aXJlc1xuICAgICAgICAgICAgd2lyZS5zZXRBY3RpdmUgQGFjdGl2ZVxuICAgIFxuICAgIHNldEFjdGl2ZTogKGFjdGl2ZSkgLT5cbiAgICAgICAgaWYgQGFjdGl2ZSAhPSBhY3RpdmVcbiAgICAgICAgICAgIHN1cGVyIGFjdGl2ZVxuICAgICAgICAgICAgQGFjdGl2YXRlV2lyZXMoKVxuICAgICAgICAgICAgd29ybGQucGxheVNvdW5kIEBhY3RpdmUgYW5kICdHRU5FUkFUT1JfT04nIG9yICdHRU5FUkFUT1JfT0ZGJ1xuICAgICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvclxuIl19
//# sourceURL=../coffee/generator.coffee