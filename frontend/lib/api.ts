export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://app.jpengineering.com.np/api/v1"
    : "http://127.0.0.1:8000/api/v1");

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  if (cleanEndpoint.startsWith("api/v1/")) {
    cleanEndpoint = cleanEndpoint.slice("api/v1/".length);
  }
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Force no-store on every call path to guarantee fresh dynamic responses
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    cache: "no-store",
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      const msg = `[apiClient HTTP ${response.status}] ${response.statusText} at ${url}: ${errorBody}`;
      console.error(msg);
      throw new ApiError(response.status, msg);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: unknown) {
    console.error(`[apiClient NETWORK ERROR] Request failed for ${url}:`, err);
    throw err;
  }
}
