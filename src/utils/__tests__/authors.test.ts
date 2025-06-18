import { describe, it, expect, vi } from "vitest";
import { getFormattedAuthorData } from "../authors";

// Mock the authors.json import
vi.mock("@/data/authors.json", () => ({
  default: {
    jdoe: {
      name: "John Doe",
      summary: "A prolific Java developer.",
      twitter: "@johndoe",
      github: "johndoe",
      linkedin: "john-doe-linkedin",
    },
    asmith: {
      name: "Alice Smith",
      summary: null,
      twitter: null,
      github: "alicesmith",
      // linkedin missing
    },
  },
}));

describe("getFormattedAuthorData", () => {
  it("returns formatted author data for a valid authorId with all fields", () => {
    const author = getFormattedAuthorData("jdoe");
    expect(author).toEqual({
      name: "John Doe",
      summary: "A prolific Java developer.",
      twitter: "@johndoe",
      github: "johndoe",
      linkedin: "john-doe-linkedin",
    });
  });

  it("returns formatted author data for a valid authorId with some null/missing fields", () => {
    const author = getFormattedAuthorData("asmith");
    expect(author).toEqual({
      name: "Alice Smith",
      summary: undefined,
      twitter: undefined,
      github: "alicesmith",
      // linkedin should be omitted
    });
  });

  it("returns Unknown Author for an invalid authorId", () => {
    const author = getFormattedAuthorData("notfound");
    expect(author).toEqual({ name: "Unknown Author" });
  });
});
