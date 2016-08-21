#  0000000   0000000   000   000  000   000  0000000  
# 000       000   000  000   000  0000  000  000   000
# 0000000   000   000  000   000  000 0 000  000   000
#      000  000   000  000   000  000  0000  000   000
# 0000000    0000000    0000000   000   000  0000000  

log    = require '/Users/kodi/s/ko/js/tools/log'
Howler = require 'howler'
Howl   = Howler.Howl

class Sound

    @sounds =
        BOT_MOVE:          file: "bot_move.wav",            volume: 0.2
        BOT_JUMP:          file: "bot_jump.wav",            volume: 0.7
        BOT_LAND:          file: "bot_land.wav",            volume: 0.7
        BOT_SPIKED:        file: "bot_move.wav",            volume: 1.0
        BOT_HEALTH_ALERT:  file: "bot_health_alert.wav",    volume: 1.0
        BOT_DEATH:         file: "bot_death.wav",           volume: 1.0
        BOT_NO_ENERGY:     file: "bot_no_energy.wav",       volume: 1.0
        BULLET_SHOT:       file: "bullet_shot.wav",         volume: 1.0
        BULLET_HIT_WALL:   file: "bullet_hit_wall.wav",     volume: 1.0
        BULLET_HIT_OBJECT: file: "bullet_hit_object.wav",   volume: 1.0
        BULLET_HIT_PLAYER: file: "bullet_hit_player.wav",   volume: 1.0
        BULLET_HIT_MUTANT: file: "bullet_hit_mutant.wav",   volume: 1.0
        STONE_MOVE:        file: "stone_move.wav",          volume: 1.0
        STONE_LAND:        file: "stone_land.wav",          volume: 1.0
        SWITCH_ON:         file: "switch_on.wav",           volume: 1.0
        SWITCH_OFF:        file: "switch_on.wav",           volume: 0.5
        ATOM_BIRTH:        file: "atom_digest.wav",         volume: 1.0
        ATOM_DIGEST:       file: "atom_digest.wav",         volume: 1.0
        SPIKES_START:      file: "bot_move.wav",            volume: 1.0
        MENU_FADE:         file: "menu_fade.wav",           volume: 1.0
        MENU_ITEM:         file: "menu_item.wav",           volume: 1.0
        MENU_SELECT:       file: "menu_select.wav",         volume: 1.0
        MENU_ABORT:        file: "menu_abort.wav",          volume: 1.0
        GATE_OPEN:         file: "gate_open.wav",           volume: 1.0
        GATE_CLOSE:        file: "gate_close.wav",          volume: 1.0
        GATE_WARP:         file: "gate_warp.wav",           volume: 1.0
        BOMB_EXPLODE:      file: "bomb_explode.wav",        volume: 1.0
        BOMB_SPLITTER:     file: "bomb_splitter.wav",       volume: 1.0
        GEAR_ON:           file: "gear_on.wav",             volume: 1.0
        GEAR_OFF:          file: "gear_off.wav",            volume: 1.0
        GENERATOR_ON:      file: "generator_on.wav",        volume: 1.0
        GENERATOR_OFF:     file: "generator_off.wav",       volume: 1.0
        MOTOR:             file: "bomb_splitter.wav",       volume: 1.0
    
    @play: (sound, pos, time) ->
        log "Sound.playSound #{sound} #{time}", pos  
        # Howler.volume 1
        howl = new Howl src: ["#{__dirname}/../sound/#{@sounds[sound].file}"]
        if world.projection?
            p = world.projection.getPosition()
            Howler.Howler.pos p.x, p.y, p.z
            f = world.projection.getZVector()
            u = world.projection.getYVector()
            Howler.Howler.orientation f.x, f.y, f.z, u.x, u.y, u.z
        howl.pannerAttr 
            maxDistance: 10
            refDistance: 1
            rolloffFactor: 1
            distanceModel: 'exponential'
        id = howl.play()
        # log "sound id #{id}"
        howl.volume @sounds[sound].volume, id
        if pos?
            howl.pos pos.x, pos.y, pos.z, id
        
module.exports = Sound
