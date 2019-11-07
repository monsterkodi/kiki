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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBOztBQUFBLE1BQTRCLE9BQUEsQ0FBUSxLQUFSLENBQTVCLEVBQUUsZUFBRixFQUFRLG1CQUFSLEVBQWdCLGVBQWhCLEVBQXNCOztBQUN0QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0FBRUg7SUFFQyxlQUFDLEdBQUQsRUFBTSxJQUFOO1FBQ0MsSUFBQyxDQUFBLE1BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxJQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsSUFBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUxyQjs7b0JBT0gsT0FBQSxHQUFTLFNBQUE7ZUFBRyxJQUFDLENBQUE7SUFBSjs7b0JBQ1QsU0FBQSxHQUFXLFNBQUMsTUFBRDtlQUFZLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsTUFBakI7SUFBWjs7b0JBRVgsU0FBQSxHQUFXLFNBQUMsTUFBRDtRQUNQLElBQUcsZ0JBQUEsSUFBWSxDQUFJLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxDQUFuQjtZQUNJLElBQVUsS0FBSyxDQUFDLFdBQU4sSUFBc0IsTUFBTSxDQUFDLEVBQVAsS0FBYSxNQUFNLENBQUMsTUFBcEQ7QUFBQSx1QkFBQTs7WUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxNQUFkO1lBQ0EsTUFBTSxDQUFDLEtBQVAsR0FBZTttQkFDZixNQUFNLENBQUMsSUFBUCxDQUFBLEVBSko7U0FBQSxNQUtLLElBQU8sY0FBUDtZQUNELE1BQUEsQ0FBTyw0QkFBUDtBQUNBLGtCQUFNLElBQUksTUFGVDtTQUFBLE1BQUE7bUJBSUQsSUFBQSxDQUFLLDZCQUFBLEdBQThCLE1BQU0sQ0FBQyxJQUExQyxFQUpDOztJQU5FOztvQkFZWCxnQkFBQSxHQUFrQixTQUFBO0FBQ2QsWUFBQTtBQUFBO2VBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFmO3lCQUNJLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQSxDQUFLLElBQUMsQ0FBQSxPQUFOLENBQWQ7UUFESixDQUFBOztJQURjOztvQkFJbEIsa0JBQUEsR0FBb0IsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsTUFBRixLQUFZO1FBQW5CLENBQWhCO0lBQVo7O29CQUVwQixxQkFBQSxHQUF1QixTQUFDLE1BQUQ7QUFDbkIsWUFBQTtBQUFBO0FBQUE7YUFBQSxzQ0FBQTs7WUFDSSxJQUFtQixDQUFDLENBQUMsTUFBRixLQUFZLE1BQS9COzZCQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxHQUFBO2FBQUEsTUFBQTtxQ0FBQTs7QUFESjs7SUFEbUI7O29CQUl2QixvQkFBQSxHQUFzQixTQUFDLFVBQUQ7QUFDbEIsWUFBQTtBQUFBO0FBQUE7YUFBQSxzQ0FBQTs7WUFDSSxJQUFtQixDQUFDLENBQUMsSUFBRixLQUFVLFVBQTdCOzZCQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxHQUFBO2FBQUEsTUFBQTtxQ0FBQTs7QUFESjs7SUFEa0I7O29CQUl0QixZQUFBLEdBQWMsU0FBQyxNQUFEO1FBQ1YsTUFBTSxDQUFDLEtBQVAsR0FBZTtRQUNmLE1BQU0sQ0FBQyxLQUFQLENBQUE7UUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLE1BQWpCO2VBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsZ0JBQVIsRUFBMEIsTUFBMUI7SUFKVTs7b0JBTWQsY0FBQSxHQUFnQixTQUFBO0FBQ1osWUFBQTtRQUFBLElBQVUsQ0FBSSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQXZCO0FBQUEsbUJBQUE7O1FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFBO1FBQ1IsT0FBQSxHQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBQyxDQUFBLE9BQVQ7QUFDVjtlQUFNLE9BQU8sQ0FBQyxNQUFkO3lCQUNJLE9BQU8sQ0FBQyxHQUFSLENBQUEsQ0FBYSxDQUFDLGdCQUFkLENBQStCLElBQS9CO1FBREosQ0FBQTs7SUFKWTs7b0JBT2hCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtlQUNmLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixNQUF2QjtJQURlOztvQkFHbkIsYUFBQSxHQUFlLFNBQUE7QUFDWCxZQUFBO0FBQUE7ZUFBTSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsTUFBeEI7eUJBQ0ksSUFBQyxDQUFBLGdCQUFnQixDQUFDLEdBQWxCLENBQUEsQ0FBdUIsQ0FBQyxRQUF4QixDQUFBO1FBREosQ0FBQTs7SUFEVzs7Ozs7O0FBSW5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgICAgMDAwXG4jIDAwMDAwMDAgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDAgICAgIDAwMFxuIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAwMDAwICAgICAwMDBcbiMgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwXG5cbnsgbGFzdCwga2Vycm9yLCBrbG9nLCBfIH0gPSByZXF1aXJlICdreGsnXG5BY3Rpb24gPSByZXF1aXJlICcuL2FjdGlvbidcblxuY2xhc3MgRXZlbnRcblxuICAgIEA6IChvYmosIG5hbWUpIC0+XG4gICAgICAgIEBvYmplY3QgID0gb2JqXG4gICAgICAgIEBuYW1lICAgID0gbmFtZVxuICAgICAgICBAdGltZSAgICA9IDBcbiAgICAgICAgQGFjdGlvbnMgPSBbXVxuICAgICAgICBAZmluaXNoZWRfYWN0aW9ucyA9IFtdXG5cbiAgICBnZXRUaW1lOiAtPiBAdGltZVxuICAgIGhhc0FjdGlvbjogKGFjdGlvbikgLT4gXy5maW5kIEBhY3Rpb25zLCBhY3Rpb25cblxuICAgIGFkZEFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgaWYgYWN0aW9uPyBhbmQgbm90IEBoYXNBY3Rpb24gYWN0aW9uXG4gICAgICAgICAgICByZXR1cm4gaWYgd29ybGQubm9Sb3RhdGlvbnMgYW5kIGFjdGlvbi5pZCA9PSBBY3Rpb24uUk9UQVRFXG4gICAgICAgICAgICBAYWN0aW9ucy5wdXNoIGFjdGlvblxuICAgICAgICAgICAgYWN0aW9uLmV2ZW50ID0gQFxuICAgICAgICAgICAgYWN0aW9uLmluaXQoKVxuICAgICAgICBlbHNlIGlmIG5vdCBhY3Rpb24/XG4gICAgICAgICAgICBrZXJyb3IgJ0V2ZW50LmFkZEFjdGlvbiBubyBhY3Rpb24/J1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGtsb2cgXCJFdmVudC5hZGRBY3Rpb24gaGFzIGFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG5cbiAgICByZW1vdmVBbGxBY3Rpb25zOiAoKSAtPlxuICAgICAgICB3aGlsZSBAYWN0aW9ucy5sZW5ndGhcbiAgICAgICAgICAgIEByZW1vdmVBY3Rpb24gbGFzdCBAYWN0aW9uc1xuXG4gICAgZ2V0QWN0aW9uc09mT2JqZWN0OiAob2JqZWN0KSAtPiBAYWN0aW9ucy5maWx0ZXIgKGEpIC0+IGEub2JqZWN0ID09IG9iamVjdFxuXG4gICAgcmVtb3ZlQWN0aW9uc09mT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBhIGlmIGEub2JqZWN0ID09IG9iamVjdFxuXG4gICAgcmVtb3ZlQWN0aW9uV2l0aE5hbWU6IChhY3Rpb25OYW1lKSAtPlxuICAgICAgICBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBhIGlmIGEubmFtZSA9PSBhY3Rpb25OYW1lXG5cbiAgICByZW1vdmVBY3Rpb246IChhY3Rpb24pIC0+XG4gICAgICAgIGFjdGlvbi5ldmVudCA9IG51bGxcbiAgICAgICAgYWN0aW9uLnJlc2V0KClcbiAgICAgICAgXy5wdWxsIEBhY3Rpb25zLCBhY3Rpb25cbiAgICAgICAgXy5wdWxsIEBmaW5pc2hlZF9hY3Rpb25zLCBhY3Rpb25cblxuICAgIHRyaWdnZXJBY3Rpb25zOiAoKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBhY3Rpb25zLmxlbmd0aFxuICAgICAgICBAdGltZSA9IHdvcmxkLmdldFRpbWUoKVxuICAgICAgICBhY3Rpb25zID0gXy5jbG9uZSBAYWN0aW9uc1xuICAgICAgICB3aGlsZSBhY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgYWN0aW9ucy5wb3AoKS5wZXJmb3JtV2l0aEV2ZW50IEBcblxuICAgIGFkZEZpbmlzaGVkQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBAZmluaXNoZWRfYWN0aW9ucy5wdXNoIGFjdGlvblxuXG4gICAgZmluaXNoQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGZpbmlzaGVkX2FjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAZmluaXNoZWRfYWN0aW9ucy5wb3AoKS5maW5pc2hlZCgpXG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRcbiJdfQ==
//# sourceURL=../coffee/event.coffee