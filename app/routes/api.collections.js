import {json} from '@shopify/remix-oxygen';

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      url(transform: {maxWidth: 100, maxHeight: 100})
      altText
    }
  }
  query StoreCollections {
    collections(first: 20, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...Collection
      }
    }
  }
`;

export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(COLLECTIONS_QUERY);
  return json({collections});
}
