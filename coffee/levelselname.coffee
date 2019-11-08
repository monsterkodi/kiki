
# 000      00000000  000   000  00000000  000       0000000  00000000  000      000   000   0000000   00     00  00000000    
# 000      000       000   000  000       000      000       000       000      0000  000  000   000  000   000  000         
# 000      0000000    000 000   0000000   000      0000000   0000000   000      000 0 000  000000000  000000000  0000000     
# 000      000          000     000       000           000  000       000      000  0000  000   000  000 0 000  000         
# 0000000  00000000      0      00000000  0000000  0000000   00000000  0000000  000   000  000   000  000   000  00000000    

{ kerror } = require 'kxk'

ScreenText = require './screentext'
Action     = require './action'

class LevelSelName extends ScreenText

    @: (text) ->

        super()
        @addText text, 2 if text
        @show()
        
    resized: (w,h) ->
        
        @aspect = w/(h*0.3)
        @camera.aspect = @aspect
        @camera.updateProjectionMatrix()
        
module.exports = LevelSelName
