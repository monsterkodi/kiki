
log         = require "/Users/kodi/s/ko/js/tools/log"
KQuaternion = require './lib/quaternion'
KVector     = require './lib/vector'

class KikiWorld
    
    constructor: -> 
        
        # execfile(kikipy_path + "colors.py")
        # execfile(kikipy_path + "action.py")
        # execfile(kikipy_path + "lang.py")
        # execfile (kikipy_path + "config.py")
        # execfile (kikipy_path + "setup.py")
        # execfile (kikipy_path + "levelselection.py")
        # execfile (kikipy_path + "highscore.py")
        # execfile (kikipy_path + "intro.py")
                
        global.rot0    = new KQuaternion()
        global.rotz180 = KQuaternion.rotationAroundVector(180, KVector(0,0,1))
        global.rotz90  = KQuaternion.rotationAroundVector(90,  KVector(0,0,1))
        global.roty270 = KQuaternion.rotationAroundVector(270, KVector(0,1,0))
        global.roty180 = KQuaternion.rotationAroundVector(180, KVector(0,1,0))
        global.roty90  = KQuaternion.rotationAroundVector(90,  KVector(0,1,0))
        global.roty0   = KQuaternion.rotationAroundVector(0,   KVector(0,1,0))
        global.rotx180 = KQuaternion.rotationAroundVector(180, KVector(1,0,0))
        global.rotx90  = KQuaternion.rotationAroundVector(90,  KVector(1,0,0))
        
        @levelList = [
              # intro
              "start", "steps", "move", "electro", "elevate", "throw", 
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
                   
        @levelDict = {}
               
        # import the levels
        for levelName in @levelList
            @levelDict[levelName] = require "./levels/#{levelName}"
            
        log 'levelDict', @levelDict
        @preview = false

    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
        
    create: (worldDict={}) -> # creates the world from a level name or a dictionary
        
        log "world.create", worldDict
        
        if worldDict
            if _.isString worldDict
                world.level_index = levelList.index worldDict
                world.level_name = worldDict
                @dict = levelDict[worldDict]
            else
                @dict = worldDict
            
        # ............................................................ appearance
        
        world.setSize @dict["size"]
        
        if "scheme" in @dict
            applyColorScheme eval(@dict["scheme"])
        else
            applyColorScheme default_scheme

        if "border" in @dict
            border = @dict["border"]
        else
            border = 1

        world.setDisplayBorder border

        # ............................................................ intro text   
        if "intro" in @dict
            if not @preview
                intro_text = KikiScreenText()
                intro_text.addText @dict["intro"]
                intro_text.show()
            world.setName @dict["intro"]
        else
            world.setName "noname"
        
        if @preview
            world.getProjection().setViewport(0.0, 0.4, 1.0, 0.6)
        else
            world.getProjection().setViewport(0.0, 0.0, 1.0, 1.0)
        
        # ............................................................ escape
        escape_event = Controller.getEventWithName ("escape")
        escape_event.removeAllActions()
        escape_event.addAction(continuous(@escape, "escape"))

        # ............................................................ exits

        if "exits" in @dict
            exit_id = 0
            for entry in @dict["exits"]
                exit_gate = KikiGate (entry["active"])
                
                if "name" in entry
                    name = entry["name"]
                else
                    name = "exit "+str(exit_id)
                exit_gate.setName(name)

                exit_action  = once ("exit " + str(exit_id))
                delay_action = once (lambda a = exit_action: Controller.timer_event.addAction (a))
                exit_gate.getEventWithName ("enter").addAction (delay_action)
                if "position" in entry
                    pos = world.decenter (entry["position"])
                else if "coordinates" in entry
                    pos = KikiPos entry["coordinates"]
                world.addObjectAtPos exit_gate, pos
                exit_id += 1

        # ............................................................ creation

        if "create" in @dict
            if _.isFunction @dict["create"]
                @dict["create"]()
            else
                exec @dict["create"] in globals()

        # ............................................................ player

        player = Controller.player
        
        player_dict = @dict["player"]
        
        if "orientation" in player_dict
            player.setOrientation (player_dict["orientation"])
        else
            player.setOrientation (roty90)
            
        if "position" in player_dict
            world.addObjectAtPos player, world.decenter(player_dict["position"])
        else if "coordinates" in player_dict
            pos = player_dict["coordinates"]
            world.addObjectAtPos player, KikiPos(pos[0], pos[1], pos[2])

        if "nostatus" in player_dict
            if player_dict["nostatus"] or @preview
                Controller.player_status.hide()
            else
                Controller.player_status.show()
        else
            if @preview
                Controller.player_status.hide()
            else
                Controller.player_status.show()
        
        world.getProjection().setPosition (KVector())

        Controller.player.getStatus().setMinMoves (highscore.levelParMoves (world.level_name))
        Controller.player.getStatus().setMoves (0)

        # ............................................................ init
        world.init() # tell the world that we are finished

    restart: (self) ->
        # restores the player status and restarts the current level
        Controller.player.getStatus().setMoves (0)
        Controller.player.reborn()
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
            Controller.player.getStatus().setMoves (0)
            if "world" in @dict["exits"][parseInt name.slice 5]
                w = @dict["exits"][parseInt name.slice 5]["world"]
                if w instanceof KikiWorld
                    w.create()
                else if _.isFunction w
                    w()
                else
                    exec "KikiWorld().create(" + world + ")"
            else
                KikiPyWorld().create (levelList[world.level_index+1])

    activate: (objectName) ->
        # activates object with name objectName
        object = @getObjectWithName(objectName)
        if object.getClassName() == "KikiSwitch"
            kikiObjectToSwitch(object).setActive(1)
        else if object.getClassName() == "KikiGate"
            kikiObjectToGate(object).setActive(1)
    
    decenter: () ->
        s = @getSize()
        if len(args) == 3
            [x, y, z] = args
        else if len(args) == 1
            [x, y, z] = args[0]
    
        return KikiPos(x+s.x/2, y+s.y/2, z+s.z/2)
    
    addObjectLine: (object, start, end) ->
        # adds a line of objects of type to the world. start and end should be 3-tuples or KikiPos objects
        if start instanceof KikiPos
            start = [start.x, start.y, start.z]
        [sx, sy, sz] = start
        if end isinstance KikiPos
            end = [end.x, end.y, end.z]
        [ex, ey, ez] = end
        
        diff = [ex-sx, ey-sy, ez-sz]
        maxdiff = _.max diff.map Math.abs
        deltas = diff.map (a) -> a/maxdiff
        for i in [0...maxdiff]
            # pos = apply(KikiPos, (map (lambda a, b: int(a+i*b), start, deltas)))
            pos = KikiPos (start[j]+i*deltas[j] for j in [0..2])
            if @isUnoccupiedPos pos
                if type(object) == types.StringType
                    @addObjectAtPos eval(object), pos
                else
                    @addObjectAtPos object(), pos
       
    addObjectPoly: (object, points, close=1) ->
        # adds a polygon of objects of type to the world. points should be 3-tuples or KikiPos objects
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
        size = @getSize()
        object_set = 0
        while not object_set                                   # hack alert!
            random_pos = KikiPos random.randrange(size.x),
                                 random.randrange(size.y),
                                 random.randrange(size.z)
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
     
module.exports = KikiWorld
