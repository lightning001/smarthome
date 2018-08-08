#include "ESP8266WiFi.h"
#include <DHT.h>

#define DHTPIN D4           // Chân dữ liệu của DHT11 kết nối với GPIO4 của ESP8266
#define DHTTYPE DHT11       // Loại DHT được sử dụng

DHT dht(DHTPIN, DHTTYPE);
// Ten va mat khau cua ESP8266 AP lam server se vao
const char *ssid = "Quynh Mai";
const char *password = "21111983";

char host[] = "192.168.1.182";
#define PORT  23
// port 23 la port cua esp8226 lam AP da khoi tao.
WiFiClient client;
String result;

void setup() {
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  digitalWrite(D6, LOW);
  digitalWrite(D7, LOW);

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

}

unsigned long previousMillis = 0;
String req_uri = "";
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Kiem tra neu client(STA) chua duoc ket noi.
    // Kiem tra tiep tuc neu khong duoc ket noi den IP va PORT cua server(AP
    // thi in ra serial terminal chuoi "connection failed".
    while (!client.connected()) {
      if (!client.connect(host, PORT)) {
        Serial.println("connection failed");
        delay(1000);
        return;
      }
    }
    while (client.available()) {
      result = client.readStringUntil('\r');
      action(result);
      Serial.print("Client receive from Server:");
      result += " completed\r";
      Serial.println(result);

      client.write(result.c_str());
    }
    unsigned long currentMillis = millis();
    float temp = dht.readTemperature();
    float humi = dht.readHumidity();
    if (isnan(temp) || isnan(humi)) {
      Serial.println("Failed to read from DHT sensor!");
      return;
    }

    if (currentMillis - previousMillis >= 5000) {
      previousMillis = currentMillis;
      char chartemp[10];
      dtostrf(temp, 4, 4, chartemp);
      char charhumi[10];
      dtostrf(humi, 4, 4, charhumi);
      String kq = "{\"temp\":\"";
      kq += chartemp;
      kq += "\",\"humi\":\"";
      kq += charhumi;
      kq += "\"}";
      kq += "\r";
      Serial.println(kq);
      client.write(kq.c_str());
    }
  }
}
void action(String resuil) {
  if (resuil == "off1") {
    digitalWrite(D6, LOW);
    Serial.println("Led1 off!");
  } else if (resuil == "off2") {
    digitalWrite(D7, LOW);
    Serial.println("Led2 off!");
  } else if (resuil == "on1") {
    digitalWrite(D6, HIGH);
    Serial.println("Led1 on!");
  } else {
    digitalWrite(D7, HIGH);
    Serial.println("Led2 on!");
  }
}

