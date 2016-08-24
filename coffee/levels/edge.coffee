
#   00000000  0000000     0000000   00000000
#   000       000   000  000        000     
#   0000000   000   000  000  0000  0000000 
#   000       000   000  000   000  000     
#   00000000  0000000     0000000   00000000

module.exports = 
    name:       "edge"
    design:     "Michael Abel"
    scheme:     "candy"
    size:       [7,7,7]
    help:       "$scale(1.5)mission:\nget to the exit!"
    player:
        coordinates:  [3,0,0]
        nostatus:     0
        orientation:  rot0
    exits:    [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
        s=world.size
        {Stone} = require '../items'
        for i in [0...3]
            for j in [0...3]
                for l in [0...3]
                    if (i==2 or j==2 or l==2) and i>=1 and j>=1 and l >=1
                        c = 0.6 - (0.3)*Math.pow(-1, i+j+l)
                        d = 0.6 + (0.3)*Math.pow(-1, i+j+l)
                        world.addObjectAtPos new Stone(color:[c ,0, d, 0.8]), i,j,l
                        world.addObjectAtPos new Stone(color:[c ,0, d, 0.8]), s.x-i-1,s.y-j-1,s.z-l-1
                        world.addObjectAtPos new Stone(color:[c ,0, d, 0.8]), s.x-i-1,j,l
                        world.addObjectAtPos new Stone(color:[c ,0, d, 0.8]), i,s.y-j-1,s.z-l-1
    