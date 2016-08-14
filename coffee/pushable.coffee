# 00000000   000   000   0000000  000   000   0000000   0000000    000      00000000
# 000   000  000   000  000       000   000  000   000  000   000  000      000     
# 00000000   000   000  0000000   000000000  000000000  0000000    000      0000000 
# 000        000   000       000  000   000  000   000  000   000  000      000     
# 000         0000000   0000000   000   000  000   000  0000000    0000000  00000000

Item   = require './item'
Action = require './action'
Vector = require './lib/vector'

class Pushable extends Item
    
    constructor: () ->
        super
        @pusher     = null
        @direction  = new Vector()
        
        @addAction new Action @, Action.NOOP, "noop"
        @addAction new Action @, Action.PUSH, "push"
        @addAction new Action @, Action.FALL, "fall", 40

    pushedByObjectInDirection: (object, dir, duration) ->

        pushAction = @getActionWithId Action.PUSH
        
        @pusher      = object
        @move_action = pushAction
        @direction   = dir
        
        pushAction.setDuration world.unmapMsTime duration
        Timer.addAction pushAction

    initAction: (action) ->
        switch action.id
            when Action.FALL
                world.objectWillMoveToPos @, @position.plus(@direction), action.getDuration()

    performAction: (action) ->
        switch action.id
            when Action.PUSH, Action.FALL
                @setCurrentPosition @position.plus @direction.mul action.getRelativeTime()

    finishAction: (action) ->
        log "Pushable.finishAction #{action.name}"
        switch action.id
            when Action.PUSH, Action.FALL
                @move_action = null
                world.objectMovedFromPos @, @position
                log "Pushable.finishAction setPosition #{@current_position}"
                @setPosition @current_position

    actionFinished: (action) ->        
        if action.id == Action.PUSH or actionId == Action.FALL
            gravityDir = @direction
            
            if action.id == Action.PUSH
                if @pusher instanceof Bot
                    gravityDir = pusher.getDown()
                else if pusher instanceof Bomb
                    if @ instanceof Bot
                        if @direction == @getUp()
                            # bots don't fall through bomb splitter
                            @direction.reset()
                            return
                        else
                            gravityDir = @getDown() # bots pushed by bombs fall down
                    else
                        direction.reset()
                        return # objects pushed by bombs don't fall
            
            if world.isUnoccupiedPos @position.plus gravityDir
                @direction = gravityDir
                @move_action = @getActionWithId Action.FALL
                Timer.addAction @move_action
            else
                @direction.reset()
                world.playSound @landing_sound, position

module.exports = Pushable
