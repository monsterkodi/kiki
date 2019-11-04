// koffee 1.4.0
var Action, Bomb, Material, Pushable, Vector,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Pushable = require('./pushable');

Action = require('./action');

Vector = require('./lib/vector');

Material = require('./material');

Bomb = (function(superClass) {
    extend(Bomb, superClass);

    Bomb.prototype.isSpaceEgoistic = function() {
        return true;
    };

    function Bomb() {
        var geom, geom2;
        this.angle = 0.0;
        this.size = 0.55;
        this.splitted = false;
        geom = new THREE.DodecahedronGeometry(1);
        geom2 = new THREE.DodecahedronGeometry(1);
        geom2.rotateX(Vector.DEG2RAD(90));
        geom.merge(geom2);
        this.mesh = new THREE.Mesh(geom, Material.bomb);
        this.updateMesh();
        Bomb.__super__.constructor.apply(this, arguments);
        this.addEventWithName('explode');
        this.addAction(new Action(this, Action.ROTATE, "rotation", 2000, Action.CONTINUOUS));
        this.addAction(new Action(this, Action.IMPLODE, "implode", 100));
        this.addAction(new Action(this, Action.EXPLODE, "explode", 100));
        this.startTimedAction(this.getActionWithId(Action.ROTATE));
    }

    Bomb.prototype.updateMesh = function() {
        var a;
        a = Vector.DEG2RAD(this.angle);
        this.mesh.rotation.set(a, a / 2, a / 4);
        return this.mesh.scale.set(this.size, this.size, this.size);
    };

    Bomb.prototype.splitterInDirection = function(dir) {
        var Splitter, occupant, pos, splitter;
        splitter = false;
        pos = this.getPos().plus(dir);
        if (world.isUnoccupiedPos(pos)) {
            splitter = true;
        } else {
            occupant = world.getRealOccupantAtPos(pos);
            if (occupant) {
                if (occupant instanceof Bomb) {
                    occupant.bulletImpact();
                    return;
                }
                if (world.mayObjectPushToPos(this, pos, this.getActionWithId(Action.EXPLODE).duration)) {
                    splitter = true;
                }
            }
        }
        if (splitter) {
            Splitter = require('./splitter');
            return world.addObjectAtPos(new Splitter(dir), pos);
        }
    };

    Bomb.prototype.bulletImpact = function() {
        var directions, i, j;
        if (!this.splitted) {
            this.splitted = true;
            directions = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [-1, 0, 0], [0, -1, 0], [0, 0, -1]];
            for (i = j = 0; j < 6; i = ++j) {
                this.splitterInDirection(new Vector(directions[i][0], directions[i][1], directions[i][2]));
            }
            this.startTimedAction(this.getActionWithId(Action.IMPLODE));
            world.playSound('BOMB_EXPLODE', this.getPos());
            return this.getEventWithName("explode").triggerActions();
        }
    };

    Bomb.prototype.performAction = function(action) {
        switch (action.id) {
            case Action.ROTATE:
                this.angle += action.getRelativeDelta() * 360;
                break;
            case Action.IMPLODE:
                this.size = 1.0 - action.getRelativeTime();
                break;
            case Action.EXPLODE:
                this.size = action.getRelativeTime();
                break;
            default:
                Bomb.__super__.performAction.call(this, action);
                return;
        }
        return this.updateMesh();
    };

    Bomb.prototype.actionFinished = function(action) {
        switch (action.id) {
            case Action.IMPLODE:
                return this.del();
            case Action.EXPLODE:
                this.splitterInDirection(this.direction);
                world.playSound('BOMB_SPLITTER', this.getPos());
                return this.startTimedAction(this.getActionWithId(Action.IMPLODE));
            default:
                return Bomb.__super__.actionFinished.call(this, action);
        }
    };

    return Bomb;

})(Pushable);

