# 000      000   0000000   000   000  000000000
# 000      000  000        000   000     000   
# 000      000  000  0000  000000000     000   
# 000      000  000   000  000   000     000   
# 0000000  000   0000000   000   000     000   

{ klog } = require 'kxk'

Item     = require './item'
Material = require './material'

class Light extends Item
    
    @: (opt) ->
        
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
        @point.shadow.mapSize = new THREE.Vector2 2048 2048
        @point.shadow.bias = 0.01
        @point.shadow.camera.near = 0.1
        @point.shadow.camera.far = @radius*2
        
        world.scene.add @point
        
        geom = new THREE.SphereGeometry 0.3 16 16
        @mesh = new THREE.Mesh geom, Material.bulb

    del: -> 

        @point.shadow.map?.dispose() if @shadow
        @mesh.geometry.dispose()
        world.scene.remove @point
        world.removeLight @
        super
        
    setPosition: (pos) ->
        
        super pos
        @point.position.copy @position

module.exports = Light
