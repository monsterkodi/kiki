
#   000   000   0000000   00000000   000      0000000  
#   000 0 000  000   000  000   000  000      000   000
#   000000000  000   000  0000000    000      000   000
#   000   000  000   000  000   000  000      000   000
#   00     00   0000000   000   000  0000000  0000000  
{
absMin,
randrange,
clamp,
first,
last}       = require "/Users/kodi/s/ko/js/tools/tools"
log         = require "/Users/kodi/s/ko/js/tools/log"
Pos         = require './lib/pos'
Size        = require './lib/size'
Cell        = require './cell'
Gate        = require './gate'
Light       = require './light'
Levels      = require './levels'
Player      = require './player'
Cage        = require './cage'
Timer       = require './timer'
Actor       = require './actor'
Item        = require './item'
Action      = require './action'
TmpObject   = require './tmpobject'
Pushable    = require './pushable'
Quaternion  = require './lib/quaternion'
Vector      = require './lib/vector'
Pos         = require './lib/pos'
_           = require 'lodash'
now         = require 'performance-now'

world       = null

class World extends Actor

    @CAMERA_INSIDE = 0 
    @CAMERA_BEHIND = 1 
    @CAMERA_FOLLOW = 2
    
    @levels = null
    
    @normals = [
            new Vector 1, 0, 0
            new Vector 0, 1, 0 
            new Vector 0, 0, 1
            new Vector -1,0, 0 
            new Vector 0,-1, 0 
            new Vector 0, 0,-1
    ]
    
    constructor: (@view) ->
                
        @speed       = 6
        
        @raster_size = 0.05
        # @camera_mode     = World.CAMERA_INSIDE
        @camera_mode     = World.CAMERA_BEHIND
        # @camera_mode     = World.CAMERA_FOLLOW

        super
        
        @noRotations = true
        
        @screenSize = new Size @view.clientWidth, @view.clientHeight
        # log "view @screenSize:", @screenSize
        
        @renderer = new THREE.WebGLRenderer 
            antialias:              true
            logarithmicDepthBuffer: true
            autoClear:              true
            sortObjects:            true
                    
        @renderer.setClearColor 0x000000        
        @renderer.setSize @view.offsetWidth, @view.offsetHeight
        @renderer.shadowMap.type = THREE.PCFSoftShadowMap
        
        #    0000000   0000000   00     00  00000000  00000000    0000000 
        #   000       000   000  000   000  000       000   000  000   000
        #   000       000000000  000000000  0000000   0000000    000000000
        #   000       000   000  000 0 000  000       000   000  000   000
        #    0000000  000   000  000   000  00000000  000   000  000   000
        
        @fov    = 90
        @near   = 0.1
        @far    = 20
        @aspect = @view.offsetWidth / @view.offsetHeight
        @dist   = 10
        
        @camera = new THREE.PerspectiveCamera @fov, @aspect, @near, @far
        @camera.position.z = @dist
        
        #    0000000   0000000  00000000  000   000  00000000
        #   000       000       000       0000  000  000     
        #   0000000   000       0000000   000 0 000  0000000 
        #        000  000       000       000  0000  000     
        #   0000000    0000000  00000000  000   000  00000000
        
        @scene = new THREE.Scene()
        
        #   000      000   0000000   000   000  000000000
        #   000      000  000        000   000     000   
        #   000      000  000  0000  000000000     000   
        #   000      000  000   000  000   000     000   
        #   0000000  000   0000000   000   000     000   

        @sun = new THREE.PointLight 0xffffff
        @sun.position.copy @camera.position
        @scene.add @sun
        
        @ambient = new THREE.AmbientLight 0x111111
        @scene.add @ambient
         
        @preview         = false
        @objects         = []
        @lights          = []
        @cells           = [] 
        @size            = new Pos()
        @depth           = -Number.MAX_SAFE_INTEGER
     
    @deinit: () ->
        world = null
       
    @init: (view) ->
        return if world?
        
        @initGlobal()
            
        world = new World view
        world.name = 'world'
        global.world = world
        Timer.init()
        world.create first @levels.list
        world
        
    @initGlobal: () ->
        
        return if @levels?
              
        global.rot0    = Quaternion.rot_0
        global.rotx90  = Quaternion.rot_90_X
        global.roty90  = Quaternion.rot_90_Y
        global.rotz90  = Quaternion.rot_90_Z
        global.rotx180 = Quaternion.rot_180_X
        global.roty180 = Quaternion.rot_180_Y
        global.rotz180 = Quaternion.rot_180_Z
        global.rotx270 = Quaternion.rot_270_X
        global.roty270 = Quaternion.rot_270_Y
        global.rotz270 = Quaternion.rot_270_Z

        @levels = new Levels
        
    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
        
    create: (worldDict={}) -> # creates the world from a level name or a dictionary
        
        # log "world.create", worldDict
        
        if worldDict
            if _.isString worldDict
                @level_index = World.levels.list.indexOf worldDict
                @level_name = worldDict
                @dict = World.levels.dict[worldDict]
            else
                @dict = worldDict
            
        # ............................................................ appearance
        
        @setSize @dict["size"] # this removes all objects
        
        # log "world size set", @size
        
        # if "scheme" in @dict
            # @applyColorScheme eval(@dict["scheme"])
        # else
            # @applyColorScheme default_scheme

        # ............................................................ intro text   
        # if "intro" in @dict
            # if not @preview
                # intro_text = KikiScreenText()
                # intro_text.addText @dict["intro"]
                # intro_text.show()
            # @setName @dict["intro"]
        # else
            # @setName "noname"
        
        # if @preview
            # @getProjection().setViewport(0.0, 0.4, 1.0, 0.6)
        # else
            # @getProjection().setViewport(0.0, 0.0, 1.0, 1.0)
        
        # ............................................................ escape
        # escape_event = Controller.getEventWithName ("escape")
        # escape_event.removeAllActions()
        # escape_event.addAction(continuous(@escape, "escape"))

        # ............................................................ exits

        if @dict.exits?
            exit_id = 0
            for entry in @dict.exits
                exit_gate = new Gate entry["active"]
                exit_gate.name = entry["name"] ? "exit #{exit_id}"
                exitAction = new Action 
                    func: @exitLevel
                    name: "exit #{exit_id}"
                    mode: Action.ONCE

                exit_gate.getEventWithName("enter").addAction exitAction
                if entry.position?
                    pos = @decenter entry.position
                else if entry.coordinates?
                    pos = new Pos entry.coordinates
                @addObjectAtPos exit_gate, pos
                exit_id += 1

        # ............................................................ creation

        if @dict.create?
            if _.isFunction @dict.create
                @dict.create()
            else
                log "World.create [WARNING] @dict.create not a function!"
                # exec @dict["create"] in globals()

        # ............................................................ player

        @player = new Player
        # log "player_dict", player_dict
        @player.setOrientation @dict.player.orientation ? rotx90

        if @dict.player.position?
            @addObjectAtPos @player, @decenter @dict.player.position
        else if @dict.player.coordinates?
            @addObjectAtPos @player, new Pos @dict.player.coordinates

        # if player_dict.nostatus?
            # if player_dict.nostatus or @preview
                # @player_status.hide()
            # else
                # @player_status.show()
        # else
            # if @preview
                # Controller.player_status.hide()
            # else
                # Controller.player_status.show()
