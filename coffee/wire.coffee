# 000   000  000  00000000   00000000
# 000 0 000  000  000   000  000     
# 000000000  000  0000000    0000000 
# 000   000  000  000   000  000     
# 00     00  000  000   000  00000000

Item     = require './item'
Geom     = require './geom'
Face     = require './face'
Gate     = require './gate'
Vector   = require './lib/vector'
Material = require './material'

class Wire extends Item

    @UP         =1
    @RIGHT      =2 
    @DOWN       =4
    @LEFT       =8
    @VERTICAL   =5
    @HORIZONTAL =10
    @ALL        =15
    
    constructor: (@face=Face.Z, @connections=Wire.ALL) ->
        @glow   = null
        @active = false
        @value  = 1.0
        
        super 
    
        @SWITCH_OFF_EVENT = @addEventWithName "off"
        @SWITCH_ON_EVENT  = @addEventWithName "on"
        @SWITCHED_EVENT   = @addEventWithName "switched"
    
    createMesh: ->
        o = 0.005
        geom = new THREE.Geometry
        
        h = 0.1
        s = 0.5
        w = s+o
        
        if @connections & Wire.RIGHT 
            plane = new THREE.PlaneGeometry  w, h
            plane.translate w/2, 0, -s+o
            geom.merge plane
        if @connections & Wire.LEFT   
            plane = new THREE.PlaneGeometry  w, h
            plane.translate -w/2, 0, -s+o
            geom.merge plane
        if @connections & Wire.UP 
            plane = new THREE.PlaneGeometry  h, w
            plane.translate 0, w/2, -s+o
            geom.merge plane
        if @connections & Wire.DOWN    
            plane = new THREE.PlaneGeometry h, w
            plane.translate 0, -w/2, -s+o
            geom.merge plane
        
        @wire = new THREE.Mesh geom,        Material.wire            
        @mesh = new THREE.Mesh Geom.wire(), Material.wire_plate
        @mesh.add @wire
        @mesh.receiveShadow = true
        @mesh.position.copy Face.normal(@face).mul -(0.5+o)
        @mesh.quaternion.copy Face.orientation @face
        
    updateActive: ->
        for wire in @neighborWires()
            @setActive true if wire.active
    
    setActive: (active) ->
        if @active != active
            @active = active
            log "wire active #{active}"
            neighbors = @neighborWires()
        
            for wire in neighbors
                wire.setActive @active
                
            # active_neighbor = false
            # if @active
                # for wire in neighbors
                    # if wire.active
                        # active_neighbor = true
                        # break
#              
            # for wire in wires
                # wire.setActive active
    
            gate = world.getObjectOfTypeAtPos Gate, @getPos()
            gate?.setActive @active
            
            if @active
                if not @glow?
                    map = new THREE.TextureLoader().load "#{__dirname}/../img/wire.png"
                    # map.offset.set -0.5, -0.5 
                    # map.repeat.set 2, 2
                    material = new THREE.SpriteMaterial 
                        map: map
                        color: 0xffff00
                        transparent: false
                        # opacity: 0.95
                        blending: THREE.AdditiveBlending
                        fog: true
                        id: 999
                        lights: true
                        # side: THREE.DoubleSide
                        # depthTest: false
                        # depthWrite: true
                        
                    @glow = new THREE.Sprite material
                    # @glow.scale.set 0.1, 0.1, 0.1
                    log 'glow position', @position
                    @glow.position.set 0, 0, -0.3
                    @glow.scale.set .5, .5, 1
                    @glow.renderOrder = 999
                    # @glow.position.normalize()
                    # @glow.position.multiplyScalar 2
                    @mesh.add @glow
                    
                    # @glow2 = new THREE.Sprite material
                    # @glow2.scale.set 1, 1, 1
                    # @glow2.renderOrder = 999
                    # @glow2.position.set @position.x, @position.y, @position.z-0.3
                    # world.scene.add @glow2
            else if @glow
                @mesh.remove @glow
                log 'remove glow'
                # @world.scene.remove @glow
                @glow = null
    
            @events[@active and @SWITCH_ON_EVENT or @SWITCH_OFF_EVENT].triggerActions()
            @events[@SWITCHED_EVENT].triggerActions()
    
    neighborWires: ->
        wires = []
        points = @connectionPoints()
        neighbor_dirs = []
         
        rot = Face.orientationForFace @face
        n   = Face.normalVectorForFace @face
    
        neighbor_dirs.push new Vector 
         
        if @connections & Wire.RIGHT 
            neighbor_dirs.push rot.rotate new Vector(1,0,0)
            neighbor_dirs.push rot.rotate new Vector(1,0,0).plus n
        if @connections & Wire.LEFT  
            neighbor_dirs.push rot.rotate new Vector(-1,0,0)
            neighbor_dirs.push rot.rotate new Vector(-1,0,0).plus n
        if @connections & Wire.UP    
            neighbor_dirs.push rot.rotate new Vector(0,1,0)
            neighbor_dirs.push rot.rotate new Vector(0,1,0).plus n
        if @connections & Wire.DOWN
            neighbor_dirs.push rot.rotate new Vector(0,-1,0)
            neighbor_dirs.push rot.rotate new Vector(0,-1,0).plus n
         
        for i in [0...neighbor_dirs.length]
            neighbors = world.getObjectsOfTypeAtPos Wire, @position.plus neighbor_dirs[i]
            for iter in neighbors
                continue if iter == @
                neighbor_points = iter.connectionPoints()
                for point in points
                    for neighbor_point in neighbor_points
                        if (neighbor_point.minus point).length() < 0.1
                            wires.push iter
        wires
    
    connectionPoints: ->
        points = []
        to_border = Face.normalVectorForFace(@face).mul 0.5
        rot = Face.orientationForFace @face
        if @connections & Wire.RIGHT 
            points.push @position.plus to_border.plus rot.rotate new Vector 0.5, 0, 0
        if @connections & Wire.LEFT
            points.push @position.plus to_border.plus rot.rotate new Vector -0.5, 0, 0
        if @connections & Wire.UP 
            points.push @position.plus to_border.plus rot.rotate new Vector 0, 0.5, 0
        if @connections & Wire.DOWN
            points.push @position.plus to_border.plus rot.rotate new Vector 0, -0.5, 0
        points
        
    # KikiBillBoard::displayTextureWithSize 0.15 
        
module.exports = Wire
