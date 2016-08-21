
#    0000000  000   000  000  000000000   0000000  000   000
#   000       000 0 000  000     000     000       000   000
#   0000000   000000000  000     000     000       000000000
#        000  000   000  000     000     000       000   000
#   0000000   00     00  000     000      0000000  000   000

module.exports =
    name:       "switch"
    scheme:     "yellow_scheme"
    size:       [7,7,7]
    intro:      "switch"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit, 
                activate the 4 switches
                
                to activate the switches, 
                shoot them
                
                to be able to shoot the switches,
                move the center stone
                to move the center stone,
                use the bomb.
                
                the bomb will detonate if you shoot it
                """
    player:
        coordinates:     [3,0,3]
        nostatus:         0
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,-1,0]
    ]
    create: ->

        s = world.size
        h = 0
        # bomb and stones
        
        world.addObjectAtPos 'Stone', s.x/2, s.y/2, s.z/2
        world.addObjectAtPos 'Stone', s.x/2, s.y-2, s.z/2
        
        # world.addObjectAtPos 'Bomb', s.x/2, 1, s.z/2
        
        # stone frames for switches
        
        world.addObjectAtPos 'Wall', world.decenter  0,  h-1, s.z/2
        world.addObjectAtPos 'Wall', world.decenter  0,  h+1, s.z/2
        world.addObjectAtPos 'Wall', world.decenter  1,  h, s.z/2
        world.addObjectAtPos 'Wall', world.decenter -1,  h, s.z/2
        
        world.addObjectAtPos 'Wall', world.decenter s.x/2, h-1, 0
        world.addObjectAtPos 'Wall', world.decenter s.x/2, h+1, 0
        world.addObjectAtPos 'Wall', world.decenter s.x/2, h,  1
        world.addObjectAtPos 'Wall', world.decenter s.x/2, h, -1
        
        world.addObjectAtPos 'Wall', world.decenter  0,  h-1, -s.z/2+1
        world.addObjectAtPos 'Wall', world.decenter  0,  h+1, -s.z/2+1
        world.addObjectAtPos 'Wall', world.decenter  1,  h, -s.z/2+1
        world.addObjectAtPos 'Wall', world.decenter -1,  h, -s.z/2+1
        
        world.addObjectAtPos 'Wall', world.decenter -s.x/2+1, h-1, 0
        world.addObjectAtPos 'Wall', world.decenter -s.x/2+1, h+1, 0
        world.addObjectAtPos 'Wall', world.decenter -s.x/2+1, h,  1
        world.addObjectAtPos 'Wall', world.decenter -s.x/2+1, h, -1
        
        # switches
        
        world.switch_counter = 0
        
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit" 
            exit.setActive world.switch_counter == 4 
        
        Switch = require '../switch'
        switch1 = new Switch()
        switch1.getEventWithName("switched").addAction(world.continuous((s=switch1) -> switched(s)))
        switch2 = new Switch()
        switch2.getEventWithName("switched").addAction(world.continuous((s=switch2) -> switched(s)))
        switch3 = new Switch()
        switch3.getEventWithName("switched").addAction(world.continuous((s=switch3) -> switched(s)))
        switch4 = new Switch()
        switch4.getEventWithName("switched").addAction(world.continuous((s=switch4) -> switched(s)))
        
        world.addObjectAtPos switch1, world.decenter -s.x/2+1, 0, 0
        world.addObjectAtPos switch2, world.decenter  s.x/2, 0, 0
        world.addObjectAtPos switch3, world.decenter 0, 0, -s.z/2+1
        world.addObjectAtPos switch4, world.decenter 0, 0,  s.z/2
        