// koffee 1.4.0
var Action, Event, _, last, ref;

ref = require('kxk'), last = ref.last, _ = ref._;

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
            console.log('Event.addAction no action?');
            throw new Error;
        } else {
            return console.log("Event.addAction has action " + action.name);
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
            return a.object === object;
        });
    };

    Event.prototype.removeActionsOfObject = function(object) {
        var a, i, len, ref1, results;
        ref1 = this.actions;
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            a = ref1[i];
            if (a.object === object) {
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
            if (a.name === actionName) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFBLE1BQWMsT0FBQSxDQUFRLEtBQVIsQ0FBZCxFQUFFLGVBQUYsRUFBUTs7QUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7SUFFVyxlQUFDLEdBQUQsRUFBTSxJQUFOO1FBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxJQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsSUFBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUxYOztvQkFPYixPQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQTtJQUFKOztvQkFDVCxTQUFBLEdBQVcsU0FBQyxNQUFEO2VBQVksQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixNQUFqQjtJQUFaOztvQkFFWCxTQUFBLEdBQVcsU0FBQyxNQUFEO1FBQ1AsSUFBRyxnQkFBQSxJQUFZLENBQUksSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQW5CO1lBQ0ksSUFBVSxLQUFLLENBQUMsV0FBTixJQUFzQixNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxNQUFwRDtBQUFBLHVCQUFBOztZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7WUFDQSxNQUFNLENBQUMsS0FBUCxHQUFlO21CQUNmLE1BQU0sQ0FBQyxJQUFQLENBQUEsRUFKSjtTQUFBLE1BS0ssSUFBTyxjQUFQO1lBQ0QsT0FBTyxDQUFDLEdBQVIsQ0FBWSw0QkFBWjtBQUNBLGtCQUFNLElBQUksTUFGVDtTQUFBLE1BQUE7bUJBSUYsT0FBQSxDQUFDLEdBQUQsQ0FBSyw2QkFBQSxHQUE4QixNQUFNLENBQUMsSUFBMUMsRUFKRTs7SUFORTs7b0JBWVgsZ0JBQUEsR0FBa0IsU0FBQTtBQUNkLFlBQUE7QUFBQTtlQUFNLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBZjt5QkFDSSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUEsQ0FBSyxJQUFDLENBQUEsT0FBTixDQUFkO1FBREosQ0FBQTs7SUFEYzs7b0JBSWxCLGtCQUFBLEdBQW9CLFNBQUMsTUFBRDtlQUFZLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLE1BQUYsS0FBWTtRQUFuQixDQUFoQjtJQUFaOztvQkFFcEIscUJBQUEsR0FBdUIsU0FBQyxNQUFEO0FBQ25CLFlBQUE7QUFBQTtBQUFBO2FBQUEsc0NBQUE7O1lBQ0ksSUFBbUIsQ0FBQyxDQUFDLE1BQUYsS0FBWSxNQUEvQjs2QkFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsR0FBQTthQUFBLE1BQUE7cUNBQUE7O0FBREo7O0lBRG1COztvQkFJdkIsb0JBQUEsR0FBc0IsU0FBQyxVQUFEO0FBQ2xCLFlBQUE7QUFBQTtBQUFBO2FBQUEsc0NBQUE7O1lBQ0ksSUFBbUIsQ0FBQyxDQUFDLElBQUYsS0FBVSxVQUE3Qjs2QkFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsR0FBQTthQUFBLE1BQUE7cUNBQUE7O0FBREo7O0lBRGtCOztvQkFJdEIsWUFBQSxHQUFjLFNBQUMsTUFBRDtRQUNWLE1BQU0sQ0FBQyxLQUFQLEdBQWU7UUFDZixNQUFNLENBQUMsS0FBUCxDQUFBO1FBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixNQUFqQjtlQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLGdCQUFSLEVBQTBCLE1BQTFCO0lBSlU7O29CQU1kLGNBQUEsR0FBZ0IsU0FBQTtBQUNaLFlBQUE7UUFBQSxJQUFVLENBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUF2QjtBQUFBLG1CQUFBOztRQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBQTtRQUNSLE9BQUEsR0FBVSxDQUFDLENBQUMsS0FBRixDQUFRLElBQUMsQ0FBQSxPQUFUO0FBQ1Y7ZUFBTSxPQUFPLENBQUMsTUFBZDt5QkFDSSxPQUFPLENBQUMsR0FBUixDQUFBLENBQWEsQ0FBQyxnQkFBZCxDQUErQixJQUEvQjtRQURKLENBQUE7O0lBSlk7O29CQU9oQixpQkFBQSxHQUFtQixTQUFDLE1BQUQ7ZUFDZixJQUFDLENBQUEsZ0JBQWdCLENBQUMsSUFBbEIsQ0FBdUIsTUFBdkI7SUFEZTs7b0JBR25CLGFBQUEsR0FBZSxTQUFBO0FBQ1gsWUFBQTtBQUFBO2VBQU0sSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQXhCO3lCQUNJLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxHQUFsQixDQUFBLENBQXVCLENBQUMsUUFBeEIsQ0FBQTtRQURKLENBQUE7O0lBRFc7Ozs7OztBQUluQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAwICAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwICAgMDAwIDAgMDAwICAgICAwMDAgICBcbiMgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgMDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuXG57IGxhc3QsIF8gfSA9IHJlcXVpcmUgJ2t4aydcbkFjdGlvbiA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuXG5jbGFzcyBFdmVudFxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAob2JqLCBuYW1lKSAtPlxuICAgICAgICBAb2JqZWN0ICA9IG9ialxuICAgICAgICBAbmFtZSAgICA9IG5hbWVcbiAgICAgICAgQHRpbWUgICAgPSAwXG4gICAgICAgIEBhY3Rpb25zID0gW11cbiAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMgPSBbXVxuICAgIFxuICAgIGdldFRpbWU6IC0+IEB0aW1lXG4gICAgaGFzQWN0aW9uOiAoYWN0aW9uKSAtPiBfLmZpbmQgQGFjdGlvbnMsIGFjdGlvblxuICAgIFxuICAgIGFkZEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgaWYgYWN0aW9uPyBhbmQgbm90IEBoYXNBY3Rpb24gYWN0aW9uXG4gICAgICAgICAgICByZXR1cm4gaWYgd29ybGQubm9Sb3RhdGlvbnMgYW5kIGFjdGlvbi5pZCA9PSBBY3Rpb24uUk9UQVRFXG4gICAgICAgICAgICBAYWN0aW9ucy5wdXNoIGFjdGlvblxuICAgICAgICAgICAgYWN0aW9uLmV2ZW50ID0gQFxuICAgICAgICAgICAgYWN0aW9uLmluaXQoKVxuICAgICAgICBlbHNlIGlmIG5vdCBhY3Rpb24/XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnRXZlbnQuYWRkQWN0aW9uIG5vIGFjdGlvbj8nXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9nIFwiRXZlbnQuYWRkQWN0aW9uIGhhcyBhY3Rpb24gI3thY3Rpb24ubmFtZX1cIlxuICAgIFxuICAgIHJlbW92ZUFsbEFjdGlvbnM6ICgpIC0+XG4gICAgICAgIHdoaWxlIEBhY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBsYXN0IEBhY3Rpb25zXG4gICAgXG4gICAgZ2V0QWN0aW9uc09mT2JqZWN0OiAob2JqZWN0KSAtPiBAYWN0aW9ucy5maWx0ZXIgKGEpIC0+IGEub2JqZWN0ID09IG9iamVjdFxuICAgIFxuICAgIHJlbW92ZUFjdGlvbnNPZk9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgZm9yIGEgaW4gQGFjdGlvbnNcbiAgICAgICAgICAgIEByZW1vdmVBY3Rpb24gYSBpZiBhLm9iamVjdCA9PSBvYmplY3RcbiAgICBcbiAgICByZW1vdmVBY3Rpb25XaXRoTmFtZTogKGFjdGlvbk5hbWUpIC0+XG4gICAgICAgIGZvciBhIGluIEBhY3Rpb25zXG4gICAgICAgICAgICBAcmVtb3ZlQWN0aW9uIGEgaWYgYS5uYW1lID09IGFjdGlvbk5hbWVcbiAgICBcbiAgICByZW1vdmVBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGFjdGlvbi5ldmVudCA9IG51bGxcbiAgICAgICAgYWN0aW9uLnJlc2V0KClcbiAgICAgICAgXy5wdWxsIEBhY3Rpb25zLCBhY3Rpb25cbiAgICAgICAgXy5wdWxsIEBmaW5pc2hlZF9hY3Rpb25zLCBhY3Rpb25cbiAgICBcbiAgICB0cmlnZ2VyQWN0aW9uczogKCkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBAYWN0aW9ucy5sZW5ndGhcbiAgICAgICAgQHRpbWUgPSB3b3JsZC5nZXRUaW1lKClcbiAgICAgICAgYWN0aW9ucyA9IF8uY2xvbmUgQGFjdGlvbnNcbiAgICAgICAgd2hpbGUgYWN0aW9ucy5sZW5ndGhcbiAgICAgICAgICAgIGFjdGlvbnMucG9wKCkucGVyZm9ybVdpdGhFdmVudCBAXG4gICAgXG4gICAgYWRkRmluaXNoZWRBY3Rpb246IChhY3Rpb24pIC0+IFxuICAgICAgICBAZmluaXNoZWRfYWN0aW9ucy5wdXNoIGFjdGlvblxuICAgIFxuICAgIGZpbmlzaEFjdGlvbnM6ICgpIC0+XG4gICAgICAgIHdoaWxlIEBmaW5pc2hlZF9hY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMucG9wKCkuZmluaXNoZWQoKVxuICAgICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50XG4iXX0=
//# sourceURL=../coffee/event.coffee