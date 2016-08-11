
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
Event   = require './event'
Emitter = require 'events'
_       = require 'lodash'

class Actor extends Emitter
    
    constructor: -> 
        @actions = []
        @events  = []
        super

    addAction: (action) ->   
        @actions.push action if not _.find @actions, action
        
    del: -> @deleteActions()

    deleteActions: ->
        last(@actions).del() while @actions.length

    initAction: ->
    performAction: ->
    finishAction: ->
    actionFinished: ->
        
    stopAction: (action) ->
        # Controller.timer_event.removeAction action 
       
    startTimer: (duration, mode) ->
        action = new Action @, 0, "timer", duration, mode
        @actions.push action
        # Controller.timer_event.addAction action
        
    startTimedAction: (action, duration) ->
        action.duration = duration if duration >= 0
        # Controller.timer_event.addAction action
        
    removeAction: (action) ->
        _.pull @actions, action
 
    getActionWithId: (actionId) ->
        if actionId < @actions.length and @actions[actionId].id == actionId
            return @actions[actionId]
    
        # to be deleted...
        log "[WARNING] Actor.getActionWithId #{actionId} [#{@actions.length}]"
        for a in @actions
            return a if a.id == actionId

    getActionWithName: (name) ->
        for a in @actions
            return a if action.name = name

    addEventWithName: (eventName) ->
        if @getEventWithName eventName # to be removed
            log "Actor.addEventWithName '#{eventName}' already in use!"
            return -1; # shouldn't happen anyway :-)
        @events.push new Event @, eventName
        @events.length-1

    getEventWithName: (name) ->
        for e in @events
            return e if e.name = name

    getEventWithId: (eventId) ->
        return @events[eventId]
  
module.exports = Actor
