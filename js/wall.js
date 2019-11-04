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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLElBQUEsK0JBQUE7SUFBQTs7O0FBQUEsR0FBQSxHQUFXLE9BQUEsQ0FBUSxXQUFSOztBQUNYLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxJQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMOzs7bUJBRUYsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFSixjQUFBO1FBQUcsdUNBQUEsU0FBQTtJQUFIOzttQkFFYixVQUFBLEdBQVksU0FBQTtBQUNSLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxLQUFLLENBQUMsV0FBVixDQUFzQixDQUF0QixFQUF3QixDQUF4QixFQUEwQixDQUExQjtRQUNQLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBUSxDQUFDLElBQTlCO1FBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLEdBQXdCO1FBQ3hCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixHQUFxQjtRQUVyQixJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVUsQ0FBVixFQUFZLENBQVosQ0FBZixFQUErQixTQUEvQixFQUEwQyxJQUFJLENBQUMsR0FBL0M7UUFDUCxJQUFJLENBQUMsU0FBTCxDQUFlLENBQUMsR0FBaEIsRUFBcUIsQ0FBQyxHQUF0QixFQUEyQixDQUFDLEdBQTVCO1FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQWYsQ0FBQSxDQUFyQjtRQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixHQUF3QjtRQUV4QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDO1FBQ2xCLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxNQUFYO2VBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLE1BQVg7SUFiUTs7OztHQU5HOztBQXFCbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgIFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgXG4jICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgICAgIDAwMCAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgIFxuIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwXG5cblBvcyAgICAgID0gcmVxdWlyZSAnLi9saWIvcG9zJ1xuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5DYWdlICAgICA9IHJlcXVpcmUgJy4vY2FnZSdcbk1hdGVyaWFsID0gcmVxdWlyZSAnLi9tYXRlcmlhbCdcblxuY2xhc3MgV2FsbCBleHRlbmRzIEl0ZW1cblxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gdHJ1ZVxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAtPiBzdXBlclxuICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+IFxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5IDEsMSwxXG4gICAgICAgIEByYXN0ZXIgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC53YWxsXG4gICAgICAgIEByYXN0ZXIucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgQHJhc3Rlci5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgZ2VvbSA9IENhZ2Uud2FsbFRpbGVzIG5ldyBQb3MoMSwxLDEpLCAnb3V0c2lkZScsIENhZ2UuZ2FwICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGdlb20udHJhbnNsYXRlIC0wLjUsIC0wLjUsIC0wLjVcbiAgICAgICAgQHBsYXRlcyA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIE1hdGVyaWFsLnBsYXRlLmNsb25lKClcbiAgICAgICAgQHBsYXRlcy5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuT2JqZWN0M0RcbiAgICAgICAgQG1lc2guYWRkIEByYXN0ZXJcbiAgICAgICAgQG1lc2guYWRkIEBwbGF0ZXNcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gV2FsbFxuIl19
//# sourceURL=../coffee/wall.coffee