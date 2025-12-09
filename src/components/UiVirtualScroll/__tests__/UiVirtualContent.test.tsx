import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UiVirtualContent from "../UiVirtualContent";

describe("UiVirtualContent", () => {
  it("renders correctly with data", () => {
    const data = [
      {
        title: "Title 1",
        description: "Description 1",
        image: "/image1.png",
      },
      {
        title: "Title 2",
        description: "Description 2",
        image: "/image2.png",
      },
      {
        title: "Title 3",
        description: "Description 3",
        image: "/image3.png",
      },
    ];

    const { container } = render(<UiVirtualContent data={data} />);
    expect(container).toBeTruthy();

    // Check if height is set correctly
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe("400vh");
  });
});
