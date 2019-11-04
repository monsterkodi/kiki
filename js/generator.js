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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxxQ0FBQTtJQUFBOzs7QUFBQSxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVDLG1CQUFDLElBQUQ7UUFDQywyQ0FBTSxJQUFOO0lBREQ7O3dCQUdILFVBQUEsR0FBWSxTQUFBO1FBQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFmLEVBQWlDLFFBQVEsQ0FBQyxLQUExQztRQUNSLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWYsRUFBK0IsUUFBUSxDQUFDLElBQXhDLENBQVY7ZUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7SUFIZDs7d0JBS1osYUFBQSxHQUFlLFNBQUE7QUFDWCxZQUFBO1FBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxxQkFBTixDQUE0QixJQUE1QixFQUFrQyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWxDO0FBQ1I7YUFBQSx1Q0FBQTs7eUJBQ0ksSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsTUFBaEI7QUFESjs7SUFGVzs7d0JBS2YsU0FBQSxHQUFXLFNBQUMsTUFBRDtRQUNQLElBQUcsSUFBQyxDQUFBLE1BQUQsS0FBVyxNQUFkO1lBQ0kseUNBQU0sTUFBTjtZQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7bUJBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLE1BQUQsSUFBWSxjQUFaLElBQThCLGVBQTlDLEVBSEo7O0lBRE87Ozs7R0FmUzs7QUFxQnhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAwMDAgICAgICAgIDAwMCAgICAgICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgIDAwMDAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG5HZWFyICAgICA9IHJlcXVpcmUgJy4vZ2Vhcidcbkdlb20gICAgID0gcmVxdWlyZSAnLi9nZW9tJ1xuV2lyZSAgICAgPSByZXF1aXJlICcuL3dpcmUnXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEdlbmVyYXRvciBleHRlbmRzIEdlYXJcbiAgICBcbiAgICBAOiAoZmFjZSkgLT5cbiAgICAgICAgc3VwZXIgZmFjZVxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIEdlb20uZ2VuZXJhdG9yKCksIE1hdGVyaWFsLnBsYXRlXG4gICAgICAgIEBtZXNoLmFkZCBuZXcgVEhSRUUuTWVzaCBHZW9tLmdlYXIoKSwgICAgTWF0ZXJpYWwuZ2VhclxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICBhY3RpdmF0ZVdpcmVzOiAtPlxuICAgICAgICB3aXJlcyA9IHdvcmxkLmdldE9iamVjdHNPZlR5cGVBdFBvcyBXaXJlLCBAZ2V0UG9zKClcbiAgICAgICAgZm9yIHdpcmUgaW4gd2lyZXNcbiAgICAgICAgICAgIHdpcmUuc2V0QWN0aXZlIEBhY3RpdmVcbiAgICBcbiAgICBzZXRBY3RpdmU6IChhY3RpdmUpIC0+XG4gICAgICAgIGlmIEBhY3RpdmUgIT0gYWN0aXZlXG4gICAgICAgICAgICBzdXBlciBhY3RpdmVcbiAgICAgICAgICAgIEBhY3RpdmF0ZVdpcmVzKClcbiAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCBAYWN0aXZlIGFuZCAnR0VORVJBVE9SX09OJyBvciAnR0VORVJBVE9SX09GRidcbiAgICAgICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3JcbiJdfQ==
//# sourceURL=../coffee/generator.coffee