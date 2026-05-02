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

/** Axis tick fill — overrides ChartContainer’s default `fill-muted-foreground` on Recharts ticks. */
const AXIS_TICK_FILL = C.charcoal;

const COHORT_N = 10;

/**
 * Static snapshot of the Strategy Hub → Benchmarks → Valuation accuracy → cross-metric chart.
 * Update these rows when the source cohort in `ValuationAccuracy.jsx` changes and you want the deck to match.
 */
const DATA = [
  { category: "Valuation accuracy", valet: 97, hagerty: 81, kbb: 71, edmunds: 46 },
  { category: "Collector coverage", valet: 100, hagerty: 80, kbb: 60, edmunds: 50 },
];

const chartConfig = {
  valet: { label: "Valet", color: "hsl(var(--primary))" },
  hagerty: { label: "Hagerty", color: "var(--benchmark-hagerty)" },
  kbb: { label: "KBB", color: "var(--benchmark-kbb)" },
  edmunds: { label: "Edmunds", color: "var(--benchmark-edmunds)" },
};

const LEGEND = [
  { key: "valet", label: "Valet", fill: "hsl(var(--primary))" },
  { key: "hagerty", label: "Hagerty", fill: "var(--benchmark-hagerty)" },
  { key: "kbb", label: "KBB", fill: "var(--benchmark-kbb)" },
  { key: "edmunds", label: "Edmunds", fill: "var(--benchmark-edmunds)" },
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
      fontWeight={600}
      className="deck-tabular-nums"
    >
      {`${Math.round(n)}%`}
    </text>
  );
}

/**
 * Grouped bar chart only — same visual as Strategy Hub valuation benchmark (no tabs / source table).
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
          Same four platforms (Valet + Hagerty, KBB, Edmunds) across two dimensions —{" "}
          <span style={{ color: C.charcoalLight, fontWeight: 600 }}>0–100 scores</span> (higher is better).
          Valuation uses <span style={{ color: C.charcoalLight, fontWeight: 600 }}>100 − MAE%</span>. All four
          platforms&apos; <span style={{ color: C.charcoalLight, fontWeight: 600 }}>accuracy and coverage</span>{" "}
          follow the Source data cohort ({COHORT_N} cars).
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
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
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
            <span style={{ fontWeight: 500 }}>{item.label}</span>
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
              tick={{ fontSize: 11, fill: AXIS_TICK_FILL }}
              interval={0}
              height={52}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={40}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: AXIS_TICK_FILL, fontWeight: 500 }}
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
            <Bar dataKey="valet" fill="hsl(var(--primary))" name="Valet" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="valet" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="hagerty" fill="var(--benchmark-hagerty)" name="Hagerty" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="hagerty" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="kbb" fill="var(--benchmark-kbb)" name="KBB" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="kbb" content={<PercentBarLabel />} />
            </Bar>
            <Bar dataKey="edmunds" fill="var(--benchmark-edmunds)" name="Edmunds" radius={[0, 0, 0, 0]} maxBarSize={26}>
              <LabelList dataKey="edmunds" content={<PercentBarLabel />} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
