
#    0000000    0000000  000000000   0000000   00000000 
#   000   000  000          000     000   000  000   000
#   000000000  000          000     000   000  0000000  
#   000   000  000          000     000   000  000   000
#   000   000   0000000     000      0000000   000   000
{
last
}       = require '/Users/kodi/s/ko/js/tools/tools'
log     = require '/Users/kodi/s/ko/js/tools/log'
Action  = require './action'
Timer   = require './timer'
Event   = require './event'
Emitter = require 'events'
_       = require 'lodash'

class Actor extends Emitter
    
    constructor: -> 
        @actions = []
        @events  = []
        super
        
    #   00000000  000   000  00000000  000   000  000000000
    #   000       000   000  000       0000  000     000   
    #   0000000    000 000   0000000   000 0 000     000   
    #   000          000     000       000  0000     000   
    #   00000000      0      00000000  000   000     000   
    
    addEventWithName: (eventName) ->
        # log "Actor.addEventWithName #{@name} eventName:#{eventName}"
        if @getEventWithName eventName # to be removed
            log "Actor.addEventWithName [WARNING] '#{eventName}' already in use!"
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
    
    addAction: (action) -> @actions[action.id] = action
        
    del: -> @deleteActions()

    deleteActions: -> 
        a?.del() for a in @actions
        @actions = []
            
    removeAction: (action) -> @actions[action.id] = null
 
    getActionWithId: (actionId) ->
        if @actions[actionId]?.id? and @actions[actionId].id != actionId
            throw new Error
        @actions[actionId]
        # if actionId < @actions.length and @actions[actionId].id == actionId
            # return @actions[actionId]
#     
        # # to be deleted...
        # log "[WARNING] Actor.getActionWithId #{actionId} [#{@actions.length}]", (a?.id for a in @actions)
        # for a in @actions
            # return a if a?.id == actionId

    getActionWithName: (name) -> 
        for a in @actions
            return a if a?.name == name 

    initAction: ->
    performAction: ->
    finishAction: -> log "actor.finishAction not implemented? #{@name}"
    actionFinished: -> log 'actor.actionFinished not implemented? #{@name}'
       
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
        # log "Actor.startTimedAction #{action.name} duration: #{duration}"
        Timer.addAction action        
  
module.exports = Actor
