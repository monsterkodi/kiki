# 00000000   00000000  00000000    0000000  00000000   00000000   0000000  000000000  000  000   000  00000000
# 000   000  000       000   000  000       000   000  000       000          000     000  000   000  000     
# 00000000   0000000   0000000    0000000   00000000   0000000   000          000     000   000 000   0000000 
# 000        000       000   000       000  000        000       000          000     000     000     000     
# 000        00000000  000   000  0000000   000        00000000   0000000     000     000      0      00000000

log    = require '/Users/kodi/s/ko/js/tools/log'
Matrix = require './lib/matrix'

class Perspective extends Matrix
    
    constructor: (fov,near,far) ->
        @znear = near
        @zfar  = far
        @fov   = fov
        @aspect_ratio = -1.0
        @eye_distance = 5.0
        @border = [0,0,0,0]
        @setViewport 0.0, 0.0, 1.0, 1.0 
        # WINDOW_SIZE_CHANGED -> updateViewport
        super

    reset: () ->
        @fov          = 60.0
        @eye_distance = @znear
        super
        @translate 0, 0, @eye_distance
    
    rotate: (x,y,z) ->
        savePos = @getLookAtPosition()
        @translate -@getPosition()
            
        up   = @getYVector()
        look = @getZVector()
    
        rotxz = KMatrix.rotation x, 0.0, z
        roty  = KMatrix.rotation 0.0, y, 0.0
    
        yunit = new Vector 0.0, 1.0, 0.0
        zunit = new Vector 0.0, 0.0, 1.0
    
        lookperp = @look.perpendicular yunit # y-axis rotation    
        if lookperp.length() > 0
            look = roty.transform lookperp.plus look.parallel(yunit) 
            up   = roty.transform up.perpendicular(yunit).plus up.parallel(yunit) 
        
        # x & z-axis rotation 
        transmat = new Matrix up.cross(look), up, look
        
        uprotxz   = rotxz.transform yunit
        lookrotxz = rotxz.transform zunit
    
        up   = transmat.transform uprotxz
        look = transmat.transform lookrotxz
        
        @.initXYZ up.cross(look), up, look
        
        @setPosition savePos.plus @getZVector().mul @eye_distance

    initProjection: -> @apply()

    apply: (camera) ->
            
        camPos = @getPosition()
        up     = @getYVector()
        lookAt = @getLookAtPosition()
        
        log "Perspective.apply", camPos, up, lookAt
        
        camera.position.clone camPos #set camPos.x, camPos.y, camPos.z 
        camera.up.clone up #new THREE.Vector3 up.x, up.y, up.z
        camera.lookAt new THREE.Vector3 lookAt.x, lookAt.y, lookAt.z

        if @light?
            pos = @getPosition().plus @light_offset
            @light.setDirection -@getZVector()
            @light.setPosition new Vector pos[X], pos[Y], pos[Z], 1.0 # positional light source
    
    focusOn: (pos) -> @setPosition pos.plus @getZVector().mul @eye_distance
    
    setEyeDistance: (distance) ->
        lookAtPos = @getLookAtPosition()
        @eye_distance = kMin( kMax(@znear, distance), 0.9 * @zfar );
        setPosition lookAtPos + @eye_distance * @getZVector()
    
    setLookAtPosition: (lookAtPos) ->
        up       = @getYVector()
        newLook  = (lookAtPos - @getPosition()).normal()
        newRight = up.cross(newLook).normal()
        newUp    = newLook.cross(newRight).normal()
    
        @setXVector newRight
        @setYVector newUp
        @setZVector newLook
        
        @eye_distance = lookAtPos.minus(@getPosition()).length()
    
    getLookAtPosition: -> @getZVector().mul(-@eye_distance).plus @getPosition()
            
    updateViewport: ->
        ss = world.screenSize
        vp = []
        vp[0] = @viewport[0] * ss.w + @border[0]
        vp[1] = @viewport[1] * ss.h + @border[1]
        vp[2] = @viewport[2] * ss.w - @border[0] - @border[2]
        vp[3] = @viewport[3] * ss.h - @border[1] - @border[3]
    
    getCurrentAspectRatio: ->
        vps = @getViewportSize()
        @aspect_ratio <= 0.0 and vps.w/vps.h or @aspect_ratio
    
    getScreenCoordinates: (pos, sx, sy) ->
        
    setViewportBorder: (l, b, r, t) ->
        @border = [l,b,r,t]
        @updateViewport();
    
    setViewport: (l, b, w, h) ->
        @viewport = [l,b,w,h] 
        @updateViewport()
    
    setFov: (fov) -> @fov = Math.max(2.0, Math.min fov, 175.0)
    
    setEyeDistance: (distance) -> @eye_distance = Math.min( Math.max(@znear, distance), 0.9 * @zfar );
    
module.exports = Perspective
    