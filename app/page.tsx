export default function Home() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="mini-logo" aria-label="Valet">
          <span className="slash" style={{ opacity: 0.3 }}>
            /
          </span>
          <span className="slash" style={{ opacity: 0.55 }}>
            /
          </span>
          <span className="slash" style={{ opacity: 0.82 }}>
            /
          </span>
          <span className="v">V</span>
          <span className="alet">ALET</span>
        </div>
        <span className="topbar-meta">
          EST {"\u00b7"} 2026
        </span>
      </header>

      <main className="hero">
        <h1 className="wordmark" aria-label="Valet">
          <span className="slash s1">/</span>
          <span className="slash s2">/</span>
          <span className="slash s3">/</span>
          <span className="v">V</span>
          <span className="alet">ALET</span>
        </h1>

        <div className="tagline-wrap">
          <span className="tag-line" aria-hidden={true} />
          <span className="tagline-text">
            Drive More {"\u00b7"} Stress Less
          </span>
          <span className="tag-line" aria-hidden={true} />
        </div>

        <div className="divider" role="presentation" />

        <p className="blurb">
          The modern homebase for collector-car ownership. Value intelligence,
          maintenance planning, and enthusiast community, all driven by your VIN.
        </p>
        <p className="blurb">
          We&apos;re building something new for the collector community.
          Launching soon.
        </p>

        <div className="cta-row">
          <a
            className="btn btn-primary"
            href="mailto:hello@valet.app?subject=Valet%20Inquiry"
          >
            Learn More
            <span className="arrow" aria-hidden={true}>
              &rsaquo;
            </span>
          </a>
        </div>
      </main>

      <footer className="foot">
        <span>&copy; 2026 Valet</span>
        <a href="mailto:hello@valet.app">hello@valet.app</a>
      </footer>
    </div>
  );
}
