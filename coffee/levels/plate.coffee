# level design by Michael Abel

Quaternion = require '../lib/quaternion'
Vector     = require '../lib/vector'

module.exports =
    name:       "plate"
    scheme:     "blue"
    size:       [7,7,9]
    help:       """
                $scale(1.5)mission:\nget to the exit!
                
                use the bombs :)
                """
    player:   
        coordinates:    [2,3,3]
        orientation:    minusXdownZ
    exits:    [
        name:         "exit"
        active:       1
        position:  [0,0,0]
    ]
    create: ->
    
        {Stone} = require '../items'
        world.addObjectAtPos new Stone(color:[0.8,0.8,0.3], slippery:true), world.decenter 0,0,0 
        world.addObjectPoly  'new Stone({color:[0.6,0.6,0.6], slippery:true})', [world.decenter(1,1,0), world.decenter(1,-1,0), world.decenter(-1,-1,0), world.decenter(-1,1,0)]
#         'new Stone(color:[0.6,0.6,0.6], slippery:true)'
        world.addObjectAtPos 'Bomb', world.decenter 0,1,-4
        world.addObjectAtPos 'Bomb', world.decenter 0,-1,-4
        world.addObjectAtPos 'Bomb', world.decenter 1,0,-4
        world.addObjectAtPos 'Bomb', world.decenter -1,0,-4
        world.addObjectAtPos 'Bomb', world.decenter 0,0,-2
