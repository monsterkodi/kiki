// koffee 1.4.0
module.exports = {
    name: "columns",
    scheme: "green",
    size: [7, 9, 7],
    help: "to get to the exit,\nuse the stones.",
    player: {
        coordinates: [3, 7, 0],
        orientation: YupZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var i, j, k, len, len1, ref, ref1, s, x, y, z;
        s = world.size;
        for (y = i = -4; i < 5; y = ++i) {
            ref = [-3, -1, 1, 3];
            for (j = 0, len = ref.length; j < len; j++) {
                x = ref[j];
                ref1 = [-3, -1, 1, 3];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                    z = ref1[k];
                    world.addObjectAtPos('Stone', world.decenter(x, y, z));
                }
            }
        }
        world.getOccupantAtPos(world.decenter(-1, 0, 1)).del();
        world.getOccupantAtPos(world.decenter(1, 0, -1)).del();
        world.getOccupantAtPos(world.decenter(1, 0, 1)).del();
        return world.getOccupantAtPos(world.decenter(-1, 0, -1)).del();
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1ucy5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksU0FBWjtJQUNBLE1BQUEsRUFBWSxPQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksc0NBSFo7SUFPQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBYjtRQUNBLFdBQUEsRUFBYSxJQURiO0tBUko7SUFVQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURNO0tBVlY7SUFlQSxNQUFBLEVBQVEsU0FBQTtBQUVKLFlBQUE7UUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDO0FBRVYsYUFBUywwQkFBVDtBQUNJO0FBQUEsaUJBQUEscUNBQUE7O0FBQ0k7QUFBQSxxQkFBQSx3Q0FBQTs7b0JBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQTlCO0FBREo7QUFESjtBQURKO1FBS0EsS0FBSyxDQUFDLGdCQUFOLENBQXVCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUF2QixDQUErQyxDQUFDLEdBQWhELENBQUE7UUFDQSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsS0FBSyxDQUFDLFFBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBcUIsQ0FBQyxDQUF0QixDQUF2QixDQUErQyxDQUFDLEdBQWhELENBQUE7UUFDQSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsS0FBSyxDQUFDLFFBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBdkIsQ0FBK0MsQ0FBQyxHQUFoRCxDQUFBO2VBQ0EsS0FBSyxDQUFDLGdCQUFOLENBQXVCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFxQixDQUFDLENBQXRCLENBQXZCLENBQStDLENBQUMsR0FBaEQsQ0FBQTtJQVpJLENBZlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwICAgICAwMCAgMDAwICAgMDAwICAgMDAwMDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAwMDAwICAgICAgIDAwMFxuIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcImNvbHVtbnNcIlxuICAgIHNjaGVtZTogICAgIFwiZ3JlZW5cIlxuICAgIHNpemU6ICAgICAgIFs3LDksN11cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICB0byBnZXQgdG8gdGhlIGV4aXQsXG4gICAgICAgICAgICAgICAgdXNlIHRoZSBzdG9uZXMuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogWzMsNywwXVxuICAgICAgICBvcmllbnRhdGlvbjogWXVwWlxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG5cbiAgICAgICAgcyA9IHdvcmxkLnNpemVcbiAgICAgICAgXG4gICAgICAgIGZvciB5IGluIFstNC4uLjVdXG4gICAgICAgICAgICBmb3IgeCBpbiBbLTMsIC0xLCAxLCAzXVxuICAgICAgICAgICAgICAgIGZvciB6IGluIFstMywgLTEsIDEsIDMgXVxuICAgICAgICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnU3RvbmUnLCB3b3JsZC5kZWNlbnRlciB4LCB5LCB6ICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgLTEsIDAsIDEpLmRlbCgpXG4gICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgIDEsIDAsLTEpLmRlbCgpXG4gICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgIDEsIDAsIDEpLmRlbCgpXG4gICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIgLTEsIDAsLTEpLmRlbCgpXG4iXX0=
//# sourceURL=../../coffee/levels/columns.coffee