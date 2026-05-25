# 旅行記録マップ

写真のEXIFデータ（GPS・撮影日時）を自動抽出し、Google Mapsに時間順で表示する旅行記録アプリです。Google Vision APIによるAI自動タグ付け機能付き。

## 機能

- 📸 **写真アップロード** — ドラッグ&ドロップ対応
- 📍 **EXIF自動解析** — GPS座標・撮影日時を自動抽出
- 🗺️ **地図表示** — 撮影地点をマーカーで表示、時間順にルート線で結ぶ
- 🤖 **AIタグ付け** — Google Vision APIが写真の内容を自動解析してタグを生成
- 🔍 **タグフィルター** — タグで写真・地点を絞り込み

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **地図**: Google Maps JavaScript API
- **画像認識**: Google Cloud Vision API
- **EXIF解析**: exifr
- **DB/Storage**: Supabase (PostgreSQL + Storage)
- **デプロイ**: Vercel

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/travel-photo-map.git
cd travel-photo-map
npm install
```

### 2. Supabaseの設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editorで `supabase-schema.sql` を実行
3. Storage > New bucket で `travel-photos` バケットを作成（Public: ON）

### 3. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を編集して各APIキーを設定:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
GOOGLE_VISION_API_KEY=your_vision_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## Vercelへのデプロイ

1. GitHubにpush
2. [Vercel](https://vercel.com) でリポジトリを連携
3. Environment Variablesに `.env.local` の内容を設定
4. デプロイ完了 🎉

## ファイル構成

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts   # 写真アップロード
│   │   ├── photos/route.ts   # 写真一覧・削除
│   │   └── tags/route.ts     # タグ一覧
│   ├── upload/page.tsx       # アップロードページ
│   ├── page.tsx              # メイン（地図）ページ
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── MapView.tsx           # Googleマップ表示
│   ├── PhotoSidebar.tsx      # 写真リスト
│   ├── TagFilter.tsx         # タグフィルター
│   └── Navbar.tsx            # ナビゲーション
├── lib/
│   ├── supabase.ts           # Supabaseクライアント
│   ├── exif.ts               # EXIF解析
│   └── vision.ts             # Vision API
└── types/index.ts            # 型定義
```
