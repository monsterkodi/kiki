// koffee 1.4.0
module.exports = {
    name: "rings",
    scheme: "default",
    size: [9, 7, 9],
    help: "to get to the exit,\nuse the stones.",
    player: {
        coordinates: [4, 4, 2],
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
        var i, j, len, len1, ref, ref1, results, s, x, y;
        s = world.size;
        ref = [-1, 1];
        for (i = 0, len = ref.length; i < len; i++) {
            y = ref[i];
            x = 3;
            world.addObjectPoly('Stone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), world.decenter(x, y, -x)]);
        }
        ref1 = [-3, 3];
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
            y = ref1[j];
            results.push((function() {
                var k, len2, ref2, results1;
                ref2 = [-3, -1, 1, 3];
                results1 = [];
                for (k = 0, len2 = ref2.length; k < len2; k++) {
                    x = ref2[k];
                    results1.push(world.addObjectPoly('Stone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), world.decenter(x, y, -x)]));
                }
                return results1;
            })());
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmluZ3MuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsSUFBQSxFQUFZLE9BQVo7SUFDQSxNQUFBLEVBQVksU0FEWjtJQUVBLElBQUEsRUFBWSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZaO0lBR0EsSUFBQSxFQUFZLHNDQUhaO0lBT0EsTUFBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWI7UUFDQSxXQUFBLEVBQWEsU0FEYjtLQVJKO0lBVUEsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWMsTUFBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRmQ7U0FETTtLQVZWO0lBZUEsTUFBQSxFQUFRLFNBQUE7QUFFSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUVWO0FBQUEsYUFBQSxxQ0FBQTs7WUFDSSxDQUFBLEdBQUk7WUFDSixLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixFQUE2QixDQUFDLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUFDLENBQXZCLENBQUQsRUFBNEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFDLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQTVCLEVBQXNELEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUF0RCxFQUErRSxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBQyxDQUF0QixDQUEvRSxDQUE3QjtBQUZKO0FBSUE7QUFBQTthQUFBLHdDQUFBOzs7O0FBQ0k7QUFBQTtxQkFBQSx3Q0FBQTs7a0NBQ0ksS0FBSyxDQUFDLGFBQU4sQ0FBb0IsT0FBcEIsRUFBNkIsQ0FBQyxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBQyxDQUF2QixDQUFELEVBQTRCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUE1QixFQUFzRCxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBdEQsRUFBK0UsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQUMsQ0FBdEIsQ0FBL0UsQ0FBN0I7QUFESjs7O0FBREo7O0lBUkksQ0FmUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMDAwMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jICAgMDAwMDAwMCAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgICAgICAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcInJpbmdzXCJcbiAgICBzY2hlbWU6ICAgICBcImRlZmF1bHRcIlxuICAgIHNpemU6ICAgICAgIFs5LDcsOV1cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICB0byBnZXQgdG8gdGhlIGV4aXQsXG4gICAgICAgICAgICAgICAgdXNlIHRoZSBzdG9uZXMuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogWzQsNCwyXVxuICAgICAgICBvcmllbnRhdGlvbjogbWludXNYdXBaXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgIDFcbiAgICAgICAgcG9zaXRpb246ICAgICBbMCwwLDBdXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cblxuICAgICAgICBzID0gd29ybGQuc2l6ZVxuICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWy0xLCAxXVxuICAgICAgICAgICAgeCA9IDNcbiAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdFBvbHkgJ1N0b25lJywgW3dvcmxkLmRlY2VudGVyKC14LCB5LCAteCksIHdvcmxkLmRlY2VudGVyKC14LCB5LCB4KSwgd29ybGQuZGVjZW50ZXIoeCwgeSwgeCksIHdvcmxkLmRlY2VudGVyKHgsIHksIC14KV1cbiAgICAgICAgXG4gICAgICAgIGZvciB5IGluIFstMywgM11cbiAgICAgICAgICAgIGZvciB4IGluIFstMywgLTEsIDEsIDNdXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0UG9seSAnU3RvbmUnLCBbd29ybGQuZGVjZW50ZXIoLXgsIHksIC14KSwgd29ybGQuZGVjZW50ZXIoLXgsIHksIHgpLCB3b3JsZC5kZWNlbnRlcih4LCB5LCB4KSwgd29ybGQuZGVjZW50ZXIoeCwgeSwgLXgpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJdfQ==
//# sourceURL=../../coffee/levels/rings.coffee