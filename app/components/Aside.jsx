import {X} from 'lucide-react';
import {createContext, useContext, useEffect, useState} from 'react';

export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        expanded ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={close}
      />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-sm shadow-xl transition-transform duration-200 ease-in-out ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        } bg-zinc-900 text-zinc-50`}
      >
        <header className="flex h-16 items-center justify-between border-b mt-16 px-6 border-zinc-700">
          <h3 className="text-xl font-medium">{heading}</h3>
          <button
            className="text-zinc-400 hover:text-pink-600 transition-colors"
            onClick={close}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </header>
        <main className="h-[calc(100vh-4rem)] overflow-y-auto mt-6">
          {children}
        </main>
      </div>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
