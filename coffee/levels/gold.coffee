
#    0000000    0000000   000      0000000  
#   000        000   000  000      000   000
#   000  0000  000   000  000      000   000
#   000   000  000   000  000      000   000
#    0000000    0000000   0000000  0000000  

module.exports =
    name:       "gold"
    scheme:     "yellow"
    size:       [3,11,3]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                move the stones to reach it
                """
    player:
        coordinates: [1,0,0]
        orientation: minusYupZ
        
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,4,0]
    ]
    create: ->
        s = world.size
        for y in [2,4,6,8]
            for x in [0...3]
                for z in [0...3]
                    world.addObjectAtPos 'Stone', x, y, z 
