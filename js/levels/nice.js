// koffee 1.4.0
module.exports = {
    name: "nice",
    design: 'Michael Abel',
    scheme: "tron",
    size: [11, 11, 11],
    help: "get to the exit!",
    player: {
        coordinates: [7, 4, 0],
        orientation: minusZdownY
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var obj, point, s, size, supercube;
        supercube = function(point, size, obj) {
            var p, s;
            if (point == null) {
                point = [5, 5, 5];
            }
            if (size == null) {
                size = 2;
            }
            if (obj == null) {
                obj = 'Wall';
            }
            p = point;
            s = size;
            world.addObjectPoly(obj, [[p[0] + s, p[1] + s, p[2]], [p[0] + s, p[1] - s, p[2]], [p[0] - s, p[1] - s, p[2]], [p[0] - s, p[1] + s, p[2]]]);
            world.addObjectPoly(obj, [[p[0] + s, p[1], p[2] + s], [p[0] + s, p[1], p[2] - s], [p[0] - s, p[1], p[2] - s], [p[0] - s, p[1], p[2] + s]]);
            return world.addObjectPoly(obj, [[p[0], p[1] + s, p[2] + s], [p[0], p[1] + s, p[2] - s], [p[0], p[1] - s, p[2] - s], [p[0], p[1] - s, p[2] + s]]);
        };
        s = world.size;
        world.addObjectLine('Wall', 1, 1, 1, 9, 9, 9);
        world.addObjectLine('Wall', 1, 1, 9, 9, 9, 1);
        world.addObjectLine('Wall', 1, 9, 1, 9, 1, 9);
        world.addObjectLine('Wall', 9, 1, 1, 1, 9, 9);
        world.getOccupantAtPos(world.decenter(0, 0, 0)).del();
        supercube(point = [5, 5, 5], size = 5, obj = 'Wall');
        return supercube(point = [5, 5, 5], size = 3, obj = 'Stone');
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmljZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBRUk7SUFBQSxJQUFBLEVBQVksTUFBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE1BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsQ0FIWjtJQUlBLElBQUEsRUFBWSxrQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFiO1FBQ0EsV0FBQSxFQUFhLFdBRGI7S0FOSjtJQVFBLEtBQUEsRUFBWTtRQUNSO1lBQUEsSUFBQSxFQUFjLE1BQWQ7WUFDQSxNQUFBLEVBQWMsQ0FEZDtZQUVBLFFBQUEsRUFBYyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZkO1NBRFE7S0FSWjtJQWFBLE1BQUEsRUFBUSxTQUFBO0FBRUosWUFBQTtRQUFBLFNBQUEsR0FBWSxTQUFDLEtBQUQsRUFBZSxJQUFmLEVBQXNCLEdBQXRCO0FBQ1IsZ0JBQUE7O2dCQURTLFFBQU0sQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUw7OztnQkFBUSxPQUFLOzs7Z0JBQUUsTUFBSTs7WUFDbEMsQ0FBQSxHQUFFO1lBQ0YsQ0FBQSxHQUFFO1lBQ0YsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsR0FBcEIsRUFBd0IsQ0FBQyxDQUFDLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBSyxDQUFOLEVBQVEsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFLLENBQWIsRUFBZSxDQUFFLENBQUEsQ0FBQSxDQUFqQixDQUFELEVBQXVCLENBQUMsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFLLENBQU4sRUFBUSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQUssQ0FBYixFQUFlLENBQUUsQ0FBQSxDQUFBLENBQWpCLENBQXZCLEVBQTZDLENB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QixHQUFBLEdBQUksTUFBbkM7ZUFDQSxTQUFBLENBQVUsS0FBQSxHQUFNLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCLEVBQXdCLElBQUEsR0FBSyxDQUE3QixFQUErQixHQUFBLEdBQUksT0FBbkM7SUFoQkksQ0FiUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwMDAwMCAgMDAwMDAwMDBcbiMgICAwMDAwICAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgXG4jICAgMDAwIDAgMDAwICAwMDAgIDAwMCAgICAgICAwMDAwMDAwIFxuIyAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAgIG5hbWU6ICAgICAgIFwibmljZVwiXG4gICAgZGVzaWduOiAgICAgJ01pY2hhZWwgQWJlbCdcbiAgICBzY2hlbWU6ICAgICBcInRyb25cIlxuICAgIHNpemU6ICAgICAgIFsxMSwxMSwxMV1cbiAgICBoZWxwOiAgICAgICBcImdldCB0byB0aGUgZXhpdCFcIlxuICAgIHBsYXllcjogICAgIFxuICAgICAgICBjb29yZGluYXRlczogWzcsNCwwXVxuICAgICAgICBvcmllbnRhdGlvbjogbWludXNaZG93bllcbiAgICBleGl0czogICAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIFxuICAgICAgICBzdXBlcmN1YmUgPSAocG9pbnQ9WzUsNSw1XSxzaXplPTIsb2JqPSdXYWxsJykgLT5cbiAgICAgICAgICAgIHA9cG9pbnRcbiAgICAgICAgICAgIHM9c2l6ZVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0UG9seSBvYmosW1twWzBdK3MscFsxXStzLHBbMl1dLCBbcFswXStzLHBbMV0tcyxwWzJdXSwgW3BbMF0tcyxwWzFdLXMscFsyXV0sIFtwWzBdLXMscFsxXStzLHBbMl1dXVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0UG9seSBvYmosW1twWzBdK3MscFsxXSxwWzJdK3NdLCBbcFswXStzLHBbMV0scFsyXS1zXSwgW3BbMF0tcyxwWzFdLHBbMl0tc10sIFtwWzBdLXMscFsxXSxwWzJdK3NdXVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0UG9seSBvYmosW1twWzBdLHBbMV0rcyxwWzJdK3NdLCBbcFswXSxwWzFdK3MscFsyXS1zXSwgW3BbMF0scFsxXS1zLHBbMl0tc10sIFtwWzBdLHBbMV0tcyxwWzJdK3NdXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBzID0gd29ybGQuc2l6ZVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RMaW5lICdXYWxsJywgMSwxLDEsIDksOSw5XG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUgJ1dhbGwnLCAxLDEsOSwgOSw5LDFcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSAnV2FsbCcsIDEsOSwxLCA5LDEsOVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RMaW5lICdXYWxsJywgOSwxLDEsIDEsOSw5XG4gICAgICAgIHdvcmxkLmdldE9jY3VwYW50QXRQb3Mod29ybGQuZGVjZW50ZXIoMCwwLDApKS5kZWwoKVxuICAgICAgICBzdXBlcmN1YmUgcG9pbnQ9WzUsNSw1XSxzaXplPTUsb2JqPSdXYWxsJ1xuICAgICAgICBzdXBlcmN1YmUgcG9pbnQ9WzUsNSw1XSxzaXplPTMsb2JqPSdTdG9uZSdcbiAgICAgICAgICAgICJdfQ==
//# sourceURL=../../coffee/levels/nice.coffee