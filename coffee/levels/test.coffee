
#   000000000  00000000   0000000  000000000
#      000     000       000          000   
#      000     0000000   0000000      000   
#      000     000            000     000   
#      000     00000000  0000000      000   

module.exports =
    name:       "test"
    size:       [11,11,11]
    player:     
        coordinates: [5,5,1]
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->

        s = world.size
        {Gear,Generator,MotorCylinder,MotorGear,Face,Wall,Wire,WireStone,Stone} = require '../items'
        
        # world.addObjectAtPos new Wire(Face.Z,  Wire.ALL), 7, 5, 0
        # world.addObjectAtPos new Wire(Face.NZ, Wire.ALL), 7, 5, 0
        # world.addObjectAtPos new Wire(Face.Y,  Wire.ALL), 7, 5, 0
        # world.addObjectAtPos new Wire(Face.NY, Wire.ALL), 7, 5, 0
        # world.addObjectAtPos new Wire(Face.X,  Wire.ALL), 7, 5, 0
        # world.addObjectAtPos new Wire(Face.NX, Wire.ALL), 7, 5, 0
        
        world.addObjectAtPos new Generator(Face.Z), 5, 7, 0
        world.addObjectAtPos new Stone(), 6, 7, 0
        world.addObjectAtPos new Stone(), 6, 7, 2
        world.addObjectAtPos new WireStone(), 6, 7, 1
        world.addObjectAtPos new WireStone(), 3, 7, 1

        world.addObjectAtPos new MotorCylinder(Face.Z), 4, 5, 1
        world.addObjectAtPos new MotorGear(Face.Z), 4, 5, 0
        # world.addObjectAtPos new Gear(Face.Z), 6, 5, 0
        # world.addObjectAtPos new Gear(Face.Z), 5, 6, 0
        # world.addObjectAtPos new Gear(Face.Z), 5, 4, 0
        world.addObjectAtPos new Gear(Face.Z), 6, 6, 0
        world.addObjectAtPos new Gear(Face.Z), 4, 4, 0
        world.addObjectAtPos new Gear(Face.Z), 4, 6, 0
        world.addObjectAtPos new Gear(Face.Z), 6, 4, 0
        return

        world.addObjectAtPos new Gear(Face.NZ), 6, 5, 4
        world.addObjectAtPos new Gear(Face.NZ), 4, 5, 4
        world.addObjectAtPos new Gear(Face.NZ), 5, 6, 4
        world.addObjectAtPos new Gear(Face.NZ), 5, 4, 4
        
        world.addObjectAtPos new Gear(Face.NZ), 6, 6, 4
        world.addObjectAtPos new Gear(Face.NZ), 4, 4, 4
        world.addObjectAtPos new Gear(Face.NZ), 4, 6, 4
        world.addObjectAtPos new Gear(Face.NZ), 6, 4, 4
        
        world.addObjectAtPos new Gear(Face.NY), 6, 3, 2
        world.addObjectAtPos new Gear(Face.NY), 4, 3, 2
        world.addObjectAtPos new Gear(Face.NY), 5, 3, 3
        world.addObjectAtPos new Gear(Face.NY), 5, 3, 1
                                                 
        world.addObjectAtPos new Gear(Face.NY), 6, 3, 3
        world.addObjectAtPos new Gear(Face.NY), 4, 3, 1
        world.addObjectAtPos new Gear(Face.NY), 4, 3, 3
        world.addObjectAtPos new Gear(Face.NY), 6, 3, 1
        
        world.addObjectAtPos new Gear(Face.Y), 6, 7, 2
        world.addObjectAtPos new Gear(Face.Y), 4, 7, 2
        world.addObjectAtPos new Gear(Face.Y), 5, 7, 3
        world.addObjectAtPos new Gear(Face.Y), 5, 7, 1
                                                 
        world.addObjectAtPos new Gear(Face.Y), 6, 7, 3
        world.addObjectAtPos new Gear(Face.Y), 4, 7, 1
        world.addObjectAtPos new Gear(Face.Y), 4, 7, 3
        world.addObjectAtPos new Gear(Face.Y), 6, 7, 1

        world.addObjectAtPos new Gear(Face.X), 3, 6, 2
        world.addObjectAtPos new Gear(Face.X), 3, 4, 2
        world.addObjectAtPos new Gear(Face.X), 3, 5, 3
        world.addObjectAtPos new Gear(Face.X), 3, 5, 1
                                                
        world.addObjectAtPos new Gear(Face.X), 3, 6, 3
        world.addObjectAtPos new Gear(Face.X), 3, 4, 1
        world.addObjectAtPos new Gear(Face.X), 3, 4, 3
        world.addObjectAtPos new Gear(Face.X), 3, 6, 1
        
        world.addObjectAtPos new Gear(Face.NX), 7, 6, 2
        world.addObjectAtPos new Gear(Face.NX), 7, 4, 2
        world.addObjectAtPos new Gear(Face.NX), 7, 5, 3
        world.addObjectAtPos new Gear(Face.NX), 7, 5, 1
                                                  
        world.addObjectAtPos new Gear(Face.NX), 7, 6, 3
        world.addObjectAtPos new Gear(Face.NX), 7, 4, 1
        world.addObjectAtPos new Gear(Face.NX), 7, 4, 3
        world.addObjectAtPos new Gear(Face.NX), 7, 6, 1

