# 00000000  000   000  00000000  000   000  000000000
# 000       000   000  000       0000  000     000
# 0000000    000 000   0000000   000 0 000     000
# 000          000     000       000  0000     000
# 00000000      0      00000000  000   000     000

{ last, kerror, klog, _ } = require 'kxk'
Action = require './action'

class Event

    @: (obj, name) ->
        @object  = obj
        @name    = name
        @time    = 0
        @actions = []
        @finished_actions = []

    getTime: -> @time
    hasAction: (action) -> _.find @actions, action

    addAction: (action) ->
        if action? and not @hasAction action
            return if world.noRotations and action.id == Action.ROTATE
            @actions.push action
            action.event = @
            action.init()
        else if not action?
            kerror 'Event.addAction no action?'
            throw new Error
        else
            klog "Event.addAction has action #{action.name}"

    removeAllActions: () ->
        while @actions.length
            @removeAction last @actions

    getActionsOfObject: (object) -> @actions.filter (a) -> a?.object == object

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
        _.pull @finished_actions, action

    triggerActions: () ->
        return if not @actions.length
        @time = world.getTime()
        actions = _.clone @actions
        while actions.length
            actions.pop().performWithEvent @

    addFinishedAction: (action) ->
        @finished_actions.push action

    finishActions: () ->
        while @finished_actions.length
            @finished_actions.pop().finished()

module.exports = Event
