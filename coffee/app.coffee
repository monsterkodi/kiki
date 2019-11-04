#  0000000   00000000   00000000 
# 000   000  000   000  000   000
# 000000000  00000000   00000000 
# 000   000  000        000      
# 000   000  000        000      
{
first,
fileList,
dirExists,
fileExists,
resolve}      = require './tools/tools'
log           = require './tools/log'
str           = require './tools/str'
pkg           = require '../package.json'
MainMenu      = require './mainmenu'
_             = require 'lodash'
fs            = require 'fs'
noon          = require 'noon'
colors        = require 'colors'
electron      = require 'electron'
childp        = require 'child_process'
app           = electron.app
BrowserWindow = electron.BrowserWindow
Menu          = electron.Menu
clipboard     = electron.clipboard
ipc           = electron.ipcMain
dialog        = electron.dialog
main          = undefined # < created in app.on 'ready'
openFiles     = []
wins          = []

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000     
# 000000000  0000000    000  0000  0000000 
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000 

args  = require('karg') """

#{pkg.productName}

    filelist  . ? files to open           . **
    verbose   . ? log more                . = false
    DevTools  . ? open developer tools    . = false
    debug     .                             = false
    test      .                             = false
    
version  #{pkg.version}

""", dontExit: true

app.exit 0 if not args?

while args.filelist.length and dirExists first args.filelist
    process.chdir args.filelist.shift()
    
if args.verbose
    log colors.white.bold "\n#{pkg.productName}", colors.gray "v#{pkg.version}\n"
    log colors.yellow.bold 'process'
    p = cwd: process.cwd()
    log noon.stringify p, colors:true
    log colors.yellow.bold 'args'
    log noon.stringify args, colors:true
    log ''

# 000  00000000    0000000
# 000  000   000  000     
# 000  00000000   000     
# 000  000        000     
# 000  000         0000000

ipc.on 'toggleDevTools',         (event)         => event.sender.toggleDevTools()
ipc.on 'maximizeWindow',         (event, winID)  => main.toggleMaximize winWithID winID
ipc.on 'activateWindow',         (event, winID)  => main.activateWindowWithID winID
ipc.on 'saveBounds',             (event, winID)  => main.saveWinBounds winWithID winID
ipc.on 'reloadWindow',           (event, winID)  => main.reloadWin winWithID winID
ipc.on 'reloadMenu',             ()              => main.reloadMenu() # still in use?

# 000   000  000  000   000   0000000
# 000 0 000  000  0000  000  000     
# 000000000  000  000 0 000  0000000 
# 000   000  000  000  0000       000
# 00     00  000  000   000  0000000 

wins        = -> BrowserWindow.getAllWindows().sort (a,b) -> a.id - b.id 
activeWin   = -> BrowserWindow.getFocusedWindow()
visibleWins = -> (w for w in wins() when w?.isVisible() and not w?.isMinimized())
winWithID   = (winID) ->
    wid = parseInt winID
    for w in wins()
        return w if w.id == wid
                        
# 00     00   0000000   000  000   000
# 000   000  000   000  000  0000  000
# 000000000  000000000  000  000 0 000
# 000 0 000  000   000  000  000  0000
# 000   000  000   000  000  000   000

