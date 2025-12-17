const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | void> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "API Error");
  }

  // Handle empty responses
  const contentLength = res.headers.get('content-length');
  if (contentLength === '0' || !contentLength) {
    return;
  }

  return res.json();
}
