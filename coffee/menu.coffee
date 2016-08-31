
#   00     00  00000000  000   000  000   000
#   000   000  000       0000  000  000   000
#   000000000  0000000   000 0 000  000   000
#   000 0 000  000       000  0000  000   000
#   000   000  00000000  000   000   0000000 

ScreenText = require './screentext'
Action     = require './action'
Material   = require './material'

class Menu extends ScreenText

    constructor: ->
        @current = 0
        @callbacks = []
        @lineHeight = 1.1
        super
        @getActionWithId(Action.SHOW).duration = 250
        @getActionWithId(Action.HIDE).duration = 200
        
    del: ->
        world.menu = null
        super
        
    addItem: (text, cb) ->
        @callbacks.push cb
        @addText text
      
    show: -> 
        world.playSound 'MENU_FADE'
        @setCurrent @current
        super
        
    setCurrent: (current) ->        
        @current = (@mesh.children.length + current) % @mesh.children.length
        for ci in [0...@mesh.children.length]
            m = ci == @current and Material.menu or Material.text
            o = @mesh.children[ci].material.opacity
            @mesh.children[ci].material = m.clone()
            @mesh.children[ci].material.opacity = o
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
            when 'down', 'right', 's', 'd'
                @next()
            when 'left', 'up', 'w', 'a'
                @prev()
            when 'enter'
                world.playSound 'MENU_SELECT'
                @callbacks[@current]()
                @fadeOut()

module.exports = Menu
