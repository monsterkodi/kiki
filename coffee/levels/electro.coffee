
#   00000000  000      00000000   0000000  000000000  00000000    0000000 
#   000       000      000       000          000     000   000  000   000
#   0000000   000      0000000   000          000     0000000    000   000
#   000       000      000       000          000     000   000  000   000
#   00000000  0000000  00000000   0000000     000     000   000   0000000 
    
module.exports =
    name:       "electro"
    scheme:     "metal"
    size:       [9,7,9]
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
        {Gear, Generator, MotorCylinder, MotorGear, Wire, Face} = require '../items' 
        world.addObjectLine('WireStone', world.decenter(-d, s.y/2, 0), world.decenter(-d, 0, 0))
        world.addObjectLine('WireStone', world.decenter( d, s.y/2, 0), world.decenter( d, 0, 0))
        world.addObjectLine('WireStone', world.decenter( d, 0, 0),     world.decenter( 0, 0, 0))
        world.addObjectLine('WireStone', world.decenter(-d, 0, 0),     world.decenter( 0, 0, 0))
        
        world.addObjectAtPos(new Gear(Face.Y), s.x/2-1, 0, s.z/2-1)
        
        world.addObjectAtPos(new Generator(Face.Y), s.x/2+1, 0, s.z/2+1)
        world.addObjectAtPos(new MotorCylinder(Face.Y), s.x/2, 1, s.z/2)
        world.addObjectAtPos(new MotorGear(Face.Y), s.x/2, 0, s.z/2)
        
        # floor wire square
        world.addObjectLine('new Wire(Face.Y, 10)',   s.x/2-d+1, 0, s.z/2-d, s.x/2+d, 0, s.z/2-d)
        world.addObjectLine('new Wire(Face.Y, 10)',   s.x/2-d+1, 0, s.z/2+d, s.x/2+d, 0, s.z/2+d)
        world.addObjectLine('new Wire(Face.Y, 5)',    s.x/2-d, 0, s.z/2-d+1, s.x/2-d, 0, s.z/2+d)
        world.addObjectLine('new Wire(Face.Y, 5)',    s.x/2+d, 0, s.z/2-d+1, s.x/2+d, 0, s.z/2+d)
        # corners of wire square
        world.addObjectAtPos(new Wire(Face.Y, 6),   s.x/2-d, 0, s.z/2-d)
        world.addObjectAtPos(new Wire(Face.Y, 3),   s.x/2-d, 0, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.Y, 9),   s.x/2+d, 0, s.z/2+d)
        world.addObjectAtPos(new Wire(Face.Y, 12),  s.x/2+d, 0, s.z/2-d)
        
        world.addObjectLine('new Wire(Face.X, 5)',    0, 0, s.z/2,     0, s.y, s.z/2)
        world.addObjectLine('new Wire(Face.NX, 5)',   s.x-1, 0, s.z/2, s.x-1, s.y, s.z/2)
        world.addObjectLine('new Wire(Face.NY, 10)',  0, s.y-1, s.z/2, s.x/2-d, s.y-1, s.z/2)
        world.addObjectLine('new Wire(Face.NY, 10)',  s.x-d, s.y-1, s.z/2, s.x, s.y-1, s.z/2)
        world.addObjectLine('new Wire(Face.Y, 10)',   0, 0, s.z/2, s.x/2-d, 0, s.z/2)
        world.addObjectLine('new Wire(Face.Y, 10)',   s.x-d, 0, s.z/2, s.x, 0, s.z/2)
        world.addObjectAtPos(new Wire(Face.Y, 13),  s.x/2-d, 0, s.z/2)
        world.addObjectAtPos(new Wire(Face.Y, 7),   s.x/2+d, 0, s.z/2)
        