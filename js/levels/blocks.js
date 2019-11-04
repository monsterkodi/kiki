// koffee 1.4.0
module.exports = {
    name: "blocks",
    design: 'Michael Abel',
    scheme: "default",
    size: [18, 12, 5],
    help: "you can grab\nmost stones by pressing forward\nwhile jumping or falling down\nnext to them.\nthe slitted stones are slippery,\nyou can't grab them while jumping\nor falling.\nthe color of a stone has no meaning.",
    player: {
        coordinates: [4, 4, 0],
        orientation: minusXupZ
    },
    exits: [
        {
            name: "exit",
            active: 1,
            coordinates: [7, 9, 2]
        }
    ],
    create: function() {
        var Stone;
        Stone = require('../items').Stone;
        world.addObjectAtPos('Wall', 1, 1, 2);
        world.addObjectAtPos('Wall', 4, 2, 2);
        world.addObjectAtPos('Wall', 7, 2, 2);
        world.addObjectAtPos('Stone', 10, 2, 2);
        world.addObjectAtPos(new Stone({
            slippery: true
        }), 13, 2, 2);
        world.addObjectAtPos(new Stone({
            slippery: true
        }), 15, 4, 2);
        world.addObjectAtPos(new Stone({
            color: [0, 1, 0],
            opacity: 0.8,
            slippery: true
        }), 13, 7, 2);
        world.addObjectAtPos(new Stone({
            color: [1, 0, 0],
            opacity: 0.8,
            slippery: true
        }), 10, 7, 2);
        world.addObjectAtPos(new Stone({
            color: [0, 0, 1],
            opacity: 0.8,
            slippery: true
        }), 7, 7, 2);
        world.addObjectAtPos(new Stone({
            color: [0.5, 0.5, 0],
            opacity: 0.8
        }), 4, 7, 2);
        return world.addObjectLine('Wall', 0, 0, 2, 7, 0, 2);
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2tzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLElBQUEsRUFBWSxRQUFaO0lBQ0EsTUFBQSxFQUFZLGNBRFo7SUFFQSxNQUFBLEVBQVksU0FGWjtJQUdBLElBQUEsRUFBWSxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sQ0FBUCxDQUhaO0lBSUEsSUFBQSxFQUFZLHFOQUpaO0lBY0EsTUFBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWI7UUFDQSxXQUFBLEVBQWEsU0FEYjtLQWZKO0lBaUJBLEtBQUEsRUFBVTtRQUNOO1lBQUEsSUFBQSxFQUFjLE1BQWQ7WUFDQSxNQUFBLEVBQWMsQ0FEZDtZQUVBLFdBQUEsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUZiO1NBRE07S0FqQlY7SUFzQkEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUMsUUFBUyxPQUFBLENBQVEsVUFBUjtRQUNWLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CLEVBQWlDLENBQWpDO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakM7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUErQixDQUEvQixFQUFpQyxDQUFqQztRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEVBQTlCLEVBQWlDLENBQWpDLEVBQW1DLENBQW5DO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7WUFBQSxRQUFBLEVBQVUsSUFBVjtTQUFWLENBQXJCLEVBQWdELEVBQWhELEVBQW1ELENBQW5ELEVBQXFELENBQXJEO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7WUFBQSxRQUFBLEVBQVUsSUFBVjtTQUFWLENBQXJCLEVBQWdELEVBQWhELEVBQW1ELENBQW5ELEVBQXFELENBQXJEO1FBRUEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7WUFBQSxLQUFBLEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBUDtZQUFnQixPQUFBLEVBQVMsR0FBekI7WUFBOEIsUUFBQSxFQUFVLElBQXhDO1NBQVYsQ0FBckIsRUFBOEUsRUFBOUUsRUFBaUYsQ0FBakYsRUFBbUYsQ0FBbkY7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLEtBQUosQ0FBVTtZQUFBLEtBQUEsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFQO1lBQWdCLE9BQUEsRUFBUyxHQUF6QjtZQUE4QixRQUFBLEVBQVUsSUFBeEM7U0FBVixDQUFyQixFQUE4RSxFQUE5RSxFQUFpRixDQUFqRixFQUFtRixDQUFuRjtRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksS0FBSixDQUFVO1lBQUEsS0FBQSxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVA7WUFBZ0IsT0FBQSxFQUFTLEdBQXpCO1lBQThCLFFBQUEsRUFBVSxJQUF4QztTQUFWLENBQXJCLEVBQThFLENBQTlFLEVBQWdGLENBQWhGLEVBQWtGLENBQWxGO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxLQUFKLENBQVU7WUFBQSxLQUFBLEVBQU8sQ0FBQyxHQUFELEVBQUssR0FBTCxFQUFTLENBQVQsQ0FBUDtZQUFvQixPQUFBLEVBQVEsR0FBNUI7U0FBVixDQUFyQixFQUFpRSxDQUFqRSxFQUFtRSxDQUFuRSxFQUFxRSxDQUFyRTtlQUVBLEtBQUssQ0FBQyxhQUFOLENBQW9CLE1BQXBCLEVBQTRCLENBQTVCLEVBQThCLENBQTlCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLEVBQXFDLENBQXJDLEVBQXVDLENBQXZDO0lBZEksQ0F0QlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAwMDAwICAgIDAwMCAgICAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDBcbiMgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAgICBcbiMgICAwMDAwMDAwICAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCBcbiMgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgICAgICAwMDBcbiMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCBcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwiYmxvY2tzXCJcbiAgICBkZXNpZ246ICAgICAnTWljaGFlbCBBYmVsJ1xuICAgIHNjaGVtZTogICAgIFwiZGVmYXVsdFwiXG4gICAgc2l6ZTogICAgICAgWzE4LDEyLDVdXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgeW91IGNhbiBncmFiXG4gICAgICAgICAgICAgICAgbW9zdCBzdG9uZXMgYnkgcHJlc3NpbmcgZm9yd2FyZFxuICAgICAgICAgICAgICAgIHdoaWxlIGp1bXBpbmcgb3IgZmFsbGluZyBkb3duXG4gICAgICAgICAgICAgICAgbmV4dCB0byB0aGVtLlxuICAgICAgICAgICAgICAgIHRoZSBzbGl0dGVkIHN0b25lcyBhcmUgc2xpcHBlcnksXG4gICAgICAgICAgICAgICAgeW91IGNhbid0IGdyYWIgdGhlbSB3aGlsZSBqdW1waW5nXG4gICAgICAgICAgICAgICAgb3IgZmFsbGluZy5cbiAgICAgICAgICAgICAgICB0aGUgY29sb3Igb2YgYSBzdG9uZSBoYXMgbm8gbWVhbmluZy5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6ICAgICBcbiAgICAgICAgY29vcmRpbmF0ZXM6IFs0LDQsMF1cbiAgICAgICAgb3JpZW50YXRpb246IG1pbnVzWHVwWlxuICAgIGV4aXRzOiAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbNyw5LDJdXG4gICAgICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHtTdG9uZX0gPSByZXF1aXJlICcuLi9pdGVtcydcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAxLDEsMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDQsMiwyXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNywyLDJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgMTAsMiwyXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBTdG9uZShzbGlwcGVyeTogdHJ1ZSksIDEzLDIsMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBuZXcgU3RvbmUoc2xpcHBlcnk6IHRydWUpLCAxNSw0LDJcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIG5ldyBTdG9uZShjb2xvcjogWzAsMSwwXSwgb3BhY2l0eTogMC44LCBzbGlwcGVyeTogdHJ1ZSksIDEzLDcsMlxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBuZXcgU3RvbmUoY29sb3I6IFsxLDAsMF0sIG9wYWNpdHk6IDAuOCwgc2xpcHBlcnk6IHRydWUpLCAxMCw3LDJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IFN0b25lKGNvbG9yOiBbMCwwLDFdLCBvcGFjaXR5OiAwLjgsIHNsaXBwZXJ5OiB0cnVlKSwgNyw3LDJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgbmV3IFN0b25lKGNvbG9yOiBbMC41LDAuNSwwXSwgb3BhY2l0eTowLjgpLCA0LDcsMlxuICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSAnV2FsbCcsIDAsMCwyLCA3LDAsMlxuIl19
//# sourceURL=../../coffee/levels/blocks.coffee