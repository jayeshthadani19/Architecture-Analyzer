---
name: analyze-repo-architecture
description: "Clone a public GitHub repository and run a full architecture blueprint analysis using the architecture-blueprint skill. Produces docs/architecture.md with Mermaid diagrams, API surface, dependency maps, and cross-stream contracts."
argument-hint: "GitHub repository URL (e.g., https://github.com/owner/repo). Optionally add a scope: 'frontend only', 'backend only', 'data only'."
agent: architect
tools: [read, search, edit, todo, agent, execute]
---

# Analyze Repository Architecture

You are the `architect` agent. Perform a full architectural blueprint analysis of the GitHub repository provided below, then save the output to `docs/architecture.md` in the current workspace.

## Target Repository

**URL**: {{repo_url}}

> If no URL was supplied, use: `https://github.com/dotnet/eShop`

## Steps

### 1 — Clone the Repository

Clone into a temporary folder inside the workspace:

```
git clone --depth=1 <repo_url> .analysis/<repo-name>
```

Use `--depth=1` to avoid fetching full history. Set the working target path to `.analysis/<repo-name>/`.

### 2 — Run the Architecture Blueprint Skill

Invoke the `/architecture-blueprint` skill on the cloned path:

- Pass `.analysis/<repo-name>/` as the root path
- architect.agent is the main agent that will orchestrate the analysis, detect streams, delegate to sub-agents, and synthesize the final blueprint
- Let the skill auto-detect streams (Frontend / Backend / Data)
- Allow delegation to `frontend-analyst`, `backend-analyst`, and `data-analyst` sub-agents as needed

### 3 — Save Output

Write the full synthesized blueprint to `docs/architecture.md` in the current workspace using the structure in [architecture-template.md](../skills/architecture-blueprint/assets/architecture-template.md).

Create `docs/` if it does not exist.

### 4 — Confirm & Clean Up

- Confirm the output path to the user: `docs/architecture.md`
- Report which streams were detected and which sub-agents were invoked
- Optionally remove `.analysis/` if the user does not need the cloned source

## Output Summary to Report Back

After saving, tell the user:

1. Streams detected (Frontend / Backend / Data)
2. Tech stack identified per stream
3. Architectural pattern (e.g., microservices, modular monolith, clean architecture)
4. Total number of API endpoints documented
5. Link to `docs/architecture.md`
