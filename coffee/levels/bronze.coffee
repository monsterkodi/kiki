
module.exports = 
    name:       'bronze'
    scheme:     "bronze_scheme"
    size:       [9,6,9]
    intro:      "bronze"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity:
                    
                connect the generator
                with the motor
                and close the circuit
                with the wire stones"
                """
    player:     position: [0,1,0]
                
    exits:      [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->
        s = world.size
        d = 2
        
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.PY),    s.x/2, 1,      s.z/2)
        world.addObjectAtPos(KikiMotorGear(KikiFace.PY),        s.x/2, 0,      s.z/2)
        
        world.addObjectAtPos(KikiGear(KikiFace.PY),             s.x/2-1, s.y-1,  s.z/2-1)
        world.addObjectAtPos(KikiGenerator(KikiFace.PY),        s.x/2+1, s.y-1,  s.z/2-1)
                                       
        world.addObjectAtPos('KikiBomb',                        s.x/2-1, s.y-1,  s.z/2+1)
        
        world.addObjectAtPos('KikiWireStone',                   s.x/2,   s.y-1,  s.z/2)
        world.addObjectAtPos('KikiWireStone',                   s.x/2+1, s.y-2,  s.z/2)
        world.addObjectAtPos('KikiWireStone',                   s.x/2-1, s.y-2,  s.z/2)
        
        # floor wire square
        world.addObjectLine "KikiWire(KikiFace.PY, 10)", s.x/2-d+1, 0, s.z/2-d, s.x/2+d, 0, s.z/2-d
        world.addObjectLine "KikiWire(KikiFace.PY, 10)", s.x/2-d+1, 0, s.z/2+d, s.x/2+d, 0, s.z/2+d
        
        world.addObjectAtPos(KikiWire(KikiFace.PY, 5),  s.x/2-d, 0, s.z/2+1)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 5),  s.x/2-d, 0, s.z/2-1)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 13), s.x/2-d, 0, s.z/2)
        
        world.addObjectAtPos(KikiWire(KikiFace.PY, 5),  s.x/2+d, 0, s.z/2+1)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 5),  s.x/2+d, 0, s.z/2-1)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 7),  s.x/2+d, 0, s.z/2)
        
        # corners of wire square
        world.addObjectAtPos(KikiWire(KikiFace.PY, 6),  s.x/2-d, 0, s.z/2-d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 3),  s.x/2-d, 0, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 9),  s.x/2+d, 0, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.PY, 12), s.x/2+d, 0, s.z/2-d)
        
        world.addObjectLine "KikiWire(KikiFace.PY, 10)", 0, 0, s.z/2,         s.x/2-d, 0, s.z/2
        world.addObjectLine "KikiWire(KikiFace.PY, 10)", s.x/2+d+1, 0, s.z/2, s.x, 0, s.z/2
        
        # ceiling wire square
        world.addObjectLine "KikiWire(KikiFace.NY, 10)", s.x/2-d+1, s.y-1, s.z/2-d, s.x/2+d, s.y-1, s.z/2-d
        world.addObjectLine "KikiWire(KikiFace.NY, 10)", s.x/2-d+1, s.y-1, s.z/2+d, s.x/2+d, s.y-1, s.z/2+d
        
        world.addObjectAtPos(KikiWire(KikiFace.NY, 5),  s.x/2-d, s.y-1, s.z/2+1)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 5),  s.x/2-d, s.y-1, s.z/2-1)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 13), s.x/2-d, s.y-1, s.z/2)
        
        world.addObjectAtPos(KikiWire(KikiFace.NY, 5),  s.x/2+d, s.y-1, s.z/2+1)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 5),  s.x/2+d, s.y-1, s.z/2-1)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 7),  s.x/2+d, s.y-1, s.z/2)
        
        # corners of wire square
        world.addObjectAtPos(KikiWire(KikiFace.NY, 3),  s.x/2-d, s.y-1, s.z/2-d)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 6),  s.x/2-d, s.y-1, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 12), s.x/2+d, s.y-1, s.z/2+d)
        world.addObjectAtPos(KikiWire(KikiFace.NY, 9),  s.x/2+d, s.y-1, s.z/2-d)
        
        world.addObjectLine "KikiWire(KikiFace.NY, 10)", 0, s.y-1, s.z/2, s.x/2-d, s.y-1, s.z/2
        world.addObjectLine "KikiWire(KikiFace.NY, 10)", s.x/2+d+1, s.y-1, s.z/2, s.x, s.y-1, s.z/2
        
        # wall wire lines
        world.addObjectLine "KikiWire(KikiFace.PX, 5)",      0, 0, s.z/2,     0, s.y, s.z/2
        world.addObjectLine "KikiWire(KikiFace.NX, 5)",  s.x-1, 0, s.z/2, s.x-1, s.y, s.z/2
        