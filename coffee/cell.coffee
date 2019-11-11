
#    0000000  00000000  000      000    
#   000       000       000      000    
#   000       0000000   000      000    
#   000       000       000      000    
#    0000000  00000000  0000000  0000000

{ _ } = require 'kxk'

TmpObject = require './tmpobject'

class Cell
    
    @: -> @objects = []
    
    isEmpty: -> @objects.length == 0    
    getObjectsOfType: (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectOfType:  (clss) -> _.find @objects, (o) -> o instanceof clss

    getRealObjectOfType: (clss) -> _.find @objects, (o) -> o instanceof clss or o instanceof TmpObject and o.object instanceof clss
    getOccupant: -> _.find @objects, (o) -> o.isSpaceEgoistic()

    removeObject: (object) ->
        # klog "cell.removeObject #{object.name}", @objects.length
        for o in @objects
            o?.cellMateLeft object if o != object
        _.remove @objects, (o) -> o == object or o.object == object
        # klog "cell.removeObject #{object.name}", @objects.length

    addObject: (object) ->
        # klog "cell.addObject #{object.name}"
        for o in @objects
            o?.newCellMate object
        @objects.push object

module.exports = Cell