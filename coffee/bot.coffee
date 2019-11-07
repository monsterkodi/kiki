# 0000000     0000000   000000000
# 000   000  000   000     000   
# 0000000    000   000     000   
# 000   000  000   000     000   
# 0000000     0000000      000   

{ klog } = require 'kxk'
Pushable   = require './pushable'
Action     = require './action'
Timer      = require './timer'
Bullet     = require './bullet'
Pos        = require './lib/pos'
Vector     = require './lib/vector'
Quaternion = require './lib/quaternion'
Material   = require './material'

class Bot extends Pushable
        
    @: () ->
                
        @direction           = new Vector
        @orientation         = new Quaternion
        @current_orientation = new Quaternion
        @rotate_orientation  = new Quaternion
        @climb_orientation   = new Quaternion
        @rest_orientation    = new Quaternion
        
        @lastActionDelta = 0.0
            
        @left_tire_rot   = 0.0
        @right_tire_rot  = 0.0
            
        @minMoves = 100

        @move       = false
        @push       = false
        @jump       = false
        @shoot      = false
        @jump_once  = false
        @died       = false
        
        @move_action   = null
        @rotate_action = null
        
        @dir_sgn       = 1.0
        
        super 

        @addAction new Action @, Action.FORWARD,      "move forward",   200
        @addAction new Action @, Action.CLIMB_UP,     "climb up",       200
        @addAction new Action @, Action.CLIMB_DOWN,   "climb down",     500
        @addAction new Action @, Action.TURN_LEFT,    "turn left",      200
        @addAction new Action @, Action.TURN_RIGHT,   "turn right",     200
        @addAction new Action @, Action.JUMP,         "jump",           120
        @addAction new Action @, Action.JUMP_FORWARD, "jump forward",   200
        @addAction new Action @, Action.FALL_FORWARD, "fall forward",   200
        @addAction new Action @, Action.SHOOT,        "shoot",          200, Action.REPEAT
    
        @getActionWithId(Action.FALL).duration = 120
        @addEventWithName "died"
    
        @startTimedAction @getActionWithId(Action.NOOP), 500
        
    createMesh: ->
        
        tireRadius = 0.05
        nose = new THREE.ConeGeometry 0.404, 0.5, 32, 16, true
        geom = new THREE.SphereGeometry 0.5, 32, 32, 16, Math.PI
        geom = new THREE.SphereGeometry 0.5, 32, 32, 0, 2*Math.PI, 0, 2.2
        
        nmatr = new THREE.Matrix4()
        trans = new THREE.Vector3 0,-0.543,0
        rot   = new THREE.Quaternion().setFromEuler new THREE.Euler Vector.DEG2RAD(180), 0, 0
        
        nmatr.compose trans, rot, new THREE.Vector3 1,1,1
        geom.merge nose, nmatr
        geom.rotateX Vector.DEG2RAD -90
        geom.scale 0.7, 0.7, 0.7
           
        Mutant = require './mutant'         
        mutant = @ instanceof Mutant
        @mesh = new THREE.Mesh geom, mutant and Material.mutant.clone() or Material.player

        geom = new THREE.TorusGeometry 0.5-tireRadius, tireRadius, 16, 32
        geom.scale 1,1,2.5
        tireMat = mutant and Material.mutantTire.clone() or Material.tire
        @leftTire = new THREE.Mesh geom, tireMat
        @leftTire.position.set 0.35,0,0 
        @leftTire.rotation.set 0, Vector.DEG2RAD(90), 0
        @mesh.add @leftTire

        @rightTire = new THREE.Mesh geom, tireMat
        @rightTire.position.set -0.35,0,0 
        @rightTire.rotation.set 0, Vector.DEG2RAD(-90), 0
        @mesh.add @rightTire

        @mesh.castShadow = @rightTire.castShadow = @leftTire.castShadow = true
        @mesh.receiveShadow = @leftTire.receiveShadow = @rightTire.receiveShadow = true 
            
    setOpacity: (opacity) -> 
        tireMat = @leftTire.material
        botMat = @mesh.material
        tireMat.visible = opacity > 0
        tireMat.depthWrite = opacity > 0.5
        botMat.depthWrite = opacity > 0.5
        botMat.opacity = opacity
        tireMat.opacity = opacity
    
    # 0000000    000  00000000   00000000   0000000  000000000  000   0000000   000   000
    # 000   000  000  000   000  000       000          000     000  000   000  0000  000
    # 000   000  000  0000000    0000000   000          000     000  000   000  000 0 000
    # 000   000  000  000   000  000       000          000     000  000   000  000  0000
    # 0000000    000  000   000  00000000   0000000     000     000   0000000   000   000

    getDown: -> @orientation.rotate Vector.minusY
    getUp:   -> @orientation.rotate Vector.unitY
    getDir:  -> @orientation.rotate new Vector 0,0,@dir_sgn
  
    currentPos:  -> @current_position.clone()
    currentDir:  -> @current_orientation.rotate(Vector.unitZ).normal()
    currentUp:   -> @current_orientation.rotate(Vector.unitY).normal()
    currentLeft: -> @current_orientation.rotate(Vector.unitX).normal()

    # 0000000    000  00000000
    # 000   000  000  000     
    # 000   000  000  0000000 
    # 000   000  000  000     
    # 0000000    000  00000000
    
    die: () ->
        Timer.removeActionsOfObject @
        
        @move  = false
        @jump  = false
        @shoot = false
        @push  = false
    
        @getEventWithName("died").triggerActions()
        @died  = true
    
    # 00000000   00000000   0000000  00000000  000000000
    # 000   000  000       000       000          000   
    # 0000000    0000000   0000000   0000000      000   
    # 000   000  000            000  000          000   
    # 000   000  00000000  0000000   00000000     000   
    
    reset: () ->
    
        @left_tire_rot   = 0.0
        @right_tire_rot  = 0.0
    
        @direction.reset()
        @orientation.reset()
        @current_orientation.reset()
        @rotate_orientation.reset()
        @climb_orientation.reset()
        @rest_orientation.reset()
    
        @move_action = null
        @move        = false
        @push        = false
        @jump        = false
        @shoot       = false
        @jump_once   = false
        @died        = false
    
    isFalling: -> @move_action and @move_action.id == Action.FALL
    
    #  0000000    0000000  000000000  000   0000000   000   000
    # 000   000  000          000     000  000   000  0000  000
    # 000000000  000          000     000  000   000  000 0 000
    # 000   000  000          000     000  000   000  000  0000
    # 000   000   0000000     000     000   0000000   000   000
    
    initAction: (action) ->
        newPos = new Pos @position 
        # klog "initAction #{action.name} pos", newPos
        # klog "initAction #{action.name}"
        
        switch action.id
            when Action.NOOP         then return
            when Action.FORWARD      then newPos.add @getDir()
            when Action.CLIMB_DOWN   then newPos.add @getDir().plus @getDown()
            when Action.JUMP         then newPos.add @getUp()
            when Action.JUMP_FORWARD then newPos.add @getUp().plus @getDir()
            when Action.FALL_FORWARD then newPos.add @getDown().plus @getDir()
            when Action.FALL
                if not @direction.isZero()
                    super action 
                    return
                newPos.add @getDown()
            else
                super action
                return
    
        if not newPos.eql new Pos @position
            # klog 'bot.initAction objectWillMoveToPos:', newPos
            world.objectWillMoveToPos @, newPos, action.getDuration()
    
    # 00000000   00000000  00000000   00000000   0000000   00000000   00     00
    # 000   000  000       000   000  000       000   000  000   000  000   000
    # 00000000   0000000   0000000    000000    000   000  0000000    000000000
    # 000        000       000   000  000       000   000  000   000  000 0 000
    # 000        00000000  000   000  000        0000000   000   000  000   000
    
    performAction: (action) ->
        
        relTime  = action.getRelativeTime()  # @current / @getDuration() 
        dltTime  = action.getRelativeDelta() # (@current-@last) / @getDuration()
    
        @lastActionDelta = dltTime
                
        cosFac = Math.cos Math.PI/2 - Math.PI/2 * relTime
        sinFac = Math.sin Math.PI/2 * relTime
        
        switch action.id
            when Action.SHOOT
                if relTime == 0
                    Bullet.shootFromBot @
                
            when Action.NOOP then return
            
            when Action.FORWARD
    
                @left_tire_rot  += @dir_sgn * dltTime
                @right_tire_rot += @dir_sgn * dltTime
                # log 'r:' relTime
                @current_position = @position.plus @getDir().mul(relTime)
                return
            
            when Action.JUMP
            
                @current_position = @position.plus @getUp().mul(sinFac)
                return
                    
            when Action.JUMP_FORWARD
        
                @left_tire_rot  += 1 - Math.cos(Math.PI/2 * dltTime)
                @right_tire_rot += 1 - Math.cos(Math.PI/2 * dltTime)
                @current_position = @position.plus @getDir().mul(relTime).plus @getUp().mul(sinFac) 
                return
                
            when Action.FALL_FORWARD
        
                @current_position = @position.plus @getDir().mul(relTime).plus @getDown().mul(relTime)
                return
    
            when Action.FALL
        
                if not @direction.isZero()
                    super action
                    return
                klog 'still needed?'
                @current_position = @position.plus @getDown().mul(relTime)
                return
        
            when Action.CLIMB_UP
        
                @left_tire_rot  += @dir_sgn * dltTime/2
                @right_tire_rot += @dir_sgn * dltTime/2
                @climb_orientation = Quaternion.rotationAroundVector @dir_sgn * relTime * -90.0, Vector.unitX
                break
            
            when Action.CLIMB_DOWN
        
                @left_tire_rot  += @dir_sgn * dltTime
                @right_tire_rot += @dir_sgn * dltTime
                if relTime <= 0.2
                    @current_position = @position.plus @getDir().mul (relTime/0.2)/2
                else if (relTime >= 0.8)
                    @climb_orientation = Quaternion.rotationAroundVector @dir_sgn * 90.0, Vector.unitX
                    @current_position = @position.plus @getDir().plus @getDown().mul 0.5+(relTime-0.8)/0.2/2
                else
                    @climb_orientation = Quaternion.rotationAroundVector @dir_sgn * (relTime-0.2)/0.6 * 90.0, Vector.unitX
                    rotVec = (@orientation.mul @climb_orientation).rotate Vector.unitY
                    @current_position = @position.plus @getDir().plus(@getDown()).plus(rotVec).mul 0.5
                break
        
            when Action.TURN_RIGHT, Action.TURN_LEFT
    
                if @move_action == null and relTime == 0.0 # if not performing move action and start of rotation
                    # update @orientation now, so next move action will move in desired @direction
                    if action.id == Action.TURN_LEFT
                        @orientation = @orientation.mul Quaternion.rotationAroundVector 90.0, Vector.unitY
                        @rest_orientation = Quaternion.rotationAroundVector -90.0, Vector.unitY
                    else
                        @orientation = @orientation.mul Quaternion.rotationAroundVector -90.0, Vector.unitY
                        @rest_orientation = Quaternion.rotationAroundVector 90.0, Vector.unitY
    
                if action.id == Action.TURN_LEFT
                    @left_tire_rot  += -dltTime
                    @right_tire_rot +=  dltTime
                    @rotate_orientation = Quaternion.rotationAroundVector relTime * 90.0, Vector.unitY 
                else
                    @left_tire_rot  +=  dltTime
                    @right_tire_rot += -dltTime
                    @rotate_orientation = Quaternion.rotationAroundVector relTime * -90.0, Vector.unitY 
                break
            
            else
                
                super action
                return
        
        @current_orientation = @orientation.mul @climb_orientation.mul @rotate_orientation.mul @rest_orientation
    
    # 00000000  000  000   000  000   0000000  000   000
    # 000       000  0000  000  000  000       000   000
    # 000000    000  000 0 000  000  0000000   000000000
    # 000       000  000  0000  000       000  000   000
    # 000       000  000   000  000  0000000   000   000
    
    finishAction: (action) ->
    
        # klog "Bot.finishAction #{action.id} #{action.name}" if action.name != 'noop'
                
        switch action.id
            when Action.NOOP, Action.SHOOT
                return
            when Action.PUSH, Action.FALL
                @move_action = null
                super action
                return
            when Action.TURN_LEFT, Action.TURN_RIGHT
                @rotate_action = null
                if @move_action # bot currently performing a move action -> store rotation in @rest_orientation
                    @rest_orientation = @rest_orientation.mul @rotate_orientation
                    @rotate_orientation.reset()
                else
                    @orientation = @orientation.mul @rotate_orientation.mul @rest_orientation # update rotation matrix
                    @rotate_orientation.reset()
                    @rest_orientation.reset()
                return
                
        return if action.id > Action.SHOOT
        
        @move_action = null
        
        @orientation = @orientation.mul @climb_orientation # update climb @orientation
        @climb_orientation.reset()
        
        if @rotate_action and action.id != Action.JUMP_FORWARD # bot is currently performing a rotation ->
            # take over result of rotation to prevent sliding
            if @rotate_action.id == Action.TURN_LEFT
                @orientation = @orientation.mul Quaternion.rotationAroundVector(90.0, new Vector(0,1,0)).mul @rest_orientation
                @rest_orientation = Quaternion.rotationAroundVector -90.0, Vector.unitY  
            else
                @orientation = @orientation.mul Quaternion.rotationAroundVector(-90.0, new Vector(0,1,0)).mul @rest_orientation
                @rest_orientation = Quaternion.rotationAroundVector 90.0, Vector.unitY  
                
        if action.id != Action.CLIMB_UP
            targetPos = @current_position.round()
            world.objectMoved @, @position, targetPos # update world @position
            @position = targetPos
                    
        if action.id != Action.JUMP_FORWARD and @rotate_action == null # if not jumping forward
            @orientation = @orientation.mul @rest_orientation # update rotation @orientation
            @rest_orientation.reset()
    
    # 00000000  000  000   000  000   0000000  000   000  00000000  0000000  
    # 000       000  0000  000  000  000       000   000  000       000   000
    # 000000    000  000 0 000  000  0000000   000000000  0000000   000   000
    # 000       000  000  0000  000       000  000   000  000       000   000
    # 000       000  000   000  000  0000000   000   000  00000000  0000000  
    
    actionFinished: (action) ->
        # klog "bot.actionFinished #{action.name} #{action.id}"
            
        if action.id == Action.PUSH and not @direction.isZero()
            klog 'super (Pushable) action!'
            super action
            return
    
        if @move_action? # action was not a move action -> return
            # klog 'bot.actionFinished was not a move action!'
            return 
        
        # find next action depending on type of finished action and surrounding environment
        if action.id == Action.JUMP_FORWARD
            forwardPos = @position.plus @getDir()
            if world.isUnoccupiedPos forwardPos # forward will be empty
                if world.isUnoccupiedPos forwardPos.minus @getUp() # below forward will also be empty
                    @move_action = @getActionWithId Action.FALL_FORWARD
                else
                    @move_action = @getActionWithId Action.FORWARD
                    world.playSound 'BOT_LAND', @getPos(), 0.25 
            else # forward will not be empty
                if world.isUnoccupiedPos @position.minus @getUp()  # below is empty
                    @move_action = @getActionWithId Action.CLIMB_UP
                    world.playSound 'BOT_LAND', @getPos(), 0.5
        else if world.isUnoccupiedPos @position.plus @getDown()  # below will be empty
            # klog 'bot.actionFinished below empty', world.isUnoccupiedPos(@position.plus @getDown()), @position.plus @getDown()
            if @move # sticky if moving
                if world.isUnoccupiedPos @position.plus @getDir()  # forward will be empty
                    # klog 'bot.actionFinished forward empty'
                    if world.isOccupiedPos @position.plus @getDir().minus @getUp() # below forward is solid
                        occupant = world.getOccupantAtPos @position.plus @getDir().minus @getUp() 
                        if not occupant? or not occupant?.isSlippery()
                            @move_action = @getActionWithId Action.FORWARD
                else
                    occupant = world.getOccupantAtPos @position.plus @getDir() 
                    if not occupant? or not occupant?.isSlippery()
                        @move_action = @getActionWithId Action.CLIMB_UP
            
            if not @move_action?
                @move_action = @getActionWithId Action.FALL
                @direction = @getDown()
                
        else if action.id in [Action.FALL_FORWARD, Action.FALL] # landed
            if @name == 'player'
                world.playSound 'BOT_LAND'
            else
                world.playSound 'BOT_LAND', @getPos()
        
        if @move_action?
            Timer.addAction @move_action
            return
        
        return if @rotate_action? 
        
        @fixOrientationAndPosition()

        if @move or @jump or @jump_once
            @moveBot()
        else
            @dir_sgn = 1
            @jump_once = false if action.id != Action.NOOP
            # klog "bot.actionFinished '#{action.name}' position:", @position if action.id in [Action.FORWARD, Action.JUMP_FORWARD, Action.CLIMB_DOWN]
            # klog "bot.actionFinished '#{action.name}' orientation:", @orientation.rounded().name if action.id in [Action.TURN_LEFT, Action.TURN_RIGHT, Action.CLIMB_UP]
            
            if world.getRealOccupantAtPos(@position.plus @getDown())?.isMutant?()
                # keep action chain flowinwg in order to detect environment changes
                klog 'bot.actionFinished mutant below: startTimedAction NOOP'
                @startTimedAction @getActionWithId(Action.NOOP), 0

    fixOrientationAndPosition: ->
        @setPosition @current_position.round()
        @setOrientation @current_orientation.round()

    # 00     00   0000000   000   000  00000000
    # 000   000  000   000  000   000  000     
    # 000000000  000   000   000 000   0000000 
    # 000 0 000  000   000     000     000     
    # 000   000   0000000       0      00000000
        
    moveBot: () ->
        # klog 'moveBot' @move, @move_action
        @move_action = null
        forwardPos = @position.plus @getDir()
        if @move and (@jump or @jump_once) and    # jump mode or jump activated while moving
            @dir_sgn == 1.0 and                     # and moving forward
                world.isUnoccupiedPos(@position.plus @getUp())  # and above empty
                    if world.isUnoccupiedPos(forwardPos.plus @getUp()) and
                        world.isUnoccupiedPos(forwardPos)  # forward and above forward also empty
                            @move_action = @getActionWithId Action.JUMP_FORWARD
                    else # no space to jump forward -> jump up
                        @move_action = @getActionWithId Action.JUMP
        else if @move 
            if world.isUnoccupiedPos forwardPos  # forward is empty
                if world.isUnoccupiedPos forwardPos.plus @getDown()  
                    # below forward also empty
                    @move_action = @getActionWithId Action.CLIMB_DOWN
                else # forward down is solid
                    @move_action = @getActionWithId Action.FORWARD
            else # forward is not empty
                moveAction = @getActionWithId Action.FORWARD
                if @push and world.mayObjectPushToPos @, forwardPos, moveAction.getDuration()
                    moveAction.reset()
                    # player in push mode and pushing object is possible
                    if world.isUnoccupiedPos forwardPos.plus @getDown()  # below forward is empty
                        @move_action = @getActionWithId Action.CLIMB_DOWN
                    else
                        @move_action = moveAction
                else # just climb up
                    @move_action = @getActionWithId Action.CLIMB_UP
        else if @jump or @jump_once
            if world.isUnoccupiedPos(@position.plus @getUp())
                @move_action = @getActionWithId Action.JUMP
        
        # reset the jump once flag (either we jumped or it's not possible to jump at current @position)
        @jump_once = false 
    
        if @move_action
            Timer.addAction @move_action
        
    #  0000000  000000000  00000000  00000000 
    # 000          000     000       000   000
    # 0000000      000     0000000   00000000 
    #      000     000     000       000      
    # 0000000      000     00000000  000      
        
    step: ->
        @mesh.position.copy @current_position
        @mesh.quaternion.copy @current_orientation
        @leftTire.rotation.set Vector.DEG2RAD(180*@left_tire_rot), Vector.DEG2RAD(90), 0
        @rightTire.rotation.set Vector.DEG2RAD(180*@right_tire_rot), Vector.DEG2RAD(-90), 0

module.exports = Bot
