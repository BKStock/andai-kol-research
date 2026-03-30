'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Language = 'ja' | 'en'

type Language = 'ja' | 'en'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  ja: {
    // Navigation
    'nav.dashboard': 'ダッシュボード',
    'nav.candidates': '候補者一覧',
    'nav.analytics': 'アナリティクス',
    'nav.settings': '設定',
    
    // Header
    'header.week': '2026 W13 — 3/25〜3/31',
    'header.nextScan': '次回スキャン:',
    'header.scanNow': '今すぐスキャン',
    
    // KPI Cards
    'kpi.totalCandidates': '候補者数',
    'kpi.newThisWeek': '今週新規',
    'kpi.approached': 'アプローチ済',
    'kpi.collaborating': '協業中',
    'kpi.thisWeek': '今週',
    
    // Featured KOL
    'featured.header': 'FEATURED KOL — SCORE RANK #1',
    'featured.updateTime': '週次ランキング更新: 月曜 09:00',
    'featured.subscribers': '登録者',
    'featured.engagement': 'エンゲージ',
    'featured.growth30d': '30日成長',
    'featured.nicheMatch': 'ニッチ適合',
    'featured.latestContent': 'LATEST CONTENT',
    'featured.views': '回視聴',
    
    // Rankings
    'ranking.header': 'WEEKLY TOP RANKING — KOL INTELLIGENCE',
    'ranking.channel': 'チャンネル',
    'ranking.platform': 'PF',
    'ranking.subscribers': '登録者',
    'ranking.score': 'スコア',
    'ranking.engage': 'エンゲージ',
    'ranking.growthRate': '成長率',
    'ranking.status': 'ステータス',
    
    // Charts
    'chart.statusDistribution': 'STATUS DISTRIBUTION',
    'chart.platformCoverage': 'PLATFORM COVERAGE',
    'chart.scoreDistribution': 'SCORE DISTRIBUTION',
    'chart.weeklyGrowth': 'WEEKLY GROWTH',
    
    // Status
    'status.notContacted': '未接触',
    'status.contacted': '連絡済',
    'status.negotiating': '交渉中',
    'status.collaborating': '協業中',
    'status.passed': '見送り',
    
    // Candidates Tab
    'candidates.search': 'チャンネル名で検索...',
    'candidates.all': '全員',
    'candidates.sortByScore': 'スコア順',
    'candidates.sortBySubscribers': '登録者数',
    'candidates.sortByGrowth': '成長率',
    'candidates.sortByRecent': '直近投稿',
    'candidates.allPlatforms': '全て',
    'candidates.tableView': 'テーブル',
    'candidates.cardView': 'カード',
    'candidates.generateDM': 'DM生成',
    'candidates.updateProgress': '進捗更新',
    'candidates.details': '詳細',
    'candidates.lastPost': '最終投稿',
    'candidates.action': 'アクション',
    
    // Drawer
    'drawer.scoreBreakdown': 'スコア内訳',
    'drawer.engagementRate': 'エンゲージメント率',
    'drawer.fanDensity': 'ファン濃度',
    'drawer.monetization': '収益化判定',
    'drawer.monetized': '収益化済',
    'drawer.notMonetized': '未収益',
    'drawer.postFrequency': '投稿頻度',
    'drawer.nicheMatch': 'ニッチ適合度',
    'drawer.latestVideos': '最新動画',
    'drawer.dmTemplate': 'DMテンプレート',
    'drawer.copy': 'コピーする',
    'drawer.edit': '編集する',
    'drawer.markSent': '送信済みにする',
    'drawer.updateStatus': 'ステータスを更新',
    'drawer.notes': 'メモ',
    'drawer.notesPlaceholder': 'メモを追加...',
    
    // Analytics Tab
    'analytics.monthlyApproaches': '今月アプローチ数',
    'analytics.responseRate': '返信率',
    'analytics.conversionRate': '協業転換率',
    'analytics.avgScore': '平均スコア',
    'analytics.vsLastMonth': '先月比',
    'analytics.discovered': '新規発見',
    'analytics.collaborated': '協業成立',
    'analytics.topKeywords': 'トップキーワード',
    'analytics.keyword': 'キーワード',
    'analytics.candidates': '候補者数',
    'analytics.platformPerformance': 'プラットフォーム分析',
    
    // Empty state
    'empty.title': 'まだ候補者がいません',
    'empty.description': '毎週月曜に自動スキャンが実行されます',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.candidates': 'Candidates',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    
    // Header
    'header.week': '2026 W13 — Mar 25-31',
    'header.nextScan': 'Next scan:',
    'header.scanNow': 'Scan Now',
    
    // KPI Cards
    'kpi.totalCandidates': 'Total Candidates',
    'kpi.newThisWeek': 'New This Week',
    'kpi.approached': 'Approached',
    'kpi.collaborating': 'Collaborating',
    'kpi.thisWeek': 'this week',
    
    // Featured KOL
    'featured.header': 'FEATURED KOL — SCORE RANK #1',
    'featured.updateTime': 'Weekly ranking update: Mon 09:00',
    'featured.subscribers': 'subscribers',
    'featured.engagement': 'Engagement',
    'featured.growth30d': '30d Growth',
    'featured.nicheMatch': 'Niche Match',
    'featured.latestContent': 'LATEST CONTENT',
    'featured.views': 'views',
    
    // Rankings
    'ranking.header': 'WEEKLY TOP RANKING — KOL INTELLIGENCE',
    'ranking.channel': 'Channel',
    'ranking.platform': 'PF',
    'ranking.subscribers': 'Subs',
    'ranking.score': 'Score',
    'ranking.engage': 'Engage',
    'ranking.growthRate': 'Growth',
    'ranking.status': 'Status',
    
    // Charts
    'chart.statusDistribution': 'STATUS DISTRIBUTION',
    'chart.platformCoverage': 'PLATFORM COVERAGE',
    'chart.scoreDistribution': 'SCORE DISTRIBUTION',
    'chart.weeklyGrowth': 'WEEKLY GROWTH',
    
    // Status
    'status.notContacted': 'Not Contacted',
    'status.contacted': 'Contacted',
    'status.negotiating': 'Negotiating',
    'status.collaborating': 'Collaborating',
    'status.passed': 'Passed',
    
    // Candidates Tab
    'candidates.search': 'Search channels...',
    'candidates.all': 'All',
    'candidates.sortByScore': 'By Score',
    'candidates.sortBySubscribers': 'By Subs',
    'candidates.sortByGrowth': 'By Growth',
    'candidates.sortByRecent': 'Recent',
    'candidates.allPlatforms': 'All',
    'candidates.tableView': 'Table',
    'candidates.cardView': 'Cards',
    'candidates.generateDM': 'Gen DM',
    'candidates.updateProgress': 'Update',
    'candidates.details': 'Details',
    'candidates.lastPost': 'Last Post',
    'candidates.action': 'Action',
    
    // Drawer
    'drawer.scoreBreakdown': 'Score Breakdown',
    'drawer.engagementRate': 'Engagement Rate',
    'drawer.fanDensity': 'Fan Density',
    'drawer.monetization': 'Monetization',
    'drawer.monetized': 'Monetized',
    'drawer.notMonetized': 'Not Monetized',
    'drawer.postFrequency': 'Post Frequency',
    'drawer.nicheMatch': 'Niche Match',
    'drawer.latestVideos': 'Latest Videos',
    'drawer.dmTemplate': 'DM Template',
    'drawer.copy': 'Copy',
    'drawer.edit': 'Edit',
    'drawer.markSent': 'Mark as Sent',
    'drawer.updateStatus': 'Update Status',
    'drawer.notes': 'Notes',
    'drawer.notesPlaceholder': 'Add notes...',
    
    // Analytics Tab
    'analytics.monthlyApproaches': 'Monthly Approaches',
    'analytics.responseRate': 'Response Rate',
    'analytics.conversionRate': 'Conversion Rate',
    'analytics.avgScore': 'Avg Score',
    'analytics.vsLastMonth': 'vs last month',
    'analytics.discovered': 'Discovered',
    'analytics.collaborated': 'Collaborated',
    'analytics.topKeywords': 'Top Keywords',
    'analytics.keyword': 'Keyword',
    'analytics.candidates': 'Candidates',
    'analytics.platformPerformance': 'Platform Performance',
    
    // Empty state
    'empty.title': 'No candidates yet',
    'empty.description': 'Auto-scan runs every Monday',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja')

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null
    if (stored) {
      setLanguage(stored)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'ja' ? 'en' : 'ja'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

// Export status translations helper
export function getStatusTranslation(status: string, language: Language): string {
  const statusMap: Record<string, Record<Language, string>> = {
    '未接触': { ja: '未接触', en: 'Not Contacted' },
    '連絡済': { ja: '連絡済', en: 'Contacted' },
    '交渉中': { ja: '交渉中', en: 'Negotiating' },
    '協業中': { ja: '協業中', en: 'Collaborating' },
    '見送り': { ja: '見送り', en: 'Passed' },
  }
  return statusMap[status]?.[language] || status
}

// Export status filter options
export function getStatusOptions(language: Language): string[] {
  return language === 'ja' 
    ? ['全員', '未接触', '連絡済', '交渉中', '協業中', '見送り']
    : ['All', 'Not Contacted', 'Contacted', 'Negotiating', 'Collaborating', 'Passed']
}

// Export platform filter options
export function getPlatformOptions(language: Language): string[] {
  return language === 'ja'
    ? ['全て', 'YouTube', 'TikTok', 'Instagram', 'X']
    : ['All', 'YouTube', 'TikTok', 'Instagram', 'X']
}

// Export sort options
export function getSortOptions(language: Language): { value: string; label: string }[] {
  return language === 'ja'
    ? [
        { value: 'score', label: 'スコア順' },
        { value: 'subscribers', label: '登録者数' },
        { value: 'growth', label: '成長率' },
      ]
    : [
        { value: 'score', label: 'By Score' },
        { value: 'subscribers', label: 'By Subs' },
        { value: 'growth', label: 'By Growth' },
      ]
}
