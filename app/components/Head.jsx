export function Head({product}) {
  const productSchema = product
    ? {
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
      }
    : null;

  return (
    <>
      <Meta />
      <Links />
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </>
  );
}
