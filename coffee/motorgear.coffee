# 00     00   0000000   000000000   0000000   00000000    0000000   00000000   0000000   00000000 
# 000   000  000   000     000     000   000  000   000  000        000       000   000  000   000
# 000000000  000   000     000     000   000  0000000    000  0000  0000000   000000000  0000000  
# 000 0 000  000   000     000     000   000  000   000  000   000  000       000   000  000   000
# 000   000   0000000      000      0000000   000   000   0000000   00000000  000   000  000   000

Gear     = require './gear'
Geom     = require './geom'
Material = require './material'

class MotorGear extends Gear
    
    constructor: (face) -> 
        super face
        @setActive true

    createMesh: ->
        @mesh = new THREE.Mesh Geom.gear(),    Material.gear
        @mesh.add new THREE.Mesh Geom.motor(), Material.plate
        @mesh.receiveShadow = true
        
module.exports = MotorGear
