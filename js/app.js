// koffee 1.4.0
var BrowserWindow, Main, MainMenu, Menu, _, activeWin, app, args, childp, clipboard, colors, dialog, dirExists, electron, fileExists, fileList, first, fs, ipc, log, main, noon, openFiles, p, pkg, ref, resolve, str, visibleWins, winWithID, wins,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('./tools/tools'), first = ref.first, fileList = ref.fileList, dirExists = ref.dirExists, fileExists = ref.fileExists, resolve = ref.resolve;

log = require('./tools/log');

str = require('./tools/str');

pkg = require('../package.json');

MainMenu = require('./mainmenu');

_ = require('lodash');

fs = require('fs');

noon = require('noon');

colors = require('colors');

electron = require('electron');

childp = require('child_process');

app = electron.app;

BrowserWindow = electron.BrowserWindow;

Menu = electron.Menu;

clipboard = electron.clipboard;

ipc = electron.ipcMain;

dialog = electron.dialog;

main = void 0;

openFiles = [];

wins = [];

args = require('karg')("\n" + pkg.productName + "\n\n    filelist  . ? files to open           . **\n    verbose   . ? log more                . = false\n    DevTools  . ? open developer tools    . = false\n    debug     .                             = false\n    test      .                             = false\n    \nversion  " + pkg.version + "\n", {
    dontExit: true
});

if (args == null) {
    app.exit(0);
}

while (args.filelist.length && dirExists(first(args.filelist))) {
    process.chdir(args.filelist.shift());
}

if (args.verbose) {
    console.log(colors.white.bold("\n" + pkg.productName, colors.gray("v" + pkg.version + "\n")));
    console.log(colors.yellow.bold('process'));
    p = {
        cwd: process.cwd()
    };
    console.log(noon.stringify(p, {
        colors: true
    }));
    console.log(colors.yellow.bold('args'));
    console.log(noon.stringify(args, {
        colors: true
    }));
    console.log('');
}

ipc.on('toggleDevTools', (function(_this) {
    return function(event) {
        return event.sender.toggleDevTools();
    };
})(this));

ipc.on('maximizeWindow', (function(_this) {
    return function(event, winID) {
        return main.toggleMaximize(winWithID(winID));
    };
})(this));

ipc.on('activateWindow', (function(_this) {
    return function(event, winID) {
        return main.activateWindowWithID(winID);
    };
})(this));

ipc.on('saveBounds', (function(_this) {
    return function(event, winID) {
        return main.saveWinBounds(winWithID(winID));
    };
})(this));

ipc.on('reloadWindow', (function(_this) {
    return function(event, winID) {
        return main.reloadWin(winWithID(winID));
    };
})(this));

ipc.on('reloadMenu', (function(_this) {
    return function() {
        return main.reloadMenu();
    };
})(this));

wins = function() {
    return BrowserWindow.getAllWindows().sort(function(a, b) {
        return a.id - b.id;
    });
};

activeWin = function() {
    return BrowserWindow.getFocusedWindow();
};

visibleWins = function() {
    var i, len, ref1, results, w;
    ref1 = wins();
    results = [];
    for (i = 0, len = ref1.length; i < len; i++) {
        w = ref1[i];
        if ((w != null ? w.isVisible() : void 0) && !(w != null ? w.isMinimized() : void 0)) {
            results.push(w);
        }
    }
    return results;
};

winWithID = function(winID) {
    var i, len, ref1, w, wid;
    wid = parseInt(winID);
    ref1 = wins();
    for (i = 0, len = ref1.length; i < len; i++) {
        w = ref1[i];
        if (w.id === wid) {
            return w;
        }
    }
};

