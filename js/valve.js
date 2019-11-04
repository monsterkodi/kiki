// koffee 1.4.0
var Action, Face, Pushable, Quaternion, Valve,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

Quaternion = require('./lib/quaternion');

Pushable = require('./pushable');

Action = require('./action');

Face = require('./face');

Valve = (function(superClass) {
    extend(Valve, superClass);

    function Valve(face) {
        this.face = face;
        Valve.__super__.constructor.apply(this, arguments);
        this.angle = 0.0;
        this.active = false;
        this.clockwise = false;
        this.addAction(new Action(this, Action.ROTATE, "rotation", 2000, Action.REPEAT));
    }

    Valve.prototype.updateMesh = function() {
        var rot;
        rot = Quaternion.rotationAroundVector((this.clockwise && 1 || -1) * this.angle, 0, 0, 1);
        return this.mesh.quaternion.copy(Face.orientationForFace(this.face).mul(rot));
    };

    Valve.prototype.setPosition = function(pos) {
        var dir, p, sum;
        Valve.__super__.setPosition.call(this, pos);
        p = this.getPos();
        dir = this.face % 3;
        sum = ((dir === Face.Y || dir === Face.Z) && p.x || 0) + ((dir === Face.X || dir === Face.Z) && p.y || 0) + ((dir === Face.X || dir === Face.Y) && p.z || 0);
        return this.clockwise = sum % 2;
    };

    Valve.prototype.performAction = function(action) {
        switch (action.id) {
            case Action.ROTATE:
                this.angle += action.getRelativeDelta() * 360;
                return this.updateMesh();
            default:
                return Valve.__super__.performAction.call(this, action);
        }
    };

    return Valve;

})(Pushable);

