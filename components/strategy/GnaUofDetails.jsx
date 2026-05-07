"use client";

import { C } from "@/components/deck/pitchDeckColors";
import { sumAllocationDetailsUsd, formatRaiseBucketTotalUsd } from "@/components/strategy/pitchDeckUofTemplates";

/**
 * Contractors + G&A — detail rows and total matching the sum of listed amounts.
 * @param {{ details?: { r: string, v: string, sub?: string }[] }} props
 */
export default function GnaUofDetails({ details = [] }) {
  const listedTotal = sumAllocationDetailsUsd(details);

  return (
    <div style={{ marginBottom: 4 }}>
      {details.map((row, j) => (
        <div
          key={j}
          style={{ padding: "6px 0", borderBottom: j < details.length - 1 ? `1px solid ${C.greenMid}33` : "none" }}
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
          Total (Contractors + G&A)
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: C.gold }}>
          {formatRaiseBucketTotalUsd(listedTotal)}
        </span>
      </div>
    </div>
  );
}
