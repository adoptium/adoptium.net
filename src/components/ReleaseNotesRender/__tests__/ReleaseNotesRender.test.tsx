import React from "react"
import { render } from "@testing-library/react"
import { describe, afterEach, expect, it, vi } from "vitest"
import ReleaseNotesRender, { fetchTitle, sortReleaseNotesBy } from "../index"
import { useFetchReleaseNotesForVersion } from "@/hooks/fetchReleaseNotes"
import { createMockReleaseNotesAPI } from "../__fixtures__/hooks"

vi.mock("@/hooks/fetchReleaseNotes")

// Dynamic mock for useSearchParams
let mockVersionParam: string | undefined = 'jdk-17.0.1+12';
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === 'version') return mockVersionParam;
      return undefined;
    },
  }),
  useLocale: () => 'en',
}));

afterEach(() => {
  vi.clearAllMocks()
  mockVersionParam = undefined; // reset between tests
})

describe("ReleaseNotesRender component", () => {
  it("should render correctly", () => {
    mockVersionParam = "jdk-17.0.1+12";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({ releaseNoteAPIResponse: createMockReleaseNotesAPI(2), isValid: true });

    const { container } = render(<ReleaseNotesRender />)

    // check if 2 rows are rendered
    expect(container.querySelectorAll(".MuiDataGrid-row")).toHaveLength(2)
    expect(container).toMatchSnapshot()
  })

  it("should render correctly - version not defined", () => {
    mockVersionParam = undefined;

    const { container } = render(<ReleaseNotesRender />)
    expect(container).toMatchSnapshot()
  })

  it("fetchTitle should return correct title", () => {
    expect(fetchTitle("1")).toContain("P1")
    expect(fetchTitle("2")).toContain("P2")
    expect(fetchTitle("3")).toContain("P3")
    expect(fetchTitle("4")).toContain("P4")
    expect(fetchTitle("5")).toContain("P5")
    expect(fetchTitle("6")).toContain("not publicly visible")
    expect(fetchTitle(null)).toBeUndefined()
    expect(fetchTitle("123")).toBeUndefined()
  })

  // Set type to 'Enhancement' by default if version matches jdk-xx+xx
  it("should render correctly - type set to Enhancement", async () => {
    mockVersionParam = "jdk-20+36";

    function mockReleaseNotes(num: number) {
      const releaseNoteDataBag = { releaseNoteAPIResponse: createMockReleaseNotesAPI(num), isValid: true };
      releaseNoteDataBag.releaseNoteAPIResponse.release_name = 'jdk-20+36';
      releaseNoteDataBag.releaseNoteAPIResponse.release_notes[0].type = 'Enhancement';
      return releaseNoteDataBag;
    }

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue(mockReleaseNotes(2))
    const { container } = render(<ReleaseNotesRender />)

    // check if 1 row is rendered and 1 is filtered out
    expect(container.querySelectorAll('.MuiDataGrid-row')).toHaveLength(1);
  })

  // sets priority as p? when priority is not defined
  it("should render correctly - priority not defined", () => {
    mockVersionParam = "version";
    function mockReleaseNotes() {
      const releaseNoteDataBag = { releaseNoteAPIResponse: createMockReleaseNotesAPI(1), isValid: true };
      releaseNoteDataBag.releaseNoteAPIResponse.release_name = 'version';
      releaseNoteDataBag.releaseNoteAPIResponse.release_notes[0].priority = undefined;
      return releaseNoteDataBag;
    }

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue(mockReleaseNotes())
    const { container } = render(<ReleaseNotesRender />)

    const priorityColumn = container.querySelectorAll(".MuiDataGrid-cell")[0]
    expect(priorityColumn.textContent).toContain("P?")
  })

  it("should render correctly - no release notes", () => {
    mockVersionParam = "version";

    // @ts-expect-error - mockReturnValue is used to simulate the useFetchReleaseNotesForVersion hook
    useFetchReleaseNotesForVersion.mockReturnValue({ releaseNoteAPIResponse: createMockReleaseNotesAPI(0), isValid: false });
    const { container } = render(<ReleaseNotesRender />)
    expect(container).toMatchSnapshot()
  })

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
    }

    const result = sortReleaseNotesBy(unsortedReleaseNotes)

    expect(result.release_notes[0].id).toBe("300")
    expect(result.release_notes[1].id).toBe("200")
    expect(result.release_notes[2].id).toBe("100")
  })
})
