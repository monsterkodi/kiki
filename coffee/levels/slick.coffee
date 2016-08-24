
#    0000000  000      000   0000000  000   000
#   000       000      000  000       000  000 
#   0000000   000      000  000       0000000  
#        000  000      000  000       000  000 
#   0000000   0000000  000   0000000  000   000

module.exports =

    name:       "slick"
    design:     'Michael Abel'
    scheme:     "tron"
    size:       [9,11,15]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                The green stone is slicky
                you can't grab it while falling
                """
    player:   
        coordinates:    [0,10,13]
        orientation:    ZdownY
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,4]
    ]
    create: ->
        s=world.size
        for b in [1..3]
            # for (k,l) in [ (i,j) for i in range(b+1,s.x-b-1) for j in range(b+1,s.y-b-1) ]
            for k in [b+1..s.x-b]
                for l in [b+1..s.y-b]
                    world.addObjectAtPos('new Stone({color:[0,1,0,0.5], slippery:true})', k,l,b*3)
    
        world.addObjectAtPos('Wall', s.x/2,s.y/2,0)
        world.addObjectAtPos('new Stone({color:[0,1,0,0.5], slippery:true})', s.x/2,s.y/2,2)
        