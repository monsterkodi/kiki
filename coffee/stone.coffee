#  0000000  000000000   0000000   000   000  00000000
# 000          000     000   000  0000  000  000     
# 0000000      000     000   000  000 0 000  0000000 
#      000     000     000   000  000  0000  000     
# 0000000      000      0000000   000   000  00000000

Pushable = require './pushable'

class Stone extends Pushable
    
    constructor: (opt) ->
        @slippery = opt?.slippery or false
        @color = opt?.color or 0xff8800
        @geom = new THREE.BoxGeometry 0.98,0.98,0.98
        
        @mat  = new THREE.MeshPhongMaterial 
            color:          @color
            side:           THREE.DoubleSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.7
            shininess:      20
        
        @mesh = new THREE.Mesh @geom, @mat
        @mesh.receiveShadow = true
        @mesh.castShadow = true
        super

    isSlippery: -> return @slippery
    
module.exports = Stone
