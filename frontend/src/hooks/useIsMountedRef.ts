import { useRef, useEffect } from 'react';

export default function useIsMountedRef() {
  const isMounted = useRef(false); // initially false

  useEffect(() => {
    isMounted.current = true; // set to true after mount
    return () => {
      isMounted.current = false; // cleanup on unmount
    };
  }, []);

  return isMounted;
}
