<?php
class RankingController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    // GET /rankings/likes
    // 日間・週間・月間のいいね数ランキング上位1名を返す
    public function likes(): void
    {
        $now = now_str();
        $dayStart   = date('Y-m-d H:i:s', strtotime('-1 day',   strtotime($now)));
        $weekStart  = date('Y-m-d H:i:s', strtotime('-7 days',  strtotime($now)));
        $monthStart = date('Y-m-d H:i:s', strtotime('-30 days', strtotime($now)));

        json_response([
            'daily'   => $this->topUser($dayStart),
            'weekly'  => $this->topUser($weekStart),
            'monthly' => $this->topUser($monthStart),
        ]);
    }

    private function topUser(string $since): ?array
    {
        $stmt = $this->db->prepare("
            SELECT u.*, SUM(p.like_count) AS total_likes
            FROM users u
            JOIN posts p ON p.user_id = u.id
            WHERE p.created_at >= ?
            GROUP BY u.id
            ORDER BY total_likes DESC
            LIMIT 1
        ");
        $stmt->execute([$since]);
        $user = $stmt->fetch();
        return $user ? format_user($user, $this->db) : null;
    }
}
