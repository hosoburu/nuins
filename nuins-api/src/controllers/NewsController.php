<?php
class NewsController
{
    private PDO $db;
    private ?array $currentUser;

    public function __construct(PDO $db, ?array $currentUser)
    {
        $this->db          = $db;
        $this->currentUser = $currentUser;
    }

    // GET /news
    public function index(): void
    {
        $stmt = $this->db->query('SELECT id, text FROM news ORDER BY id ASC');
        $news = $stmt->fetchAll();

        json_response(array_map(fn($n) => [
            'id'   => (int)$n['id'],
            'text' => $n['text'],
        ], $news));
    }
}
