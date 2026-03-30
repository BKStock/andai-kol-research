'use client'

import { useState, KeyboardEvent } from 'react'
import { Zap, Plus, X, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/lib/theme-context'

type LangFilter = 'ja' | 'ja-en' | 'all'
type DmTone = 'friendly' | 'business' | 'casual'
type DmLang = 'match' | 'ja' | 'en'

interface Preset {
  id: string
  name: string
  keywords: string[]
  followerRange: [number, number]
  language: LangFilter
  genres: string[]
  engagement: number
}

const ALL_GENRES = ['仮想通貨', '投資全般', 'NISA', 'FX', 'AI/テック', '起業/副業']

const PRESETS: Preset[] = [
  {
    id: 'crypto',
    name: '仮想通貨KOL',
    keywords: ['仮想通貨', 'BTC', 'ETH', '暗号資産'],
    followerRange: [3000, 30000],
    language: 'ja',
    genres: ['仮想通貨'],
    engagement: 3.0,
  },
  {
    id: 'nisa',
    name: 'NISA投資KOL',
    keywords: ['NISA', '投資', '積立', '資産運用'],
    followerRange: [5000, 50000],
    language: 'ja',
    genres: ['投資全般', 'NISA'],
    engagement: 2.5,
  },
]

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n % 10000 === 0 ? 0 : 1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return n.toLocaleString()
}

