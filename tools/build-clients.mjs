// Generates the per-client microsite folders (reports.avalonsaves.com/<slug>/)
// from the root index.html. Re-run after ANY root index.html change:
//   node tools/build-clients.mjs
//
// The folders contain NO data and no secrets — just the dashboard shell with a
// branding marker. Scoping/white-labeling happens in the myrxcard-sync worker:
// each client's password returns only their rows, sources collapsed to
// Domestic/International, fees stripped, member tokens re-HMACed per client.
// Client passwords live in the worker secret CLIENT_PWS (local gitignored copy:
// myrxcard-live-report/.deploy/tools/sync-worker/.clientpws).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLIENTS = [
  { slug: "marpai", label: "Marpai" },
  { slug: "vault", label: "Vault" },
];

const html = readFileSync(join(root, "index.html"), "utf8");
for (const c of CLIENTS) {
  const marker = `<script>window.PARTNER_SITE=${JSON.stringify(c)};</script>\n<script>`;
  const out = html.replace("<script>", marker); // first <script> = main app script
  if (out === html) throw new Error("marker injection failed");
  mkdirSync(join(root, c.slug), { recursive: true });
  writeFileSync(join(root, c.slug, "index.html"), out);
  console.log(`${c.slug}/index.html written (${c.label})`);
}
