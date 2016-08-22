
#    0000000   0000000   000      000   000  00     00  000   000   0000000
#   000       000   000  000      000   000  000   000  0000  000  000     
#   000       000   000  000      000   000  000000000  000 0 000  0000000 
#   000       000   000  000      000   000  000 0 000  000  0000       000
#    0000000   0000000   0000000   0000000   000   000  000   000  0000000 

module.exports =
    name:       "columns"
    scheme:     "green_scheme"
    size:       [7,9,7]
    intro:      "columns"
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                to get to the exit,
                use the stones
                """
    player:   
        position: [0,-1,0]
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->

        s = world.size
        
        for y in [-4...6]
            for x in [-3, -1, 1, 3]
                for z in [-3, -1, 1, 3 ]
                    world.addObjectAtPos 'Stone', world.decenter x, y, z  
                    
        world.getOccupantAtPos(world.decenter -1, 0, 1).del()
        world.getOccupantAtPos(world.decenter  1, 0,-1).del()
        world.getOccupantAtPos(world.decenter  1, 0, 1).del()
        world.getOccupantAtPos(world.decenter -1, 0,-1).del()
