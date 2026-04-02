import { vi } from "vitest";

vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
    redirect: () => {},
    usePathname: () => "",
    useRouter: () => ({}),
  }),
}));

import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import NavBar from "../index";

describe("NavBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("should match the snapshot", () => {
    const { container } = render(<NavBar locale="en" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
