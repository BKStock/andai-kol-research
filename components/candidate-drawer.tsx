'use client'

import { useState } from 'react'
import { Copy, Check, X, Eye, Zap } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  type Candidate, type CandidateStatus,
  formatSubscribers, getPlatformIcon, generateDMTemplate,
} from '@/lib/data'
import { useTheme } from '@/lib/theme-context'
import { useLanguage, getStatusTranslation } from '@/lib/language-context'

interface CandidateDrawerProps {
  candidate: Candidate | null
  onClose: () => void
}

const statusOptions: CandidateStatus[] = ['未接触', '連絡済', '交渉中', '協業中', '見送り']

const scoreColor = (s: number) => s >= 90 ? '#00FF8C' : s >= 70 ? '#6378FF' : '#FFB800'

export function CandidateDrawer({ candidate, onClose }: CandidateDrawerProps) {
  const { theme } = useTheme()
  const { t, language } = useLanguage()
  const isDark = theme === 'dark'
  
  const colors = {
    bgPrimary: isDark ? '#040408' : '#F8F9FC',
    bgSecondary: isDark ? '#0C0E14' : '#FFFFFF',
    bgCard: isDark ? '#161923' : '#F8F9FC',
    border: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)',
    borderLight: isDark ? 'rgba(99,120,255,0.08)' : 'rgba(99,120,255,0.1)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
    accentYellow: isDark ? '#FFB800' : '#E5A700',
    accentRed: isDark ? '#FF3D6E' : '#E5365F',
  }
  
  const statusFg = (st: CandidateStatus) => {
    const m: Record<CandidateStatus, string> = {
      '未接触': colors.textMuted,
      '連絡済': colors.accentCyan,
      '交渉中': colors.accentYellow,
      '協業中': colors.accentGreen,
      '見送り': colors.accentRed,
    }
    return m[st]
  }

  const [copied, setCopied] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<CandidateStatus | null>(null)

  if (!candidate) return null

  const dmTemplate = generateDMTemplate(candidate)
  const sc = scoreColor(candidate.score)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dmTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function ProgressBar({ value, color, label, sub }: { value: number; color: string; label: string; sub: string }) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{label}</span>
          <span style={{ color, fontFamily: 'var(--font-mono-var)', fontWeight: 600 }}>{sub}</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)' }}>
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
            style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Sheet open={!!candidate} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="w-[420px] overflow-y-auto p-0 border-l"
        style={{
          background: colors.bgSecondary,
          borderColor: colors.border,
          maxWidth: '420px',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-start gap-3 p-4 border-b"
          style={{ background: colors.bgSecondary, borderColor: colors.border }}
        >
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-xl font-bold"
            style={{
              background: `${sc}18`,
              border: `1px solid ${sc}30`,
              color: sc,
              fontFamily: 'var(--font-display-var)',
            }}
          >
            {candidate.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold" style={{ color: colors.textPrimary, fontFamily: 'var(--font-display-var)' }}>
              {candidate.name}
            </h2>
            <p className="text-xs" style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>
              {getPlatformIcon(candidate.platform)} {candidate.platform} • {formatSubscribers(candidate.subscribers)} {t('featured.subscribers')}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="rounded px-2 py-0.5 text-[11px] font-bold"
                style={{
                  background: `${sc}18`, color: sc, border: `1px solid ${sc}30`,
                  fontFamily: 'var(--font-mono-var)',
                }}
              >
                SCORE {candidate.score}
              </span>
              <span
                className="rounded px-2 py-0.5 text-[10px]"
                style={{
                  background: `${statusFg(candidate.status)}12`,
                  color: statusFg(candidate.status),
                  fontFamily: 'var(--font-sans-var)',
                }}
              >
                {getStatusTranslation(currentStatus || candidate.status, language)}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: colors.textMuted }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 p-4">
          {/* Score Breakdown */}
          <section>
            <p className="mb-3 text-[10px] font-medium tracking-widest" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
              {t('drawer.scoreBreakdown').toUpperCase()}
            </p>
            <div className="space-y-3">
              <ProgressBar value={Math.min(candidate.engagementRate * 5, 100)} color={colors.accentCyan} label={t('drawer.engagementRate')} sub={`${candidate.engagementRate}%`} />
              <ProgressBar value={candidate.fanDensity * 10} color={colors.accentBlue} label={t('drawer.fanDensity')} sub={`${candidate.fanDensity}/10`} />
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{t('drawer.monetization')}</span>
                <span style={{ color: candidate.monetized ? colors.accentRed : colors.accentGreen, fontFamily: 'var(--font-mono-var)' }}>
                  {candidate.monetized ? t('drawer.monetized') : `${t('drawer.notMonetized')} ✓`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: colors.textMuted, fontFamily: 'var(--font-sans-var)' }}>{t('drawer.postFrequency')}</span>
                <span style={{ color: colors.accentGreen, fontFamily: 'var(--font-mono-var)' }}>{candidate.postFrequency} ✓</span>
              </div>
              <ProgressBar value={candidate.nicheMatch} color={colors.accentYellow} label={t('drawer.nicheMatch')} sub={`${candidate.nicheMatch}%`} />
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: colors.borderLight }} />

          {/* Latest Content */}
          <section>
            <p className="mb-3 text-[10px] font-medium tracking-widest" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
              {t('drawer.latestVideos').toUpperCase()}
            </p>
            <div className="space-y-2">
              {candidate.latestVideos.map((v, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded p-2.5"
                  style={{ background: colors.bgCard, border: `1px solid ${colors.borderLight}` }}
                >
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold mt-0.5"
                    style={{ background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)', color: colors.accentBlue, fontFamily: 'var(--font-mono-var)' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: colors.textPrimary, fontFamily: 'var(--font-sans-var)' }}>{v.title}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Eye size={9} style={{ color: colors.textMuted }} />
                      <span className="text-[10px]" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
                        {v.views.toLocaleString()} {t('featured.views')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: colors.borderLight }} />

          {/* DM Template */}
          <section>
            <p className="mb-3 text-[10px] font-medium tracking-widest" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
              {t('drawer.dmTemplate').toUpperCase()}
            </p>
            <div
              className="rounded p-3"
              style={{ background: colors.bgPrimary, border: `1px solid ${colors.border}` }}
            >
              <pre
                className="whitespace-pre-wrap text-xs leading-relaxed"
                style={{ color: colors.textPrimary, fontFamily: 'var(--font-mono-var)' }}
              >
                {dmTemplate}
              </pre>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded py-2 text-xs font-medium transition-all"
                style={{
                  background: copied ? (isDark ? 'rgba(0,255,140,0.12)' : 'rgba(0,204,122,0.1)') : (isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)'),
                  border: `1px solid ${copied ? (isDark ? 'rgba(0,255,140,0.3)' : 'rgba(0,204,122,0.25)') : (isDark ? 'rgba(99,120,255,0.25)' : 'rgba(99,120,255,0.2)')}`,
                  color: copied ? colors.accentGreen : colors.accentBlue,
                  fontFamily: 'var(--font-sans-var)',
                }}
              >
                {copied ? <><Check size={12} /> {t('drawer.copy')}</> : <><Copy size={12} /> {t('drawer.copy')}</>}
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded py-2 text-xs font-medium"
                style={{
                  background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)',
                  border: `1px solid ${isDark ? 'rgba(99,120,255,0.25)' : 'rgba(99,120,255,0.2)'}`,
                  color: colors.accentBlue,
                  fontFamily: 'var(--font-sans-var)',
                }}
              >
                <Zap size={12} /> {t('drawer.markSent')}
              </button>
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: colors.borderLight }} />

          {/* Status Update */}
          <section>
            <p className="mb-3 text-[10px] font-medium tracking-widest" style={{ color: colors.textMuted, fontFamily: 'var(--font-mono-var)' }}>
              {t('drawer.updateStatus').toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {statusOptions.map((st) => {
                const active = (currentStatus || candidate.status) === st
                const fg = statusFg(st)
                return (
                  <button
                    key={st}
                    onClick={() => setCurrentStatus(st)}
                    className="rounded px-2.5 py-1.5 text-xs font-medium transition-all"
                    style={{
                      background: active ? `${fg}18` : 'transparent',
                      border: `1px solid ${active ? `${fg}50` : colors.border}`,
                      color: active ? fg : colors.textMuted,
                      fontFamily: 'var(--font-sans-var)',
                    }}
                  >
                    {getStatusTranslation(st, language)}
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
