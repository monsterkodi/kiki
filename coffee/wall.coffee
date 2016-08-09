
#   000   000   0000000   000      000    
#   000 0 000  000   000  000      000    
#   000000000  000000000  000      000    
#   000   000  000   000  000      000    
#   00     00  000   000  0000000  0000000

Item = require './item'

class Wall extends Item
    
    constructor: ->
        
        @geom = new THREE.BoxGeometry 1,1,1
        @mat  = new THREE.MeshBasicMaterial color: 0x00ff00
        @mesh = new THREE.Mesh @geom, @mat
        world.scene.add @mesh
        
        s = 0.45
        d = 0.5
    
    # glDisable(GL_LIGHTING);
    # colors[KikiWall_base_color].glColor();
    # glDepthMask(false);
    # kDisplaySolidCube(1.0);
    # glDepthMask(true);

    # colors[KikiWall_plate_color].glColor();
    # glEnable(GL_LIGHTING);
    # glBegin(GL_QUADS);
#     
        # glNormal3f (0.0, 0.0, 1.0);
        # glVertex3f ( s, -s, d);
        # glVertex3f ( s,  s, d);
        # glVertex3f (-s,  s, d);
        # glVertex3f (-s, -s, d);

        # glNormal3f (0.0, 0.0, -1.0);
        # glVertex3f (-s, -s, -d);
        # glVertex3f (-s,  s, -d);
        # glVertex3f ( s,  s, -d);
        # glVertex3f ( s, -s, -d);
#         
        # glNormal3f (0.0, 1.0, 0.0);
        # glVertex3f (-s, d, -s);
        # glVertex3f (-s, d,  s);
        # glVertex3f ( s, d,  s);
        # glVertex3f ( s, d, -s);

        # glNormal3f (0.0, -1.0, 0.0);
        # glVertex3f ( s, -d, -s);
        # glVertex3f ( s, -d,  s);
        # glVertex3f (-s, -d,  s);
        # glVertex3f (-s, -d, -s);

        # glNormal3f (1.0, 0.0, 0.0);
        # glVertex3f (d,  s, -s);
        # glVertex3f (d,  s,  s);
        # glVertex3f (d, -s,  s);
        # glVertex3f (d, -s, -s);

        # glNormal3f (-1.0, 0.0, 0.0);
        # glVertex3f (-d, -s, -s);
        # glVertex3f (-d, -s,  s);
        # glVertex3f (-d,  s,  s);
        # glVertex3f (-d,  s, -s);

    # glEnd();       

module.exports = Wall