import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, afterEach, expect, it, vi } from "vitest";
import ReleaseNotesRender, { fetchTitle, sortReleaseNotesBy } from "../index";
import type { ReleaseNoteAPIResponse } from "@/hooks";
import { useFetchReleaseNotesForVersion } from "@/hooks/fetchReleaseNotes";
import { createMockReleaseNotesAPI } from "./__fixtures__/hooks";

vi.mock("@/hooks/fetchReleaseNotes");

// Dynamic mock for useSearchParams
let mockVersionParam: string | undefined = "jdk-17.0.1+12";
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "version") return mockVersionParam;
      return undefined;
    },
  }),
  useLocale: () => "en",
}));

afterEach(() => {
  vi.clearAllMocks();
  mockVersionParam = undefined; // reset between tests
});

describe("ReleaseNotesRender component", () => {
  it("should render correctly", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: createMockReleaseNotesAPI(2),
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);

    // check if 2 rows are rendered
    expect(container.querySelectorAll("[data-row]")).toHaveLength(2);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly - version not defined", () => {
    mockVersionParam = undefined;

    const { container } = render(<ReleaseNotesRender />);
    expect(container).toMatchSnapshot();
  });

  it("fetchTitle should return correct title", () => {
    expect(fetchTitle("1")).toContain("P1");
    expect(fetchTitle("2")).toContain("P2");
    expect(fetchTitle("3")).toContain("P3");
    expect(fetchTitle("4")).toContain("P4");
    expect(fetchTitle("5")).toContain("P5");
    expect(fetchTitle("6")).toContain("not publicly visible");
    expect(fetchTitle(null as unknown as string)).toBeUndefined();
    expect(fetchTitle("123")).toBeUndefined();
  });

  // Set type to 'Enhancement' by default if version matches jdk-xx+xx
  it("should render correctly - type set to Enhancement", async () => {
    mockVersionParam = "jdk-20+36";

    function mockReleaseNotes(num: number) {
      const releaseNoteDataBag = {
        releaseNoteAPIResponse: createMockReleaseNotesAPI(num),
        isValid: true,
      };
      releaseNoteDataBag.releaseNoteAPIResponse.release_name = "jdk-20+36";
      releaseNoteDataBag.releaseNoteAPIResponse.release_notes[0].type =
        "Enhancement";
      return releaseNoteDataBag;
    }

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue(mockReleaseNotes(2));
    const { container } = render(<ReleaseNotesRender />);

    // check if 1 row is rendered and 1 is filtered out
    expect(container.querySelectorAll("[data-row]")).toHaveLength(1);
  });

  // sets priority as p? when priority is not defined
  it("should render correctly - priority not defined", () => {
    mockVersionParam = "version";
    function mockReleaseNotes() {
      const releaseNoteDataBag = {
        releaseNoteAPIResponse: createMockReleaseNotesAPI(1),
        isValid: true,
      };
      releaseNoteDataBag.releaseNoteAPIResponse.release_name = "version";
      releaseNoteDataBag.releaseNoteAPIResponse.release_notes[0].priority =
        null;
      return releaseNoteDataBag;
    }

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue(mockReleaseNotes());
    const { container } = render(<ReleaseNotesRender />);

    const priorityColumn = container.querySelectorAll(
      "[data-field='priority']",
    )[0];
    expect(priorityColumn.textContent).toContain("P?");
  });

  it("should render correctly - no release notes", () => {
    mockVersionParam = "version";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: createMockReleaseNotesAPI(0),
      isValid: false,
    });
    const { container } = render(<ReleaseNotesRender />);
    expect(container).toMatchSnapshot();
  });

  it("properly sort release notes", () => {
    const unsortedReleaseNotes = {
      release_name: "jdk-19.0.2+7",
      release_notes: [
        {
          id: "100",
          priority: "2",
          component: "component_b",
        },
        {
          id: "200",
          component: "component_a",
          priority: "2",
        },
        {
          id: "300",
          component: "component_a",
          priority: "1",
        },
      ],
    };

    const result = sortReleaseNotesBy(
      unsortedReleaseNotes as unknown as ReleaseNoteAPIResponse,
    );

    expect(result.release_notes[0].id).toBe("300");
    expect(result.release_notes[1].id).toBe("200");
    expect(result.release_notes[2].id).toBe("100");
  });

  it("toggles sort direction when clicking priority header", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: createMockReleaseNotesAPI(2),
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);

    // Initially ascending (▲)
    const header = container.querySelector("th") as HTMLElement;
    expect(header.textContent).toContain("▲");

    // Click to toggle to descending
    fireEvent.click(header);
    expect(header.textContent).toContain("▼");
  });

  it("filters by priority via select", () => {
    mockVersionParam = "jdk-17.0.1+12";

    const mockData = createMockReleaseNotesAPI(3);
    mockData.release_notes[0].priority = "1";
    mockData.release_notes[1].priority = "2";
    mockData.release_notes[2].priority = "1";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: mockData,
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);
    const prioritySelect = container.querySelector(
      'select[aria-label="Filter by priority"]',
    ) as HTMLSelectElement;

    fireEvent.change(prioritySelect, { target: { value: "2" } });

    expect(container.querySelectorAll("[data-row]")).toHaveLength(1);
  });

  it("filters by component via select", () => {
    mockVersionParam = "jdk-17.0.1+12";

    const mockData = createMockReleaseNotesAPI(2);
    mockData.release_notes[0].component = "core-libs";
    mockData.release_notes[1].component = "hotspot";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: mockData,
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);
    const componentSelect = container.querySelector(
      'select[aria-label="Filter by component"]',
    ) as HTMLSelectElement;

    fireEvent.change(componentSelect, { target: { value: "hotspot" } });

    expect(container.querySelectorAll("[data-row]")).toHaveLength(1);
  });

  it("exports CSV when export button is clicked", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: createMockReleaseNotesAPI(2),
      isValid: true,
    });

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "a") {
        el.click = clickSpy;
      }
      return el;
    });

    const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const { container } = render(<ReleaseNotesRender />);

    const exportBtn = container.querySelector("button") as HTMLButtonElement;
    fireEvent.click(exportBtn);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it("changes page size via select", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: createMockReleaseNotesAPI(5),
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);

    // Change page size to 50
    const pageSizeSelect = container.querySelector(
      "select:not([aria-label])",
    ) as HTMLSelectElement;
    fireEvent.change(pageSizeSelect, { target: { value: "50" } });

    // All 5 rows should still be visible on one page
    expect(container.querySelectorAll("[data-row]")).toHaveLength(5);
  });

  it("shows no results when filter eliminates all rows", () => {
    mockVersionParam = "jdk-17.0.1+12";

    const mockData = createMockReleaseNotesAPI(2);
    mockData.release_notes[0].priority = "1";
    mockData.release_notes[1].priority = "1";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: mockData,
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);

    // Filter by priority "2" which none of the rows have
    const prioritySelect = container.querySelector(
      'select[aria-label="Filter by priority"]',
    ) as HTMLSelectElement;
    // First add the option to the select (simulating a valid filter)
    const opt = document.createElement("option");
    opt.value = "2";
    prioritySelect.appendChild(opt);
    fireEvent.change(prioritySelect, { target: { value: "2" } });

    expect(container.querySelectorAll("[data-row]")).toHaveLength(0);
    expect(container.textContent).toContain("No results found");
  });

  it("shows 0 of 0 in pagination when no results", () => {
    mockVersionParam = "jdk-17.0.1+12";

    const mockData = createMockReleaseNotesAPI(1);
    mockData.release_notes[0].priority = "1";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({
      releaseNoteAPIResponse: mockData,
      isValid: true,
    });

    const { container } = render(<ReleaseNotesRender />);

    // Filter by priority "2" which the single row doesn't have
    const prioritySelect = container.querySelector(
      'select[aria-label="Filter by priority"]',
    ) as HTMLSelectElement;
    const opt = document.createElement("option");
    opt.value = "2";
    prioritySelect.appendChild(opt);
    fireEvent.change(prioritySelect, { target: { value: "2" } });

    expect(container.textContent).toContain("0 of 0");
  });

  it("renders loading spinner when data is not yet available", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue(undefined);

    const { container } = render(<ReleaseNotesRender />);
    expect(
      container.querySelector('[aria-label="loading spinner"]'),
    ).toBeTruthy();
  });
});
