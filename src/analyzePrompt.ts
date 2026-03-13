import type { RepoInfo } from "./fetchRepo.js";

/**
 * Build the system prompt for the architecture analysis.
 */
export function buildSystemPrompt(): string {
  return `You are an expert software architect. When given information about a \
GitHub repository, you analyse and describe its architecture clearly and concisely.

Your analysis should cover:
1. **Overview** – what the project does and its primary purpose
2. **Technology Stack** – languages, frameworks, databases, and infrastructure
3. **High-Level Architecture** – monolith, microservices, serverless, layered, etc.
4. **Key Components** – major modules, services, or layers and their responsibilities
5. **Communication Patterns** – how components interact (REST, gRPC, messaging, etc.)
6. **Infrastructure & Deployment** – containers, CI/CD, cloud platform if evident
7. **Notable Design Decisions** – patterns like CQRS, event sourcing, DDD, etc.

Use markdown formatting. Be concise but thorough. If a scope filter is provided, \
focus only on the requested area of the codebase.`;
}

/**
 * Build the user message to send to the LLM for architecture analysis.
 */
export function buildAnalysisPrompt(
  repoInfo: RepoInfo,
  fileContext: string,
  scope: string | null,
): string {
  const lines: string[] = [];

  lines.push(`## Repository: ${repoInfo.fullName}`);

  if (repoInfo.description) {
    lines.push(`**Description:** ${repoInfo.description}`);
  }

  if (repoInfo.language) {
    lines.push(`**Primary Language:** ${repoInfo.language}`);
  }

  if (repoInfo.topics.length > 0) {
    lines.push(`**Topics:** ${repoInfo.topics.join(", ")}`);
  }

  if (scope) {
    lines.push(`\n**⚠️ Scope filter requested:** Please focus your analysis on: **${scope}**`);
  }

  lines.push("\n## File Structure (sample)");
  const structureSample = repoInfo.structure
    .slice(0, 100)
    .map((e) => `${e.type === "dir" ? "📁" : "📄"} ${e.path}`)
    .join("\n");
  lines.push("```\n" + structureSample + "\n```");

  if (fileContext) {
    lines.push("\n## Key File Contents");
    lines.push(fileContext);
  }

  lines.push(
    "\nPlease provide a comprehensive architecture analysis of this repository" +
      (scope ? `, focusing specifically on: ${scope}` : "") +
      ".",
  );

  return lines.join("\n");
}
