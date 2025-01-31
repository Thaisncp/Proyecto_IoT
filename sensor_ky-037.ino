#include <WiFi.h>
#include <PubSubClient.h>
#include <math.h>

const int analogPin = 34;

const char* ssid = "DAYSI";
const char* password = "1106042474001";
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

float analogToDecibels(int analogValue) {
  const int referenceValue = 34;
  const float scalingFactor = 0.125;

  if (analogValue <= referenceValue) {
    return 0;
  }

  float decibels = (analogValue - referenceValue) * scalingFactor;

  return decibels > 1.0 ? decibels : 1.0;
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
  float decibels = analogToDecibels(analogValue);

  Serial.print("Valor analógico: ");
  Serial.print(analogValue);
  Serial.print(" | Valor en dB: ");
  Serial.println(decibels);

  char payload[50];
  snprintf(payload, 50, "{\"ruido\": %.2f}", decibels);
  client.publish(topic, payload);
  Serial.print("Valor publicado: ");
  Serial.println(payload);

  delay(30000);
}
