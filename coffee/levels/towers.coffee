
#   000000000   0000000   000   000  00000000  00000000    0000000
#      000     000   000  000 0 000  000       000   000  000     
#      000     000   000  000000000  0000000   0000000    0000000 
#      000     000   000  000   000  000       000   000       000
#      000      0000000   00     00  00000000  000   000  0000000 

module.exports = 
    name:       "towers"
    design:     'Ben "mrthoughtful" Griffin'
    scheme:     "metal"
    size:       [9,9,15]
    help:       "$scale(1.5)mission:\nget to the exit!\n\nto get to the exit,\nmove the stones"
    player: 
        coordinates: [4,5,3]
        orientation: ZdownX
    exits: [
        name:       "exit"
        active:     1
        position:   [0,0,-3]
    ], 
    create: ->
        s = world.size
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2+1, 0
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2+1, 1
        world.addObjectAtPos 'Stone', s.x/2-1, s.y/2+1, 2
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2+1, 0
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2+1, 1
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2+1, 2
        world.addObjectAtPos 'Stone', s.x/2+1, s.y/2+1, 3
