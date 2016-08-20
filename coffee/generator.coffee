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
        @mesh = new THREE.Mesh Geom.gear(), Cage.cageMat
        @mesh.add new THREE.Mesh Geom.generator(), Cage.rasterMat
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
    
    render: ->
        # if (active)
            # glRotatef (clockwise ? angle : -angle, 0.0, 0.0, 1.0);
#     
        # colors[0].glColor();
#     
        # render_generator;
#     
        # KikiGear::colors[0].glColor();
#             
        # glTranslatef (0.0, 0.0, 0.4);
#     
        # render_gear;
        
module.exports = Generator
