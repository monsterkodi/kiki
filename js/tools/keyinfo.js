// koffee 1.4.0
var Keyinfo, keycode,
    indexOf = [].indexOf;

keycode = require('keycode');

Keyinfo = (function() {
    function Keyinfo() {}

    Keyinfo.modifierNames = ['shift', 'ctrl', 'alt', 'command'];

    Keyinfo.modifierChars = ['⇧', '^', '⌥', '⌘'];

    Keyinfo.isModifier = function(keyname) {
        return indexOf.call(this.modifierNames, keyname) >= 0;
    };

    Keyinfo.modifiersForEvent = function(event) {
        var mods;
        mods = [];
        if (event.metaKey) {
            mods.push('command');
        }
        if (event.altKey) {
            mods.push('alt');
        }
        if (event.ctrlKey) {
            mods.push('ctrl');
        }
        if (event.shiftKey) {
            mods.push('shift');
        }
        return mods.join('+');
    };

    Keyinfo.join = function() {
        var args;
        args = [].slice.call(arguments, 0);
        args = args.filter(function(e) {
            return e.length;
        });
        return args.join('+');
    };

    Keyinfo.comboForEvent = function(event) {
        var key;
        key = keycode(event);
        if (indexOf.call(Keyinfo.modifierNames, key) < 0) {
            return Keyinfo.join(Keyinfo.modifiersForEvent(event), key);
        }
        return "";
    };

    Keyinfo.keynameForEvent = function(event) {
        var name;
        name = keycode(event);
        if (name === "left command" || name === "right command" || name === "ctrl" || name === "alt" || name === "shift") {
            return "";
        }
        return name;
    };

    Keyinfo.forEvent = function(event) {
        return {
            mod: Keyinfo.modifiersForEvent(event),
            key: Keyinfo.keynameForEvent(event),
            combo: Keyinfo.comboForEvent(event)
        };
    };

    Keyinfo.short = function(combo) {
        var i, j, modifierName, ref;
        for (i = j = 0, ref = this.modifierNames.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            modifierName = this.modifierNames[i] + '+';
            combo = combo.replace(modifierName, this.modifierChars[i]);
        }
        return combo.toUpperCase();
    };

    return Keyinfo;

})();

