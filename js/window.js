// koffee 1.4.0
var $, BrowserWindow, Kiki, _, clamp, del, electron, fileExists, fileList, fs, ipc, keyinfo, last, log, path, pkg, ref, remote, resolve, screenShot, screenSize, sh, str, sw, winID;

ref = require('./tools/tools'), last = ref.last, sw = ref.sw, sh = ref.sh, $ = ref.$, fileList = ref.fileList, fileExists = ref.fileExists, del = ref.del, clamp = ref.clamp, resolve = ref.resolve;

Kiki = require('./kiki');

keyinfo = require('./tools/keyinfo');

log = require('./tools/log');

str = require('./tools/str');

_ = require('lodash');

fs = require('fs');

path = require('path');

electron = require('electron');

pkg = require('../package.json');

ipc = electron.ipcRenderer;

remote = electron.remote;

BrowserWindow = remote.BrowserWindow;

winID = null;

ipc.on('setWinID', (function(_this) {
    return function(event, id) {
        return winID = window.winID = id;
    };
})(this));

screenSize = (function(_this) {
    return function() {
        return electron.screen.getPrimaryDisplay().workAreaSize;
    };
})(this);

window.onresize = (function(_this) {
    return function() {
        return window.stage.resized();
    };
})(this);

window.onunload = (function(_this) {
    return function() {};
})(this);

window.onload = (function(_this) {
    return function() {
        window.stage = new Kiki($(".stage"));
        return window.stage.start();
    };
})(this);

