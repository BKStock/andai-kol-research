'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { DashboardTab } from '@/components/dashboard-tab'
import { CandidatesTab } from '@/components/candidates-tab'
import { AnalyticsTab } from '@/components/analytics-tab'
import { Zap, Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { useLanguage } from '@/lib/language-context'

export type TabType = 'dashboard' | 'candidates' | 'analytics'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  
  const isDark = theme === 'dark'
  
  // Theme-aware colors
  const colors = {
    bgPrimary: isDark ? '#040408' : '#F8F9FC',
    bgSecondary: isDark ? '#0C0E14' : '#FFFFFF',
    bgCard: isDark ? '#161923' : '#FFFFFF',
    border: isDark ? 'rgba(99,120,255,0.10)' : 'rgba(99,120,255,0.15)',
    borderAccent: isDark ? 'rgba(99,120,255,0.22)' : 'rgba(99,120,255,0.25)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textSecondary: isDark ? '#C4C8D8' : '#5A6178',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
    accentYellow: isDark ? '#FFB800' : '#E5A700',
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: colors.bgPrimary }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col overflow-hidden" style={{ marginLeft: '60px' }}>
        {/* Scan Banner */}
        <div
          className="flex h-9 flex-shrink-0 items-center justify-between px-5"
          style={{
            background: isDark ? 'rgba(99,120,255,0.05)' : 'rgba(99,120,255,0.08)',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <Zap size={11} style={{ color: colors.accentYellow, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>
              <span style={{ color: colors.textPrimary, fontWeight: 500 }}>{t('header.nextScan')}</span> {language === 'ja' ? '月曜 09:00 JST' : 'Mon 09:00 JST'}
            </span>
            <div className="relative h-1 w-20 overflow-hidden rounded-full" style={{ background: isDark ? 'rgba(99,120,255,0.15)' : 'rgba(99,120,255,0.2)' }}>
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: '76%', background: 'linear-gradient(90deg, #6378FF, #00E5FF)' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.accentBlue, fontFamily: 'var(--font-mono-var)' }}>76%</span>
          </div>
          <button
            className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-all hover:brightness-110 active:scale-95"
            style={{
              background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
              border: `1px solid ${colors.borderAccent}`,
              color: colors.accentBlue,
              fontFamily: 'var(--font-sans-var)',
            }}
          >
            <Zap size={10} />
            {t('header.scanNow')}
          </button>
        </div>

        {/* Top Bar */}
        <div
          className="flex h-14 flex-shrink-0 items-center justify-between px-5"
          style={{
            background: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: colors.textPrimary, fontFamily: 'var(--font-display-var)' }}
            >
              &AI KOL Research
            </span>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider"
              style={{
                background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
                border: `1px solid ${colors.borderAccent}`,
                color: colors.accentBlue,
                fontFamily: 'var(--font-mono-var)',
              }}
            >
              PRO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
              {t('header.week')}
            </span>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-all hover:brightness-110"
              style={{
                background: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
              }}
              title={language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
            >
              <Globe size={12} />
              <span style={{ fontFamily: 'var(--font-mono-var)' }}>{language.toUpperCase()}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-7 w-7 items-center justify-center rounded transition-all hover:brightness-110"
              style={{
                background: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
              }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: isDark ? 'rgba(99,120,255,0.18)' : 'rgba(99,120,255,0.2)', color: colors.accentBlue, border: `1px solid ${colors.borderAccent}` }}
            >
              BK
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto" style={{ background: colors.bgPrimary }}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'candidates' && <CandidatesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>
    </div>
  )
}
