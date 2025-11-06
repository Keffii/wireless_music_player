# ESP32 Bluetooth Media Controller

ESP32-based Bluetooth remote that sends JSON-formatted media control commands (e.g., play, next, volume) to a paired device or server.

---

## Summary

This firmware allows an ESP32 to act as a wireless media controller using Bluetooth Serial (SPP).  
It includes 5 physical buttons and a potentiometer for volume control, sending commands as JSON strings over Bluetooth.

---

## Features

- Play/Pause, Next, Previous, Mute, and Skip Forward buttons  
- Potentiometer-based volume control (mapped 0–100%)  
- Debounce handling to prevent repeated inputs  
- Sends commands in JSON format over Bluetooth (e.g., `{"command":"PLAY_PAUSE"}`)  
- Compatible with Spring Boot or any Bluetooth SPP receiver  

---

## Requirements

- ESP32 board  
- Arduino IDE with ESP32 core installed  
- 5 physical buttons
- Potentiometer
---

## Usage

1. Upload the code to your ESP32.  [`esp32/media_controller_sketch.ino`](https://github.com/Keffii/wireless_music_player/blob/feature/esp32-ble-communication/esp32/media_controller_sketch.ino)
2. Pair your computer or receiver with `ESP32_MediaController`.  
3. Start the main application using the correct COM port. 
4. Control playback and volume wirelessly.
