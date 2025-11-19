#!/usr/bin/env python3
"""
Sensor Data Generator for Industrial Dashboard
Generates simulated industrial sensor data
"""

import json
import random
import time
from datetime import datetime

class SensorDataGenerator:
    def __init__(self):
        self.sensors = {
            'temperature_sensor': {'min': 20, 'max': 80, 'unit': '°C'},
            'pressure_sensor': {'min': 0, 'max': 100, 'unit': 'PSI'},
            'vibration_sensor': {'min': 0, 'max': 10, 'unit': 'm/s²'}
        }
    
    def generate_reading(self, sensor_id):
        sensor = self.sensors[sensor_id]
        return {
            'sensor_id': sensor_id,
            'value': round(random.uniform(sensor['min'], sensor['max']), 2),
            'unit': sensor['unit'],
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def generate_batch(self):
        return {sensor_id: self.generate_reading(sensor_id) 
                for sensor_id in self.sensors.keys()}

if __name__ == "__main__":
    generator = SensorDataGenerator()
    print("Sensor Data Generator Ready")
    print(json.dumps(generator.generate_batch(), indent=2))
