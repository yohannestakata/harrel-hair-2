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
      <h1 className="text-6xl font-serif">{collection.title}</h1>
      <p className="collection-description text-zinc-700 mt-4">
        {collection.description}
      </p>
      <div className="grid grid-cols-4 gap-3 mt-8">
        {collection.products.nodes.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 * }}
 */
function ProductItem({product}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.nodes[0],
  );

  return (
    <div className="group">
      <Link
        className="product-item"
        key={product.id}
        prefetch="intent"
        to={`/products/${product.handle}`}
      >
        {selectedVariant?.image && (
          <Image
            alt={selectedVariant.image.altText || product.title}
            aspectRatio="4/5"
            data={selectedVariant.image}
            sizes="(min-width: 45em) 400px, 100vw"
            className="h-full w-full group-hover:scale-105 duration-200 object-cover"
          />
        )}
        <h4 className="text-center text-balace font-semibold mt-4 group-hover:underline underline-offset-4 text-sm">
          {product.title}
        </h4>
        <Money
          data={selectedVariant.price}
          className="mt-1 text-muted-foreground text-sm text-center w-full font-bold"
        />
      </Link>
      <div className="flex justify-center gap-2">
        {product.variants.nodes.length > 1 &&
          product.variants.nodes.map((variant) => (
            <button
              key={variant.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedVariant(variant);
              }}
              className={`px-2 mt-4 py-1 text-xs border border-border rounded-md cursor-pointer ${
                selectedVariant.id === variant.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              {variant.title}
            </button>
          ))}
      </div>
    </div>
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
