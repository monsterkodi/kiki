
#    0000000  00000000  000      000    
#   000       000       000      000    
#   000       0000000   000      000    
#   000       000       000      000    
#    0000000  00000000  0000000  0000000

TmpObject = require './tmpobject'

class Cell
    
    constructor: () -> @objects = []
        
    getObjectsOfType: (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectOfType:  (clss) -> _.find @objects, (o) -> o instanceof clss

    getRealObjectOfType: (clss) -> _.find @objects, (o) -> o instanceof clss or o instanceof TmpObject and o.object instanceof clss
    getOccupant: -> _.find @objects, (o) -> o.isSpaceEgoistic()

    removeObject: (object) -> 
        for o in @objects
            o.cellMateLeft object if o != object
        _.pull @objects, object

    addObject: (object) ->
        for o in @objects
            o.newCellMate object
        @objects.push object

module.exports = Cell