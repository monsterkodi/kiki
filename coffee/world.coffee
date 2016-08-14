
#   000   000   0000000   00000000   000      0000000  
#   000 0 000  000   000  000   000  000      000   000
#   000000000  000   000  0000000    000      000   000
#   000   000  000   000  000   000  000      000   000
#   00     00   0000000   000   000  0000000  0000000  
{
absMin,
clamp,
first,
last}       = require "/Users/kodi/s/ko/js/tools/tools"
log         = require "/Users/kodi/s/ko/js/tools/log"
Pos         = require './lib/pos'
Size        = require './lib/size'
Cell        = require './cell'
Light       = require './light'
Player      = require './player'
Cage        = require './cage'
Timer       = require './timer'
Actor       = require './actor'
TmpObject   = require './tmpobject'
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
    
    @levelList = []
    @levelDict = []
    
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
        
        @screenSize = new Size @view.clientWidth, @view.clientHeight
        # log "view @screenSize:", @screenSize
        
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
        
        @fov    = 70
        @near   = 0.001
        @far    = 500
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
        @moved_objects   = []
        @cells           = [] 
        @size            = new Pos()
        @depth           = -Number.MAX_SAFE_INTEGER
            
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
              "start", 
              # "steps", 
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
        world.name = 'world'
        global.world = world
        Timer.init()
        world.create first @levelList
        world

    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
        
    create: (worldDict={}) -> # creates the world from a level name or a dictionary
        
        # log "world.create", worldDict
        
        if worldDict
            if _.isString worldDict
                @level_index = World.levelList.indexOf worldDict
                @level_name = worldDict
                @dict = World.levelDict[worldDict]
            else
                @dict = worldDict
            
        # ............................................................ appearance
        
        @setSize @dict["size"]
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

        if @dict.exits? and false
            log "exits"
            exit_id = 0
            for entry in @dict.exits
                exit_gate = new Gate entry["active"]
                
                if "name" in entry
                    name = entry["name"]
                else
                    name = "exit "+str(exit_id)
                exit_gate.setName name 

                exit_action  = once "exit " + str(exit_id) 
                delay_action = once (a=exit_action) -> Timer.addAction a  
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

        @player = new Player
        player_dict = @dict.player
        # log "player_dict", player_dict
        if player_dict.orientation?
            @player.setOrientation player_dict.orientation
        else
            @player.setOrientation roty90

        if player_dict.position?
            @addObjectAtPos @player, @decenter player_dict.position
        else if player_dict.coordinates?
            @addObjectAtPos @player, new Pos player_dict.coordinates

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

    restart: (self) ->
        # restores the player status and restarts the current level
        @player.status.setMoves 0
        @player.reborn()
        @create()

    finish: (self) ->
        # saves the current level status in highscore file
        highscore.levelFinished world.level_name, Controller.player.getStatus().getMoves()

    # 00000000   00000000   0000000  00000000  000000000      00000000   000       0000000   000   000  00000000  00000000 
    # 000   000  000       000       000          000         000   000  000      000   000   000 000   000       000   000
    # 0000000    0000000   0000000   0000000      000         00000000   000      000000000    00000    0000000   0000000  
    # 000   000  000            000  000          000         000        000      000   000     000     000       000   000
    # 000   000  00000000  0000000   00000000     000         000        0000000  000   000     000     00000000  000   000
    
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
      

    #    0000000    0000000  000000000  000   0000000   000   000
    #   000   000  000          000     000  000   000  0000  000
    #   000000000  000          000     000  000   000  000 0 000
    #   000   000  000          000     000  000   000  000  0000
    #   000   000   0000000     000     000   0000000   000   000
          
    performAction: (name, time) ->
        # log "world.performAction #{name}"
        # action callback. used to exit current world
        if /exit/.test name
            @finish()
            @player.status.setMoves 0
            if "world" in @dict["exits"][parseInt name.slice 5]
                w = @dict["exits"][parseInt name.slice 5]["world"]
                if w instanceof World
                    w.create()
                else if _.isFunction w
                    w()
                # else
                    # exec "World().create(" + world + ")"
            else
                world.create levelList[world.level_index+1]

    activate: (objectName) ->
        # activates object with name objectName
        object = @getObjectWithName objectName 
        object?.setActive? 1
    
    decenter: (x,y,z) -> new Pos(x,y,z).plus @size.div 2

    isValidPos: (pos) -> 
        p = new Pos pos
        p.x >= 0 and p.x < @size.x and p.y >= 0 and p.y < @size.y and p.z >= 0 and p.z < @size.z
        
    isInvalidPos: (pos) -> not @isValidPos pos

    #    0000000   0000000          000  00000000   0000000  000000000        000      000  000   000  00000000
    #   000   000  000   000        000  000       000          000           000      000  0000  000  000     
    #   000   000  0000000          000  0000000   000          000           000      000  000 0 000  0000000 
    #   000   000  000   000  000   000  000       000          000           000      000  000  0000  000     
    #    0000000   0000000     0000000   00000000   0000000     000           0000000  000  000   000  00000000
    
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
                @setObjectRandom eval object 
            else
                @setObjectRandom object()
        
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

    toggle: (objectName) ->
        # toggles object with name objectName
        @startTimedAction(@getObjectWithName(objectName).getActionWithName("toggle"))
    
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
    
    #    0000000   0000000          000  00000000   0000000  000000000   0000000
    #   000   000  000   000        000  000       000          000     000     
    #   000   000  0000000          000  0000000   000          000     0000000 
    #   000   000  000   000  000   000  000       000          000          000
    #    0000000   0000000     0000000   00000000   0000000     000     0000000 
        
    getObjectsOfType:      (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectsOfTypeAtPos: (clss, pos) -> @getCellAtPos(pos)?.getObjectsOfType clss
    getObjectOfTypeAtPos:  (clss, pos) -> @getCellAtPos(pos)?.getRealObjectOfType clss
    getOccupantAtPos:            (pos) -> @getCellAtPos(pos)?.getOccupant()
    getRealOccupantAtPos: (pos) ->
        occupant = @getOccupantAtPos pos
        if occupant and occupant instanceof TmpObject
            occupant.object
        else
            occupant

    setObjectAtPos: (object, pos) ->
        if @isInvalidPos pos
            log "World.setObjectAtPos invalid pos:", pos
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
            # log "newObject:", object
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
        object = @newObject object
        @setObjectAtPos object, pos
        # log "addObjectAtPos #{object.name}", pos
        @addObject object

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
    
    #   0000000    00000000  000      00000000  000000000  00000000
    #   000   000  000       000      000          000     000     
    #   000   000  0000000   000      0000000      000     0000000 
    #   000   000  000       000      000          000     000     
    #   0000000    00000000  0000000  00000000     000     00000000
    
    deleteObject: (object) ->
        if not object?
            log "WARNING: World.deleteObject null"
            return
        @removeObject object
        object.del()
    
    deleteAllObjects: () ->
        @picked_pickable = null
        @moved_objects = []
    
        if @player?
            @player.finishRotateAction()
            @removeObject @player # remove the player first, to keep it's state
            Timer.removeAllActions()
            # Controller.removeKeyHandler (Controller.player) # prevent keyboard input while building world
            @player.reset()
    
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
    
    objectMovedFromPos: (object, pos) ->
    
        if cell = @getCellAtPos(pos)
            if tmpObject = cell.getObjectOfType TmpObject 
                if tmpObject.object == object
                    tmpObject.del()
        @moved_objects.push object 
    
    objectWillMoveToPos: (object, pos, duration) ->
        # log "world.objectWillMoveToPos", pos
        
        if @isInvalidPos pos
            log "world.objectWillMoveToPos [WARNING] invalid pos:", pos
            return
        
        if object.getPos().eql pos
            log "world.objectWillMoveToPos [WARNING] equal pos:", pos
            return
        
        if cell = @getCellAtPos pos
            if objectAtNewPos = cell.getOccupant()
                if objectAtNewPos instanceof TmpObject
                    if objectAtNewPos.time < 0 and -objectAtNewPos.time <= duration
                        # temporary object at new pos will vanish before object will arrive . delete it
                        objectAtNewPos.del()
                    else
                        log "world.objectWillMoveToPos [WARNING] timing conflict at pos:", pos
                else
                    log "world.objectWillMoveToPos [WARNING] already occupied:", pos 
    
        @unsetObject object # remove object from cell grid
        # log 'tmpObject at new pos', pos 
        tmpObject = new TmpObject object  # insert tmp object at new pos
        tmpObject.setPosition pos 
        tmpObject.time = duration
        @addObjectAtPos tmpObject, pos 
        # log 'tmpObject at old pos', object.position
        tmpObject = new TmpObject object  # insert tmp object at old pos
        tmpObject.setPosition object.position
        tmpObject.time = -duration
        @addObjectAtPos tmpObject, object.getPos() 
    
    updateStatus: () ->

        while @moved_objects.length
            movedObject = last @moved_objects
            pos = new Pos movedObject.position
    
            if @isInvalidPos pos
                 log "World.updateStatus invalid new pos"
                 return
    
            if tmpObject = @getObjectOfTypeAtPos TmpObject, pos
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
        if false
            quat = @camera.quaternion.clone()
            quat.multiply (new THREE.Quaternion).setFromAxisAngle(new THREE.Vector3(1,0,0), step.dsecs*0.2)
            quat.multiply (new THREE.Quaternion).setFromAxisAngle(new THREE.Vector3(0,1,0), step.dsecs*0.1)
            # center = @decenter 0,0,0
            center = @size.div 2
            # log center
            @camera.position.set(center.x,center.y,center.z+@dist).applyQuaternion quat
            @camera.quaternion.copy quat

        Timer.event.triggerActions()
        Timer.event.finishActions()
        
        o.step?(step) for o in @objects

        switch @camera_mode 
            when World.CAMERA_INSIDE then @projection = @player.getInsideProjection()
            when World.CAMERA_BEHIND then @projection = @player.getBehindProjection()
            when World.CAMERA_FOLLOW then @projection = @player.getFollowProjection()
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
    mapMsTime:  (unmapped) -> 
        # log "mapMsTime #{unmapped} #{@speed} #{parseInt 10.0 * unmapped/@speed}"
        parseInt 10.0 * unmapped/@speed
    unmapMsTime: (mapped) -> 
        # log "unmapMsTime #{mapped} #{@speed} #{parseInt mapped * @speed/10.0}"
        parseInt mapped * @speed/10.0
        
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
            log "isOccupiedPos occupant: #{@getOccupantAtPos(pos).name} at pos:", pos
            return true
    
    mayObjectPushToPos: (object, pos, duration) ->
        # returns true, if a pushable object is at pos and may be pushed
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
    
    modKeyComboEventUp: (mod, key, combo, event) ->
        @player?.modKeyComboEventUp mod, key, combo, event

    modKeyComboEventDown: (mod, key, combo, event) ->
        @player?.modKeyComboEventDown mod, key, combo, event

module.exports = World
