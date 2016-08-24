
#    0000000  000  00000000    0000000  000   000  000  000000000
#   000       000  000   000  000       000   000  000     000   
#   000       000  0000000    000       000   000  000     000   
#   000       000  000   000  000       000   000  000     000   
#    0000000  000  000   000   0000000   0000000   000     000   

module.exports =
    
    name:       "circuit"
    design:     'Michael Abel'
    scheme:     "tron"
    size:       [9,9,9]
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                to activate the exit
                feed it with electricity
                """
    player:
        coordinates:     [4,5,3]
        orientation:      YdownZ
    exits:  [
        name:         "exit"
        active:       0
        coordinates:  [8,8,8]
    ]
    create: ->
        s=world.size
        {MotorGear, MotorCylinder, Wire, Generator, Face} = require '../items'
        
        mx=s.x/2
        my=s.y/2
        mz=s.z/2
        sx=s.x-1
        sy=s.y-1
        sz=s.z-1
     
        p=[ [ [0, 0, 0+1],  [0, 0,mz],  [0,my,mz],  Face.X,  Face.X],
            [ [ 0,my,mz+1], [ 0,my,sz], [mx,my,sz], Face.X,  Face.NZ],
            [ [mx,my-1,sz], [mx, 0,sz], [my, 0,mz], Face.NZ, Face.Y],
            [ [mx+1, 0,mz], [sx, 0,mz], [sx,my,mz], Face.Y,  Face.NX],
            [ [sx,my,mz-1], [sx,my, 0], [mx,my, 0], Face.NX, Face.Z],
            [ [mx,my+1, 0], [mx,sy, 0], [mx,sy,my], Face.Z,  Face.NY],
            [ [mx+1,sy,my], [sx,sy,mz], [sx,sy,sz], Face.NY, Face.NY],
            ]
        for k in p            
            world.addObjectLine("new Wire(#{k[3]}, 15)", k[0], k[1])
            world.addObjectAtPos(new Wire(k[3], 15), k[1]) # correct the last missing stone of the line
            world.addObjectLine("new Wire(#{k[4]}, 15)", k[1], k[2])
            
        world.addObjectAtPos 'WireStone', world.decenter 1,0,0
        world.addObjectAtPos 'WireStone', world.decenter -1,0,0
        world.addObjectAtPos 'WireStone', world.decenter 0,1,0
        world.addObjectAtPos 'WireStone', world.decenter 0,-1,0
        world.addObjectAtPos 'WireStone', world.decenter 0,0,1
        world.addObjectAtPos 'WireStone', world.decenter 0,0,-1
        world.addObjectAtPos 'WireStone', world.decenter 0,0,2
        world.addObjectAtPos 'WireStone', world.decenter 0,0,-2
        
        world.addObjectAtPos(new Wire(Face.X), 0,0,0)
        world.addObjectAtPos(new Wire(Face.Z), 0,0,0)
        world.addObjectAtPos(new Wire(Face.Z), 1,0,0)
                              
        world.addObjectAtPos(new Wire(Face.NY), sx,sy,sz)
                             
        world.addObjectAtPos(new MotorGear(Face.Z), 2,0,0)
        world.addObjectAtPos(new MotorCylinder(Face.Z), 2,0,1)
        world.addObjectAtPos(new Generator(Face.Z), mx,my,mz)
    