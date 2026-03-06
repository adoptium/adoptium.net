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
  redirect: vi.fn(),
}));

import AuthorNewsPagePaginated, { generateMetadata } from "../page";
import { getNewsByAuthor } from "@/utils/news";
import { getFormattedAuthorData } from "@/utils/authors";
import { notFound, redirect } from "next/navigation";

const mockGetNewsByAuthor = getNewsByAuthor as unknown as ReturnType<
  typeof vi.fn
>;

const mockGetFormattedAuthorData =
  getFormattedAuthorData as unknown as ReturnType<typeof vi.fn>;

describe("AuthorNewsPagePaginated", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("generateMetadata returns correct metadata", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    const meta = await generateMetadata({
      params: Promise.resolve({ author: "jane-doe", page: "2" }),
    });

    expect(meta).toEqual({
      title: "Jane Doe - Page 2",
      description:
        "News and updates from Eclipse Adoptium Project authored by Jane Doe",
    });
  });

  it("redirects to author root if page is 1", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    mockGetNewsByAuthor.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await AuthorNewsPagePaginated({
      params: Promise.resolve({ author: "jane-doe", page: "1" }),
    });

    expect(redirect).toHaveBeenCalledWith("/news/author/jane-doe");
  });

  it("calls notFound if no posts for author and page", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    mockGetNewsByAuthor.mockReturnValue({
      posts: [],
      totalPages: 1,
    });

    await AuthorNewsPagePaginated({
      params: Promise.resolve({ author: "jane-doe", page: "2" }),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it("renders news and header for author and page when posts exist", async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: "Jane Doe" });

    mockGetNewsByAuthor.mockReturnValue({
      posts: [
        {
          metadata: {
            title: "Author Page 2 News",
            description: "desc",
            date: "2025-06-18",
            author: "Jane Doe",
            tags: [],
          },
          slug: "author-page-2-news",
          year: "2025",
          month: "06",
        },
      ],
      totalPages: 3,
    });

    const element = await AuthorNewsPagePaginated({
      params: Promise.resolve({ author: "jane-doe", page: "2" }),
    });

    const { container } = render(element);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Author Page 2 News")).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
