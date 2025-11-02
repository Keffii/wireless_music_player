# Wireless Music Player
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
- Step 2: Create your SQL schema and configure database in [`src/main/resources/application.properties`](https://github.com/Keffii/wireless_music_player/blob/main/src/main/resources/application.properties)
 - Database tables will be automatically created by JPA/Hibernate.
- Step 3: Flash your ESP32 with the firmware in the [esp32 branch](https://github.com/Keffii/wireless_music_player/tree/esp32) and set the correct Bluetooth port in [`src/main/java/com/example/media_controller_iot/serial/BluetoothListener.java`](https://github.com/Keffii/wireless_music_player/blob/main/src/main/java/com/example/media_controller_iot/serial/BluetoothListener.java)
- Step 4: Run the main application class in your preferred Java IDE
## 2 - How to use
- Open the web UI: http://localhost:8080/
  - UI subscribes to SSE at `/api/player/stream` and updates player state in real time.
## SQL example for creating your SQL Schema
Example SQL with placeholders — replace with your preferred database name, user and password.
```sql
-- Replace placeholders with your database values
CREATE DATABASE <DB_NAME>;
CREATE USER '<DB_USER>'@'localhost' IDENTIFIED BY '<DB_PASSWORD>';
GRANT ALL PRIVILEGES ON <DB_NAME>.* TO '<DB_USER>'@'localhost';
FLUSH PRIVILEGES;
```
