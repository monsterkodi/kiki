
#   000   000  00000000  000   000  000000000  00000000    0000000   000   000
#   0000  000  000       000   000     000     000   000  000   000  0000  000
#   000 0 000  0000000   000   000     000     0000000    000   000  000 0 000
#   000  0000  000       000   000     000     000   000  000   000  000  0000
#   000   000  00000000   0000000      000     000   000   0000000   000   000

module.exports = 
    name:       "neutron"
    design:     'Michael Abel'
    scheme:     "neutron_scheme"
    size:       [11,11,11]
    help:       """ 
                $scale(1.5)mission:
                get to the exit!
                
                it looks simpler than it is.
                """
    player:      
        "position": [0,-1,0]
        "nostatus": 0
    exits:    [
        "name":     "exit"
        "active":   1
        "position": [0,0,0]                                        
    ]
    "create": ->
        
        # neutron_scheme["KikiStone"] = "base": [0.0, 0.5, 0.5, 0.5]
    
        world.addObjectAtPos 'Stone', world.decenter 0,0,-5
        world.addObjectAtPos 'Stone', world.decenter 0,0,+5
        world.addObjectAtPos 'Stone', world.decenter +5,0,0
        world.addObjectAtPos 'Stone', world.decenter -5,0,0
        world.addObjectAtPos 'Stone', world.decenter 0,+5,0
        world.addObjectAtPos 'Stone', world.decenter 0,-5,0
            