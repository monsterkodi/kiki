
#   000  000000000  00000000  00     00
#   000     000     000       000   000
#   000     000     0000000   000000000
#   000     000     000       000 0 000
#   000     000     00000000  000   000

log       = require '/Users/kodi/s/ko/js/tools/log'

class Item

    constructor: ->
    isSpaceEgoistic: -> true
    setPosition: (p) -> 
        @position = @current_position = p
        if @mesh?
            log 'setPosition', @mesh.position
            # @mesh.position = new THREE.Vector3 @position.x, @position.y, @position.z 
            # @mesh.matrixWorldNeedsUpdate = true
            # @mesh.updateMatrix()
            # @mesh.updateMatrixWorld true 
            @mesh.translateX @position.x
            @mesh.translateY @position.y
            @mesh.translateZ @position.z
            log 'setPosition', p, @mesh.position

module.exports = Item