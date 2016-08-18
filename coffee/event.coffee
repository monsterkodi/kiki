# 00000000  000   000  00000000  000   000  000000000
# 000       000   000  000       0000  000     000   
# 0000000    000 000   0000000   000 0 000     000   
# 000          000     000       000  0000     000   
# 00000000      0      00000000  000   000     000   
{
last
}      = require '/Users/kodi/s/ko/js/tools/tools'
log    = require '/Users/kodi/s/ko/js/tools/log'
_      = require 'lodash'

class Event
    
    constructor: (obj, name) ->
        @object  = obj
        @name    = name
        @time    = 0
        @actions = []
        @save_actions = []
        @finished_actions = []
    
    getTime: -> @time
    hasAction: (action) -> _.find @actions, action
    
    addAction: (action) ->
        if action? and not @hasAction action
            # log "Event.addAction #{action.name}"
            @actions.push action
            action.event = @
            action.init()
        else if not action?
            console.log 'Event.addAction no action?'
            throw new Error
        else
            log "Event.addAction  has action #{action.name}"
    
    removeAllActions: () ->
        while @actions.length
            @removeAction last @actions
    
    getActionsOfObject: (object) -> @actions.filter (a) -> a.object == object
    
    removeActionsOfObject: (object) ->
        for a in @actions
            @removeAction a if a.object == object
    
    removeActionWithName: (actionName) ->
        for a in @actions
            @removeAction a if a.name == actionName
    
    removeAction: (action) ->
        action.event = null
        action.reset()
        _.pull @actions, action
        _.pull @save_actions, action
        _.pull @finished_actions, action
    
    triggerActions: () ->
        return if not @actions.length
        @time = world.getTime()
        # log "trigger actions #{@name}", @actions.length
        @save_actions = _.clone @actions
        while @save_actions.length
            action = last @save_actions
            # log "event.performAction #{action.name}" if action.name != 'noop'
            action.performWithEvent @
            if @save_actions.length and action == last @save_actions
                @save_actions.pop()
    
    addFinishedAction: (action) -> 
        # log "Event.addFinishedAction #{action.name} #{@finished_actions.length}"
        @finished_actions.push action
    
    finishActions: () ->
        while @finished_actions.length
            # log "Event.finishActions pop:#{@finished_actions.length}", last(@finished_actions).name
            @finished_actions.pop().finished()
        
module.exports = Event
