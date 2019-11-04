
# 00     00  000   000  000000000   0000000   000   000  000000000   0000000    
# 000   000  000   000     000     000   000  0000  000     000     000         
# 000000000  000   000     000     000000000  000 0 000     000     0000000     
# 000 0 000  000   000     000     000   000  000  0000     000          000    
# 000   000   0000000      000     000   000  000   000     000     0000000     

module.exports =
    name:       "mutants"
    scheme:     "blue"
    size:       [9,9,9]
    help:       """
                deactivate the mutants!
                
                to deactivate a mutant,
                shoot him until it get's transparent.
                
                the exit will open,
                when all mutant bots
                are deactivated.
                """
    player:   
        coordinates: [7,1,8]
        orientation: minusYdownZ
    exits:    [
        name:       "exit"
        active:     0
        position:   [0,0,0]
        world:      ()-> outro()
    ]
    create: ->
        
        s = world.size
        {Mutant} = require '../items'
        
        world.addObjectLine('Wall', [2, 2, 2], [s.x - 3, 2, 2])
        world.addObjectLine('Wall', [s.x - 3, 2, 2], [s.x - 3, s.y - 3, 2])
        world.addObjectLine('Wall', [s.x - 3, s.y - 3, 2], [s.x - 3, s.y - 3, s.z - 3])
        world.addObjectLine('Wall', [s.x - 3, s.y - 3, s.z - 3], [2, s.y - 3, s.z - 3])
        world.addObjectLine('Wall', [2, s.y - 3, s.z - 3], [2, 2, s.z - 3])
        world.addObjectLine('Wall', [2, 2, s.z - 3], [2, 2, 2])
        
        world.num_mutants   = 5
        world.death_counter = 0
        
        botDied = ->
            world.death_counter += 1
            if world.death_counter >= world.num_mutants
                world.activate("exit")
        
        for i in [0...world.num_mutants]
            mutant = new Mutant()
            mutant.getEventWithName("died").addAction world.once botDied  
            world.setObjectRandom(mutant)
            