// koffee 1.4.0
var _, config, dissect, last, ranges, sortRanges;

last = require('./tools').last;

_ = require('lodash');

config = function(patterns) {
    var a, p, results;
    results = [];
    for (p in patterns) {
        a = patterns[p];
        results.push([new RegExp(p), a]);
    }
    return results;
};

sortRanges = function(rgs) {
    return rgs.sort(function(a, b) {
        if (a.start === b.start) {
            if (a.match.length === b.match.length) {
                return a.index - b.index;
            } else {
                return a.match.length - b.match.length;
            }
        } else {
            return a.start - b.start;
        }
    });
};

ranges = function(regexes, str) {
    var arg, gi, gs, i, j, k, l, match, r, ref, ref1, reg, rgs, s, value;
    rgs = [];
    if (str == null) {
        return rgs;
    }
    for (r = k = 0, ref = regexes.length; 0 <= ref ? k < ref : k > ref; r = 0 <= ref ? ++k : --k) {
        reg = regexes[r][0];
        arg = regexes[r][1];
        i = 0;
        s = str;
        while (s.length) {
            match = reg.exec(s);
            if (match == null) {
                break;
            }
            if (match.length === 1) {
                rgs.push({
                    start: match.index + i,
                    match: match[0],
                    value: arg,
                    index: r
                });
                i += match.index + match[0].length;
                s = str.slice(i);
            } else {
                gs = 0;
                for (j = l = 0, ref1 = match.length - 2; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
                    value = arg;
                    if (_.isArray(value) && j < value.length) {
                        value = value[j];
                    } else if (_.isObject(value) && j < _.size(value)) {
                        value = [_.keys(value)[j], value[_.keys(value)[j]]];
                    }
                    gi = match[0].slice(gs).indexOf(match[j + 1]);
                    rgs.push({
                        start: match.index + i + gs + gi,
                        match: match[j + 1],
                        value: value,
                        index: r
                    });
                    gs += match[j + 1].length;
                }
                i += match.index + match[0].length;
                s = str.slice(i);
            }
        }
    }
    return sortRanges(rgs);
};

dissect = function(ranges, opt) {
    var c, d, di, i, k, l, len, len1, len2, len3, m, n, o, p, pn, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, rg, ri, si, t, u;
    if (opt == null) {
        opt = {
            join: false
        };
    }
    if (!ranges.length) {
        return [];
    }
    di = [];
    for (ri = k = 0, ref = ranges.length; 0 <= ref ? k < ref : k > ref; ri = 0 <= ref ? ++k : --k) {
        rg = ranges[ri];
        di.push([rg.start, ri]);
        di.push([rg.start + rg.match.length]);
    }
    di.sort(function(a, b) {
        if (a[0] === b[0]) {
            return a[1] - b[1];
        } else {
            return a[0] - b[0];
        }
    });
    d = [];
    si = -1;
    for (i = l = 0, ref1 = di.length - 1; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        if (di[i][0] > si) {
            si = di[i][0];
            d.push({
                start: si,
                cid: 0,
                cls: []
            });
        }
    }
    p = 0;
    for (ri = m = 0, ref2 = ranges.length; 0 <= ref2 ? m < ref2 : m > ref2; ri = 0 <= ref2 ? ++m : --m) {
        rg = ranges[ri];
        while (d[p].start < rg.start) {
            p += 1;
        }
        pn = p;
        while (d[pn].start < rg.start + rg.match.length) {
            if ((d[pn].cid < rg.index || opt.join) && (rg.value != null)) {
                if (rg.value.split == null) {
                    ref3 = rg.value;
                    for (n = 0, len = ref3.length; n < len; n++) {
                        r = ref3[n];
                        if (r.split == null) {
                            continue;
                        }
                        ref4 = r.split('.');
                        for (o = 0, len1 = ref4.length; o < len1; o++) {
                            c = ref4[o];
                            if (d[pn].cls.indexOf(c) < 0) {
                                d[pn].cls.push(c);
                            }
                        }
                    }
                } else {
                    ref5 = rg.value.split('.');
                    for (q = 0, len2 = ref5.length; q < len2; q++) {
                        c = ref5[q];
                        if (d[pn].cls.indexOf(c) < 0) {
                            d[pn].cls.push(c);
                        }
                    }
                }
                d[pn].cid = rg.index;
            }
            if (pn + 1 < d.length) {
                if (!d[pn].match) {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start, d[pn + 1].start - d[pn].start);
                }
                pn += 1;
            } else {
                if (!d[pn].match) {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start);
                }
                break;
            }
        }
    }
    d = d.filter(function(i) {
        var ref6;
        return (ref6 = i.match) != null ? ref6.trim().length : void 0;
    });
    for (t = 0, len3 = d.length; t < len3; t++) {
        i = d[t];
        i.clss = i.cls.join(' ');
    }
    if (d.length > 1) {
        for (i = u = ref6 = d.length - 2; ref6 <= 0 ? u <= 0 : u >= 0; i = ref6 <= 0 ? ++u : --u) {
            if (d[i].start + d[i].match.length === d[i + 1].start) {
                if (d[i].clss === d[i + 1].clss) {
                    d[i].match += d[i + 1].match;
                    d.splice(i + 1, 1);
                }
            }
        }
    }
    return d;
};

