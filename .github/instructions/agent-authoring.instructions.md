---
description: "Use when creating or editing .agent.md files in this workspace. Enforces agent authoring conventions: description format, tool minimalism, sub-agent visibility, constraint blocks, and output structure."
applyTo: ".github/agents/*.agent.md"
---

# Agent Authoring Conventions

## Frontmatter Rules

- `description` MUST use the `"Use when: ..."` pattern with keyword-rich trigger phrases — this is the primary discovery surface
- `tools` MUST be the minimal set the agent needs; never include tools that the agent's constraints forbid using (e.g., do not list `execute` for a read-only agent)
- Sub-agents (not user-facing) MUST set `user-invocable: false`
- Orchestrator agents that delegate MUST declare `agents: [...]` listing only the sub-agents they may invoke
- `argument-hint` SHOULD be included to guide callers

## Body Structure

Every agent body MUST follow this section order:

1. **One-line persona statement** — who the agent is and what its job is
2. **Responsibilities** — bullet list of what it does
3. **Constraints** — explicit `DO NOT` rules (what it must never do)
4. **Approach** — numbered steps describing how the agent works
5. **Output Format** — exact structure, section names, and diagram types the agent produces

## Constraint Block Rules

- Every agent MUST have a `## Constraints` block
- Read-only agents MUST include all three of these constraints verbatim:
  - `DO NOT modify, refactor, or suggest changes to source code — this is a read-only analysis role`
  - `DO NOT execute code, run tests, or install packages`
  - `DO NOT speculate — every claim must be traceable to a file you read`
- Orchestrator agents that delegate MUST constrain themselves to synthesis only; deep analysis belongs in sub-agents

## Diagrams

- Every agent that produces structural output MUST specify Mermaid diagram types in its Output Format section
- Diagram fences in the Output Format MUST include the diagram type keyword and a `...` placeholder:
  ````
  ```mermaid
  graph TD
    ...
  ```
  ````

## Stream Analysis Sub-agents

This workspace uses three specialist read-only sub-agents for stream analysis:

| Sub-agent | Scope | File |
|---|---|---|
| `frontend-analyst` | UI components, routing, state, API clients | `frontend-analyst.agent.md` |
| `backend-analyst` | API endpoints, services, middleware, auth | `backend-analyst.agent.md` |
| `data-analyst` | Models, migrations, pipelines, repositories | `data-analyst.agent.md` |

- These sub-agents are `user-invocable: false` and must remain read-only
- New stream sub-agents follow the same pattern: scoped path input → structured report output, no file writes

## Output Destination

- Architecture analysis output MUST be saved to `docs/architecture.md` by default
- Inline output is acceptable only when the user explicitly requests it
