const express = require('express');
const fs = require('fs/promises');
const mqtt = require('mqtt');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');

app.use(express.static("public"));
app.use(cors());

// Configuração do MQTT
const mqttBrokerUrl = 'mqtt://localhost';
const mqttTopic = 'sensor/dados'; // Substitua pelo tópico MQTT real
const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe(mqttTopic);
});

mqttClient.on('message', (topic, message) => {
    console.log('Recebeu: ' + message.toString());
    const sensorData = JSON.parse(message.toString());
    storeSensorData(sensorData);
});

// Configuração do MongoDB
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'iot';
let db;

// Conecta ao MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
    .then(client => {
        console.log('Conectado ao MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error('Erro ao conectar ao MongoDB:', error));

// Função para armazenar dados do sensor no MongoDB
function storeSensorData(data) {
    if (!db) {
        console.error('Banco de dados não conectado');
        return;
    }

    const collection = db.collection('sensor');
    const sensorData = {
        ...data,
        time: new Date() // Adiciona o timestamp atual
    };

    collection.insertOne(sensorData)
        .then(result => {
            console.log('Dados inseridos com sucesso:', result.insertedId);
        })
        .catch(error => {
            console.error('Erro ao inserir dados no MongoDB:', error);
        });
}

app.get('/api/sensor/all', (req, res) => {
    if (!db) {
        return res.status(500).json({ error: 'Banco de dados não conectado' });
    }

    const collection = db.collection('sensor');
    collection.find({}).toArray()
        .then(results => res.json(results))
        .catch(error => res.status(500).json({ error: 'Erro ao consultar dados', details: error }));
});


// Endpoint para consultar dados do sensor no MongoDB
app.get('/api/sensor', (req, res) => {
    const { start, end } = req.query;

    const collection = db.collection('sensor');
    collection.find({
        time: {
            $gte: new Date(start),
            $lte: new Date(end)
        }
    }).toArray()
        .then(results => res.json(results))
        .catch(error => res.json(error));
});

// Inicialização do servidor
const port = 8080; // Escolha a porta desejada

app.listen(port, () => {
    console.log(`WebServer iniciado na porta ${port}`);
});