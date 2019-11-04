#  0000000   00000000   000  0000000      
# 000        000   000  000  000   000    
# 000  0000  0000000    000  000   000    
# 000   000  000   000  000  000   000    
#  0000000   000   000  000  0000000      

module.exports =
    name:       "grid"
    scheme:     "crazy"
    size:       [9,9,9]
    help:       """
                to get to the exit,
                use the stones.
                """
    player:    
        coordinates: [3,4,8]
        orientation: minusXdownZ
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
        