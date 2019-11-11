#  0000000   00000000  000   000  00000000  00000000    0000000   000000000   0000000   00000000 
# 000        000       0000  000  000       000   000  000   000     000     000   000  000   000
# 000  0000  0000000   000 0 000  0000000   0000000    000000000     000     000   000  0000000  
# 000   000  000       000  0000  000       000   000  000   000     000     000   000  000   000
#  0000000   00000000  000   000  00000000  000   000  000   000     000      0000000   000   000

Gear     = require './gear'
Geom     = require './geom'
Wire     = require './wire'
Material = require './material'

class Generator extends Gear
    
    @: (face) ->
        super face
        
    del: ->
        
        @mesh.geometry.dispose()
        @gear.geometry.dispose()
        super
        
    createMesh: ->
        
        @mesh = new THREE.Mesh Geom.generator(), Material.plate
        @gear = new THREE.Mesh Geom.gear(),    Material.gear
        @mesh.add @gear
        @mesh.receiveShadow = true
        
    activateWires: ->
        
        wires = world.getObjectsOfTypeAtPos Wire, @getPos()
        for wire in wires
            wire.setActive @active
    
    setActive: (active) ->
        
        if @active != active
            super active
            @activateWires()
            world.playSound @active and 'GENERATOR_ON' or 'GENERATOR_OFF'
            
module.exports = Generator
