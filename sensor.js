const mqtt = require('mqtt');

const mqttBrokerUrl = 'mqtt://localhost';
const mqttTopic = 'sensor/dados'; // Substitua pelo tópico MQTT real

// Configuração do cliente MQTT
const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
    console.log('Sensor conectado ao broker MQTT.');

    // Simula o envio de dados a cada 5 segundos
    setInterval(() => {
        const sensorData = generateRandomSensorData();
        publishSensorData(sensorData);
    }, 5000);
});

function generateRandomSensorData() {
    // Gera dados aleatórios para simular a leitura do sensor
    return {
        sensor1: Math.random() * 100,
        sensor2: Math.random() * 10,
        sensor3: Math.random() * 1000
    };
}

function publishSensorData(data) {
    // Publica os dados no tópico MQTT
    mqttClient.publish(mqttTopic, JSON.stringify(data));
    console.log(`Dado do sensor publicado: ${JSON.stringify(data)}`);
}
