export const sendDownloadEvent = ({
  link,
  os,
  arch,
  pkg_type,
  version,
  vendor,
}: {
  link: string;
  os: string;
  arch: string;
  pkg_type: string;
  version: string;
  vendor: string;
}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "download", {
    event_category: "download",
    link,
    event_label: `${os}-${arch}-${pkg_type}`,
    java_version: version,
    vendor,
  });
};
