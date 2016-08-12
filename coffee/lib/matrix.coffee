# 00     00   0000000   000000000  00000000   000  000   000
# 000   000  000   000     000     000   000  000   000 000 
# 000000000  000000000     000     0000000    000    00000  
# 000 0 000  000   000     000     000   000  000   000 000 
# 000   000  000   000     000     000   000  000  000   000

class Matrix
    
    constructor: (o) ->
        @matrix = []
    
        if o instanceof Matrix
            @copy o
    
        else if o instanceof Array
            if o.length == 16
                for i in [0...16]
                    @matrix[i] = o[i]
    
        else if o?.x? and o?.y? and o?.z?
            @initXYZ o.x, o.y, o.z
    
        else if o instanceof Quaternion
            @initQuat o
        else
            @reset()
    
    initXYZ: (x,y,z) ->  
        @matrix[0]  = x.x
        @matrix[1]  = x.y
        @matrix[2]  = x.z
        @matrix[3]  = x.w
        @matrix[4]  = y.x
        @matrix[5]  = y.y
        @matrix[6]  = y.z
        @matrix[7]  = y.w
        @matrix[8]  = z.x
        @matrix[9]  = z.y
        @matrix[11] = z.w
        @matrix[10] = z.z
        @matrix[12] = 0.0
        @matrix[13] = 0.0 
        @matrix[14] = 0.0
        @matrix[15] = 1.0
        @

    initQuat: (o) ->
        # calculate coefficients
        x2 = o.x + o.x
        y2 = o.y + o.y
        z2 = o.z + o.z
        xx = o.x * x2 
        xy = o.x * y2
        xz = o.x * z2
        yy = o.y * y2 
        yz = o.y * z2
        zz = o.z * z2
        wx = o.w * x2 
        wy = o.w * y2
        wz = o.w * z2
         
        @matrix[0]  = 1.0 - (yy + zz)                        
        @matrix[1]  = xy + wz                       
        @matrix[2]  = xz - wy                        
        @matrix[3]  = 0.0                       
        @matrix[4]  = xy - wz                           
        @matrix[5]  = 1.0 - (xx + zz)                       
        @matrix[6]  = yz + wx                       
        @matrix[7]  = 0.0                       
        @matrix[8]  = xz + wy                        
        @matrix[9]  = yz - wx                        
        @matrix[10] = 1.0 - (xx + yy)                        
        @matrix[11] = 0.0                        
        @matrix[12] = 0.0                           
        @matrix[13] = 0.0                       
        @matrix[14] = 0.0                       
        @matrix[15] = 1.0  
        @

    copy: (m) ->
        for i in [0...16]
            @matrix[i] = m.matrix[i]
        @
        
    mul: (m) ->
        if m instanceof Matrix
            mm = new Matrix
            mm.matrix[0] = @matrix[0]*m.matrix[0]  + @matrix[4]*m.matrix[1]  + @matrix[8] *m.matrix[2]  + @matrix[12]*m.matrix[3]
            mm.matrix[1] = @matrix[1]*m.matrix[0]  + @matrix[5]*m.matrix[1]  + @matrix[9] *m.matrix[2]  + @matrix[13]*m.matrix[3]
            mm.matrix[2] = @matrix[2]*m.matrix[0]  + @matrix[6]*m.matrix[1]  + @matrix[10]*m.matrix[2]  + @matrix[14]*m.matrix[3]
            mm.matrix[3] = @matrix[3]*m.matrix[0]  + @matrix[7]*m.matrix[1]  + @matrix[11]*m.matrix[2]  + @matrix[15]*m.matrix[3]
            mm.matrix[4] = @matrix[0]*m.matrix[4]  + @matrix[4]*m.matrix[5]  + @matrix[8] *m.matrix[6]  + @matrix[12]*m.matrix[7]
            mm.matrix[5] = @matrix[1]*m.matrix[4]  + @matrix[5]*m.matrix[5]  + @matrix[9] *m.matrix[6]  + @matrix[13]*m.matrix[7]
            mm.matrix[6] = @matrix[2]*m.matrix[4]  + @matrix[6]*m.matrix[5]  + @matrix[10]*m.matrix[6]  + @matrix[14]*m.matrix[7]
            mm.matrix[7] = @matrix[3]*m.matrix[4]  + @matrix[7]*m.matrix[5]  + @matrix[11]*m.matrix[6]  + @matrix[15]*m.matrix[7]
            mm.matrix[8] = @matrix[0]*m.matrix[8]  + @matrix[4]*m.matrix[9]  + @matrix[8] *m.matrix[10] + @matrix[12]*m.matrix[11]
            mm.matrix[9] = @matrix[1]*m.matrix[8]  + @matrix[5]*m.matrix[9]  + @matrix[9] *m.matrix[10] + @matrix[13]*m.matrix[11]
            mm.matrix[11]= @matrix[3]*m.matrix[8]  + @matrix[7]*m.matrix[9]  + @matrix[11]*m.matrix[10] + @matrix[15]*m.matrix[11]
            mm.matrix[10]= @matrix[2]*m.matrix[8]  + @matrix[6]*m.matrix[9]  + @matrix[10]*m.matrix[10] + @matrix[14]*m.matrix[11]
            mm.matrix[12]= @matrix[0]*m.matrix[12] + @matrix[4]*m.matrix[13] + @matrix[8] *m.matrix[14] + @matrix[12]*m.matrix[15]
            mm.matrix[13]= @matrix[1]*m.matrix[12] + @matrix[5]*m.matrix[13] + @matrix[9] *m.matrix[14] + @matrix[13]*m.matrix[15]
            mm.matrix[14]= @matrix[2]*m.matrix[12] + @matrix[6]*m.matrix[13] + @matrix[10]*m.matrix[14] + @matrix[14]*m.matrix[15]
            mm.matrix[15]= @matrix[3]*m.matrix[12] + @matrix[7]*m.matrix[13] + @matrix[11]*m.matrix[14] + @matrix[15]*m.matrix[15]
            mm
        else 
            new Vector  @matrix[0] * v.x + @matrix[4]*v.y + @matrix[8] *v.z + @matrix[12]*v.w,
                        @matrix[1] * v.x + @matrix[5]*v.y + @matrix[9] *v.z + @matrix[13]*v.w,
                        @matrix[2] * v.x + @matrix[6]*v.y + @matrix[10]*v.z + @matrix[14]*v.w,
                        @matrix[3] * v.x + @matrix[7]*v.y + @matrix[11]*v.z + @matrix[15]*v.w
        
    reset: ->
        @matrix[0] = @matrix[5] = @matrix[10] = @matrix[15] = 1.0
        @matrix[1] = @matrix[4] = @matrix[8]  = @matrix[12] = 0.0
        @matrix[2] = @matrix[6] = @matrix[9]  = @matrix[13] = 0.0
        @matrix[3] = @matrix[7] = @matrix[11] = @matrix[14] = 0.0
    
    transform: (m) -> @copy @.mul m

    translate: (x,y,z) ->
        v = new Vector x,y,z
        @matrix[12] += @matrix[0]*v.x+@matrix[4]*v.y+@matrix[8] *v.z
        @matrix[13] += @matrix[1]*v.x+@matrix[5]*v.y+@matrix[9] *v.z
        @matrix[14] += @matrix[2]*v.x+@matrix[6]*v.y+@matrix[10]*v.z
        @matrix[15] += @matrix[3]*v.x+@matrix[7]*v.y+@matrix[11]*v.z
    
    @rotation (x,y,z) -> new Matrix().rotate x,y,z
    rotate: (x,y,z) ->
        
        rx = Vector.DEG2RAD x
        ry = Vector.DEG2RAD y
        rz = Vector.DEG2RAD z
        
        cx = Math.cos rx
        sx = Math.sin rx
        cy = Math.cos ry
        sy = Math.sin ry
        cz = Math.cos rz
        sz = Math.sin rz

        b0  = cy*cz
        b1  = sx*sy*cz+cx*sz
        b2  = -cx*sy*cz+sx*sz
        b4  = -cy*sz
        b5  = -sx*sy*sz+cx*cz
        b6  = cx*sy*sz+sx*cz
        b8  = sy
        b9  = -sx*cy
        b10 = cx*cy
        
        a0  = @matrix[0]
        a1  = @matrix[1]
        a2  = @matrix[2]
        a3  = @matrix[3]        
        a4  = @matrix[4]
        a5  = @matrix[5]
        a6  = @matrix[6]
        a7  = @matrix[7]       
        a8  = @matrix[8]
        a9  = @matrix[9]
        a10 = @matrix[10]
        a11 = @matrix[11]       
         
        @matrix[0]  = a0*b0+a4*b1+a8*b2
        @matrix[1]  = a1*b0+a5*b1+a9*b2
        @matrix[2]  = a2*b0+a6*b1+a10*b2
        @matrix[3]  = a3*b0+a7*b1+a11*b2
        @matrix[4]  = a0*b4+a4*b5+a8*b6
        @matrix[5]  = a1*b4+a5*b5+a9*b6
        @matrix[6]  = a2*b4+a6*b5+a10*b6
        @matrix[7]  = a3*b4+a7*b5+a11*b6
        @matrix[8]  = a0*b8+a4*b9+a8*b10
        @matrix[9]  = a1*b8+a5*b9+a9*b10
        @matrix[10] = a2*b8+a6*b9+a10*b10
        @matrix[11] = a3*b8+a7*b9+a11*b10
    
    scale: (x,y,z) ->
        @matrix[0]  *= x
        @matrix[1]  *= x
        @matrix[2]  *= x
        @matrix[3]  *= x
        @matrix[4]  *= y
        @matrix[5]  *= y
        @matrix[6]  *= y
        @matrix[7]  *= y
        @matrix[8]  *= z
        @matrix[9]  *= z
        @matrix[10] *= z
        @matrix[11] *= z
    
    @COFACTOR_4X4_IJ: (fac,m,i,j) ->
        
        ii = [0,0,0,0] 
        jj = [0,0,0,0]
        
        for k in [0...i] # compute which row, columnt to skip
            ii[k] = k
        for k in [i...3]
            ii[k] = k+1
        for k in [0...j] 
            jj[k] = k
        for k in [0...3] 
            jj[k] = k+1
                                    
        fac  = m[ii[0]][jj[0]] * (m[ii[1]][jj[1]]*m[ii[2]][jj[2]]     
                                - m[ii[1]][jj[2]]*m[ii[2]][jj[1]]) 
        fac -= m[ii[0]][jj[1]] * (m[ii[1]][jj[0]]*m[ii[2]][jj[2]]    
                                - m[ii[1]][jj[2]]*m[ii[2]][jj[0]])
        fac += m[ii[0]][jj[2]] * (m[ii[1]][jj[0]]*m[ii[2]][jj[1]]    
                                - m[ii[1]][jj[1]]*m[ii[2]][jj[0]])
                                    
        k = i+j                           
        if k != (k/2)*2 # compute sign
           fac = -fac
        fac
    
    @DETERMINANT_4X4: (m) ->                    
        d  = m[0][0] * @COFACTOR_4X4_IJ m, 0, 0
        d += m[0][1] * @COFACTOR_4X4_IJ m, 0, 1
        d += m[0][2] * @COFACTOR_4X4_IJ m, 0, 2
        d += m[0][3] * @COFACTOR_4X4_IJ m, 0, 3
        d
    
    @SCALE_ADJOINT_4X4: (a,s,m) ->                
        for i in [0...4] 
           for j in [0...4]
              a[j][i] = @COFACTOR_4X4_IJ m, i, j          
              a[j][i] *= s                       
    
    @INVERT_4X4: (b,a) ->            
        det = @DETERMINANT_4X4 a
        @SCALE_ADJOINT_4X4 b, 1.0 / det, a
    
    invert: () ->
        
        t = [[],[],[],[]] 
        inv = [[],[],[],[]]
        t[0][0] = @matrix[0]
        t[0][1] = @matrix[1]
        t[0][2] = @matrix[2]
        t[0][3] = @matrix[3]
        t[1][0] = @matrix[4]
        t[1][1] = @matrix[5]
        t[1][2] = @matrix[6]
        t[1][3] = @matrix[7]
        t[2][0] = @matrix[8]
        t[2][1] = @matrix[9]
        t[2][2] = @matrix[10]
        t[2][3] = @matrix[11]
        t[3][0] = @matrix[12]
        t[3][1] = @matrix[13]
        t[3][2] = @matrix[14]
        t[3][3] = @matrix[15]
        
        Matrix.INVERT_4X4 inv, t 
        
        @matrix[0]  = inv[0][0]
        @matrix[1]  = inv[0][1]
        @matrix[2]  = inv[0][2]
        @matrix[3]  = inv[0][3]
        @matrix[4]  = inv[1][0]
        @matrix[5]  = inv[1][1]
        @matrix[6]  = inv[1][2]
        @matrix[7]  = inv[1][3]
        @matrix[8]  = inv[2][0]
        @matrix[9]  = inv[2][1]
        @matrix[10] = inv[2][2]
        @matrix[11] = inv[2][3]
        @matrix[12] = inv[3][0]
        @matrix[13] = inv[3][1]
        @matrix[14] = inv[3][2]
        @matrix[15] = inv[3][3]
        @
    
    getQuaternion: () ->
        
        tr = @matrix[0] + @matrix[5] + @matrix[10]
        
        if tr > 0.0 # check the diagonal
            s = Math.sqrt tr + 1.0
            ss = 0.5 / s
            new Quaternion s/2.0, (@matrix[6]-@matrix[9])*ss, 
                                  (@matrix[8]-@matrix[2])*ss, 
                                  (@matrix[1]-@matrix[4])*ss
        else # diagonal is negative
            i = 0
            nxt = [1, 2, 0]
            q = [0,0,0,0]
    
            i = 1 if @matrix[5]  > @matrix[0] 
            i = 2 if @matrix[10] > @matrix[i*4+i]
            j = nxt[i]
            k = nxt[j]
    
            s = Math.sqrt (@matrix[i*4+i] - (@matrix[j*4+j] + @matrix[k*4+k])) + 1.0
            q[i] = s * 0.5
             
            s = 0.5 / s if s != 0.0 
    
            q[3] = (@matrix[j*4+k] - @matrix[k*4+j]) * s
            q[j] = (@matrix[i*4+j] + @matrix[j*4+i]) * s
            q[k] = (@matrix[i*4+k] + @matrix[k*4+i]) * s
    
            new Quaternion q[3], q[0], q[1], q[2]
            
    setPosition: (x,y,z) ->
        v = new Vector x,y,z
        @matrix[12] = v.x 
        @matrix[13] = v.y
        @matrix[14] = v.z
            
    setXVector: (v) ->
        @matrix[0] = v[0]
        @matrix[1] = v[1]
        @matrix[2] = v[2]
        
    setYVector: (v) ->
        @matrix[4] = v[0]
        @matrix[5] = v[1]
        @matrix[6] = v[2]
        
    setZVector: (v) ->
        @matrix[8]  = v[0]
        @matrix[9]  = v[1]
        @matrix[10] = v[2]

    getXVector:  () -> new Vector @matrix[0], @matrix[1], @matrix[2]     
    getYVector:  () -> new Vector @matrix[4], @matrix[5], @matrix[6] 
    getZVector:  () -> new Vector @matrix[8], @matrix[9], @matrix[10] 
    getPosition: () -> new Vector @matrix[12], @matrix[13], @matrix[14]

module.exports = Matrix
