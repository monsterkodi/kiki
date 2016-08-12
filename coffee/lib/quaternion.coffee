
#    0000000   000   000   0000000   000000000  00000000  00000000   000   000  000   0000000   000   000
#   000   000  000   000  000   000     000     000       000   000  0000  000  000  000   000  0000  000
#   000 00 00  000   000  000000000     000     0000000   0000000    000 0 000  000  000   000  000 0 000
#   000 0000   000   000  000   000     000     000       000   000  000  0000  000  000   000  000  0000
#    00000 00   0000000   000   000     000     00000000  000   000  000   000  000   0000000   000   000

Vector = require './vector'

class Quaternion
    
    constructor: (@w=1, @x=0, @y=0, @z=0) ->
        if @w instanceof Vector
            @x = @w.x
            @y = @w.y
            @z = @w.z
            @w = 0
        else if @w instanceof Quaternion
            @x = @w.x
            @y = @w.y
            @z = @w.z
            @w = @w.w
        
    @rotationAroundVector: (theta, vector) ->
        v = new Vector vector 
        v.normalize()
        t = Vector.DEG2RAD(theta)/2.0       
        s = Math.sin(t)
        new Quaternion(Math.cos(t), v.x*s, v.y*s, v.z*s).normalize()

    add: (quat) ->
        @w += quat.w 
        @x += quat.x 
        @y += quat.y 
        @z += quat.z
        @
    
    sub: (quat) ->
        @w -= quat.w 
        @x -= quat.x 
        @y -= quat.y 
        @z -= quat.z
        @
    
    rotate: (v) ->
        qv = new Quaternion v 
        rq = @mul qv.mul @getConjugate()
        new Vector rq.x, rq.y, rq.z 
                
    normalize: ->
        l = Math.sqrt(w*w + x*x + y*y + z*z)
        if l != 0.0
            w /= l; x /= l; y /= l; z /= l
        @

    invert: ->
        l = Math.sqrt(w*w + x*x + y*y + z*z)
        if l != 0.0 
            w /= l; x = -x/l; y = -y/l; z = -z/l 
        @

    reset: -> 
        @x=@y=@z=0
        @w=1.0 
        @
        
    conjugate: -> 
        @x = -@x
        @y = -@y
        @z = -@z
        @ 
        
    getNormal:     -> new Quaternion(@).normalize()
    getConjugate:  -> new Quaternion(@).conjugate()
    getInverse:    -> new Quaternion(@).invert()
    neg:           -> new Quaternion -@w,-@x,-@y,-@z
    vector:        -> new Vector @x, @y, @z
    length:        -> Math.sqrt @w*@w + @x*@x + @y*@y + @z*@z
    eql:       (q) -> @w==q.w and @x=q.x and @y==q.y and @z==q.z
    
    # Quaternion &     operator +=     ( float f )    { w += f; return(*this); }
    # Quaternion &     operator -=     ( float f )    { w -= f; return(*this); }
    # Quaternion &     operator *=     ( float f )    { w *= f; x *= f; y *= f; z *= f; return(*this); }
    # Quaternion &     operator /=     ( float f )    { w /= f; x /= f; y /= f; z /= f; return(*this); }
            
    mul: (quatOrScalar) ->
        if quatOrScalar instanceof Quaternion
            quat = quatOrScalar
            A = (@w + @x) * (quat.w + quat.x)
            B = (@z - @y) * (quat.y - quat.z)
            C = (@w - @x) * (quat.y + quat.z) 
            D = (@y + @z) * (quat.w - quat.x)
            E = (@x + @z) * (quat.x + quat.y)
            F = (@x - @z) * (quat.x - quat.y)
            G = (@w + @y) * (quat.w - quat.z)
            H = (@w - @y) * (quat.w + quat.z)
            new Quaternion B + (-E - F + G + H)/2,
                           A -  (E + F + G + H)/2,
                           C +  (E - F + G - H)/2,
                           D +  (E - F - G + H)/2
        else
            new Quaternion @w*f, @x*f, @y*f, z*f

    slerp: (quat, t) ->

        to1   = [0,0,0,0]
        cosom = @x * quat.x + @y * quat.y + @z * quat.z + @w * quat.w # calc cosine
        
        if cosom < 0 # adjust signs (if necessary)
            cosom = -cosom 
            to1[0] = -quat.x
            to1[1] = -quat.y
            to1[2] = -quat.z
            to1[3] = -quat.w
        else  
            to1[0] = quat.x
            to1[1] = quat.y
            to1[2] = quat.z
            to1[3] = quat.w
        
        if (1.0 - cosom) > 0.001 # calculate coefficients
            omega  = Math.acos(cosom) # standard case (slerp)
            sinom  = Math.sin(omega)
            scale0 = Math.sin((1.0 - t) * omega) / sinom
            scale1 = Math.sin(t * omega) / sinom
        else # "from" and "to" quaternions are very close -> we can do a linear interpolation
            scale0 = 1.0 - t
            scale1 = t

        new Quaternion scale0 * w + scale1 * to1[3],
                       scale0 * x + scale1 * to1[0], 
                       scale0 * y + scale1 * to1[1],
                       scale0 * z + scale1 * to1[2]

module.exports = Quaternion            