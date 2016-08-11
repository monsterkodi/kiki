
#   000  000000000  00000000  00     00
#   000     000     000       000   000
#   000     000     0000000   000000000
#   000     000     000       000 0 000
#   000     000     00000000  000   000

log    = require '/Users/kodi/s/ko/js/tools/log'
Vector = require './lib/vector'
Pos    = require './lib/pos'
event  = require 'events'

class Item extends event

    constructor: ->
        @move_action = null
        @direction   = new Vector

    del: -> 
        world.removeObject @
        @emit 'deleted'
        
    initAction: ->
    performAction: ->
    finishAction: ->
    actionFinished: ->
    newCellMate: ->
    cellMateLeft: ->
    bulletImpact: ->
    render: ->
        
    isSpaceEgoistic: -> true
    isSlippery: -> false
    
    setPosition: (p) -> 
        @position = @current_position = p
        if @mesh?
            log 'setPosition', @mesh.position
            # @mesh.position = new THREE.Vector3 @position.x, @position.y, @position.z 
            # @mesh.matrixWorldNeedsUpdate = true
            # @mesh.updateMatrix()
            # @mesh.updateMatrixWorld true 
            @mesh.translateX @position.x
            @mesh.translateY @position.y
            @mesh.translateZ @position.z
            log 'setPosition', p, @mesh.position

    getPos: -> new Pos @current_position
    
    getPosition: -> @position
    getOrientation: -> @orientation
    getCurrentPosition: -> @current_position
    getCurrentOrientation: -> @current_orientation
    setOrientation: (q) -> @current_orientation = @orientation = q
    setCurrentPosition: (p) -> @current_position = p
    setCurrentOrientation: (q) -> @current_orientation = q
    
module.exports = Item