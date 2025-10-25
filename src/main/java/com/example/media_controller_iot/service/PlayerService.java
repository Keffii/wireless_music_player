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

    private void toggleMute() {
        if (!isMuted) {
            previousVolume = volume;
            volume = 0;
            isMuted = true;
            isPlaying = false;
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

    public void mediaCommands(String cmd) {
        switch (cmd) {
            case "PLAY" -> {
                isPlaying = true;
                // Auto unmute when playing
                if (isMuted) {
                    volume = previousVolume;
                    isMuted = false;
                }
            }
            case "PAUSE" -> {
                if (!isPlaying) return;
                isPlaying = false;
            }
            case "NEXT" -> {
                currentSong++;
                if (currentSong > 3) currentSong = 1;
            }
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

    private String getSongTitle(int index) {
        return switch (index) {
            case 1 -> "Better Day";
            case 2 -> "Abstract Beauty";
            case 3 -> "Cascade Breathe";
            default -> "Unknown Song";
        };
    }

    private String getSongArtist(int index) {
        return switch (index) {
            case 1 -> "penguinmusic";
            case 2 -> "Grand_Project";
            case 3 -> "NverAvetyanMusic";
            default -> "Unknown Artist";
        };
    }

    public Map<String, Object> getState() {
        return Map.of(
                "isPlaying", isPlaying,
                "currentSong", currentSong,
                "title", getSongTitle(currentSong),
                "artist", getSongArtist(currentSong),
                "volume", volume,
                "isMuted", isMuted,
                "lastCommand", lastCommand
        );
    }
}
