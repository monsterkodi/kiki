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
    @EXPLODE      = 1
    @TOGGLE       = 1
    @ROTATE       = 2
    @FLY          = 2
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
    @LOOK_UP      = 12
    @LOOK_DOWN    = 13
    @LOOK_RESET   = 14
    
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
        # log "newAction #{i} #{n} #{d} #{m}"
        @object     = o
        @name       = n
        @id         = i
        @mode       = m
        @duration   = d
        @event      = null
        @deleted    = false
        @reset()

    del: ->
        log "Action.del #{@name} #{@event?} #{@object?}"
        if @event?  then @event.removeAction @
        if @object? then @object.removeAction @
        @deleted = true

    init: () ->    @object.initAction @
    perform: () -> @object.performAction @
    finish: () ->  @object.finishAction @
    finished: () -> 
        # log "Action.finished #{@name} #{@object?.actionFinished?}"
        @object.actionFinished @
        return if @deleted
        @reset()
        # if @current >= @getDuration() # if keepRest wasn't called -> reset start and current values
            # @reset()
        # else 
            # log 'keeping rest', @current

    reset: () ->
        # log "action.reset #{@name}"
        @start   = 0 # world time
        @rest    = 0 
        @last    = 0 # relative (ms since @start)
        @current = 0 # relative (ms since @start)
        #@event   = null  

    takeOver: (action) ->
        log "takeOver #{action.rest} from #{action.name} this: #{@name}"
        @current = action.current
        @start   = action.start
        @last    = action.last
        @rest    = action.rest

    keepRest: () ->
        if @rest != 0
            @current = @rest
            @rest    = 0

    getRelativeTime:  -> @current / @getDuration() 
    getRelativeDelta: -> (@current-@last) / @getDuration()
    getDuration:      -> world.mapMsTime @duration 

    performWithEvent: (event) ->
        eventTime = event.getTime()
        # log "action.performWithEvent #{@name} eventTime #{eventTime}" if @name != 'noop'
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
            msDur = @getDuration()
            if currentDiff >= msDur
                @current = msDur
                # @start   = msDur
                @rest    = currentDiff - msDur
                # log "action #{name} performWithEvent start #{@start} rest #{currentDiff}-#{msDur} = #{@rest}" if @name != 'noop'
                @perform()
                @last    = 0
                
                if @mode == Action.CONTINUOUS
                    log 'Action.CONTINUOUS'
                    @current = @rest
                    @start = eventTime
                    @last  = 0
                    @rest  = 0
                    return
                event.removeAction @ if @mode == Action.ONCE
                
                @finish()
    
                if @mode == Action.REPEAT
                    if @current >= @getDuration() # if keepRest wasn't called -> reset start and current values
                        @reset()
                    return
                
                event.addFinishedAction @
            else
                @current = currentDiff
                @perform()
                @last    = @current
        
module.exports = Action
