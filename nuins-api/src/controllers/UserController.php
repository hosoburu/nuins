<?php
class UserController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    // GET /users?q=検索キーワード
    public function index(): void
    {
        $q = trim($_GET['q'] ?? '');
        if ($q !== '') {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE name LIKE ? ORDER BY points DESC');
            $stmt->execute(['%' . $q . '%']);
        } else {
            $stmt = $this->db->query('SELECT * FROM users ORDER BY points DESC');
        }
        $users = $stmt->fetchAll();

        json_response(array_map(fn($u) => format_user($u, $this->db), $users));
    }

    // GET /users/{id}
    public function show(int $id): void
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            json_response(['error' => 'ユーザーが見つかりません'], 404);
        }

        json_response(format_user($user, $this->db));
    }
}
