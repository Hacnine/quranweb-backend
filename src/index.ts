import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import surahRoutes from "./routes/surahs";
import ayahRoutes from "./routes/ayahs";
import searchRoutes from "./routes/search";

const app = new Hono();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use("*", logger());
app.use("*", prettyJSON());

// ── Routes ────────────────────────────────────────────────────────────────────
app.route("/api/surahs", surahRoutes);
app.route("/api/ayahs", ayahRoutes);
app.route("/api/search", searchRoutes);

app.get("/", (c) =>
  c.json({ message: "QuranWeb API", version: "1.0.0", status: "ok" })
);

// ── Start ─────────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT ?? 3001);

export default {
  port,
  fetch: app.fetch,
};
