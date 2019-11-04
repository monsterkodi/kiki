// koffee 1.4.0
var log, logScroll, str;

str = require('./str');

log = function() {
    var s;
    return console.log(((function() {
        var i, len, ref, results;
        ref = [].slice.call(arguments, 0);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            results.push(str(s));
        }
        return results;
    }).apply(this, arguments)).join(" "));
};

logScroll = function() {
    var ref, s;
    s = ((function() {
        var i, len, ref, results;
        ref = [].slice.call(arguments, 0);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            results.push(str(s));
        }
        return results;
    }).apply(this, arguments)).join(" ");
    console.log(s);
    return (ref = window.logview) != null ? ref.appendText(s) : void 0;
};

if (typeof window !== "undefined" && window !== null) {
    module.exports = logScroll;
} else {
    module.exports = log;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0FBRU4sR0FBQSxHQUFNLFNBQUE7QUFDRixRQUFBO1dBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWTs7QUFBQztBQUFBO2FBQUEscUNBQUE7O3lCQUFBLEdBQUEsQ0FBSSxDQUFKO0FBQUE7OzZCQUFELENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsR0FBbEQsQ0FBWjtBQURFOztBQUdOLFNBQUEsR0FBWSxTQUFBO0FBQ1IsUUFBQTtJQUFBLENBQUEsR0FBSTs7QUFBQztBQUFBO2FBQUEscUNBQUE7O3lCQUFBLEdBQUEsQ0FBSSxDQUFKO0FBQUE7OzZCQUFELENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsR0FBbEQ7SUFDSixPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7K0NBQ2MsQ0FBRSxVQUFoQixDQUEyQixDQUEzQjtBQUhROztBQUtaLElBQUcsZ0RBQUg7SUFDSSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQURyQjtDQUFBLE1BQUE7SUFHSSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUhyQiIsInNvdXJjZXNDb250ZW50IjpbIiMwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwIFxuIzAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgXG4jMDAwICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDBcbiMwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIzAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAgXG5cbnN0ciA9IHJlcXVpcmUgJy4vc3RyJ1xuXG5sb2cgPSAtPiBcbiAgICBjb25zb2xlLmxvZyAoc3RyKHMpIGZvciBzIGluIFtdLnNsaWNlLmNhbGwgYXJndW1lbnRzLCAwKS5qb2luIFwiIFwiXG4gICAgXG5sb2dTY3JvbGwgPSAtPiBcbiAgICBzID0gKHN0cihzKSBmb3IgcyBpbiBbXS5zbGljZS5jYWxsIGFyZ3VtZW50cywgMCkuam9pbiBcIiBcIlxuICAgIGNvbnNvbGUubG9nIHNcbiAgICB3aW5kb3cubG9ndmlldz8uYXBwZW5kVGV4dCBzXG5cbmlmIHdpbmRvdz9cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGxvZ1Njcm9sbFxuZWxzZVxuICAgIG1vZHVsZS5leHBvcnRzID0gbG9nXG4gICAgIl19
//# sourceURL=../../coffee/tools/log.coffee