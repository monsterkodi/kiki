// koffee 1.4.0
var Action, _;

_ = require('kxk')._;

Action = (function() {
    Action.NOOP = 0;

    Action.ROTATE = 1;

    Action.FLY = 2;

    Action.TOGGLE = 3;

    Action.FALL = 4;

    Action.PUSH = 5;

    Action.EXPLODE = 6;

    Action.IMPLODE = 7;

    Action.FORWARD = 8;

    Action.CLIMB_UP = 9;

    Action.CLIMB_DOWN = 10;

    Action.TURN_LEFT = 11;

    Action.TURN_RIGHT = 12;

    Action.JUMP = 13;

    Action.JUMP_FORWARD = 14;

    Action.FALL_FORWARD = 15;

    Action.SHOOT = 16;

    Action.LOOK_UP = 17;

    Action.LOOK_DOWN = 18;

    Action.LOOK_RESET = 19;

    Action.TUCKER = 20;

    Action.SHOW = 1;

    Action.HIDE = 2;

    Action.DELETE = 3;

    Action.ONCE = 0;

    Action.CONTINUOUS = 1;

    Action.REPEAT = 2;

    Action.TIMED = 3;

    function Action(o, i, n, d, m) {
        var ref, ref1, ref2;
        if (_.isPlainObject(o)) {
            i = (ref = o.id) != null ? ref : -1;
            n = o.name;
            d = (ref1 = o.duration) != null ? ref1 : 0;
            m = (ref2 = o.mode) != null ? ref2 : d && Action.TIMED || Action.ONCE;
            o = o.func;
        } else {
            if (i != null) {
                i;
            } else {
                i = -1;
            }
            if (d != null) {
                d;
            } else {
                d = 0;
            }
            if (m != null) {
                m;
            } else {
                m = d && Action.TIMED || Action.ONCE;
            }
        }
        this.object = o;
        this.name = n;
        this.id = i;
        this.mode = m;
        this.duration = d;
        this.event = null;
        this.deleted = false;
        this.reset();
    }

    Action.prototype.del = function() {
        if (this.event != null) {
            this.event.removeAction(this);
        }
        if (this.object != null) {
            this.object.removeAction(this);
        }
        return this.deleted = true;
    };

    Action.prototype.perform = function() {
        if (this.object.performAction != null) {
            return this.object.performAction(this);
        } else if (_.isFunction(this.object)) {
            return this.object(this);
        }
    };

    Action.prototype.init = function() {
        var base;
        return typeof (base = this.object).initAction === "function" ? base.initAction(this) : void 0;
    };

    Action.prototype.finish = function() {
        var base;
        return typeof (base = this.object).finishAction === "function" ? base.finishAction(this) : void 0;
    };

    Action.prototype.finished = function() {
        var ref;
        if ((ref = this.object) != null) {
            if (typeof ref.actionFinished === "function") {
                ref.actionFinished(this);
            }
        }
        if (this.deleted) {
            return;
        }
        return this.reset();
    };

    Action.prototype.reset = function() {
        this.start = 0;
        this.rest = 0;
        this.last = 0;
        return this.current = 0;
    };

    Action.prototype.takeOver = function(action) {
        this.current = action.current;
        this.start = action.start;
        this.last = action.last;
        return this.rest = action.rest;
    };

    Action.prototype.keepRest = function() {
        if (this.rest !== 0) {
            this.current = this.rest;
            return this.rest = 0;
        }
    };

    Action.prototype.getRelativeTime = function() {
        return this.current / this.getDuration();
    };

    Action.prototype.getRelativeDelta = function() {
        return (this.current - this.last) / this.getDuration();
    };

    Action.prototype.getDuration = function() {
        return world.mapMsTime(this.duration);
    };

    Action.prototype.performWithEvent = function(event) {
        var currentDiff, eventTime, msDur, ref;
        eventTime = event.getTime();
        if (this.start === 0) {
            this.start = eventTime;
            this.current = 0;
            this.rest = 0;
            this.last = 0;
            if (this.mode === Action.ONCE) {
                event.removeAction(this);
            }
            this.perform();
            this.last = this.current;
            if (this.mode === Action.ONCE) {
                return this.finished();
            }
        } else {
            currentDiff = eventTime - this.start;
            msDur = this.getDuration();
            if (currentDiff >= msDur) {
                this.current = msDur;
                this.rest = currentDiff - msDur;
                this.perform();
                this.last = 0;
                if (this.mode === Action.CONTINUOUS) {
                    this.current = this.rest;
                    this.start = eventTime;
                    this.last = 0;
                    this.rest = 0;
                    return;
                }
                if ((ref = this.mode) === Action.ONCE || ref === Action.TIMED) {
                    event.removeAction(this);
                }
                this.finish();
                if (this.mode === Action.REPEAT) {
                    if (this.current >= this.getDuration()) {
                        this.reset();
                    }
                    return;
                }
                return event.addFinishedAction(this);
            } else {
                this.current = currentDiff;
                this.perform();
                return this.last = this.current;
            }
        }
    };

    return Action;

})();

