
#    0000000  000000000  00000000    0000000   000   000   0000000   00000000
#   000          000     000   000  000   000  0000  000  000        000     
#   0000000      000     0000000    000000000  000 0 000  000  0000  0000000 
#        000     000     000   000  000   000  000  0000  000   000  000     
#   0000000      000     000   000  000   000  000   000   0000000   00000000

module.exports = 
    name:       "strange" 
    deisgn:     'Michael Abel'
    scheme:     "default"
    size:       [9,9,9]    
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
        position:   [1,2,0]
    exits:    [
           name:         "exit"
           active:       0
           position:     [0,0,-2]
    ]
    create: ->
        s = world.size
        d = 2
        {MotorGear, MotorCylinder, Generator, Face} = require '../items'
        world.addObjectAtPos 'Bomb', world.decenter 0, 0, 0
       
        world.addObjectAtPos 'WireStone', world.decenter  1, 0, 0
        world.addObjectAtPos 'WireStone', world.decenter  0, 1, 0
        world.addObjectAtPos 'WireStone', world.decenter -1, 0, 0
        world.addObjectAtPos 'WireStone', world.decenter  0, -1, 0
       
        world.addObjectAtPos 'Bomb',  1, 1, d
        world.addObjectAtPos 'Bomb',  s.x-2, s.y-2, d
        world.addObjectAtPos 'Bomb',  s.x-2, 1, d
        world.addObjectAtPos 'Bomb',  1, s.y-2, d
       
        d = s.z-2
       
        world.addObjectAtPos 'Bomb',  1, 1, d
        world.addObjectAtPos 'Bomb',  s.x-2, s.y-2, d
        world.addObjectAtPos 'Bomb',  s.x-2, 1, d
        world.addObjectAtPos 'Bomb',  1, s.y-2, d
       
        world.addObjectAtPos 'Bomb',  s.x/2, s.y/2, d
        world.addObjectAtPos 'Bomb',  s.x/2, 1, d
        world.addObjectAtPos 'Bomb',  1, s.y/2, d
        world.addObjectAtPos 'Bomb',  s.x/2, s.y-2, d
        world.addObjectAtPos 'Bomb',  s.x-2, s.y/2, d
       
        d = 2
       
        world.addObjectAtPos 'Stone', s.x/2-1, 1, d
        world.addObjectAtPos 'Stone', s.x/2+1, 1, d
       
        world.addObjectAtPos 'Stone', s.x/2-1, s.y-2, d
        world.addObjectAtPos 'Stone', s.x/2+1, s.y-2, d
       
        world.addObjectAtPos 'Stone', 1, s.y/2-1, d
        world.addObjectAtPos 'Stone', 1, s.y/2+1, d
       
        world.addObjectAtPos 'Stone', s.x-2, s.y/2-1, d
        world.addObjectAtPos 'Stone', s.x-2, s.y/2+1, d
        
        world.addObjectAtPos new MotorGear(Face.NZ),  s.x/2+1, s.y/2, s.z-1
        world.addObjectAtPos new MotorCylinder(Face.NZ),  s.x/2+1, s.y/2, s.z-2
        world.addObjectAtPos new Generator(Face.NZ),  s.x/2, s.y/2, s.z/2+1
        world.addObjectLine  "new Wire(Face.NY, Wire.VERTICAL)", s.x/2, s.y-1, 0,  s.x/2, s.y-1, s.z
        world.addObjectLine  "new Wire(Face.Y,  Wire.VERTICAL)", s.x/2, 0, 0,  s.x/2, 0, s.z
        world.addObjectLine  "new Wire(Face.Z,  Wire.VERTICAL)", s.x/2, 0, 0,  s.x/2, s.y, 0
        world.addObjectLine  "new Wire(Face.NZ, Wire.VERTICAL)", s.x/2, 0, s.z-1,  s.x/2, s.y, s.z-1

        