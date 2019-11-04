// koffee 1.4.0
module.exports = {
    name: "grid",
    scheme: "crazy",
    size: [9, 9, 9],
    help: "to get to the exit,\nuse the stones.",
    player: {
        coordinates: [3, 4, 8],
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
        var i, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, ref4, ref5, s, x, y, z;
        s = world.size;
        ref = [-1, 1];
        for (i = 0, len = ref.length; i < len; i++) {
            y = ref[i];
            ref1 = [-1, 1, 3];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
                x = ref1[j];
                ref2 = [-1, 1, 3];
                for (k = 0, len2 = ref2.length; k < len2; k++) {
                    z = ref2[k];
                    world.addObjectAtPos('Wall', world.decenter(x, y, z));
                }
            }
        }
        ref3 = [-4, 4];
        for (l = 0, len3 = ref3.length; l < len3; l++) {
            y = ref3[l];
            ref4 = [-3, -1, 1, 3];
            for (m = 0, len4 = ref4.length; m < len4; m++) {
                x = ref4[m];
                ref5 = [-3, -1, 1, 3];
                for (n = 0, len5 = ref5.length; n < len5; n++) {
                    z = ref5[n];
                    world.addObjectAtPos('Wall', world.decenter(x, y, z));
                }
            }
        }
        world.addObjectAtPos('Stone', world.decenter(3, -3, 0));
        world.addObjectAtPos('Stone', world.decenter(-3, -3, 0));
        world.addObjectAtPos('Stone', world.decenter(3, 3, 0));
        world.addObjectAtPos('Stone', world.decenter(-3, 3, 0));
        world.addObjectAtPos('Stone', world.decenter(0, -3, 0));
        return world.addObjectAtPos('Stone', world.decenter(0, 3, 0));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxPQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksc0NBSFo7SUFPQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBYjtRQUNBLFdBQUEsRUFBYSxXQURiO0tBUko7SUFVQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURNO0tBVlY7SUFlQSxNQUFBLEVBQVEsU0FBQTtBQUVKLFlBQUE7UUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDO0FBRVY7QUFBQSxhQUFBLHFDQUFBOztBQUNJO0FBQUEsaUJBQUEsd0NBQUE7O0FBQ0k7QUFBQSxxQkFBQSx3Q0FBQTs7b0JBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQTdCO0FBREo7QUFESjtBQURKO0FBS0E7QUFBQSxhQUFBLHdDQUFBOztBQUNJO0FBQUEsaUJBQUEsd0NBQUE7O0FBQ0k7QUFBQSxxQkFBQSx3Q0FBQTs7b0JBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQTdCO0FBREo7QUFESjtBQURKO1FBS0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWlCLENBQUMsQ0FBbEIsRUFBb0IsQ0FBcEIsQ0FBOUI7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBa0IsQ0FBQyxDQUFuQixFQUFxQixDQUFyQixDQUE5QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFpQixDQUFqQixFQUFtQixDQUFuQixDQUE5QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFrQixDQUFsQixFQUFvQixDQUFwQixDQUE5QjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFpQixDQUFDLENBQWxCLEVBQW9CLENBQXBCLENBQTlCO2VBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWlCLENBQWpCLEVBQW1CLENBQW5CLENBQTlCO0lBbkJJLENBZlIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgICAgICBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAgIFxuIyAwMDAgIDAwMDAgIDAwMDAwMDAgICAgMDAwICAwMDAgICAwMDAgICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgICBcbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgMDAwMDAwMCAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJncmlkXCJcbiAgICBzY2hlbWU6ICAgICBcImNyYXp5XCJcbiAgICBzaXplOiAgICAgICBbOSw5LDldXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgdG8gZ2V0IHRvIHRoZSBleGl0LFxuICAgICAgICAgICAgICAgIHVzZSB0aGUgc3RvbmVzLlxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgIHBsYXllcjogICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbMyw0LDhdXG4gICAgICAgIG9yaWVudGF0aW9uOiBtaW51c1hkb3duWlxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4jIFxuICAgICAgICBzID0gd29ybGQuc2l6ZVxuICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWy0xLCAxXVxuICAgICAgICAgICAgZm9yIHggaW4gWy0xLDEsM11cbiAgICAgICAgICAgICAgICBmb3IgeiBpbiBbLTEsMSwzXVxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIHgsIHksIHogIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWy00LCA0XVxuICAgICAgICAgICAgZm9yIHggaW4gWy0zLCAtMSwgMSwgM11cbiAgICAgICAgICAgICAgICBmb3IgeiBpbiBbLTMsIC0xLCAxLCAzXVxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIHdvcmxkLmRlY2VudGVyIHgsIHksIHogIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMywtMywwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIHdvcmxkLmRlY2VudGVyIC0zLC0zLDBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMywzLDBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgLTMsMywwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIHdvcmxkLmRlY2VudGVyIDAsLTMsMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnU3RvbmUnLCB3b3JsZC5kZWNlbnRlciAwLDMsMFxuICAgICAgICAiXX0=
//# sourceURL=../../coffee/levels/grid.coffee