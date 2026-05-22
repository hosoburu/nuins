<?php
class AuthController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    public function login(): void
    {
        $body = get_json_body();
        $name = trim($body['name'] ?? '');
        $password = $body['password'] ?? '';

        if ($name === '' || $password === '') {
            json_response(['error' => 'name と password は必須です'], 400);
        }

        $stmt = $this->db->prepare('SELECT * FROM users WHERE name = ?');
        $stmt->execute([$name]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_response(['error' => 'ユーザー名またはパスワードが違います'], 401);
        }

        $token = generate_token();
        $expiresAt = date('Y-m-d H:i:s', time() + TOKEN_TTL);

        $this->db->prepare("
            INSERT INTO auth_tokens (token, user_id, expires_at) VALUES (?, ?, ?)
        ")->execute([$token, $user['id'], $expiresAt]);

        json_response([
            'token' => $token,
            'user'  => format_user($user, $this->db),
        ]);
    }

    public function logout(): void
    {
        $currentUser = require_auth($this->currentUser);

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            $this->db->prepare('DELETE FROM auth_tokens WHERE token = ?')->execute([$matches[1]]);
        }

        json_response(['message' => 'ログアウトしました']);
    }

    public function me(): void
    {
        $currentUser = require_auth($this->currentUser);
        json_response(format_user($currentUser, $this->db));
    }
}
