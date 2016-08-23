
#   0000000    000       0000000    0000000  000   000   0000000
#   000   000  000      000   000  000       000  000   000     
#   0000000    000      000   000  000       0000000    0000000 
#   000   000  000      000   000  000       000  000        000
#   0000000    0000000   0000000    0000000  000   000  0000000 

module.exports =
    name:       "blocks"
    design:     'Michael Abel'
    scheme:     "default"
    size:       [18,12,5]
    help:       """
                you can grab
                most stones by pressing forward
                while jumping or falling down
                next to them.
                the slitted stones are slippery,
                you can't grab them while jumping
                or falling.
                the color of a stone has no meaning.
                """
    player:     
        coordinates: [1,6,2]
    exits:    [
        name:         "exit"
        active:       1
        coordinates: [7,9,2]
        ]
    create: ->
        {Stone} = require '../items'
        world.addObjectAtPos 'Wall', 1,1,2
        world.addObjectAtPos 'Wall', 4,2,2
        world.addObjectAtPos 'Wall', 7,2,2
        world.addObjectAtPos 'Stone', 10,2,2
        world.addObjectAtPos new Stone(slippery: true), 13,2,2
        world.addObjectAtPos new Stone(slippery: true), 15,4,2
        
        world.addObjectAtPos new Stone(color: [0,1,0], opacity: 0.8, slippery: true), 13,7,2
        world.addObjectAtPos new Stone(color: [1,0,0], opacity: 0.8, slippery: true), 10,7,2
        world.addObjectAtPos new Stone(color: [0,0,1], opacity: 0.8, slippery: true), 7,7,2
        world.addObjectAtPos new Stone(color: [0.5,0.5,0], opacity:0.8), 4,7,2
        
        world.addObjectLine 'Wall', 0,0,2, 7,0,2
