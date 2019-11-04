// koffee 1.4.0
module.exports = {
    name: "elevate",
    scheme: "bronze",
    size: [9, 5, 7],
    help: "use the bombs\nto elevate the gears\nand the generator.\n\nthe bombs will detonate\nif you shoot them.",
    player: {
        coordinates: [8, 0, 3],
        orientation: XupY
    },
    exits: [
        {
            name: "exit",
            active: 0,
            position: [2, -2, 0]
        }
    ],
    create: function() {
        var Face, Gear, Generator, MotorCylinder, MotorGear, Wire, ref, s;
        s = world.size;
        ref = require('../items'), MotorCylinder = ref.MotorCylinder, MotorGear = ref.MotorGear, Generator = ref.Generator, Gear = ref.Gear, Wire = ref.Wire, Face = ref.Face;
        world.addObjectAtPos(new MotorGear(Face.NY), s.x / 2 - 3, s.y - 1, s.z / 2);
        world.addObjectAtPos(new MotorCylinder(Face.NY), s.x / 2 - 3, s.y - 2, s.z / 2);
        world.addObjectAtPos(new Generator(Face.NY), s.x / 2 + 2, 1, s.z / 2 - 1);
        world.addObjectAtPos(new Gear(Face.NY), s.x / 2 + 1, 1, s.z / 2 + 1);
        world.addObjectAtPos(new Gear(Face.NY), s.x / 2, 1, s.z / 2 - 1);
        world.addObjectAtPos(new Gear(Face.NY), s.x / 2 - 1, 1, s.z / 2 + 1);
        world.addObjectAtPos(new Gear(Face.NY), s.x / 2 - 2, 1, s.z / 2 - 1);
        world.addObjectLine('new Wire(Face.NY, Wire.VERTICAL)', s.x / 2 + 2, s.y - 1, 0, s.x / 2 + 2, s.y - 1, s.z);
        world.addObjectLine('new Wire(Face.Y, Wire.VERTICAL)', s.x / 2 + 2, 0, 0, s.x / 2 + 2, 0, s.z);
        world.addObjectLine('new Wire(Face.Z, Wire.VERTICAL)', s.x / 2 + 2, 0, 0, s.x / 2 + 2, s.y, 0);
        world.addObjectLine('new Wire(Face.NZ, Wire.VERTICAL)', s.x / 2 + 2, 0, s.z - 1, s.x / 2 + 2, s.y, s.z - 1);
        world.addObjectAtPos('Bomb', s.x / 2 + 2, 0, s.z / 2 - 1);
        world.addObjectAtPos('Bomb', s.x / 2 + 1, 0, s.z / 2 + 1);
        world.addObjectAtPos('Bomb', s.x / 2, 0, s.z / 2 - 1);
        world.addObjectAtPos('Bomb', s.x / 2 - 1, 0, s.z / 2 + 1);
        return world.addObjectAtPos('Bomb', s.x / 2 - 2, 0, s.z / 2 - 1);
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxldmF0ZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksU0FBWjtJQUNBLE1BQUEsRUFBWSxRQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksd0dBSFo7SUFXQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBYjtRQUNBLFdBQUEsRUFBYSxJQURiO0tBWko7SUFjQSxLQUFBLEVBQVU7UUFDTjtZQUFBLElBQUEsRUFBYyxNQUFkO1lBQ0EsTUFBQSxFQUFjLENBRGQ7WUFFQSxRQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBQyxDQUFKLEVBQU0sQ0FBTixDQUZkO1NBRE07S0FkVjtJQW1CQSxNQUFBLEVBQVEsU0FBQTtBQUVKLFlBQUE7UUFBQSxDQUFBLEdBQUksS0FBSyxDQUFDO1FBQ1YsTUFBMEQsT0FBQSxDQUFRLFVBQVIsQ0FBMUQsRUFBQyxpQ0FBRCxFQUFnQix5QkFBaEIsRUFBMkIseUJBQTNCLEVBQXNDLGVBQXRDLEVBQTRDLGVBQTVDLEVBQWtEO1FBQ2xELEtBQUssQ0FBQyxjQUFOLENBQXFCLElBQUksU0FBSixDQUFjLElBQUksQ0FBQyxFQUFuQixDQUFyQixFQUE2QyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUFuRCxFQUFzRCxDQUFDLENBQUMsQ0FBRixHQUFJLENBQTFELEVBQTZELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBakU7UUFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLGFBQUosQ0FBa0IsSUFBSSxDQUFDLEVBQXZCLENBQXJCLEVBQWlELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQXZELEVBQTBELENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FB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QXNDLENBQXRDLEVBQXlDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQS9DO1FBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFqQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUosR0FBTSxDQUEvQztRQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE1BQXJCLEVBQTZCLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQW5DLEVBQXNDLENBQXRDLEVBQXlDLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBSixHQUFNLENBQS9DO2VBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFKLEdBQU0sQ0FBbkMsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFKLEdBQU0sQ0FBL0M7SUFyQkksQ0FuQlIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgICAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4jICAgMDAwICAgICAgIDAwMCAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuIyAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAwMDAwICAgIDAwMCAwMDAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCBcbiMgICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4jICAgMDAwMDAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwICAgICAgMCAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgbmFtZTogICAgICAgXCJlbGV2YXRlXCJcbiAgICBzY2hlbWU6ICAgICBcImJyb256ZVwiXG4gICAgc2l6ZTogICAgICAgWzksNSw3XVxuICAgIGhlbHA6ICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgICAgIHVzZSB0aGUgYm9tYnNcbiAgICAgICAgICAgICAgICB0byBlbGV2YXRlIHRoZSBnZWFyc1xuICAgICAgICAgICAgICAgIGFuZCB0aGUgZ2VuZXJhdG9yLlxuXG4gICAgICAgICAgICAgICAgdGhlIGJvbWJzIHdpbGwgZGV0b25hdGVcbiAgICAgICAgICAgICAgICBpZiB5b3Ugc2hvb3QgdGhlbS5cbiAgICAgICAgICAgICAgICBcIlwiXCJcbiAgICBwbGF5ZXI6ICAgXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbOCwwLDNdXG4gICAgICAgIG9yaWVudGF0aW9uOiBYdXBZXG4gICAgZXhpdHM6ICAgIFtcbiAgICAgICAgbmFtZTogICAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAgIDBcbiAgICAgICAgcG9zaXRpb246ICAgICBbMiwtMiwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG5cbiAgICAgICAgcyA9IHdvcmxkLnNpemVcbiAgICAgICAge01vdG9yQ3lsaW5kZXIsIE1vdG9yR2VhciwgR2VuZXJhdG9yLCBHZWFyLCBXaXJlLCBGYWNlfSA9IHJlcXVpcmUgJy4uL2l0ZW1zJ1xuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyhuZXcgTW90b3JHZWFyKEZhY2UuTlkpLCBzLngvMi0zLCBzLnktMSwgcy56LzIpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKG5ldyBNb3RvckN5bGluZGVyKEZhY2UuTlkpLCBzLngvMi0zLCBzLnktMiwgcy56LzIpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKG5ldyBHZW5lcmF0b3IoRmFjZS5OWSksIHMueC8yKzIsIDEsIHMuei8yLTEpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKG5ldyBHZWFyKEZhY2UuTlkpLCBzLngvMisxLCAxLCBzLnovMisxKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyhuZXcgR2VhcihGYWNlLk5ZKSwgcy54LzIsIDEsIHMuei8yLTEpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKG5ldyBHZWFyKEZhY2UuTlkpLCBzLngvMi0xLCAxLCBzLnovMisxKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcyhuZXcgR2VhcihGYWNlLk5ZKSwgcy54LzItMiwgMSwgcy56LzItMSlcbiAgICAgICAgXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUoJ25ldyBXaXJlKEZhY2UuTlksIFdpcmUuVkVSVElDQUwpJywgcy54LzIrMiwgcy55LTEsIDAsIHMueC8yKzIsIHMueS0xLCBzLnopXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUoJ25ldyBXaXJlKEZhY2UuWSwgV2lyZS5WRVJUSUNBTCknLCAgcy54LzIrMiwgMCwgMCwgICAgIHMueC8yKzIsIDAsIHMueilcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSgnbmV3IFdpcmUoRmFjZS5aLCBXaXJlLlZFUlRJQ0FMKScsICBzLngvMisyLCAwLCAwLCAgICAgcy54LzIrMiwgcy55LCAwKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RMaW5lKCduZXcgV2lyZShGYWNlLk5aLCBXaXJlLlZFUlRJQ0FMKScsIHMueC8yKzIsIDAsIHMuei0xLCBzLngvMisyLCBzLnksIHMuei0xKVxuICAgICAgICBcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ0JvbWInLCBzLngvMisyLCAwLCBzLnovMi0xKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcygnQm9tYicsIHMueC8yKzEsIDAsIHMuei8yKzEpXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdEF0UG9zKCdCb21iJywgcy54LzIsICAgMCwgcy56LzItMSlcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MoJ0JvbWInLCBzLngvMi0xLCAwLCBzLnovMisxKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RBdFBvcygnQm9tYicsIHMueC8yLTIsIDAsIHMuei8yLTEpXG4gICAgICAgICJdfQ==
//# sourceURL=../../coffee/levels/elevate.coffee