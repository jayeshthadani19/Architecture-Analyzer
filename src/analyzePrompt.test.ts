import { buildSystemPrompt, buildAnalysisPrompt } from "./analyzePrompt.js";
import type { RepoInfo } from "./fetchRepo.js";

const mockRepoInfo: RepoInfo = {
  fullName: "dotnet/eShop",
  description: "A reference .NET application implementing an eCommerce site",
  defaultBranch: "main",
  language: "C#",
  topics: ["dotnet", "microservices", "aspnet-core"],
  stargazersCount: 5000,
  structure: [
    { path: "src", type: "dir" },
    { path: "src/Catalog.API", type: "dir" },
    { path: "src/Basket.API", type: "dir" },
    { path: "docker-compose.yml", type: "file" },
    { path: "README.md", type: "file" },
  ],
};

describe("buildSystemPrompt", () => {
  test("returns a non-empty string", () => {
    expect(buildSystemPrompt()).toBeTruthy();
    expect(typeof buildSystemPrompt()).toBe("string");
  });

  test("mentions architecture analysis topics", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toMatch(/architect/i);
    expect(prompt).toMatch(/technology stack/i);
  });
});

describe("buildAnalysisPrompt", () => {
  test("includes the repository full name", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).toContain("dotnet/eShop");
  });

  test("includes the description when present", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).toContain(mockRepoInfo.description!);
  });

  test("includes language", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).toContain("C#");
  });

  test("includes topics", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).toContain("microservices");
  });

  test("includes file structure entries", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).toContain("src/Catalog.API");
    expect(result).toContain("docker-compose.yml");
  });

  test("includes file context when provided", () => {
    const fileContext = "### README.md\n```\nHello world\n```";
    const result = buildAnalysisPrompt(mockRepoInfo, fileContext, null);
    expect(result).toContain("Hello world");
  });

  test("includes scope filter when provided", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", "backend only");
    expect(result).toContain("backend only");
  });

  test("does not include scope section when scope is null", () => {
    const result = buildAnalysisPrompt(mockRepoInfo, "", null);
    expect(result).not.toMatch(/scope filter/i);
  });

  test("handles repo with no description gracefully", () => {
    const noDesc = { ...mockRepoInfo, description: null };
    expect(() => buildAnalysisPrompt(noDesc, "", null)).not.toThrow();
    const result = buildAnalysisPrompt(noDesc, "", null);
    expect(result).not.toContain("**Description:**");
  });

  test("handles empty topics gracefully", () => {
    const noTopics = { ...mockRepoInfo, topics: [] };
    const result = buildAnalysisPrompt(noTopics, "", null);
    expect(result).not.toContain("**Topics:**");
  });
});
