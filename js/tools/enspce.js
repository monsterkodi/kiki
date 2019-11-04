// koffee 1.4.0
module.exports = function(s) {
    var i, j, ref, tag;
    if (s == null) {
        return "";
    }
    tag = false;
    for (i = j = ref = s.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        switch (s[i]) {
            case '>':
                tag = true;
                break;
            case '<':
                tag = false;
                break;
            case ' ':
                if (!tag) {
                    s = s.splice(i, 1, "&nbsp;");
                }
        }
    }
    return s;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zcGNlLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxDQUFEO0FBQ2IsUUFBQTtJQUFBLElBQWlCLFNBQWpCO0FBQUEsZUFBTyxHQUFQOztJQUNBLEdBQUEsR0FBTTtBQUNOLFNBQVMsZ0ZBQVQ7QUFDSSxnQkFBTyxDQUFFLENBQUEsQ0FBQSxDQUFUO0FBQUEsaUJBQ1MsR0FEVDtnQkFDa0IsR0FBQSxHQUFNO0FBQWY7QUFEVCxpQkFFUyxHQUZUO2dCQUVrQixHQUFBLEdBQU07QUFBZjtBQUZULGlCQUdTLEdBSFQ7Z0JBR2tCLElBQStCLENBQUksR0FBbkM7b0JBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxRQUFmLEVBQUo7O0FBSGxCO0FBREo7V0FLQTtBQVJhIiwic291cmNlc0NvbnRlbnQiOlsiIyAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMCAgMDAwMDAwMDBcbiMgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwIFxuIyAwMDAgICAgICAgMDAwICAwMDAwICAgICAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgMDAwICAgICBcbiMgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgICAgICAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cbm1vZHVsZS5leHBvcnRzID0gKHMpIC0+XG4gICAgcmV0dXJuIFwiXCIgaWYgbm90IHM/XG4gICAgdGFnID0gZmFsc2VcbiAgICBmb3IgaSBpbiBbcy5sZW5ndGgtMS4uMF1cbiAgICAgICAgc3dpdGNoIHNbaV1cbiAgICAgICAgICAgIHdoZW4gJz4nIHRoZW4gdGFnID0gdHJ1ZVxuICAgICAgICAgICAgd2hlbiAnPCcgdGhlbiB0YWcgPSBmYWxzZVxuICAgICAgICAgICAgd2hlbiAnICcgdGhlbiBzID0gcy5zcGxpY2UgaSwgMSwgXCImbmJzcDtcIiBpZiBub3QgdGFnXG4gICAgcyJdfQ==
//# sourceURL=../../coffee/tools/enspce.coffee