// koffee 1.4.0
var Action, Gate, Light, Material, Switch, Vector,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Vector = require('./lib/vector');

Switch = require('./switch');

Light = require('./light');

Action = require('./action');

Material = require('./material');

Gate = (function(superClass) {
    extend(Gate, superClass);

    Gate.prototype.isSpaceEgoistic = function() {
        return false;
    };

    function Gate(active) {
        Gate.__super__.constructor.call(this, active);
        this.ENTER_EVENT = this.addEventWithName("enter");
        this.value = 0.0;
        this.getActionWithId(Action.ROTATE).duration = 50000;
        this.sound_on = 'GATE_OPEN';
        this.sound_off = 'GATE_CLOSE';
    }

    Gate.prototype.createLight = function() {
        return this.light = new Light({
            pos: this.position,
            radius: 10.0,
            shadow: true
        });
    };

    Gate.prototype.createMesh = function() {
        var t1, t2, t3, torusRadius;
        torusRadius = 0.05;
        t1 = new THREE.TorusBufferGeometry(0.5 - torusRadius, torusRadius, 16, 32);
        this.mesh = new THREE.Mesh(t1, Material.gate);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        t2 = new THREE.TorusGeometry(0.5 - torusRadius, torusRadius, 16, 32);
        t3 = new THREE.TorusGeometry(0.5 - torusRadius, torusRadius, 16, 32);
        t2.rotateY(Vector.DEG2RAD(90));
        t3.rotateX(Vector.DEG2RAD(90));
        t2.merge(t3);
        this.tors = new THREE.Mesh(t2, Material.gate);
        this.tors.castShadow = true;
        this.tors.receiveShadow = true;
        this.mesh.add(this.tors);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        return this.mesh;
    };

    Gate.prototype.bulletImpact = function() {};

    Gate.prototype.newCellMate = function(object) {
        if (object.name === 'player' && this.active) {
            world.playSound('GATE_WARP');
            this.events[this.ENTER_EVENT].triggerActions();
            return this.active = false;
        }
    };

    return Gate;

})(Switch);

