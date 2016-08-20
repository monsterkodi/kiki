#  0000000   00000000   0000000   00000000 
# 000        000       000   000  000   000
# 000  0000  0000000   000000000  0000000  
# 000   000  000       000   000  000   000
#  0000000   00000000  000   000  000   000

Valve  = require './valve'
Action = require './action'
Pos    = require './lib/pos'
Cage   = require './cage'
Geom   = require './geom'

class Gear extends Valve
    
    constructor: (face) -> 
        
        geom = Geom.gear()
        @mesh = new THREE.Mesh geom, Cage.cageMat
        @mesh.receiveShadow = true
        
        super face
        
    getNeighborDirections: (face) ->
        neighbors = [
            [[0,1,0], [0,-1,0], [0,0,1], [0,0,-1]]
            [[1,0,0], [-1,0,0], [0,0,1], [0,0,-1]]
            [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0]]
        ]
        neighbors[face % 3]
    
    getNeighborGears: ->
        dirs = @getNeighborDirections @face
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
     
    render: ->
        # if (@active)
            # glRotatef (clockwise ? angle : -angle, 0.0, 0.0, 1.0);
#         
        # KikiValve::colors[0].glColor();
        # render_valve;
#         
        # glTranslatef (0.0, 0.0, 0.4);
#     
        # colors[0].glColor();
        # render_gear;
        
module.exports = Gear
