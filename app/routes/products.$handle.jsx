import {useLoaderData} from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

import {useState} from 'react';
import {useEffect} from 'react';

export default function Product() {
  const {product} = useLoaderData();

  // State to track the currently selected image
  const [selectedImage, setSelectedImage] = useState(
    product.selectedOrFirstAvailableVariant?.image ||
      product.images.edges[0]?.node,
  );

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Update the selected image when the variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  // Sets the search param to the selected variant without navigation
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, images, variants} = product;

  // Filter out variant-specific images
  const generalImages = images.edges.filter(({node}) => {
    // Check if the image is used in any variant
    const isVariantImage = variants.edges.some(({node: variant}) => {
      return variant.image?.id === node.id;
    });

    // Exclude the image if it's used in any variant
    return !isVariantImage;
  });

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.seo?.description,
    image: product.images.edges[0]?.node.url,
    url: `https://your-store.com/products/${product.handle}`,
    brand: {
      '@type': 'Brand',
      name: product.vendor,
    },
    offers: {
      '@type': 'Offer',
      price: selectedVariant?.price?.amount,
      priceCurrency: selectedVariant?.price?.currencyCode || 'USD',
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://your-store.com/products/${product.handle}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />

      {/* Image Gallery - Mobile: Stacked, Desktop: Side by side */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4">
        {/* Thumbnails - Mobile: Horizontal scroll, Desktop: Vertical */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-visible md:w-20 pb-2 md:pb-0">
          {generalImages.map(({node}) => (
            <button
              key={node.id}
              onClick={() => setSelectedImage(node)}
              className="size-16 md:size-20 overflow-hidden border-2 rounded-md cursor-pointer border-transparent hover:border-primary focus:border-primary flex-shrink-0"
            >
              <img
                src={node.url}
                alt={node.altText || 'Product Image'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 aspect-square md:aspect-auto">
          <ProductImage image={selectedImage} />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 product-main md:sticky md:top-4 md:self-start">
        <h1 className="text-2xl md:text-4xl font-serif mb-2 font-semibold">
          {title}
        </h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
          className="text-lg md:text-xl"
        />

        <div className="mt-4 md:mt-8">
          <p className="font-medium">Description</p>
          <div className="mt-2 text-zinc-700 text-sm md:text-base">
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>

      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;
const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    images(first: 10) { # Fetch up to 10 product images
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) { # Fetch up to 10 variants
      edges {
        node {
          id
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
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
