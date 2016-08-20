# 00     00   0000000   000000000   0000000   00000000    0000000   00000000   0000000   00000000 
# 000   000  000   000     000     000   000  000   000  000        000       000   000  000   000
# 000000000  000   000     000     000   000  0000000    000  0000  0000000   000000000  0000000  
# 000 0 000  000   000     000     000   000  000   000  000   000  000       000   000  000   000
# 000   000   0000000      000      0000000   000   000   0000000   00000000  000   000  000   000

Gear = require './gear'

class MotorGear extends Gear
    
    constructor: (face) -> 
        super face
        @setActive true
        
    render: ->
        # colors[0].glColor();
#     
        # render_motor;
#         
        # if (active)
        # {
            # glRotatef (clockwise ? angle : -angle, 0.0, 0.0, 1.0);
        # }
#     
        # KikiGear::getObjectColor(0).glColor();
#             
        # glTranslatef (0.0, 0.0, 0.4);
#     
        # render_gear;
            
module.exports = MotorGear
