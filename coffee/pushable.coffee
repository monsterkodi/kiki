# 00000000   000   000   0000000  000   000   0000000   0000000    000      00000000
# 000   000  000   000  000       000   000  000   000  000   000  000      000     
# 00000000   000   000  0000000   000000000  000000000  0000000    000      0000000 
# 000        000   000       000  000   000  000   000  000   000  000      000     
# 000         0000000   0000000   000   000  000   000  0000000    0000000  00000000

log    = require '/Users/kodi/s/ko/js/tools/log'
Vector = require './lib/vector'
Item   = require './item'
Action = require './action'
Timer  = require './timer'

class Pushable extends Item

    isSpaceEgoistic: -> true
    
    constructor: () ->
        super
        @pusher     = null
        @direction  = Vector.minusY
        @landing_sound = 'STONE_LAND'
        @pushing_sound = 'STONE_MOVE'
        
        @addAction new Action @, Action.NOOP, "noop"
        @addAction new Action @, Action.PUSH, "push"
        @addAction new Action @, Action.FALL, "fall", 40

    setOrientation: (q) -> 
        super q
        if not @pusher?
            @direction = @orientation.rotate Vector.minusZ
            # log "Pushable.setOrientation direction:", @direction

    pushedByObjectInDirection: (object, dir, duration) ->
        # log "pushedByObjectInDirection #{object.name} duration:#{duration}"
        pushAction   = @getActionWithId Action.PUSH
        
        @pusher      = object
        @move_action = pushAction
        @direction   = dir
        
        pushAction.duration = world.unmapMsTime duration
        Timer.addAction pushAction

    initAction: (action) ->
        switch action.id
            when Action.PUSH, Action.FALL
                world.playSound @pushing_sound if action.id == Action.PUSH
                world.objectWillMoveToPos @, @position.plus(@direction), action.getDuration()

    performAction: (action) ->
        switch action.id
            when Action.PUSH, Action.FALL
                @setCurrentPosition @position.plus @direction.mul action.getRelativeTime()

    finishAction: (action) ->
        switch action.id
            when Action.PUSH, Action.FALL
                @move_action = null
                targetPos = @current_position.round()
                world.objectMoved @, @position, targetPos
                @setPosition targetPos

    actionFinished: (action) ->    
        Bot  = require './bot'
        Bomb = require './bomb'
        if action.id in [Action.PUSH, Action.FALL]
            gravityDir = @direction
            if action.id == Action.PUSH
                if @pusher instanceof Bot
                    gravityDir = @pusher.getDown()
                else if @pusher instanceof Bomb
                    if @ instanceof Bot
                        if @direction.eql @getUp()
                            # bots don't fall through bomb splitter
                            @direction.reset()
                            return
                        else
                            gravityDir = @getDown() # bots pushed by bombs fall down
                    else
                        @direction.reset()
                        return # objects pushed by bombs don't fall
            
            if world.isUnoccupiedPos @position.plus gravityDir
                @direction = gravityDir
                @move_action = @getActionWithId Action.FALL
                # log 'Pushable.actionFinished below empty, fall!'
                Timer.addAction @move_action
            else
                @direction.reset()
                world.playSound @landing_sound, @position

module.exports = Pushable
