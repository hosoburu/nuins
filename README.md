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

## ディレクトリ構成

```
nuins-react/
  src/
    pages/          # ページコンポーネント
    components/     # UIコンポーネント
      layout/       # ヘッダー・ボトムナビ
      home/         # ホーム画面パーツ（ニュース・ランキング・タイムライン）
      chat/         # チャット画面パーツ
      search/       # 検索画面パーツ
      mypage/       # マイページパーツ
    context/        # React Context（認証）
    data/           # モックデータ
    types/          # 型定義
  public/
    img/            # キャラクター画像
```

## 現在のログイン

バックエンドは未実装のため、ログイン画面でなにか名前を入力してログインボタンを押すとそのまま入れます。

## デプロイ（リトルサーバー）

デプロイ先URL: https://brothers.wew.jp/nuins/

### 1. ビルド

```bash
cd nuins-react
npm run build
```

`nuins-react/dist/` にビルド済みファイルが生成される。

### 2. FTPアップロード

`dist/` フォルダの中身をすべて、サーバーの `/nuins/` ディレクトリにアップロードする。

```
（アップロード元）nuins-react/dist/*
（アップロード先）サーバー: /nuins/
```

### 3. .htaccess の配置

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

### 確認

ブラウザで https://brothers.wew.jp/nuins/ にアクセスし、ログイン画面が表示されればデプロイ完了。  
リロードや直リンクで404が出る場合は `.htaccess` が効いていない可能性がある。
