<?php
class ChatController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    // GET /chats
    public function index(): void
    {
        $currentUser = require_auth($this->currentUser);
        $uid = (int)$currentUser['id'];

        $stmt = $this->db->prepare("
            SELECT cr.*,
                (SELECT content    FROM messages WHERE chat_room_id = cr.id ORDER BY created_at DESC LIMIT 1) AS last_message,
                (SELECT created_at FROM messages WHERE chat_room_id = cr.id ORDER BY created_at DESC LIMIT 1) AS updated_at
            FROM chat_rooms cr
            WHERE cr.user1_id = ? OR cr.user2_id = ?
            ORDER BY updated_at DESC
        ");
        $stmt->execute([$uid, $uid]);
        $rooms = $stmt->fetchAll();

        $result = [];
        foreach ($rooms as $room) {
            $partnerId = (int)$room['user1_id'] === $uid ? (int)$room['user2_id'] : (int)$room['user1_id'];
            $partnerStmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
            $partnerStmt->execute([$partnerId]);
            $partner = $partnerStmt->fetch();

            $result[] = [
                'id'          => (int)$room['id'],
                'partner'     => format_user($partner, $this->db),
                'lastMessage' => $room['last_message'] ?? '',
                'updatedAt'   => $room['updated_at'] ? substr($room['updated_at'], 0, 16) : '',
            ];
        }

        json_response($result);
    }

    // GET /chats/{id}
    public function show(int $id): void
    {
        $currentUser = require_auth($this->currentUser);
        $uid = (int)$currentUser['id'];

        $room = $this->db->prepare('SELECT * FROM chat_rooms WHERE id = ?');
        $room->execute([$id]);
        $room = $room->fetch();

        if (!$room || ((int)$room['user1_id'] !== $uid && (int)$room['user2_id'] !== $uid)) {
            json_response(['error' => 'チャットルームが見つかりません'], 404);
        }

        $partnerId = (int)$room['user1_id'] === $uid ? (int)$room['user2_id'] : (int)$room['user1_id'];
        $partnerStmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
        $partnerStmt->execute([$partnerId]);
        $partner = $partnerStmt->fetch();

        $msgStmt = $this->db->prepare('SELECT * FROM messages WHERE chat_room_id = ? ORDER BY created_at ASC');
        $msgStmt->execute([$id]);
        $messages = $msgStmt->fetchAll();

        $lastMsg = end($messages);
        json_response([
            'id'          => (int)$room['id'],
            'partner'     => format_user($partner, $this->db),
            'messages'    => array_map('format_message', $messages),
            'lastMessage' => $lastMsg ? $lastMsg['content'] : '',
            'updatedAt'   => $lastMsg ? substr($lastMsg['created_at'], 0, 16) : '',
        ]);
    }

    // POST /chats/{id}/messages
    public function sendMessage(int $id): void
    {
        $currentUser = require_auth($this->currentUser);
        $uid = (int)$currentUser['id'];

        $room = $this->db->prepare('SELECT * FROM chat_rooms WHERE id = ?');
        $room->execute([$id]);
        $room = $room->fetch();

        if (!$room || ((int)$room['user1_id'] !== $uid && (int)$room['user2_id'] !== $uid)) {
            json_response(['error' => 'チャットルームが見つかりません'], 404);
        }

        $body = get_json_body();
        $content = trim($body['content'] ?? '');
        if ($content === '') {
            json_response(['error' => 'content は必須です'], 400);
        }

        $stmt = $this->db->prepare("
            INSERT INTO messages (chat_room_id, sender_id, content, created_at) VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$id, $uid, $content, now_str()]);
        $msgId = (int)$this->db->lastInsertId();

        $msg = $this->db->prepare('SELECT * FROM messages WHERE id = ?');
        $msg->execute([$msgId]);
        json_response(format_message($msg->fetch()), 201);
    }
}
