import {Link, useNavigate} from '@remix-run/react';
import {useAside} from './Aside';
import {AddToCartButton} from './AddToCartButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const CLIENT_PHONE_NUMBER = '+1 (202) 412-9495';
const CLIENT_INSTA_USERNAME = 'your_instagram_username';

export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();

  // Separate color options from other options
  const colorOption = productOptions.find((option) =>
    option.name.toLowerCase().includes('color'),
  );
  const otherOptions = productOptions.filter(
    (option) => !option.name.toLowerCase().includes('color'),
  );

  return (
    <div className="product-form space-y-6">
      {/* Render color option as swatches */}
      {colorOption && (
        <div className="product-options" key={colorOption.name}>
          <h5 className="font-semibold mb-3">{colorOption.name}</h5>
          <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {colorOption.optionValues.map((value) => {
              const {
                name,
                handle,
                variantUriQuery,
                selected,
                available,
                exists,
                isDifferentProduct,
                swatch,
                variant,
              } = value;

              if (isDifferentProduct) {
                return (
                  <Link
                    className="product-options-item flex flex-col items-center gap-2"
                    key={colorOption.name + name}
                    prefetch="intent"
                    preventScrollReset
                    replace
                    to={`/products/${handle}?${variantUriQuery}`}
                  >
                    <ColorSwatch
                      color={swatch?.color}
                      name={name}
                      selected={selected}
                      available={available}
                    />
                  </Link>
                );
              } else {
                return (
                  <button
                    type="button"
                    className="flex flex-col items-center gap-2"
                    key={colorOption.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ColorSwatch
                      color={swatch?.color}
                      name={name}
                      selected={selected}
                      available={available}
                    />
                  </button>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* Render other options as shadcn dropdowns */}
      {otherOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        const selectedValue = option.optionValues.find((val) => val.selected);

        return (
          <div className="product-options" key={option.name}>
            <h5 className="font-semibold mb-2">{option.name}</h5>
            <Select
              value={selectedValue?.name || ''}
              onValueChange={(value) => {
                const selectedValue = option.optionValues.find(
                  (val) => val.name === value,
                );
                if (selectedValue && !selectedValue.selected) {
                  navigate(`?${selectedValue.variantUriQuery}`, {
                    replace: true,
                    preventScrollReset: true,
                  });
                }
              }}
            >
              <SelectTrigger className="w-full bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-900">
                <SelectValue placeholder={`Select ${option.name}`} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {option.optionValues.map((value) => (
                  <SelectItem
                    key={option.name + value.name}
                    value={value.name}
                    disabled={!value.available}
                    className="hover:bg-zinc-800 focus:bg-zinc-800 data-[state=checked]:bg-pink-600 hover:text-zinc-500 focus:text-zinc-50"
                  >
                    {value.name} {!value.available && '(Unavailable)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}

      <div className="text-sm text-zinc-400 border-t border-zinc-800 pt-4">
        <h6 className="font-medium text-zinc-300 mb-2">Return Policy</h6>
        <p className="mb-2">
          We offer free returns within 30 days of purchase. Items must be in
          original condition.
        </p>
        <p>
          Need help? Contact us at{' '}
          <a
            href={`tel:${CLIENT_PHONE_NUMBER}`}
            className="text-pink-500 hover:underline"
          >
            {CLIENT_PHONE_NUMBER}
          </a>{' '}
          or{' '}
          <a
            href={`https://instagram.com/${CLIENT_INSTA_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            @{CLIENT_INSTA_USERNAME}
          </a>
        </p>
      </div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ColorSwatch({color, name, selected, available}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative flex items-center justify-center rounded-full w-12 h-12 transition-all
          ${!available ? 'opacity-30' : 'opacity-100'}
          ${
            selected
              ? 'ring-2 ring-offset-2 ring-pink-600 ring-offset-zinc-900'
              : ''
          }
        `}
      >
        <div
          aria-label={name}
          className="w-10 h-10 rounded-full "
          style={{
            backgroundColor: color || '#f0f0f0',
          }}
          title={name}
        />
      </div>
      <span className="text-xs text-center">{name}</span>
    </div>
  );
}
