module.exports =
    name:       "stones"
    scheme:     "blue_scheme"
    size:       [11,11,12]
    intro:      "stones"
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                use the stones.
                to move a stone,
                press "$key(push)"
                while moving
                """
    player:    
        position:         [0,-1,-1]
        orientation:      rotx90 * roty180
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
        