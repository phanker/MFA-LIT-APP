export function getDomainFromOrigin(origin) {
  // remove protocol with regex
  let newOrigin = origin.replace(/(^\w+:|^)\/\//, "");
  // remove port with regex
  return newOrigin.replace(/:\d+$/, "");
}
