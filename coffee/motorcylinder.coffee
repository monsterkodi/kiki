# 00     00   0000000   000000000   0000000   00000000    0000000  000   000  000      000  000   000  0000000    00000000  00000000 
# 000   000  000   000     000     000   000  000   000  000        000 000   000      000  0000  000  000   000  000       000   000
# 000000000  000   000     000     000   000  0000000    000         00000    000      000  000 0 000  000   000  0000000   0000000  
# 000 0 000  000   000     000     000   000  000   000  000          000     000      000  000  0000  000   000  000       000   000
# 000   000   0000000      000      0000000   000   000   0000000     000     0000000  000  000   000  0000000    00000000  000   000

{ klog } = require 'kxk'
Item      = require './item'
Action    = require './action'
Face      = require './face'
Geom      = require './geom'
Pushable  = require './pushable'
Material  = require './material'

class MotorCylinder extends Pushable #Item
    
    isSpaceEgoistic: -> true
    
    @: (@face) ->
        super()   
        @value = 0.0
        @active = false
        @orientation = Face.orientationForFace @face
        @addAction new Action @, Action.TUCKER, "tucker", 500, Action.REPEAT
    
    setPosition: (pos) ->
        super pos
        @updateActive()
        
    createMesh: ->
                    
        @mesh   = new THREE.Mesh Geom.cylinder(), Material.plate
        @kolben = new THREE.Mesh Geom.kolben(),   Material.gear
        @mesh.add @kolben
        @mesh.receiveShadow = true
        @mesh.castShadow = true
    
    updateMesh: -> 
        @kolben.position.set 0, 0, -0.5 * Math.sin @value 
        @mesh.quaternion.copy Face.orientation @face
                
    setActive: (active) ->
        if @active != active
            @active = active
            if @active
                @startTimedAction @getActionWithId Action.TUCKER
            else
                @stopAction @getActionWithId Action.TUCKER
    
    initAction: (action) ->
        if action.id in [Action.PUSH, Action.FALL]
            @setActive false
            pos = @position.minus Face.normal @face
            occupant = world.getOccupantAtPos pos 
            MotorGear = require './motorgear'
            isGear = occupant instanceof MotorGear and occupant.face == @face
            klog "initAction isGear #{isGear}"
            occupant.setActive false if isGear
        super action
        
    performAction: (action) ->
        if action.id == Action.TUCKER
            relTime = action.getRelativeTime()
            @value = if relTime > 0.5 then 1.0 - relTime else relTime
            @value *= 2
            @updateMesh()
            return
        super action
    
    finishAction: (action) ->
        if action.id == Action.TUCKER
            world.playSound 'MOTOR', @getPos()
            return
        super action
        if action.id in [Action.PUSH, Action.FALL]
            @updateActive()
    
    updateActive: ->
        pos = @position.minus Face.normal @face
        occupant = world.getOccupantAtPos pos 
        MotorGear = require './motorgear'
        isGear = occupant instanceof MotorGear and occupant.face == @face
        # klog "isGear #{isGear}"
        @setActive isGear
        occupant.setActive true if isGear
        
module.exports = MotorCylinder
