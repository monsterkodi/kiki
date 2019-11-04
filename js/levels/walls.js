// koffee 1.4.0
module.exports = {
    name: "walls",
    design: 'Michael Abel',
    scheme: "red",
    size: [7, 5, 5],
    help: "get to the exit!\n\nThe exit is hidden\nin the middle of\nthe central wall.",
    player: {
        coordinates: [0, 4, 2],
        orientation: minusXdownY
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var Stone, i, j, k, l, middlemax, middlemin, ref, results, s;
        s = world.size;
        Stone = require('../items').Stone;
        middlemax = function(u, v, w) {
            var d;
            d = 3.0 / (Math.pow(u - s.x / 2.0, 2) + Math.pow(v - s.y / 2.0, 2) + Math.pow(w - s.z / 2.0, 2) + 1);
            return Math.min(1.0, Math.max(0.2, d));
        };
        middlemin = function(u, v, w) {
            var d;
            d = 2 * (Math.pow(u - s.x / 2.0, 2) + Math.pow(v - s.y / 2.0, 2) + Math.pow(w - s.z / 2.0, 2)) / 25;
            return Math.min(1.0, Math.max(0.4, d));
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
                            if (i === Math.floor(s.x / 2) || i === Math.floor(s.x / 2 - 2) || i === Math.floor(s.x / 2 + 2)) {
                                results2.push(world.addObjectAtPos(new Stone({
                                    color: [0.5 * i, 0.5 * j, 0.5 * l],
                                    opacity: 0.6
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbHMuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsSUFBQSxFQUFZLE9BQVo7SUFDQSxNQUFBLEVBQVksY0FEWjtJQUVBLE1BQUEsRUFBWSxLQUZaO0lBR0EsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBSFo7SUFJQSxJQUFBLEVBQVksNkVBSlo7SUFXQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCO1FBQ0EsV0FBQSxFQUFnQixXQURoQjtLQVpKO0lBY0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWdCLE1BQWhCO1lBQ0EsTUFBQSxFQUFnQixDQURoQjtZQUVBLFFBQUEsRUFBZ0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGaEI7U0FETTtLQWRWO0lBbUJBLE1BQUEsRUFBUSxTQUFBO0FBQ0osWUFBQTtRQUFBLENBQUEsR0FBRSxLQUFLLENBQUM7UUFDUCxRQUFTLE9BQUEsQ0FBUSxVQUFSO1FBQ1YsU0FBQSxHQUFZLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO0FBQ1IsZ0JBQUE7WUFBQSxDQUFBLEdBQUcsR0FBQSxHQUFJLFVBQUcsQ0FBQSxHQUFFLENBQUMsQ0FBQyxDQUFGLEdBQUksS0FBTSxFQUFiLFlBQWlCLENBQUEsR0FBRSxDQUFDLENBQUMsQ0FBRixHQUFJLEtBQU0sRUFBN0IsWUFBa0MsQ0FBQSxHQUFFLENBQUMsQ0FBQyxDQUFGLEdBQUksS0FBTSxFQUE5QyxHQUFrRCxDQUFwRDttQkFDUCxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsRUFBYyxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsRUFBYyxDQUFkLENBQWQ7UUFGUTtRQUlaLFNBQUEsR0FBWSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtBQUNSLGdCQUFBO1lBQUEsQ0FBQSxHQUFHLENBQUEsR0FBRyxVQUFHLENBQUEsR0FBRSxDQUFDLENBQUMsQ0FBRixHQUFJLEtBQU0sRUFBYixZQUFpQixDQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUYsR0FBSSxLQUFNLEVBQTdCLFlBQWtDLENBQUEsR0FBRSxDQUFDLENBQUMsQ0FBRixHQUFJLEtBQU0sRUFBaEQsQ0FBSCxHQUF3RDttQkFDM0QsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWEsQ0FBYixDQUFkO1FBRlE7QUFJWjthQUFTLDRFQUFUOzs7QUFDSTtxQkFBUyxpRkFBVDs7O0FBQ0k7NkJBQVMsaUZBQVQ7NEJBQ0ksSUFBRyxDQUFBLEtBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQWYsQ0FBSCxJQUF3QixDQUFBLEtBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUFqQixDQUEzQixJQUFrRCxDQUFBLEtBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUFqQixDQUF4RDs4Q0FDSSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLEtBQUosQ0FBVTtvQ0FBQSxLQUFBLEVBQU0sQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFPLEdBQUEsR0FBSSxDQUFYLEVBQWEsR0FBQSxHQUFJLENBQWpCLENBQU47b0NBQTJCLE9BQUEsRUFBUSxHQUFuQztpQ0FBVixDQUFyQixFQUF3RSxDQUF4RSxFQUEwRSxDQUExRSxFQUE0RSxDQUE1RSxHQURKOzZCQUFBLE1BQUE7c0RBQUE7O0FBREo7OztBQURKOzs7QUFESjs7SUFYSSxDQW5CUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMFxuIyAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAgIFxuIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAwMDAwIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAgICAgIDAwMFxuIyAgIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwICAwMDAwMDAwIFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJ3YWxsc1wiXG4gICAgZGVzaWduOiAgICAgJ01pY2hhZWwgQWJlbCdcbiAgICBzY2hlbWU6ICAgICBcInJlZFwiXG4gICAgc2l6ZTogICAgICAgWzcsNSw1XVxuICAgIGhlbHA6ICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIGdldCB0byB0aGUgZXhpdCFcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBUaGUgZXhpdCBpcyBoaWRkZW5cbiAgICAgICAgICAgICAgICBpbiB0aGUgbWlkZGxlIG9mXG4gICAgICAgICAgICAgICAgdGhlIGNlbnRyYWwgd2FsbC5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6XG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICBbMCw0LDJdXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICBtaW51c1hkb3duWVxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgICAgMVxuICAgICAgICBwb3NpdGlvbjogICAgICAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHM9d29ybGQuc2l6ZVxuICAgICAgICB7U3RvbmV9ID0gcmVxdWlyZSAnLi4vaXRlbXMnXG4gICAgICAgIG1pZGRsZW1heCA9ICh1LHYsdykgLT5cbiAgICAgICAgICAgIGQ9IDMuMC8oICh1LXMueC8yLjApKioyKyAodi1zLnkvMi4wKSoqMiArICh3LXMuei8yLjApKioyICsgMSApXG4gICAgICAgICAgICBNYXRoLm1pbiAxLjAgLE1hdGgubWF4IDAuMiwgZCAgXG4gICAgICAgICAgICBcbiAgICAgICAgbWlkZGxlbWluID0gKHUsdix3KSAtPlxuICAgICAgICAgICAgZD0gMiogKCAodS1zLngvMi4wKSoqMisgKHYtcy55LzIuMCkqKjIgKyAody1zLnovMi4wKSoqMiAgKS8yNVxuICAgICAgICAgICAgTWF0aC5taW4gMS4wLCBNYXRoLm1heCAwLjQsZCBcbiAgICAgICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4uLnMueF1cbiAgICAgICAgICAgIGZvciBqIGluIFswLi4ucy55XVxuICAgICAgICAgICAgICAgIGZvciBsIGluIFswLi4ucy56XVxuICAgICAgICAgICAgICAgICAgICBpZiBpPT1NYXRoLmZsb29yKHMueC8yKSBvciBpPT1NYXRoLmZsb29yKHMueC8yLTIpIG9yIGk9PU1hdGguZmxvb3Iocy54LzIrMilcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBTdG9uZShjb2xvcjpbMC41KmksMC41KmosMC41KmxdLCBvcGFjaXR5OjAuNiksIGksaixsXG4gICAgIl19
//# sourceURL=../../coffee/levels/walls.coffee