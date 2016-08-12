
#   000   000   0000000   00000000   000      0000000  
#   000 0 000  000   000  000   000  000      000   000
#   000000000  000   000  0000000    000      000   000
#   000   000  000   000  000   000  000      000   000
#   00     00   0000000   000   000  0000000  0000000  
{
first,
last}       = require "/Users/kodi/s/ko/js/tools/tools"
log         = require "/Users/kodi/s/ko/js/tools/log"
Pos         = require './lib/pos'
Cell        = require './cell'
Light       = require './light'
Player      = require './player'
Quaternion  = require './lib/quaternion'
Vector      = require './lib/vector'
Pos         = require './lib/pos'
_           = require 'lodash'

world       = null

class World

    @CAMERA_INSIDE = 0 
    @CAMERA_BEHIND = 1 
    @CAMERA_FOLLOW = 2
    
    @levelList = []
    @levelDict = []
    
    constructor: (@view) -> 
        
        @renderer = new THREE.WebGLRenderer 
            antialias:              true
            logarithmicDepthBuffer: true
            autoClear:              true
                    
        @renderer.setClearColor 0x000000        
        @renderer.setSize @view.offsetWidth, @view.offsetHeight
        
        #    0000000   0000000   00     00  00000000  00000000    0000000 
        #   000       000   000  000   000  000       000   000  000   000
        #   000       000000000  000000000  0000000   0000000    000000000
        #   000       000   000  000 0 000  000       000   000  000   000
        #    0000000  000   000  000   000  00000000  000   000  000   000
        
        @fov    = 60
        @near   = 0.1
        @far    = 1000
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
        @geom  = new THREE.BoxGeometry 10, 10, 10
        
        #   000      000   0000000   000   000  000000000
        #   000      000  000        000   000     000   
        #   000      000  000  0000  000000000     000   
        #   000      000  000   000  000   000     000   
        #   0000000  000   0000000   000   000     000   

        @sun = new THREE.PointLight 0xffffff
        @sun.position.copy @camera.position
        @scene.add @sun
        
        @ambient = new THREE.AmbientLight 0x444444
        @scene.add @ambient
                #         
        @preview = false
        
        @display_list    = 0
        @objects         = []
        @lights          = []
        @moved_objects   = []
        @cells           = [] 
        @size            = new Pos()
        @depth           = -Number.MAX_SAFE_INTEGER
        @camera_mode     = World.CAMERA_BEHIND
        @edit_projection = null
        @edit_mode       = false
        @debug_camera    = false
        @debug_cells     = false
    
        @raster_size     = 0.1
    
    @init: (view) ->
        return if world?
                
        global.rot0    = new Quaternion()
        global.rotz180 = Quaternion.rotationAroundVector(180, Vector(0,0,1))
        global.rotz90  = Quaternion.rotationAroundVector(90,  Vector(0,0,1))
        global.roty270 = Quaternion.rotationAroundVector(270, Vector(0,1,0))
        global.roty180 = Quaternion.rotationAroundVector(180, Vector(0,1,0))
        global.roty90  = Quaternion.rotationAroundVector(90,  Vector(0,1,0))
        global.roty0   = Quaternion.rotationAroundVector(0,   Vector(0,1,0))
        global.rotx180 = Quaternion.rotationAroundVector(180, Vector(1,0,0))
        global.rotx90  = Quaternion.rotationAroundVector(90,  Vector(1,0,0))
        
        # 000      00000000  000   000  00000000  000       0000000
        # 000      000       000   000  000       000      000     
        # 000      0000000    000 000   0000000   000      0000000 
        # 000      000          000     000       000           000
        # 0000000  00000000      0      00000000  0000000  0000000 
        
        @levelList = [
              # intro
              # "start", 
              "steps", 
              #"move", "electro", "elevate", 
              # "throw", 
              # easy
              "gold", "jump", "escape", "gears", 
              # "gamma", 
              "cube", "switch", "borg", 
              "mini", 
              # "blocks", 
              "bombs", "sandbox", "energy", "maze", "love", 
              # medium
              "towers", "edge", "random", "plate", "nice", "entropy", 
              # owen hay's levels (TODO: sort in)
              "grasp", "fallen", "cheese", "invisimaze", "spiral", 
              # difficult
              "slick", "bridge", "flower", "stones", "walls", "grid", 
              "rings", 
              # "core", 
              "bronze", "pool", 
              # tough
              "hidden", "church", 
              # "strange", 
              "mesh", "columns", "machine", 
              # very hard
              # "neutron", 
              "captured", "circuit", "regal", "conductor", "evil", 
              # outro
              "mutants", 
             ]
                   
               
        # import the levels
        for levelName in @levelList
            @levelDict[levelName] = require "./levels/#{levelName}"
            
        # log 'levelDict', @levelDict
        log "create world in view:", view
        world = new World view
        global.world = world
        world.create first @levelList
        world

    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
        
    create: (worldDict={}) -> # creates the world from a level name or a dictionary
        
        log "world.create", worldDict
        
        if worldDict
            if _.isString worldDict
                @level_index = World.levelList.indexOf worldDict
                @level_name = worldDict
                @dict = World.levelDict[worldDict]
            else
                @dict = worldDict
            
        # ............................................................ appearance
        
        @setSize @dict["size"]
        log "world size set", @size
        # if "scheme" in @dict
            # @applyColorScheme eval(@dict["scheme"])
        # else
            # @applyColorScheme default_scheme

        # if "border" in @dict
            # border = @dict["border"]
        # else
            # border = 1

        # @setDisplayBorder border

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

        if @dict.exits? and false
            log "exits"
            exit_id = 0
            for entry in @dict.exits
                exit_gate = new KikiGate entry["active"]
                
                if "name" in entry
                    name = entry["name"]
                else
                    name = "exit "+str(exit_id)
                exit_gate.setName name 

                exit_action  = once "exit " + str(exit_id) 
                delay_action = once (a=exit_action) -> Controller.timer_event.addAction(a) 
                # exit_gate.getEventWithName("enter").addAction(delay_action)
                if entry.position?
                    pos = @decenter entry.position
                else if "coordinates" in entry
                    pos = new Pos entry.coordinates
                @addObjectAtPos exit_gate, pos
                exit_id += 1

        # ............................................................ creation

        if @dict.create?
            log "create"
            if _.isFunction @dict.create
                @dict.create()
            # else
                # exec @dict["create"] in globals()

        # ............................................................ player

        player = new Player
