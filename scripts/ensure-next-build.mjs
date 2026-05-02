import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const documentPath = path.join(root, ".next", "server", "pages", "_document.js");
const buildIdPath = path.join(root, ".next", "BUILD_ID");

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
