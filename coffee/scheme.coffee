
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
        bulb:            
            color:  rgb 0.4, 0.4, 1
        bomb:             
            color:  rgb 0.5, 0, 0
        stone:            
            color:  rgb 0, 0, 1
        switch:           
            color:  rgb 0, 0, 0.5
        gate:             
            color:  rgb 1, 1, 0
        player:           
            color:  rgb 1, 0.6, 0
        tire:         
            color:  rgb 0, 0, 0.6
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
    
    # 000000000  00000000   0000000  000000000
    #    000     000       000          000   
    #    000     0000000   0000000      000   
    #    000     000            000     000   
    #    000     00000000  0000000      000   
    
    test:             
        plate:
            color:  rgb 0.08, 0.08, 0.08
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
        wall:
            color:  rgb 0.5, 0.5, 1
        bulb:
            color:  rgb 1, 1, 1
        text:             
            color:  rgb 0.7, 0, 0.7
            bright: rgb 1, 0, 1
            dark:   rgb 0.4, 0, 0.4
        bomb:             
            color:  rgb 1, 0.8, 0
        stone:            
            color:    rgb 0.85, 0, 0.5
            opacity:  0.4
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
            color:  rgb 0.5, 0.5, 1
        wirePlate:             
            color:  rgb 0, 0, 1
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
            color:  rgb 0.3, 0.3, 1
        bulb:            
            color:  rgb 0.6, 0.6, 1
        stone:            
            color:  rgb 0, 0, 0.7
            opacity: 0.6
        switch:           
            color:  rgb 0, 0, 0.6
        bomb:             
            color:  rgb 0, 0, 1
            opacity: 0.8
        gate:             
            color:  rgb 0, 0, 1
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
            color:  rgb 0.8, 0.4, 0
            shininess: 80
        wire:             
            color:  rgb 0, 0, 0.9
        glow:
            color:  rgb 1, 1, 1
    
    # 000   000  00000000  000      000       0000000   000   000
    #  000 000   000       000      000      000   000  000 0 000
    #   00000    0000000   000      000      000   000  000000000
    #    000     000       000      000      000   000  000   000
    #    000     00000000  0000000  0000000   0000000   00     00
    
    yellow:           
        plate:
            color:    rgb 0.9, 0.9, 0
            specular: rgb 0.005, 0.005, 0
            shininess: 40
        raster:
            specular: rgb 0.05, 0.05, 0
            shininess: 180
        bulb:            
            color:  rgb 1, 1, 1
            emissive:  rgb 1,1,0
        glow:
            color:  rgb 1, 1, 1
        bomb:             
            color:  rgb 0.75, 0.75, 0
        stone:            
            color:  rgb 0.8, 0.85, 0
            opacity: 0.6
            shininess: 130
        switch:           
            color:  rgb 0.8, 0.8, 0
        gate:             
            color:  rgb 1, 1, 0
        player:           
            color:  rgb 0.8, 0.8, 0
            shininess: 10
        tire:
            color:  rgb 0.4, 0.4, 0
            specular: rgb 0.4, 0.4, 0
            shininess: 10
        mutant:           
            color:  rgb 0.3, 0.3, 0
        mutantTire:
            color:  rgb 0.7, 0.7, 0
        gear:             
            color:  rgb 0.7, 0.5, 0
        wire:             
            color:  rgb 1, 1, 0
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
        bulb:            
            color:  rgb 0.3, 1, 0.3
        stone:            
            color:     rgb 0, 0.2, 0
            # specular:  rgb 0, 0.01, 0
            opacity:   0.8
            shininess: 60
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
        plate:      
            color:  rgb 0,0,0
        raster:            
            color:  rgb 1,1,1
        stone:
            color:      rgb 1,0,0
            specular:   rgb 1,1,1
            shininess:  1000
        wall:
            color: rgb 1,0,0
        bulb:            
            color:  rgb 1, 0, 0
        switch:           
            color:  rgb 0.9, 1, 0.9
        gate:             
            color:  rgb 1, 0, 0
        player:           
            color:  rgb 1,1,1
        tire:
            color:  rgb 1,1,1
            shininess: 100
        mutant:           
            color:  rgb 0.8, 0.8, 0.8
        mutantTire:         
            color:  rgb 0.7, 0.7, 0.7
        bomb:             
            color:  rgb 1,1,1
            specular: rgb 1,1,1
            opacity: 0.2
            shininess: 2000
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
        bulb:            
            color:  rgb 0.8, 0.8, 0.8
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
                             
                             