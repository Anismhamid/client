import { getAbsolutePostUrl } from '../src/components/pages/products/helpers/postUrl';
import { Posts } from '../src/interfaces/Posts';

const SITE_URL = 'https://client-qqq1.vercel.app';

export type PostUrlFn = (post: Posts) => string | undefined;

const getSellerName = (seller: Posts['seller'] | undefined): string => {
    const name = seller?.name as
        | string
        | { first?: string; last?: string }
        | undefined;
    if (!name) return '';
    if (typeof name === 'string') return name.trim();
    return [name.first, name.last].filter(Boolean).join(' ').trim();
};

const buildItems = (posts: Posts[], getUrl: PostUrlFn = getAbsolutePostUrl) =>
    posts.flatMap((post) => {
        const url = getUrl(post);
        return url ? [{ post, url }] : [];
    });

// Category page structured data
export const generateCategoryJsonLd = (
    categoryName: string,
    posts: Posts[] = [],
    getUrl: PostUrlFn = getAbsolutePostUrl,
    pageUrl?: string,
) => {
    const items = buildItems(posts, getUrl);

    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: categoryName,
        description: `إعلانات وخدمات ضمن تصنيف ${categoryName} على صفقة`,
        url:
            pageUrl ??
            `${SITE_URL}/category/${encodeURIComponent(categoryName)}`,
        mainEntity: {
            '@type': 'ItemList',
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            numberOfItems: items.length,
            itemListElement: items.map(({ post, url }, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: post.product_name,
                url,
            })),
        },
    };
};

// Single listing structured data
// postUrl = absolute URL (نفس الـ canonical)
export const generateSingleProductJsonLd = (post: Posts, postUrl?: string) => {
    if (!postUrl || !post._id || !post.product_name) return null;

    const price =
        typeof post.price === 'number' && Number.isFinite(post.price)
            ? post.sale && typeof post.discount === 'number'
                ? Math.max(0, post.price - (post.price * post.discount) / 100)
                : post.price
            : undefined;

    const isService = String(post.category).toLowerCase() === 'services';
    const sellerName = getSellerName(post.seller);

    const description =
        post.description?.trim() ||
        `${post.product_name} - إعلان على منصة صفقة للبيع والشراء بين المستخدمين.`;

    const imageUrl = post.image?.url?.trim() || `${SITE_URL}/d3.png`;

    const offer: Record<string, unknown> = {
        '@type': 'Offer',
        url: postUrl,
        priceCurrency: 'ILS',
        itemCondition:
            post.isNew === true
                ? 'https://schema.org/NewCondition'
                : 'https://schema.org/UsedCondition',
        availability:
            post.in_stock === true && post.status !== 'sold'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
    };

    if (price !== undefined) offer.price = Number(price.toFixed(2));

    if (sellerName) {
        offer.seller = {
            '@type': 'Person',
            name: sellerName,
            ...(post.seller?.slug
                ? {
                      url: `${SITE_URL}/user/customer/${encodeURIComponent(post.seller.slug)}`,
                  }
                : {}),
        };
    }

    if (isService) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${postUrl}#service`,
            name: post.product_name,
            description,
            image: imageUrl,
            url: postUrl,
            category: post.category,
            ...(sellerName
                ? { provider: { '@type': 'Person', name: sellerName } }
                : {}),
            offers: offer,
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${postUrl}#product`,
        sku: String(post._id),
        name: post.product_name,
        description,
        image: [imageUrl],
        category: post.category,
        ...(post.brand
            ? { brand: { '@type': 'Brand', name: post.brand } }
            : {}),
        offers: offer,
    };
};

// Product/listing cards
export const generateProductsItemListJsonLd = (
    posts: Posts[],
    getUrl: PostUrlFn = getAbsolutePostUrl,
) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: buildItems(posts, getUrl).map(({ post, url }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.product_name,
        url,
    })),
});

// Discounted listings
export const generateDiscountsJsonLd = (
    posts: Posts[] = [],
    getUrl: PostUrlFn = getAbsolutePostUrl,
) => ({
    '@context': 'https://schema.org',
    '@graph': buildItems(posts, getUrl).flatMap(({ post, url }) => {
        const jsonLd = generateSingleProductJsonLd(post, url);
        if (!jsonLd) return [];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { '@context': _context, ...node } = jsonLd;
        return [node];
    }),
});
