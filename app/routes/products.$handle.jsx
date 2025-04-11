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
import {useState, useEffect, useRef} from 'react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Harrel Hair | ${data?.product.title ?? ''}`},
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
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

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
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {
    product,
  };
}

function loadDeferredData({context, params}) {
  return {};
}

function ProductZoomImage({image, className}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({x: 0, y: 0});
  const [isLoadingHiRes, setIsLoadingHiRes] = useState(false);
  const [hiResLoaded, setHiResLoaded] = useState(false);
  const imageRef = useRef(null);
  const zoomTimeoutRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const {left, top, width, height} = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({x, y});

    // Load hi-res image when mouse moves to new position
    if (isZoomed && !hiResLoaded && !isLoadingHiRes) {
      setIsLoadingHiRes(true);
      const hiResImg = new Image();
      hiResImg.src = `${image.url}&width=2000`;
      hiResImg.onload = () => {
        setHiResLoaded(true);
        setIsLoadingHiRes(false);
      };
    }
  };

  const handleMouseEnter = () => {
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZoomed(true);
    }, 300); // Small delay before zooming
  };

  const handleMouseLeave = () => {
    clearTimeout(zoomTimeoutRef.current);
    setIsZoomed(false);
    setIsLoadingHiRes(false);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={imageRef}
    >
      <img
        src={`${image.url}&width=800`} // Medium resolution for initial load
        alt={image.altText || 'Product Image'}
        className={`w-full h-full object-contain transition-transform duration-300 ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
        }}
      />
      {hiResLoaded && isZoomed && (
        <img
          src={`${image.url}&width=2000`} // High resolution when zoomed
          alt={image.altText || 'Product Image (Zoomed)'}
          className="absolute inset-0 w-full h-full object-contain scale-150"
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}
      {isZoomed && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-16 h-16 border-2 border-white rounded-full shadow-lg"
            style={{
              left: `${zoomPosition.x}%`,
              top: `${zoomPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Product() {
  const {product} = useLoaderData();
  const [selectedImage, setSelectedImage] = useState(
    product.selectedOrFirstAvailableVariant?.image ||
      product.images.edges[0]?.node,
  );
  const [hoveredThumbnail, setHoveredThumbnail] = useState(null);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, images, variants} = product;

  const generalImages = images.edges.filter(({node}) => {
    const isVariantImage = variants.edges.some(({node: variant}) => {
      return variant.image?.id === node.id;
    });
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
    <div className="bg-zinc-900 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
        />

        {/* Image Gallery */}
        <div className="flex-1 flex flex-col md:flex-row-reverse gap-4 md:gap-6">
          {/* Main Image */}
          <div className="flex-1 aspect-square relative overflow-hidden rounded-lg bg-zinc-800">
            <ProductZoomImage image={selectedImage} className="w-full h-full" />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:w-24 pb-2 md:pb-0 scrollbar-hide">
            {generalImages.map(({node}) => (
              <button
                key={node.id}
                onClick={() => {
                  setSelectedImage(node);
                  setHoveredThumbnail(null);
                }}
                onMouseEnter={() => {
                  setHoveredThumbnail(node.id);
                  setSelectedImage(node);
                }}
                onMouseLeave={() => {
                  if (hoveredThumbnail === node.id) {
                    setHoveredThumbnail(null);
                    if (selectedVariant?.image) {
                      setSelectedImage(selectedVariant.image);
                    } else {
                      setSelectedImage(product.images.edges[0]?.node);
                    }
                  }
                }}
                className={`size-20 md:size-24 overflow-hidden border-2 rounded-md cursor-pointer transition-all ${
                  hoveredThumbnail === node.id
                    ? 'border-pink-600 shadow-md'
                    : selectedImage?.id === node.id
                    ? 'border-zinc-500'
                    : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <img
                  src={node.url}
                  alt={node.altText || 'Product Image'}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 md:sticky md:top-8 md:self-start text-zinc-50">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 font-medium">
            {title}
          </h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
            className="text-xl md:text-2xl text-pink-600"
          />

          <div className="mt-6 md:mt-8">
            <p className="font-medium text-lg">Description</p>
            <div className="mt-3 text-zinc-300 text-base md:text-lg">
              <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
            </div>
          </div>

          <div className="mt-8 md:mt-10">
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
    images(first: 10) {
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
    variants(first: 10) {
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
