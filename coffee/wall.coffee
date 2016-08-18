
#   000   000   0000000   000      000    
#   000 0 000  000   000  000      000    
#   000000000  000000000  000      000    
#   000   000  000   000  000      000    
#   00     00  000   000  0000000  0000000

Pos  = require './lib/pos'
Item = require './item'
Cage = require './cage'

class Wall extends Item

    @rasterMat = new THREE.MeshPhongMaterial 
        color:          0x770000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      10

    isSpaceEgoistic: -> true
    
    constructor: ->
                
        geom = Cage.wallTiles new Pos(1,1,1), 'outside', 0
        geom.translate -0.5, -0.5, -0.5
        @raster = new THREE.Mesh geom, Wall.rasterMat
        @raster.receiveShadow = true
        @raster.castShadow = true
        
        geom = Cage.wallTiles new Pos(1,1,1), 'outside', Cage.gap                  
        geom.translate -0.5, -0.5, -0.5
        @plates = new THREE.Mesh geom, Cage.cageMat
        @plates.receiveShadow = true
        
        @mesh = new THREE.Object3D
        @mesh.add @raster
        @mesh.add @plates
        
        super
    
module.exports = Wall
