import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";

vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
    redirect: () => {},
    usePathname: () => "",
    useRouter: () => ({}),
  }),
}));
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/IconSocial", () => ({
  default: () => <div>IconSocial</div>,
}));

vi.mock("@/components/LanguageSelector", () => ({
  default: () => <div>LanguageSelector</div>,
}));

vi.mock("@/components/Announcements", () => ({
  default: ({ handleClose }: any) => (
    <div onClick={handleClose}>Announcements</div>
  ),
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

  it("renders main navigation items", () => {
    const { getByText } = render(<NavBar locale="en" />);

    expect(getByText("Join Us")).toBeTruthy();
    expect(getByText("Projects")).toBeTruthy();
    expect(getByText("Community")).toBeTruthy();
  });
  it("opens Join Us dropdown on click", () => {
    const { getByText } = render(<NavBar locale="en" />);

    const joinUs = getByText("Join Us");
    fireEvent.click(joinUs);

    expect(getByText("Become a Member")).toBeTruthy();
  });

  it("opens submenu in mobile view", () => {
    const { getByRole, getByText } = render(<NavBar locale="en" />);

    fireEvent.click(getByRole("button", { name: /open main menu/i }));

    fireEvent.click(getByText("Join Us"));

    expect(getByText("Become a Member")).toBeTruthy();
  });
  it("toggles announcements panel", () => {
    const { getByLabelText, getByText } = render(<NavBar locale="en" />);

    const bell = getByLabelText("notifications");
    fireEvent.click(bell);

    expect(getByText("Announcements")).toBeTruthy();
  });
  it("adds scrolled class on scroll", () => {
    const { container } = render(<NavBar locale="en" />);

    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(container.firstChild).toHaveClass("bg-[#200E46]");
  });

  it("renders external link correctly", () => {
    const { getByText } = render(<NavBar locale="en" />);

    fireEvent.click(getByText("Join Us"));

    const link = getByText("Become an Individual Sustainer");
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
  });
});
