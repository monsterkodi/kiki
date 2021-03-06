
#   0000000     0000000   00     00  0000000     0000000
#   000   000  000   000  000   000  000   000  000     
#   0000000    000   000  000000000  0000000    0000000 
#   000   000  000   000  000 0 000  000   000       000
#   0000000     0000000   000   000  0000000    0000000 

module.exports = 
    name:     'bombs'
    scheme:   "red"
    size:     [9,9,9]
    help:     """
                to get to the exit,
                use the bombs.
              """
    player:   
        coordinates: [4,0,4]
        orientation: XupY
              
    exits:    [
        name:     "exit"
        active:   1
        position: [0,2,0]
    ],
    create: ->
        world.addObjectAtPos 'Bomb', world.decenter 0,-4,2
        world.addObjectAtPos 'Bomb', world.decenter 0,-4,-2
        world.addObjectAtPos 'Bomb', world.decenter -3,-2,0