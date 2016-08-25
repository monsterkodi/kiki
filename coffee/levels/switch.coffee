
#    0000000  000   000  000  000000000   0000000  000   000
#   000       000 0 000  000     000     000       000   000
#   0000000   000000000  000     000     000       000000000
#        000  000   000  000     000     000       000   000
#   0000000   00     00  000     000      0000000  000   000

module.exports =
    name:       "switch"
    scheme:     "tron"
    size:       [7,7,7]
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit, 
                activate the 4 switches.
                """
    player:
        coordinates:    [3,4,3]
        orientation:    minusZdownY
    exits:    [
        name:           "exit"
        active:         0
        position:       [0,-1,0]
    ]
    create: ->

        s = world.size
        h = 0
        
        world.addObjectAtPos 'Stone', s.x/2, s.y/2, s.z/2
        world.addObjectAtPos 'Stone', s.x/2, s.y-2, s.z/2
        
        world.addObjectAtPos 'Bomb', s.x/2, 1, s.z/2
        
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
        s1 = new Switch()
        s1.getEventWithName("switched").addAction world.continuous -> switched s1
        s2 = new Switch()                                                     
        s2.getEventWithName("switched").addAction world.continuous -> switched s2
        s3 = new Switch()                                                     
        s3.getEventWithName("switched").addAction world.continuous -> switched s3
        s4 = new Switch()                                                     
        s4.getEventWithName("switched").addAction world.continuous -> switched s4
        
        world.addObjectAtPos s1, world.decenter -s.x/2+1, 0, 0
        world.addObjectAtPos s2, world.decenter  s.x/2, 0, 0
        world.addObjectAtPos s3, world.decenter 0, 0, -s.z/2+1
        world.addObjectAtPos s4, world.decenter 0, 0,  s.z/2
        