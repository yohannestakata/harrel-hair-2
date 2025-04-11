import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta = () => {
  return [
    {title: 'Collections | Harrel Hair'},
    {
      name: 'og:title',
      content: 'Collections | Harrel Hair',
    },
    {
      name: 'twitter:title',
      content: 'Collections | Harrel Hair',
    },
    {
      name: 'description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },
    // Open Graph
    {
      property: 'og:description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },

    // Twitter Card
    {
      name: 'twitter:description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8, // Increased for better grid layout
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: {
        ...paginationVariables,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto bg-zinc-900 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <p className="text-sm md:text-base uppercase tracking-widest text-pink-600 mb-2">
          Curated Selections
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-zinc-50 mb-4 tracking-tight">
          Explore Our Collections
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
          Discover premium wigs for every style and occasion, crafted to enhance
          your natural beauty.
        </p>
      </div>

      {/* Collections Grid */}
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8"
      >
        {({node: collection, index}) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  return (
    <Link
      className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:ring-2 hover:ring-pink-600"
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {/* Collection Image */}
      {collection?.image && (
        <div className="aspect-square overflow-hidden">
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 4 ? 'eager' : 'lazy'}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Overlay with collection title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
        <div>
          <h3 className="text-white text-2xl md:text-3xl font-medium group-hover:underline underline-offset-4">
            {collection.title}
          </h3>
          <p className="text-pink-300 text-sm mt-1">Shop Now →</p>
        </div>
      </div>

      {/* Optional: Display product count or price range if available */}
      {collection.productsCount && (
        <span className="absolute top-3 right-3 bg-zinc-800/90 text-zinc-50 text-xs px-2 py-1 rounded-full">
          {collection.productsCount} styles
        </span>
      )}
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
    productsCount: metafield(namespace: "custom", key: "products_count") {
      value
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: UPDATED_AT,
      reverse: true
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
