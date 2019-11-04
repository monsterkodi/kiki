
#    0000000    0000000  000000000   0000000   00000000 
#   000   000  000          000     000   000  000   000
#   000000000  000          000     000   000  0000000  
#   000   000  000          000     000   000  000   000
#   000   000   0000000     000      0000000   000   000

{ _ } = require 'kxk'

Action  = require './action'
Timer   = require './timer'
Event   = require './event'
Emitter = require 'events'

class Actor extends Emitter
    
    constructor: -> 
        @actions = {}
        @events  = []
        super
        
    del: -> Timer.removeActionsOfObject @
        
    #   00000000  000   000  00000000  000   000  000000000
    #   000       000   000  000       0000  000     000   
    #   0000000    000 000   0000000   000 0 000     000   
    #   000          000     000       000  0000     000   
    #   00000000      0      00000000  000   000     000   
    
    addEventWithName: (eventName) ->
        if @getEventWithName eventName # to be removed
            # log "Actor.addEventWithName [WARNING] '#{eventName}' already in use!"
            return -1; # shouldn't happen anyway :-)
        @events.push new Event @, eventName
        @events.length-1

    getEventWithName: (name) ->
        for e in @events
            return e if e.name == name

    getEventWithId: (eventId) ->
        return @events[eventId]

    #    0000000    0000000  000000000  000   0000000   000   000
    #   000   000  000          000     000  000   000  0000  000
    #   000000000  000          000     000  000   000  000 0 000
    #   000   000  000          000     000  000   000  000  0000
    #   000   000   0000000     000     000   0000000   000   000
    
    addAction: (action) -> @actions[action.name] = action
        
    del: -> @deleteActions()

    deleteActions: -> 
        a?.del() for a in @actions
        @actions = []
            
    removeAction: (action) -> @actions[action.name] = null
 
    getActionWithId: (actionId) -> _.find @actions, (a) -> a?.id == actionId
    getActionWithName: (name) -> _.find @actions, (a) -> a?.name == name

    initAction: ->
    performAction: ->
    finishAction: -> 
    actionFinished: -> 
       
    #   000000000  000  00     00  00000000  00000000 
    #      000     000  000   000  000       000   000
    #      000     000  000000000  0000000   0000000  
    #      000     000  000 0 000  000       000   000
    #      000     000  000   000  00000000  000   000
 
    stopAction: (action) -> Timer.removeAction action 
       
    startTimer: (duration, mode) ->
        action = new Action @, 0, "timer", duration, mode
        @actions.push action
        Timer.addAction action
        
    startTimedAction: (action, duration) ->
        action.duration = duration if duration >= 0
        Timer.addAction action        
  
module.exports = Actor
