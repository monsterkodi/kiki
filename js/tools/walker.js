// koffee 1.4.0
var Walker, dirExists, fileExists, fs, log, path, ref, relative, resolve, walkdir,
    indexOf = [].indexOf;

ref = require('./tools'), fileExists = ref.fileExists, dirExists = ref.dirExists, relative = ref.relative, resolve = ref.resolve;

log = require('./log');

walkdir = require('walkdir');

path = require('path');

fs = require('fs');

Walker = (function() {
    function Walker(cfg1) {
        var base, base1, base2, base3, base4, base5, base6, base7;
        this.cfg = cfg1;
        this.cfg.files = [];
        this.cfg.stats = [];
        if ((base = this.cfg).maxDepth != null) {
            base.maxDepth;
        } else {
            base.maxDepth = 3;
        }
        if ((base1 = this.cfg).dotFiles != null) {
            base1.dotFiles;
        } else {
            base1.dotFiles = false;
        }
        if ((base2 = this.cfg).includeDirs != null) {
            base2.includeDirs;
        } else {
            base2.includeDirs = true;
        }
        if ((base3 = this.cfg).maxFiles != null) {
            base3.maxFiles;
        } else {
            base3.maxFiles = 500;
        }
        if ((base4 = this.cfg).ignore != null) {
            base4.ignore;
        } else {
            base4.ignore = ['node_modules', 'app', 'img', 'dist', 'build', 'Library', 'Applications'];
        }
        if ((base5 = this.cfg).include != null) {
            base5.include;
        } else {
            base5.include = ['.konrad.noon', '.gitignore', '.npmignore'];
        }
        if ((base6 = this.cfg).ignoreExt != null) {
            base6.ignoreExt;
        } else {
            base6.ignoreExt = ['.app'];
        }
        if ((base7 = this.cfg).includeExt != null) {
            base7.includeExt;
        } else {
            base7.includeExt = ['.coffee', '.js', '.styl', '.css', '.pug', '.jade', '.html', '.md', '.txt', '.noon', '.json', '.cpp', '.cc', '.c', '.h', '.hpp', '.sh', '.py'];
        }
    }

    Walker.prototype.start = function() {
        var dir, err, onWalkerPath;
        try {
            dir = this.cfg.root;
            this.walker = walkdir.walk(dir, {
                max_depth: this.cfg.maxDepth
            });
            onWalkerPath = function(cfg) {
                return function(p, stat) {
                    var extn, name, ref1, ref2;
                    name = path.basename(p);
                    extn = path.extname(p);
                    if (typeof cfg.filter === "function" ? cfg.filter(p) : void 0) {
                        return this.ignore(p);
                    } else if ((name === '.DS_Store' || name === 'Icon\r') || (extn === '.pyc')) {
                        return this.ignore(p);
                    } else if ((cfg.includeDir != null) && path.dirname(p) === cfg.includeDir) {
                        cfg.files.push(p);
                        cfg.stats.push(stat);
                        if (indexOf.call(cfg.ignore, name) >= 0) {
                            this.ignore(p);
                        }
                        if (name.startsWith('.') && !cfg.dotFiles) {
                            this.ignore(p);
                        }
                    } else if (indexOf.call(cfg.ignore, name) >= 0) {
                        return this.ignore(p);
                    } else if (indexOf.call(cfg.include, name) >= 0) {
                        cfg.files.push(p);
                        cfg.stats.push(stat);
                    } else if (name.startsWith('.')) {
                        if (cfg.dotFiles) {
                            cfg.files.push(p);
                            cfg.stats.push(stat);
                        } else {
                            return this.ignore(p);
                        }
                    } else if (indexOf.call(cfg.ignoreExt, extn) >= 0) {
                        return this.ignore(p);
                    } else if (indexOf.call(cfg.includeExt, extn) >= 0 || cfg.includeExt.indexOf('') >= 0) {
                        cfg.files.push(p);
                        cfg.stats.push(stat);
                    } else if (stat.isDirectory()) {
                        if (p !== cfg.root && cfg.includeDirs) {
                            cfg.files.push(p);
                            cfg.stats.push(stat);
                        }
                    }
                    if (typeof cfg.path === "function") {
                        cfg.path(p, stat);
                    }
                    if (stat.isDirectory()) {
                        if (cfg.includeDirs) {
                            if (typeof cfg.dir === "function") {
                                cfg.dir(p, stat);
                            }
                        }
                    } else {
                        if ((ref1 = path.extname(p), indexOf.call(cfg.includeExt, ref1) >= 0) || (ref2 = path.basename(p), indexOf.call(cfg.include, ref2) >= 0) || cfg.includeExt.indexOf('') >= 0) {
                            if (typeof cfg.file === "function") {
                                cfg.file(p, stat);
                            }
                        }
                    }
                    if (cfg.files.length > cfg.maxFiles) {
                        return this.end();
                    }
                };
            };
            this.walker.on('path', onWalkerPath(this.cfg));
            return this.walker.on('end', (function(_this) {
                return function() {
                    var base;
                    return typeof (base = _this.cfg).done === "function" ? base.done(_this.cfg.files, _this.cfg.stats) : void 0;
                };
            })(this));
        } catch (error) {
            err = error;
            console.log("walker.start.error: " + err + " dir: " + dir);
            return console.log("" + err.stack);
        }
    };

    Walker.prototype.stop = function() {
        var ref1;
        if ((ref1 = this.walker) != null) {
            ref1.end();
        }
        return this.walker = null;
    };

    Walker.packagePath = function(p) {
        while (p.length && (p !== '.' && p !== '/')) {
            if (fs.existsSync(path.join(p, 'package.noon'))) {
                return resolve(p);
            }
            if (fs.existsSync(path.join(p, 'package.json'))) {
                return resolve(p);
            }
            if (fs.existsSync(path.join(p, '.git'))) {
                return resolve(p);
            }
            p = path.dirname(p);
        }
        return null;
    };

    return Walker;

})();

