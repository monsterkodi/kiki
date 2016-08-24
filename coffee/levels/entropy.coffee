
#   00000000  000   000  000000000  00000000    0000000   00000000   000   000
#   000       0000  000     000     000   000  000   000  000   000   000 000 
#   0000000   000 0 000     000     0000000    000   000  00000000     00000  
#   000       000  0000     000     000   000  000   000  000           000   
#   00000000  000   000     000     000   000   0000000   000           000   

module.exports =

    name:       "entropy"
    design:     'Michael Abel'
    scheme:     "green"
    size:       [9,9,9]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                
                use the stones to reach it
                """
    player:   
        coordinates:     [4,3,2]
        orientation:    minusXupZ
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
        s=world.size
        d=2
        {Stone} = require '../items'
        # for (i,j,l) in [ (m,n,o) for m in range(s.x) for n in range(s.y) for o in range(s.z)]
        for i in [0...s.x]
            for j in [0...s.y]
                for l in [0...s.z]
                    if Math.pow(-1, i+j+l)==1  and not (d<=i<=s.x-d-1 and d<=j<=s.y-d-1 and d<=l<=s.z-d-1)
                        world.addObjectAtPos(new Stone(color:[0,0.8,0.2],opacity:0.8, slippery:true), i,j,l)

