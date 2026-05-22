# NUINS — Claude Code 開発ガードレール

> このファイルはClaude Code（AI）向けの開発ガードレールです。
> 「今のプロジェクトを壊さず育てる」を最優先とし、過剰設計・一般論を禁じます。

---

## 現在のアーキテクチャ（実態）

```
nuins-react/                  # フロントエンド（React + TypeScript + Vite）
  src/
    pages/          # ページコンポーネント（LoginPage / HomePage / ChatPage / SearchPage / MyPage）
    components/     # UIコンポーネント（layout / home / chat / search / mypage）
    context/        # React Context（AuthContext）
    lib/            # API クライアント（api.ts）
    data/           # モックデータ（mockData.ts）※ API 移行後に削除予定
    types/          # 型定義（index.ts）

nuins-api/                    # バックエンド（PHP 7.4+、フレームワークなし）
  index.php                   # フロントコントローラー・ルーター
  config.php                  # 環境設定（APP_ENV で SQLite/MySQL 切替）
  src/
    Database.php              # PDO 接続ファクトリ
    Migration.php / Seeder.php
    controllers/              # AuthController / UserController / PostController / ChatController / NewsController / RankingController
```

- バックエンドは `nuins-api/` に PHP で実装済み。ローカルは SQLite、本番は MySQL。
- 認証は Bearer トークン方式（`Authorization: Bearer <token>`）。`AuthContext` がトークンを `localStorage` に保存・管理する。
- API クライアントは `src/lib/api.ts` に集約。ページは api.ts を通じてデータを取得する。
- `src/data/mockData.ts` は API 移行が完了したページから順次削除する。
- ルーティングは `react-router-dom` v6 の `BrowserRouter` + `Routes`。未認証時は `/login` にリダイレクト。
- スタイリングは Tailwind CSS のみ使用（CSS Modules・styled-components は使わない）。

### API エンドポイント一覧

| メソッド | パス | 認証 | 機能 |
|--------|------|:---:|------|
| POST | `/auth/login` | | ログイン（Bearer トークン返却） |
| POST | `/auth/logout` | ✓ | ログアウト |
| GET | `/auth/me` | ✓ | 認証済みユーザー取得 |
| GET | `/users` | | ユーザー一覧（`?q=` で名前検索） |
| GET | `/users/{id}` | | ユーザー詳細 |
| GET | `/posts` | | タイムライン取得 |
| POST | `/posts` | ✓ | 投稿作成 |
| POST | `/posts/{id}/like` | ✓ | いいね（トグル） |
| GET | `/chats` | ✓ | チャットルーム一覧 |
| GET | `/chats/{id}` | ✓ | チャット詳細（メッセージ含む） |
| POST | `/chats/{id}/messages` | ✓ | メッセージ送信 |
| GET | `/news` | | お知らせ一覧 |
| GET | `/rankings/likes` | | いいねランキング（日間・週間・月間） |

---

## P0 — 絶対ルール（違反禁止）

### 1. 責務境界

#### Pages（`src/pages/`）

**やること：**
- ルート単位の画面構成（Header / BottomNav の配置、各セクションの組み合わせ）
- Context からのデータ取得（`useAuth` 等）
- `api.ts` を通じた API 呼び出しと、取得データの子コンポーネントへの props 渡し

**禁止：**
- 詳細なUIロジックをページに直書き（必ずコンポーネントに切り出す）
- ビジネスロジック・データ変換をページ内に書く
- `fetch` を直書きする（必ず `api.ts` の関数を使う）

#### Components（`src/components/`）

**やること：**
- props で受け取ったデータの表示
- ローカルの UI 状態管理（開閉・ホバー等）

**禁止：**
- Context の直接参照（`useAuth` を除く。AuthContext は特例として各コンポーネントからの参照を許容）
- モックデータの直接インポート（pages 経由で受け取る）
- ページレイアウトの組み立て

#### Context（`src/context/`）

**やること：**
- アプリ横断の状態管理（認証情報等）
- ログイン・ログアウト処理（`api.ts` 経由で API を呼び出す）
- Bearer トークンの `localStorage` への保存・読み込み

**禁止：**
- UIロジック・スタイル

#### API クライアント（`src/lib/api.ts`）

