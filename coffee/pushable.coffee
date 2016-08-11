# 00000000   000   000   0000000  000   000   0000000   0000000    000      00000000
# 000   000  000   000  000       000   000  000   000  000   000  000      000     
# 00000000   000   000  0000000   000000000  000000000  0000000    000      0000000 
# 000        000   000       000  000   000  000   000  000   000  000      000     
# 000         0000000   0000000   000   000  000   000  0000000    0000000  00000000

Item = require './item'

class Pushable extends Item
    
    constructor: () ->
        super
        @pusher     = null
        @direction  = new KVector()
        
        @addAction new KikiAction @, ACTION_PUSH, "push"
        @addAction new KikiAction @, ACTION_FALL, "fall", 40

    pushedByObjectInDirection: (object, dir, duration) ->

        pushAction = @getActionWithId ACTION_PUSH
        
        @pusher      = object
        @move_action = pushAction
        @direction   = dir
        
        # pushAction->setDuration Controller.unmapMsTime duration
        # Controller.timer_event->addAction (pushAction);

    initAction: (action) ->
        # switch action->getId()
            # when ACTION_FALL
                # Controller.world->objectWillMoveToPos @, @position + @direction, action->getDuration()

    performAction: (action) ->
        switch action.getId()
            when ACTION_PUSH, ACTION_FALL
                @setCurrentPosition @position + action.getRelativeTime() * @direction

    finishAction: (action) ->
        switch action.getId()
            when ACTION_PUSH, ACTION_FALL
                @move_action = null
                world.objectMovedFromPos @, @position
                @setPosition @current_position

    actionFinished (action) ->
        actionId = action.getId()
        
        if actionId == ACTION_PUSH or actionId == ACTION_FALL
            gravityDir = @direction
            
            if actionId == ACTION_PUSH
                if @pusher instanceof KikiBot
                    gravityDir = pusher.getDown()
                else if pusher instanceof KikiBomb
                    if @ instanceof KikiBot
                        if @direction == @getUp()
                            # bots don't fall through bomb splitter
                            @direction.reset()
                            return
                        else
                            gravityDir = @getDown() # bots pushed by bombs fall down
                    else
                        direction.reset()
                        return # objects pushed by bombs don't fall
            
            if world.isUnoccupiedPos @position + gravityDir
                @direction = gravityDir
                @move_action = @getActionWithId ACTION_FALL
                # Controller.timer_event->addAction (move_action)
            else
                @direction.reset()
                # playSoundAtPos landing_sound, position

module.exports = Pushable
