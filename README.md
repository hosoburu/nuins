# NUINS

ぬいぐるみ集団「ブラザーズ」のための SNS アプリです。

> 開発ルール・コマンド等の技術情報は [CLAUDE.md](CLAUDE.md) を参照してください。

## ローカル開発の起動・停止

`nuins-react` ディレクトリで以下のコマンドを実行する。

```bash
cd nuins-react
npm run dev   # 開発サーバー起動
```

起動後は http://localhost:5173 でアプリを確認できる。

## 技術スタック

| 用途 | 技術 |
|------|------|
| UI | React 18 + TypeScript |
| ルーティング | react-router-dom v6 |
| スタイリング | Tailwind CSS |
| ビルドツール | Vite |
| バックエンド | PHP 7.4+（フレームワークなし） |
| DB（ローカル） | SQLite（`nuins-api/local.db`） |
| DB（本番） | MySQL |

## ディレクトリ構成

```
nuins-react/          # フロントエンド
  src/
    pages/            # ページコンポーネント
    components/       # UIコンポーネント
      layout/         # ヘッダー・ボトムナビ
      home/           # ホーム画面パーツ（ニュース・ランキング・タイムライン）
      chat/           # チャット画面パーツ
      search/         # 検索画面パーツ
      mypage/         # マイページパーツ
    context/          # React Context（認証）
    lib/              # API クライアント
    types/            # 型定義
  public/
    img/              # キャラクター画像

nuins-api/            # バックエンド（PHP）
  index.php           # フロントコントローラー
  config.php          # 環境設定
  src/
    controllers/      # 各エンドポイントの処理
```

## ローカル開発

フロントエンドとバックエンドの両方を起動する。

```bash
# ターミナル 1: フロントエンド（http://localhost:5173）
cd nuins-react
npm run dev

# ターミナル 2: バックエンド（http://localhost:8080）
cd nuins-api
php -S localhost:8080
```

## ログイン

シード済みのアカウントでログインできる（パスワードはすべて `password`）：

| 名前 | ランク |
|------|--------|
| ホソ | S |
| ブル | A |
| イル | A |
| ひよこ | B |

## 実装状況

### 完了

| 機能 | フロントエンド | バックエンド |
|------|:---:|:---:|
| ログイン・ログアウト（Bearer トークン認証） | ✅ | ✅ |
| セッション復元（ページリロード時） | ✅ | ✅ |
| タイムライン表示 | ✅ | ✅ |
| 推しタイムラインフィルタ（`isOshi` 判定） | ✅ | ✅ |
| いいね（トグル） | — | ✅ |
| ニュースマーキー | ✅ | ✅ |
| いいねランキング（日間・週間・月間） | ✅ | ✅ |
| チャットルーム一覧 | ✅ | ✅ |
| チャットメッセージ表示・送信 | ✅ | ✅ |
| フレンド検索（名前フィルタ） | ✅ | ✅ |
| マイページ（プロフィール表示） | ✅ | ✅ |

### 未実装・課題

| 課題 | 備考 |
|------|------|
| ユーザー登録 | APIエンドポイントなし。現状はシードデータの4アカウントのみ |
| 投稿作成UI | `POST /posts` API は実装済み。投稿フォームのUIが未実装 |
| いいねボタン（UI） | APIは実装済み。タイムラインのハートボタンがまだ呼び出しをしていない |
| フォロー・アンフォロー（UI） | `follows` テーブルは存在。APIエンドポイント・UIが未実装 |
| チャットのリアルタイム更新 | 現状はページを開いた時点でのスナップショット。ポーリング・WebSocket は未実装 |
| 画像アップロード | 投稿・プロフィール画像の変更不可 |
| `src/data/mockData.ts` の削除 | API 移行完了につき不要になったが残存している |
| 本番 MySQL へのデータ移行手順 | 初回デプロイ時のシードデータ投入方法が未整備 |

---

## デプロイ（リトルサーバー）

デプロイ先URL: https://brothers.wew.jp/nuins/

### 1. ビルド

```bash
cd nuins-react
npm run build
```

`nuins-react/dist/` にビルド済みファイルが生成される。

### 2. FTPアップロード（フロントエンド）

`dist/` フォルダの中身をすべて、サーバーの `/nuins/` ディレクトリにアップロードする。

```
（アップロード元）nuins-react/dist/*
（アップロード先）サーバー: /nuins/
```

### 3. .htaccess の配置（フロントエンド）

サーバーの `/nuins/` ディレクトリに以下の内容で `.htaccess` を配置する。  
ページのリロード・直リンクを正常に動作させるために必要。

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /nuins/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /nuins/index.html [L]
</IfModule>
```

### 4. バックエンドのデプロイ

`nuins-api/` フォルダをサーバーの `/nuins/api/` にアップロードする。

```
（アップロード元）nuins-api/*
（アップロード先）サーバー: /nuins/api/
```

`local.db` はアップロード不要（`.gitignore` 済み）。MySQL の接続情報はサーバーの管理画面で環境変数、または `/nuins/api/.htaccess` に `SetEnv` で設定する。

```apache
SetEnv APP_ENV production
SetEnv DB_HOST localhost
SetEnv DB_NAME nuins_db
SetEnv DB_USER nuins_user
SetEnv DB_PASS xxxxxxxx
```

初回アクセス時に自動でテーブル作成・初期データ投入が行われる。

### 確認

ブラウザで https://brothers.wew.jp/nuins/ にアクセスし、ログイン画面が表示されればデプロイ完了。  
リロードや直リンクで404が出る場合は `.htaccess` が効いていない可能性がある。