- **API 呼び出しの唯一の窓口**。ページから直接 `fetch` を書かない。
- 認証ヘッダー（`Authorization: Bearer <token>`）の付与はここで一元管理する。
- ローカル（`http://localhost:8080`）と本番（`/nuins/api`）の URL 切替は `VITE_API_BASE_URL` 環境変数で制御する。

#### データ（`src/data/mockData.ts`）

- API 移行が完了したページから順次削除する。
- 型は `src/types/index.ts` に集約する。型を追加する際はここに書く。

---

### 2. スタイリング

- Tailwind CSS のユーティリティクラスのみ使用する。
- インラインスタイル（`style={{...}}`）は原則禁止。どうしても必要な場合は理由を説明する。
- 独自CSSクラス（`src/index.css` 等）は最小限にとどめる。

---

### 3. 実装前チェック（中規模以上の変更時）

**中規模の定義：2ファイル以上、または複数ページをまたぐ変更。**

以下を **実装前に提示**：

1. 変更するファイル一覧
2. 影響を受けるページ・コンポーネント
3. Context・型定義への波及リスク

**小規模（1ファイル・既存コンポーネントの修正のみ）は省略可。**

勝手な大規模リファクタ禁止。「ついでに整理」もしない。

---

### 4. 最小変更原則

- 既存構造を尊重し、最小の変更で目的を達成する。
- 新しい抽象化（カスタムフック・HOC等）は、同じロジックが3箇所以上に重複したときのみ提案する。

---

### 5. 開発コマンド

**フロントエンド**（`nuins-react/` ディレクトリ）：

| コマンド | 用途 |
|----------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:5173） |
| `npm run build` | 本番ビルド（`tsc && vite build`） |
| `npm run preview` | ビルド結果のプレビュー |

**バックエンド**（`nuins-api/` ディレクトリ）：

| コマンド | 用途 |
|----------|------|
| `php -S localhost:8080` | 開発サーバー起動（http://localhost:8080） |

**ローカル開発は両方同時に起動する。**

---

### 6. 既存ディレクトリ構成の尊重

新規ファイル追加時のルール：

| 追加先 | 条件 |
|--------|------|
| `src/pages/` | 新規ルート（画面）を追加する時 |
| `src/components/<feature>/` | 特定機能のUIコンポーネントを追加する時 |
| `src/components/layout/` | ヘッダー・フッター等の共通レイアウト |
| `src/context/` | アプリ横断の状態が必要な時 |
| `src/lib/api.ts` | API 関数の追加（ファイルを分割しない） |
| `src/types/index.ts` | 新しい型定義（ファイルを分割しない） |
| `src/data/` | 移行前のページが参照するモックデータのみ残す |

命名規則：コンポーネントはパスカルケース（`XxxComponent.tsx`）、ユーティリティ・データはキャメルケース。

---

## P1 — 原則（守る、理由があれば相談）

### コーディング

- 型は `any` を使わない。不明な型は `unknown` を使い、適切に絞り込む。
- props の型は `type` で定義する（`interface` は使わない。既存パターン踏襲）。
- コンポーネントはアロー関数でエクスポートする（`export default function` も既存では使用中。どちらでも可だが統一を意識する）。
- マジックナンバーは定数化を提案する。

### 説明義務

修正時は以下を簡潔に提示：
- なぜこの実装にしたか
- 既存機能への影響範囲

リファクタリングと機能追加を**同一コミットに混ぜない**。

---

## P2 — 推奨（聞かれた時・明らかな場合のみ）

- カスタムフックへの切り出し（同一ロジックが3箇所以上に重複した時）
- React Query / SWR の導入提案（データフェッチが複雑になってきた時）
- PHP バックエンドの新規エンドポイント追加提案（フロントから必要になった時）

**現時点で不要な設計変更はしない。**

---

## 禁止事項まとめ

| 禁止 | 理由 |
|------|------|
| インラインスタイルの多用 | Tailwind で統一するため |
| `any` 型の使用 | 型安全性が失われる |
| モックデータをコンポーネントから直接インポート | pages 経由で渡すのが責務上の原則 |
| ページから直接 `fetch` を書く | `api.ts` に集約するため |
| 確認なしの大規模リファクタ | 動いているコードを壊すリスク |
| 独自CSS・styled-components の導入 | Tailwind で統一するため |
