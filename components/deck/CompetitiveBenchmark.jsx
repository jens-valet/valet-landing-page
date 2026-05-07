"use client";

import { useState } from "react";
import { C } from "@/components/deck/pitchDeckColors";

/**
 * Interactive competitor matrix from pitch deck v3 — filterable feature coverage + scores.
 */
export function CompetitiveBenchmark() {
  const [filter, setFilter] = useState("all");
  const featureCols = ["Collector cars", "Forecast", "VIN lookup", "Carrying / maint.", "Community", "Mobile"];
  const competitors = [
    { name: "Valet", type: "all", tag: "Collector + community", collector: "yes", forecast: "yes", vin: "yes", carry: "yes", community: "yes", mobile: "yes", score: 100, isValet: true },
    { name: "Hagerty", sub: "Valuation tools", type: "collector", tag: "Collector-focused", collector: "yes", forecast: "partial", vin: "partial", carry: "no", community: "no", mobile: "partial", score: 70 },
    { name: "Classic.com", sub: "classic.com", type: "collector", tag: "Collector-focused", collector: "yes", forecast: "partial", vin: "no", carry: "no", community: "no", mobile: "partial", score: 58 },
    { name: "Bring a Trailer", sub: "bringatrailer.com", type: "collector", tag: "Collector-focused", collector: "yes", forecast: "no", vin: "no", carry: "no", community: "partial", mobile: "partial", score: 48 },
    { name: "Autofolio", sub: "autofolio.co (UK)", type: "collector", tag: "Collector-focused", collector: "yes", forecast: "no", vin: "no", carry: "no", community: "no", mobile: "no", score: 36 },
    { name: "KBB", sub: "kbb.com", type: "mainstream", tag: "Mainstream", collector: "no", forecast: "no", vin: "yes", carry: "partial", community: "no", mobile: "yes", score: 44 },
    { name: "Edmunds", sub: "edmunds.com", type: "mainstream", tag: "Mainstream", collector: "no", forecast: "no", vin: "yes", carry: "partial", community: "no", mobile: "yes", score: 42 },
    { name: "CarGurus", sub: "cargurus.com", type: "mainstream", tag: "Mainstream", collector: "no", forecast: "no", vin: "yes", carry: "partial", community: "no", mobile: "yes", score: 37 },
    { name: "MarketCheck", sub: "marketcheck.com", type: "mainstream", tag: "Vehicle history", collector: "partial", forecast: "no", vin: "yes", carry: "partial", community: "no", mobile: "partial", score: 47 },
    { name: "NADA Guides", sub: "nadaguides.com", type: "data", tag: "Guides / dealer API", collector: "partial", forecast: "no", vin: "yes", carry: "no", community: "no", mobile: "partial", score: 42 },
    { name: "FerrariChat", sub: "ferrarichat.com", type: "collector", tag: "Legacy forum", collector: "no", forecast: "no", vin: "no", carry: "no", community: "yes", mobile: "no", score: 18 },
    { name: "Rennlist", sub: "rennlist.com", type: "collector", tag: "Legacy forum", collector: "no", forecast: "no", vin: "no", carry: "no", community: "yes", mobile: "no", score: 18 },
    { name: "LotusTalk", sub: "lotustalk.com", type: "collector", tag: "Legacy forum", collector: "no", forecast: "no", vin: "no", carry: "no", community: "yes", mobile: "no", score: 18 },
    { name: "& other online forums", sub: "6SpeedOnline, etc.", type: "collector", tag: "Legacy forum", collector: "no", forecast: "no", vin: "no", carry: "no", community: "yes", mobile: "no", score: 18 },
  ];
  const rows = competitors.filter((c) => c.isValet || filter === "all" || c.type === filter);
  const dotStyle = (level) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    margin: "0 auto",
    background: level === "yes" ? C.greenAccent : level === "partial" ? C.goldDark : C.creamDark + "55",
    boxShadow: level === "yes" ? `0 0 6px ${C.greenAccent}44` : level === "partial" ? `0 0 6px ${C.goldDark}33` : "none",
  });
  const barColor = (score) => (score >= 80 ? C.greenAccent : score >= 50 ? C.goldDark : C.red);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "all", l: "All competitors" },
          { id: "collector", l: "Collector-focused" },
          { id: "mainstream", l: "Mainstream" },
          { id: "data", l: "Guides & APIs" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: 0.5,
              border: `1px solid ${filter === f.id ? C.gold : C.creamDark}`,
              background: filter === f.id ? C.gold + "22" : C.warmWhite,
              color: filter === f.id ? C.goldDark : C.charcoalLight,
            }}
          >
            {f.l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
        {[
          { l: "Yes / strong", c: C.greenAccent },
          { l: "Partial / limited", c: C.goldDark },
          { l: "No / absent", c: C.creamDark + "55" },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: x.c }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: C.muted }}>{x.l}</span>
          </div>
        ))}
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.creamDark}`, background: C.warmWhite }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: C.cream }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: C.charcoal,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Platform
              </th>
              {featureCols.map((f, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 10,
                    color: C.charcoal,
                    fontWeight: 600,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                    maxWidth: 75,
                  }}
                >
                  {f}
                </th>
              ))}
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: C.charcoal,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  minWidth: 110,
                }}
              >
                Coverage
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((comp, ri) => {
              const featureVals = [comp.collector, comp.forecast, comp.vin, comp.carry, comp.community, comp.mobile];
              const isV = comp.isValet;
              return (
                <tr
                  key={comp.name}
                  style={{
                    background: isV ? C.greenDeep : ri % 2 === 0 ? C.warmWhite : "white",
                    borderTop: `1px solid ${isV ? C.greenMid + "44" : C.creamDark}`,
                  }}
                >
                  <td style={{ padding: "14px 16px", borderLeft: isV ? `4px solid ${C.gold}` : "none" }}>
                    {isV ? (
                      <div
                        style={{
                          fontFamily: "'Saira Extra Condensed', sans-serif",
                          fontWeight: 800,
                          fontStyle: "italic",
                          fontSize: 22,
                          color: C.gold,
                          lineHeight: 1,
                        }}
                      >
                        VALET
                      </div>
                    ) : (
                      <>
                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.charcoal, fontWeight: 500 }}>{comp.name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: C.muted, marginTop: 2 }}>{comp.sub}</div>
                      </>
                    )}
                  </td>
                  {featureVals.map((v, fi) => (
                    <td key={fi} style={{ textAlign: "center", padding: "14px 6px" }}>
                      <div style={dotStyle(v)} />
                    </td>
                  ))}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 7,
                          background: isV ? C.greenMid + "44" : C.creamDark,
                          borderRadius: 4,
                          overflow: "hidden",
                          minWidth: 48,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${comp.score}%`,
                            background: isV ? C.gold : barColor(comp.score),
                            borderRadius: 4,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 12,
                          color: isV ? C.gold : barColor(comp.score),
                          fontWeight: 600,
                          width: 28,
                          textAlign: "right",
                        }}
                      >
                        {comp.score}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
