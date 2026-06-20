CREATE DATABASE IF NOT EXISTS `ashikone_mythbraindb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ashikone_mythbraindb`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'user',
    `profile_picture` VARCHAR(255) NULL,
    `is_verified` TINYINT DEFAULT 0,
    `verification_token` VARCHAR(255) NULL,
    `verification_expires` DATETIME NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_expires` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNIQUE NOT NULL,
    `deepgram_api_key` TEXT NULL,
    `groq_api_key` TEXT NULL,
    `groq_model` VARCHAR(100) DEFAULT 'openai/gpt-oss-120b',
    `max_response_tokens` INT DEFAULT 1024,
    `temperature` DECIMAL(2,1) DEFAULT 0.7,
    `transcription_language` VARCHAR(20) DEFAULT 'bn',
    `summary_tokens` INT DEFAULT 128,
    `meeting_chat_tokens` INT DEFAULT 128,
    `assistant_chat_tokens` INT DEFAULT 512,
    `tokens_used` INT DEFAULT 0,
    `words_transcribed` INT DEFAULT 0,
    `chunks_sent` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `devices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `token` VARCHAR(5) UNIQUE NOT NULL,
    `recording_state` TINYINT DEFAULT 0,
    `wifi_1_ssid` VARCHAR(255) NOT NULL DEFAULT '',
    `wifi_1_password` VARCHAR(255) NOT NULL DEFAULT '',
    `wifi_2_ssid` VARCHAR(255) NULL,
    `wifi_2_password` VARCHAR(255) NULL,
    `wifi_3_ssid` VARCHAR(255) NULL,
    `wifi_3_password` VARCHAR(255) NULL,
    `wifi_4_ssid` VARCHAR(255) NULL,
    `wifi_4_password` VARCHAR(255) NULL,
    `wifi_5_ssid` VARCHAR(255) NULL,
    `wifi_5_password` VARCHAR(255) NULL,
    `last_ping` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `recordings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `device_token` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NULL,
    `status` VARCHAR(50) DEFAULT 'recording',
    `word_count` INT DEFAULT 0,
    `chunk_count` INT DEFAULT 0,
    `transcript` LONGTEXT NULL,
    `summary` LONGTEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `recording_chunks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `recording_id` INT NOT NULL,
    `chunk_number` INT NOT NULL,
    `audio_path` VARCHAR(255) NULL,
    `transcript` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`recording_id`) REFERENCES `recordings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
    `setting_key` VARCHAR(255) PRIMARY KEY,
    `setting_value` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pre-seed device activation tokens
INSERT IGNORE INTO `devices` (`token`, `wifi_1_ssid`, `wifi_1_password`) VALUES 
('MB101', 'Alami wifi', '123456789'),
('MB102', 'Hotspot', '88888888'),
('MB103', 'Office_Wifi', 'admin123'),
('ABCDE', 'Home_SSID', 'password'),
('XYZ78', 'TempWifi', '99999999');

-- Pre-seed default settings
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`) VALUES 
('admin_maintenance', '0'),
('admin_maintenance_until', NULL);

CREATE TABLE IF NOT EXISTS `spaces` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `space_recordings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `space_id` INT NOT NULL,
    `recording_id` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_space_rec` (`space_id`, `recording_id`),
    FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recording_id`) REFERENCES `recordings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
