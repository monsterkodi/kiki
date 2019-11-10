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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9tYi5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsd0NBQUE7SUFBQTs7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLE1BQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxNQUFBLEdBQVcsT0FBQSxDQUFRLGNBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUVMOzs7bUJBRUYsZUFBQSxHQUFpQixTQUFBO2VBQUc7SUFBSDs7SUFFZCxjQUFBO0FBRUMsWUFBQTtRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVk7UUFDWixJQUFDLENBQUEsSUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLFFBQUQsR0FBWTtRQUVaLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxvQkFBVixDQUErQixDQUEvQjtRQUNQLEtBQUEsR0FBUSxJQUFJLEtBQUssQ0FBQyxvQkFBVixDQUErQixDQUEvQjtRQUNSLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLENBQWQ7UUFDQSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVg7UUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQVEsQ0FBQyxJQUE5QjtRQUNSLElBQUMsQ0FBQSxVQUFELENBQUE7UUFDQSx1Q0FBQSxTQUFBO1FBRUEsSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCO1FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE1BQXJCLEVBQThCLFVBQTlCLEVBQTBDLElBQTFDLEVBQWdELE1BQU0sQ0FBQyxVQUF2RCxDQUFYO1FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLFNBQTlCLEVBQXlD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Q0FBQSxFQVJKOztJQURVOzttQkFXZCxhQUFBLEdBQWUsU0FBQyxNQUFEO0FBRVgsZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsTUFEaEI7Z0JBQzZCLElBQUMsQ0FBQSxLQUFELElBQVUsTUFBTSxDQUFDLGdCQUFQLENBQUEsQ0FBQSxHQUE0QjtBQUExRDtBQURULGlCQUVTLE1BQU0sQ0FBQyxPQUZoQjtnQkFFNkIsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLEdBQU0sTUFBTSxDQUFDLGVBQVAsQ0FBQTtBQUFsQztBQUZULGlCQUdTLE1BQU0sQ0FBQyxPQUhoQjtnQkFHNkIsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsZUFBUCxDQUFBO0FBQTVCO0FBSFQ7Z0JBS1Esd0NBQU0sTUFBTjtBQUNBO0FBTlI7ZUFPQSxJQUFDLENBQUEsVUFBRCxDQUFBO0lBVFc7O21CQVdmLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO0FBQ1osZ0JBQU8sTUFBTSxDQUFDLEVBQWQ7QUFBQSxpQkFDUyxNQUFNLENBQUMsT0FEaEI7dUJBQzZCLElBQUMsQ0FBQSxHQUFELENBQUE7QUFEN0IsaUJBRVMsTUFBTSxDQUFDLE9BRmhCO2dCQUdRLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFDLENBQUEsU0FBdEI7Z0JBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsZUFBaEIsRUFBaUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFqQzt1QkFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLE9BQXhCLENBQWxCO0FBTFI7dUJBT1EseUNBQU0sTUFBTjtBQVBSO0lBRFk7Ozs7R0ExRUQ7O0FBb0ZuQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwICBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuXG5QdXNoYWJsZSA9IHJlcXVpcmUgJy4vcHVzaGFibGUnXG5BY3Rpb24gICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVmVjdG9yICAgPSByZXF1aXJlICcuL2xpYi92ZWN0b3InXG5NYXRlcmlhbCA9IHJlcXVpcmUgJy4vbWF0ZXJpYWwnXG5cbmNsYXNzIEJvbWIgZXh0ZW5kcyBQdXNoYWJsZVxuICAgIFxuICAgIGlzU3BhY2VFZ29pc3RpYzogLT4gdHJ1ZVxuICAgIFxuICAgIEA6IC0+XG4gICAgICAgIFxuICAgICAgICBAYW5nbGUgICAgPSAwLjBcbiAgICAgICAgQHNpemUgICAgID0gMC41NVxuICAgICAgICBAc3BsaXR0ZWQgPSBmYWxzZVxuXG4gICAgICAgIGdlb20gPSBuZXcgVEhSRUUuRG9kZWNhaGVkcm9uR2VvbWV0cnkgMVxuICAgICAgICBnZW9tMiA9IG5ldyBUSFJFRS5Eb2RlY2FoZWRyb25HZW9tZXRyeSAxXG4gICAgICAgIGdlb20yLnJvdGF0ZVggVmVjdG9yLkRFRzJSQUQgOTBcbiAgICAgICAgZ2VvbS5tZXJnZSBnZW9tMlxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbWVzaCA9IG5ldyBUSFJFRS5NZXNoIGdlb20sIE1hdGVyaWFsLmJvbWJcbiAgICAgICAgQHVwZGF0ZU1lc2goKVxuICAgICAgICBzdXBlclxuICAgIFxuICAgICAgICBAYWRkRXZlbnRXaXRoTmFtZSAnZXhwbG9kZSdcbiAgICAgICAgXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uUk9UQVRFLCAgXCJyb3RhdGlvblwiLCAyMDAwLCBBY3Rpb24uQ09OVElOVU9VU1xuICAgICAgICBAYWRkQWN0aW9uIG5ldyBBY3Rpb24gQCwgQWN0aW9uLklNUExPREUsIFwiaW1wbG9kZVwiLCAxMDBcbiAgICAgICAgQGFkZEFjdGlvbiBuZXcgQWN0aW9uIEAsIEFjdGlvbi5FWFBMT0RFLCBcImV4cGxvZGVcIiwgMTAwXG4gICAgICAgIFxuICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5ST1RBVEVcblxuICAgIHVwZGF0ZU1lc2g6IC0+IFxuICAgICAgICBhID0gVmVjdG9yLkRFRzJSQUQgQGFuZ2xlIFxuICAgICAgICBAbWVzaC5yb3RhdGlvbi5zZXQgYSwgYS8yLCBhLzRcbiAgICAgICAgQG1lc2guc2NhbGUuc2V0IEBzaXplLCBAc2l6ZSwgQHNpemVcbiAgICAgICAgXG4gICAgc3BsaXR0ZXJJbkRpcmVjdGlvbjogKGRpcikgLT5cbiAgICAgICAgXG4gICAgICAgIHNwbGl0dGVyID0gZmFsc2VcbiAgICAgICAgcG9zID0gQGdldFBvcygpLnBsdXMgZGlyXG4gICAgICAgIFxuICAgICAgICBpZiB3b3JsZC5pc1Vub2NjdXBpZWRQb3MgcG9zXG4gICAgICAgICAgICBzcGxpdHRlciA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb2NjdXBhbnQgPSB3b3JsZC5nZXRSZWFsT2NjdXBhbnRBdFBvcyBwb3NcbiAgICAgICAgICAgIGlmIG9jY3VwYW50XG4gICAgICAgICAgICAgICAgaWYgb2NjdXBhbnQgaW5zdGFuY2VvZiBCb21iXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwYW50LmJ1bGxldEltcGFjdCgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIGlmIHdvcmxkLm1heU9iamVjdFB1c2hUb1BvcyBALCBwb3MsIEBnZXRBY3Rpb25XaXRoSWQoQWN0aW9uLkVYUExPREUpLmR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0dGVyID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIHNwbGl0dGVyXG4gICAgICAgICAgICBTcGxpdHRlciA9IHJlcXVpcmUgJy4vc3BsaXR0ZXInXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBuZXcgU3BsaXR0ZXIoZGlyKSwgcG9zXG4gICAgXG4gICAgYnVsbGV0SW1wYWN0OiAtPlxuICAgICAgICBpZiBub3QgQHNwbGl0dGVkXG4gICAgICAgICAgICBAc3BsaXR0ZWQgPSB0cnVlIFxuICAgICAgICAgICAgZGlyZWN0aW9ucyA9IFtbMSAwIDBdLCBbMCAxIDBdLCBbMCAwIDFdLCBbLTEgMCAwXSwgWzAsLTEgMF0sIFswIDAsLTFdXVxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi42XVxuICAgICAgICAgICAgICAgIEBzcGxpdHRlckluRGlyZWN0aW9uIG5ldyBWZWN0b3IgZGlyZWN0aW9uc1tpXVswXSwgZGlyZWN0aW9uc1tpXVsxXSwgZGlyZWN0aW9uc1tpXVsyXVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5JTVBMT0RFXG4gICAgICAgICAgICB3b3JsZC5wbGF5U291bmQgJ0JPTUJfRVhQTE9ERScsIEBnZXRQb3MoKVxuICAgICAgICAgICAgQGdldEV2ZW50V2l0aE5hbWUoXCJleHBsb2RlXCIpLnRyaWdnZXJBY3Rpb25zKClcbiAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGtsb2cgXCJib21iLnBlcmZvcm1BY3Rpb24gI3thY3Rpb24uaWR9XCJcbiAgICAgICAgc3dpdGNoIGFjdGlvbi5pZFxuICAgICAgICAgICAgd2hlbiBBY3Rpb24uUk9UQVRFICB0aGVuIEBhbmdsZSArPSBhY3Rpb24uZ2V0UmVsYXRpdmVEZWx0YSgpICogMzYwXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5JTVBMT0RFIHRoZW4gQHNpemUgPSAxLjAgLSBhY3Rpb24uZ2V0UmVsYXRpdmVUaW1lKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkVYUExPREUgdGhlbiBAc2l6ZSA9IGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHN1cGVyIGFjdGlvblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBAdXBkYXRlTWVzaCgpXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgIHN3aXRjaCBhY3Rpb24uaWRcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLklNUExPREUgdGhlbiBAZGVsKClcbiAgICAgICAgICAgIHdoZW4gQWN0aW9uLkVYUExPREVcbiAgICAgICAgICAgICAgICBAc3BsaXR0ZXJJbkRpcmVjdGlvbiBAZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kICdCT01CX1NQTElUVEVSJywgQGdldFBvcygpXG4gICAgICAgICAgICAgICAgQHN0YXJ0VGltZWRBY3Rpb24gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uSU1QTE9ERVxuICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICBzdXBlciBhY3Rpb25cbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEJvbWJcbiJdfQ==
//# sourceURL=../coffee/bomb.coffee