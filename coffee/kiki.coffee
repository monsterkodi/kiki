
# 000   000  000  000   000  000
# 000  000   000  000  000   000
# 0000000    000  0000000    000
# 000  000   000  000  000   000
# 000   000  000  000   000  000

{ keyinfo } = require 'kxk'

World = require './world'

class Kiki
    
    @: (@view) ->
        
        @paused = false
        
        @view.onkeydown = @onKeyDown
        @view.onkeyup   = @onKeyUp
        
        @view.focus()
    
    #  0000000  000000000   0000000   00000000   000000000  
    # 000          000     000   000  000   000     000     
    # 0000000      000     000000000  0000000       000     
    #      000     000     000   000  000   000     000     
    # 0000000      000     000   000  000   000     000     
    
    start: -> 
                
        @world = World.init @view
        @view.focus()
        @animate()
        @interval = setInterval @animate, 16

    #  0000000   000   000  000  00     00   0000000   000000000  00000000  
    # 000   000  0000  000  000  000   000  000   000     000     000       
    # 000000000  000 0 000  000  000000000  000000000     000     0000000   
    # 000   000  000  0000  000  000 0 000  000   000     000     000       
    # 000   000  000   000  000  000   000  000   000     000     00000000  
    
    animate: =>

        if not @paused
            @world.step()

    # 000   000  00000000  000   000  
    # 000  000   000        000 000   
    # 0000000    0000000     00000    
    # 000  000   000          000     
    # 000   000  00000000     000     
    
    onKeyDown: (event) =>
        
        {mod, key, combo} = keyinfo.forEvent event
        return if not combo
        return if key == 'right click' # weird right command key
        if key == 'p' 
            @paused = not @paused
            return
            
        @world.modKeyComboEventDown mod, key, combo, event
   
    onKeyUp: (event) =>
        
        {mod, key, combo} = keyinfo.forEvent event        
        return if not combo
        return if key == 'right click' # weird right command key
        @world.modKeyComboEventUp   mod, key, combo, event
    
    resized: => @world.resized @view.clientWidth, @view.clientHeight
    
module.exports = Kiki
