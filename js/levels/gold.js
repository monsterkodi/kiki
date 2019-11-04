// koffee 1.4.0
module.exports = {
    name: "gold",
    scheme: "yellow",
    size: [3, 11, 3],
    help: "move the stones \nto reach the exit.",
    player: {
        coordinates: [1, 1, 0],
        orientation: minusYupZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 4, 0]
        }
    ],
    create: function() {
        var i, len, ref, results, s, x, y, z;
        s = world.size;
        ref = [2, 4, 6, 8];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            y = ref[i];
            results.push((function() {
                var j, results1;
                results1 = [];
                for (x = j = 0; j < 3; x = ++j) {
                    results1.push((function() {
                        var k, results2;
                        results2 = [];
                        for (z = k = 0; k < 3; z = ++k) {
                            results2.push(world.addObjectAtPos('Stone', x, y, z));
                        }
                        return results2;
                    })());
                }
                return results1;
            })());
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29sZC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxRQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLEVBQUgsRUFBTSxDQUFOLENBRlo7SUFHQSxJQUFBLEVBQVksc0NBSFo7SUFPQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBYjtRQUNBLFdBQUEsRUFBYSxTQURiO0tBUko7SUFXQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURNO0tBWFY7SUFnQkEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUNWO0FBQUE7YUFBQSxxQ0FBQTs7OztBQUNJO3FCQUFTLHlCQUFUOzs7QUFDSTs2QkFBUyx5QkFBVDswQ0FDSSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztBQURKOzs7QUFESjs7O0FBREo7O0lBRkksQ0FoQlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgICAgMDAwMDAwMCAgXG4jICAgMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwXG4jICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJnb2xkXCJcbiAgICBzY2hlbWU6ICAgICBcInllbGxvd1wiXG4gICAgc2l6ZTogICAgICAgWzMsMTEsM11cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICBtb3ZlIHRoZSBzdG9uZXMgXG4gICAgICAgICAgICAgICAgdG8gcmVhY2ggdGhlIGV4aXQuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOlxuICAgICAgICBjb29yZGluYXRlczogWzEsMSwwXVxuICAgICAgICBvcmllbnRhdGlvbjogbWludXNZdXBaXG4gICAgICAgIFxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsNCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIGZvciB5IGluIFsyLDQsNiw4XVxuICAgICAgICAgICAgZm9yIHggaW4gWzAuLi4zXVxuICAgICAgICAgICAgICAgIGZvciB6IGluIFswLi4uM11cbiAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgeCwgeSwgeiBcbiJdfQ==
//# sourceURL=../../coffee/levels/gold.coffee