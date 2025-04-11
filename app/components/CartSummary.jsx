import {Link} from '@remix-run/react';
import {CartForm, Money} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import {useRef} from 'react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page'
      ? 'cart-summary-page'
      : 'cart-summary-aside gap-3 flex flex-col';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      {/* <h4 className="font-semibold text-2xl">Totals</h4> */}
      <dl>
        <dt>Subtotal</dt>
        <dd>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money
              data={cart.cost?.subtotalAmount}
              className="font-bold text-2xl"
            />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} cart={cart} />
    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl, cart}) {
  if (!checkoutUrl) return null;

  const handleClick = () => {
    const {lines} = cart;
    const totalAmount = lines.nodes.reduce(
      (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
      0,
    );

    const productDetail = lines.nodes
      .map(
        (line, index) =>
          `${index + 1}. ${line.merchandise.product.title} x${
            line.quantity
          } ($${line.merchandise.price.amount}).`,
      )
      .join('\n');

    // line.merchandise.selectedOptions [{name: 'Color', value: 'Red'}]

    const message = `Hi, I'm interested in purchasing the following items:\n\nOrder Details:\n\n${productDetail}\n\nTotal: $${totalAmount.toFixed(
      2,
    )}\n\n\n\nCan you help me with this?`;
    //Customer: ${data.name} (${data.email})
    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/$+251967285787?text=${encodedMessage}`,
      '_blank',
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        title="Open WhatsApp"
        // to="/custom-checkout/server"
        // // href={checkoutUrl}
        // target="_self"
        className="flex items-center gap-2 bg-zinc-950 justify-center py-2 font-semibold w-full flex-1 text-zinc-50 cursor-pointer"
      >
        <p>Continue to Checkout </p>
        <ArrowRight />
      </button>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center justify-start gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="border border-border w-full text-sm py-2 px-4 rounded-lg"
          />
          <button
            type="submit"
            className="border border-border  hover:bg-zinc-950 hover:text-zinc-50 text-sm px-4 py-2 rounded-lg flex justify-center items-center cursor-pointer duration-200"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount ">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex justify-start items-center gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="px-4 py-2 w-full border-border text-sm border rounded-lg"
          />
          <button
            type="submit"
            className="border border-border  hover:bg-zinc-950 hover:text-zinc-50 text-sm px-4 py-2 rounded-lg flex justify-center items-center cursor-pointer duration-200"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({giftCardCodes, saveAppliedCode, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
