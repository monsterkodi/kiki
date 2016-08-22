#  0000000    0000000   000000000  00000000
# 000        000   000     000     000     
# 000  0000  000000000     000     0000000 
# 000   000  000   000     000     000     
#  0000000   000   000     000     00000000

Vector = require './lib/vector'
Switch = require './switch'
Light  = require './light'
Action = require './action'

class Gate extends Switch
    
    isSpaceEgoistic: -> false

    constructor: (active) ->
        super active
        @ENTER_EVENT = @addEventWithName "enter"
        @value = 0.0
        @getActionWithId(Action.ROTATE).duration = 50000 
        @sound_on  = 'GATE_OPEN'
        @sound_off = 'GATE_CLOSE'

    createLight: -> 
        @light = new Light 
            pos:    @position
            radius: 10.0
            shadow: true
            
    createMesh: () -> 
        torusRadius = 0.05
        t1 = new THREE.TorusBufferGeometry 0.5-torusRadius, torusRadius, 16, 32
        @mat = new THREE.MeshPhongMaterial 
            color:     0xff0000
            side:      THREE.FrontSide
            shading:   THREE.SmoothShading
            shininess: 5
            
        @mesh = new THREE.Mesh t1, @mat
        @mesh.castShadow = true
        @mesh.receiveShadow = true
        
        t2 = new THREE.TorusGeometry 0.5-torusRadius, torusRadius, 16, 32
        t3 = new THREE.TorusGeometry 0.5-torusRadius, torusRadius, 16, 32
        t2.rotateY Vector.DEG2RAD 90 
        t3.rotateX Vector.DEG2RAD 90 
        t2.merge t3
        @tors = new THREE.Mesh t2, @mat
        @tors.castShadow = true
        @tors.receiveShadow = true
        @mesh.add @tors
        @mesh.castShadow = true
        @mesh.receiveShadow = true
        @mesh
    
    bulletImpact: ->

    newCellMate: (object) ->
        if object.name == 'player' and @active
            world.playSound 'GATE_WARP'
            @events[@ENTER_EVENT].triggerActions() 
                
module.exports = Gate
