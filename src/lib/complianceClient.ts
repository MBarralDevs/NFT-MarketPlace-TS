// Utility function to check address compliance from the frontend

interface ComplianceCheckResult {
  data: {
    id: string;
    address: string;
    chain: string;
    risk: {
      level: string;
      score?: number;
    };
    screenedAt: string;
  };
}

interface ComplianceCheckError {
  error: string;
  details?: string;
}

export async function checkAddressCompliance(
  address: string
): Promise<ComplianceCheckResult> {
  const response = await fetch('/api/compliance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    const error: ComplianceCheckError = await response.json();
    throw new Error(error.details || error.error || 'Compliance check failed');
  }

  return response.json();
}

// Example usage with React Query
export function useComplianceCheck() {
  const checkCompliance = async (address: string) => {
    try {
      const result = await checkAddressCompliance(address);
      return result;
    } catch (error) {
      console.error('Compliance check failed:', error);
      throw error;
    }
  };

  return { checkCompliance };
}