package com.example.media_controller_iot.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "command_log")
public class PlayerCommandLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String command;
    private LocalDateTime timestamp = LocalDateTime.now();

    public PlayerCommandLog(String command) {
        this.command = command;
        this.timestamp = LocalDateTime.now();
    }


}
