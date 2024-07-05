#include <TinyGPSPlus.h>
#include <WiFi.h>

// The TinyGPSPlus object
TinyGPSPlus gps;

void setup() {
  Serial.begin(9600);
  Serial2.begin(9600);
  initWiFi();
  delay(3000);
}

void loop() {
  //updateSerial();

  while (Serial2.available() > 0) {
    String x = Serial2.readStringUntil('\n');

    if (x.startsWith("$GPGGA")) {
      for (char c : x) {
        if (gps.encode(c)) {
          Serial.println();
          displayInfo();
        }
      }
    }
  }

  return;

  while (Serial2.available() > 0) {
    char c = Serial2.read();
  
    if (!(c == 10 || c == 13)) {
      Serial.print(c);
    }
  
    if (gps.encode(c)) {
      Serial.println();
      displayInfo();
    }
  }
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(F("No GPS detected: check wiring."));
    while (true)
      ;
  }
}
void displayInfo() {
  Serial.print(F("Location: "));
  if (gps.location.isUpdated()) {
    Serial.print("Lat: ");
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(","));
    Serial.print("Lng: ");
    Serial.print(gps.location.lng(), 6);
    Serial.println();
  } else {
    Serial.println(F("INVALID"));
  }
}

void updateSerial() {
  delay(500);
  while (Serial.available()) {
    Serial2.write(Serial.read());  //Forward what Serial received to Software Serial Port
  }
  while (Serial2.available()) {
    Serial.write(Serial2.read());  //Forward what Software Serial received to Serial Port
  }
}

const char* ssid = "HackTM - WiFi by infinilink";
const char* password = "hackthecapital";
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}
