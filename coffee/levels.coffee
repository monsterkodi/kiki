# 000      00000000  000   000  00000000  000       0000000
# 000      000       000   000  000       000      000     
# 000      0000000    000 000   0000000   000      0000000 
# 000      000          000     000       000           000
# 0000000  00000000      0      00000000  0000000  0000000 

class Levels
    
    @: () ->
        @dict = {}
        @list = [
            # --- introduction
            "steps"   
            "jump"    
            "move"    
            "electro" 
            "elevate" 
            "fall"    
            # --- easy
            "blocks"  
            "throw" 
            "gold" 
            "escape" 
            "gears" 
            "gamma"  
            "cube" 
            "switch"
            "mini" 
            "bombs" 
            "energy" 
            "maze" 
            "love" 
            # --- medium
            "towers" 
            "edge" 
            "random" 
            "slick" 
            "bridge" 
            "plate" 
            "nice" 
            "entropy" 
            "neutron"
            "strange"
            "core"
            # --- difficult
            "flower" 
            "stones" 
            "walls" 
            "grid" 
            "rings" 
            "bronze" 
            "pool" 
            # --- owen hay's levels (TODO: sort in)
            "grasp" 
            "fallen" 
            "cheese" 
            "spiral" 
            # --- tough
            "hidden" 
            "church" 
            "mesh" 
            "columns" 
            "machine" 
            # --- very hard
            "captured" 
            "circuit" 
            "regal" 
            "conductor" 
            "evil" 
            # outro
            "mutants"]
               
        # import the levels
        for levelName in @list
            @dict[levelName] = require "./levels/#{levelName}"
        
module.exports = Levels
