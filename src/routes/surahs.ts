import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";

const surahs = new Hono();

const DATA_DIR = join(process.cwd(), "data");

// GET /api/surahs – list all surahs
surahs.get("/", async (c) => {
  const data = await readFile(join(DATA_DIR, "surah.json"), "utf-8");
  return c.json(JSON.parse(data));
});

// GET /api/surahs/:id – get a single surah with its ayahs
surahs.get("/:id", async (c) => {
  const id = c.req.param("id").padStart(1, "0");
  const data = await readFile(
    join(DATA_DIR, "surah", `surah_${id}.json`),
    "utf-8"
  );
  return c.json(JSON.parse(data));
});

export default surahs;
