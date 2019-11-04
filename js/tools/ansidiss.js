// koffee 1.4.0
var AnsiDiss, STYLES, _, entities, j, log, results, toHexString,
    indexOf = [].indexOf;

log = require('./log');

entities = require('entities');

_ = require('lodash');

STYLES = {
    f0: 'color:#000',
    f1: 'color:#E00',
    f2: 'color:#0A0',
    f3: 'color:#A50',
    f4: 'color:#00E',
    f5: 'color:#A0A',
    f6: 'color:#0AA',
    f7: 'color:#AAA',
    f8: 'color:#555',
    f9: 'color:#F55',
    f10: 'color:#5F5',
    f11: 'color:#FF5',
    f12: 'color:#55F',
    f13: 'color:#F5F',
    f14: 'color:#5FF',
    f15: 'color:#FFF',
    b0: 'background-color:#000',
    b1: 'background-color:#A00',
    b2: 'background-color:#0A0',
    b3: 'background-color:#A50',
    b4: 'background-color:#00A',
    b5: 'background-color:#A0A',
    b6: 'background-color:#0AA',
    b7: 'background-color:#AAA',
    b8: 'background-color:#555',
    b9: 'background-color:#F55',
    b10: 'background-color:#5F5',
    b11: 'background-color:#FF5',
    b12: 'background-color:#55F',
    b13: 'background-color:#F5F',
    b14: 'background-color:#5FF',
    b15: 'background-color:#FFF'
};

toHexString = function(num) {
    num = num.toString(16);
    while (num.length < 2) {
        num = "0" + num;
    }
    return num;
};

[0, 1, 2, 3, 4, 5].forEach(function(red) {
    return [0, 1, 2, 3, 4, 5].forEach(function(green) {
        return [0, 1, 2, 3, 4, 5].forEach(function(blue) {
            var b, c, g, n, r, rgb;
            c = 16 + (red * 36) + (green * 6) + blue;
            r = red > 0 ? red * 40 + 55 : 0;
            g = green > 0 ? green * 40 + 55 : 0;
            b = blue > 0 ? blue * 40 + 55 : 0;
            rgb = ((function() {
                var j, len, ref, results;
                ref = [r, g, b];
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                    n = ref[j];
                    results.push(toHexString(n));
                }
                return results;
            })()).join('');
            STYLES["f" + c] = "color:#" + rgb;
            return STYLES["b" + c] = "background-color:#" + rgb;
        });
    });
});

(function() {
    results = [];
    for (j = 0; j <= 23; j++){ results.push(j); }
    return results;
}).apply(this).forEach(function(gray) {
    var c, l;
    c = gray + 232;
    l = toHexString(gray * 10 + 8);
    STYLES["f" + c] = "color:#" + l + l + l;
    return STYLES["b" + c] = "background-color:#" + l + l + l;
});

