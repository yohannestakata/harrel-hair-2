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

  return (
    <li
      key={id}
      className="flex gap-4 py-6 border-b border-gray-200 last:border-b-0"
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
            className="rounded-md object-cover w-24 h-24"
          />
        </Link>
      )}

      <div className="flex-1">
        <div className="flex justify-between gap-2">
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="hover:text-pink-700 transition-colors"
            >
              <h3 className="font-medium text-lg">{product.title}</h3>
            </Link>
            <ProductPrice
              price={line?.cost?.totalAmount}
              className="text-gray-700 mt-1"
            />
          </div>
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>

        {selectedOptions.length > 0 && (
          <ul className="mt-2 space-y-1">
            {selectedOptions.map((option) => (
              <li key={option.name} className="text-sm text-gray-500">
                {option.name}:{' '}
                <span className="text-gray-700">{option.value}</span>
              </li>
            ))}
          </ul>
        )}

        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center mt-4">
      <small className="mr-3 text-gray-600">Quantity: {quantity}</small>
      <div className="flex items-center space-x-2">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            className={`w-8 h-8 flex items-center justify-center border border-black rounded-full ${
              quantity <= 1 || isOptimistic
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            disabled={!!isOptimistic}
            className={`w-8 h-8 flex items-center justify-center border border-black rounded-full ${
              isOptimistic
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
          >
            <span>&#43;</span>
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
        className={`text-sm text-gray-500 hover:text-pink-700 cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Trash size={16} />
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
