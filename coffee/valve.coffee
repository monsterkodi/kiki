# 000   000   0000000   000      000   000  00000000
# 000   000  000   000  000      000   000  000     
#  000 000   000000000  000       000 000   0000000 
#    000     000   000  000         000     000     
#     0      000   000  0000000      0      00000000

Pushable = require './pushable'
Action   = require './action'
Face     = require './face'

class Valve extends Pushable
    
    constructor: (face) ->
        super
        @face      = face
        @angle     = 0.0
        @active    = false
        @clockwise = false
        @addAction new Action @, Action.ROTATE, "rotation", 2000, Action.REPEAT
        @startTimedAction @getActionWithId Action.ROTATE
    
    updateMesh: ->
        @mesh.rotation.copy Quaternion.rotationAroundVector (@clockwise and 1 or -1) * @angle, 0,0,1
        
    # display: () ->
        # KikiObject::preDisplay();
#          
        # KMatrix m (KikiFace::orientationForFace (face));
        # m.glMultMatrix();
#     
        # render();
#         
        # KikiObject::postDisplay();
        
    setPosition: (pos) ->
        super pos
        p = @getPos()
        dir = @face % 3
        sum = ((dir == Face.Y or dir == Face.Z) and p.x or 0) + ((dir == Face.X or dir == Face.Z) and p.y or 0) + ((dir == Face.X or dir == Face.Y) and p.z or 0)
        @clockwise = sum % 2
               
    performAction: (action) ->
        switch action.id
            when Action.ROTATE 
                @angle += action.getRelativeDelta() * 360
                @updateMesh()
            else super action
    
    render: ->
        # colors[0].glColor();
#     
        # glRotatef (clockwise ? angle : -angle, 0.0, 0.0, 1.0);
        # render_valve;
    
module.exports = Valve
