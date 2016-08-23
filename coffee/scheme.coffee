
#    0000000   0000000  000   000  00000000  00     00  00000000
#   000       000       000   000  000       000   000  000     
#   0000000   000       000000000  0000000   000000000  0000000 
#        000  000       000   000  000       000 0 000  000     
#   0000000    0000000  000   000  00000000  000   000  00000000

rgb = (r,g,b) -> new THREE.Color r,g,b

module.exports = 

    # 0000000    00000000  00000000   0000000   000   000  000      000000000
    # 000   000  000       000       000   000  000   000  000         000   
    # 000   000  0000000   000000    000000000  000   000  000         000   
    # 000   000  000       000       000   000  000   000  000         000   
    # 0000000    00000000  000       000   000   0000000   0000000     000   
    
    default:          
        plate:
            color:  rgb 0.5, 0, 0
        wall:
            specular: rgb 0.16, 0, 0
        stone:            
            color:  rgb 0.8, 0.5, 0
        bomb:             
            color:  rgb 0.5, 0, 0
        bulb:            
            color:  rgb 1, 0.6, 0
        player:           
            color:  rgb 0x2222ff
        tire:
            color:      rgb 0x000066
            specular:   rgb 0x222255
        switch:           
            color:  rgb 0, 0, 0.5
        gate:             
            color:  rgb 1, 0.5, 0
        mutant:           
            color:  rgb 0.5, 0, 0
        mutantTire:
            color:  rgb 0, 0, 0.2
        text:             
            color:  rgb 0.8, 0.8, 0
            bright: rgb 1, 1, 0
            dark:   rgb 0.6, 0.4, 0
        gear:             
            color:  rgb 0.1, 0.1, 0.9
        wire:             
            color:  rgb 0.1, 0.1, 0.9
        glow:
            color:  rgb 1, 1, 0
    
    # 000000000  00000000    0000000   000   000
    #    000     000   000  000   000  0000  000
    #    000     0000000    000   000  000 0 000
    #    000     000   000  000   000  000  0000
    #    000     000   000   0000000   000   000
    
    tron:      
        plate:
            color:  rgb 0.05, 0.05, 0.2
        # raster:            
            # color:  rgb 0, 0, 0.3
        bulb:            
            color:  rgb 0, 0, 1
        bomb:             
            color:  rgb 0.5, 0, 0
        stone:            
            color:  rgb 0, 0, 1
        switch:           
            color:  rgb 0, 0, 0.5
        gate:             
            color:  rgb 1, 1, 0
        player:           
            color:  rgb 0.5, 0.5, 0.5
        tire:         
            color:  rgb 0, 0, 0.5
        mutant:
            color:  rgb 0.5, 0, 0
        mutantTire:
            color:  rgb 0, 0, 0.2
        text:             
            color:  rgb 0.8, 0.8, 0
            bright: rgb 1, 1, 0
            dark:   rgb 0.6, 0.4, 0
        gear:             
            color:  rgb 0.1, 0.1, 0.9
        wire:             
            color:  rgb 0.1, 0.1, 0.9
        glow:
            color:  rgb 1, 1, 0
    
    # 000   000  00000000  000   000  000000000  00000000    0000000   000   000
    # 0000  000  000       000   000     000     000   000  000   000  0000  000
    # 000 0 000  0000000   000   000     000     0000000    000   000  000 0 000
    # 000  0000  000       000   000     000     000   000  000   000  000  0000
    # 000   000  00000000   0000000      000     000   000   0000000   000   000
    
    neutron:          
        plate:
            color:  rgb 0.5, 0.5, 0.5
        # raster:            
            # color:  rgb 0.13, 0.13, 0.13
        bulb:            
            color:  rgb 0, 0, 0
        bomb:             
            color:  rgb 0.5, 0, 0
        stone:            
            color:  rgb 0.5, 0.5, 0.5
            opacity:      0.5
        switch:           
            color:  rgb 0, 0, 0.5
        gate:             
            color:  rgb 1, 1, 0
        player:           
            color:  rgb 1, 0.5, 0
        tire:         
            color:  rgb 0.5, 0, 0
        mutant:           
            color:  rgb 0.5, 0, 0
        mutantTire:
            color:  rgb 0, 0, 0.2
        text:             
            color:  rgb 0.8, 0.8, 0
            bright: rgb 1, 1, 0
            dark:   rgb 0.6, 0.4, 0
        gear:             
            color:  rgb 1, 0, 0
        wire:             
            color:  rgb 0.1, 0.1, 0.9
        glow:
            color:  rgb 1, 1, 0
    
    # 000000000  00000000   0000000  000000000
    #    000     000       000          000   
    #    000     0000000   0000000      000   
    #    000     000            000     000   
    #    000     00000000  0000000      000   
    
    test:             
        plate:
            color:  rgb 0.08, 0.08, 0.08
        # raster:            
            # color:  rgb 1, 1, 1
        bulb:            
            color:  rgb 0, 0, 0
        bomb:             
            color:  rgb 0.5, 0, 0
        stone:            
            color:  rgb 0.5, 0.5, 0.5
            opacity:      0.5
        switch:           
            color:  rgb 0, 0, 0.5, 0.8
        gate:             
            color:  rgb 1, 1, 0, 0.8
        player:           
            color:  rgb 1, 0.5, 0
        tire:            
            color:  rgb 0.5, 0, 0
        mutant:           
            color:  rgb 1, 0.5, 0
        mutantTire:
            color:  rgb 0.5, 0, 0
        text:             
            color:  rgb 0.8, 0.8, 0
            bright: rgb 1, 1, 0
            dark:   rgb 0.6, 0.4, 0
        gear:             
            color:  rgb 0.1, 0.1, 0.9
        wire:             
            color:  rgb 0.1, 0.1, 0.9
        glow:
            color:  rgb 1, 1, 0
    
    #  0000000   0000000   000   000  0000000    000   000
    # 000       000   000  0000  000  000   000   000 000 
    # 000       000000000  000 0 000  000   000    00000  
    # 000       000   000  000  0000  000   000     000   
    #  0000000  000   000  000   000  0000000       000   
    
    candy:            
        plate:
            color:  rgb 0.8, 0, 0.9
        # raster:            
            # color:  rgb 0.35, 0, 0.35
        bulb:            
            color:  rgb 0, 0, 0
        text:             
            color:  rgb 0.7, 0, 0.7
            bright: rgb 1, 0, 1
            dark:   rgb 0.4, 0, 0.4
        bomb:             
            color:  rgb 0.73, 0, 0.75
        stone:            
            color:  rgb 0.85, 0, 0.95
            opacity:      0.6
        switch:           
            color:  rgb 0.3, 0, 0.3
        gate:             
            color:  rgb 1, 0, 1, 0.8
        player:           
            color:  rgb 0.7, 0, 0.7
        tire:            
            color:  rgb 0.3, 0, 0.3
        mutant:           
            color:  rgb 0.3, 0, 0.3
        mutantTire:
            color:  rgb 0.7, 0, 0.7
        gear:             
            color:  rgb 0.7, 0, 0.7
        wire:             
            color:  rgb 1, 0, 1
        glow:
            color:  rgb 1, 1, 0
        
    # 0000000    00000000    0000000   000   000  0000000  00000000
    # 000   000  000   000  000   000  0000  000     000   000     
    # 0000000    0000000    000   000  000 0 000    000    0000000 
    # 000   000  000   000  000   000  000  0000   000     000     
    # 0000000    000   000   0000000   000   000  0000000  00000000
    
    bronze:           
        plate:
            color:  rgb 0.8, 0.6, 0.2
        bulb:            
            color:     rgb 1,1,1
            emissive:  rgb 1,1,0
        stone:            
            color:  rgb 1, 0.8, 0.4
            opacity:      0.8
        switch:           
            color:  rgb 0.9, 0.7, 0.1
        gate:             
            color:  rgb 0.9, 0.7, 0.1
        player:           
            color:  rgb 0.8, 0.6, 0.3
        tire:
            color:  rgb 0.5, 0.2, 0.1
        mutant:           
            color:  rgb 0.5, 0.2, 0.1
        mutantTire:
            color:  rgb 0.3, 0.1, 0
        gear:             
            color:  rgb 0.7, 0.4, 0.1
        wire:             
            color:  rgb 0.6, 0, 0
        glow:
            color:  rgb 1, 1, 0
        bomb:             
            color:  rgb 0.9, 0.7, 0.1
        text:             
            color:  rgb 0.7, 0.5, 0.1
            bright: rgb 0.9, 0.7, 0.15
            dark:   rgb 0.6, 0.4, 0
    
    # 00000000   00000000  0000000  
    # 000   000  000       000   000
    # 0000000    0000000   000   000
    # 000   000  000       000   000
    # 000   000  00000000  0000000  
    
    red:              
        plate:
            color:  rgb 0.3, 0, 0
        wall:            
            color:  rgb 0.2, 0, 0
        bulb:            
            color:  rgb 0.8, 0, 0
        bomb:             
            color:  rgb 0.5, 0, 0
        stone:            
            color:  rgb 0.5, 0, 0
            opacity: 0.6
        switch:           
            color:  rgb 0.6, 0, 0
        gate:             
            color:  rgb 1, 0.2, 0
        player:           
            color:  rgb 0.7, 0, 0
        tire:
            color:  rgb 0.3, 0, 0
        mutant:           
            color:  rgb 0.3, 0, 0
        mutantTire:
            color:  rgb 0.7, 0, 0
        gear:             
            color:  rgb 1, 0.5, 0
        wire:             
            color:  rgb 0.5, 0, 0
        text:             
            color:  rgb 1, 0.5, 0
            bright: rgb 1, 0.8, 0
            dark:   rgb 0.4, 0.2, 0
    
    # 0000000    000      000   000  00000000
    # 000   000  000      000   000  000     
    # 0000000    000      000   000  0000000 
    # 000   000  000      000   000  000     
    # 0000000    0000000   0000000   00000000
    
    blue:             
        plate:
            color:  rgb 0.1, 0.1, 0.6
        # raster:            
            # color:  rgb 0, 0, 0.2
        bulb:            
            color:  rgb 0.1, 0.1, 0.1
        stone:            
            color:  rgb 0, 0, 0.5
            opacity:      0.6
        switch:           
            color:  rgb 0, 0, 0.6, 0.8
        bomb:             
            color:  rgb 0.2, 0.2, 0.9
            opacity:      0.8
        gate:             
            color:  rgb 0, 0.2, 1
        player:           
            color:  rgb 0, 0, 0.7
        tire:
            color:  rgb 0, 0, 0.3
        mutant:           
            color:  rgb 0, 0, 0.3
        mutantTire:
            color:  rgb 0, 0, 0.7
        text:             
            color:  rgb 0.2, 0.4, 0.8
            bright: rgb 0.7, 0.8, 1
            dark:   rgb 0, 0, 0.6
        gear:             
            color:  rgb 0.1, 0.1, 0.9
        wire:             
            color:  rgb 0.1, 0.1, 0.9
        glow:
            color:  rgb 1, 0.5, 0
    
    # 000   000  00000000  000      000       0000000   000   000
    #  000 000   000       000      000      000   000  000 0 000
    #   00000    0000000   000      000      000   000  000000000
    #    000     000       000      000      000   000  000   000
    #    000     00000000  0000000  0000000   0000000   00     00
    
    yellow:           
        plate:
            color:  rgb 0.9, 0.9, 0
        # raster:            
            # color:  rgb 0.34, 0.34, 0
        bulb:            
            color:  rgb 0, 0, 0
        bomb:             
            color:  rgb 0.75, 0.75, 0
        stone:            
            color:  rgb 0.8, 0.85, 0
            opacity:      0.6
        switch:           
            color:  rgb 0.8, 0.8, 0
        gate:             
            color:  rgb 1, 1, 0, 0.8
        player:           
            color:  rgb 0.7, 0.7, 0
        tire:
            color:  rgb 0.3, 0.3, 0
        mutant:           
            color:  rgb 0.3, 0.3, 0
        mutantTire:
            color:  rgb 0.7, 0.7, 0
        gear:             
            color:  rgb 0.7, 0.5, 0
        wire:             
            color:  rgb 1, 1, 0
        glow:
            color:  rgb 0, 0, 1
        text:             
            color:  rgb 0.7, 0.7, 0
            bright: rgb 1, 1, 0
            dark:   rgb 0.4, 0.4, 0
    
    #  0000000   00000000   00000000  00000000  000   000
    # 000        000   000  000       000       0000  000
    # 000  0000  0000000    0000000   0000000   000 0 000
    # 000   000  000   000  000       000       000  0000
    #  0000000   000   000  00000000  00000000  000   000
    
    green:            
        plate:
            color:  rgb 0.1, 0.6, 0.1
        # raster:            
            # color:  rgb 0, 0.2, 0
        bulb:            
            color:  rgb 0, 0, 0
        stone:            
            color:  rgb 0, 0.5, 0
        switch:           
            color:  rgb 0, 0.6, 0
        bomb:            
            color:  rgb 0, 0.2, 0
        gate:             
            color:  rgb 0, 0.5, 0
        player:           
            color:  rgb 0, 0.7, 0
        tire:
            color:  rgb 0, 0.3, 0
        mutant:           
            color:  rgb 0, 0.3, 0
        mutantTire:
            color:  rgb 0, 0.7, 0
        text:             
            color:  rgb 0, 0.4, 0
            bright: rgb 0, 0.6, 0
            dark:   rgb 0, 0.2, 0
        gear:             
            color:  rgb 0, 0.2, 0
        wire:             
            color:  rgb 0.1, 0.9, 0
        glow:
            color:  rgb 1, 1, 1
                             
    # 00     00  00000000  000000000   0000000   000    
    # 000   000  000          000     000   000  000    
    # 000000000  0000000      000     000000000  000    
    # 000 0 000  000          000     000   000  000    
    # 000   000  00000000     000     000   000  0000000
    
    metal:            
        plate:
            color:  rgb 0.7,0.7,0.7
        # raster:            
            # color:  rgb 0.2, 0.2, 0.2
        bulb:            
            color:  rgb 1, 1, 1
        stone:            
            color:  rgb 1, 1, 1
            opacity: 0.6
        switch:           
            color:  rgb 0.9, 1, 0.9
        gate:             
            color:  rgb 1, 1, 1, 0.8
        player:           
            color:  rgb 0.6, 0.6, 0.6
        tire:
            color:  rgb 0.3, 0.3, 0.3
        mutant:           
            color:  rgb 0.8, 0.8, 0.8
        mutantTire:         
            color:  rgb 0.7, 0.7, 0.7
        bomb:             
            color:  rgb 0.4, 0.4, 0.5
        gear:             
            color:  rgb 0.2, 0.4, 0.5
        wire:             
            color:  rgb 1, 1, 1
        glow:
            color:  rgb 1, 1, 1
        text:             
            color:  rgb 0.2, 0.4, 0.5
            bright: rgb 0.3, 0.9, 1
            dark:   rgb 0.1, 0.3, 0.4
    
    #  0000000  00000000    0000000   0000000  000   000
    # 000       000   000  000   000     000    000 000 
    # 000       0000000    000000000    000      00000  
    # 000       000   000  000   000   000        000   
    #  0000000  000   000  000   000  0000000     000   
    
    crazy:            
        # plate:
            # color: rgb 0, 0.51, 0.82
        raster:            
            color: rgb 0.84, 0.22, 0.20
        bulb:            
            color:  rgb 0, 0, 0
        stone:            
            color:  rgb 1, 1, 1
            stone:        0.2
        switch:           
            color:  rgb 0.9, 1, 0.9
        gate:             
            color:  rgb 1, 1, 1, 0.8
        player:           
            color:  rgb 0.6, 0.6, 0.6
        tire:
            color:  rgb 0.3, 0.3, 0.3
        mutant:           
            color:  rgb 0.8, 0.8, 0.8
        mutantTire:         
            color:  rgb 0.7, 0.7, 0.7
        bomb:             
            color:  rgb 0.4, 0.4, 0.5
            opacity:      0.2
        gear:             
            color:  rgb 0.2, 0.4, 0.5
        wire:             
            color:  rgb 1, 1, 1
        glow:
            color:  rgb 0, 0, 1
        text:             
            color:  rgb 0.2, 0.4, 0.5
            bright: rgb 0.3, 0.9, 1
            dark:   rgb 0.1, 0.3, 0.4
    
    # 0000000  00000000  000   000
    #    000   000       0000  000
    #   000    0000000   000 0 000
    #  000     000       000  0000
    # 0000000  00000000  000   000
    
    zen:              
        plate:
            color:  rgb 0.36, 0.45, 0.30
        # raster:            
            # color:  rgb 0.75, 0.95, 0.64
        bulb:            
            color:  rgb 0, 0, 0
        stone:            
            color:  rgb 0.36, 0.45, 0.30
            opacity:      0.7
        switch:           
            color:  rgb 0.9, 1, 0.9, 0.8
        gate:             
            color:  rgb 1, 1, 1, 0.8
        player:           
            color:  rgb 0.6, 0.6, 0.6
        tire:
            color:  rgb 0.3, 0.3, 0.3
        mutant:           
            color:  rgb 0.8, 0.8, 0.8
        mutantTire:         
            color:  rgb 0.7, 0.7, 0.7
        bomb:             
            color:  rgb 0.4, 0.4, 0.5
            opacity:      0.9
        gear:             
            color:  rgb 0.2, 0.4, 0.5
        wire:             
            color:  rgb 1, 1, 1, 0.9
        glow:
            color:  rgb 0, 0, 1
        text:             
            color:  rgb 0.2, 0.4, 0.5
            bright: rgb 0.3, 0.9, 1
            dark:   rgb 0.1, 0.3, 0.4
                             
                             