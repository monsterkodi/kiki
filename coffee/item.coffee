
#   000  000000000  00000000  00     00
#   000     000     000       000   000
#   000     000     0000000   000000000
#   000     000     000       000 0 000
#   000     000     00000000  000   000

Actor      = require './actor'
Pos        = require './lib/pos'
Vector     = require './lib/vector'
Quaternion = require './lib/quaternion'

class Item extends Actor

    constructor: ->
        super
        @name = @constructor.name
        @createMesh?()
        world.scene.add @mesh if @mesh?
        @position         = new Vector
        @current_position = new Vector
        @direction        = new Vector
        @move_action      = null

    del: ->
        return if @name == 'del'
        super 
        @name = 'del'
        world.scene.remove @mesh if @mesh?
        world.removeObject @
        @emit 'deleted'
        
    newCellMate: ->
    cellMateLeft: ->
    bulletImpact: ->
    render: ->
        
    isSpaceEgoistic: -> false
    isSlippery: -> false
    
    setPosition: (x,y,z) -> 
        @position = new Vector x,y,z
        @setCurrentPosition @position

    getPos: -> new Pos @current_position
    setPos: (x,y,z) -> 
        # log "item.setPos #{@name} #{x} #{y} #{z}"
        @setPosition new Pos x,y,z
    
    setOrientation: (q) -> 
        @current_orientation = @orientation = new Quaternion q
        
    setCurrentPosition: (p) -> 
        # log "item.setCurrentPosition #{@name}", p
        @current_position = new Vector p
        @mesh?.position.copy @current_position
        
    setCurrentOrientation: (q) -> @current_orientation = q
    
module.exports = Item