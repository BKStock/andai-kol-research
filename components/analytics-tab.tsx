'use client'

import { MessageCircle, Percent, Target, Users, TrendingUp } from 'lucide-react'
import {
  weeklyDiscovery, scoreDistribution, topKeywords, platformPerformance,
} from '@/lib/data'
import { ScoreHistogram } from '@/components/score-histogram'
import { GrowthLineChart } from '@/components/growth-line-chart'
import { PlatformRadarChart } from '@/components/platform-radar-chart'
import { useTheme } from '@/lib/theme-context'
import { useLanguage } from '@/lib/language-context'

// Sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80
  const h = 28
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`
  const id = `asl-${color.replace('#', '')}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="flex-shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${id})`} />
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function AnalyticsTab() {
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const isDark = theme === 'dark'
  
  const colors = {
    bgPrimary: isDark ? '#040408' : '#F8F9FC',
    bgCard: isDark ? '#161923' : '#FFFFFF',
    border: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
    borderLight: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
    accentYellow: isDark ? '#FFB800' : '#E5A700',
  }

  const kpiCards = [
    {
      labelKey: 'analytics.monthlyApproach', value: '47', change: '+12', changeLabelKey: 'analytics.vsLastMonth',
      positive: true, color: colors.accentBlue, icon: MessageCircle,
      sparkData: [28, 32, 35, 31, 38, 40, 43, 44, 42, 45, 46, 47],
    },
    {
      labelKey: 'analytics.responseRate', value: '23.4%', change: '+3.2%', changeLabelKey: '',
      positive: true, color: colors.accentCyan, icon: Percent,
      sparkData: [18, 19, 20, 19, 21, 22, 21, 22, 23, 23, 23, 23.4],
    },
    {
      labelKey: 'analytics.conversionRate', value: '8.5%', change: '+1.1%', changeLabelKey: '',
      positive: true, color: colors.accentGreen, icon: Target,
      sparkData: [6, 6.5, 7, 7, 7.5, 7.5, 8, 8, 8, 8.5, 8.5, 8.5],
    },
    {
      labelKey: 'analytics.avgScore', value: '76.3', change: '+2.1', changeLabelKey: '',
      positive: true, color: colors.accentYellow, icon: Users,
      sparkData: [72, 73, 73, 74, 74, 75, 75, 75, 76, 76, 76, 76.3],
    },
  ]

  const CARD = { background: colors.bgCard, border: `1px solid ${colors.border}` }
  const MONO = { fontFamily: 'var(--font-mono-var)' }
  const SANS = { fontFamily: 'var(--font-sans-var)' }
  const SECTION_HDR: React.CSSProperties = { color: colors.textMuted, fontFamily: 'var(--font-mono-var)', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 500 }

  return (
    <div className="min-h-full p-5" style={{ background: colors.bgPrimary }}>

      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.labelKey}
              className={`animate-fade-up stagger-${i} rounded-lg p-4`}
              style={CARD}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="mb-2 flex h-7 w-7 items-center justify-center rounded"
                    style={{ background: `${kpi.color}18` }}
                  >
                    <Icon size={14} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-[11px] truncate" style={{ color: colors.textMuted, ...SANS }}>{t(kpi.labelKey)}</p>
                  <p className="mt-0.5 text-2xl font-bold leading-none" style={{ color: colors.textPrimary, ...MONO }}>
                    {kpi.value}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp size={9} style={{ color: kpi.color }} />
                    <span className="text-[10px] font-medium" style={{ color: kpi.color, ...MONO }}>{kpi.change}</span>
                    {kpi.changeLabelKey && <span className="text-[10px]" style={{ color: colors.textMuted, ...SANS }}>{t(kpi.changeLabelKey)}</span>}
                  </div>
                </div>
                <Sparkline data={kpi.sparkData} color={kpi.color} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row 1 */}
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        {/* Score Histogram */}
        <div
          className="animate-fade-up rounded-lg overflow-hidden"
          style={{ ...CARD, animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          <div className="border-b px-4 py-2.5" style={{ borderColor: colors.borderLight }}>
            <p style={SECTION_HDR}>{t('analytics.scoreDistribution')}</p>
          </div>
          <div className="p-4">
            <ScoreHistogram data={scoreDistribution} />
          </div>
        </div>

        {/* Growth Line Chart */}
        <div
          className="animate-fade-up rounded-lg overflow-hidden"
          style={{ ...CARD, animationDelay: '0.25s', animationFillMode: 'both' }}
        >
          <div className="border-b px-4 py-2.5" style={{ borderColor: colors.borderLight }}>
            <p style={SECTION_HDR}>{t('analytics.weeklyTrend')}</p>
          </div>
          <div className="p-4">
            <GrowthLineChart data={weeklyDiscovery} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top Keywords Table */}
        <div
          className="animate-fade-up rounded-lg overflow-hidden"
          style={{ ...CARD, animationDelay: '0.30s', animationFillMode: 'both' }}
        >
          <div className="border-b px-4 py-2.5" style={{ borderColor: colors.borderLight }}>
            <p style={SECTION_HDR}>{t('analytics.topKeywords')}</p>
          </div>
          <table className="bloomberg-table w-full text-xs">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                {[t('analytics.keyword'), t('analytics.candidateCount'), t('analytics.avgScoreLabel'), t('analytics.trend')].map((h, hi) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left"
                    style={{
                      ...SECTION_HDR,
                      textAlign: hi >= 1 ? 'right' : 'left',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((kw) => {
                const barColor = kw.avgScore >= 80 ? colors.accentGreen : kw.avgScore >= 70 ? colors.accentBlue : colors.accentYellow
                return (
                  <tr key={kw.keyword}>
                    <td className="px-4 py-3">
                      <span className="font-medium" style={{ color: colors.textPrimary, ...SANS }}>
                        {kw.keyword}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: colors.textPrimary, ...MONO }}>
                      {kw.candidates}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: barColor, ...MONO, fontWeight: 600 }}>
                      {kw.avgScore}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Mini bar */}
                      <div className="inline-flex items-center justify-end gap-1">
                        <div className="h-1 w-16 overflow-hidden rounded-full" style={{ background: colors.borderLight }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(kw.avgScore / 100) * 100}%`, background: barColor }}
                          />
                        </div>
                        <TrendingUp size={10} style={{ color: barColor }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Platform Radar */}
        <div
          className="animate-fade-up rounded-lg overflow-hidden"
          style={{ ...CARD, animationDelay: '0.35s', animationFillMode: 'both' }}
        >
          <div className="border-b px-4 py-2.5" style={{ borderColor: colors.borderLight }}>
            <p style={SECTION_HDR}>{t('analytics.platformPerformance')}</p>
          </div>
          <div className="p-4">
            <PlatformRadarChart data={platformPerformance} />
          </div>
        </div>
      </div>
    </div>
  )
}
