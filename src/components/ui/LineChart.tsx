import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReChartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type ValueFormatter = (value: number) => string

const defaultValueFormatter: ValueFormatter = (value: number) => value.toString()

interface LineChartProps {
  data: unknown[]
  categories: string[]
  index: string
  legendHeight?: number
  colors?: string[]
  valueFormatter?: (value: number) => string
  meanLine?: boolean
  startEndOnly?: boolean
  showGridLines?: boolean
  autoMinValue?: boolean
  minValue?: number
  maxValue?: number
  className?: string
}

const LineChart = forwardRef<HTMLDivElement, LineChartProps>((props, ref) => {
  const {
    data,
    categories,
    index,
    legendHeight = 40,
    valueFormatter = defaultValueFormatter,
    meanLine = true,
    className,
    ...other
  } = props

  return (
    <div ref={ref} className={cn("w-full", className)} {...other}>
      <ResponsiveContainer width="100%" height="100%" className="-ml-4">
        <ReChartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={index}
            interval="preserveStartEnd"
            style={{ fontSize: "12px", fontFamily: "Inter, Helvetica" }}
            minTickGap={5}
          />
          <YAxis
            width={56}
            type="number"
            domain={[0, "auto"]}
            style={{ fontSize: "12px", fontFamily: "Inter, Helvetica" }}
            tickFormatter={valueFormatter}
          />
          <Tooltip wrapperStyle={{ outline: "none" }} cursor={{ stroke: "#4B526C", strokeWidth: 1 }} />
          <Legend align="right" verticalAlign="top" height={legendHeight} />
          {categories.map((category) => (
            <Line
              key={category}
              name={category}
              type="linear"
              dataKey="statValue"
              strokeWidth={4}
              stroke="#FB923C"
              dot={{ fill: "#FFFFFF", stroke: "#FB923C", strokeWidth: 4, r: 6 }}
              activeDot={{
                fill: "#FFFFFF",
                stroke: "#4B526C",
                strokeWidth: 4,
                r: 6,
              }}
            />
          ))}
          {meanLine ? (
            <Line
              key={"meanValue"}
              name={"Média Histórica"}
              type="linear"
              legendType="plainline"
              dot={false}
              dataKey={"meanValue"}
              strokeWidth={2}
              stroke="#6E7180"
              strokeDasharray="5 7"
            />
          ) : null}
        </ReChartsLineChart>
      </ResponsiveContainer>
    </div>
  )
})

LineChart.displayName = "LineChart"
export default LineChart
