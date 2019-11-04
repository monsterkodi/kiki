# 000000000  000  000000000  000      00000000  0000000     0000000   00000000 
#    000     000     000     000      000       000   000  000   000  000   000
#    000     000     000     000      0000000   0000000    000000000  0000000  
#    000     000     000     000      000       000   000  000   000  000   000
#    000     000     000     0000000  00000000  0000000    000   000  000   000

{ $ } = require 'kxk'
electron = require 'electron'
ipc      = electron.ipcRenderer

class Titlebar
    
    constructor: () ->
        @elem = $('.titlebar')
        @elem.ondblclick = (event) => 
            console.log window.winID
            ipc.send 'maximizeWindow', window.winID
        @selected = -1
                       
module.exports = Titlebar
