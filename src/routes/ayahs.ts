import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";

const ayahs = new Hono();

const DATA_DIR = join(process.cwd(), "data");

// GET /api/ayahs/:surahId – all ayahs for a surah (from surah file)
ayahs.get("/:surahId", async (c) => {
  const surahId = c.req.param("surahId");
  const data = await readFile(
    join(DATA_DIR, "surah", `surah_${surahId}.json`),
    "utf-8"
  );
  return c.json(JSON.parse(data));
});

// GET /api/ayahs/:surahId/translation/:lang – translation for a surah
ayahs.get("/:surahId/translation/:lang", async (c) => {
  const surahId = c.req.param("surahId");
  const lang = c.req.param("lang");
  const data = await readFile(
    join(DATA_DIR, "translation", lang, `${lang}_translation_${surahId}.json`),
    "utf-8"
  );
  return c.json(JSON.parse(data));
});

export default ayahs;
