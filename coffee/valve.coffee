# 000   000   0000000   000      000   000  00000000
# 000   000  000   000  000      000   000  000     
#  000 000   000000000  000       000 000   0000000 
#    000     000   000  000         000     000     
#     0      000   000  0000000      0      00000000

log        = require '/Users/kodi/s/ko/js/tools/log'
Quaternion = require './lib/quaternion'
Pushable   = require './pushable'
Action     = require './action'
Face       = require './face'

class Valve extends Pushable
    
    constructor: (@face) ->
        super
        @angle     = 0.0
        @active    = false
        @clockwise = false
        @addAction new Action @, Action.ROTATE, "rotation", 2000, Action.REPEAT
        # @startTimedAction @getActionWithId Action.ROTATE
    
    updateMesh: ->
        # log "Valve.updateMesh #{@angle} #{@face}"
        rot = Quaternion.rotationAroundVector (@clockwise and 1 or -1) * @angle, 0,0,1
        @mesh.quaternion.copy Face.orientationForFace(@face).mul rot
        
    setPosition: (pos) ->
        super pos
        p = @getPos()
        dir = @face % 3
        sum = ((dir == Face.Y or dir == Face.Z) and p.x or 0) + ((dir == Face.X or dir == Face.Z) and p.y or 0) + ((dir == Face.X or dir == Face.Y) and p.z or 0)
        @clockwise = sum % 2
        # log "Valve.setPosition sum #{sum} @clockwise #{@clockwise}", pos
               
    performAction: (action) ->
        switch action.id
            when Action.ROTATE 
                @angle += action.getRelativeDelta() * 360
                @updateMesh()
            else super action
    
module.exports = Valve
