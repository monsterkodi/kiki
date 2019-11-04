// koffee 1.4.0
module.exports = {
    name: "pool",
    design: 'Michael Abel',
    scheme: "green",
    size: [11, 11, 11],
    help: "get to the exit!",
    player: {
        coordinates: [5, 9, 6],
        orientation: ZdownY
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, -1]
        }
    ],
    create: function() {
        var Stone, d, h, i, j, k, l, len, m, n, o, p, ref, ref1, ref2, ref3, ref4, results, s;
        s = world.size;
        Stone = require('../items').Stone;
        d = 1;
        for (i = k = 0, ref = s.x; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            for (j = m = 0, ref1 = s.y; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
                for (l = n = 0, ref2 = s.z / 2; 0 <= ref2 ? n <= ref2 : n >= ref2; l = 0 <= ref2 ? ++n : --n) {
                    if (Math.pow(-1, i + j + l) === 1 && !((d <= i && i <= s.x - d - 1) && (d <= j && j <= s.y - d - 1) && d <= l)) {
                        world.addObjectAtPos(new Stone({
                            color: [0.3, 0.3, 1.0],
                            opacity: 0.9,
                            slippery: true
                        }), i, j, l);
                    }
                }
            }
        }
        ref3 = [s.z / 2 - 1, s.z - 5];
        for (o = 0, len = ref3.length; o < len; o++) {
            h = ref3[o];
            world.addObjectPoly('Wall', [[0, 0, h], [s.x - 1, 0, h], [s.x - 1, s.y - 1, h], [0, s.y - 1, h]]);
        }
        results = [];
        for (i = p = 0, ref4 = s.x; 0 <= ref4 ? p < ref4 : p > ref4; i = 0 <= ref4 ? ++p : --p) {
            results.push((function() {
                var q, ref5, results1;
                results1 = [];
                for (j = q = 0, ref5 = s.y; 0 <= ref5 ? q < ref5 : q > ref5; j = 0 <= ref5 ? ++q : --q) {
                    if (Math.pow(-1, i + j) === 1) {
                        world.addObjectAtPos('Wall', i, j, s.z - 1);
                        world.addObjectAtPos('Wall', i, j, s.z - 2);
                        results1.push(world.addObjectAtPos('Wall', i, j, s.z - 3));
                    } else {
                        results1.push(void 0);
                    }
                }
                return results1;
            })());
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE9BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsQ0FIWjtJQUlBLElBQUEsRUFBWSxrQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFkO1FBQ0EsV0FBQSxFQUFjLE1BRGQ7S0FOSjtJQVFBLEtBQUEsRUFBVTtRQUNOO1lBQUEsSUFBQSxFQUFjLE1BQWQ7WUFDQSxNQUFBLEVBQWMsQ0FEZDtZQUVBLFFBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBQyxDQUFOLENBRmQ7U0FETTtLQVJWO0lBYUEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUEsQ0FBQSxHQUFFLEtBQUssQ0FBQztRQUNQLFFBQVMsT0FBQSxDQUFRLFVBQVI7UUFDVixDQUFBLEdBQUU7QUFFRixhQUFTLDRFQUFUO0FBQ0ksaUJBQVMsaUZBQVQ7QUFDSSxxQkFBUyx1RkFBVDtvQkFDSSxJQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFWLEVBQWEsQ0FBQSxHQUFFLENBQUYsR0FBSSxDQUFqQixDQUFBLEtBQXVCLENBQXZCLElBQTZCLENBQUksQ0FBQyxDQUFBLENBQUEsSUFBRyxDQUFILElBQUcsQ0FBSCxJQUFNLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQVosQ0FBQSxJQUFrQixDQUFBLENBQUEsSUFBRyxDQUFILElBQUcsQ0FBSCxJQUFNLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQVosQ0FBbEIsSUFBb0MsQ0FBQSxJQUFHLENBQXhDLENBQXBDO3dCQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksS0FBSixDQUFVOzRCQUFBLEtBQUEsRUFBTSxDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxDQUFOOzRCQUFxQixPQUFBLEVBQVEsR0FBN0I7NEJBQWtDLFFBQUEsRUFBUyxJQUEzQzt5QkFBVixDQUFyQixFQUFpRixDQUFqRixFQUFtRixDQUFuRixFQUFxRixDQUFyRixFQURKOztBQURKO0FBREo7QUFESjtBQU1BO0FBQUEsYUFBQSxzQ0FBQTs7WUFDSSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBUyxDQUFDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBTCxFQUFPLENBQVAsRUFBUyxDQUFULENBQVQsRUFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUwsRUFBTyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQVgsRUFBYSxDQUFiLENBQXJCLEVBQXFDLENBQUMsQ0FBRCxFQUFHLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBUCxFQUFTLENBQVQsQ0FBckMsQ0FBNUI7QUFESjtBQUlBO2FBQVMsaUZBQVQ7OztBQUNJO3FCQUFTLGlGQUFUO29CQUNJLElBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFDLENBQVYsRUFBWSxDQUFBLEdBQUUsQ0FBZCxDQUFBLEtBQW9CLENBQXZCO3dCQUNLLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CLEVBQWlDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBckM7d0JBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFyQztzQ0FDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUErQixDQUEvQixFQUFpQyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQXJDLEdBSEw7cUJBQUEsTUFBQTs4Q0FBQTs7QUFESjs7O0FBREo7O0lBZkksQ0FiUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgXG4jICAgMDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgIFxuIyAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICBcbiMgICAwMDAgICAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcInBvb2xcIlxuICAgIGRlc2lnbjogICAgICdNaWNoYWVsIEFiZWwnXG4gICAgc2NoZW1lOiAgICAgXCJncmVlblwiXG4gICAgc2l6ZTogICAgICAgWzExLDExLDExXVxuICAgIGhlbHA6ICAgICAgIFwiZ2V0IHRvIHRoZSBleGl0IVwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogIFs1LDksNl1cbiAgICAgICAgb3JpZW50YXRpb246ICBaZG93bllcbiAgICBleGl0czogICAgW1xuICAgICAgICBuYW1lOiAgICAgICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgMVxuICAgICAgICBwb3NpdGlvbjogICAgIFswLDAsLTFdXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cbiAgICAgICAgcz13b3JsZC5zaXplXG4gICAgICAgIHtTdG9uZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICAgICAgZD0xXG4gICAgICAgICMgZm9yIChpLGosbCkgaW4gWyAobSxuLG8pIGZvciBtIGluIHJhbmdlKHMueCkgZm9yIG4gaW4gcmFuZ2Uocy55KSBmb3IgbyBpbiByYW5nZSggcy56LzItMSldXG4gICAgICAgIGZvciBpIGluIFswLi4ucy54XVxuICAgICAgICAgICAgZm9yIGogaW4gWzAuLi5zLnldXG4gICAgICAgICAgICAgICAgZm9yIGwgaW4gWzAuLnMuei8yXVxuICAgICAgICAgICAgICAgICAgICBpZiBNYXRoLnBvdygtMSwgaStqK2wpID09IDEgYW5kIG5vdCAoZDw9aTw9cy54LWQtMSBhbmQgZDw9ajw9cy55LWQtMSBhbmQgZDw9bClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBTdG9uZShjb2xvcjpbMC4zLDAuMywxLjBdLCBvcGFjaXR5OjAuOSwgc2xpcHBlcnk6dHJ1ZSksIGksaixsIFxuICAgIFxuICAgICAgICBmb3IgaCBpbiBbIHMuei8yIC0xLCBzLnotNV1cbiAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdFBvbHkgJ1dhbGwnLCBbWzAsMCxoXSxbcy54LTEsMCxoXSxbcy54LTEscy55LTEsaF0sWzAscy55LTEsaF1dXG4gICAgICAgIFxuICAgICAgICAjIGZvciAoaSxqKSBpbiBbIChtLG4pIGZvciBtIGluIHJhbmdlKHMueCkgZm9yIG4gaW4gcmFuZ2Uocy55KSBdXG4gICAgICAgIGZvciBpIGluIFswLi4ucy54XVxuICAgICAgICAgICAgZm9yIGogaW4gWzAuLi5zLnldXG4gICAgICAgICAgICAgICAgaWYgTWF0aC5wb3coLTEsaStqKSA9PSAxXG4gICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIGksaixzLnotMVxuICAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCBpLGoscy56LTJcbiAgICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgaSxqLHMuei0zXG4gICAgICAgICAgICAiXX0=
//# sourceURL=../../coffee/levels/pool.coffee