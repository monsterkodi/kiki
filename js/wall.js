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
        geom.translate(-0.5, -0.5, -0.5);
        this.plates = new THREE.Mesh(geom, Material.plate.clone());
        this.plates.receiveShadow = true;
        this.mesh = new THREE.Object3D;
        this.mesh.add(this.raster);
        return this.mesh.add(this.plates);
    };

    return Wall;

})(Item);

module.exports = Wall;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsK0JBQUE7SUFBQTs7O0FBQUEsR0FBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMOzs7bUJBRUYsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFZCxjQUFBO1FBQUcsdUNBQUEsU0FBQTtJQUFIOzttQkFFSCxVQUFBLEdBQVksU0FBQTtBQUNSLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxLQUFLLENBQUMsV0FBVixDQUFzQixDQUF0QixFQUF3QixDQUF4QixFQUEwQixDQUExQjtRQUNQLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBUSxDQUFDLElBQTlCO1FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLEdBQXdCO1FBQ3hCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixHQUFxQjtRQUVyQixJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVUsQ0FBVixFQUFZLENBQVosQ0FBZixFQUErQixTQUEvQixFQUEwQyxJQUFJLENBQUMsR0FBL0M7UUFDUCxJQUFJLENBQUMsU0FBTCxDQUFlLENBQUMsR0FBaEIsRUFBcUIsQ0FBQyxHQUF0QixFQUEyQixDQUFDLEdBQTVCO1FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQWYsQ0FBQSxDQUFyQjtRQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixHQUF3QjtRQUV4QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDO1FBQ2xCLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxNQUFYO2VBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLE1BQVg7SUFiUTs7OztHQU5HOztBQXFCbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG5cblBvcyAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5DYWdlICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcbk1hdGVyaWFsID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgV2FsbCBleHRlbmRzIEl0ZW1cblxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gdHJ1ZVxuICAgIFxuICAgIEA6IC0+IHN1cGVyXG4gICAgICAgXG4gICAgY3JlYXRlTWVzaDogLT4gXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkgMSwxLDFcbiAgICAgICAgQHJhc3RlciA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIE1hdGVyaWFsLndhbGxcbiAgICAgICAgQHJhc3Rlci5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBAcmFzdGVyLmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICBnZW9tID0gQ2FnZS53YWxsVGlsZXMgbmV3IFBvcygxLDEsMSksICdvdXRzaWRlJywgQ2FnZS5nYXAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgZ2VvbS50cmFuc2xhdGUgLTAuNSwgLTAuNSwgLTAuNVxuICAgICAgICBAcGxhdGVzID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgTWF0ZXJpYWwucGxhdGUuY2xvbmUoKVxuICAgICAgICBAcGxhdGVzLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5PYmplY3QzRFxuICAgICAgICBAbWVzaC5hZGQgQHJhc3RlclxuICAgICAgICBAbWVzaC5hZGQgQHBsYXRlc1xuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBXYWxsXG4iXX0=
//# sourceURL=../coffee/wall.coffee