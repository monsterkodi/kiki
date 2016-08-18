# level design by Owen Hay

module.exports =
    name:       "cheese"
    scheme:     "yellow_scheme"
    size:       [11,12,7]
    intro:      "cheese"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the switches,
                shoot them
                
                to be able to shoot the switches,
                move the center stone
                to move the center stone,
                use the bomb.
                
                the bomb will detonate if you shoot it
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
        # bomb and stones
        for i in [1, 2]
              world.addObjectAtPos 'KikiWall', 1, i, 1
              world.addObjectAtPos 'KikiWall', 1, i, 3
              world.addObjectAtPos 'KikiWall', 2, i, 1
              world.addObjectAtPos 'KikiWall', 2, i, 2
              world.addObjectAtPos 'KikiWall', 2, i, 5
              world.addObjectAtPos 'KikiWall', 3, i, 1
              world.addObjectAtPos 'KikiWall', 3, i, 2
              world.addObjectAtPos 'KikiWall', 3, i, 4
              world.addObjectAtPos 'KikiWall', 3, i, 5
              world.addObjectAtPos 'KikiWall', 5, i, 0
              world.addObjectAtPos 'KikiWall', 5, i, 2
              world.addObjectAtPos 'KikiWall', 5, i, 3
              world.addObjectAtPos 'KikiWall', 5, i, 4
              world.addObjectAtPos 'KikiWall', 6, i, 1
              world.addObjectAtPos 'KikiWall', 6, i, 2
              world.addObjectAtPos 'KikiWall', 7, i, 2
              world.addObjectAtPos 'KikiWall', 7, i, 4
              world.addObjectAtPos 'KikiWall', 7, i, 5
              world.addObjectAtPos 'KikiWall', 8, i, 0
              world.addObjectAtPos 'KikiWall', 8, i, 2
              world.addObjectAtPos 'KikiWall', 8, i, 4
              world.addObjectAtPos 'KikiWall', 8, i, 5
              world.addObjectAtPos 'KikiWall', 9, i, 2
              world.addObjectAtPos 'KikiWall', 9, i, 4
              world.addObjectAtPos 'KikiWall', 10, i, 3
        
        for i in [0...s.x]
              for j in [0...s.z]
                    world.addObjectAtPos 'KikiStone', i,2,j
        
        world.switch_counter = 0
        
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = kikiObjectToGate(world.getObjectWithName("exit"))
            exit.setActive(world.switch_counter == 4)
        
        switch1 = KikiSwitch()
        # switch1.getEventWithName("switched").addAction(continuous(() -> s=switch1: switched(s)))
        switch2 = KikiSwitch()
        # switch2.getEventWithName("switched").addAction(continuous(() -> s=switch2: switched(s)))
        switch3 = KikiSwitch()
        # switch3.getEventWithName("switched").addAction(continuous(() -> s=switch3: switched(s)))
        switch4 = KikiSwitch()
        # switch4.getEventWithName("switched").addAction(continuous(() -> s=switch4: switched(s)))
        
        world.addObjectAtPos switch1, 1, 0 ,2
        world.addObjectAtPos switch2, 7, 1, 0
        world.addObjectAtPos switch3, 9, 0, 0
        world.addObjectAtPos switch4, 9, 1, 5
        