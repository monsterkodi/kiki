module.exports =
    name:       "mutants"
    scheme:     "blue_scheme"
    size:       [9,9,9]
    intro:      "mutants"
    help:       """
                $scale(1.5)mission:
                deactivate the mutants!
                
                to deactivate a mutant,
                shoot him until it get's transparent
                
                the exit will open,
                when all mutant bots
                are deactivated
                """
    player:   position: [0,-1,0]
    exits:    [
        name:       "exit"
        active:     0
        position:   [0,0,0]
        world:      ()-> outro()
    ]
    create: ->
# 
        s = world.getSize()
        
        world.addObjectLine(KikiWall, [2, 2, 2], [s.x - 3, 2, 2])
        world.addObjectLine(KikiWall, [s.x - 3, 2, 2], [s.x - 3, s.y - 3, 2])
        world.addObjectLine(KikiWall, [s.x - 3, s.y - 3, 2], [s.x - 3, s.y - 3, s.z - 3])
        world.addObjectLine(KikiWall, [s.x - 3, s.y - 3, s.z - 3], [2, s.y - 3, s.z - 3])
        world.addObjectLine(KikiWall, [2, s.y - 3, s.z - 3], [2, 2, s.z - 3])
        world.addObjectLine(KikiWall, [2, 2, s.z - 3], [2, 2, 2])
        
        world.num_mutants   = 5
        world.death_counter = 0
        
        botDied =() ->
            world.death_counter += 1
            if world.death_counter >= world.num_mutants
                world.activate("exit")
        
        for i in range(world.num_mutants)
            mutant = KikiMutant()
            mutant.getEventWithName("died").addAction(once(botDied))
            world.setObjectRandom(mutant)
            