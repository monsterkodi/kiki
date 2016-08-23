
#   00     00   0000000   0000000  00000000
#   000   000  000   000     000   000     
#   000000000  000000000    000    0000000 
#   000 0 000  000   000   000     000     
#   000   000  000   000  0000000  00000000

module.exports =

    name:       "maze"
    deisgn:     'Michael Abel'
    scheme:     "default"
    size:       [4,4,4]
    help:       """
                $scale(1.5)mission:
                get to the exit!
                but don't get confused :)
                """
    player:   
        coordinates:     [3,0,0]
        nostatus:         0
        orientation:      rotz90
    exits:    [
        name:         "exit"
        active:       1
        coordinates:  [3,3,1] #absolute coord
    ]
    create: ->
        #level 0|  # |
        #       | #  | ^ y
        #       |   #| |
        #       | ##k|  -> x
            
        world.addObjectAtPos('Wall', 1,0,0)
        world.addObjectAtPos('Wall', 2,0,0)
        world.addObjectAtPos('Wall', 3,1,0)
        world.addObjectAtPos('Wall', 1,2,0)
        world.addObjectAtPos('Wall', 2,3,0)
           
       #level 1|# # |
       #       |# ##|
       #       |## #|
       #       |  # |
        world.addObjectAtPos('Wall', 2,0,1)
        world.addObjectAtPos('Wall', 0,1,1)
        world.addObjectAtPos('Wall', 1,1,1)
        world.addObjectAtPos('Wall', 3,1,1)
        world.addObjectAtPos('Wall', 0,2,1)
        world.addObjectAtPos('Wall', 2,2,1)
        world.addObjectAtPos('Wall', 3,2,1)
        world.addObjectAtPos('Wall', 0,3,1)
        world.addObjectAtPos('Wall', 2,3,1)
           
       #level 2| ###|
       #       |# ##|
       #       | #e#|
       #       |### |
        world.addObjectAtPos('Wall', 0,0,2)
        world.addObjectAtPos('Wall', 1,0,2)
        world.addObjectAtPos('Wall', 2,0,2)
        world.addObjectAtPos('Wall', 1,1,2)
        world.addObjectAtPos('Wall', 3,1,2)
        world.addObjectAtPos('Wall', 0,2,2)
        world.addObjectAtPos('Wall', 2,2,2)
        world.addObjectAtPos('Wall', 3,2,2)
        world.addObjectAtPos('Wall', 1,3,2)
        world.addObjectAtPos('Wall', 2,3,2)
        world.addObjectAtPos('Wall', 3,3,2)
           
       #level 3| #  |
       #       |  # |
       #       | ## |
       #       |    |
        world.addObjectAtPos('Wall', 1,1,3)
        world.addObjectAtPos('Wall', 2,1,3)
        world.addObjectAtPos('Wall', 2,2,3)
        world.addObjectAtPos('Wall', 1,3,3)
           
        world.addObjectAtPos('Light', 3,0,0)
            
        world.setCameraMode(world.CAMERA_INSIDE)
        