module.exports = {
    config: config,
    ranges: ranges,
    dissect: dissect,
    sortRanges: sortRanges
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsSUFBQTs7QUFDQSxPQUNJLE9BQUEsQ0FBUSxTQUFSOztBQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFVSixNQUFBLEdBQVMsU0FBQyxRQUFEO0FBQWMsUUFBQTtBQUFFO1NBQUEsYUFBQTs7cUJBQUEsQ0FBQyxJQUFJLE1BQUosQ0FBVyxDQUFYLENBQUQsRUFBZ0IsQ0FBaEI7QUFBQTs7QUFBaEI7O0FBRVQsVUFBQSxHQUFhLFNBQUMsR0FBRDtXQUNULEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBQyxDQUFELEVBQUcsQ0FBSDtRQUNMLElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxDQUFDLENBQUMsS0FBaEI7WUFDSSxJQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBUixLQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQTdCO3VCQUNJLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLE1BRGhCO2FBQUEsTUFBQTt1QkFHSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQVIsR0FBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUg3QjthQURKO1NBQUEsTUFBQTttQkFNSSxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxNQU5oQjs7SUFESyxDQUFUO0FBRFM7O0FBK0JiLE1BQUEsR0FBUyxTQUFDLE9BQUQsRUFBVSxHQUFWO0FBRUwsUUFBQTtJQUFBLEdBQUEsR0FBTTtJQUNOLElBQWtCLFdBQWxCO0FBQUEsZUFBTyxJQUFQOztBQUNBLFNBQVMsdUZBQVQ7UUFDSSxHQUFBLEdBQU0sT0FBUSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUE7UUFDakIsR0FBQSxHQUFNLE9BQVEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBO1FBQ2pCLENBQUEsR0FBSTtRQUNKLENBQUEsR0FBSTtBQUNKLGVBQU0sQ0FBQyxDQUFDLE1BQVI7WUFD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QUFDLENBQUMsR0FBRyxDQUFDLElBQU4sQ0FBVyxHQUFYO0FBRGI7SUFFQSxJQUFHLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBZDtBQUNJLGFBQVMsbUZBQVQ7WUFDSSxJQUFHLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFMLEdBQWEsQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxNQUF4QixLQUFrQyxDQUFFLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBSSxDQUFDLEtBQTVDO2dCQUNJLElBQUcsQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUwsS0FBYSxDQUFFLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBSSxDQUFDLElBQXZCO29CQUNJLENBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFMLElBQWMsQ0FBRSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQUksQ0FBQztvQkFDckIsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFBLEdBQUUsQ0FBWCxFQUFjLENBQWQsRUFGSjtpQkFESjs7QUFESixTQURKOztXQVFBO0FBNURNOztBQThEVixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsTUFBQSxFQUFZLE1BQVo7SUFDQSxNQUFBLEVBQVksTUFEWjtJQUVBLE9BQUEsRUFBWSxPQUZaO0lBR0EsVUFBQSxFQUFZLFVBSFoiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwICAgICAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMDAwICAwMDAwMDAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgXG4jIDAwMCAwIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcbntcbmxhc3Rcbn0gPSByZXF1aXJlICcuL3Rvb2xzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDAwMDAwIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMCAgICAwMDAgIDAwMCAgMDAwMFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgICAgICAwMDAgIDAwMCAgIDAwMFxuIyAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAwMDAwIFxuXG4jIGNvbnZlcnQgdGhlIHBhdHRlcm5zIG9iamVjdCB0byBhIGxpc3Qgb2YgW1JlZ0V4cChrZXkpLCB2YWx1ZV0gcGFpcnNcblxuY29uZmlnID0gKHBhdHRlcm5zKSAtPiAoIFtuZXcgUmVnRXhwKHApLCBhXSBmb3IgcCxhIG9mIHBhdHRlcm5zIClcblxuc29ydFJhbmdlcyA9IChyZ3MpIC0+XG4gICAgcmdzLnNvcnQgKGEsYikgLT4gXG4gICAgICAgIGlmIGEuc3RhcnQgPT0gYi5zdGFydFxuICAgICAgICAgICAgaWYgYS5tYXRjaC5sZW5ndGggPT0gYi5tYXRjaC5sZW5ndGhcbiAgICAgICAgICAgICAgICBhLmluZGV4IC0gYi5pbmRleFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGEubWF0Y2gubGVuZ3RoIC0gYi5tYXRjaC5sZW5ndGhcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYS5zdGFydCAtIGIuc3RhcnRcblxuIyAwMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICAwMDAgICAgIFxuIyAwMDAwMDAwICAgIDAwMDAwMDAwMCAgMDAwIDAgMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwIFxuXG4jIGFjY2VwdHMgYSBsaXN0IG9mIFtyZWdleHAsIHZhbHVlKHMpXSBwYWlycyBhbmQgYSBzdHJpbmdcbiMgcmV0dXJucyBhIGxpc3Qgb2Ygb2JqZWN0cyB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSBtYXRjaGVzOlxuICBcbiMgICAgIG1hdGNoOiB0aGUgbWF0Y2hlZCBzdWJzdHJpbmdcbiMgICAgIHN0YXJ0OiBwb3NpdGlvbiBvZiBtYXRjaCBpbiBzdHJcbiMgICAgIHZhbHVlOiB0aGUgdmFsdWUgZm9yIHRoZSBtYXRjaFxuIyAgICAgaW5kZXg6IHRoZSBpbmRleCBvZiB0aGUgcmVnZXhwIFxuICAgICAgXG4jICAgICB0aGUgb2JqZWN0cyBhcmUgc29ydGVkIGJ5IHN0YXJ0LCBtYXRjaC5sZW5ndGggYW5kIGluZGV4XG4gICAgICBcbiMgICAgIGlmIHRoZSByZWdleHAgaGFzIGNhcHR1cmUgZ3JvdXBzIHRoZW4gXG4jICAgICAgICAgdGhlIHZhbHVlIGZvciB0aGUgbWF0Y2ggb2YgdGhlIG50aCBncm91cCBpc1xuIyAgICAgICAgICAgICB0aGUgbnRoIGl0ZW0gb2YgdmFsdWVzKHMpIGlmIHZhbHVlKHMpIGlzIGFuIGFycmF5XG4jICAgICAgICAgICAgIHRoZSBudGggW2tleSwgdmFsdWVdIHBhaXIgaWYgdmFsdWUocykgaXMgYW4gb2JqZWN0XG5cbnJhbmdlcyA9IChyZWdleGVzLCBzdHIpIC0+XG4gICAgXG4gICAgcmdzID0gW11cbiAgICByZXR1cm4gcmdzIGlmIG5vdCBzdHI/XG4gICAgZm9yIHIgaW4gWzAuLi5yZWdleGVzLmxlbmd0aF1cbiAgICAgICAgcmVnID0gcmVnZXhlc1tyXVswXVxuICAgICAgICBhcmcgPSByZWdleGVzW3JdWzFdXG4gICAgICAgIGkgPSAwXG4gICAgICAgIHMgPSBzdHJcbiAgICAgICAgd2hpbGUgcy5sZW5ndGhcbiAgICAgICAgICAgIG1hdGNoID0gcmVnLmV4ZWMgc1xuICAgICAgICAgICAgYnJlYWsgaWYgbm90IG1hdGNoP1xuICAgICAgICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDFcbiAgICAgICAgICAgICAgICByZ3MucHVzaFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogbWF0Y2guaW5kZXggKyBpXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoOiBtYXRjaFswXVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXJnXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiByXG4gICAgICAgICAgICAgICAgaSArPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgICAgICAgICAgIHMgPSBzdHIuc2xpY2UgaVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGdzID0gMFxuICAgICAgICAgICAgICAgIGZvciBqIGluIFswLi5tYXRjaC5sZW5ndGgtMl1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhcmdcbiAgICAgICAgICAgICAgICAgICAgaWYgXy5pc0FycmF5KHZhbHVlKSBhbmQgaiA8IHZhbHVlLmxlbmd0aCB0aGVuIHZhbHVlID0gdmFsdWVbal1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBfLmlzT2JqZWN0KHZhbHVlKSBhbmQgaiA8IF8uc2l6ZSh2YWx1ZSkgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFtfLmtleXModmFsdWUpW2pdLCB2YWx1ZVtfLmtleXModmFsdWUpW2pdXV1cbiAgICAgICAgICAgICAgICAgICAgZ2kgPSBtYXRjaFswXS5zbGljZShncykuaW5kZXhPZiBtYXRjaFtqKzFdXG4gICAgICAgICAgICAgICAgICAgIHJncy5wdXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogbWF0Y2guaW5kZXggKyBpICsgZ3MgKyBnaVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IG1hdGNoW2orMV1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHJcbiAgICAgICAgICAgICAgICAgICAgZ3MgKz0gbWF0Y2hbaisxXS5sZW5ndGhcbiAgICAgICAgICAgICAgICBpICs9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoXG4gICAgICAgICAgICAgICAgcyA9IHN0ci5zbGljZSBpXG4gICAgc29ydFJhbmdlcyByZ3MgICAgICAgIFxuXG4jIDAwMDAwMDAgICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgICAgMDAwICAgXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgXG4jIDAwMDAwMDAgICAgMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwICAgXG4gXG4jIGFjY2VwdHMgYSBsaXN0IG9mIHJhbmdlc1xuIyByZXR1cm5zIGEgbGlzdCBvZiBvYmplY3RzOlxuIFxuIyAgICAgbWF0Y2g6IHRoZSBtYXRjaGVkIHN1YnN0cmluZ1xuIyAgICAgc3RhcnQ6IHBvc2l0aW9uIG9mIG1hdGNoIGluIHN0clxuIyAgICAgY2xzOiAgIGxpc3Qgb2YgY2xhc3NuYW1lc1xuIyAgICAgY2xzczogIHN0cmluZyBvZiBjbGFzc25hbWVzIGpvaW5lZCB3aXRoIGEgc3BhY2VcbiAgICAgXG4jICAgICB3aXRoIG5vbmUgb2YgdGhlIFtzdGFydCwgc3RhcnQrbWF0Y2gubGVuZ3RoXSByYW5nZXMgb3ZlcmxhcHBpbmdcblxuZGlzc2VjdCA9IChyYW5nZXMsIG9wdD17am9pbjpmYWxzZX0pIC0+IFxuICAgIHJldHVybiBbXSBpZiBub3QgcmFuZ2VzLmxlbmd0aFxuICAgICMgY29uc29sZS5sb2cgXCJkaXNzZWN0IC0tICN7SlNPTi5zdHJpbmdpZnkgcmFuZ2VzfVwiXG4gICAgZGkgPSBbXVxuICAgIGZvciByaSBpbiBbMC4uLnJhbmdlcy5sZW5ndGhdXG4gICAgICAgIHJnID0gcmFuZ2VzW3JpXVxuICAgICAgICBkaS5wdXNoIFtyZy5zdGFydCwgcmldXG4gICAgICAgIGRpLnB1c2ggW3JnLnN0YXJ0ICsgcmcubWF0Y2gubGVuZ3RoXVxuICAgIGRpLnNvcnQgKGEsYikgLT4gXG4gICAgICAgIGlmIGFbMF09PWJbMF0gXG4gICAgICAgICAgICBhWzFdLWJbMV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYVswXS1iWzBdXG4gICAgZCA9IFtdXG4gICAgc2kgPSAtMVxuICAgIGZvciBpIGluIFswLi4uZGkubGVuZ3RoLTFdXG4gICAgICAgIGlmIGRpW2ldWzBdID4gc2lcbiAgICAgICAgICAgIHNpID0gZGlbaV1bMF1cbiAgICAgICAgICAgIGQucHVzaFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzaVxuICAgICAgICAgICAgICAgIGNpZDogICAwXG4gICAgICAgICAgICAgICAgY2xzOiAgIFtdXG5cbiAgICBwID0gMFxuICAgIGZvciByaSBpbiBbMC4uLnJhbmdlcy5sZW5ndGhdXG4gICAgICAgIHJnID0gcmFuZ2VzW3JpXVxuICAgICAgICB3aGlsZSBkW3BdLnN0YXJ0IDwgcmcuc3RhcnQgXG4gICAgICAgICAgICBwICs9IDEgXG4gICAgICAgIHBuID0gcFxuICAgICAgICB3aGlsZSBkW3BuXS5zdGFydCA8IHJnLnN0YXJ0K3JnLm1hdGNoLmxlbmd0aFxuICAgICAgICAgICAgaWYgIChkW3BuXS5jaWQgPCByZy5pbmRleCBvciBvcHQuam9pbikgYW5kIHJnLnZhbHVlP1xuICAgICAgICAgICAgICAgIGlmIG5vdCByZy52YWx1ZS5zcGxpdD9cbiAgICAgICAgICAgICAgICAgICAgZm9yIHIgaW4gcmcudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGlmIG5vdCByLnNwbGl0P1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGMgaW4gci5zcGxpdCAnLicgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZFtwbl0uY2xzLnB1c2ggYyBpZiBkW3BuXS5jbHMuaW5kZXhPZihjKSA8IDBcbiAgICAgICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgICAgICBmb3IgYyBpbiByZy52YWx1ZS5zcGxpdCAnLicgXG4gICAgICAgICAgICAgICAgICAgICAgICBkW3BuXS5jbHMucHVzaCBjIGlmIGRbcG5dLmNscy5pbmRleE9mKGMpIDwgMFxuICAgICAgICAgICAgICAgIGRbcG5dLmNpZCA9IHJnLmluZGV4XG4gICAgICAgICAgICBpZiBwbisxIDwgZC5sZW5ndGhcbiAgICAgICAgICAgICAgICBpZiBub3QgZFtwbl0ubWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgZFtwbl0ubWF0Y2ggPSByZy5tYXRjaC5zdWJzdHIgZFtwbl0uc3RhcnQtcmcuc3RhcnQsIGRbcG4rMV0uc3RhcnQtZFtwbl0uc3RhcnRcbiAgICAgICAgICAgICAgICBwbiArPSAxXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgbm90IGRbcG5dLm1hdGNoXG4gICAgICAgICAgICAgICAgICAgIGRbcG5dLm1hdGNoID0gcmcubWF0Y2guc3Vic3RyIGRbcG5dLnN0YXJ0LXJnLnN0YXJ0XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBcbiAgICBkID0gZC5maWx0ZXIgKGkpIC0+IGkubWF0Y2g/LnRyaW0oKS5sZW5ndGhcbiAgICBmb3IgaSBpbiBkXG4gICAgICAgIGkuY2xzcyA9IGkuY2xzLmpvaW4gJyAnXG4gICAgaWYgZC5sZW5ndGggPiAxXG4gICAgICAgIGZvciBpIGluIFtkLmxlbmd0aC0yLi4wXVxuICAgICAgICAgICAgaWYgZFtpXS5zdGFydCArIGRbaV0ubWF0Y2gubGVuZ3RoID09IGRbaSsxXS5zdGFydFxuICAgICAgICAgICAgICAgIGlmIGRbaV0uY2xzcyA9PSBkW2krMV0uY2xzc1xuICAgICAgICAgICAgICAgICAgICBkW2ldLm1hdGNoICs9IGRbaSsxXS5tYXRjaFxuICAgICAgICAgICAgICAgICAgICBkLnNwbGljZSBpKzEsIDFcbiAgICAgICAgXG4gICAgIyBjb25zb2xlLmxvZyBcImRpc3NlY3QgPT1cIiwgSlNPTi5zdHJpbmdpZnkgZFxuICAgIGRcblxubW9kdWxlLmV4cG9ydHMgPSBcbiAgICBjb25maWc6ICAgICBjb25maWdcbiAgICByYW5nZXM6ICAgICByYW5nZXNcbiAgICBkaXNzZWN0OiAgICBkaXNzZWN0XG4gICAgc29ydFJhbmdlczogc29ydFJhbmdlc1xuIl19
//# sourceURL=../../coffee/tools/matchr.coffee