import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  usdPrice: number;
  phpPrice: number;
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

export function useWemixPrice(refreshInterval = 30000) {
  const [priceData, setPriceData] = useState<PriceData>({
    usdPrice: 0,
    phpPrice: 0,
    lastUpdated: new Date(),
    isLoading: true,
    error: null,
  });

  const fetchPrice = useCallback(async () => {
    setPriceData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=wemix-token&vs_currencies=usd,php',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['wemix-token'] && 
          typeof data['wemix-token'].usd === 'number' && 
          typeof data['wemix-token'].php === 'number') {
        setPriceData({
          usdPrice: data['wemix-token'].usd,
          phpPrice: data['wemix-token'].php,
          lastUpdated: new Date(),
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch',
      }));
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPrice, refreshInterval]);

  return { ...priceData, refetch: fetchPrice };
}
