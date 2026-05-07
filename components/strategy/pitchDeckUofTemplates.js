/** Narrative line items for Use of Funds — merged with model-driven % and $ from the raise. */

/** Platform infra at ~100k MAU (Y1 toggle) vs ~250k MAU (Y2 toggle) — shown under Product + Data Infra. */
export const PRODUCT_INFRA_BREAKDOWN = [
  { category: "Base", item: "Team Plan Subscription", y1: "$7,188", y2: "$7,188", logic: "$599/mo fixed base." },
  { category: "Auth", item: "Monthly Active Users", y1: "$0", y2: "$5,850", logic: "100k free; Y2 overage at $0.00325/user." },
  { category: "Compute", item: "Log Drains (x2)", y1: "$1,440", y2: "$1,440", logic: "$60/mo per drain (Performance + Security)." },
  { category: "Bandwidth", item: "Egress (Data Out)", y1: "$810", y2: "$2,430", logic: "250GB free; Overage at $0.09/GB." },
  { category: "Storage", item: "File Storage & DB", y1: "$144", y2: "$401", logic: "100GB free; Overage at $0.021/GB." },
  { category: "Delivery", item: "CDN (Global Edge)", y1: "$1,200", y2: "$3,000", logic: "Metered caching (Cloudflare/Bunny)." },
  { category: "Ops", item: "Sentry & Datadog", y1: "$3,600", y2: "$6,000", logic: "$300-$500/mo for error/health tracking." },
  { category: "Protection", item: "Security & WAF", y1: "$7,000", y2: "$15,000", logic: "DDoS shield + Year 2 SOC2 prep/Audits." },
  { category: "TOTAL", item: "", y1: "$21,382", y2: "$41,309", logic: "Infrastructure & Reliability Only.", total: true },
];

/**
 * Product + Data Infra — flat lines (Y1 ~$177K and Y2 ~$206K all-in incl. infra; Steward program is under Contractors + G&A).
 */
export const PRODUCT_DATA_INFRA_FLAT_LINES = [
  {
    label: "AI development stack",
    y1: "$30,000",
    y2: "$20,000",
    logic: "Claude, Cursor, design tools, and other engineering productivity subscriptions.",
  },
  {
    label: "AI costs",
    y1: "$50,618",
    y2: "$60,000",
    logic:
      "LLM-backed market research, plus per-car valuations and ownership / carrying-cost passes. Runs on top of a shared research base and cached market context, so marginal cost per vehicle stays low.",
  },
  {
    label: "Email sequence system (Loops)",
    y1: "$5,000",
    y2: "$15,000",
    logic: "Lifecycle email and subscriber journeys.",
  },
  {
    label: "Analytics & user feedback",
    y1: "$10,000",
    y2: "$20,000",
    logic: "Product analytics, session insight, and structured user feedback.",
  },
  {
    label: "Data sources",
    y1: "$60,000",
    y2: "$50,000",
    logic: "Production-grade vehicle data, auction/history signals, and decoding (e.g. HammerPrice API path, complementary feeds).",
  },
];

export function getProductDataInfraFlatLines() {
  return [...PRODUCT_DATA_INFRA_FLAT_LINES];
}

/** Parse $21,382 / $50,000 style amounts (flat lines + infra totals). */
function parseDisplayUsd(s) {
  if (!s || typeof s !== "string") return 0;
  return Number(s.replace(/[$,]/g, "")) || 0;
}

/**
 * Parse `v` from template allocation rows ($216K, $80K–$120K, $1.0M, incl. above → 0).
 * Dollar ranges use midpoint so we can show one total line.
 */
function parseAllocUsd(v) {
  if (!v || typeof v !== "string") return 0;
  const t = v.trim();
  if (/incl\.?\s*above/i.test(t)) return 0;

  const rangeK = t.match(/\$([0-9.]+)K\s*[–-]\s*\$([0-9.]+)K/i);
  if (rangeK) {
    return ((parseFloat(rangeK[1]) + parseFloat(rangeK[2])) / 2) * 1000;
  }

  const rangeFull = t.match(/\$([\d,]+)\s*[–-]\s*\$([\d,]+)/);
  if (rangeFull) {
    const a = parseInt(rangeFull[1].replace(/,/g, ""), 10);
    const b = parseInt(rangeFull[2].replace(/,/g, ""), 10);
    return (a + b) / 2;
  }

  const m = t.match(/\$([0-9.]+)M/i);
  if (m) return parseFloat(m[1]) * 1_000_000;

  const k = t.match(/\$([0-9.]+)K/i);
  if (k) return parseFloat(k[1]) * 1000;

  const plain = t.match(/\$([\d,]+)/);
  if (plain) return parseInt(plain[1].replace(/,/g, ""), 10);

  return 0;
}

