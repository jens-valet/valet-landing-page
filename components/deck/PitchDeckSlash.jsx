"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { readDeckSession, writeDeckSession } from "@/lib/deckSession";
import { DeckLogoWhiteGoldLineImg, DeckVMarkImg } from "@/components/deck/deckBranding";
import { CompetitiveBenchmark } from "@/components/deck/CompetitiveBenchmark";
import { DeckCrossMetricBenchmarkChart } from "@/components/deck/DeckCrossMetricBenchmarkChart";
import { C } from "@/components/deck/pitchDeckColors";
import ProductDataInfraDetails from "@/components/strategy/ProductDataInfraDetails";
import GnaUofDetails from "@/components/strategy/GnaUofDetails";
import { formatUofSummarizedRowAmount } from "@/components/strategy/pitchDeckUofTemplates";

/**
 * Live garage demo iframe: load webapp `/deck-demo`, which signs in the Edge-configured
 * demo user then redirects to `/garage?deckEmbed=1` (needed when marketing site is cross-origin).
 * Override origin with `NEXT_PUBLIC_WEBAPP_URL` when the app moves.
 */
const DEFAULT_WEBAPP_ORIGIN_FOR_DECK_DEMO = "https://valet-ventures.vercel.app";
const WEBAPP_ORIGIN =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WEBAPP_URL
    ? String(process.env.NEXT_PUBLIC_WEBAPP_URL).replace(/\/$/, "").trim()
    : DEFAULT_WEBAPP_ORIGIN_FOR_DECK_DEMO;
/** Append `NEXT_PUBLIC_DECK_IFRAME_DEBUG=true` on landing to add `?deckDemoDebug=1` for iframe diagnostics. */
const DECK_IFRAME_DEBUG =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_DECK_IFRAME_DEBUG === "true";
const DECK_DEMO_IFRAME_SRC = `${WEBAPP_ORIGIN}/deck-demo${DECK_IFRAME_DEBUG ? "?deckDemoDebug=1" : ""}`;

/**
 * Reveal when the element intersects the viewport. Uses a callback ref so we never miss setup when
 * ref.current was still null on first effect (Strict Mode / hydration) - that left FadeIn stuck at
 * opacity 0. Geometry check + delayed fallback catch stubborn Safari / nested-layout IO gaps.
 */
function useInView() {
  const [v, setV] = useState(false);
  const genRef = useRef(0);
  const observerRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const resizeObserverRef = useRef(null);
  const elRef = useRef(null);

  const ref = useCallback((el) => {
    genRef.current += 1;
    const gen = genRef.current;
    elRef.current = el;

    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!el) return;

    const overlapsViewport = () => {
      const node = elRef.current;
      if (!node) return false;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return (
        r.height >= 0 &&
        r.width >= 0 &&
        r.bottom > -160 &&
        r.top < vh + 160 &&
        r.right > -80 &&
        r.left < vw + 80
      );
    };

    const reveal = () => {
      if (gen !== genRef.current) return;
      setV(true);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
    };

    const tryRevealFromLayout = () => {
      if (gen !== genRef.current) return;
      if (overlapsViewport()) reveal();
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const o = new IntersectionObserver(
      ([e]) => {
        if (gen !== genRef.current) return;
        if (e.isIntersecting || e.intersectionRatio > 0) {
          reveal();
        }
      },
      { threshold: [0, 0.01], rootMargin: "160px 0px" },
    );
    observerRef.current = o;
    o.observe(el);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => tryRevealFromLayout());
      resizeObserverRef.current = ro;
      ro.observe(el);
    }

    const armRaf = () => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          if (gen !== genRef.current) return;
          tryRevealFromLayout();
        });
      });
    };
    armRaf();

    timeoutIdsRef.current = [0, 50, 150, 400, 800, 2000].map((ms) =>
      window.setTimeout(() => {
        if (gen !== genRef.current) return;
        tryRevealFromLayout();
      }, ms),
    );
  }, []);

  return [ref, v];
}
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      style={{
        ...style,
        minHeight: v ? undefined : 1,
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
function Badge({ size = 48 }) {
  return <svg width={size} height={size * 0.75} viewBox="0 0 64 48" fill="none"><text x="0" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold}>V</text><text x="28" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.55">/</text><text x="36" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.3">/</text><text x="44" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.12">/</text></svg>;
}
function SectionTag({ number, label, light = false }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: light ? C.charcoal : C.gold, letterSpacing: 2 }}>{String(number).padStart(2, "0")}</span><div style={{ height: 1, width: 40, background: light ? C.charcoal + "44" : C.gold + "66" }} /><span style={{ fontFamily: "'Saira', sans-serif", fontWeight: 100, fontSize: 12, color: light ? C.charcoalLight : C.goldLight, letterSpacing: 4, textTransform: "uppercase" }}>{label}</span></div>;
}
function StatCard({ value, label, sub, variant = "default" }) {
  const g = variant === "green";
  return <div style={{ background: g ? C.greenPrimary : C.warmWhite, borderRadius: 8, padding: "26px 22px", flex: 1, minWidth: 180, border: `1px solid ${g ? C.greenAccent + "44" : C.creamDark}` }}><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 34, lineHeight: 1.1, color: g ? C.gold : C.greenDeep }}>{value}</div><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: g ? C.creamDark : C.charcoalLight, marginTop: 6, lineHeight: 1.45 }}>{label}</div>{sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: g ? C.goldLight : C.muted, marginTop: 8 }}>{sub}</div>}</div>;
}
function DataTable({ headers, rows, caption, light = false }) {
  const tc = light ? C.charcoal : C.creamDark;
  return <div style={{ overflowX: "auto", margin: "20px 0" }}>{caption && <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 100, fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>{caption}</div>}<table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{headers.map((h, i) => <th key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: C.gold, letterSpacing: 1, textTransform: "uppercase", textAlign: i === 0 ? "left" : "right", padding: "10px 12px", borderBottom: `1px solid ${C.gold}44`, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead><tbody>{rows.map((row, ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : (light ? C.cream + "88" : C.greenPrimary + "33") }}>{row.map((cell, ci) => <td key={ci} style={{ fontFamily: ci === 0 ? "'Outfit', sans-serif" : "'DM Mono', monospace", fontSize: 13, whiteSpace: "nowrap", color: typeof cell === "string" && cell.startsWith("-") ? C.red : tc, textAlign: ci === 0 ? "left" : "right", padding: "10px 12px", borderBottom: `1px solid ${light ? C.creamDark : C.greenMid + "33"}` }}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

/* ===== MONTEREY CAR WEEK - PROPER CHART ===== */
function MontereyChart() {
  // Estimated attendance in thousands + avg ticket price
  const data = [
    { yr: 2010, att: 15, tp: 275 }, { yr: 2012, att: 22, tp: 350 }, { yr: 2014, att: 28, tp: 425 },
    { yr: 2016, att: 38, tp: 525 }, { yr: 2018, att: 48, tp: 650 }, { yr: 2020, att: 12, tp: 500 },
    { yr: 2022, att: 62, tp: 875 }, { yr: 2024, att: 78, tp: 1050 }, { yr: 2025, att: 82, tp: 1100 },
    { yr: 2026, att: 88, tp: 1200 },
  ];
  const W = 460, H = 240, pad = { t: 20, r: 60, b: 40, l: 50 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const maxAtt = 100, maxTp = 1400;
  const barW = cw / data.length * 0.65;
  const x = (i) => pad.l + (i + 0.5) * (cw / data.length);
  const yAtt = (v) => pad.t + ch - (v / maxAtt) * ch;
  const yTp = (v) => pad.t + ch - (v / maxTp) * ch;
  const f = "'DM Mono', monospace";
  return (
    <div>
      <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 18, color: C.greenDeep, marginBottom: 4 }}>Monterey Car Week - Growth Trajectory</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 10, borderRadius: 2, background: C.charcoalLight }} /><span style={{ fontFamily: f, fontSize: 10, color: C.muted }}>Est. Attendance (K)</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 2, background: C.gold }} /><span style={{ fontFamily: f, fontSize: 10, color: C.muted }}>Avg Ticket Price ($)</span></div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => <g key={v}><line x1={pad.l} y1={yAtt(v)} x2={W - pad.r} y2={yAtt(v)} stroke={C.creamDark} strokeWidth="0.5" /><text x={pad.l - 8} y={yAtt(v) + 3} textAnchor="end" fontFamily={f} fontSize="9" fill={C.muted}>{v}K</text></g>)}
        {/* Right axis labels for ticket price */}
        {[0, 400, 800, 1200].map(v => <text key={v} x={W - pad.r + 8} y={yTp(v) + 3} textAnchor="start" fontFamily={f} fontSize="9" fill={C.gold}>${v >= 1000 ? (v/1000).toFixed(1)+"K" : v}</text>)}
        {/* Bars */}
        {data.map((d, i) => <rect key={i} x={x(i) - barW / 2} y={yAtt(d.att)} width={barW} height={ch - (ch - (d.att / maxAtt) * ch)} rx="2" fill={d.yr >= 2025 ? C.goldDark : C.charcoalLight} opacity={d.yr === 2020 ? 0.4 : 0.85} />)}
        {/* Ticket price line */}
        <polyline fill="none" stroke={C.gold} strokeWidth="2" points={data.map((d, i) => `${x(i)},${yTp(d.tp)}`).join(" ")} />
        {data.map((d, i) => <circle key={i} cx={x(i)} cy={yTp(d.tp)} r="3" fill={C.gold} />)}
        {/* X axis */}
        {data.map((d, i) => <text key={i} x={x(i)} y={H - pad.b + 18} textAnchor="middle" fontFamily={f} fontSize="9" fill={C.muted}>{d.yr}</text>)}
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={C.creamDark} strokeWidth="0.5" />
      </svg>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>Pebble Beach Concours, The Quail, and Legends of the Autobahn have seen consistent attendance growth, rising ticket prices, and sellout timelines that compress each year. The economic impact exceeds hundreds of millions annually. 2020 dip reflects COVID cancellations.</p>
    </div>
  );
}

