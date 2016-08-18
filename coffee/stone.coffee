#  0000000  000000000   0000000   000   000  00000000
# 000          000     000   000  0000  000  000     
# 0000000      000     000   000  000 0 000  0000000 
#      000     000     000   000  000  0000  000     
# 0000000      000      0000000   000   000  00000000

Pushable = require './pushable'

class Stone extends Pushable
    
    constructor: (@slippery=false) ->
        
        @geom = new THREE.BoxGeometry 0.98,0.98,0.98
        # @geom.translate 0.01, 0.01, 0.01
        
        @mat  = new THREE.MeshPhongMaterial 
            color:          0xff8800
            side:           THREE.DoubleSide
            shading:        THREE.FlatShading
            transparent:    true
            opacity:        0.8
            shininess:      15
        
        @mesh = new THREE.Mesh @geom, @mat
        super

    isSlippery: -> return @slippery
    
module.exports = Stone
