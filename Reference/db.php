<?php
// db.php
// Setup PDO Connection for MySQL database and initialize schema

// ---------------------------------------------------------------
// ENV LOADER — reads key=value pairs from .env (no library needed)
// ---------------------------------------------------------------
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        $eqPos = strpos($line, '=');
        if ($eqPos === false) continue;
        $key   = trim(substr($line, 0, $eqPos));
        $value = trim(substr($line, $eqPos + 1));
        if (($hashPos = strpos($value, ' #')) !== false) {
            $value = trim(substr($value, 0, $hashPos));
        }
        if (!array_key_exists($key, $_ENV) && !array_key_exists($key, $_SERVER)) {
            putenv("$key=$value");
            $_ENV[$key]    = $value;
            $_SERVER[$key] = $value;
        }
    }
}

// Load .env from project root
loadEnv(__DIR__ . '/.env');

// ---------------------------------------------------------------
// Database constants — sourced from .env, with sensible fallbacks
// ---------------------------------------------------------------
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'ashikone_mythbraindb');
define('DB_USER', getenv('DB_USER') ?: 'ashikone_mythbrainuser');
define('DB_PASS', getenv('DB_PASS') ?: 'Ashik@21032001');

define('ADMIN_NAME',  getenv('ADMIN_NAME')  ?: 'Admin');
define('ADMIN_EMAIL', getenv('ADMIN_EMAIL') ?: 'admin@mythbrain.com');
define('ADMIN_PASS',  getenv('ADMIN_PASS')  ?: 'Admin@2026');

function getDB() {
    $lastException = null;
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $db = new PDO($dsn, DB_USER, DB_PASS);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $db;
    } catch (PDOException $e) {
        $lastException = $e;
        // If unknown database (1049), try to connect without database name and create it
        if ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false) {
            try {
                $dsnWithoutDb = "mysql:host=" . DB_HOST . ";charset=utf8mb4";
                $dbTemp = new PDO($dsnWithoutDb, DB_USER, DB_PASS);
                $dbTemp->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $dbTemp->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                
                // Reconnect to the newly created database
                $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                return $db;
            } catch (PDOException $subE) {
                $lastException = $subE;
            }
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $lastException->getMessage()]);
    exit;
}

function initDB() {
    $db = getDB();
    $sqlFile = __DIR__ . '/db.sql';
    if (file_exists($sqlFile)) {
        $sql = file_get_contents($sqlFile);
        try {
            $db->exec($sql);
        } catch (PDOException $e) {
            $queries = explode(';', $sql);
            foreach ($queries as $query) {
                $query = trim($query);
                if (!empty($query)) {
                    $db->exec($query);
                }
            }
        }
    }

    // Seed default admin account
    $admin_email = ADMIN_EMAIL;
    $admin_pass  = password_hash(ADMIN_PASS, PASSWORD_DEFAULT);
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$admin_email]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare("INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, 'admin', 1)");
        $stmt->execute([ADMIN_NAME, $admin_email, $admin_pass]);
    }
}

// Automatically check if database tables exist and initialize
try {
    $db = getDB();
    $stmt = $db->query("SHOW TABLES LIKE 'users'");
    if (!$stmt->fetch()) {
        initDB();
    } else {
        // Upgrade devices table if wifi_5 columns are missing
        $stmtCol = $db->query("SHOW COLUMNS FROM `devices` LIKE 'wifi_5_ssid'");
        if (!$stmtCol->fetch()) {
            $db->exec("ALTER TABLE `devices` ADD COLUMN `wifi_5_ssid` VARCHAR(255) NULL AFTER `wifi_4_password`, ADD COLUMN `wifi_5_password` VARCHAR(255) NULL AFTER `wifi_5_ssid`");
        }

        // Upgrade user_settings table if temperature column is missing
        $stmtColTemp = $db->query("SHOW COLUMNS FROM `user_settings` LIKE 'temperature'");
        if (!$stmtColTemp->fetch()) {
            $db->exec("ALTER TABLE `user_settings` ADD COLUMN `temperature` DECIMAL(2,1) DEFAULT 0.7 AFTER `max_response_tokens`");
        }

        // Upgrade user_settings table if transcription_language column is missing
        $stmtColLang = $db->query("SHOW COLUMNS FROM `user_settings` LIKE 'transcription_language'");
        if (!$stmtColLang->fetch()) {
            $db->exec("ALTER TABLE `user_settings` ADD COLUMN `transcription_language` VARCHAR(20) DEFAULT 'bn' AFTER `temperature`");
        }

        // Upgrade user_settings table if summary_tokens column is missing
        $stmtColSum = $db->query("SHOW COLUMNS FROM `user_settings` LIKE 'summary_tokens'");
        if (!$stmtColSum->fetch()) {
            $db->exec("ALTER TABLE `user_settings` ADD COLUMN `summary_tokens` INT DEFAULT 128 AFTER `transcription_language`");
        }

        // Upgrade user_settings table if meeting_chat_tokens column is missing
        $stmtColMc = $db->query("SHOW COLUMNS FROM `user_settings` LIKE 'meeting_chat_tokens'");
        if (!$stmtColMc->fetch()) {
            $db->exec("ALTER TABLE `user_settings` ADD COLUMN `meeting_chat_tokens` INT DEFAULT 128 AFTER `summary_tokens`");
        }

        // Upgrade user_settings table if assistant_chat_tokens column is missing
        $stmtColAc = $db->query("SHOW COLUMNS FROM `user_settings` LIKE 'assistant_chat_tokens'");
        if (!$stmtColAc->fetch()) {
            $db->exec("ALTER TABLE `user_settings` ADD COLUMN `assistant_chat_tokens` INT DEFAULT 512 AFTER `meeting_chat_tokens`");
        }

        // Ensure spaces table exists
        $stmtSpaces = $db->query("SHOW TABLES LIKE 'spaces'");
        if (!$stmtSpaces->fetch()) {
            $db->exec("CREATE TABLE IF NOT EXISTS `spaces` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `user_id` INT NOT NULL,
                `name` VARCHAR(255) NOT NULL,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        }

        // Ensure space_recordings table exists
        $stmtSpaceRecs = $db->query("SHOW TABLES LIKE 'space_recordings'");
        if (!$stmtSpaceRecs->fetch()) {
            $db->exec("CREATE TABLE IF NOT EXISTS `space_recordings` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `space_id` INT NOT NULL,
                `recording_id` INT NOT NULL,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY `unique_space_rec` (`space_id`, `recording_id`),
                FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`) ON DELETE CASCADE,
                FOREIGN KEY (`recording_id`) REFERENCES `recordings` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        }
    }
} catch (PDOException $e) {
    // getDB() inside API calls will trigger exit and display the error
}

// Set Bangladeshi Timezone by default
date_default_timezone_set('Asia/Dhaka');
