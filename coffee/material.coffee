
#   00     00   0000000   000000000  00000000  00000000   000   0000000   000    
#   000   000  000   000     000     000       000   000  000  000   000  000    
#   000000000  000000000     000     0000000   0000000    000  000000000  000    
#   000 0 000  000   000     000     000       000   000  000  000   000  000    
#   000   000  000   000     000     00000000  000   000  000  000   000  0000000

module.exports =

    bot: new THREE.MeshPhongMaterial
        color:          0x2222ff
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        transparent:    true
        opacity:        1
        shininess:      5
                    
    tire: new THREE.MeshPhongMaterial 
        color:          0x000066
        specular:       0x222255
        side:           THREE.FrontSide
        shading:        THREE.FlatShading
        transparent:    true
        opacity:        1
        shininess:      4

    mutant: new THREE.MeshPhongMaterial
        color:          0x888888
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        transparent:    true
        opacity:        1
        shininess:      5

    mutant_tire: new THREE.MeshPhongMaterial 
        color:          0x555555
        specular:       0x222222
        side:           THREE.FrontSide
        shading:        THREE.FlatShading
        transparent:    true
        opacity:        1
        shininess:      4
        
    bullet: new THREE.MeshPhongMaterial 
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        transparent:    true
        opacity:        0.8
        shininess:      5
        depthWrite:     false

    glow: new THREE.SpriteMaterial 
        map: new THREE.TextureLoader().load "#{__dirname}/../img/glow.png"
        color: 0xffff00
        id: 999
    
    gear: new THREE.MeshPhongMaterial 
        color:          0xff0000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      20

    wire: new THREE.MeshPhongMaterial 
        color:          0xff0000
        side:           THREE.DoubleSide
        shading:        THREE.SmoothShading
        shininess:      40

    wire_plate: new THREE.MeshPhongMaterial 
        color:          0x880000
        side:           THREE.DoubleSide
        shading:        THREE.SmoothShading
        shininess:      10
        
    raster: new THREE.MeshPhongMaterial 
        color:          0x880000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      20

    wall: new THREE.MeshPhongMaterial 
        color:          0x770000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      10
          
    plate: new THREE.MeshPhongMaterial 
        color:          0x880000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      10
        emissive:       0x880000
        emissiveIntensity: 0.02

    