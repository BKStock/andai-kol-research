export type CandidateStatus = '未接触' | '連絡済' | '交渉中' | '協業中' | '見送り'

export type Platform = 'YouTube' | 'TikTok' | 'Instagram' | 'X'

export interface Candidate {
  id: string
  name: string
  platform: Platform
  subscribers: number
  score: number
  engagement: number
  growth: number
  lastPost: string
  status: CandidateStatus
  latestVideos: { title: string; views: number }[]
  engagementRate: number
  fanDensity: number
  monetized: boolean
  postFrequency: string
  nicheMatch: number
  notes: string
}

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'CryptoTaro',
    platform: 'YouTube',
    subscribers: 8200,
    score: 94,
    engagement: 14.2,
    growth: 340,
    lastPost: '2日前',
    status: '未接触',
    latestVideos: [
      { title: '【2026年最新】ビットコイン価格予測と注目のアルトコイン10選', views: 12400 },
      { title: '仮想通貨初心者が絶対やってはいけない5つの失敗', views: 8900 },
      { title: 'DeFi運用で月5万円稼ぐ方法を完全解説', views: 15200 },
    ],
    engagementRate: 14.2,
    fanDensity: 8.3,
    monetized: false,
    postFrequency: '週3回',
    nicheMatch: 92,
    notes: '',
  },
  {
    id: '2',
    name: 'Bitcoin花子',
    platform: 'YouTube',
    subscribers: 4100,
    score: 87,
    engagement: 11.8,
    growth: 180,
    lastPost: '1日前',
    status: '未接触',
    latestVideos: [
      { title: '女性のための仮想通貨投資入門', views: 5600 },
      { title: '私のポートフォリオ公開します', views: 4200 },
      { title: 'NFTアートで稼ぐ方法', views: 3800 },
    ],
    engagementRate: 11.8,
    fanDensity: 7.9,
    monetized: false,
    postFrequency: '週2回',
    nicheMatch: 88,
    notes: '',
  },
  {
    id: '3',
    name: 'NFT研究所',
    platform: 'YouTube',
    subscribers: 12400,
    score: 82,
    engagement: 8.4,
    growth: 67,
    lastPost: '3日前',
    status: '連絡済',
    latestVideos: [
      { title: 'NFTマーケットプレイス完全比較2026', views: 18200 },
      { title: '注目のNFTプロジェクト分析', views: 9800 },
      { title: 'メタバース×NFTの未来', views: 7600 },
    ],
    engagementRate: 8.4,
    fanDensity: 6.8,
    monetized: true,
    postFrequency: '週1回',
    nicheMatch: 79,
    notes: 'DM送信済み。返信待ち。',
  },
  {
    id: '4',
    name: 'DeFi太郎',
    platform: 'TikTok',
    subscribers: 2800,
    score: 79,
    engagement: 16.1,
    growth: 290,
    lastPost: '今日',
    status: '未接触',
    latestVideos: [
      { title: 'DeFiで不労所得を作る方法', views: 45000 },
      { title: '1分でわかるイールドファーミング', views: 32000 },
      { title: '仮想通貨ステーキング入門', views: 28000 },
    ],
    engagementRate: 16.1,
    fanDensity: 8.1,
    monetized: false,
    postFrequency: '毎日',
    nicheMatch: 85,
    notes: '',
  },
  {
    id: '5',
    name: 'アルトコイン探偵',
    platform: 'YouTube',
    subscribers: 6700,
    score: 76,
    engagement: 9.2,
    growth: 45,
    lastPost: '5日前',
    status: '交渉中',
    latestVideos: [
      { title: '次に100倍になるアルトコインを探す', views: 22000 },
      { title: '草コイン投資の極意', views: 15000 },
      { title: '暴落時の買い増し戦略', views: 11000 },
    ],
    engagementRate: 9.2,
    fanDensity: 7.2,
    monetized: true,
    postFrequency: '週2回',
    nicheMatch: 91,
    notes: '条件交渉中。報酬体系について調整。',
  },
  {
    id: '6',
    name: 'NISA女子',
    platform: 'Instagram',
    subscribers: 15200,
    score: 71,
    engagement: 7.1,
    growth: 23,
    lastPost: '1週間前',
    status: '未接触',
    latestVideos: [
      { title: '新NISA完全攻略ガイド', views: 8500 },
      { title: '投資初心者の資産公開', views: 6200 },
      { title: 'インデックス投資vs個別株', views: 4800 },
    ],
    engagementRate: 7.1,
    fanDensity: 5.8,
    monetized: false,
    postFrequency: '週1回',
    nicheMatch: 65,
    notes: '',
  },
  {
    id: '7',
    name: '株式投資の神',
    platform: 'YouTube',
    subscribers: 9800,
    score: 68,
    engagement: 6.8,
    growth: 12,
    lastPost: '2日前',
    status: '連絡済',
    latestVideos: [
      { title: '日本株投資で勝つ方法', views: 12000 },
      { title: '配当金生活への道', views: 9500 },
      { title: '決算書の読み方講座', views: 7200 },
    ],
    engagementRate: 6.8,
    fanDensity: 6.2,
    monetized: true,
    postFrequency: '週3回',
    nicheMatch: 58,
    notes: 'メール返信あり。興味ありとのこと。',
  },
  {
    id: '8',
    name: 'Web3起業家',
    platform: 'X',
    subscribers: 3400,
    score: 65,
    engagement: 12.4,
    growth: 156,
    lastPost: '今日',
    status: '未接触',
    latestVideos: [
      { title: 'Web3スタートアップの始め方', views: 2800 },
      { title: 'DAO運営の裏側を公開', views: 2100 },
      { title: 'トークン発行の法的リスク', views: 1800 },
    ],
    engagementRate: 12.4,
    fanDensity: 7.5,
    monetized: false,
    postFrequency: '毎日',
    nicheMatch: 82,
    notes: '',
  },
]

