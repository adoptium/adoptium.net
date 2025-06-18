export function setURLParam(param: string, value: string | number | boolean | undefined) {
  const currentURLWithParams = window.location.href

  const params: Record<string, string> = {}

  // parse existing query parameters (if any)
  if (currentURLWithParams.indexOf("?") > 0) {
    currentURLWithParams
      .substring(currentURLWithParams.indexOf("?") + 1)
      .split("&")
      .forEach(item => {
        params[item.split("=")[0]] = item.split("=")[1]
      })
  }
  if (param) {
    // set the new value for the given param or unset if no value provided
    if (value === undefined) delete params[param]
    else params[param] = String(value) // Convert value to string
  }

  // rebuild and set the location
  const queryString = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    })
    .join("&")

  const currentURL =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    `?${queryString}`
  window.history.replaceState({ path: currentURL }, "", currentURL)
}
