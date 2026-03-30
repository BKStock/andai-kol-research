'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  candidates, formatSubscribers, getPlatformIcon,
  type CandidateStatus, type Platform, type Candidate,
} from '@/lib/data'
import { CandidateDrawer } from '@/components/candidate-drawer'
import { useTheme } from '@/lib/theme-context'
import { useLanguage, getStatusTranslation, getStatusOptions, getPlatformOptions, getSortOptions } from '@/lib/language-context'

const statusFilters: (CandidateStatus | '全員')[] = ['全員', '未接触', '連絡済', '交渉中', '協業中', '見送り']
const platformFilters: (Platform | '全て')[] = ['全て', 'YouTube', 'TikTok', 'Instagram', 'X']

const scoreColor = (s: number) => s >= 90 ? '#00FF8C' : s >= 70 ? '#6378FF' : '#FFB800'

const statusBg = (st: CandidateStatus, isDark: boolean) => {
  const m: Record<CandidateStatus, string> = {
    '未接触': isDark ? 'rgba(136,146,176,0.10)' : 'rgba(136,146,176,0.08)',
    '連絡済': isDark ? 'rgba(0,229,255,0.10)' : 'rgba(0,196,229,0.08)',
    '交渉中': isDark ? 'rgba(255,184,0,0.10)' : 'rgba(229,167,0,0.08)',
    '協業中': isDark ? 'rgba(0,255,140,0.10)' : 'rgba(0,204,122,0.08)',
    '見送り': isDark ? 'rgba(255,61,110,0.10)' : 'rgba(229,55,99,0.08)',
  }
  return m[st]
}
const statusFg = (st: CandidateStatus, isDark: boolean) => {
  const m: Record<CandidateStatus, string> = {
    '未接触': '#8892B0',
    '連絡済': isDark ? '#00E5FF' : '#00C4E5',
    '交渉中': isDark ? '#FFB800' : '#E5A700',
    '協業中': isDark ? '#00FF8C' : '#00CC7A',
    '見送り': isDark ? '#FF3D6E' : '#E53763',
  }
  return m[st]
}

