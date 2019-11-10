#  0000000   0000000    0000000   00000000
# 000       000   000  000        000     
# 000       000000000  000  0000  0000000 
# 000       000   000  000   000  000     
#  0000000  000   000   0000000   00000000

Material = require './material'

class Cage

    @: (@size, gap) ->
        
        Cage.gap = gap
        geom = Cage.wallTiles @size, 'inside', 0
        @raster = new THREE.Mesh geom, Material.raster 
        @raster.translateX -0.5
        @raster.translateY -0.5 
        @raster.translateZ -0.5
        @raster.receiveShadow = true
        world.scene.add @raster        
        
        geom = Cage.wallTiles @size, 'inside', Cage.gap                  
        @cage = new THREE.Mesh geom, Material.plate 
        @cage.translateX -0.5
        @cage.translateY -0.5 
        @cage.translateZ -0.5
        @cage.receiveShadow = true
        world.scene.add @cage        
     
    del: -> 
        
        world.scene.remove @raster
        world.scene.remove @cage 
        
    @wallTiles: (size, side, raster=Cage.gap) ->

        faces     = size.x * size.y * 2 + size.x * size.z * 2 + size.y * size.z * 2
        triangles = faces * 2

        positions = new Float32Array triangles * 3 * 3
        normals   = new Float32Array triangles * 3 * 3

        s = 1-raster
        o = raster
        i = -1
        offset = (side == 'outside' and -1 or 1) * raster/20
        
        xyPlate = (x, y, z) -> 
            positions[i+=1] = x+o; normals[i] = 0  
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = 1

        yxPlate = (x, y, z) ->
            positions[i+=1] = x+o; normals[i] = 0  
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z  ; normals[i] = -1

        zxPlate = (x, y, z) ->
            positions[i+=1] = x+o; normals[i] = 0  
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = 1
            positions[i+=1] = z+s; normals[i] = 0

        xzPlate = (x, y, z) ->
            positions[i+=1] = x+o; normals[i] = 0  
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0  
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x+o; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x+s; normals[i] = 0
            positions[i+=1] = y  ; normals[i] = -1
            positions[i+=1] = z+o; normals[i] = 0

        yzPlate = (x, y, z) ->
            positions[i+=1] = x  ; normals[i] = 1  
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = 1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = 1
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = 1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = 1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = 1
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0

        zyPlate = (x, y, z) ->
            positions[i+=1] = x  ; normals[i] = -1  
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = -1
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = -1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = -1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+o; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = -1
            positions[i+=1] = y+o; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0
            positions[i+=1] = x  ; normals[i] = -1
            positions[i+=1] = y+s; normals[i] = 0
            positions[i+=1] = z+s; normals[i] = 0
            
        plates = side == 'outside' and [yxPlate, xyPlate, xzPlate, zxPlate, zyPlate, yzPlate] or [xyPlate, yxPlate, zxPlate, xzPlate, yzPlate, zyPlate]
        for x in [0...size.x]
            for y in [0...size.y]
                plates[0] x, y, offset
                plates[1] x, y, size.z - offset

        for x in [0...size.x]
            for z in [0...size.z]
                plates[2] x, offset, z
                plates[3] x, size.y - offset, z

        for y in [0...size.y]
            for z in [0...size.z]
                plates[4] offset, y, z
                plates[5] size.x-offset, y, z

        geom = new THREE.BufferGeometry
        geom.setAttribute 'position' new THREE.BufferAttribute positions, 3 
        geom.setAttribute 'normal'   new THREE.BufferAttribute normals,   3 
        geom
        
module.exports = Cage
