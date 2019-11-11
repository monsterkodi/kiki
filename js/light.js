// koffee 1.4.0
var Item, Light, Material, klog,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

klog = require('kxk').klog;

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
        this.point.shadow.camera.near = 0.1;
        this.point.shadow.camera.far = this.radius * 2;
        world.scene.add(this.point);
        geom = new THREE.SphereGeometry(0.3, 16, 16);
        return this.mesh = new THREE.Mesh(geom, Material.bulb);
    };

    Light.prototype.del = function() {
        var ref;
        if (this.shadow) {
            if ((ref = this.point.shadow.map) != null) {
                ref.dispose();
            }
        }
        this.mesh.geometry.dispose();
        world.scene.remove(this.point);
        world.removeLight(this);
        return Light.__super__.del.apply(this, arguments);
    };

    Light.prototype.setPosition = function(pos) {
        Light.__super__.setPosition.call(this, pos);
        return this.point.position.copy(this.position);
    };

    return Light;

})(Item);

module.exports = Light;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLDJCQUFBO0lBQUE7OztBQUFFLE9BQVMsT0FBQSxDQUFRLEtBQVI7O0FBRVgsSUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFFTDs7O0lBRUMsZUFBQyxHQUFEO0FBRUMsWUFBQTtRQUFBLElBQUMsQ0FBQSxNQUFELDZEQUEyQjtRQUMzQixJQUFDLENBQUEsTUFBRCwrREFBMkI7UUFDM0IsSUFBQyxDQUFBLFNBQUQsa0VBQThCO1FBQzlCLEtBQUssQ0FBQyxRQUFOLENBQWUsSUFBZjtRQUNBLHdDQUFBLFNBQUE7UUFDQSxJQUF3Qix3Q0FBeEI7WUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLEdBQUcsQ0FBQyxHQUFqQixFQUFBOztJQVBEOztvQkFTSCxVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksS0FBSyxDQUFDLFVBQVYsQ0FBcUIsUUFBckIsRUFBK0IsSUFBQyxDQUFBLFNBQWhDLEVBQTJDLElBQUMsQ0FBQSxNQUE1QyxFQUFvRCxDQUFwRDtRQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxHQUFvQixJQUFDLENBQUE7UUFDckIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBZCxHQUF5QjtRQUN6QixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFkLEdBQXdCLElBQUksS0FBSyxDQUFDLE9BQVYsQ0FBa0IsSUFBbEIsRUFBdUIsSUFBdkI7UUFDeEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBZCxHQUFxQjtRQUNyQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBckIsR0FBNEI7UUFDNUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQXJCLEdBQTJCLElBQUMsQ0FBQSxNQUFELEdBQVE7UUFFbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxLQUFqQjtRQUVBLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCLEdBQXpCLEVBQTZCLEVBQTdCLEVBQWdDLEVBQWhDO2VBQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFRLENBQUMsSUFBOUI7SUFiQTs7b0JBZVosR0FBQSxHQUFLLFNBQUE7QUFFRCxZQUFBO1FBQUEsSUFBZ0MsSUFBQyxDQUFBLE1BQWpDOzttQkFBaUIsQ0FBRSxPQUFuQixDQUFBO2FBQUE7O1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBZixDQUFBO1FBQ0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFaLENBQW1CLElBQUMsQ0FBQSxLQUFwQjtRQUNBLEtBQUssQ0FBQyxXQUFOLENBQWtCLElBQWxCO2VBQ0EsZ0NBQUEsU0FBQTtJQU5DOztvQkFRTCxXQUFBLEdBQWEsU0FBQyxHQUFEO1FBRVQsdUNBQU0sR0FBTjtlQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxRQUF0QjtJQUhTOzs7O0dBbENHOztBQXVDcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgICAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4jIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgICAwMDAgICBcblxueyBrbG9nIH0gPSByZXF1aXJlICdreGsnXG5cbkl0ZW0gICAgID0gcmVxdWlyZSAnLi9pdGVtJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBMaWdodCBleHRlbmRzIEl0ZW1cbiAgICBcbiAgICBAOiAob3B0KSAtPlxuICAgICAgICBcbiAgICAgICAgQHJhZGl1cyAgICA9IG9wdD8ucmFkaXVzID8gNFxuICAgICAgICBAc2hhZG93ICAgID0gb3B0Py5zaGFkb3cgPyBmYWxzZVxuICAgICAgICBAaW50ZW5zaXR5ID0gb3B0Py5pbnRlbnNpdHkgPyAwLjVcbiAgICAgICAgd29ybGQuYWRkTGlnaHQgQFxuICAgICAgICBzdXBlclxuICAgICAgICBAc2V0UG9zaXRpb24gb3B0LnBvcyBpZiBvcHQ/LnBvcz9cbiAgICAgICAgXG4gICAgY3JlYXRlTWVzaDogLT5cbiAgICAgICAgXG4gICAgICAgIEBwb2ludCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0IDB4ZmZmZmZmLCBAaW50ZW5zaXR5LCBAcmFkaXVzLCAyXG4gICAgICAgIEBwb2ludC5jYXN0U2hhZG93ID0gQHNoYWRvd1xuICAgICAgICBAcG9pbnQuc2hhZG93LmRhcmtuZXNzID0gMC41XG4gICAgICAgIEBwb2ludC5zaGFkb3cubWFwU2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IyIDIwNDggMjA0OFxuICAgICAgICBAcG9pbnQuc2hhZG93LmJpYXMgPSAwLjAxXG4gICAgICAgIEBwb2ludC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjFcbiAgICAgICAgQHBvaW50LnNoYWRvdy5jYW1lcmEuZmFyID0gQHJhZGl1cyoyXG4gICAgICAgIFxuICAgICAgICB3b3JsZC5zY2VuZS5hZGQgQHBvaW50XG4gICAgICAgIFxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5IDAuMyAxNiAxNlxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIE1hdGVyaWFsLmJ1bGJcblxuICAgIGRlbDogLT4gXG5cbiAgICAgICAgQHBvaW50LnNoYWRvdy5tYXA/LmRpc3Bvc2UoKSBpZiBAc2hhZG93XG4gICAgICAgIEBtZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKVxuICAgICAgICB3b3JsZC5zY2VuZS5yZW1vdmUgQHBvaW50XG4gICAgICAgIHdvcmxkLnJlbW92ZUxpZ2h0IEBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgc2V0UG9zaXRpb246IChwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICBzdXBlciBwb3NcbiAgICAgICAgQHBvaW50LnBvc2l0aW9uLmNvcHkgQHBvc2l0aW9uXG5cbm1vZHVsZS5leHBvcnRzID0gTGlnaHRcbiJdfQ==
//# sourceURL=../coffee/light.coffee