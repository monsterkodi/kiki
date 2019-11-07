// koffee 1.4.0
var Levels;

Levels = (function() {
    function Levels() {
        var i, len, levelName, ref;
        this.dict = {};
        this.list = ["steps", "jump", "move", "electro", "elevate", "fall", "blocks", "throw", "gold", "escape", "gears", "gamma", "cube", "switch", "mini", "bombs", "sandbox", "energy", "maze", "love", "towers", "edge", "random", "slick", "bridge", "plate", "nice", "entropy", "neutron", "strange", "core", "flower", "stones", "walls", "grid", "rings", "bronze", "pool", "grasp", "fallen", "cheese", "spiral", "hidden", "church", "mesh", "columns", "machine", "captured", "circuit", "regal", "conductor", "evil", "mutants"];
        ref = this.list;
        for (i = 0, len = ref.length; i < len; i++) {
            levelName = ref[i];
            this.dict[levelName] = require("./levels/" + levelName);
        }
    }

    return Levels;

})();

module.exports = Levels;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWxzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQTs7QUFBTTtJQUVDLGdCQUFBO0FBQ0MsWUFBQTtRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVE7UUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLENBR0osT0FISSxFQUlKLE1BSkksRUFLSixNQUxJLEVBTUosU0FOSSxFQU9KLFNBUEksRUFRSixNQVJJLEVBVUosUUFWSSxFQVdKLE9BWEksRUFZSixNQVpJLEVBYUosUUFiSSxFQWNKLE9BZEksRUFlSixPQWZJLEVBZ0JKLE1BaEJJLEVBaUJKLFFBakJJLEVBbUJKLE1BbkJJLEVBb0JKLE9BcEJJLEVBcUJKLFNBckJJLEVBc0JKLFFBdEJJLEVBdUJKLE1BdkJJLEVBd0JKLE1BeEJJLEVBMEJKLFFBMUJJLEVBMkJKLE1BM0JJLEVBNEJKLFFBNUJJLEVBNkJKLE9BN0JJLEVBOEJKLFFBOUJJLEVBK0JKLE9BL0JJLEVBZ0NKLE1BaENJLEVBaUNKLFNBakNJLEVBa0NKLFNBbENJLEVBbUNKLFNBbkNJLEVBb0NKLE1BcENJLEVBc0NKLFFBdENJLEVBdUNKLFFBdkNJLEVBd0NKLE9BeENJLEVBeUNKLE1BekNJLEVBMENKLE9BMUNJLEVBMkNKLFFBM0NJLEVBNENKLE1BNUNJLEVBOENKLE9BOUNJLEVBK0NKLFFBL0NJLEVBZ0RKLFFBaERJLEVBaURKLFFBakRJLEVBbURKLFFBbkRJLEVBb0RKLFFBcERJLEVBcURKLE1BckRJLEVBc0RKLFNBdERJLEVBdURKLFNBdkRJLEVBeURKLFVBekRJLEVBMERKLFNBMURJLEVBMkRKLE9BM0RJLEVBNERKLFdBNURJLEVBNkRKLE1BN0RJLEVBK0RKLFNBL0RJO0FBa0VSO0FBQUEsYUFBQSxxQ0FBQTs7WUFDSSxJQUFDLENBQUEsSUFBSyxDQUFBLFNBQUEsQ0FBTixHQUFtQixPQUFBLENBQVEsV0FBQSxHQUFZLFNBQXBCO0FBRHZCO0lBcEVEOzs7Ozs7QUF1RVAsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgICAgIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAgICAgMDAwMDAwMFxuIyAwMDAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgMDAwICAgICBcbiMgMDAwICAgICAgMDAwMDAwMCAgICAwMDAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgIDAwMDAwMDAgXG4jIDAwMCAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgIDAwMFxuIyAwMDAwMDAwICAwMDAwMDAwMCAgICAgIDAgICAgICAwMDAwMDAwMCAgMDAwMDAwMCAgMDAwMDAwMCBcblxuY2xhc3MgTGV2ZWxzXG4gICAgXG4gICAgQDogKCkgLT5cbiAgICAgICAgQGRpY3QgPSB7fVxuICAgICAgICBAbGlzdCA9IFtcbiAgICAgICAgICAgICMgXCJ0ZXN0XCJcbiAgICAgICAgICAgICMgLS0tIGludHJvZHVjdGlvblxuICAgICAgICAgICAgXCJzdGVwc1wiICAgIyBva1xuICAgICAgICAgICAgXCJqdW1wXCIgICAgIyBva1xuICAgICAgICAgICAgXCJtb3ZlXCIgICAgIyBva1xuICAgICAgICAgICAgXCJlbGVjdHJvXCIgIyBva1xuICAgICAgICAgICAgXCJlbGV2YXRlXCIgIyBva1xuICAgICAgICAgICAgXCJmYWxsXCIgICAgIyBva1xuICAgICAgICAgICAgIyAjIC0tLSBlYXN5XG4gICAgICAgICAgICBcImJsb2Nrc1wiICAjIG9rXG4gICAgICAgICAgICBcInRocm93XCIgXG4gICAgICAgICAgICBcImdvbGRcIiBcbiAgICAgICAgICAgIFwiZXNjYXBlXCIgXG4gICAgICAgICAgICBcImdlYXJzXCIgXG4gICAgICAgICAgICBcImdhbW1hXCIgIFxuICAgICAgICAgICAgXCJjdWJlXCIgXG4gICAgICAgICAgICBcInN3aXRjaFwiXG4gICAgICAgICAgICAjICMgXCJib3JnXCIgXG4gICAgICAgICAgICBcIm1pbmlcIiBcbiAgICAgICAgICAgIFwiYm9tYnNcIiBcbiAgICAgICAgICAgIFwic2FuZGJveFwiIFxuICAgICAgICAgICAgXCJlbmVyZ3lcIiBcbiAgICAgICAgICAgIFwibWF6ZVwiIFxuICAgICAgICAgICAgXCJsb3ZlXCIgXG4gICAgICAgICAgICAjIC0tLSBtZWRpdW1cbiAgICAgICAgICAgIFwidG93ZXJzXCIgXG4gICAgICAgICAgICBcImVkZ2VcIiBcbiAgICAgICAgICAgIFwicmFuZG9tXCIgXG4gICAgICAgICAgICBcInNsaWNrXCIgXG4gICAgICAgICAgICBcImJyaWRnZVwiIFxuICAgICAgICAgICAgXCJwbGF0ZVwiIFxuICAgICAgICAgICAgXCJuaWNlXCIgXG4gICAgICAgICAgICBcImVudHJvcHlcIiBcbiAgICAgICAgICAgIFwibmV1dHJvblwiXG4gICAgICAgICAgICBcInN0cmFuZ2VcIlxuICAgICAgICAgICAgXCJjb3JlXCJcbiAgICAgICAgICAgICMgLS0tIGRpZmZpY3VsdFxuICAgICAgICAgICAgXCJmbG93ZXJcIiBcbiAgICAgICAgICAgIFwic3RvbmVzXCIgXG4gICAgICAgICAgICBcIndhbGxzXCIgXG4gICAgICAgICAgICBcImdyaWRcIiBcbiAgICAgICAgICAgIFwicmluZ3NcIiBcbiAgICAgICAgICAgIFwiYnJvbnplXCIgXG4gICAgICAgICAgICBcInBvb2xcIiBcbiAgICAgICAgICAgICMgLS0tIG93ZW4gaGF5J3MgbGV2ZWxzIChUT0RPOiBzb3J0IGluKVxuICAgICAgICAgICAgXCJncmFzcFwiIFxuICAgICAgICAgICAgXCJmYWxsZW5cIiBcbiAgICAgICAgICAgIFwiY2hlZXNlXCIgXG4gICAgICAgICAgICBcInNwaXJhbFwiIFxuICAgICAgICAgICAgIyAtLS0gdG91Z2hcbiAgICAgICAgICAgIFwiaGlkZGVuXCIgXG4gICAgICAgICAgICBcImNodXJjaFwiIFxuICAgICAgICAgICAgXCJtZXNoXCIgXG4gICAgICAgICAgICBcImNvbHVtbnNcIiBcbiAgICAgICAgICAgIFwibWFjaGluZVwiIFxuICAgICAgICAgICAgIyAtLS0gdmVyeSBoYXJkXG4gICAgICAgICAgICBcImNhcHR1cmVkXCIgXG4gICAgICAgICAgICBcImNpcmN1aXRcIiBcbiAgICAgICAgICAgIFwicmVnYWxcIiBcbiAgICAgICAgICAgIFwiY29uZHVjdG9yXCIgXG4gICAgICAgICAgICBcImV2aWxcIiBcbiAgICAgICAgICAgICMgb3V0cm9cbiAgICAgICAgICAgIFwibXV0YW50c1wiXVxuICAgICAgICAgICAgICAgXG4gICAgICAgICMgaW1wb3J0IHRoZSBsZXZlbHNcbiAgICAgICAgZm9yIGxldmVsTmFtZSBpbiBAbGlzdFxuICAgICAgICAgICAgQGRpY3RbbGV2ZWxOYW1lXSA9IHJlcXVpcmUgXCIuL2xldmVscy8je2xldmVsTmFtZX1cIlxuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxzXG4iXX0=
//# sourceURL=../coffee/levels.coffee