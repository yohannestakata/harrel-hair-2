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
  return [{title: 'Hydrogen | Home'}];
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
      featuredCollection: collections.nodes[0] || null, // Latest collection (or null if none exist)
      secondFeaturedCollection: collections.nodes[1] || null, // Second latest collection (or null if none exist)
      thirdFeaturedCollection: null, // No third collection
    };
  }

  return {
    featuredCollection: collections.nodes[0], // Latest collection
    secondFeaturedCollection: collections.nodes[1], // Second latest collection
    thirdFeaturedCollection: collections.nodes[2], // Third latest collection
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
      // Log query errors, but don't throw them so the page can still render
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
      <PromoBar />
      <PopularProducts products={data.recommendedProducts} />
      <SecondFeaturedCollection collection={data.secondFeaturedCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <ThirdFeaturedCollection collection={data.thirdFeaturedCollection} />
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
    {
      question: 'How do I apply my wig?',
      answer:
        'To apply your wig, follow these steps: Wash your hair with a wig shampoo, wrap it in a towel, and gently pull the wig over your head.',
    },
    {
      question: 'Can I style my wig with heat tools?',
      answer:
        'Yes, you can style your wig with heat tools like curling irons or flat irons. However, avoid using hot tools directly on the wig to prevent damage.',
    },
  ];
  const [selectedFaq, setSelectedFaq] = useState(faqs[0].question);

  return (
    <section className="py-20 px-8 mx-auto max-w-7xl">
      <h2 className="text-5xl font-serif tracking-tight text-center ">FAQs</h2>
      <div className="mt-10">
        {faqs.map((faq) => (
          <div key={faq.question} className="border-b border-zinc-200 py-6">
            <button
              className="text-lg font-semibold cursor-pointer w-full text-left flex items-center"
              onClick={() =>
                setSelectedFaq((prev) =>
                  prev === faq.question ? null : faq.question,
                )
              }
            >
              <span className="flex-1">{faq.question}</span>
              {selectedFaq === faq.question ? <ChevronUp /> : <ChevronDown />}
            </button>
            {selectedFaq === faq.question && (
              <p className="text-zinc-700 mt-4 w-2/3">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
function PromoBar() {
  return (
    <section className="flex items-center justify-around mt-20 px-8  2xl:px-24">
      <div className="flex items-center gap-3 flex-col justify-center">
        <Truck size={40} strokeWidth={1} />
        <div className="flex flex-col">
          <span className="text-2xl 2xl:text-3xl font-serif text-center">
            Free shipping
          </span>
          <span className="text-muted-foreground text-base mt-2 text-center">
            On U.S. Orders Over $99
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center">
        <User2 size={40} strokeWidth={1} />
        <div className="flex flex-col">
          <span className="text-2xl 2xl:text-3xl font-serif text-center">
            Guaranteed Success
          </span>
          <span className="text-muted-foreground text-base mt-2 text-center">
            Refreshed, Inspected, Perfected
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-col justify-center">
        <Boxes size={40} strokeWidth={1} />
        <div className="flex flex-col">
          <span className="text-2xl 2xl:text-3xl font-serif text-center">
            30-Day returns
          </span>
          <span className="text-muted-foreground text-base mt-2 text-center">
            Easy &amp; No Restocking fees
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */

function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden">
      {image && (
        <>
          {/* Parallax Background Image */}
          <div className="absolute inset-0">
            <ParallaxBanner style={{width: '120%', height: '120%'}}>
              <ParallaxBannerLayer speed={-30}>
                <div
                  className="absolute inset-0 bg-cover bg-center "
                  style={{
                    backgroundImage: `url(${image.url})`,
                    height: '120%',
                  }}
                />
              </ParallaxBannerLayer>
            </ParallaxBanner>
          </div>
          {/* Gradient Overlay */}
          <div className="bg-gradient-to-l from-black/60 to-black/60 absolute inset-0" />
          {/* Content */}
          <div className="text-zinc-50 h-full flex flex-col justify-center relative">
            <p className="tracking-tight text-center text-sm uppercase font-semibold text-zinc-300 w-1/2 mx-auto">
              Collection
            </p>
            <h1 className="text-8xl font-medium text-center tracking-tight w-1/2 mx-auto font-serif 2xl:text-9xl">
              {collection.title}
            </h1>
            <p className="mt-6 font-semibold mx-auto text-zinc-300 text-center w-3xl text-balance">
              Whether you&apos;re looking for a natural everyday look or a bold
              transformation, our wigs are designed to complement your unique
              beauty.
            </p>
            <div className="flex justify-center">
              <Link
                className="px-6 py-3 mx-auto text-background border border-background mt-6 inline-block  font-semibold hover:bg-background hover:text-foreground duration-200 ease-in-out tracking-widest text-sm"
                to={`/collections/${collection.handle}`}
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
          {/* Down Arrow */}
          <div className=" absolute animate-ping bottom-12 left-1/2 -translate-x-1/2">
            <ChevronsDown size={40} color="white" strokeWidth={1} />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * @param {{
 *   collection: SecondFeaturedCollectionFragment;
 * }}
 */
function SecondFeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  const products = collection?.products?.nodes || [];

  return (
    <div className="mt-20 relative h-screen overflow-hidden">
      {/* Parallax Background Image */}
      {image && (
        <div className="absolute inset-0">
          <ParallaxBanner style={{width: '120%', height: '120%'}}>
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
      )}

      {/* Gradient Overlay */}
      <div className="bg-gradient-to-l from-black/60 to-black/60 absolute inset-0" />

      {/* Content */}
      <div className="text-zinc-50 h-full flex flex-col justify-center relative px-8 2xl:px-24">
        {/* <h2 className="text-4xl font-serif text-center pb-10">
          See What&apos;s Trending
        </h2> */}

        <div className="grid grid-cols-2 gap-10 ">
          {/* Left Side - Product Images */}
          <div className="grid grid-cols-2 gap-5 ">
            {products.slice(0, 2).map((product) => (
              <div key={product.id} className="aspect-[4/5]">
                {product.images.nodes[0] && (
                  <Image
                    data={product.images.nodes[0]}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-zinc-300 text-sm font-bold uppercase tracking-widest">
              New Arrivals
            </p>
            <h1 className="text-6xl 2xl:text-8xl mt-1 font-serif tracking-tight">
              {collection.title}
            </h1>
            <p className="mt-3 text-zinc-300">
              Discover the latest trends and styles in our new arrivals
              collection.
            </p>
            <Link
              className="px-6 py-3 bg-transparent border border-zinc-50 text-sm uppercase tracking-widest mt-6 inline-block hover:bg-background font-semibold hover:text-foreground ease-in-out duration-200 w-fit "
              to={`/collections/${collection.handle}`}
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: ThirdFeaturedCollectionFragment;
 * }}
 */
function ThirdFeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  const products = collection?.products?.nodes || [];

  return (
    <div className="mt-20 ">
      <h2 className="text-5xl font-serif text-center  px-8 pb-10">
        Explore More Styles
      </h2>
      <div className="grid grid-cols-2  px-8 gap-5 max-w-7xl mx-auto">
        {image && (
          <div className="flex-1 w-full">
            <div className="h-full w-full  relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  data={image}
                  sizes="100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 flex-1">
          {products.map((product) => (
            <div key={product.id} className="aspect-[3/4] relative">
              {product.images.nodes[0] && (
                <Image
                  data={product.images.nodes[0]}
                  sizes="(min-width: 45em) 20vw, 50vw"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
          <div className="mt-6 col-span-2">
            <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest ">
              More Styles
            </p>
            <h1 className="text-5xl mt-1 font-serif tracking-tight">
              {collection.title}
            </h1>
            <p className="mt-3 text-zinc-600">
              Discover even more styles and trends in our collection.
            </p>
            <Link
              className="px-6 py-3 bg-background border border-zinc-950 text-sm uppercase tracking-widest mt-6 inline-block hover:bg-zinc-950/90 font-semibold hover:text-background ease-in-out duration-200"
              to={`/collections/${collection.handle}`}
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="px-8 max-w-7xl mx-auto pt-20 ">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <>
              <h2 className="text-center text-5xl font-serif tracking-tight">
                Newest Products
              </h2>
              <div className="grid grid-cols-4 gap-x-5 gap-y-8 mt-10">
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
    <div className="px-8 max-w-7xl mx-auto pt-20">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <>
              {/* Best Selling Products Section */}
              <h2 className="text-center text-5xl font-serif tracking-tight">
                Most Popular
              </h2>
              <div className="grid grid-cols-4 gap-x-5 gap-y-8 mt-10">
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

  return (
    <Link className="group" to={`/products/${product.handle}`}>
      <div className="rounded-none aspect-[5/6] overflow-hidden">
        <Image
          data={selectedVariant.image || product.images.nodes[0]}
          aspectRatio="4/5"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="h-full w-full group-hover:scale-105 duration-200 object-cover"
        />
      </div>
      <h4 className="mt-4 text-center text-sm font-bold group-hover:underline underline-offset-4 text-balance">
        {product.title}
      </h4>
      <Money
        data={selectedVariant.price}
        className="text-center  text-sm text-muted-foreground font-bold mt-1"
      />
      <div className=" flex justify-center gap-2">
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
