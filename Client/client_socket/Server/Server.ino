#include <ESP8266WiFi.h>
#include <SocketIoClient.h>

SocketIoClient socket;

#define PORT  23
// Gioi han so luong clients ket noi
#define MAX_CLIENTS 3

// Ten va mat khau cua ESP8266 AP se tao
const char *ssid = "Quynh Mai";
const char *password = "21111983";
char host[] = "192.168.1.134";  //Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 3000;

// Khoi tao port de clients ket noi.
WiFiServer server(PORT);
WiFiClient clients[MAX_CLIENTS];

void event(const char* payload, size_t length) {
  uint8_t i;
  String kq = payload;
  for (i = 0; i < MAX_CLIENTS; i++) {
    if (clients[i] && clients[i].connected()) {
      Serial.print("send to client:");
      kq += "\r";
      Serial.println(kq);
      clients[i].write(kq.c_str());

      String line = clients[i].readStringUntil('\r');
      Serial.print("Server receive from Client:");
      Serial.println(line);
    }
  }
}

void setup() {

  Serial.begin(115200);
  delay(10);

  //Việc đầu tiên cần làm là kết nối vào mạng Wifi
  Serial.print("Ket noi vao mang ");
  Serial.println(ssid);

  //Kết nối vào mạng Wifi
  WiFi.begin(ssid, password);

  //Chờ đến khi đã được kết nối
  while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng
    delay(500);
    Serial.print('.');
  }

  Serial.println();
  Serial.println(F("Da ket noi WiFi"));
  Serial.println(F("Di chi IP cua ESP8266 (Socket webSocket ESP8266): "));
  Serial.println(WiFi.localIP());
  server.begin();
  socket.begin(host, port);
  socket.on("led-change", event);

}
unsigned long previousMillis = 0;
void loop() {
  socket.loop();
  uint8_t i;
  // kiem tra co client moi ket noi khong
  if (server.hasClient())  {
    for (i = 0; i < MAX_CLIENTS; i++) {
      if (!clients[i] || !clients[i].connected())
      { if (clients[i]) clients[i].stop();
        clients[i] = server.available();
        Serial.print("New client: "); Serial1.print(i);
        continue;
      }
    }
    WiFiClient serverClient = server.available();
    serverClient.stop();
  }
  for (i = 0; i < MAX_CLIENTS; i++) {
    if (clients[i] && clients[i].connected()) {
      if (clients[i].available()) {
        String line = clients[i].readStringUntil('\r');
        Serial.print("Server receive from Client:");
        Serial.println(line);

      }
    }
  }
}
