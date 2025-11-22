import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Types for Circle API
interface ComplianceScreeningRequest {
  idempotencyKey: string;
  address: string;
  chain: string;
}

interface ComplianceScreeningResponse {
  data: {
    id: string;
    address: string;
    chain: string;
    risk: {
      level: string;
      score?: number;
    };
    screenedAt: string;
    // Add other fields based on Circle's actual response
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { address } = body;

    // Validate required parameters
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate address format (basic Ethereum address validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Check for API key in environment
    const apiKey = process.env.CIRCLE_API_KEY;
    if (!apiKey) {
      console.error('CIRCLE_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' } as ErrorResponse,
        { status: 500 }
      );
    }

    // Generate unique idempotency key
    const idempotencyKey = uuidv4();

    // Prepare request payload
    const payload: ComplianceScreeningRequest = {
      idempotencyKey,
      address,
      chain: 'ETH-SEPOLIA', // Hardcoded as requested
    };

    // Make request to Circle API
    const response = await fetch(
      'https://api.circle.com/v1/w3s/compliance/screening/addresses',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Circle API error:', response.status, errorData);
      
      return NextResponse.json(
        {
          error: 'Compliance screening failed',
          details: `Circle API returned status ${response.status}`,
        } as ErrorResponse,
        { status: response.status }
      );
    }

    // Parse and return successful response
    const data: ComplianceScreeningResponse = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Compliance screening error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for health check
export async function GET() {
  return NextResponse.json(
    { message: 'Compliance API is running' },
    { status: 200 }
  );
}