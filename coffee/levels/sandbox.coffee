
#    0000000   0000000   000   000  0000000    0000000     0000000   000   000
#   000       000   000  0000  000  000   000  000   000  000   000   000 000 
#   0000000   000000000  000 0 000  000   000  0000000    000   000    00000  
#        000  000   000  000  0000  000   000  000   000  000   000   000 000 
#   0000000   000   000  000   000  0000000    0000000     0000000   000   000

module.exports =    
    name:       "sandbox"
    design:     'Michael Abel'
    scheme:     "bronze_scheme"
    size:       [9,9,6]
    intro:      "sandbox"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                All you have to do
                is to put nine stones
                into the sandbox
                and shoot at the switch
                """
    player:     
        coordinates:  [4,6,2]
        orientation:  rotx90
    exits:    [
        name:         "exit"
        active:       0
        position:     [0,0,0]
    ]
    create: ->
        
        switched = ->
            unoccupied = false
            for i in [3...6]
                for j in [3...6]
                    if world.isUnoccupiedPos i,j,0
                        unoccupied=true
                
            world.toggle "exit" if not unoccupied
            
        Switch = require '../switch'    
        swtch = new Switch
        swtch.getEventWithName("switched").addAction world.continuous switched
           
        world.addObjectAtPos swtch , 0,5,0
        world.addObjectPoly 'Wall', [ [2,2,0], [2,6,0], [6,6,0], [6,2,0] ], 1
        
        #inside    
        world.addObjectAtPos 'Stone', 3,4,2
        world.addObjectAtPos 'Stone', 3,5,1
        world.addObjectAtPos 'Stone', 5,3,1
        world.addObjectAtPos 'Stone', 5,4,2
        #border
        world.addObjectAtPos 'Stone', 3,6,1
        world.addObjectAtPos 'Stone', 4,6,1
        world.addObjectAtPos 'Stone', 3,2,1
        world.addObjectAtPos 'Stone', 5,2,1
        world.addObjectAtPos 'Stone', 6,4,1
        world.addObjectAtPos 'Stone', 6,3,1
        #outside
        world.addObjectAtPos 'Stone', 5,1,0
        world.addObjectAtPos 'Stone', 1,7,0
        