module.exports = Gate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsNkNBQUE7SUFBQTs7O0FBQUEsTUFBQSxHQUFXLE9BQUEsQ0FBUSxjQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxLQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVI7O0FBQ1gsTUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFFTDs7O21CQUVGLGVBQUEsR0FBaUIsU0FBQTtlQUFHO0lBQUg7O0lBRUosY0FBQyxNQUFEO1FBQ1Qsc0NBQU0sTUFBTjtRQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLGdCQUFELENBQWtCLE9BQWxCO1FBQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUztRQUNULElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxNQUF4QixDQUErQixDQUFDLFFBQWhDLEdBQTJDO1FBQzNDLElBQUMsQ0FBQSxRQUFELEdBQWE7UUFDYixJQUFDLENBQUEsU0FBRCxHQUFhO0lBTko7O21CQVFiLFdBQUEsR0FBYSxTQUFBO2VBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FDTDtZQUFBLEdBQUEsRUFBUSxJQUFDLENBQUEsUUFBVDtZQUNBLE1BQUEsRUFBUSxJQURSO1lBRUEsTUFBQSxFQUFRLElBRlI7U0FESztJQURBOzttQkFNYixVQUFBLEdBQVksU0FBQTtBQUNSLFlBQUE7UUFBQSxXQUFBLEdBQWM7UUFDZCxFQUFBLEdBQUssSUFBSSxLQUFLLENBQUMsbUJBQVYsQ0FBOEIsR0FBQSxHQUFJLFdBQWxDLEVBQStDLFdBQS9DLEVBQTRELEVBQTVELEVBQWdFLEVBQWhFO1FBRUwsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsRUFBZixFQUFtQixRQUFRLENBQUMsSUFBNUI7UUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUI7UUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO1FBRXRCLEVBQUEsR0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFWLENBQXdCLEdBQUEsR0FBSSxXQUE1QixFQUF5QyxXQUF6QyxFQUFzRCxFQUF0RCxFQUEwRCxFQUExRDtRQUNMLEVBQUEsR0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFWLENBQXdCLEdBQUEsR0FBSSxXQUE1QixFQUF5QyxXQUF6QyxFQUFzRCxFQUF0RCxFQUEwRCxFQUExRDtRQUNMLEVBQUUsQ0FBQyxPQUFILENBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQVg7UUFDQSxFQUFFLENBQUMsT0FBSCxDQUFXLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUFYO1FBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFUO1FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsRUFBZixFQUFtQixRQUFRLENBQUMsSUFBNUI7UUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sR0FBbUI7UUFDbkIsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO1FBQ3RCLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxJQUFYO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLEdBQW1CO1FBQ25CLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBTixHQUFzQjtlQUN0QixJQUFDLENBQUE7SUFuQk87O21CQXFCWixZQUFBLEdBQWMsU0FBQSxHQUFBOzttQkFFZCxXQUFBLEdBQWEsU0FBQyxNQUFEO1FBQ1QsSUFBRyxNQUFNLENBQUMsSUFBUCxLQUFlLFFBQWYsSUFBNEIsSUFBQyxDQUFBLE1BQWhDO1lBQ0ksS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7WUFFQSxJQUFDLENBQUEsTUFBTyxDQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsQ0FBQyxjQUF0QixDQUFBO21CQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFKZDs7SUFEUzs7OztHQXpDRTs7QUFnRG5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgIDAwMDAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuIyAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuXG5WZWN0b3IgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblN3aXRjaCAgID0gcmVxdWlyZSAnLi9zd2l0Y2gnXG5MaWdodCAgICA9IHJlcXVpcmUgJy4vbGlnaHQnXG5BY3Rpb24gICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBHYXRlIGV4dGVuZHMgU3dpdGNoXG4gICAgXG4gICAgaXNTcGFjZUVnb2lzdGljOiAtPiBmYWxzZVxuXG4gICAgY29uc3RydWN0b3I6IChhY3RpdmUpIC0+XG4gICAgICAgIHN1cGVyIGFjdGl2ZVxuICAgICAgICBARU5URVJfRVZFTlQgPSBAYWRkRXZlbnRXaXRoTmFtZSBcImVudGVyXCJcbiAgICAgICAgQHZhbHVlID0gMC4wXG4gICAgICAgIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLlJPVEFURSkuZHVyYXRpb24gPSA1MDAwMCBcbiAgICAgICAgQHNvdW5kX29uICA9ICdHQVRFX09QRU4nXG4gICAgICAgIEBzb3VuZF9vZmYgPSAnR0FURV9DTE9TRSdcblxuICAgIGNyZWF0ZUxpZ2h0OiAtPiBcbiAgICAgICAgQGxpZ2h0ID0gbmV3IExpZ2h0IFxuICAgICAgICAgICAgcG9zOiAgICBAcG9zaXRpb25cbiAgICAgICAgICAgIHJhZGl1czogMTAuMFxuICAgICAgICAgICAgc2hhZG93OiB0cnVlXG4gICAgICAgICAgICBcbiAgICBjcmVhdGVNZXNoOiAoKSAtPiBcbiAgICAgICAgdG9ydXNSYWRpdXMgPSAwLjA1XG4gICAgICAgIHQxID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkgMC41LXRvcnVzUmFkaXVzLCB0b3J1c1JhZGl1cywgMTYsIDMyXG4gICAgICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCB0MSwgTWF0ZXJpYWwuZ2F0ZVxuICAgICAgICBAbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgdDIgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSAwLjUtdG9ydXNSYWRpdXMsIHRvcnVzUmFkaXVzLCAxNiwgMzJcbiAgICAgICAgdDMgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSAwLjUtdG9ydXNSYWRpdXMsIHRvcnVzUmFkaXVzLCAxNiwgMzJcbiAgICAgICAgdDIucm90YXRlWSBWZWN0b3IuREVHMlJBRCA5MCBcbiAgICAgICAgdDMucm90YXRlWCBWZWN0b3IuREVHMlJBRCA5MCBcbiAgICAgICAgdDIubWVyZ2UgdDNcbiAgICAgICAgQHRvcnMgPSBuZXcgVEhSRUUuTWVzaCB0MiwgTWF0ZXJpYWwuZ2F0ZVxuICAgICAgICBAdG9ycy5jYXN0U2hhZG93ID0gdHJ1ZVxuICAgICAgICBAdG9ycy5yZWNlaXZlU2hhZG93ID0gdHJ1ZVxuICAgICAgICBAbWVzaC5hZGQgQHRvcnNcbiAgICAgICAgQG1lc2guY2FzdFNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWVcbiAgICAgICAgQG1lc2hcbiAgICBcbiAgICBidWxsZXRJbXBhY3Q6IC0+XG5cbiAgICBuZXdDZWxsTWF0ZTogKG9iamVjdCkgLT5cbiAgICAgICAgaWYgb2JqZWN0Lm5hbWUgPT0gJ3BsYXllcicgYW5kIEBhY3RpdmVcbiAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnR0FURV9XQVJQJ1xuICAgICAgICAgICAgIyBsb2cgJ2dhdGUgdHJpZ2dlciBlbnRlciBldmVudCcsIEBldmVudHNbQEVOVEVSX0VWRU5UXS5hY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgQGV2ZW50c1tARU5URVJfRVZFTlRdLnRyaWdnZXJBY3Rpb25zKCkgXG4gICAgICAgICAgICBAYWN0aXZlID0gZmFsc2VcbiAgICAgICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gR2F0ZVxuIl19
//# sourceURL=../coffee/gate.coffee