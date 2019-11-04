# 0000000    000   000  000      000      00000000  000000000
# 000   000  000   000  000      000      000          000   
# 0000000    000   000  000      000      0000000      000   
# 000   000  000   000  000      000      000          000   
# 0000000     0000000   0000000  0000000  00000000     000   

{ _ } = require 'kxk'
Item     = require './item'
Action   = require './action'
Timer    = require './timer'
Material = require './material'

class Bullet extends Item
    
    constructor: () ->
        @size = 0.2
        @shooter = null
        super
        @addAction new Action @, Action.FLY,     "fly",     40
        @addAction new Action @, Action.EXPLODE, "explode", 200
        
    del: ->
        if @mesh?
            world.scene.remove @mesh
            Timer.removeActionsOfObject @
            _.pull world.objects, @
            @mesh = null

    createMesh: ->
        geom = new THREE.SphereGeometry 1, 16, 16
        @mesh = new THREE.Mesh geom, Material.bullet.clone()
        @mesh.scale.set @size, @size, @size
            
    @shootFromBot: (bot) ->
        bullet = new Bullet()
        world.addObject bullet 
        bullet.direction = bot.currentDir()
        bullet.setPosition bot.position.plus bullet.direction.mul 0.8
        bullet.shooter = bot
        bullet.mesh.material.color.set bot.mesh.material.color
        world.playSound 'BULLET_SHOT', bot.getPos()
    
        return if bullet.hitObjectAtPos bot.position.plus bullet.direction
    
        Timer.addAction bullet.getActionWithId Action.FLY 
    
    performAction: (action) ->
        relTime = action.getRelativeTime()        
        if action.id == Action.FLY
            @current_position = @position.plus @direction.mul relTime
        else if action.id == Action.EXPLODE
            @size = 0.2 + relTime/2.0
            @mesh?.material.opacity = 0.8 * (1.0-relTime)
    
    step: (step) -> 
        @mesh.position.copy @current_position
        @mesh.scale.set @size, @size, @size
    
    hitObjectAtPos: (pos) ->
        
        world.switchAtPos(pos)?.bulletImpact()
            
        if world.isInvalidPos(pos) or world.isOccupiedPos pos 
            hitObject = world.getRealOccupantAtPos pos 
            if hitObject != @shooter
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
            if @hitObjectAtPos @position.plus @direction.mul 0.5
                return
            Timer.addAction @getActionWithId Action.FLY
        else if action.id == Action.EXPLODE
            @del()
            
module.exports = Bullet
