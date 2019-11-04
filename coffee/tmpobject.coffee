# 000000000  00     00  00000000    0000000   0000000          000  00000000   0000000  000000000
#    000     000   000  000   000  000   000  000   000        000  000       000          000   
#    000     000000000  00000000   000   000  0000000          000  0000000   000          000   
#    000     000 0 000  000        000   000  000   000  000   000  000       000          000   
#    000     000   000  000         0000000   0000000     0000000   00000000   0000000     000   

Item = require './item'

class TmpObject extends Item
    
    @tmpID = 0
    isSpaceEgoistic: -> true
    
    constructor: (o) ->
        TmpObject.tmpID += 1
        @time = 0
        @object = o
        @name = "tmp#{TmpObject.tmpID}"
        super
        @setPos o.getPos()
    
    del: -> 
        # log "tmpObject -------- del #{@name}", @getPos()
        super
        
module.exports = TmpObject
