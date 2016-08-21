#  0000000   00000000   0000000   00000000 
# 000        000       000   000  000   000
# 000  0000  0000000   000000000  0000000  
# 000   000  000       000   000  000   000
#  0000000   00000000  000   000  000   000

log      = require '/Users/kodi/s/ko/js/tools/log'
Valve    = require './valve'
Action   = require './action'
Pos      = require './lib/pos'
Geom     = require './geom'
Material = require './material'

class Gear extends Valve
        
    @neighbors = [ [[0,1,0], [0,-1,0], [0,0,1], [0,0,-1]], [[1,0,0], [-1,0,0], [0,0,1], [0,0,-1]], [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0]] ]
    
    constructor: (@face) -> 
        super @face
        @updateMesh()

    createMesh: ->
        @mesh = new THREE.Mesh Geom.gear(),    Material.gear
        @mesh.add new THREE.Mesh Geom.valve(), Material.plate
        @mesh.receiveShadow = true
        
    getNeighborGears: ->
        dirs = Gear.neighbors[@face % 3]
        pos = @getPos()
        gears = []
        for i in [0...4]
            neighbor = world.getOccupantAtPos pos.plus new Pos dirs[i]
            if neighbor? and neighbor instanceof Gear
                if neighbor.face == face
                    gears.push neighbor
        gears
    
    initAction: (action) ->
        super action
        
        if action.id == Action.PUSH
            @setActive false
     
    actionFinished: (action) ->
        super action
        
        if action.id == Action.PUSH or actionId == Action.FALL
            if not @move_action?
                @updateActive()
    
    updateActive: ->
        @setActive false
        for gear in @getNeighborGears()
            if gear.active
                @setActive true
                return
     
    setActive: (active) ->
        if @active != active
            @active = active
                    
            world.playSound @active and 'GEAR_ON' or 'GEAR_OFF'
            
            for gear in @getNeighborGears()
                if @active
                    gear.setActive true
                else
                    gear.updateActive()
     
module.exports = Gear
