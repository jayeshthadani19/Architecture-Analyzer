# Architecture-Analyzer

A **GitHub Copilot Extension** that analyses the architecture of any public GitHub repository and explains its design, technology stack, and key components.

## Usage

Type the following in any GitHub Copilot Chat that has this extension enabled:

| Command | Description |
|---|---|
| `/analyze-repo-architecture` | Analyse the default repository (`dotnet/eShop`) |
| `/analyze-repo-architecture https://github.com/owner/repo` | Analyse a specific repository |
| `/analyze-repo-architecture https://github.com/owner/repo backend only` | Analyse a specific repository, focusing on a scope |

### Examples

```
/analyze-repo-architecture
/analyze-repo-architecture https://github.com/dotnet/eShop
/analyze-repo-architecture https://github.com/dotnet/eShop backend only
/analyze-repo-architecture https://github.com/facebook/react frontend components and hooks
```

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Run locally

```bash
npm start
```

The server listens on port `3000` by default. Set the `PORT` environment variable to change it.

### Run tests

```bash
npm test
```

## Architecture

The extension is a Node.js/TypeScript HTTP server built with:

- **Express 5** – HTTP server
- **`@copilot-extensions/preview-sdk`** – GitHub Copilot Extension utilities (request verification, SSE event helpers, LLM prompt helper)
- **`@octokit/rest`** – GitHub REST API client for fetching repository metadata and file contents

### Request flow

1. GitHub Copilot sends a `POST /` request (Server-Sent Events, SSE).
2. The server verifies the request signature using GitHub's public keys.
3. The user message is parsed to extract the target repository and optional scope filter.
4. Repository metadata and key file contents are fetched from the GitHub API.
5. A structured prompt is sent to the Copilot LLM (`gpt-4o`).
6. The LLM response is streamed back to the user.

## Deployment

Deploy this server anywhere that can serve HTTPS and is reachable from GitHub's infrastructure. Then register it as a GitHub App / Copilot Extension in your GitHub organization or user account settings.
