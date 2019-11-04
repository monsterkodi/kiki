
#    0000000  000   000  00000000  00000000   0000000  00000000
#   000       000   000  000       000       000       000     
#   000       000000000  0000000   0000000   0000000   0000000 
#   000       000   000  000       000            000  000     
#    0000000  000   000  00000000  00000000  0000000   00000000

{ klog } = require 'kxk'

module.exports =
    name:       "cheese"
    design:     "Owen Hay"
    scheme:     "yellow"
    size:       [11,12,7]
    help:       """
                to activate the exit,
                activate all switches.
                """
    player:
        coordinates:   [4,10,0]
        orientation:    YupZ
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
            world.switch_counter += (swtch.active and 1 or -1)
            klog "world.switch_counter #{swtch} #{world.switch_counter}"
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
        
        world.addObjectAtPos switch1, 1, 0 ,2
        world.addObjectAtPos switch2, 7, 1, 0
        world.addObjectAtPos switch3, 9, 0, 0
        world.addObjectAtPos switch4, 9, 1, 5
        