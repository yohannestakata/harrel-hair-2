import {useLoaderData, useNavigation} from '@remix-run/react';
import {
  getPaginationVariables,
  Analytics,
  Image,
  Money,
} from '@shopify/hydrogen';
import {useState, useMemo, useEffect} from 'react';
import {SearchForm} from '~/components/SearchForm';
import {Link} from '@remix-run/react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Search`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  const navigation = useNavigation();

  // Calculate max price for range slider
  const maxPrice = useMemo(() => {
    if (!result?.items?.products?.nodes) return 1000;
    return Math.ceil(
      Math.max(
        ...result.items.products.nodes.map((product) =>
          parseFloat(
            product.selectedOrFirstAvailableVariant?.price?.amount || '0',
          ),
        ),
      ),
    );
  }, [result]);

  const [filters, setFilters] = useState({
    priceRange: [0, maxPrice], // Initialize with maxPrice
    availableOnly: false,
    vendors: [],
  });
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Update price range when max price changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice], // Always set max to calculated maxPrice
    }));
  }, [maxPrice]);

  if (type === 'predictive') return null;

  // Extract all unique vendors for filter options
  const allVendors = useMemo(() => {
    if (!result?.items?.products?.nodes) return [];
    const vendors = new Set();
    result.items.products.nodes.forEach((product) => {
      if (product.vendor) vendors.add(product.vendor);
    });
    return Array.from(vendors).sort();
  }, [result]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!result?.items?.products?.nodes) return [];

    return result.items.products.nodes.filter((product) => {
      // Price filter
      const price = parseFloat(
        product.selectedOrFirstAvailableVariant?.price?.amount || '0',
      );
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Vendor filter
      if (
        selectedVendors.length > 0 &&
        !selectedVendors.includes(product.vendor)
      ) {
        return false;
      }

      // Availability filter
      if (
        filters.availableOnly &&
        !product.selectedOrFirstAvailableVariant?.availableForSale
      ) {
        return false;
      }

      return true;
    });
  }, [result, filters, selectedVendors]);

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters({...filters, priceRange: newRange});
  };

  const toggleVendor = (vendor) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor)
        ? prev.filter((v) => v !== vendor)
        : [...prev, vendor],
    );
  };

  const isLoading = navigation.state === 'loading';

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {term ? `Search results for "${term}"` : 'Search'}
        </h1>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-600 text-red-100 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {!term || !result?.total ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              {!term ? 'Enter a search term above' : 'No results found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-800 p-6 rounded-lg shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="w-full mb-2 accent-pink-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="w-full accent-pink-600"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-zinc-400">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Availability</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availableOnly}
                      onChange={() =>
                        setFilters({
                          ...filters,
                          availableOnly: !filters.availableOnly,
                        })
                      }
                      className="mr-2 accent-pink-600"
                    />
                    In stock only
                  </label>
                </div>

                {/* Vendor Filter */}
                {allVendors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Brands</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {allVendors.map((vendor) => (
                        <label key={vendor} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={selectedVendors.includes(vendor)}
                            onChange={() => toggleVendor(vendor)}
                            className="mr-2 accent-pink-600"
                          />
                          {vendor}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, maxPrice],
                      availableOnly: false,
                    });
                    setSelectedVendors([]);
                  }}
                  className="text-pink-400 hover:text-pink-300 text-sm"
                >
                  Reset all filters
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <SearchForm>
                  {({inputRef}) => (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-4 py-2 border border-zinc-700 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-zinc-50"
                        defaultValue={term}
                        name="q"
                        placeholder="Search products, articles, and more..."
                        ref={inputRef}
                        type="search"
                      />
                      <button
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        type="submit"
                      >
                        {isLoading ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                  )}
                </SearchForm>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-zinc-400">
                  Showing {filteredProducts.length} of{' '}
                  {result.items.products.nodes.length} products
                </p>
                {/* Sorting could be added here */}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-400">
                    No products match your filters
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        priceRange: [0, maxPrice],
                        availableOnly: false,
                      });
                      setSelectedVendors([]);
                    }}
                    className="mt-2 text-pink-400 hover:text-pink-300"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Display articles and pages if they exist */}
              {(result.items.articles.nodes.length > 0 ||
                result.items.pages.nodes.length > 0) && (
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold mb-6">Other Results</h2>

                  {result.items.articles.nodes.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-medium mb-4">Articles</h3>
                      <div className="grid gap-4">
                        {result.items.articles.nodes.map((article) => (
                          <ArticleCard key={article.id} article={article} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <Analytics.SearchView
          data={{searchTerm: term, searchResults: result}}
        />
      </div>
    </div>
  );
}

function ProductCard({product}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.nodes?.[0] || product.selectedOrFirstAvailableVariant,
  );

  // Extract color options from variants
  const colorOptions = (
    product.variants?.nodes || [product.selectedOrFirstAvailableVariant]
  ).map((variant) => {
    const colorOption = variant.selectedOptions?.find(
      (option) => option.name.toLowerCase() === 'color',
    );
    return {
      id: variant.id,
      color: colorOption ? colorOption.value : variant.title,
      variant,
    };
  });

  return (
    <Link className="group" to={`/products/${product.handle}`}>
      <div className="rounded-2xl aspect-[3/4] overflow-hidden bg-zinc-800">
        <Image
          data={
            selectedVariant?.image ||
            product.images?.nodes?.[0] ||
            product.selectedOrFirstAvailableVariant?.image
          }
          aspectRatio="3/4"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 duration-200 object-cover"
        />
      </div>
      <h4 className="mt-4 group-hover:text-pink-400 group-hover:underline underline-offset-4 uppercase">
        {product.title}
      </h4>
      <p className="text-zinc-400 text-sm mb-2">{product.vendor}</p>
      <Money
        data={selectedVariant?.price}
        className="text-lg italic mt-1 text-zinc-300"
      />
    </Link>
  );
}

function ArticleCard({article}) {
  return (
    <Link
      to={`/blogs/${article.blog?.handle}/${article.handle}`}
      className="bg-zinc-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow block hover:bg-zinc-700"
    >
      <h3 className="font-medium mb-2">{article.title}</h3>
      <p className="text-zinc-400 text-sm">From the blog</p>
    </Link>
  );
}

/**
 * Regular search query and fragments
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    availableForSale
    variants(first: 100) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    images(first: 1) {
      nodes {
        url
        altText
        width
        height
      }
    }
    selectedOrFirstAvailableVariant {
      id
      availableForSale
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
    blog {
      handle
    }
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
