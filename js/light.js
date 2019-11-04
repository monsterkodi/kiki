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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHFCQUFBO0lBQUE7OztBQUFBLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBRUw7OztJQUVDLGVBQUMsR0FBRDtBQUNDLFlBQUE7UUFBQSxJQUFDLENBQUEsTUFBRCw2REFBMkI7UUFDM0IsSUFBQyxDQUFBLE1BQUQsK0RBQTJCO1FBQzNCLElBQUMsQ0FBQSxTQUFELGtFQUE4QjtRQUM5QixLQUFLLENBQUMsUUFBTixDQUFlLElBQWY7UUFDQSx3Q0FBQSxTQUFBO1FBQ0EsSUFBd0Isd0NBQXhCO1lBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxHQUFHLENBQUMsR0FBakIsRUFBQTs7SUFORDs7b0JBUUgsVUFBQSxHQUFZLFNBQUE7QUFDUixZQUFBO1FBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUssQ0FBQyxVQUFWLENBQXFCLFFBQXJCLEVBQStCLElBQUMsQ0FBQSxTQUFoQyxFQUEyQyxJQUFDLENBQUEsTUFBNUMsRUFBb0QsQ0FBcEQ7UUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsR0FBb0IsSUFBQyxDQUFBO1FBQ3JCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQWQsR0FBeUI7UUFDekIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZCxHQUF3QixJQUFJLEtBQUssQ0FBQyxPQUFWLENBQWtCLElBQWxCLEVBQXdCLElBQXhCO1FBQ3hCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWQsR0FBcUI7UUFDckIsSUFBQSxHQUFTLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FBeUIsR0FBekIsRUFBOEIsRUFBOUIsRUFBa0MsRUFBbEM7UUFFVCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBckIsR0FBNEI7UUFDNUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXJCLEdBQTJCLElBQUMsQ0FBQSxNQUFELEdBQVE7UUFFbkMsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFRLENBQUMsSUFBOUI7ZUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLEtBQWpCO0lBWlE7O29CQWNaLEdBQUEsR0FBSyxTQUFBO1FBQ0QsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEI7UUFDQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLEtBQXBCO2VBQ0EsZ0NBQUEsU0FBQTtJQUhDOztvQkFLTCxXQUFBLEdBQWEsU0FBQyxHQUFEO1FBQ1QsdUNBQU0sR0FBTjtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxRQUF0QjtJQUZTOzs7O0dBN0JHOztBQWlDcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4jIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIExpZ2h0IGV4dGVuZHMgSXRlbVxuICAgIFxuICAgIEA6IChvcHQpIC0+XG4gICAgICAgIEByYWRpdXMgICAgPSBvcHQ/LnJhZGl1cyA/IDRcbiAgICAgICAgQHNoYWRvdyAgICA9IG9wdD8uc2hhZG93ID8gZmFsc2VcbiAgICAgICAgQGludGVuc2l0eSA9IG9wdD8uaW50ZW5zaXR5ID8gMC41XG4gICAgICAgIHdvcmxkLmFkZExpZ2h0IEBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgQHNldFBvc2l0aW9uIG9wdC5wb3MgaWYgb3B0Py5wb3M/XG4gICAgICAgIFxuICAgIGNyZWF0ZU1lc2g6IC0+XG4gICAgICAgIEBwb2ludCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmLCBAaW50ZW5zaXR5LCBAcmFkaXVzLCAyXG4gICAgICAgIEBwb2ludC5jYXN0U2hhZG93ID0gQHNoYWRvd1xuICAgICAgICBAcG9pbnQuc2hhZG93LmRhcmtuZXNzID0gMC41XG4gICAgICAgIEBwb2ludC5zaGFkb3cubWFwU2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IyIDIwNDgsIDIwNDhcbiAgICAgICAgQHBvaW50LnNoYWRvdy5iaWFzID0gMC4wMVxuICAgICAgICBnZW9tICAgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkgMC4zLCAxNiwgMTZcbiAgICAgICAgIyB3b3JsZC5zY2VuZS5hZGQgbmV3IFRIUkVFLkNhbWVyYUhlbHBlciBAcG9pbnQuc2hhZG93LmNhbWVyYSBpZiBAc2hhZG93XG4gICAgICAgIEBwb2ludC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjFcbiAgICAgICAgQHBvaW50LnNoYWRvdy5jYW1lcmEuZmFyID0gQHJhZGl1cyoyXG4gICAgICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC5idWxiXG4gICAgICAgIHdvcmxkLnNjZW5lLmFkZCBAcG9pbnRcblxuICAgIGRlbDogLT4gXG4gICAgICAgIHdvcmxkLnJlbW92ZUxpZ2h0IEBcbiAgICAgICAgd29ybGQuc2NlbmUucmVtb3ZlIEBwb2ludFxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBzZXRQb3NpdGlvbjogKHBvcykgLT5cbiAgICAgICAgc3VwZXIgcG9zXG4gICAgICAgIEBwb2ludC5wb3NpdGlvbi5jb3B5IEBwb3NpdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0XG4iXX0=
//# sourceURL=../coffee/light.coffee