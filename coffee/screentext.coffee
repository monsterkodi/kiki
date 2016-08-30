
#    0000000   0000000  00000000   00000000  00000000  000   000  000000000  00000000  000   000  000000000
#   000       000       000   000  000       000       0000  000     000     000        000 000      000   
#   0000000   000       0000000    0000000   0000000   000 0 000     000     0000000     00000       000   
#        000  000       000   000  000       000       000  0000     000     000        000 000      000   
#   0000000    0000000  000   000  00000000  00000000  000   000     000     00000000  000   000     000   

Camera   = require './camera'
Action   = require './action'
Timer    = require './timer'
Actor    = require './actor'
Vector   = require './lib/vector'
Material = require './material'

class ScreenText extends Actor    
    
    @init: -> @font = new THREE.Font require 'three/examples/fonts/helvetiker_bold.typeface.json'
        
    constructor: (text) ->
        super
        
        @addAction new Action @, Action.SHOW,   "show",  500
        @addAction new Action @, Action.HIDE,   "hide",  500
                
        @scene = new THREE.Scene()
        
        sun = new THREE.PointLight 0xffffff
        sun.position.set -1,1,10
        @scene.add sun
        
        @width = @height = 0
        @mesh = new THREE.Object3D
        @scene.add @mesh
        @fov = 20
        @aspect = world.screenSize.w/world.screenSize.h
        @near = 0.1
        @far  = 100
        @camera = new THREE.PerspectiveCamera @fov, @aspect, @near, @far
        if text?
            @addText text 
            @show()
    
    show: -> @startTimedAction @getActionWithId Action.SHOW
    
    addText: (str, scaleFactor) ->
        @height += 1
        geom = new THREE.TextGeometry str, 
            font: ScreenText.font
            size: 1
            height: 0.5
            bevelEnabled: true
            bevelThickness: 0.1
            bevelSize: 0.04
                
        @width  = Math.max str.length, @width
        geom.computeBoundingBox()
        geom.normalize()
        min = geom.boundingBox.min
        max = geom.boundingBox.max
        mesh = new THREE.Mesh geom, Material.text
        @mesh.add mesh
        
        # adjust projection    
        @camera.position.copy new Vector 0,0,6*@height
        @camera.lookAt new Vector 0,0,0

    resized: (w,h) ->
        @aspect = w/h
        @camera.aspect = @aspect
        @camera.updateProjectionMatrix()
    
    performAction: (action) ->
        switch action.id
            when Action.SHOW
                Material.text.opacity = action.getRelativeTime()
            when Action.HIDE
                Material.text.opacity = 1 - action.getRelativeTime()
    
    actionFinished: (action) ->
        switch action.id
            when Action.HIDE
                @emit 'hidden'
            when Action.SHOW
                Material.text.opacity = 1
            
    fadeOut: -> 
        return if @fadingOut
        @fadingOut = true
        @stopAction @getActionWithId Action.SHOW
        @startTimedAction @getActionWithId Action.HIDE
    
module.exports = ScreenText
    