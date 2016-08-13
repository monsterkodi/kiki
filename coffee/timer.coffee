# 000000000  000  00     00  00000000  00000000 
#    000     000  000   000  000       000   000
#    000     000  000000000  0000000   0000000  
#    000     000  000 0 000  000       000   000
#    000     000  000   000  00000000  000   000

log = require '/Users/kodi/s/ko/js/tools/log'

class Timer
    
    @event   = null
    @eventID = -1
    
    @init: -> 
        @eventID = world.addEventWithName 'timer'
        @event   = world.getEventWithId @eventID
        log "Timer.@init @eventID:#{@eventID} #{@event.name}"
    
    @removeActionsOfObject: (o) -> 
        log "removeActionsOfObject"
        @event.removeActionsOfObject o
        
    @addAction:    (a) -> 
        log "addAction #{a.name}"
        @event.addAction a
        
    @removeAction: (a) -> 
        log "removeAction #{a.name}"
        @event.removeAction a
        
module.exports = Timer
