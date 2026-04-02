import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("@/utils/news", () => ({
  getNewsByTag: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

import TaggedNewsPage, { generateMetadata } from "../page";
import { getNewsByTag } from "@/utils/news";
import { notFound, redirect } from "next/navigation";

const mockGetNewsByTag = getNewsByTag as unknown as ReturnType<typeof vi.fn>;

describe("TaggedNewsPage (paginated)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("generateMetadata returns correct metadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ tag: "temurin", page: "2" }),
    });

    expect(meta).toEqual({
      title: "News with tag: temurin - Page 2",
      description:
        "News and updates from Eclipse Adoptium Project tagged with temurin",
    });
  });

  it("redirects to tag root if page is 1", async () => {
    mockGetNewsByTag.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await TaggedNewsPage({
      params: Promise.resolve({ tag: "temurin", page: "1" }),
    });

    expect(redirect).toHaveBeenCalledWith("/news/tag/temurin");
  });

  it("calls notFound if no posts for tag and page", async () => {
    mockGetNewsByTag.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await TaggedNewsPage({
      params: Promise.resolve({ tag: "temurin", page: "2" }),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it("renders news and header for tag and page when posts exist", async () => {
    mockGetNewsByTag.mockReturnValue({
      posts: [
        {
          metadata: {
            title: "Tagged Page 2 News",
            description: "desc",
            date: "2025-06-18",
            author: "author",
            tags: ["temurin"],
          },
          slug: "tagged-page-2-news",
          year: "2025",
          month: "06",
        },
      ],
      totalPages: 3,
    });

    const element = await TaggedNewsPage({
      params: Promise.resolve({ tag: "temurin", page: "2" }),
    });

    const { container } = render(element);

    expect(screen.getByText('News tagged with "temurin"')).toBeInTheDocument();
    expect(screen.getByText("Tagged Page 2 News")).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
