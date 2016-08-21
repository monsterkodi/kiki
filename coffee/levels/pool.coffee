
#   00000000    0000000    0000000   000    
#   000   000  000   000  000   000  000    
#   00000000   000   000  000   000  000    
#   000        000   000  000   000  000    
#   000         0000000    0000000   0000000

module.exports =
    name:       "pool"
    design:     'Michael Abel'
    scheme:     "green_scheme"
    size:       [11,11,11]
    intro:      "pool"
    help:       "$scale(1.5)mission:\nget to the exit!"
    player:   
        coordinates:     [5,10,5]
        nostatus:         0
        orientation:  rotx90
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,-1]
    ]
    create: ->
        s=world.size
        {Stone} = require '../items'
        d=1
        # for (i,j,l) in [ (m,n,o) for m in range(s.x) for n in range(s.y) for o in range( s.z/2-1)]
        for i in [0...s.x]
            for j in [0...s.y]
                for l in [0..s.z/2]
                    if Math.pow(-1, i+j+l) == 1 and not (d<=i<=s.x-d-1 and d<=j<=s.y-d-1 and d<=l)
                        world.addObjectAtPos new Stone(color:[0.3,0.3,1.0], opacity:0.9, slippery:true), i,j,l 
    
        for h in [ s.z/2 -1, s.z-5]
            world.addObjectPoly 'Wall', [[0,0,h],[s.x-1,0,h],[s.x-1,s.y-1,h],[0,s.y-1,h]]
        
        # for (i,j) in [ (m,n) for m in range(s.x) for n in range(s.y) ]
        for i in [0...s.x]
            for j in [0...s.y]
                if Math.pow(-1,i+j) == 1
                     world.addObjectAtPos 'Wall', i,j,s.z-1
                     world.addObjectAtPos 'Wall', i,j,s.z-2
                     world.addObjectAtPos 'Wall', i,j,s.z-3
            