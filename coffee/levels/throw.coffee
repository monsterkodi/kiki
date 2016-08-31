
#   000000000  000   000  00000000    0000000   000   000
#      000     000   000  000   000  000   000  000 0 000
#      000     000000000  0000000    000   000  000000000
#      000     000   000  000   000  000   000  000   000
#      000     000   000  000   000   0000000   00     00

module.exports =
    
    name:       "throw"
    design:     'Michael Abel'
    scheme:     "tron"
    size:       [5,7,7]
    help:       """
                use the stones 
                to reach the exit.
                
                push a stone and it will fall down
                if nothing is below it.
                but remember:
                you decide where down and below is!
                """
    player:
        position:     [0,1,2]
        orientation:  rotx90.mul rotx180.mul roty270
    exits:    [
        name:       "exit"
        active:     1
        position:  [0,0,0]
    ]
    create: ->
        world.addObjectAtPos 'Wall',  world.decenter -2,0,2
        world.addObjectAtPos 'Stone', world.decenter 0,1,3
        world.addObjectAtPos 'Stone', world.decenter 0,-1,3
        
