const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Simulated industrial equipment
const equipment = {
  'conveyor_1': { status: 'operational', speed: 75 },
  'motor_1': { status: 'operational', temperature: 65 },
  'pump_1': { status: 'warning', pressure: 85 }
};

// Generate sensor data
function generateSensorData() {
  const sensors = [
    { id: 'conveyor_1', min: 0, max: 100 },
    { id: 'motor_1', min: 60, max: 80 },
    { id: 'pump_1', min: 70, max: 90 }
  ];
  
  const sensor = sensors[Math.floor(Math.random() * sensors.length)];
  return {
    sensorId: sensor.id,
    value: Math.random() * (sensor.max - sensor.min) + sensor.min,
    timestamp: new Date().toISOString(),
    type: 'sensor_update'
  };
}

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send initial status
  ws.send(JSON.stringify({
    type: 'equipment_status',
    status: equipment
  }));

  // Send data every second
  const interval = setInterval(() => {
    const sensorData = generateSensorData();
    ws.send(JSON.stringify(sensorData));
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// REST API
app.post('/api/control', (req, res) => {
  const { command, value } = req.body;
  console.log(`Control command: ${command} for ${value}`);
  
  if (equipment[value]) {
    equipment[value].status = command === 'start' ? 'operational' : 'stopped';
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'equipment_status',
          status: equipment
        }));
      }
    });
  }
  
  res.json({ success: true, message: `Command ${command} executed` });
});

app.get('/api/equipment', (req, res) => {
  res.json(equipment);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Industrial Dashboard Server running on port ${PORT}`);
});
