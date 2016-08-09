# 000      000   0000000   000   000  000000000
# 000      000  000        000   000     000   
# 000      000  000  0000  000000000     000   
# 000      000  000   000  000   000     000   
# 0000000  000   0000000   000   000     000   

Item = require './item'

class Light extends Item
    
    constructor: (pos, radius) ->
        @radius = radius ? 4.0
        @setPosition pos if pos?
        @setup()
        # Controller.world->addObject @ if pos?

    setup: ->
        @halo_radius           = 1.0
        @quadratic_attenuation = 1.0/(@radius*@radius)

        # @ambient_color  = colors[KikiLight_base_color]
        # @diffuse_color  = colors[KikiLight_diffuse_color]
        # @specular_color = colors[KikiLight_specular_color]

        @initialize()

    setPosition: (pos) ->
        # KLight::setPosition (KVector(pos[X], pos[Y], pos[Z], 1.0))
        super pos

    display: () ->
        # if (light_number == 0) return
#     
        # KLight::setPosition (KVector(position[X], position[Y], position[Z], 1.0));
#     
        # glDepthMask (false);
        # glPushMatrix();
        # colors[KikiLight_halo_color].glColor();
        # position.glTranslate();
#         
        # KikiBillBoard::displayTextureWithSize 
                            # (Controller.world->getTextureId (KikiWorld::TEXTURE_GRADIENT), 1.0);
        # glPopMatrix();
        # glDepthMask (true);
        
module.exports = Light
