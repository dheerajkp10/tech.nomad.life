import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { IndicatorValues } from "../../types";

interface Props {
  data: IndicatorValues;
  type: "rsi" | "macd";
}

export default function IndicatorChart({ data, type }: Props) {
  if (type === "rsi") {
    const chartData = data.dates.map((date, i) => ({
      date,
      rsi: data.rsi[i],
    })).filter((d) => d.rsi != null);

    return (
      <div>
        <p className="text-xs text-gray-500 mb-1 font-medium">RSI (14)</p>
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#9ca3af", fontSize: 11 }}
              itemStyle={{ fontSize: 11 }}
            />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
            <ReferenceLine y={50} stroke="#6b7280" strokeDasharray="2 2" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#a78bfa"
              dot={false}
              strokeWidth={1.5}
              name="RSI"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // MACD
  const chartData = data.dates.map((date, i) => ({
    date,
    macd: data.macd_line[i],
    signal: data.macd_signal[i],
    histogram: data.macd_histogram[i],
  })).filter((d) => d.macd != null);

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1 font-medium">MACD (12, 26, 9)</p>
      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#9ca3af", fontSize: 11 }}
            itemStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
          <Bar
            dataKey="histogram"
            name="Histogram"
            fill="#6366f1"
            opacity={0.7}
            radius={0}
          />
          <Line
            type="monotone"
            dataKey="macd"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={1.5}
            name="MACD"
          />
          <Line
            type="monotone"
            dataKey="signal"
            stroke="#f59e0b"
            dot={false}
            strokeWidth={1.5}
            name="Signal"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
