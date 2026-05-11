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

-- Scenarios table (CKA/CKAD practice scenarios)
CREATE TABLE IF NOT EXISTS scenarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam VARCHAR(20) NOT NULL DEFAULT 'ckad',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  chapter VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_exam (exam),
  INDEX idx_chapter (chapter),
  INDEX idx_updated_at (updated_at)
);

-- Knowledge base notes (markdown notes about kubernetes resources)
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resource (resource),
  INDEX idx_updated_at (updated_at)
);

-- Concept notes (markdown notes about kubernetes concepts/topics)
CREATE TABLE IF NOT EXISTS concepts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_updated_at (updated_at)
);
