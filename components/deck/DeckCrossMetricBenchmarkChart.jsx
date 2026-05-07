"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { C } from "@/components/deck/pitchDeckColors";

/** Axis tick fill - overrides ChartContainer default tick styling where needed. */
const AXIS_TICK_FILL = C.charcoal;

/** Slash deck condensed italic (matches section titles). */
const SLASH_CHART_FONT = "'Saira Extra Condensed', sans-serif";

/**
 * Explicit colors for Recharts SVG fills (CSS variables often do not resolve on `<rect>` in Recharts).
 * Values align with `:root` in `app/globals.css` (`--primary`, `--benchmark-*`).
 */
const BENCHMARK_COLORS = {
  valet: "hsl(152 32% 28%)",
  hagerty: "hsl(210 38% 46%)",
  kbb: "hsl(270 28% 48%)",
  edmunds: "hsl(15 42% 48%)",
};

/**
 * Static snapshot of the Strategy Hub -> Benchmarks -> Valuation accuracy -> cross-metric chart.
 * Update these rows when the source cohort in `ValuationAccuracy.jsx` changes and you want the deck to match.
 */
const DATA = [
  { category: "Valuation accuracy", valet: 97, hagerty: 81, kbb: 71, edmunds: 46 },
  { category: "Collector coverage", valet: 100, hagerty: 80, kbb: 60, edmunds: 50 },
];

const chartConfig = {
  valet: { label: "Valet", color: BENCHMARK_COLORS.valet },
  hagerty: { label: "Hagerty", color: BENCHMARK_COLORS.hagerty },
  kbb: { label: "KBB", color: BENCHMARK_COLORS.kbb },
  edmunds: { label: "Edmunds", color: BENCHMARK_COLORS.edmunds },
};

const LEGEND = [
  { key: "valet", label: "Valet", fill: BENCHMARK_COLORS.valet },
  { key: "hagerty", label: "Hagerty", fill: BENCHMARK_COLORS.hagerty },
  { key: "kbb", label: "KBB", fill: BENCHMARK_COLORS.kbb },
  { key: "edmunds", label: "Edmunds", fill: BENCHMARK_COLORS.edmunds },
];

function PercentBarLabel(props) {
  const { x, y, width, value } = props;
  if (value == null || width == null || y == null) return null;
  const vx = typeof x === "number" ? x : Number(x);
  const vy = typeof y === "number" ? y : Number(y);
  const w = typeof width === "number" ? width : Number(width);
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return (
    <text
      x={vx + w / 2}
      y={vy - 6}
      fill={AXIS_TICK_FILL}
      textAnchor="middle"
      fontSize={11}
      fontWeight={800}
      fontStyle="italic"
      fontFamily={SLASH_CHART_FONT}
      className="deck-tabular-nums"
    >
      {`${Math.round(n)}%`}
    </text>
  );
}

function SlashXAxisTick({ x, y, payload }) {
  if (payload?.value == null) return null;
  return (
    <text
      x={x}
      y={y}
      dy={14}
      fill={AXIS_TICK_FILL}
      textAnchor="middle"
      fontSize={11}
      fontWeight={800}
      fontStyle="italic"
      fontFamily={SLASH_CHART_FONT}
    >
      {payload.value}
    </text>
  );
}

function SlashYAxisTick({ x, y, payload }) {
  if (payload?.value == null) return null;
  return (
    <text
      x={x}
      y={y}
      dy={3}
      fill={AXIS_TICK_FILL}
      textAnchor="end"
      fontSize={11}
      fontWeight={800}
      fontStyle="italic"
      fontFamily={SLASH_CHART_FONT}
    >
      {`${payload.value}%`}
    </text>
  );
}

/**
 * Grouped bar chart only - same visual as Strategy Hub valuation benchmark (no tabs / source table).
 */
export function DeckCrossMetricBenchmarkChart() {
  return (
    <div style={{ width: "100%", maxWidth: "100%", textAlign: "left" }}>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "'Saira Extra Condensed', sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 16,
            color: C.greenDeep,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Cross-metric benchmark
        </div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: C.charcoalLight,
            lineHeight: 1.55,
            maxWidth: "42rem",
            margin: 0,
          }}
        >
          Same four platforms (Valet + Hagerty, KBB, Edmunds) across two dimensions -{" "}
          <span style={{ color: C.charcoalLight, fontWeight: 600 }}>0-100 scores</span> (higher is better).
          Valuation uses <span style={{ color: C.charcoalLight, fontWeight: 600 }}>100 - MAE%</span>. All four
          platforms&apos; <span style={{ color: C.charcoalLight, fontWeight: 600 }}>accuracy and coverage</span>{" "}
          follow the Source data cohort.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px 24px",
          marginBottom: 16,
        }}
        role="list"
        aria-label="Benchmark legend"
      >
        {LEGEND.map((item) => (
          <span
            key={item.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: SLASH_CHART_FONT,
              fontSize: 14,
              fontWeight: 800,
              fontStyle: "italic",
              color: C.charcoalLight,
            }}
            role="listitem"
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: item.fill,
                border: `1px solid ${C.creamDark}`,
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span>{item.label}</span>
          </span>
        ))}
      </div>

      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${C.creamDark}`,
          background: C.warmWhite,
          padding: "12px 8px 8px",
        }}
      >
        <ChartContainer config={chartConfig} className="deck-cross-metric-chart">
          <BarChart
            accessibilityLayer
            data={DATA}
            margin={{ top: 24, right: 8, left: 0, bottom: 4 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={<SlashXAxisTick />}
              interval={0}
              height={52}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={44}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={<SlashYAxisTick />}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="deck-cross-metric-chart__tooltip"
                  formatter={(value, name) => [`${value}%`, String(name)]}
                />
              }
            />
            <Bar dataKey="valet" fill={BENCHMARK_COLORS.valet} name="Valet" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="valet" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="hagerty" fill={BENCHMARK_COLORS.hagerty} name="Hagerty" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="hagerty" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="kbb" fill={BENCHMARK_COLORS.kbb} name="KBB" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="kbb" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="edmunds" fill={BENCHMARK_COLORS.edmunds} name="Edmunds" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="edmunds" content={<PercentBarLabel />} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
