<?php
function json_response($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_json_body(): array
{
    $body = file_get_contents('php://input');
    return json_decode($body ?: '{}', true) ?? [];
}

function require_auth(?array $currentUser): array
{
    if ($currentUser === null) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    return $currentUser;
}

function format_user(array $user, PDO $db): array
{
    $stmt = $db->prepare('SELECT label, url FROM sns_links WHERE user_id = ? ORDER BY id');
    $stmt->execute([$user['id']]);
    $snsLinks = $stmt->fetchAll();

    return [
        'id'            => (int)$user['id'],
        'name'          => $user['name'],
        'avatar'        => $user['avatar'],
        'level'         => (int)$user['level'],
        'rank'          => $user['rank'],
        'points'        => (int)$user['points'],
        'bio'           => $user['bio'],
        'followCount'   => (int)$user['follow_count'],
        'followerCount' => (int)$user['follower_count'],
        'title'         => $user['title'],
        'snsLinks'      => array_map(
            fn($l) => ['label' => $l['label'], 'url' => $l['url']],
            $snsLinks
        ),
    ];
}

function format_post(array $post, array $user, PDO $db, ?array $currentUser): array
{
    $isOshi = false;
    if ($currentUser !== null) {
        $stmt = $db->prepare('SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?');
        $stmt->execute([(int)$currentUser['id'], (int)$post['user_id']]);
        $isOshi = (bool)$stmt->fetchColumn();
    }

    return [
        'id'        => (int)$post['id'],
        'user'      => $user,
        'content'   => $post['content'],
        'image'     => $post['image'],
        'likeCount' => (int)$post['like_count'],
        'createdAt' => substr($post['created_at'], 0, 16), // "YYYY-MM-DD HH:MM"
        'isOshi'    => $isOshi,
    ];
}

function format_message(array $msg): array
{
    return [
        'id'        => (int)$msg['id'],
        'senderId'  => (int)$msg['sender_id'],
        'content'   => $msg['content'],
        'createdAt' => substr($msg['created_at'], 0, 16),
    ];
}

function now_str(): string
{
    return date('Y-m-d H:i:s');
}

function generate_token(): string
{
    return bin2hex(random_bytes(32));
}
