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
        @object = obj
        @name   = name
        @save_actions = []
    
    hasAction: (action) -> _.find @actions, action
    
    addAction: (action) ->
        if @hasAction action
            actions.push action
            action.event = @
            action.init()
    
    removeAllActions: () ->
        while actions.length
            @removeAction last @actions
    
    getActionsOfObject: (object) ->
        actions = []
        for a in _.clone @actions
            if a.object == object
                actions.push a
        actions
    
    removeActionsOfObject: (object) ->
        for a in @actions
            @removeAction a if a.object == object
    
    removeActionWithName: (actionName) ->
        for a in @actions
            if a.name == actionName
                @removeAction a
    
    removeAction: (action) ->
        action.event = null
        _.pull @actions, action
        _.pull @save_actions, action
        _.pull @finished_actions, action
    
    triggerActions: () ->
        time = KEventHandler.getTime()
        @save_actions = KikiActionList (actions)
        while @save_actions.length
            action= last @save_actions
            action.performWithEvent @
            if @save_actions.length and action == last @save_actions
                @save_actions.pop()
    
    addFinishedAction: (action) -> @finished_actions.push action
    
    finishActions: () ->
        try 
            while @finished_actions.length
                action = last @finished_actions
                action.finished()
                if @finished_actions.length and action == last @finished_actions
                    @finished_actions.pop()
        catch err
            log "!!! finishActions failed !!!", err
        
module.exports = Event
