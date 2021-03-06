// koffee 1.4.0
module.exports = {
    name: "love",
    scheme: "red",
    size: [13, 13, 13],
    help: "get to the exit!",
    player: {
        coordinates: [6, 4, 2],
        orientation: minusZupY
    },
    exits: [
        {
            name: "peace",
            active: 1,
            position: [0, 0, 4]
        }
    ],
    create: function() {
        var h, heart, i, len;
        heart = [[0, 0], [1, 1], [2, 1], [3, 0], [3, -1], [2, -2], [1, -3], [0, -4], [-1, 1], [-2, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
        for (i = 0, len = heart.length; i < len; i++) {
            h = heart[i];
            world.addObjectAtPos('Bomb', world.decenter(h[0], h[1] + 1, 4));
            world.addObjectAtPos('Stone', world.decenter(h[0], h[1] + 1, -4));
        }
        return world.addObjectAtPos('Mutant', world.decenter(0, -4, 0));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG92ZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxLQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsRUFBRCxFQUFJLEVBQUosRUFBTyxFQUFQLENBRlo7SUFHQSxJQUFBLEVBQVksa0JBSFo7SUFJQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCO1FBQ0EsV0FBQSxFQUFnQixTQURoQjtLQUxKO0lBT0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWMsT0FBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRmQ7U0FETTtLQVBWO0lBWUEsTUFBQSxFQUFRLFNBQUE7QUFFSixZQUFBO1FBQUEsS0FBQSxHQUFRLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQVEsQ0FBRSxDQUFGLEVBQUksQ0FBSixDQUFSLEVBQWdCLENBQUUsQ0FBRixFQUFJLENBQUosQ0FBaEIsRUFBd0IsQ0FBRSxDQUFGLEVBQUksQ0FBSixDQUF4QixFQUFnQyxDQUFFLENBQUYsRUFBSSxDQUFDLENBQUwsQ0FBaEMsRUFBeUMsQ0FBRSxDQUFGLEVBQUksQ0FBQyxDQUFMLENBQXpDLEVBQWtELENBQUUsQ0FBRixFQUFJLENBQUMsQ0FBTCxDQUFsRCxFQUEyRCxDQUFDLENBQUQsRUFBRyxDQUFDLENBQUosQ0FBM0QsRUFDQSxDQUFDLENBQUMsQ0FBRixFQUFJLENBQUosQ0FEQSxFQUNRLENBQUMsQ0FBQyxDQUFGLEVBQUksQ0FBSixDQURSLEVBQ2dCLENBQUMsQ0FBQyxDQUFGLEVBQUksQ0FBSixDQURoQixFQUN3QixDQUFDLENBQUMsQ0FBRixFQUFJLENBQUMsQ0FBTCxDQUR4QixFQUNpQyxDQUFDLENBQUMsQ0FBRixFQUFJLENBQUMsQ0FBTCxDQURqQyxFQUMwQyxDQUFDLENBQUMsQ0FBRixFQUFJLENBQUMsQ0FBTCxDQUQxQztBQUVSLGFBQUEsdUNBQUE7O1lBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFFLENBQUEsQ0FBQSxDQUFqQixFQUFvQixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQUssQ0FBekIsRUFBMkIsQ0FBM0IsQ0FBN0I7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixLQUFLLENBQUMsUUFBTixDQUFlLENBQUUsQ0FBQSxDQUFBLENBQWpCLEVBQW9CLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBSyxDQUF6QixFQUEyQixDQUFDLENBQTVCLENBQTlCO0FBRko7ZUFJQSxLQUFLLENBQUMsY0FBTixDQUFxQixRQUFyQixFQUErQixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBQyxDQUFsQixFQUFvQixDQUFwQixDQUEvQjtJQVJJLENBWlIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICBcbiMgMDAwICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgIFxuIyAwMDAgICAgICAwMDAgICAwMDAgICAwMDAgMDAwICAgMDAwMDAwMCAgICAgXG4jIDAwMCAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgICBcbiMgMDAwMDAwMCAgIDAwMDAwMDAgICAgICAgMCAgICAgIDAwMDAwMDAwICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJsb3ZlXCJcbiAgICBzY2hlbWU6ICAgICBcInJlZFwiXG4gICAgc2l6ZTogICAgICAgWzEzLDEzLDEzXVxuICAgIGhlbHA6ICAgICAgIFwiZ2V0IHRvIHRoZSBleGl0IVwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogICAgWzYsNCwyXVxuICAgICAgICBvcmllbnRhdGlvbjogICAgbWludXNadXBZIFxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJwZWFjZVwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgMVxuICAgICAgICBwb3NpdGlvbjogICAgIFswLDAsNF1cbiAgICBdXG4gICAgY3JlYXRlOiAtPlxuXG4gICAgICAgIGhlYXJ0ID0gW1swLDBdLCBbIDEsMV0sIFsgMiwxXSwgWyAzLDBdLCBbIDMsLTFdLCBbIDIsLTJdLCBbIDEsLTNdLCBbMCwtNF0sXG4gICAgICAgICAgICAgICAgWy0xLDFdLCBbLTIsMV0sIFstMywwXSwgWy0zLC0xXSwgWy0yLC0yXSwgWy0xLC0zXV1cbiAgICAgICAgZm9yIGggaW4gaGVhcnRcbiAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKCdCb21iJywgd29ybGQuZGVjZW50ZXIoaFswXSxoWzFdKzEsNCkpXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcygnU3RvbmUnLCB3b3JsZC5kZWNlbnRlcihoWzBdLGhbMV0rMSwtNCkpXG4gICAgICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ011dGFudCcsIHdvcmxkLmRlY2VudGVyKDAsLTQsMCkpIl19
//# sourceURL=../../coffee/levels/love.coffee