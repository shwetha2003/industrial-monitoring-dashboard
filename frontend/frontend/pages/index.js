import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function IndustrialDashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [equipmentStatus, setEquipmentStatus] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket for real-time data
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'sensor_update') {
        setSensorData(prev => {
          const newData = [...prev, { ...data, id: Date.now() + Math.random() }];
          return newData.slice(-20); // Keep last 20 readings
        });
      } else if (data.type === 'equipment_status') {
        setEquipmentStatus(data.status);
      }
    };

    ws.onopen = () => {
      console.log('Connected to industrial dashboard');
      setConnected(true);
    };

    ws.onclose = () => {
      console.log('Disconnected from industrial dashboard');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleControlCommand = async (command, equipmentId) => {
    try {
      const response = await fetch('http://localhost:3001/api/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command, value: equipmentId }),
      });
      
      if (!response.ok) {
        throw new Error('Control command failed');
      }
      
      const result = await response.json();
      console.log('Control command result:', result);
    } catch (error) {
      console.error('Error sending control command:', error);
      alert('Failed to send control command. Make sure the backend server is running.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Industrial Monitoring Dashboard</title>
        <meta name="description" content="Real-time industrial equipment monitoring" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Industrial Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time equipment monitoring and control system
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Equipment Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(equipmentStatus).map(([equipmentId, status]) => (
            <div key={equipmentId} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {equipmentId.replace('_', ' ')}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-medium">
                    {sensorData.filter(d => d.sensorId === equipmentId).slice(-1)[0]?.value || '0'}%
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleControlCommand('start', equipmentId)}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handleControlCommand('stop', equipmentId)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensor Data Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Real-time Sensor Readings
          </h2>
          
          {sensorData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sensorData.slice(-8).map((data, index) => (
                <div key={data.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 font-medium capitalize mb-1">
                    {data.sensorId.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {data.value.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">Waiting for sensor data...</div>
              <div className="text-sm">Make sure the backend server is running on port 3001</div>
            </div>
          )}
        </div>

        {/* Connection Instructions */}
        {!connected && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Backend Connection Required
            </h3>
            <p className="text-yellow-700 mb-4">
              To see real-time data, start the backend server:
            </p>
            <code className="block bg-yellow-100 text-yellow-800 p-3 rounded text-sm mb-2">
              cd backend && npm run dev
            </code>
            <p className="text-yellow-700 text-sm">
              The backend should run on http://localhost:3001
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Built with Next.js, React, and WebSocket • Industrial Monitoring Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
