# level design by Michael Abel

module.exports =

    name:       "nice"
    scheme:     "tron_scheme"
    size:       [11,11,11]
    intro:      "nice"
    help:       "$scale(1.5)mission:\nget to the exit!"
    player:     position: [2,-1,0]
    exits:      [
        name:         "exit"
        active:       1
        position:     [0,0,0]
    ]
    create: ->
        
        supercube = (point=[5,5,5],size=2,obj=KikiWall) ->
            p=point
            s=size
            world.addObjectPoly(obj,[[p[0]+s,p[1]+s,p[2]],
                            [p[0]+s,p[1]-s,p[2]],
                            [p[0]-s,p[1]-s,p[2]],
                            [p[0]-s,p[1]+s,p[2]] ])
            world.addObjectPoly(obj,[[p[0]+s,p[1],p[2]+s],
                            [p[0]+s,p[1],p[2]-s],
                            [p[0]-s,p[1],p[2]-s],
                            [p[0]-s,p[1],p[2]+s] ])
            world.addObjectPoly(obj,[[p[0],p[1]+s,p[2]+s],
                            [p[0],p[1]+s,p[2]-s],
                            [p[0],p[1]-s,p[2]-s],
                            [p[0],p[1]-s,p[2]+s] ])
                
        s = world.size
        world.addObjectLine(KikiWall, 1,1,1, 9,9,9)
        world.addObjectLine(KikiWall, 1,1,9, 9,9,1)
        world.addObjectLine(KikiWall, 1,9,1, 9,1,9)
        world.addObjectLine(KikiWall, 9,1,1, 1,9,9)
        world.deleteObject(world.getOccupantAtPos(world.decenter(0,0,0)))
        supercube(point=[5,5,5],size=5,obj=KikiWall)
        supercube(point=[5,5,5],size=3,obj=KikiStone)
            