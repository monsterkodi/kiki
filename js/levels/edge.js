// koffee 1.4.0
module.exports = {
    name: "edge",
    design: "Michael Abel",
    scheme: "candy",
    size: [7, 7, 7],
    help: "get to the exit!",
    player: {
        coordinates: [3, 0, 5],
        orientation: ZupY
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var Stone, c, d, i, j, k, l, results, s;
        s = world.size;
        Stone = require('../items').Stone;
        results = [];
        for (i = k = 0; k < 3; i = ++k) {
            results.push((function() {
                var m, results1;
                results1 = [];
                for (j = m = 0; m < 3; j = ++m) {
                    results1.push((function() {
                        var n, results2;
                        results2 = [];
                        for (l = n = 0; n < 3; l = ++n) {
                            if ((i === 2 || j === 2 || l === 2) && i >= 1 && j >= 1 && l >= 1) {
                                c = 0.6 - 0.3 * Math.pow(-1, i + j + l);
                                d = 0.6 + 0.3 * Math.pow(-1, i + j + l);
                                world.addObjectAtPos(new Stone({
                                    color: [c, 0, d, 0.8]
                                }), i, j, l);
                                world.addObjectAtPos(new Stone({
                                    color: [c, 0, d, 0.8]
                                }), s.x - i - 1, s.y - j - 1, s.z - l - 1);
                                world.addObjectAtPos(new Stone({
                                    color: [c, 0, d, 0.8]
                                }), s.x - i - 1, j, l);
                                results2.push(world.addObjectAtPos(new Stone({
                                    color: [c, 0, d, 0.8]
                                }), i, s.y - j - 1, s.z - l - 1));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE9BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIWjtJQUlBLElBQUEsRUFBWSxrQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFkO1FBQ0EsV0FBQSxFQUFjLElBRGQ7S0FOSjtJQVFBLEtBQUEsRUFBVTtRQUNOO1lBQUEsSUFBQSxFQUFjLE1BQWQ7WUFDQSxNQUFBLEVBQWMsQ0FEZDtZQUVBLFFBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZkO1NBRE07S0FSVjtJQWFBLE1BQUEsRUFBUSxTQUFBO0FBQ0osWUFBQTtRQUFBLENBQUEsR0FBRSxLQUFLLENBQUM7UUFDUCxRQUFTLE9BQUEsQ0FBUSxVQUFSO0FBQ1Y7YUFBUyx5QkFBVDs7O0FBQ0k7cUJBQVMseUJBQVQ7OztBQUNJOzZCQUFTLHlCQUFUOzRCQUNJLElBQUcsQ0FBQyxDQUFBLEtBQUcsQ0FBSCxJQUFRLENBQUEsS0FBRyxDQUFYLElBQWdCLENBQUEsS0FBRyxDQUFwQixDQUFBLElBQTJCLENBQUEsSUFBRyxDQUE5QixJQUFvQyxDQUFBLElBQUcsQ0FBdkMsSUFBNkMsQ0FBQSxJQUFJLENBQXBEO2dDQUNJLENBQUEsR0FBSSxHQUFBLEdBQU8sR0FBRCxHQUFNLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFWLEVBQWEsQ0FBQSxHQUFFLENBQUYsR0FBSSxDQUFqQjtnQ0FDaEIsQ0FBQSxHQUFJLEdBQUEsR0FBTyxHQUFELEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQVYsRUFBYSxDQUFBLEdBQUUsQ0FBRixHQUFJLENBQWpCO2dDQUNoQixLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLEtBQUosQ0FBVTtvQ0FBQSxLQUFBLEVBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQU47aUNBQVYsQ0FBckIsRUFBc0QsQ0FBdEQsRUFBd0QsQ0FBeEQsRUFBMEQsQ0FBMUQ7Z0NBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7b0NBQUEsS0FBQSxFQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFOO2lDQUFWLENBQXJCLEVBQXNELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQTVELEVBQThELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQXBFLEVBQXNFLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQTVFO2dDQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksS0FBSixDQUFVO29DQUFBLEtBQUEsRUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEdBQVYsQ0FBTjtpQ0FBVixDQUFyQixFQUFzRCxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUE1RCxFQUE4RCxDQUE5RCxFQUFnRSxDQUFoRTs4Q0FDQSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLEtBQUosQ0FBVTtvQ0FBQSxLQUFBLEVBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQU47aUNBQVYsQ0FBckIsRUFBc0QsQ0FBdEQsRUFBd0QsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFKLEdBQU0sQ0FBOUQsRUFBZ0UsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFKLEdBQU0sQ0FBdEUsR0FOSjs2QkFBQSxNQUFBO3NEQUFBOztBQURKOzs7QUFESjs7O0FBREo7O0lBSEksQ0FiUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwMDAwMDBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgICAwMDAwMDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMDAwMDAwXG5cbm1vZHVsZS5leHBvcnRzID0gXG4gICAgbmFtZTogICAgICAgXCJlZGdlXCJcbiAgICBkZXNpZ246ICAgICBcIk1pY2hhZWwgQWJlbFwiXG4gICAgc2NoZW1lOiAgICAgXCJjYW5keVwiXG4gICAgc2l6ZTogICAgICAgWzcsNyw3XVxuICAgIGhlbHA6ICAgICAgIFwiZ2V0IHRvIHRoZSBleGl0IVwiXG4gICAgcGxheWVyOlxuICAgICAgICBjb29yZGluYXRlczogIFszLDAsNV1cbiAgICAgICAgb3JpZW50YXRpb246ICBadXBZXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgIDFcbiAgICAgICAgcG9zaXRpb246ICAgICBbMCwwLDBdXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cbiAgICAgICAgcz13b3JsZC5zaXplXG4gICAgICAgIHtTdG9uZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICAgICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgICAgICAgICAgIGZvciBsIGluIFswLi4uM11cbiAgICAgICAgICAgICAgICAgICAgaWYgKGk9PTIgb3Igaj09MiBvciBsPT0yKSBhbmQgaT49MSBhbmQgaj49MSBhbmQgbCA+PTFcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAwLjYgLSAoMC4zKSpNYXRoLnBvdygtMSwgaStqK2wpXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gMC42ICsgKDAuMykqTWF0aC5wb3coLTEsIGkraitsKVxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IFN0b25lKGNvbG9yOltjICwwLCBkLCAwLjhdKSwgaSxqLGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBTdG9uZShjb2xvcjpbYyAsMCwgZCwgMC44XSksIHMueC1pLTEscy55LWotMSxzLnotbC0xXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBuZXcgU3RvbmUoY29sb3I6W2MgLDAsIGQsIDAuOF0pLCBzLngtaS0xLGosbFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IFN0b25lKGNvbG9yOltjICwwLCBkLCAwLjhdKSwgaSxzLnktai0xLHMuei1sLTFcbiAgICAiXX0=
//# sourceURL=../../coffee/levels/edge.coffee