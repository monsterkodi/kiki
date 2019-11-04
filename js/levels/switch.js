// koffee 1.4.0
module.exports = {
    name: "switch",
    scheme: "tron",
    size: [7, 7, 7],
    help: "to activate the exit, \nactivate the 4 switches.",
    player: {
        coordinates: [3, 4, 3],
        orientation: minusZdownY
    },
    exits: [
        {
            name: "exit",
            active: 0,
            position: [0, -1, 0]
        }
    ],
    create: function() {
        var Switch, h, s, s1, s2, s3, s4, switched;
        s = world.size;
        h = 0;
        world.addObjectAtPos('Stone', s.x / 2, s.y / 2, s.z / 2);
        world.addObjectAtPos('Stone', s.x / 2, s.y - 2, s.z / 2);
        world.addObjectAtPos('Bomb', s.x / 2, 1, s.z / 2);
        world.addObjectAtPos('Wall', world.decenter(0, h - 1, s.z / 2));
        world.addObjectAtPos('Wall', world.decenter(0, h + 1, s.z / 2));
        world.addObjectAtPos('Wall', world.decenter(1, h, s.z / 2));
        world.addObjectAtPos('Wall', world.decenter(-1, h, s.z / 2));
        world.addObjectAtPos('Wall', world.decenter(s.x / 2, h - 1, 0));
        world.addObjectAtPos('Wall', world.decenter(s.x / 2, h + 1, 0));
        world.addObjectAtPos('Wall', world.decenter(s.x / 2, h, 1));
        world.addObjectAtPos('Wall', world.decenter(s.x / 2, h, -1));
        world.addObjectAtPos('Wall', world.decenter(0, h - 1, -s.z / 2 + 1));
        world.addObjectAtPos('Wall', world.decenter(0, h + 1, -s.z / 2 + 1));
        world.addObjectAtPos('Wall', world.decenter(1, h, -s.z / 2 + 1));
        world.addObjectAtPos('Wall', world.decenter(-1, h, -s.z / 2 + 1));
        world.addObjectAtPos('Wall', world.decenter(-s.x / 2 + 1, h - 1, 0));
        world.addObjectAtPos('Wall', world.decenter(-s.x / 2 + 1, h + 1, 0));
        world.addObjectAtPos('Wall', world.decenter(-s.x / 2 + 1, h, 1));
        world.addObjectAtPos('Wall', world.decenter(-s.x / 2 + 1, h, -1));
        world.switch_counter = 0;
        switched = function(swtch) {
            var exit;
            world.switch_counter += swtch.active && 1 || -1;
            exit = world.getObjectWithName("exit");
            return exit.setActive(world.switch_counter === 4);
        };
        Switch = require('../switch');
        s1 = new Switch();
        s1.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(s1);
        }));
        s2 = new Switch();
        s2.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(s2);
        }));
        s3 = new Switch();
        s3.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(s3);
        }));
        s4 = new Switch();
        s4.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(s4);
        }));
        world.addObjectAtPos(s1, world.decenter(-s.x / 2 + 1, 0, 0));
        world.addObjectAtPos(s2, world.decenter(s.x / 2, 0, 0));
        world.addObjectAtPos(s3, world.decenter(0, 0, -s.z / 2 + 1));
        return world.addObjectAtPos(s4, world.decenter(0, 0, s.z / 2));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLElBQUEsRUFBWSxRQUFaO0lBQ0EsTUFBQSxFQUFZLE1BRFo7SUFFQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGWjtJQUdBLElBQUEsRUFBWSxrREFIWjtJQU9BLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBZ0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBaEI7UUFDQSxXQUFBLEVBQWdCLFdBRGhCO0tBUko7SUFVQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBZ0IsTUFBaEI7WUFDQSxNQUFBLEVBQWdCLENBRGhCO1lBRUEsUUFBQSxFQUFnQixDQUFDLENBQUQsRUFBRyxDQUFDLENBQUosRUFBTSxDQUFOLENBRmhCO1NBRE07S0FWVjtJQWVBLE1BQUEsRUFBUSxTQUFBO0FBRUosWUFBQTtRQUFBLENBQUEsR0FBSSxLQUFLLENBQUM7UUFDVixDQUFBLEdBQUk7UUFFSixLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixDQUFDLENBQUMsQ0FBRixHQUFJLENBQWxDLEVBQXFDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBekMsRUFBNEMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFoRDtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBbEMsRUFBcUMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUF6QyxFQUE0QyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQWhEO1FBRUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQTNDO1FBR0EsS0FBSyxDQUFDLGNB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QUFBO21CQUFHLFFBQUEsQ0FBUyxFQUFUO1FBQUgsQ0FBakIsQ0FBMUM7UUFDQSxFQUFBLEdBQUssSUFBSSxNQUFKLENBQUE7UUFDTCxFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxTQUFoQyxDQUEwQyxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFBO21CQUFHLFFBQUEsQ0FBUyxFQUFUO1FBQUgsQ0FBakIsQ0FBMUM7UUFFQSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBQyxDQUFDLENBQUgsR0FBSyxDQUFMLEdBQU8sQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBekI7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixLQUFLLENBQUMsUUFBTixDQUFnQixDQUFDLENBQUMsQ0FBRixHQUFJLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLENBQXpCO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsRUFBckIsRUFBeUIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUgsR0FBSyxDQUFMLEdBQU8sQ0FBNUIsQ0FBekI7ZUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBc0IsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUExQixDQUF6QjtJQXJESSxDQWZSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDBcbiMgICAwMDAgICAgICAgMDAwIDAgMDAwICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwMDAwMDAwXG4jICAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAgICAgIDAwMCAgICAgIDAwMDAwMDAgIDAwMCAgIDAwMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJzd2l0Y2hcIlxuICAgIHNjaGVtZTogICAgIFwidHJvblwiXG4gICAgc2l6ZTogICAgICAgWzcsNyw3XVxuICAgIGhlbHA6ICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIHRvIGFjdGl2YXRlIHRoZSBleGl0LCBcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZSB0aGUgNCBzd2l0Y2hlcy5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6XG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICBbMyw0LDNdXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICBtaW51c1pkb3duWVxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgICAgMFxuICAgICAgICBwb3NpdGlvbjogICAgICAgWzAsLTEsMF1cbiAgICBdXG4gICAgY3JlYXRlOiAtPlxuXG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIGggPSAwXG4gICAgICAgIFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnU3RvbmUnLCBzLngvMiwgcy55LzIsIHMuei8yXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIHMueC8yLCBzLnktMiwgcy56LzJcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdCb21iJywgcy54LzIsIDEsIHMuei8yXG4gICAgICAgIFxuICAgICAgICAjIHN0b25lIGZyYW1lcyBmb3Igc3dpdGNoZXNcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMCwgIGgtMSwgcy56LzJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMCwgIGgrMSwgcy56LzJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMSwgIGgsIHMuei8yXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgd29ybGQuZGVjZW50ZXIgLTEsICBoLCBzLnovMlxuICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciBzLngvMiwgaC0xLCAwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgd29ybGQuZGVjZW50ZXIgcy54LzIsIGgrMSwgMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIHMueC8yLCBoLCAgMVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIHMueC8yLCBoLCAtMVxuICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMCwgIGgtMSwgLXMuei8yKzFcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMCwgIGgrMSwgLXMuei8yKzFcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAgMSwgIGgsIC1zLnovMisxXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgd29ybGQuZGVjZW50ZXIgLTEsICBoLCAtcy56LzIrMVxuICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCB3b3JsZC5kZWNlbnRlciAtcy54LzIrMSwgaC0xLCAwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgd29ybGQuZGVjZW50ZXIgLXMueC8yKzEsIGgrMSwgMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIC1zLngvMisxLCBoLCAgMVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIC1zLngvMisxLCBoLCAtMVxuICAgICAgICBcbiAgICAgICAgIyBzd2l0Y2hlc1xuICAgICAgICBcbiAgICAgICAgd29ybGQuc3dpdGNoX2NvdW50ZXIgPSAwXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2hlZCA9IChzd3RjaCkgLT5cbiAgICAgICAgICAgIHdvcmxkLnN3aXRjaF9jb3VudGVyICs9IHN3dGNoLmFjdGl2ZSBhbmQgMSBvciAtMVxuICAgICAgICAgICAgZXhpdCA9IHdvcmxkLmdldE9iamVjdFdpdGhOYW1lIFwiZXhpdFwiIFxuICAgICAgICAgICAgZXhpdC5zZXRBY3RpdmUgd29ybGQuc3dpdGNoX2NvdW50ZXIgPT0gNCBcbiAgICAgICAgXG4gICAgICAgIFN3aXRjaCA9IHJlcXVpcmUgJy4uL3N3aXRjaCdcbiAgICAgICAgczEgPSBuZXcgU3dpdGNoKClcbiAgICAgICAgczEuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHMxXG4gICAgICAgIHMyID0gbmV3IFN3aXRjaCgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgczIuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHMyXG4gICAgICAgIHMzID0gbmV3IFN3aXRjaCgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgczMuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHMzXG4gICAgICAgIHM0ID0gbmV3IFN3aXRjaCgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgczQuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHM0XG4gICAgICAgIFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBzMSwgd29ybGQuZGVjZW50ZXIgLXMueC8yKzEsIDAsIDBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgczIsIHdvcmxkLmRlY2VudGVyICBzLngvMiwgMCwgMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBzMywgd29ybGQuZGVjZW50ZXIgMCwgMCwgLXMuei8yKzFcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgczQsIHdvcmxkLmRlY2VudGVyIDAsIDAsICBzLnovMlxuICAgICAgICAiXX0=
//# sourceURL=../../coffee/levels/switch.coffee