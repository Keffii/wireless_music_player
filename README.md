# Wireless Music Player (Media Controller IoT)

Music Player Web UI Application controlled either wirelessly by an ESP32 Bluetooth controller or using the UI.

Features include:
- Play/Pause
- Next/Previous Song
- Shuffle
- Repeat Song
- Trackbar
- Volume Control

## 1 - How to install
Prerequisites:
- Java JDK 21
- MySQL
- ESP32(Optional)

Instructions:
- Step 1: Clone the Java project.
- Step 2: Create your sql schema and configure database in [`src/main/resources/application.properties`](https://github.com/Keffii/wireless_music_player/blob/main/src/main/resources/application.properties)
- Step 3: Flash your ESP32 with the firmware in the [esp32 branch](https://github.com/Keffii/wireless_music_player/tree/esp32) and set the correct Bluetooth port in:  
[`src/main/java/com/example/media_controller_iot/serial/BluetoothListener.java`](https://github.com/Keffii/wireless_music_player/blob/main/src/main/java/com/example/media_controller_iot/serial/BluetoothListener.java)
- Step 4: Start the application.

## 2 - How to use
- Open the web UI: http://localhost:8080/
  - UI subscribes to SSE at `/api/player/stream` and updates player state in real time.
