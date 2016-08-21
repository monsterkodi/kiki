# 00     00   0000000   000000000   0000000   00000000    0000000  000   000  000      000  000   000  0000000    00000000  00000000 
# 000   000  000   000     000     000   000  000   000  000        000 000   000      000  0000  000  000   000  000       000   000
# 000000000  000   000     000     000   000  0000000    000         00000    000      000  000 0 000  000   000  0000000   0000000  
# 000 0 000  000   000     000     000   000  000   000  000          000     000      000  000  0000  000   000  000       000   000
# 000   000   0000000      000      0000000   000   000   0000000     000     0000000  000  000   000  0000000    00000000  000   000

log      = require '/Users/kodi/s/ko/js/tools/log'
Item     = require './item'
Action   = require './action'
Face     = require './face'
Geom     = require './geom'
Material = require './material'

class MotorCylinder extends Item
    
    isSpaceEgoistic: -> true
    
    constructor: (face) ->
        super        
        @value = 0.0
        @active = false
        @orientation = Face.orientationForFace @face
        @addAction new Action @, Action.TUCKER, "tucker", 500, Action.REPEAT
        @setActive true
        
    createMesh: ->
                    
        @mesh   = new THREE.Mesh Geom.cylinder(), Material.plate
        @kolben = new THREE.Mesh Geom.kolben(),   Material.gear
        @mesh.add @kolben
        @mesh.receiveShadow = true
    
    updateMesh: -> @kolben.position.set 0, 0, -0.5 * Math.sin(@value)
    
    setActive: (active) ->
        if @active != active
            @active = active
            if @active
                @startTimedAction @getActionWithId Action.TUCKER
            else
                @stopAction @getActionWithId Action.TUCKER
    
    performAction: (action) ->
        if action.id == Action.TUCKER
            relTime = action.getRelativeTime()
            @value = if relTime > 0.5 then 1.0 - relTime else relTime
            @value *= 2
            @updateMesh()
    
    finishAction: (action) ->
        if action.id == Action.TUCKER
            world.playSound 'MOTOR', @getPos()
    
module.exports = MotorCylinder
