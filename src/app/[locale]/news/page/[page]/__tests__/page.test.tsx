import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import NewsPage from "../page";
import { notFound, redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Use vi.fn so we can inspect calls
vi.mock("@/components/News/NewsPageContent", () => ({
  default: vi.fn((props) => <div data-testid="news-page-content" />),
}));

import NewsPageContent from "@/components/News/NewsPageContent";

describe("NewsPage (paginated)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("redirects to /news if page is 1", async () => {
    await NewsPage({
      params: Promise.resolve({ page: "1" }),
      searchParams: Promise.resolve({}),
    });

    expect(redirect).toHaveBeenCalledWith("/news");
  });

  it("calls notFound if page is invalid (NaN)", async () => {
    await NewsPage({
      params: Promise.resolve({ page: "abc" }),
      searchParams: Promise.resolve({}),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound if page is less than 1", async () => {
    await NewsPage({
      params: Promise.resolve({ page: "0" }),
      searchParams: Promise.resolve({}),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it("renders header and passes correct props to NewsPageContent", async () => {
    const element = await NewsPage({
      params: Promise.resolve({ page: "2" }),
      searchParams: Promise.resolve({ tag: "java" }),
    });

    const { container } = render(element);

    // Header exists
    expect(screen.getByText("News & Updates")).toBeInTheDocument();

    // Child rendered
    expect(screen.getByTestId("news-page-content")).toBeInTheDocument();

    // Assert props passed
    const firstCallProps = (NewsPageContent as any).mock.calls[0][0];

    expect(firstCallProps).toMatchObject({
      pageNumber: 2,
      searchParams: { tag: "java" },
      basePath: "/news",
    });

    // Snapshot
    expect(container).toMatchSnapshot();

    // Accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