export const statusDistribution = [
  { name: '未接触', value: 634, color: '#8892B0' },
  { name: '連絡済', value: 124, color: '#00E5FF' },
  { name: '交渉中', value: 67, color: '#FFB800' },
  { name: '協業中', value: 22, color: '#00FF8C' },
]

export const platformCoverage = [
  { name: 'YouTube', value: 412 },
  { name: 'TikTok', value: 238 },
  { name: 'Instagram', value: 156 },
  { name: 'X', value: 41 },
]

export const weeklyDiscovery = [
  { week: 'W1', discovered: 45, collaborated: 1 },
  { week: 'W2', discovered: 52, collaborated: 2 },
  { week: 'W3', discovered: 38, collaborated: 1 },
  { week: 'W4', discovered: 61, collaborated: 3 },
  { week: 'W5', discovered: 47, collaborated: 2 },
  { week: 'W6', discovered: 55, collaborated: 1 },
  { week: 'W7', discovered: 72, collaborated: 4 },
  { week: 'W8', discovered: 63, collaborated: 2 },
  { week: 'W9', discovered: 58, collaborated: 3 },
  { week: 'W10', discovered: 49, collaborated: 2 },
  { week: 'W11', discovered: 67, collaborated: 3 },
  { week: 'W12', discovered: 23, collaborated: 1 },
]

export const scoreDistribution = [
  { range: '0-10', count: 12 },
  { range: '11-20', count: 28 },
  { range: '21-30', count: 45 },
  { range: '31-40', count: 67 },
  { range: '41-50', count: 89 },
  { range: '51-60', count: 134 },
  { range: '61-70', count: 186 },
  { range: '71-80', count: 156 },
  { range: '81-90', count: 98 },
  { range: '91-100', count: 32 },
]

export const topKeywords = [
  { keyword: '仮想通貨', candidates: 234, avgScore: 74.2 },
  { keyword: 'bitcoin', candidates: 189, avgScore: 71.8 },
  { keyword: 'NISA投資', candidates: 156, avgScore: 78.4 },
  { keyword: 'crypto', candidates: 143, avgScore: 69.1 },
  { keyword: 'DeFi', candidates: 98, avgScore: 82.3 },
]

export const platformPerformance = [
  { platform: 'YouTube', avgScore: 76, engagement: 8.5, growth: 45, responseRate: 28 },
  { platform: 'TikTok', avgScore: 72, engagement: 12.3, growth: 89, responseRate: 18 },
  { platform: 'Instagram', avgScore: 68, engagement: 6.8, growth: 32, responseRate: 35 },
  { platform: 'X', avgScore: 71, engagement: 9.4, growth: 67, responseRate: 22 },
]

export function formatSubscribers(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-[#00FF8C]'
  if (score >= 70) return 'text-[#6378FF]'
  if (score >= 50) return 'text-[#FFB800]'
  return 'text-[#8892B0]'
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-[rgba(0,255,140,0.12)] text-[#00FF8C]'
  if (score >= 70) return 'bg-[rgba(99,120,255,0.12)] text-[#6378FF]'
  if (score >= 50) return 'bg-[rgba(255,184,0,0.12)] text-[#FFB800]'
  return 'bg-[rgba(136,146,176,0.1)] text-[#8892B0]'
}

export function getStatusColor(status: CandidateStatus): string {
  switch (status) {
    case '未接触': return 'border-[rgba(136,146,176,0.3)] text-[#8892B0]'
    case '連絡済': return 'border-[rgba(0,229,255,0.3)] text-[#00E5FF]'
    case '交渉中': return 'border-[rgba(255,184,0,0.3)] text-[#FFB800]'
    case '協業中': return 'border-[rgba(0,255,140,0.3)] text-[#00FF8C]'
    case '見送り': return 'border-[rgba(255,61,110,0.3)] text-[#FF3D6E] line-through'
    default: return 'border-[rgba(136,146,176,0.3)] text-[#8892B0]'
  }
}

export function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'YouTube':
      return '📺'
    case 'TikTok':
      return '🎵'
    case 'Instagram':
      return '📸'
    case 'X':
      return '𝕏'
    default:
      return '📱'
  }
}

export function generateDMTemplate(candidate: Candidate): string {
  return `${candidate.name}さんへ

いつも投稿を拝見しております。
「${candidate.latestVideos[0]?.title || '最新コンテンツ'}」の動画、非常に参考になりました。
特に具体的な解説の部分が分かりやすく、視聴者目線で素晴らしいと感じました。

私たちはAI量子投資シグナルを開発しており、
${candidate.name}さんのようなインフルエンサーの方に
先行体験にご招待できればと思いまして、ご連絡させていただきました。

ご興味がございましたら、ぜひお話しさせてください。

詳細: line.and-ai.one`
}
