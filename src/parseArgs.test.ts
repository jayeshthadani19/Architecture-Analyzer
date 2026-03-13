import { parseAnalyzeArgs } from "./parseArgs.js";

describe("parseAnalyzeArgs", () => {
  describe("default behavior", () => {
    test("empty string defaults to dotnet/eShop with no scope", () => {
      expect(parseAnalyzeArgs("")).toEqual({
        owner: "dotnet",
        repo: "eShop",
        scope: null,
      });
    });

    test("bare slash command defaults to dotnet/eShop with no scope", () => {
      expect(parseAnalyzeArgs("/analyze-repo-architecture")).toEqual({
        owner: "dotnet",
        repo: "eShop",
        scope: null,
      });
    });

    test("command without leading slash defaults to dotnet/eShop", () => {
      expect(parseAnalyzeArgs("analyze-repo-architecture")).toEqual({
        owner: "dotnet",
        repo: "eShop",
        scope: null,
      });
    });

    test("command with only whitespace defaults to dotnet/eShop", () => {
      expect(parseAnalyzeArgs("  /analyze-repo-architecture   ")).toEqual({
        owner: "dotnet",
        repo: "eShop",
        scope: null,
      });
    });
  });

  describe("URL-based parsing", () => {
    test("parses owner and repo from a GitHub URL", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/dotnet/eShop",
        ),
      ).toEqual({ owner: "dotnet", repo: "eShop", scope: null });
    });

    test("parses a different repository URL", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/facebook/react",
        ),
      ).toEqual({ owner: "facebook", repo: "react", scope: null });
    });

    test("strips .git suffix from repo name", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/torvalds/linux.git",
        ),
      ).toEqual({ owner: "torvalds", repo: "linux", scope: null });
    });

    test("parses URL without slash command prefix", () => {
      expect(
        parseAnalyzeArgs("https://github.com/microsoft/vscode"),
      ).toEqual({ owner: "microsoft", repo: "vscode", scope: null });
    });
  });

  describe("URL with scope filter", () => {
    test("captures scope text after the URL", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/dotnet/eShop backend only",
        ),
      ).toEqual({ owner: "dotnet", repo: "eShop", scope: "backend only" });
    });

    test("captures multi-word scope", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/facebook/react frontend components and hooks",
        ),
      ).toEqual({
        owner: "facebook",
        repo: "react",
        scope: "frontend components and hooks",
      });
    });

    test("trims whitespace around scope", () => {
      expect(
        parseAnalyzeArgs(
          "/analyze-repo-architecture https://github.com/dotnet/eShop   database layer   ",
        ),
      ).toEqual({ owner: "dotnet", repo: "eShop", scope: "database layer" });
    });
  });

  describe("case insensitivity", () => {
    test("command matching is case-insensitive", () => {
      expect(
        parseAnalyzeArgs(
          "/Analyze-Repo-Architecture https://github.com/dotnet/eShop",
        ),
      ).toEqual({ owner: "dotnet", repo: "eShop", scope: null });
    });
  });
});
