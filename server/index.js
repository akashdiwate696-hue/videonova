import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://akashdiwate696-hue.github.io";

app.use(cors({ origin: [FRONTEND_ORIGIN, FRONTEND_ORIGIN.replace(/\/$/, "")], methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "VideoNova AI image API" }));

app.post("/api/generate-image", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Server API key is not configured. Add GEMINI_API_KEY in Render Environment." });
    const prompt = String(req.body?.prompt || "").trim();
    if (!prompt || prompt.length > 8000) return res.status(400).json({ error: "A prompt is required (maximum 8000 characters)." });

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemini-3.1-flash-image",
        input: prompt,
        response_format: { type: "image", aspect_ratio: "16:9", image_size: "1K" }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error?.message || data.message || "Gemini image request failed.";
      return res.status(response.status).json({ error: message });
    }
    const imageData = data.output_image?.data || data.output?.find?.(part => part.type === "image")?.data;
    const mimeType = data.output_image?.mime_type || data.output?.find?.(part => part.type === "image")?.mime_type || "image/png";
    if (!imageData) return res.status(502).json({ error: "Gemini did not return image data. Check model access and API billing/limits." });
    res.json({ image: imageData, mimeType });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected server error." });
  }
});

app.listen(PORT, "0.0.0.0", () => console.log("VideoNova image API listening on " + PORT));
