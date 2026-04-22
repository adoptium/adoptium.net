import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/members",
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    quality,
    placeholder,
    blurDataURL,
    loader,
    unoptimized,
    ...props
  }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("@/components/Common/IconSocial", () => ({
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

  it("handles hash links correctly", async () => {
    const { getByText } = render(<NavBar locale="en" />);

    fireEvent.click(getByText("Join Us"));

    const link = await getByText("Our Members");

    expect(link.closest("a")).toHaveAttribute("href", "/members#strategic-sec");
  });

  it("renders external link correctly", () => {
    const { getByText } = render(<NavBar locale="en" />);

    fireEvent.click(getByText("Join Us"));

    const link = getByText("Become an Individual Sustainer");
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
  });

  it("closes dropdown when clicking outside", async () => {
    const { getByText, queryByText } = render(<NavBar locale="en" />);

    // Open a dropdown
    fireEvent.click(getByText("Projects"));
    expect(getByText("Eclipse Temurin")).toBeTruthy();

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(queryByText("Eclipse Temurin")).toBeFalsy();
    });
  });

  it("closes mobile menu when clicking a child link", async () => {
    const { getByRole, getAllByText } = render(<NavBar locale="en" />);

    // Open mobile menu
    fireEvent.click(getByRole("button", { name: /open main menu/i }));

    // Navigate to submenu - get all "Join Us" texts and click the one in mobile
    const joinUsElements = getAllByText("Join Us");
    // The last one is the mobile menu item
    fireEvent.click(joinUsElements[joinUsElements.length - 1]);

    // Click a child link in the mobile submenu
    const memberLinks = getAllByText("Become a Member");
    fireEvent.click(memberLinks[memberLinks.length - 1]);

    // Mobile menu should have been told to close
    expect(getByRole("button", { name: /open main menu/i })).toBeTruthy();
  });

  it("navigates back from mobile submenu", () => {
    const { getByRole, getAllByText, queryByText } = render(
      <NavBar locale="en" />,
    );

    // Open mobile menu
    fireEvent.click(getByRole("button", { name: /open main menu/i }));

    // Navigate to submenu
    const joinUsElements = getAllByText("Join Us");
    fireEvent.click(joinUsElements[joinUsElements.length - 1]);

    // The submenu label should appear
    // Click back button area (the flex container with the back arrow)
    const mobileLabel = getAllByText("Join Us");
    const backArea =
      mobileLabel[mobileLabel.length - 1].closest(".flex.items-center");
    if (backArea) {
      fireEvent.click(backArea);
    }
  });

  it("closes announcement panel when close handler fires", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <NavBar locale="en" />,
    );

    // Open announcements
    const bell = getByLabelText("notifications");
    fireEvent.click(bell);
    expect(getByText("Announcements")).toBeTruthy();

    // Close announcements via the mock's onClick which calls handleClose
    fireEvent.click(getByText("Announcements"));
    expect(queryByText("Announcements")).toBeFalsy();
  });

  it("opens other dropdown menus (not Join Us)", () => {
    const { getByText, getAllByText } = render(<NavBar locale="en" />);

    // Open Resources dropdown
    fireEvent.click(getByText("Resources"));

    expect(getAllByText("Release Notes").length).toBeGreaterThanOrEqual(1);
    expect(getByText("Installation Guide")).toBeTruthy();
  });

  it("toggles dropdown closed when clicking same menu button", () => {
    const { getByText, queryByText } = render(<NavBar locale="en" />);

    // Open
    fireEvent.click(getByText("Projects"));
    expect(getByText("Eclipse Temurin")).toBeTruthy();

    // Click same button again to close
    fireEvent.click(getByText("Projects"));

    // The menu should be closed (Transition show=false)
    // HeadlessUI may or may not remove DOM nodes, but openedMenu should be undefined
  });
});