screenShot = function() {
    var win;
    win = BrowserWindow.fromId(winID);
    return win.capturePage(function(img) {
        var file;
        file = 'screenShot.png';
        return remote.require('fs').writeFile(file, img.toPng(), function(err) {
            if (err != null) {
                console.log('saving screenshot failed', err);
            }
            return console.log("screenshot saved to " + file);
        });
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsSUFBQTs7QUFBQSxNQU1jLE9BQUEsQ0FBUSxlQUFSLENBTmQsRUFDQSxlQURBLEVBRUEsV0FGQSxFQUVHLFdBRkgsRUFFTSxTQUZOLEVBR0EsdUJBSEEsRUFJQSwyQkFKQSxFQUtBLGFBTEEsRUFLSSxpQkFMSixFQU1BOztBQUNBLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUjs7QUFDZCxPQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSOztBQUNkLEdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7QUFDZCxHQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVI7O0FBQ2QsQ0FBQSxHQUFjLE9BQUEsQ0FBUSxRQUFSOztBQUNkLEVBQUEsR0FBYyxPQUFBLENBQVEsSUFBUjs7QUFDZCxJQUFBLEdBQWMsT0FBQSxDQUFRLE1BQVI7O0FBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSxVQUFSOztBQUNkLEdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVI7O0FBRWQsR0FBQSxHQUFjLFFBQVEsQ0FBQzs7QUFDdkIsTUFBQSxHQUFjLFFBQVEsQ0FBQzs7QUFDdkIsYUFBQSxHQUFnQixNQUFNLENBQUM7O0FBQ3ZCLEtBQUEsR0FBYzs7QUFRZCxHQUFHLENBQUMsRUFBSixDQUFPLFVBQVAsRUFBbUIsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFDLEtBQUQsRUFBUSxFQUFSO2VBQWUsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLEdBQWU7SUFBdEM7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5COztBQVFBLFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUE7ZUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFoQixDQUFBLENBQW1DLENBQUM7SUFBdkM7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOztBQUViLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQTtlQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBYixDQUFBO0lBQUg7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOztBQUNsQixNQUFNLENBQUMsUUFBUCxHQUFrQixDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUEsR0FBQTtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7O0FBQ2xCLE1BQU0sQ0FBQyxNQUFQLEdBQWtCLENBQUEsU0FBQSxLQUFBO1dBQUEsU0FBQTtRQUNkLE1BQU0sQ0FBQyxLQUFQLEdBQWUsSUFBSSxJQUFKLENBQVMsQ0FBQSxDQUFFLFFBQUYsQ0FBVDtlQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBYixDQUFBO0lBRmM7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOztBQVVsQixVQUFBLEdBQWEsU0FBQTtBQUNULFFBQUE7SUFBQSxHQUFBLEdBQU0sYUFBYSxDQUFDLE1BQWQsQ0FBcUIsS0FBckI7V0FDTixHQUFHLENBQUMsV0FBSixDQUFnQixTQUFDLEdBQUQ7QUFDWixZQUFBO1FBQUEsSUFBQSxHQUFPO2VBQ1AsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLENBQW9CLENBQUMsU0FBckIsQ0FBK0IsSUFBL0IsRUFBcUMsR0FBRyxDQUFDLEtBQUosQ0FBQSxDQUFyQyxFQUFrRCxTQUFDLEdBQUQ7WUFDL0MsSUFBd0MsV0FBeEM7Z0JBQUEsT0FBQSxDQUFDLEdBQUQsQ0FBSywwQkFBTCxFQUFpQyxHQUFqQyxFQUFBOzttQkFBNEMsT0FBQSxDQUMzQyxHQUQyQyxDQUN2QyxzQkFBQSxHQUF1QixJQURnQjtRQURHLENBQWxEO0lBRlksQ0FBaEI7QUFGUyIsInNvdXJjZXNDb250ZW50IjpbIiMgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuIyAwMDAgMCAwMDAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAwMCAgMDAwICAwMDAgMCAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMDBcbiMgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuIyAwMCAgICAgMDAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICAgICAwMDAwMDAwICAgMDAgICAgIDAwXG57XG5sYXN0LFxuc3csc2gsJCxcbmZpbGVMaXN0LFxuZmlsZUV4aXN0cyxcbmRlbCxjbGFtcCxcbnJlc29sdmV9ICAgID0gcmVxdWlyZSAnLi90b29scy90b29scydcbktpa2kgICAgICAgID0gcmVxdWlyZSAnLi9raWtpJ1xua2V5aW5mbyAgICAgPSByZXF1aXJlICcuL3Rvb2xzL2tleWluZm8nXG5sb2cgICAgICAgICA9IHJlcXVpcmUgJy4vdG9vbHMvbG9nJ1xuc3RyICAgICAgICAgPSByZXF1aXJlICcuL3Rvb2xzL3N0cidcbl8gICAgICAgICAgID0gcmVxdWlyZSAnbG9kYXNoJ1xuZnMgICAgICAgICAgPSByZXF1aXJlICdmcydcbnBhdGggICAgICAgID0gcmVxdWlyZSAncGF0aCdcbmVsZWN0cm9uICAgID0gcmVxdWlyZSAnZWxlY3Ryb24nXG5wa2cgICAgICAgICA9IHJlcXVpcmUgJy4uL3BhY2thZ2UuanNvbidcblxuaXBjICAgICAgICAgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxucmVtb3RlICAgICAgPSBlbGVjdHJvbi5yZW1vdGVcbkJyb3dzZXJXaW5kb3cgPSByZW1vdGUuQnJvd3NlcldpbmRvd1xud2luSUQgICAgICAgPSBudWxsXG5cbiMgMDAwICAwMDAwMDAwMCAgICAwMDAwMDAwXG4jIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIFxuIyAwMDAgIDAwMDAwMDAwICAgMDAwICAgICBcbiMgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jIDAwMCAgMDAwICAgICAgICAgMDAwMDAwMFxuXG5pcGMub24gJ3NldFdpbklEJywgKGV2ZW50LCBpZCkgPT4gd2luSUQgPSB3aW5kb3cud2luSUQgPSBpZFxuICAgIFxuIyAwMDAwMDAwMCAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwICAwMDAwMDAwICAwMDAwMDAwMFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAgICAwMDAgICAwMDAgICAgIFxuIyAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgIDAwMCAgICAwMDAwMDAwIFxuIyAwMDAgICAwMDAgIDAwMCAgICAgICAgICAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgIFxuIyAwMDAgICAwMDAgIDAwMDAwMDAwICAwMDAwMDAwICAgMDAwICAwMDAwMDAwICAwMDAwMDAwMFxuXG5zY3JlZW5TaXplID0gPT4gZWxlY3Ryb24uc2NyZWVuLmdldFByaW1hcnlEaXNwbGF5KCkud29ya0FyZWFTaXplXG5cbndpbmRvdy5vbnJlc2l6ZSA9ID0+IHdpbmRvdy5zdGFnZS5yZXNpemVkKClcbndpbmRvdy5vbnVubG9hZCA9ID0+IFxud2luZG93Lm9ubG9hZCAgID0gPT4gXG4gICAgd2luZG93LnN0YWdlID0gbmV3IEtpa2kgJChcIi5zdGFnZVwiKSBcbiAgICB3aW5kb3cuc3RhZ2Uuc3RhcnQoKVxuXG4jIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwMCAgIDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMFxuIzAwMCAgICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgICAgIDAwMDAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcbiMwMDAwMDAwICAgMDAwICAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgMCAwMDAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jICAgICAwMDAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgMDAwICAwMDAwICAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgIFxuIzAwMDAwMDAgICAgMDAwMDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgICAgICAwMDAgICBcblxuc2NyZWVuU2hvdCA9IC0+XG4gICAgd2luID0gQnJvd3NlcldpbmRvdy5mcm9tSWQgd2luSUQgXG4gICAgd2luLmNhcHR1cmVQYWdlIChpbWcpIC0+XG4gICAgICAgIGZpbGUgPSAnc2NyZWVuU2hvdC5wbmcnXG4gICAgICAgIHJlbW90ZS5yZXF1aXJlKCdmcycpLndyaXRlRmlsZSBmaWxlLCBpbWcudG9QbmcoKSwgKGVycikgLT4gXG4gICAgICAgICAgICBsb2cgJ3NhdmluZyBzY3JlZW5zaG90IGZhaWxlZCcsIGVyciBpZiBlcnI/XG4gICAgICAgICAgICBsb2cgXCJzY3JlZW5zaG90IHNhdmVkIHRvICN7ZmlsZX1cIlxuICAgICAgICAiXX0=
//# sourceURL=../coffee/window.coffee