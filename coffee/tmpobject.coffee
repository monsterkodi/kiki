# 000000000  00     00  00000000    0000000   0000000          000  00000000   0000000  000000000
#    000     000   000  000   000  000   000  000   000        000  000       000          000   
#    000     000000000  00000000   000   000  0000000          000  0000000   000          000   
#    000     000 0 000  000        000   000  000   000  000   000  000       000          000   
#    000     000   000  000         0000000   0000000     0000000   00000000   0000000     000   

Item = require './item'

class TmpObject extends Item
    
    constructor: (o) ->
        @time = 0
        @object = o
        super
    
    del: ->
        
module.exports = TmpObject