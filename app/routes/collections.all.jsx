import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {json} from '@shopify/remix-oxygen';
import {useState} from 'react';

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
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return json({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.nodes.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        url: `${
          typeof window !== 'undefined' ? window.location.origin : ''
        }/products/${product.handle}`,
        image: product.featuredImage?.url,
        description: product.description || `${product.title} from Harrel Hair`,
        brand: {
          '@type': 'Brand',
          name: 'Harrel Hair',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: product.priceRange.minVariantPrice.currencyCode,
          price: product.priceRange.minVariantPrice.amount,
          availability: 'https://schema.org/InStock',
          url: `${
            typeof window !== 'undefined' ? window.location.origin : ''
          }/products/${product.handle}`,
          seller: {
            '@type': 'Organization',
            name: 'Harrel Hair',
          },
        },
      },
    })),
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />

      {/* Hero Section - Inspired by collections page */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <p className="text-sm md:text-base uppercase tracking-widest text-pink-600 mb-2">
          Premium Quality
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-gray-900 mb-4 tracking-tight">
          Our Wig Collection
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover premium wigs for every style and occasion, crafted to enhance
          your natural beauty.
        </p>
      </div>

      {/* Products Grid - Inspired by product cards from second example */}
      <PaginatedResourceSection
        connection={products}
        resourcesClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-5 md:gap-y-10"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function ProductItem({product, loading}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.nodes[0] || null,
  );

  const colorOptions =
    product.variants?.nodes.map((variant) => {
      const colorOption = variant.selectedOptions.find(
        (option) => option.name.toLowerCase() === 'color',
      );
      return {
        id: variant.id,
        color: colorOption ? colorOption.value : variant.title,
        variant,
      };
    }) || [];

  return (
    <Link className="group" to={`/products/${product.handle}`}>
      <div className="rounded-2xl aspect-[3/4] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <Image
          data={selectedVariant?.image || product.featuredImage}
          aspectRatio="3/4"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 duration-500 object-cover"
          loading={loading}
        />
      </div>

      <div className="mt-3 md:mt-4">
        <h4 className="text-sm md:text-base group-hover:text-pink-700 group-hover:underline underline-offset-4 uppercase">
          {product.title}
        </h4>
        <Money
          data={selectedVariant?.price || product.priceRange.minVariantPrice}
          className="text-base md:text-lg italic mt-1 text-zinc-700"
        />
      </div>

      {colorOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4 justify-start">
          {colorOptions.slice(0, 9).map(({id, color, variant}) => {
            const getColorValue = (colorName) => {
              const colorMap = {
                black: '#000000',
                white: '#ffffff',
                red: '#ff0000',
                blue: '#0000ff',
                green: '#008000',
                yellow: '#ffff00',
                purple: '#800080',
                pink: '#ffc0cb',
                brown: '#a52a2a',
                gray: '#808080',
                blonde: '#faf0be',
                brunette: '#3a1f04',
                auburn: '#a52a2a',
                platinum: '#e5e4e2',
              };

              const lowerColor = color.toLowerCase();
              return colorMap[lowerColor] || '#cccccc';
            };

            const colorValue = getColorValue(color);

            return (
              <button
                key={id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(variant);
                }}
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full cursor-pointer border border-zinc-200 ${
                  selectedVariant?.id === id
                    ? 'ring-2 ring-offset-1 ring-pink-700'
                    : ''
                }`}
                style={{backgroundColor: colorValue}}
                title={color}
                aria-label={`Color option: ${color}`}
              />
            );
          })}
        </div>
      )}
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;
