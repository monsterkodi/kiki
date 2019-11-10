
#   000   000   0000000   00000000   000      0000000  
#   000 0 000  000   000  000   000  000      000   000
#   000000000  000   000  0000000    000      000   000
#   000   000  000   000  000   000  000      000   000
#   00     00   0000000   000   000  0000000  0000000  

{ post, randInt, colors, absMin, prefs, clamp, last, kerror, klog, _ } = require 'kxk'

Pos         = require './lib/pos'
Size        = require './lib/size'
Cell        = require './cell'
Gate        = require './gate'
Camera      = require './camera'
Light       = require './light'
Levels      = require './levels'
Player      = require './player'
Sound       = require './sound'
Cage        = require './cage'
Timer       = require './timer'
Actor       = require './actor'
Item        = require './item'
Action      = require './action'
Menu        = require './menu'
Config      = require './config'
ScreenText  = require './screentext'
TmpObject   = require './tmpobject'
Pushable    = require './pushable'
Material    = require './material'
Scheme      = require './scheme'
Quaternion  = require './lib/quaternion'
Vector      = require './lib/vector'
Pos         = require './lib/pos'
now         = require('perf_hooks').performance.now
LevelSel    = require './levelselection'
{
Wall,
Wire,
Gear,
Stone,
Switch,
MotorGear,
MotorCylinder,
Face}       = require './items'

world       = null

