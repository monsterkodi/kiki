// koffee 1.4.0
var Cage, Material;

Material = require('./material');

Cage = (function() {
    function Cage(size1, gap) {
        var geom;
        this.size = size1;
        Cage.gap = gap;
        geom = Cage.wallTiles(this.size, 'inside', 0);
        this.raster = new THREE.Mesh(geom, Material.raster);
        this.raster.translateX(-0.5);
        this.raster.translateY(-0.5);
        this.raster.translateZ(-0.5);
        this.raster.receiveShadow = true;
        world.scene.add(this.raster);
        geom = Cage.wallTiles(this.size, 'inside', Cage.gap);
        this.cage = new THREE.Mesh(geom, Material.plate);
        this.cage.translateX(-0.5);
        this.cage.translateY(-0.5);
        this.cage.translateZ(-0.5);
        this.cage.receiveShadow = true;
        world.scene.add(this.cage);
    }

    Cage.prototype.del = function() {
        world.scene.remove(this.raster);
        return world.scene.remove(this.cage);
    };

    Cage.wallTiles = function(size, side, raster) {
        var faces, geom, i, j, k, l, m, n, normals, o, offset, p, plates, positions, ref, ref1, ref2, ref3, ref4, ref5, s, triangles, x, xyPlate, xzPlate, y, yxPlate, yzPlate, z, zxPlate, zyPlate;
        if (raster == null) {
            raster = Cage.gap;
        }
        faces = size.x * size.y * 2 + size.x * size.z * 2 + size.y * size.z * 2;
        triangles = faces * 2;
        positions = new Float32Array(triangles * 3 * 3);
        normals = new Float32Array(triangles * 3 * 3);
        s = 1 - raster;
        o = raster;
        i = -1;
        offset = (side === 'outside' && -1 || 1) * raster / 20;
        xyPlate = function(x, y, z) {
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = 1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = 1;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = 1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = 1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = 1;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            return normals[i] = 1;
        };
        yxPlate = function(x, y, z) {
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = -1;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = -1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = -1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = -1;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            normals[i] = -1;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z;
            return normals[i] = -1;
        };
        zxPlate = function(x, y, z) {
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = 1;
            positions[i += 1] = z + s;
            return normals[i] = 0;
        };
        xzPlate = function(x, y, z) {
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x + o;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x + s;
            normals[i] = 0;
            positions[i += 1] = y;
            normals[i] = -1;
            positions[i += 1] = z + o;
            return normals[i] = 0;
        };
        yzPlate = function(x, y, z) {
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = 1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + s;
            return normals[i] = 0;
        };
        zyPlate = function(x, y, z) {
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + o;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + o;
            normals[i] = 0;
            positions[i += 1] = z + s;
            normals[i] = 0;
            positions[i += 1] = x;
            normals[i] = -1;
            positions[i += 1] = y + s;
            normals[i] = 0;
            positions[i += 1] = z + s;
            return normals[i] = 0;
        };
        plates = side === 'outside' && [yxPlate, xyPlate, xzPlate, zxPlate, zyPlate, yzPlate] || [xyPlate, yxPlate, zxPlate, xzPlate, yzPlate, zyPlate];
        for (x = j = 0, ref = size.x; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
            for (y = k = 0, ref1 = size.y; 0 <= ref1 ? k < ref1 : k > ref1; y = 0 <= ref1 ? ++k : --k) {
                plates[0](x, y, offset);
                plates[1](x, y, size.z - offset);
            }
        }
        for (x = l = 0, ref2 = size.x; 0 <= ref2 ? l < ref2 : l > ref2; x = 0 <= ref2 ? ++l : --l) {
            for (z = m = 0, ref3 = size.z; 0 <= ref3 ? m < ref3 : m > ref3; z = 0 <= ref3 ? ++m : --m) {
                plates[2](x, offset, z);
                plates[3](x, size.y - offset, z);
            }
        }
        for (y = n = 0, ref4 = size.y; 0 <= ref4 ? n < ref4 : n > ref4; y = 0 <= ref4 ? ++n : --n) {
            for (z = p = 0, ref5 = size.z; 0 <= ref5 ? p < ref5 : p > ref5; z = 0 <= ref5 ? ++p : --p) {
                plates[4](offset, y, z);
                plates[5](size.x - offset, y, z);
            }
        }
        geom = new THREE.BufferGeometry;
        geom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
        return geom;
    };

    return Cage;

})();