module.exports = Action;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQTs7QUFBRSxJQUFNLE9BQUEsQ0FBUSxLQUFSOztBQUVGO0lBRUYsTUFBQyxDQUFBLElBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxNQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsR0FBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLE1BQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxJQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsSUFBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLE9BQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxPQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsT0FBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLFFBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxVQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsU0FBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLFVBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxJQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsWUFBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLFlBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxLQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsT0FBRCxHQUFnQjs7SUFDaEIsTUFBQyxDQUFBLFNBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxVQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsTUFBRCxHQUFnQjs7SUFFaEIsTUFBQyxDQUFBLElBQUQsR0FBZ0I7O0lBQ2hCLE1BQUMsQ0FBQSxJQUFELEdBQWdCOztJQUNoQixNQUFDLENBQUEsTUFBRCxHQUFnQjs7SUFFaEIsTUFBQyxDQUFBLElBQUQsR0FBYzs7SUFDZCxNQUFDLENBQUEsVUFBRCxHQUFjOztJQUNkLE1BQUMsQ0FBQSxNQUFELEdBQWM7O0lBQ2QsTUFBQyxDQUFBLEtBQUQs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QkFOSjs7Z0JBT0EsV0FBd0IsSUFBQyxDQUFBLEtBQUQsS0FBVSxNQUFNLENBQUMsSUFBakIsSUFBQSxHQUFBLEtBQXVCLE1BQU0sQ0FBQyxLQUF0RDtvQkFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixJQUFuQixFQUFBOztnQkFFQSxJQUFDLENBQUEsTUFBRCxDQUFBO2dCQUVBLElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxNQUFNLENBQUMsTUFBbkI7b0JBQ0ksSUFBRyxJQUFDLENBQUEsT0FBRCxJQUFZLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBZjt3QkFDSSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBREo7O0FBRUEsMkJBSEo7O3VCQUtBLEtBQUssQ0FBQyxpQkFBTixDQUF3QixJQUF4QixFQXhCSjthQUFBLE1BQUE7Z0JBMEJJLElBQUMsQ0FBQSxPQUFELEdBQVc7Z0JBQ1gsSUFBQyxDQUFBLE9BQUQsQ0FBQTt1QkFDQSxJQUFDLENBQUEsSUFBRCxHQUFXLElBQUMsQ0FBQSxRQTVCaEI7YUFkSjs7SUFIYzs7Ozs7O0FBK0N0QixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMDAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4jIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG57IF8gfSA9IHJlcXVpcmUgJ2t4aydcblxuY2xhc3MgQWN0aW9uXG4gICAgXG4gICAgQE5PT1AgICAgICAgICA9IDBcbiAgICBAUk9UQVRFICAgICAgID0gMSAjIHN3aXRjaCwgZ2F0ZSwgYm9tYlxuICAgIEBGTFkgICAgICAgICAgPSAyICMgYnVsbGV0XG4gICAgQFRPR0dMRSAgICAgICA9IDMgIyBzd2l0Y2gsIGdhdGVcbiAgICBARkFMTCAgICAgICAgID0gNCAjIHB1c2hhYmxlXG4gICAgQFBVU0ggICAgICAgICA9IDUgIyBwdXNoYWJsZVxuICAgIEBFWFBMT0RFICAgICAgPSA2ICMgYm9tYlxuICAgIEBJTVBMT0RFICAgICAgPSA3ICMgYm9tYlxuICAgIEBGT1JXQVJEICAgICAgPSA4ICMgYm90XG4gICAgQENMSU1CX1VQICAgICA9IDkgIyBib3RcbiAgICBAQ0xJTUJfRE9XTiAgID0gMTAgIyAuLi5cbiAgICBAVFVSTl9MRUZUICAgID0gMTFcbiAgICBAVFVSTl9SSUdIVCAgID0gMTJcbiAgICBASlVNUCAgICAgICAgID0gMTNcbiAgICBASlVNUF9GT1JXQVJEID0gMTRcbiAgICBARkFMTF9GT1JXQVJEID0gMTVcbiAgICBAU0hPT1QgICAgICAgID0gMTZcbiAgICBATE9PS19VUCAgICAgID0gMTdcbiAgICBATE9PS19ET1dOICAgID0gMThcbiAgICBATE9PS19SRVNFVCAgID0gMTlcbiAgICBAVFVDS0VSICAgICAgID0gMjBcbiAgICBcbiAgICBAU0hPVyAgICAgICAgID0gMVxuICAgIEBISURFICAgICAgICAgPSAyXG4gICAgQERFTEVURSAgICAgICA9IDNcbiAgICBcbiAgICBAT05DRSAgICAgICA9IDBcbiAgICBAQ09OVElOVU9VUyA9IDFcbiAgICBAUkVQRUFUICAgICA9IDJcbiAgICBAVElNRUQgICAgICA9IDNcblxuICAgIGNvbnN0cnVjdG9yOiAobywgaSwgbiwgZCwgbSkgLT4gICAgICAgIFxuICAgICAgICBpZiBfLmlzUGxhaW5PYmplY3QgbyBcbiAgICAgICAgICAgIGkgPSBvLmlkID8gLTFcbiAgICAgICAgICAgIG4gPSBvLm5hbWVcbiAgICAgICAgICAgIGQgPSBvLmR1cmF0aW9uID8gMFxuICAgICAgICAgICAgbSA9IG8ubW9kZSA/IChkIGFuZCBBY3Rpb24uVElNRUQgb3IgQWN0aW9uLk9OQ0UpXG4gICAgICAgICAgICBvID0gby5mdW5jXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGkgPz0gLTFcbiAgICAgICAgICAgIGQgPz0gMFxuICAgICAgICAgICAgbSA/PSAoZCBhbmQgQWN0aW9uLlRJTUVEIG9yIEFjdGlvbi5PTkNFKVxuICAgICAgICAjIGxvZyBcIkFjdGlvbi5jb25zdHJ1Y3RvciAje2l9ICN7bn0gI3tkfSAje219XCJcbiAgICAgICAgQG9iamVjdCAgICAgPSBvXG4gICAgICAgIEBuYW1lICAgICAgID0gblxuICAgICAgICBAaWQgICAgICAgICA9IGlcbiAgICAgICAgQG1vZGUgICAgICAgPSBtXG4gICAgICAgIEBkdXJhdGlvbiAgID0gZFxuICAgICAgICBAZXZlbnQgICAgICA9IG51bGxcbiAgICAgICAgQGRlbGV0ZWQgICAgPSBmYWxzZVxuICAgICAgICBAcmVzZXQoKVxuXG4gICAgZGVsOiAtPlxuICAgICAgICAjIGxvZyBcIkFjdGlvbi5kZWwgI3tAbmFtZX0gI3tAZXZlbnQ/fSAje0BvYmplY3Q/fVwiXG4gICAgICAgIGlmIEBldmVudD8gIHRoZW4gQGV2ZW50LnJlbW92ZUFjdGlvbiBAXG4gICAgICAgIGlmIEBvYmplY3Q/IHRoZW4gQG9iamVjdC5yZW1vdmVBY3Rpb24gQFxuICAgICAgICBAZGVsZXRlZCA9IHRydWVcblxuICAgIHBlcmZvcm06IC0+IFxuICAgICAgICAjIGxvZyBcIkFjdGlvbi5wZXJmb3JtICN7QG5hbWV9IGFjdGlvbj8gI3tAb2JqZWN0LnBlcmZvcm1BY3Rpb24/fSAje0BvYmplY3QubmFtZX1cIiBpZiBub3QgQG5hbWUgaW4gIFsnbm9vcCcsICdyb3RhdGlvbiddXG4gICAgICAgIGlmIEBvYmplY3QucGVyZm9ybUFjdGlvbj8gXG4gICAgICAgICAgICBAb2JqZWN0LnBlcmZvcm1BY3Rpb24gQFxuICAgICAgICBlbHNlIGlmIF8uaXNGdW5jdGlvbiBAb2JqZWN0XG4gICAgICAgICAgICBAb2JqZWN0IEBcbiAgICBcbiAgICBpbml0OiAtPiAgICBAb2JqZWN0LmluaXRBY3Rpb24/IEBcbiAgICBmaW5pc2g6IC0+ICBAb2JqZWN0LmZpbmlzaEFjdGlvbj8gQFxuICAgIGZpbmlzaGVkOiAtPiBcbiAgICAgICAgIyBsb2cgXCJBY3Rpb24uZmluaXNoZWQgI3tAbmFtZX0gI3tAb2JqZWN0Py5hY3Rpb25GaW5pc2hlZD99XCJcbiAgICAgICAgQG9iamVjdD8uYWN0aW9uRmluaXNoZWQ/IEBcbiAgICAgICAgcmV0dXJuIGlmIEBkZWxldGVkXG4gICAgICAgIEByZXNldCgpXG4gICAgICAgICMgaWYgQGN1cnJlbnQgPj0gQGdldER1cmF0aW9uKCkgIyBpZiBrZWVwUmVzdCB3YXNuJ3QgY2FsbGVkIC0+IHJlc2V0IHN0YXJ0IGFuZCBjdXJyZW50IHZhbHVlc1xuICAgICAgICAgICAgIyBAcmVzZXQoKVxuICAgICAgICAjIGVsc2UgXG4gICAgICAgICAgICAjIGxvZyAna2VlcGluZyByZXN0JywgQGN1cnJlbnRcblxuICAgIHJlc2V0OiAtPlxuICAgICAgICAjIGxvZyBcImFjdGlvbi5yZXNldCAje0BuYW1lfVwiXG4gICAgICAgIEBzdGFydCAgID0gMCAjIHdvcmxkIHRpbWVcbiAgICAgICAgQHJlc3QgICAgPSAwIFxuICAgICAgICBAbGFzdCAgICA9IDAgIyByZWxhdGl2ZSAobXMgc2luY2UgQHN0YXJ0KVxuICAgICAgICBAY3VycmVudCA9IDAgIyByZWxhdGl2ZSAobXMgc2luY2UgQHN0YXJ0KVxuICAgICAgICAjQGV2ZW50ICAgPSBudWxsICBcblxuICAgIHRha2VPdmVyOiAoYWN0aW9uKSAtPlxuICAgICAgICAjIGxvZyBcInRha2VPdmVyICN7YWN0aW9uLnJlc3R9IGZyb20gI3thY3Rpb24ubmFtZX0gdGhpczogI3tAbmFtZX1cIlxuICAgICAgICBAY3VycmVudCA9IGFjdGlvbi5jdXJyZW50XG4gICAgICAgIEBzdGFydCAgID0gYWN0aW9uLnN0YXJ0XG4gICAgICAgIEBsYXN0ICAgID0gYWN0aW9uLmxhc3RcbiAgICAgICAgQHJlc3QgICAgPSBhY3Rpb24ucmVzdFxuXG4gICAga2VlcFJlc3Q6ICgpIC0+XG4gICAgICAgIGlmIEByZXN0ICE9IDBcbiAgICAgICAgICAgIEBjdXJyZW50ID0gQHJlc3RcbiAgICAgICAgICAgIEByZXN0ICAgID0gMFxuXG4gICAgZ2V0UmVsYXRpdmVUaW1lOiAgLT4gQGN1cnJlbnQgLyBAZ2V0RHVyYXRpb24oKSBcbiAgICBnZXRSZWxhdGl2ZURlbHRhOiAtPiAoQGN1cnJlbnQtQGxhc3QpIC8gQGdldER1cmF0aW9uKClcbiAgICBnZXREdXJhdGlvbjogICAgICAtPiB3b3JsZC5tYXBNc1RpbWUgQGR1cmF0aW9uIFxuXG4gICAgcGVyZm9ybVdpdGhFdmVudDogKGV2ZW50KSAtPlxuICAgICAgICBldmVudFRpbWUgPSBldmVudC5nZXRUaW1lKClcbiAgICAgICAgIyBsb2cgXCJhY3Rpb24ucGVyZm9ybVdpdGhFdmVudCAje0BuYW1lfSAje0BpZH0gZXZlbnRUaW1lICN7ZXZlbnRUaW1lfSBzdGFydCAje0BzdGFydH1cIiBpZiBAbmFtZS5zdGFydHNXaXRoICdleGl0J1xuICAgICAgICBpZiBAc3RhcnQgPT0gMFxuICAgICAgICAgICAgQHN0YXJ0ICAgPSBldmVudFRpbWVcbiAgICAgICAgICAgIEBjdXJyZW50ID0gMFxuICAgICAgICAgICAgQHJlc3QgICAgPSAwXG4gICAgICAgICAgICBAbGFzdCAgICA9IDBcbiAgICAgICAgICAgICMgZXZlbnQucmVtb3ZlQWN0aW9uIEAgaWYgQGR1cmF0aW9uID09IDAgYW5kIEBtb2RlID09IEFjdGlvbi5PTkNFXG4gICAgICAgICAgICBldmVudC5yZW1vdmVBY3Rpb24gQCBpZiBAbW9kZSA9PSBBY3Rpb24uT05DRVxuICAgICAgICAgICAgQHBlcmZvcm0oKVxuICAgICAgICAgICAgQGxhc3QgPSBAY3VycmVudFxuICAgICAgICAgICAgIyBAZmluaXNoZWQoKSBpZiBAZHVyYXRpb24gPT0gMCBhbmQgQG1vZGUgPT0gQWN0aW9uLk9OQ0VcbiAgICAgICAgICAgIEBmaW5pc2hlZCgpIGlmIEBtb2RlID09IEFjdGlvbi5PTkNFXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGN1cnJlbnREaWZmID0gZXZlbnRUaW1lIC0gQHN0YXJ0XG4gICAgICAgICAgICBtc0R1ciA9IEBnZXREdXJhdGlvbigpXG4gICAgICAgICAgICBpZiBjdXJyZW50RGlmZiA+PSBtc0R1clxuICAgICAgICAgICAgICAgIEBjdXJyZW50ID0gbXNEdXJcbiAgICAgICAgICAgICAgICAjIEBzdGFydCAgID0gbXNEdXJcbiAgICAgICAgICAgICAgICBAcmVzdCAgICA9IGN1cnJlbnREaWZmIC0gbXNEdXJcbiAgICAgICAgICAgICAgICAjIGxvZyBcImFjdGlvbiAje25hbWV9IHBlcmZvcm1XaXRoRXZlbnQgc3RhcnQgI3tAc3RhcnR9IHJlc3QgI3tjdXJyZW50RGlmZn0tI3ttc0R1cn0gPSAje0ByZXN0fVwiIGlmIEBuYW1lICE9ICdub29wJ1xuICAgICAgICAgICAgICAgIEBwZXJmb3JtKClcbiAgICAgICAgICAgICAgICBAbGFzdCAgICA9IDBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBAbW9kZSA9PSBBY3Rpb24uQ09OVElOVU9VU1xuICAgICAgICAgICAgICAgICAgICAjIGxvZyBcImFjdGlvbi5wZXJmb3JtV2l0aEV2ZW50ICN7QG5hbWV9IG1vZGUgPT0gQWN0aW9uLkNPTlRJTlVPVVNcIlxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudCA9IEByZXN0XG4gICAgICAgICAgICAgICAgICAgIEBzdGFydCA9IGV2ZW50VGltZVxuICAgICAgICAgICAgICAgICAgICBAbGFzdCAgPSAwXG4gICAgICAgICAgICAgICAgICAgIEByZXN0ICA9IDBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgZXZlbnQucmVtb3ZlQWN0aW9uIEAgaWYgQG1vZGUgaW4gW0FjdGlvbi5PTkNFLCBBY3Rpb24uVElNRURdXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgQGZpbmlzaCgpXG4gICAgXG4gICAgICAgICAgICAgICAgaWYgQG1vZGUgPT0gQWN0aW9uLlJFUEVBVFxuICAgICAgICAgICAgICAgICAgICBpZiBAY3VycmVudCA+PSBAZ2V0RHVyYXRpb24oKSAjIGlmIGtlZXBSZXN0IHdhc24ndCBjYWxsZWQgLT4gcmVzZXQgc3RhcnQgYW5kIGN1cnJlbnQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAcmVzZXQoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBldmVudC5hZGRGaW5pc2hlZEFjdGlvbiBAXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGN1cnJlbnQgPSBjdXJyZW50RGlmZlxuICAgICAgICAgICAgICAgIEBwZXJmb3JtKClcbiAgICAgICAgICAgICAgICBAbGFzdCAgICA9IEBjdXJyZW50XG4gICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25cbiJdfQ==
//# sourceURL=../coffee/action.coffee