// koffee 1.4.0
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
            console.log("world.switch_counter " + swtch + " " + world.switch_counter);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlZXNlLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtJQUFBLElBQUEsRUFBWSxRQUFaO0lBQ0EsTUFBQSxFQUFZLFVBRFo7SUFFQSxNQUFBLEVBQVksUUFGWjtJQUdBLElBQUEsRUFBWSxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sQ0FBUCxDQUhaO0lBSUEsSUFBQSxFQUFZLCtDQUpaO0lBUUEsTUFBQSxFQUNJO1FBQUEsV0FBQSxFQUFlLENBQUMsQ0FBRCxFQUFHLEVBQUgsRUFBTSxDQUFOLENBQWY7UUFDQSxXQUFBLEVBQWdCLElBRGhCO0tBVEo7SUFXQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBZ0IsTUFBaEI7WUFDQSxNQUFBLEVBQWdCLENBRGhCO1lBRUEsUUFBQSxFQUFnQixDQUFDLENBQUMsQ0FBRixFQUFJLENBQUosRUFBTSxDQUFOLENBRmhCO1NBRE07S0FYVjtJQWdCQSxNQUFBLEVBQVEsU0FBQTtBQUNKLFlBQUE7UUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDO1FBQ1YsQ0FBQSxHQUFJO0FBQ0o7QUFBQSxhQUFBLHFDQUFBOztZQUNNLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkM7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ICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgXG4jICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCBcbiMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAgIFxuIyAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAwXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBuYW1lOiAgICAgICBcImNoZWVzZVwiXG4gICAgZGVzaWduOiAgICAgXCJPd2VuIEhheVwiXG4gICAgc2NoZW1lOiAgICAgXCJ5ZWxsb3dcIlxuICAgIHNpemU6ICAgICAgIFsxMSwxMiw3XVxuICAgIGhlbHA6ICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIHRvIGFjdGl2YXRlIHRoZSBleGl0LFxuICAgICAgICAgICAgICAgIGFjdGl2YXRlIGFsbCBzd2l0Y2hlcy5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6XG4gICAgICAgIGNvb3JkaW5hdGVzOiAgIFs0LDEwLDBdXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICBZdXBaXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgICAgICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgICAwXG4gICAgICAgIHBvc2l0aW9uOiAgICAgICBbLTEsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIGggPSAwXG4gICAgICAgIGZvciBpIGluIFsxLCAyXVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDEsIGksIDFcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAxLCBpLCAzXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMiwgaSwgMVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDIsIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAyLCBpLCA1XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMywgaSwgMVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDMsIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCAzLCBpLCA0XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgMywgaSwgNVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDUsIGksIDBcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA1LCBpLCAyXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNSwgaSwgM1xuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDUsIGksIDRcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA2LCBpLCAxXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNiwgaSwgMlxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDcsIGksIDJcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA3LCBpLCA0XG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgNywgaSwgNVxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDgsIGksIDBcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA4LCBpLCAyXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgOCwgaSwgNFxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDgsIGksIDVcbiAgICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1dhbGwnLCA5LCBpLCAyXG4gICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdXYWxsJywgOSwgaSwgNFxuICAgICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyAnV2FsbCcsIDEwLCBpLCAzXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4uLnMueF1cbiAgICAgICAgICAgICAgZm9yIGogaW4gWzAuLi5zLnpdXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zICdTdG9uZScsIGksMixqXG4gICAgICAgIFxuICAgICAgICB3b3JsZC5zd2l0Y2hfY291bnRlciA9IDBcbiAgICAgICAgc3dpdGNoZWQgPSAoc3d0Y2gpIC0+XG4gICAgICAgICAgICB3b3JsZC5zd2l0Y2hfY291bnRlciArPSAoc3d0Y2guYWN0aXZlIGFuZCAxIG9yIC0xKVxuICAgICAgICAgICAgbG9nIFwid29ybGQuc3dpdGNoX2NvdW50ZXIgI3tzd3RjaH0gI3t3b3JsZC5zd2l0Y2hfY291bnRlcn1cIlxuICAgICAgICAgICAgZXhpdCA9IHdvcmxkLmdldE9iamVjdFdpdGhOYW1lIFwiZXhpdFwiXG4gICAgICAgICAgICBleGl0LnNldEFjdGl2ZSB3b3JsZC5zd2l0Y2hfY291bnRlciA9PSA0XG4gICAgICAgIFxuICAgICAgICBTd2l0Y2ggPSByZXF1aXJlICcuLi9zd2l0Y2gnXG4gICAgICAgIHN3aXRjaDEgPSBuZXcgU3dpdGNoXG4gICAgICAgIHN3aXRjaDEuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHN3aXRjaDFcbiAgICAgICAgc3dpdGNoMiA9IG5ldyBTd2l0Y2hcbiAgICAgICAgc3dpdGNoMi5nZXRFdmVudFdpdGhOYW1lKFwic3dpdGNoZWRcIikuYWRkQWN0aW9uIHdvcmxkLmNvbnRpbnVvdXMgLT4gc3dpdGNoZWQgc3dpdGNoMlxuICAgICAgICBzd2l0Y2gzID0gbmV3IFN3aXRjaFxuICAgICAgICBzd2l0Y2gzLmdldEV2ZW50V2l0aE5hbWUoXCJzd2l0Y2hlZFwiKS5hZGRBY3Rpb24gd29ybGQuY29udGludW91cyAtPiBzd2l0Y2hlZCBzd2l0Y2gzXG4gICAgICAgIHN3aXRjaDQgPSBuZXcgU3dpdGNoXG4gICAgICAgIHN3aXRjaDQuZ2V0RXZlbnRXaXRoTmFtZShcInN3aXRjaGVkXCIpLmFkZEFjdGlvbiB3b3JsZC5jb250aW51b3VzIC0+IHN3aXRjaGVkIHN3aXRjaDRcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIHN3aXRjaDEsIDEsIDAgLDJcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3Mgc3dpdGNoMiwgNywgMSwgMFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBzd2l0Y2gzLCA5LCAwLCAwXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zIHN3aXRjaDQsIDksIDEsIDVcbiAgICAgICAgIl19
//# sourceURL=../../coffee/levels/cheese.coffee