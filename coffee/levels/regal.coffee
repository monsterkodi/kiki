
#   00000000   00000000   0000000    0000000   000    
#   000   000  000       000        000   000  000    
#   0000000    0000000   000  0000  000000000  000    
#   000   000  000       000   000  000   000  000    
#   000   000  00000000   0000000   000   000  0000000

module.exports =
    name:       "regal"
    scheme:     "bronze"
    size:       [7,3,9]
    help:       "$scale(1.5)mission:\nactivate the exit!"
    player:     
        coordinates:    [3,2,4]
        orientation:    XdownY
    exits:      [
        name:         "exit"
        active:       0
        position:     [0,0,4]
    ]
    create: ->

        [sx, sy, sz] = [7,3,9]
        {Gear, Generator, MotorCylinder, MotorGear, Face} = require '../items'      
        for z in [-3...5]
            
            world.addObjectAtPos 'Wall', world.decenter -sx/2+1, 0, z
            world.addObjectAtPos 'Wall', world.decenter  sx/2, 0, z
            
            if z
                world.addObjectAtPos 'Wall', world.decenter -sx/2+2, 0, z
                world.addObjectAtPos 'Wall', world.decenter  sx/2-1, 0, z
                if z != 4 and z != -4
                    world.addObjectAtPos 'Wall', world.decenter 0, -sy/2+1, z
                if z != 1 and z != -1
                    world.addObjectAtPos 'Wall', world.decenter 0,  sy/2, z
            
            
        for z in [-3, -1, 1, 3]
            world.addObjectAtPos new Gear(Face.Y), world.decenter -sx/2+1, 1, z
            
        for z in [-3, 3]    
            world.addObjectAtPos new Gear(Face.Y), world.decenter  sx/2, 1, z
            
        for z in [-1, 1]    
            world.addObjectAtPos new Generator(Face.Y),      world.decenter sx/2, 1, z
            world.addObjectAtPos new MotorGear(Face.Y),      world.decenter 0, 0, z
            world.addObjectAtPos new MotorCylinder(Face.Y),  world.decenter 0, 1, z
        
        world.addObjectAtPos 'WireStone', world.decenter -sx/2+2, 1, 0
        world.addObjectAtPos 'WireStone', world.decenter  sx/2-1, 1, 0
        