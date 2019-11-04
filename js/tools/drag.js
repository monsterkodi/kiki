// koffee 1.4.0
var Drag, _, absPos, def, error, log, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

ref = require('./tools'), def = ref.def, absPos = ref.absPos;

log = require('./log');

error = function() {
    return console.error("ERROR: " + ([].slice.call(arguments, 0)).join(" "));
};

Drag = (function() {
    function Drag(cfg) {
        this.deactivate = bind(this.deactivate, this);
        this.activate = bind(this.activate, this);
        this.dragStop = bind(this.dragStop, this);
        this.dragUp = bind(this.dragUp, this);
        this.dragMove = bind(this.dragMove, this);
        this.dragStart = bind(this.dragStart, this);
        var t;
        _.extend(this, def(cfg, {
            target: null,
            handle: null,
            onStart: null,
            onMove: null,
            onStop: null,
            active: true,
            cursor: 'move'
        }));
        if (typeof this.target === 'string') {
            t = document.getElementById(this.target);
            if (t == null) {
                console.error('cant find drag target with id', this.target);
                return;
            }
            this.target = t;
        }
        if (this.target == null) {
            console.error('cant find drag target');
            return;
        }
        this.dragging = false;
        this.listening = false;
        if (typeof this.handle === 'string') {
            this.handle = document.getElementById(this.handle);
        }
        if (this.handle == null) {
            this.handle = this.target;
        }
        this.handle.style.cursor = this.cursor;
        if (this.active) {
            this.activate();
        }
        return;
    }

    Drag.prototype.dragStart = function(event) {
        if (this.dragging || !this.listening) {
            return;
        }
        this.dragging = true;
        this.startPos = absPos(event);
        this.pos = absPos(event);
        if (this.onStart != null) {
            this.onStart(this, event);
        }
        this.lastPos = absPos(event);
        event.preventDefault();
        document.addEventListener('mousemove', this.dragMove);
        return document.addEventListener('mouseup', this.dragUp);
    };

    Drag.prototype.dragMove = function(event) {
        if (!this.dragging) {
            return;
        }
        this.pos = absPos(event);
        this.delta = this.lastPos.to(this.pos);
        this.deltaSum = this.startPos.to(this.pos);
        if (this.onMove != null) {
            this.onMove(this, event);
        }
        return this.lastPos = this.pos;
    };

    Drag.prototype.dragUp = function(event) {
        return this.dragStop(event);
    };

    Drag.prototype.dragStop = function(event) {
        if (!this.dragging) {
            return;
        }
        document.removeEventListener('mousemove', this.dragMove);
        document.removeEventListener('mouseup', this.dragUp);
        delete this.lastPos;
        delete this.startPos;
        if ((this.onStop != null) && (event != null)) {
            this.onStop(this, event);
        }
        this.dragging = false;
    };

    Drag.prototype.activate = function() {
        if (this.listening) {
            return;
        }
        this.listening = true;
        this.handle.addEventListener('mousedown', this.dragStart);
    };

    Drag.prototype.deactivate = function() {
        if (!this.listening) {
            return;
        }
        this.handle.removeEventListener('mousedown', this.dragStart);
        this.listening = false;
        if (this.dragging) {
            this.dragStop();
        }
    };

    return Drag;

})();

