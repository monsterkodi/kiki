# level design by Michael Abel

module.exports =
    
    name:       "circuit"
    scheme:     "tron_scheme"
    size:       [9,9,9]
    intro:      "circuit"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity
                """
    player:
        coordinates:     [4,6,4]
        nostatus:         0
        orientation:      rot0
    exits:  [
        name:         "exit"
        active:       0
        coordinates:  [8,8,8]
    ]
    create: ->
        s=world.size
        mx=s.x/2
        my=s.y/2
        mz=s.z/2
        sx=s.x-1
        sy=s.y-1
        sz=s.z-1
     
        p=[ [ 0, 0, 0+1,  0, 0,mz,  0,my,mz, KikiFace.X,  KikiFace.X],
            [ 0,my,mz+1,  0,my,sz, mx,my,sz, KikiFace.X,  KikiFace.NZ],
            [mx,my-1,sz, mx, 0,sz, my, 0,mz, KikiFace.NZ, KikiFace.Y],
            [mx+1, 0,mz, sx, 0,mz, sx,my,mz, KikiFace.Y,  KikiFace.NX],
            [sx,my,mz-1, sx,my, 0, mx,my, 0, KikiFace.NX, KikiFace.Z],
            [mx,my+1, 0, mx,sy, 0, mx,sy,my, KikiFace.Z,  KikiFace.NY],
            [mx+1,sy,my, sx,sy,mz, sx,sy,sz, KikiFace.NY, KikiFace.NY],
            ]
        for k in p            
            stone= () -> KikiWire(k[3], 15)
            world.addObjectLine(stone,k[0],k[1])
            world.addObjectAtPos(KikiWire(k[3], 15), k[1]) # correct the last missing stone of the line
            
            stone= () ->KikiWire(k[4], 15)
            world.addObjectLine(stone,k[1],k[2])
            
        world.addObjectAtPos 'KikiWireStone', world.decenter(1,0,0)
        world.addObjectAtPos 'KikiWireStone', world.decenter(-1,0,0)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,1,0)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,-1,0)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,0,1)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,0,-1)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,0,2)
        world.addObjectAtPos 'KikiWireStone', world.decenter(0,0,-2)
        
        world.addObjectAtPos(KikiWire(KikiFace.X), 0,0,0)
        world.addObjectAtPos(KikiWire(KikiFace.Z), 0,0,0)
        world.addObjectAtPos(KikiWire(KikiFace.Z), 1,0,0)
        
        world.addObjectAtPos(KikiWire(KikiFace.NY), sx,sy,sz)
        
        world.addObjectAtPos(KikiMotorGear(KikiFace.Z), 2,0,0)
        world.addObjectAtPos(KikiMotorCylinder(KikiFace.Z), 2,0,1)
        g=KikiGenerator(KikiFace.Z)
        world.addObjectAtPos(g, mx,my,mz)
    