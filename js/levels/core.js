// koffee 1.4.0
module.exports = {
    name: "core",
    design: "Michael Abel",
    scheme: "green",
    size: [9, 9, 9],
    help: "reach the exit.\nto reach the exit, move the stones.",
    player: {
        position: [1, 1, 1],
        orientation: rotz90
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var i, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, results, s, x, y, z;
        s = world.size;
        ref = [-3, -1, 1, 3];
        for (i = 0, len = ref.length; i < len; i++) {
            y = ref[i];
            for (x = j = -3; j < 5; x = ++j) {
                for (z = k = -3; k < 5; z = ++k) {
                    world.addObjectAtPos('Stone', world.decenter(x, y, z));
                }
            }
        }
        ref1 = [-1, 1];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
            y = ref1[l];
            ref2 = [-1, 0, 1];
            for (m = 0, len2 = ref2.length; m < len2; m++) {
                x = ref2[m];
                ref3 = [-1, 0, 1];
                for (n = 0, len3 = ref3.length; n < len3; n++) {
                    z = ref3[n];
                    world.getOccupantAtPos(world.decenter(x, y, z)).del();
                }
            }
            ref4 = [-2, 2];
            for (o = 0, len4 = ref4.length; o < len4; o++) {
                z = ref4[o];
                world.getOccupantAtPos(world.decenter(0, y, z)).del();
            }
            ref5 = [-2, 2];
            for (p = 0, len5 = ref5.length; p < len5; p++) {
                x = ref5[p];
                world.getOccupantAtPos(world.decenter(x, y, 0)).del();
            }
        }
        ref6 = [-3, 3];
        for (q = 0, len6 = ref6.length; q < len6; q++) {
            y = ref6[q];
            world.getOccupantAtPos(world.decenter(0, y, 0)).del();
        }
        ref7 = [-4, 4];
        results = [];
        for (r = 0, len7 = ref7.length; r < len7; r++) {
            y = ref7[r];
            results.push(world.addObjectAtPos('Stone', world.decenter(0, y, 0)));
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE9BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIWjtJQUlBLElBQUEsRUFBWSxzREFKWjtJQVFBLE1BQUEsRUFDSTtRQUFBLFFBQUEsRUFBZ0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBaEI7UUFDQSxXQUFBLEVBQWdCLE1BRGhCO0tBVEo7SUFXQSxLQUFBLEVBQVk7UUFDUjtZQUFBLElBQUEsRUFBZ0IsTUFBaEI7WUFDQSxNQUFBLEVBQWdCLENBRGhCO1lBRUEsUUFBQSxFQUFnQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZoQjtTQURRO0tBWFo7SUFnQkEsTUFBQSxFQUFRLFNBQUE7QUFFSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUVWO0FBQUEsYUFBQSxxQ0FBQTs7QUFDSSxpQkFBUywwQkFBVDtBQUNJLHFCQUFTLDBCQUFUO29CQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUE5QjtBQURKO0FBREo7QUFESjtBQUtBO0FBQUEsYUFBQSx3Q0FBQTs7QUFDSTtBQUFBLGlCQUFBLHdDQUFBOztBQUNJO0FBQUEscUJBQUEsd0NBQUE7O29CQUNJLEtBQUssQ0FBQyxnQkFBTixDQUF1QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBdkIsQ0FBOEMsQ0FBQyxHQUEvQyxDQUFBO0FBREo7QUFESjtBQUdBO0FBQUEsaUJBQUEsd0NBQUE7O2dCQUNJLEtBQUssQ0FBQyxnQkFBTixDQUF1QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBdkIsQ0FBOEMsQ0FBQyxHQUEvQyxDQUFBO0FBREo7QUFHQTtBQUFBLGlCQUFBLHdDQUFBOztnQkFDSSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQXZCLENBQThDLENBQUMsR0FBL0MsQ0FBQTtBQURKO0FBUEo7QUFVQTtBQUFBLGFBQUEsd0NBQUE7O1lBQ0ksS0FBSyxDQUFDLGdCQUFOLENBQXVCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUF2QixDQUE4QyxDQUFDLEdBQS9DLENBQUE7QUFESjtBQUdBO0FBQUE7YUFBQSx3Q0FBQTs7eUJBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQTlCO0FBREo7O0lBdEJJLENBaEJSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAwMDAwICAgIDAwMDAwMDAgXG4jICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwiY29yZVwiXG4gICAgZGVzaWduOiAgICAgXCJNaWNoYWVsIEFiZWxcIlxuICAgIHNjaGVtZTogICAgIFwiZ3JlZW5cIlxuICAgIHNpemU6ICAgICAgIFs5LDksOV1cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICByZWFjaCB0aGUgZXhpdC5cbiAgICAgICAgICAgICAgICB0byByZWFjaCB0aGUgZXhpdCwgbW92ZSB0aGUgc3RvbmVzLlxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgIHBsYXllcjogICBcbiAgICAgICAgcG9zaXRpb246ICAgICAgIFsxLDEsMV1cbiAgICAgICAgb3JpZW50YXRpb246ICAgIHJvdHo5MFxuICAgIGV4aXRzOiAgICAgIFsgIFxuICAgICAgICBuYW1lOiAgICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAgIDFcbiAgICAgICAgcG9zaXRpb246ICAgICAgIFswLDAsMF1cbiAgICBdICBcbiAgICBjcmVhdGU6IC0+XG5cbiAgICAgICAgcyA9IHdvcmxkLnNpemVcbiAgICAgICAgXG4gICAgICAgIGZvciB5IGluIFstMywgLTEsIDEsIDNdXG4gICAgICAgICAgICBmb3IgeCBpbiBbLTMuLi41XVxuICAgICAgICAgICAgICAgIGZvciB6IGluIFstMy4uLjVdXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIHdvcmxkLmRlY2VudGVyIHgsIHksIHpcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIGZvciB5IGluIFstMSwgMV1cbiAgICAgICAgICAgIGZvciB4IGluIFstMSwgMCwgMV1cbiAgICAgICAgICAgICAgICBmb3IgeiBpbiBbLTEsIDAsIDFdXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgeCwgeSwgeikuZGVsKClcbiAgICAgICAgICAgIGZvciB6IGluIFstMiwgMl1cbiAgICAgICAgICAgICAgICB3b3JsZC5nZXRPY2N1cGFudEF0UG9zKHdvcmxkLmRlY2VudGVyIDAsIHksIHopLmRlbCgpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIHggaW4gWy0yLCAyXVxuICAgICAgICAgICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgeCwgeSwgMCkuZGVsKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWy0zLCAzXVxuICAgICAgICAgICAgd29ybGQuZ2V0T2NjdXBhbnRBdFBvcyh3b3JsZC5kZWNlbnRlciAwLCB5LCAwKS5kZWwoKVxuICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWy00LCA0XVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMCwgeSwgMFxuICAgICAgICAiXX0=
//# sourceURL=../../coffee/levels/core.coffee