/* ===== ASSET COMPARISON - PROPER CHART ===== */
function AssetChart() {
  // Indexed from 100 in 2010. Collector car data from Hagerty Blue Chip + KFLII, S&P from actual index, RE from FHFA
  const years = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026];
  const cars =  [100,  130,  175,  210,  240,  225,  355,  370,  395];
  const sp500 = [100,  120,  155,  170,  205,  230,  260,  300,  330];
  const re =    [100,  105,  118,  135,  155,  175,  230,  240,  245];
  const W = 460, H = 240, pad = { t: 20, r: 20, b: 40, l: 50 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const maxV = 420;
  const x = (i) => pad.l + (i / (years.length - 1)) * cw;
  const y = (v) => pad.t + ch - (v / maxV) * ch;
  const pts = (arr) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const f = "'DM Mono', monospace";
  return (
    <div>
      <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 18, color: C.greenDeep, marginBottom: 4 }}>Collector Cars vs. Traditional Assets</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 3, borderRadius: 1, background: C.gold }} /><span style={{ fontFamily: f, fontSize: 10, color: C.muted }}>Collector Cars (Hagerty Index)</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 2, borderRadius: 1, background: C.charcoalLight }} /><span style={{ fontFamily: f, fontSize: 10, color: C.muted }}>S&P 500</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 2, borderRadius: 1, background: C.creamDark }} /><span style={{ fontFamily: f, fontSize: 10, color: C.muted }}>US Real Estate</span></div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
        {[100, 200, 300, 400].map(v => <g key={v}><line x1={pad.l} y1={y(v)} x2={W - pad.r} y2={y(v)} stroke={C.creamDark} strokeWidth="0.5" /><text x={pad.l - 8} y={y(v) + 3} textAnchor="end" fontFamily={f} fontSize="9" fill={C.muted}>{v}</text></g>)}
        <polyline fill="none" stroke={C.creamDark} strokeWidth="1.5" points={pts(re)} />
        <polyline fill="none" stroke={C.charcoalLight} strokeWidth="1.5" points={pts(sp500)} />
        <polyline fill="none" stroke={C.gold} strokeWidth="2.5" points={pts(cars)} />
        {/* End labels */}
        <text x={x(8) + 6} y={y(cars[8]) - 4} fontFamily={f} fontSize="9" fill={C.gold}>395</text>
        <text x={x(8) + 6} y={y(sp500[8]) - 4} fontFamily={f} fontSize="9" fill={C.charcoalLight}>330</text>
        <text x={x(8) + 6} y={y(re[8]) + 12} fontFamily={f} fontSize="9" fill={C.creamDark}>245</text>
        {years.map((yr, i) => <text key={i} x={x(i)} y={H - pad.b + 18} textAnchor="middle" fontFamily={f} fontSize="9" fill={C.muted}>{yr}</text>)}
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={C.creamDark} strokeWidth="0.5" />
        <text x={pad.l} y={H - 4} fontFamily={f} fontSize="8" fill={C.muted}>Indexed: 2010 = 100</text>
      </svg>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>Collector cars have outpaced both the S&P 500 and US real estate over the last 15 years. Total auction volume from RM Sotheby's, Mecum, Gooding, and Bonhams reached record highs through 2024-2026, with individual Ferrari, Porsche, and Mercedes lots setting new benchmarks.</p>
    </div>
  );
}

/* ===== INTERACTIVE DONUT ===== */
function DonutChart({ data, onSelect, selected }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const segs = data.map((d, i) => { const start = (cum / total) * 360; cum += d.value; return { ...d, start, end: (cum / total) * 360, i }; });
  const toR = (deg) => (deg - 90) * Math.PI / 180;
  const arc = (s, e, r, ir) => {
    const s1 = toR(s), e1 = toR(e), lg = e - s > 180 ? 1 : 0;
    return `M ${200 + r * Math.cos(s1)} ${200 + r * Math.sin(s1)} A ${r} ${r} 0 ${lg} 1 ${200 + r * Math.cos(e1)} ${200 + r * Math.sin(e1)} L ${200 + ir * Math.cos(e1)} ${200 + ir * Math.sin(e1)} A ${ir} ${ir} 0 ${lg} 0 ${200 + ir * Math.cos(s1)} ${200 + ir * Math.sin(s1)} Z`;
  };
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 300 }}>
      {segs.map((seg) => {
        const isSel = selected === seg.i;
        return <path key={seg.i} d={arc(seg.start + 0.8, seg.end - 0.8, isSel ? 185 : 175, isSel ? 90 : 105)} fill={seg.color} opacity={selected !== null && !isSel ? 0.35 : 1} style={{ cursor: "pointer", transition: "all 0.3s ease" }} onClick={() => onSelect(isSel ? null : seg.i)} />;
      })}
      <text x="200" y="192" textAnchor="middle" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="26" fill={C.cream}>{selected !== null ? data[selected].pct : "$3.75M"}</text>
      <text x="200" y="214" textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize="10" fill={C.goldLight}>{selected !== null ? data[selected].label : "TOTAL RAISE"}</text>
    </svg>
  );
}

