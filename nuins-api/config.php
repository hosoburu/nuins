<?php
// 環境設定: 'local' | 'production'
// ローカル: SQLite ファイル（local.db）、本番: MySQL
define('APP_ENV', getenv('APP_ENV') ?: 'local');

// APIのベースパス
// ローカル: '' （php -S localhost:8080 で直接起動）
// 本番（レンタルサーバー）: '/nuins/api' 等
define('BASE_API_PATH', APP_ENV === 'local' ? '' : '/nuins/api');

// CORS許可オリジン（ローカル開発時のみ。本番は同一オリジンのため不要）
define('CORS_ORIGIN', APP_ENV === 'local' ? 'http://localhost:5173' : '');

// MySQL設定（本番環境のみ使用）
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'nuins');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// トークン有効期限（秒）
define('TOKEN_TTL', 60 * 60 * 24 * 7); // 7日
