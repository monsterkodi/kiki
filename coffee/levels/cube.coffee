
#    0000000  000   000  0000000    00000000
#   000       000   000  000   000  000     
#   000       000   000  0000000    0000000 
#   000       000   000  000   000  000     
#    0000000   0000000   0000000    00000000

module.exports =
    name:       "cube"
    deisgn:     'Michael Abel'
    scheme:     "default_scheme"
    size:       [5,5,5]
    intro:      "cube"
    help:       "reach the exit!"
    player:
        coordinates:  [2,0,0]
        nostatus:     0
        orientation:  rot0
        
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,2,2]
    ],
    create: ->
                
        for i in [0...5]
            for j in [0...5]
                for l in [0...5]
                    if Math.pow(-1, i+j+l) == -1
                        world.addObjectAtPos 'Stone', i,j,l 
