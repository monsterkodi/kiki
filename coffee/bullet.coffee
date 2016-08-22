# 0000000    000   000  000      000      00000000  000000000
# 000   000  000   000  000      000      000          000   
# 0000000    000   000  000      000      0000000      000   
# 000   000  000   000  000      000      000          000   
# 0000000     0000000   0000000  0000000  00000000     000   

Item     = require './item'
Action   = require './action'
Timer    = require './timer'
Material = require './material'

class Bullet extends Item
    
    constructor: () ->
        @size = 0.2
        @src_object = null
        
        super
        @addAction new Action @, Action.FLY,     "fly",     40
        @addAction new Action @, Action.EXPLODE, "explode", 200

    createMesh: ->
        geom = new THREE.SphereGeometry 1, 16, 16
        @mesh = new THREE.Mesh geom, Material.bullet.clone()
        @mesh.scale.set @size, @size, @size
            
    @shootFromBot: (bot) ->
        bullet = new Bullet()
        world.addObject bullet 
        bullet.direction = bot.getCurrentDir()
        bullet.setPosition bot.position.plus bullet.direction #.mul 1/2.0
        bullet.src_object = bot
        bullet.mesh.material.color.set bot.mesh.material.color
        world.playSound 'BULLET_SHOT', bot.getPos()
    
        return if bullet.hitObjectAtPos bullet.position.plus bullet.direction.mul 1/2.0
    
        Timer.addAction bullet.getActionWithId Action.FLY 
    
    performAction: (action) ->
        relTime = action.getRelativeTime()        
        if action.id == Action.FLY
            @current_position = @position.plus @direction.mul relTime
        else if action.id == Action.EXPLODE
            @size = 0.2 + relTime/2.0
            @mesh.material.opacity = 0.8 * (1.0-relTime)
    
    step: (step) -> 
        @mesh.position.copy @current_position
        @mesh.scale.set @size, @size, @size
    
    hitObjectAtPos: (pos) ->
        if world.isInvalidPos(pos) or world.isOccupiedPos pos
            hitObject = world.getRealOccupantAtPos pos
            if hitObject != @src_object
                if hitObject?
                    hitObject.bulletImpact()
                    world.playSound hitObject.bulletHitSound?() ? 'BULLET_HIT_OBJECT'
                else
                    world.playSound 'BULLET_HIT_WALL', pos
                Timer.addAction @getActionWithId Action.EXPLODE
                return true
        false
    
    finishAction: (action) -> @position = @current_position if action.name == "fly"
    
    actionFinished: (action) ->
        if action.id == Action.FLY
            if @hitObjectAtPos @position.plus @direction.mul 1/2.0
                return
            Timer.addAction @getActionWithId Action.FLY
        else if action.id == Action.EXPLODE
            world.deleteObject @
            
module.exports = Bullet
