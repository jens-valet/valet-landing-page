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
  { category: "Protection", item: "Security & WAF", y1: "$7,000", y2: "$25,000", logic: "DDoS shield + Year 2 SOC2 prep/Audits." },
  { category: "TOTAL", item: "", y1: "$21,382", y2: "$51,309", logic: "Infrastructure & Reliability Only.", total: true },
];

/** Product + Data Infra — top-level line items (amounts follow Year 1 / Year 2 MAU toggle). */
export const PRODUCT_DATA_INFRA_FLAT_LINES = [
  {
    label: "AI development stack",
    y1: "$50,000",
    y2: "$50,000",
    logic:
      "Claude, Cursor, Lovable, Figma AI, design tools — staying ahead means paying for frontier tools.",
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
    label: "Engagement — Steward Program",
    y1: "$48,000",
    y2: "$120,000",
    logic: "Steward-tier incentives, retention, and community engagement programs.",
  },
  {
    label: "Car data APIs (auto.dev / vehicle history)",
    y1: "$20,000",
    y2: "$40,000",
    logic: "VIN and plate decoding plus vehicle history and signal coverage.",
  },
];

/**
 * AI $ model for Product + Data Infra — two buckets (no % split):
 * 1) Per-car onboarding & user-scoped flows — $/car × cars in fleet (MAU × cars/user).
 * 2) Monthly portfolio revaluations — $/vehicle-month (batch-friendly).
 */
export const PRODUCT_AI_COST_MODEL = {
  avgMauY1: 100_000,
  avgMauY2: 250_000,
  /** Garage depth for both buckets */
  avgCarsPerUser: 2,
  recalculationsPerCarPerYear: 12,
  /** Onboarding / first-pass & user-scoped AI, $ per car in the modeled fleet (Y2 assumes improved efficiency). */
  usdPerCarOnboardingYear1: 0.3,
  usdPerCarOnboardingYear2: 0.25,
  /** Blended $ per vehicle per monthly revaluation (batching similar cars). */
  usdPerVehicleMonthValuationYear1: 0.04,
  usdPerVehicleMonthValuationYear2: 0.03,
};

function mauForYear(year) {
  const m = PRODUCT_AI_COST_MODEL;
  return year === 1 ? m.avgMauY1 : m.avgMauY2;
}

function usdPerCarOnboardingForYear(year) {
  const m = PRODUCT_AI_COST_MODEL;
  return year === 1 ? m.usdPerCarOnboardingYear1 : m.usdPerCarOnboardingYear2;
}

function usdPerVehicleMonthValuationForYear(year) {
  const m = PRODUCT_AI_COST_MODEL;
  return year === 1 ? m.usdPerVehicleMonthValuationYear1 : m.usdPerVehicleMonthValuationYear2;
}

/** Onboarding & per-car user flows (annual USD): $/car × MAU × cars per user. */
export function computeAiPerCarOnboardingUsd(year) {
  const m = PRODUCT_AI_COST_MODEL;
  const users = mauForYear(year);
  const carsInFleet = users * m.avgCarsPerUser;
  return Math.round(carsInFleet * usdPerCarOnboardingForYear(year));
}

/** Monthly valuation passes (annual USD): MAU × cars × 12 × $/vehicle-month. */
export function computeAiMonthlyValuationsUsd(year) {
  const m = PRODUCT_AI_COST_MODEL;
  const users = mauForYear(year);
  const vehicleMonths = users * m.avgCarsPerUser * m.recalculationsPerCarPerYear;
  return Math.round(vehicleMonths * usdPerVehicleMonthValuationForYear(year));
}

function buildAiMonthlyValuationsLogicString() {
  const m = PRODUCT_AI_COST_MODEL;
  const r1 = m.usdPerVehicleMonthValuationYear1;
  const r2 = m.usdPerVehicleMonthValuationYear2;
  return [
    `$${r1.toFixed(2)} (Y1) / $${r2.toFixed(2)} (Y2) per vehicle-month × MAU × ${m.avgCarsPerUser} cars × ${m.recalculationsPerCarPerYear} months.`,
    "Assumes batching and shared prompts across similar vehicles to hold marginal cost at the vehicle-month unit.",
  ].join(" ");
}

/**
 * Flat lines with two computed AI rows (before car data APIs).
 */
export function getProductDataInfraFlatLines() {
  const m = PRODUCT_AI_COST_MODEL;
  const carsY1 = m.avgMauY1 * m.avgCarsPerUser;
  const carsY2 = m.avgMauY2 * m.avgCarsPerUser;
  const aiPerCar = {
    label: "AI costs (per car)",
    y1: formatUsdWhole(computeAiPerCarOnboardingUsd(1)),
    y2: formatUsdWhole(computeAiPerCarOnboardingUsd(2)),
    logic: [
      `$${usdPerCarOnboardingForYear(1).toFixed(2)} (Y1) / $${usdPerCarOnboardingForYear(2).toFixed(2)} (Y2) per car × ${m.avgCarsPerUser} cars per user × MAU (~${Math.round(m.avgMauY1 / 1000)}k Y1 / ~${Math.round(m.avgMauY2 / 1000)}k Y2) → ~${Math.round(carsY1).toLocaleString("en-US")} / ~${Math.round(carsY2).toLocaleString("en-US")} cars in fleet.`,
      "Onboarding, first-pass passes, and user-scoped flows — separate from batched monthly revaluations below.",
    ].join(" "),
  };

  const aiMonthly = {
    label: "AI costs (monthly valuations)",
    y1: formatUsdWhole(computeAiMonthlyValuationsUsd(1)),
    y2: formatUsdWhole(computeAiMonthlyValuationsUsd(2)),
    logic: buildAiMonthlyValuationsLogicString(),
  };

  const car = PRODUCT_DATA_INFRA_FLAT_LINES.find((l) => l.label.startsWith("Car data APIs"));
  const rest = PRODUCT_DATA_INFRA_FLAT_LINES.filter((l) => !l.label.startsWith("Car data APIs"));
  return [...rest, aiPerCar, aiMonthly, car].filter(Boolean);
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

export function formatUsdWhole(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
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
    details: [{ r: "Brand expansion + corpus build", v: "$50,000" }],
    note: "Includes upgrading from MVP-grade APIs to production-grade data sources (MarketCheck) and structuring enterprise LLM licensing so the free Garage wedge scales efficiently.",
  },
  gna: {
    details: [
      { r: "UX polish, lifecycle messaging, notifications", v: "$200K–$300K" },
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
    details: [{ r: "Brand expansion + corpus build", v: "$50,000" }],
    note: "Focus shifts to scaling efficiency: enterprise vendor contracts, caching expensive lookups, optimizing per-car variable cost at volume.",
  },
  gna: {
    details: [
      { r: "Post-launch iteration speed", v: "$300K–$450K" },
      { r: "Moderation tooling improvements", v: "incl. above" },
      { r: "Growth experimentation (no permanent hires)", v: "incl. above" },
      { r: "Deeper QA + performance optimization", v: "incl. above" },
      { r: "Ongoing legal/compliance", v: "$150K–$220K" },
      { r: "Accounting/finance ops, insurance, admin", v: "incl. above" },
    ],
    note: "Contractor spend increases to support post-launch iteration velocity without premature full-time headcount commitments.",
  },
};
