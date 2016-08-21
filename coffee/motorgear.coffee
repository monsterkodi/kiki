# 00     00   0000000   000000000   0000000   00000000    0000000   00000000   0000000   00000000 
# 000   000  000   000     000     000   000  000   000  000        000       000   000  000   000
# 000000000  000   000     000     000   000  0000000    000  0000  0000000   000000000  0000000  
# 000 0 000  000   000     000     000   000  000   000  000   000  000       000   000  000   000
# 000   000   0000000      000      0000000   000   000   0000000   00000000  000   000  000   000

log           = require '/Users/kodi/s/ko/js/tools/log'
Gear          = require './gear'
Geom          = require './geom'
Face          = require './face'
Material      = require './material'
Quaternion    = require './lib/quaternion'
MotorCylinder = require './motorcylinder'

class MotorGear extends Gear
    
    constructor: (face) -> 
        super face
        @setActive true

    createMesh: ->
        @mesh = new THREE.Mesh Geom.motor(), Material.plate
        @gear = new THREE.Mesh Geom.gear(),  Material.gear
        @mesh.add @gear
        @mesh.receiveShadow = true

    updateMesh: ->
        # log "Valve.updateMesh #{@angle} #{@face}"
        rot = Quaternion.rotationAroundVector (@clockwise and 1 or -1) * @angle, 0,0,1
        @gear.quaternion.copy Face.orientationForFace(@face).mul rot
        
    updateActive: ->
        pos = @position.plus Face.normal @face
        # log "MotorGear.updateActive #{@active}", pos, world.getOccupantAtPos(pos) instanceof MotorCylinder
        @setActive world.getOccupantAtPos(pos) instanceof MotorCylinder
        
module.exports = MotorGear
