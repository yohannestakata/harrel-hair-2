import {Suspense, useState, useId, useEffect} from 'react';
import {
  Await,
  NavLink,
  useAsyncValue,
  Link,
  useLoaderData,
} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {Search, ShoppingBag, User2, Menu, ChevronDown} from 'lucide-react';
import logo from '~/assets/Logo-43.svg';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useRef} from 'react';

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const queriesDatalistId = useId();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Search...');
  const searchTimeoutRef = useRef(null);
  const {open} = useAside();

  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const desktop = window.innerWidth >= 1024;
        setIsDesktop(desktop);
        setPlaceholderText(desktop ? 'Search products...' : 'Search...');
      };

      // Set initial values
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleSearchChange = (e, fetchResults) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchResults(e);
        setIsSearchOpen(true);
      }, 500);
    } else {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          {/* Search Bar - both mobile and desktop */}
          <div className="relative">
            <SearchFormPredictive>
              {({fetchResults, goToSearch, inputRef}) => (
                <div className="relative">
                  <input
                    autoComplete="off"
                    name="q"
                    onChange={(e) => handleSearchChange(e, fetchResults)}
                    onFocus={() => searchTerm.trim() && setIsSearchOpen(true)}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    placeholder={placeholderText}
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    list={queriesDatalistId}
                    className="border border-zinc-200 pl-4 pr-10 w-40 lg:w-64 rounded-full h-9 lg:h-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm lg:text-base"
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

            {/* Search Results Dropdown */}
            {isSearchOpen && searchTerm.trim() && (
              <div
                className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 lg:w-80 xl:w-96 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-20`}
              >
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

          {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
        </div>
      </div>
    </header>
  );
}

function CollectionsDropdown({publicStoreDomain, primaryDomainUrl}) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {close} = useAside();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        setCollections(data.collections.nodes);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && collections.length === 0) {
      fetchCollections();
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        to="/collections"
        className={({isActive}) =>
          `flex items-center gap-1 px-3 h-full justify-center font-medium rounded-md transition-colors duration-200 ${
            isActive
              ? 'text-pink-700 bg-pink-50'
              : 'text-zinc-700 hover:text-pink-700 hover:bg-pink-50'
          }`
        }
        prefetch="intent"
        end
      >
        Collections
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </NavLink>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-zinc-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-center text-zinc-500">
                Loading...
              </div>
            ) : (
              collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.handle}`}
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-pink-50 hover:text-pink-700 transition-colors duration-200"
                  prefetch="intent"
                  onClick={close}
                >
                  {collection.title}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
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
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // Special case for Collections dropdown on desktop
        if (item.title === 'Collections' && viewport === 'desktop') {
          return (
            <CollectionsDropdown
              key={item.id}
              publicStoreDomain={publicStoreDomain}
              primaryDomainUrl={primaryDomainUrl}
            />
          );
        }

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
