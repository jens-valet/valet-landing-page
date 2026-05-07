import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const documentPath = path.join(root, ".next", "server", "pages", "_document.js");
const buildIdPath = path.join(root, ".next", "BUILD_ID");
const require = createRequire(import.meta.url);

if (!fs.existsSync(buildIdPath) || !fs.existsSync(documentPath)) {
  console.error(
    [
      "Missing or incomplete Next.js production build (.next).",
      "This often happens after `next dev` was interrupted or `.next` was partially deleted.",
      "",
      "Fix:  rm -rf .next && npm run build",
      "Then:  npm start",
    ].join("\n"),
  );
  process.exit(1);
}

try {
  require(documentPath);
} catch (err) {
  console.error(
    [
      "Next.js production build cache is stale or incomplete.",
      err?.message ? `Error: ${err.message}` : "",
      "",
      "Fix:  rm -rf .next && npm run build",
      "Then:  npm start",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  process.exit(1);
}
