import {useEffect, useState} from 'react';

// Create a new loading component
export function CartLoading() {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p>Loading cart...</p>
      {showTimeout && (
        <p className="text-sm">
          Taking longer than expected...{' '}
          <button onClick={() => window.location.reload()}>Retry</button>
        </p>
      )}
    </div>
  );
}
