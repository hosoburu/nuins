<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/helpers.php';
require_once __DIR__ . '/src/Database.php';
require_once __DIR__ . '/src/Migration.php';
require_once __DIR__ . '/src/Seeder.php';
require_once __DIR__ . '/src/controllers/AuthController.php';
require_once __DIR__ . '/src/controllers/UserController.php';
require_once __DIR__ . '/src/controllers/PostController.php';
require_once __DIR__ . '/src/controllers/ChatController.php';
require_once __DIR__ . '/src/controllers/NewsController.php';
require_once __DIR__ . '/src/controllers/RankingController.php';

// --- CORS ---
if (CORS_ORIGIN !== '') {
    header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- DB セットアップ ---
try {
    $db = Database::connect();
    (new Migration($db))->run();
    (new Seeder($db))->run();
} catch (PDOException $e) {
    json_response(['error' => 'DB接続エラー: ' . $e->getMessage()], 500);
}

// --- 認証トークン検証 ---
$currentUser = null;
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
if (preg_match('/^Bearer\s+(\S+)$/', $authHeader, $m)) {
    $stmt = $db->prepare("
        SELECT u.* FROM auth_tokens t
        JOIN users u ON t.user_id = u.id
        WHERE t.token = ? AND t.expires_at > ?
    ");
    $stmt->execute([$m[1], now_str()]);
    $currentUser = $stmt->fetch() ?: null;
}

// --- ルーティング ---
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
if (BASE_API_PATH !== '' && strpos($uri, BASE_API_PATH) === 0) {
    $uri = substr($uri, strlen(BASE_API_PATH));
}
$uri = rtrim($uri, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

$segments = array_values(array_filter(explode('/', $uri)));
$resource = $segments[0] ?? '';
$id       = isset($segments[1]) && ctype_digit($segments[1]) ? (int)$segments[1] : null;
$action   = $segments[2] ?? null;

switch ($resource) {
    case 'auth':
        $ctrl = new AuthController($db, $currentUser);
        $sub  = $segments[1] ?? '';
        if ($method === 'POST' && $sub === 'login')  { $ctrl->login();  break; }
        if ($method === 'POST' && $sub === 'logout') { $ctrl->logout(); break; }
        if ($method === 'GET'  && $sub === 'me')     { $ctrl->me();     break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    case 'users':
        $ctrl = new UserController($db, $currentUser);
        if ($method === 'GET' && $id === null) { $ctrl->index();     break; }
        if ($method === 'GET' && $id !== null) { $ctrl->show($id);   break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    case 'posts':
        $ctrl = new PostController($db, $currentUser);
        if ($method === 'GET'  && $id === null)                     { $ctrl->index();       break; }
        if ($method === 'POST' && $id === null)                     { $ctrl->create();      break; }
        if ($method === 'POST' && $id !== null && $action === 'like') { $ctrl->like($id); break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    case 'chats':
        $ctrl = new ChatController($db, $currentUser);
        if ($method === 'GET'  && $id === null)                          { $ctrl->index();            break; }
        if ($method === 'GET'  && $id !== null && $action === null)      { $ctrl->show($id);          break; }
        if ($method === 'POST' && $id !== null && $action === 'messages') { $ctrl->sendMessage($id); break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    case 'news':
        $ctrl = new NewsController($db, $currentUser);
        if ($method === 'GET') { $ctrl->index(); break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    case 'rankings':
        $ctrl = new RankingController($db, $currentUser);
        if ($method === 'GET' && ($segments[1] ?? '') === 'likes') { $ctrl->likes(); break; }
        json_response(['error' => 'Not Found'], 404);
        break;

    default:
        json_response(['error' => 'Not Found'], 404);
}
