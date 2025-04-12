import {CartForm} from '@shopify/hydrogen';
import {ShoppingBag} from 'lucide-react';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="bg-pink-600 text-zinc-50 w-full justify-center px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-pink-700 duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <ShoppingBag size={20} />
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
