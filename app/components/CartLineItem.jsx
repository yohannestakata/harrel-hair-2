import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {Trash} from 'lucide-react';

export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // Filter out meaningless options and format remaining ones
  const displayOptions = selectedOptions
    .filter((option) => !isDefaultOption(option))
    .map((option) => ({
      ...option,
      name: formatOptionName(option.name),
    }));

  return (
    <li
      key={id}
      className="flex gap-4 py-4 border-b border-zinc-700 last:border-b-0 hover:bg-zinc-800/50 transition-colors px-2 rounded-lg"
    >
      {image && (
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => layout === 'aside' && close()}
          className="flex-shrink-0"
        >
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
            className="rounded-lg object-cover w-20 h-20 border border-zinc-700 hover:border-pink-600 transition-colors"
          />
        </Link>
      )}

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="hover:text-pink-500 transition-colors"
            >
              <h3 className="font-medium text-base text-zinc-100 line-clamp-1">
                {product.title}
              </h3>
              {product.vendor && (
                <p className="text-xs text-zinc-400">{product.vendor}</p>
              )}
            </Link>
            <div className="text-pink-500 mt-1">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>

        {displayOptions.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {displayOptions.map((option) => (
              <li key={option.name} className="text-xs text-zinc-400">
                <span className="text-zinc-500 capitalize">{option.name}:</span>{' '}
                <span className="text-zinc-300">{option.value}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500 mt-1">Standard version</p>
        )}

        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

// Helper functions for option processing
function isDefaultOption(option) {
  const defaultPatterns = [
    {name: 'Title', value: 'Default Title'},
    {name: 'title', value: 'default title'},
    // Add other default patterns if needed
  ];

  return defaultPatterns.some(
    (pattern) =>
      option.name.toLowerCase() === pattern.name.toLowerCase() &&
      option.value.toLowerCase() === pattern.value.toLowerCase(),
  );
}

function formatOptionName(name) {
  // Format option names to be more human-readable
  const nameMap = {
    size: 'Size',
    color: 'Color',
    material: 'Material',
    // Add other mappings as needed
  };

  return nameMap[name.toLowerCase()] || name;
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {
    id: lineId,
    quantity,
    isOptimistic,
    merchandise: {quantityAvailable},
  } = line;
  const prevQuantity = Math.max(1, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="flex items-center justify-between mt-2">
      <small className="text-zinc-400 text-sm">Quantity: {quantity}</small>
      <div className="flex items-center space-x-2">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            className={`w-7 h-7 flex items-center justify-center border border-zinc-600 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors ${
              quantity <= 1 || isOptimistic
                ? 'opacity-50 cursor-not-allowed hover:bg-zinc-800'
                : ''
            }`}
          >
            <span className="text-zinc-300">−</span>
          </button>
        </CartLineUpdateButton>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            disabled={!!isOptimistic || quantity >= quantityAvailable}
            className={`w-7 h-7 flex items-center justify-center border border-zinc-600 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors ${
              isOptimistic || quantity >= quantityAvailable
                ? 'opacity-50 cursor-not-allowed hover:bg-zinc-800'
                : ''
            }`}
          >
            <span className="text-zinc-300">+</span>
          </button>
        </CartLineUpdateButton>
      </div>
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className={`p-1 rounded-full hover:bg-zinc-700 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Remove item"
      >
        <Trash size={16} className="text-zinc-400 hover:text-pink-500" />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
