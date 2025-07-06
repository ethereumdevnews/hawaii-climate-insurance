import { useState, useEffect } from "react";
import { apiRequest } from "./queryClient";

interface CalculatorParams {
  insuranceType: 'earthquake' | 'flood' | 'volcano';
  coverageAmount: number;
  customerAge?: number;
  zipCode?: string;
  enabled?: boolean;
}

export function usePremiumCalculator({
  insuranceType,
  coverageAmount,
  customerAge = 30,
  zipCode = "12345",
  enabled = true
}: CalculatorParams) {
  const [premium, setPremium] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const calculatePremium = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest('POST', '/api/calculate-premium', {
          insuranceType,
          coverageAmount,
          customerAge,
          zipCode
        });

        const data = await response.json();
        setPremium(data.monthlyPremium || 100);
      } catch (err) {
        console.error('Premium calculation failed:', err);
        setError('Failed to calculate premium');
        // Fallback calculation
        const basePremium = getBasePremium(insuranceType);
        const coverageMultiplier = Math.sqrt(coverageAmount / 100000);
        setPremium(Math.round(basePremium * coverageMultiplier));
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce calculation
    const timer = setTimeout(calculatePremium, 500);
    return () => clearTimeout(timer);
  }, [insuranceType, coverageAmount, customerAge, zipCode, enabled]);

  return { premium, isLoading, error };
}

function getBasePremium(insuranceType: 'earthquake' | 'flood' | 'volcano'): number {
  switch (insuranceType) {
    case 'earthquake':
      return 180; // Higher premium for earthquake coverage in Hawaii
    case 'flood':
      return 95; // Flood insurance premium for Hawaii
    case 'volcano':
      return 220; // Highest premium for volcano coverage (fire, explosion, ash fall)
    default:
      return 130;
  }
}

export function calculateEstimate(
  insuranceType: 'earthquake' | 'flood' | 'volcano',
  coverageAmount: number,
  age: number = 30
): number {
  const basePremium = getBasePremium(insuranceType);
  const coverageMultiplier = Math.sqrt(coverageAmount / 100000);
  const ageMultiplier = age < 25 ? 1.3 : age > 65 ? 1.1 : 1.0;
  
  return Math.round(basePremium * coverageMultiplier * ageMultiplier);
}
