
#   000   000   0000000   000      000    
#   000 0 000  000   000  000      000    
#   000000000  000000000  000      000    
#   000   000  000   000  000      000    
#   00     00  000   000  0000000  0000000

Item = require './item'

class Wall extends Item
    
    constructor: ->
        
        @geom = new THREE.BoxGeometry 1,1,1
        @mat  = new THREE.MeshBasicMaterial color: 0xff0000
        @mesh = new THREE.Mesh @geom, @mat
        world.scene.add @mesh
        @mesh.matrixAutoUpdate = true
        
        s = 0.45
        d = 0.5
        
        super
    
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