// koffee 1.4.0
var Action, Bullet, Item, Material, Timer, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

_ = require('kxk')._;

Item = require('./item');

Action = require('./action');

Timer = require('./timer');

Material = require('./material');

Bullet = (function(superClass) {
    extend(Bullet, superClass);

    function Bullet() {
        this.size = 0.2;
        this.shooter = null;
        Bullet.__super__.constructor.apply(this, arguments);
        this.addAction(new Action(this, Action.FLY, "fly", 40));
        this.addAction(new Action(this, Action.EXPLODE, "explode", 200));
    }

    Bullet.prototype.del = function() {
        if (this.mesh != null) {
            world.scene.remove(this.mesh);
            Timer.removeActionsOfObject(this);
            _.pull(world.objects, this);
            return this.mesh = null;
        }
    };

    Bullet.prototype.createMesh = function() {
        var geom;
        geom = new THREE.SphereGeometry(1, 16, 16);
        this.mesh = new THREE.Mesh(geom, Material.bullet.clone());
        return this.mesh.scale.set(this.size, this.size, this.size);
    };

    Bullet.shootFromBot = function(bot) {
        var bullet;
        bullet = new Bullet();
        world.addObject(bullet);
        bullet.direction = bot.currentDir();
        bullet.setPosition(bot.position.plus(bullet.direction.mul(0.8)));
        bullet.shooter = bot;
        bullet.mesh.material.color.set(bot.mesh.material.color);
        world.playSound('BULLET_SHOT', bot.getPos());
        if (bullet.hitObjectAtPos(bot.position.plus(bullet.direction))) {
            return;
        }
        return Timer.addAction(bullet.getActionWithId(Action.FLY));
    };

    Bullet.prototype.performAction = function(action) {
        var ref, relTime;
        relTime = action.getRelativeTime();
        if (action.id === Action.FLY) {
            return this.current_position = this.position.plus(this.direction.mul(relTime));
        } else if (action.id === Action.EXPLODE) {
            this.size = 0.2 + relTime / 2.0;
            return (ref = this.mesh) != null ? ref.material.opacity = 0.8 * (1.0 - relTime) : void 0;
        }
    };

    Bullet.prototype.step = function() {
        this.mesh.position.copy(this.current_position);
        return this.mesh.scale.set(this.size, this.size, this.size);
    };

    Bullet.prototype.hitObjectAtPos = function(pos) {
        var hitObject, ref, ref1;
        if ((ref = world.switchAtPos(pos)) != null) {
            ref.bulletImpact();
        }
        if (world.isInvalidPos(pos) || world.isOccupiedPos(pos)) {
            hitObject = world.getRealOccupantAtPos(pos);
            if (hitObject !== this.shooter) {
                if (hitObject != null) {
                    hitObject.bulletImpact();
                    world.playSound((ref1 = typeof hitObject.bulletHitSound === "function" ? hitObject.bulletHitSound() : void 0) != null ? ref1 : 'BULLET_HIT_OBJECT');
                } else {
                    world.playSound('BULLET_HIT_WALL', pos);
                }
                Timer.addAction(this.getActionWithId(Action.EXPLODE));
                return true;
            }
        }
        return false;
    };

    Bullet.prototype.finishAction = function(action) {
        if (action.name === "fly") {
            return this.position = this.current_position;
        }
    };

    Bullet.prototype.actionFinished = function(action) {
        if (action.id === Action.FLY) {
            if (this.hitObjectAtPos(this.position.plus(this.direction.mul(0.5)))) {
                return;
            }
            return Timer.addAction(this.getActionWithId(Action.FLY));
        } else if (action.id === Action.EXPLODE) {
            return this.del();
        }
    };

    return Bullet;

})(Item);

