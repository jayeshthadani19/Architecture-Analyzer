---
description: "Use when creating or editing SKILL.md files or skill assets in this workspace. Enforces skill authoring conventions: description format, progressive loading structure, procedure format, and quality checklist requirement."
applyTo: ".github/skills/**"
---

# Skill Authoring Conventions

## Directory Structure

Every skill MUST follow this layout:

```
.github/skills/<skill-name>/
├── SKILL.md                  ← required; name field must match folder name
├── references/               ← lazily loaded reference docs
│   └── *.md
└── assets/                   ← templates, boilerplate
    └── *.md
```

- `SKILL.md` MUST stay under 500 lines — move bulk content into `references/` or `assets/`
- All file references in `SKILL.md` MUST use `./` relative paths

## Frontmatter Rules

- `name` MUST exactly match the folder name (lowercase, hyphen-separated)
- `description` MUST use the `"Use when: ..."` pattern with keyword-rich trigger phrases
- `argument-hint` SHOULD describe what input to pass when invoking as a slash command

## Body Structure

Every `SKILL.md` body MUST follow this section order:

1. **One-paragraph summary** — what the skill produces and why it exists
2. **When to Use** — bullet list of trigger situations
3. **Procedure** — numbered steps with sub-steps; reference external files where needed:
   - Use `[file](./references/file.md)` for reference docs loaded lazily
   - Use `[template](./assets/template.md)` for output templates
4. **Quality Checklist** — checkboxes verifying completion criteria before the skill is done

## Quality Checklist Requirement

Every skill MUST end with a `## Quality Checklist` containing `- [ ]` checkboxes. At minimum include:

- A check that all required output sections are present
- A check that Mermaid syntax is valid (no unclosed brackets)
- A check that no speculation was introduced (claims trace to source files)
- A check that output was saved to the correct destination

## Progressive Loading

- Put discovery signals, pattern tables, and technology reference data in `references/`
- Put output templates and boilerplate in `assets/`
- Only reference these files from `SKILL.md` — do not inline their full content

## Diagram Requirements

Skills that produce architectural output MUST:
- Generate at least one Mermaid system-level diagram
- Reference the `architecture-template.md` asset for consistent output structure
- Verify Mermaid syntax before writing output (no unclosed brackets, valid node IDs)
