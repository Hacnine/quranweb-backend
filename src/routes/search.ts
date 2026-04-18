import { Hono } from "hono";
import { readFile, readdir } from "fs/promises";
import { join } from "path";

const search = new Hono();

const DATA_DIR = join(process.cwd(), "data");

interface SearchResult {
  surahIndex: string;
  surahName: string;
  verseKey: string;
  verseNumber: number;
  text: string;
  arabic: string;
}

// GET /api/search?q=keyword&lang=en
search.get("/", async (c) => {
  const query = c.req.query("q")?.toLowerCase().trim();
  const lang = c.req.query("lang") ?? "en";

  if (!query || query.length < 2) {
    return c.json({ results: [], query: query ?? "" });
  }

  const translationDir = join(DATA_DIR, "translation", lang);
  const surahListData = await readFile(
    join(DATA_DIR, "surah.json"),
    "utf-8"
  );
  const surahList = JSON.parse(surahListData) as Array<{
    index: string;
    title: string;
    titleAr: string;
  }>;

  const files = await readdir(translationDir);
  const results: SearchResult[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const raw = await readFile(join(translationDir, file), "utf-8");
    const data = JSON.parse(raw) as {
      index: string;
      name: string;
      verse: Record<string, string>;
    };

    const surahInfo = surahList.find(
      (s) => s.index === data.index || s.index === data.index.padStart(3, "0")
    );

    // Also load Arabic text
    const surahNum = parseInt(data.index, 10);
    let arabicVerse: Record<string, string> = {};
    try {
      const arabicRaw = await readFile(
        join(DATA_DIR, "surah", `surah_${surahNum}.json`),
        "utf-8"
      );
      const arabicData = JSON.parse(arabicRaw);
      arabicVerse = arabicData.verse ?? {};
    } catch {
      // skip if arabic file not found
    }

    for (const [key, text] of Object.entries(data.verse)) {
      if (text.toLowerCase().includes(query)) {
        const verseNum = parseInt(key.replace("verse_", ""), 10);
        results.push({
          surahIndex: data.index,
          surahName: surahInfo?.title ?? data.name,
          verseKey: key,
          verseNumber: verseNum,
          text,
          arabic: arabicVerse[key] ?? "",
        });
      }
    }

    if (results.length >= 50) break; // Limit results
  }

  return c.json({ results, query });
});

export default search;
