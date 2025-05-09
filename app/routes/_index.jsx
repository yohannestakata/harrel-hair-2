import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  RefreshCw,
  Truck,
  User2,
} from 'lucide-react';
import {useState} from 'react';
import {ParallaxBanner, ParallaxBannerLayer} from 'react-scroll-parallax';
import {motion} from 'motion/react';
import {useRef} from 'react';
import FlowerImg from '../../public/images/flower.png';

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
  // First, try to get the specific "Bundles" collection
  const bundlesCollection = await context.storefront
    .query(BUNDLES_COLLECTION_QUERY, {
      variables: {
        handle: 'bundles',
      },
    })
    .catch(() => null);

  // Then get the most recently updated collections
  const {collections} = await context.storefront.query(
    FEATURED_COLLECTIONS_QUERY,
  );

  // If we found the Bundles collection, use it as the first featured collection
  if (bundlesCollection?.collection) {
    return {
      firstFeaturedCollection: bundlesCollection.collection,
      secondFeaturedCollection: collections.nodes[0] || null,
      heroCollection: collections.nodes[1] || null,
    };
  }

  // Fallback if Bundles collection not found
  if (collections.nodes.length < 2) {
    return {
      firstFeaturedCollection: collections.nodes[0] || null,
      secondFeaturedCollection: null,
      heroCollection: null,
    };
  }

  return {
    firstFeaturedCollection: collections.nodes[0],
    secondFeaturedCollection: collections.nodes[1],
    heroCollection: collections.nodes[2] || null,
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
    <div className="text-zinc-50 bg-zinc-900">
      <HeroSection collection={data.heroCollection} />
      <PopularProducts products={data.recommendedProducts} />
      <FirstFeaturedCollection collection={data.firstFeaturedCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <SecondFeaturedCollection collection={data.secondFeaturedCollection} />
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
    <section className="bg-zinc-50 text-zinc-900">
      <div className="flex flex-col lg:flex-row mt-10 ">
        <div className="lg:flex-1 bg-zinc-200 overflow-hidden aspect-square flex items-center justify-center order-2 lg:order-1">
          <Image
            src="https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Card2-04.png?v=1744354641"
            className="w-full h-full object-cover"
            alt="FAQ illustration"
          />
        </div>
        <div className="lg:flex-1 order-1 lg:order-2 py-12 md:py-20 px-5 md:px-8 2xl:px-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif  text-center">
            FAQs
          </h2>
          <div className="mt-8">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-zinc-300 py-4 md:py-6"
              >
                <button
                  className="text-base md:text-lg font-medium cursor-pointer w-full text-left flex items-center hover:text-zinc-800 transition-colors duration-200"
                  onClick={() =>
                    setSelectedFaq((prev) =>
                      prev === faq.question ? null : faq.question,
                    )
                  }
                >
                  <span className="flex-1">{faq.question}</span>
                  <span className="ml-2 transition-transform duration-300">
                    {selectedFaq === faq.question ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: selectedFaq === faq.question ? 'auto' : 0,
                    opacity: selectedFaq === faq.question ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-zinc-600 pt-2 md:pt-4 text-sm md:text-base">
                    {faq.answer}
                  </p>
                </motion.div>
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
          className="md:h-10 md:w-10 text-pink-600"
          strokeWidth={1}
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif tracking-widest">
            Free shipping
          </span>
          <span className="text-zinc-400 text-sm md:text-base mt-1 md:mt-2">
            On U.S. Orders Over $99
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center w-full sm:w-auto">
        <User2
          size={32}
          className="md:h-10 md:w-10 text-pink-600"
          strokeWidth={1}
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif tracking-widest">
            Guaranteed Success
          </span>
          <span className="text-zinc-400 text-sm md:text-base mt-1 md:mt-2">
            Refreshed, Inspected, Perfected
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center w-full sm:w-auto">
        <RefreshCw
          size={32}
          className="md:h-10 md:w-10 text-pink-600"
          strokeWidth={1}
        />
        <div className="flex flex-col text-center">
          <span className="text-lg md:text-xl uppercase font-serif tracking-widest">
            30-Day returns
          </span>
          <span className="text-zinc-400 text-sm md:text-base mt-1 md:mt-2">
            Easy &amp; No Restocking fees
          </span>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <div className="relative h-[75vh] md:h-[calc(140vh-64px)] overflow-hidden">
      <div className="absolute inset-0">
        <ParallaxBanner style={{width: '100%', height: '100%'}}>
          <ParallaxBannerLayer speed={-30}>
            <div
              className="absolute inset-0 bg-cover bg-center "
              style={{
                backgroundImage: `url(https://cdn.shopify.com/s/files/1/0694/3395/0377/files/Hero_t1-08.png?v=1744746542)`,
              }}
            />
          </ParallaxBannerLayer>
        </ParallaxBanner>
      </div>
      <div className="bg-gradient-to-l from-black/40 to-black/40 absolute inset-0" />
      <div className="text-zinc-50 h-full flex flex-col py-24 relative px-4 justify-between">
        <div>
          <p className="tracking-widest text-center text-xl sm:text-2xl uppercase  text-zinc-300 w-full md:w-1/2 mx-auto italic">
            Simply
          </p>
          <h1 className="text-7xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-9xl font-medium text-center w-full md:w-1/2 mx-auto font-serif uppercase">
            Beautiful
          </h1>
        </div>
        <div>
          <p className="mx-auto text-zinc-300 text-center text-sm sm:text-base md:text-lg w-full md:w-3/4 lg:w-1/2 px-4">
            Experience hair extensions like never before with Harrel Hair
            Extension. we pride ourselves on offering 100% Remy human hair
            extensions that combine quality, style, and comfort.
          </p>
          {/* <div className="flex justify-center mt-4 md:mt-6">
            <Link
              className="px-4 py-2 sm:px-6 sm:py-3 mx-auto text-background border border-background font-semibold hover:bg-background hover:text-foreground duration-200 ease-in-out tracking-widest text-xs sm:text-sm"
              to="/collections/all"
            >
              SHOP NOW
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function FirstFeaturedCollection({collection}) {
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
                className="absolute inset-0 bg-cover bg-center h-full w-full"
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
            </ParallaxBannerLayer>
          </ParallaxBanner>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 md:via-black/40 md:to-transparent to-black/60" />
      <div className="relative h-full flex items-center justify-center lg:justify-end 2xl:max-w-7xl mx-auto px-4 md:px-8">
        <div className="w-full max-w-md 2xl:mr-0">
          <div className="flex flex-col items-center gap-4 lg:pr-8">
            {/* Hide on mobile, show on md and up */}
            {products.slice(0, 1).map((product) => (
              <div
                key={product.images.nodes[0]?.id}
                className="hidden md:block w-full aspect-[4/5] rounded-2xl overflow-hidden"
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
              <h1 className="text-5xl sm:text-4xl md:text-5xl font-serif ">
                {collection.title}
              </h1>
              {collection.description && (
                <div
                  className="mt-4 text-zinc-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
                />
              )}

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
                className="absolute inset-0 bg-cover bg-center h-full w-full"
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
            </ParallaxBannerLayer>
          </ParallaxBanner>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 md:via-black/40 md:to-transparent to-black/60" />
      <div className="relative h-full flex items-center justify-center lg:justify-start mx-auto 2xl:max-w-7xl px-4 md:px-8">
        <div className="w-full max-w-md xl:max-w-lg 2xl:ml-0">
          <div className="flex flex-col items-center gap-4 lg:ml-8">
            {/* Hide on mobile, show on md and up */}
            {products.slice(0, 1).map((product) => (
              <div
                key={product.images.nodes[0]?.id}
                className="hidden md:block w-full aspect-[4/5] rounded-2xl overflow-hidden"
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
              <h1 className="text-5xl sm:text-4xl md:text-5xl font-serif ">
                {collection.title}
              </h1>
              {collection.description && (
                <div
                  className="mt-4 text-zinc-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
                />
              )}
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

function ProductCard({product, index}) {
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

  // Check if this is the first or fourth card (index 0 or 3)
  const showFlower = index === 0 || index === 3;

  return (
    <div className="group relative">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="rounded-2xl aspect-[3/4] overflow-hidden relative">
          <Image
            data={selectedVariant.image || product.images.nodes[0]}
            aspectRatio="3/4"
            sizes="(min-width: 45em) 20vw, 50vw"
            className="h-full w-full group-hover:scale-105 duration-200 object-cover"
          />
          {showFlower && (
            <div className="absolute -bottom-6 -left-4 w-28 h-28 md:w-32 md:h-32">
              <img
                src="/images/flower.png"
                alt="Decorative flower"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        <h4 className="mt-3 md:mt-4 text-sm md:text-base group-hover:text-[#cb819c] group-hover:underline underline-offset-4 uppercase">
          {product.title}
        </h4>
        <Money
          data={selectedVariant.price}
          className="text-base md:text-lg italic mt-1 text-[#cb819c]"
        />
      </Link>
    </div>
  );
}

function ProductCarousel({products, title}) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto pt-12 md:pt-20">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-serif">
        {title}
      </h2>

      <div className="relative mt-8 md:mt-10">
        {/* Mobile carousel */}
        <div className="md:hidden relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
            aria-label="Scroll left"
            style={{zIndex: 1}}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scroll-snap-x-mandatory scrollbar-hide space-x-4 py-2"
            style={{
              scrollSnapType: 'x mandatory',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-3/4 scroll-snap-align-start"
                style={{flex: '0 0 75%'}}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Update the PopularProducts and RecommendedProducts components to use the modified ProductCarousel
function RecommendedProducts({products}) {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <Await resolve={products}>
        {(response) => (
          <ProductCarousel
            products={response?.recommendedProducts?.nodes || []}
            title="Newest Products"
          />
        )}
      </Await>
    </Suspense>
  );
}

function PopularProducts({products}) {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <Await resolve={products}>
        {(response) => (
          <ProductCarousel
            products={response?.bestSellingProducts?.nodes || []}
            title="Most Popular"
          />
        )}
      </Await>
    </Suspense>
  );
}
const FEATURED_COLLECTIONS_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    description
    descriptionHtml
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
    collections(first: 2, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const BUNDLES_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    description
    descriptionHtml
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
  query BundlesCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...FeaturedCollection
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
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
