
#   00000000   000  000   000   0000000    0000000
#   000   000  000  0000  000  000        000     
#   0000000    000  000 0 000  000  0000  0000000 
#   000   000  000  000  0000  000   000       000
#   000   000  000  000   000   0000000   0000000 

module.exports =
    name:       "rings"
    scheme:     "default"
    size:       [9,7,9]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                to get to the exit,
                use the stones
                """
    player:   
        coordinates: [4,4,2]
        orientation: minusXupZ
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->

        s = world.size
        
        for y in [-1, 1]
            x = 3
            world.addObjectPoly 'Stone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), world.decenter(x, y, -x)]
        
        for y in [-3, 3]
            for x in [-3, -1, 1, 3]
                world.addObjectPoly 'Stone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), world.decenter(x, y, -x)]
                                                 