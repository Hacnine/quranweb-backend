/**
 * Download Quran JSON data from semarketir/quranjson into the data/ directory.
 * Run: bun run scripts/download-data.ts
 *
 * Source: https://github.com/semarketir/quranjson
 */

import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const BASE_URL =
  "https://raw.githubusercontent.com/semarketir/quranjson/master/source";

const DATA_DIR = join(import.meta.dir, "..", "data");

async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function downloadJSON(url: string, outputPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  const json = await res.json();
  await writeFile(outputPath, JSON.stringify(json, null, 2), "utf-8");
  console.log(`  ✓ ${outputPath.replace(DATA_DIR, "data")}`);
}

async function main(): Promise<void> {
  console.log("Downloading Quran JSON dataset …\n");

  await ensureDir(DATA_DIR);
  await ensureDir(join(DATA_DIR, "surah"));
  await ensureDir(join(DATA_DIR, "tajweed"));
  await ensureDir(join(DATA_DIR, "translation", "en"));

  // Indexes
  await downloadJSON(`${BASE_URL}/surah.json`, join(DATA_DIR, "surah.json"));
  await downloadJSON(`${BASE_URL}/juz.json`, join(DATA_DIR, "juz.json"));

  // Individual surahs (Arabic + Tajweed + English translation)
  for (let i = 1; i <= 114; i++) {
    await downloadJSON(
      `${BASE_URL}/surah/surah_${i}.json`,
      join(DATA_DIR, "surah", `surah_${i}.json`)
    );
    await downloadJSON(
      `${BASE_URL}/tajweed/surah_${i}.json`,
      join(DATA_DIR, "tajweed", `surah_${i}.json`)
    );
    await downloadJSON(
      `${BASE_URL}/translation/en/en_translation_${i}.json`,
      join(DATA_DIR, "translation", "en", `en_translation_${i}.json`)
    );
  }

  console.log("\nAll data downloaded successfully!");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
