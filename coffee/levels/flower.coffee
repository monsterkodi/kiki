# level design by Michael Abel

module.exports =
    
    name:       "flower"
    scheme:     "metal"
    size:       [7,7,11]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                the green stone is slicky
                you can't grab it while falling
                """
    player:
        coordinates:     [3,0,7]
        orientation:     ZupY
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
        s = world.size
        {Stone} = require '../items'   
        for m in [[1,'Wall'], [2,'Stone']]
            for k in [-1*m[0],1*m[0]] 
                for l in [-1*m[0],1*m[0]]
                    world.addObjectLine m[1], s.x/2+k, s.y/2+l ,0, s.x/2+k, s.y/2+l ,3
                    world.addObjectLine m[1], s.x/2+k, s.y/2+l ,8, s.x/2+k, s.y/2+l ,s.z
        world.addObjectAtPos new Stone(color:[0.5,0.5,1], opacity: 0.5, slippery:true), world.decenter 1,0,0
        world.addObjectAtPos new Stone(color:[0.5,0.5,1], opacity: 0.5, slippery:true), world.decenter -1,0,0
        world.addObjectAtPos new Stone(color:[0.5,0.5,1], opacity: 0.5, slippery:true), world.decenter 0,1,0
        world.addObjectAtPos new Stone(color:[0.5,0.5,1], opacity: 0.5, slippery:true), world.decenter 0,-1,0
    