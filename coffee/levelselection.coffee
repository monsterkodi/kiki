###
000      00000000  000   000  00000000  000       0000000  00000000  000      
000      000       000   000  000       000      000       000       000      
000      0000000    000 000   0000000   000      0000000   0000000   000      
000      000          000     000       000           000  000       000      
0000000  00000000      0      00000000  0000000  0000000   00000000  0000000  
###

{ prefs, clamp, elem } = require 'kxk'

LevelSelName = require './levelselname'

class LevelSelection
    
    @: (@gameWorld) ->
        
        World = require './world'
        
        @levels = World.levels.list
        
        @index = ((@gameWorld.level_index ? 0) + 1) % @levels.length
        
        @gameWorld.menu?.del()

        view = elem class:'preview'
        view.style.position = 'absolute'
        view.style.left     = '0'
        view.style.right    = '0'
        view.style.top      = '0'
        view.style.bottom   = '0'
        @gameWorld.view.appendChild view
        @world = new World view, true
        @world.create @levels[@index]
        @addName()
        @resized @gameWorld.screenSize.w, @gameWorld.screenSize.h

    addName: -> 
        
        @world.text = new LevelSelName @levels[@index]
        @world.text.addText ""
        @world.text.addText "#{prefs.get("solved▸#{@levels[@index]}" false) and 'solved' or @index+1}" 0.8
        
    navigate: (action) ->
        
        oldIndex = @index
        
        switch action
            when 'right' 'down' then @index += 1
            when 'left' 'up'    then @index -= 1
            when 'page up'      then @index -= 10
            when 'page down'    then @index += 10
            when 'home'         then @index = 0
            when 'end'          then @index = @levels.length-1
        
        @index = clamp 0, @levels.length-1, @index

        if oldIndex != @index
            @world.playSound 'MENU_ITEM'
            @world.create @levels[@index]
            @addName()
            @resized @gameWorld.screenSize.w, @gameWorld.screenSize.h
        
    del: ->
        
        delete @gameWorld.levelSelection
        @world.del()
        
    load: ->
              
        @world.playSound 'MENU_SELECT'
        global.world = @gameWorld
        @gameWorld.create @levels[@index], false
        @del()
        
    close: -> 
        
        @world.playSound 'MENU_ABORT'
        global.world = @gameWorld
        @del()
        @gameWorld.applyScheme @gameWorld.dict.scheme ? 'default'
        
    modKeyComboEvent: (mod, key, combo, event) =>
        
        switch combo
            when 'esc'           then @close()
            when 'enter' 'space' then @load()
            when 'left' 'right' 'up' 'down' 'page up' 'page down' 'home' 'end' then @navigate combo
        
    resized: (w, h) => @world.resized w, h
        
    step: -> 
    
        @world.step()
    
module.exports = LevelSelection
