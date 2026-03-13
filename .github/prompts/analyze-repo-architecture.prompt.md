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

## Error Handling

| Failure | Condition | Action |
|---|---|---|
| Missing URL | `{{repo_url}}` is blank or not a valid `https://github.com/` URL | Warn the user, fall back to `https://github.com/dotnet/eShop`, and continue |
| Clone failure | `git clone` exits non-zero (auth error, network error, repo not found) | Stop immediately. Report the exact error message. Ask the user to check the URL, ensure the repo is public, and that `git` is available in PATH. Do NOT proceed to analysis. |
| Target path already exists | `.analysis/<repo-name>/` already exists from a prior run | Skip cloning. Notify the user the cached clone will be used. Proceed to Step 2. |
| Empty clone | Clone succeeds but `.analysis/<repo-name>/` contains no files | Stop. Report that the repository appears to be empty and ask the user to verify. |
| Write failure | `docs/` cannot be created or `docs/architecture.md` cannot be written | Report the write error. Ask the user to check workspace permissions. |

---

## Steps

### 1 — Clone the Repository

Clone into a temporary folder inside the workspace:

```
git clone --depth=1 <repo_url> .analysis/<repo-name>
```

Use `--depth=1` to avoid fetching full history. Set the working target path to `.analysis/<repo-name>/`.

> **On failure**: If `git clone` returns an error, stop and report the failure to the user. Do not proceed to Step 2. See the Error Handling table above.

### 2 — Run the Architecture Blueprint Skill

Invoke the `/architecture-blueprint` skill on the cloned path:

- Pass `.analysis/<repo-name>/` as the root path
- `architect.agent` is the main agent that will orchestrate the analysis, detect streams, delegate to sub-agents, and synthesize the final blueprint
- Let the skill auto-detect streams (Frontend / Backend / Data)
- Allow delegation to `frontend-analyst`, `backend-analyst`, and `data-analyst` sub-agents as needed

> **On failure**: If no streams are detected, report to the user that no recognisable technology signals were found and ask them to confirm the repository URL or specify a stream scope manually (e.g., `frontend only`).

### 3 — Save Output

Write the full synthesized blueprint to `docs/architecture.md` in the current workspace using the structure in [architecture-template.md](../skills/architecture-blueprint/assets/architecture-template.md).

Create `docs/` if it does not exist.

> **On failure**: If the file cannot be written, report the error and ask the user to check workspace folder permissions.

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
