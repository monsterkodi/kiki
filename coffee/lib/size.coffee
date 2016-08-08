#  0000000  000  0000000  00000000
# 000       000     000   000     
# 0000000   000    000    0000000 
#      000  000   000     000     
# 0000000   000  0000000  00000000

class Size
    
    constructor: (@w, @h) -> 
        @x = @w
        @y = @h
    
    div:   (d) -> new Size parseInt(@w/d), parseInt(@h/d)
    mul:   (d) -> new Size parseInt(@w*d), parseInt(@h*d)
    minus: (s) -> new Size @w-s.w,@h-s.h
    plus:  (s) -> new Size @w+s.w,@h+s.h
    eql:   (s) -> @w == s.w and @h == s.h        
        
module.exports = Size