export function CandidatesTab() {
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const isDark = theme === 'dark'
  
  const colors = {
    bgPrimary: isDark ? '#040408' : '#F8F9FC',
    bgCard: isDark ? '#161923' : '#FFFFFF',
    border: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
    borderAccent: isDark ? 'rgba(99,120,255,0.15)' : 'rgba(99,120,255,0.2)',
    borderLight: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
  }

  const CARD_STYLE = { background: colors.bgCard, border: `1px solid ${colors.border}` }
  const MONO = { fontFamily: 'var(--font-mono-var)' }
  const SANS = { fontFamily: 'var(--font-sans-var)' }

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | '全員'>('全員')
  const [platformFilter, setPlatformFilter] = useState<Platform | '全て'>('全て')
  const [sortBy, setSortBy] = useState('score')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const sortOptions = getSortOptions(language)
  const statusOptionsTranslated = getStatusOptions(language)
  const platformOptionsTranslated = getPlatformOptions(language)

  const filtered = candidates
    .filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== '全員' && c.status !== statusFilter) return false
      if (platformFilter !== '全て' && c.platform !== platformFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'subscribers') return b.subscribers - a.subscribers
      if (sortBy === 'growth') return b.growth - a.growth
      return 0
    })

  return (
    <div className="min-h-full" style={{ background: colors.bgPrimary }}>
      {/* Sticky Power Filter Bar */}
      <div
        className="sticky top-0 z-40 px-5 pt-4 pb-3 space-y-3"
        style={{ background: colors.bgPrimary, borderBottom: `1px solid ${colors.borderLight}` }}
      >
        {/* Row 1: search + sort + view */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
            <input
              type="text"
              placeholder={t('candidates.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded pl-9 pr-3 py-2 text-sm outline-none transition-colors focus:ring-1"
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.borderAccent}`,
                color: colors.textPrimary,
                ...SANS,
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} style={{ color: colors.textMuted }} />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                className="h-8 w-[120px] border text-xs"
                style={{ background: colors.bgCard, borderColor: colors.borderAccent, color: colors.textPrimary, ...SANS }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: colors.bgCard, border: `1px solid ${colors.borderAccent}` }}>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} style={{ color: colors.textPrimary, ...SANS }}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* View toggle */}
          <div className="flex rounded overflow-hidden" style={{ border: `1px solid ${colors.borderAccent}` }}>
            {(['table', 'cards'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="flex h-8 w-8 items-center justify-center transition-colors"
                style={{
                  background: viewMode === mode ? 'rgba(99,120,255,0.18)' : 'transparent',
                  color: viewMode === mode ? colors.accentBlue : colors.textMuted,
                }}
              >
                {mode === 'table' ? <LayoutList size={14} /> : <LayoutGrid size={14} />}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs" style={{ color: colors.textMuted, ...MONO }}>
            {filtered.length} KOL
          </span>
        </div>

        {/* Row 2: status chips */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((st, i) => {
            const active = statusFilter === st
            const fg = st === '全員' ? colors.accentBlue : statusFg(st as CandidateStatus, isDark)
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className="rounded px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  background: active ? (st === '全員' ? 'rgba(99,120,255,0.18)' : `${statusBg(st as CandidateStatus, isDark)}`) : 'transparent',
                  border: `1px solid ${active ? fg : colors.border}`,
                  color: active ? fg : colors.textMuted,
                  ...SANS,
                }}
              >
                {statusOptionsTranslated[i]}
              </button>
            )
          })}
        </div>

        {/* Row 3: platform chips */}
        <div className="flex flex-wrap gap-1.5">
          {platformFilters.map((pf, i) => {
            const active = platformFilter === pf
            return (
              <button
                key={pf}
                onClick={() => setPlatformFilter(pf)}
                className="flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  background: active ? 'rgba(0,229,255,0.10)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(0,229,255,0.3)' : colors.border}`,
                  color: active ? colors.accentCyan : colors.textMuted,
                  ...SANS,
                }}
              >
                {pf !== '全て' && <span>{getPlatformIcon(pf)}</span>}
                {platformOptionsTranslated[i]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: colors.textMuted }}>
            <Search size={40} className="mb-4 opacity-30" />
            <p className="text-sm" style={SANS}>{t('candidates.noResults')}</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <div
                key={c.id}
                className={`animate-fade-up cursor-pointer rounded-lg p-4 transition-all hover:-translate-y-0.5`}
                style={{
                  ...CARD_STYLE,
                  animationDelay: `${i * 0.04}s`,
                  animationFillMode: 'both',
                  boxShadow: 'none',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setSelectedCandidate(c)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,120,255,0.35)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = isDark ? '0 4px 20px rgba(99,120,255,0.12)' : '0 4px 20px rgba(99,120,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = colors.border
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded text-base font-bold"
                      style={{
                        background: `${scoreColor(c.score)}18`,
                        color: scoreColor(c.score),
                        fontFamily: 'var(--font-display-var)',
                      }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: colors.textPrimary, ...SANS }}>{c.name}</p>
                      <p className="text-[11px]" style={{ color: colors.textMuted, ...SANS }}>
                        {getPlatformIcon(c.platform)} {formatSubscribers(c.subscribers)} {t('candidates.subscribers')}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-bold"
                    style={{
                      background: `${scoreColor(c.score)}18`,
                      color: scoreColor(c.score),
                      ...MONO,
                    }}
                  >
                    {c.score}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <div className="flex-1 rounded p-2" style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.1)' }}>
                    <p className="text-[9px]" style={{ color: colors.textMuted }}>{t('candidates.engage')}</p>
                    <p className="text-xs font-bold" style={{ color: colors.accentCyan, ...MONO }}>{c.engagement}%</p>
                  </div>
                  <div className="flex-1 rounded p-2" style={{ background: 'rgba(0,255,140,0.06)', border: '1px solid rgba(0,255,140,0.1)' }}>
                    <p className="text-[9px]" style={{ color: colors.textMuted }}>{t('candidates.growthRate')}</p>
                    <p className="text-xs font-bold" style={{ color: colors.accentGreen, ...MONO }}>+{c.growth}%</p>
                  </div>
                  <div className="flex-1 rounded p-2" style={{ background: 'rgba(99,120,255,0.06)', border: '1px solid rgba(99,120,255,0.1)' }}>
                    <p className="text-[9px]" style={{ color: colors.textMuted }}>{t('candidates.nicheMatch')}</p>
                    <p className="text-xs font-bold" style={{ color: colors.accentBlue, ...MONO }}>{c.nicheMatch}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: statusBg(c.status, isDark),
                      color: statusFg(c.status, isDark),
                      border: `1px solid ${statusFg(c.status, isDark)}30`,
                      ...SANS,
                    }}
                  >
                    {getStatusTranslation(c.status, language)}
                  </span>
                  <span className="text-[11px]" style={{ color: colors.textMuted, ...MONO }}>{c.lastPost}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table view */
          <div className="overflow-hidden rounded-lg" style={CARD_STYLE}>
            <div className="overflow-x-auto">
              <table className="bloomberg-table w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                    {['#', t('ranking.channel'), t('ranking.platform'), t('ranking.subscribers'), t('ranking.score'), t('ranking.engage'), t('ranking.growthRate'), t('candidates.lastPost'), t('ranking.status'), ''].map((h, hi) => (
                      <th
                        key={`${h}-${hi}`}
                        className="px-3 py-2.5 text-left"
                        style={{
                          color: colors.textMuted,
                          fontFamily: 'var(--font-mono-var)',
                          fontSize: '10px',
                          letterSpacing: '0.06em',
                          fontWeight: 500,
                          textAlign: hi >= 3 && hi <= 6 ? 'right' : 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer transition-colors"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <td className="px-3 py-3" style={{ color: colors.textMuted, ...MONO }}>{i + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold flex-shrink-0"
                            style={{ background: `${scoreColor(c.score)}18`, color: scoreColor(c.score), fontFamily: 'var(--font-display-var)' }}
                          >
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-medium" style={{ color: colors.textPrimary, ...SANS }}>{c.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3" style={{ color: colors.textMuted }}>{getPlatformIcon(c.platform)}</td>
                      <td className="px-3 py-3 text-right" style={{ color: colors.textPrimary, ...MONO }}>{formatSubscribers(c.subscribers)}</td>
                      <td className="px-3 py-3 text-right">
                        <span className="rounded px-1.5 py-0.5 font-bold" style={{ background: `${scoreColor(c.score)}18`, color: scoreColor(c.score), ...MONO }}>
                          {c.score}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right" style={{ color: colors.accentCyan, ...MONO }}>{c.engagement}%</td>
                      <td className="px-3 py-3 text-right" style={{ color: colors.accentGreen, ...MONO }}>+{c.growth}%</td>
                      <td className="px-3 py-3" style={{ color: colors.textMuted, ...SANS }}>{c.lastPost}</td>
                      <td className="px-3 py-3">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px]"
                          style={{
                            background: statusBg(c.status, isDark),
                            color: statusFg(c.status, isDark),
                            ...SANS,
                          }}
                        >
                          {getStatusTranslation(c.status, language)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          className="rounded px-2 py-1 text-[10px] font-medium transition-all"
                          style={{
                            background: 'rgba(99,120,255,0.10)',
                            border: '1px solid rgba(99,120,255,0.2)',
                            color: colors.accentBlue,
                            ...SANS,
                          }}
                          onClick={(e) => { e.stopPropagation(); setSelectedCandidate(c) }}
                        >
                          {c.status === '未接触' ? t('candidates.generateDM') : t('candidates.details')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <CandidateDrawer candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  )
}
