# 0000000     0000000   00     00  0000000  
# 000   000  000   000  000   000  000   000
# 0000000    000   000  000000000  0000000  
# 000   000  000   000  000 0 000  000   000
# 0000000     0000000   000   000  0000000  

Pushable = require './pushable'
Action   = require './action'
Vector   = require './lib/vector'
Material = require './material'

class Bomb extends Pushable
    
    isSpaceEgoistic: -> true
    
    @: ->
        
        @angle    = 0.0
        @size     = 0.55
        @splitted = false

        geom = new THREE.DodecahedronGeometry 1
        geom2 = new THREE.DodecahedronGeometry 1
        geom2.rotateX Vector.DEG2RAD 90
        geom.merge geom2
                
        @mesh = new THREE.Mesh geom, Material.bomb
        @updateMesh()
        super
    
        @addEventWithName 'explode'
        
        @addAction new Action @, Action.ROTATE,  "rotation", 2000, Action.CONTINUOUS
        @addAction new Action @, Action.IMPLODE, "implode", 100
        @addAction new Action @, Action.EXPLODE, "explode", 100
        
        @startTimedAction @getActionWithId Action.ROTATE

    updateMesh: -> 
        a = Vector.DEG2RAD @angle 
        @mesh.rotation.set a, a/2, a/4
        @mesh.scale.set @size, @size, @size
        
    splitterInDirection: (dir) ->
        
        splitter = false
        pos = @getPos().plus dir
        
        if world.isUnoccupiedPos pos
            splitter = true
        else
            occupant = world.getRealOccupantAtPos pos
            if occupant
                if occupant instanceof Bomb
                    occupant.bulletImpact()
                    return
                if world.mayObjectPushToPos @, pos, @getActionWithId(Action.EXPLODE).duration
                    splitter = true
            
        if splitter
            Splitter = require './splitter'
            world.addObjectAtPos new Splitter(dir), pos
    
    bulletImpact: ->
        if not @splitted
            @splitted = true 
            directions = [[1 0 0], [0 1 0], [0 0 1], [-1 0 0], [0,-1 0], [0 0,-1]]
            for i in [0...6]
                @splitterInDirection new Vector directions[i][0], directions[i][1], directions[i][2]
            
            @startTimedAction @getActionWithId Action.IMPLODE
            world.playSound 'BOMB_EXPLODE', @getPos()
            @getEventWithName("explode").triggerActions()
    
    performAction: (action) ->
        # klog "bomb.performAction #{action.id}"
        switch action.id
            when Action.ROTATE  then @angle += action.getRelativeDelta() * 360
            when Action.IMPLODE then @size = 1.0 - action.getRelativeTime()
            when Action.EXPLODE then @size = action.getRelativeTime()
            else
                super action
                return
        @updateMesh()
    
    actionFinished: (action) ->
        switch action.id
            when Action.IMPLODE then @del()
            when Action.EXPLODE
                @splitterInDirection @direction
                world.playSound 'BOMB_SPLITTER', @getPos()
                @startTimedAction @getActionWithId Action.IMPLODE
            else 
                super action
        
module.exports = Bomb
