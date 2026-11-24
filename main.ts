// Entry for make.fun's "Promote make.fun's make-your-own-bounty post on X"
// bounty (post-x-promote-make-your-own-bounty-01). Node 22, standard library
// only.
//
// The entry itself is the X post: one of your own posts on X that quotes
// make.fun's make-your-own-bounty post
// (https://x.com/makefunai/status/2124915864336236646), carries a photo of
// its own, and names make.fun / @makefunai plus your play code in its text.
// POST.json points at that post; the house then reads the post's replies,
// reposts and quotes from X. So all this program has to do is hand POST.json
// over: it copies it from the repository root into the output directory,
// where the gate picks it up.
//
// The POST.json shipped here still holds the starter's placeholder address,
// so as it stands the gate will refuse it (valid 0). Put the real post
// address in POST.json before submitting.
//
// Locally, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and
// /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const destination = join(outputDir, 'POST.json');

try {
  copyFileSync(source, destination);
} catch (err) {
  console.error(`could not copy POST.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}

// Confirm the copy landed byte-for-byte; a partial or stale file would make
// the gate read the wrong post, so refuse to pass silently.
if (!readFileSync(source).equals(readFileSync(destination))) {
  console.error(`POST.json in ${outputDir} does not match ${source}`);
  process.exit(1);
}

console.log(`POST.json copied to ${destination}`);
