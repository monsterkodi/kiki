# 00     00   0000000   000000000   0000000   00000000    0000000   00000000   0000000   00000000 
# 000   000  000   000     000     000   000  000   000  000        000       000   000  000   000
# 000000000  000   000     000     000   000  0000000    000  0000  0000000   000000000  0000000  
# 000 0 000  000   000     000     000   000  000   000  000   000  000       000   000  000   000
# 000   000   0000000      000      0000000   000   000   0000000   00000000  000   000  000   000

log           = require '/Users/kodi/s/ko/js/tools/log'
Gear          = require './gear'
Geom          = require './geom'
Face          = require './face'
Action        = require './action'
Material      = require './material'
Quaternion    = require './lib/quaternion'
MotorCylinder = require './motorcylinder'

class MotorGear extends Gear
    
    constructor: (@face) -> 
        super @face
        
    setPosition: (pos) ->
        super pos
        @updateActive()

    createMesh: ->
        @mesh = new THREE.Mesh Geom.motor(), Material.plate
        @gear = new THREE.Mesh Geom.gear(),  Material.gear
        @gear.receiveShadow = true
        @gear.castShadow = true
        @mesh.add @gear
        @mesh.receiveShadow = true
        @mesh.castShadow = true

    initAction: (action) ->
        # log "MotorGear.initAction action #{action.name}"
        if action.id in [Action.PUSH, Action.FALL]
            pos = @position.plus Face.normal @face
            occupant = world.getOccupantAtPos pos 
            isCylinder = occupant instanceof MotorCylinder and occupant.face == @face
            occupant.setActive false if isCylinder
        super action
        
    updateMesh: ->
        # log "Valve.updateMesh #{@angle} #{@face}"
        rot = Quaternion.rotationAroundVector (@clockwise and 1 or -1) * @angle, 0,0,1
        @gear.quaternion.copy rot #Face.orientationForFace(@face).mul rot
        @mesh.quaternion.copy Face.orientation @face
        
    updateActive: ->
        pos = @position.plus Face.normal @face
        # log "MotorGear.updateActive #{@active}", pos, world.getOccupantAtPos(pos) instanceof MotorCylinder
        occupant = world.getOccupantAtPos pos 
        isCylinder = occupant instanceof MotorCylinder and occupant.face == @face and not occupant.move_action
        @setActive isCylinder
        occupant.setActive true if isCylinder
        
module.exports = MotorGear