module.exports = Bullet;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsbGV0LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSx3Q0FBQTtJQUFBOzs7QUFBRSxJQUFNLE9BQUEsQ0FBUSxLQUFSOztBQUNSLElBQUEsR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxNQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVI7O0FBQ1gsS0FBQSxHQUFXLE9BQUEsQ0FBUSxTQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFFTDs7O0lBRUMsZ0JBQUE7UUFDQyxJQUFDLENBQUEsSUFBRCxHQUFRO1FBQ1IsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLHlDQUFBLFNBQUE7UUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksTUFBSixDQUFXLElBQVgsRUFBYyxNQUFNLENBQUMsR0FBckIsRUFBOEIsS0FBOUIsRUFBeUMsRUFBekMsQ0FBWDtRQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixTQUE5QixFQUF5QyxHQUF6QyxDQUFYO0lBTEQ7O3FCQU9ILEdBQUEsR0FBSyxTQUFBO1FBQ0QsSUFBRyxpQkFBSDtZQUNJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsSUFBcEI7WUFDQSxLQUFLLENBQUMscUJBQU4sQ0FBNEIsSUFBNUI7WUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQUssQ0FBQyxPQUFiLEVBQXNCLElBQXRCO21CQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FKWjs7SUFEQzs7cUJBT0wsVUFBQSxHQUFZLFNBQUE7QUFDUixZQUFBO1FBQUEsSUFBQSxHQUFPLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FBeUIsQ0FBekIsRUFBNEIsRUFBNUIsRUFBZ0MsRUFBaEM7UUFDUCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSyxDQUFDLElBQVYs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LE9BQXhCLENBQWhCO0FBQ0EsdUJBQU8sS0FQWDthQUZKOztlQVVBO0lBZFk7O3FCQWdCaEIsWUFBQSxHQUFjLFNBQUMsTUFBRDtRQUFZLElBQWlDLE1BQU0sQ0FBQyxJQUFQLEtBQWUsS0FBaEQ7bUJBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsaUJBQWI7O0lBQVo7O3FCQUVkLGNBQUEsR0FBZ0IsU0FBQyxNQUFEO1FBQ1osSUFBRyxNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxHQUF2QjtZQUNJLElBQUcsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsR0FBZixDQUFmLENBQWhCLENBQUg7QUFDSSx1QkFESjs7bUJBRUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLEdBQXhCLENBQWhCLEVBSEo7U0FBQSxNQUlLLElBQUcsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsT0FBdkI7bUJBQ0QsSUFBQyxDQUFBLEdBQUQsQ0FBQSxFQURDOztJQUxPOzs7O0dBaEVDOztBQXdFckIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwICAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwMCAgICAgMDAwICAgXG5cbnsgXyB9ID0gcmVxdWlyZSAna3hrJ1xuSXRlbSAgICAgPSByZXF1aXJlICcuL2l0ZW0nXG5BY3Rpb24gICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuVGltZXIgICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuTWF0ZXJpYWwgPSByZXF1aXJlICcuL21hdGVyaWFsJ1xuXG5jbGFzcyBCdWxsZXQgZXh0ZW5kcyBJdGVtXG4gICAgXG4gICAgQDogKCkgLT5cbiAgICAgICAgQHNpemUgPSAwLjJcbiAgICAgICAgQHNob290ZXIgPSBudWxsXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRkxZLCAgICAgXCJmbHlcIiwgICAgIDQwXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uRVhQTE9ERSwgXCJleHBsb2RlXCIsIDIwMFxuICAgICAgICBcbiAgICBkZWw6IC0+XG4gICAgICAgIGlmIEBtZXNoP1xuICAgICAgICAgICAgd29ybGQuc2NlbmUucmVtb3ZlIEBtZXNoXG4gICAgICAgICAgICBUaW1lci5yZW1vdmVBY3Rpb25zT2ZPYmplY3QgQFxuICAgICAgICAgICAgXy5wdWxsIHdvcmxkLm9iamVjdHMsIEBcbiAgICAgICAgICAgIEBtZXNoID0gbnVsbFxuXG4gICAgY3JlYXRlTWVzaDogLT5cbiAgICAgICAgZ2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSAxLCAxNiwgMTZcbiAgICAgICAgQG1lc2ggPSBuZXcgVEhSRUUuTWVzaCBnZW9tLCBNYXRlcmlhbC5idWxsZXQuY2xvbmUoKVxuICAgICAgICBAbWVzaC5zY2FsZS5zZXQgQHNpemUsIEBzaXplLCBAc2l6ZVxuICAgICAgICAgICAgXG4gICAgQHNob290RnJvbUJvdDogKGJvdCkgLT5cbiAgICAgICAgYnVsbGV0ID0gbmV3IEJ1bGxldCgpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdCBidWxsZXQgXG4gICAgICAgIGJ1bGxldC5kaXJlY3Rpb24gPSBib3QuY3VycmVudERpcigpXG4gICAgICAgIGJ1bGxldC5zZXRQb3NpdGlvbiBib3QucG9zaXRpb24ucGx1cyBidWxsZXQuZGlyZWN0aW9uLm11bCAwLjhcbiAgICAgICAgYnVsbGV0LnNob290ZXIgPSBib3RcbiAgICAgICAgYnVsbGV0Lm1lc2gubWF0ZXJpYWwuY29sb3Iuc2V0IGJvdC5tZXNoLm1hdGVyaWFsLmNvbG9yXG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQlVMTEVUX1NIT1QnLCBib3QuZ2V0UG9zKClcbiAgICBcbiAgICAgICAgcmV0dXJuIGlmIGJ1bGxldC5oaXRPYmplY3RBdFBvcyBib3QucG9zaXRpb24ucGx1cyBidWxsZXQuZGlyZWN0aW9uXG4gICAgXG4gICAgICAgIFRpbWVyLmFkZEFjdGlvbiBidWxsZXQuZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5GTFkgXG4gICAgXG4gICAgcGVyZm9ybUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgcmVsVGltZSA9IGFjdGlvbi5nZXRSZWxhdGl2ZVRpbWUoKSAgICAgICAgXG4gICAgICAgIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uRkxZXG4gICAgICAgICAgICBAY3VycmVudF9wb3NpdGlvbiA9IEBwb3NpdGlvbi5wbHVzIEBkaXJlY3Rpb24ubXVsIHJlbFRpbWVcbiAgICAgICAgZWxzZSBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkVYUExPREVcbiAgICAgICAgICAgIEBzaXplID0gMC4yICsgcmVsVGltZS8yLjBcbiAgICAgICAgICAgIEBtZXNoPy5tYXRlcmlhbC5vcGFjaXR5ID0gMC44ICogKDEuMC1yZWxUaW1lKVxuICAgIFxuICAgIHN0ZXA6IC0+IFxuICAgICAgICBAbWVzaC5wb3NpdGlvbi5jb3B5IEBjdXJyZW50X3Bvc2l0aW9uXG4gICAgICAgIEBtZXNoLnNjYWxlLnNldCBAc2l6ZSwgQHNpemUsIEBzaXplXG4gICAgXG4gICAgaGl0T2JqZWN0QXRQb3M6IChwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICB3b3JsZC5zd2l0Y2hBdFBvcyhwb3MpPy5idWxsZXRJbXBhY3QoKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIHdvcmxkLmlzSW52YWxpZFBvcyhwb3MpIG9yIHdvcmxkLmlzT2NjdXBpZWRQb3MgcG9zIFxuICAgICAgICAgICAgaGl0T2JqZWN0ID0gd29ybGQuZ2V0UmVhbE9jY3VwYW50QXRQb3MgcG9zIFxuICAgICAgICAgICAgaWYgaGl0T2JqZWN0ICE9IEBzaG9vdGVyXG4gICAgICAgICAgICAgICAgaWYgaGl0T2JqZWN0P1xuICAgICAgICAgICAgICAgICAgICBoaXRPYmplY3QuYnVsbGV0SW1wYWN0KClcbiAgICAgICAgICAgICAgICAgICAgd29ybGQucGxheVNvdW5kIGhpdE9iamVjdC5idWxsZXRIaXRTb3VuZD8oKSA/ICdCVUxMRVRfSElUX09CSkVDVCdcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQlVMTEVUX0hJVF9XQUxMJywgcG9zXG4gICAgICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkVYUExPREVcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBmYWxzZVxuICAgIFxuICAgIGZpbmlzaEFjdGlvbjogKGFjdGlvbikgLT4gQHBvc2l0aW9uID0gQGN1cnJlbnRfcG9zaXRpb24gaWYgYWN0aW9uLm5hbWUgPT0gXCJmbHlcIlxuICAgIFxuICAgIGFjdGlvbkZpbmlzaGVkOiAoYWN0aW9uKSAtPlxuICAgICAgICBpZiBhY3Rpb24uaWQgPT0gQWN0aW9uLkZMWVxuICAgICAgICAgICAgaWYgQGhpdE9iamVjdEF0UG9zIEBwb3NpdGlvbi5wbHVzIEBkaXJlY3Rpb24ubXVsIDAuNVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgVGltZXIuYWRkQWN0aW9uIEBnZXRBY3Rpb25XaXRoSWQgQWN0aW9uLkZMWVxuICAgICAgICBlbHNlIGlmIGFjdGlvbi5pZCA9PSBBY3Rpb24uRVhQTE9ERVxuICAgICAgICAgICAgQGRlbCgpXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQnVsbGV0XG4iXX0=
//# sourceURL=../coffee/bullet.coffee