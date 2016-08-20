# 00     00   0000000   000000000   0000000   00000000    0000000  000   000  000      000  000   000  0000000    00000000  00000000 
# 000   000  000   000     000     000   000  000   000  000        000 000   000      000  0000  000  000   000  000       000   000
# 000000000  000   000     000     000   000  0000000    000         00000    000      000  000 0 000  000   000  0000000   0000000  
# 000 0 000  000   000     000     000   000  000   000  000          000     000      000  000  0000  000   000  000       000   000
# 000   000   0000000      000      0000000   000   000   0000000     000     0000000  000  000   000  0000000    00000000  000   000

Item   = require './item'
Action = require './action'
Face   = require './face'

class MotorCylinder extends Item
    
    constructor: (face) ->
        super        
        @value = 0.0
        @active = false
        @orientation = Face.orientationForFace @face
        @addAction new Action @, Action.TUCKER, "tucker", 500, Action.REPEAT
        @setActive true
    
    setActive: (active) ->
        if @active != active
            @active = active
            
            if @active
                @startTimedAction @getActionWithId Action.TUCKER
            else
                @stopAction @getActionWithId Action.TUCKER
    
    performAction: (action) ->
        
        if action.id == Action.TUCKER
            relTime = action.getRelativeTime()
            @value = (relTime < 0.5) and relTime or 1.0 - relTime
            @value *= 2
    
    finishAction: (action) ->
        
        if action.id == Action.TUCKER
            world.playSound 'MOTOR', @getPos()
    
    render: () ->
        # colors[0].glColor();
#     
        # KMatrix (orientation).glMultMatrix();
#     
        # render_cylinder;
#         
        # glTranslatef (0.0, 0.0, -0.5 * sin(value));
#         
        # KikiGear::getObjectColor(0).glColor();
#         
        # render_kolben;
            
module.exports = MotorCylinder
