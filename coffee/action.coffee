#  0000000    0000000  000000000  000   0000000   000   000
# 000   000  000          000     000  000   000  0000  000
# 000000000  000          000     000  000   000  000 0 000
# 000   000  000          000     000  000   000  000  0000
# 000   000   0000000     000     000   0000000   000   000

log = require '/Users/kodi/s/ko/js/tools/log'
_   = require 'lodash'

class Action
    
    @NOOP         = 0
    @PUSH         = 1
    @FALL         = 2
    @FORWARD      = 3
    @CLIMB_UP     = 4
    @CLIMB_DOWN   = 5
    @TURN_LEFT    = 6
    @TURN_RIGHT   = 7
    @JUMP         = 8
    @JUMP_FORWARD = 9
    @FALL_FORWARD = 10
    @SHOOT        = 11
    @END          = 12
    @LOOK_UP      = 13
    @LOOK_DOWN    = 14
    @LOOK_RESET   = 15
    
    @ONCE       = 0
    @CONTINUOUS = 1
    @REPEAT     = 2

    constructor: (o, i, n, d, m) ->        
        if _.isPlainObject o 
            i = o.id ? -1
            n = o.name
            d = o.duration ? 0
            m = o.mode ? Action.ONCE
            o = o.func
        else
            i ?= -1
            m ?= Action.ONCE
            d ?= 0
        log "newAction #{i} #{n} #{d} #{m}"
        @object     = o
        @name       = n
        @id         = i
        @mode       = m
        @duration   = d
        @event      = null
        @delete_flag_ptr = false
        @reset()

# KikiAction (KikiActionObject* o, int d, int m ) 
# { 
    # action_object = o
    # action_id     = 0
    # mode          = m
    # duration      = d
    # event         = null

    # delete_flag_ptr = null

    # @reset()
# }

    del: ->
        if @event           then @event.removeAction @
        if @object          then @object.removeAction @
        if @delete_flag_ptr then @delete_flag_ptr = true

    init: () ->    @object.initAction @
    perform: () -> @object.performAction @
    finish: () ->  @object.finishAction @
    finished: () -> 
        @object.actionFinished @
        return if @delete_flag_ptr
    
        if @current == @getDuration() # if keepRest wasn't called -> reset start and current values
            @reset()

    reset: () ->
        @start   = 0
        @rest    = 0
        @last    = 0
        @current = 0

    takeRest: (action) ->
        @current = action.rest
        @start   = action.start
        @last    = 0
        @rest    = 0

    keepRest: () ->
        if @rest != 0
            @current = @rest
            @rest = 0

    getRelativeTime:  -> @current / @getDuration() 
    getRelativeDelta: -> (@current-@last) / @getDuration()
    getDuration:      -> world.mapMsTime @duration 

    performWithEvent: (event) ->
        eventTime = event.getTime()
    
        if @start == 0
            @start   = eventTime
            @current = 0
            @rest    = 0
            @last    = 0
            event.removeAction @ if @duration == 0 and @mode == Action.ONCE
            @perform()
            @last = @current
            @finished() if @duration == 0 and @mode == Action.ONCE
                
        else
            currentDiff = eventTime - @start
            if currentDiff >= @getDuration()
                @current = @getDuration()
    
                @start  += @current
                @rest    = eventTime - @start
                @perform()
                @last    = 0
                
                if @mode == Action.CONTINUOUS
                    @current = @rest
                    return
                event.removeAction @ if @mode == Action.ONCE
                
                @finish()
    
                if @mode == Action.REPEAT
                    if @current == @getDuration() # if keepRest wasn't called -> reset start and current values
                        @reset()
                    return
                
                event.addFinishedAction @
            else
                @current = currentDiff
                @perform()
                @last    = @current
        
module.exports = Action
