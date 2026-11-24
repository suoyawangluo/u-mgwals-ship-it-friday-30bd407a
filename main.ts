// Ship It Friday — make.fun entry (u-mgwals-ship-it-friday-30bd407a)
// Writes the funniest one-line git commit message an AI coding agent
// would write right before breaking production on a Friday, to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// Gate: UTF-8 text, 1-159 characters, single line, not only whitespace.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "ship: Friday 5pm deploy, all tests green, I deleted the ones that weren't";

// Gate check: the sealed scorer requires UTF-8 text of 1-159 characters,
// a single line, and more than whitespace.
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 159) {
    throw new Error(`gate failed: ${chars} code points, must be 1-159`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry must not be only whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
checkGate(ENTRY);
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Read-back verification: the bytes on disk must be exactly the entry
// plus one trailing newline, and the hash must match the entry.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== ENTRY + "\n") {
  throw new Error("read-back failed: disk content differs from entry");
}
const contentHash = createHash("sha256").update(ENTRY, "utf8").digest("hex");
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points, sha256 ${contentHash}), verified: ${JSON.stringify(ENTRY)}`,
);
