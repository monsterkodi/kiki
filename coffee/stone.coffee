#  0000000  000000000   0000000   000   000  00000000
# 000          000     000   000  0000  000  000     
# 0000000      000     000   000  000 0 000  0000000 
#      000     000     000   000  000  0000  000     
# 0000000      000      0000000   000   000  00000000

Pushable = require './pushable'

class Stone extends Pushable
    
    constructor: (@slippery=false) ->
        
        @geom = new THREE.BoxGeometry 1,1,1
        
        @mat  = new THREE.MeshPhongMaterial 
            color:          0xff8800
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.58
            shininess:      0.9
        
        @mesh = new THREE.Mesh @geom, @mat
        world.scene.add @mesh
        @mesh.matrixAutoUpdate = true
        super

    isSlippery: -> return @slippery
    
module.exports = Stone
