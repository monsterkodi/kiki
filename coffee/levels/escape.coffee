
#   00000000   0000000   0000000   0000000   00000000   00000000
#   000       000       000       000   000  000   000  000     
#   0000000   0000000   000       000000000  00000000   0000000 
#   000            000  000       000   000  000        000     
#   00000000  0000000    0000000  000   000  000        00000000

module.exports =
    name:       "escape"
    scheme:     "metal"
    size:       [7,9,7]
    help:       """
                to activate the exit,
                shoot the switch.
                
                to be able to
                shoot the switch,
                move the stones.
                """
    player:   
        coordinates:    [3,0,4]
        orientation:    minusXupY
    exits:    [
        name:           "exit"
        active:         0
        position:       [0,-3,0]
    ]
    create: ->
# 
        s = world.size
        Switch = require '../switch'
        exit_switch = new Switch()
        exit_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit"
        world.addObjectAtPos exit_switch, world.decenter 0, -2, 0
        
        world.addObjectAtPos 'Stone', world.decenter  0, s.y/2, 0
        world.addObjectAtPos 'Stone', world.decenter  1, s.y/2, 0
        world.addObjectAtPos 'Stone', world.decenter  0, s.y/2, 1
        world.addObjectAtPos 'Stone', world.decenter  0, s.y/2,-1
        world.addObjectAtPos 'Stone', world.decenter -1, s.y/2, 0
        
        world.addObjectLine 'Stone', world.decenter(-2, s.y/2,-2), world.decenter( 2, s.y/2,-2)
        world.addObjectLine 'Stone', world.decenter( 2, s.y/2,-2), world.decenter( 2, s.y/2, 2)
        world.addObjectLine 'Stone', world.decenter( 2, s.y/2, 2), world.decenter(-2, s.y/2, 2)
        world.addObjectLine 'Stone', world.decenter(-2, s.y/2, 2), world.decenter(-2, s.y/2,-2)
        
        world.addObjectAtPos 'Wall', world.decenter  1, 0, 0
        world.addObjectAtPos 'Wall', world.decenter  0, 0, 1
        world.addObjectAtPos 'Wall', world.decenter -1, 0, 0
        world.addObjectAtPos 'Wall', world.decenter  0, 0,-1
                            
        world.addObjectAtPos 'Wall', world.decenter  1,-1, 0
        world.addObjectAtPos 'Wall', world.decenter  0,-1, 1
        world.addObjectAtPos 'Wall', world.decenter -1,-1, 0
        world.addObjectAtPos 'Wall', world.decenter  0,-1,-1
        world.addObjectAtPos 'Wall', world.decenter  1,-1, 1
        world.addObjectAtPos 'Wall', world.decenter -1,-1, 1
        world.addObjectAtPos 'Wall', world.decenter -1,-1,-1
        world.addObjectAtPos 'Wall', world.decenter  1,-1,-1
                                                       
        world.addObjectAtPos 'Wall', world.decenter  1,-2, 0
        world.addObjectAtPos 'Wall', world.decenter  0,-2, 1
        world.addObjectAtPos 'Wall', world.decenter -1,-2, 0
        world.addObjectAtPos 'Wall', world.decenter  0,-2,-1
                                                       