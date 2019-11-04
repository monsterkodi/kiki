# 000000000  000  00     00  00000000  00000000 
#    000     000  000   000  000       000   000
#    000     000  000000000  0000000   0000000  
#    000     000  000 0 000  000       000   000
#    000     000  000   000  00000000  000   000

class Timer
    
    @event   = null
    @eventID = -1
    
    @init: -> 
        @eventID = world.addEventWithName 'timer'
        @event   = world.getEventWithId @eventID
        # klog "Timer.init @eventID:#{@eventID} #{@event.name}"
    
    @removeAllActions: -> @event.removeAllActions()
    @removeActionsOfObject: (o) -> 
        # klog "Timer.removeActionsOfObject"
        @event.removeActionsOfObject o
        
    @addAction: (a) -> 
        # klog "Timer.addAction #{a.name} duration: #{a.duration}"
        @event.addAction a
        
    @removeAction: (a) -> 
        # klog "Timer.removeAction #{a.name}"
        a.reset()
        @event.removeAction a
        
module.exports = Timer
