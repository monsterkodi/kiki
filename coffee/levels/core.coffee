
#    0000000   0000000   00000000   00000000
#   000       000   000  000   000  000     
#   000       000   000  0000000    0000000 
#   000       000   000  000   000  000     
#    0000000   0000000   000   000  00000000

module.exports =
    name:       "core"
    design:     "Michael Abel"
    scheme:     "yellow"
    size:       [9,9,9]
    help:       """
                reach the exit.
                to reach the exit, move the stones.
                """
    player:   
        position:       [1,1,1]
        orientation:    rotz90
    exits:      [  
        name:           "exit"
        active:         1
        position:       [0,0,0]
    ]  
    create: ->

        s = world.size
        
        for y in [-3, -1, 1, 3]
            for x in [-3...5]
                for z in [-3...5]
                    world.addObjectAtPos 'Stone', world.decenter x, y, z
                    
        for y in [-1, 1]
            for x in [-1, 0, 1]
                for z in [-1, 0, 1]
                    world.getOccupantAtPos(world.decenter x, y, z).del()
            for z in [-2, 2]
                world.getOccupantAtPos(world.decenter 0, y, z).del()
                    
            for x in [-2, 2]
                world.getOccupantAtPos(world.decenter x, y, 0).del()
                
        for y in [-3, 3]
            world.getOccupantAtPos(world.decenter 0, y, 0).del()
        
        for y in [-4, 4]
            world.addObjectAtPos 'Stone', world.decenter 0, y, 0
        