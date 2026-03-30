'use client'

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts'

interface PlatformData {
  platform: string
  avgScore: number
  engagement: number
  growth: number
  responseRate: number
}

interface PlatformRadarChartProps {
  data: PlatformData[]
}

const platformColors: Record<string, string> = {
  YouTube: '#FF0000',
  TikTok: '#00E5FF',
  Instagram: '#E1306C',
  X: '#6378FF',
}

export function PlatformRadarChart({ data }: PlatformRadarChartProps) {
  // Transform data for radar chart
  const radarData = [
    {
      metric: '平均スコア',
      YouTube: data.find((d) => d.platform === 'YouTube')?.avgScore || 0,
      TikTok: data.find((d) => d.platform === 'TikTok')?.avgScore || 0,
      Instagram: data.find((d) => d.platform === 'Instagram')?.avgScore || 0,
      X: data.find((d) => d.platform === 'X')?.avgScore || 0,
    },
    {
      metric: 'エンゲージ',
      YouTube: (data.find((d) => d.platform === 'YouTube')?.engagement || 0) * 5,
      TikTok: (data.find((d) => d.platform === 'TikTok')?.engagement || 0) * 5,
      Instagram: (data.find((d) => d.platform === 'Instagram')?.engagement || 0) * 5,
      X: (data.find((d) => d.platform === 'X')?.engagement || 0) * 5,
    },
    {
      metric: '成長率',
      YouTube: data.find((d) => d.platform === 'YouTube')?.growth || 0,
      TikTok: data.find((d) => d.platform === 'TikTok')?.growth || 0,
      Instagram: data.find((d) => d.platform === 'Instagram')?.growth || 0,
      X: data.find((d) => d.platform === 'X')?.growth || 0,
    },
    {
      metric: '返信率',
      YouTube: (data.find((d) => d.platform === 'YouTube')?.responseRate || 0) * 2,
      TikTok: (data.find((d) => d.platform === 'TikTok')?.responseRate || 0) * 2,
      Instagram: (data.find((d) => d.platform === 'Instagram')?.responseRate || 0) * 2,
      X: (data.find((d) => d.platform === 'X')?.responseRate || 0) * 2,
    },
  ]

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid 
            stroke="rgba(99,120,255,0.15)"
            strokeDasharray="2 2"
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#8892B0', fontSize: 10, fontFamily: 'var(--font-sans-var)' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#8892B0', fontSize: 9, fontFamily: 'var(--font-mono-var)' }}
            tickCount={4}
          />
          <Radar
            name="YouTube"
            dataKey="YouTube"
            stroke={platformColors.YouTube}
            fill={platformColors.YouTube}
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Radar
            name="TikTok"
            dataKey="TikTok"
            stroke={platformColors.TikTok}
            fill={platformColors.TikTok}
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Radar
            name="Instagram"
            dataKey="Instagram"
            stroke={platformColors.Instagram}
            fill={platformColors.Instagram}
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Radar
            name="X"
            dataKey="X"
            stroke={platformColors.X}
            fill={platformColors.X}
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161923',
              border: '1px solid rgba(99,120,255,0.15)',
              borderRadius: '6px',
              color: '#F0F2FF',
              fontFamily: 'var(--font-mono-var)',
              fontSize: '11px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value: string) => (
              <span style={{ color: '#8892B0', fontFamily: 'var(--font-sans-var)', fontSize: '10px' }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
