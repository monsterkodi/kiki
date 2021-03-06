// koffee 1.4.0
var Quaternion, Vector;

Quaternion = require('../lib/quaternion');

Vector = require('../lib/vector');

module.exports = {
    name: "plate",
    scheme: "crazy",
    size: [7, 7, 9],
    help: "get to the exit!\n\nuse the bombs :)",
    player: {
        coordinates: [2, 3, 3],
        orientation: minusXdownZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var Stone;
        Stone = require('../items').Stone;
        world.addObjectAtPos('Stone', world.decenter(0, 0, 0));
        world.addObjectPoly('new Stone({slippery:true})', [world.decenter(1, 1, 0), world.decenter(1, -1, 0), world.decenter(-1, -1, 0), world.decenter(-1, 1, 0)]);
        world.addObjectAtPos('Bomb', world.decenter(0, 1, -4));
        world.addObjectAtPos('Bomb', world.decenter(0, -1, -4));
        world.addObjectAtPos('Bomb', world.decenter(1, 0, -4));
        world.addObjectAtPos('Bomb', world.decenter(-1, 0, -4));
        return world.addObjectAtPos('Bomb', world.decenter(0, 0, -2));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQSxJQUFBOztBQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztBQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksT0FBWjtJQUNBLE1BQUEsRUFBWSxPQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksc0NBSFo7SUFRQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCO1FBQ0EsV0FBQSxFQUFnQixXQURoQjtLQVRKO0lBV0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWMsTUFBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFXLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlg7U0FETTtLQVhWO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO0FBRUosWUFBQTtRQUFDLFFBQVMsT0FBQSxDQUFRLFVBQVI7UUFDVixLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsQ0FBOUI7UUFDQSxLQUFLLENBQUMsYUFBTixDQUFxQiw0QkFBckIsRUFBbUQsQ0FBQyxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsQ0FBRCxFQUF3QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBQyxDQUFsQixFQUFvQixDQUFwQixDQUF4QixFQUFnRCxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBa0IsQ0FBQyxDQUFuQixFQUFxQixDQUFyQixDQUFoRCxFQUF5RSxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBa0IsQ0FBbEIsRUFBb0IsQ0FBcEIsQ0FBekUsQ0FBbkQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBQyxDQUFwQixDQUE3QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFpQixDQUFDLENBQWxCLEVBQW9CLENBQUMsQ0FBckIsQ0FBN0I7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBQyxDQUFwQixDQUE3QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFrQixDQUFsQixFQUFvQixDQUFDLENBQXJCLENBQTdCO2VBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWlCLENBQWpCLEVBQW1CLENBQUMsQ0FBcEIsQ0FBN0I7SUFUSSxDQWhCUiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwICAgICBcbiMgMDAwICAgICAgICAwMDAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAgXG4jIDAwMCAgICAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwICAgIFxuXG4jIGxldmVsIGRlc2lnbiBieSBNaWNoYWVsIEFiZWxcblxuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4uL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4uL2xpYi92ZWN0b3InXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcInBsYXRlXCJcbiAgICBzY2hlbWU6ICAgICBcImNyYXp5XCJcbiAgICBzaXplOiAgICAgICBbNyw3LDldXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgZ2V0IHRvIHRoZSBleGl0IVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHVzZSB0aGUgYm9tYnMgOilcbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6ICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICBbMiwzLDNdXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICBtaW51c1hkb3duWlxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgXG4gICAgICAgIHtTdG9uZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMCwwLDAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdFBvbHkgICduZXcgU3RvbmUoe3NsaXBwZXJ5OnRydWV9KScsIFt3b3JsZC5kZWNlbnRlcigxLDEsMCksIHdvcmxkLmRlY2VudGVyKDEsLTEsMCksIHdvcmxkLmRlY2VudGVyKC0xLC0xLDApLCB3b3JsZC5kZWNlbnRlcigtMSwxLDApXVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnQm9tYicsIHdvcmxkLmRlY2VudGVyIDAsMSwtNFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnQm9tYicsIHdvcmxkLmRlY2VudGVyIDAsLTEsLTRcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ0JvbWInLCB3b3JsZC5kZWNlbnRlciAxLDAsLTRcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ0JvbWInLCB3b3JsZC5kZWNlbnRlciAtMSwwLC00XG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdCb21iJywgd29ybGQuZGVjZW50ZXIgMCwwLC0yXG4iXX0=
//# sourceURL=../../coffee/levels/plate.coffee