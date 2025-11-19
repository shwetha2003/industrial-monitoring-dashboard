-- Industrial Monitoring Database Schema
CREATE DATABASE industrial_monitoring;

USE industrial_monitoring;

-- Equipment table
CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('operational', 'warning', 'stopped') DEFAULT 'stopped',
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor readings table
CREATE TABLE sensor_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES equipment(id)
);

-- Insert sample data
INSERT INTO equipment (id, name, type, status, location) VALUES
('conveyor_1', 'Main Conveyor Belt', 'conveyor', 'operational', 'Production Line A'),
('motor_1', 'Drive Motor 1', 'motor', 'operational', 'Drive Section'),
('pump_1', 'Cooling Pump 1', 'pump', 'warning', 'Cooling System');

-- Create indexes for performance
CREATE INDEX idx_sensor_timestamp ON sensor_readings(sensor_id, timestamp);
CREATE INDEX idx_equipment_status ON equipment(status);
