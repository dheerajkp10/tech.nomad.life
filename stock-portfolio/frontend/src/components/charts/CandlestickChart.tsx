import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";
import type { IndicatorValues } from "../../types";

interface Props {
  data: IndicatorValues;
  height?: number;
}

export default function CandlestickChart({ data, height = 350 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#111827" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#374151" },
      timeScale: { borderColor: "#374151", timeVisible: true },
      width: containerRef.current.clientWidth,
      height,
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const candles = data.dates
      .map((date, i) => ({
        time: date as import("lightweight-charts").Time,
        open: data.open[i] ?? 0,
        high: data.high[i] ?? 0,
        low: data.low[i] ?? 0,
        close: data.close[i] ?? 0,
      }))
      .filter((c) => c.open && c.high && c.low && c.close);

    candleSeries.setData(candles);

    // BB Upper
    const bbUpperSeries = chart.addSeries(LineSeries, {
      color: "#6366f1",
      lineWidth: 1,
      lineStyle: 2,
    });
    bbUpperSeries.setData(
      data.dates
        .map((d, i) => ({ time: d as import("lightweight-charts").Time, value: data.bb_upper[i] }))
        .filter((p) => p.value != null) as { time: import("lightweight-charts").Time; value: number }[]
    );

    // BB Middle
    const bbMiddleSeries = chart.addSeries(LineSeries, {
      color: "#6366f1",
      lineWidth: 1,
    });
    bbMiddleSeries.setData(
      data.dates
        .map((d, i) => ({ time: d as import("lightweight-charts").Time, value: data.bb_middle[i] }))
        .filter((p) => p.value != null) as { time: import("lightweight-charts").Time; value: number }[]
    );

    // BB Lower
    const bbLowerSeries = chart.addSeries(LineSeries, {
      color: "#6366f1",
      lineWidth: 1,
      lineStyle: 2,
    });
    bbLowerSeries.setData(
      data.dates
        .map((d, i) => ({ time: d as import("lightweight-charts").Time, value: data.bb_lower[i] }))
        .filter((p) => p.value != null) as { time: import("lightweight-charts").Time; value: number }[]
    );

    // SMA 20
    const sma20Series = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 1,
    });
    sma20Series.setData(
      data.dates
        .map((d, i) => ({ time: d as import("lightweight-charts").Time, value: data.sma_20[i] }))
        .filter((p) => p.value != null) as { time: import("lightweight-charts").Time; value: number }[]
    );

    // SMA 50
    const sma50Series = chart.addSeries(LineSeries, {
      color: "#ec4899",
      lineWidth: 1,
    });
    sma50Series.setData(
      data.dates
        .map((d, i) => ({ time: d as import("lightweight-charts").Time, value: data.sma_50[i] }))
        .filter((p) => p.value != null) as { time: import("lightweight-charts").Time; value: number }[]
    );

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height]);

  return (
    <div>
      <div className="flex gap-4 text-xs mb-2 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 inline-block" />SMA 20</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-pink-500 inline-block" />SMA 50</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-400 inline-block" />BB Bands</span>
      </div>
      <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
    </div>
  );
}
