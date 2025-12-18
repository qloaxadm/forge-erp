// src/lib/api.ts
import { API_BASE_URL } from '@/config/api';

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    console.log('Making request:', {
      url,
      method,
      headers: options.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let responseData: any;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.warn('Failed to parse JSON response. Response text:', responseText);
      responseData = responseText;
    }

    if (!response.ok) {
      // Log detailed request info
      console.group('Request failed - Details');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Status:', response.status, response.statusText);
      console.log('Response:', responseData);
      
      // Log request headers if available
      const headers = new Headers(options.headers);
      console.log('Request Headers:', {
        'Content-Type': headers.get('Content-Type'),
        ...Object.fromEntries(headers.entries())
      });
      
      // Log request body if available
      if (options.body) {
        try {
          console.log('Request Body:', JSON.parse(options.body as string));
        } catch (e) {
          console.log('Request Body (raw):', options.body);
        }
      }
      console.groupEnd();

      // Create a more descriptive error message
      let errorMessage = `Request failed with status ${response.status}`;
      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.details) {
        errorMessage = 'Validation error: ' + Object.entries(responseData.details)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).response = responseData;
      (error as any).details = {
        status: response.status,
        statusText: response.statusText,
        url,
        method,
        response: responseData,
      };
      throw error;
    }

    return responseData as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      const errorObj = new Error('Request timed out. Please check your connection and try again.');
      (errorObj as any).isTimeout = true;
      throw errorObj;
    }

    // Enhanced error logging
    const errorInfo = {
      url,
      method,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        // Include any additional properties that might be on the error
        ...(error as any).response && { response: (error as any).response },
        ...(error as any).status && { status: (error as any).status },
        ...(error as any).errors && { errors: (error as any).errors }
      } : {
        type: typeof error,
        value: error
      },
      requestInfo: {
        endpoint,
        options: {
          ...options,
          // Don't log potentially sensitive data
          body: options.body ? '[REDACTED]' : undefined,
          headers: options.headers ? '[REDACTED]' : undefined
        }
      }
    };

    console.error('API Request Failed - Detailed Error:', errorInfo);

    // Create a more user-friendly error message
    let userFriendlyMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      if (error.message) userFriendlyMessage = error.message;
      if ((error as any).response?.message) {
        userFriendlyMessage = (error as any).response.message;
      } else if ((error as any).response?.error) {
        userFriendlyMessage = (error as any).response.error;
      }
    }

    const enhancedError = new Error(userFriendlyMessage);
    Object.assign(enhancedError, error);
    throw enhancedError;
  }
}