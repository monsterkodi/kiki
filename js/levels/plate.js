// koffee 1.4.0
var Quaternion, Vector;

Quaternion = require('../lib/quaternion');

Vector = require('../lib/vector');

module.exports = {
    name: "plate",
    scheme: "crazy",
    size: [7, 7, 9],
    help: "$scale(1.5)mission:\nget to the exit!\n\nuse the bombs :)",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGUuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQSxJQUFBOztBQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsbUJBQVI7O0FBQ2IsTUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztBQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksT0FBWjtJQUNBLE1BQUEsRUFBWSxPQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksMkRBSFo7SUFRQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCO1FBQ0EsV0FBQSxFQUFnQixXQURoQjtLQVRKO0lBV0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWMsTUFBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFXLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlg7U0FETTtLQVhWO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO0FBRUosWUFBQTtRQUFDLFFBQVMsT0FBQSxDQUFRLFVBQVI7UUFDVixLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsQ0FBOUI7UUFDQSxLQUFLLENBQUMsYUFBTixDQUFxQiw0QkFBckIsRUFBbUQsQ0FBQyxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsQ0FBRCxFQUF3QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBQyxDQUFsQixFQUFvQixDQUFwQixDQUF4QixFQUFnRCxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBa0IsQ0FBQyxDQUFuQixFQUFxQixDQUFyQixDQUFoRCxFQUF5RSxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBa0IsQ0FBbEIsRUFBb0IsQ0FBcEIsQ0FBekUsQ0FBbkQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBQyxDQUFwQixDQUE3QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFpQixDQUFDLENBQWxCLEVBQW9CLENBQUMsQ0FBckIsQ0FBN0I7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBakIsRUFBbUIsQ0FBQyxDQUFwQixDQUE3QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFrQixDQUFsQixFQUFvQixDQUFDLENBQXJCLENBQTdCO2VBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWlCLENBQWpCLEVBQW1CLENBQUMsQ0FBcEIsQ0FBN0I7SUFUSSxDQWhCUiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwICAgICBcbiMgMDAwICAgICAgICAwMDAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgICAgXG4jIDAwMCAgICAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwICAgIFxuXG4jIGxldmVsIGRlc2lnbiBieSBNaWNoYWVsIEFiZWxcblxuUXVhdGVybmlvbiA9IHJlcXVpcmUgJy4uL2xpYi9xdWF0ZXJuaW9uJ1xuVmVjdG9yICAgICA9IHJlcXVpcmUgJy4uL2xpYi92ZWN0b3InXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcInBsYXRlXCJcbiAgICBzY2hlbWU6ICAgICBcImNyYXp5XCJcbiAgICBzaXplOiAgICAgICBbNyw3LDldXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgJHNjYWxlKDEuNSltaXNzaW9uOlxcbmdldCB0byB0aGUgZXhpdCFcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB1c2UgdGhlIGJvbWJzIDopXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogICAgWzIsMywzXVxuICAgICAgICBvcmllbnRhdGlvbjogICAgbWludXNYZG93blpcbiAgICBleGl0czogICAgW1xuICAgICAgICBuYW1lOiAgICAgICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgMVxuICAgICAgICBwb3NpdGlvbjogIFswLDAsMF1cbiAgICBdXG4gICAgY3JlYXRlOiAtPlxuICAgIFxuICAgICAgICB7U3RvbmV9ID0gcmVxdWlyZSAnLi4vaXRlbXMnXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIHdvcmxkLmRlY2VudGVyIDAsMCwwIFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RQb2x5ICAnbmV3IFN0b25lKHtzbGlwcGVyeTp0cnVlfSknLCBbd29ybGQuZGVjZW50ZXIoMSwxLDApLCB3b3JsZC5kZWNlbnRlcigxLC0xLDApLCB3b3JsZC5kZWNlbnRlcigtMSwtMSwwKSwgd29ybGQuZGVjZW50ZXIoLTEsMSwwKV1cbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ0JvbWInLCB3b3JsZC5kZWNlbnRlciAwLDEsLTRcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ0JvbWInLCB3b3JsZC5kZWNlbnRlciAwLC0xLC00XG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdCb21iJywgd29ybGQuZGVjZW50ZXIgMSwwLC00XG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdCb21iJywgd29ybGQuZGVjZW50ZXIgLTEsMCwtNFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnQm9tYicsIHdvcmxkLmRlY2VudGVyIDAsMCwtMlxuIl19
//# sourceURL=../../coffee/levels/plate.coffee