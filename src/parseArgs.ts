/**
 * Parses the user message for the /analyze-repo-architecture command.
 *
 * Supported formats:
 *   /analyze-repo-architecture
 *   /analyze-repo-architecture https://github.com/owner/repo
 *   /analyze-repo-architecture https://github.com/owner/repo <scope>
 *
 * The leading slash-command token is optional since Copilot may strip it
 * before forwarding the message to the extension.
 */

export interface ParsedArgs {
  owner: string;
  repo: string;
  scope: string | null;
}

const DEFAULT_OWNER = "dotnet";
const DEFAULT_REPO = "eShop";

const GITHUB_URL_PATTERN =
  /https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/;

/**
 * Parse the raw user message into structured arguments.
 *
 * @param message - The raw text the user sent (possibly including the slash command).
 * @returns Parsed owner, repo and optional scope string.
 */
export function parseAnalyzeArgs(message: string): ParsedArgs {
  // Strip leading slash command token if present, e.g. "/analyze-repo-architecture"
  const stripped = message
    .trim()
    .replace(/^\/?analyze-repo-architecture\s*/i, "")
    .trim();

  if (!stripped) {
    return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO, scope: null };
  }

  const match = stripped.match(GITHUB_URL_PATTERN);
  if (!match) {
    // No URL found — treat the whole message as a scope against the default repo
    return {
      owner: DEFAULT_OWNER,
      repo: DEFAULT_REPO,
      scope: stripped || null,
    };
  }

  const [fullUrl, owner, repoRaw] = match;
  // Remove trailing ".git" if present
  const repo = repoRaw.replace(/\.git$/, "");

  // Everything after the matched URL is the scope
  const afterUrl = stripped.slice(stripped.indexOf(fullUrl) + fullUrl.length).trim();
  const scope = afterUrl || null;

  return { owner, repo, scope };
}
