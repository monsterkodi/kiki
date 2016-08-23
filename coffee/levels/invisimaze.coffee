
#   000  000   000  000   000  000   0000000  000  00     00   0000000   0000000  00000000
#   000  0000  000  000   000  000  000       000  000   000  000   000     000   000     
#   000  000 0 000   000 000   000  0000000   000  000000000  000000000    000    0000000 
#   000  000  0000     000     000       000  000  000 0 000  000   000   000     000     
#   000  000   000      0      000  0000000   000  000   000  000   000  0000000  00000000

module.exports =
    name:       "invisimaze"
    design:     'Owen Hay'
    scheme:     "yellow"
    size:       [9,5,5]
    help:       """
                blindly fumbling through the maze
                
                the switches move every time you play
                there is only one way out!
                """
    player:   position: [0,1,0]
    exits:    [
        name:         "exit1"
        active:       0
        position:     [-4,0,0]
    ,
        name:         "exit2"
        active:       0
        position:     [4,0,0]
        world:        () ->  outro()
    ]
    create: ->

        s = world.size
        Switch = require '../switch'
        
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit"
            exit.setActive world.switch_counter == 5
        
        switchBoth = () ->
            world.toggle("exit1")
            world.toggle("exit2")
        
        #randomly assign the switches to different locations
        tup_array = [[0,0,0], [2,1,-2], [-2,-2,0], [-1,2,1], [-2,-2,-1], [1,-1,2]]
             
        i0 = tup_array[0]
        i1 = tup_array[1]
        i2 = tup_array[2]
        i3 = tup_array[3]
        i4 = tup_array[4]
        i5 = tup_array[5]
        
        exit_switch = new Switch
        exit_switch.getEventWithName("switched").addAction world.continuous -> switchBoth()
        world.addObjectAtPos exit_switch, world.decenter(i0)
        
        exit2_switch = new Switch
        exit2_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit2"
        world.addObjectAtPos exit2_switch, world.decenter(i1)
        
        exit3_switch = new Switch
        exit3_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit1"
        world.addObjectAtPos exit3_switch, world.decenter(i2)
        
        exit4_switch = new Switch
        exit4_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit1"
        world.addObjectAtPos exit4_switch, world.decenter(i3)
        
        exit5_switch = new Switch
        exit5_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit1"
        world.addObjectAtPos exit5_switch, world.decenter(i4)
        
        # Invisimaze
        for y in [0, 1]
             world.addObjectLine('Stone', 4, y, 2, 4, y, 5)
             world.addObjectLine('Stone', 5, y, 2, 7, y, 2)
        
        world.addObjectPoly 'Stone', [world.decenter(-2, 0, -2), world.decenter(-2, 0, 2), world.decenter(2, 0, 2), world.decenter(2, 0, -2)]
        world.addObjectPoly 'Stone', [[2, 4, 2], [2, 4, 4], [4, 4, 4], [4, 4, 2]]
        
        world.addObjectAtPos 'Stone', 2, 3, 2
        world.addObjectAtPos 'Stone', 6, 3, 1
        world.addObjectAtPos 'Stone', 6, 3, 3
        world.addObjectAtPos 'Stone', 2, 1, 1
        world.addObjectAtPos 'Stone', 3, 0, 1
        world.addObjectAtPos 'Stone', 2, 1, 2
        world.addObjectAtPos 'Stone', 2, 0, 2
        world.addObjectAtPos 'Stone', 4, 2, 3
        world.addObjectAtPos 'Stone', 5, 2, 2
        world.addObjectAtPos 'Stone', 5, 2, 1
        world.addObjectAtPos 'Stone', 4, 2, 1
        world.addObjectAtPos 'Stone', 3, 2, 2
        world.addObjectAtPos 'Stone', 3, 2, 3
        world.addObjectAtPos 'Stone', 5, 3, 0
        
        world.addObjectAtPos 'Stone', 6, 4, 0
        
        #the bombLock
        world.addObjectAtPos 'Stone', 7, 1, 2
        world.addObjectAtPos 'Stone', 7, 1, 3
        world.addObjectAtPos 'Stone', 7, 3, 2
        world.addObjectAtPos 'Stone', 7, 2, 1
        world.addObjectAtPos 'Stone', 7, 2, 2
        world.addObjectAtPos 'Bomb', 7, 2, 2
        
        # Exit 1 is blocked!!!
        
        # Walls
        # for y in [-4,]
        y = -4
        for x in [1, -1]
            world.addObjectPoly 'Wall', [world.decenter(y, -x, -x), world.decenter(y, -x, x), world.decenter(y, x, x), world.decenter(y, x, -x)]
        # for y in [-3]
        y = -3
        for x in [2, -2]
            world.addObjectPoly 'Wall', [world.decenter(y, -x, -x), world.decenter(y, -x, x), world.decenter(y, x, x), world.decenter(y, x, -x)]
        
        # for y in [4,]
        y = 4
        for x in [1, -1]
            world.addObjectPoly 'Wall', [world.decenter(y, -x, -x), world.decenter(y, -x, x), world.decenter(y, x, x), world.decenter(y, x, -x)]
            
        # for y in [3]
        y = 3
        for x in [2, -2]
            world.addObjectPoly 'Wall', [world.decenter(y, -x, -x), world.decenter(y, -x, x), world.decenter(y, x, x), world.decenter(y, x, -x)]
        
        