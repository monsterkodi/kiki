
#    0000000   0000000  00000000   00000000  00000000  000   000  000000000  00000000  000   000  000000000
#   000       000       000   000  000       000       0000  000     000     000        000 000      000   
#   0000000   000       0000000    0000000   0000000   000 0 000     000     0000000     00000       000   
#        000  000       000   000  000       000       000  0000     000     000        000 000      000   
#   0000000    0000000  000   000  00000000  00000000  000   000     000     00000000  000   000     000   

{ klog } = require 'kxk'
Camera   = require './camera'
Action   = require './action'
Timer    = require './timer'
Actor    = require './actor'
Vector   = require './lib/vector'
Material = require './material'

class ScreenText extends Actor    
    
    @geomCache: {}
    
    @letters: {}
    
    @init: -> 
        
        @font = new THREE.Font require 'three/examples/fonts/helvetiker_bold.typeface.json'
        
        for c in "abcdefghijklmnopqrstuvwxyz0123456789.,-+:'?/\\[]()<>!"

            geom = new THREE.TextGeometry "#{c}", 
                font: ScreenText.font
                size: 1
                height: 4
                bevelEnabled: true
                bevelThickness: 0.1
                bevelSize: 0.04
                    
            geom.computeBoundingBox()
            min = geom.boundingBox.min
            max = geom.boundingBox.max
                    
            @letters[c] = 
                geom: geom
                width: max.x - min.x
                height: max.y - min.y
                        
    @: (@text, material=Material.text) ->
        
        super
        
        @addAction new Action @, Action.SHOW, "show#{@constructor.name}" 500
        @addAction new Action @, Action.HIDE, "hide#{@constructor.name}" 500
                
        @scene = new THREE.Scene()
        @lineHeight = 1.3 if not @lineHeight?
                
        @sun1 = new THREE.PointLight 0xffffff
        @scene.add @sun1

        @sun2 = new THREE.PointLight 0xffffff
        @scene.add @sun2
        
        @height = 0
        @width = 0
        @cameraOffset = 1
        @mesh = new THREE.Object3D
        @scene.add @mesh
        aspect = world.screenSize.w/world.screenSize.h
        @camera = new THREE.PerspectiveCamera 20, aspect, 1, 1000
        if @text?
            for l in @text.split '\n'
                @addText l, 1, material
            @show()
    
    del: ->
        
        @scene.remove @mesh
        @scene.remove @sun1
        @scene.remove @sun2
        Timer.removeActionsOfObject @
        if world.text == @
            world.text = null 
            world.helpShown = false
    
    show: -> @startTimedAction @getActionWithId Action.SHOW
    
    addText: (str, scaleFactor=1, material=Material.text) ->
        
        if str.trim().length == 0
            @height += 1
            return
        
        x = 0
        group = new THREE.Group
        for c in str
            c = c.toLowerCase()
            if letter = ScreenText.letters[c]
                mesh = new THREE.Mesh letter.geom, material
                mesh.translateX x
                x += letter.width + 0.06
                group.add mesh
            else
                x += 0.5
                
        @width = Math.max @width, x
        group.translateX -x/2 * scaleFactor 
        group.translateY -@height * @lineHeight * scaleFactor
        group.scale.set scaleFactor, scaleFactor, scaleFactor
        @mesh.add group
            
        @mesh.position.set 0, @height/2*@lineHeight, 0
        
        # adjust projection
        z = 20+4*@height
        z = Math.max z, parseInt @width*4

        @cameraOffset = Math.max @cameraOffset, z
        @camera.position.copy new Vector 0 0 @cameraOffset
        @sun1.position.set -@cameraOffset/5 @cameraOffset/5 @cameraOffset
        @sun2.position.set  @cameraOffset/5 @cameraOffset/5 @cameraOffset
        @camera.lookAt new THREE.Vector3 0 0 0
        @height += 1

    setOpacity: (o) ->
        
        @mesh.traverse (c) -> c.material?.opacity = o
            
    resized: (w,h) ->
        
        @camera.aspect = w/h
        @camera.updateProjectionMatrix()
    
    performAction: (action) ->
        
        switch action.id
            when Action.SHOW
                @setOpacity action.getRelativeTime()
            when Action.HIDE
                @setOpacity 1 - action.getRelativeTime()
    
    actionFinished: (action) ->
        
        switch action.id
            when Action.HIDE
                @del()
            when Action.SHOW
                @setOpacity 1
            
    fadeOut: => 
        
        return if @fadingOut
        @fadingOut = true
        @stopAction @getActionWithId Action.SHOW
        @startTimedAction @getActionWithId Action.HIDE
    
module.exports = ScreenText
    