export function getTenant() {
  if (typeof window !== "undefined") {
    // Client-side: Get tenant from subdomain
    const host = window.location.hostname;
    // const subdomain = host.split(".")[0]; // e.g., "ten1.localhost" → "ten1"
    // return subdomain !== "localhost" ? subdomain : "default";
    return host
  }
  return "default"; // Default tenant if running in a non-browser environment
}
