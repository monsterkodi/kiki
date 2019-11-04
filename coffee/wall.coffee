
#   000   000   0000000   000      000    
#   000 0 000  000   000  000      000    
#   000000000  000000000  000      000    
#   000   000  000   000  000      000    
#   00     00  000   000  0000000  0000000

Pos      = require './lib/pos'
Item     = require './item'
Cage     = require './cage'
Material = require './material'

class Wall extends Item

    isSpaceEgoistic: -> true
    
    @: -> super
       
    createMesh: -> 
        geom = new THREE.BoxGeometry 1,1,1
        @raster = new THREE.Mesh geom, Material.wall
        @raster.receiveShadow = true
        @raster.castShadow = true
        
        geom = Cage.wallTiles new Pos(1,1,1), 'outside', Cage.gap                  
        geom.translate -0.5, -0.5, -0.5
        @plates = new THREE.Mesh geom, Material.plate.clone()
        @plates.receiveShadow = true
        
        @mesh = new THREE.Object3D
        @mesh.add @raster
        @mesh.add @plates
    
module.exports = Wall
