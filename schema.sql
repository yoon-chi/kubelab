-- Create the database
CREATE DATABASE IF NOT EXISTS command_vault;
USE command_vault;

-- Commands table
CREATE TABLE IF NOT EXISTS commands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  command TEXT NOT NULL,
  description TEXT NOT NULL,
  tags JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_updated_at (updated_at)
);
