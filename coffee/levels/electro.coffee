
#   00000000  000      00000000   0000000  000000000  00000000    0000000 
#   000       000      000       000          000     000   000  000   000
#   0000000   000      0000000   000          000     0000000    000   000
#   000       000      000       000          000     000   000  000   000
#   00000000  0000000  00000000   0000000     000     000   000   0000000 
    
module.exports =
    name:       "electro"
    scheme:     "metal_scheme"
    size:       [9,7,9]
    intro:      "electro"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity:
                    
                connect the generator
                with the motor
                """
    player:
        coordinates:      [2,0,4]
        orientation:      rotz180
        nostatus:         0
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ],
    create: ->
        s = world.size
        d = 2
        
        world.addObjectLine('KikiWireStone', world.decenter(-d, s.y/2, 0), world.decenter(-d, 0, 0))
        world.addObjectLine('KikiWireStone', world.decenter( d, s.y/2, 0), world.decenter( d, 0, 0))
        world.addObjectLine('KikiWireStone', world.decenter( d, 0, 0),     world.decenter( 0, 0, 0))
        world.addObjectLine('KikiWireStone', world.decenter(-d, 0, 0),     world.decenter( 0, 0, 0))
        
        world.addObjectAtPos(KikiGear(KikiFace.PY), s.x/2-1, 0, s.z/2-1)
        
        world.addObjectAtPos(KikiGenerator(KikiFace.PY), s.x/2+1, 0, s.z/2+1)
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.PY), s.x/2, 1, s.z/2)
        world.addObjectAtPos(KikiMotorGear(KikiFace.PY), s.x/2, 0, s.z/2)
        
        # floor wire square
        world.addObjectLine(KikiWire(KikiFace.PY, 10),   s.x/2-d+1, 0, s.z/2-d, s.x/2+d, 0, s.z/2-d)
        world.addObjectLine(KikiWire(KikiFace.PY, 10),   s.x/2-d+1, 0, s.z/2+d, s.x/2+d, 0, s.z/2+d)
        world.addObjectLine(KikiWire(KikiFace.PY, 5),    s.x/2-d, 0, s.z/2-d+1, s.x/2-d, 0, s.z/2+d)
        world.addObjectLine(KikiWire(KikiFace.PY, 5),    s.x/2+d, 0, s.z/2-d+1, s.x/2+d, 0, s.z/2+d)
        # corners of wire square
        world.addObjectAtPos(KikiWire(KikiFace.PY, 6),   s.x/2-d, 0, s.z/2-d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 3),   s.x/2-d, 0, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 9),   s.x/2+d, 0, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 12),  s.x/2+d, 0, s.z/2-d)
        
        world.addObjectLine(KikiWire(KikiFace.PX, 5),        0, 0, s.z/2,     0, s.y, s.z/2)
        world.addObjectLine(KikiWire(KikiFace.NX, 5),    s.x-1, 0, s.z/2, s.x-1, s.y, s.z/2)
                                                         
        world.addObjectLine(KikiWire(KikiFace.NY, 10),   0, s.y-1, s.z/2, s.x/2-d, s.y-1, s.z/2)
        world.addObjectLine(KikiWire(KikiFace.NY, 10),   s.x-d, s.y-1, s.z/2, s.x, s.y-1, s.z/2)
                                                         
        world.addObjectLine(KikiWire(KikiFace.PY, 10),   0, 0, s.z/2, s.x/2-d, 0, s.z/2)
        world.addObjectLine(KikiWire(KikiFace.PY, 10),   s.x-d, 0, s.z/2, s.x, 0, s.z/2)
        
        world.addObjectAtPos(KikiWire(KikiFace.PY, 13),  s.x/2-d, 0, s.z/2)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 7),   s.x/2+d, 0, s.z/2)
        