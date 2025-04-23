import {useEffect, useState} from 'react';

// Create a new loading component
export function CartLoading() {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p className={showTimeout ? 'sr-only' : ''}>Loading cart...</p>
      {showTimeout && (
        <p className="text-sm">
          Taking longer than expected...{' '}
          <a href="https://www.harrelhair.com" target="_blank" rel="noreferrer">
            Retry
          </a>
        </p>
      )}
    </div>
  );
}
