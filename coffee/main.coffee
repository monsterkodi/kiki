
# 000   000  000  000   000  000
# 000  000   000  000  000   000
# 0000000    000  0000000    000
# 000  000   000  000  000   000
# 000   000  000  000   000  000

Stage     = require '/Users/kodi/s/ko/js/area/stage'
log       = require '/Users/kodi/s/ko/js/tools/log'

KikiWorld = require './world'

class Kiki extends Stage
    
    constructor: (@view) -> super @view
    
    start: -> 
                
        @elem = document.createElement 'div'
        @elem.style.position = 'absolute'
        @elem.style.top = '0'
        @elem.style.left = '0'
        @elem.style.right = '0'
        @elem.style.bottom = '0'
        @elem.style.background = "#004"
        @view.appendChild @elem
        
        @world = KikiWorld.init @view
        
        @elem.appendChild @world.renderer.domElement
        
        log 'hello world'

        @animate()

    #    0000000  000000000  00000000  00000000 
    #   000          000     000       000   000
    #   0000000      000     0000000   00000000 
    #        000     000     000       000      
    #   0000000      000     00000000  000      
    
    animationStep: (step) => @world.step step

    reset: ->
        @elem.style.display = 'block'
        @resume()
        
    stop: ->
        @elem.style.display = 'none'
        @pause()
        
    resized: (w,h) -> 
        @aspect = w/h
        @camera?.aspect = @aspect
        @camera?.updateProjectionMatrix()
        @renderer?.setSize w,h

module.exports = Kiki
