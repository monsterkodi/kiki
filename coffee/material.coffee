
#   00     00   0000000   000000000  00000000  00000000   000   0000000   000    
#   000   000  000   000     000     000       000   000  000  000   000  000    
#   000000000  000000000     000     0000000   0000000    000  000000000  000    
#   000 0 000  000   000     000     000       000   000  000  000   000  000    
#   000   000  000   000     000     00000000  000   000  000  000   000  0000000

module.exports =
    
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
        side:           THREE.DoubleSide
        shading:        THREE.SmoothShading
        shininess:      10
        emissive:       0x880000
        emissiveIntensity: 0.02

    