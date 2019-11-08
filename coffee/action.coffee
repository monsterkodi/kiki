#  0000000    0000000  000000000  000   0000000   000   000
# 000   000  000          000     000  000   000  0000  000
# 000000000  000          000     000  000   000  000 0 000
# 000   000  000          000     000  000   000  000  0000
# 000   000   0000000     000     000   0000000   000   000

{ _ } = require 'kxk'

class Action
    
    @NOOP         = 0
    @ROTATE       = 1 # switch, gate, bomb
    @FLY          = 2 # bullet
    @TOGGLE       = 3 # switch, gate
    @FALL         = 4 # pushable
    @PUSH         = 5 # pushable
    @EXPLODE      = 6 # bomb
    @IMPLODE      = 7 # bomb
    @FORWARD      = 8 # bot
    @CLIMB_UP     = 9 # bot
    @CLIMB_DOWN   = 10 # ...
    @TURN_LEFT    = 11
    @TURN_RIGHT   = 12
    @JUMP         = 13
    @JUMP_FORWARD = 14
    @FALL_FORWARD = 15
    @SHOOT        = 16
    @LOOK_UP      = 17
    @LOOK_DOWN    = 18
    @LOOK_RESET   = 19
    @TUCKER       = 20
    
    @SHOW         = 1
    @HIDE         = 2
    @DELETE       = 3
    
    @ONCE       = 0
    @CONTINUOUS = 1
    @REPEAT     = 2
    @TIMED      = 3

    @: (o, i, n, d, m) ->
        if _.isPlainObject o 
            i = o.id ? -1
            n = o.name
            d = o.duration ? 0
            m = o.mode ? (d and Action.TIMED or Action.ONCE)
            o = o.func
        else
            i ?= -1
            d ?= 0
            m ?= (d and Action.TIMED or Action.ONCE)
        # klog "Action.constructor #{i} #{n} #{d} #{m}"
        @object     = o
        @name       = n
        @id         = i
        @mode       = m
        @duration   = d
        @event      = null
        @deleted    = false
        @reset()

    del: ->
        # klog "Action.del #{@name} #{@event?} #{@object?}"
        if @event?  then @event.removeAction @
        if @object? then @object.removeAction @
        @deleted = true

    perform: -> 
        # klog "Action.perform #{@name} action? #{@object.performAction?} #{@object.name}" if not @name in  ['noop', 'rotation']
        if @object.performAction? 
            @object.performAction @
        else if _.isFunction @object
            @object @
    
    init: ->    @object.initAction? @
    finish: ->  @object.finishAction? @
    finished: -> 
        # klog "Action.finished #{@name} #{@object?.actionFinished? and '.' or 'unfinished'}"
        @object?.actionFinished? @
        return if @deleted
        @reset()

    atStart: -> @current == 0
        
    reset: ->
        # klog "action.reset #{@name}"
        @start   = 0 # world time
        @rest    = 0 
        @last    = 0 # relative (ms since @start)
        @current = 0 # relative (ms since @start)

    takeOver: (action) ->
        # klog "takeOver #{action.rest} from #{action.name} this: #{@name}"
        @current = action.current
        @start   = action.start
        @last    = action.last
        @rest    = action.rest

    getRelativeDelta: -> (@current-@last) / @getDuration()
    getDuration:      -> world.mapMsTime @duration 
    getRelativeTime:  -> 
    
        s = 1/(16+@getDuration())
        s * (16+@current)

    performWithEvent: (event) ->
        
        eventTime = event.getTime()
        
        if @start == 0
            
            @start   = eventTime
            @current = 0
            @rest    = 0
            @last    = 0

            event.removeAction @ if @mode == Action.ONCE
            
            # klog "#{@name} start #{@start} #{@getRelativeDelta()} #{@getRelativeTime()}"
            
            @perform()
            @last = @current
            # @finished() if @duration == 0 and @mode == Action.ONCE
            @finished() if @mode == Action.ONCE
            
        else
            
            currentDiff = eventTime - @start
            msDur = @getDuration()
            
            if currentDiff >= (msDur - 4) # action (almost) finished
                @current = msDur
                @rest    = currentDiff - msDur
                # klog "action #{name} performWithEvent start #{@start} rest #{currentDiff}-#{msDur} = #{@rest}" if @name != 'noop'
                # klog "#{@name} end   #{@current} #{@getRelativeDelta()} #{@getRelativeTime()}"
                @perform()
                @last    = 0
                
                if @mode == Action.CONTINUOUS
                    # klog "action.performWithEvent #{@name} mode == Action.CONTINUOUS"
                    @current = @rest
                    @start = eventTime
                    @last  = 0
                    @rest  = 0
                    return
                    
                event.removeAction @ if @mode in [Action.ONCE, Action.TIMED]
                
                @finish()
    
                if @mode == Action.REPEAT
                    if @current >= @getDuration() # if keepRest wasn't called -> reset start and current values
                        @reset()
                    return
                
                event.addFinishedAction @
                
            else
                
                @current = currentDiff
                # klog "#{@name}      #{@current} #{@getRelativeDelta()} #{@getRelativeTime()}"
                @perform()
                @last    = @current
        
module.exports = Action
