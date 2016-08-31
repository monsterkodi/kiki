
#   00000000  000   000  00000000  00000000    0000000   000   000
#   000       0000  000  000       000   000  000         000 000 
#   0000000   000 0 000  0000000   0000000    000  0000    00000  
#   000       000  0000  000       000   000  000   000     000   
#   00000000  000   000  00000000  000   000   0000000      000   

module.exports =
    name:       "energy"
    scheme:     "default"
    size:       [9,17,9]
    help:       """
                to activate the exit,
                shoot the 4 switches.
                """
    player:   
        coordinates:    [4,4,5]
        orientation:    XupZ
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ],
    create: ->

        s = world.size
        
        world.addObjectLine 'Wall', [0, s.y/2, s.z/2], [s.x, s.y/2, s.z/2]
        world.addObjectLine 'Wall', [s.x/2, s.y/2, 0], [s.x/2, s.y/2, s.z]
        world.getOccupantAtPos(world.decenter 0,0,0).del()
        
        world.addObjectAtPos 'Wall',   world.decenter 0, 3, 0
        world.addObjectAtPos 'Wall',   world.decenter 0, 6, 0
                                       
        world.addObjectAtPos 'Wall',   world.decenter 0, -4, 0
        world.addObjectAtPos 'Wall',   world.decenter  2,-5, 1
        world.addObjectAtPos 'Wall',   world.decenter -1,-5, 2
        world.addObjectAtPos 'Wall',   world.decenter -2,-5,-1
        world.addObjectAtPos 'Wall',   world.decenter  1,-5,-2
        
        world.addObjectAtPos 'Mutant', world.decenter  2,-5, 2
        world.addObjectAtPos 'Mutant', world.decenter -2,-5,-2
        world.addObjectAtPos 'Mutant', world.decenter  1,-5, 1
        world.addObjectAtPos 'Mutant', world.decenter -1,-5,-1
        world.addObjectAtPos 'Mutant', world.decenter  2,-5,-2
        world.addObjectAtPos 'Mutant', world.decenter -2,-5, 2
        world.addObjectAtPos 'Mutant', world.decenter  1,-5,-1
        world.addObjectAtPos 'Mutant', world.decenter -1,-5, 1
                             
        world.addObjectAtPos 'Wall',   world.decenter  0,  3, s.z/2
        world.addObjectAtPos 'Wall',   world.decenter  0,  5, s.z/2
        world.addObjectAtPos 'Wall',   world.decenter  1,  4, s.z/2
        world.addObjectAtPos 'Wall',   world.decenter -1,  4, s.z/2
                                       
        world.addObjectAtPos 'Wall',   world.decenter s.x/2, 3,  0
        world.addObjectAtPos 'Wall',   world.decenter s.x/2, 5,  0
        world.addObjectAtPos 'Wall',   world.decenter s.x/2, 4,  1
        world.addObjectAtPos 'Wall',   world.decenter s.x/2, 4, -1
                                       
        world.addObjectAtPos 'Wall',   world.decenter  0,  3, -s.z/2+1
        world.addObjectAtPos 'Wall',   world.decenter  0,  5, -s.z/2+1
        world.addObjectAtPos 'Wall',   world.decenter  1,  4, -s.z/2+1
        world.addObjectAtPos 'Wall',   world.decenter -1,  4, -s.z/2+1
                                       
        world.addObjectAtPos 'Wall',   world.decenter -s.x/2+1, 3,  0
        world.addObjectAtPos 'Wall',   world.decenter -s.x/2+1, 5,  0
        world.addObjectAtPos 'Wall',   world.decenter -s.x/2+1, 4,  1
        world.addObjectAtPos 'Wall',   world.decenter -s.x/2+1, 4, -1
        
        world.switch_counter = 0
        
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit"
            exit.setActive world.switch_counter == 4
        
        Switch = require '../switch'
        switch1 = new Switch
        switch1.getEventWithName("switched").addAction world.continuous -> switched switch1
        switch2 = new Switch
        switch2.getEventWithName("switched").addAction world.continuous -> switched switch2
        switch3 = new Switch
        switch3.getEventWithName("switched").addAction world.continuous -> switched switch3
        switch4 = new Switch
        switch4.getEventWithName("switched").addAction world.continuous -> switched switch4
        
        world.addObjectAtPos switch1, world.decenter -s.x/2+1, 4, 0
        world.addObjectAtPos switch2, world.decenter  s.x/2, 4, 0
        world.addObjectAtPos switch3, world.decenter 0, 4, -s.z/2+1
        world.addObjectAtPos switch4, world.decenter 0, 4,  s.z/2
        