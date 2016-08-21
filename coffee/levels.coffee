# 000      00000000  000   000  00000000  000       0000000
# 000      000       000   000  000       000      000     
# 000      0000000    000 000   0000000   000      0000000 
# 000      000          000     000       000           000
# 0000000  00000000      0      00000000  0000000  0000000 

class Levels
    
    constructor: () ->
        @dict = {}
        @list = [
            # "test",
            # intro
            # "steps", 
            # "start", 
            #"move", "electro", "elevate", 
            # "throw", 
            # easy
            # "gold", 
            # "jump", 
            # "escape", 
            # "gears", 
            # "gamma", 
            # "cube", 
            # "switch", 
            # "borg", 
            # "mini", 
            # "blocks", 
            # "bombs", 
            # "sandbox", 
            # "energy", 
            # "maze", 
            # "love", 
            # medium
            # "towers", "edge", "random", "plate", "nice", "entropy", 
            # owen hay's levels (TODO: sort in)
            # "grasp", 
            # "fallen", 
            # "cheese", 
            # "invisimaze", 
            # "spiral", 
            # difficult
            # "slick", 
            # "bridge", 
            # "flower", 
            # "stones", 
            # "walls", 
            # "grid", 
            # "rings", 
            # "core", 
            # "browanze", 
            # "pool", 
            # tough
            # "hidden", 
            # "church", 
            # "strange", 
            # "mesh", 
            # "columns", 
            # "machine", 
            # very hard
            # "neutron", 
            # "captured", 
            # "circuit", 
            # "regal", 
            "conductor", "evil", 
            # outro
            "mutants"]
               
        # import the levels
        for levelName in @list
            @dict[levelName] = require "./levels/#{levelName}"
        
module.exports = Levels
