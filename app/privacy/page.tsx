import type { Metadata } from "next";
import Link from "next/link";

import { DeckVMarkImg } from "@/components/deck/deckBranding";

export const metadata: Metadata = {
  title: "Privacy Policy · Valet",
  description: "Short overview of what Valet collects, why, and how to reach us.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page privacy-page">
      <header className="privacy-deck-topbar">
        <Link href="/" className="privacy-deck-v-link" aria-label="Valet home">
          <DeckVMarkImg height={24} />
        </Link>
        <span className="privacy-deck-topbar-meta">LEGAL · PRIVACY</span>
      </header>

      <main className="privacy-main">
        <h1 className="privacy-h1-deck">Privacy Policy</h1>
        <p className="privacy-meta-line">
          Effective · May 3, 2026 · Valet
        </p>

        <section className="privacy-section" aria-labelledby="privacy-collect">
          <h2 id="privacy-collect" className="privacy-h2">
            What we collect
          </h2>
          <p>
            When you create an account we collect your name, email address, and password. Payments go
            through payment partners—we never store full card numbers on our servers. Depending on what
            you use, we may also store garage and VIN details you add, community posts or uploads,
            subscription status, and diagnostics that help the product run smoothly. We receive typical
            usage signals (such as pages viewed and searches), device basics (browser and OS), a rough
            sense of location from IP where applicable, and cookies or tokens needed for sessions.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-use">
          <h2 id="privacy-use" className="privacy-h2">
            How we use your information
          </h2>
          <p>
            We use your information to operate Valet—garage and ownership tools, valuations and related
            insights where available, communities and alerts, and paid plans—to route billing through our
            processors, improve reliability and relevance, send service messages and (with your choices)
            product updates, and detect misuse or fraud.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-share">
          <h2 id="privacy-share" className="privacy-h2">
            Disclosure
          </h2>
          <p>
            We do not sell your personal information. We share it only with vendors who help us run the
            product (for example hosting, authentication, payment processing, automotive data lookups,
            and analytics—often in aggregated form), when the law requires it, or if the business is sold
            or reorganized with comparable privacy commitments.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-retention">
          <h2 id="privacy-retention" className="privacy-h2">
            Retention
          </h2>
          <p>
            We keep account information while your account is active and work to remove personal profile
            data shortly after you ask us to delete your account, aside from limited backups that expire on
            a rolling schedule. Records tied to payments may be kept longer where bookkeeping or tax rules
            call for it. Analytics we rely on is stored in stripped-down or aggregated form where we can.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-rights">
          <h2 id="privacy-rights" className="privacy-h2">
            Your choices
          </h2>
          <p>
            You can ask to access, fix, or delete personal information associated with your account,
            request a copy of garage-related data where we can export it, and opt out of marketing email
            using the link in those messages. California residents may have extra rights under the CCPA,
            including learning categories of data we collect and asking for deletion where allowed.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-security">
          <h2 id="privacy-security" className="privacy-h2">
            Security
          </h2>
          <p>
            We protect traffic with HTTPS, encrypt sensitive data at rest where practical, lean on our
            payment vendors&apos; PCI-minded controls, and limit internal access. If we confirm a breach
            that affects your personal information in a serious way, we will notify you as laws require
            and without unreasonable delay.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies" className="privacy-h2">
            Cookies
          </h2>
          <p>
            We use a small set of cookies or similar technologies: essentials that keep you logged in and
            reduce abuse, preference helpers such as theme or recent activity, and lightweight analytics
            for anonymous usage patterns. You can limit cookies in your browser; turning off essentials may
            break sign-in or core features.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-children">
          <h2 id="privacy-children" className="privacy-h2">
            Children
          </h2>
          <p>
            Valet isn&apos;t aimed at young children, and we don&apos;t knowingly collect personal data
            from anyone under 13. If you believe we did, email us and we will address it.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-changes">
          <h2 id="privacy-changes" className="privacy-h2">
            Changes to this policy
          </h2>
          <p>
            We may refresh this page from time to time. When we make an important change we&apos;ll note it
            here and may email you or show an in-product notice.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className="privacy-h2">
            Contact
          </h2>
          <p>
            Privacy questions:{" "}
            <a href="mailto:jens@valet.app">jens@valet.app</a>
          </p>
        </section>
      </main>

      <footer className="foot privacy-foot privacy-foot-deck">
        <div className="foot-brand privacy-foot-deck-brand">
          <Link href="/" className="privacy-foot-deck-v-link" aria-label="Valet home">
            <DeckVMarkImg height={18} />
          </Link>
          <span className="privacy-foot-deck-meta">
            &copy; 2026 Valet Ventures Inc. All rights reserved. · Privacy Policy
          </span>
        </div>
      </footer>
    </div>
  );
}
