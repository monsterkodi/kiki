
#    0000000  000   000  00000000  00000000   0000000  00000000
#   000       000   000  000       000       000       000     
#   000       000000000  0000000   0000000   0000000   0000000 
#   000       000   000  000       000            000  000     
#    0000000  000   000  00000000  00000000  0000000   00000000

module.exports =
    name:       "cheese"
    design:     "Owen Hay"
    scheme:     "yellow_scheme"
    size:       [11,12,7]
    intro:      "cheese"
    help:       """
                $scale(1.5)mission:
                activate the exit.
                
                to activate the exit,
                activate all switches.
                """
    player:
        coordinates:   [3, 4,3]
        nostatus:       0
    exits:    [
        name:           "exit"
        active:         0
        position:       [-1,0,0]
    ]
    create: ->
        s = world.size
        h = 0
        for i in [1, 2]
              world.addObjectAtPos 'Wall', 1, i, 1
              world.addObjectAtPos 'Wall', 1, i, 3
              world.addObjectAtPos 'Wall', 2, i, 1
              world.addObjectAtPos 'Wall', 2, i, 2
              world.addObjectAtPos 'Wall', 2, i, 5
              world.addObjectAtPos 'Wall', 3, i, 1
              world.addObjectAtPos 'Wall', 3, i, 2
              world.addObjectAtPos 'Wall', 3, i, 4
              world.addObjectAtPos 'Wall', 3, i, 5
              world.addObjectAtPos 'Wall', 5, i, 0
              world.addObjectAtPos 'Wall', 5, i, 2
              world.addObjectAtPos 'Wall', 5, i, 3
              world.addObjectAtPos 'Wall', 5, i, 4
              world.addObjectAtPos 'Wall', 6, i, 1
              world.addObjectAtPos 'Wall', 6, i, 2
              world.addObjectAtPos 'Wall', 7, i, 2
              world.addObjectAtPos 'Wall', 7, i, 4
              world.addObjectAtPos 'Wall', 7, i, 5
              world.addObjectAtPos 'Wall', 8, i, 0
              world.addObjectAtPos 'Wall', 8, i, 2
              world.addObjectAtPos 'Wall', 8, i, 4
              world.addObjectAtPos 'Wall', 8, i, 5
              world.addObjectAtPos 'Wall', 9, i, 2
              world.addObjectAtPos 'Wall', 9, i, 4
              world.addObjectAtPos 'Wall', 10, i, 3
        
        for i in [0...s.x]
              for j in [0...s.z]
                    world.addObjectAtPos 'Stone', i,2,j
        
        world.switch_counter = 0
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit"
            exit.setActive world.switch_counter == 4
        
        Switch = require '../switch'
        switch1 = new Switch
        switch1.getEventWithName("switched").addAction world.continuous (s=switch1) -> switched s
        switch2 = new Switch
        switch2.getEventWithName("switched").addAction world.continuous (s=switch2) -> switched s
        switch3 = new Switch
        switch3.getEventWithName("switched").addAction world.continuous (s=switch3) -> switched s
        switch4 = new Switch
        switch4.getEventWithName("switched").addAction world.continuous (s=switch4) -> switched s
        
        world.addObjectAtPos switch1, 1, 0 ,2
        world.addObjectAtPos switch2, 7, 1, 0
        world.addObjectAtPos switch3, 9, 0, 0
        world.addObjectAtPos switch4, 9, 1, 5
        