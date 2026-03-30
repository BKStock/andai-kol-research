'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

interface PlatformData {
  name: string
  value: number
}

interface PlatformBarChartProps {
  data: PlatformData[]
}

const colors = ['#FF0000', '#00E5FF', '#E1306C', '#6378FF']

export function PlatformBarChart({ data }: PlatformBarChartProps) {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis 
            type="number" 
            stroke="#8892B0" 
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: 'rgba(99,120,255,0.1)' }}
            fontFamily="var(--font-mono-var)"
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#8892B0"
            fontSize={11}
            width={70}
            tickLine={false}
            axisLine={false}
            fontFamily="var(--font-sans-var)"
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
            formatter={(value: number) => [`${value} チャンネル`, '']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
