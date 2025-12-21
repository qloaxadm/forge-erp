import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST(request: Request) {
  console.log('=== PRICE LIST CREATION REQUEST START ===');
  
  try {
    // Log request headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Request Headers:', headers);
    
    // Parse and log request body
    let body;
    try {
      body = await request.json();
      console.log('Request Body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['name'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Prepare payload with defaults
    const payload = {
      name: body.name,
      description: body.description || '',
      currency: body.currency || 'USD',
      is_active: body.is_active ?? true,
      customer_type_id: body.customer_type_id || 1,
      effective_from: body.effective_from || new Date().toISOString()
    };

    console.log('Prepared Payload:', JSON.stringify(payload, null, 2));

    // Make API call to backend
    console.log('Making request to backend API...');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const fullUrl = `${apiUrl}/pricing`;
    
    console.log('API URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Backend Response Status:', response.status);
    console.log('Backend Response Headers:', Object.fromEntries([...response.headers.entries()]));
    console.log('Backend Response Body:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Error parsing backend response:', e);
      responseData = { rawResponse: responseText };
    }

    if (!response.ok) {
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseData
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create price list',
          details: responseData.message || response.statusText,
          response: responseData
        },
        { status: response.status }
      );
    }

    console.log('Price list created successfully:', responseData);
    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error: any) {
    console.error('Unexpected error in price list creation:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  } finally {
    console.log('=== PRICE LIST CREATION REQUEST END ===\n');
  }
}

export async function GET() {
  try {
    const data = await apiFetch('/pricing/price-lists');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching price lists:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch price lists' },
      { status: error.status || 500 }
    );
  }
}
