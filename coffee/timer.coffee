# 000000000  000  00     00  00000000  00000000 
#    000     000  000   000  000       000   000
#    000     000  000000000  0000000   0000000  
#    000     000  000 0 000  000       000   000
#    000     000  000   000  00000000  000   000

log    = require '/Users/kodi/s/ko/js/tools/log'

class Timer
    
    constructor: () ->
        
    removeActionsOfObject: (o) -> log "removeActionsOfObject", o
    addAction:    (a) -> log "addAction", a
    removeAction: (a) -> log "removeAction", a
        
module.exports = Timer
