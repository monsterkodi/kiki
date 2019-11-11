
#   00     00  00000000  000   000  000   000
#   000   000  000       0000  000  000   000
#   000000000  0000000   000 0 000  000   000
#   000 0 000  000       000  0000  000   000
#   000   000  00000000  000   000   0000000 

{ kerror } = require 'kxk'
ScreenText = require './screentext'
Action     = require './action'
Material   = require './material'

class Menu extends ScreenText

    @: ->
        
        @current = 0
        @callbacks = []
        @lineHeight = 1.1
        super
        @getActionWithId(Action.SHOW).duration = 100
        @getActionWithId(Action.HIDE).duration = 200
        
    del: ->
        world.menu = null
        super
        
    addItem: (text, cb) ->
        
        @callbacks.push cb
        @addText text
      
    show: -> 
        world.playSound 'GEAR_ON' 
        @setCurrent @current
        super
        
    setCurrent: (current) ->
        
        @current = (@mesh.children.length + current) % @mesh.children.length
        
        for ci in [0...@mesh.children.length]
            m = ci == @current and Material.menu or Material.text
            @mesh.children[ci].traverse (c) -> c.material = m
            z = ci == @current and 4 or 0
            @mesh.children[ci].position.set @mesh.children[ci].position.x, @mesh.children[ci].position.y, z
        
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
            when 'enter' 'space'
                world.playSound 'MENU_SELECT'
                if 'function' == typeof @callbacks[@current]
                    @callbacks[@current]()
                else
                    kerror "no menu callback #{@current}"
                if world.menu == @
                    @fadeOut()

module.exports = Menu
