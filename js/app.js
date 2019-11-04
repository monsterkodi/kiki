// koffee 1.4.0
var BrowserWindow, Main, MainMenu, Menu, activeWin, app, args, clipboard, colors, dialog, electron, ipc, klog, kstr, main, noon, openFiles, p, pkg, ref, slash, visibleWins, win, winWithID, wins,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ref = require('kxk'), colors = ref.colors, slash = ref.slash, args = ref.args, noon = ref.noon, kstr = ref.kstr, app = ref.app, win = ref.win, klog = ref.klog;

pkg = require('../package.json');

MainMenu = require('./mainmenu');

electron = require('electron');

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
        var w;
        app.setName(pkg.productName);
        w = this.createWindow();
        if (args.DevTools) {
            w.webContents.openDevTools();
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
        var height, ref1, ref2, width, winLoaded, winReady, ww;
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
                file = slash.resolve(dir + '/' + arg);
            }
            if (!slash.isFile(file)) {
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
            return klog(((function() {
                var i, len, ref1, results;
                ref1 = [].slice.call(arguments, 0);
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                    s = ref1[i];
                    results.push(kstr(s));
                }
                return results;
            }).apply(this, arguments)).join(" "));
        }
    };

    Main.prototype.dbg = function() {
        var s;
        if (args.debug) {
            return klog(((function() {
                var i, len, ref1, results;
                ref1 = [].slice.call(arguments, 0);
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                    s = ref1[i];
                    results.push(kstr(s));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsSUFBQSw2TEFBQTtJQUFBOztBQUFBLE1BQXNELE9BQUEsQ0FBUSxLQUFSLENBQXRELEVBQUUsbUJBQUYsRUFBVSxpQkFBVixFQUFpQixlQUFqQixFQUF1QixlQUF2QixFQUE2QixlQUE3QixFQUFtQyxhQUFuQyxFQUF3QyxhQUF4QyxFQUE2Qzs7QUFFN0MsR0FBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0FBQ2hCLFFBQUEsR0FBZ0IsT0FBQSxDQUFRLFlBQVI7O0FBQ2hCLFFBQUEsR0FBZ0IsT0FBQSxDQUFRLFVBQVI7O0FBQ2hCLEdBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixhQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsSUFBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLFNBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixHQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsTUFBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLElBQUEsR0FBZ0I7O0FBQ2hCLFNBQUEsR0FBZ0I7O0FBQ2hCLElBQUEsR0FBZ0I7O0FBUWhCLElBQUEsR0FBUSxPQUFBLENBQVEsTUFBUixDQUFBLENBQWdCLElBQUEsR0FFdEIsR0FBRyxDQUFDLFdBRmtCLEdBRU4seVJBRk0sR0FVYixHQUFHLENBQUMsT0FWUyxHQVVELElBVmYsRUFZSDtJQUFBLFFBQUEsRUFBVSxJQUFWO0NBWkc7O0FBY1IsSUFBa0IsWUFBbEI7SUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQsRUFBQTs7O0FBRUEsSUFBRyxJQUFJLENBQUMsT0FBUjtJQUNHLE9BQUEsQ0FBQyxHQUFELENBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLElBQUEsR0FBSyxHQUFHLENBQUMsV0FBM0IsRUFBMEMsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFBLEdBQUksR0FBRyxDQUFDLE9B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O21CQWVYLEdBQUEsR0FBSyxTQUFBO0FBQUcsWUFBQTtRQUFBLElBQStELElBQUksQ0FBQyxPQUFwRTttQkFBQSxJQUFBLENBQUs7O0FBQUM7QUFBQTtxQkFBQSxzQ0FBQTs7aUNBQUEsSUFBQSxDQUFLLENBQUw7QUFBQTs7cUNBQUQsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxHQUFuRCxDQUFMLEVBQUE7O0lBQUg7O21CQUNMLEdBQUEsR0FBSyxTQUFBO0FBQUcsWUFBQTtRQUFBLElBQStELElBQUksQ0FBQyxLQUFwRTttQkFBQSxJQUFBLENBQUs7O0FBQUM7QUFBQTtxQkFBQSxzQ0FBQTs7aUNBQUEsSUFBQSxDQUFLLENBQUw7QUFBQTs7cUNBQUQsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxHQUFuRCxDQUFMLEVBQUE7O0lBQUg7Ozs7OztBQVFULEdBQUcsQ0FBQyxFQUFKLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUE7ZUFBRyxJQUFBLEdBQU8sSUFBSSxJQUFKLENBQVMsU0FBVDtJQUFWO0FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjs7QUFDQSxHQUFHLENBQUMsRUFBSixDQUFPLG1CQUFQLEVBQTRCLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQTtlQUFHLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVDtJQUFIO0FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1Qjs7QUFFQSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQUcsQ0FBQyxXQUFoQiIsInNvdXJjZXNDb250ZW50IjpbIiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgIFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgXG5cbnsgY29sb3JzLCBzbGFzaCwgYXJncywgbm9vbiwga3N0ciwgYXBwLCB3aW4sIGtsb2cgfSA9IHJlcXVpcmUgJ2t4aydcblxucGtnICAgICAgICAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcbk1haW5NZW51ICAgICAgPSByZXF1aXJlICcuL21haW5tZW51J1xuZWxlY3Ryb24gICAgICA9IHJlcXVpcmUgJ2VsZWN0cm9uJ1xuYXBwICAgICAgICAgICA9IGVsZWN0cm9uLmFwcFxuQnJvd3NlcldpbmRvdyA9IGVsZWN0cm9uLkJyb3dzZXJXaW5kb3dcbk1lbnUgICAgICAgICAgPSBlbGVjdHJvbi5NZW51XG5jbGlwYm9hcmQgICAgID0gZWxlY3Ryb24uY2xpcGJvYXJkXG5pcGMgICAgICAgICAgID0gZWxlY3Ryb24uaXBjTWFpblxuZGlhbG9nICAgICAgICA9IGVsZWN0cm9uLmRpYWxvZ1xubWFpbiAgICAgICAgICA9IHVuZGVmaW5lZCAjIDwgY3JlYXRlZCBpbiBhcHAub24gJ3JlYWR5J1xub3BlbkZpbGVzICAgICA9IFtdXG53aW5zICAgICAgICAgID0gW11cblxuIyAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgIFxuIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAwMDAwICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwIFxuXG5hcmdzICA9IHJlcXVpcmUoJ2thcmcnKSBcIlwiXCJcblxuI3twa2cucHJvZHVjdE5hbWV9XG5cbiAgICBmaWxlbGlzdCAgLiA/IGZpbGVzIHRvIG9wZW4gICAgICAgICAgIC4gKipcbiAgICB2ZXJib3NlICAgLiA/IGxvZyBtb3JlICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIERldlRvb2xzICAuID8gb3BlbiBkZXZlbG9wZXIgdG9vbHMgICAgLiA9IGZhbHNlXG4gICAgZGVidWcgICAgIC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2VcbiAgICB0ZXN0ICAgICAgLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBmYWxzZVxuICAgIFxudmVyc2lvbiAgI3twa2cudmVyc2lvbn1cblxuXCJcIlwiLCBkb250RXhpdDogdHJ1ZVxuXG5hcHAuZXhpdCAwIGlmIG5vdCBhcmdzP1xuICAgIFxuaWYgYXJncy52ZXJib3NlXG4gICAgbG9nIGNvbG9ycy53aGl0ZS5ib2xkIFwiXFxuI3twa2cucHJvZHVjdE5hbWV9XCIsIGNvbG9ycy5ncmF5IFwidiN7cGtnLnZlcnNpb259XFxuXCJcbiAgICBsb2cgY29sb3JzLnllbGxvdy5ib2xkICdwcm9jZXNzJ1xuICAgIHAgPSBjd2Q6IHByb2Nlc3MuY3dkKClcbiAgICBsb2cgbm9vbi5zdHJpbmdpZnkgcCwgY29sb3JzOnRydWVcbiAgICBsb2cgY29sb3JzLnllbGxvdy5ib2xkICdhcmdzJ1xuICAgIGxvZyBub29uLnN0cmluZ2lmeSBhcmdzLCBjb2xvcnM6dHJ1ZVxuICAgIGxvZyAnJ1xuXG4jIDAwMCAgMDAwMDAwMDAgICAgMDAwMDAwMFxuIyAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICBcbiMgMDAwICAwMDAwMDAwMCAgIDAwMCAgICAgXG4jIDAwMCAgMDAwICAgICAgICAwMDAgICAgIFxuIyAwMDAgIDAwMCAgICAgICAgIDAwMDAwMDBcblxuaXBjLm9uICd0b2dnbGVEZXZUb29scycsICAgICAgICAgKGV2ZW50KSAgICAgICAgID0+IGV2ZW50LnNlbmRlci50b2dnbGVEZXZUb29scygpXG5pcGMub24gJ21heGltaXplV2luZG93JywgICAgICAgICAoZXZlbnQsIHdpbklEKSAgPT4gbWFpbi50b2dnbGVNYXhpbWl6ZSB3aW5XaXRoSUQgd2luSURcbmlwYy5vbiAnYWN0aXZhdGVXaW5kb3cnLCAgICAgICAgIChldmVudCwgd2luSUQpICA9PiBtYWluLmFjdGl2YXRlV2luZG93V2l0aElEIHdpbklEXG5pcGMub24gJ3NhdmVCb3VuZHMnLCAgICAgICAgICAgICAoZXZlbnQsIHdpbklEKSAgPT4gbWFpbi5zYXZlV2luQm91bmRzIHdpbldpdGhJRCB3aW5JRFxuaXBjLm9uICdyZWxvYWRXaW5kb3cnLCAgICAgICAgICAgKGV2ZW50LCB3aW5JRCkgID0+IG1haW4ucmVsb2FkV2luIHdpbldpdGhJRCB3aW5JRFxuaXBjLm9uICdyZWxvYWRNZW51JywgICAgICAgICAgICAgKCkgICAgICAgICAgICAgID0+IG1haW4ucmVsb2FkTWVudSgpICMgc3RpbGwgaW4gdXNlP1xuXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwXG4jIDAwMCAwIDAwMCAgMDAwICAwMDAwICAwMDAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwXG4jIDAwICAgICAwMCAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgXG5cbndpbnMgICAgICAgID0gLT4gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuc29ydCAoYSxiKSAtPiBhLmlkIC0gYi5pZCBcbmFjdGl2ZVdpbiAgID0gLT4gQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KClcbnZpc2libGVXaW5zID0gLT4gKHcgZm9yIHcgaW4gd2lucygpIHdoZW4gdz8uaXNWaXNpYmxlKCkgYW5kIG5vdCB3Py5pc01pbmltaXplZCgpKVxud2luV2l0aElEICAgPSAod2luSUQpIC0+XG4gICAgd2lkID0gcGFyc2VJbnQgd2luSURcbiAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgcmV0dXJuIHcgaWYgdy5pZCA9PSB3aWRcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuIyAwMCAgICAgMDAgICAwMDAwMDAwICAgMDAwICAwMDAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMCAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgIDAwMCAwIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgIDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwXG5cbmNsYXNzIE1haW5cbiAgICBcbiAgICBjb25zdHJ1Y3RvcjogKG9wZW5GaWxlcykgLT4gXG4gICAgICAgIFxuICAgICAgICAjIGlmIGFwcC5tYWtlU2luZ2xlSW5zdGFuY2UgQG90aGVySW5zdGFuY2VTdGFydGVkXG4gICAgICAgICAgICAjIGFwcC5leGl0IDBcbiAgICAgICAgICAgICMgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBhcHAuc2V0TmFtZSBwa2cucHJvZHVjdE5hbWVcbiAgICAgICAgXG4gICAgICAgIHcgPSBAY3JlYXRlV2luZG93KClcbiAgICAgICAgXG4gICAgICAgIGlmIGFyZ3MuRGV2VG9vbHNcbiAgICAgICAgICAgIHcud2ViQ29udGVudHMub3BlbkRldlRvb2xzKClcblxuICAgICAgICBNYWluTWVudS5pbml0IEBcblxuICAgICAgICBzZXRUaW1lb3V0IEBzaG93V2luZG93cywgMTBcbiAgICAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMFxuICAgICMgMDAgICAgIDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgd2luczogICAgICAgIHdpbnNcbiAgICB3aW5XaXRoSUQ6ICAgd2luV2l0aElEXG4gICAgYWN0aXZlV2luOiAgIGFjdGl2ZVdpblxuICAgIHZpc2libGVXaW5zOiB2aXNpYmxlV2luc1xuICAgIFxuICAgIHJlbG9hZE1lbnU6ID0+IE1haW5NZW51LmluaXQgQFxuICAgICAgICBcbiAgICByZWxvYWRXaW46ICh3aW4pIC0+XG4gICAgICAgIGlmIHdpbj9cbiAgICAgICAgICAgIGRldiA9IHdpbi53ZWJDb250ZW50cy5pc0RldlRvb2xzT3BlbmVkKClcbiAgICAgICAgICAgIGlmIGRldlxuICAgICAgICAgICAgICAgIHdpbi53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKClcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0IHdpbi53ZWJDb250ZW50cy5yZWxvYWRJZ25vcmluZ0NhY2hlLCAxMDBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3aW4ud2ViQ29udGVudHMucmVsb2FkSWdub3JpbmdDYWNoZSgpXG5cbiAgICB0b2dnbGVNYXhpbWl6ZTogKHdpbikgLT5cbiAgICAgICAgaWYgd2luLmlzTWF4aW1pemVkKClcbiAgICAgICAgICAgIHdpbi51bm1heGltaXplKCkgXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHdpbi5tYXhpbWl6ZSgpXG4gICAgXG4gICAgdG9nZ2xlV2luZG93czogPT5cbiAgICAgICAgaWYgd2lucygpLmxlbmd0aFxuICAgICAgICAgICAgaWYgdmlzaWJsZVdpbnMoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICBpZiBhY3RpdmVXaW4oKVxuICAgICAgICAgICAgICAgICAgICBAaGlkZVdpbmRvd3MoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQHJhaXNlV2luZG93cygpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNob3dXaW5kb3dzKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGNyZWF0ZVdpbmRvdygpXG5cbiAgICBoaWRlV2luZG93czogPT5cbiAgICAgICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgICAgICB3LmhpZGUoKVxuICAgICAgICAgICAgXG4gICAgc2hvd1dpbmRvd3M6ID0+XG4gICAgICAgIGZvciB3IGluIHdpbnMoKVxuICAgICAgICAgICAgdy5zaG93KClcbiAgICAgICAgICAgIGFwcC5kb2NrPy5zaG93KClcbiAgICAgICAgICAgIFxuICAgIHJhaXNlV2luZG93czogPT5cbiAgICAgICAgaWYgdmlzaWJsZVdpbnMoKS5sZW5ndGhcbiAgICAgICAgICAgIGZvciB3IGluIHZpc2libGVXaW5zKClcbiAgICAgICAgICAgICAgICB3LnNob3dJbmFjdGl2ZSgpXG4gICAgICAgICAgICB2aXNpYmxlV2lucygpWzBdLnNob3dJbmFjdGl2ZSgpXG4gICAgICAgICAgICB2aXNpYmxlV2lucygpWzBdLmZvY3VzKClcblxuICAgIGFjdGl2YXRlV2luZG93V2l0aElEOiAod2lkKSA9PlxuICAgICAgICB3ID0gd2luV2l0aElEIHdpZFxuICAgICAgICByZXR1cm4gaWYgbm90IHc/XG4gICAgICAgIGlmIG5vdCB3LmlzVmlzaWJsZSgpIFxuICAgICAgICAgICAgdy5zaG93KClcbiAgICAgICAgdy5mb2N1cygpXG5cbiAgICBjbG9zZU90aGVyV2luZG93czo9PlxuICAgICAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgICAgIGlmIHcgIT0gYWN0aXZlV2luKClcbiAgICAgICAgICAgICAgICBAY2xvc2VXaW5kb3cgd1xuICAgIFxuICAgIGNsb3NlV2luZG93OiAodykgPT4gdz8uY2xvc2UoKVxuICAgIFxuICAgIGNsb3NlV2luZG93czogPT5cbiAgICAgICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgICAgICBAY2xvc2VXaW5kb3cgd1xuICAgICAgICAgICAgXG4gICAgY2xvc2VXaW5kb3dzQW5kUXVpdDogPT4gXG4gICAgICAgIEBjbG9zZVdpbmRvd3MoKVxuICAgICAgICBAcXVpdCgpXG4gICAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIFxuICAgIHNjcmVlblNpemU6IC0+IGVsZWN0cm9uLnNjcmVlbi5nZXRQcmltYXJ5RGlzcGxheSgpLndvcmtBcmVhU2l6ZVxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgIFxuICAgIG5ld1dpbmRvd1dpdGhGaWxlOiAoZmlsZSwgcG9zKSAtPiBAY3JlYXRlV2luZG93KGZpbGUsIHBvcykuaWRcbiAgICAgICAgICAgIFxuICAgIGNyZWF0ZVdpbmRvdzogKG9wZW5GaWxlLCBwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICB7d2lkdGgsIGhlaWdodH0gPSBAc2NyZWVuU2l6ZSgpXG4gICAgICAgIHd3ID0gaGVpZ2h0ICsgMTIyXG4gICAgICAgIFxuICAgICAgICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvd1xuICAgICAgICAgICAgeDogICAgICAgICAgICAgICBwYXJzZUludCAod2lkdGgtd3cpLzJcbiAgICAgICAgICAgIHk6ICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgd2lkdGg6ICAgICAgICAgICB3d1xuICAgICAgICAgICAgaGVpZ2h0OiAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIG1pbldpZHRoOiAgICAgICAgMTQwXG4gICAgICAgICAgICBtaW5IZWlnaHQ6ICAgICAgIDEzMFxuICAgICAgICAgICAgdXNlQ29udGVudFNpemU6ICB0cnVlXG4gICAgICAgICAgICBmdWxsc2NyZWVuYWJsZTogIHRydWVcbiAgICAgICAgICAgIHNob3c6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgaGFzU2hhZG93OiAgICAgICBmYWxzZVxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMCdcbiAgICAgICAgICAgIHRpdGxlQmFyU3R5bGU6ICAgJ2hpZGRlbidcblxuICAgICAgICB3aW4ubG9hZFVSTCBcImZpbGU6Ly8je19fZGlybmFtZX0vaW5kZXguaHRtbFwiXG4gICAgICAgIGFwcC5kb2NrPy5zaG93KClcbiAgICAgICAgd2luLm9uICdjbG9zZScsICBAb25DbG9zZVdpblxuICAgICAgICB3aW4ub24gJ21vdmUnLCAgIEBvbk1vdmVXaW5cbiAgICAgICAgd2luLm9uICdyZXNpemUnLCBAb25SZXNpemVXaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgd2luUmVhZHkgPSA9PiB3aW4ud2ViQ29udGVudHMuc2VuZCAnc2V0V2luSUQnLCB3aW4uaWRcbiAgICAgICAgd2luTG9hZGVkID0gPT5cbiAgICAgICAgXG4gICAgICAgIHdpbi53ZWJDb250ZW50cy5vbiAnZG9tLXJlYWR5JywgICAgICAgd2luUmVhZHlcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9uICdkaWQtZmluaXNoLWxvYWQnLCB3aW5Mb2FkZWRcbiAgICAgICAgd2luIFxuICAgIFxuICAgIG9uTW92ZVdpbjogKGV2ZW50KSA9PiBcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIG9uUmVzaXplV2luOiAoZXZlbnQpID0+IFxuICAgIG9uQ2xvc2VXaW46IChldmVudCkgPT5cbiAgICAgICAgXG4gICAgb3RoZXJJbnN0YW5jZVN0YXJ0ZWQ6IChhcmdzLCBkaXIpID0+XG4gICAgICAgIGlmIG5vdCB2aXNpYmxlV2lucygpLmxlbmd0aFxuICAgICAgICAgICAgQHRvZ2dsZVdpbmRvd3MoKVxuICAgICAgICAgICAgXG4gICAgICAgIGZvciBhcmcgaW4gYXJncy5zbGljZSgyKVxuICAgICAgICAgICAgY29udGludWUgaWYgYXJnLnN0YXJ0c1dpdGggJy0nXG4gICAgICAgICAgICBmaWxlID0gYXJnXG4gICAgICAgICAgICBpZiBub3QgYXJnLnN0YXJ0c1dpdGggJy8nXG4gICAgICAgICAgICAgICAgZmlsZSA9IHNsYXNoLnJlc29sdmUgZGlyICsgJy8nICsgYXJnXG4gICAgICAgICAgICBjb250aW51ZSBpZiBub3Qgc2xhc2guaXNGaWxlIGZpbGVcbiAgICAgICAgICAgIHcgPSBAYWN0aXZhdGVXaW5kb3dXaXRoRmlsZSBmaWxlXG4gICAgICAgICAgICB3ID0gQGNyZWF0ZVdpbmRvdyBmaWxlIGlmIG5vdCB3P1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICFhY3RpdmVXaW4oKVxuICAgICAgICAgICAgdmlzaWJsZVdpbnMoKVswXT8uZm9jdXMoKVxuICAgICAgICBcbiAgICBxdWl0OiA9PiBcbiAgICAgICAgYXBwLmV4aXQgMFxuICAgICAgICBwcm9jZXNzLmV4aXQgMFxuICAgIFxuICAgICMgIDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAwMDAwMDAwMDAgIDAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgICAwMDAwMDAwICAgICAgMDAwICAgXG4gICAgXG4gICAgc2hvd0Fib3V0OiA9PiAgICBcbiAgICAgICAgY3dkID0gX19kaXJuYW1lXG4gICAgICAgIHcgPSBuZXcgQnJvd3NlcldpbmRvd1xuICAgICAgICAgICAgZGlyOiAgICAgICAgICAgICBjd2RcbiAgICAgICAgICAgIHByZWxvYWRXaW5kb3c6ICAgdHJ1ZVxuICAgICAgICAgICAgcmVzaXphYmxlOiAgICAgICB0cnVlXG4gICAgICAgICAgICBmcmFtZTogICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIHNob3c6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgY2VudGVyOiAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMzMzJyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2lkdGg6ICAgICAgICAgICA0MDBcbiAgICAgICAgICAgIGhlaWdodDogICAgICAgICAgNDIwXG4gICAgICAgIHcubG9hZFVSTCBcImZpbGU6Ly8je2N3ZH0vLi4vYWJvdXQuaHRtbFwiXG4gICAgICAgIHcub24gJ29wZW5GaWxlRGlhbG9nJywgQGNyZWF0ZVdpbmRvd1xuXG4gICAgbG9nOiAtPiBrbG9nIChrc3RyKHMpIGZvciBzIGluIFtdLnNsaWNlLmNhbGwgYXJndW1lbnRzLCAwKS5qb2luIFwiIFwiIGlmIGFyZ3MudmVyYm9zZVxuICAgIGRiZzogLT4ga2xvZyAoa3N0cihzKSBmb3IgcyBpbiBbXS5zbGljZS5jYWxsIGFyZ3VtZW50cywgMCkuam9pbiBcIiBcIiBpZiBhcmdzLmRlYnVnXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbmFwcC5vbiAncmVhZHknLCA9PiBtYWluID0gbmV3IE1haW4gb3BlbkZpbGVzXG5hcHAub24gJ3dpbmRvdy1hbGwtY2xvc2VkJywgPT4gYXBwLmV4aXQgMFxuICAgIFxuYXBwLnNldE5hbWUgcGtnLnByb2R1Y3ROYW1lXG5cbiJdfQ==
//# sourceURL=../coffee/app.coffee