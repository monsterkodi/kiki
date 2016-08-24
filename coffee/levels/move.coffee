
#   00     00   0000000   000   000  00000000
#   000   000  000   000  000   000  000     
#   000000000  000   000   000 000   0000000 
#   000 0 000  000   000     000     000     
#   000   000   0000000       0      00000000

module.exports =
    name:       "move"
    scheme:     "red"
    size:       [7,7,7]
    help:       """
                $scale(1.5)mission: activate the exit!
                to activate the exit, activate the switch
                to activate the switch,shoot it
                to be able to shoot the switch, move the stones
                to move a stone, press "$key(push)" while moving
                to shoot, press "$key(shoot)"
                """
    player:   
        coordinates:     [3,3,2]
        orientation:      rotx90
        nostatus:         0
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->

        s = world.size
        
        world.addObjectAtPos('Stone', s.x/2-1, s.y/2+1, 0)
        world.addObjectAtPos('Stone', s.x/2+1, s.y/2+1, 0)
        world.addObjectAtPos('Stone', s.x/2+1, s.y/2-1, 0)
        world.addObjectAtPos('Stone', s.x/2-1, s.y/2-1, 0)
        world.addObjectAtPos('Stone', s.x/2-1, s.y/2,   0)
        world.addObjectAtPos('Stone', s.x/2+1, s.y/2,   0)
        world.addObjectAtPos('Stone', s.x/2,   s.y/2-1, 0)
        world.addObjectAtPos('Stone', s.x/2,   s.y/2+1, 0)
        
        world.addObjectAtPos('Stone', s.x/2,   s.y/2,   1)
        
        Switch = require '../switch'
        exit_switch = new Switch
        exit_switch.getEventWithName("switched").addAction world.continuous -> world.toggle "exit"
        world.addObjectAtPos exit_switch, s.x/2,  s.y/2, 0
