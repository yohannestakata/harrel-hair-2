import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({request, context: {storefront}}) {
  const response = await getSitemapIndex({
    storefront,
    request,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`); // 24-hour caching
  return response;
}
