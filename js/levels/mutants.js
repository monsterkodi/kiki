// koffee 1.4.0
module.exports = {
    name: "mutants",
    scheme: "blue",
    size: [9, 9, 9],
    help: "deactivate the mutants!\n\nto deactivate a mutant,\nshoot him until it get's transparent.\n\nthe exit will open,\nwhen all mutant bots\nare deactivated.",
    player: {
        coordinates: [7, 1, 8],
        orientation: minusYdownZ
    },
    exits: [
        {
            name: "exit",
            active: 0,
            position: [0, 0, 0],
            world: function() {
                return outro();
            }
        }
    ],
    create: function() {
        var Mutant, botDied, i, j, mutant, ref, results, s;
        s = world.size;
        Mutant = require('../items').Mutant;
        world.addObjectLine('Wall', [2, 2, 2], [s.x - 3, 2, 2]);
        world.addObjectLine('Wall', [s.x - 3, 2, 2], [s.x - 3, s.y - 3, 2]);
        world.addObjectLine('Wall', [s.x - 3, s.y - 3, 2], [s.x - 3, s.y - 3, s.z - 3]);
        world.addObjectLine('Wall', [s.x - 3, s.y - 3, s.z - 3], [2, s.y - 3, s.z - 3]);
        world.addObjectLine('Wall', [2, s.y - 3, s.z - 3], [2, 2, s.z - 3]);
        world.addObjectLine('Wall', [2, 2, s.z - 3], [2, 2, 2]);
        world.num_mutants = 5;
        world.death_counter = 0;
        botDied = function() {
            world.death_counter += 1;
            if (world.death_counter >= world.num_mutants) {
                return world.activate("exit");
            }
        };
        results = [];
        for (i = j = 0, ref = world.num_mutants; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            mutant = new Mutant();
            mutant.getEventWithName("died").addAction(world.once(botDied));
            results.push(world.setObjectRandom(mutant));
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXV0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxJQUFBLEVBQVksU0FBWjtJQUNBLE1BQUEsRUFBWSxNQURaO0lBRUEsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7SUFHQSxJQUFBLEVBQVksMEpBSFo7SUFhQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBYjtRQUNBLFdBQUEsRUFBYSxXQURiO0tBZEo7SUFnQkEsS0FBQSxFQUFVO1FBQ047WUFBQSxJQUFBLEVBQVksTUFBWjtZQUNBLE1BQUEsRUFBWSxDQURaO1lBRUEsUUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRlo7WUFHQSxLQUFBLEVBQVksU0FBQTt1QkFBSyxLQUFBLENBQUE7WUFBTCxDQUhaO1NBRE07S0FoQlY7SUFzQkEsTUFBQSxFQUFRLFNBQUE7QUFFSixZQUFBO1FBQUEsQ0FBQSxHQUFJLEtBQUssQ0FBQztRQUNULFNBQVUsT0FBQSxDQUFRLFVBQVI7UUFFWCxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUE1QixFQUF1QyxDQUFDLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLENBQXZDO1FBQ0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsTUFBcEIsRUFBNEIsQ0FBQyxDQUFDLENBQUMsQ0FBRixHQUFNLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixDQUE1QixFQUE2QyxDQUFDLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBUCxFQUFVLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBN0M7UUFDQSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBUCxFQUFVLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBNUIsRUFBbUQsQ0FBQyxDQUFDLENBQUMsQ0FBRixHQUFNLENBQVAsRUFBVSxDQUFDLENBQUMsQ0FBRixHQUFNLENBQWhCLEVBQW1CLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBekIsQ0FBbkQ7UUFDQSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBUCxFQUFVLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBaEIsRUFBbUIsQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUF6QixDQUE1QixFQUF5RCxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUMsQ0FBRixHQUFNLENBQVYsRUFBYSxDQUFDLENBQUMsQ0FBRixHQUFNLENBQW5CLENBQXpEO1FBQ0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsTUFBcEIsRUFBNEIsQ0FBQyxDQUFELEVBQUksQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFWLEVBQWEsQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFuQixDQUE1QixFQUFtRCxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFiLENBQW5EO1FBQ0EsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsTUFBcEIsRUFBNEIsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBYixDQUE1QixFQUE2QyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUE3QztRQUVBLEtBQUssQ0FBQyxXQUFOLEdBQXNCO1FBQ3RCLEtBQUssQ0FBQyxhQUFOLEdBQXNCO1FBRXRCLE9BQUEsR0FBVSxTQUFBO1lBQ04sS0FBSyxDQUFDLGFBQU4sSUFBdUI7WUFDdkIsSUFBRyxLQUFLLENBQUMsYUFBTixJQUF1QixLQUFLLENBQUMsV0FBaEM7dUJBQ0ksS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLEVBREo7O1FBRk07QUFLVjthQUFTLDBGQUFUO1lBQ0ksTUFBQSxHQUFTLElBQUksTUFBSixDQUFBO1lBQ1QsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLENBQStCLENBQUMsU0FBaEMsQ0FBMEMsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFYLENBQTFDO3lCQUNBLEtBQUssQ0FBQyxlQUFOLENBQXNCLE1BQXRCO0FBSEo7O0lBcEJJLENBdEJSIiwic291cmNlc0NvbnRlbnQiOlsiXG4jIDAwICAgICAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgICBcbiMgMDAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwMDAwMDAwICAwMDAgMCAwMDAgICAgIDAwMCAgICAgMDAwMDAwMCAgICAgXG4jIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAgICAwMDAgICAgICAgICAgMDAwICAgIFxuIyAwMDAgICAwMDAgICAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwICAgICBcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIG5hbWU6ICAgICAgIFwibXV0YW50c1wiXG4gICAgc2NoZW1lOiAgICAgXCJibHVlXCJcbiAgICBzaXplOiAgICAgICBbOSw5LDldXG4gICAgaGVscDogICAgICAgXCJcIlwiXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZSB0aGUgbXV0YW50cyFcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0byBkZWFjdGl2YXRlIGEgbXV0YW50LFxuICAgICAgICAgICAgICAgIHNob290IGhpbSB1bnRpbCBpdCBnZXQncyB0cmFuc3BhcmVudC5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGUgZXhpdCB3aWxsIG9wZW4sXG4gICAgICAgICAgICAgICAgd2hlbiBhbGwgbXV0YW50IGJvdHNcbiAgICAgICAgICAgICAgICBhcmUgZGVhY3RpdmF0ZWQuXG4gICAgICAgICAgICAgICAgXCJcIlwiXG4gICAgcGxheWVyOiAgIFxuICAgICAgICBjb29yZGluYXRlczogWzcsMSw4XVxuICAgICAgICBvcmllbnRhdGlvbjogbWludXNZZG93blpcbiAgICBleGl0czogICAgW1xuICAgICAgICBuYW1lOiAgICAgICBcImV4aXRcIlxuICAgICAgICBhY3RpdmU6ICAgICAwXG4gICAgICAgIHBvc2l0aW9uOiAgIFswLDAsMF1cbiAgICAgICAgd29ybGQ6ICAgICAgKCktPiBvdXRybygpXG4gICAgXVxuICAgIGNyZWF0ZTogLT5cbiAgICAgICAgXG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIHtNdXRhbnR9ID0gcmVxdWlyZSAnLi4vaXRlbXMnXG4gICAgICAgIFxuICAgICAgICB3b3JsZC5hZGRPYmplY3RMaW5lKCdXYWxsJywgWzIsIDIsIDJdLCBbcy54IC0gMywgMiwgMl0pXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUoJ1dhbGwnLCBbcy54IC0gMywgMiwgMl0sIFtzLnggLSAzLCBzLnkgLSAzLCAyXSlcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSgnV2FsbCcsIFtzLnggLSAzLCBzLnkgLSAzLCAyXSwgW3MueCAtIDMsIHMueSAtIDMsIHMueiAtIDNdKVxuICAgICAgICB3b3JsZC5hZGRPYmplY3RMaW5lKCdXYWxsJywgW3MueCAtIDMsIHMueSAtIDMsIHMueiAtIDNdLCBbMiwgcy55IC0gMywgcy56IC0gM10pXG4gICAgICAgIHdvcmxkLmFkZE9iamVjdExpbmUoJ1dhbGwnLCBbMiwgcy55IC0gMywgcy56IC0gM10sIFsyLCAyLCBzLnogLSAzXSlcbiAgICAgICAgd29ybGQuYWRkT2JqZWN0TGluZSgnV2FsbCcsIFsyLCAyLCBzLnogLSAzXSwgWzIsIDIsIDJdKVxuICAgICAgICBcbiAgICAgICAgd29ybGQubnVtX211dGFudHMgICA9IDVcbiAgICAgICAgd29ybGQuZGVhdGhfY291bnRlciA9IDBcbiAgICAgICAgXG4gICAgICAgIGJvdERpZWQgPSAtPlxuICAgICAgICAgICAgd29ybGQuZGVhdGhfY291bnRlciArPSAxXG4gICAgICAgICAgICBpZiB3b3JsZC5kZWF0aF9jb3VudGVyID49IHdvcmxkLm51bV9tdXRhbnRzXG4gICAgICAgICAgICAgICAgd29ybGQuYWN0aXZhdGUoXCJleGl0XCIpXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4uLndvcmxkLm51bV9tdXRhbnRzXVxuICAgICAgICAgICAgbXV0YW50ID0gbmV3IE11dGFudCgpXG4gICAgICAgICAgICBtdXRhbnQuZ2V0RXZlbnRXaXRoTmFtZShcImRpZWRcIikuYWRkQWN0aW9uIHdvcmxkLm9uY2UgYm90RGllZCAgXG4gICAgICAgICAgICB3b3JsZC5zZXRPYmplY3RSYW5kb20obXV0YW50KVxuICAgICAgICAgICAgIl19
//# sourceURL=../../coffee/levels/mutants.coffee