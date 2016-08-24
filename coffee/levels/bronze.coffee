
#   0000000    00000000    0000000   000   000  0000000  00000000
#   000   000  000   000  000   000  0000  000     000   000     
#   0000000    0000000    000   000  000 0 000    000    0000000 
#   000   000  000   000  000   000  000  0000   000     000     
#   0000000    000   000   0000000   000   000  0000000  00000000

module.exports = 
    name:       'bronze'
    scheme:     "bronze"
    size:       [9,6,9]
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
    player:     
        coordinates: [4,0,5]
        orientation: minusYupZ
                
    exits:      [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->
        s = world.size
        d = 2
        {MotorCylinder, MotorGear, Face, Generator, Wire, Gear} = require '../items'
        world.addObjectAtPos(new MotorCylinder(Face.Y),    s.x/2, 1,      s.z/2)
        world.addObjectAtPos(new MotorGear(Face.Y),        s.x/2, 0,      s.z/2)
        
        world.addObjectAtPos(new Gear(Face.Y),             s.x/2-1, s.y-1,  s.z/2-1)
        world.addObjectAtPos(new Generator(Face.Y),        s.x/2+1, s.y-1,  s.z/2-1)
                                       
        world.addObjectAtPos('Bomb',                        s.x/2-1, s.y-1,  s.z/2+1)
        
        world.addObjectAtPos('WireStone',                   s.x/2,   s.y-1,  s.z/2)
        world.addObjectAtPos('WireStone',                   s.x/2+1, s.y-2,  s.z/2)
        world.addObjectAtPos('WireStone',                   s.x/2-1, s.y-2,  s.z/2)
        
        # floor wire square
        world.addObjectLine "new Wire(Face.Y, 10)", s.x/2-d+1, 0, s.z/2-d, s.x/2+d, 0, s.z/2-d
        world.addObjectLine "new Wire(Face.Y, 10)", s.x/2-d+1, 0, s.z/2+d, s.x/2+d, 0, s.z/2+d
        
        world.addObjectAtPos(new Wire(Face.Y, 5),  s.x/2-d, 0, s.z/2+1)
        world.addObjectAtPos(new Wire(Face.Y, 5),  s.x/2-d, 0, s.z/2-1)
        world.addObjectAtPos(new Wire(Face.Y, 13), s.x/2-d, 0, s.z/2)
        
        world.addObjectAtPos(new Wire(Face.Y, 5),  s.x/2+d, 0, s.z/2+1)
        world.addObjectAtPos(new Wire(Face.Y, 5),  s.x/2+d, 0, s.z/2-1)
        world.addObjectAtPos(new Wire(Face.Y, 7),  s.x/2+d, 0, s.z/2)
        
        # corners of wire square
        world.addObjectAtPos(new Wire(Face.Y, 6),  s.x/2-d, 0, s.z/2-d)
        world.addObjectAtPos(new Wire(Face.Y, 3),  s.x/2-d, 0, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.Y, 9),  s.x/2+d, 0, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.Y, 12), s.x/2+d, 0, s.z/2-d)
        
        world.addObjectLine "new Wire(Face.Y, 10)", 0, 0, s.z/2,         s.x/2-d, 0, s.z/2
        world.addObjectLine "new Wire(Face.Y, 10)", s.x/2+d+1, 0, s.z/2, s.x, 0, s.z/2
        
        # ceiling wire square
        world.addObjectLine "new Wire(Face.NY, 10)", s.x/2-d+1, s.y-1, s.z/2-d, s.x/2+d, s.y-1, s.z/2-d
        world.addObjectLine "new Wire(Face.NY, 10)", s.x/2-d+1, s.y-1, s.z/2+d, s.x/2+d, s.y-1, s.z/2+d
        
        world.addObjectAtPos(new Wire(Face.NY, 5),  s.x/2-d, s.y-1, s.z/2+1)
        world.addObjectAtPos(new Wire(Face.NY, 5),  s.x/2-d, s.y-1, s.z/2-1)
        world.addObjectAtPos(new Wire(Face.NY, 13), s.x/2-d, s.y-1, s.z/2)
        
        world.addObjectAtPos(new Wire(Face.NY, 5),  s.x/2+d, s.y-1, s.z/2+1)
        world.addObjectAtPos(new Wire(Face.NY, 5),  s.x/2+d, s.y-1, s.z/2-1)
        world.addObjectAtPos(new Wire(Face.NY, 7),  s.x/2+d, s.y-1, s.z/2)
        
        # corners of wire square
        world.addObjectAtPos(new Wire(Face.NY, 3),  s.x/2-d, s.y-1, s.z/2-d)
        world.addObjectAtPos(new Wire(Face.NY, 6),  s.x/2-d, s.y-1, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.NY, 12), s.x/2+d, s.y-1, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.NY, 9),  s.x/2+d, s.y-1, s.z/2-d)
        
        world.addObjectLine "new Wire(Face.NY, 10)", 0, s.y-1, s.z/2, s.x/2-d, s.y-1, s.z/2
        world.addObjectLine "new Wire(Face.NY, 10)", s.x/2+d+1, s.y-1, s.z/2, s.x, s.y-1, s.z/2
        
        # wall wire lines
        world.addObjectLine "new Wire(Face.X, 5)",      0, 0, s.z/2,     0, s.y, s.z/2
        world.addObjectLine "new Wire(Face.NX, 5)",  s.x-1, 0, s.z/2, s.x-1, s.y, s.z/2
        