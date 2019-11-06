
#   00000000   0000000   000      000    
#   000       000   000  000      000    
#   000000    000000000  000      000    
#   000       000   000  000      000    
#   000       000   000  0000000  0000000

module.exports =
    name:       "fall"
    scheme:     "red"
    size:       [7,7,13]
    help:       """  
                get to the exit!
                
                jump on the stones to reach it
                
                you can attach to a stone when falling
                if you move into its direction
                """
    player:   
        coordinates: [3,6,4]
        orientation: minusZdownY
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,3]
    ]
    create: ->

        s = world.size
        
        world.addObjectAtPos 'Wall', world.decenter 0,0,1 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter 0,0,3 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter 0,0,6 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter 0,1,10 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter 1,0,10 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter -1,0,10 - s.z/2
        world.addObjectAtPos 'Wall', world.decenter 0,-1,10 - s.z/2
        