import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import NewsPage from "../page";

// Mock child component
vi.mock("@/components/News/NewsPageContent", () => ({
  default: vi.fn((props) => (
    <div data-testid="news-page-content">Page: {props.pageNumber}</div>
  )),
}));

import NewsPageContent from "@/components/News/NewsPageContent";

describe("NewsPage (root)", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders header and NewsPageContent with resolved searchParams", async () => {
    const mockSearchParams = Promise.resolve({
      tag: "release",
      page: "2",
    });

    const element = await NewsPage({
      searchParams: mockSearchParams,
    });

    const { container } = render(element);

    // Header rendered
    expect(screen.getByText("News & Updates")).toBeInTheDocument();

    // Child rendered
    expect(screen.getByTestId("news-page-content")).toBeInTheDocument();

    // Assert props passed correctly (first call only)
    const firstCallProps = (NewsPageContent as any).mock.calls[0][0];

    expect(firstCallProps).toMatchObject({
      pageNumber: 1,
      searchParams: { tag: "release", page: "2" },
      basePath: "/news",
    });

    // Snapshot
    expect(container).toMatchSnapshot();

    // Accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles undefined searchParams gracefully", async () => {
    const element = await NewsPage({});
    render(element);

    const firstCallProps = (NewsPageContent as any).mock.calls[0][0];

    expect(firstCallProps).toMatchObject({
      pageNumber: 1,
      searchParams: undefined,
      basePath: "/news",
    });
  });
});
