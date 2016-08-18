# level design by Michael Abel

# schemes=[test_scheme, tron_scheme,candy_scheme, default_scheme,
         # green_scheme, yellow_scheme, blue_scheme, red_scheme, metal_scheme, bronze_scheme]

module.exports =
    name:       "gamma"
    scheme:     "tron_scheme"
    size:       [10,10,10]
    intro:      "gamma"
    help:       """
                $scale(1.5)mission:
                activate the exit!
                
                shoot at the 3 switches to activate the exit
                """
    player: 
        coordinates:     [0,5,0]
        nostatus:         0
    exits:    [
        name:         "exit"
        active:       0
        coordinates:  [2,7,4] #absolute coord
    ]
    create: ->
        s = world.size
        world.switch_countera = 0
        world.switch_counter = 0
        
        aswitched = () ->
            # applyColorScheme(schemes[world.switch_countera])
            if world.switch_countera==schemes.length-1
                 world.switch_countera=0
            else
                world.switch_countera+=1
        switched = (swtch) ->
            world.switch_counter += swtch.active and 1 or -1
            exit = kikiObjectToGate(world.getObjectWithName("exit"))
            exit.setActive(world.switch_counter == 4)
                
        aswitch = new Switch()
        bswitch = new Switch()
        cswitch = new Switch()
        dswitch = new Switch()
        eswitch = new Switch()
        
        aswitch.getEventWithName("switched").addAction(continuous(aswitched))
        bswitch.getEventWithName("switched").addAction(continuous((s=bswitch) -> switched(s)))
        cswitch.getEventWithName("switched").addAction(continuous((s=cswitch) -> switched(s)))
        dswitch.getEventWithName("switched").addAction(continuous((s=dswitch) -> switched(s)))
        eswitch.getEventWithName("switched").addAction(continuous((s=eswitch) -> switched(s)))
 
        world.addObjectAtPos(aswitch ,      s.x-1,0,0))
        world.addObjectAtPos(bswitch ,      0,0,0))
           
        world.addObjectAtPos('KikiMutant',  s.x/2,0,0))
        world.addObjectLine('KikiWall',     0,0,1), s.x,0,1))
        world.addObjectLine('KikiWall',     0,1,0), s.x,1,0))
        
        world.addObjectLine('KikiWall',     0,2,2), s.x-3,2,2))
        world.addObjectAtPos('KikiSwitch',  s.x-3,2,2))
        world.addObjectLine('KikiWall',     2,2,2), 2,2,s.z-3))
        world.addObjectAtPos('KikiSwitch',  2,2,s.z-3))
        world.addObjectLine('KikiWall',     2,2,4), 2,s.y-3,4))
        #exit 
        world.addObjectAtPos('KikiSwitch' , 2,s.y-3,4))
           
        world.addObjectLine('KikiWall',     2,4,4), s.x-4,4,4))
        world.addObjectAtPos(cswitch ,      s.x-3,4,4))
           
        world.addObjectLine('KikiWall',     4,4,4), 4,4,s.z-4))
        world.addObjectAtPos(dswitch ,      4,4,s.z-3))
           
        world.addObjectLine('KikiWall',     4,4,6), 4,s.y-4,6))
        world.addObjectAtPos(eswitch ,      4,s.y-3,6))
        