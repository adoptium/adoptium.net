import { describe, it, expect } from "vitest";
import { parseNewsFilters } from "../parseNewsFilters";

describe("parseNewsFilters", () => {
  it("returns empty object when searchParams is undefined", () => {
    expect(parseNewsFilters()).toEqual({
      tag: undefined,
      author: undefined,
      source: undefined,
    });
  });

  it("returns empty filters when no params provided", () => {
    expect(parseNewsFilters({})).toEqual({
      tag: undefined,
      author: undefined,
      source: undefined,
    });
  });

  it("parses valid string tag and author", () => {
    const result = parseNewsFilters({
      tag: "java",
      author: "jdoe",
    });

    expect(result).toEqual({
      tag: "java",
      author: "jdoe",
      source: undefined,
    });
  });

  it("accepts valid source values", () => {
    expect(parseNewsFilters({ source: "adoptium" })).toEqual({
      tag: undefined,
      author: undefined,
      source: "adoptium",
    });

    expect(parseNewsFilters({ source: "eclipse" })).toEqual({
      tag: undefined,
      author: undefined,
      source: "eclipse",
    });
  });

  it("rejects invalid source values", () => {
    const result = parseNewsFilters({
      source: "random-source",
    });

    expect(result).toEqual({
      tag: undefined,
      author: undefined,
      source: undefined,
    });
  });

  it("rejects array values for tag, author, and source", () => {
    const result = parseNewsFilters({
      tag: ["java"],
      author: ["jdoe"],
      source: ["adoptium"],
    });

    expect(result).toEqual({
      tag: undefined,
      author: undefined,
      source: undefined,
    });
  });

  it("handles mixed valid and invalid inputs", () => {
    const result = parseNewsFilters({
      tag: "java",
      author: ["invalid"],
      source: "eclipse",
    });

    expect(result).toEqual({
      tag: "java",
      author: undefined,
      source: "eclipse",
    });
  });
});
