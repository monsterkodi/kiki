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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFBLE1BQTRCLE9BQUEsQ0FBUSxLQUFSLENBQTVCLEVBQUUsZUFBRixFQUFRLG1CQUFSLEVBQWdCLGVBQWhCLEVBQXNCOztBQUN0QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7SUFFVyxlQUFDLEdBQUQsRUFBTSxJQUFOO1FBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxJQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsSUFBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUxYOztvQkFPYixPQUFBLEdBQVMsU0FBQTtlQUFHLElBQUMsQ0FBQTtJQUFKOztvQkFDVCxTQUFBLEdBQVcsU0FBQyxNQUFEO2VBQVksQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixNQUFqQjtJQUFaOztvQkFFWCxTQUFBLEdBQVcsU0FBQyxNQUFEO1FBQ1AsSUFBRyxnQkFBQSxJQUFZLENBQUksSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLENBQW5CO1lBQ0ksSUFBVSxLQUFLLENBQUMsV0FBTixJQUFzQixNQUFNLENBQUMsRUFBUCxLQUFhLE1BQU0sQ0FBQyxNQUFwRDtBQUFBLHVCQUFBOztZQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7WUFDQSxNQUFNLENBQUMsS0FBUCxHQUFlO21CQUNmLE1BQU0sQ0FBQyxJQUFQLENBQUEsRUFKSjtTQUFBLE1BS0ssSUFBTyxjQUFQO1lBQ0QsTUFBQSxDQUFPLDRCQUFQO0FBQ0Esa0JBQU0sSUFBSSxNQUZUO1NBQUEsTUFBQTttQkFJRCxJQUFBLENBQUssNkJBQUEsR0FBOEIsTUFBTSxDQUFDLElBQTFDLEVBSkM7O0lBTkU7O29CQVlYLGdCQUFBLEdBQWtCLFNBQUE7QUFDZCxZQUFBO0FBQUE7ZUFBTSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQWY7eUJBQ0ksSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFBLENBQUssSUFBQyxDQUFBLE9BQU4sQ0FBZDtRQURKLENBQUE7O0lBRGM7O29CQUlsQixrQkFBQSxHQUFvQixTQUFDLE1BQUQ7ZUFBWSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQyxNQUFGLEtBQVk7UUFBbkIsQ0FBaEI7SUFBWjs7b0JBRXBCLHFCQUFBLEdBQXVCLFNBQUMsTUFBRDtBQUNuQixZQUFBO0FBQUE7QUFBQTthQUFBLHNDQUFBOztZQUNJLElBQW1CLENBQUMsQ0FBQyxNQUFGLEtBQVksTUFBL0I7NkJBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEdBQUE7YUFBQSxNQUFBO3FDQUFBOztBQURKOztJQURtQjs7b0JBSXZCLG9CQUFBLEdBQXNCLFNBQUMsVUFBRDtBQUNsQixZQUFBO0FBQUE7QUFBQTthQUFBLHNDQUFBOztZQUNJLElBQW1CLENBQUMsQ0FBQyxJQUFGLEtBQVUsVUFBN0I7NkJBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEdBQUE7YUFBQSxNQUFBO3FDQUFBOztBQURKOztJQURrQjs7b0JBSXRCLFlBQUEsR0FBYyxTQUFDLE1BQUQ7UUFDVixNQUFNLENBQUMsS0FBUCxHQUFlO1FBQ2YsTUFBTSxDQUFDLEtBQVAsQ0FBQTtRQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsTUFBakI7ZUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxnQkFBUixFQUEwQixNQUExQjtJQUpVOztvQkFNZCxjQUFBLEdBQWdCLFNBQUE7QUFDWixZQUFBO1FBQUEsSUFBVSxDQUFJLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBdkI7QUFBQSxtQkFBQTs7UUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBQUssQ0FBQyxPQUFOLENBQUE7UUFDUixPQUFBLEdBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFDLENBQUEsT0FBVDtBQUNWO2VBQU0sT0FBTyxDQUFDLE1BQWQ7eUJBQ0ksT0FBTyxDQUFDLEdBQVIsQ0FBQSxDQUFhLENBQUMsZ0JBQWQsQ0FBK0IsSUFBL0I7UUFESixDQUFBOztJQUpZOztvQkFPaEIsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO2VBQ2YsSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQXVCLE1BQXZCO0lBRGU7O29CQUduQixhQUFBLEdBQWUsU0FBQTtBQUNYLFlBQUE7QUFBQTtlQUFNLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxNQUF4Qjt5QkFDSSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsR0FBbEIsQ0FBQSxDQUF1QixDQUFDLFFBQXhCLENBQUE7UUFESixDQUFBOztJQURXOzs7Ozs7QUFJbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwMCAgMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMCAgICAwMDAgMDAwICAgMDAwMDAwMCAgIDAwMCAwIDAwMCAgICAgMDAwICAgXG4jIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgIDAwMDAgICAgIDAwMCAgIFxuIyAwMDAwMDAwMCAgICAgIDAgICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcblxueyBsYXN0LCBrZXJyb3IsIGtsb2csIF8gfSA9IHJlcXVpcmUgJ2t4aydcbkFjdGlvbiA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuXG5jbGFzcyBFdmVudFxuICAgIFxuICAgIGNvbnN0cnVjdG9yOiAob2JqLCBuYW1lKSAtPlxuICAgICAgICBAb2JqZWN0ICA9IG9ialxuICAgICAgICBAbmFtZSAgICA9IG5hbWVcbiAgICAgICAgQHRpbWUgICAgPSAwXG4gICAgICAgIEBhY3Rpb25zID0gW11cbiAgICAgICAgQGZpbmlzaGVkX2FjdGlvbnMgPSBbXVxuICAgIFxuICAgIGdldFRpbWU6IC0+IEB0aW1lXG4gICAgaGFzQWN0aW9uOiAoYWN0aW9uKSAtPiBfLmZpbmQgQGFjdGlvbnMsIGFjdGlvblxuICAgIFxuICAgIGFkZEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgaWYgYWN0aW9uPyBhbmQgbm90IEBoYXNBY3Rpb24gYWN0aW9uXG4gICAgICAgICAgICByZXR1cm4gaWYgd29ybGQubm9Sb3RhdGlvbnMgYW5kIGFjdGlvbi5pZCA9PSBBY3Rpb24uUk9UQVRFXG4gICAgICAgICAgICBAYWN0aW9ucy5wdXNoIGFjdGlvblxuICAgICAgICAgICAgYWN0aW9uLmV2ZW50ID0gQFxuICAgICAgICAgICAgYWN0aW9uLmluaXQoKVxuICAgICAgICBlbHNlIGlmIG5vdCBhY3Rpb24/XG4gICAgICAgICAgICBrZXJyb3IgJ0V2ZW50LmFkZEFjdGlvbiBubyBhY3Rpb24/J1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgXCJFdmVudC5hZGRBY3Rpb24gaGFzIGFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG4gICAgXG4gICAgcmVtb3ZlQWxsQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGFjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAcmVtb3ZlQWN0aW9uIGxhc3QgQGFjdGlvbnNcbiAgICBcbiAgICBnZXRBY3Rpb25zT2ZPYmplY3Q6IChvYmplY3QpIC0+IEBhY3Rpb25zLmZpbHRlciAoYSkgLT4gYS5vYmplY3QgPT0gb2JqZWN0XG4gICAgXG4gICAgcmVtb3ZlQWN0aW9uc09mT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBhIGlmIGEub2JqZWN0ID09IG9iamVjdFxuICAgIFxuICAgIHJlbW92ZUFjdGlvbldpdGhOYW1lOiAoYWN0aW9uTmFtZSkgLT5cbiAgICAgICAgZm9yIGEgaW4gQGFjdGlvbnNcbiAgICAgICAgICAgIEByZW1vdmVBY3Rpb24gYSBpZiBhLm5hbWUgPT0gYWN0aW9uTmFtZVxuICAgIFxuICAgIHJlbW92ZUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgYWN0aW9uLmV2ZW50ID0gbnVsbFxuICAgICAgICBhY3Rpb24ucmVzZXQoKVxuICAgICAgICBfLnB1bGwgQGFjdGlvbnMsIGFjdGlvblxuICAgICAgICBfLnB1bGwgQGZpbmlzaGVkX2FjdGlvbnMsIGFjdGlvblxuICAgIFxuICAgIHRyaWdnZXJBY3Rpb25zOiAoKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBhY3Rpb25zLmxlbmd0aFxuICAgICAgICBAdGltZSA9IHdvcmxkLmdldFRpbWUoKVxuICAgICAgICBhY3Rpb25zID0gXy5jbG9uZSBAYWN0aW9uc1xuICAgICAgICB3aGlsZSBhY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgYWN0aW9ucy5wb3AoKS5wZXJmb3JtV2l0aEV2ZW50IEBcbiAgICBcbiAgICBhZGRGaW5pc2hlZEFjdGlvbjogKGFjdGlvbikgLT4gXG4gICAgICAgIEBmaW5pc2hlZF9hY3Rpb25zLnB1c2ggYWN0aW9uXG4gICAgXG4gICAgZmluaXNoQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGZpbmlzaGVkX2FjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAZmluaXNoZWRfYWN0aW9ucy5wb3AoKS5maW5pc2hlZCgpXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRcbiJdfQ==
//# sourceURL=../coffee/event.coffee