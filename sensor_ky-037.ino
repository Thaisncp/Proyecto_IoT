#include <WiFi.h>
#include <PubSubClient.h>

// Pines en la ESP32
const int analogPin = 34;

// Configuración de Wi-Fi
const char* ssid = "DAYSI";
const char* password = "1106042474001";

// Configuración del broker MQTT
const char* mqtt_server = "20.205.17.176";
const int mqtt_port = 1883;
const char* topic = "ruido";

WiFiClient espClient;
PubSubClient client(espClient);

void setupWiFi() {
  Serial.print("Conectando a Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Conexión Wi-Fi establecida.");
  Serial.print("IP asignada: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando al broker MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado.");
    } else {
      Serial.print("Fallo en la conexión. Código: ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(analogPin, INPUT);
  setupWiFi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int analogValue = analogRead(analogPin);
  Serial.print("Valor leído: ");
  Serial.println(analogValue);

  char payload[50];
  snprintf(payload, 50, "{\"ruido\": %d}", analogValue);
  client.publish(topic, payload);
  Serial.print("Valor publicado: ");
  Serial.println(payload);

  delay(30000);
}