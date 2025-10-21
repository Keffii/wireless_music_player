package com.example.media_controller_iot.service;

import com.example.media_controller_iot.models.PlayerCommandLog;
import com.example.media_controller_iot.repository.PlayerCommandLogRepo;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class PlayerService {

    private final PlayerCommandLogRepo playerCommandLogRepo;
    private boolean isPlaying = false;
    private int currentSong = 1;
    private int volume = 50;
    private boolean isMuted = false;
    private int previousVolume = 50;
    private String lastCommand = "NONE";

    public PlayerService(PlayerCommandLogRepo playerCommandLogRepo) {
        this.playerCommandLogRepo = playerCommandLogRepo;
    }

    public void mediaCommands(String cmd) {
        switch (cmd) {
            case "PLAY" -> isPlaying = true;
            case "PAUSE" -> isPlaying = false;
            case "NEXT" -> currentSong++;
            case "PREV" -> currentSong = Math.max(currentSong - 1, 1);
            case "MUTE" -> toggleMute();
            default -> {
                if (cmd.trim().startsWith("VOLUME:")) {
                    handleVolumeCommand(cmd);
                }
            }
        }

        lastCommand = cmd;
        System.out.println("Command received: " + cmd);
        playerCommandLogRepo.save(new PlayerCommandLog(cmd));
    }

    private void toggleMute() {
        if (!isMuted) {
            previousVolume = volume;
            volume = 0;
            isMuted = true;
        } else {
            volume = previousVolume;
            isMuted = false;
        }
    }

    private void handleVolumeCommand(String cmd) {
        try {
            int newVolume = Integer.parseInt(cmd.split(":")[1]);
            if (newVolume != volume) {
                volume = Math.min(100, Math.max(0, newVolume));
                isMuted = false;
            }
        } catch (Exception e) {
            System.err.println("Invalid volume command format: " + cmd);
        }
    }

    public Map<String, Object> getState() {
        return Map.of(
                "isPlaying", isPlaying,
                "currentSong", currentSong,
                "volume", volume,
                "isMuted", isMuted,
                "lastCommand", lastCommand
        );
    }
}
