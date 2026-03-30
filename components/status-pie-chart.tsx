'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface StatusData {
  name: string
  value: number
  color: string
}

interface StatusPieChartProps {
  data: StatusData[]
}

export function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#161923',
              border: '1px solid rgba(99,120,255,0.15)',
              borderRadius: '6px',
              color: '#F0F2FF',
              fontFamily: 'var(--font-mono-var)',
              fontSize: '11px',
            }}
            formatter={(value: number, name: string) => [`${value}人`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span style={{ color: '#8892B0', fontFamily: 'var(--font-sans-var)', fontSize: '11px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
