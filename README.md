# &AI KOL Research

> X・Instagram・TikTok・YouTubeをAIが横断分析し、最適なKOL（インフルエンサー）を自動発掘・スコアリングするインテリジェンスプラットフォーム

## 🎯 概要

AIによるKOL自動発掘・エンゲージメント分析・フェイクフォロワー検出を実現。
キャンペーン管理からDM自動化まで、インフルエンサーマーケティングを一元化する。
andai-kol-research・bk-kol-research・bk-influencer-finderを統合した統合KOL分析スイート。

## ✨ 主な機能

- **マルチプラットフォームKOL発掘** — X/Instagram/TikTok/YouTube横断スキャン
- **AIスコアリング** — エンゲージメント率・オーディエンス品質・フェイク検出
- **インフルエンサーマッチング** — ブランド条件に最適なKOLを自動提案
- **キャンペーン管理** — 進捗トラッキング・成果レポート自動生成
- **DM自動化** — キーワード・フィルター設定に基づく自動アウトリーチ
- **ダーク/ライトモード・日英対応** — 海外KOL調査にも対応

## 🛠️ 技術スタック

- **フロントエンド:** Next.js 16 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Recharts
- **UIライブラリ:** Radix UI（59コンポーネント）+ React Hook Form + Zod
- **バックエンド:** Next.js API Routes + Python クローラー（外部）
- **DB:** PostgreSQL + Redis（外部API経由）
- **AI:** OpenAI API / Claude API
- **インフラ:** Vercel + Cloudflare Tunnel（Vercelタイムアウト回避）

## 🌐 URL

- **本番:** https://andai-kol-research.vercel.app
- **開発:** http://localhost:3000

## 📊 ステータス

🟡 開発中 — MVP完成・Cloudflareトンネル経由でスキャンAPI稼働中

## 🔗 関連プロジェクト

- **統合先:** &AI KOL（~/Projects/andai-kol/）に統合予定
- **連携先:** &AI AD（KOLデータを広告ターゲティングに活用）、bk-influencer-finder

## 📁 プロジェクト構造

```
├── app/
│   ├── page.tsx              # メインダッシュボード（KPI + チャート）
│   └── api/
│       ├── candidates/       # 候補者データ管理 API
│       └── scan/             # KOL スキャン API
├── components/               # Radix UI ベースのコンポーネント群
├── hooks/                    # カスタム React フック
└── lib/                      # コンテキスト & ユーティリティ
```

## 🚀 開始方法

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build
```

### 環境変数

```env
API_URL=https://your-cloudflare-tunnel.trycloudflare.com
NEXT_PUBLIC_SCAN_API_URL=https://your-cloudflare-tunnel.trycloudflare.com
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---
*BKグループ &AI ブランド / 2026-04-06*
