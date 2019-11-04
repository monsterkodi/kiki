// koffee 1.4.0
module.exports = {
    name: 'bombs',
    scheme: "red",
    size: [9, 9, 9],
    help: "to get to the exit,\nuse the bombs.",
    player: {
        coordinates: [4, 0, 4],
        orientation: XupY
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 2, 0]
        }
    ],
    create: function() {
        world.addObjectAtPos('Bomb', world.decenter(0, -4, 2));
        world.addObjectAtPos('Bomb', world.decenter(0, -4, -2));
        return world.addObjectAtPos('Bomb', world.decenter(-3, -2, 0));
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9tYnMuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsSUFBQSxFQUFVLE9BQVY7SUFDQSxNQUFBLEVBQVUsS0FEVjtJQUVBLElBQUEsRUFBVSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZWO0lBR0EsSUFBQSxFQUFVLHFDQUhWO0lBT0EsTUFBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWI7UUFDQSxXQUFBLEVBQWEsSUFEYjtLQVJKO0lBV0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQVUsTUFBVjtZQUNBLE1BQUEsRUFBVSxDQURWO1lBRUEsUUFBQSxFQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlY7U0FETTtLQVhWO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO1FBQ0osS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWlCLENBQUMsQ0FBbEIsRUFBb0IsQ0FBcEIsQ0FBN0I7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBaUIsQ0FBQyxDQUFsQixFQUFvQixDQUFDLENBQXJCLENBQTdCO2VBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFDLENBQWhCLEVBQWtCLENBQUMsQ0FBbkIsRUFBcUIsQ0FBckIsQ0FBN0I7SUFISSxDQWhCUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMCAgICAgMDAgIDAwMDAwMDAgICAgIDAwMDAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jICAgMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgICAgICAwMDBcbiMgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgbmFtZTogICAgICdib21icydcbiAgICBzY2hlbWU6ICAgXCJyZWRcIlxuICAgIHNpemU6ICAgICBbOSw5LDldXG4gICAgaGVscDogICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIHRvIGdldCB0byB0aGUgZXhpdCxcbiAgICAgICAgICAgICAgICB1c2UgdGhlIGJvbWJzLlxuICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6ICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbNCwwLDRdXG4gICAgICAgIG9yaWVudGF0aW9uOiBYdXBZXG4gICAgICAgICAgICAgIFxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgMVxuICAgICAgICBwb3NpdGlvbjogWzAsMiwwXVxuICAgIF0sXG4gICAgY3JlYXRlOiAtPlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnQm9tYicsIHdvcmxkLmRlY2VudGVyIDAsLTQsMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnQm9tYicsIHdvcmxkLmRlY2VudGVyIDAsLTQsLTJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ0JvbWInLCB3b3JsZC5kZWNlbnRlciAtMywtMiwwIl19
//# sourceURL=../../coffee/levels/bombs.coffee