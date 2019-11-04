// koffee 1.4.0
var Item, Light, Material,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Item = require('./item');

Material = require('./material');

Light = (function(superClass) {
    extend(Light, superClass);

    function Light(opt) {
        var ref, ref1, ref2;
        this.radius = (ref = opt != null ? opt.radius : void 0) != null ? ref : 4;
        this.shadow = (ref1 = opt != null ? opt.shadow : void 0) != null ? ref1 : false;
        this.intensity = (ref2 = opt != null ? opt.intensity : void 0) != null ? ref2 : 0.5;
        world.addLight(this);
        Light.__super__.constructor.apply(this, arguments);
        if ((opt != null ? opt.pos : void 0) != null) {
            this.setPosition(opt.pos);
        }
    }

    Light.prototype.createMesh = function() {
        var geom;
        this.point = new THREE.PointLight(0xffffff, this.intensity, this.radius, 2);
        this.point.castShadow = this.shadow;
        this.point.shadow.darkness = 0.5;
        this.point.shadow.mapSize = new THREE.Vector2(2048, 2048);
        this.point.shadow.bias = 0.01;
        geom = new THREE.SphereGeometry(0.3, 16, 16);
        this.point.shadow.camera.near = 0.1;
        this.point.shadow.camera.far = this.radius * 2;
        this.mesh = new THREE.Mesh(geom, Material.bulb);
        return world.scene.add(this.point);
    };

    Light.prototype.del = function() {
        world.removeLight(this);
        world.scene.remove(this.point);
        return Light.__super__.del.apply(this, arguments);
    };

    Light.prototype.setPosition = function(pos) {
        Light.__super__.setPosition.call(this, pos);
        return this.point.position.copy(this.position);
    };

    return Light;

})(Item);

module.exports = Light;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHFCQUFBO0lBQUE7OztBQUFBLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVXLGVBQUMsR0FBRDtBQUNULFlBQUE7UUFBQSxJQUFDLENBQUEsTUFBRCw2REFBMkI7UUFDM0IsSUFBQyxDQUFBLE1BQUQsK0RBQTJCO1FBQzNCLElBQUMsQ0FBQSxTQUFELGtFQUE4QjtRQUM5QixLQUFLLENBQUMsUUFBTixDQUFlLElBQWY7UUFDQSx3Q0FBQSxTQUFBO1FBQ0EsSUFBd0Isd0NBQXhCO1lBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxHQUFHLENBQUMsR0FBakIsRUFBQTs7SUFOUzs7b0JBUWIsVUFBQSxHQUFZLFNBQUE7QUFDUixZQUFBO1FBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUssQ0FBQyxVQUFWLENBQXFCLFFBQXJCLEVBQStCLElBQUMsQ0FBQSxTQUFoQyxFQUEyQyxJQUFDLENBQUEsTUFBNUMsRUFBb0QsQ0FBcEQ7UUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsR0FBb0IsSUFBQyxDQUFBO1FBQ3JCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQWQsR0FBeUI7UUFDekIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZCxHQUF3QixJQUFJLEtBQUssQ0FBQyxPQUFWLENBQWtCLElBQWxCLEVBQXdCLElBQXhCO1FBQ3hCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWQsR0FBcUI7UUFDckIsSUFBQSxHQUFTLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FBeUIsR0FBekIsRUFBOEIsRUFBOUIsRUFBa0MsRUFBbEM7UUFFVCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBckIsR0FBNEI7UUFDNUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXJCLEdBQTJCLElBQUMsQ0FBQSxNQUFELEdBQVE7UUFFbkMsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFRLENBQUMsSUFBOUI7ZUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEtBQWpCO0lBWlE7O29CQWNaLEdBQUEsR0FBSyxTQUFBO1FBQ0QsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEI7UUFDQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLEtBQXBCO2VBQ0EsZ0NBQUEsU0FBQTtJQUhDOztvQkFLTCxXQUFBLEdBQWEsU0FBQyxHQUFEO1FBQ1QsdUNBQU0sR0FBTjtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxRQUF0QjtJQUZTOzs7O0dBN0JHOztBQWlDcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4jIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIExpZ2h0IGV4dGVuZHMgSXRlbVxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAob3B0KSAtPlxuICAgICAgICBAcmFkaXVzICAgID0gb3B0Py5yYWRpdXMgPyA0XG4gICAgICAgIEBzaGFkb3cgICAgPSBvcHQ/LnNoYWRvdyA/IGZhbHNlXG4gICAgICAgIEBpbnRlbnNpdHkgPSBvcHQ/LmludGVuc2l0eSA/IDAuNVxuICAgICAgICB3b3JsZC5hZGRMaWdodCBAXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBzZXRQb3NpdGlvbiBvcHQucG9zIGlmIG9wdD8ucG9zP1xuICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAtPlxuICAgICAgICBAcG9pbnQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZiwgQGludGVuc2l0eSwgQHJhZGl1cywgMlxuICAgICAgICBAcG9pbnQuY2FzdFNoYWRvdyA9IEBzaGFkb3dcbiAgICAgICAgQHBvaW50LnNoYWRvdy5kYXJrbmVzcyA9IDAuNVxuICAgICAgICBAcG9pbnQuc2hhZG93Lm1hcFNpemUgPSBuZXcgVEhSRUUuVmVjdG9yMiAyMDQ4LCAyMDQ4XG4gICAgICAgIEBwb2ludC5zaGFkb3cuYmlhcyA9IDAuMDFcbiAgICAgICAgZ2VvbSAgID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuMywgMTYsIDE2XG4gICAgICAgICMgd29ybGQuc2NlbmUuYWRkIG5ldyBUSFJFRS5DYW1lcmFIZWxwZXIgQHBvaW50LnNoYWRvdy5jYW1lcmEgaWYgQHNoYWRvd1xuICAgICAgICBAcG9pbnQuc2hhZG93LmNhbWVyYS5uZWFyID0gMC4xXG4gICAgICAgIEBwb2ludC5zaGFkb3cuY2FtZXJhLmZhciA9IEByYWRpdXMqMlxuICAgICAgICAgICAgXG4gICAgICAgIEBtZXNoID0gbmV3IFRIUkVFLk1lc2ggZ2VvbSwgTWF0ZXJpYWwuYnVsYlxuICAgICAgICB3b3JsZC5zY2VuZS5hZGQgQHBvaW50XG5cbiAgICBkZWw6IC0+IFxuICAgICAgICB3b3JsZC5yZW1vdmVMaWdodCBAXG4gICAgICAgIHdvcmxkLnNjZW5lLnJlbW92ZSBAcG9pbnRcbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgc2V0UG9zaXRpb246IChwb3MpIC0+XG4gICAgICAgIHN1cGVyIHBvc1xuICAgICAgICBAcG9pbnQucG9zaXRpb24uY29weSBAcG9zaXRpb25cblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodFxuIl19
//# sourceURL=../coffee/light.coffee