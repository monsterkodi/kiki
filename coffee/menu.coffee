
#   00     00  00000000  000   000  000   000
#   000   000  000       0000  000  000   000
#   000000000  0000000   000 0 000  000   000
#   000 0 000  000       000  0000  000   000
#   000   000  00000000  000   000   0000000 

ScreenText = require './screentext'

class Menu extends ScreenText

    constructor: ->
        super
        
    del: ->
        world.menu = null
        super
        
    addItem: (text, cb) ->
        @addText text

    modKeyComboEvent: (mod, key, combo, event) ->
        switch key
            when 'esc'
                @fadeOut()

module.exports = Menu