AnsiDiss = (function() {
    function AnsiDiss() {}

    AnsiDiss.prototype.dissect = function(input) {
        this.input = input;
        this.diss = [];
        this.text = "";
        this.tokenize();
        return [this.text, this.diss];
    };

    AnsiDiss.prototype.tokenize = function() {
        var addStyle, addText, ansiCode, ansiHandler, ansiMatch, bg, delStyle, fg, handler, i, k, len, length, process, resetStyle, results1, st, start, toHighIntensity, tokens;
        start = 0;
        ansiHandler = 2;
        ansiMatch = false;
        fg = bg = '';
        st = [];
        resetStyle = function() {
            fg = '';
            bg = '';
            return st = [];
        };
        addStyle = function(style) {
            if (indexOf.call(st, style) < 0) {
                return st.push(style);
            }
        };
        delStyle = function(style) {
            return _.pull(st, style);
        };
        addText = (function(_this) {
            return function(t) {
                var match, style, txt;
                _this.text += t;
                txt = _this.text.slice(start);
                match = txt.trim();
                if (match.length) {
                    style = '';
                    if (fg.length) {
                        style += fg + ';';
                    }
                    if (bg.length) {
                        style += bg + ';';
                    }
                    if (st.length) {
                        style += st.join(';');
                    }
                    _this.diss.push({
                        match: match,
                        start: start + txt.search(/[^\s]/),
                        styl: style
                    });
                }
                start = _this.text.length;
                return '';
            };
        })(this);
        toHighIntensity = function(c) {
            var i, k;
            for (i = k = 0; k <= 7; i = ++k) {
                if (c === STYLES["f" + i]) {
                    return STYLES["f" + (8 + i)];
                }
            }
            return c;
        };
        ansiCode = (function(_this) {
            return function(m, c) {
                var code, cs, k, len;
                ansiMatch = true;
                if (c.trim().length === 0) {
                    c = '0';
                }
                cs = c.trimRight(';').split(';');
                for (k = 0, len = cs.length; k < len; k++) {
                    code = cs[k];
                    code = parseInt(code, 10);
                    switch (false) {
                        case code !== 0:
                            resetStyle();
                            break;
                        case code !== 1:
                            addStyle('font-weight:bold');
                            fg = toHighIntensity(fg);
                            break;
                        case code !== 2:
                            addStyle('opacity:0.5');
                            break;
                        case code !== 4:
                            addStyle('text-decoration:underline');
                            break;
                        case code !== 8:
                            addStyle('display:none');
                            break;
                        case code !== 9:
                            addStyle('text-decoration:line-through');
                            break;
                        case code !== 39:
                            fg = STYLES["f15"];
                            break;
                        case code !== 49:
                            bg = STYLES["b0"];
                            break;
                        case code !== 38:
                            fg = STYLES["f" + cs[2]];
                            break;
                        case code !== 48:
                            bg = STYLES["b" + cs[2]];
                            break;
                        case !((30 <= code && code <= 37)):
                            fg = STYLES["f" + (code - 30)];
                            break;
                        case !((40 <= code && code <= 47)):
                            bg = STYLES["b" + (code - 40)];
                            break;
                        case !((90 <= code && code <= 97)):
                            fg = STYLES["f" + (8 + code - 90)];
                            break;
                        case !((100 <= code && code <= 107)):
                            bg = STYLES["b" + (8 + code - 100)];
                            break;
                        case code !== 28:
                            delStyle('display:none');
                            break;
                        case code !== 22:
                            delStyle('font-weight:bold');
                            delStyle('opacity:0.5');
                    }
                    if (code === 38 || code === 48) {
                        break;
                    }
                }
                return '';
            };
        })(this);
        tokens = [
            {
                pattern: /^\x08+/,
                sub: ''
            }, {
                pattern: /^\x1b\[[012]?K/,
                sub: ''
            }, {
                pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
                sub: ansiCode
            }, {
                pattern: /^\x1b\[?[\d;]{0,3}/,
                sub: ''
            }, {
                pattern: /^([^\x1b\x08\n]+)/,
                sub: addText
            }
        ];
        process = (function(_this) {
            return function(handler, i) {
                if (i > ansiHandler && ansiMatch) {
                    return;
                }
                ansiMatch = false;
                return _this.input = _this.input.replace(handler.pattern, handler.sub);
            };
        })(this);
        results1 = [];
        while ((length = this.input.length) > 0) {
            for (i = k = 0, len = tokens.length; k < len; i = ++k) {
                handler = tokens[i];
                process(handler, i);
            }
            if (this.input.length === length) {
                break;
            } else {
                results1.push(void 0);
            }
        }
        return results1;
    };

    return AnsiDiss;

})();

module.exports = AnsiDiss;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zaWRpc3MuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxJQUFBLDJEQUFBO0lBQUE7O0FBQUEsR0FBQSxHQUFXLE9BQUEsQ0FBUSxPQUFSOztBQUNYLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjs7QUFDWCxDQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBRVgsTUFBQSxHQUNJO0lBQUEsRUFBQSxFQUFLLFlBQUw7SUFDQSxFQUFBLEVBQUssWUFETDtJQUVBLEVBQUEsRUFBSyxZQUZMO0lBR0EsRUFBQSxFQUFLLFlBSEw7SUFJQSxFQUFBLEVBQUssWUFKTDtJQUtBLEVBQUEsRUFBSyxZQUxMO0lBTUEsRUFBQSxFQUFLLFlBTkw7SUFPQSxFQUFBLEVBQUssWUFQTDtJQVFBLEVBQUEsRUFBSyxZQVJMO0lBU0EsRUFBQSxFQUFLLFlBVEw7SUFVQSxHQUFBLEVBQUssWUFWTDtJQVdBLEdBQUEsRUFBSyxZQVhMO0lBWUEsR0FBQSxFQUFLLFlBWkw7SUFhQSxHQUFBLEVBQUssWUFiTDtJQWNBLEdBQUEsRUFBSyxZQWRMO0lBZUEsR0FBQSxFQUFLLFlBZkw7SUFnQkEsRUFBQSxFQUFLLHVCQWhCTDtJQWlCQSxFQUFBLEVBQUssdUJBakJMO0lBa0JBLEVBQUEsRUFBSyx1QkFsQkw7SUFtQkEsRUFBQSxFQUFLLHVCQW5CTDtJQW9CQSxFQUFBLEVBQUssdUJBcEJMO0lBcUJBLEVBQUEsRUFBSyx1QkFyQkw7SUFzQkEsRUFBQSxFQUFLLHVCQXRCTDtJQXVCQSxFQUFBLEVBQUssdUJBdkJMO0lBd0JBLEVBQUEsRUFBSyx1QkF4Qkw7SUF5QkEsRUFBQSxFQUFLLHVCQXpCTDtJQTBCQSxHQUFBLEVBQUssdUJBMUJMO0lBMkJBLEdBQUEsRUFBSyx1QkEzQkw7SUE0QkEsR0FBQSxFQUFLLHVCQTVCTDtJQTZCQSxHQUFBLEVBQUssdUJBN0JMO0lBOEJBLEdBQUEsRUFBSyx1QkE5Qkw7SUErQkEsR0FBQSxFQUFL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QUEsS0FBQTttQkFBQSxTQUFDLE9BQUQsRUFBVSxDQUFWO2dCQUNOLElBQVUsQ0FBQSxHQUFJLFdBQUosSUFBb0IsU0FBOUI7QUFBQSwyQkFBQTs7Z0JBQ0EsU0FBQSxHQUFZO3VCQUNaLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsT0FBTyxDQUFDLE9BQXZCLEVBQWdDLE9BQU8sQ0FBQyxHQUF4QztZQUhIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQUtWO2VBQU0sQ0FBQyxNQUFBLEdBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFqQixDQUFBLEdBQTJCLENBQWpDO0FBQ0ksaUJBQUEsZ0RBQUE7O2dCQUFBLE9BQUEsQ0FBUSxPQUFSLEVBQWlCLENBQWpCO0FBQUE7WUFDQSxJQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxLQUFpQixNQUExQjtBQUFBLHNCQUFBO2FBQUEsTUFBQTtzQ0FBQTs7UUFGSixDQUFBOztJQWxGTTs7Ozs7O0FBc0ZkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyBiYXNlZCBvbiBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3JidXJucy9hbnNpLXRvLWh0bWxcblxubG9nICAgICAgPSByZXF1aXJlICcuL2xvZydcbmVudGl0aWVzID0gcmVxdWlyZSAnZW50aXRpZXMnXG5fICAgICAgICA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuU1RZTEVTID1cbiAgICBmMDogICdjb2xvcjojMDAwJyAjIG5vcm1hbCBpbnRlbnNpdHlcbiAgICBmMTogICdjb2xvcjojRTAwJ1xuICAgIGYyOiAgJ2NvbG9yOiMwQTAnXG4gICAgZjM6ICAnY29sb3I6I0E1MCdcbiAgICBmNDogICdjb2xvcjojMDBFJ1xuICAgIGY1OiAgJ2NvbG9yOiNBMEEnXG4gICAgZjY6ICAnY29sb3I6IzBBQSdcbiAgICBmNzogICdjb2xvcjojQUFBJ1xuICAgIGY4OiAgJ2NvbG9yOiM1NTUnICMgaGlnaCBpbnRlbnNpdHlcbiAgICBmOTogICdjb2xvcjojRjU1J1xuICAgIGYxMDogJ2NvbG9yOiM1RjUnXG4gICAgZjExOiAnY29sb3I6I0ZGNSdcbiAgICBmMTI6ICdjb2xvcjojNTVGJ1xuICAgIGYxMzogJ2NvbG9yOiNGNUYnXG4gICAgZjE0OiAnY29sb3I6IzVGRidcbiAgICBmMTU6ICdjb2xvcjojRkZGJ1xuICAgIGIwOiAgJ2JhY2tncm91bmQtY29sb3I6IzAwMCcgIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgYjE6ICAnYmFja2dyb3VuZC1jb2xvcjojQTAwJ1xuICAgIGIyOiAgJ2JhY2tncm91bmQtY29sb3I6IzBBMCdcbiAgICBiMzogICdiYWNrZ3JvdW5kLWNvbG9yOiNBNTAnXG4gICAgYjQ6ICAnYmFja2dyb3VuZC1jb2xvcjojMDBBJ1xuICAgIGI1OiAgJ2JhY2tncm91bmQtY29sb3I6I0EwQSdcbiAgICBiNjogICdiYWNrZ3JvdW5kLWNvbG9yOiMwQUEnXG4gICAgYjc6ICAnYmFja2dyb3VuZC1jb2xvcjojQUFBJ1xuICAgIGI4OiAgJ2JhY2tncm91bmQtY29sb3I6IzU1NScgIyBoaWdoIGludGVuc2l0eVxuICAgIGI5OiAgJ2JhY2tncm91bmQtY29sb3I6I0Y1NSdcbiAgICBiMTA6ICdiYWNrZ3JvdW5kLWNvbG9yOiM1RjUnXG4gICAgYjExOiAnYmFja2dyb3VuZC1jb2xvcjojRkY1J1xuICAgIGIxMjogJ2JhY2tncm91bmQtY29sb3I6IzU1RidcbiAgICBiMTM6ICdiYWNrZ3JvdW5kLWNvbG9yOiNGNUYnXG4gICAgYjE0OiAnYmFja2dyb3VuZC1jb2xvcjojNUZGJ1xuICAgIGIxNTogJ2JhY2tncm91bmQtY29sb3I6I0ZGRidcblxudG9IZXhTdHJpbmcgPSAobnVtKSAtPlxuICAgIG51bSA9IG51bS50b1N0cmluZygxNilcbiAgICB3aGlsZSBudW0ubGVuZ3RoIDwgMiB0aGVuIG51bSA9IFwiMCN7bnVtfVwiXG4gICAgbnVtXG5cblswLi41XS5mb3JFYWNoIChyZWQpIC0+XG4gICAgWzAuLjVdLmZvckVhY2ggKGdyZWVuKSAtPlxuICAgICAgICBbMC4uNV0uZm9yRWFjaCAoYmx1ZSkgLT5cbiAgICAgICAgICAgIGMgPSAxNiArIChyZWQgKiAzNikgKyAoZ3JlZW4gKiA2KSArIGJsdWVcbiAgICAgICAgICAgIHIgPSBpZiByZWQgICA+IDAgdGhlbiByZWQgICAqIDQwICsgNTUgZWxzZSAwXG4gICAgICAgICAgICBnID0gaWYgZ3JlZW4gPiAwIHRoZW4gZ3JlZW4gKiA0MCArIDU1IGVsc2UgMFxuICAgICAgICAgICAgYiA9IGlmIGJsdWUgID4gMCB0aGVuIGJsdWUgICogNDAgKyA1NSBlbHNlIDAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJnYiA9ICh0b0hleFN0cmluZyhuKSBmb3IgbiBpbiBbciwgZywgYl0pLmpvaW4oJycpXG4gICAgICAgICAgICBTVFlMRVNbXCJmI3tjfVwiXSA9IFwiY29sb3I6IyN7cmdifVwiXG4gICAgICAgICAgICBTVFlMRVNbXCJiI3tjfVwiXSA9IFwiYmFja2dyb3VuZC1jb2xvcjojI3tyZ2J9XCJcblxuWzAuLjIzXS5mb3JFYWNoIChncmF5KSAtPlxuICAgIGMgPSBncmF5KzIzMlxuICAgIGwgPSB0b0hleFN0cmluZyhncmF5KjEwICsgOClcbiAgICBTVFlMRVNbXCJmI3tjfVwiXSA9IFwiY29sb3I6IyN7bH0je2x9I3tsfVwiXG4gICAgU1RZTEVTW1wiYiN7Y31cIl0gPSBcImJhY2tncm91bmQtY29sb3I6IyN7bH0je2x9I3tsfVwiXG5cbiMgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgICBcbiMgMDAwMDAwMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCBcblxuY2xhc3MgQW5zaURpc3NcbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cblxuICAgIGRpc3NlY3Q6IChAaW5wdXQpIC0+XG4gICAgICAgIEBkaXNzICA9IFtdXG4gICAgICAgIEB0ZXh0ICA9IFwiXCJcbiAgICAgICAgQHRva2VuaXplKClcbiAgICAgICAgW0B0ZXh0LCBAZGlzc11cblxuICAgIHRva2VuaXplOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgc3RhcnQgICAgICAgPSAwXG4gICAgICAgIGFuc2lIYW5kbGVyID0gMlxuICAgICAgICBhbnNpTWF0Y2ggICA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICBmZyA9IGJnID0gJydcbiAgICAgICAgc3QgPSBbXVxuXG4gICAgICAgIHJlc2V0U3R5bGUgPSAoKSAtPlxuICAgICAgICAgICAgZmcgPSAnJ1xuICAgICAgICAgICAgYmcgPSAnJ1xuICAgICAgICAgICAgc3QgPSBbXVxuICAgICAgICAgICAgXG4gICAgICAgIGFkZFN0eWxlID0gKHN0eWxlKSAtPiBzdC5wdXNoIHN0eWxlIGlmIHN0eWxlIG5vdCBpbiBzdFxuICAgICAgICBkZWxTdHlsZSA9IChzdHlsZSkgLT4gXy5wdWxsIHN0LCBzdHlsZVxuICAgICAgICBcbiAgICAgICAgYWRkVGV4dCA9ICh0KSA9PlxuICAgICAgICAgICAgQHRleHQgKz0gdFxuICAgICAgICAgICAgdHh0ID0gQHRleHQuc2xpY2Ugc3RhcnRcbiAgICAgICAgICAgIG1hdGNoID0gdHh0LnRyaW0oKVxuICAgICAgICAgICAgaWYgbWF0Y2gubGVuZ3RoXG4gICAgICAgICAgICAgICAgc3R5bGUgPSAnJ1xuICAgICAgICAgICAgICAgIHN0eWxlICs9IGZnICsgJzsnICAgIGlmIGZnLmxlbmd0aFxuICAgICAgICAgICAgICAgIHN0eWxlICs9IGJnICsgJzsnICAgIGlmIGJnLmxlbmd0aFxuICAgICAgICAgICAgICAgIHN0eWxlICs9IHN0LmpvaW4gJzsnIGlmIHN0Lmxlbmd0aFxuICAgICAgICAgICAgICAgIEBkaXNzLnB1c2hcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCArIHR4dC5zZWFyY2ggL1teXFxzXS9cbiAgICAgICAgICAgICAgICAgICAgc3R5bDogIHN0eWxlXG4gICAgICAgICAgICBzdGFydCA9IEB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgJydcbiAgICAgICAgXG4gICAgICAgIHRvSGlnaEludGVuc2l0eSA9IChjKSAtPlxuICAgICAgICAgICAgZm9yIGkgaW4gWzAuLjddXG4gICAgICAgICAgICAgICAgaWYgYyA9PSBTVFlMRVNbXCJmI3tpfVwiXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RZTEVTW1wiZiN7OCtpfVwiXVxuICAgICAgICAgICAgY1xuICAgICAgICBcbiAgICAgICAgYW5zaUNvZGUgPSAobSwgYykgPT5cbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IHRydWVcbiAgICAgICAgICAgIGMgPSAnMCcgaWYgYy50cmltKCkubGVuZ3RoIGlzIDAgICAgICAgICAgICBcbiAgICAgICAgICAgIGNzID0gYy50cmltUmlnaHQoJzsnKS5zcGxpdCgnOycpICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgY29kZSBpbiBjc1xuICAgICAgICAgICAgICAgIGNvZGUgPSBwYXJzZUludCBjb2RlLCAxMFxuICAgICAgICAgICAgICAgIHN3aXRjaCBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDAgICAgICAgICAgdGhlbiByZXNldFN0eWxlKClcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDEgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTdHlsZSAnZm9udC13ZWlnaHQ6Ym9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGZnID0gdG9IaWdoSW50ZW5zaXR5IGZnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAyICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgNCAgICAgICAgICB0aGVuIGFkZFN0eWxlICd0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgOCAgICAgICAgICB0aGVuIGFkZFN0eWxlICdkaXNwbGF5Om5vbmUnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA5ICAgICAgICAgIHRoZW4gYWRkU3R5bGUgJ3RleHQtZGVjb3JhdGlvbjpsaW5lLXRocm91Z2gnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyAzOSAgICAgICAgIHRoZW4gZmcgPSBTVFlMRVNbXCJmMTVcIl0gIyBkZWZhdWx0IGZvcmVncm91bmRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDQ5ICAgICAgICAgdGhlbiBiZyA9IFNUWUxFU1tcImIwXCJdICAjIGRlZmF1bHQgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMzggICAgICAgICB0aGVuIGZnID0gU1RZTEVTW1wiZiN7Y3NbMl19XCJdICMgZXh0ZW5kZWQgZmcgMzg7NTtbMC0yNTVdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gY29kZSBpcyA0OCAgICAgICAgIHRoZW4gYmcgPSBTVFlMRVNbXCJiI3tjc1syXX1cIl0gIyBleHRlbmRlZCBiZyA0ODs1O1swLTI1NV1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAgMzAgPD0gY29kZSA8PSAzNyAgdGhlbiBmZyA9IFNUWUxFU1tcImYje2NvZGUgLSAzMH1cIl0gIyBub3JtYWwgaW50ZW5zaXR5XG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDQwIDw9IGNvZGUgPD0gNDcgIHRoZW4gYmcgPSBTVFlMRVNbXCJiI3tjb2RlIC0gNDB9XCJdXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gIDkwIDw9IGNvZGUgPD0gOTcgIHRoZW4gZmcgPSBTVFlMRVNbXCJmI3s4K2NvZGUgLSA5MH1cIl0gICMgaGlnaCBpbnRlbnNpdHlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxMDAgPD0gY29kZSA8PSAxMDcgdGhlbiBiZyA9IFNUWUxFU1tcImIjezgrY29kZSAtIDEwMH1cIl1cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBjb2RlIGlzIDI4ICAgICAgICAgdGhlbiBkZWxTdHlsZSAnZGlzcGxheTpub25lJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuIGNvZGUgaXMgMjIgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbFN0eWxlICdmb250LXdlaWdodDpib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsU3R5bGUgJ29wYWNpdHk6MC41J1xuICAgICAgICAgICAgICAgIGJyZWFrIGlmIGNvZGUgaW4gWzM4LCA0OF1cbiAgICAgICAgICAgICcnXG4gICAgICAgICAgICBcbiAgICAgICAgdG9rZW5zID0gW1xuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MDgrLywgICAgICAgICAgICAgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eXFx4MWJcXFtbMDEyXT9LLywgICAgICAgICAgICAgc3ViOiAnJ31cbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbKCg/OlxcZHsxLDN9Oz8pK3wpbS8sICBzdWI6IGFuc2lDb2RlfSBcbiAgICAgICAgICAgIHtwYXR0ZXJuOiAvXlxceDFiXFxbP1tcXGQ7XXswLDN9LywgICAgICAgICBzdWI6ICcnfVxuICAgICAgICAgICAge3BhdHRlcm46IC9eKFteXFx4MWJcXHgwOFxcbl0rKS8sICAgICAgICAgIHN1YjogYWRkVGV4dH1cbiAgICAgICAgIF1cblxuICAgICAgICBwcm9jZXNzID0gKGhhbmRsZXIsIGkpID0+XG4gICAgICAgICAgICByZXR1cm4gaWYgaSA+IGFuc2lIYW5kbGVyIGFuZCBhbnNpTWF0Y2ggIyBnaXZlIGFuc2lIYW5kbGVyIGFub3RoZXIgY2hhbmNlIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgICAgIGFuc2lNYXRjaCA9IGZhbHNlXG4gICAgICAgICAgICBAaW5wdXQgPSBAaW5wdXQucmVwbGFjZSBoYW5kbGVyLnBhdHRlcm4sIGhhbmRsZXIuc3ViXG5cbiAgICAgICAgd2hpbGUgKGxlbmd0aCA9IEBpbnB1dC5sZW5ndGgpID4gMFxuICAgICAgICAgICAgcHJvY2VzcyhoYW5kbGVyLCBpKSBmb3IgaGFuZGxlciwgaSBpbiB0b2tlbnNcbiAgICAgICAgICAgIGJyZWFrIGlmIEBpbnB1dC5sZW5ndGggPT0gbGVuZ3RoXG4gICAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQW5zaURpc3NcbiJdfQ==
//# sourceURL=../../coffee/tools/ansidiss.coffee