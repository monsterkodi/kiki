// koffee 1.4.0
var Action, Bot, Bullet, Mutant, Timer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Bot = require('./bot');

Bullet = require('./bullet');

Timer = require('./timer');

Action = require('./action');

Mutant = (function(superClass) {
    extend(Mutant, superClass);

    function Mutant() {
        Mutant.__super__.constructor.apply(this, arguments);
        this.health = 1;
        this.move = true;
    }

    Mutant.prototype.die = function() {
        world.playSound('BOT_DEATH');
        Mutant.__super__.die.call(this);
        this.setOpacity(0.6);
        return this.getActionWithId(Action.FALL).duration = 40;
    };

    Mutant.prototype.isMutant = function() {
        return true;
    };

    Mutant.prototype.bulletImpact = function() {
        return this.health -= 0.1;
    };

    Mutant.prototype.bulletHitSound = function() {
        return this.health > 0 && 'BULLET_HIT_MUTANT' || 'BULLET_HIT_OBJECT';
    };

    Mutant.prototype.actionFinished = function(action) {
        if (this.health <= 0 && !this.died) {
            this.die();
            if (action.id !== Action.PUSH && action.id !== Action.FALL) {
                return;
            }
        }
        return Mutant.__super__.actionFinished.call(this, action);
    };

    Mutant.prototype.moveBot = function() {
        var changeDirection, changeJumpMode, changeOrientation, fire, forwardPos, noop;
        changeOrientation = Math.random() < 0.3;
        changeJumpMode = Math.random() < 0.3;
        changeDirection = Math.random() < 0.3;
        this.push = Math.random() < 0.1;
        fire = Math.random() < 0.5;
        noop = Math.random() < 0.05;
        if (changeDirection) {
            this.dir_sgn = Math.random() < 0.3 && -1 || 1;
        }
        if (changeJumpMode) {
            if (this.jump || this.dir_sgn > 0) {
                this.jump = !this.jump;
            }
        }
        forwardPos = this.position.plus(this.getDir());
        if (fire && world.isValidPos(forwardPos)) {
            Bullet.shootFromBot(this);
        }
        if (changeOrientation) {
            if (Math.random() < 0.5) {
                this.rotate_action = this.getActionWithId(Action.TURN_LEFT);
            } else {
                this.rotate_action = this.getActionWithId(Action.TURN_RIGHT);
            }
            Timer.addAction(this.rotate_action);
            return;
        }
        if (noop) {
            this.startTimedAction(this.getActionWithId(Action.NOOP), 666);
            return;
        }
        return Mutant.__super__.moveBot.call(this);
    };

    return Mutant;

})(Bot);

