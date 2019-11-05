# 000000000  000  00     00  00000000  00000000 
#    000     000  000   000  000       000   000
#    000     000  000000000  0000000   0000000  
#    000     000  000 0 000  000       000   000
#    000     000  000   000  00000000  000   000

class Timer
    
    @: (@world) ->
        
        @eventID = @world.addEventWithName 'timer'
        @event   = @world.getEventWithId @eventID
    
    @removeAllActions: -> 
    
        world.timer.event.removeAllActions()
        
    @removeActionsOfObject: (o) -> 
    
        world.timer.event.removeActionsOfObject o
        
    @addAction: (a) ->
        
        world.timer.event.addAction a
        
    @removeAction: (a) -> 
        
        a.reset()
        world.timer.event.removeAction a
        
    @triggerActions: ->
        
        world.timer.event.triggerActions()
        
    @finishActions: ->
        
        world.timer.event.finishActions()
        
module.exports = Timer
