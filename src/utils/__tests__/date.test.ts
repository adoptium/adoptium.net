import { describe, it, expect } from "vitest";
import { formatDate } from "../date";

describe("formatDate", () => {
  it('formats a valid ISO date string to "Month DD, YYYY"', () => {
    expect(formatDate("2023-06-18")).toBe("June 18, 2023");
  });

  it("formats a valid date string with different month", () => {
    expect(formatDate("2022-01-05")).toBe("January 05, 2022");
  });

  it("returns today's date if no argument is given", () => {
    const today = new Date();
    const expected = today.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    expect(formatDate()).toBe(expected);
  });

  it('handles invalid date string by returning "Invalid Date"', () => {
    expect(formatDate("not-a-date")).toBe("Invalid Date");
  });
});
