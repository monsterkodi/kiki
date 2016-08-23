
#   00     00   0000000   000000000  00000000  00000000   000   0000000   000    
#   000   000  000   000     000     000       000   000  000  000   000  000    
#   000000000  000000000     000     0000000   0000000    000  000000000  000    
#   000 0 000  000   000     000     000       000   000  000  000   000  000    
#   000   000  000   000     000     00000000  000   000  000  000   000  0000000

module.exports =

    glow: new THREE.SpriteMaterial 
        map: new THREE.TextureLoader().load "#{__dirname}/../img/glow.png"
        color: 0xffff00
        id: 999

    player: new THREE.MeshPhongMaterial
        color:          0x2222ff
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        transparent:    true
        opacity:        1
        shininess:      5
                    
    tire: new THREE.MeshPhongMaterial 
        color:          0x000066
        # specular:       0x222255
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

    mutantTire: new THREE.MeshPhongMaterial 
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

    wirePlate: new THREE.MeshPhongMaterial 
        color:          0x880000
        side:           THREE.DoubleSide
        shading:        THREE.SmoothShading
        shininess:      10

    bulb: new THREE.MeshLambertMaterial 
        color:          0xffffff
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        transparent:    true
        opacity:        0.7
        emissive:       0xffff00
        emissiveIntensity: 0.9

    bomb: new THREE.MeshPhongMaterial 
        color:          0xff0000
        side:           THREE.FrontSide
        shading:        THREE.FlatShading
        transparent:    true
        opacity:        0.7
        shininess:      20

    switch: new THREE.MeshPhongMaterial 
        color:          0x0000ff
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      5

    gate: new THREE.MeshPhongMaterial 
        color:          0xff0000
        side:           THREE.FrontSide
        shading:        THREE.SmoothShading
        shininess:      5
    
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

    stone: new THREE.MeshPhongMaterial 
        side:           THREE.DoubleSide
        shading:        THREE.SmoothShading
        transparent:    true
        shininess:      20
    