function UseOfFundsInteractive() {
  const [year, setYear] = useState(1);
  const [selected, setSelected] = useState(null);
  const y1 = [
    { label: "Team + Salary", value: 26, pct: "26%", color: C.charcoalLight, amount: "$975K", details: [{ r: "CEO (Johnny)", v: "$200K" }, { r: "CTO (Jens)", v: "$150K" }, { r: "Infra Engineer", v: "$150K" }, { r: "Employer burden (~15%)", v: "$75K" }], note: "Core salaries protected for 2 full years. Contractors excluded - they sit under G&A so runway reads as core team only." },
    { label: "Distribution / Launch", value: 38, pct: "38%", color: C.goldDark, amount: "$1.43M", details: [
      { r: "Tier A - Flagship anchors (4 × $125K)", v: "$500K", sub: "1 YouTube integration (60-90s) or dedicated segment, 2 short-form cutdowns, 3 story frames with link + promo code, 60-day link placement, optional 30-day usage rights" },
      { r: "Tier B - Mid-tier growth (6 × $25K)", v: "$150K", sub: "1 integration or dedicated short-form, plus 1 follow-up story bundle. CTA optimized to \"Add your VIN → unlock your local community\"" },
      { r: "Tier C - Niche/micro (6 × $8K)", v: "$48K", sub: "1 short-form + story bundle, geo/niche targeted to seed density in specific marques and metros" },
      { r: "Events & Activations", v: "$47K", sub: "12 Cars & Coffee ($2K ea), 4 regional marque events ($4K ea), 1 flagship activation ($7K)" },
    ], note: "Y1 cadence: Q1 - 4 deals (prove messaging), Q2 - 6 deals (scale winners), Q3 - 4 deals (event season), Q4 - 2 deals. Spend is a lever - flexes based on conversion data." },
    { label: "Product + Data Infra", value: 13, pct: "13%", color: C.greenMid, amount: "$484K", details: [], note: "Includes upgrading from MVP-grade APIs to production-grade data sources (HammerPrice API, etc.) and structuring enterprise LLM licensing so the free Garage wedge scales efficiently." },
    { label: "Contractors + G&A", value: 23, pct: "23%", color: C.gold, amount: "$846K", details: [{ r: "UX polish, lifecycle messaging, moderation", v: "$200K" }, { r: "Engagement - Steward Program", v: "$48k" }, { r: "Legal (corp setup, ToS/privacy, SAFE docs)", v: "$100K" }, { r: "Bookkeeping, D&O insurance, admin", v: "$50K" }], note: "Contractors are a deliberate lever to move fast without premature full-time headcount." },
  ];
  const y2 = [
    { label: "Team + Salary", value: 26, pct: "26%", color: C.charcoalLight, amount: "$975K", details: [{ r: "CEO (Johnny)", v: "$200K" }, { r: "CTO (Jens)", v: "$150K" }, { r: "Infra Engineer", v: "$150K" }, { r: "Employer burden", v: "$75K" }], note: "Same 2-year reserve. Core team stability maintained regardless of market conditions." },
    { label: "Distribution / Launch", value: 35, pct: "35%", color: C.goldDark, amount: "$1.31M", details: [
      { r: "Tier A - Renew top performers (3 × $80K)", v: "$240K", sub: "Proven partners from Y1 with established audience trust and validated conversion metrics" },
      { r: "Tier B - Performance-structured (8 × $18K)", v: "$144K", sub: "Lower base + conversion kicker tied to paid Communities subscriptions. Shifts spend toward proven ROI" },
      { r: "Tier C - Broader seeding (6 × $6K)", v: "$36K", sub: "Expand geographic and marque coverage into new niche metros" },
      { r: "Events & Activations", v: "$75K", sub: "18 Cars & Coffee ($2K ea), 6 regional events ($5K ea), 1 flagship ($9K)" },
    ], note: "Y2 shifts toward performance-based terms: lower guaranteed base, higher conversion kickers. Marketing efficiency improves as organic flywheel contributes." },
    { label: "Product + Data Infra", value: 15.47, pct: "15%", color: C.greenMid, amount: "$580K", details: [], note: "Focus shifts to scaling efficiency: enterprise vendor contracts, caching expensive lookups, optimizing per-car variable cost at volume." },
    { label: "Contractors + G&A", value: 23.53, pct: "24%", color: C.gold, amount: "$882K", details: [{ r: "Post-launch UX iteration, moderation, QA", v: "$300K" }, { r: "Engagement - Steward Program", v: "$95k" }, { r: "Ongoing legal/compliance", v: "$120K" }, { r: "Accounting, insurance, admin", v: "$65K" }], note: "Contractor spend increases post-launch to support iteration velocity without premature full-time headcount." },
  ];
  const data = year === 1 ? y1 : y2;
  const sel = selected !== null && selected < data.length ? data[selected] : null;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2].map(y => <button key={y} onClick={() => { setYear(y); setSelected(null); }} style={{ padding: "8px 20px", borderRadius: 6, border: `1px solid ${year === y ? C.gold : C.greenMid + "44"}`, background: year === y ? C.gold + "22" : "transparent", color: year === y ? C.gold : C.creamDark, fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>YEAR {y}</button>)}
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 auto" }}><DonutChart data={data} onSelect={setSelected} selected={selected} /></div>
        <div style={{ flex: 1, minWidth: 260 }}>
          {data.map((d, i) => (
            <div key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 6, cursor: "pointer", background: selected === i ? C.greenPrimary : "transparent", border: `1px solid ${selected === i ? C.gold + "44" : "transparent"}`, marginBottom: 4, transition: "all 0.2s ease" }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: d.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.cream, flex: 1 }}>{d.label} <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.goldLight }}>{d.pct}</span></span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold }}>{formatUofSummarizedRowAmount(d, year)}</span>
            </div>
          ))}
          {sel && <div style={{ marginTop: 16, padding: 20, background: C.greenPrimary, borderRadius: 8, border: `1px solid ${C.gold}33` }}>
            <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.gold, marginBottom: 12 }}>{sel.label}</div>
            {sel.label === "Product + Data Infra" ? (
              <ProductDataInfraDetails year={year} allocationDetails={sel.details} />
            ) : sel.label === "Contractors + G&A" ? (
              <GnaUofDetails details={sel.details} />
            ) : (
              sel.details.map((d, i) => (
                <div key={i} style={{ padding: "6px 0", borderBottom: i < sel.details.length - 1 ? `1px solid ${C.greenMid}33` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark }}>{d.r}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold, flexShrink: 0, marginLeft: 12 }}>{d.v}</span>
                  </div>
                  {d.sub && (
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: C.creamDark, marginTop: 3, paddingLeft: 12, lineHeight: 1.5 }}>{d.sub}</div>
                  )}
                </div>
              ))
            )}
            {sel.note && <div style={{ marginTop: 12, padding: "10px 14px", background: C.greenDeep, borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.goldLight, lineHeight: 1.5 }}>{sel.note}</div>}
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ===== MILESTONE TIMELINE ===== */
function MilestoneTimeline() {
  const ms = [
    { period: "0-6 MO", title: "PRODUCTION READINESS", num: "01", items: [
      "Infrastructure and storage hardening",
      "Monitoring and cost controls",
      "Upgrade data layer to production-grade sources (HammerPrice API, etc.)",
      "Enterprise LLM licensing for cost-efficient scaling",
      "Expand brand coverage beyond initial 7 brands",
      "Launch-ready UX polish",
    ], color: C.greenDeep },
    { period: "6-12 MO", title: "LAUNCH + RETENTION PROOF", num: "02", items: [
      "Activate influencer + event launch engine",
      "Validate activation → engagement → conversion loop",
      "Establish subscription conversion baseline",
      "Prove retention dynamics with real paid subscribers",
    ], color: C.greenPrimary },
    { period: "12-24 MO", title: "SCALE", num: "03", items: [
      "Expand coverage to more regions and brands",
      "Improve personalization and notification intelligence",
      "Refine CAC channels and explore partnership distribution",
      "Optimize unit economics at volume",
    ], color: C.greenMid },
    { period: "24-36 MO", title: "DURABLE PLATFORM OPTIONALITY", num: "04", items: [
      "OEM, auction house, and insurance partnerships",
      "Deeper portfolio analytics and premium features",
      "New monetization layers as the network matures",
      "Sustained profitability",
    ], color: C.greenAccent },
  ];
  return (
    <div style={{ position: "relative" }}>
      {ms.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 0, marginBottom: i < 3 ? 0 : 0 }}>
          {/* Timeline column - fixed width, centered line + dot */}
          <div style={{ width: 48, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Line segment above dot */}
            {i > 0 && <div style={{ width: 2, height: 24, background: C.gold + "55" }} />}
            {i === 0 && <div style={{ height: 24 }} />}
            {/* Dot */}
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.gold, border: `3px solid ${C.greenDeep}`, flexShrink: 0, zIndex: 1 }} />
            {/* Line segment below dot */}
            {i < 3 && <div style={{ width: 2, flex: 1, background: C.gold + "55" }} />}
          </div>
          {/* Content card */}
          <div style={{ flex: 1, padding: "12px 0 24px", marginLeft: 8 }}>
            <div style={{ background: C.warmWhite, borderRadius: 10, padding: "22px 24px", border: `1px solid ${C.creamDark}`, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gold, letterSpacing: 2, flexShrink: 0 }}>{m.period}</span>
                <span style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.greenDeep }}>{m.title}</span>
              </div>
              {m.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 10, padding: "5px 0", alignItems: "flex-start" }}>
                  <span style={{ color: C.gold, flexShrink: 0, marginTop: 1, fontSize: 12 }}>→</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.charcoalLight, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== FINANCIAL MODEL TOGGLE ===== */
function FinancialModelToggle({ mono, bodyL, h3L }) {
  const [mode, setMode] = useState("conservative");
  const conservative = {
    label: "Capital Preservation",
    desc: "Retain 80%+ operating margin by Y5. Bank profit conservatively.",
    rows: [["Y1", "50K", "$2", "$0.6M", "87%", "$2.26M", "-$2.10M", "-350%"], ["Y2", "150K", "$2", "$2.4M", "93%", "$1.70M", "-$0.02M", "-1%"], ["Y3", "250K", "$3", "$7.2M", "95%", "$1.20M", "$5.03M", "70%"], ["Y4", "350K", "$4", "$14.4M", "95.5%", "$1.00M", "$12.08M", "84%"], ["Y5", "500K", "$5", "$25.5M", "95.8%", "$0.90M", "$22.79M", "89%"]],
    chart: [{ label: "Y1", revenue: 0.6, opProfit: -2.1, revLabel: "$0.6M", opLabel: "-$2.1M" }, { label: "Y2", revenue: 2.4, opProfit: -0.02, revLabel: "$2.4M", opLabel: "~$0" }, { label: "Y3", revenue: 7.2, opProfit: 5.03, revLabel: "$7.2M", opLabel: "$5M" }, { label: "Y4", revenue: 14.4, opProfit: 12.08, revLabel: "$14.4M", opLabel: "$12M" }, { label: "Y5", revenue: 25.5, opProfit: 22.79, revLabel: "$25.5M", opLabel: "$23M" }],
  };
  const blitz = {
    label: "Blitzscaling",
    desc: "Reinvest 40% of annual revenue into marketing for accelerated growth.",
    rows: [["Y1", "50K", "$2", "$0.6M", "87%", "$2.26M", "-$2.10M", "-350%"], ["Y2", "200K", "$2", "$3.0M", "93%", "$2.90M", "-$0.70M", "-23%"], ["Y3", "400K", "$3", "$10.8M", "95%", "$4.32M", "$5.34M", "49%"], ["Y4", "650K", "$4", "$25.2M", "95.5%", "$10.08M", "$13.35M", "53%"], ["Y5", "1.0M", "$5", "$49.5M", "95.8%", "$19.80M", "$26.91M", "54%"]],
    chart: [{ label: "Y1", revenue: 0.6, opProfit: -2.1, revLabel: "$0.6M", opLabel: "-$2.1M" }, { label: "Y2", revenue: 3.0, opProfit: -0.7, revLabel: "$3.0M", opLabel: "-$0.7M" }, { label: "Y3", revenue: 10.8, opProfit: 5.34, revLabel: "$10.8M", opLabel: "$5.3M" }, { label: "Y4", revenue: 25.2, opProfit: 13.35, revLabel: "$25.2M", opLabel: "$13.4M" }, { label: "Y5", revenue: 49.5, opProfit: 26.91, revLabel: "$49.5M", opLabel: "$26.9M" }],
  };
  const d = mode === "conservative" ? conservative : blitz;
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ ...h3L, fontSize: 17, marginRight: 8 }}>5-YEAR MARGIN EXPANSION MODEL</div>
        {[{ k: "conservative", l: "Capital Preservation" }, { k: "blitz", l: "Blitzscaling" }].map(opt => (
          <button key={opt.k} onClick={() => setMode(opt.k)} style={{
            padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5,
            border: `1px solid ${mode === opt.k ? C.gold : C.creamDark + "55"}`,
            background: mode === opt.k ? C.gold + "22" : C.greenPrimary,
            color: mode === opt.k ? C.gold : C.creamDark,
            transition: "all 0.2s ease",
          }}>{opt.l}</button>
        ))}
      </div>
      {mode === "blitz" && (
        <div style={{ padding: "12px 16px", background: C.gold + "11", borderRadius: 6, border: `1px solid ${C.gold}33`, marginBottom: 16 }}>
          <p style={{ ...bodyL, fontSize: 12.5 }}><span style={{ color: C.gold, fontWeight: 500 }}>Blitzscaling model:</span> 40% of annual revenue is redeployed into marketing and distribution, driving ~2× subscriber growth by Year 5 (1M vs. 500K subs) and nearly doubling top-line revenue ($49.5M vs. $25.5M). The tradeoff: operating margins stabilize around 54% instead of 89% - still highly profitable, but optimized for market capture over margin preservation.</p>
        </div>
      )}
      <DataTable headers={["Year", "Paid Subs", "Avg $/mo", "Revenue", "GM %", "Mktg", "Op. Profit", "Op. Margin"]} rows={d.rows} />
      <DualBarChart data={d.chart} />
      <div style={{ marginTop: 16, padding: "16px 20px", background: C.greenPrimary, borderRadius: 8, border: `1px solid ${C.greenMid}33` }}>
        <p style={{ ...bodyL, fontSize: 12.5, lineHeight: 1.6 }}><span style={{ color: C.gold, fontWeight: 500 }}>*</span> {mode === "conservative" ? "This model assumes a conservative capital deployment strategy - retaining 80%+ operating margin by Year 5 and banking profit rather than aggressively reinvesting. However, if we chose to redeploy 40% of annual revenue back into marketing and distribution, subscriber growth could accelerate to 1M+ subs and nearly $50M ARR by Year 5. The tradeoff is margin predictability vs. growth velocity - and we have the flexibility to make that decision from a position of strength, not necessity. Toggle to \"Blitzscaling\" above to see the upside case." : "This model reinvests 40% of annual revenue into distribution to maximize market capture during the critical land-grab window. Operating margins are lower (54% vs. 89%) but still highly profitable - and the subscriber base and revenue curve are nearly 2× the conservative plan. The decision between these strategies can be made dynamically based on early conversion data, retention metrics, and competitive landscape. We are not locked into either path."}</p>
      </div>
    </div>
  );
}

