---
name: architecture-blueprint
description: "Comprehensive project architecture blueprint generator. Use when: generate architecture docs, create architectural blueprint, analyze codebase architecture, document tech stack, create Mermaid diagrams, map component dependencies, document API surface, detect architectural patterns, reverse-engineer architecture, produce system design docs, visualize codebase structure, generate architecture.md"
argument-hint: "Repo path or subdirectory to analyze (e.g., '.', 'src/', 'packages/api'). Optionally scope to a stream: 'frontend only', 'backend only', 'data only'."
---

# Architecture Blueprint Generator

Produces a comprehensive `docs/architecture.md` for any codebase by detecting technology stacks, classifying streams (Frontend / Backend / Data), delegating deep analysis to specialist sub-agents, and synthesizing the results into a unified, diagram-rich blueprint.

## When to Use

- On-boarding a new codebase — get a full picture fast
- Before a refactor — document current state as the baseline
- For new team members — generate human-readable system docs
- Before adding a new stream (e.g., adding a frontend to an API-only repo)
- Architecture review prep — produce diagrams and dependency maps

## Procedure

### Step 1 — Discover

Scan the repository root:

1. Read `package.json`, `pyproject.toml`, `go.mod`, `pom.xml`, `Cargo.toml`, or `composer.json` to identify language, framework, and key dependencies
2. List top-level directories — note any that match stream signals (see [stack-patterns.md](./references/stack-patterns.md))
3. Check for monorepo markers: `pnpm-workspace.yaml`, `nx.json`, `turbo.json`, `lerna.json`, `packages/`, `apps/`
4. Read `.env.example` or `config/` to identify external services (DB, cache, queue, CDN)
5. Note CI/CD files (`.github/workflows/`, `Dockerfile`, `docker-compose.yml`) for deployment topology hints

### Step 2 — Classify Streams

Using signals from [stack-patterns.md](./references/stack-patterns.md), determine which streams are present:

| Stream | Delegate Sub-agent | Primary Path Signal |
|---|---|---|
| Frontend | `frontend-analyst` | `src/`, `client/`, `components/`, `pages/`, `app/` |
| Backend | `backend-analyst` | `server/`, `api/`, `controllers/`, `routes/`, `services/` |
| Data | `data-analyst` | `models/`, `migrations/`, `db/`, `schema/`, `pipelines/` |

> For **monorepos**, classify each workspace package independently and run sub-agents per package.

### Step 3 — Delegate to Sub-agents

Invoke each detected sub-agent with its scoped path. Pass:
- The root path to analyze
- The stream type
- Any detected framework name (e.g., "React 18", "NestJS", "Django")

Collect the structured report from each sub-agent before proceeding.

> **Error handling**: If a sub-agent returns an empty report or fails, do NOT abort the whole analysis. Record the failure, continue with the remaining sub-agents, and include a `> ⚠️ Warning` note in the relevant section of the output file.

### Step 4 — Synthesize

Using the sub-agent reports, build the cross-stream view:

1. Identify the **Frontend ↔ Backend contract**: REST, GraphQL, tRPC, WebSocket, or SSR
2. Identify the **Backend ↔ Data contract**: ORM, query builder, raw SQL, event sourcing
3. Find **shared types/schemas** that cross stream boundaries
4. Trace the **end-to-end auth flow**: login UI → API auth → session/token storage
5. List **cross-cutting infrastructure**: logging, observability, feature flags, CDN, queue

### Step 5 — Generate Diagrams

Produce Mermaid diagrams at the appropriate scope:

- **System diagram**: all streams as subgraphs with cross-stream contracts
- **Component diagrams**: per-stream (from sub-agent reports)
- **Sequence diagram**: one representative end-to-end flow (e.g., user login or core feature)
- **ER diagram**: if a Data stream was found (from `data-analyst` report)
- **Dependency map**: inter-module and inter-service edges; flag circular dependencies

### Step 6 — Write Output

Save the final blueprint to `docs/architecture.md` using the structure in [architecture-template.md](./assets/architecture-template.md).

If `docs/` does not exist, create it. Confirm the file path to the user when done.

> **Error handling**: If the file cannot be written (permissions, read-only workspace), print the full blueprint content to the conversation as a fallback so the user does not lose the output.

## Quality Checklist

Before finishing, verify:

- [ ] All detected streams are covered (no stream silently skipped)
- [ ] Every diagram compiles — verify Mermaid syntax (no unclosed brackets, valid node IDs)
- [ ] API table has at least one row per router/controller file found
- [ ] No speculation — every claim in the doc traces to a file read during analysis
- [ ] Cross-stream contracts section is present if more than one stream was detected
- [ ] Output saved to `docs/architecture.md` (or acknowledged as inline per user request)
- [ ] Any sub-agent failures are documented with a `⚠️ Warning` note in the output
- [ ] If no streams were detected, the user was notified and analysis was not silently aborted
- [ ] If output write failed, the blueprint was printed to the conversation as a fallback
