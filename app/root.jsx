import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {ParallaxProvider} from 'react-scroll-parallax';
import {getServerSideURL} from './utils/getUrls';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  const baseUrl = getServerSideURL();

  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},

    {rel: 'apple-touch-icon', href: '/apple-icon-x3.png', sizes: '180x180'},
    {rel: 'manifest', href: `${baseUrl}/manifest.json`},
  ];
}

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export const meta = () => {
  // const baseUrl = getServerSideURL();
  const baseUrl = 'https://www.harrelhair.com';

  return [
    // General
    {
      title:
        'Harrel Hair | Premium Human Hair Extensions & Virgin Hair Bundles | 100% Remy Hair | USA Shop',
    },
    {
      name: 'description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },
    {
      name: 'keywords',
      content:
        'Human hair extensions, Virgin hair bundles, Remy human hair, Brazilian hair extensions, Human hair wigs, Clip-in hair extensions, Straight human hair, Curly human hair',
    },
    // Open Graph
    {
      property: 'og:title',
      content:
        'Harrel Hair | Premium Human Hair Extensions & Virgin Hair Bundles | 100% Remy Hair | USA Shop',
    },
    {
      property: 'og:description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },

    {property: 'og:type', content: 'website'},
    {
      property: 'og:siteName',
      content: 'Harrel Hair',
    },
    {property: 'og:url', content: baseUrl},
    {property: 'og:image', content: `${baseUrl}/og-image.jpg`},
    {
      property: 'og:locale',
      content: 'en_US',
    },

    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {
      name: 'twitter:title',
      content:
        'Harrel Hair | Premium Human Hair Extensions & Virgin Hair Bundles | 100% Remy Hair | USA Shop',
    },
    {
      name: 'twitter:description',
      content:
        "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    },
    {
      name: 'twitter:image',
      content: `${baseUrl}/og-image.jpg`,
    },
  ];
};

/**
 * @param {{children?: React.ReactNode}}
 */
export function Layout({children}) {
  const nonce = useNonce();
  /** @type {RootLoader} */
  const data = useRouteLoaderData('root');

  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Harrel Hair',
    description:
      "Discover Harrel's premium 100% Remy human hair extensions, virgin bundles, and wigs. Shop Brazilian, Peruvian, and Malaysian hair with free US shipping. Ethically sourced, natural textures, and long-lasting quality. Transform your look today!",
    url: 'https://www.harrelhair.com', // Update with your actual domain
    logo: {
      '@type': 'ImageObject',
      url: 'https://cdn.shopify.com/oxygen-v2/40587/34103/71521/1560057/assets/Logo-43-BYsKvbT7.svg',
      width: 301,
      height: 63,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8504 16th Street',
      addressLocality: 'Silver Spring',
      addressRegion: 'MD',
      postalCode: '20910',
      addressCountry: 'US',
    },
    keywords: ['hair care', 'hair accessories', 'beauty products'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@harrelhair.com',
      telephone: '+12024129495',
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Amharic'],
      servedArea: 'US',
    },
    sameAs: [
      'https://www.facebook.com/harrelhair',
      'https://www.instagram.com/harrelhair',
      'https://www.pinterest.com/harrelhair',
    ],
    serviceArea: 'United States',
    foundingDate: '2025',
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        {/* Structured Data */}
        <script type="application/ld+json" id="organization_schema">
          {JSON.stringify(organizationSchema)}
        </script>
        <Meta />
        <Links />
      </head>
      <body>
        <ParallaxProvider>
          {data ? (
            <Analytics.Provider
              cart={data.cart}
              shop={data.shop}
              consent={data.consent}
            >
              <PageLayout {...data}>{children}</PageLayout>
            </Analytics.Provider>
          ) : (
            children
          )}
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </ParallaxProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

/** @typedef {LoaderReturnData} RootLoader */

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@remix-run/react').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
