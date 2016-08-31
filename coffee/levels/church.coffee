
#    0000000  000   000  000   000  00000000    0000000  000   000
#   000       000   000  000   000  000   000  000       000   000
#   000       000000000  000   000  0000000    000       000000000
#   000       000   000  000   000  000   000  000       000   000
#    0000000  000   000   0000000   000   000   0000000  000   000

module.exports =
    name:       "church"
    scheme:     "bronze"
    size:       [5,7,5]
    help:       """
                to activate the exit,
                feed it with electricity:
                    
                connect the generator
                with the motor.
                
                place a wire stone
                next to the exit.
                """
    player:   
        coordinates: [2,1,1]
        orientation: minusYupZ
    exits:    [
        name:     "exit"
        active:   0
        position: [0,-1,0]
    ]
    create: ->
        s = world.size
        {Generator, MotorCylinder, MotorGear, Face} = require '../items'
        
        world.addObjectLine 'WireStone', 0, 0, 0, 0, s.y-2, 0
        world.addObjectLine 'WireStone', s.x-1, 0, 0, s.x-1, s.y-2, 0
        world.addObjectLine 'WireStone', s.x-1, 0, s.z-1, s.x-1, s.y-2, s.z-1
        world.addObjectLine 'WireStone', 0, 0, s.z-1, 0, s.y-2, s.z-1
        
        world.addObjectAtPos 'Bomb', s.x/2, s.y-2, s.z/2
        world.addObjectAtPos new Generator(Face.Y), s.x/2, s.y/2, s.z/2
        
        world.addObjectAtPos 'WireStone', 1,      s.y-2,  1
        world.addObjectAtPos 'WireStone', s.x-2,  s.y-2,  1
        world.addObjectAtPos 'WireStone', 1,      s.y-2,  s.z-2
        world.addObjectAtPos 'WireStone', s.x-2,  s.y-2,  s.z-2
        world.addObjectAtPos 'WireStone', s.x/2,  s.y-1,  s.z/2
        
        world.addObjectAtPos new MotorGear(Face.Y), s.x/2, 0, 0
        world.addObjectAtPos new MotorCylinder(Face.Y), s.x/2, 1, 0
