
#   000  000000000  00000000  00     00
#   000     000     000       000   000
#   000     000     0000000   000000000
#   000     000     000       000 0 000
#   000     000     00000000  000   000

log    = require '/Users/kodi/s/ko/js/tools/log'
Actor  = require './actor'
Vector = require './lib/vector'
Quat   = require './lib/quaternion'
Pos    = require './lib/pos'

class Item extends Actor

    constructor: ->
        super
        @move_action = null
        @direction   = new Vector

    del: -> 
        world.removeObject @
        @emit 'deleted'
        
    newCellMate: ->
    cellMateLeft: ->
    bulletImpact: ->
    render: ->
        
    isSpaceEgoistic: -> true
    isSlippery: -> false
    
    setPosition: (x,y,z) -> 
        @position = @current_position = new Vector x, y, z
        @mesh?.position.copy @position

    getPos: -> new Pos @current_position
    
    # getPosition: -> @position
    # getOrientation: -> @orientation
    # getCurrentPosition: -> @current_position
    # getCurrentOrientation: -> @current_orientation
    setOrientation: (q) -> @current_orientation = @orientation = new Quat q
    setCurrentPosition: (p) -> @current_position = p
    setCurrentOrientation: (q) -> @current_orientation = q
    
module.exports = Item