/* ===== DUAL BAR CHART ===== */
function DualBarChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.revenue, Math.abs(d.opProfit)]));
  return (
    <div style={{ margin: "24px 0" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 210, padding: "0 0 36px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", width: "100%", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "40%", maxWidth: 36 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.goldLight, whiteSpace: "nowrap", marginBottom: 4 }}>{d.revLabel}</span>
                <div style={{ width: "100%", height: `${(d.revenue / maxVal) * 150}px`, background: `linear-gradient(180deg, ${C.greenAccent}, ${C.greenPrimary})`, borderRadius: "3px 3px 0 0" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "40%", maxWidth: 36 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: d.opProfit >= 0 ? C.gold : C.red, whiteSpace: "nowrap", marginBottom: 4 }}>{d.opLabel}</span>
                {d.opProfit > 0 ? <div style={{ width: "100%", height: `${(d.opProfit / maxVal) * 150}px`, background: `linear-gradient(180deg, ${C.gold}, ${C.goldDark})`, borderRadius: "3px 3px 0 0" }} /> : <div style={{ width: "100%", height: 6, background: C.red + "66", borderRadius: 3 }} />}
              </div>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, marginTop: 4 }}>{d.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: C.greenAccent }} /><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>Revenue</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: C.gold }} /><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>Operating Profit</span></div>
      </div>
    </div>
  );
}

/** Live demo iframe: aspect + chrome for Mobile / Tablet / Computer toggles (slide 09). */
const DEMO_FRAME_MAX_HEIGHT_PX = 800;
const DEMO_BEZEL_BG = "linear-gradient(160deg, #3a3a3a 0%, #242424 100%)";
const DEMO_BEZEL_BORDER_OUTER = "#2a2a2a";
const DEMO_BEZEL_BORDER_INNER = "#151515";

const DEMO_VIEWPORT_PRESETS = {
  /** Same max frame height across modes so the slide fits on a laptop screen without excess vertical scroll. */
  mobile: {
    /** Slightly wider than 390 so the live demo reads less cramped at the shared max frame height. */
    aspectW: 408,
    aspectH: 844,
    maxW: 408,
    outerR: 28,
    innerR: 20,
    pad: 10,
    maxFrameHeightPx: DEMO_FRAME_MAX_HEIGHT_PX,
  },
  tablet: {
    aspectW: 834,
    aspectH: 1194,
    maxW: 720,
    outerR: 22,
    innerR: 14,
    pad: 10,
    maxFrameHeightPx: DEMO_FRAME_MAX_HEIGHT_PX,
  },
  computer: {
    aspectW: 16,
    aspectH: 10,
    maxW: 1280,
    outerR: 14,
    innerR: 10,
    pad: 8,
    maxFrameHeightPx: DEMO_FRAME_MAX_HEIGHT_PX,
  },
};

