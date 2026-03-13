import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EquityPoint } from "../../types";

interface Props {
  data: EquityPoint[];
  initialCapital: number;
}

export default function EquityCurve({ data, initialCapital }: Props) {
  const isProfit = data.length > 0 && data[data.length - 1].value >= initialCapital;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={isProfit ? "#22c55e" : "#ef4444"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={isProfit ? "#22c55e" : "#ef4444"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
          width={64}
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#9ca3af", fontSize: 11 }}
          formatter={(value) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, "Portfolio"] as [string, string]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={isProfit ? "#22c55e" : "#ef4444"}
          strokeWidth={2}
          fill="url(#equityGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
