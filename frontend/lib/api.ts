const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  if (cleanEndpoint.startsWith('api/v1/')) {
    cleanEndpoint = cleanEndpoint.slice('api/v1/'.length);
  }
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorBody}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
