# level design by Michael Abel

Quaternion = require '../lib/quaternion'
Vector     = require '../lib/vector'

module.exports =
    name:       "plate"
    scheme:     "blue_scheme"
    size:       [7,7,9]
    intro:      "plate"
    help:       """
                $scale(1.5)mission:\nget to the exit!
                
                use the bombs :)
                """
    player:   
        coordinates:    [3,2,1]
        nostatus:        0
        orientation:    Quaternion.rotationAroundVector(270, new Vector(1,0,0))
    exits:    [
        name:         "exit"
        active:       1
        position:  [0,0,0]
    ]
    create: ->
    
        world.addObjectAtPos 'new Stone(color:[0.8,0.8,0.3],slippery:true', world.decenter(0,0,0)
        
        world.addObjectPoly 'new Stone(color:[0.6,0.6,0.6],slippery:true)', [world.decenter(1,1,0),world.decenter(1,-1,0), world.decenter(-1,-1,0),world.decenter(-1,1,0)], 1
        
        world.addObjectAtPos 'Bomb', world.decenter 0,1,-4
        world.addObjectAtPos 'Bomb', world.decenter 0,-1,-4
        world.addObjectAtPos 'Bomb', world.decenter 1,0,-4
        world.addObjectAtPos 'Bomb', world.decenter -1,0,-4
        
        world.addObjectAtPos 'Bomb', world.decenter 0,0,-2
