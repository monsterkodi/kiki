// koffee 1.4.0
var klog;

klog = require('kxk').klog;

module.exports = {
    name: "cheese",
    design: "Owen Hay",
    scheme: "yellow",
    size: [11, 12, 7],
    help: "to activate the exit,\nactivate all switches.",
    player: {
        coordinates: [4, 10, 0],
        orientation: YupZ
    },
    exits: [
        {
            name: "exit",
            active: 0,
            position: [-1, 0, 0]
        }
    ],
    create: function() {
        var Switch, h, i, j, k, l, len, m, ref, ref1, ref2, s, switch1, switch2, switch3, switch4, switched;
        s = world.size;
        h = 0;
        ref = [1, 2];
        for (k = 0, len = ref.length; k < len; k++) {
            i = ref[k];
            world.addObjectAtPos('Wall', 1, i, 1);
            world.addObjectAtPos('Wall', 1, i, 3);
            world.addObjectAtPos('Wall', 2, i, 1);
            world.addObjectAtPos('Wall', 2, i, 2);
            world.addObjectAtPos('Wall', 2, i, 5);
            world.addObjectAtPos('Wall', 3, i, 1);
            world.addObjectAtPos('Wall', 3, i, 2);
            world.addObjectAtPos('Wall', 3, i, 4);
            world.addObjectAtPos('Wall', 3, i, 5);
            world.addObjectAtPos('Wall', 5, i, 0);
            world.addObjectAtPos('Wall', 5, i, 2);
            world.addObjectAtPos('Wall', 5, i, 3);
            world.addObjectAtPos('Wall', 5, i, 4);
            world.addObjectAtPos('Wall', 6, i, 1);
            world.addObjectAtPos('Wall', 6, i, 2);
            world.addObjectAtPos('Wall', 7, i, 2);
            world.addObjectAtPos('Wall', 7, i, 4);
            world.addObjectAtPos('Wall', 7, i, 5);
            world.addObjectAtPos('Wall', 8, i, 0);
            world.addObjectAtPos('Wall', 8, i, 2);
            world.addObjectAtPos('Wall', 8, i, 4);
            world.addObjectAtPos('Wall', 8, i, 5);
            world.addObjectAtPos('Wall', 9, i, 2);
            world.addObjectAtPos('Wall', 9, i, 4);
            world.addObjectAtPos('Wall', 10, i, 3);
        }
        for (i = l = 0, ref1 = s.x; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
            for (j = m = 0, ref2 = s.z; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
                world.addObjectAtPos('Stone', i, 2, j);
            }
        }
        world.switch_counter = 0;
        switched = function(swtch) {
            var exit;
            world.switch_counter += swtch.active && 1 || -1;
            klog("world.switch_counter " + swtch + " " + world.switch_counter);
            exit = world.getObjectWithName("exit");
            return exit.setActive(world.switch_counter === 4);
        };
        Switch = require('../switch');
        switch1 = new Switch;
        switch1.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(switch1);
        }));
        switch2 = new Switch;
        switch2.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(switch2);
        }));
        switch3 = new Switch;
        switch3.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(switch3);
        }));
        switch4 = new Switch;
        switch4.getEventWithName("switched").addAction(world.continuous(function() {
            return switched(switch4);
        }));
        world.addObjectAtPos(switch1, 1, 0, 2);
        world.addObjectAtPos(switch2, 7, 1, 0);
        world.addObjectAtPos(switch3, 9, 0, 0);
        return world.addObjectAtPos(switch4, 9, 1, 5);
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlZXNlLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQTs7QUFBRSxPQUFTLE9BQUEsQ0FBUSxLQUFSOztBQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksUUFBWjtJQUNBLE1BQUEsRUFBWSxVQURaO0lBRUEsTUFBQSxFQUFZLFFBRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxFQUFELEVBQUksRUFBSixFQUFPLENBQVAsQ0FIWjtJQUlBLElBQUEsRUFBWSwrQ0FKWjtJQVFBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBZSxDQUFDLENBQUQsRUFBRyxFQUFILEVBQU0sQ0FBTixDQUFmO1FBQ0EsV0FBQSxFQUFnQixJQURoQjtLQVRKO0lBV0EsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQWdCLE1BQWhCO1lBQ0EsTUFBQSxFQUFnQixDQURoQjtZQUVBLFFBQUEsRUFBZ0IsQ0FBQyxDQUFDLENBQUYsRUFBSSxDQUFKLEVBQU0sQ0FBTixDQUZoQjtTQURNO0tBWFY7SUFnQkEsTUFBQSxFQUFRLFNBQUE7QUFDSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztRQUNWLENBQUEsR0FBSTtBQUNKO0FBQUEsYUFBQSxxQ0FBQTs7WUFDTSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixFQUE3QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztBQXpCTjtBQTJCQSxhQUFTLGlGQUFUO0FBQ00saUJBQVMsaUZBQVQ7Z0JBQ00sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsQ0FBOUIsRUFBZ0MsQ0FBaEMsRUFBa0MsQ0FBbEM7QUFETjtBQUROO1FBSUEsS0FBSyxDQUFDLGNBQU4sR0FBdUI7UUFDdkIsUUFBQSxHQUFXLFNBQUMsS0FBRDtBQUNQLGdCQUFBO1lBQUEsS0FBSyxDQUFDLGNBQU4sSUFBeUIsS0FBSyxDQUFDLE1BQU4sSUFBaUIsQ0FBakIsSUFBc0IsQ0FBQztZQUNoRCxJQUFBLENBQUssdUJBQUEsR0FBd0IsS0FBeEIsR0FBOEIsR0FBOUIsR0FBaUMsS0FBSyxDQUFDLGNBQTVDO1lBQ0EsSUFBQSxHQUFPLEtBQUssQ0FBQyxpQkFBTixDQUF3QixNQUF4QjttQkFDUCxJQUFJLENBQUMsU0FBTCxDQUFlLEtBQUssQ0FBQyxjQUFOLEtBQXdCLENBQXZDO1FBSk87UUFNWCxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVI7UUFDVCxPQUFBLEdBQVUsSUFBSTtRQUNkLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixVQUF6QixDQUFvQyxDQUFDLFNBQXJDLENBQStDLEtBQUssQ0FBQyxVQUFOLENBQWlCLFNBQUE7bUJBQUcsUUFBQSxDQUFTLE9BQVQ7UUFBSCxDQUFqQixDQUEvQztRQUNBLE9BQUEsR0FBVSxJQUFJO1FBQ2QsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFVBQXpCLENBQW9DLENBQUMsU0FBckMsQ0FBK0MsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsU0FBQTttQkFBRyxRQUFBLENBQVMsT0FBVDtRQUFILENBQWpCLENBQS9DO1FBQ0EsT0FBQSxHQUFVLElBQUk7UUFDZCxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsVUFBekIsQ0FBb0MsQ0FBQyxTQUFyQyxDQUErQyxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFBO21CQUFHLFFBQUEsQ0FBUyxPQUFUO1FBQUgsQ0FBakIsQ0FBL0M7UUFDQSxPQUFBLEdBQVUsSUFBSTtRQUNkLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixVQUF6QixDQUFvQyxDQUFDLFNBQXJDLENBQStDLEtBQUssQ0FBQyxVQUFOLENBQWlCLFNBQUE7bUJBQUcsUUFBQSxDQUFTLE9BQVQ7UUFBSCxDQUFqQixDQUEvQztRQUVBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsT0FBckIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEM7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQztlQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO0lBdERJLENBaEJSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgIFxuIyAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgXG4jICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgICBcbiMgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMFxuXG57IGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwiY2hlZXNlXCJcbiAgICBkZXNpZ246ICAgICBcIk93ZW4gSGF5XCJcbiAgICBzY2hlbWU6ICAgICBcInllbGxvd1wiXG4gICAgc2l6ZTogICAgICAgWzExLDEyLDddXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgdG8gYWN0aXZhdGUgdGhlIGV4aXQsXG4gICAgICAgICAgICAgICAgYWN0aXZhdGUgYWxsIHN3aXRjaGVzLlxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgIHBsYXllcjpcbiAgICAgICAgY29vcmRpbmF0ZXM6ICAgWzQsMTAsMF1cbiAgICAgICAgb3JpZW50YXRpb246ICAgIFl1cFpcbiAgICBleGl0czogICAgW1xuICAgICAgICBuYW1lOiAgICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAgIDBcbiAgICAgICAgcG9zaXRpb246ICAgICAgIFstMSwwLDBdXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cbiAgICAgICAgcyA9IHdvcmxkLnNpemVcbiAgICAgICAgaCA9IDBcbiAgICAgICAgZm9yIGkgaW4gWzEsIDJdXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMSwgaSwgMVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDEsIGksIDNcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAyLCBpLCAxXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMiwgaSwgMlxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDIsIGksIDVcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAzLCBpLCAxXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMywgaSwgMlxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDMsIGksIDRcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAzLCBpLCA1XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNSwgaSwgMFxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDUsIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA1LCBpLCAzXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNSwgaSwgNFxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDYsIGksIDFcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA2LCBpLCAyXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNywgaSwgMlxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDcsIGksIDRcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA3LCBpLCA1XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgOCwgaSwgMFxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDgsIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA4LCBpLCA0XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgOCwgaSwgNVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDksIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA5LCBpLCA0XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMTAsIGksIDNcbiAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi4ucy54XVxuICAgICAgICAgICAgICBmb3IgaiBpbiBbMC4uLnMuel1cbiAgICAgICAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgaSwyLGpcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLnN3aXRjaF9jb3VudGVyID0gMFxuICAgICAgICBzd2l0Y2hlZCA9IChzd3RjaCkgLT5cbiAgICAgICAgICAgIHdvcmxkLnN3aXRjaF9jb3VudGVyICs9IChzd3RjaC5hY3RpdmUgYW5kIDEgb3IgLTEpXG4gICAgICAgICAgICBrbG9nIFwid29ybGQuc3dpdGNoX2NvdW50ZXIgI3tzd3RjaH0gI3t3b3JsZC5zd2l0Y2hfY291bnRlcn1cIlxuICAgICAgICAgICAgZXhpdCA9IHdvcmxkLmdldE9iamVjdFdpdGhOYW1lIFwiZXhpdFwiXG4gICAgICAgICAgICBleGl0LnNldEFjdGl2ZSB3b3JsZC5zd2l0Y2hfY291bnRlciA9PSA0XG4gICAgICAgIFxuICAgICAgICBTd2l0Y2ggPSByZXF1aXJlICcuLi9zd2l0Y2gnXG4gICAgICAgIHN3aXRjaDEgPSBuZXcgU3dpdGNoXG4gICAgICAgIHN3aXRjaDEuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHN3aXRjaDFcbiAgICAgICAgc3dpdGNoMiA9IG5ldyBTd2l0Y2hcbiAgICAgICAgc3dpdGNoMi5nZXRFdmVudFdpdGhOYW1lKFwic3dpdGNoZWRcIikuYWRkQWN0aW9uIHdvcmxkLmNvbnRpbnVvdXMgLT4gc3dpdGNoZWQgc3dpdGNoMlxuICAgICAgICBzd2l0Y2gzID0gbmV3IFN3aXRjaFxuICAgICAgICBzd2l0Y2gzLmdldEV2ZW50V2l0aE5hbWUoXCJzd2l0Y2hlZFwiKS5hZGRBY3Rpb24gd29ybGQuY29udGludW91cyAtPiBzd2l0Y2hlZCBzd2l0Y2gzXG4gICAgICAgIHN3aXRjaDQgPSBuZXcgU3dpdGNoXG4gICAgICAgIHN3aXRjaDQuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHN3aXRjaDRcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIHN3aXRjaDEsIDEsIDAgLDJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3Mgc3dpdGNoMiwgNywgMSwgMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBzd2l0Y2gzLCA5LCAwLCAwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIHN3aXRjaDQsIDksIDEsIDVcbiAgICAgICAgIl19
//# sourceURL=../../coffee/levels/cheese.coffee