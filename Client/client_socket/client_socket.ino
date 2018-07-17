#include <ESP8266WebServer.h>
#include <SocketIOClient.h>

#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
ESP8266WebServer server(80);
SocketIOClient socket;
//const char* ssid = "Thao";
//const char* password = "87488987";
#define ssid "Linh Dan"
#define password "linhdan123"

//const char* ssid = "Quynh Mai";
//const char* password = "21111983";

#define host "192.168.43.154"
#define port 3000
#define server "https://smarthome2018.herokuapp.com"

extern String RID;
extern String Rfull;
#define led = 12
//char* user = "5af00d1f8ce2293e143c9b8e";
#define user "5ab3333038b9043e4095ff84"
#define RELAY_COUNT 2
int relayPin[RELAY_COUNT] = {12, 13};

void onDevice() {
  Serial.print("OK control ON");
  if (digitalRead(led) == LOW) {
    digitalWrite(led, HIGH);
  }
}

void offDevice() {
  Serial.print("OK control OFF");
  if (digitalRead(led) == HIGH) {
    digitalWrite(led, LOW);
  }
}

void changed(String data) {
  Serial.print("On device: ");
  Serial.print(data);
  if (digitalRead(led) == HIGH) {
    digitalWrite(led, LOW);
  } else {
    digitalWrite(led, HIGH);
  }
}

void conn(const char* data, size_t length) {
  Serial.print("Connect ");
  Serial.print(data);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (true) {
    delay(1000);
    if (WiFi.status() == WL_CONNECTED)
      break;
  }
  for (int i = 0; i < RELAY_COUNT; i++) {
    pinMode(relayPin[i], OUTPUT);
  }
  digitalWrite(led, LOW);
  Serial.println("Ket noi thanh cong");
  socket.connect(host, port);
  socket.sendJSON("join_dv", "{\"user\":\"" + user + ", \"ip\":\"" + WiFi.localIP() + "\"}");

  server.on("/on", onDevicen);
  server.on("/off", offDevice);
  server.begin();
  delay(1000);
}

void loop() {
  server.handleClient();
  if (socket.monitor()) {
    if (RID == "changed") {
      changed(Rfull);
    }
    Serial.println("ID: " + RID);
    Serial.println("Full: " + Rfull);
  }
}

