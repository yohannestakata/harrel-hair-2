import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useState} from 'react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
    <div className="collection pt-4 p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-serif text-center">
        {collection.title}
      </h1>
      {collection.description && (
        <p className="collection-description text-zinc-700 mt-4 text-center max-w-2xl mx-auto">
          {collection.description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {collection.products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
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
      <div className="rounded-2xl aspect-[3/4] overflow-hidden">
        <Image
          data={selectedVariant.image || product.images.nodes[0]}
          aspectRatio="3/4"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 duration-200 object-cover"
        />
      </div>
      <h4 className="mt-3 md:mt-4 text-sm md:text-base group-hover:text-zinc-950 group-hover:underline underline-offset-4 uppercase ">
        {product.title}
      </h4>
      <Money
        data={selectedVariant.price}
        className="text-base md:text-lg italic mt-1 text-zinc-700 block"
      />
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
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full cursor-pointer border border-border ${
                  selectedVariant.id === id
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
