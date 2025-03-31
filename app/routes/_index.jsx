import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {
  Boxes,
  ChevronDown,
  ChevronsDown,
  ChevronUp,
  Truck,
  User2,
} from 'lucide-react';
import {useState} from 'react';
import {ParallaxBanner, ParallaxBannerLayer} from 'react-scroll-parallax';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Harrel Hair | Home'}];
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
async function loadCriticalData({context}) {
  const {collections} = await context.storefront.query(
    FEATURED_COLLECTIONS_QUERY,
  );

  // Fallback if there are fewer than three collections
  if (collections.nodes.length < 3) {
    return {
      featuredCollection: collections.nodes[0] || null,
      secondFeaturedCollection: collections.nodes[1] || null,
      thirdFeaturedCollection: null,
    };
  }

  return {
    featuredCollection: collections.nodes[0],
    secondFeaturedCollection: collections.nodes[1],
    thirdFeaturedCollection: collections.nodes[2],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <div className="home text-foreground">
      <FeaturedCollection collection={data.featuredCollection} />
      <PopularProducts products={data.recommendedProducts} />
      <SecondFeaturedCollection collection={data.secondFeaturedCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <ThirdFeaturedCollection collection={data.thirdFeaturedCollection} />
      <PromoBar />
      <FAQ />
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'What type of wigs do you offer?',
      answer:
        'We offer a wide range of wigs, including natural-looking wigs, synthetic wigs, and even human hair wigs',
    },
    {
      question: 'How do I choose the right wig for me?',
      answer:
        'Choosing the right wig depends on your hair type, desired style, and personal preferences. Consider factors like texture, length, and color when selecting a wig.',
    },
    {
      question: 'Do you offer wigs for medical hair loss?',
      answer:
        'Yes, we offer wigs for medical hair loss. Our wigs are designed to provide comfort and support during treatment.',
    },
    {
      question: 'How do I care for my wig?',
      answer:
        'To care for your wig, follow these steps: Wash it with a wig shampoo, brush it gently, and store it in a cool, dry place when not in use.',
    },
  ];
  const [selectedFaq, setSelectedFaq] = useState(faqs[0].question);

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 mx-auto max-w-7xl">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-center">
        FAQs
      </h2>
      <div className="flex flex-col lg:flex-row mt-8 md:mt-10 gap-5 md:gap-8">
        <div className="lg:flex-1 bg-zinc-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center order-2 lg:order-1">
          <Image
            src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Tabsophie.webp?v=1741084454"
            className="w-full h-full object-cover"
            alt="FAQ illustration"
          />
        </div>
        <div className="lg:flex-1 order-1 lg:order-2">
          <div className="">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-zinc-200 py-4 md:py-6"
              >
                <button
                  className="text-base md:text-lg font-medium cursor-pointer w-full text-left flex items-center"
                  onClick={() =>
                    setSelectedFaq((prev) =>
                      prev === faq.question ? null : faq.question,
                    )
                  }
                >
                  <span className="flex-1">{faq.question}</span>
                  {selectedFaq === faq.question ? (
                    <ChevronUp className="ml-2" />
                  ) : (
                    <ChevronDown className="ml-2" />
                  )}
                </button>
                {selectedFaq === faq.question && (
                  <p className="text-zinc-700 mt-2 md:mt-4 text-sm md:text-base">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoBar() {
  return (
    <section className="flex flex-col sm:flex-row gap-8 md:gap-12 items-center justify-around my-12 md:my-20 px-4 md:px-8 2xl:px-24">
      <div className="flex items-center gap-3 flex-col justify-center w-full sm:w-auto">
        <Truck
          size={32}
          className="md:h-10 md:w-10"
          strokeWidth={1}
          color="#c6005c"
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif">
            Free shipping
          </span>
          <span className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            On U.S. Orders Over $99
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center w-full sm:w-auto">
        <User2
          size={32}
          className="md:h-10 md:w-10"
          strokeWidth={1}
          color="#c6005c"
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif">
            Guaranteed Success
          </span>
          <span className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Refreshed, Inspected, Perfected
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center w-full sm:w-auto">
        <Boxes
          size={32}
          className="md:h-10 md:w-10"
          strokeWidth={1}
          color="#c6005c"
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif">
            30-Day returns
          </span>
          <span className="text-muted-foreground text-sm md:text-base mt-1 md:mt-2">
            Easy &amp; No Restocking fees
          </span>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div className="relative h-[75vh] md:h-[calc(100vh-64px)] overflow-hidden">
      {image && (
        <>
          <div className="absolute inset-0">
            <ParallaxBanner style={{width: '100%', height: '100%'}}>
              <ParallaxBannerLayer speed={-30}>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image.url})`,
                    height: '120%',
                  }}
                />
              </ParallaxBannerLayer>
            </ParallaxBanner>
          </div>
          <div className="bg-gradient-to-l from-black/60 to-black/60 absolute inset-0" />
          <div className="text-zinc-50 h-full flex flex-col justify-center relative px-4">
            <p className="tracking-wider text-center text-xs sm:text-sm uppercase font-semibold text-zinc-300 w-full md:w-1/2 mx-auto">
              Collection
            </p>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-8xl font-medium text-center tracking-tight w-full md:w-1/2 mx-auto font-serif">
              {collection.title}
            </h1>
            <p className="mt-4 md:mt-6 font-semibold mx-auto text-zinc-300 text-center text-sm sm:text-base md:text-lg w-full md:w-3/4 lg:w-1/2 px-4">
              Whether you're looking for a natural everyday look or a bold
              transformation, our wigs are designed to complement your unique
              beauty.
            </p>
            <div className="flex justify-center mt-4 md:mt-6">
              <Link
                className="px-4 py-2 sm:px-6 sm:py-3 mx-auto text-background border border-background font-semibold hover:bg-background hover:text-foreground duration-200 ease-in-out tracking-widest text-xs sm:text-sm"
                to={`/collections/${collection.handle}`}
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
          <div className="absolute animate-ping bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2">
            <ChevronsDown
              size={20}
              className="sm:w-6 sm:h-6"
              color="white"
              strokeWidth={1}
            />
          </div>
        </>
      )}
    </div>
  );
}

function SecondFeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  const products = collection?.products?.nodes || [];

  return (
    <div className="relative py-12 md:py-16 mt-12 md:mt-20 overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <ParallaxBanner className="w-full h-full">
            <ParallaxBannerLayer speed={-30}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image.url})`,
                  height: '120%',
                  width: '120%',
                }}
              />
            </ParallaxBannerLayer>
          </ParallaxBanner>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
      <div className="relative h-full flex items-center justify-center lg:justify-end 2xl:max-w-7xl mx-auto px-4 md:px-8">
        <div className="w-full max-w-md 2xl:mr-0">
          <div className="flex flex-col items-center gap-4 lg:pr-8">
            {products.slice(0, 1).map((product) => (
              <div
                key={product.id}
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden"
              >
                {product.images.nodes[0] && (
                  <Image
                    data={product.images.nodes[0]}
                    className="h-full w-full object-cover shadow-xl rounded-2xl"
                    aspectRatio="4/5"
                  />
                )}
              </div>
            ))}

            <div className="text-zinc-50 text-center w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
                {collection.title}
              </h1>
              <Link
                className="mt-4 md:mt-6 px-6 py-2 md:px-8 md:py-3 bg-transparent border-2 border-zinc-50 text-xs sm:text-sm uppercase tracking-widest inline-block hover:bg-white hover:text-black transition-all duration-300 font-semibold"
                to={`/collections/${collection.handle}`}
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThirdFeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  const products = collection?.products?.nodes || [];

  return (
    <div className="relative py-12 md:py-16 mt-12 md:mt-20 overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <ParallaxBanner className="w-full h-full">
            <ParallaxBannerLayer speed={-30}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image.url})`,
                  height: '120%',
                  width: '120%',
                }}
              />
            </ParallaxBannerLayer>
          </ParallaxBanner>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative h-full flex items-center justify-center lg:justify-start mx-auto 2xl:max-w-7xl px-4 md:px-8">
        <div className="w-full max-w-md xl:max-w-lg 2xl:ml-0">
          <div className="flex flex-col items-center gap-4 lg:ml-8">
            {products.slice(0, 1).map((product) => (
              <div
                key={product.id}
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden"
              >
                {product.images.nodes[0] && (
                  <Image
                    data={product.images.nodes[0]}
                    className="h-full w-full object-cover shadow-xl rounded-2xl"
                    aspectRatio="4/5"
                  />
                )}
              </div>
            ))}

            <div className="text-zinc-50 text-center w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
                {collection.title}
              </h1>
              <Link
                className="mt-4 md:mt-6 px-6 py-2 md:px-8 md:py-3 bg-transparent border-2 border-zinc-50 text-xs sm:text-sm uppercase tracking-widest inline-block hover:bg-white hover:text-black transition-all duration-300 font-semibold"
                to={`/collections/${collection.handle}`}
              >
                Explore More Styles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedProducts({products}) {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto pt-12 md:pt-20">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <>
              <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight">
                Newest Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8 mt-8 md:mt-10">
                {response
                  ? response.recommendedProducts.nodes.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  : null}
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function PopularProducts({products}) {
  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto pt-12 md:pt-20">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <>
              <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight">
                Most Popular
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8 mt-8 md:mt-10">
                {response
                  ? response.bestSellingProducts.nodes.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  : null}
              </div>
            </>
          )}
        </Await>
      </Suspense>
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
      <h4 className="mt-3 md:mt-4 text-sm md:text-base group-hover:text-zinc-950 group-hover:underline underline-offset-4 uppercase">
        {product.title}
      </h4>
      <Money
        data={selectedVariant.price}
        className="text-base md:text-lg italic mt-1 text-zinc-700"
      />
      <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4">
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
    </Link>
  );
}

const FEATURED_COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first: 2) {
      nodes {
        images(first: 1) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
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
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    recommendedProducts:products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
    bestSellingProducts: products(first: 4, sortKey: BEST_SELLING, reverse: true) {
         nodes {
           ...RecommendedProduct
         }
       }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').SecondFeaturedCollectionFragment} SecondFeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').ThirdFeaturedCollectionFragment} ThirdFeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