class Main
    
    constructor: (openFiles) -> 
        
        # if app.makeSingleInstance @otherInstanceStarted
            # app.exit 0
            # return
                                
        app.setName pkg.productName
        
        if not openFiles.length and args.filelist.length
            openFiles = fileList args.filelist
            
        if openFiles.length
            for file in openFiles
                @createWindow file            

        if not wins().length
            w = @createWindow()
        
        if args.DevTools
            wins()?[0]?.webContents.openDevTools()

        MainMenu.init @

        setTimeout @showWindows, 10
        
    # 000   000  000  000   000  0000000     0000000   000   000   0000000
    # 000 0 000  000  0000  000  000   000  000   000  000 0 000  000     
    # 000000000  000  000 0 000  000   000  000   000  000000000  0000000 
    # 000   000  000  000  0000  000   000  000   000  000   000       000
    # 00     00  000  000   000  0000000     0000000   00     00  0000000 
        
    wins:        wins
    winWithID:   winWithID
    activeWin:   activeWin
    visibleWins: visibleWins
    
    reloadMenu: => MainMenu.init @
        
    reloadWin: (win) ->
        if win?
            dev = win.webContents.isDevToolsOpened()
            if dev
                win.webContents.closeDevTools()
                setTimeout win.webContents.reloadIgnoringCache, 100
            else
                win.webContents.reloadIgnoringCache()

    toggleMaximize: (win) ->
        if win.isMaximized()
            win.unmaximize() 
        else
            win.maximize()
    
    toggleWindows: =>
        if wins().length
            if visibleWins().length
                if activeWin()
                    @hideWindows()
                else
                    @raiseWindows()
            else
                @showWindows()
        else
            @createWindow()

    hideWindows: =>
        for w in wins()
            w.hide()
            
    showWindows: =>
        for w in wins()
            w.show()
            app.dock?.show()
            
    raiseWindows: =>
        if visibleWins().length
            for w in visibleWins()
                w.showInactive()
            visibleWins()[0].showInactive()
            visibleWins()[0].focus()

    activateWindowWithID: (wid) =>
        w = winWithID wid
        return if not w?
        if not w.isVisible() 
            w.show()
        w.focus()

    closeOtherWindows:=>
        for w in wins()
            if w != activeWin()
                @closeWindow w
    
    closeWindow: (w) => w?.close()
    
    closeWindows: =>
        for w in wins()
            @closeWindow w
            
    closeWindowsAndQuit: => 
        @closeWindows()
        @quit()
      
    #  0000000   0000000  00000000   00000000  00000000  000   000
    # 000       000       000   000  000       000       0000  000
    # 0000000   000       0000000    0000000   0000000   000 0 000
    #      000  000       000   000  000       000       000  0000
    # 0000000    0000000  000   000  00000000  00000000  000   000
     
    screenSize: -> electron.screen.getPrimaryDisplay().workAreaSize
    
    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
       
    newWindowWithFile: (file, pos) -> @createWindow(file, pos).id
            
    createWindow: (openFile, pos) ->
        
        {width, height} = @screenSize()
        ww = height + 122
        
        win = new BrowserWindow
            x:               parseInt (width-ww)/2
            y:               0
            width:           ww
            height:          height
            minWidth:        140
            minHeight:       130
            useContentSize:  true
            fullscreenable:  true
            show:            true
            hasShadow:       false
            backgroundColor: '#000'
            titleBarStyle:   'hidden'

        win.loadURL "file://#{__dirname}/../js/index.html"
        app.dock?.show()
        win.on 'close',  @onCloseWin
        win.on 'move',   @onMoveWin
        win.on 'resize', @onResizeWin
                
        winReady = => win.webContents.send 'setWinID', win.id
        winLoaded = =>
        
        win.webContents.on 'dom-ready',       winReady
        win.webContents.on 'did-finish-load', winLoaded
        win 
    
    onMoveWin: (event) => 
    
    # 00000000   00000000   0000000  000  0000000  00000000
    # 000   000  000       000       000     000   000     
    # 0000000    0000000   0000000   000    000    0000000 
    # 000   000  000            000  000   000     000     
    # 000   000  00000000  0000000   000  0000000  00000000
    
    onResizeWin: (event) => 
    onCloseWin: (event) =>
        
    otherInstanceStarted: (args, dir) =>
        if not visibleWins().length
            @toggleWindows()
            
        for arg in args.slice(2)
            continue if arg.startsWith '-'
            file = arg
            if not arg.startsWith '/'
                file = resolve dir + '/' + arg
            continue if not fileExists file
            w = @activateWindowWithFile file
            w = @createWindow file if not w?
            
        if !activeWin()
            visibleWins()[0]?.focus()
        
    quit: => 
        app.exit 0
        process.exit 0
    
    #  0000000   0000000     0000000   000   000  000000000
    # 000   000  000   000  000   000  000   000     000   
    # 000000000  0000000    000   000  000   000     000   
    # 000   000  000   000  000   000  000   000     000   
    # 000   000  0000000     0000000    0000000      000   
    
    showAbout: =>    
        cwd = __dirname
        w = new BrowserWindow
            dir:             cwd
            preloadWindow:   true
            resizable:       true
            frame:           true
            show:            true
            center:          true
            backgroundColor: '#333'            
            width:           400
            height:          420
        w.loadURL "file://#{cwd}/../about.html"
        w.on 'openFileDialog', @createWindow

    log: -> log (str(s) for s in [].slice.call arguments, 0).join " " if args.verbose
    dbg: -> log (str(s) for s in [].slice.call arguments, 0).join " " if args.debug
            
#  0000000   00000000   00000000         0000000   000   000
# 000   000  000   000  000   000       000   000  0000  000
# 000000000  00000000   00000000        000   000  000 0 000
# 000   000  000        000        000  000   000  000  0000
# 000   000  000        000        000   0000000   000   000

app.on 'ready', => main = new Main openFiles
app.on 'window-all-closed', => app.exit 0
    
app.setName pkg.productName

