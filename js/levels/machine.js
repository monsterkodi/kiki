// koffee 1.4.0
module.exports = {
    name: "machine",
    deisgn: 'Michael Abel',
    scheme: "tron",
    size: [5, 5, 9],
    help: "activate the exit!",
    player: {
        coordinates: [1, 2, 2],
        orientation: minusZupX
    },
    exits: [
        {
            name: "exit",
            active: 0,
            coordinates: [1, 2, 8]
        }
    ],
    create: function() {
        var Face, Gear, Generator, MotorCylinder, MotorGear, gear, i, j, k, len, len1, ref, ref1, ref2, s;
        s = world.size;
        ref = require('../items'), Gear = ref.Gear, Generator = ref.Generator, MotorCylinder = ref.MotorCylinder, MotorGear = ref.MotorGear, Face = ref.Face;
        world.addObjectAtPos(new MotorGear(Face.X), 0, 2, 4);
        world.addObjectAtPos('Wall', 0, 2, 3);
        world.addObjectAtPos('Wall', 0, 2, 5);
        world.addObjectAtPos(new MotorCylinder(Face.X), 1, 2, 4);
        world.addObjectAtPos('WireStone', 0, 2, 6);
        ref1 = [1, 3, 5, 7];
        for (j = 0, len = ref1.length; j < len; j++) {
            i = ref1[j];
            world.addObjectAtPos('Wall', 4, 0, i);
            world.addObjectAtPos('Wall', 4, 4, i);
            world.addObjectAtPos('Wall', 0, 0, i);
            world.addObjectAtPos('Wall', 0, 4, i);
        }
        ref2 = [2, 4, 6];
        for (k = 0, len1 = ref2.length; k < len1; k++) {
            i = ref2[k];
            gear = new Gear(Face.X);
            world.addObjectAtPos(gear, 0, 1, i);
            if (i === 4) {
                gear.setActive(true);
            }
            gear = new Gear(Face.X);
            world.addObjectAtPos(gear, 0, 3, i);
            if (i === 4) {
                gear.setActive(true);
            }
        }
        return world.addObjectAtPos(new Generator(Face.X), 0, 2, 2);
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjaGluZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksU0FBWjtJQUNBLE1BQUEsRUFBWSxjQURaO0lBRUEsTUFBQSxFQUFZLE1BRlo7SUFHQSxJQUFBLEVBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIWjtJQUlBLElBQUEsRUFBWSxvQkFKWjtJQUtBLE1BQUEsRUFDSTtRQUFBLFdBQUEsRUFBZ0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBaEI7UUFDQSxXQUFBLEVBQWdCLFNBRGhCO0tBTko7SUFRQSxLQUFBLEVBQVk7UUFDUjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxXQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGZDtTQURRO0tBUlo7SUFhQSxNQUFBLEVBQVEsU0FBQTtBQUNKLFlBQUE7UUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDO1FBQ1YsTUFBb0QsT0FBQSxDQUFRLFVBQVIsQ0FBcEQsRUFBQyxlQUFELEVBQU8seUJBQVAsRUFBa0IsaUNBQWxCLEVBQWlDLHlCQUFqQyxFQUE0QztRQUU1QyxLQUFLLENBQUMsY0FBTixDQUFzQixJQUFJLFNBQUosQ0FBYyxJQUFJLENBQUMsQ0FBbkIsQ0FBdEIsRUFBNkMsQ0FBN0MsRUFBK0MsQ0FBL0MsRUFBaUQsQ0FBakQ7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUErQixDQUEvQixFQUFpQyxDQUFqQztRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CLEVBQWlDLENBQWpDO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBc0IsSUFBSSxhQUFKLENBQWtCLElBQUksQ0FBQyxDQUF2QixDQUF0QixFQUFpRCxDQUFqRCxFQUFtRCxDQUFuRCxFQUFxRCxDQUFyRDtRQUVBLEtBQUssQ0FBQyxjQUFOLENBQXFCLFdBQXJCLEVBQWtDLENBQWxDLEVBQW9DLENBQXBDLEVBQXNDLENBQXRDO0FBRUE7QUFBQSxhQUFBLHNDQUFBOztZQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CLEVBQWlDLENBQWpDO1lBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsRUFBaUMsQ0FBakM7WUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixNQUFyQixFQUE2QixDQUE3QixFQUErQixDQUEvQixFQUFpQyxDQUFqQztZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CLEVBQWlDLENBQWpDO0FBSko7QUFLQTtBQUFBLGFBQUEsd0NBQUE7O1lBQ0ksSUFBQSxHQUFPLElBQUksSUFBSixDQUFTLElBQUksQ0FBQyxDQUFkO1lBQ1AsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsQ0FBM0IsRUFBNkIsQ0FBN0IsRUFBK0IsQ0FBL0I7WUFDQSxJQUFHLENBQUEsS0FBSyxDQUFSO2dCQUNJLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQURKOztZQUVBLElBQUEsR0FBTyxJQUFJLElBQUosQ0FBUyxJQUFJLENBQUMsQ0FBZDtZQUNQLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQXJCLEVBQTJCLENBQTNCLEVBQTZCLENBQTdCLEVBQStCLENBQS9CO1lBQ0EsSUFBRyxDQUFBLEtBQUssQ0FBUjtnQkFDSSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsRUFESjs7QUFQSjtlQVVBLEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksU0FBSixDQUFjLElBQUksQ0FBQyxDQUFuQixDQUFyQixFQUE0QyxDQUE1QyxFQUE4QyxDQUE5QyxFQUFnRCxDQUFoRDtJQTFCSSxDQWJSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAgICAgIDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICBcbiMgICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4jICAgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAgIFxuIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDBcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwibWFjaGluZVwiXG4gICAgZGVpc2duOiAgICAgJ01pY2hhZWwgQWJlbCdcbiAgICBzY2hlbWU6ICAgICBcInRyb25cIlxuICAgIHNpemU6ICAgICAgIFs1LDUsOV1cbiAgICBoZWxwOiAgICAgICBcImFjdGl2YXRlIHRoZSBleGl0IVwiXG4gICAgcGxheWVyOiAgICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiAgICBbMSwyLDJdXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICBtaW51c1p1cFhcbiAgICBleGl0czogICAgICBbIFxuICAgICAgICBuYW1lOiAgICAgICAgIFwiZXhpdFwiXG4gICAgICAgIGFjdGl2ZTogICAgICAgMFxuICAgICAgICBjb29yZGluYXRlczogIFsxLDIsOF1cbiAgICBdXG4gICAgY3JlYXRlOiAtPlxuICAgICAgICBzID0gd29ybGQuc2l6ZVxuICAgICAgICB7R2VhciwgR2VuZXJhdG9yLCBNb3RvckN5bGluZGVyLCBNb3RvckdlYXIsIEZhY2V9ID0gcmVxdWlyZSAnLi4vaXRlbXMnXG4gICAgICAgIFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyggbmV3IE1vdG9yR2VhcihGYWNlLlgpLCAwLDIsNClcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ1dhbGwnLCAwLDIsMylcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ1dhbGwnLCAwLDIsNSlcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoIG5ldyBNb3RvckN5bGluZGVyKEZhY2UuWCksIDEsMiw0KVxuICAgICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ1dpcmVTdG9uZScsIDAsMiw2KVxuICAgXG4gICAgICAgIGZvciBpIGluIFsxLDMsNSw3XVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ1dhbGwnLCA0LDAsaSlcbiAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKCdXYWxsJywgNCw0LGkpXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcygnV2FsbCcsIDAsMCxpKVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ1dhbGwnLCAwLDQsaSlcbiAgICAgICAgZm9yIGkgaW4gWzIsNCw2XVxuICAgICAgICAgICAgZ2VhciA9IG5ldyBHZWFyIEZhY2UuWCBcbiAgICAgICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKGdlYXIsIDAsMSxpKVxuICAgICAgICAgICAgaWYgaSA9PSA0XG4gICAgICAgICAgICAgICAgZ2Vhci5zZXRBY3RpdmUgdHJ1ZSBcbiAgICAgICAgICAgIGdlYXIgPSBuZXcgR2VhciBGYWNlLlggXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyBnZWFyLCAwLDMsaSBcbiAgICAgICAgICAgIGlmIGkgPT0gNFxuICAgICAgICAgICAgICAgIGdlYXIuc2V0QWN0aXZlIHRydWUgXG4gICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKG5ldyBHZW5lcmF0b3IoRmFjZS5YKSwgMCwyLDIpXG4gICAgXG4gICAgICAgICJdfQ==
//# sourceURL=../../coffee/levels/machine.coffee