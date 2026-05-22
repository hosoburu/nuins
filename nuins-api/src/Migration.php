<?php
class Migration
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function run(): void
    {
        if (APP_ENV === 'local') {
            $this->sqlite();
        } else {
            $this->mysql();
        }
    }

    private function sqlite(): void
    {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                name          TEXT NOT NULL,
                avatar        TEXT NOT NULL DEFAULT '',
                level         INTEGER NOT NULL DEFAULT 1,
                rank          TEXT NOT NULL DEFAULT 'D',
                points        INTEGER NOT NULL DEFAULT 0,
                bio           TEXT NOT NULL DEFAULT '',
                follow_count  INTEGER NOT NULL DEFAULT 0,
                follower_count INTEGER NOT NULL DEFAULT 0,
                title         TEXT,
                password_hash TEXT NOT NULL,
                created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS sns_links (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                label   TEXT NOT NULL,
                url     TEXT NOT NULL
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS auth_tokens (
                token      TEXT PRIMARY KEY,
                user_id    INTEGER NOT NULL REFERENCES users(id),
                expires_at TEXT NOT NULL
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS posts (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id    INTEGER NOT NULL REFERENCES users(id),
                content    TEXT NOT NULL,
                image      TEXT,
                like_count INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS post_likes (
                user_id INTEGER NOT NULL REFERENCES users(id),
                post_id INTEGER NOT NULL REFERENCES posts(id),
                PRIMARY KEY (user_id, post_id)
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS follows (
                follower_id INTEGER NOT NULL REFERENCES users(id),
                followee_id INTEGER NOT NULL REFERENCES users(id),
                PRIMARY KEY (follower_id, followee_id)
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS chat_rooms (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                user1_id   INTEGER NOT NULL REFERENCES users(id),
                user2_id   INTEGER NOT NULL REFERENCES users(id),
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                UNIQUE (user1_id, user2_id)
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS messages (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_room_id INTEGER NOT NULL REFERENCES chat_rooms(id),
                sender_id    INTEGER NOT NULL REFERENCES users(id),
                content      TEXT NOT NULL,
                created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            )
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS news (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                text       TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            )
        ");
    }

    private function mysql(): void
    {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name           VARCHAR(100) NOT NULL,
                avatar         VARCHAR(255) NOT NULL DEFAULT '',
                level          INT NOT NULL DEFAULT 1,
                rank           VARCHAR(10) NOT NULL DEFAULT 'D',
                points         INT NOT NULL DEFAULT 0,
                bio            TEXT NOT NULL,
                follow_count   INT NOT NULL DEFAULT 0,
                follower_count INT NOT NULL DEFAULT 0,
                title          VARCHAR(100),
                password_hash  VARCHAR(255) NOT NULL,
                created_at     DATETIME NOT NULL DEFAULT NOW()
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS sns_links (
                id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                label   VARCHAR(50) NOT NULL,
                url     VARCHAR(255) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS auth_tokens (
                token      VARCHAR(64) PRIMARY KEY,
                user_id    INT NOT NULL,
                expires_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS posts (
                id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id    INT NOT NULL,
                content    TEXT NOT NULL,
                image      VARCHAR(255),
                like_count INT NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT NOW(),
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS post_likes (
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                PRIMARY KEY (user_id, post_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (post_id) REFERENCES posts(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS follows (
                follower_id INT NOT NULL,
                followee_id INT NOT NULL,
                PRIMARY KEY (follower_id, followee_id),
                FOREIGN KEY (follower_id) REFERENCES users(id),
                FOREIGN KEY (followee_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS chat_rooms (
                id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user1_id   INT NOT NULL,
                user2_id   INT NOT NULL,
                created_at DATETIME NOT NULL DEFAULT NOW(),
                UNIQUE KEY uq_room (user1_id, user2_id),
                FOREIGN KEY (user1_id) REFERENCES users(id),
                FOREIGN KEY (user2_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS messages (
                id           INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                chat_room_id INT NOT NULL,
                sender_id    INT NOT NULL,
                content      TEXT NOT NULL,
                created_at   DATETIME NOT NULL DEFAULT NOW(),
                FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
                FOREIGN KEY (sender_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");

        $this->db->exec("
            CREATE TABLE IF NOT EXISTS news (
                id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                text       TEXT NOT NULL,
                created_at DATETIME NOT NULL DEFAULT NOW()
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    }
}
