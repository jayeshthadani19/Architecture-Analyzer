import express from "express";
import {
  createAckEvent,
  createTextEvent,
  createDoneEvent,
  createErrorsEvent,
  verifyAndParseRequest,
  getUserMessage,
  prompt,
} from "@copilot-extensions/preview-sdk";

import { parseAnalyzeArgs } from "./parseArgs.js";
import { fetchRepoInfo, collectRepoContext } from "./fetchRepo.js";
import { buildSystemPrompt, buildAnalysisPrompt } from "./analyzePrompt.js";

const app = express();

app.use(express.text({ type: "*/*" }));

// Health-check endpoint
app.get("/", (_req, res) => {
  res.send("Architecture Analyzer Copilot Extension is running.");
});

/**
 * Main Copilot Extension endpoint.
 * GitHub Copilot sends POST requests here for every chat interaction.
 */
app.post("/", async (req, res) => {
  const signature = req.headers["github-public-key-signature"] as string;
  const keyId = req.headers["github-public-key-identifier"] as string;
  const tokenHeader = req.headers["x-github-token"] as string | undefined;

  // --- Request verification ---
  let payload: ReturnType<typeof JSON.parse>;
  try {
    const { isValidRequest, payload: parsedPayload } =
      await verifyAndParseRequest(req.body as string, signature, keyId);

    if (!isValidRequest) {
      res.status(401).send("Unauthorized: invalid request signature");
      return;
    }

    payload = parsedPayload;
  } catch (err) {
    // During local development the public key may not be resolvable;
    // fall back to parsing without verification so the server still works.
    if (process.env.NODE_ENV !== "production") {
      try {
        payload = JSON.parse(req.body as string);
      } catch {
        res.status(400).send("Bad request: unable to parse body");
        return;
      }
    } else {
      console.error("Verification error:", err);
      res.status(401).send("Unauthorized");
      return;
    }
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Acknowledge the request immediately
  res.write(createAckEvent());

  const userMessage = getUserMessage(payload);

  // --- Parse arguments from the user message ---
  const { owner, repo, scope } = parseAnalyzeArgs(userMessage);

  res.write(
    createTextEvent(
      `🔍 Analyzing architecture of **${owner}/${repo}**${scope ? ` (scope: *${scope}*)` : ""}...\n\n`,
    ),
  );

  // --- Fetch repository information ---
  let repoInfo;
  try {
    repoInfo = await fetchRepoInfo(owner, repo, tokenHeader);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error fetching repository";
    res.write(
      createErrorsEvent([
        {
          type: "agent",
          code: "REPO_FETCH_ERROR",
          message: `Failed to fetch repository ${owner}/${repo}: ${message}`,
          identifier: "fetchRepoInfo",
        },
      ]),
    );
    res.write(createDoneEvent());
    res.end();
    return;
  }

  // --- Collect key file contents ---
  let fileContext = "";
  try {
    fileContext = await collectRepoContext(owner, repo, tokenHeader);
  } catch {
    // Non-fatal — proceed without file context
  }

  // --- Build prompts ---
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildAnalysisPrompt(repoInfo, fileContext, scope);

  // --- Call the Copilot LLM ---
  try {
    const response = await prompt(userPrompt, {
      token: tokenHeader ?? "",
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...payload.messages.slice(0, -1),
      ],
    });

    const content = response.message.content ?? "";
    res.write(createTextEvent(content));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown LLM error";
    res.write(
      createErrorsEvent([
        {
          type: "agent",
          code: "LLM_ERROR",
          message: `Failed to generate analysis: ${message}`,
          identifier: "prompt",
        },
      ]),
    );
  }

  res.write(createDoneEvent());
  res.end();
});

const PORT = parseInt(process.env.PORT ?? "3000", 10);
app.listen(PORT, () => {
  console.log(`Architecture Analyzer running on port ${PORT}`);
});

export default app;
