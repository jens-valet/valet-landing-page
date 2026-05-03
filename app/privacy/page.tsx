import type { Metadata } from "next";
import Link from "next/link";

import { DeckVMarkImg } from "@/components/deck/deckBranding";

export const metadata: Metadata = {
  title: "Privacy Policy · Valet",
  description:
    "How Valet collects, uses, and protects information when you use our collector-car platform.",
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
        <p className="privacy-meta-line">Last updated · May 3, 2026</p>

        <p className="privacy-lede">
          This Privacy Policy describes how Valet (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) handles information when you use our mobile-first automotive
          platform that connects collector-car ownership with niche communities. This is a
          practical overview designed for users and stakeholders; it is not legal advice.
        </p>

        <section className="privacy-section" aria-labelledby="privacy-overview">
          <h2 id="privacy-overview" className="privacy-h2">
            Overview
          </h2>
          <p>
            Valet helps enthusiasts organize vehicles around a Vehicle Identification Number
            (VIN), understand collection-related insights (such as values and carrying-cost
            views), and participate in regional and topic-based communities. Providing those
            features requires collecting and processing certain account, vehicle, usage, and
            optional location information as described below.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-collect">
          <h2 id="privacy-collect" className="privacy-h2">
            Information we collect from you
          </h2>
          <ul className="privacy-list">
            <li>
              <strong>Account and profile.</strong> Information you provide when creating or
              maintaining an account, such as name, email address, and authentication data.
              Passwords and tokens are handled using standard authentication practices; we do
              not store passwords in plain text.
            </li>
            <li>
              <strong>Vehicle and VIN data.</strong> VINs and related vehicle details you enter
              so we can build your portfolio, forecasts, and ownership context. You choose what
              you add; removing vehicles may limit related features.
            </li>
            <li>
              <strong>User-generated content.</strong> Photos, posts, comments, reactions,
              event tags (for example Cars &amp; Coffee), forum-style threads, and other content
              you submit in community areas. Content may be visible to other users depending on
              community visibility settings.
            </li>
            <li>
              <strong>Subscription and commerce signals.</strong> Whether you have access to paid
              features such as Communities. Payments are processed by platform billing providers
              (for example Apple App Store in-app purchase flows); we do not receive your full
              payment card number from those systems.
            </li>
          </ul>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-auto">
          <h2 id="privacy-auto" className="privacy-h2">
            Information collected automatically
          </h2>
          <ul className="privacy-list">
            <li>
              <strong>Location.</strong> Where you grant permission, approximate location may be
              used to suggest regional communities and surface nearby enthusiast activity.
              You can adjust permissions in your device settings.
            </li>
            <li>
              <strong>Usage and diagnostics.</strong> Interaction signals such as screens viewed,
              taps, session timing, device model, OS version, language, and crash or stability
              reports from analytics and crash-reporting tools to improve reliability and
              performance.
            </li>
          </ul>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-third">
          <h2 id="privacy-third" className="privacy-h2">
            Third-party services and sharing
          </h2>
          <ul className="privacy-list">
            <li>
              <strong>Backend and storage.</strong> We use Supabase (hosted Postgres, auth, and
              related infrastructure) to operate the product. Data is processed according to
              provider documentation and our configuration.
            </li>
            <li>
              <strong>Automotive data providers.</strong> To generate valuations, history,
              specifications, and related insights, VINs and derived queries may be sent to
              third-party automotive APIs (for example industry data partners such as Hagerty,
              Carfax, Classic.com, or similar integrations). Those providers process requests
              under their own terms and privacy notices.
            </li>
            <li>
              <strong>Analytics.</strong> Crash and product analytics vendors help us detect
              regressions and prioritize fixes.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information to data brokers. We share
            information only as needed to operate Valet, comply with law, protect safety, or with
            vendors acting on our instructions.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-retention">
          <h2 id="privacy-retention" className="privacy-h2">
            Retention
          </h2>
          <p>
            We keep information for as long as your account is active and as needed to deliver the
            service, maintain security, comply with legal obligations, and resolve disputes.
            Some backups or logs may persist for a limited period after deletion.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-rights">
          <h2 id="privacy-rights" className="privacy-h2">
            Your choices and rights
          </h2>
          <ul className="privacy-list">
            <li>
              Access, correction, or deletion requests may be available depending on your region.
              Contact us using the email below and we will respond consistent with applicable law.
            </li>
            <li>
              You may opt out of optional notifications or adjust location and analytics settings
              where your platform allows.
            </li>
          </ul>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-security">
          <h2 id="privacy-security" className="privacy-h2">
            Security
          </h2>
          <p>
            We use administrative, technical, and organizational measures designed to protect
            personal information. No online service can guarantee absolute security.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-children">
          <h2 id="privacy-children" className="privacy-h2">
            Children
          </h2>
          <p>
            Valet is not directed at children under 13 (or the minimum age required in your
            jurisdiction). If you believe we have collected information from a child, contact us
            and we will take appropriate steps.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-international">
          <h2 id="privacy-international" className="privacy-h2">
            International users
          </h2>
          <p>
            If you use Valet from outside the United States, your information may be processed in
            the United States or other countries where we or our vendors operate.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-changes">
          <h2 id="privacy-changes" className="privacy-h2">
            Changes to this policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &quot;Last updated&quot; date above and, where appropriate, provide additional notice
            in the app.
          </p>
        </section>

        <section className="privacy-section" aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className="privacy-h2">
            Contact
          </h2>
          <p>
            Questions about this policy or your information:{" "}
            <a href="mailto:jens@valet.app">jens@valet.app</a>
          </p>
        </section>
      </main>

      <footer className="foot privacy-foot privacy-foot-deck">
        <Link href="/" className="privacy-foot-deck-v-link" aria-label="Valet home">
          <DeckVMarkImg height={18} />
        </Link>
        <span className="privacy-foot-deck-meta">&copy; 2026 Valet · Privacy Policy</span>
      </footer>
    </div>
  );
}
