#  0000000  000000000   0000000   000   000  00000000
# 000          000     000   000  0000  000  000     
# 0000000      000     000   000  000 0 000  0000000 
#      000     000     000   000  000  0000  000     
# 0000000      000      0000000   000   000  00000000

Pushable = require './pushable'
Material = require './material'

class Stone extends Pushable
    
    @: (opt) ->
        @slippery = opt?.slippery or false
        @opacity = opt?.opacity
        if opt?.color
            if Array.isArray opt.color
                @color = new THREE.Color opt.color[0], opt.color[1], opt.color[2]
            else
                @color = opt.color                
        super

    isSlippery: -> return @slippery
    
    createMesh: ->
        if @slippery
            for x in [-1,1]
                for y in [-1,1]
                    for z in [-1,1]
                        cube = new THREE.BoxGeometry 0.48, 0.48, 0.48
                        cube.translate x * 0.25, y * 0.25, z * 0.25
                        if not @geom
                            @geom = cube 
                        else
                            @geom.merge cube
        else
            @geom = new THREE.BoxBufferGeometry 0.98,0.98,0.98
        @mat = Material.stone.clone()
        @mat.opacity = @opacity if @opacity?
        @mat.color.set @color if @color?
        @mesh = new THREE.Mesh @geom, @mat
        @mesh.receiveShadow = true
        @mesh.castShadow = true
    
module.exports = Stone
