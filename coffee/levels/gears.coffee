module.exports =
    name:       "gears"
    scheme:     "blue_scheme"
    size:       [9,9,9]
    intro:      "gears"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity:
                    
                connect the generator
                with the motor
                and close the circuit
                with the wire stones
                """
    player:     position:  [0,0,0]
    exits:      [
        name:         "exit"
        active:       0
        position:     [0,4,0]
    ]
    create: ->
        s = world.size
        
        {Wire,Face,Generator,MotorCylinder,MotorGear,Gear} = require '../items'
        
        world.addObjectAtPos 'WireStone', world.decenter -1, 0, 0
        world.addObjectAtPos 'WireStone', world.decenter  1, 0, 0
        world.addObjectAtPos 'WireStone', world.decenter  0,-1, 0
        world.addObjectAtPos 'WireStone', world.decenter  0, 1, 0
        world.addObjectAtPos 'WireStone', world.decenter  0, 0,-1
        world.addObjectAtPos 'WireStone', world.decenter  0, 0, 1
        
        world.addObjectAtPos new Gear(Face.Y), s.x/2-1, 0, s.z/2-1
        world.addObjectAtPos new Gear(Face.Y), s.x/2+1, 0, s.z/2-1
        world.addObjectAtPos new Gear(Face.Y), s.x/2-1, 0, s.z/2+1
        
        d = 3
        world.addObjectAtPos new Generator(Face.Y), s.x/2+1, 0, s.z/2+1
        world.addObjectAtPos new MotorCylinder(Face.Y), s.x/2, 1, s.z/2
        world.addObjectAtPos new MotorGear(Face.Y), s.x/2, 0, s.z/2
        
        # floor wire square
        world.addObjectLine 'new Wire(Face.Y, 10)', s.x/2-d+1, 0, s.z/2-d, s.x/2+d, 0, s.z/2-d
        world.addObjectLine 'new Wire(Face.Y, 10)', s.x/2-d+1, 0, s.z/2+d, s.x/2+d, 0, s.z/2+d
        world.addObjectLine 'new Wire(Face.Y, 5)',  s.x/2-d, 0, s.z/2-d+1, s.x/2-d, 0, s.z/2+d
        world.addObjectLine 'new Wire(Face.Y, 5)',  s.x/2+d, 0, s.z/2-d+1, s.x/2+d, 0, s.z/2+d
        # corners of wire square
        world.addObjectAtPos new Wire(Face.Y, 6),  s.x/2-d, 0, s.z/2-d
        world.addObjectAtPos new Wire(Face.Y, 3),  s.x/2-d, 0, s.z/2+d
        world.addObjectAtPos new Wire(Face.Y, 9),  s.x/2+d, 0, s.z/2+d
        world.addObjectAtPos new Wire(Face.Y, 12), s.x/2+d, 0, s.z/2-d
        
        world.addObjectAtPos new Wire(Face.X, 1), 0, 0, s.z/2
        world.addObjectAtPos new Wire(Face.NX, 1), s.x-1, 0, s.z/2
        
        world.addObjectLine 'new Wire(Face.X, 5)',      0, 1, s.z/2,     0, s.y, s.z/2
        world.addObjectLine 'new Wire(Face.NX, 5)',  s.x-1, 1, s.z/2, s.x-1, s.y, s.z/2
        world.addObjectLine 'new Wire(Face.NY, 10)', 0, s.y-1, s.z/2, s.x, s.y-1, s.z/2
        