
#    0000000  00000000  000      000    
#   000       000       000      000    
#   000       0000000   000      000    
#   000       000       000      000    
#    0000000  00000000  0000000  0000000

log         = require '/Users/kodi/s/ko/js/tools/log'
TmpObject   = require './tmpobject'
_           = require 'lodash'

class Cell
    
    constructor: () -> @objects = []
    
    isEmpty: -> @objects.length == 0    
    getObjectsOfType: (clss) -> @objects.filter (o) -> o instanceof clss
    getObjectOfType:  (clss) -> _.find @objects, (o) -> o instanceof clss

    getRealObjectOfType: (clss) -> _.find @objects, (o) -> o instanceof clss or o instanceof TmpObject and o.object instanceof clss
    getOccupant: -> _.find @objects, (o) -> o.isSpaceEgoistic()

    removeObject: (object) ->
        # log 'cell.removeObject ', @objects.length
        for o in @objects
            o.cellMateLeft object if o != object
        _.remove @objects, (o) -> o == object or o.object == object
        # log 'cell.removedObject ', (o.name for o in @objects)

    addObject: (object) ->
        for o in @objects
            o.newCellMate object
        @objects.push object

module.exports = Cell