import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS, tooltipStyle } from './chartTheme'

export interface CategoryPoint {
  label: string
  count: number
}

export function SimpleBarChart({ data, height = 240 }: { data: CategoryPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
          interval={0}
          angle={data.length > 5 ? -20 : 0}
          textAnchor={data.length > 5 ? 'end' : 'middle'}
          height={data.length > 5 ? 40 : 24}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
        <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
