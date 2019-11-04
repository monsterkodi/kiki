// koffee 1.4.0
var Face, Quaternion, Vector;

Quaternion = require('./lib/quaternion');

Vector = require('./lib/vector');

Face = (function() {
    function Face() {}

    Face.X = 0;

    Face.Y = 1;

    Face.Z = 2;

    Face.NX = 3;

    Face.NY = 4;

    Face.NZ = 5;

    Face.orientation = function(face) {
        switch (face % 6) {
            case 0:
                return Quaternion.rot_90_Y;
            case 1:
                return Quaternion.rot_270_X;
            case 2:
                return Quaternion.rot_0;
            case 3:
                return Quaternion.rot_270_Y;
            case 4:
                return Quaternion.rot_90_X;
            case 5:
                return Quaternion.rot_180_X;
        }
    };

    Face.normal = function(face) {
        var o;
        o = (face < 3) && 1 || -1;
        switch (face % 3) {
            case 0:
                return new Vector(o, 0, 0);
            case 1:
                return new Vector(0, o, 0);
            case 2:
                return new Vector(0, 0, o);
        }
        return new Vector;
    };

    Face.orientationForFace = function(face) {
        return this.orientation(face);
    };

    Face.normalVectorForFace = function(face) {
        return this.normal(face);
    };

    return Face;

})();

module.exports = Face;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUjs7QUFDYixNQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0FBRVA7OztJQUVGLElBQUMsQ0FBQSxDQUFELEdBQU07O0lBQ04sSUFBQyxDQUFBLENBQUQsR0FBTTs7SUFDTixJQUFDLENBQUEsQ0FBRCxHQUFNOztJQUNOLElBQUMsQ0FBQSxFQUFELEdBQU07O0lBQ04sSUFBQyxDQUFBLEVBQUQsR0FBTTs7SUFDTixJQUFDLENBQUEsRUFBRCxHQUFNOztJQUVOLElBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFEO0FBQ1YsZ0JBQU8sSUFBQSxHQUFPLENBQWQ7QUFBQSxpQkFDUSxDQURSO0FBQ2UsdUJBQU8sVUFBVSxDQUFDO0FBRGpDLGlCQUVRLENBRlI7QUFFZSx1QkFBTyxVQUFVLENBQUM7QUFGakMsaUJBR1EsQ0FIUjtBQUdlLHVCQUFPLFVBQVUsQ0FBQztBQUhqQyxpQkFJUSxDQUpSO0FBSWUsdUJBQU8sVUFBVSxDQUFDO0FBSmpDLGlCQUtRLENBTFI7QUFLZSx1QkFBTyxVQUFVLENBQUM7QUFMakMsaUJBTVEsQ0FOUjtBQU1lLHVCQUFPLFVBQVUsQ0FBQztBQU5qQztJQURVOztJQVNkLElBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxJQUFEO0FBQ0wsWUFBQTtRQUFBLENBQUEsR0FBSSxDQUFDLElBQUEsR0FBTyxDQUFSLENBQUEsSUFBZSxDQUFmLElBQW9CLENBQUM7QUFDekIsZ0JBQU8sSUFBQSxHQUFPLENBQWQ7QUFBQSxpQkFDUyxDQURUO0FBQ2dCLHVCQUFPLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCO0FBRHZCLGlCQUVTLENBRlQ7QUFFZ0IsdUJBQU8sSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsQ0FBakI7QUFGdkIsaUJBR1MsQ0FIVDtBQUdnQix1QkFBTyxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQjtBQUh2QjtlQUlBLElBQUk7SUFOQzs7SUFRVCxJQUFDLENBQUEsa0JBQUQsR0FBcUIsU0FBQyxJQUFEO2VBQVUsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiO0lBQVY7O0lBQ3JCLElBQUMsQ0FBQSxtQkFBRCxHQUFzQixTQUFDLElBQUQ7ZUFBVSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQVI7SUFBVjs7Ozs7O0FBRTFCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMCAgICAwMDAwMDAwMDAgIDAwMCAgICAgICAwMDAwMDAwIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cblF1YXRlcm5pb24gPSByZXF1aXJlICcuL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblxuY2xhc3MgRmFjZVxuXG4gICAgQFggID0gMFxuICAgIEBZICA9IDFcbiAgICBAWiAgPSAyXG4gICAgQE5YID0gM1xuICAgIEBOWSA9IDRcbiAgICBATlogPSA1XG4gICAgXG4gICAgQG9yaWVudGF0aW9uOiAoZmFjZSkgLT5cbiAgICAgICAgc3dpdGNoIGZhY2UgJSA2XG4gICAgICAgICAgIHdoZW4gMCB0aGVuIHJldHVybiBRdWF0ZXJuaW9uLnJvdF85MF9ZXG4gICAgICAgICAgIHdoZW4gMSB0aGVuIHJldHVybiBRdWF0ZXJuaW9uLnJvdF8yNzBfWFxuICAgICAgICAgICB3aGVuIDIgdGhlbiByZXR1cm4gUXVhdGVybmlvbi5yb3RfMFxuICAgICAgICAgICB3aGVuIDMgdGhlbiByZXR1cm4gUXVhdGVybmlvbi5yb3RfMjcwX1lcbiAgICAgICAgICAgd2hlbiA0IHRoZW4gcmV0dXJuIFF1YXRlcm5pb24ucm90XzkwX1hcbiAgICAgICAgICAgd2hlbiA1IHRoZW4gcmV0dXJuIFF1YXRlcm5pb24ucm90XzE4MF9YXG5cbiAgICBAbm9ybWFsOiAoZmFjZSkgLT5cbiAgICAgICAgbyA9IChmYWNlIDwgMykgYW5kIDEgb3IgLTFcbiAgICAgICAgc3dpdGNoIGZhY2UgJSAzIFxuICAgICAgICAgICAgd2hlbiAwIHRoZW4gcmV0dXJuIG5ldyBWZWN0b3IgbywgMCwgMFxuICAgICAgICAgICAgd2hlbiAxIHRoZW4gcmV0dXJuIG5ldyBWZWN0b3IgMCwgbywgMFxuICAgICAgICAgICAgd2hlbiAyIHRoZW4gcmV0dXJuIG5ldyBWZWN0b3IgMCwgMCwgb1xuICAgICAgICBuZXcgVmVjdG9yXG5cbiAgICBAb3JpZW50YXRpb25Gb3JGYWNlOiAoZmFjZSkgLT4gQG9yaWVudGF0aW9uIGZhY2VcbiAgICBAbm9ybWFsVmVjdG9yRm9yRmFjZTogKGZhY2UpIC0+IEBub3JtYWwgZmFjZVxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gRmFjZVxuIl19
//# sourceURL=../coffee/face.coffee