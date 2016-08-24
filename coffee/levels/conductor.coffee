
#    0000000   0000000   000   000  0000000    000   000   0000000  000000000   0000000   00000000 
#   000       000   000  0000  000  000   000  000   000  000          000     000   000  000   000
#   000       000   000  000 0 000  000   000  000   000  000          000     000   000  0000000  
#   000       000   000  000  0000  000   000  000   000  000          000     000   000  000   000
#    0000000   0000000   000   000  0000000     0000000    0000000     000      0000000   000   000
    
module.exports =
    name:       "conductor"
    deisgn:     "Michael Abel"
    scheme:     "default"
    size:       [11,9,11]
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity:
                    
                connect the generator
                with the motor
                
                and place a powered wirestone
                next to the exit
                """
    player:
        coordinates:  [6,2,0]
        orientation:  XupZ
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,4]
    ],
    create: ->
        
        {MotorCylinder, MotorGear, Generator, Wire, WireStone, Face} = require '../items'
        WireWall = (c , x,y,z) ->
            if world.isUnoccupiedPos x,y,z
                world.addObjectAtPos 'Wall', x,y,z
                world.addObjectAtPos new Wire(Face.X,  c), x+1, y  , z  
                world.addObjectAtPos new Wire(Face.NX, c), x-1, y  , z  
                world.addObjectAtPos new Wire(Face.Y,  c), x  , y+1, z  
                world.addObjectAtPos new Wire(Face.NY, c), x  , y-1, z  
                world.addObjectAtPos new Wire(Face.Z,  c), x  , y  , z+1
                world.addObjectAtPos new Wire(Face.NZ, c), x  , y  , z-1
            
        for h in [2,4,6]
            world.addObjectLine 'Wall', 5,2,h, 5,6,h
            world.addObjectAtPos 'WireStone', 5,1,h
            world.addObjectAtPos 'WireStone', 5,6,h
    
        world.addObjectLine 'new Wire(Face.NZ, 5)', 5,2,1, 5,6,1
        world.addObjectLine 'new Wire(Face.Z, 5)', 5,2,3, 5,6,3
        world.addObjectAtPos new Wire(Face.NY, 5), 5,1,2
        world.addObjectAtPos new Wire(Face.Y,  5), 5,6,2
    
        world.addObjectAtPos new MotorGear(Face.Z), 5,0,0
        world.addObjectAtPos new MotorCylinder(Face.Z),  5,0,1
        world.addObjectAtPos new MotorCylinder(Face.NX), 4,0,0
        world.addObjectAtPos new MotorCylinder(Face.X),  6,0,0
        
        g = new Generator Face.Z 
        world.addObjectAtPos(g, 5,1,0)
    
        world.addObjectAtPos('WireStone', 5,2,0)
        world.addObjectAtPos('WireStone', 5,2,1)
         
        world.addObjectAtPos('WireStone', 5,5,3)
        world.addObjectAtPos('WireStone', 5,5,5)
        
        WireWall(15,5,4,8)
    
        world.addObjectAtPos('Wall', 0,0,0)
        world.addObjectAtPos('Wall', 10,0,0)
        world.addObjectAtPos('Wall', 10,8,0)
        world.addObjectAtPos('Wall', 0,8,0)
        
        g.setActive true
            
    