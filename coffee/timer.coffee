# 000000000  000  00     00  00000000  00000000 
#    000     000  000   000  000       000   000
#    000     000  000000000  0000000   0000000  
#    000     000  000 0 000  000       000   000
#    000     000  000   000  00000000  000   000

log = require '/Users/kodi/s/ko/js/tools/log'

class Timer
    
    @removeActionsOfObject: (o) -> log "removeActionsOfObject"
    @addAction:    (a) -> log "addAction"
    @removeAction: (a) -> log "removeAction"
        
module.exports = Timer
