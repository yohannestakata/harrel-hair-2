import {Suspense, useState, useId} from 'react';
import {Await, NavLink, useAsyncValue, Link} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {Search, ShoppingBag, User2, Menu} from 'lucide-react';
import logo from '~/assets/Logo-43.svg';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const queriesDatalistId = useId();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {open} = useAside();

  return (
    <header className="header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 w-full">
        {/* Mobile menu button and logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => open('mobile')}
            className="p-2 rounded-full text-zinc-700 hover:text-pink-700 hover:bg-pink-50 transition-colors duration-200"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <NavLink
            prefetch="intent"
            to="/"
            style={activeLinkStyle}
            end
            className="flex-shrink-0"
          >
            <img
              src={logo}
              alt="Harrel Hair"
              className="w-28 hover:opacity-80 transition-opacity duration-200"
            />
          </NavLink>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:flex">
          <NavLink
            prefetch="intent"
            to="/"
            style={activeLinkStyle}
            end
            className="flex-shrink-0"
          >
            <img
              src={logo}
              alt="Harrel Hair"
              className="w-32 hover:opacity-80 transition-opacity duration-200"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-0 lg:flex-1 lg:justify-center">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

        {/* Search and CTAs */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Search Bar - hidden on mobile */}
          <div className="hidden md:block relative">
            <SearchFormPredictive>
              {({fetchResults, goToSearch, inputRef}) => (
                <div className="relative">
                  <input
                    autoComplete="off"
                    name="q"
                    onChange={fetchResults}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    placeholder="Search products..."
                    ref={inputRef}
                    type="text"
                    list={queriesDatalistId}
                    className="border border-zinc-200 pl-4 pr-10 w-48 lg:w-64 rounded-full h-9 lg:h-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm lg:text-base"
                  />
                  <button
                    onClick={goToSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-pink-700 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
              )}
            </SearchFormPredictive>

            {/* Desktop Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-20">
                <SearchResultsPredictive>
                  {({items, total, term, state, closeSearch}) => {
                    const {articles, collections, pages, products, queries} =
                      items;

                    if (state === 'loading' && term.current) {
                      return (
                        <div className="p-4 flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                        </div>
                      );
                    }

                    if (!total) {
                      return (
                        <SearchResultsPredictive.Empty
                          term={term}
                          className="p-4 text-zinc-500 text-center"
                        />
                      );
                    }

                    return (
                      <div className="max-h-[60vh] overflow-y-auto">
                        <SearchResultsPredictive.Queries
                          queries={queries}
                          queriesDatalistId={queriesDatalistId}
                          className="p-3 hover:bg-zinc-50 border-b border-zinc-100"
                        />
                        {products.length > 0 && (
                          <div className="border-b border-zinc-100">
                            <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              Products
                            </h3>
                            <SearchResultsPredictive.Products
                              products={products}
                              closeSearch={closeSearch}
                              term={term}
                              className="p-3 hover:bg-zinc-50"
                            />
                          </div>
                        )}
                        {collections.length > 0 && (
                          <div className="border-b border-zinc-100">
                            <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              Collections
                            </h3>
                            <SearchResultsPredictive.Collections
                              collections={collections}
                              closeSearch={closeSearch}
                              term={term}
                              className="p-3 hover:bg-zinc-50"
                            />
                          </div>
                        )}
                        {pages.length > 0 && (
                          <div className="border-b border-zinc-100">
                            <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              Pages
                            </h3>
                            <SearchResultsPredictive.Pages
                              pages={pages}
                              closeSearch={closeSearch}
                              term={term}
                              className="p-3 hover:bg-zinc-50"
                            />
                          </div>
                        )}
                        {articles.length > 0 && (
                          <div className="border-b border-zinc-100">
                            <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              Articles
                            </h3>
                            <SearchResultsPredictive.Articles
                              articles={articles}
                              closeSearch={closeSearch}
                              term={term}
                              className="p-3 hover:bg-zinc-50"
                            />
                          </div>
                        )}
                        {term.current && total ? (
                          <Link
                            onClick={closeSearch}
                            to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                            className="block p-3 bg-zinc-50 text-pink-700 font-medium hover:bg-zinc-100 transition-colors text-center"
                          >
                            View all {total} results for <q>{term.current}</q>
                          </Link>
                        ) : null}
                      </div>
                    );
                  }}
                </SearchResultsPredictive>
              </div>
            )}
          </div>

          {/* Mobile Search Button - opens aside with search */}
          <button
            className="md:hidden p-2 rounded-full text-zinc-700 hover:text-pink-700 hover:bg-pink-50 transition-colors"
            onClick={() => open('search')}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const {close} = useAside();

  return (
    <nav
      className={`flex ${viewport === 'mobile' ? 'flex-col gap-1' : 'gap-1'}`}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
          className={({isActive}) =>
            `px-4 py-3 text-lg font-medium ${
              isActive
                ? 'text-pink-700 bg-pink-50'
                : 'text-zinc-700 hover:text-pink-700 hover:bg-pink-50'
            }`
          }
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={({isActive}) =>
              `${
                viewport === 'mobile'
                  ? 'px-4 py-3 text-lg'
                  : 'px-3 h-full justify-center items-center flex'
              } font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'text-pink-700 bg-pink-50'
                  : 'text-zinc-700 hover:text-pink-700 hover:bg-pink-50'
              }`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="flex items-center gap-2 md:gap-4" role="navigation">
      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          `p-2 rounded-full transition-colors duration-200 ${
            isActive
              ? 'text-pink-700 bg-pink-50'
              : 'text-zinc-700 hover:text-pink-700 hover:bg-pink-50'
          }`
        }
      >
        <Suspense fallback={<User2 size={20} />}>
          <Await resolve={isLoggedIn} errorElement={<User2 size={20} />}>
            <User2 size={20} />
          </Await>
        </Suspense>
      </NavLink>

      <CartToggle cart={cart} />
    </nav>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
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
      className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors duration-200 group"
      aria-label="Cart"
    >
      <ShoppingBag className="text-zinc-700 group-hover:text-pink-700 transition-colors" />
      {count !== null && count > 0 && (
        <div className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold flex items-center justify-center size-5 rounded-full">
          {count}
        </div>
      )}
    </button>
  );
}

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
 * @property {Promise<boolean>} isLoggedIn}
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