module.exports = Bomb;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9tYi5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsd0NBQUE7SUFBQTs7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxNQUFBLEdBQVcsT0FBQSxDQUFRLGNBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMOzs7bUJBRUYsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFSixjQUFBO0FBRVQsWUFBQTtRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVk7UUFDWixJQUFDLENBQUEsSUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLFFBQUQsR0FBWTtRQUVaLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxvQkFBVixDQUErQixDQUEvQjtRQUNQLEtBQUEsR0FBUSxJQUFJLEtBQUssQ0FBQyxvQkFBVixDQUErQixDQUEvQjtRQUNSLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQWQ7UUFDQSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVg7UUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQVEsQ0FBQyxJQUE5QjtRQUNSLElBQUMsQ0FBQSxVQUFELENBQUE7UUFDQSx1Q0FBQSxTQUFBO1FBRUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCO1FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE1BQXJCLEVBQThCLFVBQTlCLEVBQTBDLElBQTFDLEVBQWdELE1BQU0sQ0FBQyxVQUF2RCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLFNBQTlCLEVBQXlD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Q0FBQSxFQVJKOztJQURVOzttQkFXZCxhQUFBLEdBQWUsU0FBQyxNQUFEO0FBRVgsZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsTUFEaEI7Z0JBQzZCLElBQUMsQ0FBQSxLQUFELElBQVUsTUFBTSxDQUFDLGdCQUFQLENBQUEsQ0FBQSxHQUE0QjtBQUExRDtBQURULGlCQUVTLE1BQU0sQ0FBQyxPQUZoQjtnQkFFNkIsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLEdBQU0sTUFBTSxDQUFDLGVBQVAsQ0FBQTtBQUFsQztBQUZULGlCQUdTLE1BQU0sQ0FBQyxPQUhoQjtnQkFHNkIsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsZUFBUCxDQUFBO0FBQTVCO0FBSFQ7Z0JBS1Esd0NBQU0sTUFBTjtBQUNBO0FBTlI7ZUFPQSxJQUFDLENBQUEsVUFBRCxDQUFBO0lBVFc7O21CQVdmLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO0FBQ1osZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsT0FEaEI7dUJBQzZCLElBQUMsQ0FBQSxHQUFELENBQUE7QUFEN0IsaUJBRVMsTUFBTSxDQUFDLE9BRmhCO2dCQUdRLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFDLENBQUEsU0FBdEI7Z0JBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsZUFBaEIsRUFBaUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFqQzt1QkFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCLENBQWxCO0FBTFI7dUJBT1EseUNBQU0sTUFBTjtBQVBSO0lBRFk7Ozs7R0ExRUQ7O0FBb0ZuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuXG5QdXNoYWJsZSA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVmVjdG9yICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEJvbWIgZXh0ZW5kcyBQdXNoYWJsZVxuICAgIFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gdHJ1ZVxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgQGFuZ2xlICAgID0gMC4wXG4gICAgICAgIEBzaXplICAgICA9IDAuNTVcbiAgICAgICAgQHNwbGl0dGVkID0gZmFsc2VcblxuICAgICAgICBnZW9tID0gbmV3IFRIUkVFLkRvZGVjYWhlZHJvbkdlb21ldHJ5IDFcbiAgICAgICAgZ2VvbTIgPSBuZXcgVEhSRUUuRG9kZWNhaGVkcm9uR2VvbWV0cnkgMVxuICAgICAgICBnZW9tMi5yb3RhdGVYIFZlY3Rvci5ERUcyUkFEIDkwXG4gICAgICAgIGdlb20ubWVyZ2UgZ2VvbTJcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC5ib21iXG4gICAgICAgIEB1cGRhdGVNZXNoKClcbiAgICAgICAgc3VwZXJcbiAgICBcbiAgICAgICAgQGFkZEV2ZW50V2l0aE5hbWUgJ2V4cGxvZGUnXG4gICAgICAgIFxuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLlJPVEFURSwgIFwicm90YXRpb25cIiwgMjAwMCwgQWN0aW9uLkNPTlRJTlVPVVNcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5JTVBMT0RFLCBcImltcGxvZGVcIiwgMTAwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRVhQTE9ERSwgXCJleHBsb2RlXCIsIDEwMFxuICAgICAgICBcbiAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uUk9UQVRFXG5cbiAgICB1cGRhdGVNZXNoOiAtPiBcbiAgICAgICAgYSA9IFZlY3Rvci5ERUcyUkFEIEBhbmdsZSBcbiAgICAgICAgQG1lc2gucm90YXRpb24uc2V0IGEsIGEvMiwgYS80XG4gICAgICAgIEBtZXNoLnNjYWxlLnNldCBAc2l6ZSwgQHNpemUsIEBzaXplXG4gICAgICAgIFxuICAgIHNwbGl0dGVySW5EaXJlY3Rpb246IChkaXIpIC0+XG4gICAgICAgIFxuICAgICAgICBzcGxpdHRlciA9IGZhbHNlXG4gICAgICAgIHBvcyA9IEBnZXRQb3MoKS5wbHVzIGRpclxuICAgICAgICBcbiAgICAgICAgaWYgd29ybGQuaXNVbm9jY3VwaWVkUG9zIHBvc1xuICAgICAgICAgICAgc3BsaXR0ZXIgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9jY3VwYW50ID0gd29ybGQuZ2V0UmVhbE9jY3VwYW50QXRQb3MgcG9zXG4gICAgICAgICAgICBpZiBvY2N1cGFudFxuICAgICAgICAgICAgICAgIGlmIG9jY3VwYW50IGluc3RhbmNlb2YgQm9tYlxuICAgICAgICAgICAgICAgICAgICBvY2N1cGFudC5idWxsZXRJbXBhY3QoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiB3b3JsZC5tYXlPYmplY3RQdXNoVG9Qb3MgQCwgcG9zLCBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5FWFBMT0RFKS5kdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICBzcGxpdHRlciA9IHRydWVcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBzcGxpdHRlclxuICAgICAgICAgICAgU3BsaXR0ZXIgPSByZXF1aXJlICcuL3NwbGl0dGVyJ1xuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IFNwbGl0dGVyKGRpciksIHBvc1xuICAgIFxuICAgIGJ1bGxldEltcGFjdDogLT5cbiAgICAgICAgaWYgbm90IEBzcGxpdHRlZFxuICAgICAgICAgICAgQHNwbGl0dGVkID0gdHJ1ZSBcbiAgICAgICAgICAgIGRpcmVjdGlvbnMgPSBbWzEsMCwwXSwgWzAsMSwwXSwgWzAsMCwxXSwgWy0xLDAsMF0sIFswLC0xLDBdLCBbMCwwLC0xXV1cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uNl1cbiAgICAgICAgICAgICAgICBAc3BsaXR0ZXJJbkRpcmVjdGlvbiBuZXcgVmVjdG9yIGRpcmVjdGlvbnNbaV1bMF0sIGRpcmVjdGlvbnNbaV1bMV0sIGRpcmVjdGlvbnNbaV1bMl1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSU1QTE9ERVxuICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT01CX0VYUExPREUnLCBAZ2V0UG9zKClcbiAgICAgICAgICAgIEBnZXRFdmVudFdpdGhOYW1lKFwiZXhwbG9kZVwiKS50cmlnZ2VyQWN0aW9ucygpXG4gICAgXG4gICAgcGVyZm9ybUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgIyBsb2cgXCJib21iLnBlcmZvcm1BY3Rpb24gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUk9UQVRFICB0aGVuIEBhbmdsZSArPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpICogMzYwXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5JTVBMT0RFIHRoZW4gQHNpemUgPSAxLjAgLSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkVYUExPREUgdGhlbiBAc2l6ZSA9IGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAdXBkYXRlTWVzaCgpXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLklNUExPREUgdGhlbiBAZGVsKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkVYUExPREVcbiAgICAgICAgICAgICAgICBAc3BsaXR0ZXJJbkRpcmVjdGlvbiBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT01CX1NQTElUVEVSJywgQGdldFBvcygpXG4gICAgICAgICAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSU1QTE9ERVxuICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEJvbWJcbiJdfQ==
//# sourceURL=../coffee/bomb.coffee