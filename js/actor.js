// koffee 1.4.0
var Action, Actor, Emitter, Event, Timer, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

_ = require('kxk')._;

Action = require('./action');

Timer = require('./timer');

Event = require('./event');

Emitter = require('events');

Actor = (function(superClass) {
    extend(Actor, superClass);

    function Actor() {
        this.actions = {};
        this.events = [];
        Actor.__super__.constructor.apply(this, arguments);
    }

    Actor.prototype.del = function() {
        return Timer.removeActionsOfObject(this);
    };

    Actor.prototype.addEventWithName = function(eventName) {
        if (this.getEventWithName(eventName)) {
            return -1;
        }
        this.events.push(new Event(this, eventName));
        return this.events.length - 1;
    };

    Actor.prototype.getEventWithName = function(name) {
        var e, i, len, ref;
        ref = this.events;
        for (i = 0, len = ref.length; i < len; i++) {
            e = ref[i];
            if (e.name === name) {
                return e;
            }
        }
    };

    Actor.prototype.getEventWithId = function(eventId) {
        return this.events[eventId];
    };

    Actor.prototype.addAction = function(action) {
        return this.actions[action.name] = action;
    };

    Actor.prototype.del = function() {
        return this.deleteActions();
    };

    Actor.prototype.deleteActions = function() {
        var a, i, len, ref;
        ref = this.actions;
        for (i = 0, len = ref.length; i < len; i++) {
            a = ref[i];
            if (a != null) {
                a.del();
            }
        }
        return this.actions = [];
    };

    Actor.prototype.removeAction = function(action) {
        return this.actions[action.name] = null;
    };

    Actor.prototype.getActionWithId = function(actionId) {
        return _.find(this.actions, function(a) {
            return (a != null ? a.id : void 0) === actionId;
        });
    };

    Actor.prototype.getActionWithName = function(name) {
        return _.find(this.actions, function(a) {
            return (a != null ? a.name : void 0) === name;
        });
    };

    Actor.prototype.initAction = function() {};

    Actor.prototype.performAction = function() {};

    Actor.prototype.finishAction = function() {};

    Actor.prototype.actionFinished = function() {};

    Actor.prototype.stopAction = function(action) {
        return Timer.removeAction(action);
    };

    Actor.prototype.startTimer = function(duration, mode) {
        var action;
        action = new Action(this, 0, "timer", duration, mode);
        this.actions.push(action);
        return Timer.addAction(action);
    };

    Actor.prototype.startTimedAction = function(action, duration) {
        if (duration >= 0) {
            action.duration = duration;
        }
        return Timer.addAction(action);
    };

    return Actor;

})(Emitter);

