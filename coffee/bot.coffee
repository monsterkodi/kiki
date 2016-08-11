# 0000000     0000000   000000000
# 000   000  000   000     000   
# 0000000    000   000     000   
# 000   000  000   000     000   
# 0000000     0000000      000   

Pushable = require './pushable'

class Bot extends Pushable
    
    constructor: () ->

        @geom = new THREE.SphereGeometry 1, 32, 32 
        @mat  = new THREE.MeshPhongMaterial 
            color:          0x0000ff
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.9
            shininess:      0.99
        
        @mesh = new THREE.Mesh @geom, @mat
        world.scene.add @mesh
        # @mesh.matrixAutoUpdate = true
        
        @left_tire_rot   = 0.0
        @right_tire_rot  = 0.0
        @last_fume       = 0
            
        @moves    = 0
        @health   = 1
        @minMoves = 100

        @move       = false
        @push       = false
        @jump       = false
        @shoot      = false
        @jump_once  = false
        
        @spiked     = false
        @died       = false
        
        @move_action     = null
        @rotate_action   = null
        
        @dir_sgn         = 1.0
        
        @addAction new KikiAction @, Action.NOOP,         "noop",           0
        @addAction new KikiAction @, Action.FORWARD,      "move forward",   200
        @addAction new KikiAction @, Action.CLIMB_UP,     "climb up",       200
        @addAction new KikiAction @, Action.CLIMB_DOWN,   "climb down",     500
        @addAction new KikiAction @, Action.TURN_LEFT,    "turn left",      200
        @addAction new KikiAction @, Action.TURN_RIGHT,   "turn right",     200
        @addAction new KikiAction @, Action.JUMP,         "jump",           120
        @addAction new KikiAction @, Action.JUMP_FORWARD, "jump forward",   200
        @addAction new KikiAction @, Action.FALL_FORWARD, "fall forward",   200
        @addAction new KikiAction @, Action.SHOOT,        "shoot",          200, KikiAction.REPEAT
    
        @getActionWithId(Action.FALL).setDuration 120
        @addEventWithName "died"
    
        @startTimedAction @getActionWithId Action.NOOP, 500

    addMoves:  (m) -> @moves += m
    addHealth: (h) -> @health = Math.max @health+h
    
    die: () ->
        # timer_event.removeActionsOfObject (@)
        
        @move  = false
        @jump  = false
        @shoot = false
        @push  = false
    
        @getEventWithName("died").triggerActions()
        @died  = true
    
    reset: () ->
    
        @left_tire_rot   = 0.0
        @right_tire_rot  = 0.0
        @last_fume       = 0
    
        @direction.reset()
        @orientation.reset()
        @current_orientation.reset()
        @rotate_orientation.reset()
        @climb_orientation.reset()
        @rest_orientation.reset()
    
        @move_action = null
        @move        = false
        @push        = false
        @jump        = false
        @shoot       = false
        @jump_once   = false
        @spiked      = false
        @died        = false
    
    isFalling: -> @move_action and @move_action.getId() == Action.FALL
    
    initAction: (action) ->
        newPos = new KikiPos @position 
    
        switch action.getId()
            when Action.NOOP         then return
            
            when Action.FORWARD      then newPos += @getDir()
            when Action.CLIMB_DOWN   then newPos += @getDir()  + @getDown()
            when Action.JUMP         then newPos += @getUp()
            when Action.JUMP_FORWARD then newPos += @getUp()   + @getDir()
            when Action.FALL_FORWARD then newPos += @getDown() + @getDir()
            when Action.FALL
                if @direction != KVector()
                    KikiPushable.initAction action 
                    return
                else
                    newPos += @getDown()        
                break
            else
                KikiPushable.initAction (action)
                return
    
        # if newPos != @position
            # world.objectWillMoveToPos (@, newPos, action.getDuration())
    
    performAction: (action) ->
        actionId = action.getId()
        relTime  = action.getRelativeTime()
        dltTime  = action.getRelativeDelta()
    
        switch actionId
            when Action.SHOOT
                if relTime == 0
                    KikiBullet.shootFromBot (@)
                
            when Action.NOOP then return
            
            when Action.FORWARD
    
                @left_tire_rot  += dir_sgn * dltTime
                @right_tire_rot += dir_sgn * dltTime
                @current_position = @position + relTime * @getDir()
                
                return
            
            when Action.JUMP
            
                @current_position = @position + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * @getUp()
                return
                    
            when Action.JUMP_FORWARD
        
                @left_tire_rot  += Math.cos(Math.PI/2 - Math.PI/2 * dltTime)
                @right_tire_rot += Math.cos(Math.PI/2 - Math.PI/2 * dltTime)
                @current_position = @position  + (1.0 - Math.cos(Math.PI/2 * relTime)) * @getDir() + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * @getUp()
                return
                
            when Action.FALL_FORWARD
        
                @current_position = @position + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * @getDir() + (1.0 - Math.cos(Math.PI/2 * relTime)) * @getDown()
                return
    
            when Action.FALL
        
                if @direction != KVector()
                    KikiPushable.performAction action
                    return
                @current_position = @position + relTime * @getDown()
                return
        
            when Action.CLIMB_UP
        
                @left_tire_rot  += dir_sgn * dltTime/2
                @right_tire_rot += dir_sgn * dltTime/2
                @climb_orientation = KQuaternion.rotationAroundVector(dir_sgn * relTime * -90.0, KVector(1,0,0))
                break
            
            when Action.CLIMB_DOWN
        
                @left_tire_rot  += dir_sgn * dltTime
                @right_tire_rot += dir_sgn * dltTime
                if relTime <= 0.2
                    @current_position = @position + (relTime/0.2)/2 * @getDir()
                else if (relTime >= 0.8)
                    @climb_orientation = KQuaternion.rotationAroundVector(dir_sgn * 90.0, KVector(1,0,0))
                    @current_position = @position + @getDir() + (0.5+(relTime-0.8)/0.2/2) * @getDown()
                else
                    @climb_orientation = KQuaternion.rotationAroundVector(dir_sgn * (relTime-0.2)/0.6 * 90.0, KVector(1,0,0))
                    rotVec = (orientation * @climb_orientation).rotate(KVector(0.0, 1.0, 0.0))
                    @current_position = @position.plus @getDir().plus(@getDown()).plus(rotVec).mul 0.5
                break
        
            when Action.TURN_RIGHT, Action.TURN_LEFT
    
                if @move_action == null and relTime == 0.0 # if not performing move action and start of rotation
                    # update @orientation now, so next move action will move in desired @direction
                    if actionId == Action.TURN_LEFT
                        @orientation *= KQuaternion.rotationAroundVector(90.0, KVector(0,1,0))
                        @rest_orientation = KQuaternion.rotationAroundVector(-90.0, KVector(0,1,0))
                    else
                        @orientation *= KQuaternion.rotationAroundVector(-90.0, KVector(0,1,0))
                        @rest_orientation = KQuaternion.rotationAroundVector(90.0, KVector(0,1,0))
    
                if actionId == Action.TURN_LEFT
                    @left_tire_rot  += -dltTime
                    @right_tire_rot +=  dltTime
                    @rotate_orientation = KQuaternion.rotationAroundVector(relTime * 90.0, KVector(0,1,0))
                else
                    @left_tire_rot  +=  dltTime
                    @right_tire_rot += -dltTime
                    @rotate_orientation = KQuaternion.rotationAroundVector(relTime * -90.0, KVector(0,1,0))
                break
            
            else
                
                KikiPushable.performAction action
                return
        
        @current_orientation =  @orientation * @climb_orientation * @rotate_orientation * @rest_orientation
    
    
    finishAction: (action) ->
        actionId = action.getId()
    
        return if actionId == Action.NOOP or actionId == Action.SHOOT
        
        if actionId == Action.PUSH
            KikiPushable.finishAction action
            return
        
        if actionId == Action.TURN_LEFT or actionId == Action.TURN_RIGHT
            @rotate_action = null
            
            if move_action # bot currently performing a move action -> store rotation in @rest_orientation
                @rest_orientation *= @rotate_orientation
                @rotate_orientation.reset()
            else
                @orientation *= @rotate_orientation * @rest_orientation # update rotation matrix
                @rotate_orientation.reset()
                @rest_orientation.reset()
        else if actionId < Action.END
            @move_action = null
    
            @orientation *= @climb_orientation # update climb @orientation
            @climb_orientation.reset()
    
            if @rotate_action and actionId != Action.JUMP_FORWARD # bot is currently performing a rotation ->
                # take over result of rotation to prevent sliding
                if @rotate_action.getId() == Action.TURN_LEFT
                    @orientation *= KQuaternion.rotationAroundVector(90.0, KVector(0,1,0)) * @rest_orientation
                    @rest_orientation = KQuaternion.rotationAroundVector(-90.0, KVector(0,1,0))
                else
                    @orientation *= KQuaternion.rotationAroundVector(-90.0, KVector(0,1,0)) * @rest_orientation
                    @rest_orientation = KQuaternion.rotationAroundVector(90.0, KVector(0,1,0))
        
            if actionId != Action.CLIMB_UP
                world.objectMovedFromPos @, @position # update world @position
                @position = @current_position.round()
                    
            if actionId != Action.JUMP_FORWARD and @rotate_action == null # if not jumping forward
                @orientation *= @rest_orientation # update rotation @orientation
                @rest_orientation.reset()
    
    actionFinished: (action) ->
        actionId = action.getId()
    
        if @isDead()
            die() if not @died 
            
            if actionId != Action.PUSH and actionId != Action.FALL
                # dead player may only fall, nothing else
                return
        
        if spiked
            @move_action = null
            @startTimedAction getActionWithId(Action.NOOP), 0
            return
    
        if actionId == Action.PUSH or @direction != KVector()
            KikiPushable.actionFinished (action)
            return
    
        return if @move_action # action was not a move action -> return
        
        # find next action depending on type of finished action and surrounding environment
        if actionId == Action.JUMP_FORWARD
            
            forwardPos = @position + @getDir()
            if world.isUnoccupiedPos forwardPos  
                # forward will be empty
                if world.isUnoccupiedPos forwardPos.minus @getUp()  
                    # below forward will also be empty
                    @move_action = @getActionWithId Action.FALL_FORWARD
                    @move_action.takeRest (action)
                else
                    @move_action = @getActionWithId Action.FORWARD
                    playSoundAtPos(KikiSound.BOT_LAND, @getPos(), 0.25)
            else # forward will not be empty
                if world.isUnoccupiedPos position.minus @getUp()  # below is empty
                    @move_action = @getActionWithId Action.CLIMB_UP
                    playSoundAtPos KikiSound.BOT_LAND, @getPos(), 0.5 
        else if world.isUnoccupiedPos position.minus @getUp()  # below will be empty
            if move # sticky if moving
                if world.isUnoccupiedPos position.plus @getDir() 
                    # forward will be empty 
                    if world.isOccupiedPos position.plus @getDir().minus @getUp()
                        # below forward is solid
                        KikiObject * occupant = world.getOccupantAtPos position.plus @getDir().minus @getUp() 
                        if occupant == null or not occupant.isSlippery()
                            @move_action = @getActionWithId (Action.FORWARD)
                else
                    KikiObject * occupant = world.getOccupantAtPos position.plus @getDir() 
                    if occupant == null or not occupant.isSlippery()
                        @move_action = @getActionWithId (Action.CLIMB_UP)
            
            if @move_action == null
                @move_action = @getActionWithId Action.FALL
                @move_action.takeRest action
        else if actionId == Action.FALL or actionId == Action.FALL_FORWARD # landed
            if @ == player
                playSound KikiSound.BOT_LAND
            else
                playSoundAtPos KikiSound.BOT_LAND, @getPos() 
        
        if @move_action
            timer_event.addAction @move_action
            return
        
        return if @rotate_action 
        
        if move
            @moveBot()
        else
            dir_sgn = 1.0
            if actionId != Action.NOOP then jump_once = false
            # keep action chain flowing in order to detect environment changes
            startTimedAction getActionWithId(Action.NOOP), 0
    
    moveBot: () ->
        @move_action = null
         
        KikiPos forwardPos = @position + @getDir()
        
        if jump or jump_once and                 # jump mode or jump activated while moving
            dir_sgn == 1.0 and                     # and moving forward
                world.isUnoccupiedPos position.plus @getUp()  # and above empty
                    if world.isUnoccupiedPos forwardPos.plus @getUp()  and
                        world.isUnoccupiedPos forwardPos  # forward and above forward also empty
                            @move_action = @getActionWithId Action.JUMP_FORWARD
                    else # no space to jump forward -> jump up
                        @move_action = @getActionWithId Action.JUMP
        else if world.isUnoccupiedPos forwardPos  # forward is empty
            if world.isUnoccupiedPos forwardPos.plus @getDown()  
                # below forward also empty
                @move_action = @getActionWithId Action.CLIMB_DOWN
            else # forward down is solid
                @move_action = @getActionWithId Action.FORWARD
        else # forward is not empty
            moveAction = @getActionWithId Action.FORWARD
            if push and world.mayObjectPushToPos @, forwardPos, moveAction.getDuration()
                moveAction.reset()
                # player in push mode and pushing object is possible
                if world.isUnoccupiedPos forwardPos.plus @getDown()  # below forward is empty
                    @move_action = @getActionWithId Action.CLIMB_DOWN
                else
                    @move_action = moveAction
            else # just climb up
                @move_action = @getActionWithId Action.CLIMB_UP
        
        # reset the jump once flag (either we jumped or it's not possible to jump at current @position)
        jump_once = false 
    
        if move_action
            @move_action.keepRest() # try to make subsequent actions smooth
            timer_event.addAction @move_action

    render: () ->
        radius     = 0.5
        tireRadius = 0.15
    
        # if (@died) @getDeadColor().glColor()
        # else       @getTireColor().glColor()
            
        # KMatrix(current_orientation).glMultMatrix()
        # glPushMatrix() # tires
            # glRotated(90.0, 0.0, 1.0, 0.0)
            # glTranslated(0.0, 0.0, radius-tireRadius)
            # glRotated(@left_tire_rot * 180.0, 0.0, 0.0, 1.0)
#             
            # render_tire
#             
        # glPopMatrix()
        # glPushMatrix()
            # glRotated(90.0, 0.0, 1.0, 0.0)
            # glTranslated(0.0, 0.0, -(radius-tireRadius))
            # glRotated(@right_tire_rot * 180.0, 0.0, 0.0, 1.0)
#     
            # render_tire
#             
        # glPopMatrix()
    
        # if not @died then @getBodyColor().glColor()
    
        @render_body()
        
        # if (@move_action or @rotate_action) and not @died
            # unsigned now = getTime()
            # if ((int)(now - last_fume) > mapMsTime (40))
                # fume = new KikiBotFume()
                # world.addObject fume
                # fume.setPosition @current_position - @getCurrentDir() * 0.4
                # @last_fume = now

module.exports = Bot