/**
 * Sum for Product + Data Infra card: scenario infra total + flat tool/API lines + template allocation rows.
 * @param {1|2} year
 * @param {{ r: string, v: string, sub?: string }[]} allocationDetails
 */
export function computeProductDataInfraGrandTotalUsd(year, allocationDetails = []) {
  const col = year === 1 ? "y1" : "y2";
  const totalRow = PRODUCT_INFRA_BREAKDOWN.find((r) => r.total);
  let sum = totalRow ? parseDisplayUsd(totalRow[col]) : 0;
  for (const line of getProductDataInfraFlatLines()) {
    sum += parseDisplayUsd(line[col]);
  }
  for (const row of allocationDetails) {
    sum += parseAllocUsd(row.v);
  }
  return Math.round(sum);
}

/** Sum numeric values from allocation-style rows (ranges → midpoint; `incl. above` → 0). */
export function sumAllocationDetailsUsd(details = []) {
  return Math.round(details.reduce((acc, row) => acc + parseAllocUsd(row.v), 0));
}

export function formatUsdWhole(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Parse donut row amounts like `$484K`, `$1.43M`, `$882K`. */
export function parseUseOfFundsAmountUsd(s) {
  if (!s || typeof s !== "string") return 0;
  const t = s.trim().replace(/^[$\s]+/, "").replace(/,/g, "");
  const mi = t.match(/^([0-9.]+)\s*M$/i);
  if (mi) return Math.round(parseFloat(mi[1]) * 1_000_000);
  const ki = t.match(/^([0-9.]+)\s*K$/i);
  if (ki) return Math.round(parseFloat(ki[1]) * 1_000);
  const n = parseFloat(t);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/** Compact total for raise-bucket footer (matches `pitchDeckModel` slice formatting). */
export function formatRaiseBucketTotalUsd(usd) {
  const m = usd / 1_000_000;
  if (m >= 1) return `$${m.toFixed(2)}M`;
  return `$${Math.round(m * 1000)}K`;
}

export const PITCH_DECK_UOF_Y1 = {
  team: {
    details: [
      { r: "CEO (Johnny)", v: "$200K" },
      { r: "CTO (Jens)", v: "$150K" },
      { r: "Infra Engineer", v: "$150K" },
      { r: "Employer burden (15–20%)", v: "$75K–$100K" },
    ],
    note: "Core salaries protected for 2 years. Contractors excluded by design — they sit under Product/Launch.",
  },
  distribution: {
    details: [
      {
        r: "Tier A — Flagship anchors (8 × $125K)",
        v: "$1.0M",
        sub: "1 YouTube integration (60–90s) or dedicated segment, 2 short-form cutdowns, 3 story frames with link + promo code, link placement (description + pinned comment) for 60 days, optional 30-day usage rights for reposting/boosting",
      },
      {
        r: "Tier B — Mid-tier growth (20 × $30K)",
        v: "$600K",
        sub: "1 integration or dedicated short-form, plus 1 follow-up short-form or story bundle. CTA optimized to \"Add your VIN → unlock your local community\"",
      },
      {
        r: "Tier C — Niche/micro (12 × $10K)",
        v: "$120K",
        sub: "1 short-form + story bundle, geo/niche targeted to seed density in specific marques and metros",
      },
      {
        r: "Ops + creative + tracking",
        v: "$280K",
        sub: "Attribution, post-production/cutdowns, creator enablement (scripts/storyboards/CTAs), performance reporting, light boosting/whitelisting",
      },
      { r: "Local Cars & Coffee activations (24 × $2,500)", v: "$60K" },
      { r: "Regional marque club events (10 × $7,500)", v: "$75K" },
      { r: "Flagship moments (2 × $15,000)", v: "$30K" },
      { r: "Events ops/creative", v: "$5K" },
    ],
    note: "Y1 cadence: Q1 — 10 deals (prove messaging + conversion), Q2 — 12 deals (scale winners, seed regions), Q3 — 10 deals (summer event season), Q4 — 8 deals (year-end angles). Spend is a lever, not a fixed commitment — ranges flex based on performance.",
  },
  product: {
    details: [],
    note: "Includes upgrading from MVP-grade APIs to production-grade data sources (HammerPrice API, etc.) and structuring enterprise LLM licensing so the free Garage wedge scales efficiently.",
  },
  gna: {
    details: [
      { r: "UX polish, lifecycle messaging, notifications", v: "$200K–$300K" },
      { r: "Engagement - Steward Program", v: "$48k" },
      { r: "Moderation systems, App Store readiness", v: "incl. above" },
      { r: "QA, crash analytics integration", v: "incl. above" },
      { r: "Legal (financing counsel, corp setup, ToS/privacy)", v: "$120K–$180K" },
      { r: "Bookkeeping/tax, D&O insurance post-raise", v: "incl. above" },
    ],
    note: "Contractors are a deliberate lever to move fast without premature full-time headcount.",
  },
};

export const PITCH_DECK_UOF_Y2 = {
  team: {
    details: [
      { r: "CEO (Johnny)", v: "$200K" },
      { r: "CTO (Jens)", v: "$150K" },
      { r: "Infra Engineer", v: "$150K" },
      { r: "Employer burden", v: "$75K–$100K" },
    ],
    note: "Same 2-year reserve. Core team stability maintained regardless of market conditions.",
  },
  distribution: {
    details: [
      {
        r: "Tier A — Renew top performers (6 × $100K)",
        v: "$600K",
        sub: "Proven partners from Y1 with established audience trust and validated conversion metrics",
      },
      {
        r: "Tier B — Performance-structured (24 × $20K eff.)",
        v: "$480K",
        sub: "Lower base + conversion kicker tied to paid Communities subscriptions. Shifts spend toward proven ROI",
      },
      {
        r: "Tier C — Broader seeding (20 × $7K)",
        v: "$140K",
        sub: "Expand geographic and marque coverage into new niche metros",
      },
      { r: "Ops + boosting + reporting", v: "$280K" },
      { r: "Local activations (18 × $2,000)", v: "$36K" },
      { r: "Regional events (6 × $8,000)", v: "$48K" },
      { r: "Flagship moment (1)", v: "$9K" },
      { r: "Events contingency/onsite buffer", v: "$2K" },
    ],
    note: "Y2 shifts toward performance-based terms: lower guaranteed base, higher conversion kickers. Marketing efficiency improves as organic flywheel contributes.",
  },
  product: {
    details: [],
    note: "Focus shifts to scaling efficiency: enterprise vendor contracts, caching expensive lookups, optimizing per-car variable cost at volume.",
  },
  gna: {
    details: [
      { r: "Post-launch iteration speed", v: "$300K–$450K" },
      { r: "Engagement - Steward Program", v: "$95k" },
      { r: "Moderation tooling improvements", v: "incl. above" },
      { r: "Growth experimentation (no permanent hires)", v: "incl. above" },
      { r: "Deeper QA + performance optimization", v: "incl. above" },
      { r: "Ongoing legal/compliance", v: "$150K–$220K" },
      { r: "Accounting/finance ops, insurance, admin", v: "incl. above" },
    ],
    note: "Contractor spend increases to support post-launch iteration velocity without premature full-time headcount commitments.",
  },
};

/**
 * Sum of Contractors + G&A template line items (ranges use midpoint; `incl. above` → 0).
 * @param {1|2} year
 */
export function computeGnaDetailsSubtotalUsd(year) {
  const data = year === 1 ? PITCH_DECK_UOF_Y1 : PITCH_DECK_UOF_Y2;
  return sumAllocationDetailsUsd(data.gna.details);
}

/**
 * Dollar label beside a use-of-funds row: match the visible detail rows instead of the model bucket.
 * Product includes infra + flat-line totals; the other rows sum their listed details.
 * @param {{ key?: string, label: string, amount: string, details?: { r: string, v: string }[] }} row
 * @param {1|2} year
 */
export function formatUofSummarizedRowAmount(row, year) {
  const details = row.details ?? [];
  if (row.key === "product" || row.label === "Product + Data Infra") {
    return formatRaiseBucketTotalUsd(computeProductDataInfraGrandTotalUsd(year, details));
  }
  if (details.length > 0) {
    return formatRaiseBucketTotalUsd(sumAllocationDetailsUsd(details));
  }
  return row.amount;
}
