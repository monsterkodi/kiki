module.exports =
    name:       "church"
    scheme:     "yellow_scheme"
    size:       [5,7,5]
    intro:      "church"
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
    player:   position: [1,0,0]
    exits:    [
        name:     "exit"
        active:   0
        position: [0,-1,0]
    ]
    create: ->
        s = world.size
        
        world.addObjectLine 'KikiWireStone', 0, 0, 0, 0, s.y-2, 0
        world.addObjectLine 'KikiWireStone', s.x-1, 0, 0, s.x-1, s.y-2, 0
        world.addObjectLine 'KikiWireStone', s.x-1, 0, s.z-1, s.x-1, s.y-2, s.z-1
        world.addObjectLine 'KikiWireStone', 0, 0, s.z-1, 0, s.y-2, s.z-1
        
        world.addObjectAtPos 'KikiBomb', s.x/2, s.y-2, s.z/2
        world.addObjectAtPos 'KikiGenerator(KikiFace.PY)', s.x/2, s.y/2, s.z/2
        
        world.addObjectAtPos 'KikiWireStone', 1,      s.y-2,  1
        world.addObjectAtPos 'KikiWireStone', s.x-2,  s.y-2,  1
        world.addObjectAtPos 'KikiWireStone', 1,      s.y-2,  s.z-2
        world.addObjectAtPos 'KikiWireStone', s.x-2,  s.y-2,  s.z-2
        world.addObjectAtPos 'KikiWireStone', s.x/2,  s.y-1,  s.z/2
        
        world.addObjectAtPos 'KikiMotorGear(KikiFace.PY)', s.x/2, 0, 0
        world.addObjectAtPos 'KikiMotorCylinder(KikiFace.PY)', s.x/2, 1, 0
