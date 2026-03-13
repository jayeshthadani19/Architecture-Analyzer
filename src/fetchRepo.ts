import { Octokit } from "@octokit/rest";

export interface RepoInfo {
  fullName: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  topics: string[];
  stargazersCount: number;
  structure: DirectoryEntry[];
}

export interface DirectoryEntry {
  path: string;
  type: "file" | "dir";
  size?: number;
}

/** Maximum number of tree entries to include in the structure summary. */
const MAX_STRUCTURE_ENTRIES = 500;

/** Maximum number of bytes to read from a single file (8 KB). */
const MAX_FILE_CONTENT_SIZE = 8192;

/**
 * Key configuration / metadata files we try to fetch to understand
 * the technology stack and architecture of a repository.
 */
const INTERESTING_FILES = [
  "README.md",
  "README.rst",
  "README.txt",
  "package.json",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Cargo.toml",
  "go.mod",
  "requirements.txt",
  "pyproject.toml",
  "setup.py",
  "Gemfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "Dockerfile",
  ".github/workflows",
];

/**
 * Fetch high-level repository information and top-level directory structure.
 */
export async function fetchRepoInfo(
  owner: string,
  repo: string,
  token?: string,
): Promise<RepoInfo> {
  const octokit = new Octokit({ auth: token });

  // Fetch repository metadata
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });

  // Fetch top-level directory tree (non-recursive to keep it fast)
  let structure: DirectoryEntry[] = [];
  try {
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: "1",
    });

    structure = (tree.tree as Array<{ path?: string; type?: string; size?: number }>)
      .filter((item) => item.path && item.type)
      .map((item) => ({
        path: item.path as string,
        type: (item.type === "tree" ? "dir" : "file") as "file" | "dir",
        size: item.size,
      }))
      // Limit to avoid overwhelming the LLM context
      .slice(0, MAX_STRUCTURE_ENTRIES);
  } catch {
    // Tree may be truncated for very large repos — that's okay
  }

  return {
    fullName: repoData.full_name,
    description: repoData.description ?? null,
    defaultBranch: repoData.default_branch,
    language: repoData.language ?? null,
    topics: repoData.topics ?? [],
    stargazersCount: repoData.stargazers_count,
    structure,
  };
}

/**
 * Attempt to fetch the content of a specific file in the repository.
 * Returns null if the file doesn't exist or is too large.
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  token?: string,
): Promise<string | null> {
  const octokit = new Octokit({ auth: token });

  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });

    if (Array.isArray(data) || data.type !== "file") return null;

    // GitHub returns base64-encoded content
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    // Cap at MAX_FILE_CONTENT_SIZE to stay within reasonable LLM context limits
    return content.slice(0, MAX_FILE_CONTENT_SIZE);
  } catch {
    return null;
  }
}

/**
 * Collect context snippets for the most relevant files in the repository.
 */
export async function collectRepoContext(
  owner: string,
  repo: string,
  token?: string,
): Promise<string> {
  const parts: string[] = [];

  for (const filePath of INTERESTING_FILES) {
    const content = await fetchFileContent(owner, repo, filePath, token);
    if (content) {
      parts.push(`### ${filePath}\n\`\`\`\n${content}\n\`\`\``);
    }
  }

  return parts.join("\n\n");
}
