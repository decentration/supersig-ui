import { useIsMountedRef } from '@polkadot/react-hooks';
import { useEffect, useState } from 'react';

export function useLoadingDelay(delay = 100): boolean {
  const mountedRef = useIsMountedRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect((): void => {
    setTimeout((): void => {
      mountedRef.current && setIsLoading(false);
    }, delay);
    // Ignore, this is for the initial setup
  }, []);

  return isLoading;
}
