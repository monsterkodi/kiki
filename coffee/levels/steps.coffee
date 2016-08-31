
#    0000000  000000000  00000000  00000000    0000000
#   000          000     000       000   000  000     
#   0000000      000     0000000   00000000   0000000 
#        000     000     000       000             000
#   0000000      000     00000000  000        0000000 

module.exports =
    name:       "steps"
    size:       [7,7,13]
    help:       """
                to get to the exit,
                jump on the stones.
                
                "w" to move forward.
                "space" to jump.
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
        