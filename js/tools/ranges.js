// koffee 1.4.0
module.exports = {
    sort: function(rgs) {
        return rgs.sort(function(a, b) {
            if (a[0] !== b[0]) {
                return a[0] - b[0];
            } else {
                if (a[1][0] !== b[1][0]) {
                    return a[1][0] - b[1][0];
                } else {
                    return a[1][1] - b[1][1];
                }
            }
        });
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2VzLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FRSTtJQUFBLElBQUEsRUFBTSxTQUFDLEdBQUQ7ZUFDRixHQUFHLENBQUMsSUFBSixDQUFTLFNBQUMsQ0FBRCxFQUFHLENBQUg7WUFDTCxJQUFHLENBQUUsQ0FBQSxDQUFBLENBQUYsS0FBTSxDQUFFLENBQUEsQ0FBQSxDQUFYO3VCQUNJLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBSyxDQUFFLENBQUEsQ0FBQSxFQURYO2FBQUEsTUFBQTtnQkFHSSxJQUFHLENBQUUsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQUwsS0FBUyxDQUFFLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFqQjsyQkFDSSxDQUFFLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFMLEdBQVEsQ0FBRSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsRUFEakI7aUJBQUEsTUFBQTsyQkFHSSxDQUFFLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFMLEdBQVEsQ0FBRSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsRUFIakI7aUJBSEo7O1FBREssQ0FBVDtJQURFLENBQU4iLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwMDAwMCAgIDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IFxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwICAgICAgIDAwMCAgIFxuICAgICMgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgICAgICAgICAgICAgXG4gICAgc29ydDogKHJncykgLT5cbiAgICAgICAgcmdzLnNvcnQgKGEsYikgLT4gXG4gICAgICAgICAgICBpZiBhWzBdIT1iWzBdXG4gICAgICAgICAgICAgICAgYVswXS1iWzBdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgYVsxXVswXSE9YlsxXVswXVxuICAgICAgICAgICAgICAgICAgICBhWzFdWzBdLWJbMV1bMF1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFbMV1bMV0tYlsxXVsxXVxuIl19
//# sourceURL=../../coffee/tools/ranges.coffee