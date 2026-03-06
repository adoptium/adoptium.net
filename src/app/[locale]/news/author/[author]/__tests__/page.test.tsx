import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

vi.mock("@/utils/news", () => ({
  getNewsByAuthor: vi.fn(),
}));

vi.mock("@/utils/authors", () => ({
  getFormattedAuthorData: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

import AuthorNewsPage, { generateMetadata } from "../page";
import { getNewsByAuthor } from "@/utils/news";
import { getFormattedAuthorData } from "@/utils/authors";
import { notFound } from "next/navigation";

const mockGetNewsByAuthor = getNewsByAuthor as unknown as ReturnType<
  typeof vi.fn
>;

const mockGetFormattedAuthorData =
  getFormattedAuthorData as unknown as ReturnType<typeof vi.fn>;

describe("AuthorNewsPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("generateMetadata returns correct metadata", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    const meta = await generateMetadata({
      params: Promise.resolve({ author: "jane-doe" }),
    });

    expect(meta).toEqual({
      title: "Jane Doe",
      description:
        "News and updates from Eclipse Adoptium Project authored by Jane Doe",
    });
  });

  it("renders header and news when posts exist", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    mockGetNewsByAuthor.mockReturnValue({
      posts: [
        {
          metadata: {
            title: "Author News",
            description: "desc",
            date: "2025-06-18",
            author: "Jane Doe",
            tags: [],
          },
          slug: "author-news",
          year: "2025",
          month: "06",
        },
      ],
      totalPages: 2,
    });

    const element = await AuthorNewsPage({
      params: Promise.resolve({ author: "jane-doe" }),
    });

    const { container } = render(element);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Author News")).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("calls notFound if no posts for author", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    mockGetNewsByAuthor.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await AuthorNewsPage({
      params: Promise.resolve({ author: "jane-doe" }),
    });

    expect(notFound).toHaveBeenCalled();
  });
});
