
#    0000000  000   000   0000000   000  000   000
#   000       000   000  000   000  000  0000  000
#   000       000000000  000000000  000  000 0 000
#   000       000   000  000   000  000  000  0000
#    0000000  000   000  000   000  000  000   000

module.exports =
    name:       "chain"
    scheme:     "candy"
    size:       [9,9,5]
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
        
        world.addObjectAtPos 'Wall', 0, 0, d
        world.addObjectAtPos 'Bomb', 0, 1, d
        world.addObjectAtPos 'Bomb', 1, 0, d
        world.addObjectAtPos 'Bomb', 0, 7, d
        world.addObjectAtPos 'Bomb', 5, 7, d
        world.addObjectAtPos 'Bomb', 1, 3, d
        world.addObjectAtPos 'Bomb', 5, 3, d
        world.addObjectAtPos 'WireStone', 1, 5, d
        