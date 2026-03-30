'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

interface ScoreData {
  range: string
  count: number
}

interface ScoreHistogramProps {
  data: ScoreData[]
}

function getBarColor(range: string): string {
  const start = parseInt(range.split('-')[0])
  if (start >= 90) return '#00FF8C'
  if (start >= 70) return '#6378FF'
  if (start >= 50) return '#FFB800'
  return '#8892B0'
}

export function ScoreHistogram({ data }: ScoreHistogramProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="range"
            stroke="#8892B0"
            fontSize={9}
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
            formatter={(value: number) => [`${value}人`, '候補者数']}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
