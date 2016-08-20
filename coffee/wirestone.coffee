# 000   000  000  00000000   00000000   0000000  000000000   0000000   000   000  00000000
# 000 0 000  000  000   000  000       000          000     000   000  0000  000  000     
# 000000000  000  0000000    0000000   0000000      000     000   000  000 0 000  0000000 
# 000   000  000  000   000  000            000     000     000   000  000  0000  000     
# 00     00  000  000   000  00000000  0000000      000      0000000   000   000  00000000

Stone     = require './stone'
Wall      = require './wall'
Face      = require './face'
Wire      = require './wire'
Generator = require './generator'

class WireStone extends Stone
    
    constructor: () ->
        @wires = [null, null, null, null, null, null]
        
    initAction: (action) ->

        switch action.id

            when Action.FALL, Action.PUSH
            
                for i in [0...6]
                    if @wires[i]?
                        world.unsetObject @wires[i]
                        @wires[i].setActive false
                
                for generator in world.getObjectsOfType Generator
                    if generator.active
                        generator.activateWires()
        
        super action
    
    setPosition: (pos) ->      
        for i in [0...6]
            newPos = pos.minus Face.normalVectorForFace i
            if @isFreePos newPos
                if not @wires[i]?
                    @wires[i] = new Wire i
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
            @wires[i]?.setPosition pos.minus Face.normalVectorForFace i
    
    isFreePos: (pos) ->
        if world.isUnoccupiedPos pos
            return true
        if world.isValidPos pos
            occupant = world.getOccupantAtPos pos
            return (occupant instanceof Wall) or not (occupant instanceof Stone)
        return false
        
module.exports = WireStone
