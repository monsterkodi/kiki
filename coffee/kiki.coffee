
# 000   000  000  000   000  000
# 000  000   000  000  000   000
# 0000000    000  0000000    000
# 000  000   000  000  000   000
# 000   000  000  000   000  000

{ klog } = require 'kxk'
Stage = require './stage'
World = require './world'

class Kiki extends Stage
    
    constructor: (@view) -> 
        klog "view:", @view.className
        super @view
        @view.focus()
    
    start: -> 
                
        @elem = document.createElement 'div'
        @elem.style.position = 'absolute'
        @elem.style.top = '0'
        @elem.style.left = '0'
        @elem.style.right = '0'
        @elem.style.bottom = '0'
        @elem.style.background = "#004"
        @view.appendChild @elem
        @world = World.init @view
        @elem.appendChild @world.renderer.domElement
        @view.focus()
        @animate()

    #    0000000  000000000  00000000  00000000 
    #   000          000     000       000   000
    #   0000000      000     0000000   00000000 
    #        000     000     000       000      
    #   0000000      000     00000000  000      
    
    animationStep: (step) => @world.step step

    reset: ->
        @resume()
        @start()
        
    stop: ->
        World.deinit()
        @elem.remove()
        @pause()
        
    resized: () -> @world.resized @view.clientWidth, @view.clientHeight

    modKeyComboEventDown: (mod, key, combo, event) -> world.modKeyComboEventDown mod, key, combo, event
    modKeyComboEventUp:   (mod, key, combo, event) -> world.modKeyComboEventUp   mod, key, combo, event
        
module.exports = Kiki
