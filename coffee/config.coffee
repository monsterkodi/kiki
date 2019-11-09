###
 0000000   0000000   000   000  00000000  000   0000000   
000       000   000  0000  000  000       000  000        
000       000   000  000 0 000  000000    000  000  0000  
000       000   000  000  0000  000       000  000   000  
 0000000   0000000   000   000  000       000   0000000   
###

{ prefs, clamp } = require 'kxk'

Menu  = require './menu'
Sound = require './sound'

class Config extends Menu

    @: -> 
        super
        @addItems()
        @show()
        
    onVolume: (d=1) =>
        vol = d + prefs.get 'volume' 3
        vol = clamp 0 5 vol
        prefs.set 'volume' vol
        Sound.master = (prefs.get 'volume' 3) / 5
        
    onSpeed: (d=1) =>
        speed = d + prefs.get 'speed' 3
        speed = clamp 1 5 speed
        prefs.set 'speed' speed
        global.world.speed = 6 + (prefs.get 'speed' 3) - 3 # 4-8
    
    addItems: ->
        
        @addItem "volume #{prefs.get 'volume' 3}" @onVolume
        @addItem "speed #{prefs.get 'speed' 3}"  @onSpeed
        
    update: ->
        
        @width = @height = 0
        while @mesh.children.length
            @mesh.remove @mesh.children[0]
        @callbacks = []
        @addItems()
        @setOpacity 1
        @setCurrent @current

    modKeyComboEvent: (mod, key, combo, event) ->
        
        switch key
            
            when 'right'
                if @current in [0, 1]
                    @callbacks[@current]()
                    world.playSound 'MENU_SELECT'
                    @update()
                return
                    
            when 'left'
                if @current in [0, 1]
                    @callbacks[@current] -1
                    world.playSound 'MENU_SELECT'
                    @update()
                return
                    
            when 'enter'
                world.playSound 'MENU_FADE'
                @fadeOut()
                return
                        
        super
    
module.exports = Config
