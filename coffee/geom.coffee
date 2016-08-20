
#    0000000   00000000   0000000   00     00
#   000        000       000   000  000   000
#   000  0000  0000000   000   000  000000000
#   000   000  000       000   000  000 0 000
#    0000000   00000000   0000000   000   000

log    = require '/Users/kodi/s/ko/js/tools/log'
Vector = require './lib/vector'

class Geom

    @generator: ->
        quads = 22+4*8+8*4
        triangles = quads*2
        positions = new Float32Array triangles*9
        normals   = new Float32Array triangles*9
        pi = -1  
        pi = @quadList  positions, normals, pi, @generatorQuads
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip1
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip2
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip3
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip4
        
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip5
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip6
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip7
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip8
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip9
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip10
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip11
        pi = @quadStrip positions, normals, pi, @generatorQuadStrip12
            
        geom = new THREE.BufferGeometry
        geom.addAttribute 'position', new THREE.BufferAttribute positions, 3 
        geom.addAttribute 'normal',   new THREE.BufferAttribute normals,  3   
        geom

    @valve: ->
        quads = 6+5*8
        triangles = quads*2
        positions = new Float32Array triangles*9
        normals   = new Float32Array triangles*9
        pi = -1  
        pi = @quadList  positions, normals, pi, @valveQuads
        pi = @quadStrip positions, normals, pi, @valveQuadStrip1
        pi = @quadStrip positions, normals, pi, @valveQuadStrip2
        pi = @quadStrip positions, normals, pi, @valveQuadStrip3
        pi = @quadStrip positions, normals, pi, @valveQuadStrip4
        pi = @quadStrip positions, normals, pi, @valveQuadStrip5
            
        geom = new THREE.BufferGeometry
        geom.addAttribute 'position', new THREE.BufferAttribute positions, 3 
        geom.addAttribute 'normal',   new THREE.BufferAttribute normals,  3   
        geom

    @gear: ->
        quads = 48+16*3
        triangles = quads*2
        positions = new Float32Array triangles*9
        normals   = new Float32Array triangles*9
        pi = -1  
        pi = @quadList  positions, normals, pi, @gearQuads
        pi = @quadStrip positions, normals, pi, @gearQuadStrip1
        pi = @quadStrip positions, normals, pi, @gearQuadStrip2
        pi = @quadStrip positions, normals, pi, @gearQuadStrip3
            
        geom = new THREE.BufferGeometry
        geom.addAttribute 'position', new THREE.BufferAttribute positions, 3 
        geom.addAttribute 'normal',   new THREE.BufferAttribute normals,  3   
        geom.translate 0,0,0.4
        geom

    @quadList: (positions, normals, pi, quads) ->
        numQuads = quads.length/12
        # log "quads #{numQuads}"
        for q in [0...numQuads]
            qi = q * 12
            p0 = new Vector quads[qi+0], quads[qi+1], quads[qi+2]
            p1 = new Vector quads[qi+3], quads[qi+4], quads[qi+5]
            p2 = new Vector quads[qi+6], quads[qi+7], quads[qi+8]
            nv = p1.minus(p0).cross(p2.minus(p0)).normal()
            n = [nv.x, nv.y, nv.z]
            for j in [0,1,2,0,2,3]
                jj = j * 3
                for i in [0...3]
                    positions[pi+=1] = quads[qi+jj+i]
                    normals[pi] = n[i]
        pi
        
    @quadStrip: (positions, normals, pi, strip) ->
        numQuads = strip.length/6-1
        # log "strip #{numQuads}"
        for q in [0...numQuads]
            qi = q * 6
            p0 = new Vector strip[qi+0], strip[qi+1], strip[qi+2]
            p1 = new Vector strip[qi+3], strip[qi+4], strip[qi+5]
            p2 = new Vector strip[qi+6], strip[qi+7], strip[qi+8]
            nv = p1.minus(p0).cross(p2.minus(p0)).normal()
            n = [nv.x, nv.y, nv.z]
            for j in [0,1,2,2,1,3]
                jj = j*3
                for i in [0...3]
                    positions[pi+=1] = strip[qi+jj+i]
                    normals[pi] = n[i]
        pi    
    
    #    0000000   00000000  000   000  00000000  00000000    0000000   000000000   0000000   00000000 
    #   000        000       0000  000  000       000   000  000   000     000     000   000  000   000
    #   000  0000  0000000   000 0 000  0000000   0000000    000000000     000     000   000  0000000  
    #   000   000  000       000  0000  000       000   000  000   000     000     000   000  000   000
    #    0000000   00000000  000   000  00000000  000   000  000   000     000      0000000   000   000

    @generatorQuads = [
        0.39, 0.330, 0.155,
        0.5, 0.05, 0.155,
        0.5, 0.05, -0.155,
        0.39, 0.330, -0.155,
        -0.39, -0.33, 0.155,
        -0.5, -0.038, 0.155,
        -0.5, -0.038, -0.155,
        -0.39, -0.33, -0.155,
        0.5, -0.038, 0.155,
        0.39, -0.33, 0.155,
        0.39, -0.33, -0.155,
        0.5, -0.038, -0.155,
        -0.33, 0.39, 0.155,
        -0.05, 0.5, 0.155,
        -0.05, 0.5, -0.155,
        -0.33, 0.39, -0.155,
        0.33, -0.380, 0.155,
        0.05, -0.5, 0.155,
        0.05, -0.5, -0.155,
        0.33, -0.380, -0.155,
        0.05, 0.5, 0.155,
        0.33, 0.39, 0.155,
        0.33, 0.39, -0.155,
        0.05, 0.5, -0.155,
        -0.5, 0.05, 0.155,
        -0.39, 0.330, 0.155,
        -0.39, 0.330, -0.155,
        -0.5, 0.05, -0.155,
        -0.05, -0.5, 0.155,
        -0.33, -0.380, 0.155,
        -0.33, -0.380, -0.155,
        -0.05, -0.5, -0.155,

        0.33,   0.05,  0.077, 
        0.27,   0.2,  0.077,  
        0.27,   0.2,  -0.077, 
        0.33,   0.05,  -0.077,
                                    
        -0.33, -0.05, 0.077,  
        -0.27, -0.2, 0.077,   
        -0.27, -0.2, -0.077,  
        -0.33, -0.05, -0.077, 
                                    
        0.27,  -0.2, 0.077,   
        0.33,  -0.05, 0.077,  
        0.33,  -0.05, -0.077, 
        0.27,  -0.2, -0.077,  
                                    
        -0.05,  0.33,  0.077, 
        -0.2,  0.27,  0.077,  
        -0.2,  0.27,  -0.077, 
        -0.05,  0.33,  -0.077,
                                    
        0.05,  -0.33, 0.077,  
        0.2,  -0.27, 0.077,   
        0.2,  -0.27, -0.077,  
        0.05,  -0.33, -0.077, 
                                    
        0.2,   0.27,  0.077,  
        0.05,   0.33,  0.077, 
        0.05,   0.33,  -0.077,
        0.2,   0.27,  -0.077, 
                                    
        -0.27,  0.2,  0.077,  
        -0.33,  0.05,  0.077, 
        -0.33,  0.05,  -0.077,
        -0.27,  0.2,  -0.077, 
                                    
        -0.2, -0.27, 0.077,   
        -0.05, -0.33, 0.077,  
        -0.05, -0.33, -0.077, 
        -0.2, -0.27, -0.077,  

        0.100, 0, 0.5,
        0.071, 0.071, 0.5,
        0, 0.100, 0.5,
        0.071, -0.071, 0.5,
        -0.100, 0, 0.5,
        -0.071, -0.071, 0.5,
        0, -0.100, 0.5,
        -0.071, 0.071, 0.5,
        0.071, -0.071, 0.5,
        0, 0.100, 0.5,
        -0.071, 0.071, 0.5,
        0, -0.100, 0.5,
        0.2, 0, -0.077,
        0.141, -0.141, -0.077,
        0, -0.2, -0.077,
        0.141, 0.141, -0.077,
        -0.2, 0, -0.077,
        -0.141, 0.141, -0.077,
        0, 0.2, -0.077,
        -0.141, -0.141, -0.077,
        0.141, 0.141, -0.077,
        0, -0.2, -0.077,
        -0.141, -0.141, -0.077,
        0, 0.2, -0.077,
        ]

    @generatorQuadStrip1 = [
        0.141,  0.141, -0.077,  
        0.141,  0.141,  0.077,
        0.200,  0, -0.077, 
        0.200,  0,  0.077, 
        0.141, -0.141, -0.077, 
        0.141, -0.141,  0.077, 
        0, -0.200, -0.077, 
        0, -0.200,  0.077, 
        -0.141, -0.141, -0.077, 
        -0.141, -0.141,  0.077, 
        -0.200,  0, -0.077, 
        -0.200,  0,  0.077, 
        -0.141,  0.141, -0.077, 
        -0.141,  0.141,  0.077, 
        0,  0.200, -0.077, 
        0,  0.200,  0.077, 
        0.141,  0.141, -0.077, 
        0.141,  0.141,  0.077, 
    ]
    @generatorQuadStrip2 = [
        0,  0.200,  0.077, 
        0,  0.059,  0.220,
        0.141,  0.141,  0.077, 
        0.042,  0.042,  0.220, 
        0.200,  0,  0.077, 
        0.059, 0,  0.220, 
        0.141, -0.141,  0.077, 
        0.042, -0.042,  0.220, 
        0, -0.200,  0.077, 
        0, -0.059,  0.220, 
        -0.141, -0.141,  0.077, 
        -0.042, -0.042,  0.220, 
        -0.200,  0,  0.077, 
        -0.059, 0,  0.220, 
        -0.141,  0.141,  0.077, 
        -0.042,  0.042,  0.220, 
        0,  0.200,  0.077, 
        0,  0.059,  0.220, 
    ]
    @generatorQuadStrip3 = [
        0,  0.100,  0.354, 
        0,  0.100,  0.5,
        0.071,  0.071,  0.354, 
        0.071,  0.071,  0.5, 
        0.100, 0,  0.354, 
        0.100, 0,  0.5, 
        0.071, -0.071,  0.354, 
        0.071, -0.071,  0.5, 
        0, -0.100,  0.354, 
        0, -0.100,  0.5, 
        -0.071, -0.071,  0.354, 
        -0.071, -0.071,  0.5, 
        -0.100, 0,  0.354, 
        -0.100, 0,  0.5, 
        -0.071,  0.071,  0.354, 
        -0.071,  0.071,  0.5, 
        0,  0.100,  0.354, 
        0,  0.100,  0.5, 
    ]
    @generatorQuadStrip4 = [
        0.042,  0.042,  0.220,  
        0.071,  0.071,  0.354,
        0.059, 0,  0.220, 
        0.100, 0,  0.354, 
        0.042, -0.042,  0.220, 
        0.071, -0.071,  0.354, 
        0, -0.059,  0.220, 
        0, -0.100,  0.354, 
        -0.042, -0.042,  0.220, 
        -0.071, -0.071,  0.354, 
        -0.059, 0,  0.220, 
        -0.100, 0,  0.354, 
        -0.042,  0.042,  0.220, 
        -0.071,  0.071,  0.354, 
        0,  0.059,  0.220, 
        0,  0.100,  0.354, 
        0.042,  0.042,  0.220, 
        0.071,  0.071,  0.354, 
    ]
    @generatorQuadStrip5 = [
        -0.05, -0.5,  0.155,  
        -0.05, -0.33,  0.077,
        -0.33, -0.380,  0.155, 
        -0.2, -0.27,  0.077, 
        -0.33, -0.380, -0.155, 
        -0.2, -0.27, -0.077, 
        -0.05, -0.5, -0.155, 
        -0.05, -0.33, -0.077, 
        -0.05, -0.5,  0.155, 
        -0.05, -0.33,  0.077, 
    ]
    @generatorQuadStrip6 = [
        -0.5,  0.05,  0.155,  
        -0.33,  0.05,  0.077,
        -0.39,  0.330,  0.155, 
        -0.27,  0.2,  0.077, 
        -0.39,  0.330, -0.155, 
        -0.27,  0.2, -0.077, 
        -0.5,  0.05, -0.155, 
        -0.33,  0.05, -0.077, 
        -0.5,  0.05,  0.155, 
        -0.33,  0.05,  0.077, 
    ]
    #         
    @generatorQuadStrip7 = [
        0.05,  0.5,  0.155, 
        0.05,  0.33,  0.077,
        0.33,  0.39,  0.155, 
        0.2,  0.27,  0.077, 
        0.33,  0.39, -0.155, 
        0.2,  0.27, -0.077, 
        0.05,  0.5, -0.155, 
        0.05,  0.33, -0.077, 
        0.05,  0.5,  0.155, 
        0.05,  0.33,  0.077, 
    ]
    @generatorQuadStrip8 = [
        0.33, -0.380,  0.155,  
        0.2, -0.27,  0.077,
        0.05, -0.5,  0.155, 
        0.05, -0.33,  0.077, 
        0.05, -0.5, -0.155, 
        0.05, -0.33, -0.077, 
        0.33, -0.380, -0.155, 
        0.2, -0.27, -0.077, 
        0.33, -0.380,  0.155, 
        0.2, -0.27,  0.077, 
    ]
    @generatorQuadStrip9 = [
        -0.33,  0.39,  0.155, 
        -0.2,  0.27,  0.077,
        -0.05,  0.5,  0.155, 
        -0.05,  0.33,  0.077, 
        -0.05,  0.5, -0.155, 
        -0.05,  0.33, -0.077, 
        -0.33,  0.39, -0.155, 
        -0.2,  0.27, -0.077, 
        -0.33,  0.39,  0.155, 
        -0.2,  0.27,  0.077, 
    ]
    @generatorQuadStrip10 = [
        0.5, -0.038,  0.155, 
        0.33, -0.05,  0.077,
        0.39, -0.33,  0.155, 
        0.27, -0.2,  0.077, 
        0.39, -0.33, -0.155, 
        0.27, -0.2, -0.077, 
        0.5, -0.038, -0.155, 
        0.33, -0.05, -0.077, 
        0.5, -0.038,  0.155, 
        0.33, -0.05,  0.077, 
    ]
    @generatorQuadStrip11 = [
        -0.39, -0.33,  0.155,  
        -0.27, -0.2,  0.077,
        -0.5, -0.038,  0.155, 
        -0.33, -0.05,  0.077, 
        -0.5, -0.038, -0.155, 
        -0.33, -0.05, -0.077, 
        -0.39, -0.33, -0.155, 
        -0.27, -0.2, -0.077, 
        -0.39, -0.33,  0.155, 
        -0.27, -0.2,  0.077, 
    ]
    @generatorQuadStrip12 = [
        0.39,  0.330,  0.155, 
        0.27,  0.2,  0.077,
        0.5,  0.05,  0.155, 
        0.33,  0.05,  0.077, 
        0.5,  0.05, -0.155, 
        0.33,  0.05, -0.077, 
        0.39,  0.330, -0.155, 
        0.27,  0.2, -0.077, 
        0.39,  0.330,  0.155, 
        0.27,  0.2,  0.077, 
    ]
    
    #   000   000   0000000   000      000   000  00000000
    #   000   000  000   000  000      000   000  000     
    #    000 000   000000000  000       000 000   0000000 
    #      000     000   000  000         000     000     
    #       0      000   000  0000000      0      00000000
    
    @valveQuads = [
        0.100, 0, 0.5,
        0.071, 0.071, 0.5,
        0, 0.100, 0.5,
        0.071, -0.071, 0.5,
        -0.100, 0, 0.5,
        -0.071, -0.071, 0.5,
        0, -0.100, 0.5,
        -0.071, 0.071, 0.5,
        0.071, -0.071, 0.5,
        0, 0.100, 0.5,
        -0.071, 0.071, 0.5,
        0, -0.100, 0.5,
        0.100, 0, -0.5,
        0.071, -0.071, -0.5,
        0, -0.100, -0.5,
        0.071, 0.071, -0.5,
        -0.100, 0, -0.5,
        -0.071, 0.071, -0.5,
        0, 0.100, -0.5,
        -0.071, -0.071, -0.5,
        0.071, 0.071, -0.5,
        0, -0.100, -0.5,
        -0.071, -0.071, -0.5,
        0, 0.100, -0.5,
    ]
    @valveQuadStrip1 = [
        0.071, 0.071, -0.346, 
        0.042, 0.042, -0.220,
        0.100, 0, -0.346, 
        0.059, 0, -0.220, 
        0.071, -0.071, -0.346, 
        0.042, -0.042, -0.220, 
        0, -0.100, -0.346, 
        0, -0.059, -0.220, 
        -0.071, -0.071, -0.346, 
        -0.042, -0.042, -0.220, 
        -0.100, 0, -0.346, 
        -0.059, 0, -0.220, 
        -0.071, 0.071, -0.346, 
        -0.042, 0.042, -0.220, 
        0, 0.100, -0.346, 
        0, 0.059, -0.220, 
        0.071, 0.071, -0.346, 
        0.042, 0.042, -0.220 
        ]
    @valveQuadStrip2 = [
        0.042, 0.042, -0.220, 
        0.042, 0.042, 0.220,
        0.059, 0, -0.220, 
        0.059, 0, 0.220, 
        0.042, -0.042, -0.220, 
        0.042, -0.042, 0.220, 
        0, -0.059, -0.220, 
        0, -0.059, 0.220, 
        -0.042, -0.042, -0.220, 
        -0.042, -0.042, 0.220, 
        -0.059, 0, -0.220, 
        -0.059, 0, 0.220, 
        -0.042, 0.042, -0.220, 
        -0.042, 0.042, 0.220, 
        0, 0.059, -0.220, 
        0, 0.059, 0.220, 
        0.042, 0.042, -0.220, 
        0.042, 0.042, 0.220
        ]
    @valveQuadStrip3 = [
        0.071, 0.071, -0.5, 
        0.071, 0.071, -0.346,
        0.100, 0, -0.5, 
        0.100, 0, -0.346, 
        0.071, -0.071, -0.5, 
        0.071, -0.071, -0.346, 
        0, -0.100, -0.5, 
        0, -0.100, -0.346, 
        -0.071, -0.071, -0.5, 
        -0.071, -0.071, -0.346, 
        -0.100, 0, -0.5, 
        -0.100, 0, -0.346, 
        -0.071, 0.071, -0.5, 
        -0.071, 0.071, -0.346, 
        0, 0.100, -0.5, 
        0, 0.100, -0.346, 
        0.071, 0.071, -0.5, 
        0.071, 0.071, -0.346,
        ] 
    @valveQuadStrip4 = [
        0, 0.100, 0.354, 
        0, 0.100, 0.5,
        0.071, 0.071, 0.354, 
        0.071, 0.071, 0.5, 
        0.100, 0, 0.354, 
        0.100, 0, 0.5, 
        0.071, -0.071, 0.354, 
        0.071, -0.071, 0.5, 
        0, -0.100, 0.354, 
        0, -0.100, 0.5, 
        -0.071, -0.071, 0.354, 
        -0.071, -0.071, 0.5, 
        -0.100, 0, 0.354, 
        -0.100, 0, 0.5, 
        -0.071, 0.071, 0.354, 
        -0.071, 0.071, 0.5, 
        0, 0.100, 0.354, 
        0, 0.100, 0.5,
        ]
    @valveQuadStrip5 = [
        0.042, 0.042, 0.220, 
        0.071, 0.071, 0.354,
        0.059, 0, 0.220, 
        0.100, 0, 0.354, 
        0.042, -0.042, 0.220, 
        0.071, -0.071, 0.354, 
        0, -0.059, 0.220, 
        0, -0.100, 0.354, 
        -0.042, -0.042, 0.220, 
        -0.071, -0.071, 0.354, 
        -0.059, 0, 0.220, 
        -0.100, 0, 0.354, 
        -0.042, 0.042, 0.220, 
        -0.071, 0.071, 0.354, 
        0, 0.059, 0.220, 
        0, 0.100, 0.354, 
        0.042, 0.042, 0.220, 
        0.071, 0.071, 0.354, 
        ]
    
    #    0000000   00000000   0000000   00000000 
    #   000        000       000   000  000   000
    #   000  0000  0000000   000000000  0000000  
    #   000   000  000       000   000  000   000
    #    0000000   00000000  000   000  000   000
                
    @gearQuadStrip1 = [ 
        0.208, -0.086, 0.111, 
        0.375, -0.155, 0.087,
        0.226, 0, 0.111, 
        0.406, 0, 0.087, 
        0.208, 0.086, 0.111, 
        0.375, 0.155, 0.087, 
        0.160, 0.160, 0.111, 
        0.287, 0.287, 0.087, 
        0.086, 0.208, 0.111, 
        0.155, 0.375, 0.087, 
        0, 0.226, 0.111, 
        0, 0.406, 0.087, 
        -0.086, 0.208, 0.111, 
        -0.155, 0.375, 0.087, 
        -0.160, 0.160, 0.111, 
        -0.287, 0.287, 0.087, 
        -0.208, 0.086, 0.111, 
        -0.375, 0.155, 0.087, 
        -0.226, 0, 0.111, 
        -0.406, 0, 0.087, 
        -0.208, -0.086, 0.111, 
        -0.375, -0.155, 0.087, 
        -0.160, -0.160, 0.111, 
        -0.287, -0.287, 0.087, 
        -0.086, -0.208, 0.111, 
        -0.155, -0.375, 0.087, 
        0, -0.226, 0.111, 
        0, -0.406, 0.087, 
        0.086, -0.208, 0.111, 
        0.155, -0.375, 0.087, 
        0.160, -0.160, 0.111, 
        0.287, -0.287, 0.087, 
        0.208, -0.086, 0.111, 
        0.375, -0.155, 0.087, 
        ]
         
    @gearQuadStrip2 = [
        0.226, 0, -0.111, 
        0.226, 0, 0.111,
        0.208, 0.086, -0.111, 
        0.208, 0.086, 0.111, 
        0.160, 0.160, -0.111, 
        0.160, 0.160, 0.111, 
        0.086, 0.208, -0.111, 
        0.086, 0.208, 0.111, 
        0, 0.226, -0.111, 
        0, 0.226, 0.111, 
        -0.086, 0.208, -0.111, 
        -0.086, 0.208, 0.111, 
        -0.160, 0.160, -0.111, 
        -0.160, 0.160, 0.111, 
        -0.208, 0.086, -0.111, 
        -0.208, 0.086, 0.111, 
        -0.226, 0, -0.111, 
        -0.226, 0, 0.111, 
        -0.208, -0.086, -0.111, 
        -0.208, -0.086, 0.111, 
        -0.160, -0.160, -0.111, 
        -0.160, -0.160, 0.111, 
        -0.086, -0.208, -0.111, 
        -0.086, -0.208, 0.111, 
        0, -0.226, -0.111, 
        0, -0.226, 0.111, 
        0.086, -0.208, -0.111, 
        0.086, -0.208, 0.111, 
        0.160, -0.160, -0.111, 
        0.160, -0.160, 0.111, 
        0.208, -0.086, -0.111, 
        0.208, -0.086, 0.111, 
        0.226, 0, -0.111, 
        0.226, 0, 0.111, 
        ]
        
    @gearQuadStrip3 = [
        0.406, 0, -0.087, 
        0.226, 0, -0.111,
        0.375, 0.155, -0.087, 
        0.208, 0.086, -0.111, 
        0.287, 0.287, -0.087, 
        0.160, 0.160, -0.111, 
        0.155, 0.375, -0.087, 
        0.086, 0.208, -0.111, 
        0, 0.406, -0.087, 
        0, 0.226, -0.111, 
        -0.155, 0.375, -0.087, 
        -0.086, 0.208, -0.111, 
        -0.287, 0.287, -0.087, 
        -0.160, 0.160, -0.111, 
        -0.375, 0.155, -0.087, 
        -0.208, 0.086, -0.111, 
        -0.406, 0, -0.087, 
        -0.226, 0, -0.111, 
        -0.375, -0.155, -0.087, 
        -0.208, -0.086, -0.111, 
        -0.287, -0.287, -0.087, 
        -0.160, -0.160, -0.111, 
        -0.155, -0.375, -0.087, 
        -0.086, -0.208, -0.111, 
        0, -0.406, -0.087, 
        0, -0.226, -0.111, 
        0.155, -0.375, -0.087, 
        0.086, -0.208, -0.111, 
        0.287, -0.287, -0.087, 
        0.160, -0.160, -0.111, 
        0.375, -0.155, -0.087, 
        0.208, -0.086, -0.111, 
        0.406, 0, -0.087, 
        0.226, 0, -0.111, 
        ]
                            
    @gearQuads = [ 
        0.375, 0.155, 0.087,
        0.406, 0, 0.087,
        0.406, 0, -0.087,
        0.375, 0.155, -0.087,
        0.155, 0.375, 0.087,
        0.287, 0.287, 0.087,
        0.287, 0.287, -0.087,
        0.155, 0.375, -0.087,
        -0.155, 0.375, 0.087,
        0, 0.406, 0.087,
        0, 0.406, -0.087,
        -0.155, 0.375, -0.087,
        -0.375, 0.155, 0.087,
        -0.287, 0.287, 0.087,
        -0.287, 0.287, -0.087,
        -0.375, 0.155, -0.087,
        -0.375, -0.155, 0.087,
        -0.406, 0, 0.087,
        -0.406, 0, -0.087,
        -0.375, -0.155, -0.087,
        -0.155, -0.375, 0.087,
        -0.287, -0.287, 0.087,
        -0.287, -0.287, -0.087,
        -0.155, -0.375, -0.087,
        0.155, -0.375, 0.087,
        0, -0.406, 0.087,
        0, -0.406, -0.087,
        0.155, -0.375, -0.087,
        0.375, -0.155, 0.087,
        0.287, -0.287, 0.087,
        0.287, -0.287, -0.087,
        0.375, -0.155, -0.087,
        0.534, -0.159, -0.05,
        0.534, -0.159, 0.05,
        0.375, -0.155, 0.087,
        0.375, -0.155, -0.087,
        0.554, -0.058, -0.05,
        0.534, -0.159, -0.05,
        0.375, -0.155, -0.087,
        0.406, 0, -0.087,
        0.554, -0.058, 0.05,
        0.554, -0.058, -0.05,
        0.406, 0, -0.087,
        0.406, 0, 0.087,
        0.554, -0.058, 0.05,
        0.534, -0.159, 0.05,
        0.534, -0.159, -0.05,
        0.554, -0.058, -0.05,
        0.534, -0.159, 0.05,
        0.554, -0.058, 0.05,
        0.406, 0, 0.087,
        0.375, -0.155, 0.087,
        0.266, -0.490, -0.05,
        0.266, -0.490, 0.05,
        0.155, -0.375, 0.087,
        0.155, -0.375, -0.087,
        0.351, -0.433, -0.05,
        0.266, -0.490, -0.05,
        0.155, -0.375, -0.087,
        0.287, -0.287, -0.087,
        0.351, -0.433, 0.05,
        0.351, -0.433, -0.05,
        0.287, -0.287, -0.087,
        0.287, -0.287, 0.087,
        0.351, -0.433, 0.05,
        0.266, -0.490, 0.05,
        0.266, -0.490, -0.05,
        0.351, -0.433, -0.05,
        0.266, -0.490, 0.05,
        0.351, -0.433, 0.05,
        0.287, -0.287, 0.087,
        0.155, -0.375, 0.087,
        -0.159, -0.534, -0.05,
        -0.159, -0.534, 0.05,
        -0.155, -0.375, 0.087,
        -0.155, -0.375, -0.087,
        -0.058, -0.554, -0.05,
        -0.159, -0.534, -0.05,
        -0.155, -0.375, -0.087,
        0, -0.406, -0.087,
        -0.058, -0.554, 0.05,
        -0.058, -0.554, -0.05,
        0, -0.406, -0.087,
        0, -0.406, 0.087,
        -0.058, -0.554, 0.05,
        -0.159, -0.534, 0.05,
        -0.159, -0.534, -0.05,
        -0.058, -0.554, -0.05,
        -0.159, -0.534, 0.05,
        -0.058, -0.554, 0.05,
        0, -0.406, 0.087,
        -0.155, -0.375, 0.087,
        -0.490, -0.266, -0.05,
        -0.490, -0.266, 0.05,
        -0.375, -0.155, 0.087,
        -0.375, -0.155, -0.087,
        -0.433, -0.351, -0.05,
        -0.490, -0.266, -0.05,
        -0.375, -0.155, -0.087,
        -0.287, -0.287, -0.087,
        -0.433, -0.351, 0.05,
        -0.433, -0.351, -0.05,
        -0.287, -0.287, -0.087,
        -0.287, -0.287, 0.087,
        -0.433, -0.351, 0.05,
        -0.490, -0.266, 0.05,
        -0.490, -0.266, -0.05,
        -0.433, -0.351, -0.05,
        -0.490, -0.266, 0.05,
        -0.433, -0.351, 0.05,
        -0.287, -0.287, 0.087,
        -0.375, -0.155, 0.087,
        -0.534, 0.159, -0.05,
        -0.534, 0.159, 0.05,
        -0.375, 0.155, 0.087,
        -0.375, 0.155, -0.087,
        -0.554, 0.058, -0.05,
        -0.534, 0.159, -0.05,
        -0.375, 0.155, -0.087,
        -0.406, 0, -0.087,
        -0.554, 0.058, 0.05,
        -0.554, 0.058, -0.05,
        -0.406, 0, -0.087,
        -0.406, 0, 0.087,
        -0.554, 0.058, 0.05,
        -0.534, 0.159, 0.05,
        -0.534, 0.159, -0.05,
        -0.554, 0.058, -0.05,
        -0.534, 0.159, 0.05,
        -0.554, 0.058, 0.05,
        -0.406, 0, 0.087,
        -0.375, 0.155, 0.087,
        -0.266, 0.490, -0.05,
        -0.266, 0.490, 0.05,
        -0.155, 0.375, 0.087,
        -0.155, 0.375, -0.087,
        -0.351, 0.433, -0.05,
        -0.266, 0.490, -0.05,
        -0.155, 0.375, -0.087,
        -0.287, 0.287, -0.087,
        -0.351, 0.433, 0.05,
        -0.351, 0.433, -0.05,
        -0.287, 0.287, -0.087,
        -0.287, 0.287, 0.087,
        -0.351, 0.433, 0.05,
        -0.266, 0.490, 0.05,
        -0.266, 0.490, -0.05,
        -0.351, 0.433, -0.05,
        -0.266, 0.490, 0.05,
        -0.351, 0.433, 0.05,
        -0.287, 0.287, 0.087,
        -0.155, 0.375, 0.087,
        0.159, 0.534, -0.05,
        0.159, 0.534, 0.05,
        0.155, 0.375, 0.087,
        0.155, 0.375, -0.087,
        0.058, 0.554, -0.05,
        0.159, 0.534, -0.05,
        0.155, 0.375, -0.087,
        0, 0.406, -0.087,
        0.058, 0.554, 0.05,
        0.058, 0.554, -0.05,
        0, 0.406, -0.087,
        0, 0.406, 0.087,
        0.058, 0.554, 0.05,
        0.159, 0.534, 0.05,
        0.159, 0.534, -0.05,
        0.058, 0.554, -0.05,
        0.159, 0.534, 0.05,
        0.058, 0.554, 0.05,
        0, 0.406, 0.087,
        0.155, 0.375, 0.087,
        0.490, 0.266, -0.05,
        0.490, 0.266, 0.05,
        0.375, 0.155, 0.087,
        0.375, 0.155, -0.087,
        0.433, 0.351, -0.05,
        0.490, 0.266, -0.05,
        0.375, 0.155, -0.087,
        0.287, 0.287, -0.087,
        0.433, 0.351, 0.05,
        0.433, 0.351, -0.05,
        0.287, 0.287, -0.087,
        0.287, 0.287, 0.087,
        0.433, 0.351, 0.05,
        0.490, 0.266, 0.05,
        0.490, 0.266, -0.05,
        0.433, 0.351, -0.05,
        0.490, 0.266, 0.05,
        0.433, 0.351, 0.05,
        0.287, 0.287, 0.087,
        0.375, 0.155, 0.087
        ]

module.exports = Geom