#         
        @getProjection().setPosition new Vector 0,0,0

        # @player.getStatus().setMinMoves (highscore.levelParMoves (@level_name))
        # @player.getStatus().setMoves (0)

        # ............................................................ init
        # @init() # tell the world that we are finished

    restart: () ->
        # restores the player status and restarts the current level
        @player.status.setMoves 0
        @player.reborn()
        @create()

    finish: () ->
        log 'world.levelFinished'
        # saves the current level status in highscore file
        # highscore.levelFinished world.level_name, Controller.player.getStatus().getMoves()
    
    #  000      000   0000000   000   000  000000000
    #  000      000  000        000   000     000   
    #  000      000  000  0000  000000000     000   
    #  000      000  000   000  000   000     000   
    #  0000000  000   0000000   000   000     000   
    
    addLight: (light) ->
        @lights.push light
        @enableShadows true if light.shadow
        
    removeLight: (light) ->
        _.pull @lights, light
        for l in @lights
            shadow = true if l.shadow
        @enableShadows shadow

    enableShadows: (enable) ->
        @renderer.shadowMap.enabled = enable
    
    #    0000000    0000000  000000000  000   0000000   000   000
    #   000   000  000          000     000  000   000  0000  000
    #   000000000  000          000     000  000   000  000 0 000
    #   000   000  000          000     000  000   000  000  0000
    #   000   000   0000000     000     000   0000000   000   000
          
    exitLevel: (action) =>
        log "world.exitLevel", action       
        @finish()
        # @player.status.setMoves 0
        # exitIndex = parseInt action.name?.slice 5
        # log "world.exitLevel exitIndex:#{exitIndex}"
        # if @dict.exits[exitIndex]?.world?
            # w = @dict.exits[exitIndex].world
            # w() if _.isFunction w
        # else
        log "world.level_index #{world.level_index} nextLevel #{World.levels.list[world.level_index+1]}"
        world.create World.levels.list[world.level_index+1]

    activate: (objectName) ->
        # activates object with name objectName
        object = @getObjectWithName objectName 
        object?.setActive? 1
    
    decenter: (x,y,z) -> new Pos(x,y,z).plus @size.div 2

    isValidPos: (pos) -> 
        p = new Pos pos
        p.x >= 0 and p.x < @size.x and p.y >= 0 and p.y < @size.y and p.z >= 0 and p.z < @size.z
        
    isInvalidPos: (pos) -> not @isValidPos pos

    #    0000000  00000000  000      000       0000000
    #   000       000       000      000      000     
    #   000       0000000   000      000      0000000 
    #   000       000       000      000           000
    #    0000000  00000000  0000000  0000000  0000000 
    
    setSize: (size) ->
        @deleteAllObjects()
        @cells = []
        @size = new Pos size
        # calcuate max distance (for position relative sound)
        @max_distance = Math.max(@size.x, Math.max(@size.y, @size.z))  # heuristic of a heuristic :-)
        @cage?.del()
        @cage = new Cage @size, @raster_size

    getCellAtPos: (pos) -> return @cells[@posToIndex(pos)] if @isValidPos pos
    getBotAtPos:  (pos) -> @getObjectOfTypeAtPos KikiBot, new Pos pos

    posToIndex:   (pos) -> 
        p = new Pos pos
        p.x * @size.z * @size.y + p.y * @size.z + p.z
        
    indexToPos:   (index) -> 
        lsize = @size.z * @size.y
        lrest = index % lsize
        new Pos index/lsize, lrest/@size.z, lrest%@size.z
    
    #  0000000   0000000    0000000         0000000   0000000          000  00000000   0000000  000000000
    # 000   000  000   000  000   000      000   000  000   000        000  000       000          000   
    # 000000000  000   000  000   000      000   000  0000000          000  0000000   000          000   
    # 000   000  000   000  000   000      000   000  000   000  000   000  000       000          000   
    # 000   000  0000000    0000000         0000000   0000000     0000000   00000000   0000000     000   
    
    addObjectAtPos: (object, x, y, z) ->
        pos = new Pos x, y, z
        object = @newObject object
        @setObjectAtPos object, pos
        # log "addObjectAtPos #{object.name}", pos
        @addObject object

    addObjectLine: (object, sx,sy,sz, ex,ey,ez) ->
        # log "world.addObjectLine sx:#{sx} sy:#{sy} sz:#{sz} ex:#{ex} ey:#{ey} ez:#{ez}"
        if sx instanceof Pos or Array.isArray sx
            start = sx
            end   = sy
        else
            start = new Pos sx,sy,sz
            end   = new Pos ex,ey,ez
        # adds a line of objects of type to the world. start and end should be 3-tuples or Pos objects
        if end instanceof Pos
            end = [end.x, end.y, end.z]
        [ex, ey, ez] = end

        if start instanceof Pos
            start = [start.x, start.y, start.z]
        [sx, sy, sz] = start
        
        # log "world.addObjectLine sx:#{sx} sy:#{sy} sz:#{sz} ex:#{ex} ey:#{ey} ez:#{ez}"
        
        diff = [ex-sx, ey-sy, ez-sz]
        maxdiff = _.max diff.map Math.abs
        deltas = diff.map (a) -> a/maxdiff
        for i in [0...maxdiff]
            # pos = apply(Pos, (map (lambda a, b: int(a+i*b), start, deltas)))
            pos = new Pos (start[j]+i*deltas[j] for j in [0..2])
            # log "addObjectLine #{i}:", pos
            if @isUnoccupiedPos pos
                @addObjectAtPos object, pos
       
    addObjectPoly: (object, points, close=1) ->
        # adds a polygon of objects of type to the world. points should be 3-tuples or Pos objects
        if close
            points.push points[0]
        for index in [1...points.length]
            @addObjectLine object, points[index-1], points[index]
       
    addObjectRandom: (object, number) ->
        # adds number objects of type at random positions to the world
        for i in [0...number]
            if _.isString object
                @setObjectRandom eval object 
            else
                @setObjectRandom object()
        
    setObjectRandom: (object) ->
        # adds number objects of type at random positions to the world
        object_set = 0
        while not object_set                                   # hack alert!
            random_pos = Pos randrange(@size.x),
                             randrange(@size.y),
                             randrange(@size.z)
            if not object.isSpaceEgoistic() or @isUnoccupiedPos(random_pos)
                @addObjectAtPos object, random_pos
                object_set = 1

    #  0000000   0000000          000  00000000   0000000  000000000   0000000
    # 000   000  000   000        000  000       000          000     000     
    # 000   000  0000000          000  0000000   000          000     0000000 
    # 000   000  000   000  000   000  000       000          000          000
    #  0000000   0000000     0000000   00000000   0000000     000     0000000 
        
    getObjectsOfType:      (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectsOfTypeAtPos: (clss, pos) -> @getCellAtPos(pos)?.getObjectsOfType clss
    getObjectOfTypeAtPos:  (clss, pos) -> @getCellAtPos(pos)?.getRealObjectOfType clss
    getOccupantAtPos:            (pos) -> 
        # log "getOccupantAtPos cell? #{@getCellAtPos(pos)?}", pos
        @getCellAtPos(pos)?.getOccupant()
    getRealOccupantAtPos: (pos) ->
        occupant = @getOccupantAtPos pos
        if occupant and occupant instanceof TmpObject
            occupant.object
        else
            occupant

    setObjectAtPos: (object, pos) ->
        pos = new Pos pos
        if @isInvalidPos pos
            log "World.setObjectAtPos [WARNING] invalid pos:", pos
            return
    
        if object.isSpaceEgoistic()
            if cell = @getCellAtPos pos
                if occupant = cell.getOccupant()
                    if occupant instanceof TmpObject
                        if occupant.time > 0
                            log "World.setObjectAtPos [WARNING] already occupied pos:", pos
                            log "World.setObjectAtPos [WARNING] already occupied time:", occupant.time
                        occupant.del() # temporary object at new pos will vanish anyway . delete it
        
        cell = @getCellAtPos pos
        if not cell?
            cellIndex = @posToIndex(pos)
            cell = new Cell()
            # log "created cell at index #{cellIndex}"
            @cells[cellIndex] = cell
        
        object.setPosition pos
        cell.addObject object

    unsetObject: (object) ->
        pos = object.getPos()
        # log "world.unsetObject #{object.name} pos:", pos
        if cell = @getCellAtPos pos
            cell.removeObject object
            if cell.isEmpty()
                # log 'world.unsetObject remove cell empty cell', pos
                @cells[@posToIndex(pos)] = null
        else 
            log 'world.unsetObject [WARNING] no cell at pos:', pos

    newObject: (object) ->
        if _.isString object
            if object.startsWith 'Kiki'
                return new (require "./#{object.slice(4).toLowerCase()}")()
            return new (require "./#{object.toLowerCase()}")()
        if object instanceof Item
            return object
        else
            return object()
        
    addObject: (object) ->
        object = @newObject object
        if object instanceof Light
            @lights.push object # if lights.indexOf(object) < 0
        else
            @objects.push object # if objects.indexOf(object) < 0 

    removeObject: (object) ->
        @unsetObject object
        _.pull @lights, object
        _.pull @objects, object
    
    moveObjectToPos: (object, pos) ->
        return false if @isInvalidPos(pos) or @isOccupiedPos(pos)
    
        @unsetObject    object
        @setObjectAtPos object, pos
        world.playSound 'BOT_LAND'
        true
        
    toggle: (objectName) ->
        # toggles object with name objectName
        object = @getObjectWithName objectName 
        log "world.toggle #{objectName} #{object?}"
        # @startTimedAction object.getActionWithName "toggle"  
        object.getActionWithName("toggle").perform()
    
    #   0000000    00000000  000      00000000  000000000  00000000
    #   000   000  000       000      000          000     000     
    #   000   000  0000000   000      0000000      000     0000000 
    #   000   000  000       000      000          000     000     
    #   0000000    00000000  0000000  00000000     000     00000000
    
    deleteObject: (object) ->
        # log "world.deleteObject #{object.name}"
        if not object?
            log "world.deleteObject [WARNING] no object?"
            return
        @removeObject object
        object.del()
    
    deleteAllObjects: () ->
        # log 'world.deleteAllObjects'
        
        Timer.removeAllActions()
    
        if @player?
            @player.del()
    
        while @lights.length
            oldSize = @lights.length
            last(@lights).del() # destructor will call remove object
            if oldSize == @lights.length
                log "WARNING World.deleteAllObjects light no auto remove"
                @lights.pop()
    
        while @objects.length
            oldSize = @objects.length
            last(@objects).del() # destructor will call remove object
            if oldSize == @objects.length
                log "WARNING World.deleteAllObjects object no auto remove #{last(@objects).name}"
                @objects.pop()
    
    deleteObjectsWithClassName: (className) ->
        for o in _.clone @objects
            if className == o.getClassName()
                o.del()
    
    getObjectWithName: (objectName) ->
        for o in @objects
            if objectName == o.name
                return o
        log "World.getObjectWithName :: no object found with name #{objectName}"
        null
    
    setCameraMode: (mode) -> @camera_mode = clamp World.CAMERA_INSIDE, World.CAMERA_FOLLOW, mode
    
    changeCameraMode: () -> 
        @camera_mode = (@camera_mode+1) % (World.CAMERA_FOLLOW+1)
        log "world.changeCameraMode #{@camera_mode}"
        @camera_mode
    
    #    0000000   0000000          000        00     00   0000000   000   000  00000000
    #   000   000  000   000        000        000   000  000   000  000   000  000     
    #   000   000  0000000          000        000000000  000   000   000 000   0000000 
    #   000   000  000   000  000   000        000 0 000  000   000     000     000     
    #    0000000   0000000     0000000         000   000   0000000       0      00000000
        
    objectWillMoveToPos: (object, pos, duration) ->
        
        sourcePos = object.getPos()
        targetPos = new Pos pos
        
        # log "world.objectWillMoveToPos #{object.name} #{duration}", targetPos
        
        if @isInvalidPos targetPos
            log "world.objectWillMoveToPos [WARNING] #{object.name} invalid targetPos:", targetPos
            return
        
        if sourcePos.eql targetPos
            log "world.objectWillMoveToPos [WARNING] #{object.name} equal pos:", targetPos
            return
        
        targetCell = @getCellAtPos pos
        if targetCell
            if objectAtNewPos = targetCell.getOccupant()
                if objectAtNewPos instanceof TmpObject
                    if objectAtNewPos.time < 0 and -objectAtNewPos.time <= duration
                        # temporary object at new pos will vanish before object will arrive . delete it
                        objectAtNewPos.del()
                    else
                        log "world.objectWillMoveToPos [WARNING] #{object.name} timing conflict at pos:", targetPos
                else
                    log "world.objectWillMoveToPos [WARNING] #{object.name} already occupied:", targetPos 
    
        if object.name != 'player'
            # log "---------- tmpObjects not player? #{object.name}"
            @unsetObject object # remove object from cell grid
            
            # log 'tmpObject at old pos', sourcePos
            tmpObject = new TmpObject object  # insert tmp object at old pos
            tmpObject.setPosition sourcePos
            tmpObject.time = -duration
            @addObjectAtPos tmpObject, sourcePos 

            # log 'tmpObject at new pos', targetPos 
            tmpObject = new TmpObject object  # insert tmp object at new pos
            tmpObject.setPosition targetPos 
            tmpObject.time = duration
            @addObjectAtPos tmpObject, targetPos 

    objectMoved: (movedObject, from, to) ->
        sourcePos = new Pos from
        targetPos = new Pos to

        if @isInvalidPos targetPos
             log "World.objectMoved [WARNING] #{movedObject.name} invalid targetPos:", targetPos
             return
        
        # log "world.objectMoved #{movedObject.name}", sourcePos
        
        sourceCell = @getCellAtPos sourcePos
        targetCell = @getCellAtPos targetPos
        
        if tmpObject = sourceCell?.getObjectOfType TmpObject 
            tmpObject.del() if tmpObject.object == movedObject

        if tmpObject = targetCell?.getObjectOfType TmpObject 
            tmpObject.del() if tmpObject.object == movedObject
            
        if @isOccupiedPos targetPos
            log "World.objectMoved [WARNING] #{movedObject.name} occupied target pos:", targetPos
            
        # log 'World.objectMovedFromPos sourcePos:', sourcePos
        # log 'World.objectMovedFromPos targetPos:', targetPos
                
        if sourceCell?
            sourceCell.removeObject movedObject
            if sourceCell.isEmpty()
                # log 'world.objectMoved remove empty cell at pos:', sourcePos
                @cells[@posToIndex(sourcePos)] = null
        
        targetCell = @getCellAtPos targetPos    
        if not targetCell?
            cellIndex = @posToIndex targetPos 
            targetCell = new Cell()
            # log "world.objectMoved created cell at index #{cellIndex}", targetPos 
            @cells[cellIndex] = targetCell

        if targetCell?
            # log "add #{movedObject.name} to targetCell at pos", targetPos
            targetCell.addObject movedObject
        else
            log "world.objectMoved [WARNING] #{movedObject.name} no target cell?"
    
    setObjectColor: (color_name, color) ->
        if color_name == 'base'
            # KikiWall::setObjectColor "base", color 
            @colors[0] = color
        else if color_name == 'plate'
            # KikiWall::setObjectColor "plate", color 
            @colors[1] = color
        
    #  0000000  000000000  00000000  00000000       
    # 000          000     000       000   000      
    # 0000000      000     0000000   00000000       
    #      000     000     000       000            
    # 0000000      000     00000000  000          
    
    step: (step) ->
        if false
            quat = @camera.quaternion.clone()
            quat.multiply new THREE.Quaternion().setFromAxisAngle new THREE.Vector3(1,0,0), step.dsecs*0.2
            quat.multiply new THREE.Quaternion().setFromAxisAngle new THREE.Vector3(0,1,0), step.dsecs*0.1
            center = @size.div 2
            @camera.position.set(center.x,center.y,center.z+@dist).applyQuaternion quat
            @camera.quaternion.copy quat

        Timer.event.triggerActions()
        Timer.event.finishActions()
        
        o.step?(step) for o in @objects

        switch @camera_mode 
            when World.CAMERA_INSIDE then @projection = @player.getInsideProjection()
            when World.CAMERA_BEHIND then @projection = @player.getBehindProjection()
            when World.CAMERA_FOLLOW then @projection = @player.getFollowProjection()
        @player.setOpacity clamp 0, 1, @projection.getPosition().minus(@player.current_position).length()-0.4
        @projection.apply @camera
        @sun.position.copy @camera.position
        @renderer.render @scene, @camera
    
    #   000000000  000  00     00  00000000
    #      000     000  000   000  000     
    #      000     000  000000000  0000000 
    #      000     000  000 0 000  000     
    #      000     000  000   000  00000000
    
    getTime: -> now().toFixed 0
    setSpeed: (s) -> @speed = s
    getSpeed: -> @speed
    mapMsTime:  (unmapped) -> parseInt 10.0 * unmapped/@speed
    unmapMsTime: (mapped) -> parseInt mapped * @speed/10.0
        
    continuous: (cb) ->
        new Action 
            func: cb
            name: "continuous"
            mode: Action.CONTINUOUS

    once: (cb) ->
        new Action 
            func: cb
            name: "once"
            mode: Action.ONCE

    # 00000000   00000000   0000000  000  0000000  00000000  0000000  
    # 000   000  000       000       000     000   000       000   000
    # 0000000    0000000   0000000   000    000    0000000   000   000
    # 000   000  000            000  000   000     000       000   000
    # 000   000  00000000  0000000   000  0000000  00000000  0000000  
    
    resized: (w,h) ->
        @aspect = w/h
        @camera?.aspect = @aspect
        @camera?.updateProjectionMatrix()
        @renderer?.setSize w,h
        @screenSize = new Size w,h

    getNearestValidPos: (pos) ->
        new KikiPos Math.min(size.x-1, Math.max(pos.x, 0)), 
                    Math.min(size.y-1, Math.max(pos.y, 0)), 
                    Math.min(size.z-1, Math.max(pos.z, 0))
    
    isUnoccupiedPos: (pos) -> not @isOccupiedPos pos
    isOccupiedPos:   (pos) ->        
        if @isInvalidPos pos
            return true
        if @getOccupantAtPos pos
            # log "isOccupiedPos occupant: #{@getOccupantAtPos(pos).name} at pos:", new Pos pos
            return true
    
    mayObjectPushToPos: (object, pos, duration) ->
        # log "world.mayObjectPushToPos object:#{object.name} duration:#{duration}", pos
        # returns true, if a pushable object is at pos and may be pushed
        return false if @isInvalidPos pos
        
        direction = pos.minus object.getPos() # direction from object to pushable object
        
        return false if @isInvalidPos pos.plus direction
        
        objectAtNewPos = @getOccupantAtPos pos.plus direction
        if objectAtNewPos
            if objectAtNewPos instanceof TmpObject
                tmpObject = objectAtNewPos
                
                if tmpObject.time < 0 and -tmpObject.time <= duration
                    # temporary object at new pos will vanish before object will arrive -> delete it
                    tmpObject.del()
                else return false
            else return false
    
        pushableObject = @getOccupantAtPos pos
        # log "pushableObject #{pushableObject?.name}"
        if pushableObject? and pushableObject instanceof Pushable #and
                                # pushableObject instanceof MotorGear # bad
            pushableObject.pushedByObjectInDirection object, direction, duration
            return true
    
        false
    
    reinit: () ->
        for o in @objects
            if o instanceof Light
                o.initialize()
        
        # Spikes::initialize()
        # Text::reinit()
        
    #   000   000  00000000  000      00000000 
    #   000   000  000       000      000   000
    #   000000000  0000000   000      00000000 
    #   000   000  000       000      000      
    #   000   000  00000000  0000000  000      
    
    help: (index=0) ->
        # displays help messages

        # text_list = @dict["help"]
        # more_text = index < len (text_list) - 1
        # less_text = index > 0
#         
        # list = text_list[index].split("$key(")     
        # for i in range (1, len(list))
            # close = list[i].find(")")
            # list[i] = Controller.player.getKeyForAction (list[i][:close]) + list[i][close+1:]
#                          
        # list.append ("\n\n$scale(0.5)(%d/%d)" % (index+1, len (text_list)))
        # help_text = KikiPageText ("".join(list), more_text, less_text)
#             
        # if more_text:
            # help_text.getEventWithName ("next").addAction (once (lambda i=index+1: @help (i)))
        # if less_text:
            # help_text.getEventWithName ("previous").addAction (once (lambda i=index-1: @help (i)))
 
    outro: (index=0) ->
        # well hidden outro :-)
        outro_text = """
                    $scale(1.5)congratulations!\n\n$scale(1)you rescued\nthe nano world!
                    
                    the last dumb mutant bot\nhas been destroyed.\n\nthe maker is functioning again.
                    kiki will go now\nand see all his new friends.\n\nyou should maybe\ndo the same?
                    the maker wants to thank you!\n\n(btw.: you thought\nyou didn't see\nkiki's maker in the game?
                    you are wrong!\nyou saw him\nall the time,\nbecause kiki\nlives inside him!)\n\n$scale(1.5)the end
                    p.s.: the maker of the game\nwants to thank you as well!\n\ni definitely want your feedback:
                    please send me a mail (monsterkodi@users.sf.net)\nwith your experiences,
                    which levels you liked, etc.\n\nthanks in advance and have a nice day,\n\nyours kodi
                    """
        
        more_text = index < outro_text.length-1
        less_text = index > 0
        
        page_text = outro_text[index]
        page_text += "\n\n$scale(0.5)(#{index+1}/#{outro_text.length})"
    
        page = KikiPageText(page_text, more_text, less_text)
        page.getEventWithName("hide").addAction(once(display_main_menu))
        
        if more_text
            page.getEventWithName("next").addAction (i=index+1) => @outro i
        if less_text
            page.getEventWithName("previous").addAction (i=index-1) => @outro i
        
    resetProjection: -> world.getProjection().setViewport 0.0, 0.0, 1.0, 1.0
    
    #   00000000   0000000   0000000
    #   000       000       000     
    #   0000000   0000000   000     
    #   000            000  000     
    #   00000000  0000000    0000000
    
    escape: (self) -> # handles an ESC key event
        
        @resetProjection()
        
        if "escape" in @dict
            if _.isFunction @dict["escape"]
                @dict["escape"]()
            else
                exec @dict["escape"] in globals()
            return

        menu = new Menu()
        menu.getEventWithName("hide").addAction once @resetProjection 
        
        # if Controller.isDebugVersion()
            # menu.addItem (Controller.getLocalizedString("next level"), once(lambda w=self: w.performAction("exit 0",0)))
        # if "help" in @dict
            # menu.addItem (Controller.getLocalizedString("help"), once(@help))
        menu.addItem(Controller.getLocalizedString("restart"), once(@restart))
        
        esc_menu_action = once @escape
        log "level_index #{world.level_index}"
        menu.addItem(Controller.getLocalizedString("load level"), (i=world.level_index,a=esc_menu_action) -> levelSelection(i, a))
        menu.addItem(Controller.getLocalizedString("setup"), once @quickSetup)        
        menu.addItem(Controller.getLocalizedString("about"), once @display_about)
        menu.addItem(Controller.getLocalizedString("quit"), once world.quit)
    
    #   000   000   0000000   000      000    
    #   000 0 000  000   000  000      000    
    #   000000000  000000000  000      000    
    #   000   000  000   000  000      000    
    #   00     00  000   000  0000000  0000000
    
    getInsideWallPosWithDelta: (pos, delta) ->
        insidePos = new Vector pos
        for w in [0..5]
            planePos = new Vector -0.5, -0.5, -0.5
            if w >= 3 then planePos.add @size
            f = Vector.rayPlaneIntersectionFactor pos, World.normals[w].neg(), planePos, World.normals[w]
            if f < delta
                insidePos.add World.normals[w].mul delta-f
        insidePos
    
    getWallDistanceForPos: (pos) -> # distance to the next wall (positive or negative)
        min_f = 10000
        for w in [0..5] 
            planePos = new Vector -0.5, -0.5, -0.5
            if w >= 3 then planePos.add @size
            f = Vector.rayPlaneIntersectionFactor pos, World.normals[w].neg(), planePos, World.normals[w]
            min_f = absMin min_f, f 
        min_f
    
    getWallDistanceForRay: (rayPos, rayDir) -> # distance to the next wall in rayDir 
        min_f = 10000
        for w in [0..5]
            planePos = new Vector -0.5, -0.5, -0.5
            if w >= 3 then planePos.add @size
            f = Vector.rayPlaneIntersectionFactor rayPos, rayDir, planePos, World.normals[w]
            min_f = f if f >= 0.0 and f < min_f
        min_f
    
    displayLights: () ->
        for light in @lights
            lignt.display()
        
    getProjection: () ->
        if not @projection
            switch @camera_mode 
                when World.CAMERA_INSIDE then @projection = @player.getInsideProjection()     
                when World.CAMERA_BEHIND then @projection = @player.getBehindProjection()
                when World.CAMERA_FOLLOW then @projection = @player.getFollowProjection()
        @projection
       
    playSound: (sound, pos, time) -> # log "World.playSound #{sound} #{time}", pos 
    
    #   000   000  00000000  000   000
    #   000  000   000        000 000 
    #   0000000    0000000     00000  
    #   000  000   000          000   
    #   000   000  00000000     000   
    
    modKeyComboEventDown: (mod, key, combo, event) ->
        return if @player?.modKeyComboEventDown mod, key, combo, event
        switch combo
            when '=' then @speed = Math.min 10, @speed+1
            when '-' then @speed = Math.max 1,  @speed-1

    modKeyComboEventUp: (mod, key, combo, event) ->
        return if @player?.modKeyComboEventUp mod, key, combo, event        

module.exports = World