function DemoViewportIcon({ variant, color }) {
  const s = { width: 22, height: 22, display: "block", flexShrink: 0 };
  if (variant === "mobile") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden>
        <rect x="8" y="2" width="8" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
      </svg>
    );
  }
  if (variant === "tablet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden>
        <rect x="5" y="3" width="14" height="18" rx="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden>
      <rect x="2" y="4" width="20" height="12" rx="1.5" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

/* ===== MAIN DECK (public /deck - slash deck, palette aligned with Pitch Deck v5) ===== */
export default function PitchDeckSlash({
  /** When true (e.g. after `DeckUnlockGate` on `/deck`), skip cover password. */
  gateAutoUnlocked = false,
  /** When true, slide 09 embeds `/garage?deckEmbed=1` in a phone frame (same session as this origin). */
  embedLiveProductDemo = false,
} = {}) {
  const [unlocked, setUnlocked] = useState(() => (gateAutoUnlocked ? true : false));
  const [unlockMode, setUnlockMode] = useState(() => (gateAutoUnlocked ? "pitch" : "valet"));
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [demoViewport, setDemoViewport] = useState("mobile");

  useEffect(() => {
    if (gateAutoUnlocked) {
      setUnlocked(true);
      setUnlockMode("pitch");
      return;
    }
    const s = readDeckSession();
    if (s) {
      setUnlocked(true);
      setUnlockMode(s.m);
    } else {
      setUnlocked(false);
      setUnlockMode("valet");
    }
  }, [gateAutoUnlocked]);

  const VALET_PASS = "Valet2026";
  const PITCH_PASS = "Pitch2026";
  const handleUnlock = () => {
    const normalized = pw.trim().toLowerCase();
    if (normalized === VALET_PASS.toLowerCase()) {
      setUnlockMode("valet");
      setUnlocked(true);
      writeDeckSession("valet");
      setPwError(false);
      return;
    }
    if (normalized === PITCH_PASS.toLowerCase()) {
      setUnlockMode("pitch");
      setUnlocked(true);
      writeDeckSession("pitch");
      setPwError(false);
      return;
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 1500);
    }
  };
  const sec = (bg = C.cream) => ({ background: bg, padding: "80px 24px", maxWidth: "100%" });
  const inner = { maxWidth: 860, margin: "0 auto" };
  const h2 = { fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: "clamp(26px, 4vw, 38px)", color: C.greenDeep, lineHeight: 1.1, textTransform: "uppercase" };
  const h2L = { ...h2, color: C.cream };
  const h3L = { fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.gold, lineHeight: 1.15, textTransform: "uppercase" };
  const body = { fontFamily: "'Outfit', sans-serif", fontSize: 15, color: C.charcoalLight, lineHeight: 1.7 };
  const bodyL = { ...body, color: C.creamDark };
  const acc = { fontFamily: "'Saira', sans-serif", fontWeight: 100, fontSize: 15, color: C.charcoalLight, letterSpacing: 1 };
  const mono = { fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold, letterSpacing: 1 };

  const demoVp = DEMO_VIEWPORT_PRESETS[demoViewport] ?? DEMO_VIEWPORT_PRESETS.mobile;
  const demoAspectRatio = `${demoVp.aspectW} / ${demoVp.aspectH}`;
  const demoFrameMaxW =
    demoVp.maxFrameHeightPx != null
      ? Math.min(demoVp.maxW, (demoVp.maxFrameHeightPx * demoVp.aspectW) / demoVp.aspectH)
      : demoVp.maxW;
  const showDemoContent = unlocked && unlockMode === "pitch";

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      {/* Fonts: loaded in app/layout.tsx <head> - do not use <link> inside this div (invalid HTML / breaks hydration). */}

      {/* ===== COVER ===== */}
      <section style={{ background: C.greenDeep, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 24 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 25% 40%, ${C.greenMid}44 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, ${C.gold}0d 0%, transparent 45%)` }} />
        <div style={{ position: "absolute", top: 32, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}><DeckVMarkImg height={24} /><span style={{ ...mono, fontSize: 10, opacity: 0.45 }}>SEED ROUND · 2026</span></div>
        <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 680 }}>
          <FadeIn><DeckLogoWhiteGoldLineImg maxWidth={320} /></FadeIn>
          <FadeIn delay={0.25}>
            <p style={{ ...bodyL, maxWidth: 540, margin: "28px auto 0", fontSize: 14.5, textAlign: "center" }}>The collector car market is experiencing a generational convergence. Millions of enthusiasts are actively collecting, maintaining, and engaging - but the tools and communities serving them are fragmented, outdated, and disconnected.</p>
            <p style={{ ...bodyL, maxWidth: 540, margin: "12px auto 0", fontSize: 14.5, textAlign: "center", color: C.cream }}>Valet is the first enthusiast platform designed specifically to optimize the ownership experience. The market is proven and growing. The timing is now.</p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div style={{ display: "inline-flex", gap: 20, marginTop: 44, padding: "16px 28px", background: C.greenPrimary + "88", borderRadius: 8, border: `1px solid ${C.greenAccent}33` }}>
              {[{ v: "$3.75M", l: "RAISING" }, { v: "25%", l: "OFFERED" }].map((x, i) => <div key={i} style={{ textAlign: "center", padding: "0 8px" }}><div style={{ ...mono, fontSize: 18, color: C.gold }}>{x.v}</div><div style={{ ...mono, fontSize: 9, color: C.creamDark, marginTop: 2 }}>{x.l}</div></div>)}
            </div>
            {!unlocked && (
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                    placeholder="Password"
                    aria-label="Deck password"
                    style={{
                      height: 38,
                      padding: "0 14px",
                      borderRadius: 8,
                      border: `1px solid ${pwError ? C.red : C.greenAccent + "55"}`,
                      background: "rgba(16, 44, 33, 0.55)",
                      color: C.cream,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      outline: "none",
                      width: 200,
                      letterSpacing: 1,
                      transition: "border-color 0.25s ease, background 0.25s ease",
                      backdropFilter: "blur(6px)",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleUnlock}
                    style={{
                      height: 38,
                      padding: "0 14px",
                      borderRadius: 8,
                      border: `1px solid ${C.gold}44`,
                      background: C.gold + "22",
                      color: C.gold,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      cursor: "pointer",
                      letterSpacing: 1,
                      boxSizing: "border-box",
                    }}
                  >
                    ENTER
                  </button>
                </div>
                {pwError && <span style={{ ...mono, fontSize: 10, color: C.red }}>INCORRECT PASSWORD</span>}
              </div>
            )}
          </FadeIn>
        </div>
        {unlocked ? (
          <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}><span style={{ ...mono, fontSize: 10, opacity: 0.35, animation: "pulse 2s ease infinite" }}>SCROLL ↓</span></div>
        ) : (
          <div />
        )}
        <style>{`@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.6}}`}</style>
      </section>

      {unlocked && <>

      {/* 01 · FOUNDER */}
      <section style={sec(C.cream)}><div style={inner}>
        <FadeIn><SectionTag number={1} label="The Founder" light /><div style={{ ...h2, marginBottom: 20 }}>WHO'S BEHIND THIS</div></FadeIn>
        <FadeIn delay={0.1}>
          <p style={body}>I'm Johnny - 15 years building and scaling go-to-market engines across AI, SaaS, and enterprise technology. Currently Head of GTM and on the founding team at Supernal, where I helped scale the company to over $5M ARR in our first year. Before Supernal, I scaled Invisible AI's operations and GTM engine from $10M to over $120M in annual revenue. Prior to that, I ran revenue operations at SoftBank Robotics, and spent 9 years at Freewheel leading both product strategy and account management.</p>
          <p style={{ ...body, marginTop: 14 }}>Maybe even more importantly, I've built and scaled a business with my own hands - literally. I'm the founder and owner of Borbone Wavecraft, where I scaled handmade surf craft production across two owned factories, growing to become the 5th highest-volume handshaper in the world with global distribution across 5 continents.</p>
          <p style={{ ...body, marginTop: 14 }}>But beyond all of that, I am a car guy and always have been. Over the past 15 years I've bought, owned, and sold 11 cars - and I'm up 121% on those investments. I currently own several collector-grade vehicles that I drive, maintain, and obsess over. Every weekend I'm at a Cars & Coffee, a rally, or deep in a forum thread about a belt service interval on a car I don't even own yet. The idea for Valet came from a simple realization: across the entire collector car culture I've become close to, we're all consumed by the same priorities - understanding what our cars are worth, keeping up with maintenance, and finding the right people to drive with. The ownership experience should be something we enjoy, not something we stress about. That's the problem worth solving.</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap", paddingTop: 10 }}>
            {[{ n: "JOHNNY", r: "CEO / FOUNDER", d: "Serial founder, tech GTM leader, and physical product builder. Product vision, GTM strategy, fundraising, brand. 15yr building and scaling go-to-market engines across AI and enterprise tech - from early-stage to $100M+ ARR. Also built and scaled a global consumer manufacturing business from the ground up. Lifelong automotive enthusiast and active collector.", img: "data:image/png;base64,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" }, { n: "JENS", r: "CTO / COFOUNDER", d: "Full-stack architecture, infrastructure, and production engineering. Most senior AI Platform Engineer at Supernal AI, where he's built enterprise AI platforms currently in production use by the nation's leading transportation brokerages, financial services institutions, and other major organizations. Owns the technical roadmap from current prototype through production scale.", img: "data:image/png;base64,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" }].map((p, i) => (
              <div key={i} style={{ flex: 1, minWidth: 240, background: C.warmWhite, borderRadius: 8, padding: "20px 22px", border: `1px solid ${C.creamDark}`, position: "relative", overflow: "visible" }}>
                <div style={{ position: "absolute", top: -18, right: -10, width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.creamDark}`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}><img src={p.img} alt={p.n} style={{ width: "150%", height: "150%", objectFit: "cover", objectPosition: "center center", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} /></div>
                <div><div style={{ ...mono, fontSize: 11, marginBottom: 2 }}>{p.n} · {p.r}</div></div>
                <div style={{ ...body, fontSize: 13, marginTop: 6 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div></section>

      {/* AGENDA */}
      <section style={{ background: C.greenDeep, padding: "60px 24px" }}>
        <div style={{ ...inner, maxWidth: 640 }}>
          <FadeIn>
            <div style={{ ...mono, fontSize: 11, color: C.goldLight, marginBottom: 16, letterSpacing: 2 }}>AGENDA</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px" }}>
              {[
                "The Moment - Why Now?",
                "How Big Is the Market?",
                "What's the Problem?",
                "How Are We Solving It?",
                "How Are We Making Money?",
                "What Do We Need?",
              ].map((item, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <span style={{ ...mono, fontSize: 11, color: C.gold, opacity: 0.5 }}>{String(i + 2).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: C.creamDark, padding: "2px 0" }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 02 · THE MOMENT + MARKET PROOF */}
      <section style={sec(C.warmWhite)}><div style={inner}>
        <FadeIn><SectionTag number={2} label="The Moment" light /><div style={{ ...h2, marginBottom: 8 }}>THE TIMING COULDN'T BE BETTER</div></FadeIn>
        <FadeIn delay={0.1}><p style={body}>Automotive enthusiasm is experiencing a generational convergence that's never happened before. The millennial cohort that grew up on Top Gear, Initial D, and Fast & Furious is now in peak earning years - buying the cars they dreamed about as teenagers. Simultaneously, Gen Z is entering as the first digitally native generation of car enthusiasts, fueled by YouTube, TikTok, and an online-first culture that treats cars as both lifestyle and content.</p><p style={{ ...body, marginTop: 12, fontWeight: 500, color: C.greenDeep }}>The numbers back this up.</p></FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 340, background: C.cream, borderRadius: 10, padding: 24, border: `1px solid ${C.creamDark}` }}><MontereyChart /></div>
            <div style={{ flex: 1, minWidth: 340, background: C.cream, borderRadius: 10, padding: 24, border: `1px solid ${C.creamDark}` }}><AssetChart /></div>
          </div>
        </FadeIn>

        {/* MARKET PROOF - Q1 2026 */}
        <FadeIn delay={0.35}>
          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: "clamp(22px, 3.5vw, 32px)", color: C.greenDeep, lineHeight: 1.1, textTransform: "uppercase", marginBottom: 8 }}>Q1 2026 SHATTERED EVERY RECORD</div>
            <p style={{ ...acc, marginBottom: 24 }}>The collector car auction market just had its biggest quarter in history.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.4}><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><StatCard value="$441M" label="Mecum Kissimmee - most successful collector car auction in history" sub="140K+ attendees · 54 lots over $1M" /><StatCard value="$111M" label="Broad Arrow Amelia - highest-grossing in 31 years" sub="92% sell-through · 13 world records" /><StatCard value="$70.4M" label="Gooding Christie's Amelia - best since 2010" sub="94% sell-through · +8% YoY" /></div></FadeIn>
        <FadeIn delay={0.45}><DataTable light caption="Notable Q1 2026 results" headers={["Vehicle", "Price", "Auction", "Note"]} rows={[["1962 Ferrari 250 GTO", "$38.5M", "Mecum", "Only factory white GTO"], ["2003 Ferrari Enzo (Bachman)", "$17.9M", "Mecum", "3× prior model record"], ["1960 Ferrari 250 GT Cal. Spider", "$16.5M", "Gooding", "Top FL Spring '26"], ["1995 Ferrari F50 (Bachman)", "$12.0M", "Mecum", "New model record"], ["2005 Porsche Carrera GT", "$6.7M", "Broad Arrow", "2× prior record"], ["1972 Lamborghini Miura P400 SV", "$6.6M", "Broad Arrow", "New model record"]]} /></FadeIn>

        {/* NUANCED MARKET - cream background to pop */}
        <FadeIn delay={0.5}><div style={{ background: C.cream, borderRadius: 10, padding: 28, marginTop: 24, border: `1px solid ${C.creamDark}`, borderLeft: `3px solid ${C.gold}` }}>
          <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.greenDeep, textTransform: "uppercase", marginBottom: 12 }}>A MORE NUANCED MARKET - AND WHY THAT'S THE POINT</div>
          <p style={{ ...body, fontSize: 14 }}>What makes the current market so interesting is that it's becoming increasingly segmented. Certain categories - rare-spec modern supercars, low-mileage halo Ferraris, analog-era Porsches - are appreciating at record-breaking rates, while other segments are moving at a different pace. Total January auction volume surged from $446M to $678M year-over-year, but the composition varied dramatically by marque, era, and specification.</p>
          <p style={{ ...body, fontSize: 14, marginTop: 12 }}>The collector car ecosystem is no longer one market - it's dozens of micro-markets, each driven by its own supply dynamics, generational demand shifts, and specification premiums. A collector making a buy/hold/sell decision needs to understand what's happening with their specific car in their specific segment.</p>
          <p style={{ ...body, fontSize: 14, marginTop: 12, color: C.greenDeep, fontWeight: 500 }}>Generic tools can't keep up with these nuanced trends. VIN-specific intelligence can - and that's exactly what Valet is built to deliver.</p>
        </div></FadeIn>
      </div></section>

      {/* 03 · MARKET OPPORTUNITY */}
      <section style={sec(C.cream)}><div style={inner}>
        <FadeIn><SectionTag number={3} label="Market Opportunity" light /><div style={{ ...h2, marginBottom: 20 }}>BUT HOW BIG IS THIS MARKET?</div></FadeIn>
        <FadeIn delay={0.1}><p style={body}>To answer it lightly - it's <span style={{ fontWeight: 600, color: C.greenDeep }}>massive</span>. Both generations care deeply about owning, maintaining, and connecting around their cars. We frame the market through our two product surfaces.</p></FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
            <div style={{ flex: 1, minWidth: 280, background: C.greenDeep, borderRadius: 10, padding: 28, border: `1px solid ${C.greenMid}44` }}>
              <div style={{ ...mono, marginBottom: 14, color: C.goldLight }}>REACHABLE ENTHUSIAST AUDIENCE</div>
              <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 52, color: C.cream, lineHeight: 1 }}>~50M+</div>
              <p style={{ ...bodyL, fontSize: 13.5, marginTop: 10 }}>unique followers across the automotive influencer ecosystem (62.8M raw, ~10% deduplication). Enthusiasts who care about both the value of their cars and the culture - Garage and Communities users alike.</p>
              <div style={{ ...mono, fontSize: 10, marginTop: 12, color: C.goldLight }}>CHANNEL: INFLUENCER PARTNERSHIPS + EVENT ACTIVATIONS</div>
            </div>
            <div style={{ flex: 1, minWidth: 280, background: C.greenDeep, borderRadius: 10, padding: 28, border: `1px solid ${C.gold}33` }}>
              <div style={{ ...mono, marginBottom: 14 }}>EXISTING PAID COMMUNITY MARKET</div>
              <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 52, color: C.gold, lineHeight: 1 }}>4.9M</div>
              <p style={{ ...bodyL, fontSize: 13.5, marginTop: 10 }}>active paid subscribers across legacy forums paying ~$77/year avg for an experience that's ad-heavy, not localized, and not event-driven. They already accept "pay to belong."</p>
              <div style={{ ...mono, fontSize: 10, marginTop: 12 }}>VALET: $2/MO ($24/YR) - SUPERIOR EXPERIENCE, FRACTION OF COST</div>
            </div>
          </div>
        </FadeIn>
      </div></section>

      {/* 04 · ENTHUSIAST PRIORITIES */}
      <section style={sec(C.cream)}><div style={inner}>
        <FadeIn><SectionTag number={4} label="The Problem" light /><div style={{ ...h2, marginBottom: 8 }}>EVERY COLLECTOR HAS THE SAME TWO PRIORITIES</div><p style={{ ...acc, marginBottom: 28 }}>Whether you own one car or ten, it always comes back to the same two things: managing the investment and actually enjoying the car.</p></FadeIn>

        {/* PRIORITY 1 */}
        <FadeIn delay={0.1}>
          <div style={{ background: C.greenDeep, borderRadius: 10, padding: 28, border: `1px solid ${C.greenMid}44`, marginBottom: 20 }}>
            <div style={{ ...h3L, marginBottom: 14 }}>PRIORITY 1 - MANAGING THE OWNERSHIP</div>
            <p style={bodyL}>The real stress of owning a collector car isn't writing the check - it's everything that comes after. Every owner is constantly navigating the same questions: What is my car actually worth? Where is that value heading? What maintenance is coming, and will spending that money protect or increase the car's value? Am I net positive or net negative after years of carrying costs?</p>
            <p style={{ ...bodyL, marginTop: 10 }}>These aren't optional questions - they drive every buy, hold, and sell decision. And right now, the tools available to answer them are broken.</p>

            <div style={{ marginTop: 24 }}>
              {[
                { num: "01", title: "Valuations without context", desc: "Hagerty gives you a directional number that shifts weekly and doesn't account for your specific car. KBB averages a 30%+ discrepancy on collector-grade vehicles. Neither tells you where the value is heading or what's driving trends in your segment." },
                { num: "02", title: "Maintenance as a black box", desc: "No forward-looking roadmap - what's due, when, and what it costs. Worse, no tool connects maintenance spend to value impact. A $4,200 belt service might protect $12,000 in appreciation, but owners have no visibility into that math." },
                { num: "03", title: "No picture of true return", desc: "Insurance, storage, registration, fuel, detailing, scheduled and unscheduled service - it all adds up. But nothing aggregates carrying costs against appreciation to show the real net return. The difference between a smart hold and a money pit stays invisible." },
                { num: "04", title: "The analog reality", desc: "Manila folders of printed receipts. Waiting for your mechanic to call. The dental appointment model applied to six-figure assets. That barely works for one car - it breaks completely at three, five, or ten." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderTop: i === 0 ? `1px solid ${C.greenMid}44` : `1px solid ${C.greenMid}22`, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.gold, opacity: 0.5, flexShrink: 0, paddingTop: 2 }}>{item.num}</span>
                  <div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: C.cream, fontWeight: 500 }}>{item.title}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark }}> - {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ ...bodyL, marginTop: 20, color: C.gold, fontWeight: 500, fontSize: 14 }}>The ownership experience is a constant source of low-grade stress that keeps collectors from doing what they actually want - enjoying the car.</p>
          </div>
        </FadeIn>

        {/* PRIORITY 2 */}
        <FadeIn delay={0.2}>
          <div style={{ background: C.greenDeep, borderRadius: 10, padding: 28, border: `1px solid ${C.greenMid}44` }}>
            <div style={{ ...h3L, marginBottom: 14 }}>PRIORITY 2 - ACTUALLY ENJOYING THE CAR</div>
            <p style={bodyL}>Owning a collector car isn't just about the spreadsheet. It's about the drive. The weekend rally. The Cars & Coffee where you park next to someone with the same obscure model and spend an hour talking about it. But right now, the social infrastructure for this community is completely fragmented.</p>

            {/* Fragmented forums - visual callout */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {["FerrariChat", "LotusTalk", "Rennlist", "6SpeedOnline"].map((f, i) => (
                <div key={i} style={{ padding: "6px 14px", background: C.greenPrimary, borderRadius: 20, border: `1px solid ${C.greenMid}44` }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: C.creamDark }}>{f}</span>
                </div>
              ))}
              <div style={{ padding: "6px 14px", display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: C.muted, fontStyle: "italic" }}>all ad-heavy, visually dated, not built for local events</span>
              </div>
            </div>

            {/* The scenario - two-panel moment */}
            <div style={{ background: C.greenPrimary, borderRadius: 8, padding: "18px 20px", borderLeft: `3px solid ${C.gold}` }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: C.cream, lineHeight: 1.65 }}>
                Every enthusiast has lived this: you take your car to a show, park next to someone with an incredible build, talk for an hour, hit it off - and then leave without exchanging contact information. <span style={{ color: C.gold, fontWeight: 500 }}>There's simply no way to reconnect with the people you meet in the real world through the cars you share in common.</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* THE GAP */}
        <FadeIn delay={0.25}>
          <div style={{ background: C.greenDeep, borderRadius: 10, padding: "22px 28px", marginTop: 20, borderLeft: `3px solid ${C.gold}` }}>
            <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>THE GAP NO ONE HAS CLOSED</div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: C.cream, lineHeight: 1.6, fontWeight: 500 }}>No single platform connects the ownership experience - value, maintenance, costs - with the community experience - events, relationships, local networks - in a way that actually helps you enjoy the car more. These two priorities have always been linked, but every tool on the market treats them as separate problems.</p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: C.gold, lineHeight: 1.6, marginTop: 10, fontWeight: 500 }}>That's what Valet is built to solve.</p>
          </div>
        </FadeIn>
      </div></section>

      {/* 05 · THE SOLUTION - NATURAL FLOW WITH CRITICAL INSIGHT */}
      <section style={{ background: C.greenDeep, padding: "100px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${C.greenMid}33 0%, transparent 60%)` }} />
        <div style={{ ...inner, position: "relative", zIndex: 1 }}>
          <FadeIn style={{ textAlign: "center" }}>
            <SectionTag number={5} label="The Solution" />
            <DeckLogoWhiteGoldLineImg maxWidth={300} style={{ marginTop: 8, marginLeft: "auto", marginRight: "auto", display: "block" }} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ ...bodyL, maxWidth: 640, margin: "28px auto 0", textAlign: "center", fontSize: 16 }}>Valet is the automotive community's first consumer platform that both enables and enhances our favorite parts of the automotive lifestyle - collecting cars and connecting with our community.</p>
            <p style={{ ...bodyL, maxWidth: 640, margin: "12px auto 0", textAlign: "center", fontSize: 14, color: C.goldLight }}>Portfolio intelligence meets concierge ownership meets social network - unified by your VIN.</p>
          </FadeIn>

          {/* SIDE BY SIDE: GARAGE + COMMUNITIES */}
          <FadeIn delay={0.35}>
            <div style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap", alignItems: "stretch" }}>

              {/* GARAGE */}
              <div style={{ flex: 1, minWidth: 320, background: C.greenPrimary, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.greenAccent}44`, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px 26px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ ...h3L, fontSize: 24, color: C.cream }}>GARAGE</div>
                    <div style={{ padding: "4px 12px", background: C.greenDeep, borderRadius: 20, ...mono, fontSize: 10, color: C.creamDark }}>FREE</div>
                  </div>
                  <p style={{ ...bodyL, fontSize: 13.5, marginTop: 12 }}>The moment you add a VIN, Valet generates a complete financial ownership profile - powered by our proprietary knowledge corpus and custom RAG workflow.</p>
                </div>

                {/* Features - structured with left accent */}
                <div style={{ padding: "16px 26px", flex: 1 }}>
                  {[
                    { t: "Real-Time FMV", d: "VIN-specific valuation that accounts for your exact year, trim, mileage, options, and condition - not a generic range." },
                    { t: "5-Year Forecast", d: "Forward-looking projection so you can make buy/hold/sell decisions with data, not forum speculation." },
                    { t: "Carrying-Cost Curve", d: "Aligns your maintenance spend against appreciation/depreciation so you see the true return on ownership." },
                    { t: "Maintenance Roadmap", d: "Upcoming intervals, estimated costs, and scheduling - no more surprise $8K belt services." },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 3, borderRadius: 2, background: C.gold + "66", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: C.cream, fontWeight: 500 }}>{f.t}</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark }}> - {f.d}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Garage card mock */}
                <div style={{ margin: "0 26px 20px", background: C.greenDeep, borderRadius: 8, padding: "16px 18px", border: `1px solid ${C.greenMid}33` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ ...mono, fontSize: 9, color: C.creamDark }}>YOUR GARAGE</div>
                    <Badge size={16} />
                  </div>
                  <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.cream }}>2004 FERRARI</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.creamDark }}>360 Spider · F1</div>
                  <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                    <div><div style={{ ...mono, fontSize: 8, color: C.muted }}>VALUE</div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.gold }}>$128,500</div></div>
                    <div><div style={{ ...mono, fontSize: 8, color: C.muted }}>TREND</div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.goldLight }}>+12.4%</div></div>
                    <div><div style={{ ...mono, fontSize: 8, color: C.muted }}>NEXT SERVICE</div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.creamDark }}>$4,200</div></div>
                  </div>
                </div>
              </div>

              {/* COMMUNITIES */}
              <div style={{ flex: 1, minWidth: 320, background: C.greenPrimary, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gold}33`, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px 26px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ ...h3L, fontSize: 24, color: C.cream }}>COMMUNITIES</div>
                    <div style={{ padding: "4px 12px", background: C.gold + "22", borderRadius: 20, border: `1px solid ${C.gold}44`, ...mono, fontSize: 10, color: C.gold }}>$2/MO</div>
                  </div>
                  <p style={{ ...bodyL, fontSize: 13.5, marginTop: 12 }}>Your VIN auto-places you into niche, local communities for the marques and models you own - organized around events and real-world connections, not forum threads.</p>
                </div>

                {/* Features */}
                <div style={{ padding: "16px 26px", flex: 1 }}>
                  {[
                    { t: "VIN-Driven Placement", d: "Add a car and instantly join communities specific to your marque, model, and region." },
                    { t: "Event-Driven Content", d: "Concourses, rallies, Cars & Coffee - high-signal content organized around real-world gatherings." },
                    { t: "Event-Photo Tagging", d: "Upload photos, tag the event and the cars. Both owners are now connected forever through that moment." },
                    { t: "Local Networking", d: "Build a real network of people you actually want to drive with - not anonymous forum handles." },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 3, borderRadius: 2, background: C.gold + "66", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: C.cream, fontWeight: 500 }}>{f.t}</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark }}> - {f.d}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Community invite mock */}
                <div style={{ margin: "0 26px 12px", background: C.greenDeep, borderRadius: 8, padding: "16px 18px", border: `1px solid ${C.gold}22` }}>
                  <div style={{ ...mono, fontSize: 9, color: C.gold, marginBottom: 6 }}>COMMUNITY INVITE</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: C.cream }}>You've been selected to join <span style={{ color: C.gold, fontWeight: 500 }}>Ferrari 360 Owners - Los Angeles</span></div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.creamDark, marginTop: 6 }}>23 members · 4 events this month · 12 new photos</div>
                </div>

                {/* Pricing comparison */}
                <div style={{ margin: "0 26px 20px", display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, padding: "10px 12px", background: C.greenDeep, borderRadius: 6, textAlign: "center", border: `1px solid ${C.gold}33` }}>
                    <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.gold }}>$24/yr</div>
                    <div style={{ ...mono, fontSize: 8, color: C.creamDark }}>VALET</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px", background: C.greenDeep, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.creamDark }}>$77/yr</div>
                    <div style={{ ...mono, fontSize: 8, color: C.muted }}>LEGACY FORUMS</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px", background: C.greenDeep, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 22, color: C.gold }}>69%</div>
                    <div style={{ ...mono, fontSize: 8, color: C.creamDark }}>SAVINGS</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* CRITICAL INSIGHT - standalone moment */}
          <FadeIn delay={0.45}>
            <div style={{ marginTop: 24, padding: 28, background: C.greenPrimary, borderRadius: 10, border: `1px solid ${C.gold}33` }}>
              <div style={{ ...h3L, fontSize: 17, marginBottom: 16 }}>THE CRITICAL INSIGHT</div>
              <p style={{ ...bodyL, fontSize: 14, marginBottom: 16 }}>Garage reframes the car as an asset with a measurable return curve - not a hobby expense bucket. Most owners experience maintenance as disconnected costs. Valet aligns those timelines so you understand the real impact on net return.</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240, padding: "16px 18px", background: C.greenDeep, borderRadius: 8, border: `1px solid ${C.greenMid}33` }}>
                  <div style={{ ...mono, fontSize: 10, color: C.red, marginBottom: 6 }}>WITHOUT VALET</div>
                  <p style={{ ...bodyL, fontSize: 14, fontStyle: "italic" }}>"I spent $4,200 on tires and a belt service this quarter."</p>
                </div>
                <div style={{ flex: 1, minWidth: 240, padding: "16px 18px", background: C.greenDeep, borderRadius: 8, border: `1px solid ${C.gold}44` }}>
                  <div style={{ ...mono, fontSize: 10, marginBottom: 6 }}>WITH VALET</div>
                  <p style={{ ...bodyL, fontSize: 14, fontStyle: "italic", color: C.cream }}>"My $4,200 in maintenance protected $12,000 in appreciation and moved my net return from 14% to 19%."</p>
                </div>
              </div>
            </div>
          </FadeIn>


        </div>
      </section>

      {/* 06 · COMPETITION */}
      <section style={sec(C.cream)}><div style={inner}>
        <FadeIn><SectionTag number={6} label="Competition" light /><div style={{ ...h2, marginBottom: 8 }}>HOW VALET STACKS UP AGAINST EVERYTHING ELSE</div><p style={{ ...body, marginBottom: 24 }}>Across every dimension of what collectors actually need, the existing tools and platforms fall short - leaving critical gaps that force owners into manual, disconnected workarounds. Here's how the landscape breaks down.</p></FadeIn>
        <FadeIn delay={0.12}><CompetitiveBenchmark /></FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ ...h2, marginTop: 28, marginBottom: 20, fontSize: "clamp(22px, 3.2vw, 30px)" }}>BUT HOW GOOD ARE WE?</div>
        </FadeIn>
        <FadeIn delay={0.24}>
          <div
            style={{
              background: C.cream,
              borderRadius: 10,
              padding: "24px 22px",
              border: `1px solid ${C.creamDark}`,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <DeckCrossMetricBenchmarkChart />
          </div>
        </FadeIn>
      </div></section>

      {/* 07 · PRODUCT DEMO */}
      <section style={{ background: C.greenDeep, padding: "100px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${C.greenMid}22 0%, transparent 55%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ ...inner, textAlign: "center" }}>
            <FadeIn>
              <SectionTag number={7} label="Product Demo" />
              <div style={{ ...h2L, marginBottom: embedLiveProductDemo ? 16 : 24 }}>SEE VALET IN ACTION</div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            {showDemoContent ? (
              embedLiveProductDemo ? (
                <>
                <div
                  role="tablist"
                  aria-label="Demo preview size"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 4,
                      padding: 4,
                      borderRadius: 10,
                      background: `${C.greenDeep}aa`,
                      border: `1px solid ${C.greenAccent}44`,
                    }}
                  >
                    {[
                      { id: "mobile", ariaLabel: "Mobile preview" },
                      { id: "tablet", ariaLabel: "Tablet preview" },
                      { id: "computer", ariaLabel: "Desktop preview" },
                    ].map((tab) => {
                      const active = demoViewport === tab.id;
                      const iconColor = active ? C.cream : C.creamDark;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-label={tab.ariaLabel}
                          aria-selected={active}
                          onClick={() => setDemoViewport(tab.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 40,
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            background: active ? `${C.gold}33` : "transparent",
                            boxShadow: active ? `inset 0 0 0 1px ${C.gold}55` : "none",
                          }}
                        >
                          <DemoViewportIcon variant={tab.id} color={iconColor} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%", overscrollBehavior: "contain" }}>
                  <div
                    style={{
                      width: `min(${demoFrameMaxW}px, calc(100vw - 48px))`,
                      maxWidth: demoFrameMaxW,
                      borderRadius: demoVp.outerR,
                      padding: demoVp.pad,
                      border: `2px solid ${DEMO_BEZEL_BORDER_OUTER}`,
                      background: DEMO_BEZEL_BG,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                      overscrollBehavior: "contain",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: demoAspectRatio,
                        borderRadius: demoVp.innerR,
                        overflow: "hidden",
                        border: `1px solid ${DEMO_BEZEL_BORDER_INNER}`,
                        background: C.charcoal,
                        overscrollBehavior: "contain",
                      }}
                    >
                      <iframe
                        title="Valet interactive product demo"
                        src={DECK_DEMO_IFRAME_SRC}
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                          background: C.cream,
                          overscrollBehavior: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
                </>
              ) : (
                <div style={{ ...inner, textAlign: "center" }}>
                  <div style={{ background: C.greenPrimary, borderRadius: 12, padding: "80px 40px", border: `1px solid ${C.greenAccent}44`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.gold + "22", border: `2px solid ${C.gold}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="8,5 19,12 8,19" fill={C.gold} /></svg>
                    </div>
                    <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 24, color: C.cream }}>PRODUCT DEMO VIDEO</div>
                    <p style={{ ...bodyL, fontSize: 14, maxWidth: 420, color: C.creamDark }}>A walkthrough of the Valet experience - from VIN entry to financial profile to community placement.</p>
                  </div>
                </div>
              )
            ) : (
              <div style={{ ...inner, textAlign: "center" }}>
                <div
                  style={{
                    background: `${C.greenPrimary}cc`,
                    borderRadius: 12,
                    padding: "56px 34px",
                    border: `1px solid ${C.greenAccent}44`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                    maxWidth: 820,
                    margin: "0 auto",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${C.gold}14 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${C.greenMid}22 0%, transparent 55%)` }} />
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 14,
                        background: "rgba(16, 44, 33, 0.55)",
                        border: `1px solid ${C.gold}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(6px)",
                      }}
                      aria-hidden
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke={C.gold} strokeWidth="1.75" strokeLinecap="round" />
                        <path d="M7.5 10h9A2.5 2.5 0 0 1 19 12.5v5A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5v-5A2.5 2.5 0 0 1 7.5 10Z" stroke={C.gold} strokeWidth="1.75" />
                        <path d="M12 14v3" stroke={C.gold} strokeWidth="1.75" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 24, color: C.cream }}>
                      DEMO AVAILABLE ON LIVE PITCHES
                    </div>
                    <p style={{ ...bodyL, fontSize: 14, maxWidth: 520, color: C.creamDark, margin: 0 }}>
                      The interactive product demo is shown only during live pitches.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 08 · REVENUE + FINANCIAL MODEL */}
      <section style={sec(C.greenDeep)}><div style={inner}>
        <FadeIn><SectionTag number={8} label="Revenue & Financial Model" /><div style={{ ...h2L, marginBottom: 20 }}>HOW VALET MAKES MONEY - AND THE PATH TO $50M+ ARR</div></FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ ...h3L, fontSize: 17, marginBottom: 14 }}>PRICING LADDER</div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{[{ p: "'26 Launch → Q2 '27", v: "$2/mo" }, { p: "Q3 '27 → '27", v: "$3/mo" }, { p: "'28 → '30", v: "$5/mo" }, { p: "'30+", v: "$7/mo" }].map((t, i) => <div key={i} style={{ flex: 1, minWidth: 120, background: C.greenPrimary, borderRadius: 6, padding: "16px 14px", textAlign: "center", border: `1px solid ${C.greenAccent}33` }}><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 28, color: C.gold }}>{t.v}</div><div style={{ ...mono, fontSize: 9, color: C.creamDark, marginTop: 4 }}>{t.p}</div></div>)}</div>
        </FadeIn>
        <FadeIn delay={0.15}><div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", background: C.greenPrimary, borderRadius: 8, padding: 22, marginTop: 20, border: `1px solid ${C.gold}22` }}><div><div style={{ ...mono, fontSize: 10, marginBottom: 4 }}>UNIT ECONOMICS</div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 38, color: C.gold }}>$0.40</div><div style={{ ...bodyL, fontSize: 12 }}>per new car added</div></div><div style={{ flex: 1, minWidth: 200 }}><p style={{ ...bodyL, fontSize: 13 }}>Controlled loss leader at highest intent. Enterprise LLM licensing + vendor contracts improve unit cost at scale. At 70% conversion and $2/mo, payback is immediate.</p></div></div></FadeIn>
        <FadeIn delay={0.2}><FinancialModelToggle mono={mono} bodyL={bodyL} h3L={h3L} /></FadeIn>
      </div></section>

      
      {/* 09 · CAP TABLE */}
      <section style={sec(C.cream)}><div style={inner}>
        <FadeIn><SectionTag number={9} label="Cap Table" light /><div style={{ ...h2, marginBottom: 20 }}>PROACTIVE DILUTION FOR CRITICAL OPERATING STRUCTURE</div></FadeIn>
        <FadeIn delay={0.1}><DataTable light caption="Post-Close · Fully Diluted = 10,000,000 shares" headers={["Holder", "Shares", "% Ownership"]} rows={[["Johnny (Common)", "3,600,000", "36.00%"], ["Jens (Common)", "2,400,000", "24.00%"], ["Option Pool (Reserved)", "1,500,000", "15.00%"], ["Investors (Preferred)", "2,500,000", "25.00%"], ["Total (FD Post)", "10,000,000", "100.00%"]]} /></FadeIn>
        <FadeIn delay={0.2}><div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>{[{ l: "PRICE/SHARE", v: "$1.50" }, { l: "FOUNDER SPLIT", v: "60 / 40" }, { l: "OPTION POOL", v: "15% post-money" }, { l: "VESTING", v: "4yr / 1yr cliff" }, { l: "ENTITY", v: "Delaware C-Corp" }, { l: "ADMIN", v: "Pulley" }].map((x, i) => <div key={i} style={{ background: C.warmWhite, borderRadius: 6, padding: "12px 16px", border: `1px solid ${C.creamDark}`, textAlign: "center" }}><div style={{ ...mono, fontSize: 9, marginBottom: 3 }}>{x.l}</div><div style={{ ...body, fontSize: 14, color: C.greenDeep, fontWeight: 500 }}>{x.v}</div></div>)}</div></FadeIn>
      </div></section>

      {/* 10 · THE ASK */}
      <section style={{ background: C.cream, padding: "100px 24px" }}><div style={inner}>
        <FadeIn><SectionTag number={10} label="The Ask" light /><div style={{ ...h2, marginBottom: 28 }}>WE'RE RAISING $3.75M TO GO FROM PROTOTYPE TO PRODUCTION</div></FadeIn>
        <FadeIn delay={0.15}><div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}><StatCard value="$3.75M" label="Seed round (equity)" /><StatCard value="$11.25M" label="Pre-money valuation" /><StatCard value="$15M" label="Post-money valuation" /><StatCard value="25%" label="Investor ownership" /></div></FadeIn>
        <FadeIn delay={0.25}><div style={{ background: C.greenDeep, borderRadius: 10, padding: 28, marginTop: 28, border: `1px solid ${C.gold}33`, borderLeft: `3px solid ${C.gold}`, textAlign: "left" }}><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 20, color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>THE CORE PRINCIPLE</div><p style={{ ...bodyL, fontSize: 15, color: C.cream }}>This round funds a full build → production hardening → launch → retention-proof cycle without putting the company back into fundraising mode, while explicitly reserving 2 years of core founder + engineering salary runway.</p></div></FadeIn>
      </div></section>

      {/* 11 · USE OF FUNDS - INTERACTIVE */}
      <section style={sec(C.greenDeep)}><div style={inner}>
        <FadeIn><SectionTag number={11} label="Use of Funds" /><div style={{ ...h2L, marginBottom: 24 }}>WHERE EVERY DOLLAR GOES</div></FadeIn>
        <FadeIn delay={0.15}><UseOfFundsInteractive /></FadeIn>
        <FadeIn delay={0.25}><div style={{ background: C.greenPrimary, borderRadius: 8, padding: 22, marginTop: 24, border: `1px solid ${C.greenMid}44` }}><p style={{ ...bodyL, fontSize: 14, color: C.gold }}>Y1: $1.90M · Y2: $1.85M · Total: $3.75M. Core salaries protected for 2 full years ($1.15M). Distribution is front-loaded Y1 and managed as a performance lever. Contractors sit under G&A so the runway reads as core team only.</p></div></FadeIn>
      </div></section>

      {/* 12 · MILESTONES - TIMELINE */}
      <section style={sec(C.greenDeep)}><div style={inner}>
        <FadeIn><SectionTag number={12} label="Milestones" /><div style={{ ...h2L, marginBottom: 24 }}>WHAT THIS MONEY BUYS - THE EXECUTION LADDER</div></FadeIn>
        <FadeIn delay={0.15}><MilestoneTimeline /></FadeIn>
      </div></section>

      {/* CLOSING */}
      <section style={{ background: C.greenDeep, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 24 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${C.greenMid}33 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, ${C.gold}0a 0%, transparent 35%)` }} />
        <div style={{ ...inner, textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeIn><DeckLogoWhiteGoldLineImg maxWidth={400} /></FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ ...bodyL, maxWidth: 540, margin: "24px auto 0", textAlign: "center" }}>The collector car market is experiencing a generational convergence. Millions of enthusiasts are actively collecting, maintaining, and engaging - but the tools serving them haven't evolved in 15 years.</p>
            <p style={{ ...bodyL, maxWidth: 540, margin: "12px auto 0", textAlign: "center", color: C.cream }}>Valet is the first enthusiast platform designed specifically to optimize the ownership experience. The prototype works. The market is proven and growing. The timing is now.</p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div style={{ display: "inline-flex", gap: 24, marginTop: 44, padding: "20px 36px", background: C.greenPrimary + "88", borderRadius: 10, border: `1px solid ${C.gold}33` }}>
              <div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 30, color: C.gold }}>$3.75M SEED</div></div>
              <div style={{ width: 1, background: C.greenAccent + "44" }} />
              <div><div style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 30, color: C.cream }}>LET'S TALK</div></div>
            </div>
            <div style={{ ...mono, fontSize: 11, color: C.creamDark, marginTop: 20 }}>VALET.APP</div>
          </FadeIn>
        </div>
      </section>
      <div style={{ padding: "20px 32px", background: C.greenDeep, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.greenMid}22` }}><DeckVMarkImg height={18} /><span style={{ ...mono, fontSize: 9, opacity: 0.35 }}>CONFIDENTIAL · VALET · SEED 2026</span></div>
      </>}
    </div>
  );
}
