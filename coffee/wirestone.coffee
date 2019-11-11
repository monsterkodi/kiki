# 000   000  000  00000000   00000000   0000000  000000000   0000000   000   000  00000000
# 000 0 000  000  000   000  000       000          000     000   000  0000  000  000     
# 000000000  000  0000000    0000000   0000000      000     000   000  000 0 000  0000000 
# 000   000  000  000   000  000            000     000     000   000  000  0000  000     
# 00     00  000  000   000  00000000  0000000      000      0000000   000   000  00000000

Stone     = require './stone'
Wall      = require './wall'
Face      = require './face'
Wire      = require './wire'
Action    = require './action'
Generator = require './generator'

class WireStone extends Stone
    
    @: ->
        @wires = [null, null, null, null, null, null]
        super
        
    del: ->
        
        for wire in @wires
            wire?.del()
        super
        
    initAction: (action) ->
        
        switch action.id
            when Action.FALL, Action.PUSH
                for i in [0...6]
                    if @wires[i]?
                        world.unsetObject @wires[i]
                        @wires[i].setActive false
                for generator in world.getObjectsOfType Generator # ???
                    generator.activateWires() if generator.active # ???
        super action
    
    setPosition: (pos) ->      
        
        for i in [0...6]
            newPos = pos.minus Face.normalVectorForFace i
            if @isFreePos newPos
                if not @wires[i]?
                    @wires[i] = new Wire (i+3)%6
                    world.addObjectAtPos @wires[i], newPos
                else
                    world.setObjectAtPos @wires[i], newPos
                    @wires[i].updateActive()
            else if @wires[i]?
                @wires[i].del()
                @wires[i] = null
    
        for generator in world.getObjectsOfType Generator
            if generator.active
                generator.activateWires()
                
        super pos
    
    setCurrentPosition: (pos) ->
        
        super pos
        for i in [0...6]
            @wires[i]?.setPosition @current_position.minus Face.normalVectorForFace i
    
    isFreePos: (pos) ->
        
        if world.isUnoccupiedPos pos
            return true
        if world.isValidPos pos
            occupant = world.getOccupantAtPos pos
            return not (occupant instanceof Wall) and not (occupant instanceof Stone)
        return false
        
module.exports = WireStone
