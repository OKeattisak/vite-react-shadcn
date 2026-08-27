const DEFAULT_API_URL = "/api";
const DEFAULT_API_TIMEOUT_MS = 15_000;

function parseApiUrl(value: string | undefined) {
  const apiUrl = value?.trim() || DEFAULT_API_URL;

  if (apiUrl.startsWith("/")) {
    return apiUrl.replace(/\/+$/, "") || "/";
  }

  try {
    const url = new URL(apiUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }

    return apiUrl.replace(/\/+$/, "");
  } catch {
    throw new Error(
      "VITE_API_URL must be an absolute HTTP(S) URL or a root-relative path such as /api",
    );
  }
}

function parsePositiveInteger(
  name: string,
  value: string | undefined,
  fallback: number,
) {
  if (!value?.trim()) return fallback;

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
}

function parseBoolean(
  name: string,
  value: string | undefined,
  fallback: boolean,
) {
  if (!value?.trim()) return fallback;

  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;

  throw new Error(`${name} must be true, false, 1, or 0`);
}

export const env = Object.freeze({
  apiUrl: parseApiUrl(import.meta.env.VITE_API_URL),
  apiTimeoutMs: parsePositiveInteger(
    "VITE_API_TIMEOUT_MS",
    import.meta.env.VITE_API_TIMEOUT_MS,
    DEFAULT_API_TIMEOUT_MS,
  ),
  apiWithCredentials: parseBoolean(
    "VITE_API_WITH_CREDENTIALS",
    import.meta.env.VITE_API_WITH_CREDENTIALS,
    false,
  ),
});
