// koffee 1.4.0
var Action, Event, _, last;

last = require('./tools/tools').last;

Action = require('./action');

_ = require('lodash');

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
        var a, i, len, ref, results;
        ref = this.actions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            a = ref[i];
            if (a.object === object) {
                results.push(this.removeAction(a));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    Event.prototype.removeActionWithName = function(actionName) {
        var a, i, len, ref, results;
        ref = this.actions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            a = ref[i];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFLQSxJQUFBOztBQUNBLE9BQ1MsT0FBQSxDQUFRLGVBQVI7O0FBQ1QsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUNULENBQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7QUFFSDtJQUVXLGVBQUMsR0FBRCxFQUFNLElBQU47UUFDVCxJQUFDLENBQUEsTUFBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLElBQUQsR0FBVztRQUNYLElBQUMsQ0FBQSxJQUFELEdBQVc7UUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO1FBQ1gsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBTFg7O29CQU9iLE9BQUEsR0FBUyxTQUFBO2VBQUcsSUFBQyxDQUFBO0lBQUo7O29CQUNULFNBQUEsR0FBVyxTQUFDLE1BQUQ7ZUFBWSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLE1BQWpCO0lBQVo7O29CQUVYLFNBQUEsR0FBVyxTQUFDLE1BQUQ7UUFDUCxJQUFHLGdCQUFBLElBQVksQ0FBSSxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsQ0FBbkI7WUFDSSxJQUFVLEtBQUssQ0FBQyxXQUFOLElBQXNCLE1BQU0sQ0FBQyxFQUFQLEtBQWEsTUFBTSxDQUFDLE1BQXBEO0FBQUEsdUJBQUE7O1lBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZDtZQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWU7bUJBQ2YsTUFBTSxDQUFDLElBQVAsQ0FBQSxFQUpKO1NBQUEsTUFLSyxJQUFPLGNBQVA7WUFDRCxPQUFPLENBQUMsR0FBUixDQUFZLDRCQUFaO0FBQ0Esa0JBQU0sSUFBSSxNQUZUO1NBQUEsTUFBQTttQkFJRixPQUFBLENBQUMsR0FBRCxDQUFLLDZCQUFBLEdBQThCLE1BQU0sQ0FBQyxJQUExQyxFQUpFOztJQU5FOztvQkFZWCxnQkFBQSxHQUFrQixTQUFBO0FBQ2QsWUFBQTtBQUFBO2VBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFmO3lCQUNJLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQSxDQUFLLElBQUMsQ0FBQSxPQUFOLENBQWQ7UUFESixDQUFBOztJQURjOztvQkFJbEIsa0JBQUEsR0FBb0IsU0FBQyxNQUFEO2VBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsTUFBRixLQUFZO1FBQW5CLENBQWhCO0lBQVo7O29CQUVwQixxQkFBQSxHQUF1QixTQUFDLE1BQUQ7QUFDbkIsWUFBQTtBQUFBO0FBQUE7YUFBQSxxQ0FBQTs7WUFDSSxJQUFtQixDQUFDLENBQUMsTUFBRixLQUFZLE1BQS9COzZCQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxHQUFBO2FBQUEsTUFBQTtxQ0FBQTs7QUFESjs7SUFEbUI7O29CQUl2QixvQkFBQSxHQUFzQixTQUFDLFVBQUQ7QUFDbEIsWUFBQTtBQUFBO0FBQUE7YUFBQSxxQ0FBQTs7WUFDSSxJQUFtQixDQUFDLENBQUMsSUFBRixLQUFVLFVBQTdCOzZCQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxHQUFBO2FBQUEsTUFBQTtxQ0FBQTs7QUFESjs7SUFEa0I7O29CQUl0QixZQUFBLEdBQWMsU0FBQyxNQUFEO1FBQ1YsTUFBTSxDQUFDLEtBQVAsR0FBZTtRQUNmLE1BQU0sQ0FBQyxLQUFQLENBQUE7UUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLE1BQWpCO2VBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsZ0JBQVIsRUFBMEIsTUFBMUI7SUFKVTs7b0JBTWQsY0FBQSxHQUFnQixTQUFBO0FBQ1osWUFBQTtRQUFBLElBQVUsQ0FBSSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQXZCO0FBQUEsbUJBQUE7O1FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFBO1FBQ1IsT0FBQSxHQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBQyxDQUFBLE9BQVQ7QUFDVjtlQUFNLE9BQU8sQ0FBQyxNQUFkO3lCQUNJLE9BQU8sQ0FBQyxHQUFSLENBQUEsQ0FBYSxDQUFDLGdCQUFkLENBQStCLElBQS9CO1FBREosQ0FBQTs7SUFKWTs7b0JBT2hCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtlQUNmLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixNQUF2QjtJQURlOztvQkFHbkIsYUFBQSxHQUFlLFNBQUE7QUFDWCxZQUFBO0FBQUE7ZUFBTSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsTUFBeEI7eUJBQ0ksSUFBQyxDQUFBLGdCQUFnQixDQUFDLEdBQWxCLENBQUEsQ0FBdUIsQ0FBQyxRQUF4QixDQUFBO1FBREosQ0FBQTs7SUFEVzs7Ozs7O0FBSW5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAgIDAwMCAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwIDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDAgICAgIDAwMCAgIFxuIyAwMDAgICAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAwMDAwICAgICAwMDAgICBcbiMgMDAwMDAwMDAgICAgICAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG57XG5sYXN0XG59ICAgICAgPSByZXF1aXJlICcuL3Rvb2xzL3Rvb2xzJ1xuQWN0aW9uID0gcmVxdWlyZSAnLi9hY3Rpb24nXG5fICAgICAgPSByZXF1aXJlICdsb2Rhc2gnXG5cbmNsYXNzIEV2ZW50XG4gICAgXG4gICAgY29uc3RydWN0b3I6IChvYmosIG5hbWUpIC0+XG4gICAgICAgIEBvYmplY3QgID0gb2JqXG4gICAgICAgIEBuYW1lICAgID0gbmFtZVxuICAgICAgICBAdGltZSAgICA9IDBcbiAgICAgICAgQGFjdGlvbnMgPSBbXVxuICAgICAgICBAZmluaXNoZWRfYWN0aW9ucyA9IFtdXG4gICAgXG4gICAgZ2V0VGltZTogLT4gQHRpbWVcbiAgICBoYXNBY3Rpb246IChhY3Rpb24pIC0+IF8uZmluZCBAYWN0aW9ucywgYWN0aW9uXG4gICAgXG4gICAgYWRkQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBpZiBhY3Rpb24/IGFuZCBub3QgQGhhc0FjdGlvbiBhY3Rpb25cbiAgICAgICAgICAgIHJldHVybiBpZiB3b3JsZC5ub1JvdGF0aW9ucyBhbmQgYWN0aW9uLmlkID09IEFjdGlvbi5ST1RBVEVcbiAgICAgICAgICAgIEBhY3Rpb25zLnB1c2ggYWN0aW9uXG4gICAgICAgICAgICBhY3Rpb24uZXZlbnQgPSBAXG4gICAgICAgICAgICBhY3Rpb24uaW5pdCgpXG4gICAgICAgIGVsc2UgaWYgbm90IGFjdGlvbj9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdFdmVudC5hZGRBY3Rpb24gbm8gYWN0aW9uPydcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2cgXCJFdmVudC5hZGRBY3Rpb24gaGFzIGFjdGlvbiAje2FjdGlvbi5uYW1lfVwiXG4gICAgXG4gICAgcmVtb3ZlQWxsQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGFjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAcmVtb3ZlQWN0aW9uIGxhc3QgQGFjdGlvbnNcbiAgICBcbiAgICBnZXRBY3Rpb25zT2ZPYmplY3Q6IChvYmplY3QpIC0+IEBhY3Rpb25zLmZpbHRlciAoYSkgLT4gYS5vYmplY3QgPT0gb2JqZWN0XG4gICAgXG4gICAgcmVtb3ZlQWN0aW9uc09mT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBmb3IgYSBpbiBAYWN0aW9uc1xuICAgICAgICAgICAgQHJlbW92ZUFjdGlvbiBhIGlmIGEub2JqZWN0ID09IG9iamVjdFxuICAgIFxuICAgIHJlbW92ZUFjdGlvbldpdGhOYW1lOiAoYWN0aW9uTmFtZSkgLT5cbiAgICAgICAgZm9yIGEgaW4gQGFjdGlvbnNcbiAgICAgICAgICAgIEByZW1vdmVBY3Rpb24gYSBpZiBhLm5hbWUgPT0gYWN0aW9uTmFtZVxuICAgIFxuICAgIHJlbW92ZUFjdGlvbjogKGFjdGlvbikgLT5cbiAgICAgICAgYWN0aW9uLmV2ZW50ID0gbnVsbFxuICAgICAgICBhY3Rpb24ucmVzZXQoKVxuICAgICAgICBfLnB1bGwgQGFjdGlvbnMsIGFjdGlvblxuICAgICAgICBfLnB1bGwgQGZpbmlzaGVkX2FjdGlvbnMsIGFjdGlvblxuICAgIFxuICAgIHRyaWdnZXJBY3Rpb25zOiAoKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBhY3Rpb25zLmxlbmd0aFxuICAgICAgICBAdGltZSA9IHdvcmxkLmdldFRpbWUoKVxuICAgICAgICBhY3Rpb25zID0gXy5jbG9uZSBAYWN0aW9uc1xuICAgICAgICB3aGlsZSBhY3Rpb25zLmxlbmd0aFxuICAgICAgICAgICAgYWN0aW9ucy5wb3AoKS5wZXJmb3JtV2l0aEV2ZW50IEBcbiAgICBcbiAgICBhZGRGaW5pc2hlZEFjdGlvbjogKGFjdGlvbikgLT4gXG4gICAgICAgIEBmaW5pc2hlZF9hY3Rpb25zLnB1c2ggYWN0aW9uXG4gICAgXG4gICAgZmluaXNoQWN0aW9uczogKCkgLT5cbiAgICAgICAgd2hpbGUgQGZpbmlzaGVkX2FjdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICBAZmluaXNoZWRfYWN0aW9ucy5wb3AoKS5maW5pc2hlZCgpXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRcbiJdfQ==
//# sourceURL=../coffee/event.coffee