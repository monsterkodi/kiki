
#   00     00  00000000   0000000  000   000
#   000   000  000       000       000   000
#   000000000  0000000   0000000   000000000
#   000 0 000  000            000  000   000
#   000   000  00000000  0000000   000   000

module.exports =
    name:       "mesh"
    design:     'Michael Abel'
    scheme:     "default_scheme"
    size:       [11,11,11]
    intro:      "mesh"
    help:       "$scale(1.5)mission:\nget to the exit!"
    player:     
        coordinates:    [0,0,5]
        nostatus:       0
    exits:      [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
        
        s=world.size
        {Stone} = require '../items'
    
        middlemin = (u,v,w) ->
            s=world.size
            d= ((u-s.x/2.0)*(u-s.x/2.0)+ (v-s.y/2.0)*(v-s.y/2.0) + (w-s.z/2.0)*(w-s.z/2.0))/25
            Math.min 0.9, Math.max 0.4, d
            
        # for (i,j,l) in [ (m,n,o) for m in range(s.x) for n in range(s.y) for o in range(s.z)]
        for i in [0...s.x]
            for j in [0...s.y]
                for l in [0...s.z]
                    if (i+1)%2 and (j+1)%2 and (l+1)%2
                        world.addObjectAtPos(new Stone(color:[0.1*i,0.1*j,0.1*l], opacity:middlemin(i,j,l), slippery:true) , i,j,l)
            