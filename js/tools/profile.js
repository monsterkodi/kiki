// koffee 1.4.0
var log, now, profile, s_msg, start;

now = require('performance-now');

log = require('./log');

start = void 0;

s_msg = void 0;

profile = function(msg) {
    var ms;
    if ((start != null) && s_msg.length) {
        ms = (now() - start).toFixed(0);
        if (ms > 1000) {
            console.log(s_msg + " in " + ((ms / 1000).toFixed(3)) + " sec");
        } else {
            console.log(s_msg + " in " + ms + " ms");
        }
    }
    start = now();
    return s_msg = msg;
};

module.exports = profile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU1BLElBQUE7O0FBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUjs7QUFDTixHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0FBRU4sS0FBQSxHQUFROztBQUNSLEtBQUEsR0FBUTs7QUFFUixPQUFBLEdBQVUsU0FBQyxHQUFEO0FBRU4sUUFBQTtJQUFBLElBQUcsZUFBQSxJQUFXLEtBQUssQ0FBQyxNQUFwQjtRQUNJLEVBQUEsR0FBSyxDQUFDLEdBQUEsQ0FBQSxDQUFBLEdBQU0sS0FBUCxDQUFhLENBQUMsT0FBZCxDQUFzQixDQUF0QjtRQUNMLElBQUcsRUFBQSxHQUFLLElBQVI7WUFDRyxPQUFBLENBQUMsR0FBRCxDQUFRLEtBQUQsR0FBTyxNQUFQLEdBQVksQ0FBQyxDQUFDLEVBQUEsR0FBRyxJQUFKLENBQVMsQ0FBQyxPQUFWLENBQWtCLENBQWxCLENBQUQsQ0FBWixHQUFrQyxNQUF6QyxFQURIO1NBQUEsTUFBQTtZQUdHLE9BQUEsQ0FBQyxHQUFELENBQVEsS0FBRCxHQUFPLE1BQVAsR0FBYSxFQUFiLEdBQWdCLEtBQXZCLEVBSEg7U0FGSjs7SUFPQSxLQUFBLEdBQVEsR0FBQSxDQUFBO1dBQ1IsS0FBQSxHQUFRO0FBVkY7O0FBWVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAgIDAwMCAgICAgIDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAwICAgMDAwMDAwMCAgICAwMDAgICAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgICAgIDAwMDAwMDAgXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgIDAwMCAgICAgXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cbm5vdyA9IHJlcXVpcmUgJ3BlcmZvcm1hbmNlLW5vdydcbmxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuXG5zdGFydCA9IHVuZGVmaW5lZFxuc19tc2cgPSB1bmRlZmluZWRcblxucHJvZmlsZSA9IChtc2cpIC0+XG5cbiAgICBpZiBzdGFydD8gYW5kIHNfbXNnLmxlbmd0aFxuICAgICAgICBtcyA9IChub3coKS1zdGFydCkudG9GaXhlZCAwXG4gICAgICAgIGlmIG1zID4gMTAwMFxuICAgICAgICAgICAgbG9nIFwiI3tzX21zZ30gaW4gI3sobXMvMTAwMCkudG9GaXhlZCgzKX0gc2VjXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9nIFwiI3tzX21zZ30gaW4gI3ttc30gbXNcIlxuXG4gICAgc3RhcnQgPSBub3coKVxuICAgIHNfbXNnID0gbXNnXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvZmlsZVxuIl19
//# sourceURL=../../coffee/tools/profile.coffee