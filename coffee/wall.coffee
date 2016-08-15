
#   000   000   0000000   000      000    
#   000 0 000  000   000  000      000    
#   000000000  000000000  000      000    
#   000   000  000   000  000      000    
#   00     00  000   000  0000000  0000000

Item = require './item'

class Wall extends Item

    isSpaceEgoistic: -> true
    
    constructor: ->
        
        @geom = new THREE.BoxGeometry 1,1,1
        @mat  = new THREE.MeshPhongMaterial 
            color:          0x0000ff
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.85
            shininess:      5
        @mesh = new THREE.Mesh @geom, @mat
        super
    
      # s = 0.45
      # d = 0.5
    
    # glDisable(GL_LIGHTING);
    # colors[KikiWall_base_color].glColor();
    # glDepthMask(false);
    # kDisplaySolidCube(1.0);
    # glDepthMask(true);

    # colors[KikiWall_plate_color].glColor();
    # glEnable(GL_LIGHTING);
    # glBegin(GL_QUADS);
#     
    # glEnd();       

module.exports = Wall