class World extends Actor
    
    @levels = null
    
    @normals = [
            new Vector 1, 0, 0
            new Vector 0, 1, 0 
            new Vector 0, 0, 1
            new Vector -1,0, 0 
            new Vector 0,-1, 0 
            new Vector 0, 0,-1
    ]
    
    @: (@view, @preview) ->
             
        global.world = @
        
        @speed      = 6 + (prefs.get 'speed' 3) - 3
        
        @rasterSize = 0.05

        super
        
        @noRotations = false
        
        @screenSize = new Size @view.clientWidth, @view.clientHeight
        # klog "view @screenSize:", @screenSize
        
        @renderer = new THREE.WebGLRenderer 
            antialias:              true
            logarithmicDepthBuffer: false
            autoClear:              false
            sortObjects:            true

        @renderer.setSize @view.offsetWidth, @view.offsetHeight
        @renderer.shadowMap.type = THREE.PCFSoftShadowMap
                        
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
        @sun.position.copy @player.camera.getPosition() if @player?
        @scene.add @sun
        
        @ambient = new THREE.AmbientLight 0x111111
        @scene.add @ambient
                 
        @objects = []
        @lights  = []
        @cells   = [] 
        @size    = new Pos()
        @depth   = -Number.MAX_SAFE_INTEGER
        
        @timer = new Timer @
                
        @view.appendChild @renderer.domElement
     
    @init: (view) ->
        
        return if world?
        
        @initGlobal()
            
        world = new World view
        world.name = 'world'
        index = prefs.get 'level' 0
        world.create @levels.list[index]
        world
        
    @initGlobal: () ->
        
        return if @levels?
          
        ScreenText.init()
        Sound.init()
        
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
        
        global.XupY        = Quaternion.XupY
        global.XupZ        = Quaternion.XupZ
        global.XdownY      = Quaternion.XdownY
        global.XdownZ      = Quaternion.XdownZ
        global.YupX        = Quaternion.YupX
        global.YupZ        = Quaternion.YupZ
        global.YdownX      = Quaternion.YdownX
        global.YdownZ      = Quaternion.YdownZ
        global.ZupX        = Quaternion.ZupX
        global.ZupY        = Quaternion.ZupY
        global.ZdownX      = Quaternion.ZdownX
        global.ZdownY      = Quaternion.ZdownY
        global.minusXupY   = Quaternion.minusXupY
        global.minusXupZ   = Quaternion.minusXupZ
        global.minusXdownY = Quaternion.minusXdownY
        global.minusXdownZ = Quaternion.minusXdownZ
        global.minusYupX   = Quaternion.minusYupX
        global.minusYupZ   = Quaternion.minusYupZ
        global.minusYdownX = Quaternion.minusYdownX
        global.minusYdownZ = Quaternion.minusYdownZ
        global.minusZupX   = Quaternion.minusZupX
        global.minusZupY   = Quaternion.minusZupY
        global.minusZdownX = Quaternion.minusZdownX
        global.minusZdownY = Quaternion.minusZdownY

        @levels = new Levels
        
    del: ->
        
        @renderer.domElement.remove()
        
    #  0000000  00000000   00000000   0000000   000000000  00000000
    # 000       000   000  000       000   000     000     000     
    # 000       0000000    0000000   000000000     000     0000000 
    # 000       000   000  000       000   000     000     000     
    #  0000000  000   000  00000000  000   000     000     00000000
        
    create: (worldDict={}, showName=true) -> # creates the world from a level name or a dictionary
        
        # klog "world.create" worldDict
        
        if worldDict
            if _.isString worldDict
                @level_name = worldDict
                @dict = World.levels.dict[worldDict]
            else
                @level_name = worldDict.name
                @dict = worldDict
                
        @level_index = World.levels.list.indexOf @level_name
        
        if not @preview
            prefs.set 'level' @level_index
        
        # klog "World.create #{@level_index} size: #{new Pos(@dict["size"]).str()} ---------------------- '#{@level_name}' scheme: '#{@dict.scheme ? 'default'}'"

        @creating = true
            
        @setSize @dict.size # this removes all objects
        
        @applyScheme @dict.scheme ? 'default'

        # ............................................................ intro text   
        
        if not @preview and showName
            @text = new ScreenText @dict.name
        
        # ............................................................ exits

        if @dict.exits?
            exit_id = 0
            for entry in @dict.exits
                exit_gate = new Gate entry["active"]
                exit_gate.name = entry["name"] ? "exit #{exit_id}"
                Action.id ?= 0
                exitAction = new Action 
                    id:   Action.id
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
                klog "World.create [WARNING] @dict.create not a function!"

        # ............................................................ player

        @player = new Player

        @player.setOrientation @dict.player.orientation ? rotx90
        @player.camera.setOrientation @player.orientation

        if @dict.player.position?
            @addObjectAtPos @player, @decenter @dict.player.position
        else if @dict.player.coordinates?
            @addObjectAtPos @player, new Pos @dict.player.coordinates

        if @preview
            @player.camera.setPosition @player.currentPos().minus @player.direction
            @setCameraMode Camera.FOLLOW
        else
            @player.camera.setPosition @player.currentPos()
            @setCameraMode Camera.INSIDE if @dict.camera == 'inside'
        
        @creating = false
    
    restart: => @create @dict

    #  0000000   0000000  000   000  00000000  00     00  00000000
    # 000       000       000   000  000       000   000  000     
    # 0000000   000       000000000  0000000   000000000  0000000 
    #      000  000       000   000  000       000 0 000  000     
    # 0000000    0000000  000   000  00000000  000   000  00000000
    
    applyScheme: (scheme) ->
        return if not Scheme[scheme]
        
        colors = _.clone Scheme[scheme]
        
        opacity =
            stone: 0.7
            bomb:  0.9
            text:  0
            
        shininess = 
            tire:   4
            plate:  10
            raster: 20
            wall:   20
            stone:  20
            gear:   20
            text:   200
            
        colors.plate.emissive   ?= colors.plate.color
        colors.bulb.emissive    ?= colors.bulb.color
        colors.menu             ?= {}   
        colors.menu.color       ?= colors.gear.color
        colors.raster           ?= {}    
        colors.raster.color     ?= colors.plate.color
        colors.wall             ?= {}
        colors.wall.color       ?= new THREE.Color(colors.plate.color).multiplyScalar 0.6
        colors.wirePlate        ?= {}
        colors.wirePlate.color  ?= colors.wire.color
        colors.help             ?= {}
        colors.help.color       ?= colors.text.color
        
        for k,v of colors
            mat = Material[k]
            mat.color    = v.color
            mat.opacity  = v.opacity ? opacity[k] ? 1
            mat.specular = v.specular ? new THREE.Color(v.color).multiplyScalar 0.2
            mat.emissive = v.emissive ? new THREE.Color 0,0,0
            if shininess[k]?
                mat.shininess = v.shininess ? shininess[k]

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
        
        prefs.set "solved▸#{World.levels.list[world.level_index]}" true
        nextLevel = (world.level_index+(_.isNumber(action) and action or 1)) % World.levels.list.length
        world.create World.levels.list[nextLevel]

    activate: (objectName) -> @getObjectWithName(objectName)?.setActive? true
    
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
        @cage = new Cage @size, @rasterSize

    getCellAtPos: (pos) -> return @cells[@posToIndex(pos)] if @isValidPos pos
    getBotAtPos:  (pos) -> @getObjectOfTypeAtPos Bot, new Pos pos

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
        # klog "addObjectAtPos #{object.name}", pos
        @addObject object

    addObjectLine: (object, sx,sy,sz, ex,ey,ez) ->
        # klog "world.addObjectLine sx:#{sx} sy:#{sy} sz:#{sz} ex:#{ex} ey:#{ey} ez:#{ez}"
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
        
        # klog "world.addObjectLine sx:#{sx} sy:#{sy} sz:#{sz} ex:#{ex} ey:#{ey} ez:#{ez}"
        
        diff = [ex-sx, ey-sy, ez-sz]
        maxdiff = _.max diff.map Math.abs
        deltas = diff.map (a) -> a/maxdiff
        for i in [0...maxdiff]
            # pos = apply(Pos, (map (lambda a, b: int(a+i*b), start, deltas)))
            pos = new Pos (start[j]+i*deltas[j] for j in [0..2])
            # klog "addObjectLine #{i}:", pos
            if @isUnoccupiedPos pos
                @addObjectAtPos object, pos
       
    addObjectPoly: (object, points, close=true) ->
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
        objectSet = false
        object = @newObject object
        while not objectSet # hack alert!
            randomPos = new Pos randInt(@size.x), randInt(@size.y), randInt(@size.z)
            if not object.isSpaceEgoistic() or @isUnoccupiedPos randomPos 
                @addObjectAtPos object, randomPos
                objectSet = true

    #  0000000   0000000          000  00000000   0000000  000000000   0000000
    # 000   000  000   000        000  000       000          000     000     
    # 000   000  0000000          000  0000000   000          000     0000000 
    # 000   000  000   000  000   000  000       000          000          000
    #  0000000   0000000     0000000   00000000   0000000     000     0000000 
        
    getObjectsOfType:      (clss)      -> @objects.filter (o) -> o instanceof clss
    getObjectsOfTypeAtPos: (clss, pos) -> @getCellAtPos(pos)?.getObjectsOfType(clss) ? []
    getObjectOfTypeAtPos:  (clss, pos) -> @getCellAtPos(pos)?.getRealObjectOfType(clss)
    getOccupantAtPos:            (pos) -> @getCellAtPos(pos)?.getOccupant()
    getRealOccupantAtPos: (pos) ->
        occupant = @getOccupantAtPos pos
        if occupant and occupant instanceof TmpObject
            occupant.object
        else
            occupant
    
    switchAtPos: (pos) -> @getObjectOfTypeAtPos Switch, pos
    
    setObjectAtPos: (object, pos) ->
        
        pos = new Pos pos
        if @isInvalidPos pos
            kerror "World.setObjectAtPos [WARNING] invalid pos:", pos
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
            @cells[cellIndex] = cell
        
        object.setPosition pos
        cell.addObject object

    unsetObject: (object) ->
        pos = object.getPos()
        if cell = @getCellAtPos pos
            cell.removeObject object
            if cell.isEmpty()
                @cells[@posToIndex(pos)] = null
        # else 
            # klog 'world.unsetObject [WARNING] no cell at pos:', pos

    newObject: (object) ->
        if _.isString object
            if object.startsWith 'new'
                return eval object 
            return new (require "./#{object.toLowerCase()}")()
        if object instanceof Item
            return object
        else
            return object()
        
    addObject: (object) ->
        object = @newObject object
        if object instanceof Light
            @lights.push object
        else
            @objects.push object

    removeObject: (object) ->
        @unsetObject object
        _.pull @lights, object
        _.pull @objects, object
    
    toggle: (objectName) ->
        object = @getObjectWithName objectName 
        object.getActionWithName("toggle").perform()
    
    #   0000000    00000000  000      00000000  000000000  00000000
    #   000   000  000       000      000          000     000     
    #   000   000  0000000   000      0000000      000     0000000 
    #   000   000  000       000      000          000     000     
    #   0000000    00000000  0000000  00000000     000     00000000
        
    deleteAllObjects: () ->
        Timer.removeAllActions()
    
        if @player?
            @player.del()
    
        while @lights.length
            oldSize = @lights.length
            last(@lights).del() # destructor will call remove object
            if oldSize == @lights.length
                kerror "WARNING World.deleteAllObjects light no auto remove"
                @lights.pop()
    
        while @objects.length
            oldSize = @objects.length
            last(@objects).del() # destructor will call remove object
            if oldSize == @objects.length
                kerror "WARNING World.deleteAllObjects object no auto remove #{last(@objects).name}"
                @objects.pop()
    
    deleteObjectsWithClassName: (className) ->
        for o in _.clone @objects
            if className == o.getClassName()
                o.del()
    
    getObjectWithName: (objectName) ->
        for o in @objects
            if objectName == o.name
                return o
        kerror "World.getObjectWithName [WARNING] no object with name #{objectName}"
        null
    
    setCameraMode: (mode) -> @player.camera.mode = clamp Camera.INSIDE, Camera.FOLLOW, mode
    
    changeCameraMode: -> @player.camera.mode = (@player.camera.mode+1) % (Camera.FOLLOW+1)
    
    #    0000000   0000000          000        00     00   0000000   000   000  00000000
    #   000   000  000   000        000        000   000  000   000  000   000  000     
    #   000   000  0000000          000        000000000  000   000   000 000   0000000 
    #   000   000  000   000  000   000        000 0 000  000   000     000     000     
    #    0000000   0000000     0000000         000   000   0000000       0      00000000
        
    objectWillMoveToPos: (object, pos, duration) ->
        
        sourcePos = object.getPos()
        targetPos = new Pos pos
        
        if @isInvalidPos targetPos
            kerror "world.objectWillMoveToPos [WARNING] #{object.name} invalid targetPos:", targetPos
            return
        
        if sourcePos.eql targetPos
            kerror "world.objectWillMoveToPos [WARNING] #{object.name} equal pos:", targetPos
            return
        
        targetCell = @getCellAtPos pos
        if targetCell
            if objectAtNewPos = targetCell.getOccupant()
                if objectAtNewPos instanceof TmpObject
                    if objectAtNewPos.time < 0 and -objectAtNewPos.time <= duration
                        # temporary object at new pos will vanish before object will arrive . delete it
                        objectAtNewPos.del()
                    else
                        kerror "world.objectWillMoveToPos [WARNING] #{object.name} timing conflict at pos:", targetPos
                else
                    kerror "world.objectWillMoveToPos [WARNING] #{object.name} already occupied:", targetPos 
    
        if object.name != 'player'
            @unsetObject object # remove object from cell grid
            
            tmpObject = new TmpObject object  # insert tmp object at old pos
            tmpObject.setPosition sourcePos
            tmpObject.time = -duration
            @addObjectAtPos tmpObject, sourcePos 

            tmpObject = new TmpObject object  # insert tmp object at new pos
            tmpObject.setPosition targetPos 
            tmpObject.time = duration
            @addObjectAtPos tmpObject, targetPos 

    objectMoved: (movedObject, from, to) ->
        
        sourcePos = new Pos from
        targetPos = new Pos to

        if @isInvalidPos targetPos
             kerror "World.objectMoved [WARNING] #{movedObject.name} invalid targetPos:" targetPos
             return
        
        sourceCell = @getCellAtPos sourcePos
        targetCell = @getCellAtPos targetPos
        
        if tmpObject = sourceCell?.getObjectOfType TmpObject 
            tmpObject.del() if tmpObject.object == movedObject

        if tmpObject = targetCell?.getObjectOfType TmpObject 
            tmpObject.del() if tmpObject.object == movedObject
            
        if @isOccupiedPos targetPos
            kerror "World.objectMoved [WARNING] #{movedObject.name} occupied target pos:" targetPos
            
        if sourceCell?
            sourceCell.removeObject movedObject
            if sourceCell.isEmpty()
                @cells[@posToIndex(sourcePos)] = null
        else
            klog 'no sourceCell?'
        
        targetCell = @getCellAtPos targetPos    
        if not targetCell?
            cellIndex = @posToIndex targetPos 
            targetCell = new Cell()
            @cells[cellIndex] = targetCell

        if targetCell?
            targetCell.addObject movedObject
        else
            kerror "world.objectMoved [WARNING] #{movedObject.name} no target cell?"
    
    #  0000000  000000000  00000000  00000000       
    # 000          000     000       000   000      
    # 0000000      000     0000000   00000000       
    #      000     000     000       000            
    # 0000000      000     00000000  000          
    
    step: ->
        
        if @levelSelection
            @levelSelection.step()
            return 
            
        camera = @player?.camera.cam
    
        Timer.triggerActions()
        Timer.finishActions()
        
        o.step?() for o in @objects
        
        if @player then @stepPlayer()
        
        if @preview
            @renderer.setViewport 0, Math.floor(@screenSize.h*0.72), @screenSize.w, Math.floor(@screenSize.h*0.3)
        
        @renderer.render @text.scene, @text.camera if @text
        @renderer.render @menu.scene, @menu.camera if @menu

    stepPlayer: ->
            
        if @preview
            @player.camera.cam.aspect = @screenSize.w / (@screenSize.h*0.66)
        @player.camera.step()

        Sound.setMatrix @player.camera
            
        @player.setOpacity clamp 0, 1, @player.camera.getPosition().minus(@player.current_position).length()-0.4
        
        stones = []
        for o in @objects
            if o instanceof Stone
                stones.push o
        stones.sort (a,b) => b.position.minus(@player.camera.getPosition()).length() - a.position.minus(@player.camera.getPosition()).length()
        
        order = 100
        for stone in stones
            stone.mesh.renderOrder = order
            order += 1
            
            d = stone.position.minus(@player.camera.getPosition()).length()
            if d < 1.0
                stone.mesh.material.orig_opacity = stone.mesh.material.opacity if not stone.mesh.material.orig_opacity?
                stone.mesh.material.opacity = 0.2 + d * 0.5
            else if stone.mesh.material.orig_opacity?
                stone.mesh.material.opacity = stone.mesh.material.orig_opacity
                delete stone.mesh.material.orig_opacity
        
        @sun.position.copy @player.camera.cam.position
        @renderer.autoClearColor = false

        if @preview
            @renderer.setViewport 0, 0, @screenSize.w, Math.floor @screenSize.h*0.66
        
        @renderer.render @scene, @player.camera.cam        
    
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
    
    resized: (w,h) =>
        
        @aspect = w/h
        @screenSize = new Size w,h
        camera = @player?.camera.cam
        camera?.aspect = @aspect
        camera?.updateProjectionMatrix()
        @renderer?.setSize w,h
        @text?.resized w,h
        @menu?.resized w,h
        
        @levelSelection?.resized w,h

    getNearestValidPos: (pos) ->
        new Pos Math.min(@size.x-1, Math.max(pos.x, 0)), 
                Math.min(@size.y-1, Math.max(pos.y, 0)), 
                Math.min(@size.z-1, Math.max(pos.z, 0))
    
    isUnoccupiedPos: (pos) -> not @isOccupiedPos pos
    isOccupiedPos:   (pos) ->        
        if @isInvalidPos pos
            return true
        if @getOccupantAtPos pos
            return true
    
    mayObjectPushToPos: (object, pos, duration) ->

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

        if pushableObject? and pushableObject instanceof Pushable
            pushableObject.pushedByObjectInDirection object, direction, duration
            return true
    
        false
    
    # 00     00  00000000  000   000  000   000
    # 000   000  000       0000  000  000   000
    # 000000000  0000000   000 0 000  000   000
    # 000 0 000  000       000  0000  000   000
    # 000   000  00000000  000   000   0000000 
    
    showMenu: ->

        if @helpShown then return @toggleHelp()
        
        @text?.del()
        @menu = new Menu()
        @menu.addItem 'load'   => @levelSelection = new LevelSel @
        @menu.addItem 'reset'  @restart 
        @menu.addItem 'config' => @menu = new Config
        @menu.addItem 'help'   @showHelp
        @menu.addItem 'quit'   -> post.toMain 'quitApp'
        @menu.show()
    
    showHelp: =>
        
        @helpShown = true
        @text = new ScreenText @dict['help'], Material.help
        
    toggleHelp: ->
        
        @helpShown = not @helpShown
        if @helpShown
            @showHelp()
        else
            @text?.del()
        
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
            light.display()
               
    playSound: (sound, pos, time) -> Sound.play sound, pos, time if not @creating
    
    #   000   000  00000000  000   000
    #   000  000   000        000 000 
    #   0000000    0000000     00000  
    #   000  000   000          000   
    #   000   000  00000000     000   
    
    modKeyComboEventDown: (mod, key, combo, event) ->
        
        if @levelSelection
            @levelSelection.modKeyComboEvent mod, key, combo, event 
            return
        
        if @menu?            
            @menu.modKeyComboEvent mod, key, combo, event 
            return 
            
        @text?.fadeOut()
        return if @player?.modKeyComboEventDown mod, key, combo, event
        switch combo
            when 'esc' then @showMenu()
            when '=' then @speed = Math.min 8, @speed+1; prefs.set 'speed' @speed-3
            when '-' then @speed = Math.max 4, @speed-1; prefs.set 'speed' @speed-3
            when 'r' then @restart()
            when 'h' then @toggleHelp()
            when 'n' then @create World.levels.list[(@level_index+1) % World.levels.list.length]

    modKeyComboEventUp: (mod, key, combo, event) ->
        
        return if @levelSelection
        return if @player?.modKeyComboEventUp mod, key, combo, event        

module.exports = World

