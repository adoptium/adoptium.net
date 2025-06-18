export enum UserOS {
  MAC = "MAC",
  WIN = "WIN",
  UNIX = "UNIX",
  LINUX = "LINUX",
  MOBILE = "MOBILE",
  UNKNOWN = "UNKNOWN",
}

export function detectOS(): UserOS {
  let OS = UserOS.UNKNOWN
  if (typeof window !== "undefined") {
    const appVersion = navigator.appVersion;
    if (appVersion.includes("Win")) {
      OS = UserOS.WIN
    } else if (appVersion.includes("Mac")) {
      OS = UserOS.MAC
    } else if (appVersion.includes("X11")) {
      OS = UserOS.UNIX
    } else if (appVersion.includes("Linux")) {
      OS = UserOS.LINUX
    } else if (appVersion.includes("Mobi")) {
      OS = UserOS.MOBILE
    }
  }
  return OS
}
