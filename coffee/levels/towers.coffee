# level design by Ben "mrthoughtful" Griffin

module.exports = 
    name:       "towers"
    scheme:     "metal"
    size:       [9,9,15]
    help:       "$scale(1.5)mission:\nget to the exit!\n\nto get to the exit,\nmove the stones"
    player: 
        coordinates: [4,5,0]
        orientation: rotx90
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