module.exports = Actor;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0b3IuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLHVDQUFBO0lBQUE7OztBQUFFLElBQU0sT0FBQSxDQUFRLEtBQVI7O0FBRVIsTUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUNWLEtBQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7QUFDVixLQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSOztBQUVKOzs7SUFFVyxlQUFBO1FBQ1QsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxNQUFELEdBQVc7UUFDWCx3Q0FBQSxTQUFBO0lBSFM7O29CQUtiLEdBQUEsR0FBSyxTQUFBO2VBQUcsS0FBSyxDQUFDLHFCQUFOLENBQTRCLElBQTVCO0lBQUg7O29CQVFMLGdCQUFBLEdBQWtCLFNBQUMsU0FBRDtRQUNkLElBQUcsSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCLENBQUg7QUFFSSxtQkFBTyxDQUFDLEVBRlo7O1FBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsSUFBSSxLQUFKLENBQVUsSUFBVixFQUFhLFNBQWIsQ0FBYjtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFlO0lBTEQ7O29CQU9sQixnQkFBQSxHQUFrQixTQUFDLElBQUQ7QUFDZCxZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQVksQ0FBQyxDQUFDLElBQUYsS0FBVSxJQUF0QjtBQUFBLHVCQUFPLEVBQVA7O0FBREo7SUFEYzs7b0JBSWxCLGNBQUEsR0FBZ0IsU0FBQyxPQUFEO0FBQ1osZUFBTyxJQUFDLENBQUEsTUFBTyxDQUFBLE9BQUE7SUFESDs7b0JBU2hCLFNBQUEsR0FBVyxTQUFDLE1BQUQ7ZUFBWSxJQUFDLENBQUEsT0FBUSxDQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVQsR0FBd0I7SUFBcEM7O29CQUVYLEdBQUEsR0FBSyxTQUFBO2VBQUcsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUFIOztvQkFFTCxhQUFBLEdBQWUsU0FBQTtBQUNYLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFBQSxDQUFDLENBQUUsR0FBSCxDQUFBOztBQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZBOztvQkFJZixZQUFBLEdBQWMsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQVEsQ0FBQSxNQUFNLENBQUMsSUFBUCxDQUFULEdBQXdCO0lBQXBDOztvQkFFZCxlQUFBLEdBQWlCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO2dDQUFPLENBQUMsQ0FBRSxZQUFILEtBQVM7UUFBaEIsQ0FBakI7SUFBZDs7b0JBQ2pCLGlCQUFBLEdBQW1CLFNBQUMsSUFBRDtlQUFVLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO2dDQUFPLENBQUMsQ0FBRSxjQUFILEtBQVc7UUFBbEIsQ0FBakI7SUFBVjs7b0JBRW5CLFVBQUEsR0FBWSxTQUFBLEdBQUE7O29CQUNaLGFBQUEsR0FBZSxTQUFBLEdBQUE7O29CQUNmLFlBQUEsR0FBYyxTQUFBLEdBQUE7O29CQUNkLGNBQUEsR0FBZ0IsU0FBQSxHQUFBOztvQkFRaEIsVUFBQSxHQUFZLFNBQUMsTUFBRDtlQUFZLEtBQUssQ0FBQyxZQUFOLENBQW1CLE1BQW5CO0lBQVo7O29CQUVaLFVBQUEsR0FBWSxTQUFDLFFBQUQsRUFBVyxJQUFYO0FBQ1IsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsQ0FBZCxFQUFpQixPQUFqQixFQUEwQixRQUExQixFQUFvQyxJQUFwQztRQUNULElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7ZUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixNQUFoQjtJQUhROztvQkFLWixnQkFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxRQUFUO1FBQ2QsSUFBOEIsUUFBQSxJQUFZLENBQTFDO1lBQUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsU0FBbEI7O2VBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsTUFBaEI7SUFGYzs7OztHQWxFRjs7QUFzRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxueyBfIH0gPSByZXF1aXJlICdreGsnXG5cbkFjdGlvbiAgPSByZXF1aXJlICcuL2FjdGlvbidcblRpbWVyICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuRXZlbnQgICA9IHJlcXVpcmUgJy4vZXZlbnQnXG5FbWl0dGVyID0gcmVxdWlyZSAnZXZlbnRzJ1xuXG5jbGFzcyBBY3RvciBleHRlbmRzIEVtaXR0ZXJcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogLT4gXG4gICAgICAgIEBhY3Rpb25zID0ge31cbiAgICAgICAgQGV2ZW50cyAgPSBbXVxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICBkZWw6IC0+IFRpbWVyLnJlbW92ZUFjdGlvbnNPZk9iamVjdCBAXG4gICAgICAgIFxuICAgICMgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDAgICAgIDAwMCAgIFxuICAgICMgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAwMDAwICAgICAwMDAgICBcbiAgICAjICAgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgXG4gICAgYWRkRXZlbnRXaXRoTmFtZTogKGV2ZW50TmFtZSkgLT5cbiAgICAgICAgaWYgQGdldEV2ZW50V2l0aE5hbWUgZXZlbnROYW1lICMgdG8gYmUgcmVtb3ZlZFxuICAgICAgICAgICAgIyBsb2cgXCJBY3Rvci5hZGRFdmVudFdpdGhOYW1lIFtXQVJOSU5HXSAnI3tldmVudE5hbWV9JyBhbHJlYWR5IGluIHVzZSFcIlxuICAgICAgICAgICAgcmV0dXJuIC0xOyAjIHNob3VsZG4ndCBoYXBwZW4gYW55d2F5IDotKVxuICAgICAgICBAZXZlbnRzLnB1c2ggbmV3IEV2ZW50IEAsIGV2ZW50TmFtZVxuICAgICAgICBAZXZlbnRzLmxlbmd0aC0xXG5cbiAgICBnZXRFdmVudFdpdGhOYW1lOiAobmFtZSkgLT5cbiAgICAgICAgZm9yIGUgaW4gQGV2ZW50c1xuICAgICAgICAgICAgcmV0dXJuIGUgaWYgZS5uYW1lID09IG5hbWVcblxuICAgIGdldEV2ZW50V2l0aElkOiAoZXZlbnRJZCkgLT5cbiAgICAgICAgcmV0dXJuIEBldmVudHNbZXZlbnRJZF1cblxuICAgICMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiAgICAjICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgXG4gICAgYWRkQWN0aW9uOiAoYWN0aW9uKSAtPiBAYWN0aW9uc1thY3Rpb24ubmFtZV0gPSBhY3Rpb25cbiAgICAgICAgXG4gICAgZGVsOiAtPiBAZGVsZXRlQWN0aW9ucygpXG5cbiAgICBkZWxldGVBY3Rpb25zOiAtPiBcbiAgICAgICAgYT8uZGVsKCkgZm9yIGEgaW4gQGFjdGlvbnNcbiAgICAgICAgQGFjdGlvbnMgPSBbXVxuICAgICAgICAgICAgXG4gICAgcmVtb3ZlQWN0aW9uOiAoYWN0aW9uKSAtPiBAYWN0aW9uc1thY3Rpb24ubmFtZV0gPSBudWxsXG4gXG4gICAgZ2V0QWN0aW9uV2l0aElkOiAoYWN0aW9uSWQpIC0+IF8uZmluZCBAYWN0aW9ucywgKGEpIC0+IGE/LmlkID09IGFjdGlvbklkXG4gICAgZ2V0QWN0aW9uV2l0aE5hbWU6IChuYW1lKSAtPiBfLmZpbmQgQGFjdGlvbnMsIChhKSAtPiBhPy5uYW1lID09IG5hbWVcblxuICAgIGluaXRBY3Rpb246IC0+XG4gICAgcGVyZm9ybUFjdGlvbjogLT5cbiAgICBmaW5pc2hBY3Rpb246IC0+IFxuICAgIGFjdGlvbkZpbmlzaGVkOiAtPiBcbiAgICAgICBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gXG4gICAgc3RvcEFjdGlvbjogKGFjdGlvbikgLT4gVGltZXIucmVtb3ZlQWN0aW9uIGFjdGlvbiBcbiAgICAgICBcbiAgICBzdGFydFRpbWVyOiAoZHVyYXRpb24sIG1vZGUpIC0+XG4gICAgICAgIGFjdGlvbiA9IG5ldyBBY3Rpb24gQCwgMCwgXCJ0aW1lclwiLCBkdXJhdGlvbiwgbW9kZVxuICAgICAgICBAYWN0aW9ucy5wdXNoIGFjdGlvblxuICAgICAgICBUaW1lci5hZGRBY3Rpb24gYWN0aW9uXG4gICAgICAgIFxuICAgIHN0YXJ0VGltZWRBY3Rpb246IChhY3Rpb24sIGR1cmF0aW9uKSAtPlxuICAgICAgICBhY3Rpb24uZHVyYXRpb24gPSBkdXJhdGlvbiBpZiBkdXJhdGlvbiA+PSAwXG4gICAgICAgIFRpbWVyLmFkZEFjdGlvbiBhY3Rpb24gICAgICAgIFxuICBcbm1vZHVsZS5leHBvcnRzID0gQWN0b3JcbiJdfQ==
//# sourceURL=../coffee/actor.coffee