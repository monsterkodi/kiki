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

    Generator.prototype.del = function() {
        this.mesh.geometry.dispose();
        this.gear.geometry.dispose();
        return Generator.__super__.del.apply(this, arguments);
    };

    Generator.prototype.createMesh = function() {
        this.mesh = new THREE.Mesh(Geom.generator(), Material.plate);
        this.gear = new THREE.Mesh(Geom.gear(), Material.gear);
        this.mesh.add(this.gear);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxxQ0FBQTtJQUFBOzs7QUFBQSxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVDLG1CQUFDLElBQUQ7UUFDQywyQ0FBTSxJQUFOO0lBREQ7O3dCQUdILEdBQUEsR0FBSyxTQUFBO1FBRUQsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZixDQUFBO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZixDQUFBO2VBQ0Esb0NBQUEsU0FBQTtJQUpDOzt3QkFNTCxVQUFBLEdBQVksU0FBQTtRQUVSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBZixFQUFpQyxRQUFRLENBQUMsS0FBMUM7UUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWYsRUFBK0IsUUFBUSxDQUFDLElBQXhDO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLElBQVg7ZUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7SUFMZDs7d0JBT1osYUFBQSxHQUFlLFNBQUE7QUFFWCxZQUFBO1FBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxxQkFBTixDQUE0QixJQUE1QixFQUFrQyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWxDO0FBQ1I7YUFBQSx1Q0FBQTs7eUJBQ0ksSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsTUFBaEI7QUFESjs7SUFIVzs7d0JBTWYsU0FBQSxHQUFXLFNBQUMsTUFBRDtRQUVQLElBQUcsSUFBQyxDQUFBLE1BQUQsS0FBVyxNQUFkO1lBQ0kseUNBQU0sTUFBTjtZQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7bUJBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLE1BQUQsSUFBWSxjQUFaLElBQThCLGVBQTlDLEVBSEo7O0lBRk87Ozs7R0F4QlM7O0FBK0J4QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAwMDAwICAwMDAwMDAwICAgMDAwIDAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAwMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuR2VhciAgICAgPSByZXF1aXJlICcuL2dlYXInXG5HZW9tICAgICA9IHJlcXVpcmUgJy4vZ2VvbSdcbldpcmUgICAgID0gcmVxdWlyZSAnLi93aXJlJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBHZW5lcmF0b3IgZXh0ZW5kcyBHZWFyXG4gICAgXG4gICAgQDogKGZhY2UpIC0+XG4gICAgICAgIHN1cGVyIGZhY2VcbiAgICAgICAgXG4gICAgZGVsOiAtPlxuICAgICAgICBcbiAgICAgICAgQG1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpXG4gICAgICAgIEBnZWFyLmdlb21ldHJ5LmRpc3Bvc2UoKVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBHZW9tLmdlbmVyYXRvcigpLCBNYXRlcmlhbC5wbGF0ZVxuICAgICAgICBAZ2VhciA9IG5ldyBUSFJFRS5NZXNoIEdlb20uZ2VhcigpLCAgICBNYXRlcmlhbC5nZWFyXG4gICAgICAgIEBtZXNoLmFkZCBAZ2VhclxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICBhY3RpdmF0ZVdpcmVzOiAtPlxuICAgICAgICBcbiAgICAgICAgd2lyZXMgPSB3b3JsZC5nZXRPYmplY3RzT2ZUeXBlQXRQb3MgV2lyZSwgQGdldFBvcygpXG4gICAgICAgIGZvciB3aXJlIGluIHdpcmVzXG4gICAgICAgICAgICB3aXJlLnNldEFjdGl2ZSBAYWN0aXZlXG4gICAgXG4gICAgc2V0QWN0aXZlOiAoYWN0aXZlKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgQGFjdGl2ZSAhPSBhY3RpdmVcbiAgICAgICAgICAgIHN1cGVyIGFjdGl2ZVxuICAgICAgICAgICAgQGFjdGl2YXRlV2lyZXMoKVxuICAgICAgICAgICAgd29ybGQucGxheVNvdW5kIEBhY3RpdmUgYW5kICdHRU5FUkFUT1JfT04nIG9yICdHRU5FUkFUT1JfT0ZGJ1xuICAgICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvclxuIl19
//# sourceURL=../coffee/generator.coffee