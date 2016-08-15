#  0000000    0000000   000000000  00000000
# 000        000   000     000     000     
# 000  0000  000000000     000     0000000 
# 000   000  000   000     000     000     
#  0000000   000   000     000     00000000

log    = require "/Users/kodi/s/ko/js/tools/log"

Vector = require './lib/vector'
Switch = require './switch'
Action = require './action'

class Gate extends Switch
    
    isSpaceEgoistic: -> false

    constructor: (active) ->
        super active
        @ENTER_EVENT = @addEventWithName "enter"
        @value = 0.0
        @getActionWithId(Action.ROTATE).duration = 3000 
        @sound_on  = 'GATE_OPEN'
        @sound_off = 'GATE_CLOSE'
        
    createMesh: () -> 
        torusRadius = 0.05
        t1 = new THREE.TorusGeometry 0.5-torusRadius, torusRadius, 16, 32
        @mat  = new THREE.MeshPhongMaterial 
            color:          0xff0000
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            shininess:      5
            
        @mesh = new THREE.Mesh t1, @mat
     
        t2 = new THREE.TorusGeometry 0.5-torusRadius, torusRadius, 16, 32
        t3 = new THREE.TorusGeometry 0.5-torusRadius, torusRadius, 16, 32
        t2.rotateY Vector.DEG2RAD 90 
        t3.rotateX Vector.DEG2RAD 90 
        t2.merge t3
        @tors = new THREE.Mesh t2, @mat
        @mesh.add @tors
        @mesh
    
    bulletImpact: ->

    newCellMate: (object) ->
        log "gate.newCellMate --------------------------- #{object.name} #{@active}"
        if object.name == 'player' and @active
            world.playSound 'GATE_WARP'
            log "gate.newCellMate --------------------------- trigger enter event actions"
            @events[@ENTER_EVENT].triggerActions() 
    
    renderBar: (r,b,h) ->
        # glBegin(GL_QUAD_STRIP);
        # glNormal3f(0,1,0);
        # glVertex3f(-r, h, -r); glVertex3f(-b, h, -b); 
        # glVertex3f( r, h, -r); glVertex3f( b, h, -b); 
        # glVertex3f( r, h,  r); glVertex3f( b, h,  b); 
        # glVertex3f(-r, h,  r); glVertex3f(-b, h,  b); 
        # glVertex3f(-r, h, -r); glVertex3f(-b, h, -b);     
        # glEnd();
        # glBegin(GL_QUAD_STRIP);
        # glNormal3f(0,-1,0);
        # glVertex3f(-b, -h, -b); glVertex3f(-r, -h, -r); 
        # glVertex3f( b, -h, -b); glVertex3f( r, -h, -r); 
        # glVertex3f( b, -h,  b); glVertex3f( r, -h,  r); 
        # glVertex3f(-b, -h,  b); glVertex3f(-r, -h,  r); 
        # glVertex3f(-b, -h, -b); glVertex3f(-r, -h, -r);  
        # glEnd();
        # glBegin(GL_QUADS);
        # glNormal3f(0,0,-1);
        # glVertex3f(-r, -h, -r); glVertex3f(-r,  h, -r); 
        # glVertex3f( r,  h, -r); glVertex3f( r, -h, -r); 
        # glNormal3f(1,0,0);
        # glVertex3f( r, -h, -r); glVertex3f( r,  h, -r); 
        # glVertex3f( r,  h,  r); glVertex3f( r, -h,  r);  
        # glNormal3f(0,0,1);
        # glVertex3f( r, -h,  r); glVertex3f( r,  h,  r); 
        # glVertex3f(-r,  h,  r); glVertex3f(-r, -h,  r); 
        # glNormal3f(-1,0,0);
        # glVertex3f(-r, -h,  r); glVertex3f(-r,  h,  r); 
        # glVertex3f(-r,  h, -r); glVertex3f(-r, -h, -r);   
        # glNormal3f(0,0,1);
        # glVertex3f(-b,  h, -b); glVertex3f(-b, -h, -b); 
        # glVertex3f( b, -h, -b); glVertex3f( b,  h, -b);  
        # glNormal3f(-1,0,0);
        # glVertex3f( b,  h, -b); glVertex3f( b, -h, -b); 
        # glVertex3f( b, -h,  b); glVertex3f( b,  h,  b);  
        # glNormal3f(0,0,-1);
        # glVertex3f( b,  h,  b); glVertex3f( b, -h,  b); 
        # glVertex3f(-b, -h,  b); glVertex3f(-b,  h,  b);  
        # glNormal3f(1,0,0);
        # glVertex3f(-b,  h,  b); glVertex3f(-b, -h,  b); 
        # glVertex3f(-b, -h, -b); glVertex3f(-b,  h, -b);   
        # glEnd();
    
    render: () ->
        # KColor gate_color = colors[KikiGate_base_color];
        # if (active == false)
            # gate_color.setAlpha (gate_color.getAlpha()/4.0);
#         
        # gate_color.glColor();
#         
        # float v = sin(DEG2RAD(angle));
        # float av = kAbs(v);
        # float b = 0.29 + av * 0.1;
        # float h = 0.1  - av * 0.05;
        # float r = 0.49;
        # float t = v * (0.49 - h);
        # float s = 1.0 - av * 0.5; 
#     
        # glEnable(GL_POLYGON_OFFSET_FILL);
        # glPushMatrix();
        # glScalef(s, 1.0, s);
        # glTranslatef (0, t, 0);
        # glPolygonOffset(0.1, 0.1);
        # renderBar (r, b, h);
        # glTranslatef (0, -2*t, 0);
        # glPolygonOffset(0.2, 0.2);
        # renderBar (r, b, h);
        # glPopMatrix();
#     
        # glPushMatrix();
        # glRotatef (90, 1.0, 0.0, 0.0);
        # glScalef(s, 1.0, s);
        # glTranslatef (0, t, 0);
        # glPolygonOffset(0.3, 0.3);
        # renderBar (r, b, h);
        # glTranslatef (0, -2*t, 0);
        # glPolygonOffset(0.4, 0.4);
        # renderBar (r, b, h);
        # glPopMatrix();
#     
        # glPushMatrix();
        # glRotatef (-90, 0.0, 0.0, 1.0);
        # glScalef(s, 1.0, s);
        # glTranslatef (0, t, 0);
        # glPolygonOffset(0.5, 0.5);
        # renderBar (r, b, h);
        # glTranslatef (0, -2*t, 0);
        # glPolygonOffset(0.6, 0.6);
        # renderBar (r, b, h);
        # glPopMatrix();
        # glDisable(GL_POLYGON_OFFSET_FILL);
#     
        # if (active)
            # colors[KikiGate_sphere_color].glColor();
            # kDisplaySolidSphere(0.20);
            
module.exports = Gate
