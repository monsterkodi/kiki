# 000   000  000  000   000  0000000     0000000   000   000
# 000 0 000  000  0000  000  000   000  000   000  000 0 000
# 000000000  000  000 0 000  000   000  000   000  000000000
# 000   000  000  000  0000  000   000  000   000  000   000
# 00     00  000  000   000  0000000     0000000   00     00
{
last,
sw,sh,$,
fileList,
fileExists,
del,clamp,
resolve}    = require './tools/tools'
Kiki        = require './kiki'
keyinfo     = require './tools/keyinfo'
log         = require './tools/log'
str         = require './tools/str'
_           = require 'lodash'
fs          = require 'fs'
path        = require 'path'
electron    = require 'electron'
pkg         = require '../package.json'

ipc         = electron.ipcRenderer
remote      = electron.remote
BrowserWindow = remote.BrowserWindow
winID       = null

# 000  00000000    0000000
# 000  000   000  000     
# 000  00000000   000     
# 000  000        000     
# 000  000         0000000

ipc.on 'setWinID', (event, id) => winID = window.winID = id
    
# 00000000   00000000   0000000  000  0000000  00000000
# 000   000  000       000       000     000   000     
# 0000000    0000000   0000000   000    000    0000000 
# 000   000  000            000  000   000     000     
# 000   000  00000000  0000000   000  0000000  00000000

screenSize = => electron.screen.getPrimaryDisplay().workAreaSize

window.onresize = => window.stage.resized()
window.onunload = => 
window.onload   = => 
    window.stage = new Kiki $(".stage") 
    window.stage.start()

# 0000000   0000000  00000000   00000000  00000000  000   000   0000000  000   000   0000000   000000000
#000       000       000   000  000       000       0000  000  000       000   000  000   000     000   
#0000000   000       0000000    0000000   0000000   000 0 000  0000000   000000000  000   000     000   
#     000  000       000   000  000       000       000  0000       000  000   000  000   000     000   
#0000000    0000000  000   000  00000000  00000000  000   000  0000000   000   000   0000000      000   

screenShot = ->
    win = BrowserWindow.fromId winID 
    win.capturePage (img) ->
        file = 'screenShot.png'
        remote.require('fs').writeFile file, img.toPng(), (err) -> 
            log 'saving screenshot failed', err if err?
            log "screenshot saved to #{file}"
        