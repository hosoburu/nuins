<?php
class PostController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    // GET /posts
    public function index(): void
    {
        $stmt = $this->db->query('SELECT * FROM posts ORDER BY created_at DESC');
        $posts = $stmt->fetchAll();

        $result = [];
        foreach ($posts as $post) {
            $userStmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
            $userStmt->execute([$post['user_id']]);
            $user = $userStmt->fetch();
            $result[] = format_post($post, format_user($user, $this->db), $this->db, $this->currentUser);
        }

        json_response($result);
    }

    // POST /posts
    public function create(): void
    {
        $currentUser = require_auth($this->currentUser);
        $body = get_json_body();
        $content = trim($body['content'] ?? '');
        $image = $body['image'] ?? null;

        if ($content === '') {
            json_response(['error' => 'content は必須です'], 400);
        }

        $stmt = $this->db->prepare("
            INSERT INTO posts (user_id, content, image, created_at)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$currentUser['id'], $content, $image, now_str()]);
        $postId = (int)$this->db->lastInsertId();

        $post = $this->db->prepare('SELECT * FROM posts WHERE id = ?');
        $post->execute([$postId]);
        $post = $post->fetch();

        json_response(format_post($post, format_user($currentUser, $this->db), $this->db, $currentUser), 201);
    }

    // POST /posts/{id}/like
    public function like(int $id): void
    {
        $currentUser = require_auth($this->currentUser);

        $post = $this->db->prepare('SELECT * FROM posts WHERE id = ?');
        $post->execute([$id]);
        if (!$post->fetch()) {
            json_response(['error' => '投稿が見つかりません'], 404);
        }

        // 既にいいね済みなら取り消し（トグル）
        $exists = $this->db->prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?');
        $exists->execute([$currentUser['id'], $id]);

        if ($exists->fetchColumn()) {
            $this->db->prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?')
                ->execute([$currentUser['id'], $id]);
            $this->db->prepare('UPDATE posts SET like_count = like_count - 1 WHERE id = ?')->execute([$id]);
            $liked = false;
        } else {
            $this->db->prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)')
                ->execute([$currentUser['id'], $id]);
            $this->db->prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?')->execute([$id]);
            $liked = true;
        }

        $updatedCount = $this->db->prepare('SELECT like_count FROM posts WHERE id = ?');
        $updatedCount->execute([$id]);
        $likeCount = (int)$updatedCount->fetchColumn();

        json_response(['liked' => $liked, 'likeCount' => $likeCount]);
    }
}
