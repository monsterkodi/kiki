// koffee 1.4.0
var Action, Event, _, kerror, klog, last, ref;

ref = require('kxk'), last = ref.last, kerror = ref.kerror, klog = ref.klog, _ = ref._;

Action = require('./action');

Event = (function() {
    function Event(obj, name) {
        this.object = obj;
        this.name = name;
        this.time = 0;
        this.actions = [];
        this.finished_actions = [];
    }

    Event.prototype.getTime = function() {
        return this.time;
    };

    Event.prototype.hasAction = function(action) {
        return _.find(this.actions, action);
    };

    Event.prototype.addAction = function(action) {
        if ((action != null) && !this.hasAction(action)) {
            if (world.noRotations && action.id === Action.ROTATE) {
                return;
            }
            this.actions.push(action);
            action.event = this;
            return action.init();
        } else if (action == null) {
            kerror('Event.addAction no action?');
            throw new Error;
        } else {
            return klog("Event.addAction has action " + action.name);
        }
    };

    Event.prototype.removeAllActions = function() {
        var results;
        results = [];
        while (this.actions.length) {
            results.push(this.removeAction(last(this.actions)));
        }
        return results;
    };

    Event.prototype.getActionsOfObject = function(object) {
        return this.actions.filter(function(a) {
            return (a != null ? a.object : void 0) === object;
        });
    };

    Event.prototype.removeActionsOfObject = function(object) {
        var a, i, len, ref1, results;
        ref1 = this.actions;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            a = ref1[i];
            if ((a != null ? a.object : void 0) === object) {
                results.push(this.removeAction(a));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    Event.prototype.removeActionWithName = function(actionName) {
        var a, i, len, ref1, results;
        ref1 = this.actions;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            a = ref1[i];
            if ((a != null ? a.name : void 0) === actionName) {
                results.push(this.removeAction(a));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    Event.prototype.removeAction = function(action) {
        action.event = null;
        action.reset();
        _.pull(this.actions, action);
        return _.pull(this.finished_actions, action);
    };

    Event.prototype.triggerActions = function() {
        var actions, results;
        if (!this.actions.length) {
            return;
        }
        this.time = world.getTime();
        actions = _.clone(this.actions);
        results = [];
        while (actions.length) {
            results.push(actions.pop().performWithEvent(this));
        }
        return results;
    };

    Event.prototype.addFinishedAction = function(action) {
        return this.finished_actions.push(action);
    };

    Event.prototype.finishActions = function() {
        var results;
        results = [];
        while (this.finished_actions.length) {
            results.push(this.finished_actions.pop().finished());
        }
        return results;
    };

    return Event;

})();

module.exports = Event;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFBLE1BQTRCLE9BQUEsQ0FBUSxLQUFSLENBQTVCLEVBQUUsZUFBRixFQUFRLG1CQUFSLEVBQWdCLGVBQWhCLEVBQXNCOztBQUN0QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7SUFFQyxlQUFDLEdBQUQsRUFBTSxJQUFOO1FBQ0MsSUFBQyxDQUFBLE1BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxJQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsSUFBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUxyQjs7b0JBT0gsT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUE7SUFBSjs7b0JBQ1QsU0FBQSxHQUFXLFNBQUMsTUFBRDtlQUFZLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsTUFBakI7SUFBWjs7b0JBRVgsU0FBQSxHQUFXLFNBQUMsTUFBRDtRQUNQLElBQUcsZ0JBQUEsSUFBWSxDQUFJLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxDQUFuQjtZQUNJLElBQVUsS0FBSyxDQUFDLFdBQU4sSUFBc0IsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsTUFBcEQ7QUFBQSx1QkFBQTs7WUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO1lBQ0EsTUFBTSxDQUFDLEtBQVAsR0FBZTttQkFDZixNQUFNLENBQUMsSUFBUCxDQUFBLEVBSko7U0FBQSxNQUtLLElBQU8sY0FBUDtZQUNELE1BQUEsQ0FBTyw0QkFBUDtBQUNBLGtCQUFNLElBQUksTUFGVDtTQUFBLE1BQUE7bUJBSUQsSUFBQSxDQUFLLDZCQUFBLEdBQThCLE1BQU0sQ0FBQyxJQUExQyxFQUpDOztJQU5FOztvQkFZWCxnQkFBQSxHQUFrQixTQUFBO0FBQ2QsWUFBQTtBQUFBO2VBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFmO3lCQUNJLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQSxDQUFLLElBQUMsQ0FBQSxPQUFOLENBQWQ7UUFESixDQUFBOztJQURjOztvQkFJbEIsa0JBQUEsR0FBb0IsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDtnQ0FBTyxDQUFDLENBQUUsZ0JBQUgsS0FBYTtRQUFwQixDQUFoQjtJQUFaOztvQkFFcEIscUJBQUEsR0FBdUIsU0FBQyxNQUFEO0FBQ25CLFlBQUE7QUFBQTtBQUFBO2FBQUEsc0NBQUE7O1lBQ0ksaUJBQW1CLENBQUMsQ0FBRSxnQkFBSCxLQUFhLE1BQWhDOzZCQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxHQUFBO2FBQUEsTUFBQTtxQ0FBQTs7QUFESjs7SUFEbUI7O29CQUl2QixvQkFBQSxHQUFzQixTQUFDLFVBQUQ7QUFDbEIsWUFBQTtBQUFBO0FBQUE7YUFBQSxzQ0FBQTs7WUFDSSxpQkFBbUIsQ0FBQyxDQUFFLGNBQUgsS0FBVyxVQUE5Qjs2QkFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsR0FBQTthQUFBLE1BQUE7cUNBQUE7O0FBREo7O0lBRGtCOztvQkFJdEIsWUFBQSxHQUFjLFNBQUMsTUFBRDtRQUNWLE1BQU0sQ0FBQyxLQUFQLEdBQWU7UUFDZixNQUFNLENBQUMsS0FBUCxDQUFBO1FBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixNQUFqQjtlQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLGdCQUFSLEVBQTBCLE1BQTFCO0lBSlU7O29CQU1kLGNBQUEsR0FBZ0IsU0FBQTtBQUNaLFlBQUE7UUFBQSxJQUFVLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUF2QjtBQUFBLG1CQUFBOztRQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBQTtRQUNSLE9BQUEsR0FBVSxDQUFDLENBQUMsS0FBRixDQUFRLElBQUMsQ0FBQSxPQUFUO0FBQ1Y7ZUFBTSxPQUFPLENBQUMsTUFBZDt5QkFDSSxPQUFPLENBQUMsR0FBUixDQUFBLENBQWEsQ0FBQyxnQkFBZCxDQUErQixJQUEvQjtRQURKLENBQUE7O0lBSlk7O29CQU9oQixpQkFBQSxHQUFtQixTQUFDLE1BQUQ7ZUFDZixJQUFDLENBQUEsZ0JBQWdCLENBQUMsSUFBbEIsQ0FBdUIsTUFBdkI7SUFEZTs7b0JBR25CLGFBQUEsR0FBZSxTQUFBO0FBQ1gsWUFBQTtBQUFBO2VBQU0sSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQXhCO3lCQUNJLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxHQUFsQixDQUFBLENBQXVCLENBQUMsUUFBeEIsQ0FBQTtRQURKLENBQUE7O0lBRFc7Ozs7OztBQUluQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgICAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAgICAwMDBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgICAgMDAwXG4jIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMFxuXG57IGxhc3QsIGtlcnJvciwga2xvZywgXyB9ID0gcmVxdWlyZSAna3hrJ1xuQWN0aW9uID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5cbmNsYXNzIEV2ZW50XG5cbiAgICBAOiAob2JqLCBuYW1lKSAtPlxuICAgICAgICBAb2JqZWN0ICA9IG9ialxuICAgICAgICBAbmFtZSAgICA9IG5hbWVcbiAgICAgICAgQHRpbWUgICAgPSAwXG4gICAgICAgIEBhY3Rpb25zID0gW11cbiAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMgPSBbXVxuXG4gICAgZ2V0VGltZTogLT4gQHRpbWVcbiAgICBoYXNBY3Rpb246IChhY3Rpb24pIC0+IF8uZmluZCBAYWN0aW9ucywgYWN0aW9uXG5cbiAgICBhZGRBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGlmIGFjdGlvbj8gYW5kIG5vdCBAaGFzQWN0aW9uIGFjdGlvblxuICAgICAgICAgICAgcmV0dXJuIGlmIHdvcmxkLm5vUm90YXRpb25zIGFuZCBhY3Rpb24uaWQgPT0gQWN0aW9uLlJPVEFURVxuICAgICAgICAgICAgQGFjdGlvbnMucHVzaCBhY3Rpb25cbiAgICAgICAgICAgIGFjdGlvbi5ldmVudCA9IEBcbiAgICAgICAgICAgIGFjdGlvbi5pbml0KClcbiAgICAgICAgZWxzZSBpZiBub3QgYWN0aW9uP1xuICAgICAgICAgICAga2Vycm9yICdFdmVudC5hZGRBY3Rpb24gbm8gYWN0aW9uPydcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBrbG9nIFwiRXZlbnQuYWRkQWN0aW9uIGhhcyBhY3Rpb24gI3thY3Rpb24ubmFtZX1cIlxuXG4gICAgcmVtb3ZlQWxsQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGFjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAcmVtb3ZlQWN0aW9uIGxhc3QgQGFjdGlvbnNcblxuICAgIGdldEFjdGlvbnNPZk9iamVjdDogKG9iamVjdCkgLT4gQGFjdGlvbnMuZmlsdGVyIChhKSAtPiBhPy5vYmplY3QgPT0gb2JqZWN0XG5cbiAgICByZW1vdmVBY3Rpb25zT2ZPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGZvciBhIGluIEBhY3Rpb25zXG4gICAgICAgICAgICBAcmVtb3ZlQWN0aW9uIGEgaWYgYT8ub2JqZWN0ID09IG9iamVjdFxuXG4gICAgcmVtb3ZlQWN0aW9uV2l0aE5hbWU6IChhY3Rpb25OYW1lKSAtPlxuICAgICAgICBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBhIGlmIGE/Lm5hbWUgPT0gYWN0aW9uTmFtZVxuXG4gICAgcmVtb3ZlQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBhY3Rpb24uZXZlbnQgPSBudWxsXG4gICAgICAgIGFjdGlvbi5yZXNldCgpXG4gICAgICAgIF8ucHVsbCBAYWN0aW9ucywgYWN0aW9uXG4gICAgICAgIF8ucHVsbCBAZmluaXNoZWRfYWN0aW9ucywgYWN0aW9uXG5cbiAgICB0cmlnZ2VyQWN0aW9uczogKCkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBAYWN0aW9ucy5sZW5ndGhcbiAgICAgICAgQHRpbWUgPSB3b3JsZC5nZXRUaW1lKClcbiAgICAgICAgYWN0aW9ucyA9IF8uY2xvbmUgQGFjdGlvbnNcbiAgICAgICAgd2hpbGUgYWN0aW9ucy5sZW5ndGhcbiAgICAgICAgICAgIGFjdGlvbnMucG9wKCkucGVyZm9ybVdpdGhFdmVudCBAXG5cbiAgICBhZGRGaW5pc2hlZEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMucHVzaCBhY3Rpb25cblxuICAgIGZpbmlzaEFjdGlvbnM6ICgpIC0+XG4gICAgICAgIHdoaWxlIEBmaW5pc2hlZF9hY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMucG9wKCkuZmluaXNoZWQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50XG4iXX0=
//# sourceURL=../coffee/event.coffee