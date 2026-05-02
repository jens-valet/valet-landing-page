/** Shared pitch deck assets under `public/branding/`. */

export function DeckWordmarkImg({ maxWidth = 312, style = {} }) {
  return (
    <img
      src="/branding/logo-dark-mode.svg"
      alt="Valet"
      style={{
        width: `min(92vw, ${maxWidth}px)`,
        maxWidth: "100%",
        height: "auto",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        ...style,
      }}
    />
  );
}

export function DeckVMarkImg({ height = 24, style = {} }) {
  return (
    <img
      src="/branding/logo-v-main.svg"
      alt=""
      aria-hidden
      style={{ height, width: "auto", display: "block", flexShrink: 0, ...style }}
    />
  );
}

/** Full wordmark + gold rule + “Drive more, stress less” — for dark green deck backgrounds. */
export function DeckLogoWhiteGoldLineImg({ maxWidth = 320, style = {} }) {
  return (
    <img
      src="/branding/logo-white-w-gold-w-line.svg"
      alt="Valet — Drive more, stress less"
      style={{
        width: `min(92vw, ${maxWidth}px)`,
        maxWidth: "100%",
        height: "auto",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        ...style,
      }}
    />
  );
}
