// koffee 1.4.0
module.exports = {
    name: "cube",
    deisgn: 'Michael Abel',
    scheme: "red",
    size: [5, 5, 5],
    help: "reach the exit!",
    player: {
        coordinates: [2, 0, 0],
        nostatus: 0,
        orientation: rot0
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 2, 2]
        }
    ],
    create: function() {
        var i, j, k, l, results;
        results = [];
        for (i = k = 0; k < 5; i = ++k) {
            results.push((function() {
                var m, results1;
                results1 = [];
                for (j = m = 0; m < 5; j = ++m) {
                    results1.push((function() {
                        var n, results2;
                        results2 = [];
                        for (l = n = 0; n < 5; l = ++n) {
                            if (Math.pow(-1, i + j + l) === -1) {
                                results2.push(world.addObjectAtPos('Stone', i, j, l));
                            } else {
                                results2.push(void 0);
                            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ViZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLEtBRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIWjtJQUlBLElBQUEsRUFBWSxpQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFkO1FBQ0EsUUFBQSxFQUFjLENBRGQ7UUFFQSxXQUFBLEVBQWMsSUFGZDtLQU5KO0lBVUEsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWMsTUFBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRmQ7U0FETTtLQVZWO0lBZUEsTUFBQSxFQUFRLFNBQUE7QUFFSixZQUFBO0FBQUE7YUFBUyx5QkFBVDs7O0FBQ0k7cUJBQVMseUJBQVQ7OztBQUNJOzZCQUFTLHlCQUFUOzRCQUNJLElBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBRixHQUFJLENBQWpCLENBQUEsS0FBdUIsQ0FBQyxDQUEzQjs4Q0FDSSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixDQUE5QixFQUFnQyxDQUFoQyxFQUFrQyxDQUFsQyxHQURKOzZCQUFBLE1BQUE7c0RBQUE7O0FBREo7OztBQURKOzs7QUFESjs7SUFGSSxDQWZSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAwMDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgXG4jICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMDBcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwiY3ViZVwiXG4gICAgZGVpc2duOiAgICAgJ01pY2hhZWwgQWJlbCdcbiAgICBzY2hlbWU6ICAgICBcInJlZFwiXG4gICAgc2l6ZTogICAgICAgWzUsNSw1XVxuICAgIGhlbHA6ICAgICAgIFwicmVhY2ggdGhlIGV4aXQhXCJcbiAgICBwbGF5ZXI6XG4gICAgICAgIGNvb3JkaW5hdGVzOiAgWzIsMCwwXVxuICAgICAgICBub3N0YXR1czogICAgIDBcbiAgICAgICAgb3JpZW50YXRpb246ICByb3QwXG4gICAgICAgIFxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsMiwyXVxuICAgIF0sXG4gICAgY3JlYXRlOiAtPlxuICAgICAgICAgICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4uLjVdXG4gICAgICAgICAgICBmb3IgaiBpbiBbMC4uLjVdXG4gICAgICAgICAgICAgICAgZm9yIGwgaW4gWzAuLi41XVxuICAgICAgICAgICAgICAgICAgICBpZiBNYXRoLnBvdygtMSwgaStqK2wpID09IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnU3RvbmUnLCBpLGosbCBcbiJdfQ==
//# sourceURL=../../coffee/levels/cube.coffee