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
  const description =
    "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!";

  return [
    {title: `${data?.product.title ?? 'Product' | 'Harrel Hair'}`},
    {
      name: 'description',
      content: `${data?.product.description ?? description}`,
    },
    {
      name: 'og:title',
      content: `${data?.product.title ?? 'Product'} | Harrel Hair`,
    },
    {
      name: 'og:description',
      content: `${data?.product.description ?? description}`,
    },
    {
      name: 'twitter:title',
      content: `${data?.product.title ?? 'Product'} | Harrel Hair`,
    },
    {
      name: 'twitter:description',
      content: `${data?.product.description ?? description}`,
    },

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
    url: `https://harrelhair.com/products/${product.handle}`,
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
      url: `https://harrelhair.com/products/${product.handle}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />

      {/* Image Gallery */}
      <div className="flex-1 flex flex-col md:flex-row-reverse gap-4">
        {/* Main Image */}
        <div className="flex-1 aspect-square relative overflow-hidden rounded-lg">
          <ProductZoomImage image={selectedImage} className="w-full h-full" />
        </div>

        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:w-20 pb-2 md:pb-0 scrollbar-hide">
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
              className={`size-16 md:size-20 overflow-hidden border-2 rounded-md cursor-pointer transition-all ${
                hoveredThumbnail === node.id
                  ? 'border-primary shadow-md'
                  : selectedImage?.id === node.id
                  ? 'border-gray-300'
                  : 'border-transparent hover:border-gray-200'
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
      <div className="flex-1 md:sticky md:top-4 md:self-start">
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