module.exports = Keyinfo;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5aW5mby5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUEsZ0JBQUE7SUFBQTs7QUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBRUo7OztJQUVGLE9BQUMsQ0FBQSxhQUFELEdBQWlCLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUIsU0FBekI7O0lBQ2pCLE9BQUMsQ0FBQSxhQUFELEdBQWlCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCOztJQUVqQixPQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsT0FBRDtlQUFhLGFBQVcsSUFBQyxDQUFBLGFBQVosRUFBQSxPQUFBO0lBQWI7O0lBRWIsT0FBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsS0FBRDtBQUNoQixZQUFBO1FBQUEsSUFBQSxHQUFPO1FBQ1AsSUFBdUIsS0FBSyxDQUFDLE9BQTdCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQUE7O1FBQ0EsSUFBdUIsS0FBSyxDQUFDLE1BQTdCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLEVBQUE7O1FBQ0EsSUFBdUIsS0FBSyxDQUFDLE9BQTdCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQUE7O1FBQ0EsSUFBdUIsS0FBSyxDQUFDLFFBQTdCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQUE7O0FBQ0EsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVY7SUFOUzs7SUFRcEIsT0FBQyxDQUFBLElBQUQsR0FBTyxTQUFBO0FBQ0gsWUFBQTtRQUFBLElBQUEsR0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQVQsQ0FBYyxTQUFkLEVBQXlCLENBQXpCO1FBQ1AsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQztRQUFULENBQVo7ZUFDUCxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVY7SUFIRzs7SUFLUCxPQUFDLENBQUEsYUFBRCxHQUFnQixTQUFDLEtBQUQ7QUFDWixZQUFBO1FBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSO1FBQ04sSUFBRyxhQUFXLE9BQUMsQ0FBQSxhQUFaLEVBQUEsR0FBQSxLQUFIO0FBQ0ksbUJBQU8sT0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkIsQ0FBTixFQUFpQyxHQUFqQyxFQURYOztBQUVBLGVBQU87SUFKSzs7SUFNaEIsT0FBQyxDQUFBLGVBQUQsR0FBa0IsU0FBQyxLQUFEO0FBQ2QsWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsS0FBUjtRQUNQLElBQWEsSUFBQSxLQUFTLGNBQVQsSUFBQSxJQUFBLEtBQXlCLGVBQXpCLElBQUEsSUFBQSxLQUEwQyxNQUExQyxJQUFBLElBQUEsS0FBa0QsS0FBbEQsSUFBQSxJQUFBLEtBQXlELE9BQXRFO0FBQUEsbUJBQU8sR0FBUDs7ZUFDQTtJQUhjOztJQUtsQixPQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsS0FBRDtlQUNQO1lBQUEsR0FBQSxFQUFPLE9BQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQixDQUFQO1lBQ0EsR0FBQSxFQUFPLE9BQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCLENBRFA7WUFFQSxLQUFBLEVBQU8sT0FBQyxDQUFBLGFBQUQsQ0FBZSxLQUFmLENBRlA7O0lBRE87O0lBS1gsT0FBQyxDQUFBLEtBQUQsR0FBUSxTQUFDLEtBQUQ7QUFDSixZQUFBO0FBQUEsYUFBUyxrR0FBVDtZQUNJLFlBQUEsR0FBZSxJQUFDLENBQUEsYUFBYyxDQUFBLENBQUEsQ0FBZixHQUFrQjtZQUNqQyxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxZQUFkLEVBQTRCLElBQUMsQ0FBQSxhQUFjLENBQUEsQ0FBQSxDQUEzQztBQUZaO2VBR0EsS0FBSyxDQUFDLFdBQU4sQ0FBQTtJQUpJOzs7Ozs7QUFNWixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgICAgICAgMDAwIDAwMCAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgMDAwMDAgICAgMDAwIDAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiMgMDAwICAwMDAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwXG5cbmtleWNvZGUgPSByZXF1aXJlICdrZXljb2RlJ1xuXG5jbGFzcyBLZXlpbmZvXG4gICAgXG4gICAgQG1vZGlmaWVyTmFtZXMgPSBbJ3NoaWZ0JywgJ2N0cmwnLCAnYWx0JywgJ2NvbW1hbmQnXVxuICAgIEBtb2RpZmllckNoYXJzID0gWyfih6cnLCAnXicsICfijKUnLCAn4oyYJ11cbiAgICBcbiAgICBAaXNNb2RpZmllcjogKGtleW5hbWUpIC0+IGtleW5hbWUgaW4gQG1vZGlmaWVyTmFtZXNcblxuICAgIEBtb2RpZmllcnNGb3JFdmVudDogKGV2ZW50KSA9PiBcbiAgICAgICAgbW9kcyA9IFtdXG4gICAgICAgIG1vZHMucHVzaCAnY29tbWFuZCcgaWYgZXZlbnQubWV0YUtleVxuICAgICAgICBtb2RzLnB1c2ggJ2FsdCcgICAgIGlmIGV2ZW50LmFsdEtleVxuICAgICAgICBtb2RzLnB1c2ggJ2N0cmwnICAgIGlmIGV2ZW50LmN0cmxLZXkgXG4gICAgICAgIG1vZHMucHVzaCAnc2hpZnQnICAgaWYgZXZlbnQuc2hpZnRLZXlcbiAgICAgICAgcmV0dXJuIG1vZHMuam9pbiAnKydcbiAgICAgICAgXG4gICAgQGpvaW46ICgpIC0+IFxuICAgICAgICBhcmdzID0gW10uc2xpY2UuY2FsbCBhcmd1bWVudHMsIDBcbiAgICAgICAgYXJncyA9IGFyZ3MuZmlsdGVyIChlKSAtPiBlLmxlbmd0aFxuICAgICAgICBhcmdzLmpvaW4gJysnXG4gICAgICAgICAgICBcbiAgICBAY29tYm9Gb3JFdmVudDogKGV2ZW50KSA9PlxuICAgICAgICBrZXkgPSBrZXljb2RlIGV2ZW50XG4gICAgICAgIGlmIGtleSBub3QgaW4gQG1vZGlmaWVyTmFtZXNcbiAgICAgICAgICAgIHJldHVybiBAam9pbiBAbW9kaWZpZXJzRm9yRXZlbnQoZXZlbnQpLCBrZXlcbiAgICAgICAgcmV0dXJuIFwiXCJcblxuICAgIEBrZXluYW1lRm9yRXZlbnQ6IChldmVudCkgPT4gXG4gICAgICAgIG5hbWUgPSBrZXljb2RlIGV2ZW50XG4gICAgICAgIHJldHVybiBcIlwiIGlmIG5hbWUgaW4gW1wibGVmdCBjb21tYW5kXCIsIFwicmlnaHQgY29tbWFuZFwiLCBcImN0cmxcIiwgXCJhbHRcIiwgXCJzaGlmdFwiXVxuICAgICAgICBuYW1lXG5cbiAgICBAZm9yRXZlbnQ6IChldmVudCkgPT5cbiAgICAgICAgbW9kOiAgIEBtb2RpZmllcnNGb3JFdmVudCBldmVudFxuICAgICAgICBrZXk6ICAgQGtleW5hbWVGb3JFdmVudCBldmVudFxuICAgICAgICBjb21ibzogQGNvbWJvRm9yRXZlbnQgZXZlbnRcbiAgICAgICAgXG4gICAgQHNob3J0OiAoY29tYm8pIC0+XG4gICAgICAgIGZvciBpIGluIFswLi4uQG1vZGlmaWVyTmFtZXMubGVuZ3RoXVxuICAgICAgICAgICAgbW9kaWZpZXJOYW1lID0gQG1vZGlmaWVyTmFtZXNbaV0rJysnXG4gICAgICAgICAgICBjb21ibyA9IGNvbWJvLnJlcGxhY2UgbW9kaWZpZXJOYW1lLCBAbW9kaWZpZXJDaGFyc1tpXVxuICAgICAgICBjb21iby50b1VwcGVyQ2FzZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gS2V5aW5mb1xuIl19
//# sourceURL=../../coffee/tools/keyinfo.coffee