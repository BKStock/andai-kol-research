'use client'

import { Users, UserPlus, MessageCircle, Handshake, TrendingUp, Play, ChevronRight } from 'lucide-react'
import {
  candidates, statusDistribution, platformCoverage,
  formatSubscribers, getPlatformIcon,
} from '@/lib/data'
import { StatusPieChart } from '@/components/status-pie-chart'
import { PlatformBarChart } from '@/components/platform-bar-chart'
import { useTheme } from '@/lib/theme-context'
import { useLanguage, getStatusTranslation } from '@/lib/language-context'

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 72, h = 24
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`
  const id = `sp-${color.replace('#', '')}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="flex-shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${id})`} />
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ScoreRing({ score, size = 88 }: { score: number; size?: number }) {
  const r = size * 0.36, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 90 ? '#00FF8C' : score >= 70 ? '#6378FF' : '#FFB800'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(99,120,255,0.1)" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 5px ${color}80)` }} />
    </svg>
  )
}

const scoreColor = (s: number) => s >= 90 ? '#00FF8C' : s >= 70 ? '#6378FF' : '#FFB800'

export function DashboardTab() {
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const isDark = theme === 'dark'
  
  const colors = {
    bgPrimary: isDark ? '#040408' : '#F8F9FC',
    bgCard: isDark ? '#161923' : '#FFFFFF',
    bgCardDarker: isDark ? 'rgba(4,4,8,0.6)' : 'rgba(99,120,255,0.03)',
    border: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
    borderAccent: isDark ? 'rgba(99,120,255,0.22)' : 'rgba(99,120,255,0.25)',
    borderLight: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
    accentYellow: isDark ? '#FFB800' : '#E5A700',
  }
  
  const kpiData = [
    { labelKey: 'kpi.totalCandidates', value: '847', change: '+23', sparkData: [820, 825, 831, 836, 838, 841, 845, 847], color: colors.accentBlue, icon: Users },
    { labelKey: 'kpi.newThisWeek', value: '23', change: '+8', sparkData: [8, 12, 9, 15, 11, 18, 20, 23], color: colors.accentCyan, icon: UserPlus },
    { labelKey: 'kpi.approached', value: '124', change: '+12', sparkData: [98, 104, 108, 110, 114, 118, 121, 124], color: colors.accentGreen, icon: MessageCircle },
    { labelKey: 'kpi.collaborating', value: '22', change: '+3', sparkData: [15, 16, 17, 18, 19, 20, 21, 22], color: colors.accentYellow, icon: Handshake },
  ]

  const CARD = { background: colors.bgCard, border: `1px solid ${colors.border}` }
  const SECTION_HEADER: React.CSSProperties = { color: colors.textMuted, fontFamily: 'var(--font-mono-var)', fontSize: '10px', letterSpacing: '0.08em' }
  const featured = candidates[0]

  return (
    <div className="min-h-full p-5" style={{ background: colors.bgPrimary }}>
      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiData.map((kpi, i) => (
          <div key={kpi.labelKey} className={`animate-fade-up stagger-${i} rounded-lg p-4`} style={CARD}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="mb-1 text-xs truncate" style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{t(kpi.labelKey)}</p>
                <p className="text-3xl font-bold leading-none" style={{ color: colors.textPrimary, fontFamily: 'var(--font-mono-var)' }}>{kpi.value}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <TrendingUp size={9} style={{ color: kpi.color }} />
                  <span className="text-[11px] font-medium" style={{ color: kpi.color, fontFamily: 'var(--font-mono-var)' }}>{kpi.change}</span>
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>{t('kpi.thisWeek')}</span>
                </div>
              </div>
              <Sparkline data={kpi.sparkData} color={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Featured KOL */}
      <div className="animate-fade-up stagger-4 mb-5 overflow-hidden rounded-lg" style={{ background: colors.bgCard, border: `1px solid ${colors.borderAccent}`, boxShadow: isDark ? '0 0 40px -12px rgba(99,120,255,0.25)' : '0 4px 20px -8px rgba(99,120,255,0.15)' }}>
        <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: colors.borderLight }}>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: colors.accentGreen }} />
            <span style={SECTION_HEADER}>{t('featured.header')}</span>
          </div>
          <span style={SECTION_HEADER}>{t('featured.updateTime')}</span>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-1 items-start gap-4 p-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg text-xl font-bold" style={{ background: isDark ? 'linear-gradient(135deg, rgba(99,120,255,0.2), rgba(0,229,255,0.08))' : 'linear-gradient(135deg, rgba(99,120,255,0.15), rgba(0,229,255,0.06))', border: `1px solid ${colors.borderAccent}`, color: colors.accentBlue, fontFamily: 'var(--font-display-var)' }}>{featured.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary, fontFamily: 'var(--font-display-var)' }}>{featured.name}</h3>
                <span className="text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{getPlatformIcon(featured.platform)} {featured.platform}</span>
                <span className="text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>{formatSubscribers(featured.subscribers)} {t('featured.subscribers')}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[{ labelKey: 'featured.engagement', value: `${featured.engagement}%`, color: colors.accentCyan }, { labelKey: 'featured.growth30d', value: `+${featured.growth}%`, color: colors.accentGreen }, { labelKey: 'featured.nicheMatch', value: `${featured.nicheMatch}%`, color: colors.accentYellow }].map(({ labelKey, value, color }) => (
                  <div key={labelKey} className="rounded p-2" style={{ background: colors.bgCardDarker, border: `1px solid ${colors.borderLight}` }}>
                    <p className="text-[10px]" style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{t(labelKey)}</p>
                    <p className="mt-0.5 text-sm font-bold" style={{ color, fontFamily: 'var(--font-mono-var)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 px-8 py-5" style={{ borderLeft: `1px solid ${colors.borderLight}` }}>
            <div className="relative flex items-center justify-center">
              <ScoreRing score={featured.score} size={88} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold leading-none" style={{ color: colors.textPrimary, fontFamily: 'var(--font-mono-var)' }}>{featured.score}</span>
                <span className="text-[9px] mt-0.5" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>SCORE</span>
              </div>
            </div>
            <span className="rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: isDark ? 'rgba(0,255,140,0.1)' : 'rgba(0,204,122,0.1)', border: `1px solid ${isDark ? 'rgba(0,255,140,0.2)' : 'rgba(0,204,122,0.25)'}`, color: colors.accentGreen, fontFamily: 'var(--font-sans-var)' }}>{getStatusTranslation(featured.status, language)}</span>
          </div>
        </div>
        <div className="border-t px-5 py-3" style={{ borderColor: colors.borderLight }}>
          <p className="mb-2" style={SECTION_HEADER}>{t('featured.latestContent')}</p>
          <div className="space-y-1.5">
            {featured.latestVideos.map((v, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Play size={9} style={{ color: colors.accentBlue, flexShrink: 0 }} />
                  <span className="truncate text-xs" style={{ color: colors.textPrimary, fontFamily: 'var(--font-sans-var)' }}>{v.title}</span>
                </div>
                <span className="flex-shrink-0 text-[11px]" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>{v.views.toLocaleString()} {t('featured.views')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ranking + Charts */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="animate-fade-up overflow-hidden rounded-lg" style={{ ...CARD, animationDelay: '0.25s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: colors.borderLight }}>
            <span style={SECTION_HEADER}>{t('ranking.header')}</span>
            <ChevronRight size={12} style={{ color: colors.accentBlue }} />
          </div>
          <div className="overflow-x-auto">
            <table className="bloomberg-table w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  {['#', t('ranking.channel'), t('ranking.platform'), t('ranking.subscribers'), t('ranking.score'), t('ranking.engage'), t('ranking.growthRate'), t('ranking.status')].map((h, hi) => (
                    <th key={h} className="px-3 py-2 text-left" style={{ ...SECTION_HEADER, textAlign: hi >= 3 && hi <= 5 ? 'right' : 'left', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={c.id} className="transition-colors">
                    <td className="px-3 py-2.5 text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>{i + 1}</td>
                    <td className="px-3 py-2.5"><span className="text-sm font-medium" style={{ color: colors.textPrimary, fontFamily: 'var(--font-sans-var)' }}>{c.name}</span></td>
                    <td className="px-3 py-2.5 text-sm" style={{ color: colors.textMuted }}>{getPlatformIcon(c.platform)}</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: colors.textPrimary, fontFamily: 'var(--font-mono-var)' }}>{formatSubscribers(c.subscribers)}</td>
                    <td className="px-3 py-2.5 text-right"><span className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: `${scoreColor(c.score)}18`, color: scoreColor(c.score), fontFamily: 'var(--font-mono-var)' }}>{c.score}</span></td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: colors.accentCyan, fontFamily: 'var(--font-mono-var)' }}>{c.engagement}%</td>
                    <td className="px-3 py-2.5 text-right text-xs" style={{ color: colors.accentGreen, fontFamily: 'var(--font-mono-var)' }}>+{c.growth}%</td>
                    <td className="px-3 py-2.5"><span className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: c.status === '協業中' ? (isDark ? 'rgba(0,255,140,0.1)' : 'rgba(0,204,122,0.1)') : c.status === '交渉中' ? (isDark ? 'rgba(255,184,0,0.1)' : 'rgba(229,167,0,0.1)') : c.status === '連絡済' ? (isDark ? 'rgba(0,229,255,0.1)' : 'rgba(0,196,229,0.1)') : (isDark ? 'rgba(136,146,176,0.1)' : 'rgba(136,146,176,0.08)'), color: c.status === '協業中' ? colors.accentGreen : c.status === '交渉中' ? colors.accentYellow : c.status === '連絡済' ? colors.accentCyan : colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{getStatusTranslation(c.status, language)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="animate-fade-up rounded-lg p-4" style={{ ...CARD, animationDelay: '0.30s', animationFillMode: 'both' }}>
            <p className="mb-3" style={SECTION_HEADER}>{t('chart.statusDistribution')}</p>
            <StatusPieChart data={statusDistribution} />
          </div>
          <div className="animate-fade-up rounded-lg p-4" style={{ ...CARD, animationDelay: '0.35s', animationFillMode: 'both' }}>
            <p className="mb-3" style={SECTION_HEADER}>{t('chart.platformCoverage')}</p>
            <PlatformBarChart data={platformCoverage} />
          </div>
        </div>
      </div>
    </div>
  )
}