#         
        # player_dict = @dict["player"]
#         
        # if "orientation" in player_dict
            # player.setOrientation (player_dict["orientation"])
        # else
            # player.setOrientation (roty90)
#             
        # if "position" in player_dict
            # @addObjectAtPos player, @decenter(player_dict["position"])
        # else if "coordinates" in player_dict
            # pos = player_dict["coordinates"]
            # @addObjectAtPos player, Pos(pos[0], pos[1], pos[2])

        # if "nostatus" in player_dict
            # if player_dict["nostatus"] or @preview
                # Controller.player_status.hide()
            # else
                # Controller.player_status.show()
        # else
            # if @preview
                # Controller.player_status.hide()
            # else
                # Controller.player_status.show()
#         
        # @getProjection().setPosition(KVector())

        # Controller.player.getStatus().setMinMoves (highscore.levelParMoves (@level_name))
        # Controller.player.getStatus().setMoves (0)

        # ............................................................ init
        # @init() # tell the world that we are finished

    restart: (self) ->
        # restores the player status and restarts the current level
        @player.status.setMoves 0
        @player.reborn()
        @create()

    finish: (self) ->
        # saves the current level status in highscore file
        highscore.levelFinished world.level_name, Controller.player.getStatus().getMoves()

    resetPlayer: (self) ->
        # reset the player to it's original position and orientation
        
        player_dict = @dict["player"]
        player = Controller.getPlayer()
        
        if "reset orientation" in player_dict
            player.setOrientation player_dict["reset orientation"]
        else if "orientation" in player_dict
            player.setOrientation player_dict["orientation"]
        else
            player.setOrientation rot0
            
        if "reset position" in player_dict
            world.moveObjectToPos player, world.decenter(player_dict["reset position"])
        else
            world.moveObjectToPos player, world.decenter(player_dict["position"])
            
    performAction: (name, time) ->
        # action callback. used to exit current world
        if name.find ("exit") == 0
            @finish()
            @player.status.setMoves 0
            if "world" in @dict["exits"][parseInt name.slice 5]
                w = @dict["exits"][parseInt name.slice 5]["world"]
                if w instanceof World
                    w.create()
                else if _.isFunction w
                    w()
                else
                    exec "World().create(" + world + ")"
            else
                KikiPyWorld().create (levelList[world.level_index+1])

    activate: (objectName) ->
        # activates object with name objectName
        object = @getObjectWithName(objectName)
        if object.getClassName() == "KikiSwitch"
            kikiObjectToSwitch(object).setActive(1)
        else if object.getClassName() == "KikiGate"
            kikiObjectToGate(object).setActive(1)
    
    decenter: (x,y,z) -> new Pos(x,y,z).plus @size.div 2

    isValidPos: (pos) -> pos.x >= 0 and pos.x < @size.x and pos.y >= 0 and pos.y < @size.y and pos.z >= 0 and pos.z < @size.z
    isInvalidPos: (pos) -> not @isValidPos pos

    addObjectLine: (object, sx,sy,sz, ex,ey,ez) ->
        if sx instanceof Pos
            start = sx
            end   = sy
        else
            start = new Pos sx,sy,sz
            end   = new Pos ex,ey,ez
        # adds a line of objects of type to the world. start and end should be 3-tuples or Pos objects
        if start instanceof Pos
            start = [start.x, start.y, start.z]
        [sx, sy, sz] = start
        if end instanceof Pos
            end = [end.x, end.y, end.z]
        [ex, ey, ez] = end
        
        diff = [ex-sx, ey-sy, ez-sz]
        maxdiff = _.max diff.map Math.abs
        deltas = diff.map (a) -> a/maxdiff
        for i in [0...maxdiff]
            # pos = apply(Pos, (map (lambda a, b: int(a+i*b), start, deltas)))
            pos = new Pos (start[j]+i*deltas[j] for j in [0..2])
            if @isUnoccupiedPos pos
                if type(object) == types.StringType
                    @addObjectAtPos eval(object), pos
                else
                    @addObjectAtPos object(), pos
       
    addObjectPoly: (object, points, close=1) ->
        # adds a polygon of objects of type to the world. points should be 3-tuples or Pos objects
        if close
            points.append (points[0])
        for index in range(1, len(points))
            @addObjectLine object, points[index-1], points[index]
       
    addObjectRandom: (object, number) ->
        # adds number objects of type at random positions to the world
        for i in [0...number]
            if type (object) == types.StringType
                @setObjectRandom (eval(object))
            else
                @setObjectRandom (object())
        
    setObjectRandom: (object) ->
        # adds number objects of type at random positions to the world
        object_set = 0
        while not object_set                                   # hack alert!
            random_pos = Pos random.randrange(@size.x),
                             random.randrange(@size.y),
                             random.randrange(@size.z)
            if not object.isSpaceEgoistic() or @isUnoccupiedPos(random_pos)
                @addObjectAtPos object, random_pos
                object_set = 1
    
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

    toggle: (objectName) ->
        # toggles object with name objectName
        Controller.startTimedAction(@getObjectWithName(objectName).getActionWithName("toggle"))
    
    escape: (self) -> # handles an ESC key event
        
        @resetProjection()
        
        if "escape" in @dict
            if _.isFunction @dict["escape"]
                @dict["escape"]()
            else
                exec @dict["escape"] in globals()
            return

        menu = KikiMenu()
        menu.getEventWithName ("hide").addAction (once(@resetProjection))
        
        # if Controller.isDebugVersion()
            # menu.addItem (Controller.getLocalizedString("next level"), once(lambda w=self: w.performAction("exit 0",0)))
        # if "help" in @dict
            # menu.addItem (Controller.getLocalizedString("help"), once(@help))
        menu.addItem(Controller.getLocalizedString("restart"), once(@restart))
        
        esc_menu_action = once (@escape)
        console.out("level_index %d" % world.level_index)
        menu.addItem(Controller.getLocalizedString("load level"), (i=world.level_index,a=esc_menu_action) -> levelSelection(i, a))
        menu.addItem(Controller.getLocalizedString("setup"), once(quickSetup))        
        menu.addItem(Controller.getLocalizedString("about"), once(display_about))
        menu.addItem(Controller.getLocalizedString("quit"), once(Controller.quit))

    setSize: (size) ->
        @deleteAllObjects()
        @cells = []
    
        @size = new Pos size
        
        # calcuate max distance (for position relative sound)
        @max_distance = Math.max(@size.x, Math.max(@size.y, @size.z))  # heuristic of a heuristic :-)

    getCellAtPos: (pos) -> return @cells[@posToIndex(pos)] if @isValidPos pos
    getBotAtPos:  (pos) -> @getObjectOfTypeAtPos KikiBot, pos

    posToIndex:   (pos) -> pos.x * @size.z * @size.y + pos.y * @size.z + pos.z
    indexToPos:   (index) -> 
        lsize = @size.z * @size.y
        lrest = index % lsize
        new Pos index/lsize, lrest/@size.z, lrest%@size.z
    
    getObjectsOfType:      (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectsOfTypeAtPos: (clss, pos) -> @getCellAtPos(pos)?.getObjectsOfType clss
    getObjectOfTypeAtPos:  (clss, pos) -> @getCellAtPos(pos)?.getRealObjectOfType clss
    getOccupantAtPos:            (pos) -> @getCellAtPos(pos)?.getOccupant()
    getRealOccupantAtPos: (pos) ->
        occupant = @getOccupantAtPos pos
        if occupant and occupant instanceof KikiTmpObject
            occupant.object
        else
            occupant

    setObjectAtPos: (object, pos) ->
        if @isInvalidPos pos
            log "World.setObjectAtPos invalid pos:", pos
            return
    
        cell = @getCellAtPos pos
        log "world.setObjectAtPos", cell
    
        if object.isSpaceEgoistic() and cell and cell.getOccupant()
            objectAtNewPos = cell.getOccupant()
            if objectAtNewPos instanceof KikiTmpObject
                if objectAtNewPos.time > 0
                    log "WARNING World.setObject already occupied pos:", pos
                    # "already occupied by %s with time %d!",
                    # object.getClassName(), pos.x, pos.y, pos.z, 
                    # cell.getOccupant().getClassName(),
                    # ((KikiTmpObject*)objectAtNewPos).time)
            objectAtNewPos.del() # temporary object at new pos will vanish anyway . delete it
        
        cell = @getCellAtPos pos
        if not cell?
            cell = new Cell()
            @cells[@posToIndex(pos)] = cell
            log "world.setObjectAtPos new cell", cell
        
        object.setPosition pos
        cell.addObject object

    unsetObject: (object) ->
        pos = object.getPos()
        if cell = @getCellAtPos pos 
            cell.removeObject object
            if cell.isEmpty()
                # delete cell
                @cells[posToIndex(pos)] = null

    newObject: (object) ->
        if _.isString object
            log "newObject:", object
            if object.startsWith 'Kiki'
                return new (require "./#{object.slice(4).toLowerCase()}")()
        object
        
    addObject: (object) ->
        object = @newObject object
        if object instanceof Light
            @lights.push object # if lights.indexOf(object) < 0
        else
            @objects.push object # if objects.indexOf(object) < 0 

    addObjectAtPos: (object, x, y, z) ->
        pos = new Pos x, y, z
        log "world.addObjectAtPos", pos
        object = @newObject object
        @setObjectAtPos object, pos
        @addObject object

    removeObject: (object) ->
        @unsetObject object
        _.pull @lights, object
        _.pull @objects, object
    
    moveObjectToPos: (object, pos) ->
        return false if @isInvalidPos(pos) or @isOccupiedPos(pos)
    
        @unsetObject    object
        @setObjectAtPos object, pos
    
        # Controller.sound.playSound(KikiSound::BOT_LAND)
    
        true

    deleteObject: (object) ->
        if not object?
            log "WARNING: World.deleteObject null"
            return
        @removeObject object
        object.del()
    
    deleteAllObjects: () ->
        @picked_pickable = null
        @moved_objects = []
    
        # if Controller.player
            # Controller.player.finishRotateAction()
            # @removeObject (Controller.player) # remove the player first, to keep it's state
            # Controller.timer_event.removeAllActions ()
            # Controller.removeKeyHandler (Controller.player) # prevent keyboard input while building world
            # Controller.player.reset ()
    
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
                log "WARNING World.deleteAllObjects object no auto remove"
                @objects.pop()
    
    deleteObjectsWithClassName: (className) ->
        for o in _.clone @objects
            if className == o.getClassName()
                o.del()
    
    getObjectWithName: (objectName) ->
        for o in @objects
            if objectName == o.getName()
                return o
        log "World.getObjectWithName :: no object found with name #{objectName}"
        null
    
    setCameraMode: (mode) -> @camera_mode = clamp CAMERA_INSIDE, CAMERA_FOLLOW, mode
    
    changeCameraMode: () -> @camera_mode = (@camera_mode+1) % (CAMERA_FOLLOW+1)
    
    objectMovedFromPos: (object, pos) ->
    
        if cell = @getCellAtPos(pos)
            if tmpObject = cell.getObjectOfType KikiTmpObject 
                if tmpObject.object == object
                    tmpObject.del()
        @moved_objects.push object 
    
    objectWillMoveToPos: (object, pos, duration) ->
        cell = @getCellAtPos pos
    
        if @isInvalidPos pos
            log "objectWillMoveToPos invalid pos:", pos
        
        if object.getPos() == pos
            log "WARNING objectWillMoveToPos equal pos:", pos
            return
    
        if cell
            if objectAtNewPos = cell.getOccupant()
                if objectAtNewPos instanceof KikiTmpObject
                    tmpObject = objectAtNewPos
                    
                    if (objectAtNewPos.time < 0 and -objectAtNewPos.time <= duration)
                        # temporary object at new pos will vanish before object will arrive . delete it
                        objectAtNewPos.del()
                    else
                        log "World.objectWillMoveToPos timing conflict at pos:", pos
                else
                    log "World.objectWillMoveToPos already occupied:", pos 
    
        @unsetObject object # remove object from cell grid
        
        tmpObject = new KikiTmpObject object  # insert temporary objects at new pos
        tmpObject.setPosition pos 
        tmpObject.time = duration
        @addObjectAtPos tmpObject, pos 
        
        tmpObject = new KikiTmpObject object  # insert temporary objects at old pos
        tmpObject.setPosition object.getPosition() 
        tmpObject.time = -duration
        @addObjectAtPos tmpObject, object.getPos() 
    
    updateStatus: () ->

        while @moved_objects.length
            movedObject = last @moved_objects
            pos = new Pos movedObject.position
    
            if @isInvalidPos pos
                 log "World.updateStatus invalid new pos"
                 return
    
            if tmpObject = @getObjectOfTypeAtPos KikiTmpObject, pos 
                if tmpObject.object == movedObject
                    tmpObject.del()
                else
                    log "World.updateStatus wrong tmp object at pos:", pos
            else if @isOccupiedPos pos
                log "World.updateStatus object moved to occupied pos:", pos
                    
            @setObjectAtPos movedObject, pos 
            @moved_objects.pop()
    
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
        if true
            quat = @camera.quaternion.clone()
            quat.multiply (new THREE.Quaternion).setFromAxisAngle(new THREE.Vector3(1,0,0), step.dsecs*0.2)
            quat.multiply (new THREE.Quaternion).setFromAxisAngle(new THREE.Vector3(0,1,0), step.dsecs*0.1)
            center = @decenter 0,0,0
            @camera.position.set(center.x,center.y,center.z+@dist).applyQuaternion quat
            @camera.quaternion.copy quat

        @sun.position.copy @camera.position
        @renderer.render @scene, @camera

    setSpeed: (s) -> @speed = s
    getSpeed: -> @speed
    mapMsTime:  (unmapped) -> parseInt 10.0 * unmapped/speed
    unmapMsTime: (mapped) -> parseInt mapped * speed/10.0
    getRelativeTime: -> @frame_time % (10000/@speed)/(10000.0/@speed)
    getRelativeDelta: -> (@frame_time - @last_time)/(10000.0/@speed)

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

    resized: (w,h) ->
        @aspect = w/h
        @camera?.aspect = @aspect
        @camera?.updateProjectionMatrix()
        @renderer?.setSize w,h

    getNearestValidPos: (pos) ->
        new KikiPos Math.min(size.x-1, Math.max(pos.x, 0)), 
                    Math.min(size.y-1, Math.max(pos.y, 0)), 
                    Math.min(size.z-1, Math.max(pos.z, 0))
    
    isUnoccupiedPos: (pos) ->
        return false if @isInvalidPos pos
        not @getOccupantAtPos pos
    
    isOccupiedPos: (pos) -> not @isUnoccupiedPos pos
    
    # returns true, if a pushable object is at pos and may be pushed
    mayObjectPushToPos: (object, pos, duration) ->
        return false if @isInvalidPos pos
        
        direction = pos.minus object.getPos() # direction from object to pushable object
        
        return false if @isInvalidPos pos.plus @direction
        
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
    
        if pushableObject? and pushableObject instanceof Pushable and
                                pushableObject instanceof MotorGear # bad
            pushableObject.pushedByObjectInDirection object, direction, duration
            return true
    
        false
    
    reinit: () ->
        for o in @objects
            if o instanceof Light
                o.initialize()
        
        # Spikes::initialize()
        # Text::reinit()
    
    getInsideWallPosWithDelta: (pos, delta) ->
        insidePos = new Vector pos
        for w in [0..5]
            planePos = new Vector -0.5, -0.5, -0.5
            if w >= 3 then planePos.add size
        
            f = kRayPlaneIntersectionFactor pos, -@normals[w], planePos, @normals[w]
            
            if f < delta
                insidePos.add new Vector (delta-f)*@normals[w]
        
        insidePos
    
    # returns the distance to the next wall (positive or negative)
    getWallDistanceForPos: (pos) ->
        
        min_f = 10000
        for w in [0..5] 
            planePos = new Vector -0.5, -0.5, -0.5
            if w >= 3 then planePos.add size
        
            f = kRayPlaneIntersectionFactor pos, -@normals[w], planePos, @normals[w]
            
            min_f = kAbsMin min_f, f 
        min_f
    
    # returns the distace to the next wall in direction rayDirection from rayPos (positive values only)
    getWallDistanceForRay: (rayPos, rayDirection) ->
        
        min_f = 10000
        for w in [0..5]
            planePos -0.5, -0.5, -0.5
            if w >= 3 then planePos.add size
        
            f = kRayPlaneIntersectionFactor rayPos, rayDirection, planePos, @normals[w]
            
            min_f = f if f >= 0.0 and f < min_f
        min_f
    
    displayLights: () ->
        for light in @lights
            lignt.display()
    
    displayWall: (width, height) ->
        l = @raster_size/2.0
        t = 1.0 - l
    
        # if flags[DISPLAY_RASTER] == false
            # l = 0.0; t = 1.0
        
        glNormal3f 0.0, 0.0, 1.0 
        for w in [0..width]
            for h in [0..height]
                glRectf w+l, h+l, w+t, h+t
    
    getProjection: () ->
        if @projection == NULL
            switch @camera_mode 
                when CAMERA_INSIDE then @projection = @player.getProjection()     
                when CAMERA_BEHIND then @projection = @player.getBehindProjection()
                when CAMERA_FOLLOW then @projection = @player.getFollowProjection()
        @projection
    
    display: (mode) ->
        switch @camera_mode 
            when CAMERA_INSIDE then @projection = @player.getProjection()
            when CAMERA_BEHIND then @projection = @player.getBehindProjection()
            when CAMERA_FOLLOW then @projection = @player.getFollowProjection()
    
        @player_projection = @projection
        
        @projection.initProjection()
    
        # glDisable(GL_BLEND);
        # glDisable(GL_DEPTH_TEST);
        # glDisable(GL_ALPHA_TEST);
        # glDisable(GL_NORMALIZE);
#         
        # # colors[World_plate_color].glColor();
#         
        # glTranslatef(-0.5, -0.5, -0.5);
#         
        # displayWall(size.x, size.y); # xy+z
        # glRotatef(180.0, 0.0, 1.0, 0.0);
        # glTranslatef(-size.x, 0.0, -size.z);
        # displayWall(size.x, size.y); # xy-z
#         
        # glRotatef(90.0, 1.0, 0.0, 0.0); # xz-y
        # glTranslatef(0.0, 0.0, -size.y);
        # displayWall(size.x, size.z);
        # glRotatef(180.0, 0.0, 1.0, 0.0); # xz+y
        # glTranslatef(-size.x, 0.0, -size.y);
        # displayWall(size.x, size.z);
#         
        # glRotatef(-90.0, 0.0, 1.0, 0.0); # yz+x
        # glTranslatef(0.0, 0.0, -size.x);
        # displayWall(size.y, size.z);
        # glRotatef(180.0, 1.0, 0.0, 0.0); # yz-x          
        # glTranslatef(0.0, -size.z, -size.x); 
        # displayWall(size.y, size.z);

module.exports = World
