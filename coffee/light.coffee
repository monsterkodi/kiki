# 000      000   0000000   000   000  000000000
# 000      000  000        000   000     000   
# 000      000  000  0000  000000000     000   
# 000      000  000   000  000   000     000   
# 0000000  000   0000000   000   000     000   

Item = require './item'

class Light extends Item
    
    constructor: (pos, radius) ->
        @radius    = radius ? 4
        @intensity = 1
        # @ambient_color  = colors[KikiLight_base_color]
        # @diffuse_color  = colors[KikiLight_diffuse_color]
        # @specular_color = colors[KikiLight_specular_color]
        @point = new THREE.PointLight 0xffffff, @intensity, @radius, 2
        geom   = new THREE.SphereGeometry 0.3, 16, 16
        mat    = new THREE.MeshLambertMaterial 
            color:          0xffffff
            side:           THREE.FrontSide
            shading:        THREE.SmoothShading
            transparent:    true
            opacity:        0.7
            emissive:       0xffff00
            emissiveIntensity: 0.9
            
        @mesh = new THREE.Mesh geom, mat
        world.scene.add @point
        @setPosition pos if pos?
        super

    del: -> 
        world.scene.remove @point
        super
        
    setPosition: (pos) ->
        super pos
        @point.position.copy @position

module.exports = Light
