'use client'

import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
} from 'recharts'

interface WeeklyData {
  week: string
  discovered: number
  collaborated: number
}

interface GrowthLineChartProps {
  data: WeeklyData[]
}

export function GrowthLineChart({ data }: GrowthLineChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorDiscovered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6378FF" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6378FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCollab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FF8C" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00FF8C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            stroke="#8892B0"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: 'rgba(99,120,255,0.1)' }}
            fontFamily="var(--font-mono-var)"
          />
          <YAxis 
            stroke="#8892B0" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            fontFamily="var(--font-mono-var)"
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
            height={30}
            formatter={(value: string) => (
              <span style={{ color: '#8892B0', fontFamily: 'var(--font-sans-var)', fontSize: '11px' }}>
                {value === 'discovered' ? '新規発見' : '協業成立'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="discovered"
            name="discovered"
            stroke="#6378FF"
            strokeWidth={2}
            fill="url(#colorDiscovered)"
            dot={false}
            activeDot={{ r: 4, fill: '#6378FF', stroke: '#161923', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="collaborated"
            name="collaborated"
            stroke="#00FF8C"
            strokeWidth={2}
            fill="url(#colorCollab)"
            dot={false}
            activeDot={{ r: 4, fill: '#00FF8C', stroke: '#161923', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
