
#   00000000    0000000    0000000
#   000   000  000   000  000     
#   00000000   000   000  0000000 
#   000        000   000       000
#   000         0000000   0000000 

Vector = require './vector'

class Pos

    constructor: (x=0, y=0, z=0) ->
        
        if x.x? and x.y?
            @x = Math.round x.x
            @y = Math.round x.y
            @z = Math.round x.z ? 0
        else if Array.isArray x
            @x = Math.floor x[0]
            @y = Math.floor x[1]
            @z = Math.floor x[2]
        else
            @x = Math.floor x
            @y = Math.floor y
            @z = Math.floor z
        # log "Pos #{@x} #{@y} #{@z}"
        if Number.isNaN @x
            throw new Error

    length:    -> Math.sqrt @x*@x + @y*@y + @z*@z
    vector:    -> new Vector @x, @y, @z 
    minus: (p) -> new Pos @x-p.x, @y-p.y, @z-p.z
    plus:  (p) -> new Pos @x+p.x, @y+p.y, @z+p.z
    mul:   (f) -> new Pos @x*f, @y*f, @z*f
    div:   (d) -> new Pos Math.floor(@x/d), Math.floor(@y/d), Math.floor(@z/d)
    eql:   (p) -> @x==p.x and @y==p.y and @z==p.z
    str:       -> "#{@x} #{@y} #{@z}"

    reset: -> 
        @x = @y = @z = 0
        @
    
    add: (p) -> 
        @x = Math.round @x + p.x 
        @y = Math.round @y + p.y 
        @z = Math.round @z + p.z
        @
        
    sub: (p) -> 
        @x = Math.round @x - p.x 
        @y = Math.round @y - p.y 
        @z = Math.round @z - p.z
        @

module.exports = Pos
