import {getSitemapIndex} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */
 export async function loader({request, context: {storefront, env}}) {
   // Get your shop's primary domain
   const shopDomain = getStorefrontDomain(context);
   const baseUrl = `https://${shopDomain}`;

   // Get counts to determine if we need pagination
   const counts = await storefront.query(`
     {
       products {
         totalCount
       }
       collections {
         totalCount
       }
       pages {
         totalCount
       }
       blogs {
         totalCount
       }
     }
   `);

   // Generate sitemap entries with lastmod dates
   const now = new Date().toISOString();
   const sitemaps = [];

   // Products sitemap (with pagination if needed)
   const productPages = Math.ceil(counts.products.totalCount / 1000);
   for (let i = 1; i <= productPages; i++) {
     sitemaps.push({
       loc: `${baseUrl}/sitemap/products/${i}.xml`,
       lastmod: now
     });
   }

   // Collections sitemap
   if (counts.collections.totalCount > 0) {
     sitemaps.push({
       loc: `${baseUrl}/sitemap/collections/1.xml`,
       lastmod: now
     });
   }

   // Pages sitemap
   if (counts.pages.totalCount > 0) {
     sitemaps.push({
       loc: `${baseUrl}/sitemap/pages/1.xml`,
       lastmod: now
     });
   }

   // Blogs sitemap
   if (counts.blogs.totalCount > 0) {
     sitemaps.push({
       loc: `${baseUrl}/sitemap/blogs/1.xml`,
       lastmod: now
     });
   }
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
