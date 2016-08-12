
#   00000000   000       0000000   000   000  00000000  00000000 
#   000   000  000      000   000   000 000   000       000   000
#   00000000   000      000000000    00000    0000000   0000000  
#   000        000      000   000     000     000       000   000
#   000        0000000  000   000     000     00000000  000   000

Bot    = require './bot'
Action = require './action'
Timer  = require './timer'
Vector = require './lib/vector'
Perspective = require './perspective'

forward_key    = "UP"
backward_key   = "DOWN"
turn_left_key  = "LEFT"
turn_right_key = "RIGHT"
shoot_key      = "SPACE"
jump_key       = "CTRL"
push_key       = "SHIFT"
look_up_key    = "HOME"
look_down_key  = "END"
view_key       = "PAGEDOWN"
 
class Player extends Bot
    
    constructor: ->
        
        super
        
        @look_action = null
        @look_angle  = 0.0
        @new_dir_sgn = 1.0
        @rotate      = 0
        
        @recorder    = null
        @playback    = null
        
        @addAction new Action @, Action.LOOK_UP,    "look up",    220
        @addAction new Action @, Action.LOOK_DOWN,  "look down",  220
        @addAction new Action @, Action.LOOK_RESET, "look reset", 60
    
        @addEventWithName "keyset"
        @addEventWithName "keyset failed"
        @addEventWithName "landed"
    
        @projection = new Perspective 90.0
        @projection.updateViewport()
        # @projection.getLight().setCutoff 90.0
        # @projection.getLight().setAttenuation 1.0, 0.0, 0.05
    
    getActionForKey: (keyName) ->
        index = 0
        while actionKeyMapping[index].actionName
            if keyName == actionKeyMapping[index].keyName
                return actionKeyMapping[index].actionName
            index++
      
        return ""
    
    getKeyForAction: (actionName) ->
        index = 0
        while actionKeyMapping[index].actionName
            if actionName == actionKeyMapping[index].actionName
                return actionKeyMapping[index].keyName
            index++
      
        return ""
    
    setKeyForAction: (keyName, actionName) ->
        index = 0
        while actionKeyMapping[index].actionName
            if actionName == actionKeyMapping[index].actionName
                actionKeyMapping[index].keyName = keyName
            index++
    
    recordKeyForAction: (actionName) ->
        RecordingActionName = actionName
        KeyRecorder.startRecordingSequence @, @setRecordedKey, 1
    
    setRecordedKey: (keyName) ->
        index = 0
        while actionKeyMapping[index].actionName
            if keyName == actionKeyMapping[index].keyName and actionKeyMapping[index].actionName != RecordingActionName
                setKeyForAction "", actionKeyMapping[index].actionName
            index += 1
        setKeyForAction keyName, RecordingActionName
        getEventWithName("keyset").triggerActions()
    
    updatePosition: () ->
        if @move_action
            relTime = (world.getTime() - @move_action.getStart()) / @move_action.getDuration()
            if relTime <= 1.0
                switch @move_action.id
                    when Action.FORWARD
                        @current_position = @position + relTime * @getDir()
                    when Action.FALL
                        @current_position = @position - relTime * @getUp() 
                    when Action.JUMP_FORWARD
                        @current_position = @position  + (1.0 - Math.cos(Math.PI/2 * relTime)) * @getDir() + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * @getUp()
                    when Action.FALL_FORWARD
                        @current_position = @position + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * @getDir() + (1.0 - Math.cos(Math.PI/2 * relTime)) * -@getUp()
    
    getProjection: () ->
        # smooth camera movement a little bit
        posDelta = world.getSpeed() / 10.0
        @projection.setPosition ((1.0 - posDelta) * @projection.getPosition() + posDelta * @current_position)
    
        playerDir = @getCurrentDir()
        playerUp  = @current_orientation.rotate(new Vector(0,1,0)).normal()
            
        if @look_angle # player is looking up or down
            @projection.setXVector playerUp.cross(playerDir).normal()
            @look_rot = Quaternion.rotationAroundVector @look_angle, @projection.getXVector()
            @projection.setYVector @look_rot.rotate playerUp 
            @projection.setZVector @look_rot.rotate -playerDir 
        else
            # smooth camera rotation a little bit
            lookDelta = (2.0 - @projection.getZVector().dot playerDir) * world.getSpeed() / 50.0
            newLookVector  = @projection.getZVector().mul(1.0 - lookDelta).minus playerDir.mul lookDelta
            newLookVector.normalize()
    
            @projection.setXVector playerUp.cross(newLookVector).normal()
            @projection.setYVector playerUp
            @projection.setZVector newLookVector
            
        @projection
    
    getBehindProjection: () ->
        @updatePosition()
    
        @playerDir = getCurrentDir()
        @playerUp  = @current_orientation.rotate(new Vector(0,1,0)).normal()
        
        # find a valid camera position
        botToCamera = (playerUp - 2 * playerDir)
        min_f = botToCamera.length()
        botToCamera.normalize()
        
        min_f = Math.min world.getWallDistanceForRay(@current_position, botToCamera), min_f
        cameraPos = @current_position + kMax(min_f, 0.72) * botToCamera
        cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
            
        # smooth camera movement a little bit
        posDelta = 0.2
        @projection.setPosition ((1.0 - posDelta) * @projection.getPosition() + posDelta * cameraPos)
                                                                                
        if @look_angle
            @projection.setXVector(playerUp.cross(playerDir).normal())
            KQuaternion look_rot = KQuaternion.rotationAroundVector(@look_angle, @projection.getXVector())
            @projection.setYVector(look_rot.rotate(playerUp))
            @projection.setZVector(look_rot.rotate(-playerDir))
        else
            # smooth camera rotation a little bit
            lookDelta = 0.3
            newLookVector = @projection.getZVector().mul((1.0 - lookDelta)).minus @playerDir.mul lookDelta
            newLookVector.normalize()
            
            @projection.setZVector(newLookVector) 
            @projection.setXVector(playerUp.cross(newLookVector).normal())
            @projection.setYVector(newLookVector.cross(@projection.getXVector()).normal())
        
        @projection
    
     getFollowProjection: () ->
        cameraPos = @projection.getPosition()    # current camera position
        desiredDistance = 2.0            # desired distance from camera to bot
    
        @updatePosition()
    
        playerPos   = @current_position        # desired look pos
        playerDir   = @getCurrentDir()
        playerUp    = current_orientation.rotate(new Vector(0,1,0)).normal()
        playerRight = playerDir.cross(playerUp).normal()
    
        # ____________________________________________________ camera follows bot
        # first, adjust distance from camera to bot
         
        botToCamera = cameraPos.minus playerPos  # vector from bot to current pos
        cameraBotDistance = botToCamera.length() # distance from camera to bot
        
        if cameraBotDistance >= desiredDistance
            difference = cameraBotDistance - desiredDistance
            delta = difference*difference/400.0        # weight for following speed
            cameraPos = cameraPos.mul(1.0 - delta).plus playerPos.mul delta
        else
            difference = desiredDistance - cameraBotDistance
            delta = difference/20.0                # weight for negative following speed
            cameraPos = cameraPos.mul(1.0 - delta).plus (playerPos.plus botToCamera.normal().mul desiredDistance).mul delta
    
        # ____________________________________________________ refining camera position
        # second, rotate around bot
    
        botToCamera = cameraPos.minus playerPos
        botToCameraNormal = botToCamera.normal()
    
        # ____________________________________________________ try view bot from above
        # if camera below bot, rotate up
        if botToCameraNormal.dot(playerUp) < 0
            # calculate angle between player to camera vector and player up vector
            verticalAngle = Vector.RAD2DEG Math.acos(kMinMax(-1.0, 1.0, botToCameraNormal.dot playerUp)) - 90.0
            cameraPos = playerPos.plus Quaternion.rotationAroundVector(verticalAngle/40.0, botToCameraNormal.cross(playerUp)).rotate botToCamera 
            
            botToCamera = cameraPos.minus playerPos
            botToCameraNormal = botToCamera.normal()
    
        rot_factor = 1.0
        wall_distance = world.getWallDistanceForPos (playerPos + botToCamera)
        if wall_distance < 0.5
            # ____________________________________________________ apiercing walls
            if (wall_distance < 0.2)
                cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
                botToCamera = cameraPos.minus playerPos
                botToCameraNormal = botToCamera.normal()
            
            rot_factor = 0.5 / (wall_distance-0.2)
    
        # ____________________________________________________ try view bot from behind
        # calculate horizontal angle between bot orientation and vector to camera
        mappedToXZ = (botToCamera.minus playerUp.mul(botToCamera.dot playerUp)).normal()
        horizontalAngle = Vector.RAD2DEG Math.acos(kMinMax(-1.0, 1.0, -playerDir.dot mappedToXZ))
        if botToCameraNormal.dot(playerRight) > 0
            horizontalAngle = -horizontalAngle
    
        cameraPos = playerPos.plus Quaternion.rotationAroundVector(horizontalAngle / (rot_factor * 400.0), playerUp).rotate botToCamera
    
        botToCamera = cameraPos.minus playerPos
        botToCameraNormal = botToCamera.normal()
    
        # ____________________________________________________ finally, set the position
        
        @projection.setPosition cameraPos 
        
        # ____________________________________________________ refining camera orientation
        
        # slowly adjust look direction by interpolating current and desired directions
        lookDelta = 2.0 - @projection.getZVector().dot botToCameraNormal
        lookDelta *= lookDelta / 30.0    
        newLookVector = @projection.getZVector().mul(1.0 - lookDelta).plus botToCameraNormal.mul(lookDelta)
        newLookVector.normalize()
        
        # slowly adjust up vector by interpolating current and desired up vectors
        upDelta = 2.0 - @projection.getYVector().dot playerUp
        upDelta *= upDelta / 100.0    
        KVector newRightVector = (@projection.getYVector().mul(1.0 - upDelta).plus playerUp.mul(upDelta)).cross newLookVector 
        newRightVector.normalize()
        newUpVector = newLookVector.cross(newRightVector).normal()
    
        # finished interpolations, update camera matrix
        @projection.setZVector newLookVector
        @projection.setXVector newRightVector
        @projection.setYVector newUpVector
        
        @projection
    
    initAction: (action) ->
        actionId = action.id
        switch actionId
            when Action.CLIMB_DOWN, Action.FORWARD
                @status.addMoves 1 
            when Action.TURN_LEFT, Action.TURN_RIGHT
                sound.playSound KikiSound.BOT_MOVE 
            when Action.JUMP, Action.JUMP_FORWARD
                @status.addMoves actionId == Action.JUMP and 1 or 2
                sound.playSound KikiSound.BOT_JUMP 
        
        super action
    
    performAction: (action) ->
        relTime = action.getRelativeTime()
    
        switch action.id
            when Action.NOOP then return
        
            when Action.LOOK_UP
                @look_angle = relTime * -90.0
        
            when Action.LOOK_DOWN
                @look_angle = relTime * 90.0
                
            when Action.LOOK_RESET
                if @look_angle > 0 
                    @look_angle = Math.min @look_angle, (1.0-relTime) * 90.0
                else 
                    @look_angle = Math.max @look_angle, (1.0-relTime) * -90.0
            else
                super action 
    
    finishAction: (action) ->
        actionId = action.id
    
        if actionId == Action.LOOK_RESET
            @look_action = null
            @look_angle  = 0.0
        else
            if action == @move_action # move finished, update direction
                dir_sgn = new_dir_sgn
            
            if actionId != Action.LOOK_UP and actionId != Action.LOOK_DOWN
                KikiBot.finishAction(action)
            
            if actionId == Action.TURN_LEFT or actionId == Action.TURN_RIGHT
                if rotate
                    rotate_action = getActionWithId rotate
                    rotate_action.reset()
                    Timer.addAction rotate_action
    
    die: () ->
        # Controller.removeKeyHandler @
        super
        # Controller.displayText "game over" 
        # sound.playSound KikiSound.BOT_DEATH
        world.setCameraMode world.CAMERA_FOLLOW
    
    reborn: () ->
        # Controller.addKeyHandler @
        died = false
    
    reset: () ->
        KikiBot.reset()
        Timer.removeActionsOfObject @
        
        @look_action = null
        @look_angle  = 0.0
        new_dir_sgn = 1.0
        rotate      = 0
        
        recorder    = null
        playback    = null
    
    saveRecorder: () ->
        if @recorder
            @recorder.save()
            @recorder = null
    
    startRecorder: (file) ->
        if @recorder
            saveRecorder()
        @recorder = new KikiRecorder file 
    
    handleKey: (key) ->
        keyName = key.getUnmodifiedName()
        keyHandled = -> 
            @recorder?.recordKey key
            true
        
        if keyName == forward_key or keyName == backward_key
            move = true # try to move as long as the key is not released
            
            if @move_action == null # player is currently not performing a move action
                # forward or backward direction
                new_dir_sgn = dir_sgn = (key.getUnmodifiedName() == backward_key) ? -1 : 1 
    
                moveBot() # perform new move action (depending on environment)
            else
                new_dir_sgn = (keyName == backward_key) ? -1 : 1
        
            return keyHandled()
        
        if keyName == turn_left_key or keyName == turn_right_key
            rotate = (keyName == turn_left_key) and Action.TURN_LEFT or Action.TURN_RIGHT
            
            if (@rotate_action == null and spiked == false) # player is not performing a rotation and unspiked
                @rotate_action = getActionWithId rotate
                Timer.addAction @rotate_action
            
            return keyHandled()
        
        if key.name == jump_key 
            jump = true # switch to jump mode until jump_key released
            jump_once = true
            return keyHandled()
        
        if key.name == push_key
            push = true
            return keyHandled()
        
        if keyName == shoot_key
            if not shoot
                shoot = true
                Timer.addAction @getActionWithId Action.SHOOT
            
            return keyHandled()
        
        if keyName == look_up_key or keyName == look_down_key
            if not @look_action
                @look_action = @getActionWithId (key.name == look_up_key) and Action.LOOK_UP or Action.LOOK_DOWN
                @look_action.reset()
                Timer.addAction @look_action
            return keyHandled()
        
        if keyName == view_key
            world.changeCameraMode()
            return keyHandled()
        
        return false
    
    handleKeyRelease: (key) ->
        keyName = key.getUnmodifiedName()
        releaseHandled = ->
            @recorder?.recordKeyRelease key
            true
            
        if keyName == shoot_key
            Timer.removeAction @getActionWithId Action.SHOOT
            shoot = false
            return releaseHandled()
        
        if keyName == forward_key or keyName == backward_key
            move = false
            return releaseHandled()
        
        if key.name == jump_key
            jump = false
            if jump_once
                if @move_action == null and world.isUnoccupiedPos position.plus @getUp()
                    jump_once = false
                    @move_action = getActionWithId Action.JUMP
                    sound.playSound KikiSound.BOT_JUMP
                    Timer.addAction @move_action
            return releaseHandled()
        
        if keyName ==  turn_left_key or keyName == turn_right_key
            rotate = 0
            return releaseHandled()
        
        if key.name == push_key
            push = false
            return releaseHandled()
        
        if keyName == look_down_key or keyName == look_up_key
            if @look_action and @look_action.id != Action.LOOK_RESET
                Timer.removeAction @look_action
            @look_action = getActionWithId Action.LOOK_RESET
            Timer.addAction @look_action
            return releaseHandled()
        
        if keyName == view_key 
            return releaseHandled()
            
        return false
    
    display: () ->
        if world.getCameraMode() != world.CAMERA_INSIDE or world.getEditMode()
            render()
    
    getBodyColor: () ->
        if world.getCameraMode() == world.CAMERA_BEHIND
            # static bodyColor
            bodyColor = colors[KikiPlayer_base_color]
            bodyColor.setAlpha(kMin(0.7, (@projection.getPosition()-@current_position).length()-0.4))
            return bodyColor
    
        return colors[KikiPlayer_base_color]
    
    getTireColor: () ->
        if world.getCameraMode() == world.CAMERA_BEHIND
            # static tireColor
            tireColor = colors[KikiPlayer_tire_color]
            tireColor.setAlpha(kMin(1.0, (@projection.getPosition()-@current_position).length()-0.4))
            return tireColor
    
        return colors[KikiPlayer_tire_color]
     
    finishRotateAction: () ->
        if rotate_action
            @rotate = false
            @finishAction rotate_action 
    
module.exports = Player
