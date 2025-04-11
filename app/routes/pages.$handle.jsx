import {useLoaderData, useLocation, useNavigation} from '@remix-run/react';
import AboutUs from '~/custom-pages/AboutUs';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.page.title ?? ''}`},
    {
      name: 'og:title',
      content: `Hydrogen | ${data?.page.title ?? ''}`,
    },
    {
      name: 'twitter:title',
      content: `Hydrogen | ${data?.page.title ?? ''}`,
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
async function loadCriticalData({context, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const location = useLocation();
  const {state} = useNavigation();

  if (state === 'loading') return 'loading';

  return location.pathname === '/pages/about-us' ? (
    <AboutUs />
  ) : (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
