#  0000000   00000000  000   000  00000000  00000000    0000000   000000000   0000000   00000000 
# 000        000       0000  000  000       000   000  000   000     000     000   000  000   000
# 000  0000  0000000   000 0 000  0000000   0000000    000000000     000     000   000  0000000  
# 000   000  000       000  0000  000       000   000  000   000     000     000   000  000   000
#  0000000   00000000  000   000  00000000  000   000  000   000     000      0000000   000   000

Gear = require './gear'
Geom = require './geom'
Cage = require './cage'
Wire = require './wire'

class Generator extends Gear
    
    constructor: (face) ->
        super face
        
    createMesh: ->
        @mesh = new THREE.Mesh Geom.generator(), Cage.cageMat
        @mesh.add new THREE.Mesh Geom.gear(), Cage.rasterMat
        @mesh.receiveShadow = true
        
    activateWires: ->
        wires = world.getObjectsOfTypeAtPos Wire, @getPos()
    
        for wire in wires
            wire.setActive active
    
    setActive: (active) ->
        if @active != active
            super active
            @activateWires()
            world.playSound @active and 'GENERATOR_ON' or 'GENERATOR_OFF'
            
module.exports = Generator
