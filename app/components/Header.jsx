import {Suspense, useState, useId} from 'react';
import {Await, NavLink, useAsyncValue, Link} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {Search, ShoppingBag} from 'lucide-react';
import logo from '~/assets/Logo-43.svg';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const queriesDatalistId = useId();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="header z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center px-4 w-full">
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <div className="h-full overflow-hidden">
            <img src={logo} alt="Harrel Hair" className="w-32" />
          </div>
        </NavLink>

        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        <div className="flex items-center gap-6 mx-auto ">
          <div className="relative">
            <SearchFormPredictive>
              {({fetchResults, goToSearch, inputRef}) => (
                <>
                  <input
                    autoComplete="off"
                    name="q"
                    onChange={fetchResults}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    placeholder="Search..."
                    ref={inputRef}
                    type="text"
                    list={queriesDatalistId}
                    className="border border-zinc-400 px-4 w-xs rounded-sm h-10"
                  />
                  <button
                    onClick={goToSearch}
                    className="absolute right-2 top-2"
                  >
                    <Search size={24} color="#52525c" />
                  </button>
                </>
              )}
            </SearchFormPredictive>

            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg p-4">
                <SearchResultsPredictive>
                  {({items, total, term, state, closeSearch}) => {
                    const {articles, collections, pages, products, queries} =
                      items;

                    if (state === 'loading' && term.current) {
                      return <div className="p-4">Loading...</div>;
                    }

                    if (!total) {
                      return (
                        <SearchResultsPredictive.Empty
                          term={term}
                          className="p-4"
                        />
                      );
                    }

                    return (
                      <>
                        <SearchResultsPredictive.Queries
                          queries={queries}
                          queriesDatalistId={queriesDatalistId}
                          className="p-4"
                        />
                        <SearchResultsPredictive.Products
                          products={products}
                          closeSearch={closeSearch}
                          term={term}
                          className="p-4"
                        />
                        <SearchResultsPredictive.Collections
                          collections={collections}
                          closeSearch={closeSearch}
                          term={term}
                          className="p-4"
                        />
                        <SearchResultsPredictive.Pages
                          pages={pages}
                          closeSearch={closeSearch}
                          term={term}
                          className="p-4"
                        />
                        <SearchResultsPredictive.Articles
                          articles={articles}
                          closeSearch={closeSearch}
                          term={term}
                          className="p-4"
                        />
                        {term.current && total ? (
                          <Link
                            onClick={closeSearch}
                            to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                            className="block p-4 border-t border-gray-200 hover:bg-gray-100"
                          >
                            <p>
                              View all results for <q>{term.current}</q>
                              &nbsp; →
                            </p>
                          </Link>
                        ) : null}
                      </>
                    );
                  }}
                </SearchResultsPredictive>
              </div>
            )}
          </div>
        </div>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // If the URL is internal, strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="flex items-center gap-6" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="relative inline-block"
    >
      <ShoppingBag />
      <div className="absolute -bottom-2 -right-2 text-sm bg-primary size-5 items-center justify-center  text-zinc-50 flex  rounded-full">
        {count === null ? <span>&nbsp;</span> : count}
      </div>
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
