
#    0000000   000   000   0000000   000000000  00000000  00000000   000   000  000   0000000   000   000
#   000   000  000   000  000   000     000     000       000   000  0000  000  000  000   000  0000  000
#   000 00 00  000   000  000000000     000     0000000   0000000    000 0 000  000  000   000  000 0 000
#   000 0000   000   000  000   000     000     000       000   000  000  0000  000  000   000  000  0000
#    00000 00   0000000   000   000     000     00000000  000   000  000   000  000   0000000   000   000

log    = require '/Users/kodi/s/ko/js/tools/log'
Vector = require './vector'

class Quaternion

    constructor: (w=1, x=0, y=0, z=0) ->
        if w instanceof Vector
            @x = w.x
            @y = w.y
            @z = w.z
            @w = 0
        else if w instanceof Quaternion
            @x = w.x
            @y = w.y
            @z = w.z
            @w = w.w
        else if Array.isArray w
            @w = w[0]            
            @x = w[1]
            @y = w[2]
            @z = w[3]
        else
            @x = x
            @y = y
            @z = z
            @w = w
        if Number.isNaN @x
            throw new Error
            
    copy: -> new Quaternion @
    clone: (q) -> 
        @x = q.x
        @y = q.y
        @z = q.z
        @w = q.w
        @
        
    rounded: ->        
        minDist = 1000
        minQuat = null
        up   = @rotate Vector.unitY
        back = @rotate Vector.unitZ
        for q in [  Quaternion.XupY
                    Quaternion.XupZ
                    Quaternion.XdownY
                    Quaternion.XdownZ
                    Quaternion.YupX
                    Quaternion.YupZ
                    Quaternion.YdownX
                    Quaternion.YdownZ
                    Quaternion.ZupX
                    Quaternion.ZupY
                    Quaternion.ZdownX
                    Quaternion.ZdownY
                    Quaternion.minusXupY
                    Quaternion.minusXupZ
                    Quaternion.minusXdownY
                    Quaternion.minusXdownZ
                    Quaternion.minusYupX
                    Quaternion.minusYupZ
                    Quaternion.minusYdownX
                    Quaternion.minusYdownZ
                    Quaternion.minusZupX
                    Quaternion.minusZupY
                    Quaternion.minusZdownX
                    Quaternion.minusZdownY
                    ]
            upDiff   = 1 - up.dot q.rotate Vector.unitY
            backDiff = 1 - back.dot q.rotate Vector.unitZ
            l = upDiff + backDiff
            if l < minDist
                minDist = l
                minQuat = q
                if l < 0.0001
                    break
        minQuat
        
    round: -> @clone @normalize().rounded()

    euler: -> [
        Vector.RAD2DEG Math.atan2 2*(@w*@x+@y*@z), 1-2*(@x*@x+@y*@y)
        Vector.RAD2DEG Math.asin  2*(@w*@y-@z*@x)
        Vector.RAD2DEG Math.atan2 2*(@w*@z+@x*@y), 1-2*(@y*@y+@z*@z)]

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
    
    minus: (quat) -> @copy().sub quat

    dot: (q) -> @x*q.x + @y*q.y + @z*q.z + @w*q.w

    rotate: (v) ->
        qv = new Quaternion v 
        rq = @mul qv.mul @getConjugate()
        new Vector rq.x, rq.y, rq.z 
                
    normalize: ->
        l = Math.sqrt @w*@w + @x*@x + @y*@y + @z*@z 
        if l != 0.0
            @w /= l 
            @x /= l 
            @y /= l 
            @z /= l
        @

    invert: ->
        l = Math.sqrt @w*@w + @x*@x + @y*@y + @z*@z 
        if l != 0.0 
            @w /= l 
            @x = -@x/l
            @y = -@y/l
            @z = -@z/l 
        @

    isZero: -> @x==@y==@z==0 and @w==1
    reset: -> 
        @x=@y=@z=0
        @w=1 
        @
        
    conjugate: -> 
        @x = -@x
        @y = -@y
        @z = -@z
        @ 
        
    getNormal:     -> @copy().normalize()
    getConjugate:  -> @copy().conjugate()
    getInverse:    -> @copy().invert()
    neg:           -> new Quaternion -@w,-@x,-@y,-@z
    vector:        -> new Vector @x, @y, @z
    length:        -> Math.sqrt @w*@w + @x*@x + @y*@y + @z*@z
    eql:       (q) -> @w==q.w and @x=q.x and @y==q.y and @z==q.z
    
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
            omega  = Math.acos cosom  # standard case (slerp)
            sinom  = Math.sin omega 
            scale0 = Math.sin((1.0 - t) * omega) / sinom
            scale1 = Math.sin(t * omega) / sinom
        else # "from" and "to" quaternions are very close -> we can do a linear interpolation
            scale0 = 1.0 - t
            scale1 = t

        new Quaternion scale0 * @w + scale1 * to1[3],
                       scale0 * @x + scale1 * to1[0], 
                       scale0 * @y + scale1 * to1[1],
                       scale0 * @z + scale1 * to1[2]

    @rotationAroundVector: (theta, x,y,z) ->
        v = new Vector x,y,z 
        v.normalize()
        t = Vector.DEG2RAD(theta)/2.0       
        s = Math.sin t 
        (new Quaternion Math.cos(t), v.x*s, v.y*s, v.z*s).normalize()

    @rotationFromEuler: (x,y,z) ->
        x = Vector.DEG2RAD x
        y = Vector.DEG2RAD y
        z = Vector.DEG2RAD z
        q=new Quaternion  Math.cos(x/2) * Math.cos(y/2) * Math.cos(z/2) + Math.sin(x/2) * Math.sin(y/2) * Math.sin(z/2),
                          Math.sin(x/2) * Math.cos(y/2) * Math.cos(z/2) - Math.cos(x/2) * Math.sin(y/2) * Math.sin(z/2),
                          Math.cos(x/2) * Math.sin(y/2) * Math.cos(z/2) + Math.sin(x/2) * Math.cos(y/2) * Math.sin(z/2),
                          Math.cos(x/2) * Math.cos(y/2) * Math.sin(z/2) - Math.sin(x/2) * Math.sin(y/2) * Math.cos(z/2)
        q.normalize()

    @rot_0     = new Quaternion()
  
    @rot_90_X  = @rotationAroundVector 90,  Vector.unitX
    @rot_90_Y  = @rotationAroundVector 90,  Vector.unitY
    @rot_90_Z  = @rotationAroundVector 90,  Vector.unitZ
    @rot_180_X = @rotationAroundVector 180, Vector.unitX
    @rot_180_Y = @rotationAroundVector 180, Vector.unitY
    @rot_180_Z = @rotationAroundVector 180, Vector.unitZ
    @rot_270_X = @rotationAroundVector 270, Vector.unitX
    @rot_270_Y = @rotationAroundVector 270, Vector.unitY
    @rot_270_Z = @rotationAroundVector 270, Vector.unitZ

    @XupY        =                @rot_270_Y
    @XupZ        = @rot_90_X.mul  @rot_270_Y
    @XdownY      = @rot_180_X.mul @rot_270_Y
    @XdownZ      = @rot_270_X.mul @rot_270_Y
        
    @YupX        = @rot_90_Y.mul  @rot_90_X
    @YupZ        =                @rot_90_X
    @YdownX      = @rot_270_Y.mul @rot_90_X
    @YdownZ      = @rot_180_Y.mul @rot_90_X
    
    @ZupX        = @rot_90_Z.mul  @rot_180_X
    @ZupY        = @rot_180_Z.mul @rot_180_X
    @ZdownX      = @rot_270_Z.mul @rot_180_X
    @ZdownY      =                @rot_180_X
    
    @minusXupY   =                @rot_90_Y
    @minusXupZ   = @rot_90_X.mul  @rot_90_Y
    @minusXdownY = @rot_180_X.mul @rot_90_Y
    @minusXdownZ = @rot_270_X.mul @rot_90_Y
        
    @minusYupX   = @rot_270_Y.mul @rot_270_X
    @minusYupZ   = @rot_180_Y.mul @rot_270_X
    @minusYdownX = @rot_90_Y.mul  @rot_270_X
    @minusYdownZ =                @rot_270_X
    
    @minusZupX   = @rot_270_Z
    @minusZupY   = @rot_0
    @minusZdownX = @rot_90_Z
    @minusZdownY = @rot_180_Z
        
    @rot_0.name       = 'rot_0'
    @rot_90_X.name    = 'rot_90_X'
    @rot_90_Y.name    = 'rot_90_Y'
    @rot_90_Z.name    = 'rot_90_Z'
    @rot_180_X.name   = 'rot_180_X'
    @rot_180_Y.name   = 'rot_180_Y'
    @rot_180_Z.name   = 'rot_180_Z'
    @rot_270_X.name   = 'rot_270_X'
    @rot_270_Y.name   = 'rot_270_Y'
    @rot_270_Z.name   = 'rot_270_Z'
    
    @XupY.name        = 'XupY'
    @XupZ.name        = 'XupZ'
    @XdownY.name      = 'XdownY'
    @XdownZ.name      = 'XdownZ'
    @YupX.name        = 'YupX'
    @YupZ.name        = 'YupZ'
    @YdownX.name      = 'YdownX'
    @YdownZ.name      = 'YdownZ'
    @ZupX.name        = 'ZupX'
    @ZupY.name        = 'ZupY'
    @ZdownX.name      = 'ZdownX'
    @ZdownY.name      = 'ZdownY'
    @minusXupY.name   = 'minusXupY'
    @minusXupZ.name   = 'minusXupZ'
    @minusXdownY.name = 'minusXdownY'
    @minusXdownZ.name = 'minusXdownZ'
    @minusYupX.name   = 'minusYupX'
    @minusYupZ.name   = 'minusYupZ'
    @minusYdownX.name = 'minusYdownX'
    @minusYdownZ.name = 'minusYdownZ'
    @minusZupX.name   = 'minusZupX'
    @minusZupY.name   = 'minusZupY'
    @minusZdownX.name = 'minusZdownX'
    @minusZdownY.name = 'minusZdownY'
    
module.exports = Quaternion            