export function ScanSettings() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const c = {
    bg: isDark ? '#040408' : '#F8F9FC',
    card: isDark ? '#0C0E14' : '#FFFFFF',
    border: isDark ? 'rgba(99,120,255,0.10)' : 'rgba(99,120,255,0.15)',
    borderAccent: isDark ? 'rgba(99,120,255,0.22)' : 'rgba(99,120,255,0.25)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textSecondary: isDark ? '#C4C8D8' : '#5A6178',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accent: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    accentGreen: isDark ? '#00FF8C' : '#00CC7A',
    input: isDark ? 'rgba(99,120,255,0.06)' : 'rgba(99,120,255,0.04)',
  }

  // ── Quick Settings ──
  const [keywords, setKeywords] = useState(['仮想通貨', 'BTC', '暗号資産', '投資'])
  const [kwInput, setKwInput] = useState('')
  const [followerRange, setFollowerRange] = useState<[number, number]>([1000, 50000])
  const [langFilter, setLangFilter] = useState<LangFilter>('ja')

  // ── Target Conditions ──
  const [minEngagement, setMinEngagement] = useState(3.0)
  const [postFreq, setPostFreq] = useState(2)
  const [lastPostDays, setLastPostDays] = useState('30')
  const [unmonetizedOnly, setUnmonetizedOnly] = useState(false)

  // ── Genres ──
  const [genres, setGenres] = useState(['仮想通貨', '投資全般'])

  // ── DM Settings ──
  const [serviceName, setServiceName] = useState('')
  const [lpUrl, setLpUrl] = useState('')
  const [dmTone, setDmTone] = useState<DmTone>('friendly')
  const [dmLang, setDmLang] = useState<DmLang>('match')

  // ── Output Settings ──
  const [scanLimit, setScanLimit] = useState([50])
  const [topDisplay, setTopDisplay] = useState('10')
  const [autoScan, setAutoScan] = useState(true)

  // ── Score Weights ──
  const [wEngagement, setWEngagement] = useState([40])
  const [wGrowth, setWGrowth] = useState([35])
  const [wFrequency, setWFrequency] = useState([25])
  const totalWeight = wEngagement[0] + wGrowth[0] + wFrequency[0]

  // ── Scan State ──
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{ ok: boolean; msg: string } | null>(null)

  function addKeyword() {
    const kw = kwInput.trim()
    if (!kw || keywords.includes(kw) || keywords.length >= 10) return
    setKeywords([...keywords, kw])
    setKwInput('')
  }

  function onKwKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword() }
  }

  function toggleGenre(g: string) {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  function applyPreset(p: Preset) {
    setKeywords(p.keywords)
    setFollowerRange(p.followerRange)
    setLangFilter(p.language)
    setGenres(p.genres)
    setMinEngagement(p.engagement)
  }

  async function handleScan() {
    setScanning(true)
    setScanResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          followerMin: followerRange[0],
          followerMax: followerRange[1],
          language: langFilter,
          limit: scanLimit[0],
          minEngagement,
          postFrequency: postFreq,
          lastPostDays: Number(lastPostDays),
          unmonetizedOnly,
          genres,
          dmTone,
          dmLanguage: dmLang,
          topDisplay: Number(topDisplay),
          scoreWeights: {
            engagement: wEngagement[0],
            growth: wGrowth[0],
            frequency: wFrequency[0],
          },
        }),
      })
      const data = await res.json()
      setScanResult({ ok: data.success, msg: data.output ?? data.message ?? '' })
    } catch {
      setScanResult({ ok: false, msg: 'ネットワークエラー' })
    } finally {
      setScanning(false)
    }
  }

  // ── Shared styles ──
  const sectionStyle: React.CSSProperties = {
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: '8px',
    padding: '16px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: c.textMuted,
    fontFamily: 'var(--font-mono-var)',
  }

  const inputStyle: React.CSSProperties = {
    background: c.input,
    border: `1px solid ${c.border}`,
    borderRadius: '6px',
    color: c.textPrimary,
    padding: '6px 10px',
    fontSize: '13px',
    fontFamily: 'var(--font-sans-var)',
    outline: 'none',
    width: '100%',
  }

  const accordionItemStyle: React.CSSProperties = {
    background: c.card,
    border: `1px solid ${c.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
  }

  // Radio button group renderer
  function radioGroup(
    options: { value: string; label: string }[],
    current: string,
    onChange: (v: string) => void
  ) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-all"
            style={{
              background: current === opt.value
                ? (isDark ? 'rgba(99,120,255,0.18)' : 'rgba(99,120,255,0.15)')
                : (isDark ? 'rgba(99,120,255,0.05)' : 'transparent'),
              border: `1px solid ${current === opt.value ? c.borderAccent : c.border}`,
              color: current === opt.value ? c.accent : c.textSecondary,
              fontFamily: 'var(--font-sans-var)',
            }}
          >
            <span
              className="inline-block h-3 w-3 flex-shrink-0 rounded-full border-2"
              style={{
                borderColor: current === opt.value ? c.accent : c.textMuted,
                background: current === opt.value ? c.accent : 'transparent',
              }}
            />
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto" style={{ background: c.bg }}>
      <div className="mx-auto max-w-3xl px-6 py-6">

        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold" style={{ color: c.textPrimary, fontFamily: 'var(--font-display-var)' }}>
              スキャン設定
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
              KOL候補のスキャン条件を設定します
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #6378FF, #818AFF)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans-var)',
              boxShadow: '0 2px 12px rgba(99,120,255,0.35)',
            }}
          >
            <Zap size={14} />
            {scanning ? 'スキャン中...' : '今すぐスキャン'}
          </button>
        </div>

        {/* ── Scan Result Banner ── */}
        {scanResult && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg px-4 py-3"
            style={{
              background: scanResult.ok
                ? (isDark ? 'rgba(0,255,140,0.06)' : 'rgba(0,204,122,0.08)')
                : (isDark ? 'rgba(255,80,80,0.06)' : 'rgba(220,50,50,0.08)'),
              border: `1px solid ${scanResult.ok
                ? (isDark ? 'rgba(0,255,140,0.2)' : 'rgba(0,204,122,0.25)')
                : 'rgba(255,80,80,0.2)'}`,
            }}
          >
            {scanResult.ok
              ? <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: c.accentGreen }} />
              : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: isDark ? '#FF6B6B' : '#CC3333' }} />
            }
            <span
              className="text-xs"
              style={{
                color: scanResult.ok ? c.accentGreen : (isDark ? '#FF6B6B' : '#CC3333'),
                fontFamily: 'var(--font-mono-var)',
              }}
            >
              {scanResult.msg || (scanResult.ok ? '完了' : 'エラーが発生しました')}
            </span>
          </div>
        )}

        {/* ─────────────────────────── QUICK SETTINGS ─────────────────────────── */}
        <div className="mb-4">
          <p className="mb-3" style={labelStyle}>クイック設定</p>
          <div className="flex flex-col gap-3">

            {/* Keywords */}
            <div style={sectionStyle}>
              <p className="mb-2.5 text-xs font-medium" style={{ color: c.textSecondary, fontFamily: 'var(--font-sans-var)' }}>
                キーワード{' '}
                <span style={{ color: c.textMuted }}>({keywords.length}/10)</span>
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {keywords.map(kw => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                    style={{
                      background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)',
                      border: `1px solid ${c.borderAccent}`,
                      color: c.accent,
                      fontFamily: 'var(--font-mono-var)',
                    }}
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => setKeywords(keywords.filter(k => k !== kw))}
                      className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              {keywords.length < 10 && (
                <div className="flex gap-2">
                  <input
                    value={kwInput}
                    onChange={e => setKwInput(e.target.value)}
                    onKeyDown={onKwKeyDown}
                    placeholder="キーワード追加 (Enterで確定)"
                    style={{ ...inputStyle, flex: 1, fontSize: '12px' }}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="flex items-center gap-1 rounded px-3 py-1.5 text-xs transition-all hover:brightness-110"
                    style={{
                      background: isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.1)',
                      border: `1px solid ${c.borderAccent}`,
                      color: c.accent,
                      fontFamily: 'var(--font-sans-var)',
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={12} />
                    追加
                  </button>
                </div>
              )}
            </div>

            {/* Follower Range */}
            <div style={sectionStyle}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: c.textSecondary, fontFamily: 'var(--font-sans-var)' }}>
                  フォロワー数
                </p>
                <span className="text-xs font-medium" style={{ color: c.accent, fontFamily: 'var(--font-mono-var)' }}>
                  {fmt(followerRange[0])} 〜 {fmt(followerRange[1])}
                </span>
              </div>
              <Slider
                value={followerRange}
                min={1000}
                max={50000}
                step={500}
                onValueChange={v => setFollowerRange([v[0], v[1]] as [number, number])}
              />
              <div className="mt-1.5 flex justify-between">
                <span className="text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-mono-var)' }}>1K</span>
                <span className="text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-mono-var)' }}>50万</span>
              </div>
            </div>

            {/* Language Filter */}
            <div style={sectionStyle}>
              <p className="mb-2.5 text-xs font-medium" style={{ color: c.textSecondary, fontFamily: 'var(--font-sans-var)' }}>
                言語フィルター
              </p>
              {radioGroup(
                [
                  { value: 'ja', label: '🇯🇵 日本語優先' },
                  { value: 'ja-en', label: '🌐 英語も含む' },
                  { value: 'all', label: '🗺 全言語' },
                ],
                langFilter,
                v => setLangFilter(v as LangFilter)
              )}
            </div>

          </div>
        </div>

        {/* ─────────────────────────── ADVANCED SETTINGS ─────────────────────────── */}
        <div className="mb-4">
          <p className="mb-3" style={labelStyle}>詳細設定</p>
          <Accordion type="multiple" className="flex flex-col gap-2">

            {/* ターゲット条件 */}
            <AccordionItem value="target" className="border-b-0" style={accordionItemStyle}>
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium hover:no-underline"
                style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}
              >
                ターゲット条件
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                  <div>
                    <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                      エンゲージメント率最低値 (%)
                    </label>
                    <input
                      type="number"
                      value={minEngagement}
                      onChange={e => setMinEngagement(Number(e.target.value))}
                      min={0} max={100} step={0.5}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                      投稿頻度 (回/月)
                    </label>
                    <input
                      type="number"
                      value={postFreq}
                      onChange={e => setPostFreq(Number(e.target.value))}
                      min={1} max={30}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                      最終投稿
                    </label>
                    <select
                      value={lastPostDays}
                      onChange={e => setLastPostDays(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {['30', '60', '90', '180'].map(d => (
                        <option key={d} value={d} style={{ background: isDark ? '#161923' : '#fff' }}>{d}日以内</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="unmonetized"
                      checked={unmonetizedOnly}
                      onChange={e => setUnmonetizedOnly(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded accent-[#6378FF]"
                    />
                    <label
                      htmlFor="unmonetized"
                      className="cursor-pointer text-xs"
                      style={{ color: c.textSecondary, fontFamily: 'var(--font-sans-var)' }}
                    >
                      未収益のみ
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ジャンル選択 */}
            <AccordionItem value="genres" className="border-b-0" style={accordionItemStyle}>
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium hover:no-underline"
                style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}
              >
                ジャンル選択
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  {ALL_GENRES.map(g => {
                    const active = genres.includes(g)
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-all"
                        style={{
                          background: active
                            ? (isDark ? 'rgba(99,120,255,0.18)' : 'rgba(99,120,255,0.15)')
                            : (isDark ? 'rgba(99,120,255,0.05)' : 'transparent'),
                          border: `1px solid ${active ? c.borderAccent : c.border}`,
                          color: active ? c.accent : c.textSecondary,
                          fontFamily: 'var(--font-sans-var)',
                        }}
                      >
                        <span
                          className="inline-block h-3 w-3 flex-shrink-0 rounded border"
                          style={{
                            borderColor: active ? c.accent : c.textMuted,
                            background: active ? c.accent : 'transparent',
                          }}
                        />
                        {g}
                      </button>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* DM設定 */}
            <AccordionItem value="dm" className="border-b-0" style={accordionItemStyle}>
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium hover:no-underline"
                style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}
              >
                DM設定
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                        サービス名
                      </label>
                      <input
                        type="text"
                        value={serviceName}
                        onChange={e => setServiceName(e.target.value)}
                        placeholder="例: AndAI"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                        LP URL
                      </label>
                      <input
                        type="url"
                        value={lpUrl}
                        onChange={e => setLpUrl(e.target.value)}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>DMトーン</p>
                    {radioGroup(
                      [
                        { value: 'friendly', label: 'フレンドリー' },
                        { value: 'business', label: 'ビジネスライク' },
                        { value: 'casual', label: 'カジュアル' },
                      ],
                      dmTone,
                      v => setDmTone(v as DmTone)
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>DM言語</p>
                    {radioGroup(
                      [
                        { value: 'match', label: 'チャンネルに合わせる' },
                        { value: 'ja', label: '日本語統一' },
                        { value: 'en', label: '英語統一' },
                      ],
                      dmLang,
                      v => setDmLang(v as DmLang)
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 出力設定 */}
            <AccordionItem value="output" className="border-b-0" style={accordionItemStyle}>
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium hover:no-underline"
                style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}
              >
                出力設定
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 px-4 pb-4">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>スキャン件数</span>
                      <span className="text-xs font-medium" style={{ color: c.accent, fontFamily: 'var(--font-mono-var)' }}>
                        {scanLimit[0]}件
                      </span>
                    </div>
                    <Slider
                      value={scanLimit}
                      min={10}
                      max={100}
                      step={10}
                      onValueChange={setScanLimit}
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-mono-var)' }}>10</span>
                      <span className="text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-mono-var)' }}>100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>
                        TOP表示数
                      </label>
                      <select
                        value={topDisplay}
                        onChange={e => setTopDisplay(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        {['5', '10', '20', '30'].map(n => (
                          <option key={n} value={n} style={{ background: isDark ? '#161923' : '#fff' }}>TOP {n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: isDark ? 'rgba(99,120,255,0.05)' : 'rgba(99,120,255,0.04)', border: `1px solid ${c.border}` }}
                    >
                      <div>
                        <p className="text-xs font-medium" style={{ color: c.textSecondary, fontFamily: 'var(--font-sans-var)' }}>週次自動スキャン</p>
                        <p className="text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>毎週月曜 09:00</p>
                      </div>
                      <Switch
                        checked={autoScan}
                        onCheckedChange={setAutoScan}
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* スコア重み付け */}
            <AccordionItem value="weights" className="border-b-0" style={accordionItemStyle}>
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium hover:no-underline"
                style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}
              >
                <span className="flex items-center gap-2">
                  スコア重み付け
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      background: totalWeight === 100
                        ? (isDark ? 'rgba(0,255,140,0.12)' : 'rgba(0,204,122,0.1)')
                        : (isDark ? 'rgba(255,100,100,0.12)' : 'rgba(220,50,50,0.1)'),
                      color: totalWeight === 100
                        ? c.accentGreen
                        : (isDark ? '#FF6B6B' : '#CC3333'),
                      fontFamily: 'var(--font-mono-var)',
                    }}
                  >
                    {totalWeight}%
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 px-4 pb-4">
                  {([
                    { label: 'エンゲージメント率', value: wEngagement, set: setWEngagement },
                    { label: '登録者成長率', value: wGrowth, set: setWGrowth },
                    { label: '投稿頻度', value: wFrequency, set: setWFrequency },
                  ] as const).map(({ label, value, set }) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between">
                        <span className="text-[11px]" style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}>{label}</span>
                        <span className="text-xs font-medium" style={{ color: c.accent, fontFamily: 'var(--font-mono-var)' }}>
                          {value[0]}%
                        </span>
                      </div>
                      <Slider
                        value={value}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={set}
                      />
                    </div>
                  ))}
                  {totalWeight !== 100 && (
                    <p className="text-[11px]" style={{ color: isDark ? '#FF6B6B' : '#CC3333', fontFamily: 'var(--font-sans-var)' }}>
                      ⚠ 合計が100%になるように調整してください（現在: {totalWeight}%）
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* ─────────────────────────── PRESETS ─────────────────────────── */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p style={labelStyle}>プリセット</p>
            <button
              type="button"
              className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
              style={{ color: c.textMuted, fontFamily: 'var(--font-sans-var)' }}
            >
              <Save size={11} />
              プリセット保存
            </button>
          </div>
          <div className="flex gap-3">
            {PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="flex-1 rounded-lg px-4 py-3 text-left transition-all hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: c.card,
                  border: `1px solid ${c.border}`,
                }}
              >
                <p className="text-sm font-medium" style={{ color: c.textPrimary, fontFamily: 'var(--font-sans-var)' }}>
                  {p.name}
                </p>
                <p className="mt-0.5 text-[10px]" style={{ color: c.textMuted, fontFamily: 'var(--font-mono-var)' }}>
                  {p.keywords.slice(0, 2).join(', ')} • {fmt(p.followerRange[0])}〜{fmt(p.followerRange[1])}
                </p>
              </button>
            ))}
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-4 py-3 transition-all hover:brightness-110"
              style={{
                background: isDark ? 'rgba(99,120,255,0.04)' : 'transparent',
                border: `1px dashed ${c.border}`,
                color: c.textMuted,
              }}
            >
              <Plus size={16} />
              <span className="text-xs" style={{ fontFamily: 'var(--font-sans-var)' }}>新規</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
