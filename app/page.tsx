import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="mini-logo">
          <Image
            className="mini-logo-img"
            src="/branding/logo-v-main.svg"
            alt="Valet"
            width={147}
            height={110}
            unoptimized
          />
        </div>
        <span className="topbar-meta">
          EST {"\u00b7"} 2026
        </span>
      </header>

      <main className="hero">
        <h1 className="wordmark">
          <Image
            className="wordmark-img wordmark-img--deck"
            src="/branding/logo-white-w-gold-w-line.svg"
            alt="Valet — Drive more, stress less"
            width={181}
            height={66}
            unoptimized
            priority
          />
        </h1>

        <div className="divider divider-after-logo" role="presentation" />

        <p className="blurb">
          The modern homebase for collector-car ownership. Value intelligence,
          maintenance planning, and enthusiast community, all driven by your VIN.
        </p>
        <p className="blurb">
          We&apos;re building something new for the collector community.
          Launching soon.
        </p>

        <div className="cta-row">
          <Link className="btn btn-primary" href="/deck">
            Learn More
            <span className="arrow" aria-hidden={true}>
              &rsaquo;
            </span>
          </Link>
        </div>
      </main>

      <footer className="foot">
        <span>&copy; 2026 Valet</span>
        <a href="mailto:johnny@valet.app">johnny@valet.app</a>
      </footer>
    </div>
  );
}
