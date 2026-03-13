import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { HoldingWithPrice } from "../../types";

const COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#a78bfa", "#fb7185",
  "#64748b", // "Other" bucket
];

const TOP_N = 10;

interface Props {
  holdings: HoldingWithPrice[];
}

export default function PieAllocation({ holdings }: Props) {
  const totalValue = holdings.reduce((s, h) => s + h.market_value, 0);

  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        No holdings to display
      </div>
    );
  }

  // Sort by market value descending, cap at TOP_N + "Other" bucket
  const sorted = [...holdings].sort((a, b) => b.market_value - a.market_value);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const otherValue = rest.reduce((s, h) => s + h.market_value, 0);

  const data = [
    ...top.map((h) => ({
      name: h.ticker,
      value: h.market_value,
      pct: totalValue > 0 ? (h.market_value / totalValue) * 100 : 0,
    })),
    ...(otherValue > 0
      ? [{ name: `Other (${rest.length})`, value: otherValue, pct: totalValue > 0 ? (otherValue / totalValue) * 100 : 0 }]
      : []),
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={1}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value, _name, props) => [
            `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })} (${(props.payload as { pct: number }).pct.toFixed(1)}%)`,
            (props.payload as { name: string }).name,
          ] as [string, string]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
