
#   00000000   000       0000000   000   000  00000000  00000000 
#   000   000  000      000   000   000 000   000       000   000
#   00000000   000      000000000    00000    0000000   0000000  
#   000        000      000   000     000     000       000   000
#   000        0000000  000   000     000     00000000  000   000
{
clamp
}      = require '/Users/kodi/s/ko/js/tools/tools'
log    = require '/Users/kodi/s/ko/js/tools/log'
Bot    = require './bot'
Action = require './action'
Timer  = require './timer'
Vector = require './lib/vector'
Quaternion = require './lib/quaternion'
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
        
        @key =
            forward:  'w'
            backward: 's'
            left:     'a'
            right:    'd'
            lookUp:   'up'
            lookDown: 'down'
            shoot:    'space'
            jump:     'j'
            view:     'v'

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
        
    updatePosition: () ->
        if @move_action
            relTime = (world.getTime() - @move_action.start) / @move_action.duration
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
    
    #   00000000   00000000    0000000         000  00000000   0000000  000000000  000   0000000   000   000
    #   000   000  000   000  000   000        000  000       000          000     000  000   000  0000  000
    #   00000000   0000000    000   000        000  0000000   000          000     000  000   000  000 0 000
    #   000        000   000  000   000  000   000  000       000          000     000  000   000  000  0000
    #   000        000   000   0000000    0000000   00000000   0000000     000     000   0000000   000   000
    
    getProjection: () ->
        
        # smooth camera movement a little bit
        posDelta = world.getSpeed() / 10.0
        @projection.setPosition @projection.getPosition().mul(1.0 - posDelta).plus @current_position.mul posDelta
        playerDir = @getCurrentDir()
        playerUp  = @current_orientation.rotate(new Vector(0,1,0)).normal()
            
        if @look_angle # player is looking up or down
            @projection.setXVector playerUp.cross(playerDir).normal()
            @look_rot = Quaternion.rotationAroundVector @look_angle, @projection.getXVector()
            @projection.setYVector @look_rot.rotate playerUp 
            @projection.setZVector @look_rot.rotate playerDir.neg()
        else
            # smooth camera rotation a little bit
            lookDelta = (2.0 - @projection.getZVector().dot playerDir) * world.getSpeed() / 50.0
            newLookVector = @projection.getZVector().mul(1.0 - lookDelta).minus playerDir.mul lookDelta
            newLookVector.normalize()
            @projection.setXVector playerUp.cross(newLookVector).normal()
            @projection.setYVector playerUp
            @projection.setZVector newLookVector
            
        @projection
    
    #   0000000    00000000  000   000  000  000   000  0000000  
    #   000   000  000       000   000  000  0000  000  000   000
    #   0000000    0000000   000000000  000  000 0 000  000   000
    #   000   000  000       000   000  000  000  0000  000   000
    #   0000000    00000000  000   000  000  000   000  0000000  
    
    getBehindProjection: () ->
        @updatePosition()
    
        playerDir = @getCurrentDir()
        playerUp  = @current_orientation.rotate(new Vector(0,1,0)).normal()
        
        # find a valid camera position
        botToCamera = playerUp.minus playerDir.mul 2
        min_f = botToCamera.length()
        botToCamera.normalize()
        
        min_f = Math.min world.getWallDistanceForRay(@current_position, botToCamera), min_f
        cameraPos = @current_position.plus botToCamera.mul Math.max min_f, 0.72 
        cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
            
        # smooth camera movement a little bit
        posDelta = 0.2
        @projection.setPosition @projection.getPosition().mul(1.0 - posDelta).plus cameraPos.mul posDelta
                                                                                
        if @look_angle
            @projection.setXVector playerUp.cross(playerDir).normal() 
            look_rot = Quaternion.rotationAroundVector @look_angle, @projection.getXVector() 
            @projection.setYVector look_rot.rotate playerUp  
            @projection.setZVector look_rot.rotate playerDir.neg()  
        else
            # smooth camera rotation a little bit
            lookDelta = 0.3
            newLookVector = @projection.getZVector().mul(1.0 - lookDelta).minus playerDir.mul lookDelta
            newLookVector.normalize()
            
            @projection.setZVector newLookVector  
            @projection.setXVector playerUp.cross(newLookVector).normal() 
            @projection.setYVector newLookVector.cross(@projection.getXVector()).normal() 
        
        # log 'Player.getBehindProjection', @projection.getPosition()
        @projection
    
    #   00000000   0000000   000      000       0000000   000   000
    #   000       000   000  000      000      000   000  000 0 000
    #   000000    000   000  000      000      000   000  000000000
    #   000       000   000  000      000      000   000  000   000
    #   000        0000000   0000000  0000000   0000000   00     00

    getFollowProjection: () ->
        
        cameraPos = @projection.getPosition()    # current camera position
        desiredDistance = 2.0            # desired distance from camera to bot
    
        @updatePosition()
    
        playerPos   = @current_position        # desired look pos
        # log 'getFollowProjection.current_position', @current_position
        playerDir   = @getCurrentDir()
        playerUp    = @current_orientation.rotate new Vector(0,1,0).normal()
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
            verticalAngle = Vector.RAD2DEG Math.acos(clamp(-1.0, 1.0, botToCameraNormal.dot playerUp)) - 90.0
            cameraPos = playerPos.plus Quaternion.rotationAroundVector(verticalAngle/40.0, botToCameraNormal.cross(playerUp)).rotate botToCamera 
            
            botToCamera = cameraPos.minus playerPos
            botToCameraNormal = botToCamera.normal()
    
        rotFactor = 1.0
        log "playerPos", playerPos
        wall_distance = world.getWallDistanceForPos playerPos.plus botToCamera
        if wall_distance < 0.5
            # ____________________________________________________ piercing walls
            if wall_distance < 0.2
                cameraPos = world.getInsideWallPosWithDelta cameraPos, 0.2
                botToCamera = cameraPos.minus playerPos
                botToCameraNormal = botToCamera.normal()
            
            rotFactor = 0.5 / (wall_distance-0.2)
    
        # ____________________________________________________ try view bot from behind
        # calculate horizontal angle between bot orientation and vector to camera
        mappedToXZ = (botToCamera.minus playerUp.mul(botToCamera.dot playerUp)).normal()
        horizontalAngle = Vector.RAD2DEG Math.acos(clamp(-1.0, 1.0, -playerDir.dot mappedToXZ))
        if botToCameraNormal.dot(playerRight) > 0
            horizontalAngle = -horizontalAngle
    
        cameraPos = playerPos.plus Quaternion.rotationAroundVector(horizontalAngle / (rotFactor * 400.0), playerUp).rotate botToCamera
    
        botToCamera = cameraPos.minus playerPos
        botToCameraNormal = botToCamera.normal()
    
        # ____________________________________________________ finally, set the position
        
        @projection.setPosition cameraPos 
        # log 'cameraPos:', cameraPos
        # ____________________________________________________ refining camera orientation
        
        # slowly adjust look direction by interpolating current and desired directions
        lookDelta = 2.0 - @projection.getZVector().dot botToCameraNormal
        lookDelta *= lookDelta / 30.0    
        newLookVector = @projection.getZVector().mul(1.0 - lookDelta).plus botToCameraNormal.mul(lookDelta)
        newLookVector.normalize()
        
        # slowly adjust up vector by interpolating current and desired up vectors
        upDelta = 2.0 - @projection.getYVector().dot playerUp
        upDelta *= upDelta / 100.0    
        newRightVector = (@projection.getYVector().mul(1.0-upDelta).plus playerUp.mul(upDelta)).cross newLookVector 
        newRightVector.normalize()
        newUpVector = newLookVector.cross(newRightVector).normal()
    
        # finished interpolations, update camera matrix
        @projection.setZVector newLookVector
        @projection.setXVector newRightVector
        @projection.setYVector newUpVector
        # log 'Player.getFollowProjection', @projection.getPosition()
        @projection
    
    #    0000000    0000000  000000000  000   0000000   000   000
    #   000   000  000          000     000  000   000  0000  000
    #   000000000  000          000     000  000   000  000 0 000
    #   000   000  000          000     000  000   000  000  0000
    #   000   000   0000000     000     000   0000000   000   000
    
    initAction: (action) ->
        log "initAction #{action.id} #{action.name}"
        actionId = action.id
        switch actionId
            when Action.CLIMB_DOWN, Action.FORWARD
                # @status.addMoves 1 
                log 'init action forward'
            when Action.TURN_LEFT, Action.TURN_RIGHT
                world.playSound 'BOT_MOVE'
            when Action.JUMP
                # @status.addMoves actionId == Action.JUMP and 1 or 2
                world.playSound 'BOT_JUMP'
        
        super action
    
    finishRotateAction: () ->
        if @rotate_action
            @rotate = false
            @finishAction @rotate_action 
    
    #   00000000   00000000  00000000   00000000   0000000   00000000   00     00
    #   000   000  000       000   000  000       000   000  000   000  000   000
    #   00000000   0000000   0000000    000000    000   000  0000000    000000000
    #   000        000       000   000  000       000   000  000   000  000 0 000
    #   000        00000000  000   000  000        0000000   000   000  000   000

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
    
    #   00000000  000  000   000  000   0000000  000   000
    #   000       000  0000  000  000  000       000   000
    #   000000    000  000 0 000  000  0000000   000000000
    #   000       000  000  0000  000       000  000   000
    #   000       000  000   000  000  0000000   000   000
    
    finishAction: (action) ->
        actionId = action.id
    
        if actionId == Action.LOOK_RESET
            @look_action = null
            @look_angle  = 0.0
        else
            if action == @move_action # move finished, update direction
                @dir_sgn = @new_dir_sgn
            
            if actionId != Action.LOOK_UP and actionId != Action.LOOK_DOWN
                super action
            
            if actionId == Action.TURN_LEFT or actionId == Action.TURN_RIGHT
                if @rotate
                    @rotate_action = @getActionWithId @rotate
                    @rotate_action.reset()
                    Timer.addAction @rotate_action
    
    die: () ->
        super
        # Controller.displayText "game over" 
        world.playSound 'BOT_DEATH'
        world.setCameraMode world.CAMERA_FOLLOW
    
    reborn: () ->
        @died = false
    
    reset: () ->
        super
        Timer.removeActionsOfObject @
        
        @look_action = null
        @look_angle  = 0.0
        @new_dir_sgn = 1.0
        @rotate      = 0
        
    #   000   000  00000000  000   000
    #   000  000   000        000 000 
    #   0000000    0000000     00000  
    #   000  000   000          000   
    #   000   000  00000000     000   
        
    modKeyComboEventDown: (mod, key, combo, event) ->
        # log "player.modKeyComboEventDown mod:#{mod} key:#{key} combo:#{combo}"
        switch combo
            when @key.forward, @key.backward
                @move = true # try to move as long as the key is not released
                if not @move_action?
                    @new_dir_sgn = @dir_sgn = (combo == @key.backward) and -1 or 1 
                    @moveBot() # perform new move action (depending on environment)
                else
                    @new_dir_sgn = (combo == @key.backward) and -1 or 1
                return true
        
            when @key.left, @key.right
                @rotate = (combo == @key.left) and Action.TURN_LEFT or Action.TURN_RIGHT
                if not @rotate_action? and not @spiked # player is not performing a rotation and unspiked
                    @rotate_action = @getActionWithId @rotate
                    Timer.addAction @rotate_action
                return true
            
            when @key.jump
                @jump = true # switch to jump mode until jump_key released
                @jump_once = true
                return true
            
            when @key.push
                @push = true
                return true
            
            when @key.shoot
                if not @shoot
                    @shoot = true
                    Timer.addAction @getActionWithId Action.SHOOT
                return true
            
            when @key.lookUp, @key.lookDown
                if not @look_action
                    @look_action = @getActionWithId (combo == @key.lookUp) and Action.LOOK_UP or Action.LOOK_DOWN
                    @look_action.reset()
                    Timer.addAction @look_action
                return true
            
            when @key.view
                world.changeCameraMode()
                return true
        
        false
    
    #   00000000   00000000  000      00000000   0000000    0000000  00000000
    #   000   000  000       000      000       000   000  000       000     
    #   0000000    0000000   000      0000000   000000000  0000000   0000000 
    #   000   000  000       000      000       000   000       000  000     
    #   000   000  00000000  0000000  00000000  000   000  0000000   00000000
    
    modKeyComboEventUp: (mod, key, combo, event) ->
        # log "player.modKeyComboEventUp mod:#{mod} key:#{key} combo:#{combo}"
        switch combo    
            when @key.shoot
                Timer.removeAction @getActionWithId Action.SHOOT
                @shoot = false
                return true
            
            when @key.forward, @key.backward
                @move = false
                return true
            
            when @key.jump
                @jump = false
                if @jump_once
                    if not @move_action? and world.isUnoccupiedPos @position.plus @getUp()
                        @jump_once = false
                        @move_action = @getActionWithId Action.JUMP
                        world.playSound 'BOT_JUMP'
                        Timer.addAction @move_action
                return releaseHandled()
            
            when @key.left, @key.right
                @rotate = 0
                return true
            
            when @key.push
                @push = false
                return releaseHandled()
            
            when @key.lookDown, @key.lookUp
                if @look_action and @look_action.id != Action.LOOK_RESET
                    Timer.removeAction @look_action
                @look_action = @getActionWithId Action.LOOK_RESET
                Timer.addAction @look_action
                return true
            
            when @key.view 
                return true
            
        false
    
    #     0000000    000   0000000  00000000   000       0000000   000   000
    #     000   000  000  000       000   000  000      000   000   000 000 
    #     000   000  000  0000000   00000000   000      000000000    00000  
    #     000   000  000       000  000        000      000   000     000   
    #     0000000    000  0000000   000        0000000  000   000     000   
    
    step: (step) -> super step
    
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
         
module.exports = Player
