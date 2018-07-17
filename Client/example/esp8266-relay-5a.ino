 /*    Replace YOURSSID and YOURPASSWORD with your own wifi details - this code is a combination of the code from Aussie_Toyman and the wifiwebserver example code in the Arduino IDE
 *  This sketch demonstrates how to set up a simple HTTP-like server.
 *  The server will set a GPIO pin depending on the request
 *    http://server_ip/gpio/0 will set the GPIO2 low,
 *    http://server_ip/gpio/1 will set the GPIO2 high
 *  server_ip is the IP address of the ESP8266 module, will be 
 *  printed to Serial when the module is connected.
 */
 /*
  * Sau khi nap code cho module esp-01, 
  */
#include <ESP8266WiFi.h>
const char* ssid = "YOURSSID"; 
const char* password = "YOURPASSWORD"; 

int val; 
boolean DebugFlg = true;
// Create an instance of the server 
// specify the port to listen on as an argument 

WiFiServer server(80); 
void setup() 
{   
  Serial.begin(9600);   
  delay(10);   
  // prepare GPIO2   
  pinMode(2, OUTPUT);   
  digitalWrite(2, 0);      
  // Connect to WiFi network   
  if (DebugFlg) 
  {   
    Serial.println();   
    Serial.println();   
    Serial.print("Connecting to ");   
    Serial.println(ssid);   
  }   

  WiFi.begin(ssid, password); 

  while (WiFi.status() != WL_CONNECTED) 
  {     
    delay(500);     
    if (DebugFlg) 
    {     
      Serial.print(".");     
    }   
  }    
  if (DebugFlg) 
  {     
    Serial.println("");     
    Serial.println("WiFi connected");   
  }      
  // Start the server   
  server.begin();   
  if (DebugFlg) 
  {     
    Serial.println("Server started");     
    // Print the IP address     
    Serial.println(WiFi.localIP());   
  } 
} 

void toggleRelay(bool relayState) 
{   
  if(relayState) 
  {     
    const byte miBufferON[] = {0xA0, 0x01, 0x01, 0xA2};     
    Serial.write(miBufferON, sizeof(miBufferON));     
    val = 1;   
  }   
  else 
  {     
  //To disable the Relay send it by serial port:     
  const byte miBufferOFF[] = {0xA0, 0x01, 0x00, 0xA1};     
  Serial.write(miBufferOFF, sizeof(miBufferOFF));     
  val = 0;   
  } 
} 

void loop() 
{   
// Check if a client has connected   
  WiFiClient client = server.available();   
  if (!client) 
  {     
    return;   
  }      
  // Wait until the client sends some data   
  if (DebugFlg) 
  {     
    Serial.println("new client");   
  }   
  while(!client.available())
  {     
    delay(1);   
  }      
  // Read the first line of the request   
  String req = client.readStringUntil('r');   
  if (DebugFlg) 
  {     
    Serial.println(req);   
  }   client.flush();      
  // Match the request   
  if (req.indexOf("/gpio/0") != -1)
  {     
    toggleRelay(false);   
  }   
  else if (req.indexOf("/gpio/1") != -1)
  {     
    toggleRelay(true);   
  }   
  else 
  {     
    if (DebugFlg) 
    {       
      Serial.println("invalid request");     
    }     
    client.stop();     
    return;   
  }     
  client.flush();   
  // Prepare the response   
  String s = "HTTP/1.1 200 OKrnContent-Type: text/htmlrnrnrnrnGPIORelay is now ";   
  s += (val)?"Enabled":"Disabled";   
  s += "n";   
  // Send the response to the client   
  client.print(s);   
  delay(1);   
  if (DebugFlg) 
  {     
    Serial.println("Client disonnected");   
  }   
  // The client will actually be disconnected    
  // when the function returns and 'client' object is detroyed 
}
