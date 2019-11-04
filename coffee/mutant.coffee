# 00     00  000   000  000000000   0000000   000   000  000000000
# 000   000  000   000     000     000   000  0000  000     000   
# 000000000  000   000     000     000000000  000 0 000     000   
# 000 0 000  000   000     000     000   000  000  0000     000   
# 000   000   0000000      000     000   000  000   000     000   

Bot    = require './bot'
Bullet = require './bullet'
Timer  = require './timer'
Action = require './action'

class Mutant extends Bot
    
    @: () ->
        super
        @health = 1
        @move = true
        
    die: ->
        world.playSound 'BOT_DEATH'
        super()
        @setOpacity 0.6
        @getActionWithId(Action.FALL).duration = 40
      
    isMutant: -> true  
    bulletImpact: -> @health -= 0.1
    bulletHitSound: -> @health > 0 and 'BULLET_HIT_MUTANT' or 'BULLET_HIT_OBJECT'
    
    actionFinished: (action) ->
        if @health <= 0 and not @died
            @die() 
            if action.id != Action.PUSH and action.id != Action.FALL # dead player may only fall, nothing else
                return
        super action
    
    moveBot: ->
        changeOrientation = Math.random() < 0.3
        changeJumpMode    = Math.random() < 0.3
        changeDirection   = Math.random() < 0.3
        @push             = Math.random() < 0.1
        fire              = Math.random() < 0.5
        noop              = Math.random() < 0.05
         
        if changeDirection
            @dir_sgn = Math.random() < 0.3 and -1 or 1
    
        if changeJumpMode
            if @jump or @dir_sgn > 0 # prevent jumping backwards
                @jump = not @jump
    
        forwardPos = @position.plus @getDir()
            
        if fire && world.isValidPos forwardPos 
            Bullet.shootFromBot @
            
        if changeOrientation
            if Math.random() < 0.5 
                @rotate_action = @getActionWithId Action.TURN_LEFT 
            else               
                @rotate_action = @getActionWithId Action.TURN_RIGHT 
            Timer.addAction @rotate_action
            return
        
        if noop
            @startTimedAction @getActionWithId(Action.NOOP), 666
            return
        
        super()
    
module.exports = Mutant
