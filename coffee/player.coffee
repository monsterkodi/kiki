
#   00000000   000       0000000   000   000  00000000  00000000 
#   000   000  000      000   000   000 000   000       000   000
#   00000000   000      000000000    00000    0000000   0000000  
#   000        000      000   000     000     000       000   000
#   000        0000000  000   000     000     00000000  000   000

Bot    = require './bot'
Action = require './action'

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
 
# KikiActionKey actionKeyMapping[] = 

class Player extends Bot
    
    constructor: ->
        
        super
        
        @look_action = null
        @look_angle  = 0.0
        @new_dir_sgn = 1.0
        @rotate      = 0
        
        @recorder    = null
        @playback    = null
        
        # @flags[KDL_KEYHANDLER_FLAG_HANDLES_RELEASE] = true
        
        @addAction new KikiAction @, Action.LOOK_UP,    "look up",    220
        @addAction new KikiAction @, Action.LOOK_DOWN,  "look down",  220
        @addAction new KikiAction @, Action.LOOK_RESET, "look reset", 60
    
        @addEventWithName "keyset"
        @addEventWithName "keyset failed"
        @addEventWithName "landed"
    
        # @projection = new KLightingProjection (90.0)
        # @projection.updateViewport()
        # @projection.getLight().setCutoff (90.0)
        # @projection.getLight().setAttenuation (1.0, 0.0, 0.05)
    
        # Controller.player_status->setStatus status

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
        if (move_action)
            relTime = (Controller.getTime() - move_action.getStart()) / move_action.getDuration()
            if relTime <= 1.0
                switch move_action.getId()
                    when Action.FORWARD
                        current_position = position + relTime * getDir()
                    when Action.FALL
                        current_position = position - relTime * getUp() 
                    when Action.JUMP_FORWARD
                        current_position = position  + (1.0 - Math.cos(Math.PI/2 * relTime)) * getDir() + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * getUp()
                    when Action.FALL_FORWARD
                        current_position = position + Math.cos(Math.PI/2 - Math.PI/2 * relTime) * getDir() + (1.0 - Math.cos(Math.PI/2 * relTime)) * -getUp()
    
    getProjection: () ->
        # smooth camera movement a little bit
        posDelta = Controller.getSpeed() / 10.0
        projection.setPosition ((1.0 - posDelta) * projection.getPosition() + posDelta * current_position)
    
        KVector playerDir   = getCurrentDir()
        KVector playerUp    = current_orientation.rotate (KVector(0,1,0)).normal()
            
        if (@look_angle) # player is looking up or down
            projection.setXVector playerUp.cross (playerDir).normal()
            look_rot = KQuaternion.rotationAroundVector @look_angle, projection.getXVector()
            projection.setYVector look_rot.rotate (playerUp)
            projection.setZVector look_rot.rotate (-playerDir)
        else
            # smooth camera rotation a little bit
            lookDelta = (2.0 - projection.getZVector() * playerDir) * Controller.getSpeed() / 50.0
            KVector newLookVector  = (1.0 - lookDelta) * projection.getZVector() - lookDelta * playerDir
            newLookVector.normalize()
    
            projection.setXVector playerUp.cross(newLookVector).normal()
            projection.setYVector playerUp
            projection.setZVector newLookVector
            
        return projection
    
    getBehindProjection: () ->
        updatePosition()
    
        playerDir   = getCurrentDir()
        playerUp    = current_orientation.rotate(KVector(0,1,0)).normal()
        
        # find a valid camera position
        botToCamera = (playerUp - 2 * playerDir)
        min_f = botToCamera.length()
        botToCamera.normalize()
        
        min_f = Math.min world.getWallDistanceForRay(current_position, botToCamera), min_f
        cameraPos = current_position + kMax(min_f, 0.72) * botToCamera
        cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
            
        # smooth camera movement a little bit
        posDelta = 0.2
        projection.setPosition ((1.0 - posDelta) * projection.getPosition() + posDelta * cameraPos)
                                                                                
        if (@look_angle)
            projection.setXVector(playerUp.cross(playerDir).normal())
            KQuaternion look_rot = KQuaternion.rotationAroundVector(@look_angle, projection.getXVector())
            projection.setYVector(look_rot.rotate(playerUp))
            projection.setZVector(look_rot.rotate(-playerDir))
        else
            # smooth camera rotation a little bit
            lookDelta = 0.3
            KVector newLookVector  =(1.0 - lookDelta) * projection.getZVector() - lookDelta * playerDir
            newLookVector.normalize()
            
            projection.setZVector(newLookVector) 
            projection.setXVector(playerUp.cross(newLookVector).normal())
            projection.setYVector(newLookVector.cross(projection.getXVector()).normal())
        
        return projection
    
     getFollowProjection: () ->
        cameraPos = projection.getPosition()    # current camera position
        desiredDistance = 2.0            # desired distance from camera to bot
    
        updatePosition()
    
        playerPos   = current_position        # desired look pos
        playerDir   = getCurrentDir()
        playerUp    = current_orientation.rotate(KVector(0,1,0)).normal()
        playerRight = playerDir.cross(playerUp).normal()
    
        # .................................................................. camera follows bot
        # first, adjust distance from camera to bot
         
        botToCamera = cameraPos - playerPos      # vector from bot to current pos
        cameraBotDistance = botToCamera.length() # distance from camera to bot
        
        if cameraBotDistance >= desiredDistance
            difference = cameraBotDistance - desiredDistance
            delta = (difference*difference)/400.0        # weight for following speed
            cameraPos = (1.0 - delta) * cameraPos + delta * playerPos
        else
            difference = desiredDistance - cameraBotDistance
            delta = difference/20.0                # weight for negative following speed
            cameraPos = (1.0 - delta) * cameraPos + delta * (playerPos + desiredDistance * botToCamera.normal())
    
        # .................................................................. refining camera position
        # second, rotate around bot
    
        botToCamera = cameraPos - playerPos
        KVector botToCameraNormal = botToCamera.normal()
    
        # .................................................................. try view bot from above
        # if camera below bot, rotate up
        if (botToCameraNormal * playerUp < 0)
            # calculate angle between player to camera vector and player up vector
            verticalAngle = RAD2DEG (Math.acos(kMinMax(-1.0, 1.0, botToCameraNormal * playerUp))) - 90.0
            cameraPos = playerPos + KQuaternion.rotationAroundVector(verticalAngle/40.0, botToCameraNormal.cross(playerUp)).rotate(botToCamera)
            
            botToCamera = cameraPos - playerPos
            botToCameraNormal = (cameraPos - playerPos).normal()
    
        rot_factor = 1.0
        wall_distance = world.getWallDistanceForPos (playerPos + botToCamera)
        if wall_distance < 0.5
            # .................................................................. apiercing walls
            
            if (wall_distance < 0.2)
                cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
                botToCamera = cameraPos - playerPos
                botToCameraNormal = (cameraPos - playerPos).normal()
            
            rot_factor = 0.5 / (wall_distance-0.2)
    
        # .................................................................. try view bot from behind
        # calculate horizontal angle between bot orientation and vector to camera
        mappedToXZ ((botToCamera - playerUp * (botToCamera * playerUp)).normal())
        horizontalAngle = RAD2DEG (Math.acos(kMinMax(-1.0, 1.0, -playerDir * mappedToXZ)))
        if botToCameraNormal * playerRight > 0
            horizontalAngle = -horizontalAngle
    
        cameraPos = playerPos + KQuaternion.rotationAroundVector(horizontalAngle / (rot_factor * 400.0), playerUp).rotate botToCamera
    
        botToCamera = cameraPos - playerPos
        botToCameraNormal = botToCamera.normal()
    
        # .................................................................. finally, set the position
        
        projection.setPosition cameraPos 
        
        # .................................................................. refining camera orientation
        
        # slowly adjust look direction by interpolating current and desired directions
        lookDelta = 2.0 - projection.getZVector() * botToCameraNormal
        lookDelta *= lookDelta / 30.0    
        KVector newLookVector = (1.0 - lookDelta) * projection.getZVector() + lookDelta * botToCameraNormal
        newLookVector.normalize()
        
        # slowly adjust up vector by interpolating current and desired up vectors
        upDelta = 2.0 - projection.getYVector() * playerUp
        upDelta *= upDelta / 100.0    
        KVector newRightVector = ((1.0 - upDelta) * projection.getYVector() + upDelta * playerUp).cross(newLookVector)
        newRightVector.normalize()
        KVector newUpVector = newLookVector.cross(newRightVector).normal()
    
        # finished interpolations, update camera matrix
        projection.setZVector newLookVector
        projection.setXVector newRightVector
        projection.setYVector newUpVector
        
        return projection
    
    initAction: (action) ->
        actionId = action.getId()
        switch actionId
            when Action.CLIMB_DOWN, Action.FORWARD
                @status.addMoves 1 
            when Action.TURN_LEFT, Action.TURN_RIGHT
                Controller.sound.playSound KikiSound.BOT_MOVE 
            when Action.JUMP, Action.JUMP_FORWARD
                @status.addMoves actionId == Action.JUMP and 1 or 2
                Controller.sound.playSound KikiSound.BOT_JUMP 
        
        KikiBot.initAction(action)
    
    performAction: (action) ->
        relTime = action.getRelativeTime()
    
        switch action.getId()
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
                KikiBot.performAction action 
    
    finishAction: (action) ->
        actionId = action.getId()
    
        if actionId == Action.LOOK_RESET
            @look_action = null
            @look_angle  = 0.0
        else
            if action == move_action # move finished, update direction
                dir_sgn = new_dir_sgn
            
            if actionId != Action.LOOK_UP and actionId != Action.LOOK_DOWN
                KikiBot.finishAction(action)
            
            if actionId == Action.TURN_LEFT or actionId == Action.TURN_RIGHT
                if rotate
                    rotate_action = getActionWithId rotate
                    rotate_action.reset()
                    Controller.timer_event.addAction rotate_action
    
    die: () ->
        Controller.removeKeyHandler (this)
        KikiBot.die()
        Controller.displayText("game over")
        Controller.sound.playSound (KikiSound.BOT_DEATH)
        world.setCameraMode (world.CAMERA_FOLLOW)
    
    reborn: () ->
        Controller.addKeyHandler (this)
        died = false
    
    reset: () ->
        KikiBot.reset()
        Controller.timer_event.removeActionsOfObject *
        
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
            
            if move_action == null # player is currently not performing a move action
                # forward or backward direction
                new_dir_sgn = dir_sgn = (key.getUnmodifiedName() == backward_key) ? -1 : 1 
    
                moveBot() # perform new move action (depending on environment)
            else
                new_dir_sgn = (keyName == backward_key) ? -1 : 1
        
            return keyHandled()
        
        if keyName == turn_left_key or keyName == turn_right_key
            rotate = (keyName == turn_left_key) and Action.TURN_LEFT or Action.TURN_RIGHT
            
            if (rotate_action == null and spiked == false) # player is not performing a rotation and unspiked
                rotate_action = getActionWithId rotate
                Controller.timer_event.addAction rotate_action
            
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
                Controller.timer_event.addAction @getActionWithId Action.SHOOT
            
            return keyHandled()
        
        if keyName == look_up_key or keyName == look_down_key
            if not @look_action
                @look_action = @getActionWithId (key.name == look_up_key) and Action.LOOK_UP or Action.LOOK_DOWN
                @look_action.reset()
                Controller.timer_event.addAction @look_action
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
            Controller.timer_event.removeAction getActionWithId Action.SHOOT
            shoot = false
            return releaseHandled()
        
        if keyName == forward_key or keyName == backward_key
            move = false
            return releaseHandled()
        
        if key.name == jump_key
            jump = false
            if jump_once
                if move_action == null and world.isUnoccupiedPos position.plus getUp()
                    jump_once = false
                    move_action = getActionWithId Action.JUMP
                    Controller.sound.playSound KikiSound.BOT_JUMP
                    Controller.timer_event.addAction (move_action)
            return releaseHandled()
        
        if keyName ==  turn_left_key or keyName == turn_right_key
            rotate = 0
            return releaseHandled()
        
        if key.name == push_key
            push = false
            return releaseHandled()
        
        if keyName == look_down_key or keyName == look_up_key
            if @look_action and @look_action.getId() != Action.LOOK_RESET
                Controller.timer_event.removeAction @look_action
            @look_action = getActionWithId Action.LOOK_RESET
            Controller.timer_event.addAction @look_action
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
            bodyColor.setAlpha(kMin(0.7, (projection.getPosition()-current_position).length()-0.4))
            return bodyColor
    
        return colors[KikiPlayer_base_color]
    
    getTireColor: () ->
        if world.getCameraMode() == world.CAMERA_BEHIND
            # static tireColor
            tireColor = colors[KikiPlayer_tire_color]
            tireColor.setAlpha(kMin(1.0, (projection.getPosition()-current_position).length()-0.4))
            return tireColor
    
        return colors[KikiPlayer_tire_color]
     
    finishRotateAction: () ->
      if rotate_action
        rotate = false
        finishAction(rotate_action)
    
module.exports = Player
