
#   000   000  000  0000000    0000000    00000000  000   000
#   000   000  000  000   000  000   000  000       0000  000
#   000000000  000  000   000  000   000  0000000   000 0 000
#   000   000  000  000   000  000   000  000       000  0000
#   000   000  000  0000000    0000000    00000000  000   000

module.exports =
    name:       "hidden"
    scheme:     "metal"
    size:       [9,9,9]
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit,
                activate the 5 switches
                
                use the stones to
                reach the exit
                """
    player:   
        coordinates: [4,8,2]
        orientation: YdownZ
                
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ],
    create: ->
        s = world.size
        Switch = require '../switch'
        
        world.addObjectAtPos('Stone', 0,0,1)
        world.addObjectAtPos('Stone', 0,1,0)
        world.addObjectAtPos('Stone', 1,0,1)
        world.addObjectAtPos('Stone', 1,1,0)
        world.addObjectAtPos('Stone', 2,0,0)
        switch1 = new Switch
        world.addObjectAtPos(switch1, 1,0,0)
        
        world.addObjectAtPos('Stone', s.x-1,0,1)
        world.addObjectAtPos('Stone', s.x-1,1,0)
        world.addObjectAtPos('Stone', s.x-2,0,1)
        world.addObjectAtPos('Stone', s.x-2,1,0)
        world.addObjectAtPos('Stone', s.x-3,0,0)
        switch2 = new Switch
        world.addObjectAtPos(switch2, s.x-2,0,0)
        
        world.addObjectAtPos('Stone', 0,0,s.z-2)
        world.addObjectAtPos('Stone', 0,1,s.z-1)
        world.addObjectAtPos('Stone', 1,0,s.z-2)
        world.addObjectAtPos('Stone', 1,1,s.z-1)
        world.addObjectAtPos('Stone', 2,0,s.z-1)
        switch3 = new Switch
        world.addObjectAtPos(switch3, 1,0,s.z-1)
        
        world.addObjectAtPos('Stone', s.x-1,0,s.z-2)
        world.addObjectAtPos('Stone', s.x-1,1,s.z-1)
        world.addObjectAtPos('Stone', s.x-2,0,s.z-2)
        world.addObjectAtPos('Stone', s.x-2,1,s.z-1)
        world.addObjectAtPos('Stone', s.x-3,0,s.z-1)
        switch4 = new Switch
        world.addObjectAtPos(switch4, s.x-2,0,s.z-1)
        
        world.addObjectPoly('Stone', [ [s.x/2-1,s.y-1,s.z/2-1], [s.x/2-1,s.y-1,s.z/2+1], [s.x/2+1,s.y-1,s.z/2+1], [s.x/2+1,s.y-1,s.z/2-1]])
        switch5 = new Switch
        world.addObjectAtPos('Stone', s.x/2,s.y-2,s.z/2)
        world.addObjectAtPos(switch5, s.x/2,s.y-1,s.z/2)
        
        world.switch_counter = 0
        
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit"
            exit.setActive world.switch_counter == 5 
        
        switch1.getEventWithName("switched").addAction world.continuous (s=switch1) -> switched s
        switch2.getEventWithName("switched").addAction world.continuous (s=switch2) -> switched s
        switch3.getEventWithName("switched").addAction world.continuous (s=switch3) -> switched s
        switch4.getEventWithName("switched").addAction world.continuous (s=switch4) -> switched s
        switch5.getEventWithName("switched").addAction world.continuous (s=switch5) -> switched s
