
#   0000000     0000000   00000000    0000000 
#   000   000  000   000  000   000  000      
#   0000000    000   000  0000000    000  0000
#   000   000  000   000  000   000  000   000
#   0000000     0000000   000   000   0000000 

module.exports = 
    name:       'borg'
    disgn:      'Michael Abel'
    scheme:     "default"
    size:       [9,9,9]
    help:       """
                Believe me,
                they are
                CRAZY!
                """
    player:   
        coordinates: [0,0,0]
        nostatus:     0
                
    exits: [
        name:     "exit"
        active:   1
        position: [0,0,0]
    ]
    create: ->
        world.addObjectAtPos 'Light', 7,7,7
        for i in [0...150] 
            world.setObjectRandom 'Mutant'
            