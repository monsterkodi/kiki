###
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000  
###

{ elem } = require 'kxk'

class LevelSelection
    
    @: (@gameWorld) ->
        
        @gameWorld.menu.del()
        
        view = elem class:'preview'
        view.style.position = 'absolute'
        view.style.left     = '0'
        view.style.right    = '0'
        view.style.top      = '0'
        view.style.height   = '66%'
        
        @gameWorld.view.appendChild view
        
        World = require './world'
        @world = new World view, true
        @world.create 'bombs'
        @resized @gameWorld.screenSize.w, @gameWorld.screenSize.h
        
    navigate: (action) ->
        
    load: ->
        
    close: -> 
        
        global.world = @gameWorld
        delete @gameWorld.levelSelection
        @world.del()
        @gameWorld.applyScheme @gameWorld.dict.scheme ? 'default'
        
    modKeyComboEvent: (mod, key, combo, event) =>
        
        switch combo
            when 'esc'           then @close()
            when 'enter' 'space' then @load()
            when 'left' 'right' 'up' 'down' 'page up' 'page down' 'home' 'end' then @navigate combo
        
    resized: (w, h) => @world.resized w, h*0.66
        
    step: (step) -> 
    
        @world.step step
    
module.exports = LevelSelection
