#include "WiFi.h"
#include "PubSubClient.h"

// Configuração do WiFi e MQTT
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

const char *SSID = "...";
const char *PWD = "...";
const char *mqttServer = "ip-broker";
const int mqttPort = 1883;

// ID exclusivo do dispositivo
uint64_t chipid = ESP.getEfuseMac();

void setup() {
    Serial.begin(115200);
    Serial.println("Inicializando...");

    // Conecta ao WiFi
    wifi_connect(SSID, PWD);

    // Conecta ao MQTT
    mqtt_connect(mqttServer, mqttPort);
}

void wifi_connect(const char *SSID, const char *PWD) {
    WiFi.begin(SSID, PWD);

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("\nConectado ao WiFi.");
    Serial.println(WiFi.localIP());
}

void mqtt_connect(const char *server, int port) {
    mqttClient.setServer(server, port);

    while (!mqttClient.connected()) {
        Serial.println("Conectando ao MQTT...");
        if (mqttClient.connect("ESP32_DHT11")) {
            Serial.println("Conectado ao broker MQTT.");
        } else {
            Serial.println("Falha na conexão ao MQTT. Tentando novamente...");
            delay(5000);
        }
    }
}

void loop() {
    // Leitura dos sensores
    float sensor1 = random(0, 10);
    float sensor2 = random(0, 100);
    float sensor3 = random(0, 1000);

    Serial.printf("sensor1: %.2f\n", sensor1);
    Serial.printf("sensor2: %.2f\n", sensor2);
    Serial.printf("sensor3: %.2f\n", sensor3);

    // Reconexão ao MQTT, se necessário
    if (!mqttClient.connected()) {
        mqtt_connect(mqttServer, mqttPort);
    }
    mqttClient.loop();

    // Envia dados a cada 5 segundos
    static long last_time = 0;
    long now = millis();
    if (now - last_time > 5000) {
        char data[128] = {0};
        snprintf(data, 128, "{\"sensor1\":%.2f,\"sensor2\":%.2f,\"sensor3\":%.2f}", sensor1, sensor2,sensor3);
        mqttClient.publish("sensor/dados", data);
        last_time = now;
    }
    delay(1000);
}
