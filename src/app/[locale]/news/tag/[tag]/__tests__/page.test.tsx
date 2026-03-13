import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("@/utils/news", () => ({
  getNewsByTag: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

import TagsPage, { generateMetadata } from "../page";
import { getNewsByTag } from "@/utils/news";
import { notFound } from "next/navigation";

const mockGetNewsByTag = getNewsByTag as unknown as ReturnType<typeof vi.fn>;

describe("TagsPage (tag root)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("generateMetadata returns correct metadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ tag: "temurin" }),
    });

    expect(meta).toEqual({
      title: "News with tag: temurin",
      description:
        "News and updates from Eclipse Adoptium Project tagged with temurin",
    });
  });

  it("renders header and news when posts exist", async () => {
    mockGetNewsByTag.mockReturnValue({
      posts: [
        {
          metadata: {
            title: "Tagged News",
            description: "desc",
            date: "2025-06-18",
            author: "author",
            tags: ["temurin"],
          },
          slug: "tagged-news",
          year: "2025",
          month: "06",
        },
      ],
      totalPages: 2,
    });

    const element = await TagsPage({
      params: Promise.resolve({ tag: "temurin" }),
    });

    const { container } = render(element);

    expect(screen.getByText('News tagged with "temurin"')).toBeInTheDocument();
    expect(screen.getByText("Tagged News")).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("calls notFound if no posts for tag", async () => {
    mockGetNewsByTag.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await TagsPage({
      params: Promise.resolve({ tag: "temurin" }),
    });

    expect(notFound).toHaveBeenCalled();
  });
});