module.exports = Valve;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdmUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLHlDQUFBO0lBQUE7OztBQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0FBQ2IsUUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztBQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixJQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVI7O0FBRVA7OztJQUVDLGVBQUMsSUFBRDtRQUFDLElBQUMsQ0FBQSxPQUFEO1FBQ0Esd0NBQUEsU0FBQTtRQUNBLElBQUMsQ0FBQSxLQUFELEdBQWE7UUFDYixJQUFDLENBQUEsTUFBRCxHQUFhO1FBQ2IsSUFBQyxDQUFBLFNBQUQsR0FBYTtRQUNiLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFjLE1BQU0sQ0FBQyxNQUFyQixFQUE2QixVQUE3QixFQUF5QyxJQUF6QyxFQUErQyxNQUFNLENBQUMsTUFBdEQsQ0FBWDtJQUxEOztvQkFRSCxVQUFBLEdBQVksU0FBQTtBQUVSLFlBQUE7UUFBQSxHQUFBLEdBQU0sVUFBVSxDQUFDLG9CQUFYLENBQWdDLENBQUMsSUFBQyxDQUFBLFNBQUQsSUFBZSxDQUFmLElBQW9CLENBQUMsQ0FBdEIsQ0FBQSxHQUEyQixJQUFDLENBQUEsS0FBNUQsRUFBbUUsQ0FBbkUsRUFBcUUsQ0FBckUsRUFBdUUsQ0FBdkU7ZUFDTixJQUFDLENBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFqQixDQUFzQixJQUFJLENBQUMsa0JBQUwsQ0FBd0IsSUFBQyxDQUFBLElBQXpCLENBQThCLENBQUMsR0FBL0IsQ0FBbUMsR0FBbkMsQ0FBdEI7SUFIUTs7b0JBS1osV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNULFlBQUE7UUFBQSx1Q0FBTSxHQUFOO1FBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFELENBQUE7UUFDSixHQUFBLEdBQU0sSUFBQyxDQUFBLElBQUQsR0FBUTtRQUNkLEdBQUEsR0FBTSxDQUFDLENBQUMsR0FBQSxLQUFPLElBQUksQ0FBQyxDQUFaLElBQWlCLEdBQUEsS0FBTyxJQUFJLENBQUMsQ0FBOUIsQ0FBQSxJQUFxQyxDQUFDLENBQUMsQ0FBdkMsSUFBNEMsQ0FBN0MsQ0FBQSxHQUFrRCxDQUFDLENBQUMsR0FBQSxLQUFPLElBQUksQ0FBQyxDQUFaLElBQWlCLEdBQUEsS0FBTyxJQUFJLENBQUMsQ0FBOUIsQ0FBQSxJQUFxQyxDQUFDLENBQUMsQ0FBdkMsSUFBNEMsQ0FBN0MsQ0FBbEQsR0FBb0csQ0FBQyxDQUFDLEdBQUEsS0FBTyxJQUFJLENBQUMsQ0FBWixJQUFpQixHQUFBLEtBQU8sSUFBSSxDQUFDLENBQTlCLENBQUEsSUFBcUMsQ0FBQyxDQUFDLENBQXZDLElBQTRDLENBQTdDO2VBQzFHLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FBQSxHQUFNO0lBTFY7O29CQVFiLGFBQUEsR0FBZSxTQUFDLE1BQUQ7QUFDWCxnQkFBTyxNQUFNLENBQUMsRUFBZDtBQUFBLGlCQUNTLE1BQU0sQ0FBQyxNQURoQjtnQkFFUSxJQUFDLENBQUEsS0FBRCxJQUFVLE1BQU0sQ0FBQyxnQkFBUCxDQUFBLENBQUEsR0FBNEI7dUJBQ3RDLElBQUMsQ0FBQSxVQUFELENBQUE7QUFIUjt1QkFJUyx5Q0FBTSxNQUFOO0FBSlQ7SUFEVzs7OztHQXZCQzs7QUE4QnBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAgMDAwIDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgICAgIDAwMCAwMDAgICAwMDAwMDAwIFxuIyAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgMDAwICAgICAwMDAgICAgIFxuIyAgICAgMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgIDAgICAgICAwMDAwMDAwMFxuXG5RdWF0ZXJuaW9uID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblB1c2hhYmxlICAgPSByZXF1aXJlICcuL3B1c2hhYmxlJ1xuQWN0aW9uICAgICA9IHJlcXVpcmUgJy4vYWN0aW9uJ1xuRmFjZSAgICAgICA9IHJlcXVpcmUgJy4vZmFjZSdcblxuY2xhc3MgVmFsdmUgZXh0ZW5kcyBQdXNoYWJsZVxuICAgIFxuICAgIEA6IChAZmFjZSkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgQGFuZ2xlICAgICA9IDAuMFxuICAgICAgICBAYWN0aXZlICAgID0gZmFsc2VcbiAgICAgICAgQGNsb2Nrd2lzZSA9IGZhbHNlXG4gICAgICAgIEBhZGRBY3Rpb24gbmV3IEFjdGlvbiBALCBBY3Rpb24uUk9UQVRFLCBcInJvdGF0aW9uXCIsIDIwMDAsIEFjdGlvbi5SRVBFQVRcbiAgICAgICAgIyBAc3RhcnRUaW1lZEFjdGlvbiBAZ2V0QWN0aW9uV2l0aElkIEFjdGlvbi5ST1RBVEVcbiAgICBcbiAgICB1cGRhdGVNZXNoOiAtPlxuICAgICAgICAjIGtsb2cgXCJWYWx2ZS51cGRhdGVNZXNoICN7QGFuZ2xlfSAje0BmYWNlfVwiXG4gICAgICAgIHJvdCA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgKEBjbG9ja3dpc2UgYW5kIDEgb3IgLTEpICogQGFuZ2xlLCAwLDAsMVxuICAgICAgICBAbWVzaC5xdWF0ZXJuaW9uLmNvcHkgRmFjZS5vcmllbnRhdGlvbkZvckZhY2UoQGZhY2UpLm11bCByb3RcbiAgICAgICAgXG4gICAgc2V0UG9zaXRpb246IChwb3MpIC0+XG4gICAgICAgIHN1cGVyIHBvc1xuICAgICAgICBwID0gQGdldFBvcygpXG4gICAgICAgIGRpciA9IEBmYWNlICUgM1xuICAgICAgICBzdW0gPSAoKGRpciA9PSBGYWNlLlkgb3IgZGlyID09IEZhY2UuWikgYW5kIHAueCBvciAwKSArICgoZGlyID09IEZhY2UuWCBvciBkaXIgPT0gRmFjZS5aKSBhbmQgcC55IG9yIDApICsgKChkaXIgPT0gRmFjZS5YIG9yIGRpciA9PSBGYWNlLlkpIGFuZCBwLnogb3IgMClcbiAgICAgICAgQGNsb2Nrd2lzZSA9IHN1bSAlIDJcbiAgICAgICAgIyBrbG9nIFwiVmFsdmUuc2V0UG9zaXRpb24gc3VtICN7c3VtfSBAY2xvY2t3aXNlICN7QGNsb2Nrd2lzZX1cIiwgcG9zXG4gICAgICAgICAgICAgICBcbiAgICBwZXJmb3JtQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICBzd2l0Y2ggYWN0aW9uLmlkXG4gICAgICAgICAgICB3aGVuIEFjdGlvbi5ST1RBVEUgXG4gICAgICAgICAgICAgICAgQGFuZ2xlICs9IGFjdGlvbi5nZXRSZWxhdGl2ZURlbHRhKCkgKiAzNjBcbiAgICAgICAgICAgICAgICBAdXBkYXRlTWVzaCgpXG4gICAgICAgICAgICBlbHNlIHN1cGVyIGFjdGlvblxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBWYWx2ZVxuIl19
//# sourceURL=../coffee/valve.coffee