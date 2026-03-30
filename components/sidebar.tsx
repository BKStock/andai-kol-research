'use client'

import { LayoutDashboard, Users, BarChart3, ScanSearch, Settings } from 'lucide-react'
import type { TabType } from '@/app/page'
import { useTheme } from '@/lib/theme-context'
import { useLanguage } from '@/lib/language-context'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'
  
  const colors = {
    bgSecondary: isDark ? '#0C0E14' : '#FFFFFF',
    border: isDark ? 'rgba(99,120,255,0.10)' : 'rgba(99,120,255,0.15)',
    textPrimary: isDark ? '#F0F2FF' : '#1A1D29',
    textMuted: isDark ? '#8892B0' : '#8892B0',
    accentBlue: '#6378FF',
    accentCyan: isDark ? '#00E5FF' : '#00C4E5',
    tooltipBg: isDark ? '#161923' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(99,120,255,0.20)' : 'rgba(99,120,255,0.25)',
  }

  const navItems = [
    { id: 'dashboard' as TabType, labelKey: 'nav.dashboard', icon: LayoutDashboard, cyan: false },
    { id: 'candidates' as TabType, labelKey: 'nav.candidates', icon: Users, cyan: false },
    { id: 'analytics' as TabType, labelKey: 'nav.analytics', icon: BarChart3, cyan: false },
    { id: 'kol-research' as TabType, labelKey: 'nav.kolResearch', icon: ScanSearch, cyan: true },
  ]

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen w-[60px] flex-col items-center"
      style={{
        background: colors.bgSecondary,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      {/* Logo mark */}
      <div className="flex h-[92px] w-full items-center justify-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(99,120,255,0.8), rgba(0,229,255,0.6))',
            color: '#F0F2FF',
            fontFamily: 'var(--font-display-var)',
            boxShadow: '0 2px 8px rgba(99,120,255,0.3)',
          }}
        >
          &
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 px-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const accent = item.cyan ? colors.accentCyan : colors.accentBlue
          const activeBg = item.cyan
            ? (isDark ? 'rgba(0,229,255,0.10)' : 'rgba(0,196,229,0.12)')
            : (isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)')
          return (
            <div key={item.id} className="group relative w-full">
              <button
                onClick={() => onTabChange(item.id)}
                className="relative flex h-10 w-full items-center justify-center rounded transition-all duration-150"
                style={{
                  background: isActive ? activeBg : 'transparent',
                  color: isActive ? accent : colors.textMuted,
                  ...(item.cyan && isActive ? { boxShadow: isDark ? '0 0 8px rgba(0,229,255,0.15)' : 'none' } : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = item.cyan ? accent : colors.textPrimary
                    if (item.cyan) (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? '0 0 6px rgba(0,229,255,0.2)' : 'none'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                  }
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r"
                    style={{
                      background: accent,
                      boxShadow: item.cyan ? '0 0 6px rgba(0,229,255,0.7)' : '0 0 6px rgba(99,120,255,0.6)',
                    }}
                  />
                )}
                <Icon size={17} />
              </button>

              <div
                className="pointer-events-none absolute left-[52px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded px-2.5 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{
                  background: colors.tooltipBg,
                  color: item.cyan ? accent : colors.textPrimary,
                  border: `1px solid ${item.cyan ? (isDark ? 'rgba(0,229,255,0.25)' : 'rgba(0,196,229,0.3)') : colors.tooltipBorder}`,
                  fontFamily: 'var(--font-sans-var)',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                {t(item.labelKey)}
                <span
                  className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent"
                  style={{ borderRightColor: colors.tooltipBg }}
                />
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom: Settings */}
      <div className="mb-3 w-full px-2">
        <div className="group relative w-full">
          <button
            onClick={() => onTabChange('settings')}
            className="relative flex h-10 w-full items-center justify-center rounded transition-all duration-150"
            style={{
              background: activeTab === 'settings' ? (isDark ? 'rgba(99,120,255,0.12)' : 'rgba(99,120,255,0.15)') : 'transparent',
              color: activeTab === 'settings' ? colors.accentBlue : colors.textMuted,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'settings') (e.currentTarget as HTMLButtonElement).style.color = colors.textPrimary
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'settings') (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted
            }}
          >
            {activeTab === 'settings' && (
              <span
                className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r"
                style={{ background: colors.accentBlue, boxShadow: '0 0 6px rgba(99,120,255,0.6)' }}
              />
            )}
            <Settings size={16} />
          </button>
          <div
            className="pointer-events-none absolute left-[52px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded px-2.5 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{
              background: colors.tooltipBg,
              color: colors.textPrimary,
              border: `1px solid ${colors.tooltipBorder}`,
              fontFamily: 'var(--font-sans-var)',
            }}
          >
            {t('nav.settings')}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent" style={{ borderRightColor: colors.tooltipBg }} />
          </div>
        </div>
      </div>
    </aside>
  )
}
