module.exports =
    name:       "grid"
    scheme:     "candy_scheme"
    size:       [9,9,9]
    intro:      "grid"
    help:       """
                $scale(1.5)mission:
                get to the exit!
                to get to the exit,
                use the stones
                """
    player:    position:         [1,0,1]
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
# 
        s = world.size
        
        for y in [-1, 1]
            for x in [-1,1,3]
                for z in [-1,1,3]
                    world.addObjectAtPos 'Wall', world.decenter x, y, z  
                    
        for y in [-4, 4]
            for x in [-3, -1, 1, 3]
                for z in [-3, -1, 1, 3]
                    world.addObjectAtPos 'Wall', world.decenter x, y, z  
                    
        world.addObjectAtPos 'Stone', world.decenter 3,-3,0
        world.addObjectAtPos 'Stone', world.decenter -3,-3,0
        world.addObjectAtPos 'Stone', world.decenter 3,3,0
        world.addObjectAtPos 'Stone', world.decenter -3,3,0
        world.addObjectAtPos 'Stone', world.decenter 0,-3,0
        world.addObjectAtPos 'Stone', world.decenter 0,3,0
        