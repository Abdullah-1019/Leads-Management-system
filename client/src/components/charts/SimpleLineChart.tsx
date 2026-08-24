import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS, tooltipStyle } from './chartTheme'

export interface SeriesPoint {
  period: string
  count: number
}

export function SimpleLineChart({ data, height = 240 }: { data: SeriesPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: CHART_COLORS.primary }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
