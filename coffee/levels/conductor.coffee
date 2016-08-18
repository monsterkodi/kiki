# level design by Michael Abel
    
module.exports =
    name:       "conductor"
    scheme:     "default_scheme"
    size:       [11,9,11]
    intro:      "conductor"
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
        coordinates:  [3,0,3]
        nostatus:     0
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,4]
    ],
    create: ->
        
        KikiWireWall = (c , p) ->
            if world.isUnoccupiedPos(p.x,p.y,p.z)
                world.addObjectAtPos('KikiWall', p.x,p.y,p.z)
                world.addObjectAtPos(KikiWire(KikiFace.X,  c), p.x+1,p.y  ,p.z  )
                world.addObjectAtPos(KikiWire(KikiFace.NX, c), p.x-1,p.y  ,p.z  )
                world.addObjectAtPos(KikiWire(KikiFace.Y,  c), p.x  ,p.y+1,p.z  )
                world.addObjectAtPos(KikiWire(KikiFace.NY, c), p.x  ,p.y-1,p.z  )
                world.addObjectAtPos(KikiWire(KikiFace.Z,  c), p.x  ,p.y  ,p.z+1)
                world.addObjectAtPos(KikiWire(KikiFace.NZ, c), p.x  ,p.y  ,p.z-1)
            
        for h in [2,4,6]
            world.addObjectLine(KikiWall, 5,2,h, 5,6,h)
            world.addObjectAtPos('KikiWireStone', 5,1,h)
            world.addObjectAtPos('KikiWireStone', 5,6,h)
    
        wire_u= -> KikiWire(KikiFace.Z, 4+1 )
        wire_d= -> KikiWire(KikiFace.NZ, 4+1 )
        
        world.addObjectLine(wire_d, 5,2,1, 5,6,1)
        world.addObjectLine(wire_u, 5,2,3, 5,6,3)
        world.addObjectAtPos(       KikiWire(KikiFace.NY, 5), 5,1,2)
        world.addObjectAtPos(       KikiWire(KikiFace.Y,  5), 5,6,2)
    
        
        world.addObjectAtPos(KikiMotorGear(KikiFace.Z), 5,0,0)
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.Z),  5,0,1)
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.NX), 4,0,0)
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.X),  6,0,0)
        
        
        g = KikiGenerator(KikiFace.Z) #set to Active as last command in LevelS
        world.addObjectAtPos(g, 5,1,0)
    
        world.addObjectAtPos('KikiWireStone', 5,2,0)
        world.addObjectAtPos('KikiWireStone', 5,2,1)
         
        world.addObjectAtPos('KikiWireStone', 5,5,3)
        world.addObjectAtPos('KikiWireStone', 5,5,5)
        
        KikiWireWall(15, 5,4,8)
    
        world.addObjectAtPos('KikiWall', 0,0,0)
        world.addObjectAtPos('KikiWall', 10,0,0)
        world.addObjectAtPos('KikiWall', 10,8,0)
        world.addObjectAtPos('KikiWall', 0,8,0)
        
        g.setActive(True)
            
    