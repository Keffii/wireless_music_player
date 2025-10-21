const int buttonPin1 = 26;
const int buttonPin2 = 25;
const int buttonPin3 = 33;
const int buttonPin4 = 32;
const int buttonPin5 = 27;
const int potPin = 34;

void setup() {
  Serial.begin(115200);

  pinMode(buttonPin1, INPUT_PULLUP);
  pinMode(buttonPin2, INPUT_PULLUP);
  pinMode(buttonPin3, INPUT_PULLUP);
  pinMode(buttonPin4, INPUT_PULLUP);
  pinMode(buttonPin5, INPUT_PULLUP);

  // Configure ADC to read full 0–3.3 V range with 12-bit resolution
  analogSetPinAttenuation(potPin, ADC_11db);
  analogReadResolution(12);
}

void loop() {
  // Read and print button states
  if (digitalRead(buttonPin1) == LOW) Serial.println("Button 1 pressed!");
  if (digitalRead(buttonPin2) == LOW) Serial.println("Button 2 pressed!");
  if (digitalRead(buttonPin3) == LOW) Serial.println("Button 3 pressed!");
  if (digitalRead(buttonPin4) == LOW) Serial.println("Button 4 pressed!");
  if (digitalRead(buttonPin5) == LOW) Serial.println("Button 5 pressed!");

  // Read and smooth potentiometer values
  int sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(potPin);
    delay(5);
  }
  int potValue = sum / 10;

  // Print result
  Serial.print("Potentiometer: ");
  Serial.println(potValue);

  delay(100);
}
