
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
    
    @init: -> @font = new THREE.Font require 'three/examples/fonts/helvetiker_bold.typeface.json'
        
    @: (@text) ->
        
        super
        
        @addAction new Action @, Action.SHOW, "show#{@constructor.name}" 500
        @addAction new Action @, Action.HIDE, "hide#{@constructor.name}" 500
                
        @scene = new THREE.Scene()
        @lineHeight = 1.3 if not @lineHeight?
        @sun = new THREE.PointLight 0xffffff
        @sun.position.set -1,1,10
        @scene.add @sun
        
        @width = @height = 0
        @mesh = new THREE.Object3D
        @scene.add @mesh
        @fov = 20
        @aspect = world.screenSize.w/world.screenSize.h
        @near = 0.1
        @far  = 100
        @camera = new THREE.PerspectiveCamera @fov, @aspect, @near, @far
        if @text?
            for l in @text.split '\n'
                @addText l 
            @show()
    
    del: ->
        
        # klog 'del text' @text
        @scene.remove @mesh
        @scene.remove @sun
        Timer.removeActionsOfObject @
        world.text = null if world.text == @
    
    show: -> @startTimedAction @getActionWithId Action.SHOW
    
    addText: (str, scaleFactor=1) ->
        
        geom = new THREE.TextGeometry str, 
            font: ScreenText.font
            size: 1*scaleFactor
            height: 4
            bevelEnabled: true
            bevelThickness: 0.1
            bevelSize: 0.04
                
        @width = Math.max str.length, @width
        geom.computeBoundingBox()
        min = geom.boundingBox.min
        max = geom.boundingBox.max
        mesh = new THREE.Mesh geom, Material.text.clone()
        mesh.translateX -(max.x-min.x)/2
        mesh.translateY -@height * @lineHeight
        @mesh.add mesh
        @mesh.position.set 0, @height/2*@lineHeight, 0
        
        # adjust projection  
        z = 20+4*@height
        @camera.position.copy new Vector 0,0,z
        @sun.position.set -z/5,z/5,z
        @camera.lookAt new Vector 0,0,0
        @height += 1

    setOpacity: (o) ->
        
        for c in @mesh.children
            c.material.opacity = o

    resized: (w,h) ->
        
        @aspect = w/h
        @camera.aspect = @aspect
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
            
    fadeOut: -> 
        
        return if @fadingOut
        @fadingOut = true
        @stopAction @getActionWithId Action.SHOW
        @startTimedAction @getActionWithId Action.HIDE
    
module.exports = ScreenText
    