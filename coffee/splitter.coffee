#  0000000  00000000   000      000  000000000  000000000  00000000  00000000 
# 000       000   000  000      000     000        000     000       000   000
# 0000000   00000000   000      000     000        000     0000000   0000000  
#      000  000        000      000     000        000     000       000   000
# 0000000   000        0000000  000     000        000     00000000  000   000

Bomb   = require './bomb'
Action = require './action'

class Splitter extends Bomb

    isSpaceEgoistic: -> false
        
    constructor: (dir) ->
        super
        @size      = 0.0
        @splitted  = true
        @direction = dir
    
        @startTimedAction @getActionWithId Action.EXPLODE
        @updateMesh()

module.exports = Splitter
