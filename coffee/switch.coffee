#  0000000  000   000  000  000000000   0000000  000   000
# 000       000 0 000  000     000     000       000   000
# 0000000   000000000  000     000     000       000000000
#      000  000   000  000     000     000       000   000
# 0000000   00     00  000     000      0000000  000   000

Quaternion = require './lib/quaternion'
Vector     = require './lib/vector'
Action     = require './action'
Light      = require './light'
Item       = require './item'
Material   = require './material'

class Switch extends Item

    isSpaceEgoistic: -> false
    
    @: (active=false) ->

        super
    
        @angle = 0
        @light = null
        @active = null
        @sound_on  = 'SWITCH_ON'
        @sound_off = 'SWITCH_OFF'
        
        @SWITCH_OFF_EVENT = @addEventWithName "off"
        @SWITCH_ON_EVENT  = @addEventWithName "on"
        @SWITCHED_EVENT   = @addEventWithName "switched"
    
        @addAction new Action @, Action.TOGGLE, "toggle" 0
        @addAction new Action @, Action.ROTATE, "rotation" 2000 Action.CONTINUOUS
    
        @setActive active

    del: ->
        
        @mesh.geometry.dispose()
        @tors.geometry.dispose()
        @light?.del()
        super

    createMesh: ->
        
        torusRadius = 0.05
        t1 = new THREE.TorusBufferGeometry 0.5-torusRadius, torusRadius, 16, 32
        @mesh = new THREE.Mesh t1, Material.switch
        @mesh.castShadow = true
        @mesh.receiveShadow = true
     
        t2 = new THREE.TorusBufferGeometry 0.5-torusRadius, torusRadius, 16, 32
        t2.rotateY Vector.DEG2RAD 90 
        @tors = new THREE.Mesh t2, Material.switch
        @tors.castShadow = true
        @tors.receiveShadow = true
        @mesh.add @tors
        @mesh
        
    bulletImpact: -> @setActive not @active
        
    lightDeleted: -> @light = null
    
    createLight: -> 
        
        return if @light
        @light = new Light 
            pos: @position
            radius: 6.0
    
    toggle: -> @setActive not @active
    
    setActive: (status) ->
        
        if @active != status
            @active = status
            
            if @active
                # start the orbit rotation
                @startTimedAction @getActionWithId Action.ROTATE 
                world.playSound @sound_on
                @events[@SWITCH_ON_EVENT].triggerActions()
                @createLight()
                @light.on 'deleted' @lightDeleted
            else
                @stopAction @getActionWithId Action.ROTATE
                
                world.playSound @sound_off
                @events[@SWITCH_OFF_EVENT].triggerActions()
    
                if @light 
                    @light.del()
                    @light = null
                    
            @events[@SWITCHED_EVENT].triggerActions()
    
    setPosition: (pos) ->
        
        super pos
        @light?.setPosition @position
    
    animate: (f) ->
        
        @angle += f * 360
        @mesh.quaternion.copy Quaternion.rotationAroundVector @angle, Vector.unitY
        @tors.quaternion.copy Quaternion.rotationAroundVector @angle/2, Vector.unitZ
        
    performAction: (action) ->
        
        if action.id == Action.TOGGLE
            @toggle()
        else
            @animate action.getRelativeDelta()
    
module.exports = Switch
