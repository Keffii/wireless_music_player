#include "BluetoothSerial.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

BluetoothSerial SerialBT;

// Pins
const int playPauseBtn = 26;
const int nextBtn = 25;
const int prevBtn = 33;
const int muteBtn = 32;
const int skipForwardBtn = 27;
const int potPin = 34;

// Debounce timing
unsigned long lastSendTime = 0;
const unsigned long debounceDelay = 300;

// Potentiometer tracking
int lastVolume = -1;

void setup() {
  Serial.begin(115200);
  delay(2000);
  SerialBT.begin("ESP32_MediaController");
  Serial.println("Bluetooth ready. Pair with 'ESP32_MediaController'");
  
  pinMode(playPauseBtn, INPUT_PULLUP);
  pinMode(nextBtn, INPUT_PULLUP);
  pinMode(prevBtn, INPUT_PULLUP);
  pinMode(muteBtn, INPUT_PULLUP);
  pinMode(skipForwardBtn, INPUT_PULLUP);
  
  analogSetPinAttenuation(potPin, ADC_11db);
  analogReadResolution(12);
  
}

void loop() {
  unsigned long currentMillis = millis();
  
  // --- Button Commands ---
  if (currentMillis - lastSendTime >= debounceDelay) {
    if (digitalRead(playPauseBtn) == LOW) togglePlayPause();
    if (digitalRead(nextBtn) == LOW) sendCommand("NEXT");
    if (digitalRead(prevBtn) == LOW) sendCommand("PREV");
    if (digitalRead(muteBtn) == LOW) sendCommand("MUTE");
    if (digitalRead(skipForwardBtn) == LOW) sendCommand("SEEK_FORWARD");
  }
  
  // --- Volume Command ---
  int potValue = readSmoothedPot();
  int volume = map(potValue, 0, 4095, 0, 100);
  if (abs(volume - lastVolume) > 2) {
    String json = "{\"command\":\"VOLUME\",\"value\":" + String(volume) + "}";
    SerialBT.println(json);
    Serial.println("Sent new volume JSON: " + json);
    lastVolume = volume;
  }
  
  vTaskDelay(20 / portTICK_PERIOD_MS);
}

void togglePlayPause() {
  sendCommand("PLAY_PAUSE");
}

void sendCommand(const char* cmd) {
  String json = "{\"command\":\"" + String(cmd) + "\"}";
  SerialBT.println(json);
  Serial.println("Sent: " + json);
  lastSendTime = millis();
}

int readSmoothedPot() {
  int sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(potPin);
    delay(5);
  }
  return sum / 10;
}
