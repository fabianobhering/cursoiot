const mqtt = require('mqtt');
const WebSocket = require('ws');

// Configuração do servidor MQTT
const mqttBrokerUrl = 'mqtt://localhost';
const mqttTopic = 'sensor/dados'; // Substitua pelo tópico MQTT real

const mqttClient = mqtt.connect(mqttBrokerUrl);

// Configuração do servidor WebSocket
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado.');

    // Assina o tópico MQTT quando um cliente se conecta
    mqttClient.subscribe(mqttTopic);

    // Envia dados MQTT para o cliente WebSocket
    mqttClient.on('message', (topic, message) => {
        console.log('Recebeu o dado: '+message.toString());
        const sensorData = JSON.parse(message.toString());
        sendWebSocketData(ws, sensorData);
    });

    // Fecha a conexão quando o cliente WebSocket se desconecta
    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado.');
        mqttClient.unsubscribe(mqttTopic);
    });
});

function sendWebSocketData(ws, data) {
    // Envia os dados para o cliente WebSocket
    console.log('Enviou dado: '+JSON.stringify(data));
    ws.send(JSON.stringify(data));
}

console.log('WebSocket iniciado na porta 3001.');
