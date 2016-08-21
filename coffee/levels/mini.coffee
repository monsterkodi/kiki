
#   00     00  000  000   000  000
#   000   000  000  0000  000  000
#   000000000  000  000 0 000  000
#   000 0 000  000  000  0000  000
#   000   000  000  000   000  000

module.exports =
    name:       "mini"
    design:     'Michael Abel'
    scheme:     "tron_scheme"
    size:       [5,5,7]
    intro:      "mini"
    help:       "$scale(1.5)mission:\nget to the exit!"
    player:   
        coordinates:    [2,4,4]
        nostatus:       0,
        orientation:    rotx90
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,1]
    ]
    create: ->
        world.addObjectAtPos 'Wall',   1,1,0
        world.addObjectAtPos 'Wall',   3,1,0
        world.addObjectAtPos 'Wall',   1,3,0
        world.addObjectAtPos 'Wall',   3,3,0
                                          
        world.addObjectAtPos 'Wall',   1,1,6
        world.addObjectAtPos 'Wall',   3,1,6
        world.addObjectAtPos 'Wall',   1,3,6
        world.addObjectAtPos 'Wall',   3,3,6
                                          
        world.addObjectAtPos 'Stone',  1,1,1
        world.addObjectAtPos 'Stone',  3,1,1
        world.addObjectAtPos 'Stone',  1,3,1
        world.addObjectAtPos 'Stone',  3,3,1
                          
        world.addObjectAtPos  'Stone', 2,4,0
            