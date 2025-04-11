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
    <div className="bg-zinc-900 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <p className="text-sm md:text-base uppercase tracking-widest text-pink-600 mb-2">
            Premium Quality
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-zinc-50 mb-4 tracking-tight">
            Our Wig Collection
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Discover premium wigs for every style and occasion, crafted to
            enhance your natural beauty.
          </p>
        </div>

        {/* Products Grid */}
        <PaginatedResourceSection
          connection={products}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
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
      <div className="rounded-2xl aspect-[3/4] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Image
          data={selectedVariant?.image || product.featuredImage}
          aspectRatio="3/4"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 transition-transform duration-500 object-cover"
          loading={loading}
        />
      </div>

      <div className="mt-4 md:mt-6 px-2">
        <h4 className="font-medium text-zinc-50 group-hover:text-pink-600 transition-colors duration-200">
          {product.title}
        </h4>
        <Money
          data={selectedVariant?.price || product.priceRange.minVariantPrice}
          className="text-pink-600 text-base md:text-lg mt-1 md:mt-2 block"
        />

        {/* {colorOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
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
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full cursor-pointer border border-zinc-700 ${
                    selectedVariant?.id === id
                      ? 'ring-2 ring-offset-2 ring-pink-600'
                      : 'hover:ring-1 hover:ring-zinc-500'
                  } transition-all duration-200`}
                  style={{backgroundColor: colorValue}}
                  title={color}
                  aria-label={`Color option: ${color}`}
                />
              );
            })}
          </div>
        )} */}
      </div>
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
