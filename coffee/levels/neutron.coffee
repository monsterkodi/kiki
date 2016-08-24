
#   000   000  00000000  000   000  000000000  00000000    0000000   000   000
#   0000  000  000       000   000     000     000   000  000   000  0000  000
#   000 0 000  0000000   000   000     000     0000000    000   000  000 0 000
#   000  0000  000       000   000     000     000   000  000   000  000  0000
#   000   000  00000000   0000000      000     000   000   0000000   000   000

module.exports = 
    name:       "neutron"
    design:     'Michael Abel'
    scheme:     "tron"
    size:       [11,11,11]
    help:       """ 
                $scale(1.5)mission:
                get to the exit!
                
                it looks simpler than it is.
                """
    player:      
        coordinates: [5,4,0]
        orientation: minusZdownY
    exits:    [
        name:     "exit"
        active:   1
        position: [0,0,0]                                        
    ]
    create: ->
        
        world.addObjectAtPos 'Stone', world.decenter 0,0,-5
        world.addObjectAtPos 'Stone', world.decenter 0,0,+5
        world.addObjectAtPos 'Stone', world.decenter +5,0,0
        world.addObjectAtPos 'Stone', world.decenter -5,0,0
        world.addObjectAtPos 'Stone', world.decenter 0,+5,0
        world.addObjectAtPos 'Stone', world.decenter 0,-5,0
            