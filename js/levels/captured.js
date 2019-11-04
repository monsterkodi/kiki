// koffee 1.4.0
module.exports = {
    name: "captured",
    design: 'Niko Boehm',
    scheme: "default",
    size: [9, 9, 9],
    help: "to get to the exit,\nmove the stones.",
    player: {
        coordinates: [2, 3, 2],
        orientation: minusZdownX
    },
    exits: [
        {
            name: "exit",
            active: 1,
            position: [0, 0, 0]
        }
    ],
    create: function() {
        var i, j, k, len, len1, ref, ref1, results, s;
        s = world.size;
        ref = [-2, 2];
        for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            world.addObjectPoly('Stone', [world.decenter(1, 1, i), world.decenter(1, -1, i), world.decenter(-1, -1, i), world.decenter(-1, 1, i)]);
            world.addObjectPoly('Stone', [world.decenter(1, i, 1), world.decenter(1, i, -1), world.decenter(-1, i, -1), world.decenter(-1, i, 1)]);
            world.addObjectPoly('Stone', [world.decenter(i, 1, 1), world.decenter(i, 1, -1), world.decenter(i, -1, -1), world.decenter(i, -1, 1)]);
        }
        ref1 = [-4, -2, 2, 4];
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
            i = ref1[k];
            world.addObjectAtPos('Stone', world.decenter(i, 0, 0));
            world.addObjectAtPos('Stone', world.decenter(0, i, 0));
            results.push(world.addObjectAtPos('Stone', world.decenter(0, 0, i)));
        }
        return results;
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdHVyZWQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUVJO0lBQUEsSUFBQSxFQUFZLFVBQVo7SUFDQSxNQUFBLEVBQVksWUFEWjtJQUVBLE1BQUEsRUFBWSxTQUZaO0lBR0EsSUFBQSxFQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBSFo7SUFJQSxJQUFBLEVBQVksdUNBSlo7SUFRQSxNQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWdCLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQWhCO1FBQ0EsV0FBQSxFQUFnQixXQURoQjtLQVRKO0lBV0EsS0FBQSxFQUFZO1FBQ1I7WUFBQSxJQUFBLEVBQWMsTUFBZDtZQUNBLE1BQUEsRUFBYyxDQURkO1lBRUEsUUFBQSxFQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBRmQ7U0FEUTtLQVhaO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO0FBQ0osWUFBQTtRQUFBLENBQUEsR0FBSSxLQUFLLENBQUM7QUFFVjtBQUFBLGFBQUEscUNBQUE7O1lBQ0ksS0FBSyxDQUFDLGFBQU4sQ0FBb0IsT0FBcEIsRUFBNkIsQ0FBQyxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBQyxDQUFuQixFQUFzQixDQUF0QixDQUExQixFQUFvRCxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBbUIsQ0FBQyxDQUFwQixFQUF1QixDQUF2QixDQUFwRCxFQUErRSxLQUFLLENBQUMsUUFBTixDQUFlLENBQUMsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBL0UsQ0FBN0I7WUFDQSxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixFQUE2QixDQUFDLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUFELEVBQTBCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFDLENBQXRCLENBQTFCLEVBQW9ELEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUFDLENBQXZCLENBQXBELEVBQStFLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBQyxDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUEvRSxDQUE3QjtZQUNBLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLEVBQTZCLENBQUMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQUMsQ0FBdEIsQ0FBMUIsRUFBb0QsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFmLEVBQWtCLENBQUMsQ0FBbkIsRUFBc0IsQ0FBQyxDQUF2QixDQUFwRCxFQUErRSxLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBQyxDQUFuQixFQUFzQixDQUF0QixDQUEvRSxDQUE3QjtBQUhKO0FBS0E7QUFBQTthQUFBLHdDQUFBOztZQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUE5QjtZQUNBLEtBQUssQ0FBQyxjQUFOLENBQXFCLE9BQXJCLEVBQThCLEtBQUssQ0FBQyxRQUFOLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUE5Qjt5QkFDQSxLQUFLLENBQUMsY0FBTixDQUFxQixPQUFyQixFQUE4QixLQUFLLENBQUMsUUFBTixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBOUI7QUFISjs7SUFSSSxDQWhCUiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgICAgICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgMDAwICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgMDAwICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgICBuYW1lOiAgICAgICBcImNhcHR1cmVkXCJcbiAgICBkZXNpZ246ICAgICAnTmlrbyBCb2VobSdcbiAgICBzY2hlbWU6ICAgICBcImRlZmF1bHRcIlxuICAgIHNpemU6ICAgICAgIFs5LDksOV1cbiAgICBoZWxwOiAgICAgICBcIlwiXCJcbiAgICAgICAgICAgICAgICB0byBnZXQgdG8gdGhlIGV4aXQsXG4gICAgICAgICAgICAgICAgbW92ZSB0aGUgc3RvbmVzLlxuICAgICAgICAgICAgICAgIFwiXCJcIlxuICAgIHBsYXllcjogICAgIFxuICAgICAgICBjb29yZGluYXRlczogICAgWzIsMywyXVxuICAgICAgICBvcmllbnRhdGlvbjogICAgbWludXNaZG93blhcbiAgICBleGl0czogICAgICBbXG4gICAgICAgIG5hbWU6ICAgICAgICAgXCJleGl0XCJcbiAgICAgICAgYWN0aXZlOiAgICAgICAxXG4gICAgICAgIHBvc2l0aW9uOiAgICAgWzAsMCwwXVxuICAgIF1cbiAgICBjcmVhdGU6IC0+XG4gICAgICAgIHMgPSB3b3JsZC5zaXplXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbLTIsIDJdXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RQb2x5ICdTdG9uZScsIFt3b3JsZC5kZWNlbnRlcigxLCAxLCBpKSwgd29ybGQuZGVjZW50ZXIoMSwgLTEsIGkpLCB3b3JsZC5kZWNlbnRlcigtMSwgLTEsIGkpLCB3b3JsZC5kZWNlbnRlcigtMSwgMSwgaSldXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RQb2x5ICdTdG9uZScsIFt3b3JsZC5kZWNlbnRlcigxLCBpLCAxKSwgd29ybGQuZGVjZW50ZXIoMSwgaSwgLTEpLCB3b3JsZC5kZWNlbnRlcigtMSwgaSwgLTEpLCB3b3JsZC5kZWNlbnRlcigtMSwgaSwgMSldXG4gICAgICAgICAgICB3b3JsZC5hZGRPYmplY3RQb2x5ICdTdG9uZScsIFt3b3JsZC5kZWNlbnRlcihpLCAxLCAxKSwgd29ybGQuZGVjZW50ZXIoaSwgMSwgLTEpLCB3b3JsZC5kZWNlbnRlcihpLCAtMSwgLTEpLCB3b3JsZC5kZWNlbnRlcihpLCAtMSwgMSldXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbLTQsIC0yLCAyLCA0XVxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgaSwgMCwgMFxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMCwgaSwgMFxuICAgICAgICAgICAgd29ybGQuYWRkT2JqZWN0QXRQb3MgJ1N0b25lJywgd29ybGQuZGVjZW50ZXIgMCwgMCwgaVxuIl19
//# sourceURL=../../coffee/levels/captured.coffee