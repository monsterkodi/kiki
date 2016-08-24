
#   0000000    00000000   000  0000000     0000000   00000000
#   000   000  000   000  000  000   000  000        000     
#   0000000    0000000    000  000   000  000  0000  0000000 
#   000   000  000   000  000  000   000  000   000  000     
#   0000000    000   000  000  0000000     0000000   00000000

module.exports =
    name:       'bridge'
    scheme:     "red"
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
    player:     
        position: [0,-3,1]
    exits:    [
       name:         "exit"
       active:       0
       position:     [0,-1,0]
    ]
    create: ->
        s = world.size
        {Face,MotorCylinder,MotorGear,Generator} = require '../items'
        
        world.addObjectAtPos new MotorGear(Face.NY),           s.x/2-1, s.y-1, s.z/2
        world.addObjectAtPos new MotorCylinder(Face.NY),       s.x/2-1, s.y-2, s.z/2
        world.addObjectAtPos new Generator(Face.NY),           s.x/2+1, s.y-1, s.z/2
        world.addObjectLine  'new Wire(Face.NY, Wire.VERTICAL)', s.x/2, s.y-1, 0, s.x/2, s.y-1, s.z
        world.addObjectLine  'new Wire(Face.Y,  Wire.VERTICAL)', s.x/2, 0, 0,     s.x/2, 0, s.z
        world.addObjectLine  'new Wire(Face.Z,  Wire.VERTICAL)', s.x/2, 0, 0,     s.x/2, s.y, 0
        world.addObjectLine  'new Wire(Face.NZ, Wire.VERTICAL)', s.x/2, 0, s.z-1, s.x/2, s.y, s.z-1
        
        world.addObjectAtPos 'WireStone', s.x/2+3, 0, s.z/2
        world.addObjectAtPos 'WireStone', s.x/2-3, 0, s.z/2
        world.addObjectAtPos 'WireStone', s.x/2+2, 1, s.z/2
        world.addObjectAtPos 'WireStone', s.x/2-2, 1, s.z/2
        world.addObjectAtPos 'WireStone', s.x/2+1, 2, s.z/2
        world.addObjectAtPos 'WireStone', s.x/2-1, 2, s.z/2
