// koffee 1.4.0
var Action, Actor, Emitter, Event, Timer, _, last,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

last = require('./tools/tools').last;

Action = require('./action');

Timer = require('./timer');

Event = require('./event');

Emitter = require('events');

_ = require('lodash');

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0b3IuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLDZDQUFBO0lBQUE7OztBQUNBLE9BQ1UsT0FBQSxDQUFRLGVBQVI7O0FBQ1YsTUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUNWLEtBQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7QUFDVixLQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxRQUFSOztBQUNWLENBQUEsR0FBVSxPQUFBLENBQVEsUUFBUjs7QUFFSjs7O0lBRVcsZUFBQTtRQUNULElBQUMsQ0FBQSxPQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsTUFBRCxHQUFXO1FBQ1gsd0NBQUEsU0FBQTtJQUhTOztvQkFLYixHQUFBLEdBQUssU0FBQTtlQUFHLEtBQUssQ0FBQyxxQkFBTixDQUE0QixJQUE1QjtJQUFIOztvQkFRTCxnQkFBQSxHQUFrQixTQUFDLFNBQUQ7UUFDZCxJQUFHLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixTQUFsQixDQUFIO0FBRUksbUJBQU8sQ0FBQyxFQUZaOztRQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQUksS0FBSixDQUFVLElBQVYsRUFBYSxTQUFiLENBQWI7ZUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBZTtJQUxEOztvQkFPbEIsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO0FBQ2QsWUFBQTtBQUFBO0FBQUEsYUFBQSxxQ0FBQTs7WUFDSSxJQUFZLENBQUMsQ0FBQyxJQUFGLEtBQVUsSUFBdEI7QUFBQSx1QkFBTyxFQUFQOztBQURKO0lBRGM7O29CQUlsQixjQUFBLEdBQWdCLFNBQUMsT0FBRDtBQUNaLGVBQU8sSUFBQyxDQUFBLE1BQU8sQ0FBQSxPQUFBO0lBREg7O29CQVNoQixTQUFBLEdBQVcsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQVEsQ0FBQSxNQUFNLENBQUMsSUFBUCxDQUFULEdBQXdCO0lBQXBDOztvQkFFWCxHQUFBLEdBQUssU0FBQTtlQUFHLElBQUMsQ0FBQSxhQUFELENBQUE7SUFBSDs7b0JBRUwsYUFBQSxHQUFlLFNBQUE7QUFDWCxZQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBOzs7Z0JBQUEsQ0FBQyxDQUFFLEdBQUgsQ0FBQTs7QUFBQTtlQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGQTs7b0JBSWYsWUFBQSxHQUFjLFNBQUMsTUFBRDtlQUFZLElBQUMsQ0FBQSxPQUFRLENBQUEsTUFBTSxDQUFDLElBQVAsQ0FBVCxHQUF3QjtJQUFwQzs7b0JBRWQsZUFBQSxHQUFpQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDtnQ0FBTyxDQUFDLENBQUUsWUFBSCxLQUFTO1FBQWhCLENBQWpCO0lBQWQ7O29CQUNqQixpQkFBQSxHQUFtQixTQUFDLElBQUQ7ZUFBVSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLFNBQUMsQ0FBRDtnQ0FBTyxDQUFDLENBQUUsY0FBSCxLQUFXO1FBQWxCLENBQWpCO0lBQVY7O29CQUVuQixVQUFBLEdBQVksU0FBQSxHQUFBOztvQkFDWixhQUFBLEdBQWUsU0FBQSxHQUFBOztvQkFDZixZQUFBLEdBQWMsU0FBQSxHQUFBOztvQkFDZCxjQUFBLEdBQWdCLFNBQUEsR0FBQTs7b0JBUWhCLFVBQUEsR0FBWSxTQUFDLE1BQUQ7ZUFBWSxLQUFLLENBQUMsWUFBTixDQUFtQixNQUFuQjtJQUFaOztvQkFFWixVQUFBLEdBQVksU0FBQyxRQUFELEVBQVcsSUFBWDtBQUNSLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLENBQWQsRUFBaUIsT0FBakIsRUFBMEIsUUFBMUIsRUFBb0MsSUFBcEM7UUFDVCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO2VBQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsTUFBaEI7SUFIUTs7b0JBS1osZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEVBQVMsUUFBVDtRQUNkLElBQThCLFFBQUEsSUFBWSxDQUExQztZQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFNBQWxCOztlQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLE1BQWhCO0lBRmM7Ozs7R0FsRUY7O0FBc0VwQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAgMDAwMDAwMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwXG57XG5sYXN0XG59ICAgICAgID0gcmVxdWlyZSAnLi90b29scy90b29scydcbkFjdGlvbiAgPSByZXF1aXJlICcuL2FjdGlvbidcblRpbWVyICAgPSByZXF1aXJlICcuL3RpbWVyJ1xuRXZlbnQgICA9IHJlcXVpcmUgJy4vZXZlbnQnXG5FbWl0dGVyID0gcmVxdWlyZSAnZXZlbnRzJ1xuXyAgICAgICA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuY2xhc3MgQWN0b3IgZXh0ZW5kcyBFbWl0dGVyXG4gICAgXG4gICAgY29uc3RydWN0b3I6IC0+IFxuICAgICAgICBAYWN0aW9ucyA9IHt9XG4gICAgICAgIEBldmVudHMgID0gW11cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgZGVsOiAtPiBUaW1lci5yZW1vdmVBY3Rpb25zT2ZPYmplY3QgQFxuICAgICAgICBcbiAgICAjICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgICAgIDAwMCAgIFxuICAgICMgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAgICAwMDAgICBcbiAgICAjICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgICAgMDAwICAgXG4gICAgIyAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgIFxuICAgIGFkZEV2ZW50V2l0aE5hbWU6IChldmVudE5hbWUpIC0+XG4gICAgICAgIGlmIEBnZXRFdmVudFdpdGhOYW1lIGV2ZW50TmFtZSAjIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgICMgbG9nIFwiQWN0b3IuYWRkRXZlbnRXaXRoTmFtZSBbV0FSTklOR10gJyN7ZXZlbnROYW1lfScgYWxyZWFkeSBpbiB1c2UhXCJcbiAgICAgICAgICAgIHJldHVybiAtMTsgIyBzaG91bGRuJ3QgaGFwcGVuIGFueXdheSA6LSlcbiAgICAgICAgQGV2ZW50cy5wdXNoIG5ldyBFdmVudCBALCBldmVudE5hbWVcbiAgICAgICAgQGV2ZW50cy5sZW5ndGgtMVxuXG4gICAgZ2V0RXZlbnRXaXRoTmFtZTogKG5hbWUpIC0+XG4gICAgICAgIGZvciBlIGluIEBldmVudHNcbiAgICAgICAgICAgIHJldHVybiBlIGlmIGUubmFtZSA9PSBuYW1lXG5cbiAgICBnZXRFdmVudFdpdGhJZDogKGV2ZW50SWQpIC0+XG4gICAgICAgIHJldHVybiBAZXZlbnRzW2V2ZW50SWRdXG5cbiAgICAjICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuICAgICMgICAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgIFxuICAgIGFkZEFjdGlvbjogKGFjdGlvbikgLT4gQGFjdGlvbnNbYWN0aW9uLm5hbWVdID0gYWN0aW9uXG4gICAgICAgIFxuICAgIGRlbDogLT4gQGRlbGV0ZUFjdGlvbnMoKVxuXG4gICAgZGVsZXRlQWN0aW9uczogLT4gXG4gICAgICAgIGE/LmRlbCgpIGZvciBhIGluIEBhY3Rpb25zXG4gICAgICAgIEBhY3Rpb25zID0gW11cbiAgICAgICAgICAgIFxuICAgIHJlbW92ZUFjdGlvbjogKGFjdGlvbikgLT4gQGFjdGlvbnNbYWN0aW9uLm5hbWVdID0gbnVsbFxuIFxuICAgIGdldEFjdGlvbldpdGhJZDogKGFjdGlvbklkKSAtPiBfLmZpbmQgQGFjdGlvbnMsIChhKSAtPiBhPy5pZCA9PSBhY3Rpb25JZFxuICAgIGdldEFjdGlvbldpdGhOYW1lOiAobmFtZSkgLT4gXy5maW5kIEBhY3Rpb25zLCAoYSkgLT4gYT8ubmFtZSA9PSBuYW1lXG5cbiAgICBpbml0QWN0aW9uOiAtPlxuICAgIHBlcmZvcm1BY3Rpb246IC0+XG4gICAgZmluaXNoQWN0aW9uOiAtPiBcbiAgICBhY3Rpb25GaW5pc2hlZDogLT4gXG4gICAgICAgXG4gICAgIyAgIDAwMDAwMDAwMCAgMDAwICAwMCAgICAgMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuICAgICMgICAgICAwMDAgICAgIDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgXG4gICAgIyAgICAgIDAwMCAgICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgICAgICAwMDAgICAwMDBcbiAgICAjICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuIFxuICAgIHN0b3BBY3Rpb246IChhY3Rpb24pIC0+IFRpbWVyLnJlbW92ZUFjdGlvbiBhY3Rpb24gXG4gICAgICAgXG4gICAgc3RhcnRUaW1lcjogKGR1cmF0aW9uLCBtb2RlKSAtPlxuICAgICAgICBhY3Rpb24gPSBuZXcgQWN0aW9uIEAsIDAsIFwidGltZXJcIiwgZHVyYXRpb24sIG1vZGVcbiAgICAgICAgQGFjdGlvbnMucHVzaCBhY3Rpb25cbiAgICAgICAgVGltZXIuYWRkQWN0aW9uIGFjdGlvblxuICAgICAgICBcbiAgICBzdGFydFRpbWVkQWN0aW9uOiAoYWN0aW9uLCBkdXJhdGlvbikgLT5cbiAgICAgICAgYWN0aW9uLmR1cmF0aW9uID0gZHVyYXRpb24gaWYgZHVyYXRpb24gPj0gMFxuICAgICAgICBUaW1lci5hZGRBY3Rpb24gYWN0aW9uICAgICAgICBcbiAgXG5tb2R1bGUuZXhwb3J0cyA9IEFjdG9yXG4iXX0=
//# sourceURL=../coffee/actor.coffee