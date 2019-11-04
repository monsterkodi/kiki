// koffee 1.4.0
module.exports = {
    name: "church",
    scheme: "bronze",
    size: [5, 7, 5],
    help: "to activate the exit,\nfeed it with electricity:\n    \nconnect the generator\nwith the motor.\n\nplace a wire stone\nnext to the exit.",
    player: {
        coordinates: [2, 1, 1],
        orientation: minusYupZ
    },
    exits: [
        {
            name: "exit",
            active: 0,
            position: [0, -1, 0]
        }
    ],
    create: function() {
        var Face, Generator, MotorCylinder, MotorGear, ref, s;
        s = world.size;
        ref = require('../items'), Generator = ref.Generator, MotorCylinder = ref.MotorCylinder, MotorGear = ref.MotorGear, Face = ref.Face;
        world.addObjectLine('WireStone', 0, 0, 0, 0, s.y - 2, 0);
        world.addObjectLine('WireStone', s.x - 1, 0, 0, s.x - 1, s.y - 2, 0);
        world.addObjectLine('WireStone', s.x - 1, 0, s.z - 1, s.x - 1, s.y - 2, s.z - 1);
        world.addObjectLine('WireStone', 0, 0, s.z - 1, 0, s.y - 2, s.z - 1);
        world.addObjectAtPos('Bomb', s.x / 2, s.y - 2, s.z / 2);
        world.addObjectAtPos(new Generator(Face.Y), s.x / 2, s.y / 2, s.z / 2);
        world.addObjectAtPos('WireStone', 1, s.y - 2, 1);
        world.addObjectAtPos('WireStone', s.x - 2, s.y - 2, 1);
        world.addObjectAtPos('WireStone', 1, s.y - 2, s.z - 2);
        world.addObjectAtPos('WireStone', s.x - 2, s.y - 2, s.z - 2);
        world.addObjectAtPos('WireStone', s.x / 2, s.y - 1, s.z / 2);
        world.addObjectAtPos(new MotorGear(Face.Y), s.x / 2, 0, 0);
        return world.addObjectAtPos(new MotorCylinder(Face.Y), s.x / 2, 1, 0);
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1cmNoLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLElBQUEsRUFBWSxRQUFaO0lBQ0EsTUFBQSxFQUFZLFFBRFo7SUFFQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGWjtJQUdBLElBQUEsRUFBWSx5SUFIWjtJQWFBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFiO1FBQ0EsV0FBQSxFQUFhLFNBRGI7S0FkSjtJQWdCQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBVSxNQUFWO1lBQ0EsTUFBQSxFQUFVLENBRFY7WUFFQSxRQUFBLEVBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBQyxDQUFKLEVBQU0sQ0FBTixDQUZWO1NBRE07S0FoQlY7SUFxQkEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztRQUNWLE1BQThDLE9BQUEsQ0FBUSxVQUFSLENBQTlDLEVBQUMseUJBQUQsRUFBWSxpQ0FBWixFQUEyQix5QkFBM0IsRUFBc0M7UUFFdEMsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFqRCxFQUFvRCxDQUFwRDtRQUNBLEtBQUssQ0FBQyxhQUFOLENBQW9CLFdBQXBCLEVBQWlDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsRUFBOEMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFsRCxFQUFxRCxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXpELEVBQTRELENBQTVEO1FBQ0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFyQyxFQUF3QyxDQUF4QyxFQUEyQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQS9DLEVBQWtELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBdEQsRUFBeUQsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUE3RCxFQUFnRSxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXBFO1FBQ0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUEzQyxFQUE4QyxDQUE5QyxFQUFpRCxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXJELEVBQXdELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBNUQ7UUFFQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUFDLENBQUMsQ0FBRixHQUFJLENBQWpDLEVBQW9DLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBeEMsRUFBMkMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUEvQztRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksU0FBSixDQUFjLElBQUksQ0FBQyxDQUFuQixDQUFyQixFQUE0QyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQWhELEVBQW1ELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBdkQsRUFBMEQsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUE5RDtRQUVBLEtBQUssQ0FBQyxjQUFOLENBQXFCLFdBQXJCLEVBQWtDLENBQWxDLEVBQTBDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBOUMsRUFBa0QsQ0FBbEQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixXQUFyQixFQUFrQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXRDLEVBQTBDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBOUMsRUFBa0QsQ0FBbEQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixXQUFyQixFQUFrQyxDQUFsQyxFQUEwQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQTlDLEVBQWtELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBdEQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixXQUFyQixFQUFrQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXRDLEVBQTBDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBOUMsRUFBa0QsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUF0RDtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLFdBQXJCLEVBQWtDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBdEMsRUFBMEMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUE5QyxFQUFrRCxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXREO1FBRUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxTQUFKLENBQWMsSUFBSSxDQUFDLENBQW5CLENBQXJCLEVBQTRDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBaEQsRUFBbUQsQ0FBbkQsRUFBc0QsQ0FBdEQ7ZUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLGFBQUosQ0FBa0IsSUFBSSxDQUFDLENBQXZCLENBQXJCLEVBQWdELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBcEQsRUFBdUQsQ0FBdkQsRUFBMEQsQ0FBMUQ7SUFuQkksQ0FyQlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwXG4jICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMCAgICAgICAwMDAwMDAwMDBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgICAwMDAwMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcImNodXJjaFwiXG4gICAgc2NoZW1lOiAgICAgXCJicm9uemVcIlxuICAgIHNpemU6ICAgICAgIFs1LDcsNV1cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICB0byBhY3RpdmF0ZSB0aGUgZXhpdCxcbiAgICAgICAgICAgICAgICBmZWVkIGl0IHdpdGggZWxlY3RyaWNpdHk6XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbm5lY3QgdGhlIGdlbmVyYXRvclxuICAgICAgICAgICAgICAgIHdpdGggdGhlIG1vdG9yLlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBsYWNlIGEgd2lyZSBzdG9uZVxuICAgICAgICAgICAgICAgIG5leHQgdG8gdGhlIGV4aXQuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogWzIsMSwxXVxuICAgICAgICBvcmllbnRhdGlvbjogbWludXNZdXBaXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAwXG4gICAgICAgIHBvc2l0aW9uOiBbMCwtMSwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIHtHZW5lcmF0b3IsIE1vdG9yQ3lsaW5kZXIsIE1vdG9yR2VhciwgRmFjZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUgJ1dpcmVTdG9uZScsIDAsIDAsIDAsIDAsIHMueS0yLCAwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUgJ1dpcmVTdG9uZScsIHMueC0xLCAwLCAwLCBzLngtMSwgcy55LTIsIDBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSAnV2lyZVN0b25lJywgcy54LTEsIDAsIHMuei0xLCBzLngtMSwgcy55LTIsIHMuei0xXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUgJ1dpcmVTdG9uZScsIDAsIDAsIHMuei0xLCAwLCBzLnktMiwgcy56LTFcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdCb21iJywgcy54LzIsIHMueS0yLCBzLnovMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBuZXcgR2VuZXJhdG9yKEZhY2UuWSksIHMueC8yLCBzLnkvMiwgcy56LzJcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXaXJlU3RvbmUnLCAxLCAgICAgIHMueS0yLCAgMVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2lyZVN0b25lJywgcy54LTIsICBzLnktMiwgIDFcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dpcmVTdG9uZScsIDEsICAgICAgcy55LTIsICBzLnotMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2lyZVN0b25lJywgcy54LTIsICBzLnktMiwgIHMuei0yXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXaXJlU3RvbmUnLCBzLngvMiwgIHMueS0xLCAgcy56LzJcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBNb3RvckdlYXIoRmFjZS5ZKSwgcy54LzIsIDAsIDBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IE1vdG9yQ3lsaW5kZXIoRmFjZS5ZKSwgcy54LzIsIDEsIDBcbiJdfQ==
//# sourceURL=../../coffee/levels/church.coffee