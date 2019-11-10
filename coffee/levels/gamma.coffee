
#  0000000    0000000   00     00  00     00   0000000 
# 000        000   000  000   000  000   000  000   000
# 000  0000  000000000  000000000  000000000  000000000
# 000   000  000   000  000 0 000  000 0 000  000   000
#  0000000   000   000  000   000  000   000  000   000

schemes = ['tron' 'candy' 'default' 'green' 'yellow' 'blue' 'red' 'metal' 'bronze' 'crazy']

module.exports =
    name:       "gamma"
    design:     'Michael Abel'
    scheme:     "tron"
    size:       [10,10,10]
    help:       """
                shoot at the 4 switches 
                to activate the exit.
                """
    player: 
        coordinates:     [5,5,4]
        orientation:     XupY
    exits:    [
        name:         "exit"
        active:       0
        coordinates:  [2,7,4]
    ]
    create: ->
        s = world.size
        world.scheme_counter = 0
        world.switch_counter = 0
        {Switch} = require '../items'
        schemesw = ->
            world.scheme_counter = (world.scheme_counter+1) % schemes.length
            world.applyScheme schemes[world.scheme_counter] 
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = world.getObjectWithName "exit"
            exit.setActive world.switch_counter == 4 
                
        a = new Switch
        b = new Switch
        c = new Switch
        d = new Switch
        e = new Switch
        
        a.getEventWithName("switched").addAction world.continuous schemesw 
        b.getEventWithName("switched").addAction world.continuous -> switched(b)
        c.getEventWithName("switched").addAction world.continuous -> switched(c)
        d.getEventWithName("switched").addAction world.continuous -> switched(d)
        e.getEventWithName("switched").addAction world.continuous -> switched(e)
 
        world.addObjectAtPos a,      s.x-1,0,0
        world.addObjectAtPos b,      0,0,0
        world.addObjectAtPos c ,  s.x-3,4,4
        world.addObjectAtPos d ,  4,4,s.z-3
        world.addObjectAtPos e ,  4,s.y-3,6
        
        world.addObjectAtPos 'Mutant',  s.x/2,0,0
        world.addObjectLine  'Wall',    0,0,1, s.x,0,1
        world.addObjectLine  'Wall',    0,1,0, s.x,1,0
        world.addObjectLine  'Wall',    0,2,2, s.x-3,2,2
        world.addObjectLine  'Wall',    2,2,2, 2,2,s.z-3
        world.addObjectLine  'Wall',    2,2,4, 2,s.y-3,4
        world.addObjectLine  'Wall',    2,4,4, s.x-4,4,4
        world.addObjectLine  'Wall',    4,4,4, 4,4,s.z-4
        world.addObjectLine  'Wall',    4,4,6, 4,s.y-4,6
        
        