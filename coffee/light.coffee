# 000      000   0000000   000   000  000000000
# 000      000  000        000   000     000   
# 000      000  000  0000  000000000     000   
# 000      000  000   000  000   000     000   
# 0000000  000   0000000   000   000     000   

Item     = require './item'
Material = require './material'

class Light extends Item
    
    constructor: (opt) ->
        @radius    = opt?.radius ? 4
        @shadow    = opt?.shadow ? false
        @intensity = opt?.intensity ? 0.5
        world.addLight @
        super
        @setPosition opt.pos if opt?.pos?
        
    createMesh: ->
        @point = new THREE.PointLight 0xffffff, @intensity, @radius, 2
        @point.castShadow = @shadow
        @point.shadow.darkness = 0.5
        @point.shadow.mapSize = new THREE.Vector2 2048, 2048
        @point.shadow.bias = 0.01
        geom   = new THREE.SphereGeometry 0.3, 16, 16
        # world.scene.add new THREE.CameraHelper @point.shadow.camera if @shadow
        @point.shadow.camera.near = 0.1
        @point.shadow.camera.far = @radius*2
            
        @mesh = new THREE.Mesh geom, Material.bulb
        world.scene.add @point

    del: -> 
        world.removeLight @
        world.scene.remove @point
        super
        
    setPosition: (pos) ->
        super pos
        @point.position.copy @position

module.exports = Light
