
#    0000000  00000000   000  00000000    0000000   000    
#   000       000   000  000  000   000  000   000  000    
#   0000000   00000000   000  0000000    000000000  000    
#        000  000        000  000   000  000   000  000    
#   0000000   000        000  000   000  000   000  0000000

module.exports =
    name:       "spiral"
    design:     "Owen Hay"
    scheme:     "zen"
    size:       [5,25,5]
    help:       "Down the Rabbit Hole"
    player:     
        coordinates:     [0,20,2]
        orientation:     minusYupX
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,11,0]
    ]
    create: ->

        s = world.size
        {Gear,Generator,MotorCylinder,MotorGear,Face} = require '../items'
        
        for y in [ -7, -3, 1, 5]
            x = 1
            world.addObjectPoly 'Stone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), ]
        
        for y in [-9, -5, -1, 3]
            x = 1
            world.addObjectPoly 'Stone', [world.decenter(x, y, x), world.decenter(x, y, -x), world.decenter(-x, y, -x), ]
        
        for y in [12, 11]
            x = 2
            world.addObjectPoly 'WireStone', [world.decenter(-x, y, -x), world.decenter(-x, y, x), world.decenter(x, y, x), world.decenter(x, y, -x)]
            
        world.addObjectAtPos new Gear(Face.NY),           world.decenter 0, -10, 0  
        world.addObjectAtPos new Generator(Face.NY),      world.decenter -1, 12, 0
        world.addObjectAtPos new Generator(Face.NY),      world.decenter -1, 11, 0
                                                                         
        world.addObjectAtPos new MotorCylinder(Face.NY),  world.decenter 1, 11, 0
        world.addObjectAtPos new MotorGear(Face.NY),      world.decenter 1, 12, 0
        
        world.addObjectAtPos 'WireStone',  world.decenter 0, 11, 1
        world.addObjectAtPos 'WireStone',  world.decenter 0, 12, 1
        world.addObjectAtPos 'WireStone',  world.decenter 0, 11, -1
        world.addObjectAtPos 'WireStone',  world.decenter 0, 12, -1
        