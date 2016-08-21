
#   000   000  00000000   0000000  000000000   0000000   00000000 
#   000   000  000       000          000     000   000  000   000
#    000 000   0000000   000          000     000   000  0000000  
#      000     000       000          000     000   000  000   000
#       0      00000000   0000000     000      0000000   000   000

log = require '/Users/kodi/s/ko/js/tools/log'

class Vector

    constructor: (x=0,y=0,z=0,w=0) ->
        if x.x? and x.y?
            @copy x
        else if Array.isArray x
            @x = x[0]
            @y = x[1]
            @z = x[2] ? 0
            @w = x[3] ? 0
        else
            @x = x
            @y = y
            @z = z ? 0
            @w = w ? 0
        if Number.isNaN @x or Number.isNaN @w
            throw new Error
            
    clone: -> new Vector @
    copy: (v) -> 
        @x = v.x
        @y = v.y 
        @z = v.z ? 0
        @w = v.w ? 0
        @

    normal: -> new Vector(@).normalize()
    
    parallel: (n) ->
        dot = @x*n.x + @y*n.y + @z*n.z
        new Vector dot*n.x, dot*n.y, dot*n.z

    # returns the projection of normalized vector n to vector that is perpendicular to this
    perpendicular: (n) ->
        dot = @x*n.x + @y*n.y + @z*n.z
        new Vector @x-dot*n.x, @y-dot*n.y, @z-dot*n.z 

    reflect: (n) ->
        dot = 2*(@x*n.x + @y*n.y + @z*n.z)
        new Vector @x-dot*n.x, @y-dot*n.y, @z-dot*n.z

    cross: (v) -> new Vector @y*v.z-@z*v.y, @z*v.x-@x*v.z, @x*v.y-@y*v.x
    normalize: ->
        l = @length()
        if l
            l = 1.0/l
            @x *= l
            @y *= l
            @z *= l
            @w *= l
        @    

    xyperp: -> new Vector -@y, @x
    round:  -> new Vector Math.round(@x), Math.round(@y), Math.round(@z), @w

    xyangle: (v) ->
        thisXY  = new Vector(@x, @y).normal()
        otherXY = new Vector(v.x, v.y).normal()
        if thisXY.xyperp().dot otherXY >= 0 
            return Vector.RAD2DEG(Math.acos(thisXY.dot otherXY))
        -Vector.RAD2DEG(Math.acos(thisXY.dot otherXY))

    length:    -> Math.sqrt @x*@x+@y*@y+@z*@z+@w*@w
    angle: (v) -> Vector.RAD2DEG Math.acos @normal().dot v.normal()
    dot:   (v) -> @x*v.x + @y*v.y + @z*v.z + @w*(v.w ? 0)
    
    mul:   (f) -> new Vector @x*f, @y*f, @z*f, @w*f
    div:   (d) -> new Vector @x/d, @y/d, @z/d, @w/d
    plus:  (v) -> new Vector(v).add @
    minus: (v) -> new Vector(v).neg().add @
    neg:       -> new Vector -@x, -@y, -@z, -@w
     
    add: (v) ->
        @x += v.x 
        @y += v.y 
        @z += v.z ? 0
        @w += v.w ? 0
        @
    
    sub: (v) ->
        @x -= v.x 
        @y -= v.y 
        @z -= v.z ? 0
        @w -= v.w ? 0
        @
    
    scale: (f) ->
        @x *= f
        @y *= f
        @z *= f
        @w *= f
        @
        
    reset: ->
        @x = @y = @z = @w = 0
        @
    
    isZero: -> @x == @y == @z == @w == 0

    @rayPlaneIntersection: (rayPos, rayDirection, planePos, planeNormal) ->
        x = planePos.minus(rayPos).dot(planeNormal) / rayDirection.dot(planeNormal)
        return rayPos.plus rayDirection.mul x

    @pointMappedToPlane: (point, planePos, planeNormal) ->
        point.minus(planeNormal).dot point.minus(planePos).dot(planeNormal)

    @rayPlaneIntersectionFactor: (rayPos, rayDir, planePos, planeNormal) ->
        rayDot = rayDir.dot planeNormal
        if Number.isNaN rayDot
            throw new Error
        return 2 if rayDot == 0
        r = planePos.minus(rayPos).dot(planeNormal) / rayDot
        if Number.isNaN r
            log 'rayPos', rayPos
            log 'rayDir', rayDir
            log 'planePos', planePos
            log 'planeNormal', planeNormal
            throw new Error
        r

    @DEG2RAD: (d) -> Math.PI*d/180.0
    @RAD2DEG: (r) -> r*180.0/Math.PI
    
    @unitX  = new Vector 1,0,0
    @unitY  = new Vector 0,1,0
    @unitZ  = new Vector 0,0,1
    @minusX = new Vector -1,0,0
    @minusY = new Vector 0,-1,0
    @minusZ = new Vector 0,0,-1
    
    @X  = 0
    @Y  = 1
    @Z  = 2
    @W  = 3
    @SX = 0
    @SY = 5
    @SZ = 10
    @TX = 12
    @TY = 13
    @TZ = 14

module.exports = Vector