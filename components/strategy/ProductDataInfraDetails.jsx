"use client";

import { useState, useEffect, useMemo } from "react";
import { C } from "@/components/deck/pitchDeckColors";
import {
  PRODUCT_INFRA_BREAKDOWN,
  getProductDataInfraFlatLines,
  computeProductDataInfraGrandTotalUsd,
  formatUsdWhole,
} from "@/components/strategy/pitchDeckUofTemplates";

function infraScenarioTotal(breakdown, year) {
  const totalRow = breakdown.find((r) => r.total);
  if (!totalRow) return "";
  return year === 1 ? totalRow.y1 : totalRow.y2;
}

/**
 * Product + Data Infra — expandable infrastructure, flat cost lines, allocation rows, and grand total.
 * @param {{ year: 1 | 2, allocationDetails?: { r: string, v: string, sub?: string }[] }} props
 */
export default function ProductDataInfraDetails({ year, allocationDetails = [] }) {
  const [infraOpen, setInfraOpen] = useState(false);

  useEffect(() => {
    setInfraOpen(false);
  }, [year]);

  const totalStr = infraScenarioTotal(PRODUCT_INFRA_BREAKDOWN, year);

  const flatLines = useMemo(() => getProductDataInfraFlatLines(), []);

  const grandTotalUsd = useMemo(
    () => computeProductDataInfraGrandTotalUsd(year, allocationDetails),
    [year, allocationDetails],
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        type="button"
        aria-expanded={infraOpen}
        onClick={() => setInfraOpen((o) => !o)}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: 12,
          padding: "10px 10px",
          margin: "0 -10px",
          background: infraOpen ? C.greenDeep + "66" : "transparent",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s ease",
        }}
      >
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark, flex: 1 }}>
          Infrastructure
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold }}>{totalStr}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.goldLight, width: 16, flexShrink: 0 }} aria-hidden>
          {infraOpen ? "▼" : "▶"}
        </span>
      </button>

      {infraOpen && (
        <div style={{ marginTop: 8, marginBottom: 14 }}>
          <div
            style={{
              fontFamily: "'Saira', sans-serif",
              fontWeight: 100,
              fontSize: 10,
              color: C.gold,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Breakdown — {year === 1 ? "~100k MAU" : "~250k MAU"} (Year {year})
          </div>
          <div style={{ overflowX: "auto", margin: "0 -4px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Category", "Item", year === 1 ? "Y1 ($)" : "Y2 ($)", "Basis"].map((h, hi) => (
                    <th
                      key={hi}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 9.5,
                        color: C.goldLight,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        textAlign: hi <= 1 ? "left" : hi === 2 ? "right" : "left",
                        padding: "8px 6px",
                        borderBottom: `1px solid ${C.gold}44`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCT_INFRA_BREAKDOWN.map((row, ri) => {
                  const amt = year === 1 ? row.y1 : row.y2;
                  const isTotal = Boolean(row.total);
                  return (
                    <tr key={ri} style={{ background: ri % 2 === 1 ? C.greenDeep + "55" : "transparent" }}>
                      <td
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11.5,
                          color: C.creamDark,
                          padding: "7px 6px",
                          borderBottom: `1px solid ${C.greenMid}33`,
                          fontWeight: isTotal ? 700 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.category}
                      </td>
                      <td
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11.5,
                          color: C.cream,
                          padding: "7px 6px",
                          borderBottom: `1px solid ${C.greenMid}33`,
                          maxWidth: 140,
                        }}
                      >
                        {row.item || "—"}
                      </td>
                      <td
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11.5,
                          color: C.gold,
                          padding: "7px 6px",
                          borderBottom: `1px solid ${C.greenMid}33`,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          fontWeight: isTotal ? 700 : 400,
                        }}
                      >
                        {amt}
                      </td>
                      <td
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 10.5,
                          color: C.muted,
                          padding: "7px 6px",
                          borderBottom: `1px solid ${C.greenMid}33`,
                          lineHeight: 1.45,
                          minWidth: 120,
                        }}
                      >
                        {row.logic}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.greenMid}44` }}>
        {flatLines.map((line, i) => (
          <div
            key={i}
            style={{
              padding: "10px 0",
              borderBottom: i < flatLines.length - 1 ? `1px solid ${C.greenMid}33` : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark, flex: 1 }}>
                {line.label}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold, flexShrink: 0 }}>
                {year === 1 ? line.y1 : line.y2}
              </span>
            </div>
            {line.logic ? (
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 6,
                  lineHeight: 1.45,
                }}
              >
                {line.logic}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {allocationDetails.length > 0 ? (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.greenMid}55` }}>
          {allocationDetails.map((row, j) => (
            <div
              key={j}
              style={{
                padding: "6px 0",
                borderBottom: j < allocationDetails.length - 1 ? `1px solid ${C.greenMid}33` : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: C.creamDark }}>{row.r}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.gold, flexShrink: 0, marginLeft: 12 }}>
                  {row.v}
                </span>
              </div>
              {row.sub ? (
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11.5,
                    color: C.muted,
                    marginTop: 3,
                    paddingLeft: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {row.sub}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: `1px solid ${C.gold}44`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: C.cream }}>
          Total (Product + Data Infra)
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: C.gold }}>
          {formatUsdWhole(grandTotalUsd)}
        </span>
      </div>
    </div>
  );
}
