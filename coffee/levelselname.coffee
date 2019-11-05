
# 000      00000000  000   000  00000000  000       0000000  00000000  000      000   000   0000000   00     00  00000000    
# 000      000       000   000  000       000      000       000       000      0000  000  000   000  000   000  000         
# 000      0000000    000 000   0000000   000      0000000   0000000   000      000 0 000  000000000  000000000  0000000     
# 000      000          000     000       000           000  000       000      000  0000  000   000  000 0 000  000         
# 0000000  00000000      0      00000000  0000000  0000000   00000000  0000000  000   000  000   000  000   000  00000000    

{ kerror } = require 'kxk'

ScreenText = require './screentext'
Action     = require './action'
# Material   = require './material'

class LevelSelName extends ScreenText

    @: (text) ->

        @lineHeight = 1.1
        super
        @getActionWithId(Action.SHOW).duration = 250
        @getActionWithId(Action.HIDE).duration = 200
        
    del: -> super
        
    addItem: (text, cb) ->
        @callbacks.push cb
        @addText text
      
    show: -> 
        world.playSound 'MENU_FADE'
        @setCurrent @current
        super
                
    next: -> 
        world.playSound 'MENU_ITEM'
        @setCurrent @current + 1
        
    prev: -> 
        world.playSound 'MENU_ITEM'
        @setCurrent @current - 1

    modKeyComboEvent: (mod, key, combo, event) ->
        
        switch key
            when 'esc'
                world.playSound 'MENU_ABORT'
                @fadeOut()
            when 'down' 'right' 's' 'd'
                @next()
            when 'left' 'up' 'w' 'a'
                @prev()
            when 'enter'
                world.playSound 'MENU_SELECT'
                if 'function' == typeof @callbacks[@current]
                    @callbacks[@current]()
                else
                    kerror "no menu callback #{@current}"
                @fadeOut()

module.exports = Menu
