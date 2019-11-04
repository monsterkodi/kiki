// koffee 1.4.0
module.exports = {
    name: "entropy",
    design: 'Michael Abel',
    scheme: "green",
    size: [9, 9, 9],
    help: "use the stones \nto reach the exit.",
    player: {
        coordinates: [4, 3, 2],
        orientation: minusXupZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var Stone, d, i, j, k, l, ref, results, s;
        s = world.size;
        d = 2;
        Stone = require('../items').Stone;
        results = [];
        for (i = k = 0, ref = s.x; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            results.push((function() {
                var m, ref1, results1;
                results1 = [];
                for (j = m = 0, ref1 = s.y; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
                    results1.push((function() {
                        var n, ref2, results2;
                        results2 = [];
                        for (l = n = 0, ref2 = s.z; 0 <= ref2 ? n < ref2 : n > ref2; l = 0 <= ref2 ? ++n : --n) {
                            if (Math.pow(-1, i + j + l) === 1 && !((d <= i && i <= s.x - d - 1) && (d <= j && j <= s.y - d - 1) && (d <= l && l <= s.z - d - 1))) {
                                results2.push(world.addObjectAtPos(new Stone({
                                    slippery: true
                                }), i, j, l));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cm9weS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBRUk7SUFBQSxJQUFBLEVBQVksU0FBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE9BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIWjtJQUlBLElBQUEsRUFBWSxxQ0FKWjtJQVFBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBaUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBakI7UUFDQSxXQUFBLEVBQWdCLFNBRGhCO0tBVEo7SUFXQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURNO0tBWFY7SUFnQkEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUEsQ0FBQSxHQUFFLEtBQUssQ0FBQztRQUNSLENBQUEsR0FBRTtRQUNELFFBQVMsT0FBQSxDQUFRLFVBQVI7QUFFVjthQUFTLDRFQUFUOzs7QUFDSTtxQkFBUyxpRkFBVDs7O0FBQ0k7NkJBQVMsaUZBQVQ7NEJBQ0ksSUFBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsQ0FBVixFQUFhLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBakIsQ0FBQSxLQUFxQixDQUFyQixJQUE0QixDQUFJLENBQUMsQ0FBQSxDQUFBLElBQUcsQ0FBSCxJQUFHLENBQUgsSUFBTSxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUFaLENBQUEsSUFBa0IsQ0FBQSxDQUFBLElBQUcsQ0FBSCxJQUFHLENBQUgsSUFBTSxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUFaLENBQWxCLElBQW9DLENBQUEsQ0FBQSxJQUFHLENBQUgsSUFBRyxDQUFILElBQU0sQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFKLEdBQU0sQ0FBWixDQUFyQyxDQUFuQzs4Q0FDSSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLEtBQUosQ0FBVTtvQ0FBQSxRQUFBLEVBQVMsSUFBVDtpQ0FBVixDQUFyQixFQUErQyxDQUEvQyxFQUFpRCxDQUFqRCxFQUFtRCxDQUFuRCxHQURKOzZCQUFBLE1BQUE7c0RBQUE7O0FBREo7OztBQURKOzs7QUFESjs7SUFMSSxDQWhCUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwICAgMDAwXG4jICAgMDAwICAgICAgIDAwMDAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwIDAwMCBcbiMgICAwMDAwMDAwICAgMDAwIDAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAwMDAwMCAgICAgMDAwMDAgIFxuIyAgIDAwMCAgICAgICAwMDAgIDAwMDAgICAgIDAwMCAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgMDAwICAgXG4jICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgICAgICAgICAwMDAgICBcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgbmFtZTogICAgICAgXCJlbnRyb3B5XCJcbiAgICBkZXNpZ246ICAgICAnTWljaGFlbCBBYmVsJ1xuICAgIHNjaGVtZTogICAgIFwiZ3JlZW5cIlxuICAgIHNpemU6ICAgICAgIFs5LDksOV1cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICB1c2UgdGhlIHN0b25lcyBcbiAgICAgICAgICAgICAgICB0byByZWFjaCB0aGUgZXhpdC5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6ICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICAgWzQsMywyXVxuICAgICAgICBvcmllbnRhdGlvbjogICAgbWludXNYdXBaXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgIDFcbiAgICAgICAgcG9zaXRpb246ICAgICBbMCwwLDBdXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cbiAgICAgICAgcz13b3JsZC5zaXplXG4gICAgICAgIGQ9MlxuICAgICAgICB7U3RvbmV9ID0gcmVxdWlyZSAnLi4vaXRlbXMnXG4gICAgICAgICMgZm9yIChpLGosbCkgaW4gWyAobSxuLG8pIGZvciBtIGluIHJhbmdlKHMueCkgZm9yIG4gaW4gcmFuZ2Uocy55KSBmb3IgbyBpbiByYW5nZShzLnopXVxuICAgICAgICBmb3IgaSBpbiBbMC4uLnMueF1cbiAgICAgICAgICAgIGZvciBqIGluIFswLi4ucy55XVxuICAgICAgICAgICAgICAgIGZvciBsIGluIFswLi4ucy56XVxuICAgICAgICAgICAgICAgICAgICBpZiBNYXRoLnBvdygtMSwgaStqK2wpPT0xICBhbmQgbm90IChkPD1pPD1zLngtZC0xIGFuZCBkPD1qPD1zLnktZC0xIGFuZCBkPD1sPD1zLnotZC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MobmV3IFN0b25lKHNsaXBwZXJ5OnRydWUpLCBpLGosbClcblxuIl19
//# sourceURL=../../coffee/levels/entropy.coffee