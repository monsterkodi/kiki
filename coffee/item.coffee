
#   000  000000000  00000000  00     00
#   000     000     000       000   000
#   000     000     0000000   000000000
#   000     000     000       000 0 000
#   000     000     00000000  000   000

log        = require '/Users/kodi/s/ko/js/tools/log'
Actor      = require './actor'
Pos        = require './lib/pos'
Vector     = require './lib/vector'
Quaternion = require './lib/quaternion'

class Item extends Actor

    constructor: ->
        super
        world.scene.add @mesh if @mesh?
        @position         = new Vector
        @current_position = new Vector
        @direction        = new Vector
        @move_action      = null

    del: -> 
        world.scene.remove @mesh if @mesh?
        world.removeObject @
        @emit 'deleted'
        
    newCellMate: ->
    cellMateLeft: ->
    bulletImpact: ->
    render: ->
        
    isSpaceEgoistic: -> true
    isSlippery: -> false
    
    setPosition: (x,y,z) -> 
        @position = new Vector x,y,z
        @current_position = new Vector x,y,z
        @mesh?.position.copy @position

    getPos: -> new Pos @current_position
    setPos: (x,y,z) -> 
        p = new Pos x,y,z
        @position = @current_position = new Vector p
    
    setOrientation: (q) -> @current_orientation = @orientation = new Quaternion q
    setCurrentPosition: (p) -> @current_position = p
    setCurrentOrientation: (q) -> @current_orientation = q
    
module.exports = Item