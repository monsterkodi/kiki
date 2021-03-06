
#   000   000   0000000   000      000       0000000
#   000 0 000  000   000  000      000      000     
#   000000000  000000000  000      000      0000000 
#   000   000  000   000  000      000           000
#   00     00  000   000  0000000  0000000  0000000 

module.exports =
    name:       "walls"
    design:     'Michael Abel'
    scheme:     "red"
    size:       [7,5,5]
    help:       """
                get to the exit!
                
                The exit is hidden
                in the middle of
                the central wall.
                """
    player:
        coordinates:    [0,4,2]
        orientation:    minusXdownY
    exits:    [
        name:           "exit"
        active:         1
        position:       [0,0,0]
    ]
    create: ->
        s=world.size
        {Stone} = require '../items'
        middlemax = (u,v,w) ->
            d= 3.0/( (u-s.x/2.0)**2+ (v-s.y/2.0)**2 + (w-s.z/2.0)**2 + 1 )
            Math.min 1.0 ,Math.max 0.2, d  
            
        middlemin = (u,v,w) ->
            d= 2* ( (u-s.x/2.0)**2+ (v-s.y/2.0)**2 + (w-s.z/2.0)**2  )/25
            Math.min 1.0, Math.max 0.4,d 
            
        for i in [0...s.x]
            for j in [0...s.y]
                for l in [0...s.z]
                    if i==Math.floor(s.x/2) or i==Math.floor(s.x/2-2) or i==Math.floor(s.x/2+2)
                        world.addObjectAtPos new Stone(color:[0.5*i,0.5*j,0.5*l], opacity:0.6), i,j,l
    