Main = (function() {
    function Main(openFiles) {
        this.showAbout = bind(this.showAbout, this);
        this.quit = bind(this.quit, this);
        this.otherInstanceStarted = bind(this.otherInstanceStarted, this);
        this.onCloseWin = bind(this.onCloseWin, this);
        this.onResizeWin = bind(this.onResizeWin, this);
        this.onMoveWin = bind(this.onMoveWin, this);
        this.closeWindowsAndQuit = bind(this.closeWindowsAndQuit, this);
        this.closeWindows = bind(this.closeWindows, this);
        this.closeWindow = bind(this.closeWindow, this);
        this.closeOtherWindows = bind(this.closeOtherWindows, this);
        this.activateWindowWithID = bind(this.activateWindowWithID, this);
        this.raiseWindows = bind(this.raiseWindows, this);
        this.showWindows = bind(this.showWindows, this);
        this.hideWindows = bind(this.hideWindows, this);
        this.toggleWindows = bind(this.toggleWindows, this);
        this.reloadMenu = bind(this.reloadMenu, this);
        var file, i, len, ref1, ref2, w;
        app.setName(pkg.productName);
        if (!openFiles.length && args.filelist.length) {
            openFiles = fileList(args.filelist);
        }
        if (openFiles.length) {
            for (i = 0, len = openFiles.length; i < len; i++) {
                file = openFiles[i];
                this.createWindow(file);
            }
        }
        if (!wins().length) {
            w = this.createWindow();
        }
        if (args.DevTools) {
            if ((ref1 = wins()) != null) {
                if ((ref2 = ref1[0]) != null) {
                    ref2.webContents.openDevTools();
                }
            }
        }
        MainMenu.init(this);
        setTimeout(this.showWindows, 10);
    }

    Main.prototype.wins = wins;

    Main.prototype.winWithID = winWithID;

    Main.prototype.activeWin = activeWin;

    Main.prototype.visibleWins = visibleWins;

    Main.prototype.reloadMenu = function() {
        return MainMenu.init(this);
    };

    Main.prototype.reloadWin = function(win) {
        var dev;
        if (win != null) {
            dev = win.webContents.isDevToolsOpened();
            if (dev) {
                win.webContents.closeDevTools();
                return setTimeout(win.webContents.reloadIgnoringCache, 100);
            } else {
                return win.webContents.reloadIgnoringCache();
            }
        }
    };

    Main.prototype.toggleMaximize = function(win) {
        if (win.isMaximized()) {
            return win.unmaximize();
        } else {
            return win.maximize();
        }
    };

    Main.prototype.toggleWindows = function() {
        if (wins().length) {
            if (visibleWins().length) {
                if (activeWin()) {
                    return this.hideWindows();
                } else {
                    return this.raiseWindows();
                }
            } else {
                return this.showWindows();
            }
        } else {
            return this.createWindow();
        }
    };

    Main.prototype.hideWindows = function() {
        var i, len, ref1, results, w;
        ref1 = wins();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            w = ref1[i];
            results.push(w.hide());
        }
        return results;
    };

    Main.prototype.showWindows = function() {
        var i, len, ref1, ref2, results, w;
        ref1 = wins();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            w = ref1[i];
            w.show();
            results.push((ref2 = app.dock) != null ? ref2.show() : void 0);
        }
        return results;
    };

    Main.prototype.raiseWindows = function() {
        var i, len, ref1, w;
        if (visibleWins().length) {
            ref1 = visibleWins();
            for (i = 0, len = ref1.length; i < len; i++) {
                w = ref1[i];
                w.showInactive();
            }
            visibleWins()[0].showInactive();
            return visibleWins()[0].focus();
        }
    };

    Main.prototype.activateWindowWithID = function(wid) {
        var w;
        w = winWithID(wid);
        if (w == null) {
            return;
        }
        if (!w.isVisible()) {
            w.show();
        }
        return w.focus();
    };

    Main.prototype.closeOtherWindows = function() {
        var i, len, ref1, results, w;
        ref1 = wins();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            w = ref1[i];
            if (w !== activeWin()) {
                results.push(this.closeWindow(w));
            } else {
                results.push(void 0);
            }
        }
        return results;
    };

    Main.prototype.closeWindow = function(w) {
        return w != null ? w.close() : void 0;
    };

    Main.prototype.closeWindows = function() {
        var i, len, ref1, results, w;
        ref1 = wins();
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
            w = ref1[i];
            results.push(this.closeWindow(w));
        }
        return results;
    };

    Main.prototype.closeWindowsAndQuit = function() {
        this.closeWindows();
        return this.quit();
    };

    Main.prototype.screenSize = function() {
        return electron.screen.getPrimaryDisplay().workAreaSize;
    };

    Main.prototype.newWindowWithFile = function(file, pos) {
        return this.createWindow(file, pos).id;
    };

    Main.prototype.createWindow = function(openFile, pos) {
        var height, ref1, ref2, width, win, winLoaded, winReady, ww;
        ref1 = this.screenSize(), width = ref1.width, height = ref1.height;
        ww = height + 122;
        win = new BrowserWindow({
            x: parseInt((width - ww) / 2),
            y: 0,
            width: ww,
            height: height,
            minWidth: 140,
            minHeight: 130,
            useContentSize: true,
            fullscreenable: true,
            show: true,
            hasShadow: false,
            backgroundColor: '#000',
            titleBarStyle: 'hidden'
        });
        win.loadURL("file://" + __dirname + "/index.html");
        if ((ref2 = app.dock) != null) {
            ref2.show();
        }
        win.on('close', this.onCloseWin);
        win.on('move', this.onMoveWin);
        win.on('resize', this.onResizeWin);
        winReady = (function(_this) {
            return function() {
                return win.webContents.send('setWinID', win.id);
            };
        })(this);
        winLoaded = (function(_this) {
            return function() {};
        })(this);
        win.webContents.on('dom-ready', winReady);
        win.webContents.on('did-finish-load', winLoaded);
        return win;
    };

    Main.prototype.onMoveWin = function(event) {};

    Main.prototype.onResizeWin = function(event) {};

    Main.prototype.onCloseWin = function(event) {};

    Main.prototype.otherInstanceStarted = function(args, dir) {
        var arg, file, i, len, ref1, ref2, w;
        if (!visibleWins().length) {
            this.toggleWindows();
        }
        ref1 = args.slice(2);
        for (i = 0, len = ref1.length; i < len; i++) {
            arg = ref1[i];
            if (arg.startsWith('-')) {
                continue;
            }
            file = arg;
            if (!arg.startsWith('/')) {
                file = resolve(dir + '/' + arg);
            }
            if (!fileExists(file)) {
                continue;
            }
            w = this.activateWindowWithFile(file);
            if (w == null) {
                w = this.createWindow(file);
            }
        }
        if (!activeWin()) {
            return (ref2 = visibleWins()[0]) != null ? ref2.focus() : void 0;
        }
    };

    Main.prototype.quit = function() {
        app.exit(0);
        return process.exit(0);
    };

    Main.prototype.showAbout = function() {
        var cwd, w;
        cwd = __dirname;
        w = new BrowserWindow({
            dir: cwd,
            preloadWindow: true,
            resizable: true,
            frame: true,
            show: true,
            center: true,
            backgroundColor: '#333',
            width: 400,
            height: 420
        });
        w.loadURL("file://" + cwd + "/../about.html");
        return w.on('openFileDialog', this.createWindow);
    };

    Main.prototype.log = function() {
        var s;
        if (args.verbose) {
            return console.log(((function() {
                var i, len, ref1, results;
                ref1 = [].slice.call(arguments, 0);
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                    s = ref1[i];
                    results.push(str(s));
                }
                return results;
            }).apply(this, arguments)).join(" "));
        }
    };

    Main.prototype.dbg = function() {
        var s;
        if (args.debug) {
            return console.log(((function() {
                var i, len, ref1, results;
                ref1 = [].slice.call(arguments, 0);
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                    s = ref1[i];
                    results.push(str(s));
                }
                return results;
            }).apply(this, arguments)).join(" "));
        }
    };

    return Main;

})();