module.exports = Drag;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEscUNBQUE7SUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBRUosTUFBZ0IsT0FBQSxDQUFRLFNBQVIsQ0FBaEIsRUFBQyxhQUFELEVBQU07O0FBQ04sR0FBQSxHQUFnQixPQUFBLENBQVEsT0FBUjs7QUFFaEIsS0FBQSxHQUFRLFNBQUE7V0FBRyxPQUFPLENBQUMsS0FBUixDQUFjLFNBQUEsR0FBWSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsQ0FBekIsQ0FBRCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEdBQWxDLENBQTFCO0FBQUg7O0FBRUY7SUFFVyxjQUFDLEdBQUQ7Ozs7Ozs7QUFFVCxZQUFBO1FBQUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQVksR0FBQSxDQUFJLEdBQUosRUFDSjtZQUFBLE1BQUEsRUFBVSxJQUFWO1lBQ0EsTUFBQSxFQUFVLElBRFY7WUFFQSxPQUFBLEVBQVUsSUFGVjtZQUdBLE1BQUEsRUFBVSxJQUhWO1lBSUEsTUFBQSxFQUFVLElBSlY7WUFLQSxNQUFBLEVBQVUsSUFMVjtZQU1BLE1BQUEsRUFBVSxNQU5WO1NBREksQ0FBWjtRQVNBLElBQUcsT0FBTyxJQUFDLENBQUEsTUFBUixLQUFrQixRQUFyQjtZQUNJLENBQUEsR0FBSSxRQUFRLENBQUMsY0FBVCxDQUF3QixJQUFDLENBQUEsTUFBekI7WUFDSixJQUFPLFNBQVA7Z0JBQ0csT0FBQSxDQUFDLEtBQUQsQ0FBTywrQkFBUCxFQUF3QyxJQUFDLENBQUEsTUFBekM7QUFDQyx1QkFGSjs7WUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVLEVBTGQ7O1FBTUEsSUFBTyxtQkFBUDtZQUNHLE9BQUEsQ0FBQyxLQUFELENBQU8sdUJBQVA7QUFDQyxtQkFGSjs7UUFJQSxJQUFDLENBQUEsUUFBRCxH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QUQsR0FBYTtRQUNiLElBQWUsSUFBQyxDQUFBLFFBQWhCO1lBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUFBOztJQUxROzs7Ozs7QUFRaEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAgICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICBcbiMgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAwMCAgMDAwICAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCBcblxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxue2RlZiwgYWJzUG9zfSA9IHJlcXVpcmUgJy4vdG9vbHMnXG5sb2cgICAgICAgICAgID0gcmVxdWlyZSAnLi9sb2cnXG5cbmVycm9yID0gLT4gY29uc29sZS5lcnJvciBcIkVSUk9SOiBcIiArIChbXS5zbGljZS5jYWxsIGFyZ3VtZW50cywgMCkuam9pbiBcIiBcIlxuICAgIFxuY2xhc3MgRHJhZ1xuXG4gICAgY29uc3RydWN0b3I6IChjZmcpIC0+XG4gICAgICAgIFxuICAgICAgICBfLmV4dGVuZCBALCBkZWYgY2ZnLFxuICAgICAgICAgICAgICAgIHRhcmdldCAgOiBudWxsXG4gICAgICAgICAgICAgICAgaGFuZGxlICA6IG51bGxcbiAgICAgICAgICAgICAgICBvblN0YXJ0IDogbnVsbFxuICAgICAgICAgICAgICAgIG9uTW92ZSAgOiBudWxsXG4gICAgICAgICAgICAgICAgb25TdG9wICA6IG51bGxcbiAgICAgICAgICAgICAgICBhY3RpdmUgIDogdHJ1ZVxuICAgICAgICAgICAgICAgIGN1cnNvciAgOiAnbW92ZSdcblxuICAgICAgICBpZiB0eXBlb2YgQHRhcmdldCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIEB0YXJnZXRcbiAgICAgICAgICAgIGlmIG5vdCB0P1xuICAgICAgICAgICAgICAgIGVycm9yICdjYW50IGZpbmQgZHJhZyB0YXJnZXQgd2l0aCBpZCcsIEB0YXJnZXRcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIEB0YXJnZXQgPSB0XG4gICAgICAgIGlmIG5vdCBAdGFyZ2V0P1xuICAgICAgICAgICAgZXJyb3IgJ2NhbnQgZmluZCBkcmFnIHRhcmdldCdcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIEBkcmFnZ2luZyAgPSBmYWxzZVxuICAgICAgICBAbGlzdGVuaW5nID0gZmFsc2VcbiAgICAgICAgQGhhbmRsZSAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEBoYW5kbGUpIGlmIHR5cGVvZiAoQGhhbmRsZSkgaXMgJ3N0cmluZydcbiAgICAgICAgQGhhbmRsZSAgICA9IEB0YXJnZXQgdW5sZXNzIEBoYW5kbGU/XG4gICAgICAgIEBoYW5kbGUuc3R5bGUuY3Vyc29yID0gQGN1cnNvclxuICAgICAgICBAYWN0aXZhdGUoKSBpZiBAYWN0aXZlXG4gICAgICAgIHJldHVyblxuXG4gICAgZHJhZ1N0YXJ0OiAoZXZlbnQpID0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGRyYWdnaW5nIG9yIG5vdCBAbGlzdGVuaW5nXG4gICAgICAgIEBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgQHN0YXJ0UG9zID0gYWJzUG9zIGV2ZW50XG4gICAgICAgIEBwb3MgICAgICA9IGFic1BvcyBldmVudFxuICAgICAgICBAb25TdGFydCBALCBldmVudCBpZiBAb25TdGFydD9cbiAgICAgICAgQGxhc3RQb3MgID0gYWJzUG9zIGV2ZW50XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCBAZHJhZ01vdmVcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V1cCcsICAgQGRyYWdVcFxuXG4gICAgZHJhZ01vdmU6IChldmVudCkgPT5cblxuICAgICAgICByZXR1cm4gaWYgbm90IEBkcmFnZ2luZ1xuXG4gICAgICAgIEBwb3MgICA9IGFic1BvcyBldmVudFxuICAgICAgICBAZGVsdGEgPSBAbGFzdFBvcy50byBAcG9zXG4gICAgICAgIEBkZWx0YVN1bSA9IEBzdGFydFBvcy50byBAcG9zXG4gICAgICAgIFxuICAgICAgICBpZiBAb25Nb3ZlP1xuICAgICAgICAgICAgQG9uTW92ZSB0aGlzLCBldmVudFxuXG4gICAgICAgIEBsYXN0UG9zID0gQHBvc1xuICAgICAgICAgICAgICAgIFxuICAgIGRyYWdVcDogKGV2ZW50KSA9PiBAZHJhZ1N0b3AgZXZlbnRcblxuICAgIGRyYWdTdG9wOiAoZXZlbnQpID0+XG5cbiAgICAgICAgcmV0dXJuIGlmIG5vdCBAZHJhZ2dpbmdcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2Vtb3ZlJywgQGRyYWdNb3ZlXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNldXAnLCAgIEBkcmFnVXBcbiAgICAgICAgZGVsZXRlIEBsYXN0UG9zXG4gICAgICAgIGRlbGV0ZSBAc3RhcnRQb3NcbiAgICAgICAgQG9uU3RvcCB0aGlzLCBldmVudCBpZiBAb25TdG9wPyBhbmQgZXZlbnQ/XG4gICAgICAgIEBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuXG4gICAgYWN0aXZhdGU6ID0+XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQGxpc3RlbmluZ1xuICAgICAgICBAbGlzdGVuaW5nID0gdHJ1ZVxuICAgICAgICBAaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlZG93bicsIEBkcmFnU3RhcnRcbiAgICAgICAgcmV0dXJuXG5cbiAgICBkZWFjdGl2YXRlOiA9PlxuXG4gICAgICAgIHJldHVybiBpZiBub3QgQGxpc3RlbmluZ1xuICAgICAgICBAaGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlZG93bicsIEBkcmFnU3RhcnRcbiAgICAgICAgQGxpc3RlbmluZyA9IGZhbHNlXG4gICAgICAgIEBkcmFnU3RvcCgpIGlmIEBkcmFnZ2luZ1xuICAgICAgICByZXR1cm5cblxubW9kdWxlLmV4cG9ydHMgPSBEcmFnXG4iXX0=
//# sourceURL=../../coffee/tools/drag.coffee