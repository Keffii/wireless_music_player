package com.example.media_controller_iot.service;

import com.example.media_controller_iot.models.PlayerCommandLog;
import com.example.media_controller_iot.repository.PlayerCommandLogRepo;
import org.springframework.stereotype.Service;
import java.util.Map;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.concurrent.CopyOnWriteArrayList;


@Service
public class PlayerService {

    public final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private final PlayerCommandLogRepo playerCommandLogRepo;
    private boolean isPlaying = false;
    private int currentSong = 1;
    private int volume = 50;
    private boolean isMuted = false;
    private int previousVolume = 50;
    private boolean wasPlayingBeforeMute = false;
    private String lastCommand = "NONE";

    public PlayerService(PlayerCommandLogRepo playerCommandLogRepo) {
        this.playerCommandLogRepo = playerCommandLogRepo;
    }

    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
    }

    public void removeEmitter(SseEmitter emitter) {
        emitters.remove(emitter);
    }


    private void broadcastState() {
        Map<String, Object> state = getState();
        emitters.forEach(emitter -> {
            try {
                emitter.send(state);
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        });
    }


    private void toggleMute() {
        if (!isMuted) {
            previousVolume = volume;
            volume = 0;
            isMuted = true;
            wasPlayingBeforeMute = isPlaying;
            isPlaying = false;
        } else {
            volume = previousVolume;
            isMuted = false;
            isPlaying = wasPlayingBeforeMute;
        }
    }

    private void handleVolumeCommand(String cmd) {
        try {
            int newVolume = Integer.parseInt(cmd.split(":")[1]);
            if (newVolume != volume) {
                volume = Math.min(100, Math.max(0, newVolume));
                isMuted = false;
                if (wasPlayingBeforeMute) {
                    isPlaying = true;
                    wasPlayingBeforeMute = false;
                }
            }
        } catch (Exception e) {
            System.err.println("Invalid volume command format: " + cmd);
        }
    }

    public void mediaCommands(String cmd) {
        switch (cmd) {
            case "PLAY" -> {
                isPlaying = true;
                if (isMuted) {
                    volume = previousVolume;
                    isMuted = false;
                    wasPlayingBeforeMute = false;
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
            case "PLAY_PAUSE" -> {
                isPlaying = !isPlaying;
                if (isPlaying && isMuted) {
                    volume = previousVolume;
                    isMuted = false;
                }
            }

            default -> {
                if (cmd.trim().startsWith("VOLUME:")) {
                    handleVolumeCommand(cmd);
                }
            }
        }

        lastCommand = cmd;
        System.out.println("Command received: " + cmd);
        playerCommandLogRepo.save(new PlayerCommandLog(cmd));
        broadcastState();
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
