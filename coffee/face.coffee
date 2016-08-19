# 00000000   0000000    0000000  00000000
# 000       000   000  000       000     
# 000000    000000000  000       0000000 
# 000       000   000  000       000     
# 000       000   000   0000000  00000000

Quaternion = require './lib/quaternion'
Vector     = require './lib/vector'

class Face
    
    @orientationForFace: (face) ->
        switch face % 6
            when 0 then return Quaternion.rot_90_Y
            when 1 then return Quaternion.rot_0
            when 2 then return Quaternion.rot_270_X
            when 3 then return Quaternion.rot_270_Y
            when 4 then return Quaternion.rot_90_X
            when 5 then return Quaternion.rot_180_X

    @normalVectorForFace: (face) ->
        o = (face < 3) and -1 or 1
        switch face % 3 
            when 0 then return new Vector o, 0, 0
            when 1 then return new Vector 0, o, 0
            when 2 then return new Vector 0, 0, o
        new Vector
    
module.exports = Face
