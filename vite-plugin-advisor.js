import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadAnthropicKey() {
  for (const name of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(join(__dirname, name), "utf8");
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)$/);
        if (m) return m[1].trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      /* missing file */
    }
  }
  return process.env.ANTHROPIC_API_KEY || "";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export function advisorDevPlugin() {
  return {
    name: "fenixrise-advisor-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = (req.url || "").split("?")[0];
        if (pathOnly !== "/__advisor/chat") return next();
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.end();
          return;
        }
        if (req.method !== "POST") return next();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json; charset=utf-8");

        try {
          const raw = await readBody(req);
          const body = JSON.parse(raw || "{}");
          const messages = Array.isArray(body.messages) ? body.messages : [];
          const apiKey = process.env.ANTHROPIC_API_KEY || loadAnthropicKey();

          if (!apiKey) {
            const lastUser = [...messages].reverse().find((m) => m.role === "user");
            const preview = (lastUser?.content || "your question").slice(0, 100);
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                reply:
                  `I'm in demo mode because ANTHROPIC_API_KEY is not set.\n\nYou asked about: "${preview}…"\n\nTo get real AI answers:\n1. Create a key at https://console.anthropic.com\n2. Add to .env in the project root:\n   ANTHROPIC_API_KEY=sk-ant-...\n3. Restart npm run dev\n\nQuick tip: For SAT Math, review linear systems, ratios, and data interpretation; redo every missed problem after 24–48 hours.`,
              })
            );
            return;
          }

          const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              system:
                "You are FenixRise AI Advisor — an expert in SAT, IELTS, university admissions, scholarships, and study planning for students from Uzbekistan and Central Asia. Be specific and actionable. Respond in English unless the user uses another language.",
              messages: messages
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((m) => ({ role: m.role, content: String(m.content ?? "") })),
            }),
          });

          const data = await anthropicRes.json();
          if (!anthropicRes.ok) {
            const msg = data?.error?.message || anthropicRes.statusText || "Anthropic error";
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                reply: `The AI service returned an error: ${msg}. Check your API key and billing.`,
              })
            );
            return;
          }

          const text = data?.content?.[0]?.text || "No text in response.";
          res.statusCode = 200;
          res.end(JSON.stringify({ reply: text }));
        } catch (e) {
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              reply: `Advisor handler error: ${e?.message || "unknown"}. Try restarting the dev server.`,
            })
          );
        }
      });
    },
  };
}
