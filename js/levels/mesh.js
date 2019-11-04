// koffee 1.4.0
module.exports = {
    name: "mesh",
    design: 'Michael Abel',
    scheme: "default",
    size: [11, 11, 11],
    help: "get to the exit!",
    player: {
        coordinates: [6, 10, 5],
        orientation: YdownZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var Stone, i, j, k, l, middlemin, ref, results, s;
        s = world.size;
        Stone = require('../items').Stone;
        middlemin = function(u, v, w) {
            var d;
            s = world.size;
            d = ((u - s.x / 2.0) * (u - s.x / 2.0) + (v - s.y / 2.0) * (v - s.y / 2.0) + (w - s.z / 2.0) * (w - s.z / 2.0)) / 25;
            return Math.min(0.9, Math.max(0.4, d));
        };
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
                            if ((i + 1) % 2 && (j + 1) % 2 && (l + 1) % 2) {
                                results2.push(world.addObjectAtPos(new Stone({
                                    color: [0.1 * i, 0.1 * j, 0.1 * l],
                                    opacity: middlemin(i, j, l),
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzaC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLFNBRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsQ0FIWjtJQUlBLElBQUEsRUFBWSxrQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBZ0IsQ0FBQyxDQUFELEVBQUcsRUFBSCxFQUFNLENBQU4sQ0FBaEI7UUFDQSxXQUFBLEVBQWdCLE1BRGhCO0tBTko7SUFRQSxLQUFBLEVBQVk7UUFDUjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURRO0tBUlo7SUFhQSxNQUFBLEVBQVEsU0FBQTtBQUVKLFlBQUE7UUFBQSxDQUFBLEdBQUUsS0FBSyxDQUFDO1FBQ1AsUUFBUyxPQUFBLENBQVEsVUFBUjtRQUVWLFNBQUEsR0FBWSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtBQUNSLGdCQUFBO1lBQUEsQ0FBQSxHQUFFLEtBQUssQ0FBQztZQUNSLENBQUEsR0FBRyxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUMsQ0FBQyxDQUFGLEdBQUksR0FBUCxDQUFBLEdBQVksQ0FBQyxDQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUYsR0FBSSxHQUFQLENBQVosR0FBeUIsQ0FBQyxDQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUYsR0FBSSxHQUFQLENBQUEsR0FBWSxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUMsQ0FBRixHQUFJLEdBQVAsQ0FBckMsR0FBbUQsQ0FBQyxDQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUYsR0FBSSxHQUFQLENBQUEsR0FBWSxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUMsQ0FBRixHQUFJLEdBQVAsQ0FBaEUsQ0FBQSxHQUE2RTttQkFDaEYsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsQ0FBZCxDQUFkO1FBSFE7QUFNWjthQUFTLDRFQUFUOzs7QUFDSTtxQkFBUyxpRkFBVDs7O0FBQ0k7NkJBQVMsaUZBQVQ7NEJBQ0ksSUFBRyxDQUFDLENBQUEsR0FBRSxDQUFILENBQUEsR0FBTSxDQUFOLElBQVksQ0FBQyxDQUFBLEdBQUUsQ0FBSCxDQUFBLEdBQU0sQ0FBbEIsSUFBd0IsQ0FBQyxDQUFBLEdBQUUsQ0FBSCxDQUFBLEdBQU0sQ0FBakM7OENBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7b0NBQUEsS0FBQSxFQUFNLENBQUMsR0FBQSxHQUFJLENBQUwsRUFBTyxHQUFBLEdBQUksQ0FBWCxFQUFhLEdBQUEsR0FBSSxDQUFqQixDQUFOO29DQUEyQixPQUFBLEVBQVEsU0FBQSxDQUFVLENBQVYsRUFBWSxDQUFaLEVBQWMsQ0FBZCxDQUFuQztvQ0FBcUQsUUFBQSxFQUFTLElBQTlEO2lDQUFWLENBQXJCLEVBQXFHLENBQXJHLEVBQXVHLENBQXZHLEVBQXlHLENBQXpHLEdBREo7NkJBQUEsTUFBQTtzREFBQTs7QUFESjs7O0FBREo7OztBQURKOztJQVhJLENBYlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMCAgICAgMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDBcbiMgICAwMDAgMCAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwXG4jICAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJtZXNoXCJcbiAgICBkZXNpZ246ICAgICAnTWljaGFlbCBBYmVsJ1xuICAgIHNjaGVtZTogICAgIFwiZGVmYXVsdFwiXG4gICAgc2l6ZTogICAgICAgWzExLDExLDExXVxuICAgIGhlbHA6ICAgICAgIFwiZ2V0IHRvIHRoZSBleGl0IVwiXG4gICAgcGxheWVyOiAgICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICBbNiwxMCw1XVxuICAgICAgICBvcmllbnRhdGlvbjogICAgWWRvd25aXG4gICAgZXhpdHM6ICAgICAgW1xuICAgICAgICBuYW1lOiAgICAgICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgMVxuICAgICAgICBwb3NpdGlvbjogICAgIFswLDAsMF1cbiAgICBdXG4gICAgY3JlYXRlOiAtPlxuICAgICAgICBcbiAgICAgICAgcz13b3JsZC5zaXplXG4gICAgICAgIHtTdG9uZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICBcbiAgICAgICAgbWlkZGxlbWluID0gKHUsdix3KSAtPlxuICAgICAgICAgICAgcz13b3JsZC5zaXplXG4gICAgICAgICAgICBkPSAoKHUtcy54LzIuMCkqKHUtcy54LzIuMCkrICh2LXMueS8yLjApKih2LXMueS8yLjApICsgKHctcy56LzIuMCkqKHctcy56LzIuMCkpLzI1XG4gICAgICAgICAgICBNYXRoLm1pbiAwLjksIE1hdGgubWF4IDAuNCwgZFxuICAgICAgICAgICAgXG4gICAgICAgICMgZm9yIChpLGosbCkgaW4gWyAobSxuLG8pIGZvciBtIGluIHJhbmdlKHMueCkgZm9yIG4gaW4gcmFuZ2Uocy55KSBmb3IgbyBpbiByYW5nZShzLnopXVxuICAgICAgICBmb3IgaSBpbiBbMC4uLnMueF1cbiAgICAgICAgICAgIGZvciBqIGluIFswLi4ucy55XVxuICAgICAgICAgICAgICAgIGZvciBsIGluIFswLi4ucy56XVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSsxKSUyIGFuZCAoaisxKSUyIGFuZCAobCsxKSUyXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyhuZXcgU3RvbmUoY29sb3I6WzAuMSppLDAuMSpqLDAuMSpsXSwgb3BhY2l0eTptaWRkbGVtaW4oaSxqLGwpLCBzbGlwcGVyeTp0cnVlKSAsIGksaixsKVxuICAgICAgICAgICAgIl19
//# sourceURL=../../coffee/levels/mesh.coffee