module.exports = Mutant;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXV0YW50LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSxrQ0FBQTtJQUFBOzs7QUFBQSxHQUFBLEdBQVMsT0FBQSxDQUFRLE9BQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULEtBQUEsR0FBUyxPQUFBLENBQVEsU0FBUjs7QUFDVCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7OztJQUVXLGdCQUFBO1FBQ1QseUNBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsSUFBRCxHQUFRO0lBSEM7O3FCQUtiLEdBQUEsR0FBSyxTQUFBO1FBQ0QsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEI7UUFDQSw4QkFBQTtRQUNBLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWjtlQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUE2QixDQUFDLFFBQTlCLEdBQXlDO0lBSnhDOztxQkFNTCxRQUFBLEdBQVUsU0FBQTtlQUFHO0lBQUg7O3FCQUNWLFlBQUEsR0FBYyxTQUFBO2VBQUcsSUFBQyxDQUFBLE1BQUQsSUFBVztJQUFkOztxQkFDZCxjQUFBLEdBQWdCLFNBQUE7ZUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVLENBQVYsSUFBZ0IsbUJBQWhCLElBQXVDO0lBQTFDOztxQkFFaEIsY0FBQSxHQUFnQixTQUFDLE1BQUQ7UUFDWixJQUFHLElBQUMsQ0FBQSxNQUFELElBQVcsQ0FBWCxJQUFpQixDQUFJLElBQUMsQ0FBQSxJQUF6QjtZQUNJLElBQUMsQ0FBQSxHQUFELENBQUE7WUFDQSxJQUFHLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLElBQXBCLElBQTZCLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLElBQXBEO0FBQ0ksdUJBREo7YUFGSjs7ZUFJQSwyQ0FBTSxNQUFOO0lBTFk7O3FCQU9oQixPQUFBLEdBQVMsU0FBQTtBQUNMLFlBQUE7UUFBQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0I7UUFDcEMsY0FBQSxHQUFvQixJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0I7UUFDcEMsZUFBQSxHQUFvQixJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0I7UUFDcEMsSUFBQyxDQUFBLElBQUQsR0FBb0IsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCO1FBQ3BDLElBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCO1FBQ3BDLElBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCO1FBRXBDLElBQUcsZUFBSDtZQUNJLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBQWhCLElBQXdCLENBQUMsQ0FBekIsSUFBOEIsRUFEN0M7O1FBR0EsSUFBRyxjQUFIO1lBQ0ksSUFBRyxJQUFDLENBQUEsSUFBRCxJQUFTLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBdkI7Z0JBQ0ksSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFJLElBQUMsQ0FBQSxLQURqQjthQURKOztRQUlBLFVBQUEsR0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQWY7UUFFYixJQUFHLElBQUEsSUFBUSxLQUFLLENBQUMsVUFBTixDQUFpQixVQUFqQixDQUFYO1lBQ0ksTUFBTSxDQUFDLFlBQVAsQ0FBb0IsSUFBcEIsRUFESjs7UUFHQSxJQUFHLGlCQUFIO1lBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsR0FBbkI7Z0JBQ0ksSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBTSxDQUFDLFNBQXhCLEVBRHJCO2FBQUEsTUFBQTtnQkFHSSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFNLENBQUMsVUFBeEIsRUFIckI7O1lBSUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLGFBQWpCO0FBQ0EsbUJBTko7O1FBUUEsSUFBRyxJQUFIO1lBQ0ksSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxJQUF4QixDQUFsQixFQUFpRCxHQUFqRDtBQUNBLG1CQUZKOztlQUlBLGtDQUFBO0lBaENLOzs7O0dBeEJROztBQTBEckIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgICAgMDAwICAgXG4jIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAgICAwMDAgICBcbiMgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG5Cb3QgICAgPSByZXF1aXJlICcuL2JvdCdcbkJ1bGxldCA9IHJlcXVpcmUgJy4vYnVsbGV0J1xuVGltZXIgID0gcmVxdWlyZSAnLi90aW1lcidcbkFjdGlvbiA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuXG5jbGFzcyBNdXRhbnQgZXh0ZW5kcyBCb3RcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT4gXG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBoZWFsdGggPSAxXG4gICAgICAgIEBtb3ZlID0gdHJ1ZVxuICAgICAgICBcbiAgICBkaWU6IC0+XG4gICAgICAgIHdvcmxkLnBsYXlTb3VuZCAnQk9UX0RFQVRIJ1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIEBzZXRPcGFjaXR5IDAuNlxuICAgICAgICBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5GQUxMKS5kdXJhdGlvbiA9IDQwXG4gICAgICBcbiAgICBpc011dGFudDogLT4gdHJ1ZSAgXG4gICAgYnVsbGV0SW1wYWN0OiAtPiBAaGVhbHRoIC09IDAuMVxuICAgIGJ1bGxldEhpdFNvdW5kOiAtPiBAaGVhbHRoID4gMCBhbmQgJ0JVTExFVF9ISVRfTVVUQU5UJyBvciAnQlVMTEVUX0hJVF9PQkpFQ1QnXG4gICAgXG4gICAgYWN0aW9uRmluaXNoZWQ6IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIEBoZWFsdGggPD0gMCBhbmQgbm90IEBkaWVkXG4gICAgICAgICAgICBAZGllKCkgXG4gICAgICAgICAgICBpZiBhY3Rpb24uaWQgIT0gQWN0aW9uLlBVU0ggYW5kIGFjdGlvbi5pZCAhPSBBY3Rpb24uRkFMTCAjIGRlYWQgcGxheWVyIG1heSBvbmx5IGZhbGwsIG5vdGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICBzdXBlciBhY3Rpb25cbiAgICBcbiAgICBtb3ZlQm90OiAtPlxuICAgICAgICBjaGFuZ2VPcmllbnRhdGlvbiA9IE1hdGgucmFuZG9tKCkgPCAwLjNcbiAgICAgICAgY2hhbmdlSnVtcE1vZGUgICAgPSBNYXRoLnJhbmRvbSgpIDwgMC4zXG4gICAgICAgIGNoYW5nZURpcmVjdGlvbiAgID0gTWF0aC5yYW5kb20oKSA8IDAuM1xuICAgICAgICBAcHVzaCAgICAgICAgICAgICA9IE1hdGgucmFuZG9tKCkgPCAwLjFcbiAgICAgICAgZmlyZSAgICAgICAgICAgICAgPSBNYXRoLnJhbmRvbSgpIDwgMC41XG4gICAgICAgIG5vb3AgICAgICAgICAgICAgID0gTWF0aC5yYW5kb20oKSA8IDAuMDVcbiAgICAgICAgIFxuICAgICAgICBpZiBjaGFuZ2VEaXJlY3Rpb25cbiAgICAgICAgICAgIEBkaXJfc2duID0gTWF0aC5yYW5kb20oKSA8IDAuMyBhbmQgLTEgb3IgMVxuICAgIFxuICAgICAgICBpZiBjaGFuZ2VKdW1wTW9kZVxuICAgICAgICAgICAgaWYgQGp1bXAgb3IgQGRpcl9zZ24gPiAwICMgcHJldmVudCBqdW1waW5nIGJhY2t3YXJkc1xuICAgICAgICAgICAgICAgIEBqdW1wID0gbm90IEBqdW1wXG4gICAgXG4gICAgICAgIGZvcndhcmRQb3MgPSBAcG9zaXRpb24ucGx1cyBAZ2V0RGlyKClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBmaXJlICYmIHdvcmxkLmlzVmFsaWRQb3MgZm9yd2FyZFBvcyBcbiAgICAgICAgICAgIEJ1bGxldC5zaG9vdEZyb21Cb3QgQFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGNoYW5nZU9yaWVudGF0aW9uXG4gICAgICAgICAgICBpZiBNYXRoLnJhbmRvbSgpIDwgMC41IFxuICAgICAgICAgICAgICAgIEByb3RhdGVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uVFVSTl9MRUZUIFxuICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEByb3RhdGVfYWN0aW9uID0gQGdldEFjdGlvbldpdGhJZCBBY3Rpb24uVFVSTl9SSUdIVCBcbiAgICAgICAgICAgIFRpbWVyLmFkZEFjdGlvbiBAcm90YXRlX2FjdGlvblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBub29wXG4gICAgICAgICAgICBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkKEFjdGlvbi5OT09QKSwgNjY2XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHN1cGVyKClcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gTXV0YW50XG4iXX0=
//# sourceURL=../coffee/mutant.coffee