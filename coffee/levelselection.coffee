###
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000  
###

{ clamp, elem, klog } = require 'kxk'

ScreenText = require './screentext'

class LevelSelection
    
    @: (@gameWorld) ->
        
        World = require './world'
        
        @levels = World.levels.list
        
        @index = ((@gameWorld.level_index ? 0) + 1) % @levels.length
        
        @gameWorld.menu.del()

        {w,h} = @gameWorld.screenSize
        
        view = elem class:'names'
        view.style.position = 'absolute'
        view.style.left     = '0'
        view.style.right    = '0'
        view.style.top      = '66%'
        view.style.bottom   = '0'
        @gameWorld.view.appendChild view
        @names = new World view, true
        
        view = elem class:'preview'
        view.style.position = 'absolute'
        view.style.left     = '0'
        view.style.right    = '0'
        view.style.top      = '0'
        view.style.height   = '66%'
        @gameWorld.view.appendChild view
        @world = new World view, true
        
        @world.create @levels[@index]
        
        @names.text = new ScreenText @levels[@index]
        @resized w,h
        
    navigate: (action) ->
        
        switch action
            when 'right' 'down' then @index += 1
            when 'left' 'up'    then @index -= 1
            when 'page up'      then @index -= 10
            when 'page down'    then @index += 10
            when 'home'         then @index = 0
            when 'end'          then @index = @levels.length-1
        
        @index = clamp 0, @levels.length-1, @index
        klog @index, @levels[@index]
        @world.create @levels[@index]
        @names.text = new ScreenText @levels[@index]
        
    del: ->
        
        delete @gameWorld.levelSelection
        @world.del()
        @names.del()
        
    load: ->
                
        global.world = @gameWorld
        @gameWorld.create @levels[@index]
        @del()
        
    close: -> 
        
        global.world = @gameWorld
        @del()
        @gameWorld.applyScheme @gameWorld.dict.scheme ? 'default'
        
    modKeyComboEvent: (mod, key, combo, event) =>
        
        switch combo
            when 'esc'           then @close()
            when 'enter' 'space' then @load()
            when 'left' 'right' 'up' 'down' 'page up' 'page down' 'home' 'end' then @navigate combo
        
    resized: (w, h) => 
        @world.resized w, h*0.66
        @names.resized w, h*0.34
        
    step: (step) -> 
    
        @world.step step
        @names.step step
    
module.exports = LevelSelection