module.exports = Walker;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Fsa2VyLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsSUFBQSw2RUFBQTtJQUFBOztBQUFBLE1BSVcsT0FBQSxDQUFRLFNBQVIsQ0FKWCxFQUNBLDJCQURBLEVBRUEseUJBRkEsRUFHQSx1QkFIQSxFQUlBOztBQUNBLEdBQUEsR0FBVyxPQUFBLENBQVEsT0FBUjs7QUFDWCxPQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVI7O0FBQ1gsSUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSOztBQUNYLEVBQUEsR0FBVyxPQUFBLENBQVEsSUFBUjs7QUFFTDtJQUVXLGdCQUFDLElBQUQ7QUFFVCxZQUFBO1FBRlUsSUFBQyxDQUFBLE1BQUQ7UUFFVixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsR0FBbUI7UUFDbkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLEdBQW1COztnQkFDZixDQUFDOztnQkFBRCxDQUFDLFdBQWU7OztpQkFDaEIsQ0FBQzs7aUJBQUQsQ0FBQyxXQUFlOzs7aUJBQ2hCLENBQUM7O2lCQUFELENBQUMsY0FBZTs7O2lCQUNoQixDQUFDOztpQkFBRCxDQUFDLFdBQWU7OztpQkFDaEIsQ0FBQzs7aUJBQUQsQ0FBQyxTQUFlLENBQUMsY0FBRCxFQUFpQixLQUFqQixFQUF3QixLQUF4QixFQUErQixNQUEvQixFQUF1QyxPQUF2QyxFQUFnRCxTQUFoRCxFQUEyRCxjQUEzRDs7O2lCQUNoQixDQUFDOztpQkFBRCxDQUFDLFVBQWUsQ0FBQyxjQUFELEVBQWlCLFlBQWpCLEVBQStCLFlBQS9COzs7aUJBQ2hCLENBQUM7O2lCQUFELENBQUMsWUFBZSxDQUFDLE1BQUQ7OztpQkFDaEIsQ0FBQzs7aUJBQUQsQ0FBQyxhQUFlLENBQUMsU0FBRCxFQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBNEIsTUFBNUIsRUFBb0MsTUFBcEMsRUFBNEMsT0FBNUMsRUFBcUQsT0FBckQsRUFDQSxLQURBLEVBQ08sTUFEUCxF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QUEsQ0FBQSxJQUFBLENBQWxCLEVBbERKO1NBQUEsYUFBQTtZQW9ETTtZQUNILE9BQUEsQ0FBQyxHQUFELENBQUssc0JBQUEsR0FBdUIsR0FBdkIsR0FBMkIsUUFBM0IsR0FBbUMsR0FBeEM7bUJBQTZDLE9BQUEsQ0FDNUMsR0FENEMsQ0FDeEMsRUFBQSxHQUFHLEdBQUcsQ0FBQyxLQURpQyxFQXJEaEQ7O0lBRkc7O3FCQTBEUCxJQUFBLEdBQU0sU0FBQTtBQUNGLFlBQUE7O2dCQUFPLENBQUUsR0FBVCxDQUFBOztlQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFGUjs7SUFVTixNQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsQ0FBRDtBQUNWLGVBQU0sQ0FBQyxDQUFDLE1BQUYsSUFBYSxDQUFBLENBQUEsS0FBVSxHQUFWLElBQUEsQ0FBQSxLQUFlLEdBQWYsQ0FBbkI7WUFDSSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLEVBQWEsY0FBYixDQUFkLENBQUg7QUFDSSx1QkFBTyxPQUFBLENBQVEsQ0FBUixFQURYOztZQUVBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLENBQVYsRUFBYSxjQUFiLENBQWQsQ0FBSDtBQUNJLHVCQUFPLE9BQUEsQ0FBUSxDQUFSLEVBRFg7O1lBRUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLE1BQWIsQ0FBZCxDQUFIO0FBQ0ksdUJBQU8sT0FBQSxDQUFRLENBQVIsRUFEWDs7WUFFQSxDQUFBLEdBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiO1FBUFI7ZUFRQTtJQVRVOzs7Ozs7QUFXbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCBcbiMgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAwMDAgICAwMDBcbiMgMDAgICAgIDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxue1xuZmlsZUV4aXN0cyxcbmRpckV4aXN0cyxcbnJlbGF0aXZlLFxucmVzb2x2ZX0gPSByZXF1aXJlICcuL3Rvb2xzJ1xubG9nICAgICAgPSByZXF1aXJlICcuL2xvZydcbndhbGtkaXIgID0gcmVxdWlyZSAnd2Fsa2RpcidcbnBhdGggICAgID0gcmVxdWlyZSAncGF0aCdcbmZzICAgICAgID0gcmVxdWlyZSAnZnMnXG5cbmNsYXNzIFdhbGtlclxuXG4gICAgY29uc3RydWN0b3I6IChAY2ZnKSAtPlxuICAgICAgICBcbiAgICAgICAgQGNmZy5maWxlcyAgICAgICA9IFtdXG4gICAgICAgIEBjZmcuc3RhdHMgICAgICAgPSBbXVxuICAgICAgICBAY2ZnLm1heERlcHRoICAgID89IDNcbiAgICAgICAgQGNmZy5kb3RGaWxlcyAgICA/PSBmYWxzZVxuICAgICAgICBAY2ZnLmluY2x1ZGVEaXJzID89IHRydWVcbiAgICAgICAgQGNmZy5tYXhGaWxlcyAgICA/PSA1MDBcbiAgICAgICAgQGNmZy5pZ25vcmUgICAgICA/PSBbJ25vZGVfbW9kdWxlcycsICdhcHAnLCAnaW1nJywgJ2Rpc3QnLCAnYnVpbGQnLCAnTGlicmFyeScsICdBcHBsaWNhdGlvbnMnXVxuICAgICAgICBAY2ZnLmluY2x1ZGUgICAgID89IFsnLmtvbnJhZC5ub29uJywgJy5naXRpZ25vcmUnLCAnLm5wbWlnbm9yZSddXG4gICAgICAgIEBjZmcuaWdub3JlRXh0ICAgPz0gWycuYXBwJ11cbiAgICAgICAgQGNmZy5pbmNsdWRlRXh0ICA/PSBbJy5jb2ZmZWUnLCAnLmpzJywgJy5zdHlsJywgJy5jc3MnLCAnLnB1ZycsICcuamFkZScsICcuaHRtbCcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcubWQnLCAnLnR4dCcsICcubm9vbicsICcuanNvbicsICcuY3BwJywgJy5jYycsICcuYycsICcuaCcsICcuaHBwJywgJy5zaCcsICcucHknXVxuICAgICAgICAjIGxvZyBcIndhbGtlclwiLCBAY2ZnXG4gICAgICBcbiAgICAjICAwMDAwMDAwICAwMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAgICAwMDAgICBcbiAgICAjICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICBcbiAgICBzdGFydDogLT4gICAgICAgICAgIFxuICAgICAgICAjIHByb2ZpbGUgJ3dhbGtlciBzdGFydCdcbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBkaXIgPSBAY2ZnLnJvb3RcbiAgICAgICAgICAgIEB3YWxrZXIgPSB3YWxrZGlyLndhbGsgZGlyLCBtYXhfZGVwdGg6IEBjZmcubWF4RGVwdGhcbiAgICAgICAgICAgIG9uV2Fsa2VyUGF0aCA9IChjZmcpIC0+IChwLHN0YXQpIC0+XG4gICAgICAgICAgICAgICAgbmFtZSA9IHBhdGguYmFzZW5hbWUgcFxuICAgICAgICAgICAgICAgIGV4dG4gPSBwYXRoLmV4dG5hbWUgcFxuXG4gICAgICAgICAgICAgICAgaWYgY2ZnLmZpbHRlcj8ocClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBpZ25vcmUgcFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbmFtZSBpbiBbJy5EU19TdG9yZScsICdJY29uXFxyJ10gb3IgZXh0biBpbiBbJy5weWMnXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQGlnbm9yZSBwXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBjZmcuaW5jbHVkZURpcj8gYW5kIHBhdGguZGlybmFtZShwKSA9PSBjZmcuaW5jbHVkZURpclxuICAgICAgICAgICAgICAgICAgICBjZmcuZmlsZXMucHVzaCBwXG4gICAgICAgICAgICAgICAgICAgIGNmZy5zdGF0cy5wdXNoIHN0YXRcbiAgICAgICAgICAgICAgICAgICAgQGlnbm9yZSBwIGlmIG5hbWUgaW4gY2ZnLmlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBAaWdub3JlIHAgaWYgbmFtZS5zdGFydHNXaXRoKCcuJykgYW5kIG5vdCBjZmcuZG90RmlsZXNcbiAgICAgICAgICAgICAgICBlbHNlIGlmIG5hbWUgaW4gY2ZnLmlnbm9yZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQGlnbm9yZSBwXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBuYW1lIGluIGNmZy5pbmNsdWRlXG4gICAgICAgICAgICAgICAgICAgIGNmZy5maWxlcy5wdXNoIHBcbiAgICAgICAgICAgICAgICAgICAgY2ZnLnN0YXRzLnB1c2ggc3RhdFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgbmFtZS5zdGFydHNXaXRoICcuJ1xuICAgICAgICAgICAgICAgICAgICBpZiBjZmcuZG90RmlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNmZy5maWxlcy5wdXNoIHBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNmZy5zdGF0cy5wdXNoIHN0YXRcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBpZ25vcmUgcCBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIGV4dG4gaW4gY2ZnLmlnbm9yZUV4dFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQGlnbm9yZSBwXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBleHRuIGluIGNmZy5pbmNsdWRlRXh0IG9yIGNmZy5pbmNsdWRlRXh0LmluZGV4T2YoJycpID49IDBcbiAgICAgICAgICAgICAgICAgICAgY2ZnLmZpbGVzLnB1c2ggcFxuICAgICAgICAgICAgICAgICAgICBjZmcuc3RhdHMucHVzaCBzdGF0XG4gICAgICAgICAgICAgICAgZWxzZSBpZiBzdGF0LmlzRGlyZWN0b3J5KClcbiAgICAgICAgICAgICAgICAgICAgaWYgcCAhPSBjZmcucm9vdCBhbmQgY2ZnLmluY2x1ZGVEaXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBjZmcuZmlsZXMucHVzaCBwIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2ZnLnN0YXRzLnB1c2ggc3RhdFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY2ZnLnBhdGg/IHAsIHN0YXRcbiAgICAgICAgICAgICAgICBpZiBzdGF0LmlzRGlyZWN0b3J5KClcbiAgICAgICAgICAgICAgICAgICAgaWYgY2ZnLmluY2x1ZGVEaXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBjZmcuZGlyPyBwLCBzdGF0XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZiBwYXRoLmV4dG5hbWUocCkgaW4gY2ZnLmluY2x1ZGVFeHQgb3IgcGF0aC5iYXNlbmFtZShwKSBpbiBjZmcuaW5jbHVkZSBvciBjZmcuaW5jbHVkZUV4dC5pbmRleE9mKCcnKSA+PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICBjZmcuZmlsZT8gcCwgc3RhdFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgY2ZnLmZpbGVzLmxlbmd0aCA+IGNmZy5tYXhGaWxlc1xuICAgICAgICAgICAgICAgICAgICAjIGxvZyAnbWF4IGZpbGVzIHJlYWNoZWQnLCBAZW5kP1xuICAgICAgICAgICAgICAgICAgICBAZW5kKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHdhbGtlci5vbiAncGF0aCcsIG9uV2Fsa2VyUGF0aCBAY2ZnXG4gICAgICAgICAgICBAd2Fsa2VyLm9uICdlbmQnLCA9PiBAY2ZnLmRvbmU/IEBjZmcuZmlsZXMsIEBjZmcuc3RhdHNcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgY2F0Y2ggZXJyXG4gICAgICAgICAgICBsb2cgXCJ3YWxrZXIuc3RhcnQuZXJyb3I6ICN7ZXJyfSBkaXI6ICN7ZGlyfVwiXG4gICAgICAgICAgICBsb2cgXCIje2Vyci5zdGFja31cIlxuXG4gICAgc3RvcDogLT4gXG4gICAgICAgIEB3YWxrZXI/LmVuZCgpXG4gICAgICAgIEB3YWxrZXIgPSBudWxsXG4gICAgXG4gICAgIyAwMDAwMDAwMCAgICAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMDAwICAwMDAgIDAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAgICAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwXG4gICAgXG4gICAgQHBhY2thZ2VQYXRoOiAocCkgLT5cbiAgICAgICAgd2hpbGUgcC5sZW5ndGggYW5kIHAgbm90IGluIFsnLicsICcvJ10gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgcGF0aC5qb2luIHAsICdwYWNrYWdlLm5vb24nXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUgcFxuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyBwYXRoLmpvaW4gcCwgJ3BhY2thZ2UuanNvbidcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSBwXG4gICAgICAgICAgICBpZiBmcy5leGlzdHNTeW5jIHBhdGguam9pbiBwLCAnLmdpdCdcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSBwXG4gICAgICAgICAgICBwID0gcGF0aC5kaXJuYW1lIHBcbiAgICAgICAgbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGtlclxuIl19
//# sourceURL=../../coffee/tools/walker.coffee