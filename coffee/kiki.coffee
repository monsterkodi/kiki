
# 000   000  000  000   000  000
# 000  000   000  000  000   000
# 0000000    000  0000000    000
# 000  000   000  000  000   000
# 000   000  000  000   000  000

{ klog } = require 'kxk'
Stage = require './stage'
World = require './world'

class Kiki extends Stage
    
    @: (@view) ->
        klog "view:", @view.className
        super @view
        @view.focus()
    
    start: -> 
                
        @world = World.init @view
        @view.focus()
        @animate()

    #    0000000  000000000  00000000  00000000 
    #   000          000     000       000   000
    #   0000000      000     0000000   00000000 
    #        000     000     000       000      
    #   0000000      000     00000000  000      
    
    animationStep: (step) => 
    
        @world.step step

    # reset: ->
#         
        # @resume()
        # @start()
                
    resized: => @world.resized @view.clientWidth, @view.clientHeight

    modKeyComboEventDown: (mod, key, combo, event) => @world.modKeyComboEventDown mod, key, combo, event
    modKeyComboEventUp:   (mod, key, combo, event) => @world.modKeyComboEventUp   mod, key, combo, event
        
module.exports = Kiki
