
#   00     00   0000000    0000000  000   000  000  000   000  00000000
#   000   000  000   000  000       000   000  000  0000  000  000     
#   000000000  000000000  000       000000000  000  000 0 000  0000000 
#   000 0 000  000   000  000       000   000  000  000  0000  000     
#   000   000  000   000   0000000  000   000  000  000   000  00000000

module.exports =
    name:       "machine"
    deisgn:     'Michael Abel'
    scheme:     "tron_scheme"
    size:       [5,5,9]
    intro:      "machine"
    help:       "$scale(1.5)mission:\nactivate the exit!"
    player:     
        position:     [0,0,0]
        orientation:   roty270
    exits:      [
        name:         "exit"
        active:       0
        coordinates:  [1,2,8]
    ]
    create: ->
        s = world.size
        {Gear, Generator, MotorCylinder, MotorGear, Face} = require '../items'
        
        world.addObjectAtPos( new MotorGear(Face.X), 0,2,4)
        world.addObjectAtPos('Wall', 0,2,3)
        world.addObjectAtPos('Wall', 0,2,5)
        world.addObjectAtPos( new MotorCylinder(Face.X), 1,2,4)
           
        world.addObjectAtPos('WireStone', 0,2,6)
   
        for i in [1,3,5,7]
            world.addObjectAtPos('Wall', 4,0,i)
            world.addObjectAtPos('Wall', 4,4,i)
            world.addObjectAtPos('Wall', 0,0,i)
            world.addObjectAtPos('Wall', 0,4,i)
        for i in [2,4,6]
            gear = new Gear Face.X 
            world.addObjectAtPos(gear, 0,1,i)
            if i == 4
                gear.setActive true 
            gear = new Gear Face.X 
            world.addObjectAtPos gear, 0,3,i 
            if i == 4
                gear.setActive true 
       
        world.addObjectAtPos(new Generator(Face.X), 0,2,2)
    
        