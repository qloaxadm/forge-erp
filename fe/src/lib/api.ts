// src/lib/api.ts
import { API_BASE_URL } from '@/config/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('API Request:', {
    url: fullUrl,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body ? JSON.parse(options.body as string) : undefined
  });

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    // Clone the response so we can read it multiple times
    const responseClone = res.clone();
    
    // First, try to get the response as text
    const responseText = await responseClone.text();
    console.log('API Response:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: responseText
    });

    // Then try to parse as JSON
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
    }

    if (!res.ok) {
      const error = new Error(responseData?.message || 'API request failed');
      (error as any).status = res.status;
      (error as any).response = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('API Request Failed:', {
      error,
      endpoint,
      options
    });
    throw error;
  }
}