module.exports = Cage;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FnZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMO0lBRVcsY0FBQyxLQUFELEVBQVEsR0FBUjtBQUNULFlBQUE7UUFEVSxJQUFDLENBQUEsT0FBRDtRQUNWLElBQUksQ0FBQyxHQUFMLEdBQVc7UUFDWCxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsSUFBaEIsRUFBc0IsUUFBdEIsRUFBZ0MsQ0FBaEM7UUFDUCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQVEsQ0FBQyxNQUE5QjtRQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixDQUFDLEdBQXBCO1FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLENBQUMsR0FBcEI7UUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsQ0FBQyxHQUFwQjtRQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixHQUF3QjtRQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCO1FBRUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBQyxDQUFBLElBQWhCLEVBQXNCLFFBQXRCLEVBQWdDLElBQUksQ0FBQyxHQUFyQztRQUNQLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFLLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBUSxDQUFDLEtBQTlCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLENBQUMsR0FBbEI7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsQ0FBQyxHQUFsQjtRQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFpQixDQUFDLEdBQWxCO1FB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LENBQUEsQ0FBQSxDQUFQLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsTUFBaEI7Z0JBQ0EsTUFBTyxDQUFBLENBQUEsQ0FBUCxDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLElBQUksQ0FBQyxDQUFMLEdBQVMsTUFBekI7QUFGSjtBQURKO0FBS0EsYUFBUyxvRkFBVDtBQUNJLGlCQUFTLG9GQUFUO2dCQUNJLE1BQU8sQ0FBQSxDQUFBLENBQVAsQ0FBVSxDQUFWLEVBQWEsTUFBYixFQUFxQixDQUFyQjtnQkFDQSxNQUFPLENBQUEsQ0FBQSxDQUFQLENBQVUsQ0FBVixFQUFhLElBQUksQ0FBQyxDQUFMLEdBQVMsTUFBdEIsRUFBOEIsQ0FBOUI7QUFGSjtBQURKO0FBS0EsYUFBUyxvRkFBVDtBQUNJLGlCQUFTLG9GQUFUO2dCQUNJLE1BQU8sQ0FBQSxDQUFBLENBQVAsQ0FBVSxNQUFWLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCO2dCQUNBLE1BQU8sQ0FBQSxDQUFBLENBQVAsQ0FBVSxJQUFJLENBQUMsQ0FBTCxHQUFPLE1BQWpCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCO0FBRko7QUFESjtRQUtBLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBTCxDQUFrQixVQUFsQixFQUE4QixJQUFJLEtBQUssQ0FBQyxlQUFWLENBQTBCLFNBQTFCLEVBQXFDLENBQXJDLENBQTlCO1FBQ0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsUUFBbEIsRUFBOEIsSUFBSSxLQUFLLENBQUMsZUFBVixDQUEwQixPQUExQixFQUFxQyxDQUFyQyxDQUE5QjtlQUNBO0lBeEpROzs7Ozs7QUEwSmhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICBcbiMgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDBcblxuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBDYWdlXG5cbiAgICBjb25zdHJ1Y3RvcjogKEBzaXplLCBnYXApIC0+XG4gICAgICAgIENhZ2UuZ2FwID0gZ2FwXG4gICAgICAgIGdlb20gPSBDYWdlLndhbGxUaWxlcyBAc2l6ZSwgJ2luc2lkZScsIDBcbiAgICAgICAgQHJhc3RlciA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIE1hdGVyaWFsLnJhc3RlciBcbiAgICAgICAgQHJhc3Rlci50cmFuc2xhdGVYIC0wLjVcbiAgICAgICAgQHJhc3Rlci50cmFuc2xhdGVZIC0wLjUgXG4gICAgICAgIEByYXN0ZXIudHJhbnNsYXRlWiAtMC41XG4gICAgICAgIEByYXN0ZXIucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgd29ybGQuc2NlbmUuYWRkIEByYXN0ZXIgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgZ2VvbSA9IENhZ2Uud2FsbFRpbGVzIEBzaXplLCAnaW5zaWRlJywgQ2FnZS5nYXAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgQGNhZ2UgPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC5wbGF0ZSBcbiAgICAgICAgQGNhZ2UudHJhbnNsYXRlWCAtMC41XG4gICAgICAgIEBjYWdlLnRyYW5zbGF0ZVkgLTAuNSBcbiAgICAgICAgQGNhZ2UudHJhbnNsYXRlWiAtMC41XG4gICAgICAgIEBjYWdlLnJlY2VpdmVTaGFkb3cgPSB0cnVlXG4gICAgICAgIHdvcmxkLnNjZW5lLmFkZCBAY2FnZSAgICAgICAgXG4gICAgIFxuICAgIGRlbDogLT4gXG4gICAgICAgIHdvcmxkLnNjZW5lLnJlbW92ZSBAcmFzdGVyXG4gICAgICAgIHdvcmxkLnNjZW5lLnJlbW92ZSBAY2FnZSBcbiAgICAgICAgXG4gICAgQHdhbGxUaWxlczogKHNpemUsIHNpZGUsIHJhc3Rlcj1DYWdlLmdhcCkgLT5cblxuICAgICAgICBmYWNlcyAgICAgPSBzaXplLnggKiBzaXplLnkgKiAyICsgc2l6ZS54ICogc2l6ZS56ICogMiArIHNpemUueSAqIHNpemUueiAqIDJcbiAgICAgICAgdHJpYW5nbGVzID0gZmFjZXMgKiAyXG5cbiAgICAgICAgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheSB0cmlhbmdsZXMgKiAzICogM1xuICAgICAgICBub3JtYWxzICAgPSBuZXcgRmxvYXQzMkFycmF5IHRyaWFuZ2xlcyAqIDMgKiAzXG5cbiAgICAgICAgcyA9IDEtcmFzdGVyXG4gICAgICAgIG8gPSByYXN0ZXJcbiAgICAgICAgaSA9IC0xXG4gICAgICAgIG9mZnNldCA9IChzaWRlID09ICdvdXRzaWRlJyBhbmQgLTEgb3IgMSkgKiByYXN0ZXIvMjBcbiAgICAgICAgXG4gICAgICAgIHh5UGxhdGUgPSAoeCwgeSwgeikgLT4gXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwICBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IDFcblxuICAgICAgICB5eFBsYXRlID0gKHgsIHksIHopIC0+XG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwICBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCtzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geiAgOyBub3JtYWxzW2ldID0gLTFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHogIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCtzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geiAgOyBub3JtYWxzW2ldID0gLTFcblxuICAgICAgICB6eFBsYXRlID0gKHgsIHksIHopIC0+XG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwICBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IDFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorczsgbm9ybWFsc1tpXSA9IDBcblxuICAgICAgICB4elBsYXRlID0gKHgsIHksIHopIC0+XG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K287IG5vcm1hbHNbaV0gPSAwICBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6K287IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCtvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geSAgOyBub3JtYWxzW2ldID0gLTFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrczsgbm9ybWFsc1tpXSA9IDAgIFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geSAgOyBub3JtYWxzW2ldID0gLTFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHgrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkgIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuXG4gICAgICAgIHl6UGxhdGUgPSAoeCwgeSwgeikgLT5cbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHggIDsgbm9ybWFsc1tpXSA9IDEgIFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitzOyBub3JtYWxzW2ldID0gMFxuXG4gICAgICAgIHp5UGxhdGUgPSAoeCwgeSwgeikgLT5cbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHggIDsgbm9ybWFsc1tpXSA9IC0xICBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHggIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5K287IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitvOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geCAgOyBub3JtYWxzW2ldID0gLTFcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHkrczsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHorbzsgbm9ybWFsc1tpXSA9IDBcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpKz0xXSA9IHggIDsgbm9ybWFsc1tpXSA9IC0xXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB5K287IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB6K3M7IG5vcm1hbHNbaV0gPSAwXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSs9MV0gPSB4ICA7IG5vcm1hbHNbaV0gPSAtMVxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geStzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgcG9zaXRpb25zW2krPTFdID0geitzOyBub3JtYWxzW2ldID0gMFxuICAgICAgICAgICAgXG4gICAgICAgIHBsYXRlcyA9IHNpZGUgPT0gJ291dHNpZGUnIGFuZCBbeXhQbGF0ZSwgeHlQbGF0ZSwgeHpQbGF0ZSwgenhQbGF0ZSwgenlQbGF0ZSwgeXpQbGF0ZV0gb3IgW3h5UGxhdGUsIHl4UGxhdGUsIHp4UGxhdGUsIHh6UGxhdGUsIHl6UGxhdGUsIHp5UGxhdGVdXG4gICAgICAgIGZvciB4IGluIFswLi4uc2l6ZS54XVxuICAgICAgICAgICAgZm9yIHkgaW4gWzAuLi5zaXplLnldXG4gICAgICAgICAgICAgICAgcGxhdGVzWzBdIHgsIHksIG9mZnNldFxuICAgICAgICAgICAgICAgIHBsYXRlc1sxXSB4LCB5LCBzaXplLnogLSBvZmZzZXRcblxuICAgICAgICBmb3IgeCBpbiBbMC4uLnNpemUueF1cbiAgICAgICAgICAgIGZvciB6IGluIFswLi4uc2l6ZS56XVxuICAgICAgICAgICAgICAgIHBsYXRlc1syXSB4LCBvZmZzZXQsIHpcbiAgICAgICAgICAgICAgICBwbGF0ZXNbM10geCwgc2l6ZS55IC0gb2Zmc2V0LCB6XG5cbiAgICAgICAgZm9yIHkgaW4gWzAuLi5zaXplLnldXG4gICAgICAgICAgICBmb3IgeiBpbiBbMC4uLnNpemUuel1cbiAgICAgICAgICAgICAgICBwbGF0ZXNbNF0gb2Zmc2V0LCB5LCB6XG4gICAgICAgICAgICAgICAgcGxhdGVzWzVdIHNpemUueC1vZmZzZXQsIHksIHpcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG4gICAgICAgIGdlb20uYWRkQXR0cmlidXRlICdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUgcG9zaXRpb25zLCAzIFxuICAgICAgICBnZW9tLmFkZEF0dHJpYnV0ZSAnbm9ybWFsJywgICBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlIG5vcm1hbHMsICAgMyBcbiAgICAgICAgZ2VvbVxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQ2FnZVxuIl19
//# sourceURL=../coffee/cage.coffee