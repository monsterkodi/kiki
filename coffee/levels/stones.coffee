#  0000000  000000000   0000000   000   000  00000000   0000000  
# 000          000     000   000  0000  000  000       000       
# 0000000      000     000   000  000 0 000  0000000   0000000   
#      000     000     000   000  000  0000  000            000  
# 0000000      000      0000000   000   000  00000000  0000000   
    
module.exports =
    name:       "stones"
    scheme:     "blue"
    size:       [11,11,12]
    help:       """
                use the stones.
                to move a stone,
                press "shift+w"
                """
    player:    
        coordinates:    [4,5,3]
        orientation:    ZupX
    exits:    [
        name:         "exit"
        active:       1
        coordinates:  [5,5,6]
    ]
    create: ->

        s = world.size
        
        num = 4
        for i in [1..num]
            world.addObjectPoly 'Wall', [[s.x/2-i, s.y/2-i, i-1],
                                         [s.x/2+i, s.y/2-i, i-1],
                                         [s.x/2+i, s.y/2+i, i-1],
                                         [s.x/2-i, s.y/2+i, i-1]]
        
        world.addObjectAtPos 'Stone', s.x/2-2, s.y/2, 3
        world.addObjectAtPos 'Stone', s.x/2+2, s.y/2, 3
        world.addObjectAtPos 'Stone', s.x/2, s.y/2+2, 3
        world.addObjectAtPos 'Stone', s.x/2, s.y/2-2, 3
                                  
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2, 2
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2, 2
        world.addObjectAtPos 'Stone', s.x/2, s.y/2+1, 2
        world.addObjectAtPos 'Stone', s.x/2, s.y/2-1, 2
        