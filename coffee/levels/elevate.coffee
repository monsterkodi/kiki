
#   00000000  000      00000000  000   000   0000000   000000000  00000000
#   000       000      000       000   000  000   000     000     000     
#   0000000   000      0000000    000 000   000000000     000     0000000 
#   000       000      000          000     000   000     000     000     
#   00000000  0000000  00000000      0      000   000     000     00000000

module.exports =
    name:       "elevate"
    scheme:     "bronze_scheme"
    size:       [9,5,7]
    intro:      "elevate"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                    
                to activate the exit,
                feed it with electricity

                use the bombs
                to elevate the gears

                and the generator

                the bombs will detonate
                if you shoot them
                """
    player:   position: [3,-2,0]
    exits:    [
        name:         "exit"
        active:       0
        position:     2,-2,0
    ]
    create: ->

        s = world.size
        {MotorCylinder, MotorGear, Gear, Wire} = require '../items'
        world.addObjectAtPos(new MotorGear(Face.NY), s.x/2-3, s.y-1, s.z/2)
        world.addObjectAtPos(new MotorCylinder(Face.NY), s.x/2-3, s.y-2, s.z/2)
        world.addObjectAtPos(new Generator (Face.NY), s.x/2+2, 1, s.z/2-1)
        world.addObjectAtPos(new Gear(Face.NY), s.x/2+1, 1, s.z/2+1)
        world.addObjectAtPos(new Gear(Face.NY), s.x/2, 1, s.z/2-1)
        world.addObjectAtPos(new Gear(Face.NY), s.x/2-1, 1, s.z/2+1)
        world.addObjectAtPos(new Gear(Face.NY), s.x/2-2, 1, s.z/2-1)
        
        world.addObjectLine(new Wire(Face.NY, Wire.VERTICAL), s.x/2+2, s.y-1, 0, s.x/2+2, s.y-1, s.z)
        world.addObjectLine(new Wire(Face.Y, Wire.VERTICAL), s.x/2+2, 0, 0,     s.x/2+2, 0, s.z)
        world.addObjectLine(new Wire(Face.Z, Wire.VERTICAL), s.x/2+2, 0, 0,     s.x/2+2, s.y, 0)
        world.addObjectLine(new Wire(Face.NZ, Wire.VERTICAL), s.x/2+2, 0, s.z-1, s.x/2+2, s.y, s.z-1)
        
        world.addObjectAtPos('Bomb', s.x/2+2, 0, s.z/2-1)
        world.addObjectAtPos('Bomb', s.x/2+1, 0, s.z/2+1)
        world.addObjectAtPos('Bomb', s.x/2,   0, s.z/2-1)
        world.addObjectAtPos('Bomb', s.x/2-1, 0, s.z/2+1)
        world.addObjectAtPos('Bomb', s.x/2-2, 0, s.z/2-1)
        