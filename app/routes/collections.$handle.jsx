import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  const description =
    "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!";

  return [
    {title: `${data?.collection.title ?? ''} Collection | Harrel Hair`},
    {
      name: 'description',
      content: `${data?.collection.description ?? description}`,
    },
    {
      name: 'og:title',
      content: `${data?.collection.title ?? ''} Collection | Harrel Hair`,
    },
    {
      name: 'og:description',
      content: `${data?.collection.description ?? description}`,
    },
    {
      name: 'twitter:title',
      content: `${data?.collection.title ?? ''} Collection | Harrel Hair`,
    },
    {
      name: 'twitter:description',
      content: `${data?.collection.description ?? description}`,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const {context, params, request} = args;
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {collection};
}

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Collection Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-zinc-50 mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          {collection.products.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({product}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.nodes[0],
  );

  const colorOptions = product.variants.nodes.map((variant) => {
    const colorOption = variant.selectedOptions.find(
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
      <div className="rounded-2xl aspect-[3/4] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Image
          data={selectedVariant.image || product.images.nodes[0]}
          aspectRatio="3/4"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 transition-transform duration-500 object-cover"
        />
      </div>

      <div className="mt-4 md:mt-6 px-2">
        <h4 className=" font-medium text-zinc-50 group-hover:text-[#cb819c] transition-colors duration-200">
          {product.title}
        </h4>
        <Money
          data={selectedVariant.price}
          className="text-[#cb819c] text-base md:text-lg mt-1 md:mt-2 block"
        />
        {/*
        {colorOptions.length > 0 && (
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
                    selectedVariant.id === id
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
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
