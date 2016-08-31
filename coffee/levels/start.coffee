
#    0000000  000000000   0000000   00000000   000000000
#   000          000     000   000  000   000     000   
#   0000000      000     000000000  0000000       000   
#        000     000     000   000  000   000     000   
#   0000000      000     000   000  000   000     000   

module.exports =
    name:       "start"
    scheme:     "default"
    size:       [7,5,11]
    help:       """
                to get to the exit,
                jump on the stones.
                
                "w" or "d" to move.
                "a" or "s" to turn.
                "space" to jump.
                """
    player:   
        coordinates:   [1,0,4]
        orientation:   minusXupY
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,3]
    ]
    create: ->

        world.addObjectAtPos 'Wall', world.decenter 0,0,-2
        world.addObjectAtPos 'Wall', world.decenter 0,0,-4
        world.addObjectAtPos 'Wall', world.decenter 0,0, 1
        