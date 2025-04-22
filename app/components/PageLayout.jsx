import {Await, Link} from '@remix-run/react';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {useState} from 'react';
import {useEffect} from 'react';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <GlobalLoading />;
  }

  return (
    <Aside.Provider>
      <ErrorBoundary fallback={<ErrorFallback component="Layout" />}>
        <Suspense fallback={<GlobalLoading />}>
          <CartAside cart={cart} />
          <SearchAside />
          <MobileMenuAside
            header={header}
            publicStoreDomain={publicStoreDomain}
          />

          {header ? (
            <Header
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          ) : (
            <HeaderSkeleton />
          )}

          <main>
            <ErrorBoundary
              fallback={<ErrorFallback component="Main Content" />}
            >
              {children}
            </ErrorBoundary>
          </main>

          <Suspense fallback={<FooterSkeleton />}>
            <Footer
              footer={footer}
              header={header}
              publicStoreDomain={publicStoreDomain}
            />
          </Suspense>
        </Suspense>
      </ErrorBoundary>
    </Aside.Provider>
  );
}

/**
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <ErrorBoundary fallback={<ErrorFallback component="Cart" />}>
        <Suspense fallback={<CartLoading />}>
          <Await resolve={cart} errorElement={<CartError />}>
            {(cart) => <CartMain cart={cart} layout="aside" />}
          </Await>
        </Suspense>
      </ErrorBoundary>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <ErrorBoundary fallback={<ErrorFallback component="Search" />}>
          <Suspense fallback={<SearchLoading />}>
            <SearchFormPredictive>
              {({fetchResults, goToSearch, inputRef}) => (
                <>
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search"
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                  />
                  &nbsp;
                  <button onClick={goToSearch}>Search</button>
                </>
              )}
            </SearchFormPredictive>

            <SearchResultsPredictive>
              {({items, total, term, state, closeSearch}) => {
                const {articles, collections, pages, products, queries} = items;

                if (state === 'loading' && term.current) {
                  return <SearchLoading />;
                }

                if (!total) {
                  return <SearchResultsPredictive.Empty term={term} />;
                }

                return (
                  <>
                    <SearchResultsPredictive.Queries
                      queries={queries}
                      queriesDatalistId={queriesDatalistId}
                    />
                    <SearchResultsPredictive.Products
                      products={products}
                      closeSearch={closeSearch}
                      term={term}
                    />
                    <SearchResultsPredictive.Collections
                      collections={collections}
                      closeSearch={closeSearch}
                      term={term}
                    />
                    <SearchResultsPredictive.Pages
                      pages={pages}
                      closeSearch={closeSearch}
                      term={term}
                    />
                    <SearchResultsPredictive.Articles
                      articles={articles}
                      closeSearch={closeSearch}
                      term={term}
                    />
                    {term.current && total ? (
                      <Link
                        onClick={closeSearch}
                        to={`${SEARCH_ENDPOINT}?q=${term.current}`}
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
          </Suspense>
        </ErrorBoundary>
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function MobileMenuAside({header, publicStoreDomain}) {
  return (
    header?.menu &&
    header?.shop?.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <ErrorBoundary fallback={<ErrorFallback component="Mobile Menu" />}>
          <Suspense fallback={<MobileMenuLoading />}>
            <HeaderMenu
              menu={header.menu}
              viewport="mobile"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </Suspense>
        </ErrorBoundary>
      </Aside>
    )
  );
}

// Loading Components
function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900">
      <div className="animate-pulse text-white">Loading store...</div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="h-16 bg-zinc-800 animate-pulse">
      <div className="container mx-auto h-full flex items-center justify-between">
        <div className="w-32 h-8 bg-zinc-700 rounded"></div>
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
          <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}

function FooterSkeleton() {
  return (
    <footer className="bg-zinc-800 p-8 animate-pulse">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-24 bg-zinc-700 rounded"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-zinc-700 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

function CartLoading() {
  return (
    <div className="p-4 space-y-4">
      <div className="h-6 w-1/2 bg-zinc-700 rounded animate-pulse"></div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-700 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="p-4 space-y-2">
      <div className="h-8 bg-zinc-700 rounded animate-pulse"></div>
      <div className="h-32 bg-zinc-700 rounded animate-pulse"></div>
    </div>
  );
}

function MobileMenuLoading() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-6 bg-zinc-700 rounded animate-pulse"></div>
      ))}
    </div>
  );
}

// Error Components
function ErrorBoundary({children, fallback}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback;
  }

  return (
    <ErrorBoundaryInner onError={() => setHasError(true)}>
      {children}
    </ErrorBoundaryInner>
  );
}

function ErrorBoundaryInner({children, onError}) {
  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error caught by boundary:', error);
      onError();
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [onError]);

  return children;
}

function ErrorFallback({component}) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-900/50 rounded">
      <p className="text-red-500">Failed to load {component}</p>
      <button
        className="mt-2 px-4 py-2 bg-red-900/20 text-white rounded hover:bg-red-900/30"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}

function CartError() {
  const error = useAsyncError();
  console.error('Cart error:', error);
  return (
    <div className="p-4">
      <p className="text-red-500">Failed to load cart</p>
      <Link to="/cart" className="text-blue-400 underline">
        View cart page
      </Link>
    </div>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
