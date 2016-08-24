
#   00000000  000   000  000  000    
#   000       000   000  000  000    
#   0000000    000 000   000  000    
#   000          000     000  000    
#   00000000      0      000  0000000

module.exports =
    name:       "evil"
    design:     "Michael Abel?"
    scheme:     "red"
    size:       [13,5,13]
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                place a powered
                wire stone next to it.
                a wirestone is powered by
                a rotating generator
                or it shares at least
                one edge with
                another powered wirestone.
                this one is hard,
                really hard,
                but it's possible.
                
                good luck!
                """
    player:     
        coordinates: [6,0,7]
        orientation: ZupY
    exits:    [
        name:       "exit"
        active:     0
        position:   [0,0,4]
    ],
    create: ->

        [sx, sy, sz] = [13,5,13]
                 
        {Generator, MotorCylinder, MotorGear, Face} = require '../items'
                    
        for z in [-sz/2+2...sz/2]
            
            world.addObjectAtPos 'Wall', world.decenter -sx/2+2, 0, z
            world.addObjectAtPos 'Wall', world.decenter  sx/2-1, 0, z
        
        for z in [-sz/2+4...sz/2-2]
            
            world.addObjectAtPos 'Wall', world.decenter -sx/2+4, 0, z
            world.addObjectAtPos 'Wall', world.decenter  sx/2-3, 0, z
        
        for x in [-sx/2+3...sx/2-1]
            
            world.addObjectAtPos 'Wall', world.decenter x, 0, -sz/2+2
            world.addObjectAtPos 'Wall', world.decenter x, 0,  sz/2-1
        
        for x in [-sx/2+4...sx/2-2]
            
            world.addObjectAtPos 'Wall', world.decenter x, 0, -sz/2+4
            world.addObjectAtPos 'Wall', world.decenter x, 0,  sz/2-3
        
          
        world.addObjectAtPos  new Generator(Face.Y), world.decenter 0,0,-4
        world.addObjectAtPos 'WireStone', world.decenter 4,0,0
        world.addObjectAtPos 'WireStone', world.decenter -4,0,0
        
        world.addObjectAtPos 'WireStone', world.decenter 0,-2,-2
        world.addObjectAtPos 'WireStone', world.decenter 0,-1,-2
        world.addObjectAtPos  new MotorGear(Face.Y), world.decenter 0,0,-2
        world.addObjectAtPos  new MotorCylinder(Face.Y), world.decenter 0,1,-2
        
        world.addObjectAtPos 'Bomb', world.decenter 0, 2,-2
        world.addObjectAtPos 'Bomb', world.decenter  1, 0,-2
        world.addObjectAtPos 'Bomb', world.decenter -1, 0,-2
             
        # world.removeObject world.getOccupantAtPos world.decenter 0, 0, 3
        world.addObjectAtPos 'WireStone', world.decenter 0,0,3
        