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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0b3IuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxJQUFBLHVDQUFBO0lBQUE7OztBQUFFLElBQU0sT0FBQSxDQUFRLEtBQVI7O0FBRVIsTUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUNWLEtBQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7QUFDVixLQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSOztBQUVKOzs7SUFFQyxlQUFBO1FBQ0MsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxNQUFELEdBQVc7UUFDWCx3Q0FBQSxTQUFBO0lBSEQ7O29CQUtILEdBQUEsR0FBSyxTQUFBO2VBQUcsS0FBSyxDQUFDLHFCQUFOLENBQTRCLElBQTVCO0lBQUg7O29CQVFMLGdCQUFBLEdBQWtCLFNBQUMsU0FBRDtRQUNkLElBQUcsSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCLENBQUg7QUFFSSxtQkFBTyxDQUFDLEVBRlo7O1FBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsSUFBSSxLQUFKLENBQVUsSUFBVixFQUFhLFNBQWIsQ0FBYjtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFlO0lBTEQ7O29CQU9sQixnQkFBQSxHQUFrQixTQUFDLElBQUQ7QUFDZCxZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOztZQUNJLElBQVksQ0FBQyxDQUFDLElBQUYsS0FBVSxJQUF0QjtBQUFBLHVCQUFPLEVBQVA7O0FBREo7SUFEYzs7b0JBSWxCLGNBQUEsR0FBZ0IsU0FBQyxPQUFEO0FBQ1osZUFBTyxJQUFDLENBQUEsTUFBTyxDQUFBLE9BQUE7SUFESDs7b0JBU2hCLFNBQUEsR0FBVyxTQUFDLE1BQUQ7ZUFBWSxJQUFDLENBQUEsT0FBUSxDQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVQsR0FBd0I7SUFBcEM7O29CQUVYLEdBQUEsR0FBSyxTQUFBO2VBQUcsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUFIOztvQkFFTCxhQUFBLEdBQWUsU0FBQTtBQUNYLFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7OztnQkFBQSxDQUFDLENBQUUsR0FBSCxDQUFBOztBQUFBO2VBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZBOztvQkFJZixZQUFBLEdBQWMsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQVEsQ0FBQSxNQUFNLENBQUMsSUFBUCxDQUFULEdBQXdCO0lBQXBDOztvQkFFZCxlQUFBLEdBQWlCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO2dDQUFPLENBQUMsQ0FBRSxZQUFILEtBQVM7UUFBaEIsQ0FBakI7SUFBZDs7b0JBQ2pCLGlCQUFBLEdBQW1CLFNBQUMsSUFBRDtlQUFVLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsU0FBQyxDQUFEO2dDQUFPLENBQUMsQ0FBRSxjQUFILEtBQVc7UUFBbEIsQ0FBakI7SUFBVjs7b0JBRW5CLFVBQUEsR0FBWSxTQUFBLEdBQUE7O29CQUNaLGFBQUEsR0FBZSxTQUFBLEdBQUE7O29CQUNmLFlBQUEsR0FBYyxTQUFBLEdBQUE7O29CQUNkLGNBQUEsR0FBZ0IsU0FBQSxHQUFBOztvQkFRaEIsVUFBQSxHQUFZLFNBQUMsTUFBRDtlQUFZLEtBQUssQ0FBQyxZQUFOLENBQW1CLE1BQW5CO0lBQVo7O29CQUVaLFVBQUEsR0FBWSxTQUFDLFFBQUQsRUFBVyxJQUFYO0FBQ1IsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWMsQ0FBZCxFQUFpQixPQUFqQixFQUEwQixRQUExQixFQUFvQyxJQUFwQztRQUNULElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7ZUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixNQUFoQjtJQUhROztvQkFLWixnQkFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxRQUFUO1FBQ2QsSUFBOEIsUUFBQSxJQUFZLENBQTFDO1lBQUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsU0FBbEI7O2VBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsTUFBaEI7SUFGYzs7OztHQWxFRjs7QUFzRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxueyBfIH0gPSByZXF1aXJlICdreGsnXG5cbkFjdGlvbiAgPSByZXF1aXJlICcuL2FjdGlvbidcblRpbWVyICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuRXZlbnQgICA9IHJlcXVpcmUgJy4vZXZlbnQnXG5FbWl0dGVyID0gcmVxdWlyZSAnZXZlbnRzJ1xuXG5jbGFzcyBBY3RvciBleHRlbmRzIEVtaXR0ZXJcbiAgICBcbiAgICBAOiAtPlxuICAgICAgICBAYWN0aW9ucyA9IHt9XG4gICAgICAgIEBldmVudHMgID0gW11cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgZGVsOiAtPiBUaW1lci5yZW1vdmVBY3Rpb25zT2ZPYmplY3QgQFxuICAgICAgICBcbiAgICAjICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgICAgIDAwMCAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgICAgMDAwICAgXG4gICAgIyAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZEV2ZW50V2l0aE5hbWU6IChldmVudE5hbWUpIC0+XG4gICAgICAgIGlmIEBnZXRFdmVudFdpdGhOYW1lIGV2ZW50TmFtZSAjIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgICMga2xvZyBcIkFjdG9yLmFkZEV2ZW50V2l0aE5hbWUgW1dBUk5JTkddICcje2V2ZW50TmFtZX0nIGFscmVhZHkgaW4gdXNlIVwiXG4gICAgICAgICAgICByZXR1cm4gLTE7ICMgc2hvdWxkbid0IGhhcHBlbiBhbnl3YXkgOi0pXG4gICAgICAgIEBldmVudHMucHVzaCBuZXcgRXZlbnQgQCwgZXZlbnROYW1lXG4gICAgICAgIEBldmVudHMubGVuZ3RoLTFcblxuICAgIGdldEV2ZW50V2l0aE5hbWU6IChuYW1lKSAtPlxuICAgICAgICBmb3IgZSBpbiBAZXZlbnRzXG4gICAgICAgICAgICByZXR1cm4gZSBpZiBlLm5hbWUgPT0gbmFtZVxuXG4gICAgZ2V0RXZlbnRXaXRoSWQ6IChldmVudElkKSAtPlxuICAgICAgICByZXR1cm4gQGV2ZW50c1tldmVudElkXVxuXG4gICAgIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuICAgICMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBhZGRBY3Rpb246IChhY3Rpb24pIC0+IEBhY3Rpb25zW2FjdGlvbi5uYW1lXSA9IGFjdGlvblxuICAgICAgICBcbiAgICBkZWw6IC0+IEBkZWxldGVBY3Rpb25zKClcblxuICAgIGRlbGV0ZUFjdGlvbnM6IC0+IFxuICAgICAgICBhPy5kZWwoKSBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICBAYWN0aW9ucyA9IFtdXG4gICAgICAgICAgICBcbiAgICByZW1vdmVBY3Rpb246IChhY3Rpb24pIC0+IEBhY3Rpb25zW2FjdGlvbi5uYW1lXSA9IG51bGxcbiBcbiAgICBnZXRBY3Rpb25XaXRoSWQ6IChhY3Rpb25JZCkgLT4gXy5maW5kIEBhY3Rpb25zLCAoYSkgLT4gYT8uaWQgPT0gYWN0aW9uSWRcbiAgICBnZXRBY3Rpb25XaXRoTmFtZTogKG5hbWUpIC0+IF8uZmluZCBAYWN0aW9ucywgKGEpIC0+IGE/Lm5hbWUgPT0gbmFtZVxuXG4gICAgaW5pdEFjdGlvbjogLT5cbiAgICBwZXJmb3JtQWN0aW9uOiAtPlxuICAgIGZpbmlzaEFjdGlvbjogLT4gXG4gICAgYWN0aW9uRmluaXNoZWQ6IC0+IFxuICAgICAgIFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgMDAgICAgIDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAgIFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiBcbiAgICBzdG9wQWN0aW9uOiAoYWN0aW9uKSAtPiBUaW1lci5yZW1vdmVBY3Rpb24gYWN0aW9uIFxuICAgICAgIFxuICAgIHN0YXJ0VGltZXI6IChkdXJhdGlvbiwgbW9kZSkgLT5cbiAgICAgICAgYWN0aW9uID0gbmV3IEFjdGlvbiBALCAwLCBcInRpbWVyXCIsIGR1cmF0aW9uLCBtb2RlXG4gICAgICAgIEBhY3Rpb25zLnB1c2ggYWN0aW9uXG4gICAgICAgIFRpbWVyLmFkZEFjdGlvbiBhY3Rpb25cbiAgICAgICAgXG4gICAgc3RhcnRUaW1lZEFjdGlvbjogKGFjdGlvbiwgZHVyYXRpb24pIC0+XG4gICAgICAgIGFjdGlvbi5kdXJhdGlvbiA9IGR1cmF0aW9uIGlmIGR1cmF0aW9uID49IDBcbiAgICAgICAgVGltZXIuYWRkQWN0aW9uIGFjdGlvbiAgICAgICAgXG4gIFxubW9kdWxlLmV4cG9ydHMgPSBBY3RvclxuIl19
//# sourceURL=../coffee/actor.coffee