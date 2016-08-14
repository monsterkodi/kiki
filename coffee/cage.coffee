#  0000000   0000000    0000000   00000000
# 000       000   000  000        000     
# 000       000000000  000  0000  0000000 
# 000       000   000  000   000  000     
#  0000000  000   000   0000000   00000000

class Cage
    
    constructor: (@size, @gap) ->
        
        cageMat  = new THREE.MeshPhongMaterial 
            color:          0x880000
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            shininess:      10
            emissive:       0x880000
            emissiveIntensity: 0.02

        rasterMat  = new THREE.MeshPhongMaterial 
            color:          0x880000
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            shininess:      20
        
        geom = @wallTiles @gap                  

        @cage = new THREE.Mesh geom, cageMat
        @cage.translateX -0.5
        @cage.translateY -0.5 
        @cage.translateZ -0.5
        world.scene.add @cage        

        geom = @wallTiles 0

        @raster = new THREE.Mesh geom, rasterMat
        @raster.translateX -0.5
        @raster.translateY -0.5 
        @raster.translateZ -0.5
        world.scene.add @raster        
     
    del: -> 
        world.scene.remove @raster
        world.scene.remove @cage 
        
    wallTiles: (raster=0) ->
        
        faces     = @size.x * @size.y * 2 + @size.x * @size.z * 2 + @size.y * @size.z * 2
        triangles = faces * 2    
        positions = new Float32Array triangles * 3 * 3
        normals   = new Float32Array triangles * 3 * 3

        s = 1-raster
        o = raster
        i = -1
        offset = raster/10
        
        z = offset
        n = 1
        for x in [0...@size.x]
            for y in [0...@size.y]
                positions[i+=1] = x+o;  normals[i] = 0  
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n

        z = @size.z - offset
        n = -1
        for x in [0...@size.x]
            for y in [0...@size.y]
                positions[i+=1] = x+o;  normals[i] = 0  
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z  ;  normals[i] = n

        y = offset
        n = 1
        for x in [0...@size.x]
            for z in [0...@size.z]
                positions[i+=1] = x+o;  normals[i] = 0  
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0

        y = @size.y - offset
        n = -1
        for x in [0...@size.x]
            for z in [0...@size.z]
                positions[i+=1] = x+o;  normals[i] = 0  
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0
                
                positions[i+=1] = x+s;  normals[i] = 0  
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x+o;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x+s;  normals[i] = 0
                positions[i+=1] = y  ;  normals[i] = n
                positions[i+=1] = z+o;  normals[i] = 0

        x = offset
        n = 1
        for y in [0...@size.y]
            for z in [0...@size.z]
                positions[i+=1] = x  ;  normals[i] = n  
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0

        x = @size.x-offset
        n = -1
        for y in [0...@size.y]
            for z in [0...@size.z]
                positions[i+=1] = x  ;  normals[i] = n  
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+o;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+o;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0
                positions[i+=1] = x  ;  normals[i] = n
                positions[i+=1] = y+s;  normals[i] = 0
                positions[i+=1] = z+s;  normals[i] = 0

        geom = new THREE.BufferGeometry
        geom.addAttribute 'position', new THREE.BufferAttribute positions, 3 
        geom.addAttribute 'normal',   new THREE.BufferAttribute normals,   3 
        geom
        
module.exports = Cage
