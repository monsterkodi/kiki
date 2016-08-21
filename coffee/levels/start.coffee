
#    0000000  000000000   0000000   00000000   000000000
#   000          000     000   000  000   000     000   
#   0000000      000     000000000  0000000       000   
#        000     000     000   000  000   000     000   
#   0000000      000     000   000  000   000     000   

module.exports =
    name:       "start"
    scheme:     "default_scheme"
    size:       [7,7,11]
    intro:      "start"
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                to get to the exit,
                jump on the stone
                to jump,
                press "$key(jump)" while moving
                to move, press "$key(move forward)" or "$key(move backward)"
                to turn, press "$key(turn left)" or "$key(turn right)"
                """
    player:   
        position:     [0,0,4]
        orientation:   rotx270
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,3]
    ]
    create: ->

        world.addObjectAtPos 'Wall', world.decenter 0,0,-2
        world.addObjectAtPos 'Wall', world.decenter 0,0,-4
        world.addObjectAtPos 'Wall', world.decenter 0,0, 1
        