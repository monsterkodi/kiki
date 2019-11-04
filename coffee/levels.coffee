# 000      00000000  000   000  00000000  000       0000000
# 000      000       000   000  000       000      000     
# 000      0000000    000 000   0000000   000      0000000 
# 000      000          000     000       000           000
# 0000000  00000000      0      00000000  0000000  0000000 

class Levels
    
    @: () ->
        @dict = {}
        @list = [
            # "test",
            # --- introduction
            "steps",   # ok
            "jump",    # ok
            "move",    # ok
            "electro", # ok
            "elevate", # ok
            "fall",    # ok
            # # --- easy
            "blocks",  # ok
            "throw", 
            "gold", 
            "escape", 
            "gears", 
            "gamma",  
            "cube", 
            "switch"
            # # "borg", 
            "mini", 
            "bombs", 
            "sandbox", 
            "energy", 
            "maze", 
            "love", 
            # --- medium
            "towers", 
            "edge", 
            "random", 
            "slick", 
            "bridge", 
            "plate", 
            "nice", 
            "entropy", 
            "neutron",
            "strange",
            "core",
            # --- difficult
            "flower", 
            "stones", 
            "walls", 
            "grid", 
            "rings", 
            "bronze", 
            "pool", 
            # --- owen hay's levels (TODO: sort in)
            "grasp", 
            "fallen", 
            "cheese", 
            "spiral", 
            # --- tough
            "hidden", 
            "church", 
            "mesh", 
            "columns", 
            "machine", 
            # --- very hard
            "captured", 
            "circuit", 
            "regal", 
            "conductor", 
            "evil", 
            # outro
            "mutants"]
               
        # import the levels
        for levelName in @list
            @dict[levelName] = require "./levels/#{levelName}"
        
module.exports = Levels
