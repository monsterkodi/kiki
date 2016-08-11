#  0000000    0000000  000000000  000   0000000   000   000
# 000   000  000          000     000  000   000  0000  000
# 000000000  000          000     000  000   000  000 0 000
# 000   000  000          000     000  000   000  000  0000
# 000   000   0000000     000     000   0000000   000   000

_ = require 'lodash'

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
    
    @ONCE       = 0
    @CONTINUOUS = 1
    @REPEAT     = 2

    constructor: (o, i, n, d, m) ->
        if _.isPlainObject o 
            i = o.id ? 0
            n = o.name
            d = o.duration ? 0
            m = o.mode ? Action.ONCE
            o = o.func
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

    getRelativeTime: () ->
        return @current / @getDuration() 
 
    getDuration: ()  ->
        return world.mapMsTime @duration 

    performWithEvent: (event) ->
        eventTime = event.getTime()
    
        if @start == 0
            @start   = eventTime
            @current = 0
            @rest    = 0
            @last    = 0
            if @duration == 0 and @mode == Action.ONCE
                event.removeAction @
    
            @perform()
            
            @last = @current
            
            if @duration == 0 and @mode == Action.ONCE
                @finished()
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
                if @mode == Action.ONCE
                    event.removeAction @
                
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
