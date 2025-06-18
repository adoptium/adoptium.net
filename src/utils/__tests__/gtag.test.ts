import { describe, it, expect, afterEach, vi } from "vitest";
import { sendDownloadEvent } from "../gtag";

describe("sendDownloadEvent", () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
  });

  it("calls window.gtag with correct parameters when gtag is defined", () => {
    const gtagMock = vi.fn();
    // @ts-ignore
    global.window = { gtag: gtagMock };

    sendDownloadEvent({
      link: "https://example.com/download",
      os: "windows",
      arch: "x64",
      pkg_type: "installer",
      version: "21",
      vendor: "temurin",
    });

    expect(gtagMock).toHaveBeenCalledWith("event", "download", {
      event_category: "download",
      link: "https://example.com/download",
      event_label: "windows-x64-installer",
      java_version: "21",
      vendor: "temurin",
    });
  });

  it("does nothing if window is undefined", () => {
    // @ts-ignore
    delete global.window;
    expect(() =>
      sendDownloadEvent({
        link: "",
        os: "",
        arch: "",
        pkg_type: "",
        version: "",
        vendor: "",
      })
    ).not.toThrow();
  });

  it("does nothing if window.gtag is not a function", () => {
    // @ts-ignore
    global.window = { gtag: undefined };
    expect(() =>
      sendDownloadEvent({
        link: "",
        os: "",
        arch: "",
        pkg_type: "",
        version: "",
        vendor: "",
      })
    ).not.toThrow();
  });
});
