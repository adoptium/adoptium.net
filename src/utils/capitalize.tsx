// Format text with a capital letter
export function capitalize(text: string) {
  switch (text) {
    case "alpine-linux":
      return "Alpine Linux"
    case "alpine_linux":
      return "Alpine Linux"
    case "redhat":
      return "Red Hat"
    case "ibm":
      return "IBM"
    case "mac":
      return "macOS"
    case "semeru":
      return "Semeru Runtimes"
    default:
      return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
