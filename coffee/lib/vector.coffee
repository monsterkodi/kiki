
#   000   000  00000000   0000000  000000000   0000000   00000000 
#   000   000  000       000          000     000   000  000   000
#    000 000   0000000   000          000     000   000  0000000  
#      000     000       000          000     000   000  000   000
#       0      00000000   0000000     000      0000000   000   000

#define kMinMax(a,b,c)          (kMax((a), kMin((b), (c))))
#define kAbsMax(a,b)            ((kAbs((a)) >= kAbs((b))) ? (a) : (b))
#define kAbsMin(a,b)            ((kAbs((a)) < kAbs((b))) ? (a) : (b))

# X  = 0
# SX = 0
# Y  = 1
# Z  = 2
# W  = 3
# SY = 5
# SZ = 10
# TX = 12
# TY = 13
# TZ = 14

class Vector

    constructor: (@x,@y,@z,@w) ->
        if @x instanceof Vector
            @copy @x

    copy: (v) -> 
        @x = v.x
        @y = v.y 
        @z = v.z 
        @w = v.w
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
    round:  -> new Vector rint(@x), rint(@y), rint(@z), @w

    xyangle: (v) ->
        thisXY  = new Vector(@x, @y).normal()
        otherXY = new Vector(v.x, v.y).normal()
        if thisXY.xyperp() * otherXY >= 0 
            return Vector.RAD2DEG(Math.acos(thisXY * otherXY))
        -Vector.RAD2DEG(Math.acos(thisXY * otherXY));

    length:    -> Math.sqrt @x*@x+@y*@y+@z*@z+@w*@w
    angle: (v) -> Vector.RAD2DEG Math.acos @normal()*v.normal()  
    dot:   (v) -> @x*v.x + @y*v.y + @z*v.z + @w*v.w
    
    mul:   (f) -> new Vector @x*f, @y*f, @z*f, @w*f 
    div:   (d) -> new Vector @x/d, @y/d, @z/d, @w/d 
    plus:  (v) -> new Vector @x+v.x, @y+v.y, @z+v.z, @w+v.w
    minus: (v) -> new Vector @x-v.x, @y-v.y, @z-v.z, @w-v.w
     
    add: (v) ->
        @x += v.x 
        @y += v.y 
        @z += v.z
        @w += v.w
        @
    
    sub: (v) ->
        @x -= v.x 
        @y -= v.y 
        @z -= v.z
        @w -= v.w
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
    
    isZero: -> @x == @y == @z == 0

    # glTranslate: () -> glTranslatef @x,@y,@z  

    @DEG2RAD: (d) -> Math.PI*d/180.0
    @RAD2DEG: (r) -> r*180.0/Math.PI

module.exports = Vector