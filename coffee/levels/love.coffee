module.exports =
    name:       "love"
    scheme:     "red"
    size:       [13,13,13]
    help:       "get to the exit!"
    player:   
        coordinates:    [6,4,2]
        orientation:    minusZupY 
    exits:    [
        name:         "peace"
        active:       1
        position:     [0,0,4]
    ]
    create: ->

        heart = [[0,0], [ 1,1], [ 2,1], [ 3,0], [ 3,-1], [ 2,-2], [ 1,-3], [0,-4],
                [-1,1], [-2,1], [-3,0], [-3,-1], [-2,-2], [-1,-3]]
        for h in heart
            world.addObjectAtPos('Bomb', world.decenter(h[0],h[1]+1,4))
            world.addObjectAtPos('Stone', world.decenter(h[0],h[1]+1,-4))
            
        world.addObjectAtPos('Mutant', world.decenter(0,-4,0))