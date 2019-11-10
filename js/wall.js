// koffee 1.4.0
var Cage, Item, Material, Pos, Wall,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Pos = require('./lib/pos');

Item = require('./item');

Cage = require('./cage');

Material = require('./material');

Wall = (function(superClass) {
    extend(Wall, superClass);

    Wall.prototype.isSpaceEgoistic = function() {
        return true;
    };

    function Wall() {
        Wall.__super__.constructor.apply(this, arguments);
    }

    Wall.prototype.createMesh = function() {
        var geom;
        geom = new THREE.BoxGeometry(1, 1, 1);
        this.raster = new THREE.Mesh(geom, Material.wall);
        this.raster.receiveShadow = true;
        this.raster.castShadow = true;
        geom = Cage.wallTiles(new Pos(1, 1, 1), 'outside', Cage.gap);
        geom.translate(-0.5 - 0.5 - 0.5);
        this.plates = new THREE.Mesh(geom, Material.plate.clone());
        this.plates.receiveShadow = true;
        this.mesh = new THREE.Object3D;
        this.mesh.add(this.raster);
        return this.mesh.add(this.plates);
    };

    return Wall;

})(Item);

module.exports = Wall;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsK0JBQUE7SUFBQTs7O0FBQUEsR0FBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMOzs7bUJBRUYsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFZCxjQUFBO1FBQUcsdUNBQUEsU0FBQTtJQUFIOzttQkFFSCxVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxLQUFLLENBQUMsV0FBVixDQUFzQixDQUF0QixFQUF3QixDQUF4QixFQUEwQixDQUExQjtRQUNQLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBUSxDQUFDLElBQTlCO1FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLEdBQXdCO1FBQ3hCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixHQUFxQjtRQUVyQixJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVUsQ0FBVixFQUFZLENBQVosQ0FBZixFQUErQixTQUEvQixFQUF5QyxJQUFJLENBQUMsR0FBOUM7UUFDUCxJQUFJLENBQUMsU0FBTCxDQUFlLENBQUMsR0FBRCxHQUFNLEdBQU4sR0FBVyxHQUExQjtRQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFmLENBQUEsQ0FBckI7UUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsR0FBd0I7UUFFeEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQztRQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsTUFBWDtlQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxNQUFYO0lBZFE7Ozs7R0FORzs7QUFzQm5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMCAgICAgMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMFxuXG5Qb3MgICAgICA9IHJlcXVpcmUgJy4vbGliL3Bvcydcbkl0ZW0gICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuQ2FnZSAgICAgPSByZXF1aXJlICcuL2NhZ2UnXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIFdhbGwgZXh0ZW5kcyBJdGVtXG5cbiAgICBpc1NwYWNlRWdvaXN0aWM6IC0+IHRydWVcbiAgICBcbiAgICBAOiAtPiBzdXBlclxuICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+IFxuICAgICAgICBcbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSAxIDEgMVxuICAgICAgICBAcmFzdGVyID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgTWF0ZXJpYWwud2FsbFxuICAgICAgICBAcmFzdGVyLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIEByYXN0ZXIuY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIGdlb20gPSBDYWdlLndhbGxUaWxlcyBuZXcgUG9zKDEgMSAxKSwgJ291dHNpZGUnIENhZ2UuZ2FwICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGdlb20udHJhbnNsYXRlIC0wLjUgLTAuNSAtMC41XG4gICAgICAgIEBwbGF0ZXMgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC5wbGF0ZS5jbG9uZSgpXG4gICAgICAgIEBwbGF0ZXMucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgXG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk9iamVjdDNEXG4gICAgICAgIEBtZXNoLmFkZCBAcmFzdGVyXG4gICAgICAgIEBtZXNoLmFkZCBAcGxhdGVzXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGxcbiJdfQ==
//# sourceURL=../coffee/wall.coffee