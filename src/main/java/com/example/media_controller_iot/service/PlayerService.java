package com.example.media_controller_iot.service;
import com.example.media_controller_iot.models.PlayerCommandLog;
import com.example.media_controller_iot.repository.PlayerCommandLogRepo;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PlayerService {
    private final PlayerCommandLogRepo playerCommandLogRepo;
    private int currentSong = 1;
    private int volume = 50;

    public PlayerService(PlayerCommandLogRepo playerCommandLogRepo) {
        this.playerCommandLogRepo = playerCommandLogRepo;
    }

    public void mediaCommands(String cmd){
        switch(cmd){
            case "NEXT" -> currentSong++;
            case "PREV" -> currentSong = Math.max(currentSong - 1, 1);
            case "VOLUMEUP" -> volume = Math.min(100, volume + 5);
            case "VOLUMEDOWN" -> volume = Math.max(0, volume - 5);
        }
        System.out.println("Command received: " + cmd);
        playerCommandLogRepo.save(new PlayerCommandLog(cmd));
    }

    public Map<String, Object> getState(){
        return Map.of(
                "currentSong", currentSong,
                "volume", volume
        );
    }
}
