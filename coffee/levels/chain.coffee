module.exports =
    name:       "chain"
    scheme:     "candy_scheme"
    size:       [9,9,5]
    intro:      "chain"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit,
                feed it with electricity:
                    
                connect the generator
                with the motor
                
                place a wire stone
                next to the exit
                """
    player:     position:     [1,2,0]
                
    exits:      [
        name:       "exit"
        active:     0
        position:   [0,-1,0]
    ],
    create: ->
        s = world.size
        d = s.z/2
        
        world.addObjectAtPos 'KikiWall', 0, 0, d
        world.addObjectAtPos 'KikiBomb', 0, 1, d
        world.addObjectAtPos 'KikiBomb', 1, 0, d
        world.addObjectAtPos 'KikiBomb', 0, 7, d
        world.addObjectAtPos 'KikiBomb', 5, 7, d
        world.addObjectAtPos 'KikiBomb', 1, 3, d
        world.addObjectAtPos 'KikiBomb', 5, 3, d
        world.addObjectAtPos 'KikiWireStone', 1, 5, d
        