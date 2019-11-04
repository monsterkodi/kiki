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
        win.loadURL("file://" + __dirname + "/../js/index.html");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsSUFBQSwrT0FBQTtJQUFBOztBQUFBLE1BS2dCLE9BQUEsQ0FBUSxlQUFSLENBTGhCLEVBQ0EsaUJBREEsRUFFQSx1QkFGQSxFQUdBLHlCQUhBLEVBSUEsMkJBSkEsRUFLQTs7QUFDQSxHQUFBLEdBQWdCLE9BQUEsQ0FBUSxhQUFSOztBQUNoQixHQUFBLEdBQWdCLE9BQUEsQ0FBUSxhQUFSOztBQUNoQixHQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUjs7QUFDaEIsUUFBQSxHQUFnQixPQUFBLENBQVEsWUFBUjs7QUFDaEIsQ0FBQSxHQUFnQixPQUFBLENBQVEsUUFBUjs7QUFDaEIsRUFBQSxHQUFnQixPQUFBLENBQVEsSUFBUjs7QUFDaEIsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUjs7QUFDaEIsTUFBQSxHQUFnQixPQUFBLENBQVEsUUFBUjs7QUFDaEIsUUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUjs7QUFDaEIsTUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUjs7QUFDaEIsR0FBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLGFBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixJQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsU0FBQSxHQUFnQixRQUFRLENBQUM7O0FBQ3pCLEdBQUEsR0FBZ0IsUUFBUSxDQUFDOztBQUN6QixNQUFBLEdBQWdCLFFBQVEsQ0FBQzs7QUFDekIsSUFBQSxHQUFnQjs7QUFDaEIsU0FBQSxHQUFnQjs7QUFDaEIsSUFBQSxHQUFnQjs7QUFRaEIsSUFBQSxHQUFRLE9BQUEsQ0FBUSxNQUFSLENBQUEsQ0FBZ0IsSUFBQSxHQUV0QixHQUFHLENBQUMsV0FGa0IsR0FFTix5UkFGTSxHQVViLEdBQUcsQ0FBQyxPQVZTLEdBVUQsSUFWZixFQVlIO0lBQUEsUUFBQSxFQUFVLElBQVY7Q0FaRzs7QUFjUixJQUFrQixZQUFsQjtJ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LENBQUMsSUFBN0MsQ0FBa0QsR0FBbEQsQ0FBTixFQUFBOztJQUFEOzs7Ozs7QUFRVCxHQUFHLENBQUMsRUFBSixDQUFPLE9BQVAsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFBO2VBQUcsSUFBQSxHQUFPLElBQUksSUFBSixDQUFTLFNBQVQ7SUFBVjtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7O0FBQ0EsR0FBRyxDQUFDLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUE7ZUFBRyxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQ7SUFBSDtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7O0FBRUEsR0FBRyxDQUFDLE9BQUosQ0FBWSxHQUFHLENBQUMsV0FBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIjICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAgICAgICAwMDAgICAgICBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgIFxue1xuZmlyc3QsXG5maWxlTGlzdCxcbmRpckV4aXN0cyxcbmZpbGVFeGlzdHMsXG5yZXNvbHZlfSAgICAgID0gcmVxdWlyZSAnLi90b29scy90b29scydcbmxvZyAgICAgICAgICAgPSByZXF1aXJlICcuL3Rvb2xzL2xvZydcbnN0ciAgICAgICAgICAgPSByZXF1aXJlICcuL3Rvb2xzL3N0cidcbnBrZyAgICAgICAgICAgPSByZXF1aXJlICcuLi9wYWNrYWdlLmpzb24nXG5NYWluTWVudSAgICAgID0gcmVxdWlyZSAnLi9tYWlubWVudSdcbl8gICAgICAgICAgICAgPSByZXF1aXJlICdsb2Rhc2gnXG5mcyAgICAgICAgICAgID0gcmVxdWlyZSAnZnMnXG5ub29uICAgICAgICAgID0gcmVxdWlyZSAnbm9vbidcbmNvbG9ycyAgICAgICAgPSByZXF1aXJlICdjb2xvcnMnXG5lbGVjdHJvbiAgICAgID0gcmVxdWlyZSAnZWxlY3Ryb24nXG5jaGlsZHAgICAgICAgID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbmFwcCAgICAgICAgICAgPSBlbGVjdHJvbi5hcHBcbkJyb3dzZXJXaW5kb3cgPSBlbGVjdHJvbi5Ccm93c2VyV2luZG93XG5NZW51ICAgICAgICAgID0gZWxlY3Ryb24uTWVudVxuY2xpcGJvYXJkICAgICA9IGVsZWN0cm9uLmNsaXBib2FyZFxuaXBjICAgICAgICAgICA9IGVsZWN0cm9uLmlwY01haW5cbmRpYWxvZyAgICAgICAgPSBlbGVjdHJvbi5kaWFsb2dcbm1haW4gICAgICAgICAgPSB1bmRlZmluZWQgIyA8IGNyZWF0ZWQgaW4gYXBwLm9uICdyZWFkeSdcbm9wZW5GaWxlcyAgICAgPSBbXVxud2lucyAgICAgICAgICA9IFtdXG5cbiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgICAwMDAwMDAwICAgIDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICBcbiMgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgMDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgICAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCBcblxuYXJncyAgPSByZXF1aXJlKCdrYXJnJykgXCJcIlwiXG5cbiN7cGtnLnByb2R1Y3ROYW1lfVxuXG4gICAgZmlsZWxpc3QgIC4gPyBmaWxlcyB0byBvcGVuICAgICAgICAgICAuICoqXG4gICAgdmVyYm9zZSAgIC4gPyBsb2cgbW9yZSAgICAgICAgICAgICAgICAuID0gZmFsc2VcbiAgICBEZXZUb29scyAgLiA/IG9wZW4gZGV2ZWxvcGVyIHRvb2xzICAgIC4gPSBmYWxzZVxuICAgIGRlYnVnICAgICAuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IGZhbHNlXG4gICAgdGVzdCAgICAgIC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gZmFsc2VcbiAgICBcbnZlcnNpb24gICN7cGtnLnZlcnNpb259XG5cblwiXCJcIiwgZG9udEV4aXQ6IHRydWVcblxuYXBwLmV4aXQgMCBpZiBub3QgYXJncz9cblxud2hpbGUgYXJncy5maWxlbGlzdC5sZW5ndGggYW5kIGRpckV4aXN0cyBmaXJzdCBhcmdzLmZpbGVsaXN0XG4gICAgcHJvY2Vzcy5jaGRpciBhcmdzLmZpbGVsaXN0LnNoaWZ0KClcbiAgICBcbmlmIGFyZ3MudmVyYm9zZVxuICAgIGxvZyBjb2xvcnMud2hpdGUuYm9sZCBcIlxcbiN7cGtnLnByb2R1Y3ROYW1lfVwiLCBjb2xvcnMuZ3JheSBcInYje3BrZy52ZXJzaW9ufVxcblwiXG4gICAgbG9nIGNvbG9ycy55ZWxsb3cuYm9sZCAncHJvY2VzcydcbiAgICBwID0gY3dkOiBwcm9jZXNzLmN3ZCgpXG4gICAgbG9nIG5vb24uc3RyaW5naWZ5IHAsIGNvbG9yczp0cnVlXG4gICAgbG9nIGNvbG9ycy55ZWxsb3cuYm9sZCAnYXJncydcbiAgICBsb2cgbm9vbi5zdHJpbmdpZnkgYXJncywgY29sb3JzOnRydWVcbiAgICBsb2cgJydcblxuIyAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDBcbiMgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgXG4jIDAwMCAgMDAwMDAwMDAgICAwMDAgICAgIFxuIyAwMDAgIDAwMCAgICAgICAgMDAwICAgICBcbiMgMDAwICAwMDAgICAgICAgICAwMDAwMDAwXG5cbmlwYy5vbiAndG9nZ2xlRGV2VG9vbHMnLCAgICAgICAgIChldmVudCkgICAgICAgICA9PiBldmVudC5zZW5kZXIudG9nZ2xlRGV2VG9vbHMoKVxuaXBjLm9uICdtYXhpbWl6ZVdpbmRvdycsICAgICAgICAgKGV2ZW50LCB3aW5JRCkgID0+IG1haW4udG9nZ2xlTWF4aW1pemUgd2luV2l0aElEIHdpbklEXG5pcGMub24gJ2FjdGl2YXRlV2luZG93JywgICAgICAgICAoZXZlbnQsIHdpbklEKSAgPT4gbWFpbi5hY3RpdmF0ZVdpbmRvd1dpdGhJRCB3aW5JRFxuaXBjLm9uICdzYXZlQm91bmRzJywgICAgICAgICAgICAgKGV2ZW50LCB3aW5JRCkgID0+IG1haW4uc2F2ZVdpbkJvdW5kcyB3aW5XaXRoSUQgd2luSURcbmlwYy5vbiAncmVsb2FkV2luZG93JywgICAgICAgICAgIChldmVudCwgd2luSUQpICA9PiBtYWluLnJlbG9hZFdpbiB3aW5XaXRoSUQgd2luSURcbmlwYy5vbiAncmVsb2FkTWVudScsICAgICAgICAgICAgICgpICAgICAgICAgICAgICA9PiBtYWluLnJlbG9hZE1lbnUoKSAjIHN0aWxsIGluIHVzZT9cblxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwMDAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwICAgICAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwIFxuXG53aW5zICAgICAgICA9IC0+IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLnNvcnQgKGEsYikgLT4gYS5pZCAtIGIuaWQgXG5hY3RpdmVXaW4gICA9IC0+IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpXG52aXNpYmxlV2lucyA9IC0+ICh3IGZvciB3IGluIHdpbnMoKSB3aGVuIHc/LmlzVmlzaWJsZSgpIGFuZCBub3Qgdz8uaXNNaW5pbWl6ZWQoKSlcbndpbldpdGhJRCAgID0gKHdpbklEKSAtPlxuICAgIHdpZCA9IHBhcnNlSW50IHdpbklEXG4gICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgIHJldHVybiB3IGlmIHcuaWQgPT0gd2lkXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiMgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMFxuIyAwMDAwMDAwMDAgIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDBcbiMgMDAwIDAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMFxuXG5jbGFzcyBNYWluXG4gICAgXG4gICAgY29uc3RydWN0b3I6IChvcGVuRmlsZXMpIC0+IFxuICAgICAgICBcbiAgICAgICAgIyBpZiBhcHAubWFrZVNpbmdsZUluc3RhbmNlIEBvdGhlckluc3RhbmNlU3RhcnRlZFxuICAgICAgICAgICAgIyBhcHAuZXhpdCAwXG4gICAgICAgICAgICAjIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgYXBwLnNldE5hbWUgcGtnLnByb2R1Y3ROYW1lXG4gICAgICAgIFxuICAgICAgICBpZiBub3Qgb3BlbkZpbGVzLmxlbmd0aCBhbmQgYXJncy5maWxlbGlzdC5sZW5ndGhcbiAgICAgICAgICAgIG9wZW5GaWxlcyA9IGZpbGVMaXN0IGFyZ3MuZmlsZWxpc3RcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBvcGVuRmlsZXMubGVuZ3RoXG4gICAgICAgICAgICBmb3IgZmlsZSBpbiBvcGVuRmlsZXNcbiAgICAgICAgICAgICAgICBAY3JlYXRlV2luZG93IGZpbGUgICAgICAgICAgICBcblxuICAgICAgICBpZiBub3Qgd2lucygpLmxlbmd0aFxuICAgICAgICAgICAgdyA9IEBjcmVhdGVXaW5kb3coKVxuICAgICAgICBcbiAgICAgICAgaWYgYXJncy5EZXZUb29sc1xuICAgICAgICAgICAgd2lucygpP1swXT8ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKClcblxuICAgICAgICBNYWluTWVudS5pbml0IEBcblxuICAgICAgICBzZXRUaW1lb3V0IEBzaG93V2luZG93cywgMTBcbiAgICAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAwICAgMDAwICAgMDAwMDAwMFxuICAgICMgMDAwIDAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICBcbiAgICAjIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgMDAwICAwMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMFxuICAgICMgMDAgICAgIDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMCBcbiAgICAgICAgXG4gICAgd2luczogICAgICAgIHdpbnNcbiAgICB3aW5XaXRoSUQ6ICAgd2luV2l0aElEXG4gICAgYWN0aXZlV2luOiAgIGFjdGl2ZVdpblxuICAgIHZpc2libGVXaW5zOiB2aXNpYmxlV2luc1xuICAgIFxuICAgIHJlbG9hZE1lbnU6ID0+IE1haW5NZW51LmluaXQgQFxuICAgICAgICBcbiAgICByZWxvYWRXaW46ICh3aW4pIC0+XG4gICAgICAgIGlmIHdpbj9cbiAgICAgICAgICAgIGRldiA9IHdpbi53ZWJDb250ZW50cy5pc0RldlRvb2xzT3BlbmVkKClcbiAgICAgICAgICAgIGlmIGRldlxuICAgICAgICAgICAgICAgIHdpbi53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKClcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0IHdpbi53ZWJDb250ZW50cy5yZWxvYWRJZ25vcmluZ0NhY2hlLCAxMDBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB3aW4ud2ViQ29udGVudHMucmVsb2FkSWdub3JpbmdDYWNoZSgpXG5cbiAgICB0b2dnbGVNYXhpbWl6ZTogKHdpbikgLT5cbiAgICAgICAgaWYgd2luLmlzTWF4aW1pemVkKClcbiAgICAgICAgICAgIHdpbi51bm1heGltaXplKCkgXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHdpbi5tYXhpbWl6ZSgpXG4gICAgXG4gICAgdG9nZ2xlV2luZG93czogPT5cbiAgICAgICAgaWYgd2lucygpLmxlbmd0aFxuICAgICAgICAgICAgaWYgdmlzaWJsZVdpbnMoKS5sZW5ndGhcbiAgICAgICAgICAgICAgICBpZiBhY3RpdmVXaW4oKVxuICAgICAgICAgICAgICAgICAgICBAaGlkZVdpbmRvd3MoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQHJhaXNlV2luZG93cygpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNob3dXaW5kb3dzKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGNyZWF0ZVdpbmRvdygpXG5cbiAgICBoaWRlV2luZG93czogPT5cbiAgICAgICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgICAgICB3LmhpZGUoKVxuICAgICAgICAgICAgXG4gICAgc2hvd1dpbmRvd3M6ID0+XG4gICAgICAgIGZvciB3IGluIHdpbnMoKVxuICAgICAgICAgICAgdy5zaG93KClcbiAgICAgICAgICAgIGFwcC5kb2NrPy5zaG93KClcbiAgICAgICAgICAgIFxuICAgIHJhaXNlV2luZG93czogPT5cbiAgICAgICAgaWYgdmlzaWJsZVdpbnMoKS5sZW5ndGhcbiAgICAgICAgICAgIGZvciB3IGluIHZpc2libGVXaW5zKClcbiAgICAgICAgICAgICAgICB3LnNob3dJbmFjdGl2ZSgpXG4gICAgICAgICAgICB2aXNpYmxlV2lucygpWzBdLnNob3dJbmFjdGl2ZSgpXG4gICAgICAgICAgICB2aXNpYmxlV2lucygpWzBdLmZvY3VzKClcblxuICAgIGFjdGl2YXRlV2luZG93V2l0aElEOiAod2lkKSA9PlxuICAgICAgICB3ID0gd2luV2l0aElEIHdpZFxuICAgICAgICByZXR1cm4gaWYgbm90IHc/XG4gICAgICAgIGlmIG5vdCB3LmlzVmlzaWJsZSgpIFxuICAgICAgICAgICAgdy5zaG93KClcbiAgICAgICAgdy5mb2N1cygpXG5cbiAgICBjbG9zZU90aGVyV2luZG93czo9PlxuICAgICAgICBmb3IgdyBpbiB3aW5zKClcbiAgICAgICAgICAgIGlmIHcgIT0gYWN0aXZlV2luKClcbiAgICAgICAgICAgICAgICBAY2xvc2VXaW5kb3cgd1xuICAgIFxuICAgIGNsb3NlV2luZG93OiAodykgPT4gdz8uY2xvc2UoKVxuICAgIFxuICAgIGNsb3NlV2luZG93czogPT5cbiAgICAgICAgZm9yIHcgaW4gd2lucygpXG4gICAgICAgICAgICBAY2xvc2VXaW5kb3cgd1xuICAgICAgICAgICAgXG4gICAgY2xvc2VXaW5kb3dzQW5kUXVpdDogPT4gXG4gICAgICAgIEBjbG9zZVdpbmRvd3MoKVxuICAgICAgICBAcXVpdCgpXG4gICAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwMCAgMDAwXG4gICAgIyAwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDBcbiAgICAjICAgICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMCAgMDAwMFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwXG4gICAgIFxuICAgIHNjcmVlblNpemU6IC0+IGVsZWN0cm9uLnNjcmVlbi5nZXRQcmltYXJ5RGlzcGxheSgpLndvcmtBcmVhU2l6ZVxuICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAwMDAwMDAwMFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAwMDAwMDAwIFxuICAgICMgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgIFxuICAgICMgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMFxuICAgICAgIFxuICAgIG5ld1dpbmRvd1dpdGhGaWxlOiAoZmlsZSwgcG9zKSAtPiBAY3JlYXRlV2luZG93KGZpbGUsIHBvcykuaWRcbiAgICAgICAgICAgIFxuICAgIGNyZWF0ZVdpbmRvdzogKG9wZW5GaWxlLCBwb3MpIC0+XG4gICAgICAgIFxuICAgICAgICB7d2lkdGgsIGhlaWdodH0gPSBAc2NyZWVuU2l6ZSgpXG4gICAgICAgIHd3ID0gaGVpZ2h0ICsgMTIyXG4gICAgICAgIFxuICAgICAgICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvd1xuICAgICAgICAgICAgeDogICAgICAgICAgICAgICBwYXJzZUludCAod2lkdGgtd3cpLzJcbiAgICAgICAgICAgIHk6ICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgd2lkdGg6ICAgICAgICAgICB3d1xuICAgICAgICAgICAgaGVpZ2h0OiAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIG1pbldpZHRoOiAgICAgICAgMTQwXG4gICAgICAgICAgICBtaW5IZWlnaHQ6ICAgICAgIDEzMFxuICAgICAgICAgICAgdXNlQ29udGVudFNpemU6ICB0cnVlXG4gICAgICAgICAgICBmdWxsc2NyZWVuYWJsZTogIHRydWVcbiAgICAgICAgICAgIHNob3c6ICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgaGFzU2hhZG93OiAgICAgICBmYWxzZVxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMCdcbiAgICAgICAgICAgIHRpdGxlQmFyU3R5bGU6ICAgJ2hpZGRlbidcblxuICAgICAgICB3aW4ubG9hZFVSTCBcImZpbGU6Ly8je19fZGlybmFtZX0vLi4vanMvaW5kZXguaHRtbFwiXG4gICAgICAgIGFwcC5kb2NrPy5zaG93KClcbiAgICAgICAgd2luLm9uICdjbG9zZScsICBAb25DbG9zZVdpblxuICAgICAgICB3aW4ub24gJ21vdmUnLCAgIEBvbk1vdmVXaW5cbiAgICAgICAgd2luLm9uICdyZXNpemUnLCBAb25SZXNpemVXaW5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgd2luUmVhZHkgPSA9PiB3aW4ud2ViQ29udGVudHMuc2VuZCAnc2V0V2luSUQnLCB3aW4uaWRcbiAgICAgICAgd2luTG9hZGVkID0gPT5cbiAgICAgICAgXG4gICAgICAgIHdpbi53ZWJDb250ZW50cy5vbiAnZG9tLXJlYWR5JywgICAgICAgd2luUmVhZHlcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9uICdkaWQtZmluaXNoLWxvYWQnLCB3aW5Mb2FkZWRcbiAgICAgICAgd2luIFxuICAgIFxuICAgIG9uTW92ZVdpbjogKGV2ZW50KSA9PiBcbiAgICBcbiAgICAjIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIFxuICAgICMgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAwMDAgICAgMDAwMDAwMCBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgICAgICAgICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMFxuICAgIFxuICAgIG9uUmVzaXplV2luOiAoZXZlbnQpID0+IFxuICAgIG9uQ2xvc2VXaW46IChldmVudCkgPT5cbiAgICAgICAgXG4gICAgb3RoZXJJbnN0YW5jZVN0YXJ0ZWQ6IChhcmdzLCBkaXIpID0+XG4gICAgICAgIGlmIG5vdCB2aXNpYmxlV2lucygpLmxlbmd0aFxuICAgICAgICAgICAgQHRvZ2dsZVdpbmRvd3MoKVxuICAgICAgICAgICAgXG4gICAgICAgIGZvciBhcmcgaW4gYXJncy5zbGljZSgyKVxuICAgICAgICAgICAgY29udGludWUgaWYgYXJnLnN0YXJ0c1dpdGggJy0nXG4gICAgICAgICAgICBmaWxlID0gYXJnXG4gICAgICAgICAgICBpZiBub3QgYXJnLnN0YXJ0c1dpdGggJy8nXG4gICAgICAgICAgICAgICAgZmlsZSA9IHJlc29sdmUgZGlyICsgJy8nICsgYXJnXG4gICAgICAgICAgICBjb250aW51ZSBpZiBub3QgZmlsZUV4aXN0cyBmaWxlXG4gICAgICAgICAgICB3ID0gQGFjdGl2YXRlV2luZG93V2l0aEZpbGUgZmlsZVxuICAgICAgICAgICAgdyA9IEBjcmVhdGVXaW5kb3cgZmlsZSBpZiBub3Qgdz9cbiAgICAgICAgICAgIFxuICAgICAgICBpZiAhYWN0aXZlV2luKClcbiAgICAgICAgICAgIHZpc2libGVXaW5zKClbMF0/LmZvY3VzKClcbiAgICAgICAgXG4gICAgcXVpdDogPT4gXG4gICAgICAgIGFwcC5leGl0IDBcbiAgICAgICAgcHJvY2Vzcy5leGl0IDBcbiAgICBcbiAgICAjICAwMDAwMDAwICAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwMDAwMDAwXG4gICAgIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuICAgICMgMDAwMDAwMDAwICAwMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiAgICAjIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gICAgIyAwMDAgICAwMDAgIDAwMDAwMDAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgICAgIDAwMCAgIFxuICAgIFxuICAgIHNob3dBYm91dDogPT4gICAgXG4gICAgICAgIGN3ZCA9IF9fZGlybmFtZVxuICAgICAgICB3ID0gbmV3IEJyb3dzZXJXaW5kb3dcbiAgICAgICAgICAgIGRpcjogICAgICAgICAgICAgY3dkXG4gICAgICAgICAgICBwcmVsb2FkV2luZG93OiAgIHRydWVcbiAgICAgICAgICAgIHJlc2l6YWJsZTogICAgICAgdHJ1ZVxuICAgICAgICAgICAgZnJhbWU6ICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICBzaG93OiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIGNlbnRlcjogICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzMzMycgICAgICAgICAgICBcbiAgICAgICAgICAgIHdpZHRoOiAgICAgICAgICAgNDAwXG4gICAgICAgICAgICBoZWlnaHQ6ICAgICAgICAgIDQyMFxuICAgICAgICB3LmxvYWRVUkwgXCJmaWxlOi8vI3tjd2R9Ly4uL2Fib3V0Lmh0bWxcIlxuICAgICAgICB3Lm9uICdvcGVuRmlsZURpYWxvZycsIEBjcmVhdGVXaW5kb3dcblxuICAgIGxvZzogLT4gbG9nIChzdHIocykgZm9yIHMgaW4gW10uc2xpY2UuY2FsbCBhcmd1bWVudHMsIDApLmpvaW4gXCIgXCIgaWYgYXJncy52ZXJib3NlXG4gICAgZGJnOiAtPiBsb2cgKHN0cihzKSBmb3IgcyBpbiBbXS5zbGljZS5jYWxsIGFyZ3VtZW50cywgMCkuam9pbiBcIiBcIiBpZiBhcmdzLmRlYnVnXG4gICAgICAgICAgICBcbiMgIDAwMDAwMDAgICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAwMDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgMCAwMDBcbiMgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAgMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgMDAwICAgICAgICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG5cbmFwcC5vbiAncmVhZHknLCA9PiBtYWluID0gbmV3IE1haW4gb3BlbkZpbGVzXG5hcHAub24gJ3dpbmRvdy1hbGwtY2xvc2VkJywgPT4gYXBwLmV4aXQgMFxuICAgIFxuYXBwLnNldE5hbWUgcGtnLnByb2R1Y3ROYW1lXG5cbiJdfQ==
//# sourceURL=../coffee/app.coffee