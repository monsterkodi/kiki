
#    0000000   00000000    0000000    0000000  00000000 
#   000        000   000  000   000  000       000   000
#   000  0000  0000000    000000000  0000000   00000000 
#   000   000  000   000  000   000       000  000      
#    0000000   000   000  000   000  0000000   000      

module.exports =
    name:       "grasp"
    design:     "Owen Hay"
    scheme:     "blue"
    size:       [11,11,11]
    help:       """
                to shoot, press "enter"
                """
    player:   
        coordinates:    [5,4,1]
        orientation:    minusYupZ
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->

        s = world.size
        
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2+1, 0
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2+1, 0
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2-1, 0
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2-1, 0
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2,   0
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2,   0
        world.addObjectAtPos 'Stone', s.x/2,   s.y/2-1, 0
        world.addObjectAtPos 'Stone', s.x/2,   s.y/2+1, 0
                            
        world.addObjectAtPos 'Stone', s.x/2,   s.y/2,   1
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2,   2
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2,   2
        world.addObjectAtPos 'Stone', s.x/2+2, s.y/2,   1
        world.addObjectAtPos 'Stone', s.x/2-2, s.y/2,   1
        world.addObjectAtPos 'Stone', s.x/2+2, s.y/2,   4
        world.addObjectAtPos 'Stone', s.x/2-2, s.y/2,   4
        
        Switch = require '../switch'
        exit_switch = new Switch
        exit_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit"   
        world.addObjectAtPos exit_switch, s.x/2, s.y/2, 0 
        