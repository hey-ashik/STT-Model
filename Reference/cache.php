<?php
// cache.php
// Performance Cache manager with Redis integration and File-based fallback

class Cache {
    private static $redis = null;
    private static $useRedis = false;
    private static $initialized = false;
    private static $fileCacheDir = __DIR__ . '/cache_store';

    private static function init() {
        if (self::$initialized) return;
        self::$initialized = true;

        // Ensure env is loaded (in case cache.php is loaded before db.php)
        if (!getenv('REDIS_HOST')) {
            @include_once __DIR__ . '/db.php';
        }

        $host = getenv('REDIS_HOST') ?: '127.0.0.1';
        $port = intval(getenv('REDIS_PORT') ?: 52499);
        $pass = getenv('REDIS_PASS') ?: 'GcKuKqim5daLCmh9ahM';

        if (class_exists('Redis')) {
            try {
                self::$redis = new Redis();
                // 1 second connection timeout to avoid hanging the page
                $connected = @self::$redis->connect($host, $port, 1.0);
                if ($connected) {
                    $authenticated = true;
                    if (!empty($pass)) {
                        $authenticated = @self::$redis->auth($pass);
                    }
                    if ($authenticated) {
                        self::$useRedis = true;
                    } else {
                        self::$redis = null;
                        self::$useRedis = false;
                    }
                }
            } catch (Exception $e) {
                self::$redis = null;
                self::$useRedis = false;
            }
        }

        if (!self::$useRedis) {
            if (!is_dir(self::$fileCacheDir)) {
                @mkdir(self::$fileCacheDir, 0777, true);
            }
        }
    }

    // Check if Redis is actively running and used
    public static function isRedisActive() {
        self::init();
        return self::$useRedis;
    }

    // Get connection status description
    public static function getStatus() {
        self::init();
        return self::$useRedis ? 'Redis (Connected & Active)' : 'File-based Cache Emulation (Redis not running)';
    }

    // Retrieve cached item
    public static function get($key) {
        self::init();
        if (self::$useRedis) {
            $data = self::$redis->get($key);
            return $data ? json_decode($data, true) : null;
        } else {
            $file = self::$fileCacheDir . '/' . md5($key) . '.json';
            if (file_exists($file)) {
                $content = file_get_contents($file);
                $data = json_decode($content, true);
                if (isset($data['expire']) && $data['expire'] > time()) {
                    return $data['value'];
                }
                @unlink($file); // Expired
            }
            return null;
        }
    }

    // Set cached item with TTL (Time To Live)
    public static function set($key, $value, $ttl = 3600) {
        self::init();
        if (self::$useRedis) {
            self::$redis->set($key, json_encode($value), $ttl);
        } else {
            $file = self::$fileCacheDir . '/' . md5($key) . '.json';
            $data = [
                'expire' => time() + $ttl,
                'value' => $value
            ];
            file_put_contents($file, json_encode($data));
        }
        return $value;
    }

    // Delete a single cached key
    public static function delete($key) {
        self::init();
        if (self::$useRedis) {
            self::$redis->del($key);
        } else {
            $file = self::$fileCacheDir . '/' . md5($key) . '.json';
            if (file_exists($file)) {
                @unlink($file);
            }
        }
    }

    // Flush entire cache
    public static function clear() {
        self::init();
        if (self::$useRedis) {
            self::$redis->flushAll();
        } else {
            $files = glob(self::$fileCacheDir . '/*.json');
            foreach ($files as $file) {
                @unlink($file);
            }
        }
    }
}
