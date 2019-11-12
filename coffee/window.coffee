# 000   000  000  000   000  0000000     0000000   000   000
# 000 0 000  000  0000  000  000   000  000   000  000 0 000
# 000000000  000  000 0 000  000   000  000   000  000000000
# 000   000  000  000  0000  000   000  000   000  000   000
# 00     00  000  000   000  0000000     0000000   00     00

{ gamepad, win, $ } = require 'kxk'

Kiki = require './kiki'

class MainWin extends win
    
    @: ->
        
        @last = left:{x:0 y:0}, right:{x:0 y:0}
        @inhibit = left:0 right:0
        super
            dir:    __dirname
            pkg:    require '../package.json'
            menu:   '../coffee/menu.noon'
            icon:   '../img/mini.png'
            prefsSeperator: '▸'
            context: false
            onLoad: @onLoad
            
    onLoad: =>

        @kiki = new Kiki $ '#main'
        @kiki.start()
        @win.on 'resize' @kiki.resized        
        
        gamepad.on 'button' @onPadButton
        gamepad.on 'axis'   @onPadAxis
        
    onPadButton: (button, value) =>
        
        key = switch button
            when 'Menu'  then 'esc'
            when 'Back'  then 'q'
            when 'Start' then 'e'
            when 'A'     then 'space'
            when 'B'     then 'f'
            when 'X'     then 'ctrl'
            when 'Y'     then 'c'
            when 'RT'    then 'f'
            when 'LT'    then 'ctrl'
            when 'LB'    then 'left'
            when 'RB'    then 'right'
            when 'Up' 'Down' 'Left' 'Right' then button.toLowerCase()

        if key
            if value
                @kiki.world.modKeyComboEventDown '' key, key
            else
                @kiki.world.modKeyComboEventUp '' key, key

    onPadAxis: (state) => 

        down = (key) -> world.modKeyComboEventDown '' key, key
        up   = (key) -> world.modKeyComboEventUp '' key, key

        if state.left.y < -0.20 and @last.left.y >= -0.20 then down 'down'
        if state.left.y > -0.12 and @last.left.y <= -0.12 then up   'down'
        if state.left.y <  0.12 and @last.left.y >=  0.12 then up   'up'
        if state.left.y >  0.20 and @last.left.y <=  0.20 then down 'up'

        if state.right.y < -0.20 and @last.right.y >= -0.20 then down 'down'
        if state.right.y > -0.12 and @last.right.y <= -0.12 then up   'down'
        if state.right.y <  0.12 and @last.right.y >=  0.12 then up   'up'
        if state.right.y >  0.20 and @last.right.y <=  0.20 then down 'up'
  
        if @inhibit.left and state.left.x >= -0.12 and state.right.x >= -0.12
            @inhibit.left = false

        if @inhibit.right and state.left.x <= 0.12 and state.right.x <= 0.12
            @inhibit.right = false
            
        if not @inhibit.left and state.left.x < -0.33 and @last.left.x >= -0.33 
            down 'left'
            up 'left'
            @inhibit.left = true
            
        if not @inhibit.right and state.left.x > 0.33 and @last.left.x <= 0.33
            down 'right'
            up 'right'
            @inhibit.right = true

        if not @inhibit.left and state.right.x < -0.33 and @last.right.x >= -0.33
            down 'left'
            up 'left'
            @inhibit.left = true
            
        if not @inhibit.right and state.right.x > 0.33 and @last.right.x <= 0.33
            down 'right'
            up 'right'
            @inhibit.right = true
            
        @last.left = state.left
        @last.right = state.right
        
new MainWin            
