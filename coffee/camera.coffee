
#    0000000   0000000   00     00  00000000  00000000    0000000 
#   000       000   000  000   000  000       000   000  000   000
#   000       000000000  000000000  0000000   0000000    000000000
#   000       000   000  000 0 000  000       000   000  000   000
#    0000000  000   000  000   000  00000000  000   000  000   000

{ clamp } = require 'kxk'

Matrix      = require './lib/matrix'
Vector      = require './lib/vector'
Quaternion  = require './lib/quaternion'

class Camera extends Matrix

    @INSIDE = 0 
    @BEHIND = 1 
    @FOLLOW = 2
        
    @: (@player, opt) ->
        @fov    = opt?.fov ? 90
        @near   = opt?.near ? 0.01
        @eye_distance = @near
        @far    = opt?.far ? 30
        @mode   = Camera.BEHIND
        @aspect = opt.aspect ? -1
        @dist   = 10
        @border = [0,0,0,0]
        
        super
        
        @setViewport 0.0, 0.0, 1.0, 1.0 
        
        @cam = new THREE.PerspectiveCamera @fov, @aspect, @near, @far
        @cam.position.z = @dist
        
    step: ->
        
        switch @mode
            when Camera.INSIDE then @insideProjection()     
            when Camera.BEHIND then @behindProjection()
            when Camera.FOLLOW then @followProjection()
        
        camPos = @getPosition()
        @cam.position.copy camPos
        @cam.up.copy @getYVector()
        @cam.lookAt camPos.plus @getZVector()

        if @light?
            pos = @getPosition().plus @light_offset
            @light.setDirection -@getZVector()
            @light.setPosition new Vector pos[X], pos[Y], pos[Z], 1.0 # positional light source
    
    getLookAtPosition: -> @getZVector().mul(-@eye_distance).plus @getPosition()
    
    setOrientation: (o) -> 
        @setYVector o.rotate Vector.unitY
        @setZVector o.rotate Vector.unitZ
        @setXVector o.rotate Vector.minusX
        @cam.up.copy @getYVector()
        @cam.lookAt @getPosition().plus @getZVector()
            
    updateViewport: ->
        # ss = world.screenSize
        # vp = []
        # vp[0] = @viewport[0] * ss.w + @border[0]
        # vp[1] = @viewport[1] * ss.h + @border[1]
        # vp[2] = @viewport[2] * ss.w - @border[0] - @border[2]
        # vp[3] = @viewport[3] * ss.h - @border[1] - @border[3]
    
    setViewportBorder: (l, b, r, t) ->
        # @border = [l,b,r,t]
        # @updateViewport()
    
    setViewport: (l, b, w, h) ->
        # @viewport = [l,b,w,h] 
        # @updateViewport()

    setFov: (fov) -> @fov = Math.max(2.0, Math.min fov, 175.0)
            
    #   00000000   00000000    0000000         000  00000000   0000000  000000000  000   0000000   000   000
    #   000   000  000   000  000   000        000  000       000          000     000  000   000  0000  000
    #   00000000   0000000    000   000        000  0000000   000          000     000  000   000  000 0 000
    #   000        000   000  000   000  000   000  000       000          000     000  000   000  000  0000
    #   000        000   000   0000000    0000000   00000000   0000000     000     000   0000000   000   000
    
    insideProjection: () ->
        
        playerPos = @player.currentPos()
        playerDir = @player.currentDir()
        playerUp  = @player.currentUp()
        lookAngle = @player.look_angle
        
        posDelta = world.getSpeed() / 10.0 # smooth camera movement a little bit
        camPos = playerPos
        if lookAngle < 0
            camPos.add playerUp.mul -2*lookAngle/90
        @setPosition @getPosition().mul(1.0-posDelta).plus camPos.mul posDelta
            
        if lookAngle # player is looking up or down
            @setXVector playerDir.cross(playerUp).normal()
            rot = Quaternion.rotationAroundVector lookAngle, @getXVector()
            @setYVector rot.rotate playerUp 
            @setZVector rot.rotate playerDir #.neg()
        else
            # smooth camera rotation a little bit
            lookDelta = (2.0 - @getZVector().dot playerDir) * world.getSpeed() / 50.0
            newLookVector = @getZVector().mul(1.0 - lookDelta).plus playerDir.mul lookDelta
            newLookVector.normalize()
            @setXVector playerUp.cross(newLookVector).normal()
            @setYVector playerUp
            @setZVector newLookVector
            
        @projection
    
    #   0000000    00000000  000   000  000  000   000  0000000  
    #   000   000  000       000   000  000  0000  000  000   000
    #   0000000    0000000   000000000  000  000 0 000  000   000
    #   000   000  000       000   000  000  000  0000  000   000
    #   0000000    00000000  000   000  000  000   000  0000000  
    
    behindProjection: () ->
        
        playerPos = @player.currentPos()
        playerDir = @player.currentDir()
        playerUp  = @player.currentUp()
        lookAngle = @player.look_angle
        
        # find a valid camera position
        botToCamera = playerUp.minus playerDir.mul 2
        min_f = botToCamera.length()
        botToCamera.normalize()
        
        min_f = Math.min world.getWallDistanceForRay(playerPos, botToCamera), min_f
        camPos = playerPos.plus botToCamera.mul Math.max(min_f, 0.72) * (1-Math.abs(lookAngle)/90)
        if lookAngle < 0
            camPos.add playerUp.mul -2*lookAngle/90
        
        camPos = world.getInsideWallPosWithDelta camPos, 0.2
            
        # smooth camera movement a little bit
        posDelta = 0.2
        @setPosition @getPosition().mul(1.0 - posDelta).plus camPos.mul posDelta
                                                                                
        if lookAngle
            # klog "look_angle #{lookAngle}"
            @setXVector playerDir.cross(playerUp).normal() 
            rot = Quaternion.rotationAroundVector lookAngle, @getXVector() 
            @setYVector rot.rotate playerUp  
            @setZVector rot.rotate playerDir #.neg()  
        else
            # smooth camera rotation a little bit
            lookDelta = 0.3
            newLookVector = @getZVector().mul(1.0 - lookDelta).plus (playerDir.minus(playerUp.mul(0.2)).normal()).mul lookDelta
            newLookVector.normalize()
            
            @setZVector newLookVector  
            @setXVector playerUp.cross(newLookVector).normal() 
            @setYVector newLookVector.cross(@getXVector()).normal() 
        
    #   00000000   0000000   000      000       0000000   000   000
    #   000       000   000  000      000      000   000  000 0 000
    #   000000    000   000  000      000      000   000  000000000
    #   000       000   000  000      000      000   000  000   000
    #   000        0000000   0000000  0000000   0000000   00     00

    followProjection: () ->
        
        camPos = @getPosition()
        desiredDistance = 2.0 # desired distance from camera to bot
    
        playerPos   = @player.currentPos()
        playerDir   = @player.currentDir()
        playerUp    = @player.currentUp()
        playerLeft  = @player.currentLeft()
    
        # first, adjust distance from camera to bot
         
        botToCamera = camPos.minus playerPos     # vector from bot to current pos
        cameraBotDistance = botToCamera.length() # distance from camera to bot
        
        if cameraBotDistance >= desiredDistance
            difference = cameraBotDistance - desiredDistance
            delta = difference*difference/400.0  # weight for following speed
            camPos = camPos.mul(1.0-delta).plus playerPos.mul delta
        else
            difference = desiredDistance - cameraBotDistance
            delta = difference/20.0 # weight for negative following speed
            camPos = camPos.mul(1.0-delta).plus (playerPos.plus botToCamera.normal().mul desiredDistance).mul delta
    
        # second, rotate around bot
    
        botToCamera = camPos.minus playerPos
        botToCameraNormal = botToCamera.normal()
     
        # rotate camera vertically
        verticalAngle = Vector.RAD2DEG Math.acos(clamp(-1.0, 1.0, botToCameraNormal.dot playerUp))
        if verticalAngle > 45
            # klog "verticalAngle #{verticalAngle}"
            rotQuat     = Quaternion.rotationAroundVector(verticalAngle/400.0, botToCameraNormal.cross(playerUp))
            botToCamera = rotQuat.rotate botToCamera 
            botToCameraNormal = botToCamera.normal()
            camPos      = playerPos.plus botToCamera

        rotFactor = 1.0

        wall_distance = world.getWallDistanceForPos camPos
        if wall_distance < 0.5 # try avoid piercing walls
            if wall_distance < 0.2
                camPos = world.getInsideWallPosWithDelta camPos, 0.2
                botToCamera = camPos.minus playerPos
                botToCameraNormal = botToCamera.normal()
            rotFactor = 0.5 / (wall_distance-0.2)
     
        # try view bot from behind
        # calculate horizontal angle between bot orientation and vector to camera
        mappedToXZ = (botToCamera.minus playerUp.mul(botToCamera.dot playerUp)).normal()
        horizontalAngle = Vector.RAD2DEG Math.acos(clamp(-1.0, 1.0, -playerDir.dot mappedToXZ))
        if botToCameraNormal.dot(playerLeft) < 0
            horizontalAngle = -horizontalAngle
        rotQuat = Quaternion.rotationAroundVector horizontalAngle/(rotFactor*400.0), playerUp 
        camPos = playerPos.plus rotQuat.rotate botToCamera

        botToCamera = camPos.minus playerPos
        botToCameraNormal = botToCamera.normal()
    
        @setPosition camPos # finally, set the position
        
        # slowly adjust look direction by interpolating current and desired directions
        lookDelta = @getZVector().dot botToCameraNormal
        lookDelta *= lookDelta / 30.0    
        newLookVector = @getZVector().mul(1.0-lookDelta).plus botToCameraNormal.neg().mul(lookDelta)
        newLookVector.normalize()
        
        # slowly adjust up vector by interpolating current and desired up vectors
        upDelta = 1.5-@getYVector().dot playerUp
        upDelta *= upDelta / 100.0    
        newUpVector = @getYVector().mul(1.0-upDelta).plus playerUp.mul(upDelta)
        newUpVector.normalize()
        
        newLeftVector = newUpVector.cross newLookVector
    
        # finished interpolations, update camera matrix
        @setXVector newLeftVector
        @setYVector newUpVector
        @setZVector newLookVector
        @projection
        
module.exports = Camera