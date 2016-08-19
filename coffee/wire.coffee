# 000   000  000  00000000   00000000
# 000 0 000  000  000   000  000     
# 000000000  000  0000000    0000000 
# 000   000  000  000   000  000     
# 00     00  000  000   000  00000000

Item = require './item'

class Wire extends Item
    
    constructor: (@face, @connections) ->
            
        @active = false
        @value  = 1.0
    
        @SWITCH_OFF_EVENT = @addEventWithName "off"
        @SWITCH_ON_EVENT  = @addEventWithName "on"
        @SWITCHED_EVENT   = @addEventWithName "switched"
    
    @updateActive: ->
        for wire in @getNeighborWires()
            @setActive true if wire.active
    
    setActive: (active) ->
        if @active != active
            @active = active
            neighbors = @getNeighborWires()
    
            active_neighbor = false
            if @active
                for wire in neighbors
                    if wire.active
                        active_neighbor = true
                        break
             
            for wire in wires
                wire.setActive active
    
            cellSwitch = world.getObjectOfTypeAtPos KikiSwitch, @getPos()
            if cellSwitch?
                cellSwitch.setActive active
    
            @events[@active and @SWITCH_ON_EVENT or @SWITCH_OFF_EVENT].triggerActions()
            @events[@SWITCHED_EVENT].triggerActions()
    
    getNeighborWires: ->
        wires = []
        points = @getConnectionPoints()
        neighbor_dirs = []
         
        rot = Face.orientationForFace @face
        n = Face.normalVectorForFace @face
    
        neighbor_dirs.push_back new Vector 
         
        if @connections & RIGHT 
            neighbor_dirs.push_back rot.rotate new Vector(1,0,0)
            neighbor_dirs.push_back rot.rotate new Vector(1,0,0) + n
        if @connections & LEFT  
            neighbor_dirs.push_back rot.rotate new Vector(-1,0,0)
            neighbor_dirs.push_back rot.rotate new Vector(-1,0,0) + n
        if @connections & UP    
            neighbor_dirs.push_back rot.rotate new Vector(0,1,0)
            neighbor_dirs.push_back rot.rotate new Vector(0,1,0) + n
        if @connections & DOWN
            neighbor_dirs.push_back rot.rotate new Vector(0,-1,0)
            neighbor_dirs.push_back rot.rotate new Vector(0,-1,0) + n
         
        for i in [0...neighbor_dirs.length]
            neighbors = world.getObjectsOfTypeAtPos Wire, @position.plus neighbor_dirs[i]
            for iter in neighbors
                continue if iter == @
                neighbor_points = iter.getConnectionPoints()
                for point in points
                    for neighbor_point in neighbor_points
                        if (neighbor_point.minus point).length() < 0.1
                            wires.push iter
       
        wires
    
    getConnectionPoints: ->
        points = []
        to_border = 0.5 * Face.normalVectorForFace @face
        rot = Face.orientationForFace @face
    
        if (connections & RIGHT) 
            points.push position.plus to_border.plus rot.rotate new Vector 0.5, 0, 0
        if (connections & LEFT)
            points.push position.plus to_border.plus rot.rotate new Vector -0.5, 0, 0
        if (connections & UP) 
            points.push position.plus to_border.plus rot.rotate new Vector 0, 0.5, 0
        if (connections & DOWN)
            points.push position.plus to_border.plus rot.rotate new Vector 0, -0.5, 0
         
        points
    
    display: ->
        # KikiObject::preDisplay();
        # KVector face_normal = KikiFace::normalVectorForFace (face);
        # float o = 0.005;
        # ((0.5-o) * face_normal).glTranslate();
#     
        # glPushMatrix();
#     
        # KMatrix mat(KikiFace::orientationForFace (face));
        # mat.glMultMatrix();    
#     
        # colors[KikiWire_base_color].glColor();
#     
        # render_wire;
#     
        # glDisable (GL_CULL_FACE);
        # float h = 0.05;
        # float s = 0.5+o;
        # glNormal3f(0.0, 0.0, 1.0);
        # if (connections & RIGHT)     glRectf ( 0.0, -h, s, h);
        # if (connections & LEFT)      glRectf (-s, -h, 0.0, h);
        # if (connections & UP)       glRectf (-h,  0.0, h, s);
        # if (connections & DOWN)     glRectf (-h, -s, h, 0.0);
        # glEnable (GL_CULL_FACE);
#          
        # glPopMatrix();
#          
        # if (active)
            # KColor c (colors[KikiWire_light_color]);
            # c.setAlpha (value);
            # c.glColor();
#          
            # (face_normal * -0.1).glTranslate();
#              
            # KikiBillBoard::displayTextureWithSize 
                            # (Controller.world->getTextureId(KikiWorld::TEXTURE_GRADIENT), 0.15);
#     
        # KikiObject::postDisplay();
        
module.exports = Wire