app.on('ready', (function(_this) {
    return function() {
        return main = new Main(openFiles);
    };
})(this));

app.on('window-all-closed', (function(_this) {
    return function() {
        return app.exit(0);
    };
})(this));

app.setName(pkg.productName);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsSUFBQSwrT0FBQTtJQUFBOztBQUFBLE1BS2dCLE9BQUEsQ0FBUSxlQUFSLENBTGhCLEVBQ0EsaUJBREEsRUFFQSx1QkFGQSxFQUdBLHlCQUhBLEVBSUEsMkJBSkEsRUFLQTs7QUFDQSxHQUFBLEdBQWdCLE9BQUEsQ0FBUSxhQUFSOztBQUNoQixHQUFBLEdBQWdCLE9BQUEsQ0FBUSxhQUFSOztBQUNoQixHQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUjs7QUFDaEIsUUFBQSxHQUFnQixPQUFBLENBQVEsWUFBUjs7QUFDaEIsQ0FBQSxHQUFnQixPQUFBLENBQVEsUUFBUjs7QUFDaEIsRUFBQSxHQUFnQixPQUFBLENBQVEsSUFBUjs7QUFDaEIsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUjs7QUFDaEIsTUFBQSxHQUFnQixPQUFBLENBQVEsUUFBUjs7QUFDaEIsUUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUjs7QUFDaEIsTUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUjs7QUFDaEIsR0FBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLGFBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixJQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsU0FBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLEdBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixNQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsSUFBQSxHQUFnQjs7QUFDaEIsU0FBQSxHQUFnQjs7QUFDaEIsSUFBQSxHQUFnQjs7QUFRaEIsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSLENBQUEsQ0FBZ0IsSUFBQSxHQUV0QixHQUFHLENBQUMsV0FGa0IsR0FFTix5UkFGTSxHQVViLEdBQUcsQ0FBQyxPQVZTLEdBVUQsSUFWZixFQVlIO0lBQUEsUUFBQSxFQUFVLElBQVY7Q0FaRzs7QUFjUixJQUFrQixZQUFsQjtJ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Q0FBQyxJQUE3QyxDQUFrRCxHQUFsRCxDQUFOLEVBQUE7O0lBQUQ7Ozs7OztBQVFULEdBQUcsQ0FBQyxFQUFKLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUE7ZUFBRyxJQUFBLEdBQU8sSUFBSSxJQUFKLENBQVMsU0FBVDtJQUFWO0FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjs7QUFDQSxHQUFHLENBQUMsRUFBSixDQUFPLG1CQUFQLEVBQTRCLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQTtlQUFHLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVDtJQUFIO0FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1Qjs7QUFFQSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQUcsQ0FBQyxXQUFoQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgXG57XG5maXJzdCxcbmZpbGVMaXN0LFxuZGlyRXhpc3RzLFxuZmlsZUV4aXN0cyxcbnJlc29sdmV9ICAgICAgPSByZXF1aXJlICcuL3Rvb2xzL3Rvb2xzJ1xubG9nICAgICAgICAgICA9IHJlcXVpcmUgJy4vdG9vbHMvbG9nJ1xuc3RyICAgICAgICAgICA9IHJlcXVpcmUgJy4vdG9vbHMvc3RyJ1xucGtnICAgICAgICAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcbk1haW5NZW51ICAgICAgPSByZXF1aXJlICcuL21haW5tZW51J1xuXyAgICAgICAgICAgICA9IHJlcXVpcmUgJ2xvZGFzaCdcbmZzICAgICAgICAgICAgPSByZXF1aXJlICdmcydcbm5vb24gICAgICAgICAgPSByZXF1aXJlICdub29uJ1xuY29sb3JzICAgICAgICA9IHJlcXVpcmUgJ2NvbG9ycydcbmVsZWN0cm9uICAgICAgPSByZXF1aXJlICdlbGVjdHJvbidcbmNoaWxkcCAgICAgICAgPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuYXBwICAgICAgICAgICA9IGVsZWN0cm9uLmFwcFxuQnJvd3NlcldpbmRvdyA9IGVsZWN0cm9uLkJyb3dzZXJXaW5kb3dcbk1lbnUgICAgICAgICAgPSBlbGVjdHJvbi5NZW51XG5jbGlwYm9hcmQgICAgID0gZWxlY3Ryb24uY2xpcGJvYXJkXG5pcGMgICAgICAgICAgID0gZWxlY3Ryb24uaXBjTWFpblxuZGlhbG9nICAgICAgICA9IGVsZWN0cm9uLmRpYWxvZ1xubWFpbiAgICAgICAgICA9IHVuZGVmaW5lZCAjIDwgY3JlYXRlZCBpbiBhcHAub24gJ3JlYWR5J1xub3BlbkZpbGVzICAgICA9IFtdXG53aW5zICAgICAgICAgID0gW11cblxuIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgIFxuIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwIFxuXG5hcmdzICA9IHJlcXVpcmUoJ2thcmcnKSBcIlwiXCJcblxuI3twa2cucHJvZHVjdE5hbWV9XG5cbiAgICBmaWxlbGlzdCAgLiA/IGZpbGVzIHRvIG9wZW4gICAgICAgICAgIC4gKipcbiAgICB2ZXJib3NlICAgLiA/IGxvZyBtb3JlICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIERldlRvb2xzICAuID8gb3BlbiBkZXZlbG9wZXIgdG9vbHMgICAgLiA9IGZhbHNlXG4gICAgZGVidWcgICAgIC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2VcbiAgICB0ZXN0ICAgICAgLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBmYWxzZVxuICAgIFxudmVyc2lvbiAgI3twa2cudmVyc2lvbn1cblxuXCJcIlwiLCBkb250RXhpdDogdHJ1ZVxuXG5hcHAuZXhpdCAwIGlmIG5vdCBhcmdzP1xuXG53aGlsZSBhcmdzLmZpbGVsaXN0Lmxlbmd0aCBhbmQgZGlyRXhpc3RzIGZpcnN0IGFyZ3MuZmlsZWxpc3RcbiAgICBwcm9jZXNzLmNoZGlyIGFyZ3MuZmlsZWxpc3Quc2hpZnQoKVxuICAgIFxuaWYgYXJncy52ZXJib3NlXG4gICAgbG9nIGNvbG9ycy53aGl0ZS5ib2xkIFwiXFxuI3twa2cucHJvZHVjdE5hbWV9XCIsIGNvbG9ycy5ncmF5IFwidiN7cGtnLnZlcnNpb259XFxuXCJcbiAgICBsb2cgY29sb3JzLnllbGxvdy5ib2xkICdwcm9jZXNzJ1xuICAgIHAgPSBjd2Q6IHByb2Nlc3MuY3dkKClcbiAgICBsb2cgbm9vbi5zdHJpbmdpZnkgcCwgY29sb3JzOnRydWVcbiAgICBsb2cgY29sb3JzLnllbGxvdy5ib2xkICdhcmdzJ1xuICAgIGxvZyBub29uLnN0cmluZ2lmeSBhcmdzLCBjb2xvcnM6dHJ1ZVxuICAgIGxvZyAnJ1xuXG4jIDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwICAwMDAwMDAwMCAgIDAwMCAgICAgXG4jIDAwMCAgMDAwICAgICAgICAwMDAgICAgIFxuIyAwMDAgIDAwMCAgICAgICAgIDAwMDAwMDBcblxuaXBjLm9uICd0b2dnbGVEZXZUb29scycsICAgICAgICAgKGV2ZW50KSAgICAgICAgID0+IGV2ZW50LnNlbmRlci50b2dnbGVEZXZUb29scygpXG5pcGMub24gJ21heGltaXplV2luZG93JywgICAgICAgICAoZXZlbnQsIHdpbklEKSAgPT4gbWFpbi50b2dnbGVNYXhpbWl6ZSB3aW5XaXRoSUQgd2luSURcbmlwYy5vbiAnYWN0aXZhdGVXaW5kb3cnLCAgICAgICAgIChldmVudCwgd2luSUQpICA9PiBtYWluLmFjdGl2YXRlV2luZG93V2l0aElEIHdpbklEXG5pcGMub24gJ3NhdmVCb3VuZHMnLCAgICAgICAgICAgICAoZXZlbnQsIHdpbklEKSAgPT4gbWFpbi5zYXZlV2luQm91bmRzIHdpbldpdGhJRCB3aW5JRFxuaXBjLm9uICdyZWxvYWRXaW5kb3cnLCAgICAgICAgICAgKGV2ZW50LCB3aW5JRCkgID0+IG1haW4ucmVsb2FkV2luIHdpbldpdGhJRCB3aW5JRFxuaXBjLm9uICdyZWxvYWRNZW51JywgICAgICAgICAgICAgKCkgICAgICAgICAgICAgID0+IG1haW4ucmVsb2FkTWVudSgpICMgc3RpbGwgaW4gdXNlP1xuXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwXG4jIDAwMCAwIDAwMCAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwXG4jIDAwICAgICAwMCAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgXG5cbndpbnMgICAgICAgID0gLT4gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuc29ydCAoYSxiKSAtPiBhLmlkIC0gYi5pZCBcbmFjdGl2ZVdpbiAgID0gLT4gQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KClcbnZpc2libGVXaW5zID0gLT4gKHcgZm9yIHcgaW4gd2lucygpIHdoZW4gdz8uaXNWaXNpYmxlKCkgYW5kIG5vdCB3Py5pc01pbmltaXplZCgpKVxud2luV2l0aElEICAgPSAod2luSUQpIC0+XG4gICAgd2lkID0gcGFyc2VJbnQgd2luSURcbiAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgcmV0dXJuIHcgaWYgdy5pZCA9PSB3aWRcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgIDAwMCAwIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwXG5cbmNsYXNzIE1haW5cbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKG9wZW5GaWxlcykgLT4gXG4gICAgICAgIFxuICAgICAgICAjIGlmIGFwcC5tYWtlU2luZ2xlSW5zdGFuY2UgQG90aGVySW5zdGFuY2VTdGFydGVkXG4gICAgICAgICAgICAjIGFwcC5leGl0IDBcbiAgICAgICAgICAgICMgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBhcHAuc2V0TmFtZSBwa2cucHJvZHVjdE5hbWVcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBvcGVuRmlsZXMubGVuZ3RoIGFuZCBhcmdzLmZpbGVsaXN0Lmxlbmd0aFxuICAgICAgICAgICAgb3BlbkZpbGVzID0gZmlsZUxpc3QgYXJncy5maWxlbGlzdFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG9wZW5GaWxlcy5sZW5ndGhcbiAgICAgICAgICAgIGZvciBmaWxlIGluIG9wZW5GaWxlc1xuICAgICAgICAgICAgICAgIEBjcmVhdGVXaW5kb3cgZmlsZSAgICAgICAgICAgIFxuXG4gICAgICAgIGlmIG5vdCB3aW5zKCkubGVuZ3RoXG4gICAgICAgICAgICB3ID0gQGNyZWF0ZVdpbmRvdygpXG4gICAgICAgIFxuICAgICAgICBpZiBhcmdzLkRldlRvb2xzXG4gICAgICAgICAgICB3aW5zKCk/WzBdPy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxuXG4gICAgICAgIE1haW5NZW51LmluaXQgQFxuXG4gICAgICAgIHNldFRpbWVvdXQgQHNob3dXaW5kb3dzLCAxMFxuICAgICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwXG4gICAgIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwMCAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgMDAwXG4gICAgIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwICAwMDAwMDAwIFxuICAgICAgICBcbiAgICB3aW5zOiAgICAgICAgd2luc1xuICAgIHdpbldpdGhJRDogICB3aW5XaXRoSURcbiAgICBhY3RpdmVXaW46ICAgYWN0aXZlV2luXG4gICAgdmlzaWJsZVdpbnM6IHZpc2libGVXaW5zXG4gICAgXG4gICAgcmVsb2FkTWVudTogPT4gTWFpbk1lbnUuaW5pdCBAXG4gICAgICAgIFxuICAgIHJlbG9hZFdpbjogKHdpbikgLT5cbiAgICAgICAgaWYgd2luP1xuICAgICAgICAgICAgZGV2ID0gd2luLndlYkNvbnRlbnRzLmlzRGV2VG9vbHNPcGVuZWQoKVxuICAgICAgICAgICAgaWYgZGV2XG4gICAgICAgICAgICAgICAgd2luLndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQgd2luLndlYkNvbnRlbnRzLnJlbG9hZElnbm9yaW5nQ2FjaGUsIDEwMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHdpbi53ZWJDb250ZW50cy5yZWxvYWRJZ25vcmluZ0NhY2hlKClcblxuICAgIHRvZ2dsZU1heGltaXplOiAod2luKSAtPlxuICAgICAgICBpZiB3aW4uaXNNYXhpbWl6ZWQoKVxuICAgICAgICAgICAgd2luLnVubWF4aW1pemUoKSBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgd2luLm1heGltaXplKClcbiAgICBcbiAgICB0b2dnbGVXaW5kb3dzOiA9PlxuICAgICAgICBpZiB3aW5zKCkubGVuZ3RoXG4gICAgICAgICAgICBpZiB2aXNpYmxlV2lucygpLmxlbmd0aFxuICAgICAgICAgICAgICAgIGlmIGFjdGl2ZVdpbigpXG4gICAgICAgICAgICAgICAgICAgIEBoaWRlV2luZG93cygpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAcmFpc2VXaW5kb3dzKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2hvd1dpbmRvd3MoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAY3JlYXRlV2luZG93KClcblxuICAgIGhpZGVXaW5kb3dzOiA9PlxuICAgICAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgICAgIHcuaGlkZSgpXG4gICAgICAgICAgICBcbiAgICBzaG93V2luZG93czogPT5cbiAgICAgICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgICAgICB3LnNob3coKVxuICAgICAgICAgICAgYXBwLmRvY2s/LnNob3coKVxuICAgICAgICAgICAgXG4gICAgcmFpc2VXaW5kb3dzOiA9PlxuICAgICAgICBpZiB2aXNpYmxlV2lucygpLmxlbmd0aFxuICAgICAgICAgICAgZm9yIHcgaW4gdmlzaWJsZVdpbnMoKVxuICAgICAgICAgICAgICAgIHcuc2hvd0luYWN0aXZlKClcbiAgICAgICAgICAgIHZpc2libGVXaW5zKClbMF0uc2hvd0luYWN0aXZlKClcbiAgICAgICAgICAgIHZpc2libGVXaW5zKClbMF0uZm9jdXMoKVxuXG4gICAgYWN0aXZhdGVXaW5kb3dXaXRoSUQ6ICh3aWQpID0+XG4gICAgICAgIHcgPSB3aW5XaXRoSUQgd2lkXG4gICAgICAgIHJldHVybiBpZiBub3Qgdz9cbiAgICAgICAgaWYgbm90IHcuaXNWaXNpYmxlKCkgXG4gICAgICAgICAgICB3LnNob3coKVxuICAgICAgICB3LmZvY3VzKClcblxuICAgIGNsb3NlT3RoZXJXaW5kb3dzOj0+XG4gICAgICAgIGZvciB3IGluIHdpbnMoKVxuICAgICAgICAgICAgaWYgdyAhPSBhY3RpdmVXaW4oKVxuICAgICAgICAgICAgICAgIEBjbG9zZVdpbmRvdyB3XG4gICAgXG4gICAgY2xvc2VXaW5kb3c6ICh3KSA9PiB3Py5jbG9zZSgpXG4gICAgXG4gICAgY2xvc2VXaW5kb3dzOiA9PlxuICAgICAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgICAgIEBjbG9zZVdpbmRvdyB3XG4gICAgICAgICAgICBcbiAgICBjbG9zZVdpbmRvd3NBbmRRdWl0OiA9PiBcbiAgICAgICAgQGNsb3NlV2luZG93cygpXG4gICAgICAgIEBxdWl0KClcbiAgICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAwICAwMDBcbiAgICAjIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAwIDAwMFxuICAgICMgICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAwMDAgICAwMDBcbiAgICAgXG4gICAgc2NyZWVuU2l6ZTogLT4gZWxlY3Ryb24uc2NyZWVuLmdldFByaW1hcnlEaXNwbGF5KCkud29ya0FyZWFTaXplXG4gICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIDAwMDAwMDAwXG4gICAgICAgXG4gICAgbmV3V2luZG93V2l0aEZpbGU6IChmaWxlLCBwb3MpIC0+IEBjcmVhdGVXaW5kb3coZmlsZSwgcG9zKS5pZFxuICAgICAgICAgICAgXG4gICAgY3JlYXRlV2luZG93OiAob3BlbkZpbGUsIHBvcykgLT5cbiAgICAgICAgXG4gICAgICAgIHt3aWR0aCwgaGVpZ2h0fSA9IEBzY3JlZW5TaXplKClcbiAgICAgICAgd3cgPSBoZWlnaHQgKyAxMjJcbiAgICAgICAgXG4gICAgICAgIHdpbiA9IG5ldyBCcm93c2VyV2luZG93XG4gICAgICAgICAgICB4OiAgICAgICAgICAgICAgIHBhcnNlSW50ICh3aWR0aC13dykvMlxuICAgICAgICAgICAgeTogICAgICAgICAgICAgICAwXG4gICAgICAgICAgICB3aWR0aDogICAgICAgICAgIHd3XG4gICAgICAgICAgICBoZWlnaHQ6ICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgbWluV2lkdGg6ICAgICAgICAxNDBcbiAgICAgICAgICAgIG1pbkhlaWdodDogICAgICAgMTMwXG4gICAgICAgICAgICB1c2VDb250ZW50U2l6ZTogIHRydWVcbiAgICAgICAgICAgIGZ1bGxzY3JlZW5hYmxlOiAgdHJ1ZVxuICAgICAgICAgICAgc2hvdzogICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBoYXNTaGFkb3c6ICAgICAgIGZhbHNlXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJ1xuICAgICAgICAgICAgdGl0bGVCYXJTdHlsZTogICAnaGlkZGVuJ1xuXG4gICAgICAgIHdpbi5sb2FkVVJMIFwiZmlsZTovLyN7X19kaXJuYW1lfS9pbmRleC5odG1sXCJcbiAgICAgICAgYXBwLmRvY2s/LnNob3coKVxuICAgICAgICB3aW4ub24gJ2Nsb3NlJywgIEBvbkNsb3NlV2luXG4gICAgICAgIHdpbi5vbiAnbW92ZScsICAgQG9uTW92ZVdpblxuICAgICAgICB3aW4ub24gJ3Jlc2l6ZScsIEBvblJlc2l6ZVdpblxuICAgICAgICAgICAgICAgIFxuICAgICAgICB3aW5SZWFkeSA9ID0+IHdpbi53ZWJDb250ZW50cy5zZW5kICdzZXRXaW5JRCcsIHdpbi5pZFxuICAgICAgICB3aW5Mb2FkZWQgPSA9PlxuICAgICAgICBcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9uICdkb20tcmVhZHknLCAgICAgICB3aW5SZWFkeVxuICAgICAgICB3aW4ud2ViQ29udGVudHMub24gJ2RpZC1maW5pc2gtbG9hZCcsIHdpbkxvYWRlZFxuICAgICAgICB3aW4gXG4gICAgXG4gICAgb25Nb3ZlV2luOiAoZXZlbnQpID0+IFxuICAgIFxuICAgICMgMDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAgIDAwMCAgMDAwMDAwMCAgMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgICAgXG4gICAgIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAgICAgICAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgXG4gICAgb25SZXNpemVXaW46IChldmVudCkgPT4gXG4gICAgb25DbG9zZVdpbjogKGV2ZW50KSA9PlxuICAgICAgICBcbiAgICBvdGhlckluc3RhbmNlU3RhcnRlZDogKGFyZ3MsIGRpcikgPT5cbiAgICAgICAgaWYgbm90IHZpc2libGVXaW5zKCkubGVuZ3RoXG4gICAgICAgICAgICBAdG9nZ2xlV2luZG93cygpXG4gICAgICAgICAgICBcbiAgICAgICAgZm9yIGFyZyBpbiBhcmdzLnNsaWNlKDIpXG4gICAgICAgICAgICBjb250aW51ZSBpZiBhcmcuc3RhcnRzV2l0aCAnLSdcbiAgICAgICAgICAgIGZpbGUgPSBhcmdcbiAgICAgICAgICAgIGlmIG5vdCBhcmcuc3RhcnRzV2l0aCAnLydcbiAgICAgICAgICAgICAgICBmaWxlID0gcmVzb2x2ZSBkaXIgKyAnLycgKyBhcmdcbiAgICAgICAgICAgIGNvbnRpbnVlIGlmIG5vdCBmaWxlRXhpc3RzIGZpbGVcbiAgICAgICAgICAgIHcgPSBAYWN0aXZhdGVXaW5kb3dXaXRoRmlsZSBmaWxlXG4gICAgICAgICAgICB3ID0gQGNyZWF0ZVdpbmRvdyBmaWxlIGlmIG5vdCB3P1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICFhY3RpdmVXaW4oKVxuICAgICAgICAgICAgdmlzaWJsZVdpbnMoKVswXT8uZm9jdXMoKVxuICAgICAgICBcbiAgICBxdWl0OiA9PiBcbiAgICAgICAgYXBwLmV4aXQgMFxuICAgICAgICBwcm9jZXNzLmV4aXQgMFxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgXG4gICAgc2hvd0Fib3V0OiA9PiAgICBcbiAgICAgICAgY3dkID0gX19kaXJuYW1lXG4gICAgICAgIHcgPSBuZXcgQnJvd3NlcldpbmRvd1xuICAgICAgICAgICAgZGlyOiAgICAgICAgICAgICBjd2RcbiAgICAgICAgICAgIHByZWxvYWRXaW5kb3c6ICAgdHJ1ZVxuICAgICAgICAgICAgcmVzaXphYmxlOiAgICAgICB0cnVlXG4gICAgICAgICAgICBmcmFtZTogICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIHNob3c6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgY2VudGVyOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMzMzJyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2lkdGg6ICAgICAgICAgICA0MDBcbiAgICAgICAgICAgIGhlaWdodDogICAgICAgICAgNDIwXG4gICAgICAgIHcubG9hZFVSTCBcImZpbGU6Ly8je2N3ZH0vLi4vYWJvdXQuaHRtbFwiXG4gICAgICAgIHcub24gJ29wZW5GaWxlRGlhbG9nJywgQGNyZWF0ZVdpbmRvd1xuXG4gICAgbG9nOiAtPiBsb2cgKHN0cihzKSBmb3IgcyBpbiBbXS5zbGljZS5jYWxsIGFyZ3VtZW50cywgMCkuam9pbiBcIiBcIiBpZiBhcmdzLnZlcmJvc2VcbiAgICBkYmc6IC0+IGxvZyAoc3RyKHMpIGZvciBzIGluIFtdLnNsaWNlLmNhbGwgYXJndW1lbnRzLCAwKS5qb2luIFwiIFwiIGlmIGFyZ3MuZGVidWdcbiAgICAgICAgICAgIFxuIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAgICAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAwICAwMDBcbiMgMDAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcblxuYXBwLm9uICdyZWFkeScsID0+IG1haW4gPSBuZXcgTWFpbiBvcGVuRmlsZXNcbmFwcC5vbiAnd2luZG93LWFsbC1jbG9zZWQnLCA9PiBhcHAuZXhpdCAwXG4gICAgXG5hcHAuc2V0TmFtZSBwa2cucHJvZHVjdE5hbWVcblxuIl19
//# sourceURL=../coffee/app.coffee