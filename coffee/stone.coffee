#  0000000  000000000   0000000   000   000  00000000
# 000          000     000   000  0000  000  000     
# 0000000      000     000   000  000 0 000  0000000 
#      000     000     000   000  000  0000  000     
# 0000000      000      0000000   000   000  00000000

Pushable = require './pushable'

class Stone extends Pushable
    
    constructor: (@slippery=false) ->
        
        @geom = new THREE.BoxGeometry 0.98,0.98,0.98
        
        @mat  = new THREE.MeshPhongMaterial 
            color:          0xff8800
            side:           THREE.DoubleSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.8
            shininess:      20
            # alphaTest:      0.05
            depthWrite:     false
        
        @mesh = new THREE.Mesh @geom, @mat
        super

    isSlippery: -> return @slippery
    
module.exports = Stone
