<?php
class Seeder
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function run(): void
    {
        // 既にシード済みならスキップ
        $count = $this->db->query('SELECT COUNT(*) FROM users')->fetchColumn();
        if ($count > 0) {
            return;
        }

        $this->seedUsers();
        $this->seedPosts();
        $this->seedFollows();
        $this->seedChats();
        $this->seedNews();
    }

    private function seedUsers(): void
    {
        $users = [
            [
                'name'           => 'ホソ',
                'avatar'         => '/img/hoso.jpg',
                'level'          => 100,
                'rank'           => 'S',
                'points'         => 9800,
                'bio'            => 'ブラザーズ王国の剣士。常に最前線で戦う。',
                'follow_count'   => 42,
                'follower_count' => 120,
                'title'          => '最強の戦士',
                'password_hash'  => password_hash('password', PASSWORD_DEFAULT),
                'sns_links'      => [['label' => 'Twitter', 'url' => '#']],
            ],
            [
                'name'           => 'ブル',
                'avatar'         => '/img/buru.jpg',
                'level'          => 87,
                'rank'           => 'A',
                'points'         => 7500,
                'bio'            => '武器・防具の専門家。ブル武具店を経営中。',
                'follow_count'   => 30,
                'follower_count' => 85,
                'title'          => '武器職人',
                'password_hash'  => password_hash('password', PASSWORD_DEFAULT),
                'sns_links'      => [],
            ],
            [
                'name'           => 'イル',
                'avatar'         => '/img/iru.jpg',
                'level'          => 75,
                'rank'           => 'A',
                'points'         => 6200,
                'bio'            => 'イル薬局のオーナー。常備薬はお任せ！',
                'follow_count'   => 25,
                'follower_count' => 60,
                'title'          => '薬のプロ',
                'password_hash'  => password_hash('password', PASSWORD_DEFAULT),
                'sns_links'      => [],
            ],
            [
                'name'           => 'ひよこ',
                'avatar'         => '/img/hiyoko.jpg',
                'level'          => 50,
                'rank'           => 'B',
                'points'         => 3000,
                'bio'            => '新入り。これから頑張ります！',
                'follow_count'   => 10,
                'follower_count' => 20,
                'title'          => null,
                'password_hash'  => password_hash('password', PASSWORD_DEFAULT),
                'sns_links'      => [],
            ],
        ];

        $stmt = $this->db->prepare("
            INSERT INTO users (name, avatar, level, rank, points, bio, follow_count, follower_count, title, password_hash)
            VALUES (:name, :avatar, :level, :rank, :points, :bio, :follow_count, :follower_count, :title, :password_hash)
        ");

        $linkStmt = $this->db->prepare("
            INSERT INTO sns_links (user_id, label, url) VALUES (?, ?, ?)
        ");

        foreach ($users as $user) {
            $snsLinks = $user['sns_links'];
            unset($user['sns_links']);
            $stmt->execute($user);
            $userId = (int)$this->db->lastInsertId();
            foreach ($snsLinks as $link) {
                $linkStmt->execute([$userId, $link['label'], $link['url']]);
            }
        }
    }

    private function seedPosts(): void
    {
        $posts = [
            [
                'user_id'    => 2,
                'content'    => '武器新入荷！ドラゴンソードが入りました。興味ある方はブル武具店まで。',
                'image'      => '/img/hiyoko_daisyuugou.jpg',
                'like_count' => 24,
                'created_at' => '2026-05-22 20:00:00',
            ],
            [
                'user_id'    => 3,
                'content'    => '新しい回復薬を開発しました。HP+200の強力アイテムです！',
                'image'      => null,
                'like_count' => 18,
                'created_at' => '2026-05-22 18:30:00',
            ],
            [
                'user_id'    => 4,
                'content'    => 'はじめまして！よろしくお願いします。',
                'image'      => '/img/obake_pantentyo.jpg',
                'like_count' => 10,
                'created_at' => '2026-05-22 15:00:00',
            ],
            [
                'user_id'    => 1,
                'content'    => '今日も王国の平和を守ります。みなさん一緒に戦いましょう！',
                'image'      => null,
                'like_count' => 35,
                'created_at' => '2026-05-22 12:00:00',
            ],
        ];

        $stmt = $this->db->prepare("
            INSERT INTO posts (user_id, content, image, like_count, created_at)
            VALUES (:user_id, :content, :image, :like_count, :created_at)
        ");
        foreach ($posts as $post) {
            $stmt->execute($post);
        }
    }

    private function seedFollows(): void
    {
        // ホソ(1) が ブル(2), イル(3) を推し
        $follows = [[1, 2], [1, 3]];
        $stmt = $this->db->prepare("INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)");
        foreach ($follows as [$f, $e]) {
            $stmt->execute([$f, $e]);
        }
    }

    private function seedChats(): void
    {
        $rooms = [
            ['user1_id' => 1, 'user2_id' => 2, 'created_at' => '2026-05-22 19:00:00'],
            ['user1_id' => 1, 'user2_id' => 3, 'created_at' => '2026-05-22 17:00:00'],
        ];
        $roomStmt = $this->db->prepare("
            INSERT INTO chat_rooms (user1_id, user2_id, created_at) VALUES (:user1_id, :user2_id, :created_at)
        ");
        $msgStmt = $this->db->prepare("
            INSERT INTO messages (chat_room_id, sender_id, content, created_at)
            VALUES (:chat_room_id, :sender_id, :content, :created_at)
        ");

        $messages = [
            1 => [
                ['sender_id' => 2, 'content' => 'こんにちは！',                   'created_at' => '2026-05-22 19:00:00'],
                ['sender_id' => 1, 'content' => 'こんにちは、ブルさん！',          'created_at' => '2026-05-22 19:05:00'],
                ['sender_id' => 2, 'content' => '新しい剣、気に入ってもらえましたか？', 'created_at' => '2026-05-22 20:10:00'],
            ],
            2 => [
                ['sender_id' => 3, 'content' => 'ホソさん、お元気ですか？',       'created_at' => '2026-05-22 17:00:00'],
                ['sender_id' => 1, 'content' => '元気ですよ！',                   'created_at' => '2026-05-22 17:15:00'],
                ['sender_id' => 3, 'content' => '常備薬の在庫が補充されました！', 'created_at' => '2026-05-22 17:30:00'],
            ],
        ];

        foreach ($rooms as $room) {
            $roomStmt->execute($room);
            $roomId = (int)$this->db->lastInsertId();
            foreach ($messages[$roomId] as $msg) {
                $msg['chat_room_id'] = $roomId;
                $msgStmt->execute($msg);
            }
        }
    }

    private function seedNews(): void
    {
        $items = [
            'nuinsがリリースされました。',
            'ブラザーズ王国ではリモートワークを推奨しています。',
            '武器・防具のことならブルへお越しください。',
            '常備薬はイル薬局で取り扱いしています。',
            '新機能「推しタイムライン」が追加されました！',
        ];
        $stmt = $this->db->prepare("INSERT INTO news (text) VALUES (?)");
        foreach ($items as $text) {
            $stmt->execute([$text]);
        }
    }
}
