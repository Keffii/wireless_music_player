package com.example.media_controller_iot.controller;

import com.example.media_controller_iot.service.PlayerService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/player")
@CrossOrigin(origins = "*") // for esp32

public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/command")
    public void playCommand(@RequestBody Map<String, String> body) {
        String command = body.get("command");
        playerService.mediaCommands(command);
    }
    @GetMapping("/state")
    public Map<String, Object> getState() {
        return playerService.getState();
    }
}
