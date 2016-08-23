
#    0000000  000000000  00000000  00000000    0000000
#   000          000     000       000   000  000     
#   0000000      000     0000000   00000000   0000000 
#        000     000     000       000             000
#   0000000      000     00000000  000        0000000 

module.exports =
    name:       "steps"
    # scheme:     "blue"
    size:       [7,7,13]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                to get to the exit,
                jump on the stones
                to jump, press "$key(jump)" while moving
                to move, press "$key(move forward)" or "$key(move backward)",
                to turn, press "$key(turn left)" or "$key(turn right)"
                """
    player:   
        coordinates: [3,0,1]
        orientation: rot0
    exits:      [
        name:         "exit"
        active:       1
        position:     [0,1,3]
    ]
    create: ->

        world.addObjectAtPos 'Stone', world.decenter 0,0,3
        world.addObjectAtPos 'Wall',  world.decenter 0,-1,1
        world.addObjectAtPos 'Wall',  world.decenter 0,-2,-1
        world.addObjectAtPos 'Wall',  world.decenter 0,-3,-3
        