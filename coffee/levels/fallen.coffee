
#   00000000   0000000   000      000      00000000  000   000
#   000       000   000  000      000      000       0000  000
#   000000    000000000  000      000      0000000   000 0 000
#   000       000   000  000      000      000       000  0000
#   000       000   000  0000000  0000000  00000000  000   000

module.exports =
    name:       "fallen"
    deisgn:     'Owen Hay'
    scheme:     "blue"
    size:       [13,15,13]
    help:       """
                to get to the exit,
                jump and fall off the stones.
                
                try to jump so that you
                land on other stones.
                """
    player:   
        coordinates:    [0,6,2]
        orientation:    minusZupX
    exits:    [
        name:         "exit"
        active:       1
        position:     [-4, 1,-3]
    ,
        name:         "exit"
        active:       1
        position:     [0, -1, 0]
    ]
    create: ->

        s = world.size
        
        #hop back on
        world.addObjectAtPos('Wall', 2, 12, 12)
        
        #orient world
        world.addObjectAtPos('Stone', s.x/2, s.y/2+2, s.z/2)
        world.addObjectAtPos('Stone', s.x/2+2, s.y/2+2, s.z/2)
        
        #some hops
        world.addObjectAtPos('Stone', s.x/2+2, s.y/2-2, s.z/2+2)
        world.addObjectAtPos('Stone', s.x/2+2, s.y/2-2, s.z/2+4)
        world.addObjectAtPos('Stone', s.x/2, s.y/2-2, s.z/2+4)
        world.addObjectAtPos('Stone', s.x/2+2, s.y/2-2, s.z/2+4)
        world.addObjectAtPos('Stone', s.x/2, s.y/2-4, s.z/2+4)
        world.addObjectAtPos('Stone', s.x/2-2, s.y/2-4, s.z/2+4)
        world.addObjectAtPos('Stone', s.x/2-4, s.y/2-4, s.z/2+4)
        
        #long fall and strip1
        world.addObjectAtPos('Stone', s.x/2-4, s.y/2+4, s.z/2+2)
        world.addObjectAtPos('Stone', s.x/2-3, s.y/2+4, s.z/2+2)
        
        #short fall and strip2
        world.addObjectAtPos('Stone', s.x/2-4, s.y/2+1, s.z/2-2)
        world.addObjectAtPos('Stone', s.x/2-4, s.y/2+1, s.z/2-1)
        
        